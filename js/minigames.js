// 게임 진입 (룰북 보여주기)
function startMinigame(type) {
  minigameType = type;
  gameState = "RULEBOOK";
}

// 실제 게임 초기화 (엔터 누르면 실행)
function initMinigame() {
  gameState = "MINIGAME";
  minigameResult = false;

  if (minigameType === "FOCUS") { mgTimer=300; mgMaxTimer=300; mgFocus.shakeX=0; mgFocus.shakeY=0; } 
  else if (minigameType === "CROSSY") {
    mgTimer=700; mgMaxTimer=700; mgCrossy.player=createVector(480,650); mgCrossy.cars=[];
    let lanes=6, split=2;
    for(let i=0; i<lanes; i++) {
      let dir=(i<=split)?1:-1; let spd=random(4,7)*dir; let cnt=random()>0.5?2:1;
      for(let j=0; j<cnt; j++){
        let sx=(cnt===1)?random(0,960):random(j*500, j*500+400);
        mgCrossy.cars.push({y:600-i*90, x:sx, w:80, h:40, speed:spd});
      }
    }
  }
  else if (minigameType === "ICE") {
    mgTimer=600; mgMaxTimer=600; mgIce.player=createVector(100,600); mgIce.vel=createVector(0,0); mgIce.acc=createVector(0,0); mgIce.goal={x:850,y:100}; mgIce.obstacles=[];
    mgIce.obstacles.push({x: 100, y: 310, r: 40});
    mgIce.obstacles.push({x: 100, y: 390, r: 40});
    mgIce.obstacles.push({x: 240, y: 530, r: 40});
    mgIce.obstacles.push({x: 240, y: 610, r: 40});
    mgIce.obstacles.push({x: 240, y: 100, r: 40});
    mgIce.obstacles.push({x: 270, y: 170, r: 40});
    mgIce.obstacles.push({x: 360, y: 330, r: 40});
    mgIce.obstacles.push({x: 474, y: 310, r: 40});
    mgIce.obstacles.push({x: 474, y: 360, r: 40});
    mgIce.obstacles.push({x: 474, y: 650, r: 40});
    mgIce.obstacles.push({x: 660, y: 100, r: 40});
    mgIce.obstacles.push({x: 580, y: 120, r: 40});
    mgIce.obstacles.push({x: 650, y: 290, r: 40});
    mgIce.obstacles.push({x: 680, y: 360, r: 40});
    mgIce.obstacles.push({x: 660, y: 540, r: 40});
    mgIce.obstacles.push({x: 570, y: 560, r: 40});
    mgIce.obstacles.push({x: 474, y: 600, r: 40});
    mgIce.obstacles.push({x: 850, y: 360, r: 40});
  }
  else if (minigameType === "FISHING") {
  mgTimer = 900;       // 제한시간 (약 15초)
  mgMaxTimer = 900;
  
  // 낚시 게임 변수 세팅
    mgTimer = 900;
    mgMaxTimer = 900;
    
    // 플레이어 바 시작 세팅
    mgFish.barY = 600;  
    mgFish.barHeight = 150; 
    mgFish.barVel = 0;      
    
    // -----------------------------------------------------------
    // [직관적인 수정] 고정 시작점 + 노이즈 변화량 방식
    // -----------------------------------------------------------
    
    // 1. 내가 원하는 시작 위치 (맨 아래쪽)
    mgFish.startFixedY = 500; 
    
    // 2. 시간 초기화
    mgFish.targetTime = 0;
    
    // 3. 게임 시작 순간(0초)의 노이즈 값을 '기준값'으로 저장
    // 나중에 (현재노이즈 - 이 값)을 하면, 시작할 때 무조건 0이 됩니다.
    mgFish.startNoiseVal = noise(0); 
    
    // -----------------------------------------------------------
    
    mgFish.progress = 0; 
    mgFish.gravity = 0.5;    
    mgFish.thrust = -0.8;
}
}

// 게임 실행 분기
function runMinigame() {
  if (minigameType === "FOCUS") playFocus();
  else if (minigameType === "CROSSY") playCrossy();
  else if (minigameType === "ICE") playIce();
  else if (minigameType === "CPR") playCpr();
  else if (minigameType === "FISHING") playFishing();
}

