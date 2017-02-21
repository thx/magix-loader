var combine = require('magix-combine');
var loaderUtils = require('loader-utils');
combine.config({
    loaderType: 'webpack',
    disableMagixUpdater: true,
    log: false
});
module.exports = function(content) {
    var context = this;
    var options = loaderUtils.parseQuery(context.query);
    combine.config(options);
    context.cacheable();
    var cb = context.async();
    combine.processContent(context.resourcePath, '', content, true).then(function(e) {
        for (var p in e.fileDeps) {
            context.addDependency(p);
        }
        cb(null, e.content);
    });
};