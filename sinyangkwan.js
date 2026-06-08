// 상수
const SN_FLOOR   = 370;
const SN_TABLES  = [
  { x: 155, y: 340, w: 72, h: 26 },
  { x: 280, y: 340, w: 72, h: 26, laptop: true },
  { x: 405, y: 340, w: 72, h: 26 },
];
const SN_DOOR = { x: 610, y: 255, w: 24, h: 105 };

// 노트북 UI 상수
const SN_LW = 440, SN_LH = 340;
const SN_LX = (680 - SN_LW) / 2, SN_LY = (500 - SN_LH) / 2;
const SN_SBW = 130, SN_BARH = 34, SN_TIMERH = 28;
const SN_BODY_H = SN_LH - SN_BARH - SN_TIMERH;

// 잠금장치 UI 상수
const SN_DW = 230, SN_DH = 260;
const SN_DX = 680 / 2 - 115, SN_DY = 500 / 2 - 130;

// 하드코딩 비밀번호 → 상수로 분리
const SN_DOOR_CODE = '6554';

// 상태
let snState = {};
let sn_blackoutSeq = 0;
let sn_timerIv = null;

// ── 신양관 파일 데이터 ──────────────────────────────────────
const SN_FILES = {
  download: {
    label: '📁 download', path: '~/Downloads',
    files: [
      { n: '기조실_사진_001.jpg',        i: '🖼️', c: '[이미지 파일 묶음]\n기조실_사진_001.jpg ~ 010.jpg\n\n총 10개 파일\n미리보기를 불러올 수 없습니다.' },
      { n: '과제_최종.hwp',              i: '📄', c: '[한글 문서]\n⚠ 한글 뷰어가 설치되어 있지 않습니다.' },
      { n: '과제_최종_진짜최종.hwp',     i: '📄', c: '[한글 문서]\n⚠ 한글 뷰어가 설치되어 있지 않습니다.' },
      { n: '유튜브_다운로드(1).mp4',     i: '🎬', c: '[동영상 파일]\nQuickTime Player로 열 수 없습니다.' },
      { n: '영수증.pdf',                 i: '📕', c: '[PDF]\n영수증\n날짜: 2026.01.14\n품목: 편의점 간식 외\n합계: 12,400원' },
      { n: '모름.zip',                   i: '🗜️', c: '[압축 파일]\n압축 해제 권한이 없습니다.\n파일이 손상되었을 수 있습니다.' },
      { n: '설치파일.exe',               i: '⚙️', c: '[실행 파일]\n"설치파일.exe"는 Mac에서\n열 수 없는 응용 프로그램입니다.\n\n개발자를 확인할 수 없습니다.' },
    ]
  },
  important: {
    label: '📁 important', path: '~/Desktop/important',
    files: [
      { n: '여권사본.jpg',     i: '🖼️', c: '[이미지 파일]\n미리보기를 불러올 수 없습니다.' },
      { n: '인스타_비번.txt',  i: '📄', c: 'insta: @ssu_cat\npw: ilove***2024\n\n바꿔야지 바꿔야지...' },
      { n: '주민등록번호.txt', i: '📄', c: '000000-0000000\n\n(개인정보 포함 파일)' },
      { n: '증명사진_2022.jpg',i: '🖼️', c: '[이미지 파일]\n미리보기를 불러올 수 없습니다.' },
      { n: '공인인증서.zip',   i: '🗜️', c: '[압축 파일]\n비밀번호로 잠겨있습니다.' },
      { n: '카드번호.txt',     i: '📄', c: '신한카드\n**** **** **** 7842\n유효기간: 04/27\n\n(개인정보 포함 파일)' },
    ]
  },
  ssu: {
    label: '📁 ssu', path: '~/Desktop/ssu',
    files: [
      { n: '시간표.hwp',   i: '📄', c: '[한글 문서]\n⚠ 한글 뷰어가 설치되어 있지 않습니다.' },
      { n: '과목코드.txt', i: '📄', c: 'CSE3013 - 운영체제\nCSE4012 - 컴퓨터네트워크\nGEN0001 - 기독교의이해\nMTH2011 - 선형대수\n\n수강신청 코드 메모' },
      {
        n: '건물.pdf', i: '📕', answer: true,
        c: '숭실대학교 신양관 비상대피 안내\n\n[긴급 공지]\n모든 재학생 및 교직원은\n즉시 지정 장소로 대피하십시오.\n\n─────────────────\n신양관 비상구 잠금 해제 코드\n\n          ' + SN_DOOR_CODE + '\n\n─────────────────\n이 문서를 외부에 공유하지 마십시오.\n열람 후 즉시 파기 바랍니다.'
      },
    ]
  },
  vscode: {
    label: '🖥️ Visual Studio Code', path: '~/Desktop', special: 'vscode',
    content: 'Visual Studio Code  v1.88.0\n─────────────────────────\n\nEXPLORER\n  ▼ PROJECT\n    📄 main.py\n    📄 index.html\n    🎨 style.css\n\nPROBLEMS  TERMINAL  OUTPUT\n────────────────────────────\n\n$ python main.py\nTraceback (most recent call last):\n  File "main.py", line 1\n    from flask import Flask\nModuleNotFoundError: No module named \'flask\'\n\n$ pip install flask\nerror: externally-managed-environment\n× This environment is externally managed\n\n$ pip install flask --break-system-packages\nCollecting flask...\nSuccessfully installed flask-3.0.3\n\n$ python main.py\n * Running on http://127.0.0.1:5000\n * Debug mode: on\n\nERROR: Connection refused\nsqlalchemy.exc.OperationalError:\ncould not connect to server on port 5432\n\n$ git status\nOn branch main\n  modified:   main.py\n  modified:   index.html\nUntracked: .env  node_modules/ (14,847 files)\n\n$ npm run build\nERROR: Cannot find module \'./utils\'\n\n$ git commit -m "fix"\n[main 3f9a2c1] fix\n 2 files changed, 47 insertions(+)\n\n$ python main.py\n * Running on http://127.0.0.1:5000\nERROR in app: NoneType has no attribute \'execute\'\n\n$ _'
  }
};

