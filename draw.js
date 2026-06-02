function drawStarField() {
  noStroke();
  for (let p of bgParticles) {
    p.y += p.speed * 0.3;
    if (p.y > height) p.y = 0;
    fill(255, p.opacity);
    ellipse(p.x, p.y, p.size);
  }
}

function drawStageBG() {
  if (currentStage === 1) {
    background(180, 210, 255);
  } else {
    background(240, 225, 200);
  }
}

function drawParallaxBG() {
  if (currentStage === 1) drawLibraryBG();
  else drawJomansikBG();
}

function drawLibraryBG() {
  // 먼 구름 (0.2x 패럴랙스)
  noStroke();
  fill(255, 255, 255, 160);
  let cx = cameraX;
  for (let i = 0; i < 8; i++) {
    let bx = ((i * 700 - cameraX * 0.2) % (worldWidth + 400)) - 100;
    let by = 60 + sin(i * 2.3) * 40;
    ellipse(bx, by, 160, 60);
    ellipse(bx + 60, by - 20, 120, 50);
    ellipse(bx + 120, by, 100, 45);
 }
   // 도서관 건물 실루엣 (0.35x)
  let bldX = 800 - cx * 0.35;
  fill(140, 160, 200, 200);
  rect(bldX, 120, 320, 280);
  fill(120, 140, 180, 200);
  rect(bldX - 15, 108, 350, 25);
  fill(160, 180, 220, 180);
  for (let i = 0; i < 7; i++) rect(bldX + 10 + i * 44, 140, 16, 260);
  fill(255, 230, 160, 160);
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 5; c++)
      rect(bldX + 18 + c * 58, 160 + r * 52, 24, 32);
  fill(60, 80, 140);
  textSize(11);
  textAlign(CENTER);
  text("중앙도서관", bldX + 160, 122);

  // 나무 (0.5x)
  for (let i = 0; i < 12; i++) {
    let tx = ((i * 420 + 80 - cx * 0.5) % (worldWidth + 200)) - 50;
    fill(60, 140, 70, 200);
    ellipse(tx, groundY - 55, 60, 80);
    fill(50, 120, 55);
    ellipse(tx + 8, groundY - 60, 42, 60);
    fill(100, 60, 30);
    rect(tx - 6, groundY - 28, 12, 28);
  }
}

function drawJomansikBG() {
  noStroke();
  // 가을 구름
  fill(250, 240, 220, 170);
  let cx = cameraX;
  for (let i = 0; i < 8; i++) {
    let bx = ((i * 650 + 100 - cx * 0.2) % (worldWidth + 400)) - 100;
    let by = 55 + sin(i * 1.7) * 30;
    ellipse(bx, by, 140, 55);
    ellipse(bx + 55, by - 18, 110, 45);
  }

  // 조만식기념관 실루엣 (0.35x)
  let bx2 = 900 - cx * 0.35;
  fill(195, 175, 150, 210);
  rect(bx2, 100, 300, 300);
  fill(175, 155, 130, 210);
  rect(bx2 - 18, 88, 336, 26);
  fill(210, 195, 170, 190);
  for (let i = 0; i < 8; i++) rect(bx2 + 8 + i * 36, 118, 16, 282);
  fill(185, 205, 225, 190);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      let wx = bx2 + 16 + c * 55, wy = 145 + r * 65;
      arc(wx + 14, wy + 18, 26, 32, PI, 0);
      rect(wx, wy + 18, 26, 26);
    }
  }
  fill(70, 50, 30);
  textSize(10);
  textAlign(CENTER);
  text("조만식기념관", bx2 + 150, 102);

  // 가을 나무 (0.5x)
  for (let i = 0; i < 12; i++) {
    let tx = ((i * 400 + 60 - cx * 0.5) % (worldWidth + 200)) - 50;
    fill(200, 90, 40, 210);
    ellipse(tx, groundY - 55, 58, 78);
    fill(180, 70, 25);
    ellipse(tx + 6, groundY - 58, 40, 58);
    fill(110, 55, 25);
    rect(tx - 6, groundY - 26, 12, 26);
  }
}

