# magix-loader [![Version Number](https://img.shields.io/npm/v/magix-loader.svg)](https://github.com/thx/magix-loader/ "Version Number") [![THX Team](https://img.shields.io/badge/team-THX-green.svg)](https://thx.github.io/ "THX Team") [![License](https://img.shields.io/badge/license-MIT-orange.svg)](https://opensource.org/licenses/MIT "License") [![download](https://img.shields.io/npm/dm/magix-loader.svg)](https://www.npmjs.com/package/magix-loader)
webpack loader

# examples

```js
module.exports = {
    entry: './app/index.js', //默认，可覆盖
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test:/\.(?:mx|js)$/, // js or mx 后缀
                loader:'magix'
            }
        ]
    },
    resolve: {
      alias: {
        "$$": require.resolve('zepto'),    // var $ = require('$')
      }
    }
};
```