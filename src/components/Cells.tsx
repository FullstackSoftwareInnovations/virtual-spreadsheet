import React, {ChangeEvent, useState} from 'react'
import { useHover } from 'helpful-react-hooks'
import { CellGrid } from '../data/CellGrid'
import { Coordinate } from '../data/Coordinate'
import {evaluateExpression, processCellValue} from "../data/CellExpressionEvaluator";


const selectedColor =  '#0099ee'

const defaultCellStyle = {
  verticalAlign: 'bottom',
  textAlign: 'center',
  border: '1px solid black',
  overflow: 'hidden'
}

const defaultHeaderStyle = {
  zIndex: 0,
  cursor: 'pointer',
  color: '#3f3f3f',
  background: '#cccccc'
}

const defaultDataCellStyle = {
  color: '#000000',
  background: '#ffffff',
  zIndex: 0,
  cursor: 'text',
  outline: 'none'
}

const defaultActiveCellStyle = {
  color: '#000000',
  background: '#ffffff',
  border: '3px solid',
  borderColor: selectedColor,
  zIndex: 1
}

const defaultHighlightedCellStyle = {
  border: '1px solid black',
  color: '#ffffff',
  background: selectedColor
}

/* UI Representation of cells */
export function RowHeaderCell(props) {
  const style = {
    ...props.style,
    ...defaultCellStyle,
    ...defaultHeaderStyle,
    ...(props.rowHeaderStyle ?? {}),
    font: props.cellFont
  }

  return (
    <div onClick={props.onClick}>
      <input disabled={true} value = {props.title} style = {style}/>
    </div>
  )
}

export function ColumnHeaderCell(props) {
  const style = {
    ...props.style,
    ...defaultCellStyle,
    ...defaultHeaderStyle,
    ...(props.columnHeaderStyle ?? {}),
    font: props.cellFont
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
           onClick={props.onClick}>
        <input disabled={true} value = {props.title} style = {style}/>
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
    font: props.cellFont,
    width: props.isRightBoundary ? props.style.width - 7: props.style.width,
    height: props.isBottomBoundary ? props.style.height - 4 : props.style.height
  }

  if (hovered || props.cellSelected) {
    style = {
      ...style,
      ...defaultActiveCellStyle,
      ...(props.activeCellStyle ?? {}),
      width: props.isRightBoundary ? style.width - 4: style.width - 8,
      height: props.isBottomBoundary ? style.height - 4:  style.height - 6
    }
  }

  else if (props.rowSelected || props.colSelected ){
    style = {
      ...style,
      ...defaultHighlightedCellStyle,
      ...(props.highlightedCellStyle ?? {})
    }
  }

  let sizeModifierParams = [
    props.cellSelected, // isActive
    (props.rowSelected || props.colSelected), //isHighlighted
    props.isRightBoundary,
    props.isLeftBoundary
  ]

  style.width = props.cellWidthModifier
    ? props.cellWidthModifier( props.style.width,...sizeModifierParams)
    : style.width

  style.height = props.cellHeightModifier
    ? props.cellHeightModifier( props.style.height,...sizeModifierParams)
    : style.height


  if (props.readOnly) style = {...style, cursor: 'pointer'}

  const handleClick = props.onClick ? props.onClick : () => {}

  let data =  props.data ? props.data : ''
  data = props.cellSelected ? data : processCellValue(props.data, props.cellGrid.cells)

  return (
    <div onClick={handleClick} ref={ref}>
      <input style={style}
             onChange={props.update}
             value={data}
             disabled={props.readOnly}/>
    </div>
  )
}

// Responsible for rendering cells
export function CellRenderer(
  cellGrid: CellGrid,
  selectedCell: Coordinate,
  clickHandler,
  onMoveColumn,
  updateCell,
  realCol,
  row,
  key,
  style,
  props
) {
  let col = realCol === -1 ? realCol : cellGrid.virtualColumnIndices[realCol]
  const coordinate: Coordinate = { row: row, col: realCol }
  const maxCoordinate= {row: cellGrid.cells.length -1, col: cellGrid.cells[0].length -1}

  const isRightBoundary = coordinate.col === maxCoordinate.col
  const isBottomBoundary = coordinate.row === maxCoordinate.row

  const handleClick = () => clickHandler({ row: row, col: realCol, val: '' })
  if (realCol === -1) {
    return (
      <RowHeaderCell
        key={key}
        style={style}
        title={cellGrid.rowHeaders[row+1]}
        isBottomBoundary = {isBottomBoundary}
        onClick={handleClick}
        cellFont = {cellGrid.font}
        {...props}
      />
    )
  } else if (row === -1) {
    return (
      <ColumnHeaderCell
        key={key}
        style={style}
        draggable = {props.draggableColumns}
        colNumber={realCol}
        isRightBoundary = {isRightBoundary}
        virtCol = {col}
        title = {cellGrid.columnHeaders[col]}
        onClick={handleClick}
        onMove = {onMoveColumn}
        cellFont = {cellGrid.font}
        {...props}
      />
    )
  }


  const updater = (e: ChangeEvent<HTMLInputElement>) => {
    updateCell(e.target.value, coordinate)
  }

  const rowSelected = selectedCell.row === row && selectedCell.col === -1
  const colSelected = selectedCell.row === -1 && selectedCell.col === realCol
  const cellSelected= selectedCell.row === row && selectedCell.col === realCol


  return (
    <DataCell
      key={key}
      style={style}
      coordinate={coordinate}
      isRightBoundary = {isRightBoundary}
      isBottomBoundary = {isBottomBoundary}
      rowSelected ={rowSelected}
      colSelected = {colSelected}
      cellSelected = {cellSelected}
      cellGrid = {cellGrid}
      data={cellGrid.getCell(row,realCol)}
      onClick={handleClick}
      update={updater}
      cellFont = {cellGrid.font}
      {...props}
    />
  )
}

// Gets the data from the selected grid, row, column, or single-cell
export function CellSelector(coordinate:Coordinate, cellGrid: (string | number)[][]){
  //if left upper corner clicked
  if (coordinate.row === -1 && coordinate.col === -1 ) return [[]]

  //data cell clicked
  else if (coordinate.row !== -1 && coordinate.col!== -1 ) return [[cellGrid[coordinate.row][coordinate.col]]]

  //row header clicked
  else if (coordinate.col=== -1) return [cellGrid[coordinate.row]]

  //col header clicked
  else return cellGrid.map(row => [row[coordinate.col]])

}



