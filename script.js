const audioConfig = {
  title: "wave to earth - seasons",
  src: "wave to earth - seasons.mp3"
};

const letterMessage = `happy birthday baby

today is your day and i just want to say i am proud of you in simple ways i see your effort your patience and the way you keep going even on hard days

i hope this year gives you more calm days more smiles and more reasons to feel good about yourself

i am here for you and i support you in everything you want to achieve

enjoy your day baby and take care always`;

const birthdayWishes = [
  "Your day turns simple moments into good memories. Keep going forward with steady confidence.",
  "New opportunities open in your path this year. Take each one with focus and patience.",
  "Your effort brings results even when progress feels slow. Trust your process.",
  "Stay surrounded by people who support your growth and peace of mind.",
  "Keep your goals clear. Small daily actions build your future."
];

const scenes = Array.from(document.querySelectorAll(".scene"));
const loader = document.getElementById("loader");
const prevScene = document.getElementById("prevScene");
const nextScene = document.getElementById("nextScene");
const sceneCount = document.getElementById("sceneCount");
const songButton = document.getElementById("songButton");
const audioPanel = document.getElementById("audioPanel");
const audio = document.getElementById("birthdayAudio");
const audioSource = document.getElementById("audioSource");
const trackTitle = document.getElementById("trackTitle");
const audioPlay = document.getElementById("audioPlay");
const audioPause = document.getElementById("audioPause");
const audioProgress = document.getElementById("audioProgress");
const audioVolume = document.getElementById("audioVolume");
const birthdayMessage = document.getElementById("birthdayMessage");
const candleTarget = document.getElementById("candleTarget");
const letterScene = document.querySelector(".scene-envelope");
const envelope = document.getElementById("envelope");
const paperPeek = document.getElementById("paperPeek");
const letterOverlay = document.getElementById("letterOverlay");
const letterPaper = document.getElementById("letterPaper");
const letterText = document.getElementById("letterText");
const closeLetter = document.getElementById("closeLetter");
const letterBackdrop = document.getElementById("letterBackdrop");
const wishesScene = document.querySelector(".scene-wishes");
const wishCard = document.getElementById("wishCard");
const celebrateScene = document.querySelector(".scene-celebrate");
const celebrateButton = document.getElementById("celebrateButton");
const giftScene = document.querySelector(".scene-gift");
const giftBox = document.getElementById("giftBox");
const surprise = document.getElementById("surprise");
const closeGift = document.getElementById("closeGift");
const giftBackdrop = document.getElementById("giftBackdrop");
const endingScene = document.querySelector(".scene-ending");

const fxCanvas = document.getElementById("fxCanvas");
const fx = fxCanvas.getContext("2d");
const cakeCanvas = document.getElementById("cakeCanvas");
const cake = cakeCanvas.getContext("2d");
const starsCanvas = document.getElementById("starsCanvas");
const starsCtx = starsCanvas.getContext("2d");
const endingCanvas = document.getElementById("endingCanvas");
const endingCtx = endingCanvas.getContext("2d");

const FIREWORK_TAU = Math.PI * 2;
const FIREWORK_COLORS = ["#f5c76a", "#ffd7d7", "#d6c8ff", "#8ff4ff", "#ffffff", "#ff9fa8"];
const FIREWORK_PALETTES = [
  ["#f5c76a", "#ffffff", "#ff9fa8"],
  ["#ffd7d7", "#d6c8ff", "#ffffff"],
  ["#8ff4ff", "#ffffff", "#d6c8ff"],
  ["#f5c76a", "#8ff4ff", "#ffffff"],
  ["#ff9fa8", "#d6c8ff", "#f5c76a"]
];
const FIREWORK_LOW_POWER = window.innerWidth < 720 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
const FIREWORK_MAX_ROCKETS = FIREWORK_LOW_POWER ? 4 : 5;
const FIREWORK_MAX_PARTICLES = FIREWORK_LOW_POWER ? 340 : 520;
const FIREWORK_MAX_PARTICLE_POOL = FIREWORK_LOW_POWER ? 420 : 640;
const FIREWORK_MAX_SMOKE = FIREWORK_LOW_POWER ? 34 : 56;
const FIREWORK_MAX_BLOOMS = FIREWORK_LOW_POWER ? 2 : 3;
const FIREWORK_MAX_QUEUE = 4;
const FIREWORK_ROCKET_TRAIL = 10;
const WISH_DURATION = 20000;
const WISH_CLEANUP_DURATION = 1800;
const WISH_BUTTON_TEXT = "Make a Wish";

let activeScene = 0;
let candleLit = true;
let letterOpen = false;
let letterAnimating = false;
let giftOpen = false;
let giftAnimating = false;
let finalFadeStarted = false;
let confetti = [];
let hearts = [];
let smoke = [];
let sparkles = [];
let dust = [];
let stars = [];
let fireflies = [];
let rockets = [];
let fireworkParticles = [];
let fireworkSmoke = [];
let fireworkBlooms = [];
let particlePool = [];
let rocketPool = [];
let smokePool = [];
let bloomPool = [];
let wishFireworksActive = false;
let wishState = "idle";
let wishCanvas = null;
let wishFx = null;
let wishFrame = 0;
let wishStartTime = 0;
let wishCleanupStart = 0;
let wishLastTime = 0;
let wishTextTimers = [];
let nextFireworkLaunch = 0;
let queuedFireworks = 0;
let lastTime = 0;
let letterTimers = [];
let giftTimers = [];
let typeTimer = 0;

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 4200);
  setupAudio();
  resizeAll();
  createAmbientParticles();
  createWishStars();
  createEndingSky();
  showScene(0);
  requestAnimationFrame(loop);
});

window.addEventListener("resize", () => {
  resizeAll();
  createWishStars();
  createEndingSky();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLetterCard();
    closeGiftCard();
    return;
  }
  if (event.key === "ArrowRight") showScene(activeScene + 1);
  if (event.key === "ArrowLeft") showScene(activeScene - 1);
});

prevScene.addEventListener("click", () => showScene(activeScene - 1));
nextScene.addEventListener("click", () => showScene(activeScene + 1));

songButton.addEventListener("click", () => {
  audioPanel.classList.toggle("open");
});

