// ============================================================
//  SOONGNYANGI ADVENTURE  |  Group 8
//  p5.js 개선 버전
//  개선사항:
//   - 더블점프 / 코요테타임 / 점프버퍼 구현
//   - 카메라 시차(Parallax) 배경
//   - 스테이지별 풍부한 맵 (플랫폼, 이동발판, 낙하물, 장애물)
//   - 코인 수집 시스템 + HUD 개선
//   - 파티클 이펙트 (착지, 사망, 코인)
//   - 숭냥이 픽셀 스프라이트 개선 (방향 전환, 걷기 애니)
//   - 로비 → 스테이지 선택 → 클리어 → 엔딩 흐름 완성
//   - 게임오버 시 라이프 차감 후 재도전, 전체 게임오버 분리
//   - 모든 충돌 버그 수정 (X/Y 분리 충돌)
// ============================================================

// ─── 전역 상태 ───────────────────────────────────────────────
let player;
let gravity       = 0.65;
let groundY;            // setup에서 height 기반 계산
let worldWidth    = 5000;
let bricks        = [];   // 일반 발판
let movPlatforms  = [];   // 움직이는 발판
let obstacles     = [];   // 빨간 장애물 (즉사)
let fallingObstacles = [];
let coins         = [];
let particles     = [];
let bgParticles   = []; // 배경 먼지 파티클

let cameraX       = 0;
let gameState     = "intro"; // intro | lobby | game | clear | ending | gameover
let currentStage  = 1;

let lives         = 3;
const MAX_LIVES   = 3;

let score         = 0;
let clearFade     = 0;
let gameOverFade  = 0;
let bgBrightness  = 20;
let frameTimer    = 0;

// 점프 보조
let coyoteTimer   = 0;   // 발판 끝 관용 프레임
let jumpBuffer    = 0;   // 착지 직전 점프 예약
const COYOTE_MAX  = 8;
const JUMP_BUF_MAX= 10;

// 화면 전환 페이드
let fadeAlpha     = 0;
let fadingOut     = false;
let fadeTarget    = "";

// ─── SETUP ───────────────────────────────────────────────────
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  groundY = height - 80;
  initPlayer();
  generateBgParticles();
}

function initPlayer() {
  player = {
    x: 100, y: 200,
    prevX: 100, prevY: 200,
    r: 22,          // 충돌 반경 (원형)
    vx: 0, vy: 0,
    speed: 1.0,
    maxSpeed: 7.5,
    jumpPower: -16,
    grounded: false,
    friction: 0.80,
    facingRight: true,
    walkFrame: 0,
    invincible: 0,  // 무적 프레임 (피격 후)
    doubleJumpAvail: true,
    deathAnim: 0,
    alive: true,
  };
}

function generateBgParticles() {
  bgParticles = [];
  for (let i = 0; i < 60; i++) {
    bgParticles.push({
      x: random(width), y: random(height),
      size: random(1, 3), speed: random(0.2, 0.8), opacity: random(80, 180)
    });
  }
}

// ─── DRAW (메인 루프) ─────────────────────────────────────────
function draw() {
  frameTimer++;

  if      (gameState === "intro")    drawIntro();
  else if (gameState === "lobby")    drawLobby();
  else if (gameState === "game")     runGame();
  else if (gameState === "clear")    runClear();
  else if (gameState === "ending")   drawEnding();
  else if (gameState === "gameover") drawGameOver();

  drawFadeOverlay();
}

// ─── 페이드 전환 ─────────────────────────────────────────────
function startFadeOut(target) {
  fadingOut   = true;
  fadeTarget  = target;
  fadeAlpha   = 0;
}

function drawFadeOverlay() {
  if (!fadingOut && fadeAlpha <= 0) return;
  if (fadingOut) {
    fadeAlpha = min(fadeAlpha + 8, 255);
    if (fadeAlpha >= 255) {
      fadingOut  = false;
      gameState  = fadeTarget;
    }
  } else {
    fadeAlpha = max(fadeAlpha - 8, 0);
  }
  noStroke();
  fill(0, fadeAlpha);
  rect(0, 0, width, height);
}

