import { Coordinate } from './Coordinate'
import {CellSelector} from "../components/Cells";

const defaultFilter: Function = () => true
export class CellGrid {
  cells: (string | number)[][]  = [[]]
  sortable: boolean
  unsorted: (string | number)[][] = [[]]
  filter: Function = defaultFilter
  cellBaseWidth: number = 100
  widths: number[] = [100]
  font: string
  virtualColumnIndices: number [] //allows to "move" the data without actually moving it in the grid
  columnHeaders: (string | number)[] = [' ']
  rowHeaders: (string | number)[] =[' ']

  constructor() {
  }

  update(cell: Coordinate, value: string) {
    this.cells[cell.row][cell.col] = value
    if (this.sortable) this.unsorted[cell.row][cell.col] = value
    this.adjustColumnWidth(true, cell.col, value)
  }

  loadCells(cells: (string |number)[][], firstRowHeaders = false, firstColumnHeaders = false, sortable= false, rowFilter,  font = '18px arial', cellWidth: number | string = 'auto'){
    const autoWidthDepth: number = this.getAutoWidthMaxDepth(cellWidth)
    const autoWidthEnabled: boolean = this.autoWidthEnabled(cellWidth)
    this.font = font

    if (firstColumnHeaders) {
      this.rowHeaders = cells.map((row) => row.splice(0, 1)[0])

    }
    else {
      this.rowHeaders = cells.map((_ignored, index) => index === 0 ? '' : index)
      this.rowHeaders.push(this.rowHeaders.length)
    }

    if (firstRowHeaders) {
      this.columnHeaders = cells.splice(0, 1)[0]
    } else {
      this.columnHeaders = cells[0].map((_ignored, index) => getColumnAlphCoord(index))
    }


    if (!cells[0]) cells = [[' ']]
    this.virtualColumnIndices = cells[0].map((_ignored, index) => index)
    if(cells[0]){
      this.cells = cells.map((row, rowIndex) => {
        return row.map((value, colIndex) => {
          let autoCalc = autoWidthEnabled && (cellWidth === 'auto-deep' || rowIndex < autoWidthDepth)
          this.adjustColumnWidth(autoCalc, colIndex, value)
          return '' + value
        })
      })
    }


    this.sortable = sortable
    if (sortable || rowFilter) this.unsorted = [...cells]
  }

  filterRows(predicate: Function){
    let filtered = this.unsorted.filter((row, rowIndex) => predicate(row, rowIndex))
    this.cells = filtered[0] ? filtered : [[' ']]
    this.filter = predicate
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
      columnIndex = this.virtualColumnIndices[columnIndex]
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

  sortColumn(colNumber: number, sortOrder: string, normalSort: Function = this.defaultSort){

    if (sortOrder === 'normal'){
      this.cells.sort((row1, row2) => normalSort(row1[colNumber], row2[colNumber]))
    }

    else if (sortOrder === 'reverse'){
      this.cells = this.cells.reverse()
    }

    else {
      this.filterRows(this.filter)
    }

  }

  defaultSort(val1: (string | number), val2: (string | number) ): number{
    //@ts-ignore compare as numbers if they are
    if(!isNaN(val1) && !isNaN(val2) ){
      //@ts-ignore
      return val1-val2
    }
    else{
      let str1 = val1 + ''
      let str2 = val2 + ''

      //put empty strings at the bottom on normal sort
      if(str1.trim() === '') return 1
      if(str2.trim() === '') return -1
      return str1.trim().localeCompare(str2.trim())
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
    colIndex = colIndex +1 //account for detached 'row headers' column which is fixed length
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


export function getColumnAlphCoord(colIndex){
  colIndex +=1
  let s = ''
  let t

  console.log(colIndex)
  while (colIndex > 0) {
    t = colIndex % 26;
    s = String.fromCharCode(64 +t) + s
    colIndex = (colIndex - t);
  }
  return s
}

export function getCoordFromAlphStr(str){
  str = str.toUpperCase()
  let i
  let col = 0

  for(i = 0; i < str.length; i++){
    if (str.charAt(i).match(/[A-Z]/i)) col += str.charCodeAt(i) -65
    else break
  }

  let row = Number( str.substring(i))-1
  return {row: row, col: col}
}


