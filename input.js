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