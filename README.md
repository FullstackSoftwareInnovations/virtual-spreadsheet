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
  // doSomethingWithThe(props)
 
  /*
   *  The csv prop passed to spreadsheet should be use commas to delimit columns and
   *  newline to delimit rows. (TODO: add custom delimiters)
   */
  render() {
    return  <Spreadsheet csv={csv}
			 notARealProp = { 'Cell size and font cannot be set with the cellStyle or headerStyle props' }
			 cellWidth = {'auto'} {/*'auto' or number*/}
			 cellHeight = {25 /*number only*/}
			 cellFont = {'18px arial'}
			 
			 notARealProp = { 'Style the cells using the props below' }
			 rowHeaderStyle={{color: '#ffffff', background: '#0077cc'}}
			 columnHeaderStyle={{color: '#ffffff',background: '#0077cc'}}
			 cellStyle={{ color: '#000000', background: '#ffffff',}}
			 activeCellStyle={{color: '#ffffff', background: '#33aaff'}}
			 />
  }
}
```

## License

MIT © [FullstackSoftwareInnovations](https://github.com/FullstackSoftwareInnovations)