// ═══════════════════════════════════════════════════════════
//  INTRO
// ═══════════════════════════════════════════════════════════
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

function drawStarField() {
  noStroke();
  for (let p of bgParticles) {
    p.y += p.speed * 0.3;
    if (p.y > height) p.y = 0;
    fill(255, p.opacity);
    ellipse(p.x, p.y, p.size);
  }
}

// ═══════════════════════════════════════════════════════════
//  LOBBY
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
//  GAME LOOP
// ═══════════════════════════════════════════════════════════
function runGame() {
  // 배경
  drawStageBG();

  // 클리어 체크 (오른쪽 끝 도달)
  if (player.x > worldWidth - 300 && player.alive) {
    clearFade   = 0;
    bgBrightness = (currentStage === 1) ? 20 : 15;
    gameState   = "clear";
    spawnParticles(player.x, player.y, [255,220,80], 30);
    return;
  }

  if (player.alive) {
    updatePlayer();
    checkGround();
    checkWalls();
  } else {
    player.deathAnim++;
    if (player.deathAnim > 80) respawnOrGameOver();
  }

  updateMovingPlatforms();
  updateFallingObstacles();
  updateCoins();
  updateParticles();
  updateCamera();

  // ── 카메라 공간 렌더 ──
  push();
  translate(-cameraX, 0);

  drawParallaxBG();
  drawGround();
  drawBricks();
  drawMovingPlatforms();
  drawGoalFlag();
  drawFallingObstacles();
  drawObstacles();
  drawCoins();
  drawParticles();

  if (player.alive || player.deathAnim < 60) drawPlayer();

  checkFallingObstacleCollision();
  checkObstacleCollision();

  pop();
  // ── 카메라 공간 끝 ──

  drawHUD();
}

// ─── 배경 ─────────────────────────────────────────────────
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
    let bx = ((i * 700 - cx * 0.2) % (worldWidth + 400)) - 100;
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

// ─── 땅 ──────────────────────────────────────────────────
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

// ─── 발판 ─────────────────────────────────────────────────
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

function updateMovingPlatforms() {
  for (let mp of movPlatforms) {
    mp.x += mp.spd * mp.dir;
    if (mp.x < mp.minX || mp.x + mp.w > mp.maxX) mp.dir *= -1;
  }
}

// ─── 골 깃발 ──────────────────────────────────────────────
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

// ─── 낙하 장애물 ──────────────────────────────────────────
function updateFallingObstacles() {
  for (let obs of fallingObstacles) {
    if (!obs.triggered && abs(player.x - (obs.x + obs.w / 2)) < 260) {
      obs.triggered = true;
    }
    if (obs.triggered && !obs.landed) {
      obs.vy += 0.55;
      obs.y  += obs.vy;
      if (obs.y + obs.h >= groundY) {
        obs.y    = groundY - obs.h;
        obs.vy   = 0;
        obs.landed = true;
        // 착지 파티클
        spawnParticles(obs.x + obs.w / 2, groundY, [180, 180, 180], 12);
      }
    }
    // 착지 후 좌우 슬라이드 (일부)
    if (obs.landed && obs.slide) {
      obs.x += obs.slideDir * 1.8;
      if (obs.x < 0 || obs.x + obs.w > worldWidth) obs.slideDir *= -1;
    }
  }
}

