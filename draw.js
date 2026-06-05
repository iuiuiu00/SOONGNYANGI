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

  drawCatPixel(cat.x,cat.y);
}

function drawCoopsket() {
  background(188,186,183);
  
  noStroke();
  
  for(let y=0;y<H*0.5;y++) {
    fill(202,200,197,map(y,0,H*0.5,70,0));
    rect(0,y,W,1);
 }

 for(let x=0;x<120;x++) {
    fill(215,213,210,map(x,0,120,55,0));
    rect(x,0,1,H);
 }

 fill(165,163,160,75);
 
 [100,220,380,520].forEach(bx => {
    rect(bx-1,H*0.55,3,H*0.45);
 });

 const D = color(18,16,15), D2 = color(32,29,27);
 
 fill(D);
 rect(0,0,csBX,H);
 
 fill(D2);
 rect(csBX-4,0,4,H);

 const BC = [85,110,145], BDK = [60,85,115], BLT = [105,130,165], rowH = 18;
  
 for(let r=0;r*rowH<csGY-csBTY;r++) {
    let ry = csBTY+r*rowH, rh = min(rowH,csGY-ry);
    
    fill(BC[0],BC[1],BC[2]);
    rect(csBX,ry,csBW,rh);
    
    fill(BLT[0],BLT[1],BLT[2]);
    rect(csBX,ry,csBW,3);
    
    fill(BDK[0],BDK[1],BDK[2]);
    rect(csBX,ry+rh-3,csBW,3);
    
    fill(BDK[0]-10,BDK[1]-10,BDK[2]-10);
    
    for(let s=0;s<4;s++) {
        rect(csBX+6+s*(csBW-12)/3, ry+4, 4, rh-8);
    }
    
    if(r%2===0) {
        fill(130,155,190,110);
        rect(csBX+8,ry+6,csBW-16,3);
    }
 }
  
 fill(BDK[0],BDK[1],BDK[2]);
 rect(csBX-4,csBTY,4,csGY-csBTY);

 fill(D);
 rect(csS1X,csS1Y,csS1W,csGY-csS1Y);
 
 fill(D2);
 
 [0,26,52,78].forEach(off => {
    rect(csS1X, csS1Y+off, csS1W, 5);
 });

 fill(D);
 rect(csS1X-5,csS1Y,5,csGY-csS1Y);
 rect(csS1X+csS1W,csS1Y,5,csGY-csS1Y);
  
 let ax = csS1X+csS1W, ay = csS1Y, bx2 = csS2X, by2 = csS2Y;
 
 fill(D);
 
 beginShape();
 vertex(ax,ay);
 vertex(bx2,by2);
 vertex(bx2,by2+8);
 vertex(ax,ay+8);
 endShape(CLOSE);
 
 fill(D2);
 
 beginShape();
 vertex(ax,ay);
 vertex(bx2,by2);
 vertex(bx2,by2+3);
 vertex(ax,ay+3);
 endShape(CLOSE);
  
 fill(D);
 rect(csS2X,csS2Y,csS2W,csGY-csS2Y);
 
 fill(D2);
 
 [0,26,52,78].forEach(off => {
    rect(csS2X,csS2Y+off,csS2W,5);
 });
 
 fill(D);
 rect(csS2X-5,csS2Y,5,csGY-csS2Y);
 rect(csS2X+csS2W,csS2Y,5,csGY-csS2Y);

 let cx3 = csS2X+csS2W, cy3 = csS2Y, dx3 = csCX, dy3 = csCY;
 
 fill(D);
 
 beginShape();
 vertex(cx3,cy3);
 vertex(dx3,dy3);
 vertex(dx3,dy3+8);
 vertex(cx3,cy3+8);
 endShape(CLOSE);
 
 fill(D2);
 beginShape();
 vertex(cx3,cy3);
 vertex(dx3,dy3);
 vertex(dx3,dy3+3);
 vertex(cx3,cy3+3);
 endShape(CLOSE);
  
 fill(D);
 rect(csCX,csCY,csCW,csGY-csCY);
 
 fill(D2);
 rect(csCX,csCY,csCW,6);
 
 fill(200,195,185);
 textSize(9);
 textAlign(CENTER,CENTER);
 text('CASHIER',csCX+csCW/2,csCY+16);
  
 fill(D);
 rect(csEX,0,W-csEX,H);
 
 fill(D2);
 rect(csEX,0,4,H);
 
 fill(D);
 rect(0,csGY,W,H-csGY);
  
 csSlots.forEach(slot => {
    if(slot.filled) return;
    
    let sw = 20, sh = 22, sx = slot.x-sw/2, sy = slot.y-sh/2;
    
    noFill();
    stroke(175,170,162,190);
    strokeWeight(1);
    
    drawingContext.setLineDash([3,3]);
    rect(sx,sy,sw,sh,2);
    drawingContext.setLineDash([]);
    
    noStroke();
 });
   
 csItems.forEach(item => {
    if(item.id===csHeld) return;
    
    drawCsItem(item.x,item.y,item);
 });

 if(csHeld) {
    let item = csItems.find(i => i.id===csHeld);
    drawCsItem(item.x, item.y-8, item);
 }
  
 drawCatPixel(cat.x,cat.y);

 if(csHeld) {
    noSmooth();
    
    fill(18,16,15,140);
    rect(W/2-50,8,100,20,2);

    fill(180,175,165);
    textSize(9);
    textFont('monospace');
    textAlign(CENTER,CENTER);
    text('SHIFT: 내려놓기',W/2,18);
 }
}

