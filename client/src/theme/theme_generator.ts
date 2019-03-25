interface CSSColor {
  red: number;
  green: number;
  blue: number;
}
class Theme {
  constructor(
    public background: CSSColor,
    public cBackground: CSSColor,
    public focus: CSSColor,
    public cFocus: CSSColor,
    public tsel: number,
    public thov: number,
    public tact: number
  ) {}
}

function rgb(color: CSSColor) {
  return color.red + ", " + color.green + ", " + color.blue;
}

function luminance(color: CSSColor) {
  return 0.2126 * color.red + 0.7152 * color.green + 0.0722 * color.blue;
}

function muted(color: CSSColor, muteFactor: number) {
  let luma = luminance(color);
  return rgb({
    red: color.red + (128 - luma) * muteFactor,
    green: color.green + (128 - luma) * muteFactor,
    blue: color.blue + (128 - luma) * muteFactor
  });
}

export { CSSColor , Theme };

export default function(theme: Theme) {
  let muteFactor = 1 / 5;
  return (
    "--c-bg-primary:" +
    rgb(theme.background) +
    ";--c-bg-contrast:" +
    rgb(theme.cBackground) +
    ";--c-focus-primary:" +
    rgb(theme.focus) +
    ";--c-focus-contrast:" +
    rgb(theme.cFocus) +
    ";--c-bg-mprimary:" +
    muted(theme.background, muteFactor) +
    ";--c-bg-mcontrast:" +
    muted(theme.cBackground, muteFactor) +
    ";--n-sel-transp:" +
    theme.tsel +
    ";--n-hov-transp:" +
    theme.thov +
    ";--n-act-transp:" +
    theme.tact
  );
}
