const csGY = 420, csBTY = 200, csS1Y = 270, csS2Y = 310, csCY = 345;
const csBX = 20, csBW = 80, csS1X = 130, csS1W = 160, csS2X = 360, csS2W = 180, csCX = 570, csCW = 100, csEX = csCX + csCW;
const csSlots=[
    {id:'A', x:csCX+22, y:csCY-28, filled:false},
    {id:'D', x:csCX+68, y:csCY-28, filled:false}
];
const csItems=[
  {id:'A', col:[80,140,210], x:csS1X+30, y:csS1Y-16, onCash:false},
  {id:'B', col:[180,30,30], x:csS1X+90, y:csS1Y-16, onCash:false},
  {id:'C', col:[100,170,80], x:csS2X+30, y:csS2Y-16, onCash:false},
  {id:'D', col:[220,130,20], x:csS2X+90, y:csS2Y-16, onCash:false},
  {id:'E', col:[210,70,30], x:csS2X+150, y:csS2Y-16, onCash:false},
];

let csHeld = null, csCleared = false, csClearA = 0, csSP = false;

const csPl = [
    {x1:csBX, x2:csBX+csBW, y:csBTY},
    {x1:csS1X, x2:csS1X+csS1W, y:csS1Y},
    {x1:csS2X, x2:csS2X+csS2W, y:csS2Y},
    {x1:csCX, x2:csCX+csCW, y:csCY},
    {x1:0, x2:W, y:csGY},
    ...mkDiag(csS1X+csS1W, csS1Y, csS2X, csS2Y, 20),
    ...mkDiag(csS2X+csS2W, csS2Y, csCX, csCY, 16)
];

function initCs() {
    cat.x = csBX + csBW/2;
    cat.y = csBTY - 28;
    cat.vx = 0;
    cat.vy = 0;
    cat.dir = 1;
    cat.onGround = false;
    csHeld = null;
    csCleared = false;
    csClearA = 0;
    csSP = false;
    csSlots.forEach(s => s.filled = false);
    csItems[0].x = csS1X + 30;
    csItems[0].y = csS1Y - 16;
    csItems[0].onCash = false;

    csItems[1].x = csS1X + 90;
    csItems[1].y = csS1Y - 16;
    csItems[1].onCash = false;

    csItems[2].x = csS2X + 30;
    csItems[2].y = csS2Y - 16;
    csItems[2].onCash = false;

    csItems[3].x = csS2X + 90;
    csItems[3].y = csS2Y - 16;
    csItems[3].onCash = false;

    csItems[4].x = csS2X + 150;
    csItems[4].y = csS2Y - 16;
    csItems[4].onCash = false;
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
  
 drawCatPixel(cat.x, cat.y, cat.dir, cat.vx, cat.stepT, cat.onGround);

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

function handleCsShift() {
  if (csHeld !== null) {
    let item = csItems.find(i => i.id === csHeld);

    if (cat.x>csCX-35 && cat.x<csCX+csCW+35) {
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
        bgm.stop();
    coopsketBgm.play();
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