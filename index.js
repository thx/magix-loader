var combine = require('magix-combine');
var query = require('querystring');
var NumReg = /^\d+$/;

combine.config({
    loaderType: 'webpack',
    disableMagixUpdater: true
});
module.exports = function(content) {
    var options = this.query;
    if (options) {
        try {
            options = JSON.parse(options.slice(1));
        } catch (e) {
            options = query.parse(options.slice(1));
        }
        for (var p in options) {
            var val = options[p];
            if (val === 'true') {
                options[p] = true;
            } else if (val === 'false') {
                options[p] = false;
            } else if (NumReg.test(val)) {
                options[p] = parseInt(val, 10);
            }
        }
        combine.config(options);
    }
    this.cacheable();
    var cb = this.async();
    combine.processContent(this.resourcePath, '', content).then(function(c) {
        cb(null, c);
    });
};