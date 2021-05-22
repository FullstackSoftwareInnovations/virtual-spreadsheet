import { getCellWidth } from '../functions/CellHelper'

export interface CellGrid {
  cells: (string | number)[][]
  widths: number[]
}

export function emptyCellGrid() {
  return { cells: [['']], widths: [] }
}

export function formatCSV(csv: string, cellWidth, font:string) {
  const autoSize = cellWidth === 'auto'
  const rows = csv.split('\n')
  const cellGrid: CellGrid = emptyCellGrid()
  
  cellGrid.cells = rows.map((row) => {
    return row.split(',').map((cell, col) => {

      if(autoSize){
        // Calculate width and see if it is bigger than current column size
        const calcWidth: number = getCellWidth(cell, font)
        if (!cellGrid.widths[col] || cellGrid.widths[col] < calcWidth) cellGrid.widths[col] = calcWidth
      } else{
        // else take default size
        if (!cellGrid.widths[col]) cellGrid.widths[col] = cellWidth
      }

      const tryInt = parseInt(cell)
      const tryFloat = parseFloat(cell)
      if (!isNaN(tryInt) && cell.length === tryInt.toString().length)
        return tryInt
      else if (!isNaN(tryFloat) && cell.length === tryFloat.toString().length)
        return tryFloat
      else return cell
    })
  })

  return cellGrid
}