function drawGround() {
  noStroke();
  if (currentStage === 1) {
    fill(80, 160, 80);
    rect(0, groundY, worldWidth, 12);
    fill(100, 80, 55);
    rect(0, groundY + 12, worldWidth, height - groundY - 12);
  } else {
    fill(150, 120, 90);
    rect(0, groundY, worldWidth, 12);
    fill(120, 95, 65);
    rect(0, groundY + 12, worldWidth, height - groundY - 12);
  }
}

function drawBricks() {
  for (let b of bricks) {
    drawPlatformRect(b.x, b.y, b.w, b.h, b.type || "stone");
  }
}

function drawPlatformRect(x, y, w, h, type) {
  noStroke();
  if (type === "wood") {
    fill(160, 105, 55);
    rect(x, y, w, h, 4);
    fill(140, 88, 40);
    rect(x, y, w, 6, 4, 4, 0, 0);
    // 나뭇결
    stroke(130, 80, 35, 100);
    strokeWeight(1);
    for (let lx = x + 10; lx < x + w - 5; lx += 14)
      line(lx, y + 4, lx + 3, y + h - 2);
    noStroke();
  } else if (type === "ice") {
    fill(160, 220, 255, 200);
    rect(x, y, w, h, 4);
    fill(200, 240, 255, 140);
    rect(x, y, w, 5, 4, 4, 0, 0);
  } else if (type === "metal") {
    fill(150, 160, 180);
    rect(x, y, w, h, 2);
    fill(180, 190, 210);
    rect(x, y, w, 5, 2, 2, 0, 0);
    stroke(100, 110, 130);
    strokeWeight(0.5);
    for (let lx = x; lx < x + w; lx += 20) line(lx, y, lx, y + h);
    noStroke();
  } else {
    // stone (기본)
    if (currentStage === 1) fill(180, 120, 80);
    else fill(170, 150, 125);
    rect(x, y, w, h, 3);
    if (currentStage === 1) fill(200, 140, 100);
    else fill(195, 175, 150);
    rect(x, y, w, 6, 3, 3, 0, 0);
  }
}

function drawMovingPlatforms() {
  for (let mp of movPlatforms) {
    drawPlatformRect(mp.x, mp.y, mp.w, mp.h, "metal");
    // 이동 방향 화살표
    fill(255, 200, 50, 180);
    noStroke();
    let arrowX = mp.x + mp.w / 2 + (mp.dir > 0 ? 6 : -6);
    triangle(
      arrowX + mp.dir * 6, mp.y + mp.h / 2,
      arrowX - mp.dir * 5, mp.y + mp.h / 2 - 5,
      arrowX - mp.dir * 5, mp.y + mp.h / 2 + 5
    );
  }
}

function drawGoalFlag() {
  let gx = worldWidth - 300;
  let gy = groundY - 120;

  // 기둥
  stroke(180, 160, 130);
  strokeWeight(4);
  line(gx, gy, gx, groundY);
  noStroke();

  // 깃발 (나부낌)
  let wave = sin(frameTimer * 0.08) * 6;
  fill(0, 80, 200);
  beginShape();
  vertex(gx, gy);
  vertex(gx + 50, gy + 10 + wave);
  vertex(gx + 50, gy + 30 + wave);
  vertex(gx, gy + 22);
  endShape(CLOSE);
  fill(255);
  textSize(9);
  textAlign(LEFT);
  text("SU", gx + 10, gy + 20 + wave * 0.5);

  // 빛나는 별
  fill(255, 220, 50);
  let glow = sin(frameTimer * 0.1) * 3;
  ellipse(gx, gy, 14 + glow, 14 + glow);

  // GOAL 문구
  fill(255, 220, 50);
  textAlign(CENTER);
  textSize(14);
  text("GOAL!", gx, gy - 16);
}

function drawPlayer() {
  let pl = player;
  // 무적 깜빡임
  if (pl.invincible > 0 && floor(frameCount / 4) % 2 === 0) return;

  // 사망 애니
  let deathScale = 1;
  let deathAlpha = 255;
  if (!pl.alive) {
    deathScale = max(0, 1 - pl.deathAnim / 60);
    deathAlpha = map(pl.deathAnim, 0, 60, 255, 0);
  }

  push();
  translate(pl.x, pl.y);
  tint(255, deathAlpha);
  scale(deathScale);
  drawCat(0, 0, pl.facingRight, !pl.grounded, pl.walkFrame);
  noTint();
  pop();
}