function drawFallingObstacles() {
  for (let obs of fallingObstacles) {
    // 경고 그림자 (아직 안 떨어짐)
    if (!obs.triggered) {
      noStroke();
      fill(255, 0, 0, 60 + sin(frameTimer * 0.15) * 40);
      ellipse(obs.x + obs.w / 2, groundY - 2, obs.w * 1.2, 10);
    }
    noStroke();
    fill(80, 90, 110);
    rect(obs.x, obs.y, obs.w, obs.h, 4);
    fill(110, 120, 145);
    rect(obs.x, obs.y, obs.w, obs.h * 0.25, 4, 4, 0, 0);
    // 균열 느낌
    stroke(50, 55, 70, 160);
    strokeWeight(1.5);
    line(obs.x + obs.w * 0.3, obs.y + 4, obs.x + obs.w * 0.45, obs.y + obs.h - 4);
    noStroke();
  }
}

// ─── 장애물 ───────────────────────────────────────────────
function drawObstacles() {
  for (let obs of obstacles) {
    // 가시 형태로 표시
    noStroke();
    fill(200, 50, 50);
    rect(obs.x, obs.y + obs.h * 0.4, obs.w, obs.h * 0.6, 2);
    fill(220, 70, 70);
    let n = floor(obs.w / 12);
    for (let i = 0; i < n; i++) {
      triangle(
        obs.x + i * 12, obs.y + obs.h,
        obs.x + i * 12 + 6, obs.y,
        obs.x + i * 12 + 12, obs.y + obs.h
      );
    }
  }
}

// ─── 코인 ─────────────────────────────────────────────────
function updateCoins() {
  for (let c of coins) {
    c.anim = (c.anim || 0) + 0.07;
    if (!c.collected) {
      // 플레이어 수집 판정
      if (dist(player.x, player.y, c.x, c.y) < player.r + 12) {
        c.collected = true;
        score += 10;
        spawnParticles(c.x, c.y, [255, 210, 50], 8);
      }
    }
  }
}

function drawCoins() {
  for (let c of coins) {
    if (c.collected) continue;
    let bob = sin(c.anim) * 4;
    noStroke();
    // 코인 빛
    fill(255, 200, 40, 60);
    ellipse(c.x, c.y + bob, 26, 26);
    fill(255, 190, 30);
    ellipse(c.x, c.y + bob, 18, 18);
    fill(255, 220, 100);
    ellipse(c.x - 3, c.y + bob - 3, 7, 7);
  }
}