function drawCredits(){
  let y = creditSY;

  for(let item of credits) {
    switch(item.t) {

      case 'title':
        fill(255);
        textSize(32);
        textAlign(CENTER,CENTER);
        text(item.x,W/2,y);
        y += 48;
        break;

      case 'subtitle':
        fill(100);
        textSize(11);
        textAlign(CENTER,CENTER);
        text(item.x.toUpperCase(),W/2,y);
        y += 60;
        break;

      case 'name':
        stroke(50);
        strokeWeight(0.5);
        line(W/2-80,y-8,W/2+80,y-8);

        noStroke();
        fill(255);
        textSize(18);
        textAlign(CENTER,CENTER);
        text(item.x,W/2,y+10);

        y += 36;
        break;

      case 'category':
        noStroke();
        fill(80);
        textSize(10);
        textAlign(CENTER,CENTER);
        text(item.x.toUpperCase(),W/2,y);

        y += 20;
        break;

      case 'task':
        noStroke();
        fill(180);
        textSize(13);
        textAlign(CENTER,CENTER);
        text(item.x,W/2,y);

        y += 28;
        break;

      case 'spacer':
        y += 40;
        break;

      case 'fin':
        noStroke();
        fill(80);
        textSize(13);
        textAlign(CENTER,CENTER);
        text(item.x,W/2,y);
        y += 36;
        break;

      case 'special':
        noStroke();
        fill(60);
        textSize(11);
        textAlign(CENTER,CENTER);
        text(item.x.toUpperCase(),W/2,y);

        y += 30;
        break;
    }
  }
}

function getCreditH() {
    let t = 0;
    
    for(let item of credits) {
        switch(item.t) {
            
            case 'title':
                t += 48;
                break;
                
            case 'subtitle':
                t += 60;
                break;
                
            case 'name':
                t += 36;
                break;
                
            case 'category':
                t += 20;
                break;
                
            case 'task':
                t += 28;
                break;
                
            case 'spacer':
                t += 40;
                break;
            
            case 'fin':
                t += 36;
                break;
                
            case 'special':
                t += 30;
                break;
        }
    }
    
    return t;
}

function drawCsItem(x,y,item) {
    noStroke();
    
    let c = item.col;
    
    if(item.id==='A') {
        
        fill(c[0],c[1],c[2],220);
        rect(x-4,y,8,13,1);
        
        fill(c[0]+30,c[1]+30,c[2]+20,180);
        rect(x-3,y+1,4,5);
        
        fill(160,160,170);
        rect(x-2,y-3,5,4,1);
    
    } else if(item.id==='B') {
        
        fill(c[0],c[1],c[2],220);
        rect(x-4,y,8,13,1);
        
        fill(c[0]+20,c[1],c[2]);
        rect(x-4,y,8,5);
        
        fill(180,180,180);
        rect(x-3,y-2,6,3,1);

    } else if(item.id==='C') {
        
        fill(c[0],c[1],c[2],200);
        triangle(x,y-2,x-7,y+13,x+7,y+13);

        fill(25,25,25);
        rect(x-7,y+7,14,4);
        
        fill(240,238,225);
        triangle(x,y+1,x-4,y+11,x+4,y+11);
    
    } else if(item.id==='D') {
        
        fill(c[0],c[1],c[2],220);
        rect(x-4,y,8,13,1);

        fill(c[0]+20,c[1]+20,0);
        rect(x-4,y,8,5);
        
        fill(c[0],c[1]-20,0,180);
        ellipse(x,y+9,6,5);
    
    } else if(item.id==='E') {
        
        fill(c[0],c[1],c[2],220);
        rect(x-5,y+3,10,10,1);
        
        fill(220,180,30);
        rect(x-5,y+3,10,4);
        
        fill(200,195,180);
        rect(x-4,y-2,8,6,1);
    }
}

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

  drawCatPixel(cat.x, cat.y);

  pop();
}

