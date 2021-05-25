# virtual-spreadsheet

> A lightweight, virtualized spreadsheet capable of supporting 100k+ lines of input.

[![NPM](https://img.shields.io/npm/v/virtual-spreadsheet.svg)](https://www.npmjs.com/package/virtual-spreadsheet) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Install

```bash
npm install --save virtual-spreadsheet
```

# Usage

```jsx
import React, { Component } from 'react'
import {Spreadsheet} from 'virtual-spreadsheet'

function Example(props)
    /*
    *  The csv prop passed to spreadsheet should use commas to delimit columns and
    *  newline to delimit rows. (TODO: add custom delimiters)
    */
    let [csv, setCSV] = useState("hi,mom\ni'm,on tv!")
    let [selectedData, setData] = useState([[""]])

    fetch('/big_sample.csv')
        .then(csv => csv.text())
        .then(txt => setCSV(txt))

    const getSelectedData = (coordinate, cells) => {
        /*
         * CellSelector retrieves the row, column or cell selected in a 2-d array
         * Can be used for any operations you need to perform when data is selected
         */
        setData(CellSelector(coordinate, cells))
    }

    const processUpdate = (coordinate, newVal, cells) => {
        console.log(newVal, cells) // You can do more interesting things here. I believe in you.
    }

    return (
        <div style = {{height:'75vh', width: '95vw'}}>
            <Spreadsheet csv={csv}

                         notARealProp = { 'You can attach some extra event handlers if needed' }
                         onCellSelect = {getSelectedData}
                         onCellUpdate = {processUpdate}

                         notARealProp2 = { 'Cell size and font cannot be set with cellStyle' }
                         cellWidth = {'auto' /*number or 'auto', 'auto-deep', 'auto-number'*/}
                         cellHeight = {25 /*number*/}
                         cellFont = {'18px Arial' /* string */}

                         notARealProp3 = { 'Style the cells using the props below' }
                         rowHeaderStyle={{color: '#ffffff', background: '#0077cc'}}
                         columnHeaderStyle={{color: '#ffffff',background: '#0077cc'}}
                         cellStyle={{ color: '#000000', background: '#ffffff',}}
                         activeCellStyle={{color: '#ffffff', background: '#33aaff'}}
            />

            {JSON.stringify(selectedData) /*Demonstration of CellSelector data*/}
        </div>
    );
  
}
```

# Props
### csv: string (required)
Should use commas to delimit columns and newline to delimit rows. 
Values cannot currently have commas (TODO: add custom delimiters, improve value parsing)

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

###cellHeight: number (default: 25)
Height of the data and header cells

###cellFont: string (default: '18px Arial')
Must include size and typeset

###rowHeaderStyle: CSSProperties
Style the row number column. Avoid using height, width, font, and position.

###columnHeaderStyle: CSSProperties
Style the column number row. Avoid using height, width, font, and position.

###cellStyle: CSSProperties
Style spreadsheet's data cells. Avoid using height, width, font, and position.

###activeCellStyle: CSSProperties
Style spreadsheet's data cells when hovered or selected. Avoid using height, width, font, and position.


# License

MIT © [FullstackSoftwareInnovations](https://github.com/FullstackSoftwareInnovations)