audioPlay.addEventListener("click", () => {
  if (!audioConfig.src) {
    trackTitle.textContent = "Add an MP3 source in script.js";
    return;
  }
  audio.play();
});

audioPause.addEventListener("click", () => audio.pause());

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  audioProgress.value = (audio.currentTime / audio.duration) * 100;
});

audioProgress.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (Number(audioProgress.value) / 100) * audio.duration;
});

audioVolume.addEventListener("input", () => {
  audio.volume = Number(audioVolume.value);
});

candleTarget.addEventListener("click", () => {
  if (!candleLit) return;
  candleLit = false;
  birthdayMessage.classList.add("show");
  document.querySelector(".scene-cake").classList.add("bright");
  spawnSmoke(window.innerWidth * 0.72, window.innerHeight * 0.33, 34);
  burstConfetti(window.innerWidth * 0.62, window.innerHeight * 0.32, 170);
  burstSparkles(window.innerWidth * 0.58, window.innerHeight * 0.4, 54);
});

envelope.addEventListener("click", openLetter);
closeLetter.addEventListener("click", closeLetterCard);
letterBackdrop.addEventListener("click", closeLetterCard);

wishesScene.addEventListener("pointerdown", handleWishStarPick);

celebrateButton.addEventListener("click", () => {
  startWishFireworks();
});

giftBox.addEventListener("click", openGift);
closeGift.addEventListener("click", closeGiftCard);
giftBackdrop.addEventListener("click", closeGiftCard);

function setupAudio() {
  trackTitle.textContent = audioConfig.title;
  audioSource.src = audioConfig.src;
  audio.load();
  audio.volume = Number(audioVolume.value);
}

function showScene(index) {
  const currentScene = scenes[activeScene];
  activeScene = Math.max(0, Math.min(scenes.length - 1, index));
  if (currentScene && currentScene.dataset.scene === "celebrate" && scenes[activeScene].dataset.scene !== "celebrate") {
    resetWishMode();
  }
  scenes.forEach((scene, sceneIndex) => {
    scene.classList.toggle("active", sceneIndex === activeScene);
  });
  sceneCount.textContent = `${activeScene + 1} / ${scenes.length}`;
  prevScene.disabled = activeScene === 0;
  nextScene.disabled = activeScene === scenes.length - 1;

  if (scenes[activeScene].dataset.scene === "ending" && !finalFadeStarted) {
    finalFadeStarted = true;
    setTimeout(() => endingScene.classList.add("fade-out"), 5200);
  }
}

function resizeCanvas(canvas, context) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function resizeAll() {
  resizeCanvas(fxCanvas, fx);
  if (wishCanvas && wishFx) resizeCanvas(wishCanvas, wishFx);
  resizeCanvas(cakeCanvas, cake);
  resizeCanvas(starsCanvas, starsCtx);
  resizeCanvas(endingCanvas, endingCtx);
}

function createAmbientParticles() {
  dust = Array.from({ length: 90 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.7 + 0.4,
    speed: Math.random() * 0.26 + 0.05,
    phase: Math.random() * Math.PI * 2,
    alpha: Math.random() * 0.28 + 0.08
  }));
}

function createWishStars() {
  stars = birthdayWishes.map((wish, index) => ({
    x: window.innerWidth * (0.18 + ((index * 0.17) % 0.68)),
    y: window.innerHeight * (0.22 + ((index * 0.19) % 0.52)),
    r: 8 + Math.random() * 7,
    hit: 92,
    phase: Math.random() * Math.PI * 2,
    wish
  }));
}

function handleWishStarPick(event) {
  if (scenes[activeScene].dataset.scene !== "wishes") return;

  const x = event.clientX;
  const y = event.clientY;
  let closest = null;
  let closestDistance = Infinity;

  stars.forEach((star) => {
    const distance = Math.hypot(star.x - x, star.y - y);
    if (distance < star.hit && distance < closestDistance) {
      closest = star;
      closestDistance = distance;
    }
  });

  if (!closest) return;
  wishCard.textContent = closest.wish;
  wishCard.classList.remove("show");
  void wishCard.offsetWidth;
  wishCard.classList.add("show");
  burstSparkles(event.clientX, event.clientY, 42);
}

function createEndingSky() {
  fireflies = Array.from({ length: 38 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2.2 + 1.1,
    vx: Math.random() * 0.32 - 0.16,
    vy: Math.random() * 0.24 - 0.12,
    phase: Math.random() * Math.PI * 2
  }));
}

function openLetter() {
  if (letterOpen || letterAnimating) return;
  letterOpen = true;
  letterAnimating = true;
  clearLetterTimers();
  clearTimeout(typeTimer);
  letterText.textContent = "";
  envelope.disabled = true;

  letterScene.classList.add("letter-flap");
  letterTimers.push(setTimeout(() => {
    letterScene.classList.add("letter-out");
  }, 650));
  letterTimers.push(setTimeout(() => {
    prepareDetachedLetter();
    letterOverlay.classList.add("visible");
    letterOverlay.setAttribute("aria-hidden", "false");
    letterScene.classList.add("focus-mode", "letter-detached");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        letterBackdrop.classList.add("active");
        letterOverlay.classList.add("centered");
      });
    });
  }, 1900));
  letterTimers.push(setTimeout(() => {
    letterAnimating = false;
    typeLetter();
  }, 3220));
}

function closeLetterCard() {
  if (!letterOpen) return;
  letterAnimating = true;
  clearLetterTimers();
  clearTimeout(typeTimer);
  letterText.textContent = "";

  const overlayVisible = letterOverlay.classList.contains("visible");
  const paperDetached = letterScene.classList.contains("letter-detached");

  if (overlayVisible) {
    letterOverlay.classList.remove("centered");
    letterTimers.push(setTimeout(() => {
      letterScene.classList.remove("letter-detached");
      letterOverlay.classList.remove("visible");
      letterOverlay.setAttribute("aria-hidden", "true");
    }, paperDetached ? 1120 : 160));
    letterTimers.push(setTimeout(() => {
      letterScene.classList.remove("letter-out");
    }, paperDetached ? 1480 : 360));
    letterTimers.push(setTimeout(() => {
      letterScene.classList.remove("letter-flap");
    }, paperDetached ? 2220 : 900));
    letterTimers.push(setTimeout(() => {
      letterScene.classList.remove("focus-mode");
      letterBackdrop.classList.remove("active");
    }, paperDetached ? 2520 : 1120));
    letterTimers.push(setTimeout(finishLetterClose, paperDetached ? 3200 : 1600));
    return;
  }

  letterScene.classList.remove("letter-detached", "focus-mode");
  letterBackdrop.classList.remove("active");
  letterTimers.push(setTimeout(() => {
    letterScene.classList.remove("letter-out");
  }, 120));
  letterTimers.push(setTimeout(() => {
    letterScene.classList.remove("letter-flap");
  }, 780));
  letterTimers.push(setTimeout(finishLetterClose, 1500));
}

