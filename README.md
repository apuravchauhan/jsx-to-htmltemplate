# jsx-to-htmltemplate
An experimental cli utility to convert JSX into html template. It also support different templating engines like java freemarker to render a template engine specific format

### Installation

Cli was tested with [Node.js](https://nodejs.org/) v9+. 

Install the dependencies and devDependencies and start the server.

```sh
$ npm install -g jsx-htmltemplate
$ jsx-htmltemplate

```

### Plugins

jsx-htmltemplate is based on plugin system. Behind the scene, it uses babel plugin to trasnpile es6 classes containing jsx in render function and convert them into generic html code. This html code is tranpiled into language and template engine specific html template using plugins. Currently the build is shipped with a Java freemarker template engine plugin converting JSX into a [Apache Freemarker](https://freemarker.apache.org/) template

| Plugin | README |
| ------ | ------ |
| Java Freemarker | [posthtml-jsxhtml-freemarker][PlDb] |


### Todos

 - Write Tests


License
----

MIT

   [PlDb]: <https://github.com/apuravchauhan/posthtml-jsxhtml-freemarker/>
