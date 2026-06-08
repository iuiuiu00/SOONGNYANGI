const walls = [
    {x: startX},
    {x: startX + wallW + roomW},
    {x: startX + wallW*2 + roomW*2},
    {x: startX + wallW*3 + roomW*3}
];
const rooms = [
  {x: startX + wallW + roomW*0.65, w:44, h:92, type:'classroom'},
  {x: startX + wallW*2 + roomW + roomW*0.65, w:44, h:92, type:'churu'},
  {x: startX + wallW*3 + roomW*2 + roomW*0.65, w:44, h:92, type:'prof'},
];

const wins_c = [
  {x: startX + wallW + 14, y: ceilBase + 48, w:100, h:36},
  {x: startX + wallW*2 + roomW + 14, y: ceilBase + 48, w:100, h:36},
  {x: startX + wallW*3 + roomW*2 + 14, y: ceilBase + 48, w:100, h:36},
];

const pit = {x: startX + wallW*3 + roomW*3 + 120, w:80};

let camX = 0;

let nearDoor = false;
let nearDoorIdx = -1;

let corridorEggCollected = false;
let corridorEggNoticeTimer = 0;

let enteredX = rooms[0].x;

function drawCorridor() {
  push();
  translate(-camX, 0);
  noStroke();
  
  fill(0);
  rect(0,0,CW,H);

  walls.forEach((w,i) => {
    if (i < walls.length - 1) {
      let rx = w.x + wallW, rw = walls[i+1].x - rx;
      
      fill(20,14,10);
      rect(rx, ceilBase, rw, floorY-ceilBase);
      
      fill(26,18,12);
      rect(rx, floorY-TILE, rw, TILE);
    }
  });

  for (let tx = 0; tx < ceil(CW/TILE); tx++) {
    let wx = tx*TILE, cy2 = ceilBase + ceilProfile[tx];
    
    fill(8,8,8);
    rect(wx,0,TILE,cy2);
  }

  walls.forEach(w => {
    fill(12,12,12);
    rect(w.x, ceilBase, wallW, floorY-ceilBase);
    
    fill(36,36,38);
    rect(w.x, ceilBase, 1, floorY-ceilBase);
    rect(w.x + wallW - 1, ceilBase, 1, floorY-ceilBase);
  });

  fill(52,52,55);
  rect(0,ceilBase,CW,3);
  
  fill(28,28,30);
  rect(0, ceilBase+3, CW, 2);

  fill(52,52,55);
  rect(0, floorY, CW, 3);
  
  fill(28,28,30);
  rect(0, floorY+3, CW, 3);
  
  fill(10,10,10);
  rect(0, floorY+6, CW, H);

  wins_c.forEach(w => {
    fill(28,20,14);
    rect(w.x - 4, w.y - 4, w.w + 8, w.h + 8);
    
    fill(8,14,22);
    rect(w.x, w.y, w.w, w.h);
    
    fill(28,20,14);
    rect(w.x, w.y + w.h / 2 - 1, w.w, 2);
    rect(w.x + w.w / 2 - 1, w.y , 2, w.h);
  });

  rooms.forEach((rm,i) => {
    let dx2 = rm.x - rm.w / 2, dy2 = floorY - rm.h, locked = (rm.type === 'churu' && !clsKey1Got);

    fill(2,1,1);
    rect(dx2, dy2, rm.w, rm.h);
    
    fill(44,33,22);
    rect(dx2 - 3, dy2 - 2, rm.w + 6, 3);
    rect(dx2 - 3, dy2, 3, rm.h);
    rect(dx2 + rm.w, dy2, 3, rm.h);

    fill(locked ? color(28,20,14) : color(38,28,18));
    rect(dx2 + 1, dy2 + 1, rm.w - 2, rm.h - 1);

    fill(110,96,58);
    rect(dx2 + rm.w - 12, dy2 + rm.h * 0.46, 3, 8);

    if (locked) {
      fill(140,122,42);
      rect(dx2 + rm.w / 2 - 3, dy2 + rm.h * 0.3, 7, 8);

      noFill();
      stroke(140,122,42);
      strokeWeight(2);

      arc(dx2 + rm.w / 2, dy2 + rm.h*0.3, 7, 7, PI, TWO_PI);

      noStroke();
    }

    if (nearDoor && nearDoorIdx === i) {
      noFill();
      stroke(140,130,100,160);
      strokeWeight(1);

      rect(dx2 - 4, dy2 - 3, rm.w + 8, rm.h +3 );

      noStroke();
    }
  });

  if (nearDoor) {
    let rm = rooms[nearDoorIdx], locked = (rm.type === 'churu' && !clsKey1Got);
     
    fill(170,160,130,200);
    textSize(9);
    textFont('monospace');
    textAlign(CENTER,CENTER);

    text(locked ? '[잠김]' : '[SHIFT] 입장', rm.x, floorY - rm.h - 16);
  }

  fill(52,52,55);
  rect(pit.x, floorY, pit.w, 3);

  fill(28,28,30);
  rect(pit.x, floorY+3, pit.w, 3);

  fill(0,0,0);
  rect(pit.x, floorY+6, pit.w, H);

  if (!corridorEggCollected) {
    const eggX = 150;
    const eggY = floorY - 24;

    // Draw plushie as two white circles (body + head) to match inventory icon
    noStroke();
    fill(255);
    // body (slightly smaller than main cat)
    ellipse(eggX, eggY, 22, 18);
    // head
    ellipse(eggX, eggY - 12, 16, 16);
    // no facial features: keep as plain white plushie (head + body)
  }

  if (!corridorEggCollected && abs(cat.x - 150) < 24 && cat.onGround) {
    if (itemGain('plushie')) {
      corridorEggCollected = true;
      corridorEggNoticeTimer = 120;
    }
  }

  if (corridorEggNoticeTimer > 0) {
    corridorEggNoticeTimer = max(corridorEggNoticeTimer - 1, 0);
    fill(220, 220, 180, map(corridorEggNoticeTimer, 0, 120, 0, 255));
    textSize(12);
    textAlign(CENTER, BOTTOM);
    text('슝슝이 인형 획득!', cat.x, floorY - 40);
  }

  drawCatPixel(cat.x, cat.y, cat.dir, cat.vx, cat.stepT, cat.onGround);

  pop();
}

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

function initCorReturn() {
    cat.x = enteredX;
    cat.y = floorY-32;
    cat.vx = 0;
    cat.vy = 0;
    cat.dir = -1;
    cat.onGround = true;
    camX = constrain(cat.x - W/2, 0, CW - W);
    sliding = false;
}