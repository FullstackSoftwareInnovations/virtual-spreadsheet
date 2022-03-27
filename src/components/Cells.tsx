import React, {ChangeEvent, useState} from 'react'
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

  if (props.draggable) {
    const onDragStart = (event) => {
      event.dataTransfer.setData("drag-item", props.colNumber);
    }

    const onDragOver = (event) => {
      event.preventDefault()
    }
    const onDrop = (event) => {
      const droppedItem = event.dataTransfer.getData("drag-item");
      if (droppedItem) {
        props.onMove(droppedItem, props.colNumber)
      }
    }
    return (
      <div draggable
           onDragStart={onDragStart}
           onDragOver={onDragOver}
           onDrop={onDrop}
           style={style}
           onClick={props.onClick}>
        {props.title}
      </div>
    )
  }


 else return (
    <div style={style}
         onClick={props.onClick}>
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

  const data =  props.data === '' ? ' ' : props.data

  return (
    <div onClick={handleClick}>
      <input
        ref={ref}
        style={style}
        onChange={props.update}
        value={data}
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
  draggableColumns,
  onMoveColumn,
  updateCell,
  realCol,
  row,
  key,
  style,
  props
) {
  let col = cellGrid.virtualColumnIndices[realCol]

  const handleClick = () => clickHandler({ row: row, col: realCol, val: '' })
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
        draggable = {draggableColumns}
        colNumber={realCol}
        virtCol = {col}
        title = {cellGrid.getCell(row,realCol)}
        onClick={handleClick}
        onMove = {onMoveColumn}
        {...props}
      />
    )
  }

  const cell: Coordinate = { row: row, col: realCol }
  const updater = (e: ChangeEvent<HTMLInputElement>) => {
    updateCell(e.target.value, cell)
  }

  const isSelected =
    (selectedCell.row === row && selectedCell.col === realCol) ||
    (selectedCell.row === row && selectedCell.col === 0) ||
    (selectedCell.row === 0 && selectedCell.col === realCol)

  return (
    <DataCell
      key={key}
      style={style}
      data={cellGrid.getCell(row,realCol)}
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
