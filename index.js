#!/usr/bin/env node
/**
 * @author: Apurav Chauhan | twitter: apuravchauhan
 */
const chalk = require('chalk');
const figlet = require('figlet');
const fileUtil = require('./lib/file');
const babel = require('babel-core');
const path = require('path');
const posthtml = require('posthtml');
const CLI = require('clui');
const fs = require('fs');
const Spinner = CLI.Spinner;
const pretty = require('pretty');
const posthtmlFreemarker = require('posthtml-jsxhtml-freemarker');

//const argv = require('minimist')(process.argv.slice(2));
console.log(
  chalk.yellow(
    figlet.textSync('jsx-htmltemplate', { horizontalLayout: 'default' })
  )
);

const args = require('minimist')(process.argv);

if (!args.d) {
  console.log(`
  
  Usage:

  jsx-htmltemplate [Options]
  
  Options:
  -d <dir containing preact/react jsx class components>
  -e <entry js file in dir containing preact/react jsx class components | default: index.js>
  -o <output directory | default: out-template in current directory>
  
  `);
  console.log(chalk.red('No directory specified'));
  process.exit();
}

var basePath = fileUtil.getComponentDir(args.d);
var entryFile = args.e || 'index.js';
var outputPath = args.o || 'out-template';

const status = new Spinner('Processing, please wait...');
try {
  status.start();
  //create output directory
  fileUtil.mkdirSyncRecursive(outputPath);

  fs.readdirSync(basePath).map((caseName) => {
    var transformed = '', dest = '';
    if (caseName.endsWith('.js')) {
      transformed = babel.transformFileSync(
        path.join(basePath, caseName), {
          presets: ["es2015"],
          plugins: ["jsx-to-generichtml", "syntax-jsx",
            "syntax-class-properties"]
        }
      ).code;
      dest = path.join(outputPath, caseName);
    } else {
      transformed = babel.transformFileSync(
        path.join(basePath, caseName, "index.js"), {
          presets: ["es2015"],
          plugins: ["jsx-to-generichtml", "syntax-jsx",
            "syntax-class-properties"]
        }
      ).code;
      dest = path.join(outputPath, caseName, "index.js");
      fileUtil.mkdirSyncRecursive(path.join(outputPath, caseName));
    }
    if (transformed.endsWith(';')) {
      transformed = transformed.slice(0, transformed.length - 1);
    }
    if (transformed.startsWith("'use strict';") || transformed.startsWith("\"use strict\";")) {
      transformed = transformed.slice(13, transformed.length);
    }
    fs.writeFileSync(dest, transformed);
  });

  var contents = fs.readFileSync(path.join(outputPath, entryFile), 'utf8');
  var output = posthtml([posthtmlFreemarker({ loc: outputPath })])
    // .use(beautify({rules: {indent: 2}}))
    .process(contents, { sync: true });
  console.log(`
      
    ${pretty(output.html, { ocd: true })}
  
  `)

} finally {
  status.stop();
}