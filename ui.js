// 메뉴
let menuOpen = false;
let saveMessage = '';
let saveNoticeTimer = 0;
let MBX, MBY = 12, MBW = 28, MBH = 22;

function drawMenuBtn() {
  let hov = mouseX > MBX && mouseX < MBX + MBW && mouseY > MBY && mouseY < MBY + MBH;
  
  noStroke();
  
  fill(menuOpen ? color(55,52,58) : (hov ? color(50,48,52) : color(30,28,32)));
  rect(MBX, MBY, MBW, MBH, 3);

  fill(170,165,158);
  rect(MBX+5, MBY+5, MBW-10, 2);
  rect(MBX+5, MBY+10, MBW-10, 2);
  rect(MBX+5, MBY+15, MBW-10, 2);

  if (saveNoticeTimer > 0) {
    saveNoticeTimer = max(saveNoticeTimer - 1, 0);
    fill(230, 230, 215, map(saveNoticeTimer, 0, 120, 0, 255));
    textSize(10);
    textAlign(RIGHT, TOP);
    text(saveMessage, MBX + MBW, MBY + MBH + 8);
  }
}

function drawMenuPopup() {
  fill(0,0,0,160);
  rect(0,0,W,H);
  
  let mx = W/2-80, my = H/2-68, mw = 160, mh = 168;

  fill(28,26,30);
  rect(mx, my, mw, mh, 5);
  
  fill(45,42,48);
  rect(mx, my, mw, 3, 5);
  
  stroke(55,52,58);
  strokeWeight(1);
  noFill();
  rect(mx,my,mw,mh,5);
  noStroke();

  let hasSave = localStorage.getItem('flare_save') !== null;

  let hov1 = mouseX > mx && mouseX < mx + mw && mouseY > my + 16 && mouseY < my + 52;
  fill(hov1 ? (hasSave ? color(55,52,58) : color(35,35,35)) : (hasSave ? color(40,38,42) : color(30,30,30)));
  rect(mx+10, my+16, mw-20, 36, 3);
  fill(hasSave ? 200 : 120);
  textSize(12);
  textFont('monospace');
  textAlign(CENTER,CENTER);
  text('CONTINUE', W/2, my+34);

  let hov2 = mouseX > mx && mouseX < mx + mw && mouseY > my + 62 && mouseY < my + 98;
  fill(hov2 ? color(55,52,58) : color(40,38,42));
  rect(mx+10, my+62, mw-20, 36, 3);
  fill(200,195,188);
  textSize(12);
  textAlign(CENTER,CENTER);
  text('SAVE', W/2, my+80);

  let hov3 = mouseX > mx && mouseX < mx + mw && mouseY > my + 108 && mouseY < my + 144;
  fill(hov3 ? color(80,40,40) : color(60,30,30));
  rect(mx+10, my+108, mw-20, 36, 3);
  fill(200,140,130);
  textSize(12);
  textAlign(CENTER,CENTER);
  text('EXIT', W/2, my+126);
}

function handleMenuClick(mx, my) {}
