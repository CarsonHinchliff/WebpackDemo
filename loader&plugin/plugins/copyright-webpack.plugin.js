class CopyrightWebpackPlugin{
    constructor(options){
        //console.log(options);
    }

    apply(compiler){
        //console.log(compiler);
        //sync usage with no cb
        compiler.hooks.emit.tap("CopyrightWebpackPlugin",
        (compilation, cb) => {// cb will be undefined here
            console.log("compilation: ", compilation, "cb: ", cb);
        });
        //async usage with cb
        compiler.hooks.emit.tapAsync("CopyrightWebpackPlugin",
         (compilation, cb) => {
            compilation.assets[`copyright.txt`] = {
                source: function(){
                    return "hello copy right";
                },
                size: function(){
                    return 1024;
                }
            };
            cb();//must call cb here
        });
    }
}

module.exports = CopyrightWebpackPlugin;