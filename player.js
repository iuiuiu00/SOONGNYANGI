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