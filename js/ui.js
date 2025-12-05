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
  if(minigameType==="FOCUS") c=imgFocusRule; else if(minigameType==="CROSSY") c=imgCrossyRule;
  else if(minigameType==="ICE") c=imgIceRule; else if(minigameType==="FISHING") c=imgFishingRule;
  
  if(c) image(c, 480, 360, 960, 720);
  else { fill(255); textSize(40); text(minigameType + " RULE", 480, 300); }
  
  if(frameCount%60<30){ fill(0); textSize(30); noStroke(); text("- PRESS SPACE -", 480, 650); }
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
      rect(x, y+size-40, size, 40);
      fill(255); textAlign(LEFT, CENTER); textSize(18);
      text("▶ " + formatNumber(post.views), x+15, y+size-20);
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
  fill(150); textSize(20); text("PRESS ENTER",480,600);
}

function drawEnding() {
  background(255);
  let finalEnding;
  if (scoreLikes > 10000 && scoreHidden < 2) finalEnding = jsonData.endings.find(e => e.id === "bad");
  else if (scoreHidden >= 2) finalEnding = jsonData.endings.find(e => e.id === "good");
  else finalEnding = jsonData.endings.find(e => e.id === "normal");
  
  fill(0); textSize(40); text("심판의 시간", 480, 150);
  textSize(28); text(finalEnding.text, 480, 300, 700, 200);
  textSize(32); fill(0, 0, 150); text(finalEnding.subtext, 480, 500);
  textSize(16); fill(150); text(`${playerName} 결과 - Likes: ${scoreLikes}`, 480, 650);
  text("ESC를 눌러 처음으로", 480, 680);
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

function formatNumber(num) {
  return new Intl.NumberFormat('en', { notation: "compact" }).format(num);
}