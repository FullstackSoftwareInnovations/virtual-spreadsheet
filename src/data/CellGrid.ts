import { Coordinate } from './Coordinate'

export class CellGrid {
  cells: (string | number)[][]
  sortable: boolean
  unsorted: (string | number)[][]
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
    if (this.sortable) this.unsorted[cell.row][cell.col] = value
    this.adjustColumnWidth(true, cell.col, value)
  }

  loadCSV(csv:string, sortable = false, font = '14px arial', cellWidth: number | string = 'auto'){
    let rows = csv.split('\n').map(row => row.split(','))
    this.loadCells(rows, sortable, font, cellWidth)
  }

  loadCells(cells: string[][], sortable= false,  font = '14px arial', cellWidth: number | string = 'auto'){
    const autoWidthDepth: number = this.getAutoWidthMaxDepth(cellWidth)
    const autoWidthEnabled: boolean = this.autoWidthEnabled(cellWidth)
    this.font = font
    this.virtualColumnIndices = cells[0].map((_ignored, index) => index)
    this.virtualColumnIndices.push(cells[0].length) // add column to account for row headers
    this.cells = cells.map((row, rowIndex) => {
      return row.map((value, colIndex) => {
        let autoCalc = autoWidthEnabled && (cellWidth === 'auto-deep' || rowIndex < autoWidthDepth)
        this.adjustColumnWidth(autoCalc, colIndex, value)

        /*
        const tryInt = parseInt(value)
        const tryFloat = parseFloat(value)
        if (!isNaN(tryInt) && value.length === tryInt.toString().length) return tryInt
        else if (!isNaN(tryFloat) && value.length === tryFloat.toString().length) return tryFloat
         */

       return '' + value
      })
    })

    this.sortable = sortable
    if (sortable) this.unsorted = [...cells]
  }

  filterRows(predicate: any){
    let headers = this.unsorted.splice(0,1)[0]
    let virtualHeadersWithoutRowHeader = this.virtualColumnIndices.map((index)=> index -1)
    virtualHeadersWithoutRowHeader.splice(0,1)
    this.cells = this.unsorted.filter((row, rowIndex) => predicate(row, rowIndex, virtualHeadersWithoutRowHeader))
    this.cells.unshift(headers)
    this.unsorted.unshift(headers)
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
  }

  setCSV(csv:string){
    let rows = csv.split('\n').map(row => row.split(','))
    this.setCells(rows)
  }

  setCells(newCells: (string | number) [][]){
    this.cells = newCells
  }

  getCell(rowIndex: number, columnIndex: number){
    try{
      columnIndex = this.virtualColumnIndices[columnIndex]-1
      let row = this.cells[rowIndex]
      return row[columnIndex]
    } catch (ignored){
      return ''
    }

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

        //@ts-ignore compare as numbers if it is a number
        if (!isNaN(val1) ){
          //@ts-ignore
          return val1-val2
        }
        else{
          let str1 = val1 + ''
          let str2 = val2 + ''
          return str1.localeCompare(str2)
        }


      })

      this.cells.unshift(headers)
    }

    else if (sortOrder === 'reverse'){
      this.cells = this.cells.reverse()
      this.cells.unshift(headers)
    }

    else {
      this.cells = [...this.unsorted]
    }


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


