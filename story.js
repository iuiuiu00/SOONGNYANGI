let scene = 'intro_location', fadingTo = '', fadeAlpha = 0, seqTimer = 0, clsKey1Got = false;

// 츄르 대사
const cLines = [
    {text:'교실이 어둡다..', s:false},
    {text:'!', s:false},
    {text:'정말 오랜만에 보는 츄르다', s:false},
    {text:'(츄르를 얻었습니다)', s:true}
];

let cLi = 0, cCi = 0, cAdv = false, cTmr = 0, cFA = 255, churuA = 0, churuVis = false, heartA = 0, excA = 0;

// 교수님 대사
const pLines = [
    {text:'..오랜만이네', sp:'prof'},
    {text:'교수님은 여전히 멀끔하셨다', sp:'cat'},
    {text:'이 학교를 떠나기는 쉽지 않네..', sp:'prof'},
    {text:'앞에 coopsket을 가볼래?', sp:'prof'}
];

let pLi = 0, pCi = 0, pAdv = false, pTmr = 0, pFA = 255;

// 엔딩
const endLines = [
    {text:'?', d:60},
    {text:'왜 사람들 소리가 들리지?', d:160},
    {text:'설마 학교가?', d:300}
];

let endTimer = 0;

// 크레딧
let creditSY = 500;

const credits = [
  {t:'title', x:'FLARE'},
  {t:'subtitle', x:'Staff Roll'},
  {t:'spacer'},

  {t:'name', x:'민경준'},{t:'category', x:'코딩'},{t:'task', x:'BGM  ·  효과음 구현  ·  카메라 이동'},{t:'category', x:'디자인'},{t:'task', x:'초기 화면  ·  엔딩 화면'},{t:'category', x:'설계'},{t:'task', x:'조만식  ·  중앙도서관 맵 설계  ·  평정심 게이지 설계'},{t:'spacer'},
  {t:'name', x:'서윤아'},{t:'category',x:'코딩'},{t:'task',x:'메인 캐릭터 움직임  ·  중간 저장 기능  ·  물리 엔진'},{t:'category',x:'디자인'},{t:'task',x:'이스터에그 & 아이템 & 장애물  ·  인벤토리'},{t:'category',x:'설계'},{t:'task',x:'물리 수치 설계'},{t:'spacer'},
  {t:'name', x:'김서정'},{t:'category',x:'코딩'},{t:'task',x:'물리 엔진 (충돌 처리)'},{t:'category',x:'디자인'},{t:'task',x:'맵 디자인  ·  캐릭터 디자인  ·  클리어 화면  ·  게이지 & 평정심 & 목숨'},{t:'category',x:'설계'},{t:'task',x:'스토리 기획 (+ 대사)'},{t:'spacer'},{t:'spacer'},
  
  {t:'fin', x:'— fin —'},{t:'special',x:'Special Credit to Claude'},
];

function initChuru() {
    cLi = 0; cCi = 0; cAdv = false; cTmr = 0; churuA = 0; churuVis = false; heartA = 0; excA = 0; cFA = 255;
}

function initProf() { 
    pLi = 0; pCi = 0; pAdv = false; pTmr = 0; pFA = 255;
}

function drawChuru() {
  background(10,9,11);
  
  if (cFA > 0) cFA = max(cFA-8, 0);

  const cx2 = 180, cy2 = H-30; 
  
  drawCatBack(cx2, cy2);

  if (cLi === 1) {
    excA = min(excA+12, 255);
    
    noStroke();
    fill(220,205,100,excA);
    rect(cx2+4, cy2-145, 8, 24);
    rect(cx2+4, cy2-115, 8, 8);
  }

  if (churuVis) churuA = min(churuA + 2, 255); 
  if (cLi === 3) heartA = min(heartA + 3, 180);

  if (churuA>0) {
    push();
    
    translate(W/2+80, H/2-50);
    rotate(radians(-12));
    
    const CW2 = 38, CH = 160;
    
    noStroke();
    
    fill(245,235,230,churuA);
    rect(0, 0, CW2, CH, 4);
    
    fill(72,140,80,churuA);
    rect(0, 0, CW2, 42, 4);
    
    fill(55,110,62,churuA);
    rect(4, 0, CW2-8, 10, 2);
    triangle(CW2/2-6, 0, CW2/2 + 6, 0, CW2/2, -8);

    fill(245,235,230,churuA);
    rect(0, 36, CW2, CH-36);

    pop();
  }

  if (heartA > 0) {
    noStroke();
    fill(220,80,100,heartA);
    textSize(18);
    textAlign(CENTER,CENTER);
    text('♥', cx2+6, cy2-150);
  }

  cTmr++;
  
  if (cTmr%2 === 0 && cCi < cLines[cLi].text.length) cCi++;
  if (cCi >= cLines[cLi].text.length) cAdv = true;

  let ctxt = cLines[cLi].text.substring(0, cCi);
  
  noStroke();

  if (cLines[cLi].s) {
    fill(35,30,15,220);
    rect(W/2 - 190, H-115, 380, 52, 3);
    
    fill(200,178,95);
    textSize(13);
    textAlign(CENTER,CENTER);
    text(ctxt, W/2, H-89);
  } else {
    fill(8,8,8,230);
    rect(55, H-125, W-110, 82, 3);

    fill(215,210,200);
    textSize(14);
    textAlign(LEFT,CENTER);
    text(ctxt, 88, H-84);
  }

  if (cAdv && frameCount % 60 < 40) {
    fill(100,96,88);
    textSize(9);
    textAlign(RIGHT,BOTTOM);
    text('ENTER ▶', W-65, H-48);
  }

  if (cFA > 0) {
    fill(0,0,0,cFA);
    rect(0,0,W,H);
  }
}

