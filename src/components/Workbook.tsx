import React, { useEffect, useState } from "react";
import { CellMatrix, nullMatrix } from "../data/CellMatrix";
import { CellGrid } from "../data/CellGrid";
import Spreadsheet from "./Spreadsheet";

export default function Workbook(props){
  const [cellMatrix, setCellMatrix] = useState<CellMatrix>(nullMatrix())
  const [selectedGrid, setGrid] = useState(0)

  useEffect(() => {
    setCellMatrix(props.csv.split(props.sheetDelim ?? ';').map((gridCSV) =>{
      let grid = new CellGrid()
      grid.loadCSV(gridCSV, props.cellFont, props.cellWidth )
      return grid
    }))
  }, [props.csv])

 return (
   <React.Fragment>
     <Spreadsheet cellGrid = {cellMatrix[selectedGrid]} {...props}/>
     {
       cellMatrix.map((_grid, index) =>
         <input type ="button" value = {index} onClick = {() => setGrid(index)}/>
       )
     }
   </React.Fragment>



 )
}
