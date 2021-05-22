export type CellGrid = (string | number)[][]

export function emptyCellGrid() {
  return [['']]
}

export function formatCSV(csv: string) {
  const rows = csv.split('\n')
  let cells: CellGrid = [[]]
  cells = rows.map((row) => {
    return row.split(',').map((cell) => {
      const tryInt = parseInt(cell)
      const tryFloat = parseFloat(cell)

      if (!isNaN(tryInt) && cell.length === tryInt.toString().length)
        return tryInt
      if (!isNaN(tryFloat) && cell.length === tryFloat.toString().length)
        return tryFloat
      return cell
    })
  })

  return cells
}
