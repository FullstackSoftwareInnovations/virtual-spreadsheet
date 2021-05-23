import { Coordinate } from './Coordinate'

export class CellGrid {
  cells: (string | number)[][]
  widths: number[]
  cellBaseWidth: number
  font: string

  constructor() {
    this.cells = [['']]
    this.widths = []
  }

  update(cell: Coordinate, value: string) {
    this.cells[cell.row][cell.col] = value
    let newWidth = this.calcCellWidth(value, this.font, this.cellBaseWidth )
    if (this.widths[cell.col] < newWidth) this.widths[cell.col] = newWidth
  }

  loadCSV(csv:string, font, cellWidth){
    const autoWidthDepth: number = getAutoWidthMaxDepth(cellWidth)
    let autoWidthEnabled: boolean;

    this.font = font
    if( typeof cellWidth === 'string' && cellWidth.startsWith('auto')){
      this.cellBaseWidth = 100
      autoWidthEnabled = true
    } else {
      this.cellBaseWidth = cellWidth
      autoWidthEnabled = false
    }

    const rows = csv.split('\n')
    this.cells = rows.map((row, rowIndex) => {
      return row.split(',').map((cell, colIndex) => {

        if (autoWidthEnabled && (cellWidth === 'auto-deep' || rowIndex < autoWidthDepth)) {
          // Calculate width and see if it is bigger than current column size
          const calcWidth: number = this.calcCellWidth(cell, font, this.cellBaseWidth)
          if (!this.widths[colIndex] || this.widths[colIndex] < calcWidth) this.widths[colIndex] = calcWidth
        } else {
          // else take default size
          if (!this.widths[colIndex]) this.widths[colIndex] = this.cellBaseWidth
        }

        const tryInt = parseInt(cell)
        const tryFloat = parseFloat(cell)
        if (!isNaN(tryInt) && cell.length === tryInt.toString().length) return tryInt
        else if (!isNaN(tryFloat) && cell.length === tryFloat.toString().length) return tryFloat
        else return cell
      })
    })
  }

  calcCellWidth(text, font, baseWidth) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    // @ts-ignore
    context.font = font
    // @ts-ignore
    const metrics = context.measureText(text)
    return Math.ceil(metrics.width / baseWidth) * baseWidth
  }

}

// Returns 1000 by default for performance purposes
// Can be passed a max depth in the cellWidth parameter following 'auto-'
function getAutoWidthMaxDepth(cellWidth: string | number): number {
  const defaultMax = 1000
  if (typeof cellWidth === 'number') return defaultMax
  const paramDepth = parseInt( cellWidth.substring(cellWidth.indexOf('auto-') + 5) )
  return isNaN(paramDepth) ? defaultMax : paramDepth
}
