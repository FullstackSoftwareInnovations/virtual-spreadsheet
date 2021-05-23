# virtual-spreadsheet

> A lightweight, virtualized spreadsheet capable of supporting 100k+ lines of input.

[![NPM](https://img.shields.io/npm/v/virtual-spreadsheet.svg)](https://www.npmjs.com/package/virtual-spreadsheet) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save virtual-spreadsheet
```

## Usage

```tsx
import React, { Component } from 'react'
import {Spreadsheet} from 'virtual-spreadsheet'

function Example(props)
   /*
    *  The csv prop passed to spreadsheet should use commas to delimit columns and
    *  newline to delimit rows. (TODO: add custom delimiters)
    */
   let [csv, setCSV] = useState("hi,mom\ni'm,on tv!")
   fetch('/sample.csv')
      .then(csv => csv.text())
      .then(txt => setCSV(txt))

	return  <Spreadsheet
			     csv={csv}
			     notARealProp = { 'Cell size and font cannot be set with cellStyle' }
			     cellWidth = {'auto' /*number or 'auto', 'auto-deep', 'auto-number'*/}
			     cellHeight = {25 /*number*/}
			     cellFont = {'18px Arial' /* string */}
		 
			     notARealProp2 = { 'Style the cells using the props below' }
			     rowHeaderStyle={{color: '#ffffff', background: '#0077cc'}}
			     columnHeaderStyle={{color: '#ffffff',background: '#0077cc'}}
			     cellStyle={{ color: '#000000', background: '#ffffff',}}
			     activeCellStyle={{color: '#ffffff', background: '#33aaff'}}
			/>
  
}
```

## Props

```
csv: string (required)
Should use commas to delimit columns and newline to delimit rows. 
Values cannot currently have commas (TODO: add custom delimiters, improve value parsing)
		
readOnly: optional | boolean (default: false)
If present with no value or set to true, the data cells cannot be edited.
	
cellWidth: number, 'auto', 'auto-deep', 'auto-${number}' (default: 'auto')
'auto' calculates the width required for the each column. Limited to 1000 rows by default.
'auto-' followed by a number overrides the depth limit for the width calculation(e.g. 'auto-5000'). 
'auto-deep' will use every row in its width calculation. 

Override cautiously as too high of depth limit can cause the page to go unresponsive for 100K+ rows

cellHeight: number (default: 25)
Height of the data and header cells

cellFont: string (default: '18px Arial')
Must include size and typeset

rowHeaderStyle: CSSProperties
Style the row number column. Avoid using height, width, font, and position.

columnHeaderStyle: CSSProperties
Style the column number row. Avoid using height, width, font, and position.

cellStyle: CSSProperties
Style spreadsheet's data cells. Avoid using height, width, font, and position.

activeCellStyle: CSSProperties
Style spreadsheet's data cells when hovered or selected. Avoid using height, width, font, and position.
```

## License

MIT © [FullstackSoftwareInnovations](https://github.com/FullstackSoftwareInnovations)
