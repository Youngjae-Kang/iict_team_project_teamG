// === 자산 변수 ===
let bgImages = {};
let imgTarget1, imgTarget2, imgTarget3
let imgChild, camera_UI;
let imgCarRight, imgCarLeft, imgBarrier;
let imgFocusRule_Ep1, imgFocusRule_Ep2, imgFocusRule_Ep3;
let imgCrossyRule, imgIceRule, imgFishingRule;
let imgInstagramBG, imgInstaIcon;
let imgThumb1, imgThumb2, imgThumb3;
let mainFont, instaFont;
let imgCprKit, imgPill, imgFirstAid;
let imgObstacle;
let imgMain
let runningPlayer
let imgStBoy
let imgStGirl
let imgExtinguisher
let imgCabinet
let imgFishingBg
let imgIceBg
let imgIceRule2;


// === 게임 상태 변수 ===
let jsonData;
let gameState = "MAIN_MENU"; 
let currentEpisodeIndex = 0;
let currentSceneIndex = 0;
let currentDialog = {};
let lastInputTime = 0;
const TIMEOUT_DURATION = 180000; 
let tutorialStep = 0;
let previousGameState = ""; // 인스타 들어가기 전 상태를 저장
let currentEndingScenes = [];
let endingType=""
let ruleBookStep = 0; // 룰북 페이지 (0: 첫장, 1: 둘째장)

// === 플레이어 & 점수 ===
let playerName = "";
let scoreLikes = 0;
let scoreHidden = 0;
let postedEpisodes = []; // 인스타 피드
let recentLikeIncrease = 0;

// === UI 요소 ===
let nameInput, nameBtn;
let hitboxRadius = 40;

// === 미니게임 변수 ===
let minigameType = ""; 
let selectedChoice = "";
let minigameResult = false;
let mgTimer = 0;
let mgMaxTimer = 0;

let mgFocus = { shakeX: 0, shakeY: 0 }; 
let mgCrossy = { player: null, cars: [], finishLineY: 100 }; 
let mgIce = { player: null, vel: null, acc: null, obstacles: [], goal: null };
let mgCpr = { 
  x: 0, 
  y: 0, 
  type: 0, // 0:키트, 1:약, 2:구급상자
  speed: 15 // 이동 속도 (960px 화면에 맞춰 빠름)
};
let mgFish = { barY: 0, barVel: 0, barHeight: 150, targetY: 0, targetVel: 0, targetTimer: 0, progress: 30 };

// === 타이핑 효과 변수 ===
let targetText = "";
let currentDisplayedText = "";
let charIndex = 0;
let lastTypingTime = 0;
let typingSpeed = 35;
let isTyping = false;