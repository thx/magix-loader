var combine = require('magix-combine');
var loaderUtils = require('loader-utils');
var fs = require('fs');
var path = require('path');
combine.config({
    loaderType: 'webpack',
    disableMagixUpdater: true
});
module.exports = function(content) {
    var options = loaderUtils.parseQuery(this.query);
    combine.config(options);
    this.cacheable();
    var cb = this.async();
    var file = this.resourcePath;
    var ext = path.extname(file);
    if (ext == '.js') {
        var temp = file.slice(0, -3);
        var html = temp + '.html';
        if (fs.existsSync(html)) {
            this.addDependency(html);
        }
        var css = temp + '.css';
        if (fs.existsSync(css)) {
            this.addDependency(css);
        }
        var less = temp + '.less';
        if (fs.existsSync(less)) {
            this.addDependency(less);
        }
        var scss = temp + '.scss';
        if (fs.existsSync(scss)) {
            this.addDependency(scss);
        }
    }
    combine.processContent(this.resourcePath, '', content).then(function(c) {
        cb(null, c);
    });
};