import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {Spreadsheet} from "./Spreadsheet";

export default {
  title: 'Spreadsheet',
  component: Spreadsheet,
  argTypes: {
    cells:{control: false}
  },
} as ComponentMeta<typeof Spreadsheet>;

const Template: ComponentStory<typeof Spreadsheet> = (args) => <Spreadsheet {...args} />;

export const UndefinedData = Template.bind({});
UndefinedData.args = {
  cells: undefined,
  height: '40vh',
  width: '80vw'
};

export const TableWithNoRows = Template.bind({});
TableWithNoRows.args = {
  cells: [],
  height: '40vh',
  width: '80vw'
};

export const Full = Template.bind({});
Full.args = {
  cells: defaultData(),
  height: '40vh',
  width: '80vw',
};

export const WithSizeModifiers = Template.bind({})

WithSizeModifiers.args = {
  cells: defaultData(),
  height: '40vh',
  width: '80vw',

  // @ts-ignore
  cellWidthModifier: (width, isActive, isHighlighted, isRightBoundary, isBottomBoundary) => {
    console.log('modified')
    return (isActive && !isRightBoundary) ? width+100 : width
  },

  // @ts-ignore
  cellHeightModifier: (height, isActive, isHighlighted, isRightBoundary, isBottomBoundary) => {
    console.log('modified')
    return (isActive && !isBottomBoundary) ? height+30 : height
  }
}



function defaultData(){
  let rows = []
  for(let r = 1; r <=20; r++){
    let row = []
    for(let c = 1; c <= 20; c++){
      row.push(r+''+c)
    }
    rows.push(row)
  }
  return rows
}



