// Game constants
const GRID_SIZE = 64;
const PLAYER_SIZE = 32;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

// Game state
let gameState = 'boot';
let player = { x: 400, y: 300 };
let keys = {};
let touchStart = null;
let animationFrame = null;
let levelTimer = 0;
let crystalsCollected = 0;
let bossTimer = 10;

// DOM elements
const gameArea = document.getElementById('game-area');
const dialogueBox = document.getElementById('dialogue-box');
const dialogueText = document.getElementById('dialogue-text');
const levelIndicator = document.getElementById('level-indicator');
const mobileControls = document.getElementById('mobile-controls');

// Detect mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Initialize game
function init() {
    setupEventListeners();
    if (isMobile) {
        mobileControls.classList.remove('hidden');
    }
    gameLoop();
}

// Event listeners
function setupEventListeners() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('click', handleClick);
    
    // Mobile controls
    if (isMobile) {
        document.getElementById('up-btn').addEventListener('touchstart', () => keys['ArrowUp'] = true);
        document.getElementById('up-btn').addEventListener('touchend', () => keys['ArrowUp'] = false);
        document.getElementById('down-btn').addEventListener('touchstart', () => keys['ArrowDown'] = true);
        document.getElementById('down-btn').addEventListener('touchend', () => keys['ArrowDown'] = false);
        document.getElementById('left-btn').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
        document.getElementById('left-btn').addEventListener('touchend', () => keys['ArrowLeft'] = false);
        document.getElementById('right-btn').addEventListener('touchstart', () => keys['ArrowRight'] = true);
        document.getElementById('right-btn').addEventListener('touchend', () => keys['ArrowRight'] = false);
    }
}

function handleKeyDown(e) {
    keys[e.code] = true;
    if (gameState === 'boot') {
        startGame();
    }
}

function handleKeyUp(e) {
    keys[e.code] = false;
}

function handleTouchStart(e) {
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}

function handleTouchEnd(e) {
    if (touchStart && gameState === 'boot') {
        startGame();
    }
    touchStart = null;
}

function handleClick() {
    if (gameState === 'boot') {
        startGame();
    }
}

// Game loop
function gameLoop() {
    update();
    render();
    animationFrame = requestAnimationFrame(gameLoop);
}

function update() {
    switch (gameState) {
        case 'boot':
            updateBoot();
            break;
        case 'level1':
            updateLevel1();
            break;
        case 'level2':
            updateLevel2();
            break;
        case 'level3':
            updateLevel3();
            break;
        case 'final':
            updateFinal();
            break;
        case 'epilogue':
            updateEpilogue();
            break;
    }
}

function render() {
    switch (gameState) {
        case 'boot':
            renderBoot();
            break;
        case 'level1':
            renderLevel1();
            break;
        case 'level2':
            renderLevel2();
            break;
        case 'level3':
            renderLevel3();
            break;
        case 'final':
            renderFinal();
            break;
        case 'epilogue':
            renderEpilogue();
            break;
    }
}

// Boot screen
function updateBoot() {
    // Blinking effect handled in render
}

function renderBoot() {
    gameArea.innerHTML = '';
    const pressStart = document.createElement('div');
    pressStart.textContent = 'PRESS START';
    pressStart.style.position = 'absolute';
    pressStart.style.top = '50%';
    pressStart.style.left = '50%';
    pressStart.style.transform = 'translate(-50%, -50%)';
    pressStart.style.fontSize = '24px';
    pressStart.style.color = Math.floor(Date.now() / 500) % 2 ? '#fff' : '#000';
    gameArea.appendChild(pressStart);
}

// Start game
function startGame() {
    gameState = 'level1';
    levelIndicator.textContent = 'LEVEL: 1';
    createLevel1();
}

// Level 1: Spawn Room
function createLevel1() {
    gameArea.innerHTML = '';
    
    // Create room tiles
    for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
        for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
            const tile = document.createElement('div');
            tile.className = 'room-tile';
            tile.style.left = x + 'px';
            tile.style.top = y + 'px';
            gameArea.appendChild(tile);
        }
    }
    
    // Create player
    const playerElement = document.createElement('div');
    playerElement.id = 'player';
    playerElement.className = 'image-sprite';
    playerElement.style.left = player.x + 'px';
    playerElement.style.top = player.y + 'px';
    playerElement.style.backgroundImage = 'url("photo_2026-01-16_18-17-56.jpg")';
    gameArea.appendChild(playerElement);
    
    // Create glowing tile
    const glowingTile = document.createElement('div');
    glowingTile.id = 'glowing-tile';
    glowingTile.className = 'room-tile glowing-tile';
    glowingTile.style.left = '320px';
    glowingTile.style.top = '256px';
    gameArea.appendChild(glowingTile);
    
    // Add instruction text
    const instruction = document.createElement('div');
    instruction.textContent = 'FIND THE GLOWING TILE';
    instruction.style.position = 'absolute';
    instruction.style.top = '20px';
    instruction.style.left = '50%';
    instruction.style.transform = 'translateX(-50%)';
    instruction.style.fontSize = '12px';
    gameArea.appendChild(instruction);
}

