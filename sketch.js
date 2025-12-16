
function preload() {
  jsonData = loadJSON("data.json");
  bgImages["notPrepared"] = loadImage("assets/notPrepared.png")
  bgm = loadSound('assets/bgm.mp3');
  
  //메인
  imgMain = loadImage("assets/title_2.png")
  bgImages["intro_light"] = loadImage("assets/intro_light.png");
  bgImages["smartphone"] = loadImage("assets/smartphone.png");
  bgImages["instagram_profile"] = loadImage("assets/instagram_profile.png");
  imgInstagramBG = loadImage("assets/instagram_profile.png");
  bgImages["instagram_intro"] = loadImage("assets/instagram_profile_2.png")
  //episode1
  bgImages["rainy_bg"] = loadImage("assets/rainy.png")
  bgImages["rainy_day_ep1"] = loadImage("assets/rainy_day_ep1.png")
  bgImages["crying_child"] = loadImage("assets/crying_child.png")
  bgImages["truck_approach"] = loadImage("assets/truck.png")
  bgImages["truck_child"] = loadImage("assets/truck_child.png")
  bgImages["eyes_close_up"]= loadImage("assets/eyes_close_up.png")
  
  //episode2
  bgImages["bg_school"] = loadImage("assets/school.png")
  bgImages["bg_school_panic"] = loadImage("assets/fallen_student.png")
  bgImages["bg_goldentime_news"] = loadImage("assets/golden_time.png")
  bgImages["student_a"] = loadImage("assets/student_a.png")

  //episode3
  bgImages["bg_station"] = loadImage("assets/subway_station.png")
  bgImages["bg_subway_ann_1"] = loadImage("assets/subway_ann_1.png")
  bgImages["bg_subway_ann_2"] = loadImage("assets/subway_ann_2.png")
  bgImages["bg_shivering_hand"] = loadImage("assets/shivering_hand.png")
  bgImages["bg_falling_man"] = loadImage("assets/falling_man.png")
  bgImages["bg_feared_man"] = loadImage("assets/feared_man.png")

  //ending
  bgImages["bg_judge"] = loadImage("assets/judge.png")
  bgImages["bg_blackout"] = loadImage("assets/blackout.png")
  bgImages["bg_focusing1"] = loadImage("assets/Ending_Focusing1.png")
  bgImages["bg_focusing2"] = loadImage("assets/Ending_Focusing2.png")

  //UI/OBJECT
  camera_UI = loadImage("assets/camera_ui.png");
  imgCarRight = loadImage("assets/carR.png");
  imgCarLeft = loadImage("assets/carL.png");
  imgChild = loadImage("assets/child.png");
  imgTarget1 = loadImage("assets/target_child.png")
  imgTarget2 = loadImage("assets/target_girl.png")
  imgTarget3 = loadImage("assets/target_drunk.png")
  runningPlayer=loadImage("assets/playericon.png")
  imgIceBg = loadImage("assets/floor.png")
  imgFishingBg = loadImage("assets/fishingbg.png")
  imgCrossyBg = loadImage("assets/crossybg.png")
  
  imgStBoy = loadImage("assets/standing_boy.png"); 
  imgStGirl = loadImage("assets/standing_girl.png");
  imgExtinguisher=loadImage("assets/fire_extinguisher.png")
  imgCabinet=loadImage("assets/cabinet.png")
  imgObstacle = loadImage('assets/obstacle.png');
  imgCprKit = loadImage('assets/cpr_kit.png');
  imgPill = loadImage('assets/pill.png');
  imgFirstAid = loadImage('assets/first_aid.png');;

  imgThumb1 = loadImage("assets/insta1.png");
  imgThumb2 = loadImage("assets/insta2.png");
  imgThumb3 = loadImage("assets/insta3.png");
  imgInstaIcon = loadImage("assets/instaicon.png");
  
  imgFocusRule_Ep1 = loadImage('assets/rule_focus_ep1.png'); 
  imgFocusRule_Ep2 = loadImage('assets/rule_focus_ep2.png');
  imgFocusRule_Ep3 = loadImage('assets/rule_focus_ep3.png')
  imgCrossyRule = loadImage('assets/rule_cross_the_street.png');
  imgIceRule2 = loadImage('assets/AED_rule_page2.png');
  imgIceRule = loadImage('assets/AED_rule_page1.png');
  imgFishingRule = loadImage('assets/rule_fishing.png');


  mainFont = loadFont("font/KimNamyun.ttf");
  instaFont = loadFont("font/KoPubWorld.ttf");
}

