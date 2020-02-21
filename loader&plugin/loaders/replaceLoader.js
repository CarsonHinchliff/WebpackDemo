// a loader is just a non arrow function(for wrong this pointer)

module.exports = function(source){
    //1.simple usage
    return source.replace("kaikeba", "caine");
}