let bgm;
let schoolImg;

function preload() {
  preloadMusic();
  schoolImg = loadImage('school.png');
}

function setup() {
  createCanvas(W, H);
  pixelDensity(1);
  noSmooth();
  textFont('monospace');
 playBGM();
  MBX = W - 36;
}

function doRestart() {
  scene = 'intro_location';
  seqTimer = 0;
  clsKey1Got = false;
  
  cat = { x:140, y:floorY-32, vx:0, vy:0, onGround:false, dir:1, stepT:0};
  
  camX = 0; 
  sliding = false;
  menuOpen = false;
}

function draw() {
  seqTimer++;

  // ── 인트로들
  if (scene === 'intro_location') {
    background(0);
    
    let a = 255;
    if (seqTimer < 30)
      a = map(seqTimer, 0, 30, 0, 255);
    
    if (seqTimer > 150)
      a = map(seqTimer, 150, 180, 255, 0);

    fill(200,196,188,a);
    textSize(18);
    textAlign(CENTER,CENTER);
    text('조만식기념관', W/2, H/2);

    if (seqTimer >= 180) {
      scene = 'corridor';
      seqTimer = 0;
      cat.x = 140;
      cat.y = floorY - 32;
    }
    return;
  }

  if (scene === 'intro_cls') {
    background(0);
    
    let a = 255;
    if (seqTimer < 40)
      a = map(seqTimer, 0, 40, 0, 255);
    
    if (seqTimer > 260)
      a = map(seqTimer, 260, 300, 255, 0);

    fill(200,196,188,a);
    textSize(14);
    textAlign(CENTER,CENTER);
    text('저기 앞에 열쇠다', W/2, H/2);

    if (seqTimer >= 300) {
      scene = 'fadein';
      fadingTo = 'classroom';
      fadeAlpha = 255;
    }
    return;
  }

  if (scene === 'pit_exclaim') {
    background(0);
    
    let a = 255;
    
    if (seqTimer < 30) 
      a = map(seqTimer, 0, 30, 0, 255);

    if (seqTimer > 260) 
      a = map(seqTimer, 260, 300, 255, 0);

    fill(220,35,35,a);
    textSize(52);
    textAlign(CENTER,CENTER);
    text('!!', W/2, H/2);

    if (seqTimer >= 300) {
      scene = 'intro_cs';
      seqTimer = 0;
    }
    return;
  }

  if (scene === 'intro_cs') {
    background(175,173,170);
    
    for(let y = 0; y < H; y++) {
      fill(185, 183, 180, map(y,0,H,35,0));
      rect(0, y, W, 1);
    }

    let a = 255;
    
    if (seqTimer < 40)
      a = map(seqTimer, 0, 40, 0, 255);
    
    if (seqTimer > 260) 
      a = map(seqTimer, 260, 300, 255, 0);

    fill(50,48,46,a);
    textSize(14);
    textAlign(CENTER,CENTER);
    text('여기서 물건을 들고 가볼까?', W/2, H/2);

    if (seqTimer >= 300) {
      initCs();
      scene = 'fadein';
      fadingTo = 'coopsket';
      fadeAlpha = 255;
      seqTimer = 0;
    }
    return;
  }

  // ── 엔딩
  if (scene === 'ending_monologue') {
    background(0);
    endTimer++;
    
    for(let i = 0; i < endLines.length; i++) {
      let line = endLines[i];
      
      if (endTimer < line.d)
        break;

      let t = endTimer - line.d;
      let a = 255;

      if (t < 30)
        a = map(t, 0, 30, 0, 255);

      fill(200,196,188,a);
      textSize(14);
      textAlign(CENTER,CENTER);
      text(line.text, W/2, H/2 - 40 + i*40);
    }

    if (endTimer >= 460) {
      scene = 'ending_eye';
      seqTimer = 0;
    }
    return;
  }

  if (scene === 'ending_eye') {
    background(18,16,14);

    let open = constrain(map(seqTimer, 0, 90, 0, H/2), 0, H/2);

    fill(0);
    rect(0, 0, W, H/2 - open);
    
    fill(0);
    rect(0, H/2+open, W, H/2 + 1);

    stroke(8,6,6);
    strokeWeight(3);
    
    line(0, H/2 - open, W, H/2 - open);
    line(0, H/2 + open, W, H/2 + open);
    
    noStroke();

    if (seqTimer >= 110) {
      scene = 'ending_photo';
      seqTimer = 0;
    }
    return;
  }

  if (scene === 'ending_photo') {
    // 가을 캠퍼스 픽셀
    background(115,155,195);
    noStroke();

    fill(80,120,60);
    rect(0, H*0.45, W, H*0.55);
    
    fill(60,90,40);
    rect(0, H*0.6, W, H*0.4);

    fill(100,90,80);
    rect(W*0.25, H*0.15, W*0.18, H*0.35);
    
    fill(90,80,70);
    rect(W*0.44, H*0.1, W*0.22, H*0.4);

    fill(140,160,185);
    
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 4; j++)
        rect(W*0.27 + i*22, H*0.18 + j*22, 16, 14);
      
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 5; j++)
        rect(W*0.46 + i*26, H*0.14 + j*22, 18, 14);

    [
      [W*0.12, H*0.42],
      [W*0.72, H*0.38],
      [W*0.82, H*0.36],
      [W*0.18, H*0.44]
    ].forEach(([tx,ty]) => {
      fill(60,45,20);
      rect(tx-3, ty, 6, H*0.55 - ty + 20);
      
      fill(200,140,30,220);
      ellipse(tx, ty, 55, 65);
      
      fill(180,80,20,160);
      ellipse(tx+8, ty+10, 40, 50);
    });

    fill(160,110,20,180);
    
    for (let i = 0; i < 30; i++)
      ellipse(random(W), H*0.78 + random(H*0.2), 8, 5);

    if (seqTimer < 40) {
      fill(0, 0, 0, map(seqTimer, 0, 40, 255, 0));
      rect(0, 0, W, H);
    }

    if (seqTimer > 260) {
      fill(0, 0, 0, map(seqTimer, 260, 300, 0, 255));
      rect(0, 0, W, H);
    }

    if (seqTimer >= 300) {
      scene = 'credits';
      creditSY = H;
      seqTimer = 0;
    }
    return;
  }

  if (scene === 'credits') {
    background(0);
    
    creditSY -= 0.8;
    
    drawCredits();

    if (creditSY < -getCreditH())
      creditSY = H;
    
    return;
  }

  // ── 메인
  if (scene === 'corridor') {

    if (!sliding && !menuOpen)
      updateCorridor();
    else if (sliding)
      updateSlide();

    camX = lerp(camX, constrain(cat.x - W/2, 0, CW-W), 0.12);

    drawCorridor();

    if (sliding) {
      fill(0, 0, 0, slideAlpha*0.85);
      rect(0, 0, W, H);
    }

  } else if(scene === 'fadeout') {
    background(0);
    
    fadeAlpha = min(fadeAlpha + 10, 255);
    
    fill(0, 0, 0, fadeAlpha);
    rect(0, 0, W, H);

    if (fadeAlpha >= 255) {
      if (fadingTo === 'churu')
        initChuru();
      else if (fadingTo === 'prof')
        initProf();
      else if (fadingTo !== 'coopsket')
        initCorReturn();

      scene = 'fadein';
    }
  } else if(scene === 'fadein') {
    if (fadingTo === 'classroom') 
      drawClassroom(); 
    else if (fadingTo === 'churu') 
      drawChuru(); 
    else if (fadingTo === 'prof') 
      drawProf(); 
    else if (fadingTo === 'coopsket') 
      drawCoopsket(); 
    else 
      drawCorridor();

    fadeAlpha = max(fadeAlpha-8, 0);
    
    fill(0, 0, 0, fadeAlpha);
    rect(0, 0, W, H);

    if (fadeAlpha <= 0)
      scene = fadingTo === 'corridor' ? 'corridor' : fadingTo;
  } else if (scene === 'classroom'){
    if (!clsDead && !clsCleared)
      updateCls();
    if(clsDead)
      clsDeadA = min(clsDeadA+4, 255);
    drawClassroom();
    if (clsDead) {
      fill(0, 0, 0, clsDeadA);
      rect(0, 0, W, H);
      if (clsDeadA > 180) {
        fill(180, 60, 60);
        textSize(12);
        textAlign(CENTER,CENTER);
        text('...', W/2, H/2 - 10);

        fill(120, 110, 90);
        textSize(9);
        text('[R] 재시작', W/2, H/2+14);
      }
    }

    if (clsCleared) {
      clsClearA = min(clsClearA + 5, 255);
      fill(0, 0, 0, clsClearA);
      rect(0, 0, W, H);

      if (clsClearA >= 255) {
        initCorReturn();
        fadingTo = 'corridor';
        scene = 'fadein';
        fadeAlpha = 255;
      }
    }
  } else if (scene === 'churu') {
    drawChuru();
  } else if (scene === 'prof') {
    drawProf();
  } else if (scene === 'coopsket') {
    if (!menuOpen)
      updateCs();
    drawCoopsket();
    if (csCleared) {
      csClearA = min(csClearA + 2, 255);
      noStroke();
      for (let x = csEX; x < W; x++) {
        fill(255, 252, 245, map(x, csEX, W, csClearA*0.95, csClearA*0.1));
        rect(x, 0, 1, H);
      }

      if (csClearA > 200) {
        let wo = constrain(map(csClearA, 200, 255, 0, 255), 0, 255);
        fill(255, 255, 255, wo);
        rect(0, 0, W, H);
        
        if(wo >= 255) {
          scene = 'ending_monologue';
          endTimer = 0;
        }
      }
    }
  }

  if (['corridor','classroom','coopsket'].includes(scene)) {
    drawMenuBtn();
    
    if (menuOpen)
      drawMenuPopup();
  }
}




function preload() {
  soundFormats('mp3');
  bgm = loadSound('Void_Lantern.mp3');
  schoolImg = loadImage('school.png');
}

function setup() {
  createCanvas(W, H);
  pixelDensity(1);
  noSmooth();
  textFont('monospace');
  bgm.setVolume(0.5);
  bgm.loop();
}
