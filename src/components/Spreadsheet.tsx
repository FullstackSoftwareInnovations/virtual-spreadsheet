import React, { useEffect, useRef, useState } from "react";
import { CellRenderer } from './Cells'
import { MultiGrid, AutoSizer } from 'react-virtualized'
import type { Coordinate } from '../data/Coordinate'
import { nullCell } from '../data/Coordinate'
import { CellGrid } from '../data/CellGrid'

function Spreadsheet(props) {
  const speadsheetRef = useRef()
  const [cellGrid, setCellGrid] = useState<CellGrid>(new CellGrid())
  const [selectedCell, setCell] = useState(nullCell())
  const [updateCount, setCount] = useState(0)
  const forceRender = () => setCount(updateCount + 1) // Multigrid will only re-render if a non-object prop changes
  const updateSize = () => {
    // @ts-ignore (doesn't like that ref.current may be undefined even though I check it isn't)
    speadsheetRef.current && speadsheetRef.current.recomputeGridSize()
    forceRender()
  }


  // Formats the csv and loads it into the cell grid
  useEffect(() => {
    if (props.cellGrid) setCellGrid(props.cellGrid)
    else cellGrid.loadCSV(props.csv, props.cellFont, props.cellWidth)
    updateSize()
  }, [props.cellGrid, props.csv])

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
    updateSize()
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
    <div style = {{height: props.height ?? '100%', width: props.width ?? '100%'}}>
      <AutoSizer>
        {({ height, width }) => (
          <MultiGrid
            ref={speadsheetRef}
            cellRenderer={getCellRenderer}
            columnCount={cellGrid.cells.length === 0 ? 1 : cellGrid.cells[0].length + 1}
            columnWidth={(col) => cellGrid.widths[col.index]}
            fixedColumnCount={1}
            rowCount={cellGrid.cells.length + 1}
            rowHeight={props.cellHeight ?? 50}
            fixedRowCount={1}
            height={height == 0 || isNaN(height) ? 400 : height}
            width={width == 0 || isNaN(width) ? 900 : width}
            count={updateCount}
          />
        )}
      </AutoSizer>
    </div>


  )
}

export default Spreadsheet
