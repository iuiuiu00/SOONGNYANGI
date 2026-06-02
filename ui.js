function drawIntro() {
  background(8, 8, 18);
  drawStarField();

  // 제목 글로우
  let pulse = sin(frameTimer * 0.05) * 10;
  noStroke();

  // 그림자 레이어
  fill(0, 80, 200, 60);
  textAlign(CENTER);
  textSize(76);
  textStyle(BOLD);
  text("SOONGNYANGI", width/2 + 3, height/2 - 130 + 3);

  fill(255, 220, 80);
  textSize(76);
  text("SOONGNYANGI", width/2, height/2 - 130);

  fill(180, 230, 255);
  textSize(26);
  textStyle(NORMAL);
  text("숭실대학교 고양이의 대모험", width/2, height/2 - 62);

  fill(200);
  textSize(20);
  text("SPACE : 점프  /  A · D  또는  ← → : 이동", width/2, height/2 + 20);
  text("코인을 모으고 장애물을 피해 골에 도달하세요!", width/2, height/2 + 55);

  // 점멸 시작 문구
  if (floor(frameTimer / 35) % 2 === 0) {
    fill(255, 200 + pulse, 80);
    textSize(24);
    text("[ ENTER 키를 눌러 시작 ]", width/2, height/2 + 140);
  }

  // 작은 숭냥이 미리보기
  push();
  translate(width/2, height/2 + 240);
  scale(1.4);
  drawCat(0, 0, true, false, frameTimer);
  pop();

  fill(120);
  textSize(15);
  text("Made by Group 8  ·  민경준 · 김서정 · 서윤아", width/2, height - 25);
}

function drawLobby() {
  background(10, 12, 25);
  drawStarField();

  textAlign(CENTER);
  fill(255, 220, 80);
  textSize(52);
  textStyle(BOLD);
  text("STAGE SELECT", width/2, 110);
  textStyle(NORMAL);

  drawStageCard(
    width/2 - 220, 180, 380, 240,
    "STAGE 1", "중앙도서관",
    "★ 입문  |  코인 15개  |  낙하물 3개",
    color(40, 80, 180), 1
  );
  drawStageCard(
    width/2 + 30, 180, 380, 240,  // 오른쪽 카드 (조만식)
    "STAGE 2", "조만식기념관",
    "★★ 보통  |  코인 20개  |  낙하물 5개",
    color(160, 60, 40), 2
  );

  fill(140);
  textSize(16);
  text("카드를 클릭해서 스테이지를 선택하세요", width/2, height - 40);
}

function drawStageCard(x, y, w, h, label, name, desc, col, stageNum) {
  let hovered =
    mouseX > x && mouseX < x + w &&
    mouseY > y && mouseY < y + h;

  // 카드 배경
  noStroke();
  fill(red(col) * 0.4, green(col) * 0.4, blue(col) * 0.4, hovered ? 240 : 200);
  rect(x, y, w, h, 16);

  // 테두리
  strokeWeight(hovered ? 3 : 1.5);
  stroke(col);
  noFill();
  rect(x, y, w, h, 16);
  noStroke();

  // 텍스트
  textAlign(CENTER);
  fill(180, 200, 255);
  textSize(16);
  text(label, x + w/2, y + 36);

  fill(255, 220, 80);
  textSize(28);
  textStyle(BOLD);
  text(name, x + w/2, y + 80);
  textStyle(NORMAL);

  fill(200);
  textSize(15);
  text(desc, x + w/2, y + 115);

  // 미니 숭냥이
  push();
  translate(x + w/2, y + 185);
  scale(0.8);
  drawCat(0, 0, true, false, frameTimer + stageNum * 30);
  pop();

  // hover 효과
  if (hovered) {
    fill(255, 255, 255, 30);
    rect(x, y, w, h, 16);
  }
}

function runClear() {
  // 배경 밝아지기
  bgBrightness = lerp(bgBrightness, 255, 0.018);
  background(bgBrightness);

  clearFade = min(clearFade + 4, 255);

  // 불꽃 파티클
  if (frameTimer % 8 === 0) {
    spawnParticles(
      random(width * 0.2, width * 0.8), random(100, 250),
      [random(200,255), random(100,200), 40], 8
    );
  }
  push(); resetMatrix(); updateParticles(); drawParticles(); pop();

  push(); resetMatrix();
  textAlign(CENTER);

  if (clearFade > 40) {
    fill(0, 150, 80, clearFade);
    textSize(72); textStyle(BOLD);
    text("STAGE CLEAR!", width/2, height/2 - 100);
    textStyle(NORMAL);

    fill(255, 200, 50, clearFade);
    textSize(24);
    text("스코어: " + score + "  /  코인: " + coins.filter(c=>c.collected).length + "/" + coins.length, width/2, height/2 - 30);
  }

  if (clearFade > 80) {
    // 버튼
    let bx = width/2 - 160, by = height/2 + 20, bw = 320, bh = 80;
    let hov = mouseX>bx && mouseX<bx+bw && mouseY>by && mouseY<by+bh;
    fill(hov ? 70 : 40, 0, 0, 220);
    rect(bx, by, bw, bh, 14);
    stroke(hov ? 255 : 160, 80, 80); strokeWeight(2);
    noFill(); rect(bx, by, bw, bh, 14); noStroke();
    fill(255); textSize(26);
    text(currentStage === 1 ? "다음 스테이지 →" : "엔딩 보기 →", width/2, by + 50);

    fill(200); textSize(14);
    text("(클릭 또는 ENTER)", width/2, by + bh + 30);
  }
  pop();
}

function drawEnding() {
  background(8, 8, 20);
  drawStarField();

  textAlign(CENTER);
  fill(255, 220, 80);
  textSize(68); textStyle(BOLD);
  text("ENDING", width/2, height/2 - 140);
  textStyle(NORMAL);

  fill(200, 230, 255);
  textSize(24);
  text("숭냥이가 숭실대의 전설이 되었습니다!", width/2, height/2 - 70);

  fill(255);
  textSize(20);
  text("최종 점수:  " + score, width/2, height/2 - 20);

  fill(180);
  textSize(16);
  text("모든 스테이지를 클리어해주셔서 감사합니다 :)", width/2, height/2 + 30);

  push();
  translate(width/2 - 60, height/2 + 100);
  drawCat(0, 0, true, false, frameTimer);
  pop();
  push();
  translate(width/2 + 60, height/2 + 100);
  drawCat(0, 0, false, false, frameTimer + 15);
  pop();

  fill(150);
  textSize(15);
  text("Created by 민경준 · 김서정 · 서윤아  (Group 8)", width/2, height - 50);

  if (floor(frameTimer / 40) % 2 === 0) {
    fill(255, 200, 80);
    textSize(18);
    text("[ ENTER 키로 처음부터 ]", width/2, height - 20);
  }
}

// ─── GAME OVER ────────────────────────────────────────────
function drawGameOver() {
  background(0);
  gameOverFade = min(gameOverFade + 4, 255);

  noStroke();
  fill(180, 30, 30, gameOverFade);
  textSize(82); textStyle(BOLD); textAlign(CENTER);
  text("GAME OVER", width/2, height/2 - 80);
  textStyle(NORMAL);

  fill(255, gameOverFade);
  textSize(22);
  text("숭냥이가 힘을 다했어요...", width/2, height/2 + 10);
  textSize(18);
  text("ENTER 키를 눌러 처음부터", width/2, height/2 + 55);

  fill(255, 200, 50, gameOverFade);
  textSize(16);
  text("최종 점수: " + score, width/2, height/2 + 95);
}