function getBackgroundColorBrightness(backgroundColor) {
  const match = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(backgroundColor);
  if (!match) return 255;
  const [r, g, b] = match.slice(1).map(Number);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness;
}

export default function getTextColor(backgroundColor) {
  const brightness = getBackgroundColorBrightness(backgroundColor);
  return brightness > 128 ? "#000" : "#fff";
}
