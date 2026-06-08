let creditSY = 500;

const credits = [
  {t:'title', x:'FLARE'},
  {t:'subtitle', x:'Staff Roll'},
  {t:'spacer'},

  {t:'name', x:'민경준'},{t:'category', x:'코딩'},{t:'task', x:'BGM  ·  효과음 구현  ·  카메라 이동'},{t:'category', x:'디자인'},{t:'task', x:'초기 화면  ·  맵 디자인  ·  엔딩 화면'},{t:'category', x:'설계'},{t:'task', x:'신양관  ·  coopsket  ·  조만식 맵 설계'},{t:'spacer'},
  {t:'name', x:'서윤아'},{t:'category',x:'코딩'},{t:'task',x:'메인 캐릭터 움직임  ·  중간 저장 기능  ·  물리 엔진'},{t:'category',x:'디자인'},{t:'task',x:'이스터에그 & 아이템 & 장애물  ·  인벤토리'},{t:'category',x:'설계'},{t:'task',x:'물리 수치 설계'},{t:'spacer'},
  {t:'name', x:'김서정'},{t:'category',x:'코딩'},{t:'task',x:'물리 엔진 (충돌 처리)'},{t:'category',x:'디자인'},{t:'task',x:'캐릭터 디자인'},{t:'category',x:'설계'},{t:'task',x:'스토리 기획 (+ 대사)'},{t:'spacer'},{t:'spacer'},
  
];

function drawCredits(){
  let y = creditSY;

  for(let item of credits) {
    switch(item.t) {

      case 'title':
        fill(255);
        textSize(32);
        textAlign(CENTER,CENTER);
        text(item.x,W/2,y);
        y += 48;
        break;

      case 'subtitle':
        fill(100);
        textSize(11);
        textAlign(CENTER,CENTER);
        text(item.x.toUpperCase(),W/2,y);
        y += 60;
        break;

      case 'name':
        stroke(50);
        strokeWeight(0.5);
        line(W/2-80,y-8,W/2+80,y-8);

        noStroke();
        fill(255);
        textSize(18);
        textAlign(CENTER,CENTER);
        text(item.x,W/2,y+10);

        y += 36;
        break;

      case 'category':
        noStroke();
        fill(80);
        textSize(10);
        textAlign(CENTER,CENTER);
        text(item.x.toUpperCase(),W/2,y);

        y += 20;
        break;

      case 'task':
        noStroke();
        fill(180);
        textSize(13);
        textAlign(CENTER,CENTER);
        text(item.x,W/2,y);

        y += 28;
        break;

      case 'spacer':
        y += 40;
        break;

      case 'fin':
        noStroke();
        fill(80);
        textSize(13);
        textAlign(CENTER,CENTER);
        text(item.x,W/2,y);
        y += 36;
        break;

      case 'special':
        noStroke();
        fill(60);
        textSize(11);
        textAlign(CENTER,CENTER);
        text(item.x.toUpperCase(),W/2,y);

        y += 30;
        break;
    }
  }
}

function getCreditH() {
    let t = 0;
    
    for(let item of credits) {
        switch(item.t) {
            
            case 'title':
                t += 48;
                break;
                
            case 'subtitle':
                t += 60;
                break;
                
            case 'name':
                t += 36;
                break;
                
            case 'category':
                t += 20;
                break;
                
            case 'task':
                t += 28;
                break;
                
            case 'spacer':
                t += 40;
                break;
            
            case 'fin':
                t += 36;
                break;
                
            case 'special':
                t += 30;
                break;
        }
    }
    
    return t;
}
