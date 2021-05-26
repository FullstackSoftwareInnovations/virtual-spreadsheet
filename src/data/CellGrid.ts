import { Coordinate } from './Coordinate'

export class CellGrid {
  cells: (string | number)[][]
  widths: number[]
  cellBaseWidth: number
  font: string

  constructor() {
    this.cells = [[]]
    this.widths = []
  }

  update(cell: Coordinate, value: string) {
    this.cells[cell.row][cell.col] = value
    this.adjustColumnWidth(true, cell.col, value)
  }

  loadCSV(csv:string, font = '14px arial', cellWidth: number | string = 'auto'){
    this.font = font
    const autoWidthDepth: number = this.getAutoWidthMaxDepth(cellWidth)
    const autoWidthEnabled: boolean = this.autoWidthEnabled(cellWidth)
    const rows = csv.split('\n')

    this.cells = rows.map((row, rowIndex) => {
      return row.split(',').map((value, colIndex) => {
        let autoCalc = autoWidthEnabled && (cellWidth === 'auto-deep' || rowIndex < autoWidthDepth)
        this.adjustColumnWidth(autoCalc, colIndex, value)

        const tryInt = parseInt(value)
        const tryFloat = parseFloat(value)
        if (!isNaN(tryInt) && value.length === tryInt.toString().length) return tryInt
        else if (!isNaN(tryFloat) && value.length === tryFloat.toString().length) return tryFloat
        else return value
      })
    })
  }

  autoWidthEnabled(cellWidth){
    if( typeof cellWidth === 'string' && cellWidth.startsWith('auto')){
      this.cellBaseWidth = 100
      this.widths[0] = this.cellBaseWidth
      return  true
    } else if ( typeof cellWidth === 'number'){
      this.cellBaseWidth = cellWidth
      this.widths[0] = this.cellBaseWidth
      return  false
    } else throw "Invalid cellWidth. Use number, 'auto', 'auto-${number}', or 'auto-deep'"
  }

  getAutoWidthMaxDepth(cellWidth: string | number): number {
    const defaultMax = 1000
    if (typeof cellWidth === 'number') return defaultMax
    const paramDepth = parseInt( cellWidth.substring(cellWidth.indexOf('auto-') + 5) )
    return isNaN(paramDepth) ? defaultMax : paramDepth
  }

  adjustColumnWidth(autoCalc, colIndex, text) {
    colIndex += 1 // +1 to account for rowNum column which has a fixed width
    if (autoCalc) {
      // Calculate width and see if it is bigger than current column size
      const calcWidth: number = this.calcCellWidth(text)
      if (!this.widths[colIndex] || this.widths[colIndex] < calcWidth) this.widths[colIndex] = calcWidth
    } else {
      // else take default size
      if (!this.widths[colIndex]) this.widths[colIndex] = this.cellBaseWidth
    }
  }

  calcCellWidth(text){
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    // @ts-ignore
    context.font = this.font
    // @ts-ignore
    const metrics = context.measureText(text)
    return Math.ceil(metrics.width / this.cellBaseWidth) * this.cellBaseWidth
  }

}


