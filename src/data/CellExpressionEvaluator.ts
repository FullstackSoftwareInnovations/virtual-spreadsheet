import {CellSelector} from "../components/Cells";
import {getCoordFromAlphStr} from "./CellGrid";


export function processCellValue(val: string | number, cells: (string | number)[][]): (string | number){
  if(typeof val === 'string'){
    let types = Object.keys(ExpressionTypes)
    for(let i = 0; i < types.length; i++){
      let type = types[i]
      if(val.toUpperCase().startsWith(`=${type}(`) && val.endsWith(')') ){
        try {
          return evaluateExpression(type,val.substring(type.length+2, val.length-1), cells)
        } catch(e){
          console.log(e)
          return "Invalid expression"
        }
      }
    }
  }
  return val
}

export function evaluateExpression(type: string, exp:string, cells: (string | number)[][]): string{

  let evalParams = []
  const expParams = exp.split(',')

  expParams.forEach(param =>{
    param = param.trim()
    try{
      evalParams.push(...getSelectionFlatlist(param, cells))
    } catch(e){
      evalParams.push(param)
    }

  })

  const evaluator = ExpressionTypes[type]

  return evaluator(evalParams)

}

function getSelectionFlatlist(param: string, cells){
  let evalParams = []
  let coordinate = getCoordFromAlphStr(param)
  let selectedCells = CellSelector(coordinate, cells)
  selectedCells.forEach(row=> {
    row.forEach(val => evalParams.push(val))
  })

  return evalParams
}

export const ExpressionTypes ={
  'COPY': copy,
  'SUM': sum,
  'SUB': subtract,
  'MULT': multiply,
  "DIV": divide,
  "POW": power,
}

export function copy(vals: (string | number)[]): string {
  let lastParam = vals[vals.length-1]
  let delim
  if (typeof lastParam === 'string'){
    if(lastParam.match(/delim=(?:'|").*(?:'|")/) ){
      delim = lastParam.substring(7,lastParam.length-1)
      vals.pop()
    }
  } else {
    delim = ''
  }

 return vals.join(delim)
}


export function sum(vals: (string | number)[]): number {
  let num = 0
  // @ts-ignore
  vals.forEach(val => num = num + (isNaN(Number(val)) ? val : Number(val)))
  return num
}

export function subtract(vals: (string | number)[]): number{
  if(!vals[0][0]) return 0
  return 1
}

export function multiply(vals: (string | number)[]): number {
  if (!vals[0][0]) return 0
  return 1
}

export function divide(vals: (string | number)[]): number {
  if (!vals[0][0]) return 0
  return 1
}

export function power(vals: (string | number)[]): number{
  if(!vals[0][0]) return 0
  return 1
}