// 키 입력 처리
function handleMinigameKey() {
  if (minigameType === "FOCUS" && keyCode === 32) { if(mgTimer < 280) checkFocusSuccess(); }
  if (minigameType === "CROSSY") {
    let speed = 20;
    if (keyCode === UP_ARROW) mgCrossy.player.y -= speed;
    if (keyCode === DOWN_ARROW) mgCrossy.player.y += speed;
    if (keyCode === LEFT_ARROW) mgCrossy.player.x -= speed;
    if (keyCode === RIGHT_ARROW) mgCrossy.player.x += speed;
    mgCrossy.player.x = constrain(mgCrossy.player.x, 15, 945);
    mgCrossy.player.y = constrain(mgCrossy.player.y, 30, 670);
  }
  
}

// 게임 종료 처리
function finishMinigame(isSuccess) {
  minigameResult = isSuccess;
  gameState = "RESULT";
  let outcome = jsonData.episodes[currentEpisodeIndex].outcomes[selectedChoice];
  
  let views = isSuccess ? int(random(500,1001)) : int(random(50,101));
  if (selectedChoice === "camera_on") {
    let thumb = [imgThumb1, imgThumb2, imgThumb3][currentEpisodeIndex];
    if (thumb) postedEpisodes.push({img: thumb, views: views});
  }

  if (isSuccess) {
    let bonus = int(random(250, 501));
    scoreLikes += outcome.score_likes + bonus;
    scoreHidden += outcome.score_hidden;
  } else {
    let penalty = int(random(50, 251));
    scoreLikes += outcome.score_likes * 0.1 + penalty;
  }
}

// --- 각 게임별 로직 (간소화) ---
function playFocus() {
  let zoomScale = map(mgTimer, 300, 0, 1.0, 1.3);
  let slowFreq = 0.03;
  let wideRange = 150;
  mgFocus.shakeX = map(
    noise(frameCount * slowFreq),
    0,
    1,
    -wideRange,
    wideRange
  );
  mgFocus.shakeY = map(
    noise((frameCount + 5000) * slowFreq),
    0,
    1,
    -wideRange,
    wideRange
  );

  fill(0);
  rect(480, 360, 960, 720);
  imageMode(CENTER);
  if (imgTarget) image(imgTarget, 480, 360, 960 * zoomScale, 720 * zoomScale);

  let focusX = 480 + mgFocus.shakeX;
  let focusY = 360 + mgFocus.shakeY;

  noFill();
  stroke(0);
  strokeWeight(3);
  line(focusX - 20, focusY, focusX + 20, focusY);
  line(focusX, focusY - 20, focusX, focusY + 20);

  noFill();
  line(focusX - 60, focusY - 60, focusX - 40, focusY - 60);
  line(focusX - 60, focusY - 60, focusX - 60, focusY - 40);
  line(focusX - 60, focusY + 60, focusX - 40, focusY + 60);
  line(focusX - 60, focusY + 60, focusX - 60, focusY + 40);
  line(focusX + 60, focusY + 60, focusX + 40, focusY + 60);
  line(focusX + 60, focusY + 60, focusX + 60, focusY + 40);
  line(focusX + 60, focusY - 60, focusX + 40, focusY - 60);
  line(focusX + 60, focusY - 60, focusX + 60, focusY - 40);

  fill(255);
  noStroke();
  textSize(20);
  text("초점 안에 아이가 담길 때 SPACE!", 480, 50);
  mgTimer--;

  push();
  rectMode(CORNER);
  noStroke();
  fill(255, 0, 0);
  let barWidth = map(mgTimer, 0, mgMaxTimer, 0, 930);
  if (barWidth < 0) barWidth = 0;
  rect(30, 680, barWidth, 10);
  pop();

  if (mgTimer <= 0) finishMinigame(false);
}

function checkFocusSuccess() {
  let d = dist(480+mgFocus.shakeX, 360+mgFocus.shakeY, 480, 360);
  let zoom = map(mgTimer,300,0,1.0,1.3);
  if(d < hitboxRadius * zoom) finishMinigame(true);
  else finishMinigame(false);
}

