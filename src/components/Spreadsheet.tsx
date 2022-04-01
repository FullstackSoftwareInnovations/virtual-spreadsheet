import React, {CSSProperties, useEffect, useRef, useState} from "react";
import { CellRenderer } from './Cells'
import { MultiGrid, AutoSizer } from 'react-virtualized'
import type { Coordinate } from '../data/Coordinate'
import {compareCoordinates, nullCoordinate} from '../data/Coordinate'
import { CellGrid } from '../data/CellGrid'

export const Spreadsheet =({...props}: SpreadsheetProps) => {
  const speadsheetRef = useRef()
  const [cellGrid, setCellGrid] = useState<CellGrid>(new CellGrid())
  const [selectedCell, setCell] = useState(nullCoordinate())
  const [updateCount, setCount] = useState(0)

  //@ts-ignore
  const forceRender = () => speadsheetRef.current && speadsheetRef.current.forceUpdateGrids()
  const updateSize = () => {
    // @ts-ignore (doesn't like that ref.current may be undefined even though I check it isn't)
    speadsheetRef.current && speadsheetRef.current.recomputeGridSize()
    forceRender()
  }


  // Formats the csv and loads it into the cell grid
  useEffect(() => {
    if (props.cells){
      let toLoad = [...props.cells]
      if(!props.firstRowHeaders){
        let headers = props.cells[0].map( (_col: string| number, index: number) => index+1 )
        toLoad.unshift(headers)
      }
      cellGrid.loadCells(toLoad, props.sortableColumns, props.rowFilter, props.cellFont, props.cellWidth)
    }

    else {
      let toLoad = props.csv
      if(!props.firstRowHeaders){
        let firstRow = props.csv.substring(0, props.csv.indexOf('\n'))
        let headers = firstRow.split(',').map( (_col: string| number, index: number) => index+1 )
        toLoad = headers.join(',') + '\n' + props.csv
      }
      cellGrid.loadCSV(toLoad, props.sortableColumns, props.rowFilter, props.cellFont, props.cellWidth)
    }
    updateSize()
  }, [props.cells, props.csv])



  useEffect(()=>{
    if(props.rowFilter){
      setCellGrid(cellGrid.filterRows(props.rowFilter))
    }
  }, [props.rowFilter])


  const [sortOrder, setSort] = useState('default')

  // Highlights the selected cell, row, or column
  // If clicked column was already selected, sort table by that column
  const handleClick = (clicked: Coordinate) => {
    let vcol = cellGrid.virtualColumnIndices[clicked.col]
    let alreadySelected = compareCoordinates(selectedCell, clicked) === 0

    if (!alreadySelected){
      if(clicked.row === 0) setSort('default') // reset sort order when new column header is clicked
      setCell(clicked)

      props.onCellSelect && props.onCellSelect({row:clicked.row, col:vcol -1}, cellGrid.cells)
    }


    // already selected...
    else{
      //... and they've clicked a column header with sortableColumns enabled
      if(selectedCell.row === 0 && props.sortableColumns){
        switch(sortOrder){
          case 'default':
            cellGrid.sortColumn(vcol, 'normal', props.sortFunction)
            setSort('normal')
            break
          case 'normal':
            cellGrid.sortColumn(vcol, 'reverse')
            setSort('reverse')
            break
          default:
            cellGrid.sortColumn(vcol, 'default')
            setSort('default')

        }
      }
    }

    forceRender()
  }


  // Updates the cell value and resizes the grid if necessary
  const updateCell = (value, coordinate: Coordinate) => {
    // Call prop updater first so user has access to old and new vals
    let vcol = cellGrid.virtualColumnIndices[coordinate.col] -1 // -1 to account for not-real row headers
    let vcoord = {row: coordinate.row, col: vcol}

    cellGrid.update(vcoord, value)
    if(props.onCellUpdate){
      if (!props.firstRowHeaders) vcoord.row -=1
      props.onCellUpdate(vcoord, value)
    }

    updateSize()
  }


  const handleColumnDrag = (o,n ) => {
    cellGrid.moveColumn(o, n)
    updateSize()
  }



  // Returns cell renderer bases on row and col number. Attaches event handlers and style props
  const getCellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    return CellRenderer(
      cellGrid,
      selectedCell,
      handleClick,
      handleColumnDrag,
      updateCell,
      columnIndex, // -1 so my colNum headers don't mess with coordinate calculations
      rowIndex,
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
            fixedColumnCount={props.fixedColumnCount ?? 1}
            rowCount={cellGrid.cells.length}
            rowHeight={props.cellHeight ?? 28}
            fixedRowCount={props.fixedRowCount ?? 1}
            height={height == 0 || isNaN(height) ? 400 : height}
            width={width == 0 || isNaN(width) ? 900 : width}
            count={updateCount}
          />
        )}
      </AutoSizer>
    </div>


  )
}