function prepareDetachedLetter() {
  const rect = paperPeek.getBoundingClientRect();
  const fromX = rect.left + rect.width / 2 - window.innerWidth / 2;
  const fromY = rect.top + rect.height / 2 - window.innerHeight / 2;
  letterPaper.style.setProperty("--letter-from-x", `${fromX}px`);
  letterPaper.style.setProperty("--letter-from-y", `${fromY}px`);
  letterPaper.style.width = `${rect.width}px`;
  letterPaper.style.minHeight = `${rect.height}px`;
}

function finishLetterClose() {
  letterScene.classList.remove("letter-flap", "letter-out", "letter-detached", "focus-mode");
  letterOverlay.classList.remove("visible", "centered");
  letterOverlay.setAttribute("aria-hidden", "true");
  letterBackdrop.classList.remove("active");
  letterPaper.style.removeProperty("--letter-from-x");
  letterPaper.style.removeProperty("--letter-from-y");
  letterPaper.style.removeProperty("width");
  letterPaper.style.removeProperty("min-height");
  envelope.disabled = false;
  letterOpen = false;
  letterAnimating = false;
}

function clearLetterTimers() {
  letterTimers.forEach((timer) => clearTimeout(timer));
  letterTimers = [];
}

function openGift() {
  if (giftOpen || giftAnimating) return;
  giftOpen = true;
  giftAnimating = true;
  clearGiftTimers();

  giftBox.classList.add("untied");
  giftTimers.push(setTimeout(() => {
    giftBox.classList.add("lid-open");
  }, 520));
  giftTimers.push(setTimeout(() => {
    giftBox.classList.add("glowing");
    giftScene.classList.add("surprise-rising");
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.47, 56);
    burstSparkles(window.innerWidth / 2, window.innerHeight * 0.48, 96);
    burstHearts(window.innerWidth / 2, window.innerHeight * 0.55, 34);
    burstSparkles(window.innerWidth * 0.42, window.innerHeight * 0.48, 34);
    burstSparkles(window.innerWidth * 0.6, window.innerHeight * 0.48, 34);
    spawnGiftStream();
  }, 980));
  giftTimers.push(setTimeout(() => {
    setGiftFocusVars();
    giftScene.classList.add("focus-mode", "surprise-focused");
    giftAnimating = false;
  }, 1720));
  giftTimers.push(setTimeout(() => {
    giftAnimating = false;
  }, 2740));
}

function closeGiftCard() {
  if (!giftOpen || giftAnimating) return;
  giftAnimating = true;
  clearGiftTimers();
  giftScene.classList.remove("surprise-focused", "focus-mode");
  giftTimers.push(setTimeout(() => {
    giftScene.classList.remove("surprise-rising");
  }, 620));
  giftTimers.push(setTimeout(() => {
    giftBox.classList.remove("glowing", "lid-open");
  }, 1160));
  giftTimers.push(setTimeout(() => {
    giftBox.classList.remove("untied");
  }, 1740));
  giftTimers.push(setTimeout(() => {
    giftOpen = false;
    giftAnimating = false;
  }, 2500));
}

function setGiftFocusVars() {
  const rect = surprise.getBoundingClientRect();
  const x = window.innerWidth / 2 - (rect.left + rect.width / 2);
  const y = window.innerHeight / 2 - (rect.top + rect.height / 2);
  surprise.style.setProperty("--gift-focus-x", `${x}px`);
  surprise.style.setProperty("--gift-focus-y", `${y}px`);
}

function clearGiftTimers() {
  giftTimers.forEach((timer) => clearTimeout(timer));
  giftTimers = [];
}

function startWishFireworks() {
  if (wishState !== "idle") return;

  wishState = "active";
  wishFireworksActive = true;
  wishStartTime = performance.now();
  wishLastTime = wishStartTime;
  wishCleanupStart = 0;
  nextFireworkLaunch = 0;
  queuedFireworks = 0;
  celebrateButton.disabled = true;
  celebrateButton.textContent = "Make your wish...";
  mountWishCanvas();
  clearWishTextTimers();
  wishTextTimers.push(setTimeout(() => {
    if (wishState === "active") celebrateButton.textContent = "Close your eyes...";
  }, 1200));
  wishTextTimers.push(setTimeout(() => {
    if (wishState === "active") celebrateButton.textContent = "Wishing in progress...";
  }, 3800));
  launchFireworks(2);
  if (!wishFrame) wishFrame = requestAnimationFrame(wishLoop);
}

function mountWishCanvas() {
  if (wishCanvas) return;
  wishCanvas = document.createElement("canvas");
  wishCanvas.className = "wish-fireworks-canvas";
  wishCanvas.setAttribute("aria-hidden", "true");
  celebrateScene.insertBefore(wishCanvas, celebrateScene.firstChild);
  wishFx = wishCanvas.getContext("2d");
  resizeCanvas(wishCanvas, wishFx);
}

function wishLoop(time) {
  if (wishState === "idle" || !wishCanvas || !wishFx) {
    wishFrame = 0;
    return;
  }

  const elapsed = time - wishStartTime;
  const delta = Math.min(32, time - wishLastTime || 16);
  wishLastTime = time;

  if (wishState === "active" && elapsed >= WISH_DURATION) {
    beginWishEnding(time);
  }

  if (wishState === "ending" && time - wishCleanupStart >= WISH_CLEANUP_DURATION) {
    resetWishMode();
    return;
  }

  drawWishFireworks(delta);
  wishFrame = requestAnimationFrame(wishLoop);
}

