import React from 'react'
import { useHover } from '../hooks/useHover'

/* Default Styles */
const defaultFont = '18px Arial'

const defaultCellStyle = {
  verticalAlign: 'bottom',
  textAlign: 'center',
  border: '1px solid black',
  overflow: 'hidden',
  fontSize: 12
}

const defaultHeaderStyle = {
  zIndex: 1,
  cursor: 'pointer',
  color: '#ffffff',
  background: '#0077cc'
}

const defaultDataCellStyle = {
  color: '#000000',
  background: '#ffffff',
  zIndex: 0,
  cursor: 'default'
}

const defaultActiveCellStyle = {
  color: '#ffffff',
  background: '#33aaff'
}

/* UI Representation of cells */
export function RowHeaderCell(props) {
  const style = {
    ...props.style,
    ...defaultCellStyle,
    ...defaultHeaderStyle,
    ...(props.rowHeaderStyle ?? {}),
    font: props.cellFont ?? defaultFont
  }

  return (
    <div style={style} onClick={props.onClick}>
      {props.rowNumber}
    </div>
  )
}

export function ColumnHeaderCell(props) {
  const style = {
    ...props.style,
    ...defaultCellStyle,
    ...defaultHeaderStyle,
    ...(props.columnHeaderStyle ?? {}),
    font: props.cellFont ?? defaultFont
  }

  return (
    <div style={style} onClick={props.onClick}>
      {props.title}
    </div>
  )
}

export function DataCell(props) {
  const [ref, hovered] = useHover()

  let style = {
    ...props.style,
    ...defaultCellStyle,
    ...defaultDataCellStyle,
    ...(props.cellStyle ?? {}),
    font: props.cellFont ?? defaultFont
  }

  if (hovered || props.isSelected)
    style = {
      ...style,
      ...defaultActiveCellStyle,
      ...(props.activeCellStyle ?? {})
    }

  const handleClick = props.onClick ? props.onClick : () => {}

  return (
    <div ref={ref} style={style} onClick={handleClick}>
      {props.data}
    </div>
  )
}
