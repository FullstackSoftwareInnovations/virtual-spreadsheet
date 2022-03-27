import React, { ChangeEvent } from 'react'
import { useHover } from 'helpful-react-hooks'
import { CellGrid } from '../data/CellGrid'
import { Coordinate } from '../data/Coordinate'

/* Default Styles */
const defaultFont = '18px Arial'

const defaultCellStyle = {
  verticalAlign: 'bottom',
  textAlign: 'center',
  border: '1px solid black',
  overflow: 'hidden',
  fontSize: 12
}

const defaultHeaderStyle = {
  zIndex: 1,
  cursor: 'pointer',
  color: '#ffffff',
  background: '#0077cc'
}

const defaultDataCellStyle = {
  color: '#000000',
  background: '#ffffff',
  zIndex: 0,
  cursor: 'text'
}

const defaultActiveCellStyle = {
  color: '#ffffff',
  background: '#33bbff'
}

/* UI Representation of cells */
export function RowHeaderCell(props) {
  const style = {
    ...props.style,
    ...defaultCellStyle,
    ...defaultHeaderStyle,
    ...(props.rowHeaderStyle ?? {}),
    font: props.cellFont ?? defaultFont
  }

  return (
    <div style={style} onClick={props.onClick}>
      {props.rowNumber}
    </div>
  )
}

export function ColumnHeaderCell(props) {
  const style = {
    ...props.style,
    ...defaultCellStyle,
    ...defaultHeaderStyle,
    ...(props.columnHeaderStyle ?? {}),
    font: props.cellFont ?? defaultFont
  }

  return (
    <div style={style} onClick={props.onClick}>
      {props.title}
    </div>
  )
}

export function DataCell(props) {
  const [ref, hovered] = useHover()

  let style = {
    ...props.style,
    ...defaultCellStyle,
    ...defaultDataCellStyle,
    ...(props.cellStyle ?? {}),
    font: props.cellFont ?? defaultFont
  }

  if (hovered || props.isSelected)
    style = {
      ...style,
      ...defaultActiveCellStyle,
      ...(props.activeCellStyle ?? {})
    }

  if (props.readOnly) style = {...style, cursor: 'pointer'}

  const handleClick = props.onClick ? props.onClick : () => {}

  return (
    <div onClick={handleClick}>
      <input
        ref={ref}
        style={style}
        onChange={props.update}
        value={props.data}
        disabled={props.readOnly}
      />
    </div>
  )
}

// Responsible for rendering cells
export function CellRenderer(
  cellGrid: CellGrid,
  selectedCell: Coordinate,
  clickHandler,
  updateCell,
  col,
  row,
  key,
  style,
  props
) {
  const handleClick = () => clickHandler({ row: row, col: col, val: '' })
  if (col === -1) {
    return (
      <RowHeaderCell
        key={key}
        style={style}
        rowNumber={row === 0 ? '' : row}
        onClick={handleClick}
        {...props}
      />
    )
  } else if (row === 0) {
    return (
      <ColumnHeaderCell
        key={key}
        style={style}
        title = {cellGrid.cells[row][col]}
        onClick={handleClick}
        {...props}
      />
    )
  }

  const cell: Coordinate = { row: row, col: col }
  const updater = (e: ChangeEvent<HTMLInputElement>) => {
    updateCell(e.target.value, cell)
  }
  const isSelected =
    (selectedCell.row === row && selectedCell.col === col) ||
    (selectedCell.row === row && selectedCell.col === -1) ||
    (selectedCell.row === 0 && selectedCell.col === col)

  return (
    <DataCell
      key={key}
      style={style}
      data={cellGrid.cells[row][col]}
      isSelected={isSelected}
      onClick={handleClick}
      update={updater}
      {...props}
    />
  )
}

// Gets the data from the selected grid, row, column, or single-cell
export function CellSelector(coordinate:Coordinate, cellGrid: (string | number)[][]){
  if (coordinate.row === 0 && coordinate.col === -1 ) return cellGrid
  else if (coordinate.row !== 0 && coordinate.col!== -1 ) return [[cellGrid[coordinate.row][coordinate.col]]]
  else if (coordinate.col=== -1) return [cellGrid[coordinate.row]]
  else return cellGrid.map(row => [row[coordinate.col]])

}