function beginWishEnding(time) {
  wishState = "ending";
  wishFireworksActive = false;
  queuedFireworks = 0;
  wishCleanupStart = time;
  clearWishTextTimers();
  celebrateButton.textContent = "Wishing in progress...";
  if (wishCanvas) wishCanvas.classList.add("fading");
}

function resetWishMode() {
  wishState = "reset";
  wishFireworksActive = false;
  queuedFireworks = 0;
  nextFireworkLaunch = 0;
  clearWishTextTimers();
  if (wishFrame) cancelAnimationFrame(wishFrame);
  wishFrame = 0;
  clearWishFireworkState();

  if (wishCanvas) {
    wishCanvas.remove();
    wishCanvas = null;
  }
  wishFx = null;
  celebrateButton.disabled = false;
  celebrateButton.textContent = WISH_BUTTON_TEXT;
  wishState = "idle";
}

function clearWishTextTimers() {
  wishTextTimers.forEach((timer) => clearTimeout(timer));
  wishTextTimers = [];
}

function clearWishFireworkState() {
  rockets.length = 0;
  fireworkParticles.length = 0;
  fireworkSmoke.length = 0;
  fireworkBlooms.length = 0;
  particlePool.length = 0;
  rocketPool.length = 0;
  smokePool.length = 0;
  bloomPool.length = 0;
}

function spawnGiftStream() {
  for (let i = 0; i < 6; i += 1) {
    giftTimers.push(setTimeout(() => {
      burstSparkles(window.innerWidth / 2, window.innerHeight * 0.5, 26);
      if (i % 2 === 0) burstConfetti(window.innerWidth / 2, window.innerHeight * 0.52, 14);
      if (i % 2 === 1) burstHearts(window.innerWidth / 2, window.innerHeight * 0.56, 8);
    }, i * 170));
  }
}

function typeLetter() {
  let index = 0;
  letterText.textContent = "";

  const write = () => {
    if (!letterOpen) return;
    letterText.textContent = letterMessage.slice(0, index);
    index += 1;
    if (index <= letterMessage.length) {
      typeTimer = setTimeout(write, letterMessage[index - 1] === "\n" ? 190 : 32);
    }
  };

  typeTimer = setTimeout(write, 120);
}

function loop(time) {
  const delta = Math.min(32, time - lastTime || 16);
  lastTime = time;
  drawCake(time);
  drawStars(time);
  drawEnding(time);
  drawEffects(delta, time);
  requestAnimationFrame(loop);
}

function drawCake(time) {
  const w = cakeCanvas.clientWidth;
  const h = cakeCanvas.clientHeight;
  const cx = w / 2;
  cake.clearRect(0, 0, w, h);

  const glow = cake.createRadialGradient(cx, h * 0.36, 10, cx, h * 0.42, w * 0.56);
  glow.addColorStop(0, candleLit ? "rgba(245, 199, 106, 0.22)" : "rgba(245, 199, 106, 0.07)");
  glow.addColorStop(1, "rgba(245, 199, 106, 0)");
  cake.fillStyle = glow;
  cake.fillRect(0, 0, w, h);

  drawEllipse(cx, h * 0.82, w * 0.39, h * 0.06, "rgba(0, 0, 0, 0.5)");
  drawCakeLayer(cx, h * 0.65, w * 0.54, h * 0.17, "#6b3933", "#2d1918");
  drawCakeLayer(cx, h * 0.54, w * 0.48, h * 0.16, "#7e4740", "#351d1c");
  drawCakeLayer(cx, h * 0.44, w * 0.4, h * 0.14, "#8b5149", "#3d2220");

  drawFrosting(cx, h * 0.38, w * 0.42, h * 0.055);
  drawFrosting(cx, h * 0.5, w * 0.5, h * 0.045);
  drawFrosting(cx, h * 0.62, w * 0.56, h * 0.045);
  drawCandle(cx, h, time);
  drawCakeSparkles(w, h, time);
}

function drawCakeLayer(cx, y, width, height, top, side) {
  const radius = height * 0.48;
  const x = cx - width / 2;
  const grad = cake.createLinearGradient(x, y, x + width, y + height);
  grad.addColorStop(0, top);
  grad.addColorStop(0.55, side);
  grad.addColorStop(1, "#170f0f");
  cake.fillStyle = grad;
  roundRect(cake, x, y, width, height, radius);
  cake.fill();
  drawEllipse(cx, y, width / 2, height * 0.27, "rgba(255, 230, 210, 0.16)");
}

function drawFrosting(cx, y, width, height) {
  cake.fillStyle = "#f3d7d8";
  for (let i = 0; i < 12; i += 1) {
    const x = cx - width / 2 + (width / 11) * i;
    drawEllipse(x, y, width * 0.055, height, "#f3d7d8");
  }
  cake.fillStyle = "rgba(217, 135, 135, 0.55)";
  cake.fillRect(cx - width * 0.42, y - height * 0.18, width * 0.84, height * 0.18);
}

function drawCandle(cx, h, time) {
  const candleX = cx;
  const candleY = h * 0.23;
  const candleW = 22;
  const candleH = h * 0.18;
  cake.fillStyle = "#f7e8e8";
  roundRect(cake, candleX - candleW / 2, candleY, candleW, candleH, 6);
  cake.fill();
  cake.strokeStyle = "#d98787";
  cake.lineWidth = 4;
  for (let i = -3; i < 5; i += 1) {
    cake.beginPath();
    cake.moveTo(candleX - candleW / 2, candleY + i * 18);
    cake.lineTo(candleX + candleW / 2, candleY + i * 18 + 18);
    cake.stroke();
  }

  if (!candleLit) return;
  const flicker = Math.sin(time * 0.02) * 4 + Math.random() * 2;
  const flameY = candleY - 20;
  const flameGrad = cake.createRadialGradient(candleX, flameY + 7, 2, candleX, flameY + 6, 35 + flicker);
  flameGrad.addColorStop(0, "#fff8be");
  flameGrad.addColorStop(0.32, "#f5c76a");
  flameGrad.addColorStop(0.72, "rgba(255, 104, 42, 0.62)");
  flameGrad.addColorStop(1, "rgba(255, 104, 42, 0)");
  cake.fillStyle = flameGrad;
  cake.beginPath();
  cake.ellipse(candleX, flameY, 15 + flicker * 0.35, 29 + flicker, 0, 0, Math.PI * 2);
  cake.fill();
  cake.fillStyle = "#fff8cf";
  cake.beginPath();
  cake.ellipse(candleX, flameY + 4, 6, 14, 0, 0, Math.PI * 2);
  cake.fill();
}