function drawProf() {
  background(12,11,14);

  noStroke();
  
  fill(14,12,16);
  rect(0, 0, W, H*0.75);
  
  fill(20,15,12);
  rect(0, H*0.75, W, H);
  
  fill(28,22,15);
  rect(0, H*0.75, W, 3);
  
  fill(8,12,20);
  rect(W*0.68, H*0.04, W*0.24, H*0.25);
  
  fill(6,9,16);
  rect(W*0.69, H*0.05, W*0.22, H*0.23);
  
  fill(16,14,20);
  rect(W*0.68, H*0.04, W*0.24, 3);
  rect(W*0.68, H*0.04, 3, H*0.25);
  rect(W*0.92-3, H*0.04, 3, H*0.25);
  rect(W*0.68, H*0.04 + H*0.125, W*0.24, 3);
  rect(W*0.80, H*0.04, 3, H*0.25);

  const ddx = W*0.25, ddy = H*0.38, ddw = W*0.50, ddh = H*0.12;
  
  fill(72,62,52);
  rect(ddx, ddy, ddw, ddh);
  
  fill(84,74,62);
  rect(ddx + 2, ddy + 2, ddw - 4, ddh*0.3);
  
  fill(30,24,20);
  rect(ddx, ddy + ddh, ddw, H*0.75 - ddy - ddh);
  
  fill(24,19,16);
  rect(ddx, ddy + ddh, ddw*0.14, H*0.75 - ddy - ddh);
  rect(ddx + ddw - ddw*0.14, ddy + ddh, ddw*0.14 , H*0.75 - ddy - ddh);
  
  const px = W*0.50, py = ddy, PP = 3.5;
  
  fill(28,26,34);
  rect(px - 8*PP, py - 4*PP, 16*PP, 4*PP);
  rect(px - 9*PP, py - 5*PP, 3*PP, 2*PP);
  rect(px + 6*PP, py - 5*PP, 3*PP, 2*PP);
  
  fill(145, 140, 132);
  rect(px - PP, py - 5*PP, 2*PP, 2*PP);
  
  fill(148,126,104);
  rect(px - 2*PP, py - 9*PP, 4*PP, 4*PP);
  
  fill(152,130,108);
  rect(px - 3*PP, py - 16*PP, 6*PP, 7*PP);
  
  fill(20,18,22);
  rect(px - 3*PP, py - 16*PP, 6*PP, 3*PP);
  rect(px - 4*PP, py - 15*PP, 2*PP, 5*PP);
  rect(px + 2*PP, py - 15*PP, 2*PP, 5*PP);

  drawCatBack(120, H-50);

  pTmr++;
  
  if (pTmr % 2 === 0 && pCi < pLines[pLi].text.length) pCi++;
  if (pCi >= pLines[pLi].text.length) pAdv = true;

  let ptxt = pLines[pLi].text.substring(0, pCi);

  noStroke();

  if (pLines[pLi].sp === 'prof') {
    fill(10,10,12,220);
    rect(55, H-125, W-110, 82, 3);
    
    fill(30,30,32,160);
    rect(57, H-123, W-114, 2);
    
    fill(140,130,100);
    textSize(10);
    textAlign(LEFT,CENTER);
    text('정기철 교수', 80, H-108);
    
    fill(200,196,188);
    textSize(14);
    textAlign(LEFT,CENTER);
    text(ptxt,80,H-82);
  } else { 
    fill(8,8,10,200);
    rect(55, H-125, W-110, 82, 3);

    fill(160,156,148);
    textSize(13);
    textAlign(LEFT,CENTER);
    text(ptxt, 80, H-84);
  }

  if (pAdv && frameCount % 60 < 40) {
    fill(90,86,80);
    textSize(9);
    textAlign(RIGHT,BOTTOM);
    text('ENTER ▶', W-65, H-48);
  }

  if (pFA > 0) {
    pFA = max(pFA-8, 0);
    
    fill(0, 0, 0, pFA);
    rect(0, 0, W, H);
  }
}