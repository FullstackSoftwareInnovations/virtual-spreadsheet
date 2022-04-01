const fs = require("fs");
const  docsToMarkdown = require('react-docs-markdown');
const exec = require('child_process').exec;


let src = './src/components/Spreadsheet.tsx'
let header = fs.readFileSync('./docs/Description.md', (ignored)=>{})
exec(`react-docgen ${src}`, (error, stdout, stderr) =>{
    let json = JSON.parse(stdout.replace(/\r?\n/, ''))
    const md = docsToMarkdown(json, '');

    fs.writeFileSync('./docs/Spreadsheet.md', md, (ignored)=>{});


    let README = header + '\n' + md

    fs.writeFileSync('./README.md', README, (ignored)=>{});

  });


