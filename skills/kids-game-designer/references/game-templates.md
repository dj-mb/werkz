# Game Templates

Four complete, working, single-file HTML games. Each is a *starting point* —
copy the closest one and swap in the child's choices at the clearly marked
`/* CHANGE ME */` spots: title, colors, character emoji, item emoji, win
condition, and messages.

Everything (HTML + CSS + JavaScript) lives in one file with no external
downloads, so the child can double-click and play. Characters and items are
emoji so no image files are needed.

**Table of contents**
1. [Catch template](#1-catch-template) — move left/right to catch good things, dodge bad things
2. [Whack template](#2-whack-template) — things pop up, tap them fast for points
3. [Maze / move template](#3-maze--move-template) — arrow-key move to reach a goal, avoid blocks
4. [Quiz template](#4-quiz-template) — answer/guess to score points

Shared customization checklist for every template:
- **Title** — the name the child picked (appears in the tab and on screen).
- **Colors** — set the 2–3 chosen colors in the `:root` CSS variables.
- **Character emoji** — the sprite the player controls or represents.
- **Good/bad emoji** — items to collect and (optionally) items to avoid.
- **Win condition** — the target score or timer, and the win/lose messages.
- All controls and instructions must be visible on screen. Keep it one screen.

---

## 1. Catch template

Move a character left and right to catch falling good things and avoid falling
bad things. Works with arrow keys and with mouse/touch (the character follows
the pointer). This is the classic Scratch "catch the apples" idea.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pizza Catch Panic</title> <!-- CHANGE ME: game title -->
<style>
  :root {
    /* CHANGE ME: the child's chosen colors */
    --sky: #ffd54a;      /* background */
    --ground: #ff7043;   /* bottom strip */
    --text: #4a2600;     /* words */
    --accent: #2e7d32;   /* score / buttons */
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: "Comic Sans MS", "Trebuchet MS", sans-serif;
    background: var(--sky); color: var(--text); text-align: center;
    user-select: none; overflow: hidden;
  }
  h1 { margin: 10px; font-size: 8vw; }
  #score { font-size: 6vw; font-weight: bold; color: var(--accent); }
  #stage {
    position: relative; width: 100vw; height: 70vh;
    overflow: hidden; touch-action: none;
    border-bottom: 6vh solid var(--ground);
  }
  .item { position: absolute; font-size: 8vw; will-change: top; }
  #player { position: absolute; bottom: 1vh; font-size: 12vw; transform: translateX(-50%); }
  #msg {
    position: absolute; inset: 0; display: none; place-items: center;
    flex-direction: column; background: rgba(255,255,255,0.9);
  }
  #msg.show { display: flex; }
  button {
    font: inherit; font-size: 6vw; padding: 2vh 6vw; margin-top: 2vh;
    border: none; border-radius: 999px; background: var(--accent);
    color: white; cursor: pointer;
  }
</style>
</head>
<body>
  <h1>Pizza Catch Panic</h1> <!-- CHANGE ME: game title -->
  <div id="score">Score: 0</div>
  <div id="stage">
    <div id="player">🐱</div> <!-- CHANGE ME: character emoji -->
    <div id="msg">
      <div id="msgText" style="font-size:7vw;"></div>
      <button id="playBtn">Start!</button>
    </div>
  </div>

<script>
  // ---- CHANGE ME: the game's rules ----
  const GOOD = "🍕";        // good thing to catch
  const BAD  = "🥦";        // bad thing to dodge (set to "" for no bad things)
  const WIN_SCORE = 10;     // catch this many good things to win
  const MAX_MISSES = 3;     // miss/hit this many bad things and the round ends
  const WIN_MSG  = "YOU WIN! 🏆 Amazing catching!";
  const LOSE_MSG = "So close! Tap Play Again — you've got this! 💪";
  // -------------------------------------

  const stage = document.getElementById("stage");
  const player = document.getElementById("player");
  const scoreEl = document.getElementById("score");
  const msg = document.getElementById("msg");
  const msgText = document.getElementById("msgText");
  const playBtn = document.getElementById("playBtn");

  let score, misses, playerX, items, running, spawnTimer, keys;

  function reset() {
    score = 0; misses = 0; playerX = 50; items = []; running = false;
    keys = {};
    stage.querySelectorAll(".item").forEach(n => n.remove());
    updateScore();
    player.style.left = playerX + "%";
  }

  function updateScore() { scoreEl.textContent = "Score: " + score; }

  function start() {
    reset();
    running = true;
    msg.classList.remove("show");
    lastSpawn = 0;
    requestAnimationFrame(loop);
  }

  function endGame(won) {
    running = false;
    msgText.textContent = won ? WIN_MSG : LOSE_MSG;
    playBtn.textContent = "Play Again";
    msg.classList.add("show");
  }

  function spawnItem() {
    const isBad = BAD && Math.random() < 0.3;
    const el = document.createElement("div");
    el.className = "item";
    el.textContent = isBad ? BAD : GOOD;
    el.dataset.bad = isBad ? "1" : "0";
    el.style.left = Math.random() * 90 + "%";
    el.style.top = "-10%";
    el.speed = 0.4 + Math.random() * 0.5 + score * 0.03; // gets a little faster
    stage.appendChild(el);
    items.push(el);
  }

  let lastSpawn = 0;
  function loop(t) {
    if (!running) return;
    // move player with keys
    if (keys.ArrowLeft) playerX = Math.max(3, playerX - 1.5);
    if (keys.ArrowRight) playerX = Math.min(97, playerX + 1.5);
    player.style.left = playerX + "%";

    if (t - lastSpawn > 900) { spawnItem(); lastSpawn = t; }

    for (const el of [...items]) {
      let top = parseFloat(el.style.top);
      top += el.speed;
      el.style.top = top + "%";
      // caught? (near the bottom and close to the player)
      const elX = parseFloat(el.style.left);
      if (top > 80 && Math.abs(elX - playerX) < 12) {
        if (el.dataset.bad === "1") { misses++; }
        else { score++; }
        removeItem(el); updateScore();
      } else if (top > 100) {
        removeItem(el);
      }
    }

    if (score >= WIN_SCORE) return endGame(true);
    if (misses >= MAX_MISSES) return endGame(false);
    requestAnimationFrame(loop);
  }

  function removeItem(el) {
    el.remove();
    items = items.filter(i => i !== el);
  }

  // controls: keyboard
  addEventListener("keydown", e => { keys[e.key] = true; });
  addEventListener("keyup", e => { keys[e.key] = false; });
  // controls: mouse / touch — player follows the pointer
  function follow(clientX) {
    const r = stage.getBoundingClientRect();
    playerX = Math.min(97, Math.max(3, ((clientX - r.left) / r.width) * 100));
    player.style.left = playerX + "%";
  }
  stage.addEventListener("mousemove", e => running && follow(e.clientX));
  stage.addEventListener("touchmove", e => running && follow(e.touches[0].clientX));

  playBtn.addEventListener("click", start);
  reset();
  msgText.textContent = "Use ⬅️ ➡️ or your mouse to catch " + GOOD + "!";
  msg.classList.add("show");
</script>
</body>
</html>
```

---

## 2. Whack template

Things pop up in a grid; tap or click them fast before they disappear. Great
for a "whack-a-mole" style game with any character. Pure mouse/touch, so it
works perfectly on a tablet or phone. A timer ends the round.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Star Tapper</title> <!-- CHANGE ME: game title -->
<style>
  :root {
    /* CHANGE ME: the child's chosen colors */
    --bg: #5c6bc0;
    --hole: #303f9f;
    --text: #ffffff;
    --accent: #ffd54a;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: "Comic Sans MS", "Trebuchet MS", sans-serif;
    background: var(--bg); color: var(--text); text-align: center;
    user-select: none;
  }
  h1 { font-size: 8vw; margin: 10px; }
  #hud { font-size: 6vw; font-weight: bold; }
  #grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 3vw;
    width: 90vw; max-width: 500px; margin: 4vh auto; touch-action: manipulation;
  }
  .hole {
    aspect-ratio: 1; background: var(--hole); border-radius: 20%;
    display: grid; place-items: center; font-size: 12vw; cursor: pointer;
  }
  .hole .thing { opacity: 0; transform: scale(0.4); transition: all .12s; }
  .hole.up .thing { opacity: 1; transform: scale(1); }
  button {
    font: inherit; font-size: 6vw; padding: 2vh 6vw; margin-top: 2vh;
    border: none; border-radius: 999px; background: var(--accent);
    color: #222; cursor: pointer;
  }
</style>
</head>
<body>
  <h1>Star Tapper</h1> <!-- CHANGE ME: game title -->
  <div id="hud">Score: <span id="score">0</span> &nbsp; ⏱️ <span id="time">20</span></div>
  <div id="grid"></div>
  <button id="playBtn">Start!</button>
  <div id="msg" style="font-size:6vw; margin-top:2vh;"></div>

<script>
  // ---- CHANGE ME: the game's rules ----
  const GOOD = "⭐";      // tap this for points
  const BAD  = "💣";      // tapping this loses a point (set to "" to skip)
  const ROUND_SECONDS = 20;
  const WIN_SCORE = 15;   // reach this to get the win message
  const WIN_MSG  = "WOW! You're a superstar! 🏆";
  const OK_MSG   = "Great tapping! Play again to beat your score! 😄";
  // -------------------------------------

  const HOLES = 9;
  const grid = document.getElementById("grid");
  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");
  const playBtn = document.getElementById("playBtn");
  const msgEl = document.getElementById("msg");

  let holes = [];
  for (let i = 0; i < HOLES; i++) {
    const h = document.createElement("div");
    h.className = "hole";
    h.innerHTML = '<span class="thing"></span>';
    h.addEventListener("click", () => whack(h));
    grid.appendChild(h);
    holes.push(h);
  }

  let score, timeLeft, running, popTimer, countdown;

  function start() {
    score = 0; timeLeft = ROUND_SECONDS; running = true;
    scoreEl.textContent = 0; timeEl.textContent = timeLeft; msgEl.textContent = "";
    playBtn.style.display = "none";
    popTimer = setInterval(pop, 800);
    countdown = setInterval(tick, 1000);
  }

  function tick() {
    timeLeft--; timeEl.textContent = timeLeft;
    if (timeLeft <= 0) end();
  }

  function pop() {
    holes.forEach(h => h.classList.remove("up"));
    const h = holes[Math.floor(Math.random() * HOLES)];
    const isBad = BAD && Math.random() < 0.25;
    h.querySelector(".thing").textContent = isBad ? BAD : GOOD;
    h.dataset.bad = isBad ? "1" : "0";
    h.classList.add("up");
  }

  function whack(h) {
    if (!running || !h.classList.contains("up")) return;
    if (h.dataset.bad === "1") score = Math.max(0, score - 1);
    else score++;
    scoreEl.textContent = score;
    h.classList.remove("up");
  }

  function end() {
    running = false;
    clearInterval(popTimer); clearInterval(countdown);
    holes.forEach(h => h.classList.remove("up"));
    msgEl.textContent = score >= WIN_SCORE ? WIN_MSG : OK_MSG;
    playBtn.textContent = "Play Again";
    playBtn.style.display = "inline-block";
  }

  playBtn.addEventListener("click", start);
</script>
</body>
</html>
```

---

## 3. Maze / move template

Move a character with the arrow keys around a space to reach a goal, without
touching the walls/blocks. This is the Scratch "move to the treasure" idea.
On-screen buttons are included so it also works on a tablet.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rocket to the Star</title> <!-- CHANGE ME: game title -->
<style>
  :root {
    /* CHANGE ME: the child's chosen colors */
    --bg: #0d1b3e;
    --wall: #3949ab;
    --text: #ffffff;
    --accent: #ffd54a;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: "Comic Sans MS", "Trebuchet MS", sans-serif;
    background: var(--bg); color: var(--text); text-align: center;
    user-select: none; touch-action: manipulation;
  }
  h1 { font-size: 7vw; margin: 8px; }
  #board {
    display: grid; gap: 2px; width: 92vw; max-width: 460px; margin: 2vh auto;
    aspect-ratio: 1;
  }
  .cell { background: #16224d; border-radius: 4px; display: grid; place-items: center; font-size: 5vw; }
  .cell.wall { background: var(--wall); }
  #msg { font-size: 6vw; min-height: 8vw; color: var(--accent); font-weight: bold; }
  .pad { display: grid; grid-template-columns: repeat(3, 60px); justify-content: center; gap: 6px; margin-top: 1vh; }
  .pad button {
    font-size: 28px; padding: 10px; border: none; border-radius: 12px;
    background: var(--accent); color: #222; cursor: pointer;
  }
  .pad .blank { visibility: hidden; }
</style>
</head>
<body>
  <h1>Rocket to the Star</h1> <!-- CHANGE ME: game title -->
  <div id="board"></div>
  <div id="msg">Reach the ⭐ with the arrows!</div>
  <div class="pad">
    <button class="blank">.</button><button data-dir="up">⬆️</button><button class="blank">.</button>
    <button data-dir="left">⬅️</button><button data-dir="down">⬇️</button><button data-dir="right">➡️</button>
  </div>

<script>
  // ---- CHANGE ME: the game's rules ----
  const PLAYER = "🚀";   // the character you move
  const GOAL   = "⭐";   // reach this to win
  const WIN_MSG = "YOU MADE IT! 🎉 Great flying!";
  // The map: X = wall, . = open, P = player start, G = goal.
  // Edit this picture to design the maze. Keep it small and solvable.
  const MAP = [
    "P....X",
    ".XX..X",
    ".X..XX",
    ".X.X..",
    "...X.G",
    "XX....",
  ];
  // -------------------------------------

  const board = document.getElementById("board");
  const msg = document.getElementById("msg");
  const rows = MAP.length, cols = MAP[0].length;
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  let px, py, gx, gy, won;
  const cells = [];

  function build() {
    board.innerHTML = ""; cells.length = 0; won = false;
    for (let y = 0; y < rows; y++) {
      cells[y] = [];
      for (let x = 0; x < cols; x++) {
        const c = document.createElement("div");
        c.className = "cell";
        const ch = MAP[y][x];
        if (ch === "X") c.classList.add("wall");
        if (ch === "P") { px = x; py = y; }
        if (ch === "G") { gx = x; gy = y; }
        board.appendChild(c);
        cells[y][x] = c;
      }
    }
    draw();
  }

  function draw() {
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++)
        cells[y][x].textContent = "";
    cells[gy][gx].textContent = GOAL;
    cells[py][px].textContent = PLAYER;
  }

  function move(dx, dy) {
    if (won) return;
    const nx = px + dx, ny = py + dy;
    if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return;
    if (cells[ny][nx].classList.contains("wall")) return; // blocked by a wall
    px = nx; py = ny; draw();
    if (px === gx && py === gy) { won = true; msg.textContent = WIN_MSG; }
  }

  const DIRS = { up: [0,-1], down: [0,1], left: [-1,0], right: [1,0] };
  addEventListener("keydown", e => {
    const map = { ArrowUp:"up", ArrowDown:"down", ArrowLeft:"left", ArrowRight:"right" };
    if (map[e.key]) { e.preventDefault(); const [dx,dy] = DIRS[map[e.key]]; move(dx, dy); }
  });
  document.querySelectorAll(".pad button[data-dir]").forEach(b =>
    b.addEventListener("click", () => { const [dx,dy] = DIRS[b.dataset.dir]; move(dx, dy); }));

  build();
</script>
</body>
</html>
```

---

## 4. Quiz template

Answer questions or guess to score points. Very character- and word-driven, so
it's perfect for a kid who loves a topic (animals, space, their favorite show).
No timer pressure — just fun questions with big friendly buttons.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Animal Genius Quiz</title> <!-- CHANGE ME: game title -->
<style>
  :root {
    /* CHANGE ME: the child's chosen colors */
    --bg: #26a69a;
    --card: #ffffff;
    --text: #094f47;
    --accent: #ff7043;
    --good: #43a047;
    --bad: #e53935;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: "Comic Sans MS", "Trebuchet MS", sans-serif;
    background: var(--bg); color: var(--text); text-align: center;
    user-select: none; padding: 4vh 4vw;
  }
  h1 { font-size: 8vw; margin: 6px; color: #fff; }
  #card {
    background: var(--card); border-radius: 20px; padding: 4vh 5vw;
    max-width: 520px; margin: 2vh auto;
  }
  #buddy { font-size: 16vw; }
  #question { font-size: 6vw; margin: 2vh 0; }
  .choice {
    display: block; width: 100%; font: inherit; font-size: 5.5vw;
    padding: 2vh; margin: 1.2vh 0; border: none; border-radius: 14px;
    background: #e0f2f1; color: var(--text); cursor: pointer;
  }
  .choice.right { background: var(--good); color: #fff; }
  .choice.wrong { background: var(--bad); color: #fff; }
  #score { font-size: 6vw; color: #fff; font-weight: bold; }
  #next {
    font: inherit; font-size: 5.5vw; padding: 2vh 6vw; margin-top: 2vh;
    border: none; border-radius: 999px; background: var(--accent);
    color: #fff; cursor: pointer;
  }
</style>
</head>
<body>
  <h1>Animal Genius Quiz</h1> <!-- CHANGE ME: game title -->
  <div id="score">Score: 0</div>
  <div id="card">
    <div id="buddy">🦉</div> <!-- CHANGE ME: a friendly host character -->
    <div id="question"></div>
    <div id="choices"></div>
    <button id="next" style="display:none;">Next ➡️</button>
  </div>

<script>
  // ---- CHANGE ME: write the child's own questions ----
  // Each question: the words, a list of answers, and which one is correct (0-based).
  const QUESTIONS = [
    { q: "Which animal says 'moo'? 🐮", choices: ["Cow", "Cat", "Frog"], correct: 0 },
    { q: "How many legs does a spider have? 🕷️", choices: ["6", "8", "10"], correct: 1 },
    { q: "Which one can fly? ✈️", choices: ["Shark", "Eagle", "Snake"], correct: 1 },
    { q: "What color is a banana? 🍌", choices: ["Blue", "Yellow", "Purple"], correct: 1 },
    { q: "Where do fish live? 🐟", choices: ["In the sky", "In water", "In trees"], correct: 1 },
  ];
  const WIN_MSG = "You're an animal GENIUS! 🏆";
  const OK_MSG  = "Great job! Play again to get them all! 😄";
  // ----------------------------------------------------

  const scoreEl = document.getElementById("score");
  const buddy = document.getElementById("buddy");
  const questionEl = document.getElementById("question");
  const choicesEl = document.getElementById("choices");
  const nextBtn = document.getElementById("next");

  let idx = 0, score = 0, answered = false;

  function show() {
    answered = false;
    const item = QUESTIONS[idx];
    questionEl.textContent = item.q;
    choicesEl.innerHTML = "";
    item.choices.forEach((text, i) => {
      const b = document.createElement("button");
      b.className = "choice";
      b.textContent = text;
      b.addEventListener("click", () => pick(b, i, item.correct));
      choicesEl.appendChild(b);
    });
    nextBtn.style.display = "none";
  }

  function pick(btn, i, correct) {
    if (answered) return;
    answered = true;
    const buttons = choicesEl.querySelectorAll(".choice");
    buttons[correct].classList.add("right");
    if (i === correct) { score++; scoreEl.textContent = "Score: " + score; }
    else { btn.classList.add("wrong"); }
    nextBtn.textContent = idx === QUESTIONS.length - 1 ? "See my score! 🎉" : "Next ➡️";
    nextBtn.style.display = "inline-block";
  }

  nextBtn.addEventListener("click", () => {
    idx++;
    if (idx < QUESTIONS.length) { show(); }
    else { finish(); }
  });

  function finish() {
    const win = score === QUESTIONS.length;
    buddy.textContent = win ? "🏆" : "🌟";
    questionEl.textContent = (win ? WIN_MSG : OK_MSG) +
      "  You got " + score + " out of " + QUESTIONS.length + "!";
    choicesEl.innerHTML = "";
    nextBtn.textContent = "Play Again";
    nextBtn.style.display = "inline-block";
    nextBtn.onclick = () => { idx = 0; score = 0; scoreEl.textContent = "Score: 0";
      buddy.textContent = "🦉"; nextBtn.onclick = null;
      nextBtn.addEventListener("click", advance); show(); };
  }
  function advance() { idx++; if (idx < QUESTIONS.length) show(); else finish(); }

  show();
</script>
</body>
</html>
```

---

## Reskinning tips (making one template feel like a whole new game)

Just like changing a sprite's costume in Scratch, the same template becomes a
totally different game with new art and words:

- Swap the **emoji** for characters and items to match the theme (a 🐱 catching
  🍕, or a 🐢 catching 🍓, or a 🚀 dodging ☄️).
- Change the **colors** in the `:root` variables to the child's chosen palette.
- Rewrite every **message** and the **title** in the child's own words.
- Tune the **numbers** (win score, timer, speed) so it's not too easy or too
  hard for a 9-year-old — start gentle; they can always ask to make it harder.
- Keep it **one screen, one idea**. Resist adding levels or menus; a small game
  that feels great beats a big one that confuses.
