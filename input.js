let keys = {};

function keyPressed() {
  keys[keyCode] = true;

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

function keyReleased() {
    keys[keyCode] = false;
    
    if (keyCode === SHIFT) {
        csSP = false;
    }
}

function mousePressed() {
  if (mouseX>MBX && mouseX<MBX+MBW && mouseY>MBY && mouseY<MBY+MBH && ['corridor','classroom','coopsket'].includes(scene)) {
    menuOpen = !menuOpen;
    return;
  }

  if (menuOpen) {
    let mx = W / 2 - 80, my = H / 2 - 55;
     
    if (mouseX>mx && mouseX<mx+160 && mouseY>my+16 && mouseY<my+52) {
        menuOpen = false;
    } else if (mouseX>mx && mouseX<mx+160 && mouseY>my+62 && mouseY<my+98) {
        menuOpen = false;
        doRestart();
    }
  }
}

function handleCsShift() {
  if (csHeld !== null) {
    let item = csItems.find(i => i.id === csHeld);

    if (cat.x>csCX-25 && cat.x<csCX+csCW+25) {
      let slot = csSlots.find(s => s.id === item.id && !s.filled) || csSlots.find(s => !s.filled);
      
      if (slot) {
        item.x = slot.x;
        item.y = slot.y;
        item.onCash = true;
        slot.filled = true;
      } else { 
        item.x = cat.x + (cat.dir > 0 ? 18 : -18);
        item.y = cat.y + 10;
        item.onCash = false;

      }
    } else {
        item.x = cat.x + (cat.dir > 0 ? 18 : -18);
        item.y = cat.y + 10;
        item.onCash = false;
        
        csSlots.forEach(s => {
            if (s.id === item.id) {
                s.filled = false;
            }
        });
    }

    csHeld = null;

    if (csItems.find(i => i.id === 'A' && i.onCash) && csItems.find(i => i.id === 'D' && i.onCash)) {
        csCleared = true;
    }
  } else {
    let closest = null, minD = 55;

    csItems.forEach(item => {
        let d = dist(cat.x, cat.y + 14, item.x, item.y);

        if (d < minD) {
            minD = d;
            closest = item;
        }
    });

    if (closest) {
        if (closest.onCash) {
            let slot = csSlots.find(s => s.id === closest.id);

            if (slot) {
                slot.filled = false;
            }
             
            closest.onCash = false;
        }

        csHeld = closest.id;
    }
  }
}