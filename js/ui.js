function submitName() {
  let val = nameInput.value();
  if (val.trim() !== "") {
    playerName = val.trim();
    nameInput.hide();
    nameBtn.hide();
    gameState = "INTRO";
    currentSceneIndex = 0;
    // story.js에 있는 함수 호출
    prepareDialogue(jsonData.intro[0]);
  }
}

function drawNameInputScreen() {
  background(20); fill(255); textSize(30);
  text("(가상의) 인스타 ID를 입력해주세요", 480, 300);
}

function drawMainMenu() {
  if (imgMain){
    push();
    imageMode(CENTER);
    image(imgMain, 480, 360, 960, 720);
    pop();
  } else{
    background(10, 10, 20); fill(255);
  textSize(60); textStyle(BOLD); text("빛나는 착함을\n기록합니다", 480, 250);
  textSize(24); textStyle(NORMAL);
  if (frameCount % 60 < 30) text("- PRESS ENTER TO START -", 480, 500);
  textSize(14); fill(150); text("조작: 방향키 / 스페이스바 / ESC(처음으로)", 480, 650);
  }

}



function drawRuleBook() {
  background(0); imageMode(CENTER);
  let c = null;
  if (minigameType === "FOCUS") {
    // FOCUS 게임일 때만 에피소드별로 분기
    if (currentEpisodeIndex === 0) {
      c = imgFocusRule_Ep1; 
    } else if (currentEpisodeIndex === 1) {
      c = imgFocusRule_Ep2; 
    } else if (currentEpisodeIndex === 2) {
      c = imgFocusRule_Ep3; 
    } else {
      // 만약 에피소드 인덱스가 범위를 벗어나거나 기타 상황일 때 기본값
      c = imgFocusRule_Ep1; 
    }
  }
  else if(minigameType==="CROSSY") c=imgCrossyRule;
  else if (minigameType === "ICE") {
    if (ruleBookStep === 0) {
      c = imgIceRule;   // 첫 번째 페이지
    } else {
      c = imgIceRule2;  // 두 번째 페이지 (없으면 imgIceRule이 뜰 수 있게 예외처리 가능)
    }
  }
  else if(minigameType==="FISHING"){
     c=imgFishingRule;
  }
  if (c) {
    image(c, 480, 360, 960, 720);
  } else { 
    // 이미지가 없는 경우 (개발 중 혹은 로드 실패 시) 텍스트로 대체
    fill(255); 
    textSize(40); 
    textAlign(CENTER, CENTER);
    text(minigameType + " RULE\n(Episode " + (currentEpisodeIndex + 1) + ")", 480, 360); 
  }
  
}

function drawInstagram() {
  imageMode(CENTER);
  if (imgInstagramBG) image(imgInstagramBG, 480, 360, 960, 720);
  else background(255);

  fill(0); noStroke();
  textSize(30); textStyle(BOLD); textAlign(CENTER, CENTER);
  text(playerName, 575, 55); 
  textSize(24); 
  text(postedEpisodes.length, 390, 200); 
  text(formatNumber(scoreLikes), 575, 200); 
  text("256", 767, 200); 

  // ★★★ [추가된 부분] 이번에 늘어난 팔로워 수 표시 (빨간색) ★★★
  // recentLikeIncrease가 0보다 클 때만 표시합니다.
  if (recentLikeIncrease > 0) {
    push();
    fill(255, 50, 50); // 빨간색
    textSize(18);      // 조금 작게
    textStyle(BOLD);
    // 위치는 575(중앙)에서 위쪽(170)으로 조금 올림
    text("+ " + formatNumber(recentLikeIncrease), 575, 170); 
    pop();
  }

  let startX=120, startY=440, gap=10, size=235;
  for (let i = 0; i < postedEpisodes.length; i++) {
    let post = postedEpisodes[i];
    let col = i % 3;
    let row = floor(i / 3);
    let x = startX + col * (size + gap);
    let y = startY + row * (size + gap);
    if (post && post.img) {
      image(post.img, x+size/2, y+size/2, size, size);
      fill(0, 150); noStroke(); rectMode(CORNER);
    }
  }
  if (frameCount % 60 < 30) {
    fill(0, 0, 255); textSize(20); textAlign(CENTER); text("PRESS SPACE >>", 800, 50);
  }
}

