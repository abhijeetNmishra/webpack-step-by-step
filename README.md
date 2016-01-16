# webpack-step-by-step
Simple step by step tutorial to setup webpack for dev and prod

[webpack](http://webpack.github.io/) is an awesome module bundler which came to the party a bit late after [gulp](http://gulpjs.com/) and [grunt](http://gruntjs.com/). It took me very less time get comfortable with both grunt and gulp and i used them both in separate projects. Both are doing their job great but when it comes to bundling, they need help from different plugins and lack some bundling features.

webpack was never easy for me to start with mainly because of its complex documentation ( and who reads entire documentation anyway ).

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

### [loaders](https://webpack.github.io/docs/loaders.html) -
Now we will be installing bunch of loaders to support multiple loading tasks.

brief explanation : Loaders allow you to preprocess files as you require() or "load" them. Loaders are kind of like "tasks" are in other build tools, and provide a powerful way to handle frontend build steps. Loaders can transform files from a different language like, CoffeeScript to JavaScript, or inline images as data URLs. Loaders even allow you to do things like require() css files right in your JavaScript!

4.) [babel-loader](https://www.npmjs.com/package/babel-loader) This package allows transpiling JavaScript files using Babel and webpack.

Here i am assuming, you will be writing your code using ES6 and have some idea on [babel](https://babeljs.io/) which is a compiler for writing next generation JavaScript. We will be doing our setup using babel6, which is its latest version and differs alot from its older versions.

Since babel-loader depends number of modules from babel, we will be installing all of them together. Make sure to read about them ..    a.) [babel-core](https://www.npmjs.com/package/babel-core)    b.) [babel-preset-es2015](https://www.npmjs.com/package/babel-preset-es2015) - Babel preset for all es2015 plugins    c.) [babel-preset-react](https://www.npmjs.com/package/babel-preset-react) - Babel preset for all React plugins. This one is only needed if you are using React as part of your project. As part of this tutorial, we will be showing example for both a React Component and a normal JS file.

```bash

npm install babel-loader babel-core babel-preset-es2015 babel-preset-react babel-preset-stage-0 --save-dev
```

5.) [eslint-loader](https://www.npmjs.com/package/eslint-loader) - This loader will help us to throw linting errors before bundling up your module.

Lets add [eslint](http://eslint.org/) configuration first to our project. At root directory add filename '.eslintrc' I will be extending [airbnb](https://github.com/airbnb) eslint configuration for this one, but it can be replaced with any customized config values:

Install esling-config-airbnb and eslint modules :

```bash

npm install eslint-config-airbnb eslint --save-dev
```

Add following code in .eslintrc :

```

{
  "extends": "airbnb",
  "ecmaFeatures": {

  },
  "globals": {

  }
}
```

Note: Your might need to add some global variables or extra features like 'experimentalObjectRestSpread' based on your code base.

```bash

npm install eslint-loader --save-dev
```

6.) style loaders - We will be using couple of loader/plugin to support css module system. you can import your styles using code like :

```
require('./styles/style.scss');
```

and through webpack, we can configure to either included as part of Javascript bundle itself, or load separately as '.css files.' I prefer loading .css files as separate modules loaded over the wire rather than injecting them in JS bundles.

We will be installing [autoprefixer-loader](https://www.npmjs.com/package/autoprefixer-loader), [css-loader](https://www.npmjs.com/package/css-loader), [sass-loader](https://www.npmjs.com/package/sass-loader), [style-loader](https://www.npmjs.com/package/style-loader)

```bash

npm install css-loader sass-loader node-sass style-loader autoprefixer-loader --save-dev
```

7.) Add babel configuration - Add .babelrc file at root level

Add presets to add required babel plugins to transpile our code :

```

{
  "presets": ["react", "es2015","stage-0"]
}
```

8.) [express](http://expressjs.com/) - Lets setup a express server at port 9000.

Note: Below mentioned steps are not required for webpack setup but gives some idea about a clean project setup.

```bash

npm install express --save
```

Add file 'server.js' at root directory. we will also be adding a babel file related to server which will read configuration from .babelrc and enable runtime transpilation to use ES6/7 in node.

Add server.babel.js at root directory and add below code ( which i believe is self-explanatory):

```

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

```

require('./server.babel');
var path = require('path');
var fs = require('fs');
var express = require('express');
var webpack = require('webpack');
```

===> add a check if its development or production environment as a global constant

```

global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
```

===> Load webpack config file based on environment. We will be adding webpack config files in next step

```

if (__DEVELOPMENT__) {
  var config = require('./webpack.config');
} else{
  var config = require('./webpack.prod.config');
}
```

===> Create Express server instance and configure with webpack

```

var app = express();
var compiler = webpack(config);
```

===> Hook our Express server with 'webpack-hot-middleware' and 'webpack-hot-middleware' only for development

```

if (__DEVELOPMENT__) {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}
```

===> Move this code to upper 'if' block

```

if (__DEVELOPMENT__) {
  var config = require('./webpack.config');
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
} else{
  var config = require('./webpack.prod.config');
}
```

===> Create http server and listen on port 9000

```

const server = new http.Server(app);

app.use((req, res) => {
  res.send('Express up and running !!');
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

===> add 'webpack.config.js' and 'webpack.prod.config.js' at root directory
