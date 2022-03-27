import { Coordinate } from './Coordinate'

export class CellGrid {
  cells: (string | number)[][]
  widths: number[]
  cellBaseWidth: number
  font: string
  virtualColumnIndices: number [] //allows to "move" the data without actually moving it in the grid

  constructor() {
    this.cells = [[]]
    this.widths = []
  }

  update(cell: Coordinate, value: string) {
    this.cells[cell.row][cell.col] = value
    this.adjustColumnWidth(true, cell.col, value)
  }

  loadCSV(csv:string, font = '14px arial', cellWidth: number | string = 'auto'){
    let rows = csv.split('\n').map(row => row.split(','))
    this.loadCells(rows, font, cellWidth)
  }

  loadCells(cells: string[][],  font = '14px arial', cellWidth: number | string = 'auto'){
    const autoWidthDepth: number = this.getAutoWidthMaxDepth(cellWidth)
    const autoWidthEnabled: boolean = this.autoWidthEnabled(cellWidth)
    this.font = font
    this.virtualColumnIndices = cells[0].map((_ignored, index) => index)
    this.virtualColumnIndices.push(cells[0].length) // add column to account for row headers
    this.cells = cells.map((row, rowIndex) => {
      return row.map((value, colIndex) => {
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

  setCSV(csv:string){
    let rows = csv.split('\n').map(row => row.split(','))
    this.setCells(rows)
  }

  setCells(newCells: string[][]){
    this.cells = newCells
  }

  getCell(row: number, column: number){
    column = this.virtualColumnIndices[column]-1
    return this.cells[row][column]
  }

  moveColumn(oldIndex: any, newIndex: any){
    this.virtualColumnIndices.splice(newIndex,0,this.virtualColumnIndices.splice(oldIndex,1)[0])
    this.widths.splice(newIndex,0,this.widths.splice(oldIndex,1)[0])
  }

  sortColumn(colNumber: number, sortOrder: string){
    colNumber = colNumber -1 //the row headers don't really exist
    let headers = this.cells.splice(0,1)[0]

    if (sortOrder === 'normal'){
      this.cells.sort((row1, row2) => {
        let val1 = row1[colNumber]
        let val2 = row2[colNumber]

        if (typeof val1 === "number"){
          //@ts-ignore
          return val1-val2
        }

        return val1.toString().localeCompare(val2.toString())
      })
    }

    if (sortOrder === 'reverse'){
      this.cells = this.cells.reverse()
    }

    console.log()
    this.cells.unshift(headers)
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