function playCrossy() {
  fill(50); rect(480,360,960,720); stroke(255,200,0); strokeWeight(5); line(0,380,960,380); noStroke();
  imageMode(CENTER);
  image(imgChild,480,60,160,100); fill(255); text("구하세요!",560,60);
  
  for(let car of mgCrossy.cars){
    car.x += car.speed;
    if(car.x>1060) car.x=-100; if(car.x<-100) car.x=1060;
    if(car.speed>0) { if(imgCarRight) image(imgCarRight,car.x,car.y,car.w,car.h); }
    else { if(imgCarLeft) image(imgCarLeft,car.x,car.y,car.w,car.h);}
    if(dist(mgCrossy.player.x,mgCrossy.player.y,car.x,car.y)<40) 
    { finishMinigame(false); return; }
  }
  //fill(100,100,255); ellipse(mgCrossy.player.x,mgCrossy.player.y,30,30);
  image(runningPlayer,mgCrossy.player.x,mgCrossy.player.y,30,30);
  if(mgCrossy.player.y<100 && mgCrossy.player.x>400 && mgCrossy.player.x<560) finishMinigame(true);
  mgTimer--; drawTimerBar();
  if(mgTimer<=0) finishMinigame(false);
}

function playIce() {
  fill(200, 200, 255);
  rect(480, 360, 960, 720);
  fill(0, 255, 0);
  rect(mgIce.goal.x, mgIce.goal.y, 100, 100);
  
  fill(100);
  text("보건실", mgIce.goal.x, mgIce.goal.y);
  
  imageMode(CENTER);
  for (let obs of mgIce.obstacles){
    if (imgObstacle) {
      // 이미지 그리기 (좌표는 obs.x, obs.y)
      // 크기는 반지름(r) * 2 = 지름
      image(imgObstacle, obs.x, obs.y, obs.r * 2, obs.r * 2);
    } else {
      // 이미지가 없을 때를 대비한 백업 (그냥 원)
      fill(100); 
      ellipse(obs.x, obs.y, obs.r * 2);
    }
  }

  mgIce.acc.set(0, 0);
  if (keyIsDown(LEFT_ARROW)) mgIce.acc.x = -0.5;
  if (keyIsDown(RIGHT_ARROW)) mgIce.acc.x = 0.5;
  if (keyIsDown(UP_ARROW)) mgIce.acc.y = -0.5;
  if (keyIsDown(DOWN_ARROW)) mgIce.acc.y = 0.5;

  mgIce.vel.add(mgIce.acc);
  mgIce.vel.mult(0.98);
  mgIce.vel.limit(20);
  mgIce.player.add(mgIce.vel);
  if (mgIce.player.x < 20 || mgIce.player.x > 940) mgIce.vel.x *= -1;
  if (mgIce.player.y < 20 || mgIce.player.y > 700) mgIce.vel.y *= -1;
  //fill(255, 0, 0);
  //ellipse(mgIce.player.x, mgIce.player.y, 40, 40);
  imageMode(CENTER);
  image(runningPlayer,mgIce.player.x,mgIce.player.y,40,40)
  for (let obs of mgIce.obstacles) {
    if (dist(mgIce.player.x, mgIce.player.y, obs.x, obs.y) < 60)
      mgIce.vel.mult(-1.2);
  }
  if (dist(mgIce.player.x, mgIce.player.y, mgIce.goal.x, mgIce.goal.y) < 60){
    setupCprGame();
    return;
  }
    
  
  mgTimer--; drawTimerBar(); if(mgTimer<=0) finishMinigame(false); }

function setupCprGame() {
  minigameType = "CPR"; // 게임 모드 변경
  mgTimer = 800;        // 제한 시간 (넉넉히 주되, 클릭하면 끝남)
  mgMaxTimer = 800;
  
  // 초기 설정
  mgCpr.x = 1000;       // 화면 오른쪽 밖에서 시작
  mgCpr.y = 360;        // 화면 높이 중앙
  mgCpr.type = int(random(0, 3)); // 랜덤 아이템
  mgCpr.speed = 20;     // 매우 빠른 속도!
}

