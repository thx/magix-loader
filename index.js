let combine = require('magix-combine');
let loaderUtils = require('loader-utils');
combine.config({
    loaderType: 'webpack',
    log: false
});
module.exports = function(content) {
    let context = this;
    let options = loaderUtils.getOptions(context) || {};
    combine.config(options);
    context.cacheable();
    let cb = context.async();
    combine.processContent(context.resourcePath, '', content, true).then((e) => {
        for (let p in e.fileDeps) {
            context.addDependency(p);
        }
        cb(null, e.content);
    }, (err) => { //增加的代码
        cb(err);
    });
};