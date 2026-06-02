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

function updateCamera() {
  let targetX = player.x - width * 0.38;
  cameraX = lerp(cameraX, targetX, 0.09);
  cameraX = max(cameraX, 0);
  cameraX = min(cameraX, worldWidth - width);
}