function drawCakeSparkles(w, h, time) {
  cake.fillStyle = "rgba(245, 199, 106, 0.8)";
  for (let i = 0; i < 18; i += 1) {
    const x = w * (0.18 + ((i * 0.067) % 0.64));
    const y = h * (0.2 + ((i * 0.113) % 0.54));
    const alpha = 0.25 + Math.sin(time * 0.003 + i) * 0.25;
    cake.globalAlpha = Math.max(0.1, alpha);
    drawStarShape(cake, x, y, 3.5, 8);
  }
  cake.globalAlpha = 1;
}

function drawStars(time) {
  starsCtx.clearRect(0, 0, starsCanvas.clientWidth, starsCanvas.clientHeight);
  if (scenes[activeScene].dataset.scene !== "wishes") return;

  stars.forEach((star) => {
    const pulse = 1 + Math.sin(time * 0.003 + star.phase) * 0.18;
    const grad = starsCtx.createRadialGradient(star.x, star.y, 2, star.x, star.y, star.r * 5);
    grad.addColorStop(0, "rgba(255, 246, 190, 0.95)");
    grad.addColorStop(0.22, "rgba(245, 199, 106, 0.62)");
    grad.addColorStop(1, "rgba(245, 199, 106, 0)");
    starsCtx.fillStyle = grad;
    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, star.r * 5 * pulse, 0, Math.PI * 2);
    starsCtx.fill();
    starsCtx.fillStyle = "#fff4ba";
    drawStarShape(starsCtx, star.x, star.y, star.r * 0.55 * pulse, star.r * 1.4 * pulse);
  });
}

function drawEnding(time) {
  endingCtx.clearRect(0, 0, endingCanvas.clientWidth, endingCanvas.clientHeight);
  if (scenes[activeScene].dataset.scene !== "ending") return;

  const w = endingCanvas.clientWidth;
  const h = endingCanvas.clientHeight;
  endingCtx.fillStyle = "#050506";
  endingCtx.fillRect(0, 0, w, h);

  for (let i = 0; i < 120; i += 1) {
    const x = (i * 97) % w;
    const y = (i * 53) % h;
    const alpha = 0.2 + Math.sin(time * 0.002 + i) * 0.18;
    endingCtx.fillStyle = `rgba(255, 248, 220, ${alpha})`;
    endingCtx.fillRect(x, y, 1.5, 1.5);
  }

  fireflies.forEach((fly) => {
    fly.x += fly.vx + Math.sin(time * 0.001 + fly.phase) * 0.12;
    fly.y += fly.vy + Math.cos(time * 0.001 + fly.phase) * 0.08;
    if (fly.x < -20) fly.x = w + 20;
    if (fly.x > w + 20) fly.x = -20;
    if (fly.y < -20) fly.y = h + 20;
    if (fly.y > h + 20) fly.y = -20;

    const glow = endingCtx.createRadialGradient(fly.x, fly.y, 1, fly.x, fly.y, fly.r * 8);
    glow.addColorStop(0, "rgba(245, 199, 106, 0.92)");
    glow.addColorStop(1, "rgba(245, 199, 106, 0)");
    endingCtx.fillStyle = glow;
    endingCtx.beginPath();
    endingCtx.arc(fly.x, fly.y, fly.r * 8, 0, Math.PI * 2);
    endingCtx.fill();
  });
}

function drawEffects(delta, time) {
  if (hasActiveFireworks()) {
    fx.save();
    fx.globalCompositeOperation = "destination-out";
    fx.fillStyle = "rgba(0, 0, 0, 0.34)";
    fx.fillRect(0, 0, fxCanvas.clientWidth, fxCanvas.clientHeight);
    fx.restore();
  } else {
    fx.clearRect(0, 0, fxCanvas.clientWidth, fxCanvas.clientHeight);
  }
  drawDust(delta, time);
  drawSmoke(delta);
  drawConfetti(delta);
  drawHearts(delta);
  drawSparkles(delta);
}

function drawDust(delta, time) {
  dust.forEach((dot) => {
    dot.y -= dot.speed * delta * 0.06;
    dot.x += Math.sin(time * 0.001 + dot.phase) * 0.05;
    if (dot.y < -10) {
      dot.y = window.innerHeight + 10;
      dot.x = Math.random() * window.innerWidth;
    }
    fx.fillStyle = `rgba(245, 199, 106, ${dot.alpha})`;
    fx.beginPath();
    fx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    fx.fill();
  });
}

function spawnSmoke(x, y, amount) {
  for (let i = 0; i < amount; i += 1) {
    smoke.push({
      x: x + Math.random() * 24 - 12,
      y: y + Math.random() * 14 - 7,
      vx: Math.random() * 0.8 - 0.4,
      vy: -Math.random() * 1.4 - 0.45,
      r: Math.random() * 12 + 8,
      life: 120
    });
  }
}

function drawSmoke(delta) {
  smoke = smoke.filter((puff) => puff.life > 0);
  smoke.forEach((puff) => {
    puff.life -= delta * 0.55;
    puff.x += puff.vx;
    puff.y += puff.vy;
    puff.r += 0.08;
    fx.fillStyle = `rgba(190, 184, 174, ${Math.max(puff.life / 520, 0)})`;
    fx.beginPath();
    fx.arc(puff.x, puff.y, puff.r, 0, Math.PI * 2);
    fx.fill();
  });
}

function burstConfetti(x, y, amount) {
  const colors = ["#f5c76a", "#ffd7d7", "#d98787", "#fff2d5"];
  for (let i = 0; i < amount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 2;
    confetti.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: Math.random() * 7 + 4,
      spin: Math.random() * 0.24 - 0.12,
      rot: Math.random() * Math.PI,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 150
    });
  }
}