function updateLevel1() {
    // Grid-based player movement
    const moveDistance = 8; // 8px steps for smoother movement
    let newX = player.x;
    let newY = player.y;
    
    if (keys['ArrowUp'] || keys['KeyW']) newY -= moveDistance;
    if (keys['ArrowDown'] || keys['KeyS']) newY += moveDistance;
    if (keys['ArrowLeft'] || keys['KeyA']) newX -= moveDistance;
    if (keys['ArrowRight'] || keys['KeyD']) newX += moveDistance;
    
    // Keep player in bounds
    newX = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_SIZE, newX));
    newY = Math.max(0, Math.min(CANVAS_HEIGHT - PLAYER_SIZE, newY));
    
    player.x = newX;
    player.y = newY;
    
    // Check collision with glowing tile
    const glowingTile = document.getElementById('glowing-tile');
    if (glowingTile && checkCollision(player, { x: 320, y: 256, width: GRID_SIZE, height: GRID_SIZE })) {
        gameState = 'level2';
        levelIndicator.textContent = 'LEVEL: 2';
        createLevel2();
    }
}

function renderLevel1() {
    const playerElement = document.getElementById('player');
    if (playerElement) {
        playerElement.style.left = player.x + 'px';
        playerElement.style.top = player.y + 'px';
    }
}

// Level 2: Memory Crystals
function createLevel2() {
    gameArea.innerHTML = '';
    
    // Create room
    for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
        for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
            const tile = document.createElement('div');
            tile.className = 'room-tile';
            tile.style.left = x + 'px';
            tile.style.top = y + 'px';
            gameArea.appendChild(tile);
        }
    }
    
    // Create player
    const playerElement = document.createElement('div');
    playerElement.id = 'player';
    playerElement.className = 'image-sprite';
    playerElement.style.left = player.x + 'px';
    playerElement.style.top = player.y + 'px';
    playerElement.style.backgroundImage = 'url("photo_2026-01-16_18-17-56.jpg")';
    gameArea.appendChild(playerElement);
    
    // Create crystals
    const crystalPositions = [
        { x: 128, y: 128, message: 'MEMORY: The wall Painting uk where it all Started' },
        { x: 320, y: 192, message: 'MEMORY: Scooty ride with you on your bday' },
        { x: 512, y: 256, message: 'MEMORY: All those eye Contact in School' },
        { x: 256, y: 384, message: 'MEMORY: The time you told me your feelings' }
    ];
    
    crystalPositions.forEach((pos, index) => {
        const crystal = document.createElement('div');
        crystal.className = 'crystal';
        crystal.dataset.index = index;
        crystal.dataset.message = pos.message;
        crystal.style.left = pos.x + 'px';
        crystal.style.top = pos.y + 'px';
        gameArea.appendChild(crystal);
    });
    
    const instruction = document.createElement('div');
    instruction.textContent = 'TOUCH THE CRYSTALS';
    instruction.style.position = 'absolute';
    instruction.style.top = '20px';
    instruction.style.left = '50%';
    instruction.style.transform = 'translateX(-50%)';
    instruction.style.fontSize = '12px';
    gameArea.appendChild(instruction);
}

function updateLevel2() {
    // Grid-based player movement
    const moveDistance = 8;
    let newX = player.x;
    let newY = player.y;
    
    if (keys['ArrowUp'] || keys['KeyW']) newY -= moveDistance;
    if (keys['ArrowDown'] || keys['KeyS']) newY += moveDistance;
    if (keys['ArrowLeft'] || keys['KeyA']) newX -= moveDistance;
    if (keys['ArrowRight'] || keys['KeyD']) newX += moveDistance;
    
    newX = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_SIZE, newX));
    newY = Math.max(0, Math.min(CANVAS_HEIGHT - PLAYER_SIZE, newY));
    
    player.x = newX;
    player.y = newY;
    
    // Check crystal collisions
    const crystals = document.querySelectorAll('.crystal');
    crystals.forEach(crystal => {
        if (checkCollision(player, {
            x: parseInt(crystal.style.left),
            y: parseInt(crystal.style.top),
            width: 32,
            height: 32
        })) {
            showDialogue(crystal.dataset.message);
            crystal.remove();
            crystalsCollected++;
            if (crystalsCollected >= 4) {
                setTimeout(() => {
                    gameState = 'level3';
                    levelIndicator.textContent = 'LEVEL: 3';
                    createLevel3();
                }, 5000);
            }
        }
    });
}

function renderLevel2() {
    const playerElement = document.getElementById('player');
    if (playerElement) {
        playerElement.style.left = player.x + 'px';
        playerElement.style.top = player.y + 'px';
    }
}