function playCpr() {
  // 1. 배경 (병원 느낌)
  fill(240, 248, 255); 
  rect(480, 360, 960, 720);

  // 2. 컨베이어 벨트 (레일)
  fill(200); 
  rect(480, 360, 960, 150); 

  // 3. 아이템 이동
  mgCpr.x -= mgCpr.speed;

  // 화면 왼쪽으로 나가면 다시 오른쪽에서 등장 (새 아이템)
  if (mgCpr.x < -100) {
    mgCpr.x = 1060; // 960(화면끝) + 100
    mgCpr.type = int(random(0, 3));
  }

  // 4. 아이템 그리기
  imageMode(CENTER);
  let currentImg;
  if (mgCpr.type === 0) currentImg = imgCprKit;     // 정답
  else if (mgCpr.type === 1) currentImg = imgPill;  // 오답
  else currentImg = imgFirstAid;                    // 오답

  if (currentImg) {
    // 그림자 효과 (속도감)
    fill(0, 50); noStroke();
    ellipse(mgCpr.x - 10, mgCpr.y + 60, 100, 20); 
    // 아이템 본체
    image(currentImg, mgCpr.x, mgCpr.y, 120, 120);
  }

  // 5. 정답(CPR 키트) 위에 마우스 올렸을 때 'Click!' 텍스트
  // 뷰포트 보정된 마우스 좌표 필요
  let vx = mouseX - (width - 960) / 2;
  let vy = mouseY;

  if (mgCpr.type === 0) {
    if (mgCpr.x >0 && mgCpr.x < 960) {
      fill(255, 0, 0); stroke(255); strokeWeight(3);
      textSize(40); textStyle(BOLD);
      text("Click!", 480, 600);
      textStyle(NORMAL); // 스타일 복구
    }
  }

  // 6. 안내 문구
  fill(0); noStroke(); textSize(24);
  text("CPR 키트가 지나갈 때 클릭하세요!", 480, 100);

  // 7. 타이머 (시간 다 되면 실패)
  mgTimer--;
  drawTimerBar();
  if (mgTimer <= 0) finishMinigame(false);
}

function handleCprClick() {
  // 뷰포트 기준 마우스 좌표
  let vx = mouseX - (width - 960) / 2;
  let vy = mouseY;

  // 아이템을 클릭했는지 확인 (판정 범위 70px)
  if (dist(vx, vy, mgCpr.x, mgCpr.y) < 70) {
    
    if (mgCpr.type === 0) {
      // 정답(CPR 키트) 클릭 -> 최종 성공!
      finishMinigame(true);
    } else {
      // 오답 클릭 -> 최종 실패!
      finishMinigame(false);
    }
  }
}



