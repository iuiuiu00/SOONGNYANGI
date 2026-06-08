// ── [전역 인벤토리 시스템 변수] ──────────────────────────────────
let inventory = [];        // 획득한 아이템 ID(문자열)들이 담기는 배열
const INV_MAX_SLOTS = 6;   // 최대 인벤토리 슬롯 수
let isInvOpen = false;     // 인벤토리 UI가 화면에 열려있는지 여부

// 게임 내 전체 아이템 도감 데이터 (디자인 및 설명 정의)
const ITEM_DATABASE = {
  'key1':   { name: '교실 열쇠',   desc: '뒷문이 굳게 닫힌 교실을 열 수 있을 것 같다.', color: '#F1C40F' },
  'coin':   { name: '500원 동전',  desc: '자판기나 생협에서 쓸 수 있을 것 같은 동전.', color: '#BDC3C7' },
  'usb':    { name: '보안 USB',    desc: '신양관 노트북에 꽂을 수 있는 암호화 데이터.', color: '#3498DB' },
  'sn_code':{ name: '메모 조각',   desc: '비상구 비밀번호의 힌트가 적혀 있다.',     color: '#ECF0F1' },
  'battery':{ name: '보조배터리', desc: '방전된 장치를 1회 충전할 수 있다.',       color: '#2ECC71' },
  'churu':  { name: '츄르',       desc: '냥이가 좋아할 츄르. 얻으면 인벤토리에 추가된다.', color: '#E67E22' },
  'plushie':{ name: '슝슝이 인형', desc: '희귀한 슝슝이 인형. 인벤토리에 소중히 보관한다.', color: '#F39C12' }
  , 'textbook': { name: '전공책', desc: '낡은 전공책. 이건... 이스터에그인가?', color: '#8E44AD' }
};

// UI 레이아웃 상수
const SLOT_SIZE = 40;
const SLOT_GAP = 6;
const INV_X = W/2 - ((SLOT_SIZE * INV_MAX_SLOTS + SLOT_GAP * (INV_MAX_SLOTS - 1)) / 2);
const INV_Y = H - SLOT_SIZE - 10;

// ── [기능 함수들] ──────────────────────────────────────────────

/**
 * 아이템 획득 함수 (예: 얻었을 때 itemGain('key1'); 호출)
 */
function itemGain(itemId) {
  if (!ITEM_DATABASE[itemId]) return false;
  
  // 이미 가지고 있는지 체크 (중복 획득 방지 원할 경우)
  if (inventory.includes(itemId)) return false;

  if (inventory.length < INV_MAX_SLOTS) {
    inventory.push(itemId);
    // 신양관 등에서 쓰던 하단 힌트 알림창이 있다면 연동
    if (typeof snState !== 'undefined') {
      snState.hint = `[${ITEM_DATABASE[itemId].name}]을(를) 획득했다!`;
      snState.hintTimer = 120;
    }
    return true;
  } else {
    if (typeof snState !== 'undefined') {
      snState.hint = "가방이 가득 찼습니다!";
      snState.hintTimer = 120;
    }
    return false;
  }
}

/**
 * 아이템 사용/삭제 함수 (예: 열쇠 쓰고 없앨 때 itemUse('key1'); 호출)
 */
