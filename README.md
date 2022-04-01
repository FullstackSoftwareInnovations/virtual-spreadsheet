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


## Props
| Name                 | Type                                                            | Default | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | --------------------------------------------------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| csv                  | string                                                          |         | false    | Should use commas to delimit columns and newline to delimit rows.<br>Values cannot currently have commas (TODO: add custom delimiters, improve value parsing)                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| cells                | (string &#124; number) &#91;&#93;&#91;&#93;                     |         | false    | A 2-d array of values to be entered into the table                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| firstRowHeaders      | boolean                                                         | false   | false    | If true, the first row will be used as column headers instead of data                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| rowFilter            | (row, rowIndex, columnIndices) =&gt; boolean                    |         | false    | Applied to rows in the table. Will filter out the row if boolean is false.<br><br>If using the draggableColumns prop, use the index = columnIndices[UIColIndex] to index the row inside of your<br>rowFilter function. This will ensure the correct column is used in the filter criteria if user has moved the columns.<br><br>If you are using the rowFilter, you should also keep your source data in sync with changes made in the Spreadsheet.<br>If you don't keep your source data in sync with the Spreadsheet, changes<br>will be lost when you apply a new rowFilter.<br>@param row<br>@param rowIndex<br>@param columnIndices |
| draggableColumns     | boolean                                                         | false   | false    | If true, the column headers can be dragged to re-order them                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| sortableColumns      | boolean                                                         | false   | false    | If true, the columns will be sorted when they are clicked while already selected.<br>They will first be sorted in normal (alphabetical or numerical order), then reverse,<br>then back to its default order. You can override the 'normal' sort function with<br>the sortFunction prop.                                                                                                                                                                                                                                                                                                                                                  |
| sortFunction         | (val1, val2) =&gt; number                                       |         | false    | Will be used as the 'normal' sort for your columns (if sortableColumns is enabled).<br>@param val1<br>@param val2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| fixedColumnCount     | number                                                          |         | false    | The number of left-side columns that will remain visible when horizontally scrolling                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| fixedRowCount        | number                                                          |         | false    | The number of top-side rows that will remain visible when vertically scrolling                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| width                | string &#124; number                                            |         | false    | Spreadsheet will dynamically size to its container by default. If the container's size is 0 or undefined, the width will default to 900px                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| height               | string &#124; number                                            |         | false    | Spreadsheet will dynamically size to its container by default. If the container's size is 0 or undefined, the height will default to 400px                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| onCellSelect         | (coordinate?, cells?) =&gt; void                                |         | false    | Called when a cell, row, or column is clicked. You can pass the coordinate and cells to the CellSelector function to get a 2-D array with the selected data<br>@param coordinate<br>@param cells                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| onCellUpdate         | (coordinate? , newValue?, cells?) =&gt; void                    |         | false    | Called when a cell value is changed. You can do any state updates you need in this method<br>@param coordinate: {row:number, col:number}<br>@param newValue: string<br>@param cells: (string | number)[][]                                                                                                                                                                                                                                                                                                                                                                                                                               |
| readOnly             | boolean                                                         | false   | false    | If present with no value or set to true, the data cells cannot be edited.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| cellWidth            | number &#124; 'auto' &#124; 'auto-deep' &#124; 'auto-${number}' |         | false    | 'auto' calculates the width required for the each column. Limited to 1000 rows by default.<br>'auto-' followed by a number overrides the depth limit for the width calculation(e.g. 'auto-5000').<br>'auto-deep' will use every row in its width calculation.<br><br>Override cautiously as too high of depth limit can cause the page to go unresponsive for 100K+ rows                                                                                                                                                                                                                                                                 |
| cellHeight           | number                                                          |         | false    | Height of the data and header cells                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| cellFont             | string                                                          |         | false    | Must include size and typeset                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| rowHeaderStyle       | CSSProperties                                                   |         | false    | Style the row number column. Avoid using height, width, font, and position.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| columnHeaderStyle    | CSSProperties                                                   |         | false    | Style the column number row. Avoid using height, width, font, and position.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| cellStyle            | CSSProperties                                                   |         | false    | Style spreadsheet's data cells. Avoid using height, width, font, and position.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| activeCellStyle      | CSSProperties                                                   |         | false    | Style data cells (not headers) when hovered or clicked on. Avoid using height, width, font, and position.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| highlightedCellStyle | CSSProperties                                                   |         | false    | Style data cells (not headers) when its row or column header is clicked on. Avoid using height, width, font, and position.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