const SN_APPS = [
  { ico: '🌐', lbl: 'Safari' },   { ico: '📧', lbl: 'Mail' },      { ico: '🗓️', lbl: 'Calendar' },
  { ico: '📝', lbl: 'Notes' },    { ico: '🎵', lbl: 'Music' },     { ico: '📸', lbl: '사진' },
  { ico: '📺', lbl: 'TV' },       { ico: '🗺️', lbl: '지도' },      { ico: '💬', lbl: '메시지' },
  { ico: '📞', lbl: 'FaceTime' }, { ico: '⚙️', lbl: '시스템 설정' }, { ico: '🔍', lbl: 'Spotlight' },
  { ico: '📂', lbl: 'Finder' },   { ico: '🖥️', lbl: 'VS Code' },   { ico: '🎮', lbl: 'Game Center' },
  { ico: '📊', lbl: 'Numbers' },  { ico: '📄', lbl: 'Pages' },     { ico: '🎬', lbl: 'iMovie' },
];

const SN_DESKTOP_FOLDERS = [
  { key: 'download',  ico: '📁', lbl: 'download' },
  { key: 'ssu',       ico: '📁', lbl: 'ssu' },
  { key: 'important', ico: '📁', lbl: 'important' },
  { key: 'vscode',    ico: '🖥️', lbl: 'Visual Studio Code' },
];

// ── 신양관 초기화 — snState 객체 일괄 초기화 ──────
function initSinyangkwan() {
  snState = {
    catX:       80,
    catY:       SN_FLOOR - 24,
    catVx:      0,
    catVy:      0,
    catDir:     1,
    catWf:      0,
    catWt:      0,
    catJump:    false,
    laptopOpen: false,
    doorOpen:   false,
    hasCode:    false,
    escaped:    false,
    timerSec:   60,
    timerStarted: false,
    timerDead:  false,
    batt:       100,
    hint:       '',
    hintTimer:  0,
    curSb:      'desktop',
    curFolder:  null,
    curFile:    null,
    input:      '',
    dpMsg:      '',
    dpMsgType:  '',
    uiScroll:   0,
    uiScrollMax:0,
  };

  // [수정 9] 별도 타이머 변수 초기화
  sn_blackoutSeq = 0;

  // [수정 1] 기존 interval 방어적으로 정리
  if (sn_timerIv) {
    clearInterval(sn_timerIv);
    sn_timerIv = null;
  }
}

// setInterval 방어 처리 — startTimer 내부에서도 이전 interval 정리
function sn_startTimer() {
  if (snState.timerStarted) return;
  if (sn_timerIv) { clearInterval(sn_timerIv); sn_timerIv = null; } // 방어 처리 추가
  snState.timerStarted = true;
  sn_timerIv = setInterval(() => {
    snState.timerSec--;
    snState.batt = Math.max(0, (snState.timerSec / 60) * 100);
    if (snState.timerSec <= 0) {
      clearInterval(sn_timerIv);
      sn_timerIv = null;
      snState.timerDead  = true;
      snState.laptopOpen = false;
      // [수정 4] wake-up 리셋 시 timerStarted도 false로 보장 (snDrawWakeup에서 처리)
      // sn_blackoutSeq는 snDrawWakeup()에서 증가
    }
  }, 1000);
}

