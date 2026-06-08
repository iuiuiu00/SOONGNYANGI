let scene = 'title';
let fadingTo = '';
let fadeAlpha = 0;
let seqTimer = 0;
let clsKey1Used = false;

let sliding = false;
let slideSpeed = 0;
let slideAlpha = 0;

function doRestart() {
  scene = 'title';
  seqTimer = 0;
  clsKey1Used = false;
  
  cat = { x:140, y:floorY-32, vx:0, vy:0, onGround:false, dir:1, stepT:0};
  inventory = [];
  corridorEggCollected = false;
  corridorTextbookCollected = false;
  
  camX = 0; 
  sliding = false;
  menuOpen = false;
}

function saveGame() {
  const save = {
    scene,
    seqTimer,
    fadingTo,
    fadeAlpha,
    clsKey1Used,
    clsDead,
    clsDeadA,
    clsCleared,
    clsClearA,
    sliding,
    slideSpeed,
    slideAlpha,
    camX,
    enteredX,
    cat: {...cat},
    snState: JSON.parse(JSON.stringify(snState)),
    sn_blackoutSeq,
    csHeld,
    csCleared,
    csClearA,
    csSP,
    csItems: csItems.map(item => ({...item})),
    csSlots: csSlots.map(slot => ({...slot})),
    cLi,
    cAdv,
    corridorEggCollected,
    corridorTextbookCollected,
    inventory: [...inventory],
    cTmr,
    churuVis,
    pLi,
    pAdv,
    pTmr,
    endTimer,
    creditSY,
  };

  localStorage.setItem('flare_save', JSON.stringify(save));
  saveMessage = 'SAVE COMPLETE';
  saveNoticeTimer = 120;
}

function loadGame() {
  const raw = localStorage.getItem('flare_save');
  if (!raw) return false;

  let save;
  try {
    save = JSON.parse(raw);
  } catch {
    return false;
  }

  scene = save.scene || 'title';
  seqTimer = save.seqTimer || 0;
  fadingTo = save.fadingTo || '';
  fadeAlpha = save.fadeAlpha || 0;
  clsKey1Used = save.clsKey1Used !== undefined ? !!save.clsKey1Used : !!save.clsKey1Got;
  clsDead = !!save.clsDead;
  clsDeadA = save.clsDeadA || 0;
  clsCleared = !!save.clsCleared;
  clsClearA = save.clsClearA || 0;
  sliding = !!save.sliding;
  slideSpeed = save.slideSpeed || 0;
  slideAlpha = save.slideAlpha || 0;
  camX = save.camX || 0;
  enteredX = save.enteredX === undefined ? rooms[0].x : save.enteredX;

  Object.assign(cat, save.cat || { x:140, y:floorY-32, vx:0, vy:0, onGround:false, dir:1, stepT:0 });
  snState = save.snState || snState;
  sn_blackoutSeq = save.sn_blackoutSeq || 0;
  csHeld = save.csHeld || null;
  csCleared = !!save.csCleared;
  csClearA = save.csClearA || 0;
  csSP = !!save.csSP;

  if (save.csItems) {
    csItems.forEach((item, i) => {
      if (save.csItems[i]) Object.assign(item, save.csItems[i]);
    });
  }

  if (save.csSlots) {
    csSlots.forEach((slot, i) => {
      if (save.csSlots[i]) slot.filled = save.csSlots[i].filled;
    });
  }

  corridorEggCollected = !!save.corridorEggCollected;
  corridorTextbookCollected = !!save.corridorTextbookCollected;
  inventory = Array.isArray(save.inventory) ? [...save.inventory] : [];

  cLi = save.cLi || 0;
  cAdv = !!save.cAdv;
  cTmr = save.cTmr || 0;
  churuVis = !!save.churuVis;
  pLi = save.pLi || 0;
  pAdv = !!save.pAdv;
  pTmr = save.pTmr || 0;
  endTimer = save.endTimer || 0;
  creditSY = save.creditSY || creditSY;

  menuOpen = false;
  saveMessage = 'CONTINUE LOADED';
  saveNoticeTimer = 120;

  if (scene === 'sinyangkwan' && snState.timerStarted && !sn_timerIv) {
    sn_startTimer();
  }

  return true;
}