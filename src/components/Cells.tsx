import React, { ChangeEvent } from 'react'
import { useHover } from '../hooks/useHover'
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
  background: '#33aaff'
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

  if (col === 0) {
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
        title={col}
        onClick={handleClick}
        {...props}
      />
    )
  }

  const cell: Coordinate = { row: row-1, col: col-1 } // -1 to account for headers
  const updater = (e: ChangeEvent<HTMLInputElement>) => {
    updateCell(e.target.value, cell)
  }
  const isSelected =
    (selectedCell.row === row && selectedCell.col === col) ||
    (selectedCell.row === row && selectedCell.col === 0) ||
    (selectedCell.row === 0 && selectedCell.col === col)

  return (
    <DataCell
      key={key}
      style={style}
      data={cellGrid.cells[row - 1][col - 1]} // -1 to account for row/col number on Grid
      isSelected={isSelected}
      onClick={handleClick}
      update={updater}
      {...props}
    />
  )
}
