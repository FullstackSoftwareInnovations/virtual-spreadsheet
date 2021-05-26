import { CellGrid } from "./CellGrid";

export type CellMatrix = CellGrid[]

export function nullMatrix(): CellMatrix{
  return [new CellGrid()]
}
