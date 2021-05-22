import { getCellWidth } from '../functions/CellHelper'

export interface CellGrid {
  cells: (string | number)[][]
  widths: number[]
}

export function emptyCellGrid() {
  return { cells: [['']], widths: [] }
}

export function formatCSV(csv: string, cellWidth, font:string) {
  const autoWidthDepth: number = getAutoWidthMaxDepth(cellWidth)
  const autoWidthEnabled = typeof cellWidth === 'string' && cellWidth.startsWith('auto')

  const cellGrid: CellGrid = emptyCellGrid()
  const rows = csv.split('\n')
  cellGrid.cells = rows.map((row, rowIndex) => {
    return row.split(',').map((cell, colIndex) => {

      if( autoWidthEnabled && (cellWidth === 'auto-deep' ||  rowIndex < autoWidthDepth)){
        // Calculate width and see if it is bigger than current column size
        const calcWidth: number = getCellWidth(cell, font)
        if (!cellGrid.widths[colIndex] || cellGrid.widths[colIndex] < calcWidth) cellGrid.widths[colIndex] = calcWidth
      } else{
        // else take default size
        if (!cellGrid.widths[colIndex]) cellGrid.widths[colIndex] = cellWidth
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

// Returns 1000 by default for performance purposes
// Can be passed a max depth in the cellWidth parameter following 'auto-'
function getAutoWidthMaxDepth(cellWidth: string|number): number{
  const defaultMax = 1000
  if (typeof cellWidth === 'number') return defaultMax
  const paramDepth = parseInt(cellWidth.substring(cellWidth.indexOf('auto-')+5))
  return isNaN(paramDepth) ? defaultMax : paramDepth
}
