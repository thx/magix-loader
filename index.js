let combine = require('magix-combine');
let loaderUtils = require('loader-utils');
let fs = require('fs');
let magixViewReg = /(?:mx|data)-view\s*=\s*\\?("[^"]*"|'[^']*'|[^'">\s]*)/g

let depsCache = Object.create(null);

combine.config({
    loaderType: 'webpack',
    log: false
});

// 分析页面中有哪些view
var collectViews = function(pageHtml) {
    var results = [],
        match, basename
    while (match = magixViewReg.exec(pageHtml)) {
        basename = match[1].replace(/'|"|\\/g, '')
        basename = basename.split('?')[0] // 兼容view带参数的写法
        results.push(basename)
    }
    return results
}

function analyzeViews(htmls) {
    htmls = Array.isArray(htmls) ? htmls : [htmls]
    let analyzeText = ''
    htmls.forEach(function(html) {
        analyzeText += fs.readFileSync(html)
    })
    return collectViews(analyzeText)
}


module.exports = function(content) {
    let context = this;
    let options = loaderUtils.getOptions(context) || {};
    let addViewRequire = options.addViewRequire
    let addViewAnalyze = options.addViewAnalyze
    combine.config(options);
    context.cacheable();
    let cb = context.async();
    combine.processContent(context.resourcePath, '', content, true).then(e => {
        // console.log('e.tmplMxViews')
        // console.log(e.tmplMxViewsArray)
        depsCache[context.resourcePath] = [];
        for (let p in e.fileDeps) {
            depsCache[context.resourcePath].push(p);
            context.addDependency(p);
        }
        if (options.noNeedAddViewAnalyze === true) {
            cb(null, e.content);
            return
        }
        let requireArrays = e.tmplMxViewsArray || []
        let newRequireArray = []
        // 针对资源文件，可以追加需要分析的文件
        if (addViewAnalyze) {
            let etHtmls = addViewAnalyze(context.resourcePath, e) || []
            newRequireArray = analyzeViews(etHtmls)
        }

        requireArrays = requireArrays.concat(newRequireArray)
        // 针对内容可以额外追加依赖
        if (addViewRequire) {
            requireArrays = requireArrays.concat(addViewRequire(e.content, e) || [])
        }
        
        let requirePromiseArray = []

        requireArrays.forEach(function(element) {
          
          let resultPromise = new Promise(function(resolve, reject) {
            // 针对cell组件的写法做一个特殊处理
            let pathName = element
            if (/@ali\/cell/.test(pathName)){
              pathName = pathName.replace(/\@\d+\.\d+\.\d+/, '')
            }
            context.resolve(context.context, pathName, function(error,result){
              // 无法找到目标路径的不要添加，不然直接报错了
              if(!result){
                resolve()
                return
              }
              // 不需要重复添加
              // 先看有没有写 require('xxxxx')
              let currentRequireReg = new RegExp('require\\([\"|\']' + element + '[\"|\']\\)')
              if(!currentRequireReg.test(e.content)){
                e.content = 'require("' + element + '");\n' + e.content
              }
              // 再看有没有加addView，没加就补上
              if(!new RegExp('Magix.addView\\([\"|\']'+element+'[\"|\']').test(e.content)){
                e.content = e.content.replace(currentRequireReg,'Magix.addView("'+element+'",require("' + element + '"));')
              }
              resolve()
            })
          })
          requirePromiseArray.push(resultPromise)
        })

        Promise.all(requirePromiseArray).then(function() {
          cb(null, e.content)
        })
    }, err => { //增加的代码
        let deps = depsCache[context.resourcePath];
        if (deps) {
            deps.forEach(d => {
                context.addDependency(d);
            });
        }
        cb(err);
    });
};