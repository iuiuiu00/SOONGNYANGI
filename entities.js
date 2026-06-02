function updateMovingPlatforms() {
  for (let mp of movPlatforms) {
    mp.x += mp.spd * mp.dir;
    if (mp.x < mp.minX || mp.x + mp.w > mp.maxX) mp.dir *= -1;
  }
}

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