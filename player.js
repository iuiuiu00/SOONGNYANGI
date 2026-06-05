let cat = { x:140, y:floorY-32, vx:0, vy:0, onGround:false, dir:1, stepT:0 };

function updateCorridor() {
  if (keys[65]) {
    cat.vx = -2.8;
    cat.dir = -1;
  } else if(keys[68]) {
    cat.vx = 2.8;
    cat.dir = 1;
  } else {
    cat.vx *= 0.5;
  }

  if ((keys[87] || keys[32]) && cat.onGround) {
    cat.vy = -9.5;
    cat.onGround = false;
  }

  cat.vy = min(cat.vy + 0.5, 14);
  cat.x += cat.vx;
  cat.y += cat.vy;
  cat.x = constrain(cat.x, 10, CW-10);

  let onPit = cat.x + 8 > pit.x && cat.x - 8 < pit.x + pit.w;

  if (cat.y + 32 >= floorY && !onPit) {
    cat.y = floorY - 32;
    cat.vy = 0;
    cat.onGround = true;
  } else if(onPit && cat.y + 32 > floorY+20) {
    sliding = true;
    slideSpeed = 6;
    slideAlpha = 0;
    cat.vy = 0;
  } else if(!(cat.y + 32 >= floorY)) {
    cat.onGround = false;
  }

  let cy  =getCeilY(cat.x);
  
  if(cat.y < cy) {
    cat.y = cy;
    cat.vy = 0;
  }

  if(abs(cat.vx) > 0.3 && cat.onGround) {
    cat.stepT += 0.28; 
  }

  nearDoor = false;
  nearDoorIdx = -1;

  rooms.forEach((rm,i) => {
    if(abs(cat.x - rm.x) < 38 && cat.onGround) {
      nearDoor = true;
      nearDoorIdx = i;
    }
  });
}

function updateSlide() {
  slideSpeed += 0.5;
  cat.x += slideSpeed;
  cat.y += 1.5;
  slideAlpha = min(slideAlpha + 5, 255);
  
  if (slideAlpha >= 255) {
    scene = 'pit_exclaim';
    seqTimer = 0;
    sliding = false;
  }
}

function updateCls() {
  if (keys[65]) {
    cat.vx = -2.6;
    cat.dir = -1;
  } else if(keys[68]) {
    cat.vx = 2.6;
    cat.dir = 1;
  } else {
    cat.vx *= 0.5;
  }

  if ((keys[87] || keys[32]) && cat.onGround) {
    cat.vy = -9;
    cat.onGround = false;
  }

  cat.vy = min(cat.vy + 0.5, 12);
  cat.x += cat.vx;
  cat.y += cat.vy;
  cat.x = constrain(cat.x, 10, W-10);

  if (cat.y + 32 >= clsFloorY) {
    cat.y = clsFloorY-32;
    cat.vy = 0;
    cat.onGround = true;
  } else {
    cat.onGround = false;
  }

  if (cat.y < clsCeilY) {
    cat.y = clsCeilY;
    cat.vy = 0;
  }

  if (abs(cat.vx) > 0.3 && cat.onGround) {
    cat.stepT += 0.28;
  }

  if (!clsKeyGot && cat.x < 80 && cat.y > clsFloorY - 80) {
    clsKeyGot = true;
    clsKey1Got = true;
  }

  if (clsKeyGot && cat.x > W-25 && !clsCleared) {
    clsCleared = true;
  }

  for (let i = 0; i < 4; i++) {
    spawnTimers[i]--;

    if (spawnTimers[i] <= 0) {
      let sz = objTypes[i] === 'glass' ? 38 : objTypes[i] === 'tile' ? 42 : 36;
      
      obstacles.push({
        x: cols[i] + random(-10, 10),
        y: clsCeilY + 10,
        type: objTypes[i],
        vy: random(2.2, 3.2),
        rot: random(-0.15, 0.15),
        sz
      });

      spawnTimers[i] = floor(random(40, 70));
    }
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    let ob = obstacles[i];

    ob.y += ob.vy;

    if (ob.y > clsFloorY + 40) {
      obstacles.splice(i, 1);
      continue;
    }

    if (!clsDead && cat.x + 10 > ob.x - ob.sz / 2 && cat.x - 10 < ob.x + ob.sz / 2 && cat.y + 4 > ob.y - ob.sz / 2 && cat.y + 30 < ob.y + ob.sz) {
      clsDead = true;
    }
  }
}

function updateCs() {
  let spd = csHeld ? 1.3 : 2.6;

  if (keys[65]) {
    cat.vx = -spd;
    cat.dir = -1;
  } else if(keys[68]) {
    cat.vx = spd;
    cat.dir = 1;
  } else {
    cat.vx *= 0.5;
  }

  if((keys[87] || keys[32]) && cat.onGround) {
    cat.vy = -8.5;
    cat.onGround = false;
  }

  cat.vy = min(cat.vy + 0.45, 12);
  cat.x += cat.vx;
  cat.y += cat.vy;
  cat.x = constrain(cat.x, 10, W-10);

  cat.onGround = false;

  csPl.forEach(pl => {
    if (cat.x + 6> pl.x1 && cat.x - 6 < pl.x2 && cat.y + 28 >= pl.y && cat.y + 28 <= pl.y + 16 && cat.vy >= 0) {
      cat.y = pl.y - 28;
      cat.vy = 0;
      cat.onGround = true;
    }
  });

  if (abs(cat.vx) > 0.3 && cat.onGround) {
    cat.stepT += 0.28;
  }

  if (csHeld) {
    let item = csItems.find(i => i.id === csHeld);
    item.x = cat.x + cat.dir*10;
    item.y = cat.y - 2;
  }
}