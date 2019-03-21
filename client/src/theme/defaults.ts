import { Theme } from "./theme_generator";
//Color defs
let white = { red: 255, green: 255, blue: 255 },
  black = { red: 0, green: 0, blue: 0 },
  red = { red: 255, green: 0, blue: 0 },
  green = { red: 0, green: 255, blue: 0 },
  blue = { red: 0, green: 0, blue: 255 };

let sgn = { red: 0, green: 128, blue: 255 };
let transpStandards = [0.35, 0.5, 0.75];

let standard = new Theme(
  white,
  black,
  sgn,
  red,
  transpStandards[0],
  transpStandards[1],
  transpStandards[2]
);

let dark = new Theme(
  black,
  white,
  sgn,
  red,
  transpStandards[0],
  transpStandards[1],
  transpStandards[2]
);

export { standard, dark };
