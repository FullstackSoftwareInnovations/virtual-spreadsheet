import React, { useEffect, useRef, useState } from "react";
import { CellRenderer } from './Cells'
import { MultiGrid, AutoSizer } from 'react-virtualized'
import type { Coordinate } from '../data/Coordinate'
import { nullCell } from '../data/Coordinate'
import { CellGrid } from '../data/CellGrid'

function Spreadsheet(props) {
  const [cellGrid, setCellGrid] = useState<CellGrid>(new CellGrid())
  const [selectedCell, setCell] = useState(nullCell())
  const [updateCount, setCount] = useState(0)
  const forceRender = () => setCount(updateCount + 1) // Multigrid will only re-render if a non-object prop changes
  const speadsheetRef = useRef()

  let resizeHandle;


  // Formats the csv and loads it into the cell grid
  useEffect(() => {
    const font = props.cellFont ?? '14px arial'
    const cellWidth = props.cellWidth ?? 125
    cellGrid.loadCSV(props.csv, font, cellWidth)
    forceRender()
  }, [props.csv])

  // Highlights the selected cell, row, or column
  const handleClick = (clicked: Coordinate) => {
    setCell(clicked)
    props.onCellSelect && props.onCellSelect(clicked, cellGrid.cells)
    forceRender()
  }

  // Updates the cell value and resizes the grid if necessary
  const updateCell = (value, coordinate: Coordinate) => {
    // Call prop updater first so user has access to old and new vals
    props.onCellUpdate && props.onCellUpdate(coordinate, value, cellGrid.cells)
    cellGrid.update(coordinate, value)
    // @ts-ignore (doesn't like that ref.current may be undefined even though I check it isn't)
    speadsheetRef.current && speadsheetRef.current.recomputeGridSize()
  }

  // Returns cell renderer bases on row and col number. Attaches event handlers and style props
  const getCellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    return CellRenderer(
      cellGrid,
      selectedCell,
      handleClick,
      updateCell,
      columnIndex - 1, // -1 so my colNum headers don't mess with coordinate calculations
      rowIndex - 1,    // -1 so my rowNum headers don't mess with coordinate calculations
      key,
      style,
      props
    )
  }

  // Wrapped in an AutoSizer to take the height/width of the user's container
  return (
    <div style = {{height:'100%', width:'100%'}}>
      <AutoSizer>
        {({ height, width }) => (
          <MultiGrid
            ref={speadsheetRef}
            cellRenderer={getCellRenderer}
            columnCount={cellGrid.cells.length === 0 ? 1 : cellGrid.cells[0].length + 1}
            columnWidth={(col) => (col.index === 0) ? 125 : cellGrid.widths[col.index - 1]}
            fixedColumnCount={1}
            rowCount={cellGrid.cells.length + 1}
            rowHeight={props.cellHeight ?? 50}
            fixedRowCount={1}
            height={height}
            width={width}
            count={updateCount}
          />
        )}
      </AutoSizer>
    </div>

  )
}

export default Spreadsheet
