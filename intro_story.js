const introLines = [
    {text:'2066년 6월 9일...', sp:'cat'},
    {text:'내 이름은 숭냥이.', sp:'cat'},
    {text:'원래 집이던 숭실대학교를 불의의 사고로 잃게 되어 현재 어디에도 정착하지 못하고 떠돌아다니고 있어.', sp:'cat'},
    {text:'숭냥아!!', sp:'unknown'},
    {text:'???!!!', sp:'cat'},
    {text:'뭐야..?', sp:'cat'},
    {text:'무너진 숭실대를 되돌려줘!!', sp:'mingyungjun'},
    {text:'너만이 할 수 있는 일이야..', sp:'seoyuna'},
    {text:'내가..?', sp:'cat'},
    {text:'...', sp:'cat'},
    {text:'그래. 내가 뭘 어떻게 해야하는데?', sp:'cat'},
    {text:'앞으로 나올 두 스테이지 모두 클리어한다면 폐허가 된 숭실대학교가 복구될거야!', sp:'kimseojung'},
    {text:'두 스테이지?', sp:'cat'},
    {text:'...', sp:'cat'},
    
];

let introLi = 0;
let introCi = 0;
let introAdv = false;
let introTmr = 0;
let introFA = 255;

function initIntroStory() {
    introLi = 0;
    introCi = 0;
    introAdv = false;
    introTmr = 0;
    introFA = 255;
}

function drawIntroStory() {
    background(12, 11, 14);

    noStroke();

    // 상단 반 - 배경
    fill(14, 12, 16);
    rect(0, 0, W, H * 0.75);

    // 하단 반 - 배경
    fill(20, 15, 12);
    rect(0, H * 0.75, W, H);

    fill(28, 22, 15);
    rect(0, H * 0.75, W, 3);

    // 좌측 캐릭터 표시 영역
    fill(8, 12, 20);
    rect(W * 0.04, H * 0.04, W * 0.24, H * 0.25);

    fill(6, 9, 16);
    rect(W * 0.05, H * 0.05, W * 0.22, H * 0.23);

    fill(16, 14, 20);
    rect(W * 0.04, H * 0.04, W * 0.24, 3);
    rect(W * 0.04, H * 0.04, 3, H * 0.25);
    rect(W * 0.28 - 3, H * 0.04, 3, H * 0.25);
    rect(W * 0.04, H * 0.04 + H * 0.125, W * 0.24, 3);
    rect(W * 0.16, H * 0.04, 3, H * 0.25);

    // 대사창
    const ddx = W * 0.25, ddy = H * 0.38, ddw = W * 0.50, ddh = H * 0.12;

    fill(72, 62, 52);
    rect(ddx, ddy, ddw, ddh);

    fill(84, 74, 62);
    rect(ddx + 2, ddy + 2, ddw - 4, ddh * 0.3);

    fill(30, 24, 20);
    rect(ddx, ddy + ddh, ddw, H * 0.75 - ddy - ddh);

    fill(24, 19, 16);
    rect(ddx, ddy + ddh, ddw * 0.14, H * 0.75 - ddy - ddh);
    rect(ddx + ddw - ddw * 0.14, ddy + ddh, ddw * 0.14, H * 0.75 - ddy - ddh);

    // 숭냥이 캐릭터 그리기 (배경)
    drawCatBack(80, H - 50);

    // 타이머 증가 및 텍스트 진행
    introTmr++;

    if (introTmr % 2 === 0 && introCi < introLines[introLi].text.length) introCi++;
    if (introCi >= introLines[introLi].text.length) introAdv = true;

    let itxt = introLines[introLi].text.substring(0, introCi);

    noStroke();

    // 화자 이름 및 대사 출력
    let speakerName = '';
    switch (introLines[introLi].sp) {
        case 'cat':
            speakerName = '숭냥이';
            break;
        case 'unknown':
            speakerName = '???';
            break;
        case 'mingyungjun':
            speakerName = '민경준';
            break;
        case 'seoyuna':
            speakerName = '서윤아';
            break;
        case 'kimseojung':
            speakerName = '김서정';
            break;
        default:
            speakerName = '?';
    }

    fill(10, 10, 12, 220);
    rect(55, H - 125, W - 110, 82, 3);

    fill(30, 30, 32, 160);
    rect(57, H - 123, W - 114, 2);

    fill(140, 130, 100);
    textSize(10);
    textAlign(LEFT, CENTER);
    text(speakerName, 80, H - 108);

    fill(200, 196, 188);
    textSize(14);
    textAlign(LEFT, TOP);
    text(itxt, 80, H - 102, W - 150, 60);

    // ENTER 안내
    if (introAdv && frameCount % 60 < 40) {
        fill(90, 86, 80);
        textSize(9);
        textAlign(RIGHT, BOTTOM);
        text('ENTER ▶', W - 65, H - 48);
    }

    // 페이드인 효과
    if (introFA > 0) {
        introFA = max(introFA - 8, 0);

        fill(0, 0, 0, introFA);
        rect(0, 0, W, H);
    }
}

function advanceIntroStory() {
    if (!introAdv) return;

    introLi++;
    introCi = 0;
    introAdv = false;
    introTmr = 0;

    if (introLi >= introLines.length) {
        // 인트로 완료 → sinyangkwan 씬으로 전환
        scene = 'sinyangkwan';
        initSinyangkwan();
        return;
    }
}