function updateSinyangkwan() {
  // wake-up 연출 중에는 업데이트 스킵
  if (snState.timerDead && scene !== 'sinyangkwan') return;

  // [수정 2] escaped 플래그는 draw 루프 밖에서 씬 전환
  // setTimeout 내부에서 sn_escaped = true 후 다음 프레임에서 감지
  if (snState.escaped) {
    scene = 'sn_unlock';
    snUnlockTimer = 0;
    return;
  }

  if (!snState.laptopOpen && !snState.doorOpen && !snState.timerDead) {
    let moving = false;
    if (keyIsDown(LEFT_ARROW)  || keyIsDown(65)) { snState.catVx = -3; snState.catDir = -1; moving = true; }
    else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { snState.catVx = 3;  snState.catDir =  1; moving = true; }
    else snState.catVx = 0;

    if (keyIsDown(32) && !snState.catJump && snState.catY >= SN_FLOOR - 24) {
      snState.catJump = true;
      snState.catVy = -8;
    }

    if (snState.catJump) {
      snState.catY += snState.catVy;
      snState.catVy += 0.5;
      if (snState.catY >= SN_FLOOR - 24) {
        snState.catY = SN_FLOOR - 24;
        snState.catVy = 0;
        snState.catJump = false;
      }
    }

    snState.catX = constrain(snState.catX + snState.catVx, 20, W - 20);
    if (moving) {
      snState.catWt++;
      if (snState.catWt % 3 === 0) snState.catWf++;
    }
  }
}

function drawSinyangkwan() {
  // wake-up 연출(배터리 방전)
  if (snState.timerDead) {
    snDrawWakeup();
    return;
  }
  snDrawBg();
  snDrawAC();
  snDrawTables();
  snDrawDoor();
  snDrawCat();
  snDrawHints();
  snDrawHUD();
  if (snState.laptopOpen) snDrawLaptopUI();
  if (snState.doorOpen)   snDrawDoorUI();
  if (snState.hintTimer > 0) snState.hintTimer--;
}

// [수정 9] seqTimer 대신 sn_blackoutSeq 사용
function drawSnBlackout() {
  sn_blackoutSeq++;
  background(0);

  let alpha = 0;
  if (sn_blackoutSeq < 30)       alpha = map(sn_blackoutSeq, 0, 30, 0, 255);
  else if (sn_blackoutSeq < 200) alpha = 255;
  else                           alpha = map(sn_blackoutSeq, 200, 240, 255, 0);

  fill(200, 196, 188, alpha);
  textSize(14); textAlign(CENTER, CENTER);
  text('...', W / 2, H / 2);

  if (sn_blackoutSeq >= 240) {
    sn_blackoutSeq = 0;
    scene = 'corridor';
    initCorReturn();
    fadingTo  = 'corridor';
    fadeAlpha = 0;
  }
  textAlign(LEFT, BASELINE);
}

// [수정 4] wake-up 연출 — 리셋 시 timerStarted도 명시적으로 false 처리
function snDrawWakeup() {
  sn_blackoutSeq++; // [수정 9] sn_blackoutSeq 사용
  background(0);

  let alpha = 0;
  if (sn_blackoutSeq < 30)        alpha = map(sn_blackoutSeq, 0, 30, 0, 255);
  else if (sn_blackoutSeq < 330)  alpha = 255;
  else                            alpha = map(sn_blackoutSeq, 330, 360, 255, 0);

  fill(255, alpha); noStroke();
  textSize(18); textAlign(CENTER, CENTER);
  text('wake up', W / 2, H / 2 - 10);

  const barW = 120, bx = W / 2 - 60, by = H / 2 + 10;
  stroke(80, alpha); strokeWeight(1); noFill();
  rect(bx, by, barW, 2);

  const prog = sn_blackoutSeq < 30
    ? 0
    : constrain(map(sn_blackoutSeq, 30, 330, 0, barW), 0, barW);
  noStroke(); fill(150, alpha);
  rect(bx, by, prog, 2);

  if (sn_blackoutSeq >= 360) {
    // [수정 4] 배터리 방전 후 완전 리셋 — timerStarted 포함
    snState.timerSec     = 60;
    snState.timerDead    = false;
    snState.timerStarted = false; // 명시적 초기화 추가
    snState.batt         = 100;
    sn_blackoutSeq       = 0;
    // interval도 정리 (혹시 남아있을 경우)
    if (sn_timerIv) { clearInterval(sn_timerIv); sn_timerIv = null; }
  }
  textAlign(LEFT, BASELINE);
}

// ── 신양관 배경 ────────────────────────────────────────────
function snDrawBg() {
  background('#060810');
  fill('#09090f'); noStroke();
  rect(0, 0, W, 280);
  const panelW = W / 6;
  for (let c = 0; c < 6; c++) {
    const px = c * panelW;
    fill('#0a0a14'); rect(px, 0, panelW, 260);
    stroke('#181826'); strokeWeight(2); rect(px, 0, panelW, 260);
    stroke('#111120'); strokeWeight(0.5);
    line(px, 0, px, 130); line(px, 130, px + panelW, 130);
  }
  noFill(); stroke('#101018'); strokeWeight(1);
  line(0, 130, W, 130); line(0, 260, W, 260);
  noStroke(); fill('#0c0c18');
  rect(0, 260, W, SN_FLOOR - 260);
  fill('#14141e'); rect(0, 260, W, 5);
  fill('#0e0e18'); rect(0, 265, W, 4);
  fill('#08080f'); rect(0, SN_FLOOR, W, H - SN_FLOOR);
  fill('#111118'); rect(0, SN_FLOOR, W, 3);
  stroke('#1a1a28'); strokeWeight(0.5);
  for (let x = 0; x < W; x += 36) line(x, SN_FLOOR, x, H);
  for (let y = SN_FLOOR; y < H; y += 36) line(0, y, W, y);
  noStroke(); fill('#0d0d1a');
  rect(0, 268, W, 72);
  for (let i = 0; i < 5; i++) {
    const bx = 80 + i * 110;
    fill('#0a0a10'); rect(bx, 272, 85, 64);
    stroke('#161620'); strokeWeight(1); rect(bx, 272, 85, 64);
    noStroke(); fill('#0c0c14'); rect(bx + 2, 274, 81, 60);
    stroke('#181824'); strokeWeight(0.5);
    line(bx + 42, 272, bx + 42, 336);
    line(bx, 304, bx + 85, 304);
  }
}

