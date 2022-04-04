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
  const [selectedData, setSelectedData] = useState([['']])

  const getSelectedData = (cells, coordinate) => {
    /*
     * CellSelector retrieves the row, column or cell selected in a 2-d array
     * Can be used for any operations you need to perform when data is selected
     */
    setSelectedData(CellSelector(cells, coordinate))
  }

  /* Do any state updates you need by passing a function to the onUpdate prop */
  const processUpdate = (coordinate, newVal, cells) => {
    cells[coordinate.row][coordinate.col] = newVal
    setSelectedData(CellSelector(coordinate, cells))
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