function drawResult() {
  background(0);
  let outcome = jsonData.episodes[currentEpisodeIndex].outcomes[selectedChoice];
  textSize(40); textAlign(CENTER, CENTER);
  if (minigameResult) { fill(100,255,100); text("SUCCESS",480,200); fill(255); textSize(24); text(outcome.success_text,480,360); }
  else { fill(255,100,100); text("FAIL",480,200); fill(255); textSize(24); text(outcome.fail_text,480,360); }
  fill(150); textSize(20); text("PRESS SPACE or ENTER",480,600);
}

function drawEndingCredit() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  
  textSize(50); textStyle(BOLD);
  text("THE END", 480, 250);
  
  textSize(24); textStyle(NORMAL);
  text("플레이해주셔서 감사합니다.", 480, 350);
  
  fill(200, 200, 255);
  text(`최종 Followers: ${formatNumber(scoreLikes)}`, 480, 450);

  fill(255);
  if(endingType == "bad"){
    text("Bad Ending", 480, 500);
  }
  else if(endingType == "normal"){
    text("Normal Ending", 480, 500);
  }
  else{
    text("True Ending", 480, 500);
  }

  fill(100); textSize(16);
  text("ESC를 눌러 타이틀 화면으로 돌아가기", 480, 600);
}

function drawChoice() {
  fill(30); rect(480, 360, 960, 720); 
  fill(255); textSize(32); textAlign(CENTER);
  text(jsonData.episodes[currentEpisodeIndex].choice.question, 480, 200);
  let opts = jsonData.episodes[currentEpisodeIndex].choice.options;
  let vx = mouseX - (width - 960)/2, vy = mouseY;

  // 버튼 1
  fill(50, 50, 100); stroke(255);
  if(vx>180 && vx<780 && vy>400 && vy<460) fill(80, 80, 150);
  rect(480, 430, 600, 60, 10);
  fill(255); noStroke(); textSize(24); text(opts[0].label, 480, 430);

  // 버튼 2
  fill(100, 50, 50); stroke(255);
  if(vx>180 && vx<780 && vy>480 && vy<540) fill(150, 80, 80);
  rect(480, 510, 600, 60, 10);
  fill(255); noStroke(); text(opts[1].label, 480, 510);
}

function drawTutorial() {
  background(50); // 약간 어두운 배경

  // 공통 제목
  fill(255); 
  textSize(40); 
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("게임 방법 익히기", 480, 100);

  textStyle(NORMAL);
  textSize(24);

  // 단계별 설명 내용
  if (tutorialStep === 0) {
    // [Step 0] 기본 조작 설명
    text("이 게임은 마우스와 키보드를 사용합니다.", 480, 300);
    text("대사를 넘기려면 [스페이스바],[엔터키]를 누르거나 [클릭]을 하세요.", 480, 360);
    text("두 번 누를 시 대사가 빠르게 재생됩니다.", 480, 420)
    
    // (시각 자료 예시: 스페이스바 아이콘 같은걸 그려주면 좋음)
    noFill(); stroke(255); rect(480, 500, 200, 50, 10);
    fill(255); noStroke(); text("SPACE", 480, 500);

  } else if (tutorialStep === 1) {
    text("스토리 진행 중 다양한 미니게임이 등장합니다.", 480, 300);
    text("게임 시작 전 제공되는 룰북을 잘 읽고 게임에 도전해보세요.",480,360)
    text("당신의 선택과 미니게임 결과에 따라 엔딩이 달라집니다.", 480, 420);


  } else if (tutorialStep === 2) {
    text("화면 상단의 인스타그램 아이콘을 눌러보세요.", 480, 250);
    text("현재까지의 진행 상황과 '팔로워 수 등'을 확인할 수 있습니다.", 480, 300);

    // 실제 아이콘 위치를 강조하는 화살표나 원 그리기
    push();
    imageMode(CENTER);
    if (imgInstaIcon) image(imgInstaIcon, 900, 60, 50, 50); // 아이콘 보여주기
    pop();
    noFill(); stroke(255, 255, 0); strokeWeight(5);
    ellipse(900, 60, 80, 80); // 노란 동그라미로 강조
    strokeWeight(1); noStroke();
    fill(100, 255, 100);
    text("준비가 되었다면 [SPACE] / [ENTER]를 누르세요!", 480, 500);
  }

  // 하단 안내 문구
  fill(150); textSize(16);
  text(`단계 ${tutorialStep + 1} / 3 - [SPACE] / [ENTER]를 눌러 계속`, 480, 650);
}

function formatNumber(num) {
  return new Intl.NumberFormat('en', { notation: "compact" }).format(num);
}