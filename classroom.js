let obstacles = []
let spawnTimers = [0,18,36,54];
let clsKeyGot = false;
let clsKeyNoticeTimer = 0;
let clsDead = false;
let clsDeadA = 0;
let clsCleared = false;
let clsClearA = 0;

const cols = [150, 270, 400, 530], objTypes = ['chair', 'chair', 'tile', 'glass'];

function initCls() {
    cat.x = W-40;
    cat.y = clsFloorY - 32;
    cat.vx = 0;
    cat.vy = 0;
    cat.dir = -1;
    
    obstacles = [];
    spawnTimers = [0,18,36,54];
    
    clsDead = false;
    clsDeadA = 0;
    
    clsCleared = false;
    clsClearA = 0;
    
    clsKeyGot = itemHas('key1');
}

function resetCls() {
    cat.x = W-40;
    cat.y = clsFloorY-32;
    cat.vx = 0;
    cat.vy = 0;
    cat.dir = -1;
    obstacles = [];
    spawnTimers = [0,18,36,54];
    clsDead = false;
    clsDeadA = 0;
    if (itemUse('key1')) {
      clsKeyGot = false;
    } else {
      clsKeyGot = itemHas('key1');
    }
}

function drawClassroom(){
  noStroke();
  fill(10,8,6);
  rect(0,0,W,H);
  [18,172,328,484].forEach(wx => {
    const winW = 136, winH = 200, winY = clsCeilY + 6, mx2 = wx + winW / 2, my2 = winY + winH / 2;
    
    fill(30,22,14);
    rect(wx-6,winY-6,winW+12,winH+12);
    
    fill(9,13,20);
    rect(wx,winY,winW/2-2,winH/2-2);
    rect(mx2+2,winY,winW/2-2,winH/2-2);
    rect(wx,my2+2,winW/2-2,winH/2-2);
    rect(mx2+2,my2+2,winW/2-2,winH/2-2);
    
    fill(28,20,12);
    rect(wx,my2-2,winW,4);
    rect(mx2-2,winY,4,winH);
    rect(wx,winY,winW,4);
    rect(wx,winY+winH-4,winW,4);
    rect(wx,winY,4,winH);
    rect(wx+winW-4,winY,4,winH);
    
    fill(18,28,46,160);
    triangle(wx+5,winY+5,wx+28,winY+5,wx+14,winY+26);
    
    fill(42,30,18);
    rect(wx-6,winY-6,winW+12,2);
    rect(wx-6,winY-6,2,winH+12);
});

fill(8,7,6);
rect(0,0,W,clsCeilY);
  
fill(44,44,46);
rect(0,clsCeilY,W,3);

fill(14,10,7);
rect(0,clsFloorY+6,W,H);

fill(44,44,46);
rect(0,clsFloorY,W,3);

const bx = 6, by = clsFloorY-80, bw = 68, bh = 70;
  
fill(38,28,16);
rect(bx,by,10,bh);
rect(bx,by,bw,10);
rect(bx,by+bh-10,bw,10);

fill(205,205,200);
rect(bx+10,by+10,bw-10,bh-20);
  
if(!clsKeyGot) {
    let kx = bx+36, ky = by + bh / 2;
    
    fill(185,160,44);
    rect(kx-8,ky,14,4);
    rect(kx+4,ky,4,3);
    rect(kx+4,ky+4,3,3);
    
    fill(195,170,50);
    rect(kx-10,ky-8,10,10);
    
    fill(205,205,200);
    rect(kx-9,ky-7,8,8);
    
    fill(195,170,50);
    rect(kx-8,ky-6,6,6);
    
    fill(205,205,200);
    rect(kx-7,ky-5,4,4);
  }

  if (clsKeyNoticeTimer > 0) {
    clsKeyNoticeTimer = max(clsKeyNoticeTimer - 1, 0);
    fill(220, 220, 180, map(clsKeyNoticeTimer, 0, 120, 0, 255));
    textSize(12);
    textAlign(CENTER, BOTTOM);
    text('교실 열쇠 획득!', cat.x, clsFloorY - 40);
  }

let dx3 = W-140, dy3 = clsFloorY-42;

fill(44,32,20);
rect(dx3,dy3,112,12,1);

fill(40,29,18);
rect(dx3+10,dy3+12,7,30);
rect(dx3+95,dy3+12,7,30);
rect(dx3+10,dy3+30,92,5);
  
obstacles.forEach(ob => {
    push();
    
    translate(ob.x,ob.y);
    rotate(ob.rot);
    noStroke();
    
    let s = ob.sz;
    
    if(ob.type==='chair') {
        fill(50,36,22);
        rect(-s*.5,-s*.25,s,s*.22);
        rect(-s*.42,0,s*.84,s*.2);
        
        fill(40,28,16);
        rect(-s*.38,s*.2,s*.18,s*.4);
        rect(s*.2,s*.2,s*.18,s*.4);
    } else if(ob.type==='tile') {
        fill(65,65,68);
        rect(-s*.5,-s*.2,s,s*.4,2);

        stroke(38,38,42);
        strokeWeight(1);
        line(0,-s*.2,0,s*.2);

        noStroke();
    } else {
        fill(26,40,62,230);
        triangle(-s*.5,s*.4,s*.5,s*.4,s*.1,-s*.4);

        stroke(55,80,115,200);
        strokeWeight(1.5);
        line(-s*.1,-s*.1,s*.2,s*.2);

        noStroke();
    }

    pop();
 });


 if(clsKeyGot) {
    fill(140,130,100,180);
    textSize(8);
    textFont('monospace');
    textAlign(CENTER,CENTER);
    text('▶',W-14,clsFloorY-20);
 }

  drawCatPixel(cat.x, cat.y, cat.dir, cat.vx, cat.stepT, cat.onGround);
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
    if (itemGain('key1')) {
      clsKeyGot = true;
      clsKeyNoticeTimer = 120;
    }
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