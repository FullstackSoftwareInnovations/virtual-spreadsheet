export function getCellWidth(text, font, baseWidth) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  context.font = font
  const metrics = context.measureText(text)
  return Math.ceil(metrics.width / 100) * 100
}
