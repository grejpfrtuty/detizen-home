"use strict";
/* Detizen Home - usluga TizenBrew.
 * Dziala w trwalej usludze TizenBrew (kontekst Tizena z dostepem do `tizen`),
 * ktorej Samsung nie zamraza. Gdy pojawi sie ekran glowny Samsunga, otwiera Detizen.
 * Uzywa wylacznie publicznego API tizen.application. Nie zmienia zadnych ustawien.
 */
var APP = 'DeTizenHm1.Detizen';

function isHome(id) {
  if (!id || id === APP) return false;
  if (id === 'com.samsung.tv.csfs' || id === 'org.tizen.menu') return true;
  return id.indexOf('.home.') >= 0 || id.indexOf('newhome') >= 0 || id.indexOf('plateauhome') >= 0
    || id.indexOf('edenview') >= 0 || id.indexOf('floating-menu') >= 0 || /(^|\.)home($|\.)/.test(id);
}

var lastLaunch = 0, suppressUntil = 0;
function bringBack() {
  try { tizen.application.launch(APP, function () {}, function () {}); } catch (e) {}
}
function onStatus(id, active) {
  try {
    if (!active || !isHome(id)) return;
    var now = Date.now();
    if (now < suppressUntil) return;           /* chwilowo odpuszczamy (podwojne Home) */
    if (now - lastLaunch < 4000) { suppressUntil = now + 30000; return; }
    lastLaunch = now;
    setTimeout(bringBack, 350);                /* niech ekran Samsunga sie ustabilizuje */
  } catch (e) {}
}

try { tizen.application.addAppStatusChangeListener(onStatus); } catch (e) {}

/* TEST: po 20 s raz otworz Detizen, zeby potwierdzic ze usluga umie uruchamiac aplikacje.
 * Gdy potwierdzimy, ze dziala, usuniemy te linie. */
try { setTimeout(bringBack, 20000); } catch (e) {}