function itemUse(itemId) {
  const index = inventory.indexOf(itemId);
  if (index > -1) {
    inventory.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * 아이템 보유 여부 확인 함수
 */
function itemHas(itemId) {
  return inventory.includes(itemId);
}

/**
 * 인벤토리 상시/토글 UI 그리기 (draw()의 맨 마지막 부분에서 호출 권장)
 */
function drawInventoryUI() {
  // sinyangkwan 씬을 포함해 게임 플레이 화면에서는 인벤토리를 항상 표시합니다.
  // title/introlocation/ending/sn_blackout 등 연출용 씬만 숨깁니다.
  if (scene === 'title' || scene === 'intro_location' || scene === 'ending' || scene === 'sn_blackout') return;

  // 대사/컷신이 열릴 때만 숨깁니다.
  if (typeof isDialogueOpen !== 'undefined' && isDialogueOpen) return;
  if (typeof dialogueOpen !== 'undefined' && dialogueOpen) return;
  if (typeof isCutscene !== 'undefined' && isCutscene) return;
  if (typeof inCutscene !== 'undefined' && inCutscene) return;
  if (typeof dialogueText !== 'undefined' && dialogueText !== '') return;
  if (scene === 'classroom' && typeof clsDead !== 'undefined' && clsDead) return;
  if (scene === 'churu' || scene === 'prof') return;

  // 3. [필터링] 신양관 내부 UI(노트북 창, 도어락 창)가 커다랗게 열려있을 때도 가려주기
  if (typeof snState !== 'undefined') {
    if (snState.laptopOpen || snState.doorOpen) return;
  }

  // ── 여기서부터 실제 그리기 로직 (위의 조건들을 다 통과해야만 그려짐) ──
  push();
  rectMode(CORNER);
  textAlign(LEFT, TOP);
  textSize(10);
  textFont('monospace');

  for (let i = 0; i < INV_MAX_SLOTS; i++) {
    let sx = INV_X + i * (SLOT_SIZE + SLOT_GAP);
    let sy = INV_Y;

    let isHover = (mouseX > sx && mouseX < sx + SLOT_SIZE && mouseY > sy && mouseY < sy + SLOT_SIZE);
    
    stroke(60);
    strokeWeight(2);
    fill(isHover ? color(60, 63, 70, 220) : color(45, 48, 55, 220));
    rect(sx, sy, SLOT_SIZE, SLOT_SIZE, 6);
    
    noStroke();
    fill(140);
    text(i + 1, sx + 4, sy + 4);

    if (i < inventory.length) {
      let itemId = inventory[i];
      let item = ITEM_DATABASE[itemId];

        if (item) {
          if (itemId === 'key1') {
            const ix = sx + SLOT_SIZE / 2;
            const iy = sy + SLOT_SIZE / 2 + 2;
            noStroke();
            fill(185,160,44);
            rect(ix - 8, iy, 14, 4, 2);
            rect(ix + 4, iy, 4, 3, 1);
            rect(ix + 4, iy + 4, 4, 3, 1);
            fill(195,170,50);
            rect(ix - 10, iy - 8, 10, 10, 2);
            fill(205,205,200);
            rect(ix - 9, iy - 7, 8, 8, 2);
            fill(195,170,50);
            rect(ix - 8, iy - 6, 6, 6, 2);
            fill(205,205,200);
            rect(ix - 7, iy - 5, 4, 4, 2);
          } else if (itemId === 'churu') {
            const ix = sx + SLOT_SIZE / 2;
            const iy = sy + SLOT_SIZE / 2 + 2;
            noStroke();
            fill(245,235,230);
            rect(ix - 9, iy - 16, 18, 32, 4);
            fill(72,140,80);
            rect(ix - 9, iy - 16, 18, 10, 4);
            fill(55,110,62);
            rect(ix - 7, iy - 18, 14, 6);
            triangle(ix - 3, iy - 18, ix + 3, iy - 18, ix, iy - 24);
          } else if (itemId === 'plushie') {
          const ix = sx + SLOT_SIZE / 2;
          const iy = sy + SLOT_SIZE / 2;
          noStroke();
          
          fill(255);
          ellipse(ix, iy + 6, 24, 20);
          
          ellipse(ix, iy - 6, 18, 18);
          } else if (itemId === 'textbook') {
            const ix = sx + SLOT_SIZE / 2;
            const iy = sy + SLOT_SIZE / 2 + 2;
            noStroke();
            fill(140,85,165);
            rect(ix - 10, iy - 10, 20, 20, 3);
            fill(110,55,135);
            rect(ix - 10, iy - 10, 4, 20, 2);
            fill(230,220,180);
            rect(ix - 4, iy - 6, 10, 12, 2);
            stroke(180,170,140);
            strokeWeight(1);
            line(ix - 2, iy - 2, ix + 2, iy - 2);
            line(ix - 2, iy + 2, ix + 2, iy + 2);
            noStroke();
        } else {
          fill(item.color);
          stroke(255, 150);
          strokeWeight(1);
          rect(sx + 8, sy + 8, SLOT_SIZE - 16, SLOT_SIZE - 16, 2);
        }

        if (isHover) {
        
          push();
          textAlign(CENTER, BOTTOM);
          
          noStroke();
          fill(240);
          if (itemId === 'textbook') {
              textSize(11);
              text(item.name, sx + SLOT_SIZE / 2, sy - 28);
              textSize(9);
              text('누군가의 낙서의 흔적이 보인다.', sx + SLOT_SIZE / 2, sy - 16);
              text('"오렌지주스 먹고싶다..."', sx + SLOT_SIZE / 2, sy - 4);
            } else {
              textSize(11);
              text(item.name, sx + SLOT_SIZE / 2, sy - 6);
            }
          
          pop();
        }
      }
    }
  }
  // 이스터에그 획득 현황 표시 (상단 중앙)
  const eggItems = ['plushie', 'churu', 'textbook'];
  const eggCount = inventory.filter(id => eggItems.includes(id)).length;
  const eggText = `획득한 이스터에그 ${eggCount}/${eggItems.length}`;
  noStroke();
  fill(220);
  textSize(10);
  textAlign(CENTER, TOP);
  text(eggText, W / 2, 10);
  pop();
}

/**
 * 아이템 마우스 오버 툴팁 내장 함수
 */
function drawInventoryTooltip(item) {
  let tx = mouseX + 12;
  let ty = mouseY + 12;
  let tw = 160;
  let th = 50;

  // 화면 경계 밖으로 나가지 않도록 조정
  if (tx + tw > width) tx = mouseX - tw - 12;
  if (ty + th > height) ty = height - th - 12;
  if (ty < 0) ty = 0;

  push();
  stroke(200);
  strokeWeight(1);
  fill(10, 240);
  rect(tx, ty, tw, th, 4);

  // 아이템 이름
  noStroke();
  fill(item.color);
  textStyle(BOLD);
  text(item.name, tx + 8, ty + 6);

  // 아이템 설명
  fill(200);
  textStyle(NORMAL);
  textSize(9);
  text(item.desc, tx + 8, ty + 22, tw - 16, th - 26);
  pop();
}

/**
 * 키보드 단축키로 아이템을 즉시 사용하는 이벤트 매핑 (필요 시 선택 사항)
 * 1번~5번 키를 누르면 해당 슬롯의 아이템 사용 로직 작동
 */
function handleInventoryKeyPress(k) {
  if (k >= '1' && k <= String(INV_MAX_SLOTS)) {
    let idx = int(k) - 1;
    if (idx < inventory.length) {
      let usedItemId = inventory[idx];
      executeItemAction(usedItemId);
    }
  }
}
function handleInventoryClick(mx, my) {
  if (my < INV_Y || my > INV_Y + SLOT_SIZE) return false;

  const slotArea = SLOT_SIZE + SLOT_GAP;
  let idx = floor((mx - INV_X) / slotArea);
  if (idx < 0 || idx >= INV_MAX_SLOTS) return false;

  let slotLeft = INV_X + idx * slotArea;
  if (mx < slotLeft || mx > slotLeft + SLOT_SIZE) return false;
  if (idx >= inventory.length) return false;

  executeItemAction(inventory[idx]);
  return true;
}

/**
 * 아이템별 사용했을 때 일어나는 인게임 효과 정의 구역
 */
function executeItemAction(itemId) {
  switch (itemId) {
    case 'battery':
      if (typeof snState !== 'undefined' && snState.timerDead) {
        snState.timerDead = false; // 신양관 방전 연출 해제
        itemUse('battery');       // 사용 후 소모
        snState.hint = "보조배터리로 노트북 전원을 켰다!";
        snState.hintTimer = 120;
      } else {
        snState.hint = "지금은 사용할 필요가 없다.";
        snState.hintTimer = 90;
      }
      break;
      
    case 'key1':
      if (scene === 'corridor' && nearDoor && nearDoorIdx > -1 && rooms[nearDoorIdx].type === 'churu') {
        if (!clsKey1Used) {
          clsKey1Used = true;
          itemUse('key1');
          if (typeof snState !== 'undefined') {
            snState.hint = "교실 앞 잠긴 문을 열었다!";
            snState.hintTimer = 120;
          }
        } else if (typeof snState !== 'undefined') {
          snState.hint = "이미 문이 열려 있다.";
          snState.hintTimer = 120;
        }
      } else {
        if (typeof snState !== 'undefined') {
          snState.hint = "아직 사용할 곳이 없다.";
          snState.hintTimer = 120;
        }
      }
      break;

    default:
      if (typeof snState !== 'undefined') {
        snState.hint = `[${ITEM_DATABASE[itemId].name}]은(는) 직접 쓸 수 없고 특정 장소에서 연동됩니다.`;
        snState.hintTimer = 120;
      }
      break;
  }
} 