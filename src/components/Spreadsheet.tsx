import React, { useEffect, useState } from 'react'
import { ColumnHeaderCell, DataCell, RowHeaderCell } from './Cells'
import { MultiGrid, AutoSizer } from 'react-virtualized'
import type { Coordinate } from '../data/Coordinate'
import { nullCell } from '../data/Coordinate'
import { emptyCellGrid, formatCSV } from '../data/CellGrid'
import type { CellGrid } from '../data/CellGrid'

function Spreadsheet(props) {
  const [cellGrid, setCellGrid] = useState<CellGrid>(emptyCellGrid())
  const [selectedCell, setCell] = useState(nullCell())
  const [sortOrder, setOrder] = useState('NRM0')

  useEffect(() => {
    if (props.cells) setCellGrid(props.cells)
    else setCellGrid(formatCSV(props.csv))
  }, [props.csv, props.data])

  const handleClick = (clicked: Coordinate) => {
    setCell(clicked)
    if (props.onSelect) props.onSelect(clicked, cellGrid)
  }

  const getCellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    return CellRenderer(
      cellGrid,
      selectedCell,
      handleClick,
      columnIndex,
      rowIndex,
      key,
      style,
      props
    )
  }

  const numCols = cellGrid.length === 0 ? 1 : cellGrid[0].length + 1

  return (
    <AutoSizer>
      {({ height, width }) => (
        <MultiGrid
          cellRenderer={getCellRenderer}
          columnCount={numCols}
          columnWidth={props.cellWidth ?? 125}
          fixedColumnCount={1}
          rowCount={cellGrid.length + 1}
          rowHeight={props.cellHeight ?? 50}
          fixedRowCount={1}
          height={height}
          width={width}
          sort={sortOrder}
          selected={selectedCell}
        />
      )}
    </AutoSizer>
  )
}

function CellRenderer(
  cellGrid: CellGrid,
  selectedCell: Coordinate,
  clickHandler,
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

  const isSelected =
    (selectedCell.row === row && selectedCell.col === col) ||
    (selectedCell.row === row && selectedCell.col === 0) ||
    (selectedCell.row === 0 && selectedCell.col === col)

  return (
    <DataCell
      key={key}
      style={style}
      data={cellGrid[row - 1][col - 1]} // -1 to account for row/col number on Grid
      isSelected={isSelected}
      onClick={handleClick}
      {...props}
    />
  )
}

export default Spreadsheet
