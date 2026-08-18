/* Accounts + cloud sync (v1.4). Optional and offline-first:
   - if config/library are absent, window.VBSync stays null and the app is pure v1.3
   - local progress is always the working copy; the cloud is a merge target
   - merge is last-write-wins per card using each card's `ua` (updated-at, ms)
   The app talks to this via window.VBApp (set in app.js): {merge, snapshot, onAuth, toast}. */
(function(){
  var cfg = window.VB_CONFIG || {};
  if(!cfg.supabaseUrl || !cfg.supabaseKey || !window.supabase || !window.supabase.createClient){
    window.VBSync = null; return;             // accounts disabled -> app behaves as v1.3
  }
  var client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
    auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:true }
  });
  var user = null, dirty = {}, pushTimer = null, syncing = false;

  function rowsFromDirty(){
    if(!user) return [];
    var cards = window.VBApp.snapshot(), out = [];
    Object.keys(dirty).forEach(function(id){
      var c = cards[id]; if(!c) return;
      out.push({ user_id:user.id, card_id:id, box:c.box|0, abox:c.abox|0,
        due:c.due|0, seen:!!c.seen, updated_at:new Date(c.ua||Date.now()).toISOString() });
    });
    return out;
  }
  function flush(){
    var rows = rowsFromDirty(); dirty = {};
    if(!rows.length) return Promise.resolve();
    return client.from("progress").upsert(rows, { onConflict:"user_id,card_id" })
      .then(function(r){ if(r.error) console.warn("sync push:", r.error.message); })
      .catch(function(e){ console.warn("sync push failed:", e && e.message); });
  }
  function scheduleFlush(){ clearTimeout(pushTimer); pushTimer = setTimeout(flush, 1500); }

  // pull remote, merge into local (LWW), push whatever is locally newer/missing
  function fullSync(){
    if(!user || syncing) return Promise.resolve();
    syncing = true;
    return client.from("progress").select("*").then(function(res){
      if(res.error){
        syncing = false;
        if(/schema cache|does not exist/i.test(res.error.message||""))
          window.VBApp.toast("Cloud-Tabelle fehlt — SQL noch ausführen");
        else console.warn("sync pull:", res.error.message);
        return;
      }
      var toPush = window.VBApp.merge(res.data||[]);   // app merges + persists + re-renders
      var rows = toPush.map(function(x){ x.user_id = user.id; return x; });
      var p = rows.length ? client.from("progress").upsert(rows,{onConflict:"user_id,card_id"}) : Promise.resolve({});
      return Promise.resolve(p).then(function(r){
        if(r && r.error) console.warn("sync push(all):", r.error.message);
        window.VBApp.toast("Fortschritt synchronisiert ☁️");
      });
    }).catch(function(e){ console.warn("sync failed:", e && e.message); })
      .then(function(){ syncing = false; });
  }

  function handleAuth(session){
    user = session && session.user ? session.user : null;
    if(!window.VBApp) return;                 // bridge not ready yet
    window.VBApp.onAuth(user ? (user.email || "") : null);
    if(user){
      client.from("profiles").upsert({ id:user.id, email:user.email }).then(function(){}, function(){});
      fullSync();
    }
  }

  window.VBSync = {
    ready:true,
    dirty: function(id){ if(user){ dirty[id]=1; scheduleFlush(); } },
    signIn: function(email){
      return client.auth.signInWithOtp({ email:email,
        options:{ emailRedirectTo: location.href.split("#")[0] } });
    },
    signOut: function(){ return client.auth.signOut(); },
    sync: fullSync,
    // called by app.js AFTER window.VBApp is set: wire the listener + restore session
    start: function(){
      client.auth.onAuthStateChange(function(_event, session){ handleAuth(session); });
      client.auth.getSession().then(function(res){
        handleAuth(res && res.data ? res.data.session : null);
      });
    }
  };
})();
