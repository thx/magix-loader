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
        rules: [{
            test:/\.(?:mx|js)$/, // js or mx 后缀
            include:[
                path.resolve(__dirname,'app')//只处理app目录
            ],
            use:[{
                loader:'magix-loader',
                options:{//编译器配置项，magix-loader 使用 magix-combine,这里是magix-combine的配置项 https://github.com/thx/magix-combine/issues/17
                    //compressCss:false
                }
            }]
        }]
    }
};
```