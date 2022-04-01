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

export const Empty = Template.bind({});
Empty.args = {
  cells: undefined,
  height: '40vh',
  width: '80vw'
};

export const Primary = Template.bind({});
Primary.args = {
  cells: defaultData(),
  height: '40vh',
  width: '80vw'
};



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