function snDrawAC() {
  noStroke(); fill('#0e0e18');
  rect(28, 48, 92, 18);
  fill('#12121e'); rect(30, 50, 88, 14);
  stroke('#1e1e2e'); strokeWeight(0.5);
  for (let i = 0; i < 7; i++) line(32 + i * 12, 51, 32 + i * 12, 63);
  noStroke(); fill('#2a4a6e');
  textSize(8); textAlign(LEFT, CENTER);
  text('❄ 18°C', 38, 59);
}

function snDrawTables() {
  SN_TABLES.forEach(t => {
    noStroke(); fill('#111118');
    rect(t.x + 4, t.y + t.h, t.w - 8, 10);
    fill('#18181e'); rect(t.x, t.y, t.w, t.h);
    stroke('#eeeef0'); strokeWeight(1); rect(t.x, t.y, t.w, t.h);
    noStroke(); fill('#f0f0f2'); rect(t.x + 1, t.y + 1, t.w - 2, 6);
    if (t.laptop) {
      const lx = t.x + 8, ly = t.y - 16;
      fill('#777'); noStroke(); rect(lx, ly + 12, 56, 2);
      fill('#999'); rect(lx - 2, ly + 3, 60, 11);
      fill('#111'); rect(lx, ly + 4, 56, 9);
      fill(color(74, 138, 191, 150)); rect(lx + 1, ly + 5, 54, 7);
    }
  });
}

function snDrawDoor() {
  const d = SN_DOOR;
  noStroke();
  fill(snState.escaped ? '#081408' : '#100808');
  rect(d.x, d.y, d.w, d.h);
  stroke(snState.escaped ? '#2abf6a' : '#aa1111'); strokeWeight(2);
  rect(d.x, d.y, d.w, d.h);
  stroke(snState.escaped ? '#1a7a3a' : '#661111'); strokeWeight(0.5);
  line(d.x + d.w / 2, d.y + 8, d.x + d.w / 2, d.y + d.h - 8);
  textSize(12); textAlign(LEFT, CENTER); noStroke();
  text(snState.escaped ? '🔓' : '🔒', d.x + 5, d.y + 55);
}

function snDrawCat() {
  noStroke();
  drawCatPixel(
    snState.catX,
    snState.catY,
    snState.catDir,
    snState.catVx,
    snState.catWf,
    true
  );
}

function snDrawHints() {
  const lp      = SN_TABLES[1];
  const nearLap = abs(snState.catX - (lp.x + lp.w / 2)) < 75;
  if (nearLap && !snState.laptopOpen && !snState.escaped) {
    fill(color(180, 180, 220, 230)); noStroke();
    textSize(11); textAlign(CENTER, CENTER);
    text('[E] 노트북 열기', lp.x + lp.w / 2, lp.y - 28);
  }
  const nearD = abs(snState.catX - (SN_DOOR.x + SN_DOOR.w / 2)) < 60;
  if (nearD && snState.hasCode && !snState.doorOpen && !snState.escaped) {
    fill(color(74, 191, 138, 230)); noStroke();
    textSize(11); textAlign(CENTER, CENTER);
    text('[E] 비밀번호 입력', SN_DOOR.x + SN_DOOR.w / 2, SN_DOOR.y - 12);
  }
  if (snState.hintTimer > 0) {
    const a = constrain(snState.hintTimer / 30, 0, 1);
    fill(color(200, 180, 80, a * 255)); noStroke();
    textSize(11); textAlign(CENTER, CENTER);
    text(snState.hint, W / 2, SN_FLOOR + 24);
  }
  textAlign(LEFT, BASELINE);
}

function snDrawHUD() {
  fill('#222'); noStroke(); textSize(10); textAlign(LEFT, BASELINE);
  text('← → 이동  |  SPACE 점프  |  E 상호작용', 10, H - 10);
  if (snState.hasCode && !snState.escaped) {
    fill('#0d2a1e'); noStroke();
    rect(W - 132, H - 28, 122, 20, 3);
    fill('#4abf8a'); textSize(10);
    text('비번 확보: ' + SN_DOOR_CODE, W - 126, H - 14); // [수정 8] 상수 사용
  }
}