function drawConfetti(delta) {
  confetti = confetti.filter((piece) => piece.life > 0);
  confetti.forEach((piece) => {
    piece.life -= delta * 0.65;
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += 0.12;
    piece.rot += piece.spin;
    fx.save();
    fx.translate(piece.x, piece.y);
    fx.rotate(piece.rot);
    fx.globalAlpha = Math.max(piece.life / 150, 0);
    fx.fillStyle = piece.color;
    fx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.54);
    fx.restore();
    fx.globalAlpha = 1;
  });
}

function burstHearts(x, y, amount) {
  const colors = ["#ffd7d7", "#f4a8ad", "#d98787", "#ffe3ec"];
  for (let i = 0; i < amount; i += 1) {
    const spread = (Math.random() - 0.5) * 160;
    hearts.push({
      x: x + spread,
      y: y + Math.random() * 28,
      vx: (Math.random() - 0.5) * 1.8,
      vy: -(Math.random() * 2.4 + 1.2),
      size: Math.random() * 7 + 7,
      sway: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.025,
      rot: (Math.random() - 0.5) * 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 190
    });
  }
}

function drawHearts(delta) {
  hearts = hearts.filter((heart) => heart.life > 0);
  hearts.forEach((heart) => {
    heart.life -= delta * 0.55;
    heart.sway += 0.045;
    heart.x += heart.vx + Math.sin(heart.sway) * 0.26;
    heart.y += heart.vy;
    heart.vy += 0.01;
    heart.rot += heart.spin;

    fx.save();
    fx.translate(heart.x, heart.y);
    fx.rotate(heart.rot);
    fx.scale(heart.size / 18, heart.size / 18);
    fx.globalAlpha = Math.max(heart.life / 190, 0);
    fx.fillStyle = heart.color;
    fx.shadowColor = "rgba(255, 215, 215, 0.65)";
    fx.shadowBlur = 12;
    drawHeartShape(fx);
    fx.fill();
    fx.restore();
    fx.globalAlpha = 1;
    fx.shadowBlur = 0;
  });
}

function burstSparkles(x, y, amount) {
  for (let i = 0; i < amount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3.6 + 0.8;
    sparkles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: Math.random() * 2.4 + 1.2,
      life: 90
    });
  }
}

function drawSparkles(delta) {
  sparkles = sparkles.filter((spark) => spark.life > 0);
  sparkles.forEach((spark) => {
    spark.life -= delta * 0.75;
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vy += 0.01;
    fx.shadowColor = "#f5c76a";
    fx.shadowBlur = 14;
    fx.fillStyle = `rgba(245, 199, 106, ${Math.max(spark.life / 90, 0)})`;
    fx.beginPath();
    fx.arc(spark.x, spark.y, spark.r, 0, Math.PI * 2);
    fx.fill();
    fx.shadowBlur = 0;
  });
}

function launchFireworks(amount) {
  for (let i = 0; i < amount; i += 1) {
    queuedFireworks += 1;
  }
}

function drawWishFireworks(delta) {
  const dt = Math.min(1.8, delta / 16.67);

  if (wishFireworksActive) {
    nextFireworkLaunch -= delta;
    if (nextFireworkLaunch <= 0) {
      queuedFireworks += Math.random() > 0.78 ? 2 : 1;
      nextFireworkLaunch = 300 + Math.random() * 900;
    }
  }

  emitQueuedFireworks();
  updateFireworks(dt);
  renderFireworks();
}

function hasActiveFireworks() {
  return wishFireworksActive || rockets.length > 0 || fireworkParticles.length > 0 || fireworkSmoke.length > 0 || fireworkBlooms.length > 0;
}

function emitQueuedFireworks() {
  while (queuedFireworks > 0 && rockets.length < FIREWORK_MAX_ROCKETS) {
    rockets.push(createRocket());
    queuedFireworks -= 1;
  }
  if (queuedFireworks > FIREWORK_MAX_QUEUE) queuedFireworks = FIREWORK_MAX_QUEUE;
}

function updateFireworks(dt) {
  updateFireworkSmoke(dt);
  updateFireworkBlooms(dt);
  updateRockets(dt);
  updateFireworkParticles(dt);
  enforceFireworkLimits();
}

function renderFireworks() {
  renderFireworkSmoke();
  renderFireworkBlooms();
  renderRocketTrails();
  renderRocketHeads();
  renderFireworkParticles();
}

function createRocket() {
  const rocket = rocketPool.pop() || {
    trailX: new Array(FIREWORK_ROCKET_TRAIL),
    trailY: new Array(FIREWORK_ROCKET_TRAIL)
  };
  const startX = window.innerWidth * (0.08 + Math.random() * 0.84);
  const peakY = window.innerHeight * (0.1 + Math.random() * 0.34);
  const drift = (Math.random() - 0.5) * 1.12;
  const palette = randomFireworkPalette();

  rocket.x = startX;
  rocket.y = window.innerHeight + 24;
  rocket.px = rocket.x;
  rocket.py = rocket.y;
  rocket.vx = drift;
  rocket.vy = -(9.5 + Math.random() * 3.3);
  rocket.ax = (Math.random() - 0.5) * 0.018;
  rocket.ay = 0.052 + Math.random() * 0.018;
  rocket.peakY = peakY;
  rocket.color = palette[0];
  rocket.palette = palette;
  rocket.shape = randomFireworkShape();
  rocket.trailIndex = 0;
  rocket.trailCount = 0;
  rocket.life = 190;
  return rocket;
}

function updateRockets(dt) {
  for (let i = rockets.length - 1; i >= 0; i -= 1) {
    const rocket = rockets[i];
    rocket.life -= dt;
    rocket.trailX[rocket.trailIndex] = rocket.x;
    rocket.trailY[rocket.trailIndex] = rocket.y;
    rocket.trailIndex = (rocket.trailIndex + 1) % FIREWORK_ROCKET_TRAIL;
    rocket.trailCount = Math.min(rocket.trailCount + 1, FIREWORK_ROCKET_TRAIL);

    rocket.px = rocket.x;
    rocket.py = rocket.y;
    rocket.vx += rocket.ax * dt;
    rocket.vy += rocket.ay * dt;
    rocket.x += rocket.vx * dt;
    rocket.y += rocket.vy * dt;

    if (rocket.y <= rocket.peakY || rocket.vy >= -1.2 || rocket.life <= 0) {
      explodeFirework(rocket.x, rocket.y, rocket.palette, rocket.shape);
      recycleRocket(i);
    }
  }
}

