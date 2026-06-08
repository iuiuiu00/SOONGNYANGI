let keys = {};

function keyPressed() {
  if (scene === 'title') {
    handleTitleKeyPressed();
    return false;
  }

  keys[keyCode] = true;

  // ── 신양관 씬 ─────────────────────────────────────────────
  if (scene === 'sinyangkwan') {
    if ((key === 'e' || key === 'E') &&
        !snState.laptopOpen && !snState.doorOpen &&
        !snState.escaped    && !snState.timerDead) {
      const lp = SN_TABLES[1];
      if (abs(snState.catX - (lp.x + lp.w / 2)) < 75) {
        snState.laptopOpen = true;
        snState.curSb      = 'desktop';
        snState.curFolder  = null;
        snState.curFile    = null;
        snState.uiScroll   = 0;
        sn_startTimer();
        return;
      }
      if (abs(snState.catX - (SN_DOOR.x + SN_DOOR.w / 2)) < 60 && snState.hasCode) {
        snState.doorOpen = true;
        snState.input    = '';
        snState.dpMsg    = '';
        return;
      }
    }
    if (key === 'Escape') {
      if (snState.laptopOpen) snState.laptopOpen = false;
      if (snState.doorOpen)   snState.doorOpen   = false;
    }
    return;
  }

  // ── 기존 씬들 ─────────────────────────────────────────────
  if (key === 'R' || key === 'r') {
    if (scene === 'classroom' && clsDead) resetCls();
  }

  if (scene==='corridor' && keyCode===SHIFT && nearDoor && !menuOpen) {
    let rm = rooms[nearDoorIdx];
    
    if (rm.type === 'churu' && !clsKey1Got) return;

    enteredX = rm.x;

    if (rm.type === 'classroom') {
        initCls();
        scene = 'intro_cls';
        seqTimer = 0;
    } else {
        fadingTo = rm.type;
        scene = 'fadeout';
        fadeAlpha = 0;
    } 
  }

  if (scene === 'churu' && (keyCode === ENTER || keyCode === 32)) {
    if (!cAdv) {
        cCi = cLines[cLi].text.length;
        cAdv = true;
        return;
    }

    cLi++;
    cCi = 0;
    cAdv = false;
    cTmr = 0;

    if (cLi === 1) excA = 0;
    if (cLi === 2) churuVis = true;

    if (cLi >= cLines.length) {
        fadingTo = 'corridor';
        scene = 'fadeout';
        fadeAlpha = 0;
    }
  }

  if (scene === 'prof' && (keyCode === ENTER || keyCode === 32)) {
    if (!pAdv) {
        pCi = pLines[pLi].text.length;
        pAdv = true;
        return;
    }

    pLi++;
    pCi = 0;
    pAdv = false;
    pTmr = 0;

    if (pLi >= pLines.length) {
        fadingTo = 'corridor';
        scene = 'fadeout';
        fadeAlpha = 0;
    }
  }

  if (scene === 'intro_story' && (keyCode === ENTER || keyCode === 32)) {
    if (!introAdv) {
        introCi = introLines[introLi].text.length;
        introAdv = true;
        return;
    }

    advanceIntroStory();
  }

  if(scene==='coopsket' && keyCode===SHIFT && !csSP&&!menuOpen) {
    csSP = true;
    handleCsShift();
  }

  if(keyCode===82 && scene==='classroom' && clsDead) {
    resetCls();
  }

  if(keyCode===27) {
    menuOpen = false;
  }

  return false;
}

function mousePressed() {
  if (mouseX>MBX && mouseX<MBX+MBW && mouseY>MBY && mouseY<MBY+MBH && scene !== 'title') {
    menuOpen = !menuOpen;
    return;
  }

  if (menuOpen) {
    let mx = W / 2 - 80, my = H / 2 - 68;

    if (mouseX>mx && mouseX<mx+160 && mouseY>my+16 && mouseY<my+52) {
        menuOpen = false;
    } else if (mouseX>mx && mouseX<mx+160 && mouseY>my+62 && mouseY<my+98) {
        saveGame();
        menuOpen = false;
    } else if (mouseX>mx && mouseX<mx+160 && mouseY>my+108 && mouseY<my+144) {
        menuOpen = false;
        doRestart();
    }
  }

  if (scene === 'title') {
    handleTitleClick();
  }

   // ── 신양관 씬 ─────────────────────────────────────────────
  if (scene === 'sinyangkwan' || scene === 'sn_blackout') {
    if (snState.laptopOpen) { snHandleLaptopClick(mouseX, mouseY); return; }
    if (snState.doorOpen)   { snHandleDoorClick(mouseX, mouseY);   return; }
    return;
  }

  // ── 기존 씬들 ─────────────────────────────────────────────
  if (scene !== 'title') {
    handleMenuClick(mouseX, mouseY);
  }
}

function keyReleased() {
    keys[keyCode] = false;
    
    if (keyCode === SHIFT) {
        csSP = false;
    }
}

// [수정 5] mouseWheel — event.preventDefault() 추가로 브라우저 스크롤 확실히 방지
function mouseWheel(event) {
  if (scene === 'sinyangkwan' && snState.laptopOpen) {
    snState.uiScroll = constrain(snState.uiScroll + event.delta * 0.5, 0, snState.uiScrollMax);
    event.preventDefault();
    return false;
  }
}