function setup() {
// 1. 캔버스를 변수에 담고, 아까 만든 HTML div(#game-container)에 종속시킵니다.
  let cnv = createCanvas(1280, 720);
  cnv.parent('game-container'); 

  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  // 2. 이름 입력창(Input) 설정
  nameInput = createInput();
  nameInput.parent('game-container'); // ★ 입력창도 game-container 안에 넣습니다.
  
  // game-container가 position:relative이므로, 
  // 여기서 설정하는 position은 컨테이너의 왼쪽 위(0,0)를 기준으로 잡힙니다.
  // 즉, 캔버스 좌표와 똑같이 생각하고 배치하면 됩니다.
  nameInput.position(width / 2 - 100, height / 2); 
  nameInput.size(200, 30);
  nameInput.hide();

  // 3. 확인 버튼(Button) 설정
  nameBtn = createButton("확인");
  nameBtn.parent('game-container'); // ★ 버튼도 game-container 안에 넣습니다.
  nameBtn.position(width / 2 - 40, height / 2 + 50);
  nameBtn.size(80, 30);
  nameBtn.mousePressed(submitName);
  nameBtn.hide();

  if (jsonData) {
    resetGame();
  }
}

function resetGame() {
  gameState = "MAIN_MENU";
  currentEpisodeIndex = 0;
  currentSceneIndex = 0;
  scoreLikes = 0;
  scoreHidden = 0;
  //디버깅용. 배포 시 playerName = ""로 수정
  playerName = "테스트유저";
  lastInputTime = millis();
  postedEpisodes = [];

  nameInput.hide();
  nameBtn.hide();
  if (bgm && bgm.isPlaying()) {
    bgm.stop();
  }
}


function draw() {
  background(0);
  if (gameState === "INSTAGRAM") {
    textFont(instaFont);
  } else {
    textFont(mainFont);
  }

  // 타임아웃 체크
  if (
    gameState !== "MAIN_MENU" &&
    millis() - lastInputTime > TIMEOUT_DURATION
  ) {
    resetGame();
  }

  // 뷰포트 설정
  push();
  translate((width - 960) / 2, 0);

  if (gameState !== "MINIGAME" || minigameType !== "FOCUS") {
    fill(30);
    noStroke();
    rect(480, 360, 960, 720);
  }

  // 상태별 그리기
  switch (gameState) {
    case "MAIN_MENU":
      drawMainMenu();
      break;
    case "NAME_INPUT":
      drawNameInputScreen();
      break;
    case "INTRO":
      drawScene(jsonData.intro);
      break;
    case "TUTORIAL":  // ★ 새로 추가!
      drawTutorial(); // 이 함수는 아래에서 새로 만듭니다.
      break;
    case "SCENE":
      drawScene(jsonData.episodes[currentEpisodeIndex].scenes);
      break;
    case "CHOICE":
      drawChoice();
      break;
    case "RULEBOOK":
      drawRuleBook();
      break;
    case "MINIGAME":
      runMinigame();
      break;
    case "RESULT":
      drawResult();
      break;
    case "INSTAGRAM":
      drawInstagram();
      break;
    case "ENDING_SEQUENCE": // 엔딩 스토리 진행 중 (대화창 나옴)
      drawScene(currentEndingScenes);
      break;
    case "ENDING_CREDIT":   // 엔딩 끝나고 최종 화면 (THE END)
      drawEndingCredit();   // ui.js에 만들 예정
      break;
  }

  pop();

  // 레터박스
  fill(0);
  rect((width - 960) / 4, 360, (width - 960) / 2, 720);
  rect(width - (width - 960) / 4, 360, (width - 960) / 2, 720);

  if (gameState === "MINIGAME" && minigameType === "FOCUS") {
    if (camera_UI) {
      imageMode(CENTER);
      image(camera_UI, 1130, 360, 300, 720);
    }
  }
}