function explodeFirework(x, y, palette, shape) {
  if (fireworkBlooms.length >= FIREWORK_MAX_BLOOMS) {
    queuedFireworks += 1;
    return;
  }

  const bloom = bloomPool.pop() || {};
  bloom.x = x;
  bloom.y = y;
  bloom.color = palette[0];
  bloom.radius = 8;
  bloom.life = 22;
  bloom.maxLife = 22;
  fireworkBlooms.push(bloom);
  addFireworkSmoke(x, y, 5, 0.5);

  if (shape === "star") {
    createStarBurst(x, y, palette);
  } else if (shape === "cluster") {
    createClusterBurst(x, y, palette);
  } else {
    createCircularBurst(x, y, palette);
  }
}

function createCircularBurst(x, y, palette) {
  const count = 72 + Math.floor(Math.random() * 28);
  const step = FIREWORK_TAU / count;
  const offset = Math.random() * FIREWORK_TAU;
  for (let i = 0; i < count; i += 1) {
    const angle = offset + i * step + (Math.random() - 0.5) * 0.08;
    const speed = 2.2 + Math.random() * 5.5;
    addFireworkParticle(x, y, Math.cos(angle), Math.sin(angle), speed, palette[i % palette.length], randomSparkType(i));
  }
}

function createStarBurst(x, y, palette) {
  const points = 5 + Math.floor(Math.random() * 3);
  const count = points * 15;
  const pointStep = FIREWORK_TAU / points;
  for (let i = 0; i < count; i += 1) {
    const point = i % points;
    const base = point * pointStep - Math.PI / 2;
    const angle = base + (Math.random() - 0.5) * 0.38;
    const speed = 3 + Math.random() * 6.2;
    addFireworkParticle(x, y, Math.cos(angle), Math.sin(angle), speed, palette[i % palette.length], randomSparkType(i));
  }

  for (let i = 0; i < 24; i += 1) {
    const angle = Math.random() * FIREWORK_TAU;
    addFireworkParticle(x, y, Math.cos(angle), Math.sin(angle), 1.6 + Math.random() * 2.8, palette[i % palette.length], "dust");
  }
}

function createClusterBurst(x, y, palette) {
  const clusters = 3 + Math.floor(Math.random() * 2);
  for (let c = 0; c < clusters; c += 1) {
    const centerAngle = Math.random() * FIREWORK_TAU;
    const centerCos = Math.cos(centerAngle);
    const centerSin = Math.sin(centerAngle);
    const centerSpeed = 1.4 + Math.random() * 2.8;
    const cx = x + centerCos * centerSpeed * 8;
    const cy = y + centerSin * centerSpeed * 8;

    for (let i = 0; i < 24; i += 1) {
      const angle = centerAngle + (Math.random() - 0.5) * 1.25;
      const speed = 1.8 + Math.random() * 5.2;
      addFireworkParticle(cx, cy, Math.cos(angle), Math.sin(angle), speed, palette[(i + c) % palette.length], randomSparkType(i));
    }
  }
}

function addFireworkParticle(x, y, cos, sin, speed, color, type) {
  if (fireworkParticles.length >= FIREWORK_MAX_PARTICLES) return;

  const particle = particlePool.pop() || {};
  const isDust = type === "dust";
  const isGlow = type === "glow";

  particle.x = x;
  particle.y = y;
  particle.px = x;
  particle.py = y;
  particle.vx = cos * speed;
  particle.vy = sin * speed;
  particle.color = color;
  particle.size = isDust ? 1.1 + Math.random() * 1.3 : isGlow ? 2.7 + Math.random() * 1.8 : 1.4 + Math.random() * 1.5;
  particle.life = isDust ? 70 + Math.random() * 32 : isGlow ? 82 + Math.random() * 30 : 62 + Math.random() * 32;
  particle.maxLife = particle.life;
  particle.gravity = isDust ? 0.017 : 0.032 + Math.random() * 0.018;
  particle.drag = isDust ? 0.986 : 0.978;
  particle.type = type;
  fireworkParticles.push(particle);
}

function updateFireworkParticles(dt) {
  for (let i = fireworkParticles.length - 1; i >= 0; i -= 1) {
    const particle = fireworkParticles[i];
    particle.life -= dt;

    if (particle.life <= 3 || particle.x < -80 || particle.x > window.innerWidth + 80 || particle.y > window.innerHeight + 80) {
      if (particle.type !== "dust" && Math.random() > 0.92) addFireworkSmoke(particle.x, particle.y, 1, 0.22);
      recycleFireworkParticle(i);
      continue;
    }

    particle.px = particle.x;
    particle.py = particle.y;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= particle.drag;
    particle.vy = particle.vy * particle.drag + particle.gravity * dt;
  }
}

function addFireworkSmoke(x, y, amount, strength) {
  const allowed = Math.min(amount, FIREWORK_MAX_SMOKE - fireworkSmoke.length);
  for (let i = 0; i < amount; i += 1) {
    if (i >= allowed) break;
    const haze = smokePool.pop() || {};
    haze.x = x + (Math.random() - 0.5) * 22;
    haze.y = y + (Math.random() - 0.5) * 16;
    haze.vx = (Math.random() - 0.5) * 0.34;
    haze.vy = -0.16 - Math.random() * 0.34;
    haze.r = 8 + Math.random() * 13;
    haze.life = 86 + Math.random() * 48;
    haze.maxLife = haze.life;
    haze.strength = strength;
    fireworkSmoke.push(haze);
  }
}

function updateFireworkSmoke(dt) {
  for (let i = fireworkSmoke.length - 1; i >= 0; i -= 1) {
    const haze = fireworkSmoke[i];
    haze.life -= dt;
    if (haze.life <= 0) {
      recycleFireworkSmoke(i);
      continue;
    }

    haze.x += haze.vx * dt;
    haze.y += haze.vy * dt;
    haze.r += 0.11 * dt;
  }
}

