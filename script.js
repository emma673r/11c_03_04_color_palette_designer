"use strict";

window.addEventListener("DOMContentLoaded", start);

const settings = {
  selectedColor: null,
};

function start() {
  // console.log("Start program");

  // start with a random color
  setBaseColor(getRandomColor());
  registerButtons();

  // make sure we select analogous
}

function registerButtons() {
  // colorwheel / basecolor
  document
    .querySelector("#basecolor")
    .addEventListener("input", changeBaseColor);

  // harmonies
  document.querySelector("#harmonies").addEventListener("click", changeHarmony);
}
// change harmony
function changeHarmony(event) {
  // console.log("changeHarmony", event.target.value);
  const harmony = event.target.value;
  if (harmony) {
    setHarmony(event.target.value);
  }
}

function changeBaseColor(event) {
  const color = event.target.value;

  setBaseColor(color);
}
// createFourCopies
function createFourCopies(original) {
  const copies = [];
  for (let i = 0; i < 4; i++) {
    copies.push(Object.assign({}, original));
  }
  return copies;
}

// clampColors

// I have two different "clamping" functions - this one rolls round
// limit

// I have two different "clamping" functions - this one stops at min and max
// clamp

// calculate four analogous colors from a basecolor

//  monochromatic

//  triadic

// complementary

// compound

// shades

// setHarmony
function setHarmony(harmony) {
  console.log("harmony", harmony);

  /*   switch (harmony) {
    case "analog":
      console.log("here");
      break;
  } */

  calculateHarmony();
}

function setBaseColor(color) {
  document.querySelector("#basecolor").value = color;

  showColor(3, color);

  settings.selectedColor = color;

  //calculateHarmony();
}

// calculateHarmony
function calculateHarmony() {
  const indexes = [1, 2, 4, 5];
  const base = convertRGBToHSL(convertHexToRGB(settings.selectedColor));

  // console.log(settings.selectedColor);
  // console.log("base: ", base);
  const colors = createFourCopies(base);
  colors[0].h = base.h - 60;
  colors[1].h = base.h - 30;
  colors[2].h = base.h + 30;
  colors[3].h = base.h + 60;
  console.log("colors: ", colors);
  colors.forEach((color, i) => {
    const rgb = convertHSLtoRGB(color);
    const hex = convertRGBtoHEX(rgb);
    showColor(indexes[i], hex);
  });
}

function showColor(index, color) {
  const colorinfo = document.querySelector("#color" + index);

  const hex = color;
  const rgb = convertHexToRGB(color);
  const hsl = convertRGBToHSL(rgb);

  showHex(index, hex);
  showRGB(index, rgb);
  showHSL(index, hsl);

  colorinfo.querySelector(".colorbox").style.backgroundColor = color;
}

function showHex(index, hex) {
  const colorinfo = document.querySelector("#color" + index);
  colorinfo.querySelector("[data-info=hex]").textContent = hex;
}

function showRGB(index, rgb) {
  const colorinfo = document.querySelector("#color" + index);
  colorinfo.querySelector(
    "[data-info=rgb]"
  ).textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function showHSL(index, hsl) {
  const colorinfo = document.querySelector("#color" + index);
  colorinfo.querySelector("[data-info=hsl]").textContent = `hsl(${Math.floor(
    hsl.h
  )}, ${Math.floor(hsl.s)}%, ${Math.floor(hsl.l)}%)`;
}

function getRandomColor() {
  return convertRGBtoHEX({
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
  });
}

function convertHexToRGB(color) {
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);

  return { r, g, b };
}

function convertRGBtoHEX(rgb) {
  let hex = "#";
  hex += rgb.r.toString(16).padStart(2, "0");
  hex += rgb.g.toString(16).padStart(2, "0");
  hex += rgb.b.toString(16).padStart(2, "0");
  return hex;
}

function convertRGBToHSL(rgb) {
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  let h, s, l;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = 60 * (0 + (g - b) / (max - min));
  } else if (max === g) {
    h = 60 * (2 + (b - r) / (max - min));
  } else if (max === b) {
    h = 60 * (4 + (r - g) / (max - min));
  }

  if (h < 0) {
    h = h + 360;
  }

  l = (min + max) / 2;

  if (max === 0 || min === 1) {
    s = 0;
  } else {
    s = (max - l) / Math.min(l, 1 - l);
  }
  // multiply s and l by 100 to get the value in percent, rather than [0,1]
  s *= 100;
  l *= 100;

  return { h, s, l };
}

// function from: https://css-tricks.com/converting-color-spaces-in-javascript/
function convertHSLtoRGB(hsl) {
  const h = hsl.h;

  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}