// ── 노트북 UI ───────────────────────────────────────────────
function snDrawLaptopUI() {
  fill(color(0, 0, 0, 224)); noStroke(); rect(0, 0, W, H);
  fill('#1e1e1e'); stroke('#3a3a3a'); strokeWeight(1);
  rect(SN_LX, SN_LY, SN_LW, SN_LH, 12);
  fill('#2d2d2d'); noStroke();
  rect(SN_LX, SN_LY, SN_LW, SN_BARH, 12, 12, 0, 0);
  fill('#ff5f57'); circle(SN_LX + 20, SN_LY + 17, 12);
  fill('#ffbd2e'); circle(SN_LX + 37, SN_LY + 17, 12);
  fill('#28c840'); circle(SN_LX + 54, SN_LY + 17, 12);

  const topPadding = 12;
  const batteryIconW = 28;
  const batteryIconH = 15;
  const batteryX = SN_LX + SN_LW - topPadding - batteryIconW - 36;
  const batteryY = SN_LY + 11;
  const batteryTextX = batteryX + batteryIconW + 10;

  stroke('#888'); strokeWeight(1);
  fill('#1e1e1e');
  rect(batteryX, batteryY, batteryIconW, batteryIconH, 3);
  rect(batteryX + batteryIconW, batteryY + 3, 4, batteryIconH - 6, 2);
  noStroke(); fill('#ff6b35');
  rect(batteryX + 2, batteryY + 2, (snState.batt / 100) * (batteryIconW - 4), batteryIconH - 4, 2);
  fill('#ff6b35'); textSize(11); textAlign(LEFT, CENTER);
  text('5%', batteryTextX, batteryY + batteryIconH / 2);

  fill('#888'); noStroke(); textSize(12); textAlign(CENTER, CENTER);
  text(snGetMacTitle(), SN_LX, SN_LY + 8, SN_LW, 24);

  // 사이드바 / 메인 뷰
  fill('#252525'); noStroke();
  rect(SN_LX, SN_LY + SN_BARH, SN_SBW, SN_BODY_H);
  snDrawSidebar();
  const fx = SN_LX + SN_SBW, fy = SN_LY + SN_BARH;
  const fw = SN_LW - SN_SBW, fh = SN_BODY_H;
  snDrawFinderMain(fx, fy, fw, fh);

  // 타이머바
  const ty = SN_LY + SN_LH - SN_TIMERH;
  fill('#161616'); noStroke();
  rect(SN_LX, ty, SN_LW, SN_TIMERH, 0, 0, 12, 12);
  stroke('#222'); strokeWeight(1); line(SN_LX, ty, SN_LX + SN_LW, ty);
  noStroke(); fill('#444'); textSize(10); textAlign(LEFT, CENTER);
  text('배터리', SN_LX + 12, ty + SN_TIMERH / 2);
  fill('#222'); rect(SN_LX + 52, ty + 12, SN_LW - 96, 3, 2);
  fill('#ff6b35'); rect(SN_LX + 52, ty + 12, (snState.batt / 100) * (SN_LW - 96), 3, 2);
  const m = Math.floor(snState.timerSec / 60), s = snState.timerSec % 60;
  fill('#ff6b35'); textAlign(RIGHT, CENTER); textSize(11);
  text(m + ':' + String(s).padStart(2, '0'), SN_LX + SN_LW - 8, ty + SN_TIMERH / 2);
  textAlign(LEFT, BASELINE);
}

function snGetMacTitle() {
  if (snState.curFile)   return snState.curFile.n;
  if (snState.curFolder) return SN_FILES[snState.curFolder]?.label || snState.curFolder;
  if (snState.curSb === 'apps') return '응용 프로그램';
  if (snState.curSb === 'dl')   return '다운로드';
  if (snState.curSb === 'hd')   return 'Macintosh HD';
  return 'Finder — 데스크탑';
}

function snDrawSidebar() {
  const sx = SN_LX, sy = SN_LY + SN_BARH;
  const items = [
    { id: 'desktop', lbl: '데스크탑',     col: '#5a8abf', section: 'favorite' },
    { id: 'apps',    lbl: '응용 프로그램', col: '#5abf8a', section: 'favorite' },
    { id: 'dl',      lbl: '다운로드',     col: '#bf8a5a', section: 'favorite' },
    { id: 'hd',      lbl: 'Macintosh HD', col: '#888',    section: 'device' },
    { id: 'tag_red', lbl: '빨간색',      col: '#f55b5b', section: 'tag' },
    { id: 'tag_green', lbl: '초록색',    col: '#5ccf8b', section: 'tag' },
  ];

  const sectionNames = {
    favorite: '즐겨찾기',
    device: '기기',
    tag: '태그',
  };

  textSize(11); textAlign(LEFT, CENTER);
  let lastSection = null;
  let lineIndex = 0;

  items.forEach((it) => {
    if (it.section !== lastSection) {
      const headingY = sy + 28 + lineIndex * 22 + ((it.section === 'device' || it.section === 'tag') ? 4 : 0);
      fill('#555'); noStroke();
      text(sectionNames[it.section], sx + 12, headingY);
      lastSection = it.section;
      lineIndex++;
    }

    const iy = sy + 30 + lineIndex * 22;
    const active = snState.curSb === it.id;
    if (active) { fill('#3a3a3a'); noStroke(); rect(sx, iy - 9, SN_SBW, 20); }
    fill(it.col); circle(sx + 17, iy + 1, 8);
    fill(active ? '#fff' : '#888'); textSize(11);
    text(it.lbl, sx + 28, iy + 1);
    lineIndex++;
  });
}

