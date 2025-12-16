function prepareDialogue(dialogObj) {
  currentDialog = dialogObj;
  let speaker = currentDialog.speaker;
  let rawText = currentDialog.text;
  if (["나레이션", "시스템", "상황", "경고"].includes(speaker)) targetText = rawText;
  else targetText = '"' + rawText + '"';
  
  currentDisplayedText = "";
  charIndex = 0;
  isTyping = true;
  lastTypingTime = millis();
}

function handleSceneInput(sceneArray) {
  if (isTyping) {
    currentDisplayedText = targetText;
    charIndex = targetText.length;
    isTyping = false;
  } else {
    nextScene(sceneArray);
  }
}

function nextScene(sceneArray) {
  currentSceneIndex++;
  if (currentSceneIndex < sceneArray.length) {
    prepareDialogue(sceneArray[currentSceneIndex]);
  } else {
    if (gameState === "INTRO") {
      gameState = "TUTORIAL"; // 원래는 "SCENE"이었던 곳
      tutorialStep = 0;       // 튜토리얼 첫 페이지부터 시작
    }  else if (gameState === "ENDING_SEQUENCE") {
      // ★ 추가된 부분: 엔딩 스토리가 끝나면 최종 크레딧 화면으로
      gameState = "ENDING_CREDIT"; 
    } else {
      gameState = "CHOICE";
      if (bgm && bgm.isPlaying()) {
        bgm.pause(); // stop()이 아니라 pause()를 써야 이어서 들을 수 있음
      }
    }
  }
}

function drawScene(sceneArray) {
  let bgKey = currentDialog.bg;
  if (bgImages[bgKey]) { imageMode(CENTER); image(bgImages[bgKey], 480, 360, 960, 720); } 
  else { fill(0); rect(480, 360, 960, 720); }

  fill(0, 220); stroke(255); strokeWeight(2); rectMode(CENTER);
  rect(480, 600, 860, 180, 10);

  if (currentDialog.speaker) {
    fill(255); noStroke(); rectMode(CENTER);
    rect(140, 510, 160, 40, 5);
    fill(0); textSize(22); textStyle(BOLD); textAlign(CENTER, CENTER);
    text(currentDialog.speaker, 140, 510);
  }

  // 타이핑 로직
  if (isTyping) {
    if (millis() - lastTypingTime > typingSpeed) {
      if (charIndex < targetText.length) {
        currentDisplayedText += targetText.charAt(charIndex);
        charIndex++;
        lastTypingTime = millis();
      } else isTyping = false;
    }
  }
  let cursor = (isTyping || frameCount % 60 < 30) ? "|" : "";

  push(); rectMode(CORNER); fill(255); textSize(32); textLeading(45); textStyle(NORMAL); textAlign(LEFT, TOP);
  text(currentDisplayedText + cursor, 100, 550, 760, 130);
  pop();

   if (imgInstaIcon && gameState === "SCENE"){ 
     imageMode(CENTER);
     image(imgInstaIcon, 900, 60, 50, 50); 
   }
   
}
function startEndingSequence() {
  gameState = "ENDING_SEQUENCE";
  currentSceneIndex = 0;

  // 1. 점수에 따라 엔딩 타입 결정
  endingType = "normal";
  if (scoreLikes > 11000 || scoreHidden < 1) endingType = "bad";
  else if (scoreHidden >= 2 && scoreLikes < 10000) endingType = "good";
  else{
    endingType = "normal"
  }
  
  // 2. json에서 해당 엔딩 시나리오 가져오기
  // (만약 json 로딩 실패시를 대비해 빈 배열 처리)
  if (jsonData && jsonData.endings && jsonData.endings[endingType]) {
    currentEndingScenes = jsonData.endings[endingType];
  } else {
    currentEndingScenes = [{ text: "엔딩 데이터 오류", speaker: "System", bg: "notPrepared" }];
  }

  // 3. 첫 대사 시작
  prepareDialogue(currentEndingScenes[0]);
}