let cat = { 
  x: 140, 
  y: floorY-32, 
  vx: 0, 
  vy: 0, 
  onGround: false, 
  dir: 1, 
  stepT: 0 
};

function drawCatPixel(wx, wy, dir, vx, stepT, onGround) {
  let cx = round(wx), cy = round(wy);
  let d = dir;
  let walk = onGround && abs(vx) > 0.3;
  let lf = floor(stepT) % 2;
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

  if (!onGround) {
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