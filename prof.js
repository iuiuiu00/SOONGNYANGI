const pLines = [
    {text:'..오랜만이네', sp:'prof'},
    {text:'교수님은 여전히 멀끔하셨다', sp:'cat'},
    {text:'이 학교를 떠나기는 쉽지 않네..', sp:'prof'},
    {text:'앞에 coopsket을 가볼래?', sp:'prof'}
];

let pLi = 0;
let pCi = 0;
let pAdv = false;
let pTmr = 0;
let pFA = 255;

function initProf() { 
    pLi = 0; pCi = 0; pAdv = false; pTmr = 0; pFA = 255;
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