function snDrawFinderMain(fx, fy, fw, fh) {
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(fx, fy, fw, fh);
  drawingContext.clip();
  fill('#1e1e1e'); noStroke(); rect(fx, fy, fw, fh);
  if (snState.curFile)        snDrawFileContent(fx, fy, fw, fh);
  else if (snState.curFolder) snDrawFolderView(fx, fy, fw, fh);
  else                        snDrawFolderGrid(fx, fy, fw, fh);
  drawingContext.restore();
}

// [수정 3] draw 함수 내 상태 변경 제거
// 'dl' 사이드바 클릭 시 curFolder 설정은 snHandleLaptopClick에서만 처리
function snDrawFolderGrid(fx, fy, fw, fh) {
  let items;
  if (snState.curSb === 'apps')     items = SN_APPS;
  else if (snState.curSb === 'dl')  items = SN_FILES.download.files.map(f => ({ ico: f.i, lbl: f.n }));
  else if (snState.curSb === 'hd')  items = [
    { ico: '📁', lbl: '시스템' }, { ico: '📁', lbl: '라이브러리' },
    { ico: '📁', lbl: '사용자' }, { ico: '📁', lbl: '응용 프로그램' }
  ];
  else items = SN_DESKTOP_FOLDERS;

  const startX = fx + 10, startY = fy + 10 - snState.uiScroll;
  const IW = 72, IH = 60;
  const COLS = Math.floor(fw / (IW + 4));
  items.forEach((it, i) => {
    const c = i % COLS, r = Math.floor(i / COLS);
    const ix = startX + c * (IW + 4), iy = startY + r * (IH + 4);
    const hover = mouseX > ix && mouseX < ix + IW && mouseY > iy && mouseY < iy + IH;
    if (hover) { fill(color(255, 255, 255, 23)); noStroke(); rect(ix, iy, IW, IH, 6); }
    textSize(22); textAlign(CENTER, TOP);
    text(it.ico || it.ico, ix + IW / 2, iy + 8);
    fill('#ccc'); textSize(9);
    const lbl = it.lbl || it.label || '';
    text(lbl.length > 10 ? lbl.slice(0, 10) + '…' : lbl, ix + IW / 2, iy + 36);
  });
  snState.uiScrollMax = Math.max(0, Math.ceil(items.length / COLS) * (IH + 4) - fh + 20);
  textAlign(LEFT, BASELINE);
}

function snDrawFolderView(fx, fy, fw, fh) {
  const data = SN_FILES[snState.curFolder];
  if (!data) return;
  fill('#2a2a2a'); noStroke(); rect(fx, fy, fw, 28);
  stroke('#222'); line(fx, fy + 28, fx + fw, fy + 28);
  fill('#3a3a3a'); noStroke(); rect(fx + 8, fy + 6, 40, 16, 5);
  fill('#aaa'); textSize(10); textAlign(CENTER, CENTER);
  text('← 이전', fx + 28, fy + 14);
  fill('#555'); textAlign(LEFT, CENTER);
  text(data.path, fx + 56, fy + 14);
  const cy = fy + 28;

  // VS Code 특수 뷰
  if (data.special === 'vscode') {
    fill('#1a1a1a'); noStroke(); rect(fx, cy, fw, fh - 28);
    // [수정 10] VS Code 영역에 '스크롤 전용' 안내 표시
    fill('#444'); textSize(9); textAlign(RIGHT, CENTER);
    text('스크롤로 탐색', fx + fw - 8, fy + 20);
    fill('#9cdcfe'); textSize(9); textAlign(LEFT, TOP);
    data.content.split('\n').forEach((line, i) => {
      const ly = cy + 8 + i * 14 - snState.uiScroll;
      if (ly > cy && ly < fy + fh) text(line, fx + 8, ly);
    });
    snState.uiScrollMax = Math.max(0, data.content.split('\n').length * 14 - (fh - 28) + 16);
    textAlign(LEFT, BASELINE);
    return;
  }

  fill('#1a1a1a'); noStroke(); rect(fx, cy, fw, fh - 28);
  data.files.forEach((f, i) => {
    const iy = cy + 4 + i * 26 - snState.uiScroll;
    if (iy < cy - 26 || iy > fy + fh) return;
    const hover = mouseX > fx && mouseX < fx + fw && mouseY > iy && mouseY < iy + 26;
    if (hover) { fill(color(255, 255, 255, 20)); noStroke(); rect(fx, iy, fw, 26); }
    textSize(13); textAlign(LEFT, CENTER); text(f.i, fx + 8, iy + 13);
    fill('#ccc'); textSize(11); text(f.n, fx + 28, iy + 13);
  });
  snState.uiScrollMax = Math.max(0, data.files.length * 26 - (fh - 28) + 8);
  textAlign(LEFT, BASELINE);
}

