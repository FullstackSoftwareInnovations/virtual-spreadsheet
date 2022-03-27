/* Data representation of cells */
export interface Coordinate {
  row: number
  col: number
}

export function nullCoordinate(): Coordinate {
  return { row: -1, col: -1 }
}

export function isNull(cell: Coordinate): boolean {
  return cell.row === -1 || cell.col === -1
}

export function compareCoordinates(cell1, cell2){
  if(cell1.row === cell2.row && cell1.col === cell2.col) return 0
  if (cell1.row < cell2.row) return -1
  return cell1.col < cell2.col ? -1 : 1
}