export interface SpreadsheetProps {
  /**
   * Should use commas to delimit columns and newline to delimit rows.
   * Values cannot currently have commas (TODO: add custom delimiters, improve value parsing)
   */
  csv?: string

  /**
   *
   A 2-d array of values to be entered into the table
   */
  cells?: (string | number) [][]

  /**
   *
   If true, the first row will be used as column headers instead of data
   */
  firstRowHeaders?: boolean

  /**
   * Applied to rows in the table. Will filter out the row if boolean is false.
   *
   * If using the draggableColumns prop, use the index = columnIndices[UIColIndex] to index the row inside of your
   * rowFilter function. This will ensure the correct column is used in the filter criteria if user has moved the columns.
   *
   * If you are using the rowFilter, you should also keep your source data in sync with changes made in the Spreadsheet.
   * If you don't keep your source data in sync with the Spreadsheet, changes
   * will be lost when you apply a new rowFilter.
   * @param row
   * @param rowIndex
   * @param columnIndices
   */
  rowFilter?: (row, rowIndex, columnIndices) => boolean



  /**
   * If true, the column headers can be dragged to re-order them
   */
  draggableColumns?: boolean

  /**
   * If true, the columns will be sorted when they are clicked while already selected.
   * They will first be sorted in normal (alphabetical or numerical order), then reverse,
   * then back to its default order. You can override the 'normal' sort function with
   * the sortFunction prop.
   */
  sortableColumns?: boolean

  /**
   * Will be used as the 'normal' sort for your columns (if sortableColumns is enabled).
   * @param val1
   * @param val2
   */
  sortFunction?: (val1, val2) => number

  /**
   *
   The number of left-side columns that will remain visible when horizontally scrolling
   */
  fixedColumnCount?: number

  /**
   * The number of top-side rows that will remain visible when vertically scrolling
   */
  fixedRowCount?: number


  /**
   * Spreadsheet will dynamically size to its container by default. If the container's size is 0 or undefined, the width will default to 900px

   */
  width?: string | number

  /**
   * Spreadsheet will dynamically size to its container by default. If the container's size is 0 or undefined, the height will default to 400px
   */
  height?: string | number


  /**
   * Called when a cell, row, or column is clicked. You can pass the coordinate and cells to the CellSelector function to get a 2-D array with the selected data
   * @param coordinate
   * @param cells
   */
  onCellSelect?: (coordinate?, cells?) => void

  /**
   * Called when a cell value is changed. You can do any state updates you need in this method
   * @param coordinate: {row:number, col:number}
   * @param newValue: string
   * @param cells: (string | number)[][]
   */
  onCellUpdate?: (coordinate? , newValue?, cells?) => void

  /**
   * If present with no value or set to true, the data cells cannot be edited.
   */
  readOnly?: boolean

  /**
   * 'auto' calculates the width required for the each column. Limited to 1000 rows by default.
   * 'auto-' followed by a number overrides the depth limit for the width calculation(e.g. 'auto-5000').
   * 'auto-deep' will use every row in its width calculation.
   *
   * Override cautiously as too high of depth limit can cause the page to go unresponsive for 100K+ rows
   */
  cellWidth?: number | 'auto' | 'auto-deep' | 'auto-${number}'

  /**
   * Height of the data and header cells
   */
  cellHeight?: number

  /**
   * Must include size and typeset
   */
  cellFont?: string

  /**
   *Style the row number column. Avoid using height, width, font, and position.
   */
  rowHeaderStyle?: CSSProperties

  /**
   * Style the column number row. Avoid using height, width, font, and position.
   */
  columnHeaderStyle?: CSSProperties


  /**
   *Style spreadsheet's data cells. Avoid using height, width, font, and position.
   */
  cellStyle?: CSSProperties

  /**
   * Style data cells (not headers) when hovered or clicked on. Avoid using height, width, font, and position.
   */
  activeCellStyle?: CSSProperties

  /**
   * Style data cells (not headers) when its row or column header is clicked on. Avoid using height, width, font, and position.
   */
  highlightedCellStyle?: CSSProperties

}


