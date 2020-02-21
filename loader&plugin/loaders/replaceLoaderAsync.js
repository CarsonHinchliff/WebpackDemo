// a loader is just a non arrow function(for wrong this pointer)

module.exports = function(source){
    //1.simple usage
    // return source.replace("world", "kaikeba");
    //2.use parameter in configuration file
    // const name = this.query.name;
    // return source.replace("world", name);
    //3.use callback
    // const code = source.replace("world", this.query.name);
    // this.callback(null, code);//no return here
    //4.async usage
    const asyncCallback = this.async();
    setTimeout(() => {
        const code = source.replace("world", this.query.name);

        //console.log(this.query.name);
        asyncCallback(null, code);//usage is the same as this.callback
    }, 1000);
}