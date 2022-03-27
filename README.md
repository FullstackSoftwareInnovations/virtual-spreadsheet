# virtual-spreadsheet

> A lightweight, virtualized spreadsheet capable of rendering millions of cells of data.

[![NPM](https://img.shields.io/npm/v/virtual-spreadsheet.svg)](https://www.npmjs.com/package/virtual-spreadsheet) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Install

```bash
npm install virtual-spreadsheet
```

# Usage

```jsx
import React, { Component } from 'react'
import {Spreadsheet} from 'virtual-spreadsheet'

function SpreadsheetExample () {
  /*
   *  The csv prop passed to spreadsheet should use commas to delimit columns and
   *  newline to delimit rows. (TODO: add custom delimiters)
   */
  const [csv, setCSV] = useState("hi,mom\ni'm,on tv!")

  /* Used to demonstrate the CellSelector. Not necessary for operation */
  const [selectedData, setData] = useState([['']])

  const getSelectedData = (coordinate, cells) => {
    /*
     * CellSelector retrieves the row, column or cell selected in a 2-d array
     * Can be used for any operations you need to perform when data is selected
     */
    setData(CellSelector(coordinate, cells))
  }

  /* Do any state updates you need by passing a function to the onUpdate prop */
  const processUpdate = (coordinate, newVal, cells) => {
    cells[coordinate.row][coordinate.col] = newVal
    setData(CellSelector(coordinate, cells))
  }

  fetch('/big_sample.csv')
    .then(csv => csv.text())
    .then(txt => setCSV(txt))

  return (
    <React.Fragment>
      <Spreadsheet
        csv={csv}
        height='70vh'
        width='95vw'

        notARealProp='You can attach some extra event handlers if needed'
        onCellSelect={getSelectedData}
        onCellUpdate={processUpdate}

        notARealProp2='Cell size and font cannot be set with cellStyle'
        cellWidth='auto'
        cellHeight={25 /* number */}
        cellFont='18px Arial'

        notARealProp3='Style the cells using the props below'
        rowHeaderStyle={{ color: '#ffffff', background: '#0077cc' }}
        columnHeaderStyle={{ color: '#ffffff', background: '#0077cc' }}
        cellStyle={{ color: '#000000', background: '#ffffff' }}
        activeCellStyle={{ color: '#ffffff', background: '#33aaff' }}
      />

      {JSON.stringify(selectedData) /* Demonstration of CellSelector data */}
    </React.Fragment>
  )
}
```

# Props
### csv: string (one of: [csv, cells] is required)
Should use commas to delimit columns and newline to delimit rows.
Values cannot currently have commas (TODO: add custom delimiters, improve value parsing)

### cells: (string | number)[ ][ ] (one of: [csv, cells] is required)
A 2-d array of values to be entered into the table

### firstRowHeaders: boolean (optional)
If true, the first row will be used as column headers instead of data

### draggableColumns: boolean (default: false)
If true, the column headers can be dragged to re-order them

### sortableColumns boolean (default: false)
If true, the columns will be sorted when they are clicked while already selected.
They will first be sorted in normal (alphabetical or numerical order), then reverse,
then back to its default order.

### fixedColumnCount: number (default: 1)
The number of left-side columns that will remain visible when horizontally scrolling

### fixedRowCount: number (default: 1)
The number of top-side rows that will remain visible when vertically scrolling


### width: string | number (default: '100%')
Spreadsheet will dynamically size to its container by default. If the container's size is 0 or undefined, the width will default to 900px

### height: string | number (default: '100%')
Spreadsheet will dynamically size to its container by default. If the container's size is 0 or undefined, the height will default to 400px

### onCellSelect: function(coordinate: {row:number, col:number}, cells: (string | number)[ ][ ])
Called when a cell, row, or column is clicked. You can pass the coordinate and cells to the CellSelector function to get a 2-D array with the selected data

### onCellUpdate: function(coordinate: {row:number, col:number}, newValue: string, cells: (string | number)[ ][ ])
Called when a cell value is changed. You can do any state updates you need in this method

### readOnly: optional | boolean (default: false)
If present with no value or set to true, the data cells cannot be edited.

### cellWidth: number, 'auto', 'auto-deep', 'auto-${number}' (default: 'auto')
'auto' calculates the width required for the each column. Limited to 1000 rows by default.
'auto-' followed by a number overrides the depth limit for the width calculation(e.g. 'auto-5000').
'auto-deep' will use every row in its width calculation.

Override cautiously as too high of depth limit can cause the page to go unresponsive for 100K+ rows

### cellHeight: number (default: 25)
Height of the data and header cells

### cellFont: string (default: '18px Arial')
Must include size and typeset

### rowHeaderStyle: CSSProperties
Style the row number column. Avoid using height, width, font, and position.

### columnHeaderStyle: CSSProperties
Style the column number row. Avoid using height, width, font, and position.

### cellStyle: CSSProperties
Style spreadsheet's data cells. Avoid using height, width, font, and position.

### activeCellStyle: CSSProperties
Style spreadsheet's data cells when hovered or selected. Avoid using height, width, font, and position.


# License

MIT © [FullstackSoftwareInnovations](https://github.com/FullstackSoftwareInnovations)
