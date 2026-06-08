const cLines = [
    {text:'교실이 어둡다..', s:false},
    {text:'!', s:false},
    {text:'정말 오랜만에 보는 츄르다', s:false},
    {text:'(츄르를 얻었습니다)', s:true}
];

let cLi = 0;
let cCi = 0;
let cAdv = false;
let cTmr = 0; 
let cFA = 255;
let churuA = 0;
let churuVis = false;
let heartA = 0;
let excA = 0;

function initChuru() {
    cLi = 0; cCi = 0; cAdv = false; cTmr = 0; churuA = 0; churuVis = false; heartA = 0; excA = 0; cFA = 255;
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