function snDrawFileContent(fx, fy, fw, fh) {
  const f = snState.curFile;
  fill('#2a2a2a'); noStroke(); rect(fx, fy, fw, 28);
  stroke('#222'); line(fx, fy + 28, fx + fw, fy + 28);
  fill('#3a3a3a'); noStroke(); rect(fx + 8, fy + 6, 40, 16, 5);
  fill('#aaa'); textSize(10); textAlign(CENTER, CENTER);
  text('← 이전', fx + 28, fy + 14);
  fill('#555'); textAlign(LEFT, CENTER);
  const path = (SN_FILES[snState.curFolder]?.path || '~/Desktop') + '/' + f.n;
  text(path.length > 35 ? '…' + path.slice(-33) : path, fx + 56, fy + 14);
  const cy = fy + 28;
  fill('#1a1a1a'); noStroke(); rect(fx, cy, fw, fh - 28);
  fill(f.answer ? color('#4abf8a') : color('#bbbbbb'));
  textSize(10); textAlign(LEFT, TOP);
  f.c.split('\n').forEach((line, i) => {
    const ly = cy + 8 + i * 16 - snState.uiScroll;
    if (ly > cy - 16 && ly < fy + fh) text(line, fx + 10, ly);
  });
  snState.uiScrollMax = Math.max(0, f.c.split('\n').length * 16 - (fh - 28) + 16);
  textAlign(LEFT, BASELINE);
}

// ── 잠금장치 UI ────────────────────────────────────────────
function snDrawDoorUI() {
  fill(color(0, 0, 0, 230)); noStroke(); rect(0, 0, W, H);
  fill('#0a1520'); stroke('#1e3a5e'); strokeWeight(1);
  rect(SN_DX, SN_DY, SN_DW, SN_DH, 12);
  fill('#4a8abf'); noStroke(); textSize(12); textAlign(CENTER, CENTER);
  text('비상구 잠금장치', SN_DX + SN_DW / 2, SN_DY + 20);
  for (let i = 0; i < 4; i++) {
    const bx = SN_DX + 26 + i * 45;
    fill('#0d1a2a'); stroke('#1e3a5e'); strokeWeight(1.5);
    rect(bx, SN_DY + 35, 38, 46, 7);
    fill(snState.input[i] ? '#4abf8a' : '#2a5a8e');
    noStroke(); textSize(22); textAlign(CENTER, CENTER);
    text(snState.input[i] ? '●' : '_', bx + 19, SN_DY + 58);
  }
  const doorBtnW = 50;
  const doorBtnH = 42;
  const doorBtnGap = 12;
  const doorBtnRowGap = 40;
  const doorBtnStartX = SN_DX + (SN_DW - (doorBtnW * 3 + doorBtnGap * 2)) / 2;

  ['1','2','3','4','5','6','7','8','9','⌫','0','입력'].forEach((k, i) => {
    const c = i % 3, r = Math.floor(i / 3);
    const kx = doorBtnStartX + c * (doorBtnW + doorBtnGap);
    const ky = SN_DY + 90 + r * doorBtnRowGap;
    let bg = '#112030', bc = '#1e3a5e', fc = '#ccc';
    if (k === '입력') { bg = '#0d2a1e'; bc = '#1e5a3a'; fc = '#4abf8a'; }
    if (k === '⌫') fc = '#666';
    const hover = mouseX > kx && mouseX < kx + doorBtnW && mouseY > ky && mouseY < ky + doorBtnH;
    fill(hover ? color(30, 58, 94) : color(bg));
    stroke(bc); strokeWeight(1); rect(kx, ky, doorBtnW, doorBtnH, 7);
    fill(fc); noStroke(); textSize(k === '입력' ? 11 : 16); textAlign(CENTER, CENTER);
    text(k, kx + doorBtnW / 2, ky + doorBtnH / 2);
  });
  if (snState.dpMsg) {
    fill(snState.dpMsgType === 'err' ? '#ff6b35' : '#4abf8a');
    noStroke(); textSize(11); textAlign(CENTER, CENTER);
    text(snState.dpMsg, SN_DX + SN_DW / 2, SN_DY + SN_DH + 12);
  }
  fill('#444'); noStroke(); textSize(10); textAlign(CENTER, CENTER);
  text('닫기', SN_DX + SN_DW / 2, SN_DY + SN_DH - 8);
  textAlign(LEFT, BASELINE);
}