function drawCat(ox, oy, facingRight, isJumping, frame) {
  let fx = facingRight ? 1 : -1;
  push();
  translate(ox, oy);
  scale(fx, 1);
  noStroke();

  // 꼬리
  let tailWag = isJumping ? 15 : sin(frame * 0.12) * 10;
  stroke(210, 190, 155); strokeWeight(4); noFill();
  beginShape();
  curveVertex(-14, 6);
  curveVertex(-18, 14);
  curveVertex(-20 + tailWag * 0.6, 22);
  curveVertex(-15 + tailWag, 18);
  endShape();
  noStroke();

  // 다리 (걷기)
  fill(210, 190, 155);
  let leg = isJumping ? 8 : sin(frame * 0.3) * 8;
  ellipse(-8,  18 + leg * 0.4, 9, 13);
  ellipse(8,   18 - leg * 0.4, 9, 13);

  // 몸통
  fill(230, 210, 170);
  ellipse(0, 5, 32, 24);

  // 줄무늬
  stroke(200, 175, 130); strokeWeight(1.5);
  line(-7, 2, -11, 9); line(0, 5, -2, 12); line(7, 2, 9, 9);
  noStroke();

  // 머리
  fill(230, 210, 170);
  ellipse(0, -10, 28, 24);

  // 귀
  fill(230, 210, 170);
  triangle(-10, -18, -14, -30, -3, -20);
  triangle(10,  -18,  14, -30,  3, -20);
  fill(255, 175, 175);
  triangle(-9, -19, -12, -27, -4, -21);
  triangle(9,  -19,  12, -27,  4, -21);

  // 눈
  fill(50, 35, 25);
  ellipse(-6, -11, 6, isJumping ? 3 : 5);
  ellipse(6,  -11, 6, isJumping ? 3 : 5);
  fill(255);
  ellipse(-5, -12, 2.5, 2.5);
  ellipse(7,  -12, 2.5, 2.5);

  // 코
  fill(255, 120, 130);
  ellipse(0, -5, 6, 4);

  // 수염
  stroke(210, 190, 160); strokeWeight(0.8);
  line(-1, -5, -18, -7); line(-1, -5, -18, -3);
  line(1,  -5,  18, -7); line(1,  -5,  18, -3);
  noStroke();

  // SU 마크
  fill(0, 51, 153, 200);
  textSize(7); textAlign(CENTER, CENTER);
  text("SU", 0, 5);

  pop();
}

// ─── HUD ──────────────────────────────────────────────────
function drawHUD() {
  push();
  resetMatrix();

  // 상단 바
  noStroke();
  fill(0, 0, 0, 150);
  rect(0, 0, width, 52);

  // 스테이지
  fill(180, 210, 255);
  textSize(16); textAlign(LEFT);
  text(currentStage === 1 ? "STAGE 1 : 중앙도서관" : "STAGE 2 : 조만식기념관", 14, 32);

  // 점수
  fill(255, 220, 80);
  textSize(18); textAlign(CENTER);
  text("SCORE  " + score, width / 2, 32);

  // 목숨 (발바닥 아이콘)
  textAlign(RIGHT);
  fill(200); textSize(14);
  text("LIVES", width - 20 - MAX_LIVES * 36, 28);
  for (let i = 0; i < MAX_LIVES; i++) {
    if (i < lives) fill(255, 200, 200);
    else           fill(60);
    drawPaw(width - 16 - (MAX_LIVES - i) * 36, 12, 28);
  }

  // 코인 카운트
  let collected = coins.filter(c => c.collected).length;
  fill(255, 210, 40);
  textSize(15); textAlign(RIGHT);
  text("🪙 " + collected + " / " + coins.length, width - 14, 48);
  // (p5.js에서 이모지 안 되면 text로 대체)

  pop();
}

function drawPaw(x, y, s) {
  let r = s * 0.38;
  ellipse(x + s/2, y + s * 0.62, r * 2, r * 1.7);
  ellipse(x + s * 0.25, y + s * 0.28, r * 0.85, r * 0.85);
  ellipse(x + s * 0.5,  y + s * 0.18, r * 0.85, r * 0.85);
  ellipse(x + s * 0.75, y + s * 0.28, r * 0.85, r * 0.85);
}