function keyPressed() {
  lastInputTime = millis();

  if (keyCode === ESCAPE) {
    let answer = confirm(
      "정말 돌아가시겠습니까?\n진행 상황은 저장되지 않습니다."
    );
    if (answer === true) resetGame();
    return;
  }
  if (gameState === "MAIN_MENU") {
    if (keyCode === ENTER) {
      gameState = "NAME_INPUT";
      nameInput.value("");
      nameInput.show();
      nameBtn.show();
          if (bgm && !bgm.isPlaying()) {
          bgm.setVolume(0.5); // 볼륨 조절 (0.0 ~ 1.0)
          bgm.loop(); 
        } 
      
    }
  } else if (gameState === "NAME_INPUT") {
    if (keyCode === ENTER) submitName();
  } else if (gameState === "INTRO") {
    if (keyCode === ENTER || keyCode === 32)  handleSceneInput(jsonData.intro);
  } else if (gameState === "TUTORIAL") { // ★ 새로 추가!
  // 엔터나 스페이스바를 누르면 다음 튜토리얼 단계로
  if (keyCode === ENTER || keyCode === 32) {
    tutorialStep++;
    // 튜토리얼이 3단계까지 있다고 가정 (0, 1, 2)
    // 3이 되면 튜토리얼 끝내고 본게임(Episode 1)으로 이동
    if (tutorialStep > 2) { 
      gameState = "SCENE";
      currentEpisodeIndex = 0;
      currentSceneIndex = 0;
      prepareDialogue(jsonData.episodes[0].scenes[0]);

      }
    }

  }
   else if (gameState === "SCENE") {
    if (keyCode === ENTER || keyCode === 32)  handleSceneInput(jsonData.episodes[currentEpisodeIndex].scenes);
  } else if (gameState === "RULEBOOK") {
    if (keyCode === ENTER || keyCode === 32){
      if (minigameType === "ICE") {
        if (ruleBookStep === 0) {
          ruleBookStep++; // 0페이지면 -> 1페이지로 이동
        } else {
          initMinigame(); // 1페이지(마지막)면 -> 게임 시작
        }
      } 
      // 다른 게임들은 기존처럼 바로 시작
      else {
        initMinigame();
      }
    }
  } else if (gameState === "RESULT") {
    if (keyCode === ENTER || keyCode === 32) gameState = "INSTAGRAM";
  } else if (gameState === "INSTAGRAM") {
    if (keyCode === ENTER || keyCode === 32) {
      if (previousGameState === "TUTORIAL") {
        gameState = "TUTORIAL";
        tutorialStep = 2; 
        previousGameState = ""; 
        return;
      }

      recentLikeIncrease = 0;

      if (minigameResult !== null) {
        currentEpisodeIndex++;
        minigameResult = null;
        
        if (currentEpisodeIndex < jsonData.episodes.length) {
          gameState = "SCENE";
          currentSceneIndex = 0;
          prepareDialogue(jsonData.episodes[currentEpisodeIndex].scenes[0]); 
          
          // ★ [삭제됨] 여기에 있던 bgm.loop() 코드를 지웠습니다.
          // (이미 켜져 있으니까 건드릴 필요 없음)

        } else {
          startEndingSequence();
          
          // ★ [삭제됨] 여기에 있던 if (bgm) bgm.stop(); 코드를 지웠습니다.
          // (엔딩 때도 노래가 계속 나와야 하니까요)
        }
      } else {
        gameState = "SCENE";
        // ★ [삭제됨] 여기에 있던 bgm.loop() 코드도 지웠습니다.
      }
    }
  } else if (gameState === "ENDING_SEQUENCE") {
    if (keyCode === ENTER || keyCode === 32){
    // 엔딩 시나리오 배열(currentEndingScenes)을 넘기는 함수 호출
    handleSceneInput(currentEndingScenes);
    }
  } else if (gameState === "ENDING_CREDIT") {
    if (keyCode === ESCAPE) resetGame();
  }

   else if (gameState === "MINIGAME") {
    handleMinigameKey();
  }

// ==============================================
  // [개발용 디버그 치트키]
  // 개발 완료 후에는 이 부분을 주석 처리하거나 삭제하세요.
  // ==============================================
  /*
  // [숫자 1, 2, 3]: 각 에피소드 시작 부분으로 점프
  
  if (key === '1') jumpToEpisode(0); // 에피소드 1
  if (key === '2') jumpToEpisode(1); // 에피소드 2
  if (key === '3') jumpToEpisode(2); // 에피소드 3

  // [알파벳 키]: 특정 미니게임 바로 시작 (룰북 건너뛰기 테스트)
  if (key === 'q') jumpToMinigame("FOCUS");
  if (key === 'w') jumpToMinigame("CROSSY");
  if (key === 'e') jumpToMinigame("ICE");
  if (key === 'r') jumpToMinigame("CPR"); // CPR은 ICE 게임 도중 나오지만 강제 진입 가능하게 설정
  if (key === 't') jumpToMinigame("FISHING");

  // [엔딩 테스트]
  if (key === '9') { // 배드 엔딩 조건 세팅 후 이동
    scoreLikes = 20000; scoreHidden = 0;
    gameState = "ENDING";
  }
  if (key === '0') { // 굿 엔딩 조건 세팅 후 이동
    scoreLikes = 0; scoreHidden = 5;
    gameState = "ENDING";
  }
*/


}