// ── 노트북 클릭 핸들러 ─────────────────────────────────────
function snHandleLaptopClick(mx, my) {
  // 닫기 버튼 (빨간 점)
  if (dist(mx, my, SN_LX + 20, SN_LY + 17) < 8) {
    snState.laptopOpen = false;
    return;
  }

  // [수정 3] 사이드바 클릭 — label이 눌렸을 때 실제 항목 위치에 맞춰 선택
  const sidebarItems = [
    { id: 'desktop', section: 'favorite' },
    { id: 'apps',    section: 'favorite' },
    { id: 'dl',      section: 'favorite' },
    { id: 'hd',      section: 'device'   },
    { id: 'tag_red', section: 'tag'      },
    { id: 'tag_green', section: 'tag'    },
  ];

  let lastSection = null;
  let lineIndex = 0;
  sidebarItems.forEach((item) => {
    if (item.section !== lastSection) {
      lastSection = item.section;
      lineIndex++;
    }

    const iy = SN_LY + SN_BARH + 30 + lineIndex * 22;
    if (mx > SN_LX && mx < SN_LX + SN_SBW && my > iy - 10 && my < iy + 10) {
      snState.curSb     = item.id;
      snState.curFolder = (item.id === 'dl') ? 'download' : null; // draw 밖에서 처리
      snState.curFile   = null;
      snState.uiScroll  = 0;
    }
    lineIndex++;
  });

  const fx = SN_LX + SN_SBW, fy = SN_LY + SN_BARH;
  const fw = SN_LW - SN_SBW;

  // 뒤로 버튼
  if (snState.curFile || snState.curFolder) {
    if (mx > fx + 8 && mx < fx + 48 && my > fy + 6 && my < fy + 22) {
      if (snState.curFile) {
        snState.curFile  = null;
        snState.uiScroll = 0;
      } else {
        snState.curFolder = null;
        snState.curFile   = null;
        snState.uiScroll  = 0;
      }
      return;
    }
  }

  // 데스크탑 폴더 그리드 클릭
  if (!snState.curFolder && snState.curSb === 'desktop') {
    const IW = 72, IH = 60;
    const COLS = Math.floor(fw / (IW + 4));
    SN_DESKTOP_FOLDERS.forEach((it, i) => {
      const c = i % COLS, r = Math.floor(i / COLS);
      const ix = fx + 10 + c * (IW + 4);
      const iy = fy + 10 + r * (IH + 4) - snState.uiScroll;
      if (mx > ix && mx < ix + IW && my > iy && my < iy + IH) {
        snState.curFolder = it.key;
        snState.curFile   = null;
        snState.uiScroll  = 0;
      }
    });
  // 폴더 내 파일 클릭
  } else if (snState.curFolder && !snState.curFile) {
    const data = SN_FILES[snState.curFolder];
    // [수정 10] VS Code 특수 폴더는 파일 클릭 불가 — 안내는 draw에서 처리
    if (!data || data.special) return;
    const cy = fy + 28;
    data.files.forEach((f, i) => {
      const iy = cy + 4 + i * 26 - snState.uiScroll;
      if (mx > fx && mx < fx + fw && my > iy && my < iy + 26) {
        snState.curFile  = f;
        snState.uiScroll = 0;
        // [수정 7] 정답 파일 처리 함수로 분리
        if (f.answer) snHandleAnswerFile(f);
      }
    });
  }
}

// [수정 7] 정답 파일 처리 — 별도 함수로 분리해 확장 용이
function snHandleAnswerFile(f) {
  snState.hasCode   = true;
  snState.hint      = '비상구 비밀번호를 확인했다!';
  snState.hintTimer = 180;
  // 필요 시 여기에 추가 퍼즐 처리 로직 삽입
}

// ── 잠금장치 클릭 핸들러 ───────────────────────────────────
function snHandleDoorClick(mx, my) {
  // 닫기
  if (mx > SN_DX + SN_DW / 2 - 20 && mx < SN_DX + SN_DW / 2 + 20 &&
      my > SN_DY + SN_DH - 16     && my < SN_DY + SN_DH) {
    snState.doorOpen = false;
    return;
  }
  const doorBtnW = 50;
  const doorBtnGap = 12;
  const doorBtnRowGap = 40;
  const doorBtnStartX = SN_DX + (SN_DW - (doorBtnW * 3 + doorBtnGap * 2)) / 2;

  ['1','2','3','4','5','6','7','8','9','⌫','0','입력'].forEach((k, i) => {
    const c = i % 3, r = Math.floor(i / 3);
    const kx = doorBtnStartX + c * (doorBtnW + doorBtnGap);
    const ky = SN_DY + 90 + r * doorBtnRowGap;
    if (mx > kx && mx < kx + doorBtnW && my > ky && my < ky + 42) snPressKey(k);
  });
}

// [수정 8] 비밀번호 비교에 SN_DOOR_CODE 상수 사용
function snPressKey(k) {
  if (k === '⌫') {
    snState.input = snState.input.slice(0, -1);
  } else if (k === '입력') {
    if (snState.input === SN_DOOR_CODE) {
      snState.dpMsg     = '✓ 잠금 해제!';
      snState.dpMsgType = 'ok';
      setTimeout(() => {
        snState.doorOpen = false;
        snState.escaped  = true;
      }, 700);
    } else {
      snState.dpMsg     = '✗ 잘못된 비밀번호';
      snState.dpMsgType = 'err';
      snState.input     = '';
    }
  } else {
    if (snState.input.length < 4) snState.input += k;
  }
}