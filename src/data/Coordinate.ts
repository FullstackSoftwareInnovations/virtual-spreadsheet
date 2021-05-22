/* Data representation of cells */
export interface Coordinate {
  row: number
  col: number
}

export function nullCell(): Coordinate {
  return { row: -1, col: -1 }
}

export function isNull(cell: Coordinate): boolean {
  return cell.row === -1 || cell.col === -1
}
