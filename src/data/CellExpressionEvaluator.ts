import {CellSelector} from "../components/Cells";

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
    evalParams.push(...getSelectionFlatlist(param, cells))
  })

  const evaluator = ExpressionTypes[type]

  console.log(evalParams.join(' '))
  return evaluator(evalParams)

}

function getSelectionFlatlist(param: string, cells){
  let evalParams = []
  let coordinate = param.split('-').map(coord => Number(coord) -1)
  let selectedCells = CellSelector({row: coordinate[0], col: coordinate[1]}, cells)
  selectedCells.forEach(row=> {
    row.forEach(val => evalParams.push(val))
  })
  return evalParams
}

export const ExpressionTypes ={
  'TEST': test,
  'SUM': sum,
  'SUB': subtract,
  'MULT': multiply,
  "DIV": divide,
  "POW": power,
}

export function test(vals: (string | number)[]): string {
  return vals.join(' ')
}


export function sum(vals: (string | number)[]): number {
  if (!vals[0][0]) return 0
  return 1
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