// Level 3: Countdown Boss
function createLevel3() {
    gameArea.innerHTML = '';
    
    // Create room
    for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
        for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
            const tile = document.createElement('div');
            tile.className = 'room-tile';
            tile.style.left = x + 'px';
            tile.style.top = y + 'px';
            gameArea.appendChild(tile);
        }
    }
    
    // Create boss
    const boss = document.createElement('div');
    boss.id = 'boss';
    boss.className = 'boss-image';
    boss.style.left = '336px';
    boss.style.top = '236px';
    boss.style.backgroundImage = 'url("photo_2026-01-16_18-18-18.jpg")';
    gameArea.appendChild(boss);
    
    // Create timer display
    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'timer-display';
    timerDisplay.textContent = 'TIME: ' + bossTimer;
    timerDisplay.style.position = 'absolute';
    timerDisplay.style.top = '20px';
    timerDisplay.style.left = '50%';
    timerDisplay.style.transform = 'translateX(-50%)';
    timerDisplay.style.fontSize = '12px';
    gameArea.appendChild(timerDisplay);
    
    levelTimer = Date.now();
}

function updateLevel3() {
    const currentTime = Date.now();
    if (currentTime - levelTimer >= 1000) {
        bossTimer--;
        levelTimer = currentTime;
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.textContent = 'TIME: ' + bossTimer;
        }
        if (bossTimer <= 0) {
            gameState = 'final';
            levelIndicator.textContent = 'FINAL';
            createFinal();
        }
    }
}

function renderLevel3() {
    // Boss animation
    const boss = document.getElementById('boss');
    if (boss) {
        const scale = 1 + Math.sin(Date.now() * 0.005) * 0.1;
        boss.style.transform = `scale(${scale})`;
    }
}

// Final Level: Birthday Reveal
function createFinal() {
    gameArea.innerHTML = '';
    gameArea.style.backgroundImage = 'url("happy-birthday-pixel-art-postcard-314998663.webp")';
    gameArea.style.backgroundSize = '200px 200px';
    gameArea.style.backgroundPosition = 'center';
    
    // Create fireworks
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * CANVAS_WIDTH + 'px';
            firework.style.top = Math.random() * CANVAS_HEIGHT + 'px';
            gameArea.appendChild(firework);
            setTimeout(() => firework.remove(), 2000);
        }, i * 100);
    }
    
    // Birthday text
    const birthdayText = document.createElement('div');
    birthdayText.textContent = 'HAPPY BIRTHDAY!';
    birthdayText.style.position = 'absolute';
    birthdayText.style.top = '50%';
    birthdayText.style.left = '50%';
    birthdayText.style.transform = 'translate(-50%, -50%)';
    birthdayText.style.fontSize = '24px';
    birthdayText.style.color = '#ff0';
    birthdayText.style.textAlign = 'center';
    gameArea.appendChild(birthdayText);
    
    // Screen shake
    gameArea.style.animation = 'shake 0.5s infinite';
    
    setTimeout(() => {
        gameState = 'epilogue';
        levelIndicator.textContent = 'EPILOGUE';
        createEpilogue();
    }, 4000);
}

function updateFinal() {
    // Animation handled in createFinal
}

function renderFinal() {
    // Animation handled in createFinal
}

// Epilogue: Message Screen
function createEpilogue() {
    gameArea.innerHTML = '';
    gameArea.style.animation = '';
    gameArea.style.backgroundImage = 'url("C:\Users\arjun\OneDrive\Desktop\KanishkaBirthday\happy-birthday-pixel-art-postcard-314998663.webp")';
    gameArea.style.backgroundSize = 'cover';
    gameArea.style.backgroundPosition = 'center';
    
    // Personal message
    const message = document.createElement('div');
    message.textContent = 'Hey there Kanishka, Sry For the late wish but why not make it a little special so this was something for you.Happiest Birthday to you! May your year be filled with joy, adventure, and amazing memories. You are loved and appreciated, I will be always there for you <3 - Pavitra';
    message.style.position = 'absolute';
    message.style.top = '30%';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.fontSize = '10px';
    message.style.textAlign = 'center';
    message.style.maxWidth = '600px';
    gameArea.appendChild(message);
    
    // Create stars
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * CANVAS_WIDTH + 'px';
        star.style.top = Math.random() * CANVAS_HEIGHT + 'px';
        star.style.animationDelay = Math.random() * 3 + 's';
        gameArea.appendChild(star);
    }
}

function updateEpilogue() {
    // Idle animation
}

function renderEpilogue() {
    // Stars twinkle automatically via CSS
}

// Utility functions
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + PLAYER_SIZE > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + PLAYER_SIZE > obj2.y;
}

function showDialogue(text) {
    dialogueText.textContent = text;
    dialogueBox.classList.remove('hidden');
    setTimeout(() => {
        dialogueBox.classList.add('hidden');
    }, 3000);
}

// Start the game
init();