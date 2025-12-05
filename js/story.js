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
      gameState = "SCENE";
      currentEpisodeIndex = 0;
      currentSceneIndex = 0;
      prepareDialogue(jsonData.episodes[0].scenes[0]);
    } else {
      gameState = "CHOICE";
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