// ─── 파티클 ───────────────────────────────────────────────
function spawnParticles(x, y, col, n) {
  for (let i = 0; i < n; i++) {
    let ang = random(TWO_PI);
    let spd = random(1.5, 5);
    particles.push({
      x, y,
      vx: cos(ang) * spd, vy: sin(ang) * spd - 2,
      r: col[0], g: col[1], b: col[2],
      life: random(22, 50), maxLife: 50,
      size: random(3, 9)
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.18;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  noStroke();
  for (let p of particles) {
    let a = map(p.life, 0, p.maxLife, 0, 220);
    fill(p.r, p.g, p.b, a);
    ellipse(p.x, p.y, p.size * (p.life / p.maxLife));
  }
}

// ─── 플레이어 업데이트 ─────────────────────────────────────
function updatePlayer() {
  player.prevX = player.x;
  player.prevY = player.y;

  // 입력
  let left  = keyIsDown(LEFT_ARROW)  || keyIsDown(65);
  let right = keyIsDown(RIGHT_ARROW) || keyIsDown(68);
  if (left)  { player.vx -= player.speed; player.facingRight = false; }
  if (right) { player.vx += player.speed; player.facingRight = true;  }

  player.vx  = constrain(player.vx, -player.maxSpeed, player.maxSpeed);
  player.vy += gravity;
  player.vx *= player.friction;

  // 걷기 프레임
  if (abs(player.vx) > 0.5) player.walkFrame++;

  // 코요테타임 카운트
  if (player.grounded) {
    coyoteTimer = COYOTE_MAX;
    player.doubleJumpAvail = true;
  } else {
    coyoteTimer = max(coyoteTimer - 1, 0);
  }

  // 점프 버퍼 카운트
  jumpBuffer = max(jumpBuffer - 1, 0);

  // 버퍼 점프 실행
  if (jumpBuffer > 0 && (player.grounded || coyoteTimer > 0)) {
    executeJump();
    jumpBuffer = 0;
  }

  // 무적 프레임
  if (player.invincible > 0) player.invincible--;

  // 이동 (X 먼저, Y 다음으로 분리 충돌)
  player.x += player.vx;
  checkBrickCollisionX();
  checkMovingPlatformX();

  player.grounded = false;
  player.y += player.vy;
  checkBrickCollisionY();
  checkMovingPlatformY();
}

function executeJump() {
  player.vy = player.jumpPower;
  player.grounded = false;
  coyoteTimer = 0;
  spawnParticles(player.x, player.y + player.r, [200, 200, 200], 5);
}

// ─── 충돌 (발판) ───────────────────────────────────────────
function checkBrickCollisionX() {
  for (let b of bricks) {
    if (overlapAABB(player, b)) {
      if (player.vx > 0) player.x = b.x - player.r;
      else               player.x = b.x + b.w + player.r;
      player.vx = 0;
    }
  }
}

function checkBrickCollisionY() {
  for (let b of bricks) {
    if (overlapAABB(player, b)) {
      if (player.vy > 0) {
        player.y = b.y - player.r;
        player.vy = 0;
        player.grounded = true;
        if (abs(player.vx) > 2) spawnParticles(player.x, player.y + player.r, [180,180,180], 3);
      } else {
        player.y = b.y + b.h + player.r;
        player.vy = 0;
      }
    }
  }
}

function checkMovingPlatformX() {
  for (let mp of movPlatforms) {
    if (overlapAABB(player, mp)) {
      if (player.vx > 0) player.x = mp.x - player.r;
      else               player.x = mp.x + mp.w + player.r;
      player.vx = 0;
    }
  }
}

function checkMovingPlatformY() {
  for (let mp of movPlatforms) {
    if (overlapAABB(player, mp)) {
      if (player.vy >= 0) {
        player.y = mp.y - player.r;
        player.vy = 0;
        player.grounded = true;
        // 발판 위에 올라타면 같이 이동
        player.x += mp.spd * mp.dir;
      } else {
        player.y = mp.y + mp.h + player.r;
        player.vy = 0;
      }
    }
  }
}

// 원형 플레이어 vs 사각 AABB
function overlapAABB(pl, rect_) {
  let cx = constrain(pl.x, rect_.x, rect_.x + rect_.w);
  let cy = constrain(pl.y, rect_.y, rect_.y + rect_.h);
  return dist(pl.x, pl.y, cx, cy) < pl.r;
}

function checkGround() {
  if (player.y + player.r > groundY) {
    player.y       = groundY - player.r;
    player.vy      = 0;
    player.grounded = true;
  }
}

function checkWalls() {
  if (player.x - player.r < 0)           { player.x = player.r;              player.vx = 0; }
  if (player.x + player.r > worldWidth)  { player.x = worldWidth - player.r; player.vx = 0; }
  // 화면 아래로 떨어지면 즉사
  if (player.y > height + 100) playerDie();
}

// ─── 충돌 (장애물) ────────────────────────────────────────
function checkObstacleCollision() {
  if (player.invincible > 0 || !player.alive) return;
  for (let obs of obstacles) {
    let cx = constrain(player.x, obs.x, obs.x + obs.w);
    let cy = constrain(player.y, obs.y, obs.y + obs.h);
    if (dist(player.x, player.y, cx, cy) < player.r) playerDie();
  }
}

function checkFallingObstacleCollision() {
  if (player.invincible > 0 || !player.alive) return;
  for (let obs of fallingObstacles) {
    let cx = constrain(player.x, obs.x, obs.x + obs.w);
    let cy = constrain(player.y, obs.y, obs.y + obs.h);
    if (dist(player.x, player.y, cx, cy) < player.r) playerDie();
  }
}

function playerDie() {
  if (!player.alive) return;
  player.alive     = false;
  player.deathAnim = 0;
  player.vy        = -12;
  player.vx        = (player.facingRight ? -4 : 4);
  spawnParticles(player.x, player.y, [255, 100, 100], 18);
}

function respawnOrGameOver() {
  lives--;
  if (lives <= 0) {
    lives        = MAX_LIVES;
    gameOverFade = 0;
    startFadeOut("gameover");
  } else {
    // 현재 스테이지 재시작 (카메라 유지 안 함 - 처음부터)
    if (currentStage === 1) loadStage1();
    else                    loadStage2();
    gameState = "game";
  }
}

// ─── 카메라 ───────────────────────────────────────────────
function updateCamera() {
  let targetX = player.x - width * 0.38;
  cameraX = lerp(cameraX, targetX, 0.09);
  cameraX = max(cameraX, 0);
  cameraX = min(cameraX, worldWidth - width);
}

// ─── 숭냥이 드로우 ────────────────────────────────────────
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

// ─── CLEAR ────────────────────────────────────────────────
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

// ─── ENDING ───────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════
//  STAGE DATA
// ═══════════════════════════════════════════════════════════
function loadStage1() {
  bgBrightness = 20;
  bricks = []; obstacles = []; fallingObstacles = [];
  movPlatforms = []; coins = []; particles = [];
  score = 0;

  player.x = 100; player.y = 200;
  player.vx = 0; player.vy = 0;
  player.alive = true; player.invincible = 0;
  lives = MAX_LIVES;
  cameraX = 0;

  // 발판 배치 (type: stone / wood / ice / metal)
  let pData = [
    // x,    y,    w,   h,   type
    [250,  380,  180,  20,  "wood"],
    [480,  330,  140,  20,  "stone"],
    [660,  280,  120,  20,  "wood"],
    [820,  330,  100,  20,  "stone"],
    [970,  270,  160,  20,  "wood"],
    [1180, 310,  120,  20,  "stone"],
    [1350, 250,  160,  20,  "wood"],
    [1560, 300,  140,  20,  "stone"],
    [1760, 240,  130,  20,  "wood"],
    [1950, 290,  150,  20,  "stone"],
    [2200, 230,  180,  20,  "wood"],
    [2450, 350,  140,  20,  "stone"],
    [2650, 290,  120,  20,  "wood"],
    [2850, 220,  150,  20,  "stone"],
    [3100, 280,  160,  20,  "wood"],
    [3350, 200,  130,  20,  "stone"],
    [3560, 260,  140,  20,  "wood"],
    [3780, 310,  180,  20,  "stone"],
    [3980, 240,  150,  20,  "wood"],
    [4250, 300,  200,  20,  "stone"],
    [4500, 250,  160,  20,  "wood"],
  ];
  for (let d of pData) bricks.push({ x:d[0], y:d[1], w:d[2], h:d[3], type:d[4] });

  // 움직이는 발판
  movPlatforms.push({x:550, y:360, w:120, h:20, spd:1.4, dir:1, minX:430, maxX:680});
  movPlatforms.push({x:1500,y:300, w:110, h:20, spd:1.6, dir:-1,minX:1400,maxX:1620});
  movPlatforms.push({x:2900,y:260, w:110, h:20, spd:1.8, dir:1, minX:2780,maxX:3050});
  movPlatforms.push({x:4100,y:310, w:110, h:20, spd:2.0, dir:-1,minX:3980,maxX:4260});

  // 장애물(가시)
  obstacles.push({x:760,  y: groundY - 30, w:80,  h:30});
  obstacles.push({x:1200, y: groundY - 30, w:60,  h:30});
  obstacles.push({x:2000, y: groundY - 30, w:100, h:30});
  obstacles.push({x:3200, y: groundY - 30, w:80,  h:30});
  obstacles.push({x:4000, y: groundY - 30, w:60,  h:30});

  // 낙하 장애물
  [1800, 2600, 3400, 4300].forEach(fx => {
    fallingObstacles.push({x:fx - 30, y:0, originalY:0, w:60, h:60, vy:0, triggered:false, landed:false, slide:false});
  });
  // 슬라이딩 낙하물
  fallingObstacles.push({x:2200, y:0, originalY:0, w:60, h:60, vy:0, triggered:false, landed:false, slide:true, slideDir:1});

  // 코인 배치
  let coinPositions = [
    [300,350],[520,295],[690,245],[990,235],[1210,275],
    [1390,215],[1600,265],[1790,205],[2000,255],[2220,195],
    [2470,315],[2680,255],[2880,185],[3130,245],[3370,165],
    [3580,225],[3800,275],[4000,205],[4270,265],[4520,215],
  ];
  for (let [cx,cy] of coinPositions) coins.push({x:cx, y:cy, collected:false, anim:random(TWO_PI)});
}

function loadStage2() {
  bgBrightness = 20;
  bricks = []; obstacles = []; fallingObstacles = [];
  movPlatforms = []; coins = []; particles = [];
  score = 0;

  player.x = 100; player.y = 200;
  player.vx = 0; player.vy = 0;
  player.alive = true; player.invincible = 0;
  lives = MAX_LIVES;
  cameraX = 0;

  // 발판 (더 좁고 많은 간격)
  let pData = [
    [200,  370,  140,  20,  "stone"],
    [390,  310,  110,  20,  "wood"],
    [540,  260,  100,  20,  "stone"],
    [680,  310,  100,  20,  "wood"],
    [820,  240,  120,  20,  "stone"],
    [1000, 290,  100,  20,  "wood"],
    [1150, 220,  110,  20,  "stone"],
    [1320, 270,  100,  20,  "wood"],
    [1490, 200,  130,  20,  "stone"],
    [1700, 260,  110,  20,  "wood"],
    [1900, 310,  100,  20,  "stone"],
    [2080, 230,  120,  20,  "wood"],
    [2300, 180,  140,  20,  "stone"],
    [2520, 260,  110,  20,  "wood"],
    [2720, 200,  120,  20,  "stone"],
    [2940, 280,  100,  20,  "wood"],
    [3120, 210,  130,  20,  "stone"],
    [3360, 170,  140,  20,  "wood"],
    [3600, 230,  120,  20,  "stone"],
    [3830, 290,  110,  20,  "wood"],
    [4060, 210,  130,  20,  "stone"],
    [4300, 260,  150,  20,  "wood"],
    [4550, 200,  160,  20,  "stone"],
  ];
  for (let d of pData) bricks.push({x:d[0],y:d[1],w:d[2],h:d[3],type:d[4]});

  // 움직이는 발판 (더 빠름)
  movPlatforms.push({x:300,  y:380, w:100, h:20, spd:2.0, dir:1,  minX:200,  maxX:430});
  movPlatforms.push({x:770,  y:310, w:100, h:20, spd:2.2, dir:-1, minX:660,  maxX:880});
  movPlatforms.push({x:1400, y:250, w:100, h:20, spd:2.4, dir:1,  minX:1280, maxX:1550});
  movPlatforms.push({x:2150, y:200, w:100, h:20, spd:2.6, dir:-1, minX:2030, maxX:2280});
  movPlatforms.push({x:3000, y:230, w:100, h:20, spd:2.8, dir:1,  minX:2880, maxX:3150});
  movPlatforms.push({x:3700, y:260, w:100, h:20, spd:2.5, dir:-1, minX:3580, maxX:3870});
  movPlatforms.push({x:4200, y:290, w:100, h:20, spd:3.0, dir:1,  minX:4060, maxX:4380});

  // 장애물(가시) - 더 많음
  [700,1060,1560,2000,2540,3000,3440,4000,4420].forEach(ox => {
    obstacles.push({x:ox, y:groundY - 30, w:70, h:30});
  });

  // 낙하 장애물 - 더 많고 빽빽함
  [1600,2100,2600,3000,3500,3900].forEach(fx => {
    fallingObstacles.push({x:fx - 30, y:0, originalY:0, w:60, h:60, vy:0, triggered:false, landed:false, slide:false});
  });
  // 슬라이딩 낙하물 2개
  fallingObstacles.push({x:2300, y:0, originalY:0, w:60, h:60, vy:0, triggered:false, landed:false, slide:true, slideDir:1});
  fallingObstacles.push({x:4100, y:0, originalY:0, w:60, h:60, vy:0, triggered:false, landed:false, slide:true, slideDir:-1});

  // 코인 (더 많음, 까다로운 위치)
  let cp = [
    [240,340],[410,275],[560,225],[840,205],[1020,255],
    [1170,185],[1340,235],[1510,165],[1720,225],[1920,275],
    [2100,195],[2320,145],[2540,225],[2740,165],[2960,245],
    [3140,175],[3380,135],[3620,195],[3850,255],[4080,175],
    [4320,225],[4570,165],
  ];
  for (let [cx,cy] of cp) coins.push({x:cx, y:cy, collected:false, anim:random(TWO_PI)});
}

// ═══════════════════════════════════════════════════════════
//  INPUT
// ═══════════════════════════════════════════════════════════
function keyPressed() {
  // 인트로 → 로비
  if (gameState === "intro" && keyCode === ENTER) {
    startFadeOut("lobby");
    return;
  }

  // 로비에서 키 선택 (선택적)
  if (gameState === "lobby") {
    if (key === '1') { currentStage=1; loadStage1(); startFadeOut("game"); }
    if (key === '2') { currentStage=2; loadStage2(); startFadeOut("game"); }
  }

  // 게임 - 점프
  if (gameState === "game" && (key === ' ' || keyCode === UP_ARROW || keyCode === 87)) {
    if (player.grounded || coyoteTimer > 0) {
      executeJump();
    } else if (player.doubleJumpAvail) {
      // 더블 점프
      player.vy = player.jumpPower * 0.88;
      player.doubleJumpAvail = false;
      spawnParticles(player.x, player.y, [100, 200, 255], 8);
    } else {
      // 점프 버퍼 예약
      jumpBuffer = JUMP_BUF_MAX;
    }
  }

  // 클리어 → 다음
  if (gameState === "clear" && keyCode === ENTER) {
    if (currentStage === 1) {
      currentStage = 2;
      loadStage2();
      startFadeOut("game");
    } else {
      startFadeOut("ending");
    }
  }

  // 게임오버 / 엔딩 → 인트로
  if ((gameState === "gameover" || gameState === "ending") && keyCode === ENTER) {
    lives = MAX_LIVES; score = 0;
    startFadeOut("intro");
  }
}

function mousePressed() {
  // 인트로 클릭
  if (gameState === "intro") {
    startFadeOut("lobby");
    return;
  }

  // 로비 카드 클릭
  if (gameState === "lobby") {
    // 스테이지 1 카드
    if (mouseX > width/2 - 220 && mouseX < width/2 + 160 &&
        mouseY > 180 && mouseY < 420) {
      currentStage = 1; loadStage1(); startFadeOut("game");
    }
    // 스테이지 2 카드
    if (mouseX > width/2 + 30 && mouseX < width/2 + 410 &&
        mouseY > 180 && mouseY < 420) {
      currentStage = 2; loadStage2(); startFadeOut("game");
    }
  }

  // 클리어 버튼
  if (gameState === "clear" && clearFade > 80) {
    let bx = width/2 - 160, by = height/2 + 20, bw = 320, bh = 80;
    if (mouseX > bx && mouseX < bx+bw && mouseY > by && mouseY < by+bh) {
      if (currentStage === 1) {
        currentStage = 2; loadStage2(); startFadeOut("game");
      } else {
        startFadeOut("ending");
      }
    }
  }
}

// ─── 전체화면 & 리사이즈 ──────────────────────────────────
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height - 80;
  generateBgParticles();
}