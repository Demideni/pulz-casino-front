// game.js — Lego Candy Slots
// PixiJS v7

import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@7/dist/pixi.min.mjs";

const app = new PIXI.Application({
  resizeTo: window,
  backgroundAlpha: 0,
  antialias: true,
});
document.body.appendChild(app.view);

// --------------------
// CONFIG
// --------------------
const COLS = 6;
const ROWS = 5;
const CELL = 110;
const TOP_OFFSET = 40;
const TAPBAR_HEIGHT = 200;

let balance = 1000;
let fsLeft = 0;
let spinning = false;

// --------------------
// ASSETS
// --------------------
const ASSETS = {
  tapbar: "assets/ui/tapbar.png",
  spinBtn: "assets/ui/btn-spin.png",
};

const SYMBOLS = [
  "assets/symbols/low_blue.png",
  "assets/symbols/low_green.png",
  "assets/symbols/low_orange.png",
  "assets/symbols/low_purple.png",
  "assets/symbols/mid_crystal.png",
  "assets/symbols/mid_cube.png",
  "assets/symbols/mid_plasma.png",
  "assets/symbols/high_diamond.png",
  "assets/symbols/high_bolt.png",
];

// --------------------
// LOAD
// --------------------
await PIXI.Assets.load([
  ASSETS.tapbar,
  ASSETS.spinBtn,
  ...SYMBOLS,
]);

// --------------------
// STAGE GROUPS
// --------------------
const gameLayer = new PIXI.Container();
const uiLayer = new PIXI.Container();
app.stage.addChild(gameLayer);
app.stage.addChild(uiLayer);

// --------------------
// GRID
// --------------------
const cells = [];

function createGrid() {
  gameLayer.removeChildren();
  cells.length = 0;

  const gridW = COLS * CELL;
  const startX = (app.screen.width - gridW) / 2;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tex = PIXI.Texture.from(
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      );
      const sp = new PIXI.Sprite(tex);
      sp.anchor.set(0.5);
      sp.x = startX + c * CELL + CELL / 2;
      sp.y = TOP_OFFSET + r * CELL + CELL / 2;
      sp.width = sp.height = CELL * 0.9;

      gameLayer.addChild(sp);
      cells.push({ sprite: sp, x: sp.x, y: sp.y });
    }
  }
}

createGrid();

// --------------------
// FULL DROP ANIMATION (EACH SPIN)
// --------------------
async function animateFullDrop() {
  const promises = cells.map((cell, i) => {
    const sp = cell.sprite;
    const startY = -CELL * 6 - Math.random() * CELL * 2;
    const targetY = cell.y;
    sp.y = startY;

    return new Promise((resolve) => {
      const start = performance.now();
      const dur = 320;
      const delay = (i % COLS) * 18;

      setTimeout(() => {
        function tick(t) {
          const p = Math.min(1, (t - start) / dur);
          const ease = 1 - Math.pow(1 - p, 3);
          sp.y = startY + (targetY - startY) * ease;
          if (p < 1) requestAnimationFrame(tick);
          else resolve();
        }
        requestAnimationFrame(tick);
      }, delay);
    });
  });

  await Promise.all(promises);
}

// --------------------
// SPIN LOGIC (DEMO)
// --------------------
async function spin(isBuy = false) {
  if (spinning) return;
  spinning = true;

  if (isBuy) {
    balance -= 100;
    fsLeft = 10;
  }

  createGrid();
  await animateFullDrop();

  if (fsLeft > 0) fsLeft--;

  updateTexts();
  spinning = false;
}

// --------------------
// TAP BAR
// --------------------
const tapbar = new PIXI.Sprite(PIXI.Texture.from(ASSETS.tapbar));
tapbar.anchor.set(0.5, 1);
uiLayer.addChild(tapbar);

const spinBtn = new PIXI.Sprite(PIXI.Texture.from(ASSETS.spinBtn));
spinBtn.anchor.set(0.5);
spinBtn.interactive = true;
spinBtn.buttonMode = true;
uiLayer.addChild(spinBtn);

// LONG PRESS
let pressTimer = null;
spinBtn.on("pointerdown", () => {
  pressTimer = setTimeout(() => spin(true), 550);
});
spinBtn.on("pointerup", () => {
  if (pressTimer) {
    clearTimeout(pressTimer);
    spin(false);
  }
});
spinBtn.on("pointerupoutside", () => clearTimeout(pressTimer));

// --------------------
// TEXTS
// --------------------
const balanceText = new PIXI.Text("", {
  fill: "#ffd54a",
  fontSize: 28,
  fontWeight: "bold",
});
const fsText = new PIXI.Text("", {
  fill: "#ffd54a",
  fontSize: 28,
  fontWeight: "bold",
});
uiLayer.addChild(balanceText);
uiLayer.addChild(fsText);

function updateTexts() {
  balanceText.text = `$${balance.toFixed(2)}`;
  fsText.text = fsLeft > 0 ? fsLeft : "-";
}

updateTexts();

// --------------------
// RESIZE
// --------------------
function resize() {
  tapbar.width = app.screen.width;
  tapbar.height = TAPBAR_HEIGHT;
  tapbar.x = app.screen.width / 2;
  tapbar.y = app.screen.height;

  spinBtn.x = app.screen.width / 2;
  spinBtn.y = app.screen.height - TAPBAR_HEIGHT / 2 + 10;
  spinBtn.width = spinBtn.height = 160;

  balanceText.x = app.screen.width / 2 - 260;
  balanceText.y = app.screen.height - TAPBAR_HEIGHT + 85;

  fsText.x = app.screen.width / 2 + 190;
  fsText.y = app.screen.height - TAPBAR_HEIGHT + 85;
}

window.addEventListener("resize", resize);
resize();
