var combine = require('magix-combine');
combine.config({
    loaderType: 'webpack'
});
module.exports = function(content) {
    this.cacheable();
    var cb = this.async();
    combine.processContent(this.resourcePath, '', content).then(function(c) {
        cb(null, c);
    });
};