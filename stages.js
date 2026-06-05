const W = 680, H = 500, TILE = 16;
const CW = 2800, floorY = 380, ceilBase = 100;
const wallW = TILE, roomW = 280, startX = 300;

let camX = 0;

let nearDoor = false;
let nearDoorIdx = -1;

const walls = [
    {x: startX},
    {x: startX + wallW + roomW},
    {x: startX + wallW*2 + roomW*2},
    {x: startX + wallW*3 + roomW*3}
];
const rooms = [
  {x: startX + wallW + roomW*0.65, w:44, h:92, type:'classroom'},
  {x: startX + wallW*2 + roomW + roomW*0.65, w:44, h:92, type:'churu'},
  {x: startX + wallW*3 + roomW*2 + roomW*0.65, w:44, h:92, type:'prof'},
];

let enteredX = rooms[0].x;

const wins_c = [
  {x: startX + wallW + 14, y: ceilBase + 48, w:100, h:36},
  {x: startX + wallW*2 + roomW + 14, y: ceilBase + 48, w:100, h:36},
  {x: startX + wallW*3 + roomW*2 + 14, y: ceilBase + 48, w:100, h:36},
];

const pit = {x: startX + wallW*3 + roomW*3 + 120, w:80};

const clsFloorY = 390, clsCeilY = 80;

const cols = [150, 270, 400, 530], objTypes = ['chair', 'chair', 'tile', 'glass'];

// coopsket
const csGY = 420, csBTY = 200, csS1Y = 270, csS2Y = 310, csCY = 345;
const csBX = 20, csBW = 80, csS1X = 130, csS1W = 160, csS2X = 360, csS2W = 180, csCX = 570, csCW = 100, csEX = csCX + csCW;
const csSlots=[
    {id:'A', x:csCX+22, y:csCY-28, filled:false},
    {id:'D', x:csCX+68, y:csCY-28, filled:false}
];
const csItems=[
  {id:'A', col:[80,140,210], x:csS1X+30, y:csS1Y-16, onCash:false},
  {id:'B', col:[180,30,30], x:csS1X+90, y:csS1Y-16, onCash:false},
  {id:'C', col:[100,170,80], x:csS2X+30, y:csS2Y-16, onCash:false},
  {id:'D', col:[220,130,20], x:csS2X+90, y:csS2Y-16, onCash:false},
  {id:'E', col:[210,70,30], x:csS2X+150, y:csS2Y-16, onCash:false},
];

const profileLen = Math.ceil(CW / TILE) + 4;

const ceilProfile = [];

for (let i = 0; i < profileLen; i++) {
    let v = Math.sin(i*0.17)*10 + Math.sin(i*0.06)*8 + Math.sin(i*0.43)*4;
    
    ceilProfile.push(Math.max(0, Math.min(Math.round((v + 12) / TILE) * TILE, 28)));
}

const csPl = [
    {x1:csBX, x2:csBX+csBW, y:csBTY},
    {x1:csS1X, x2:csS1X+csS1W, y:csS1Y},
    {x1:csS2X, x2:csS2X+csS2W, y:csS2Y},
    {x1:csCX, x2:csCX+csCW, y:csCY},
    {x1:0, x2:W, y:csGY},
    ...mkDiag(csS1X+csS1W, csS1Y, csS2X, csS2Y, 20),
    ...mkDiag(csS2X+csS2W, csS2Y, csCX, csCY, 16)
];

let obstacles = [], spawnTimers = [0,18,36,54], clsKeyGot = false;
let clsDead = false, clsDeadA = 0, clsCleared = false, clsClearA = 0;
let csHeld = null, csCleared = false, csClearA = 0, csSP = false;

function initCls() {
    cat.x = W-40;
    cat.y = clsFloorY - 32;
    cat.vx = 0;
    cat.vy = 0;
    cat.dir = -1;
    
    obstacles = [];
    spawnTimers = [0,18,36,54];
    
    clsDead = false;
    clsDeadA = 0;
    
    clsCleared = false;
    clsClearA = 0;
    
    clsKeyGot = false;
}

function resetCls() {
    cat.x = W-40;
    cat.y = clsFloorY-32;
    cat.vx = 0;
    cat.vy = 0;
    cat.dir = -1;
    obstacles = [];
    spawnTimers = [0,18,36,54];
    clsDead = false;
    clsDeadA = 0;
    clsKeyGot = false;
}

function initCorReturn() {
    cat.x = enteredX;
    cat.y = floorY-32;
    cat.vx = 0;
    cat.vy = 0;
    cat.dir = -1;
    cat.onGround = true;
    camX = constrain(cat.x - W/2, 0, CW - W);
    sliding = false;
}

function initCs() {
    cat.x = csBX + csBW/2;
    cat.y = csBTY - 28;
    cat.vx = 0;
    cat.vy = 0;
    cat.dir = 1;
    cat.onGround = false;
    csHeld = null;
    csCleared = false;
    csClearA = 0;
    csSP = false;
    csSlots.forEach(s => s.filled = false);
    csItems[0].x = csS1X + 30;
    csItems[0].y = csS1Y - 16;
    csItems[0].onCash = false;

    csItems[1].x = csS1X + 90;
    csItems[1].y = csS1Y - 16;
    csItems[1].onCash = false;

    csItems[2].x = csS2X + 30;
    csItems[2].y = csS2Y - 16;
    csItems[2].onCash = false;

    csItems[3].x = csS2X + 90;
    csItems[3].y = csS2Y - 16;
    csItems[3].onCash = false;

    csItems[4].x = csS2X + 150;
    csItems[4].y = csS2Y - 16;
    csItems[4].onCash = false;
}