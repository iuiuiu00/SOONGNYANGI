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