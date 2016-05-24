# webpack-step-by-step
Simple step by step tutorial to setup webpack for dev and prod

[webpack](http://webpack.github.io/) is an awesome module bundler which came to the party a bit late after [gulp](http://gulpjs.com/) and [grunt](http://gruntjs.com/). It took me very less time get comfortable with both grunt and gulp and i used them both in separate projects. Both are doing their job great but when it comes to bundling, they need help from different plugins and lack some bundling features.

webpack was never easy for me to start with mainly because of its complex documentation ( .... ).

This repo is an attempt setup webpack with minimal possible option as step by step guide. After completing this, you will have webpack configured for development, production ( covering babel, react (JSX), eslint, css and few more...)

## step 1: setup your projects
open terminal and navigate to your project root directory. run `npm init` and enter all asked values. this will create package.json.

## step 2: Install dev dependencies
All webpack modules will be installed as dev dependencies as those are not required to be deployed. Although you can install all dependencies in one go, but i will be doint it one at a time, to have small description about them:

open terminal and run below commands :

1.) [webpack](https://www.npmjs.com/package/webpack)

```bash

 npm install webpack --save-dev
```

2.) [webpack-dev-middleware](https://www.npmjs.com/package/webpack-dev-middleware) It's a simple wrapper middleware for webpack. It serves the files emitted from webpack over a connect server. It has a few advantages over bundling it as files:

No files are written to disk, it handle the files in memory If files changed in watch mode, the middleware no longer serves the old bundle, but delays requests until the compiling has finished. You don't have to wait before refreshing the page after a file modification.

```bash
npm install webpack-dev-middleware --save-dev
```

3.) [webpack-hot-middleware](https://www.npmjs.com/package/webpack-hot-middleware) Webpack hot reloading using only webpack-dev-middleware. This allows you to add hot reloading into an existing server without webpack-dev-server.

```bash

npm install webpack-hot-middleware --save-dev
```

### [loaders](https://webpack.github.io/docs/loaders.html)
Now we will be installing bunch of loaders to support multiple loading tasks.

brief explanation : Loaders allow you to preprocess files as you require() or "load" them. Loaders are kind of like "tasks" are in other build tools, and provide a powerful way to handle frontend build steps. Loaders can transform files from a different language like, CoffeeScript to JavaScript, or inline images as data URLs. Loaders even allow you to do things like require() css files right in your JavaScript!

4.) [babel-loader](https://www.npmjs.com/package/babel-loader) This package allows transpiling JavaScript files using Babel and webpack.

Here i am assuming, you will be writing your code using ES6 and have some idea on [babel](https://babeljs.io/) which is a compiler for writing next generation JavaScript. We will be doing our setup using babel6, which is its latest version and differs alot from its older versions.

Since babel-loader depends number of modules from babel, we will be installing all of them together. Make sure to read about them ..         * *[babel-core](https://www.npmjs.com/package/babel-core)*    
* *[babel-preset-es2015](https://www.npmjs.com/package/babel-preset-es2015)* - Babel preset for all es2015 plugins    
* *[babel-preset-react](https://www.npmjs.com/package/babel-preset-react)* - Babel preset for all React plugins. This one is only needed if you are using React as part of your project. As part of this tutorial, we will be showing example for both a React Component and a normal JS file.

```bash

npm install babel-loader babel-core babel-preset-es2015 babel-preset-react babel-preset-stage-0 --save-dev
```

5.) [eslint-loader](https://www.npmjs.com/package/eslint-loader) - This loader will help us to throw linting errors before bundling up your module.

Lets add *[eslint](http://eslint.org/)* configuration first to our project. At root directory add filename *'.eslintrc'* I will be extending *[airbnb](https://github.com/airbnb)* eslint configuration for this one, but it can be replaced with any customized config values:

Install *esling-config-airbnb*, *eslint* and *eslint-plugin-react* modules :

```bash

npm install eslint-config-airbnb eslint eslint-plugin-react --save-dev
```

Add following code in .eslintrc :

```javascript

{
  "extends": "airbnb",
  "ecmaFeatures": {

  },
  "globals": {

  }
}
```

Note: Your might need to add some global variables or extra features like *'experimentalObjectRestSpread'* based on your code base.

```bash

npm install eslint-loader --save-dev
```

6.) style loaders - We will be using couple of loader/plugin to support css module system. you can import your styles using code like :

```javascript
require('./styles/style.scss');
```

and through webpack, we can configure to either included as part of Javascript bundle itself, or load separately as '.css files.' I prefer loading .css files as separate modules loaded over the wire rather than injecting them in JS bundles.

We will be installing *[autoprefixer-loader](https://www.npmjs.com/package/autoprefixer-loader)*, *[css-loader](https://www.npmjs.com/package/css-loader)*, *[sass-loader](https://www.npmjs.com/package/sass-loader)*, *[style-loader](https://www.npmjs.com/package/style-loader)*

```bash

npm install css-loader sass-loader node-sass style-loader autoprefixer-loader --save-dev
```

7.) Add babel configuration - Add .babelrc file at root level

Add presets to add required babel plugins to transpile our code :

```javascript

{
  "presets": ["react", "es2015","stage-0"]
}
```

8.) *Babel Runtime support*

Babel can't support all of ES6 with compilation alone -- it also requires some runtime support. In particular, the new ES6 built-ins like Set, Map and Promise must be polyfilled, and Babel's generator implementation also uses a number of runtime helpers. Given your app doesn't have to share a JavaScript environment with other apps, you'll be ok to use babel-polyfill to handle this:

```bash
npm install babel-polyfill --save
```

Babel also bakes a number of smaller helpers directly into your compiled code. This is OK for single files, but when bundling with Webpack, repeated code will result in a heavier file size. It is possible to replace these helpers with calls to the babel-runtime package by adding the transform-runtime plugin:

```bash
npm install babel-runtime --save
npm install babel-plugin-transform-runtime --save-dev
```

9.) **[express](http://expressjs.com/)** - Lets setup a express server at port *9000*.

Note: Below mentioned steps are not required for webpack setup but gives some idea about a clean project setup.

```bash

npm install express --save
```

Add file 'server.js' at root directory. we will also be adding a babel file related to server which will read configuration from .babelrc and enable runtime transpilation to use ES6/7 in node.

Add server.babel.js at root directory and add below code ( which i believe is self-explanatory):

```javascript

//  enable runtime transpilation to use ES6/7 in node

var fs = require('fs');

var babelrc = fs.readFileSync('./.babelrc');
var config;

try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

require('babel-core/register')(config);
```

lets add code to our server.js file :

==> require modules

```javascript

require('./server.babel');
var path = require('path');
var fs = require('fs');
var express = require('express');
var webpack = require('webpack');
```

===> add a check if its development or production environment as a global constant

```javascript

global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
```

===> Load webpack config file based on environment. We will be adding webpack config files in next step

```javascript

if (__DEVELOPMENT__) {
  var config = require('./webpack.config');
} else{
  var config = require('./webpack.prod.config');
}
```

===> Create Express server instance and configure with webpack

```javascript

var app = express();
var compiler = webpack(config);
```

===> Hook our Express server with 'webpack-hot-middleware' and 'webpack-hot-middleware' only for development

```javascript

if (__DEVELOPMENT__) {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}
```

===> Move this code to upper 'if' block

```javascript

if (__DEVELOPMENT__) {
  var config = require('./webpack.config');
  var compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
} else{
  var config = require('./webpack.prod.config');
  var compiler = webpack(config);
}
```

===> add index.html file at root directory and enter below

```javascript
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Webpack step by step</title>
  <link href='/public/main.css' media='all' rel='stylesheet' type='text/css' />
</head>

<body>
  <div id="main"></div>
  <script src='/public/main.js'></script>
</body>

</html>
```

===> Create http server and listen on port 9000

```javascript

const server = new http.Server(app);

const index = fs.readFileSync('./index.html', {
  encoding: 'utf-8'
});
const str = index;

app.get('*', function(req, res) {
  res.status(200).send(str);
});

app.get('*', function(req, res) {
  res.status(404).send('Server.js > 404 - Page Not Found');
});

app.use((err, req, res, next) => {
  console.error("Error on request %s %s", req.method, req.url);
  console.error(err.stack);
  res.status(500).send("Server error");
});

process.on('uncaughtException', evt => {
  console.log('uncaughtException ', evt);
});

server.listen('9000', (err) => {
  if (err) {
    console.error(err);
  }
  console.info('==> 💻  Open http://%s:%s in a browser to view the app.', 'localhost', '9000');
});
```

complete code for server.js is *[here](https://github.com/abhijeetNmishra/webpack-step-by-step/blob/master/server.js)*

===> add *'webpack.config.js'* and *'webpack.prod.config.js'* at root directory

===> add *'src'* folder to root directory with below structure

```javascript

|-- src
      |-- js
        |-- main.js (entry point of the application)
        |-- MyComponent.jsx ( Sample React Component)
      |-- styles
        |-- main.scss ( sample style file to be loaded)
|-- public
```

10.) [extract-text-webpack-plugin](https://github.com/webpack/extract-text-webpack-plugin) - It moves every require("style.css") in entry chunks into a separate css output file. So your styles are no longer inlined into the javascript, but separate in a css bundle file (styles.css). If your total stylesheet volume is big, it will be faster because the stylesheet bundle is loaded in parallel to the javascript bundle.

```bash

npm install extract-text-webpack-plugin --save-dev
```

11.) add code in *'webpack.config.js'*

```javascript
require('babel-polyfill');
var fs = require('fs');
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var mainPath = path.resolve(__dirname, 'src', 'main.js');
var publicPath = path.resolve(__dirname, 'public');

var config = {

}

module.exports = config;
```

In the above code config is the section where we will add all webpack related configuration. Lets add each config option one at a time :

 * *devtools* ->  'cheap-module-eval-source-map'. This option will only be needed in development environment which will help in debugging. Using this option will result in large bundle size. Make sure remove this prod config file.

```javascript
 var config = {
   devtool: 'cheap-module-eval-source-map',
 }
```

You can read about all possible options **[here](https://webpack.github.io/docs/configuration.html#devtool)**

 * *entry* : read **[here](https://webpack.github.io/docs/configuration.html#entry)** This one is most important part of webpack config.

```javascript

 var config = {
   devtool: 'cheap-module-eval-source-map',
   entry: {
    main: [
      // configuration for babel6
      'babel-polyfill',
      'webpack-hot-middleware/client?http://localhost:9000/__webpack_hmr',
      // example for single entry point. Multiple Entry bundle example will be added later
      './src/js/main.js'
    ]
  },
 }
```

  * *output* : read **[here](https://webpack.github.io/docs/configuration.html#output)** we will creating a single output bundle for this tutorial named 'main.js'

```javascript
var config = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
   main: [
     // configuration for babel6
     'babel-polyfill',
     'webpack-hot-middleware/client?http://localhost:9000/__webpack_hmr',
     // example for single entry point. Multiple Entry bundle example will be added later
     './src/js/main.js'
   ]
 },
 output: {
    filename: '[name].js',
    path: path.join(__dirname, 'public'),
    publicPath: '/public/'
  },
}
```

 * *module* - read **[here](https://webpack.github.io/docs/configuration.html#module)**. module object will have loaders, preLoaders and postLoaders. loaders basically specifies, which webpack loader plugin you want to use for your task. for e.g if you want require a '.json' file as a module, you will be using 'json-loader'. To perform ES6 transpilation, we will be using *'babel-loader'*. Similarly, we have *'css-loader'*, *'style-loader'* etc. for various file types.

 we will be preloader option to perform eslint before bundling our output. I can't think of any postLoaders scenario for my example yet.

```javascript
 var config = {
   devtool: 'cheap-module-eval-source-map',
   entry: {
    main: [
      // configuration for babel6
      'babel-polyfill',
      'webpack-hot-middleware/client?http://localhost:9000/__webpack_hmr',
      // example for single entry point. Multiple Entry bundle example will be added later
      './src/js/main.js'
    ]
  },
  output: {
     filename: '[name].js',
     path: path.join(__dirname, 'public'),
     publicPath: '/public/'
   },
 },
 module: {
   preLoaders: [
      {
        test: /\.jsx$|\.js$/,
        loader: 'eslint-loader',
        include: __dirname + '/src/'
      }
    ],
    loaders: [{
      test: /\.jsx?$/,
      include: path.join(__dirname, 'src'),
      loader: "babel-loader",
      exclude: [nodeModulesPath]
    },
    {
      test: /\.scss$/,
      include: path.join(__dirname, 'src'),
      loader: ExtractTextPlugin.extract('style-loader', 'css!autoprefixer-loader?browsers=last 2 version!sass')
    }]
 }
```

 * *plugins*: Webpack comes up with large set of built-in and custom (published via npm) [plugins](https://webpack.github.io/docs/using-plugins.html)      
 Make sure to checkout *[list of plugins](https://webpack.github.io/docs/list-of-plugins.html)*

 Lets add few plugins to our code :

  * *[UglifyJsPlugin](https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin)* - Minimize all JavaScript output of chunks. Loaders are switched into minimizing mode. You can pass an object containing [UglifyJS options](https://github.com/mishoo/UglifyJS2#usage)

  * *[DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin)* - Define free variables. Useful for having development builds with debug logging or adding global constants.

  * *[HotModuleReplacementPlugin](https://webpack.github.io/docs/list-of-plugins.html#hotmodulereplacementplugin)* : Only use in development mode. Enables Hot Module Replacement. (This requires records data if not in dev-server mode, recordsPath) Generates Hot Update Chunks of each chunk in the records

  * *[NoErrorsPlugin](https://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin)*: When there are errors while compiling this plugin skips the emitting phase (and recording phase), so there are no assets emitted that include errors. The emitted flag in the stats is false for all assets. If you are using the CLI, the webpack process will not exit with an error code by enabling this plugin. If you want webpack to "fail" when using the CLI, please check out the bail option.

  * *[ProgressPlugin](https://webpack.github.io/docs/list-of-plugins.html#progressplugin)*: Hook into the compiler to extract progress information. The handler must have the signature function(percentage, message). It's called with 0 <= percentage <= 1. percentage == 0 indicates the start. percentage == 1 indicates the end.

```javascript

var config = {   
  .........
  // omitted above code for clarity    
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ProgressPlugin(function(percentage, msg) {
      console.log((percentage * 100) + '%', msg);
    }),
    new ExtractTextPlugin('[name].css')
  ],
```

 * In the end, we will adding 'resolve' option to tell webpack what are file extensions it need to support. This allows you to create React components with file extension '.jsx'

```javascript

 var config = {
   .........
   // omitted above code for clarity
   resolve: {
    // Allow to omit extensions when requiring these files
    extensions: ["", ".js", ".jsx"],
  }
 }
```

 complete code for webpack.config.js will look like :

```javascript
require('babel-polyfill');
var fs = require('fs');
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var mainPath = path.resolve(__dirname, 'src', 'main.js');
var publicPath = path.resolve(__dirname, 'public');

var config = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: [
      // configuration for babel6
      'babel-polyfill',
      'webpack-hot-middleware/client?http://localhost:9000/__webpack_hmr',
      // example for single entry point. Multiple Entry bundle example will be added later
      './src/js/main.js'
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'public'),
    publicPath: '/public/'
  },
  module: {
    preLoaders: [{
      test: /\.jsx$|\.js$/,
      loader: 'eslint-loader',
      include: __dirname + '/src/'
    }],
    loaders: [{
      test: /\.jsx?$/,
      include: path.join(__dirname, 'src'),
      loader: "babel-loader",
      exclude: [nodeModulesPath]
    }, {
      test: /\.scss$/,
      include: path.join(__dirname, 'src'),
      loader: ExtractTextPlugin.extract('style-loader', 'css!autoprefixer-loader?browsers=last 2 version!sass')
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProgressPlugin(function(percentage, msg) {
      console.log((percentage * 100) + '%', msg);
    }),
    new ExtractTextPlugin('[name].css')
  ],
  resolve: {
    // Allow to omit extensions when requiring these files
    extensions: ["", ".js", ".jsx"],
  }
}

module.exports = config;
```

12.) *React* and *ReactDOM* - As we will be using React to demonstrate this example. Install React and ReactDOM

```bash

npm install react react-dom --save
```

13.) Add code to *'./src/js/main.js'* to demonstrate example :

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import MyComponent from './MyComponent';

// load the stylesheet
require('../styles/main.scss');

ReactDOM.render(
  <MyComponent />, document.getElementById('main')
);
```

14.) Add code to *'./src/js/MyComponent.jsx'* to demonstrate react example:

```javascript

import React, { Component } from 'react';

export default class MyComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="title"> This title coming from React Component !!!</div>
    );
  }
}
```

15.) Add code to *'./src/styles/main.scss'* file ( just for our example )

```css
.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  padding-top: 0;
  letter-spacing: 0;
  font-size: 24px;
  font-weight: 400;
  color: #126C77;
  line-height: 64px;
  box-flex: 1;
  flex: 1;
}
```

16.) open *package.json* file and following script tag :

```javascript

"scripts": {
  "start": "node server.js"
},
```

Pheww !!! We are all set, now open a terminal and run below script

```bash
npm start
```

open your fav browser (NO IE 8,9, 10) and go to *[http://localhost:9000](http://localhost:9000)*

*** Find an issue. Please log *[here](https://github.com/abhijeetNmishra/webpack-step-by-step/issues)*.

Thanks for reading this tutorial.

 - [Abhijeet Mishra](https://github.com/abhijeetNmishra)
