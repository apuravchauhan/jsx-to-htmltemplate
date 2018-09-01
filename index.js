#!/usr/bin/env node
/**
 * @author: Apurav Chauhan<apurav.chauhan@gmail.com | github/twitter: apuravchauhan>
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
const traverse = require('babel-traverse').default;
var posthtmlFreemarker = require('posthtml-jsxhtml-freemarker');

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

const transformFile = (basePath, outputPath) => {
  fs.readdirSync(basePath).map((caseName) => {
    var transformed = '', dest = '';
    var absolutePath = path.join(basePath, caseName);

    const stats = fs.lstatSync(absolutePath);

    if (stats.isDirectory()) {
      var innerDirectory = path.join(outputPath, caseName)
      fileUtil.mkdirSyncRecursive(innerDirectory);
      transformFile(absolutePath, path.join(outputPath, caseName));
    } else {
      if (caseName.endsWith('.js')) {

        transformed = babel.transformFileSync(
          path.join(basePath, caseName), {
            presets: ["es2015"],
            plugins: [
              [
                "css-modules-transform", {
                  "generateScopedName": "[local]"
                }
              ],
              "jsx-to-generichtml"
            ]
          }
        ).code;

        dest = path.join(outputPath, caseName);
        fileUtil.mkdirSyncRecursive(outputPath);
        if (transformed.endsWith(';')) {
          transformed = transformed.slice(0, transformed.length - 1);
        }
        if (transformed.startsWith("'use strict';") || transformed.startsWith("\"use strict\";")) {
          transformed = transformed.slice(13, transformed.length);
        }
        fs.writeFileSync(dest, transformed);
      }
    }

  });

}


const status = new Spinner('Authenticating you, please wait...');
try {
  status.start();

  //create output directory
  fileUtil.mkdirSyncRecursive(outputPath);

  /** 
   * Transforming all files recursively
  */
  transformFile(basePath, outputPath);
  // transformFile(basePath, entryFile, outputPath);

  var contents = fs.readFileSync(path.join(outputPath, entryFile), 'utf8');
  var htmlTree = posthtmlFreemarker({ loc: outputPath, skipComponents: ['I18N', 'Button'] });
  var output = posthtml([htmlTree]).process(contents, { sync: true });
  console.log(output.html.replace(/\$+/g, '$'));
} finally {
  status.stop();
}