function updateFireworkBlooms(dt) {
  for (let i = fireworkBlooms.length - 1; i >= 0; i -= 1) {
    const bloom = fireworkBlooms[i];
    bloom.life -= dt;
    if (bloom.life <= 0) {
      recycleFireworkBloom(i);
      continue;
    }

    bloom.radius += 8.5 * dt;
  }
}

function renderFireworkSmoke() {
  fx.beginPath();
  fireworkSmoke.forEach((haze) => {
    fx.moveTo(haze.x + haze.r, haze.y);
    fx.arc(haze.x, haze.y, haze.r, 0, FIREWORK_TAU);
  });
  fx.fillStyle = "rgba(220, 210, 225, 0.028)";
  fx.fill();
}

function renderFireworkBlooms() {
  fireworkBlooms.forEach((bloom) => {
    const alpha = Math.max(bloom.life / bloom.maxLife, 0) * 0.58;
    const grad = fx.createRadialGradient(bloom.x, bloom.y, 1, bloom.x, bloom.y, bloom.radius);
    grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    grad.addColorStop(0.36, hexToRgba(bloom.color, alpha * 0.42));
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    fx.fillStyle = grad;
    fx.beginPath();
    fx.arc(bloom.x, bloom.y, bloom.radius, 0, FIREWORK_TAU);
    fx.fill();
  });
}

function renderRocketTrails() {
  rockets.forEach((rocket) => {
    fx.strokeStyle = hexToRgba(rocket.color, 0.42);
    fx.lineWidth = 1.8;
    fx.beginPath();
    for (let i = 0; i < rocket.trailCount; i += 1) {
      const index = (rocket.trailIndex - 1 - i + FIREWORK_ROCKET_TRAIL) % FIREWORK_ROCKET_TRAIL;
      const x = rocket.trailX[index];
      const y = rocket.trailY[index];
      if (i === 0) fx.moveTo(x, y);
      else fx.lineTo(x, y);
    }
    fx.stroke();
  });
}

function renderRocketHeads() {
  fx.shadowBlur = 14;
  rockets.forEach((rocket) => {
    fx.shadowColor = rocket.color;
    fx.fillStyle = "#ffffff";
    fx.beginPath();
    fx.arc(rocket.x, rocket.y, 2.4, 0, FIREWORK_TAU);
    fx.fill();
  });
  fx.shadowBlur = 0;
}

function renderFireworkParticles() {
  FIREWORK_COLORS.forEach((color) => {
    fx.fillStyle = color;
    fx.beginPath();
    fireworkParticles.forEach((particle) => {
      if (particle.color !== color || particle.type === "dust") return;
      const alpha = particle.life / particle.maxLife;
      if (alpha < 0.08) return;
      const size = Math.min(4.2, particle.size * alpha + 0.45);
      fx.moveTo(particle.x + size, particle.y);
      fx.arc(particle.x, particle.y, size, 0, FIREWORK_TAU);
    });
    fx.fill();
  });

  fx.beginPath();
  fireworkParticles.forEach((particle) => {
    if (particle.type !== "dust") return;
    const alpha = particle.life / particle.maxLife;
    if (alpha < 0.08) return;
    const size = Math.min(2.4, particle.size * alpha);
    fx.moveTo(particle.x + size, particle.y);
    fx.arc(particle.x, particle.y, size, 0, FIREWORK_TAU);
  });
  fx.fillStyle = "rgba(255, 255, 255, 0.3)";
  fx.fill();
}

function enforceFireworkLimits() {
  while (rockets.length > FIREWORK_MAX_ROCKETS) recycleRocket(0);
  while (fireworkParticles.length > FIREWORK_MAX_PARTICLES) recycleFireworkParticle(0);
  while (fireworkSmoke.length > FIREWORK_MAX_SMOKE) recycleFireworkSmoke(0);
  while (fireworkBlooms.length > FIREWORK_MAX_BLOOMS) recycleFireworkBloom(0);
}

function randomFireworkPalette() {
  return FIREWORK_PALETTES[Math.floor(Math.random() * FIREWORK_PALETTES.length)];
}

function randomFireworkShape() {
  const shapes = ["circle", "star", "cluster"];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function randomSparkType(index) {
  if (index % 7 === 0) return "glow";
  if (index % 5 === 0) return "dust";
  return "spark";
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function recycleRocket(index) {
  const rocket = rockets[index];
  rockets[index] = rockets[rockets.length - 1];
  rockets.pop();
  if (rocketPool.length < FIREWORK_MAX_ROCKETS * 2) rocketPool.push(rocket);
}

function recycleFireworkParticle(index) {
  const particle = fireworkParticles[index];
  fireworkParticles[index] = fireworkParticles[fireworkParticles.length - 1];
  fireworkParticles.pop();
  if (particlePool.length < FIREWORK_MAX_PARTICLE_POOL) particlePool.push(particle);
}

function recycleFireworkSmoke(index) {
  const haze = fireworkSmoke[index];
  fireworkSmoke[index] = fireworkSmoke[fireworkSmoke.length - 1];
  fireworkSmoke.pop();
  if (smokePool.length < FIREWORK_MAX_SMOKE) smokePool.push(haze);
}

function recycleFireworkBloom(index) {
  const bloom = fireworkBlooms[index];
  fireworkBlooms[index] = fireworkBlooms[fireworkBlooms.length - 1];
  fireworkBlooms.pop();
  if (bloomPool.length < FIREWORK_MAX_BLOOMS) bloomPool.push(bloom);
}

function drawEllipse(x, y, radiusX, radiusY, color) {
  cake.fillStyle = color;
  cake.beginPath();
  cake.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  cake.fill();
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawStarShape(context, x, y, inner, outer) {
  context.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 ? inner : outer;
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
  context.fill();
}

function drawHeartShape(context) {
  context.beginPath();
  context.moveTo(0, 6);
  context.bezierCurveTo(-15, -5, -16, -20, -3, -18);
  context.bezierCurveTo(0, -17, 2, -14, 3, -12);
  context.bezierCurveTo(4, -14, 6, -17, 9, -18);
  context.bezierCurveTo(22, -20, 21, -5, 0, 6);
  context.closePath();
}
