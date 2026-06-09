// ============================================================
//  title.js — FLARE 타이틀 화면
//  story.js의 전역변수에 추가:
//    let titleHoverStart = false;
//    let titleHoverContinue = false;
//  sketch.js draw() 맨 위에 추가:
//    if (scene === 'title') { drawTitle(); return; }
//  intro_location 씬 시작 전에 scene = 'title' 로 설정
// ============================================================

function drawTitle() {
  // 배경 (검정 + 오른쪽으로 밝아지는 그라데이션 효과)
  background(0);

  // 오른쪽 밝은 영역 (흰색 원형 그라데이션 느낌을 여러 레이어로)
  noStroke();
  for (let i = 0; i < 80; i++) {
    let x = map(i, 0, 80, W, W * 0.3);
    let a = map(i, 0, 80, 180, 0);
    fill(255, a);
    rect(x, 0, W - x, H);
  }

  // ── FLARE 타이틀 ──────────────────────────────────────────
  fill(170);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(120);
  textStyle(BOLD);
  text('FLARE', 80, 60);
  textStyle(NORMAL);

  // 타이틀 아래 가로선
  stroke(255);
  strokeWeight(0.8);
  line(80, 210, 420, 210);
  noStroke();

  // ── CONTROLS 섹션 ──────────────────────────────────────────
  fill(180);
  textSize(11);
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  text('C O N T R O L S', 80, H - 220);

  // 키 버튼 스타일 함수
  function drawKey(label, x, y, w) {
    let h = 32;
    noFill();
    stroke(200);
    strokeWeight(1);
    rect(x, y, w, h, 5);
    fill(220);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text(label, x + w / 2, y + h / 2);
  }

  // A D 키
  let ky = H - 188;
  drawKey('A', 80, ky, 36);
  drawKey('D', 124, ky, 36);
  fill(200);
  textSize(13);
  textAlign(LEFT, CENTER);
  text('이동', 172, ky + 16);

  // E 키
  ky = H - 148;
  drawKey('E', 80, ky, 36);
  fill(200);
  textSize(13);
  textAlign(LEFT, CENTER);
  text('상호작용', 128, ky + 16);

  // Shift 키
  ky = H - 108;
  drawKey('Shift', 80, ky, 52);
  fill(200);
  textSize(13);
  textAlign(LEFT, CENTER);
  text('점프', 145, ky + 16);

  // ── START / CONTINUE 버튼 ────────────────────────────────
  let hasSave = localStorage.getItem('flare_save') !== null;

  // START
  let startHov = mouseX > W - 200 && mouseX < W - 20 &&
                 mouseY > H - 130 && mouseY < H - 90;
  noStroke();
  fill(startHov ? 0 : 220);
  textSize(36);
  textAlign(RIGHT, CENTER);
  text('START', W - 30, H - 108);

  // v0.1.0
  fill(100);
  textSize(11);
  textAlign(RIGHT, TOP);
  text('v0.1.0', W - 30, H - 82);

  // CONTINUE (저장 데이터 있을 때만 밝게)
  let contHov = mouseX > W - 220 && mouseX < W - 20 &&
                mouseY > H - 70  && mouseY < H - 30;
  fill(hasSave ? (contHov ? 200 : 140) : 60);
  textSize(18);
  textAlign(RIGHT, CENTER);
  textStyle(NORMAL);
  // 자간 효과 (글자 하나씩)
  let contTxt = 'C O N T I N U E';
  text(contTxt, W - 30, H - 48);

  textStyle(NORMAL);
  textAlign(LEFT, BASELINE);
}

// ── 타이틀 화면 클릭 처리 ────────────────────────────────────
// mousePressed() 안에 추가하세요
function handleTitleClick() {
  if (scene !== 'title') return false;

  let hasSave = localStorage.getItem('flare_save') !== null;

  // START 클릭
  if (mouseX > W - 200 && mouseX < W - 20 &&
      mouseY > H - 130 && mouseY < H - 90) {
    localStorage.removeItem('flare_save'); // 새 게임은 저장 삭제
    corridorEggCollected = false;
    scene    = 'intro_story';
    initIntroStory();
    seqTimer = 0;
    return true;
  }

  // CONTINUE 클릭 (저장 있을 때만)
  if (hasSave &&
      mouseX > W - 220 && mouseX < W - 20 &&
      mouseY > H - 70  && mouseY < H - 30) {
    if (loadGame()) {
      return true;
    }
  }

  return false;
}
function handleTitleKeyPressed() {
  // 타이틀에서 키 입력 시 START
  if (keyCode === ENTER || keyCode === 32) {
    localStorage.removeItem('flare_save');
    corridorEggCollected = false;
    scene = 'intro_story';
    initIntroStory();
    seqTimer = 0;
  }
}
