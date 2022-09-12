"use strict";

window.addEventListener("DOMContentLoaded", start);

const settings = {
  selectedColor: null,
  harmony: calcAnalogous,
};

function start() {
  // console.log("Start program");

  // start with a random color
  setBaseColor(getRandomColor());
  registerButtons();

  // make sure we select analogous
  document.querySelector("#analog").checked = true;
}

function registerButtons() {
  // colorwheel / basecolor
  document.querySelector("#basecolor").addEventListener("input", changeBaseColor);

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
function clampColors(colors) {
  colors.forEach((color) => {
    color.h = limit(color.h, 360);
    color.s = limit(color.s, 100);
    color.l = limit(color.l, 100);
  });
}

// I have two different "clamping" functions - this one rolls round
// limit

function limit(value, max) {
  console.log((max + value) % max);
  return (max + value) % max;
}

// I have two different "clamping" functions - this one stops at min and max
// clamp

function clamp(value, max = 100, min = 100) {
  if (value < min) {
    value = min;
  } else if (value > max) {
    value = max;
  }
  return value;
}

// calculate four analogous colors from a basecolor
function calcAnalogous(base, colors) {
  colors[0].h = base.h - 80;
  colors[1].h = base.h - 40;
  colors[2].h = base.h + 40;
  colors[3].h = base.h + 80;
}

//  monochromatic

function calcMonochromatic(base, colors) {
  colors[0].l = base.l + 40;
  colors[1].l = base.l + 20;
  colors[2].s = base.s - 20;
  colors[3].s = base.s - 40;
}

//  triadic

function calcTriadic(base, colors) {
  colors[0].h = base.h + 120;
  colors[1].h = base.h + 60;
  colors[2].h = base.h + 180;
  colors[3].h = base.h + 240;
}

// complementary

function calcComplementary(base, colors) {
  colors[0].h = base.h + 180;
  colors[1].h = base.h - 40;
  colors[2].h = base.h + 40;
  colors[3].h = base.h + 80;
}

// compound

function calcCompound(base, colors) {
  colors[0].h = base.h + 100;
  colors[1].h = base.h - 80;
  colors[2].h = base.h - 40;
  colors[3].h = base.h - 180;
}

// shades

function calcShades(base, colors) {
  // let calc1 = base.l / 2.5;
  // let calc2 = base.l / 10;

  // colors[0].l = base.l + calc1;
  // colors[1].l = base.l + calc2;
  // colors[2].l = base.l - calc2;
  // colors[3].l = base.l - calc1;

  //* or * -- experiments


  colors[0].l = 20;
  colors[1].l = 40;
  colors[2].l = 60;
  colors[3].l = 80;
}

// setHarmony
function setHarmony(harmony) {
  console.log("harmony", harmony);

  switch (harmony) {
    case "analog":
      settings.harmony = calcAnalogous;
      // console.log("here");
      break;
    case "monochromatic":
      settings.harmony = calcMonochromatic;
      break;
    case "triadic":
      settings.harmony = calcTriadic;
      break;
    case "complementary":
      settings.harmony = calcComplementary;
      break;
    case "compound":
      settings.harmony = calcCompound;
      break;
    case "shades":
      settings.harmony = calcShades;
      break;
  }

  calculateHarmony();
}

function setBaseColor(color) {
  document.querySelector("#basecolor").value = color;

  showColor(3, color);

  settings.selectedColor = color;

  calculateHarmony();
}

// calculateHarmony
function calculateHarmony() {
  const indexes = [1, 2, 4, 5];
  const base = convertRGBToHSL(convertHexToRGB(settings.selectedColor));

  // console.log(settings.selectedColor);
  // console.log("base: ", base);

  const colors = createFourCopies(base);

  settings.harmony(base, colors);

  clampColors(colors);

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
  colorinfo.querySelector("[data-info=rgb]").textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function showHSL(index, hsl) {
  const colorinfo = document.querySelector("#color" + index);
  colorinfo.querySelector("[data-info=hsl]").textContent = `hsl(${Math.floor(hsl.h)}, ${Math.floor(hsl.s)}%, ${Math.floor(hsl.l)}%)`;
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
