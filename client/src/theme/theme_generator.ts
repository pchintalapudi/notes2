interface Color {
  red: number;
  green: number;
  blue: number;
}
class Theme {
  constructor(
    public background: Color,
    public cBackground: Color,
    public focus: Color,
    public cFocus: Color,
    public tsel: number,
    public thov: number,
    public tact: number
  ) {}
}

function rgb(color: Color) {
  return color.red + ", " + color.green + ", " + color.blue;
}

function luminance(color: Color) {
  return 0.2126 * color.red + 0.7152 * color.green + 0.0722 * color.blue;
}

function muted(color: Color, muteFactor: number) {
  let luma = luminance(color);
  return rgb({
    red: color.red * (luma * muteFactor + 12.8),
    green: color.green * (luma * muteFactor + 12.8),
    blue: color.blue * (luma * muteFactor + 12.8)
  });
}

export { Color, Theme };

export default function(theme: Theme) {
  let muteFactor = 9 / 10;
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