function playFishing() {
  // 1. 배경 그리기 (선로 아래 어두운 느낌)
  fill(10, 10, 30);
  rect(480, 360, 960, 720);
  
  // 게임 영역 (낚시 바 UI)
  let gameX = 480;
  let gameY = 360;
  let gameW = 100;
  let gameH = 600;
  let bottomLimit = gameY + gameH/2; // 660
  let topLimit = gameY - gameH/2;    // 60
  let padding = 60;

  // 2. 게이지 배경 (틀)
  fill(50);
  stroke(200);
  strokeWeight(4);
  rect(gameX, gameY, gameW, gameH, 20);
  noStroke();

  // -------------------------------------------------
  // [수정] 벽 튕기기 (Reflection) 로직 적용
  // -------------------------------------------------
  
  mgFish.targetTime += 0.008; 
  
  let currentNoise = noise(mgFish.targetTime);
  let diff = currentNoise - mgFish.startNoiseVal;
  
  // 1. 일단 가고 싶은 위치를 계산합니다. (화면 밖일 수도 있음)
  let rawY = mgFish.startFixedY + (diff * 800);

  // 2. 천장(Top) 뚫음 방지 -> 튕겨내기
  // "뚫고 나간 만큼 안쪽으로 다시 밀어넣습니다."
  if (rawY < topLimit + padding) {
    let over = (topLimit + padding) - rawY; // 초과한 거리
    rawY = (topLimit + padding) + over;     // 반대로 더해줌
  }
  
  // 3. 바닥(Bottom) 뚫음 방지 -> 튕겨내기
  else if (rawY > bottomLimit - padding) {
    let over = rawY - (bottomLimit - padding); // 초과한 거리
    rawY = (bottomLimit - padding) - over;     // 반대로 빼줌
  }

  // 4. 최종 위치 적용
  mgFish.targetY = rawY;

  // 혹시라도 튕겼는데도 반대쪽 벽을 뚫을까봐 안전장치 (필수는 아니지만 안전함)
  mgFish.targetY = constrain(mgFish.targetY, topLimit + padding, bottomLimit - padding);

  // 취객 그리기 (빨간색 원 or 아이콘)
  fill(255, 50, 50);
  ellipse(gameX, mgFish.targetY, 60, 60);
  fill(255);
  textSize(12);
  text("취객", gameX, mgFish.targetY);

  // -------------------------------------------------
  // 4. 플레이어 바 (내 손) 물리엔진
  // -------------------------------------------------
  // 스페이스바나 마우스를 누르고 있으면 위로 당김 (힘 작용)
  if (keyIsDown(32) || mouseIsPressed) {
    mgFish.barVel += mgFish.thrust;
  }
  
  // 중력 적용
  mgFish.barVel += mgFish.gravity;
  // 속도 제한 (너무 빠르지 않게)
  mgFish.barVel = constrain(mgFish.barVel, -10, 10);
  
  // 위치 적용
  mgFish.barY += mgFish.barVel;

  // 화면 밖으로 나가지 않게 제한 (바닥과 천장 충돌 시 튕김 방지)
  if (mgFish.barY > bottomLimit - mgFish.barHeight/2) {
    mgFish.barY = bottomLimit - mgFish.barHeight/2;
    mgFish.barVel = 0;
  }
  if (mgFish.barY < topLimit + mgFish.barHeight/2) {
    mgFish.barY = topLimit + mgFish.barHeight/2;
    mgFish.barVel = 0;
  }

  // -------------------------------------------------
  // 5. 판정 및 그리기
  // -------------------------------------------------
  // 바와 타겟이 겹치는지 확인
  let isCatching = 
      (mgFish.targetY > mgFish.barY - mgFish.barHeight/2) && 
      (mgFish.targetY < mgFish.barY + mgFish.barHeight/2);

  // 바 그리기 (잡고 있으면 초록색, 놓치면 노란색)
  if (isCatching) {
    fill(100, 255, 100, 150); // 성공 중 (초록)
    mgFish.progress += 0.35;   // 게이지 상승 속도
  } else {
    fill(255, 200, 0, 100);   // 실패 중 (노랑)
    mgFish.progress -= 0.2;   // 게이지 하락 속도
  }
  
  // 플레이어 바 렌더링
  rect(gameX, mgFish.barY, gameW - 10, mgFish.barHeight);

  // -------------------------------------------------
  // 6. 오른쪽 구조 성공 진행도 (Progress Bar)
  // -------------------------------------------------
  mgFish.progress = constrain(mgFish.progress, 0, 100);
  
  let progressX = gameX + 100;
  let progressH = 400;
  
  // 진행도 배경
  fill(30);
  rect(progressX, 360, 30, progressH);
  
  // 현재 진행도 (아래에서 위로 참)
  let currentH = map(mgFish.progress, 0, 100, 0, progressH);
  
  // 게이지 색상 (거의 다 왔으면 파란색, 아니면 붉은색)
  if (mgFish.progress > 80) fill(0, 255, 255);
  else fill(255, 50, 50);
  
  rectMode(CORNER);
  rect(progressX - 15, 360 + progressH/2 - currentH, 30, currentH);
  rectMode(CENTER); // 원래대로 복구

  // 안내 텍스트
  fill(255);
  textSize(20);
  text("SPACE(또는 마우스)키를 꾹 눌러\n취객을 범위 안에 두세요!", 200, 360);
  text("구조율: " + int(mgFish.progress) + "%", progressX, 120);

  // -------------------------------------------------
  // 7. 게임 종료 조건
  // -------------------------------------------------
  // 1) 구조 성공
  if (mgFish.progress >= 100) {
    finishMinigame(true);
  }
  
  // 2) 타임오버 (열차 도착) - 실패 처리
  // 또는 게이지가 0이 되어도 실패 처리할 수 있음 (선택 사항)
  mgTimer--;
  
  // 상단 타이머 바 (열차 접근 경고)
  push();
  rectMode(CORNER);
  noStroke();
  fill(255, 0, 0);
  let w = map(mgTimer, 0, mgMaxTimer, 0, 960);
  rect(0, 0, w, 20); // 화면 맨 위 줄어드는 바
  pop();

  if (mgTimer <= 0) {
    finishMinigame(false);
  }
}


// 타이머 바 그리기 헬퍼
function drawTimerBar() {
  push(); rectMode(CORNER); noStroke(); fill(255,0,0);
  let w = map(mgTimer, 0, mgMaxTimer, 0, 930);
  if(w<0) w=0; rect(30, 680, w, 10); pop();
}