/*
// [디버그용 헬퍼 함수 1] 에피소드로 점프
function jumpToMinigame(type) {
  console.log(`Debug: Starting Minigame ${type}`);
  minigameType = type;
  
  // [핵심 수정] 선택지 화면을 건너뛰었기 때문에, 결과창에서 사용할 변수를 강제로 주입해야 함
  // 1. 선택지가 비어있다면 강제로 'camera_on'으로 설정 (에러 방지)
  if (!selectedChoice) {
    selectedChoice = "camera_on"; 
  }
  
  // 2. 미니게임 종류에 따라 적절한 에피소드 인덱스와 선택지 타입을 맞춰줌 (결과 텍스트 매칭용)
  if (type === "FOCUS") {
    // FOCUS는 보통 모든 에피소드에 있지만, 편의상 Ep1로 고정
    currentEpisodeIndex = 0; 
    selectedChoice = "camera_on";
  } 
  else if (type === "CROSSY") {
    currentEpisodeIndex = 0; // Ep1
    selectedChoice = "camera_off"; // 길건너기는 카메라 끄고 구하는 내용
  }
  else if (type === "ICE" || type === "CPR") {
    currentEpisodeIndex = 1; // Ep2
    selectedChoice = "camera_off"; // 얼음/CPR은 카메라 끄고 구하는 내용
  }
  else if (type === "FISHING") {
    currentEpisodeIndex = 2; // Ep3
    selectedChoice = "camera_off"; // 낚시(구조)는 카메라 끄고 구하는 내용
  }

  // 게임 실행 로직
  if (type === "CPR") {
    setupCprGame();
    gameState = "MINIGAME";
  } else {
    initMinigame();
    gameState = "MINIGAME"; 
  }

}
*/

function mousePressed() {
  lastInputTime = millis();

  // 1. SCENE 일 때 인스타 아이콘 클릭 처리
  if (gameState === "SCENE" || (gameState === "TUTORIAL" && tutorialStep === 2)) {
    let viewportX = mouseX - (width - 960) / 2;
    // 아이콘 위치 (900, 60) 주변 클릭 시
    if (dist(viewportX, mouseY, 900, 60) < 30) {
      minigameResult = null;
      previousGameState = gameState;
      gameState = "INSTAGRAM";
      return; // 인스타로 이동하면 아래 로직 실행 안 함
    }
  }

  // 2. SCENE 진행 처리 (아이콘 클릭이 아닐 때)
  if (gameState === "SCENE") {
    // 텍스트 박스 근처 클릭이나 화면 클릭 시 다음 대사
    // 정확한 분리를 위해 명시적으로 episode 데이터를 넘김
    if (mouseY > 0) { 
       handleSceneInput(jsonData.episodes[currentEpisodeIndex].scenes);
    }
  }
  // 3. INTRO 진행 처리 (SCENE과 분리!)
  else if (gameState === "INTRO") {
    if (mouseY > 0) {
       handleSceneInput(jsonData.intro);
    }
  }
  // 4. 선택지 처리
  else if (gameState === "CHOICE") {
    if (
      mouseX > width / 2 - 300 &&
      mouseX < width / 2 + 300 &&
      mouseY > 400 &&
      mouseY < 460
    ) {
      selectedChoice = "camera_on";
      startMinigame(
        jsonData.episodes[currentEpisodeIndex].outcomes.camera_on.minigame
      );
    } else if (
      mouseX > width / 2 - 300 &&
      mouseX < width / 2 + 300 &&
      mouseY > 480 &&
      mouseY < 540
    ) {
      selectedChoice = "camera_off";
      startMinigame(
        jsonData.episodes[currentEpisodeIndex].outcomes.camera_off.minigame
      );
    }
  }
  else if (gameState === "ENDING_SEQUENCE") {
    if (mouseY > 0) {
       handleSceneInput(currentEndingScenes);
    }
  }
  if (gameState === "MINIGAME" && minigameType === "CPR") {
    handleCprClick(); // minigames.js에 만들 함수
  }

}