function drawCatBack(cx,cy) {
  const P = 8;
  
  noStroke();
  fill(55,52,60);
  
  [
    { y:0, x:-5, w:10 },
    { y:-1, x:-6, w:12},
    { y:-2, x:-6, w:12},
    { y:-3, x:-6, w:12},
    { y:-4, x:-6, w:12},
    { y:-5, x:-5, w:10},
    { y:-6, x:-5, w:10},
    { y:-7, x:-5, w:10},
    { y:-8, x:-5, w:10},
    { y:-9, x:-5, w:10},
    { y:-10, x:-4, w:8},
    { y:-11, x:-4, w:8},
    { y:-12, x:-3, w:6},
    { y:-13, x:-3, w:6},
    { y:-14, x:-2, w:4}
  ].forEach(r => rect(cx + r.x * P, cy + r.y * P, r.w * P, P));
  
  rect(cx - 4*P, cy - 14*P, 2*P, P);
  rect(cx - 4*P, cy - 15*P, P, P);

  rect(cx + 2*P, cy - 14*P, 2*P, P);
  rect(cx + 2*P, cy - 15*P, P, P);

  rect(cx + 6*P, cy - 1*P, 2*P, P);
  rect(cx + 7*P, cy - 3*P, 2*P, P);
  rect(cx + 8*P, cy - 5*P, 2*P, P);
  rect(cx + 8*P, cy - 7*P, 2*P, P);
  rect(cx + 7*P, cy - 8*P, 2*P, P);
  rect(cx + 6*P, cy - 9*P, 2*P, P);
}

function drawCatPixel(wx,wy) {
  let cx = round(wx), cy = round(wy);
  let d = cat.dir, walk = cat.onGround && abs(cat.vx) > 0.3, lf = floor(cat.stepT) % 2;
  const held = scene === 'coopsket' ? csHeld : null;

  noStroke();

  fill(158,152,144);

  if (d === 1) {
    rect(cx-14, cy+17, 6, 3);
    rect(cx-10, cy+13, 4, 4);
    rect(cx-7, cy+8, 3, 5);
  } else {
    rect(cx+8, cy+17, 6, 3);
    rect(cx+6, cy+13, 4, 4);
    rect(cx+4, cy+8, 3, 5);
  }

  fill(188,182,172);
  rect(cx-8, cy+10, 16, 12);

  fill(202,196,188);
  rect(cx-5, cy+13, 10, 7);

  if (held) {
    fill(175,169,160);
    rect(cx + d*5, cy + 4, 5, 3);
    rect(cx + d*8, cy + 2, 4, 3);
  }
  fill(188,182,172);
  rect(cx - 5 + d*3, cy + 2, 11, 9);

  rect(cx - 3 + d*3, cy-4, 3, 5);
  rect(cx + 2 + d*3, cy-3, 3, 4);

  fill(215, 155, 155);
  rect(cx - 2 + d*3, cy - 3, 2, 3);
  rect(cx + 3 + d*3, cy - 2, 2, 3);

  fill(18, 18, 20);
  rect(cx + 4*d + d*3, cy + 4, 2, 2);

  fill(145, 140, 132);
  rect(cx + 6*d + d*3, cy + 5, 5, 1);
  rect(cx + 6*d + d*3, cy + 7, 4, 1);

  fill(175, 169, 160);

  if (!cat.onGround) {
    rect(cx-5, cy+22, 4, 4);
    rect(cx+2, cy+22, 4, 4);
  } else if (walk && lf === 0) {
    rect(cx-5, cy+22, 4, 5);
    rect(cx+2, cy+22, 4, 7);
  } else {
    rect(cx-5, cy+22, 4, 7);
    rect(cx+2, cy+22, 4, 5);
  }
}