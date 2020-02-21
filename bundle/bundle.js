const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

const findFilePath = filename => {
    if (/.js$|.ts$/.test(filename)) { return filename; }

    if (fs.existsSync(filename + ".js")){
        return filename + ".js";
    } else if (fs.existsSync(filename + ".ts")){
        return filename + ".ts";
    }

    return filename;
};

const entry = filename => {
    const content = fs.readFileSync(filename, "utf-8");
    // console.log(content);
    const ast = parser.parse(content, {
        sourceType: "module"
    });

    const deps = {};
    traverse(ast, {
        ImportDeclaration({ node }) {
            const dirname = path.dirname(filename);
            const newfile = findFilePath(path.join(__dirname, "src", node.source.value));
            deps[node.source.value] = newfile;
        }
    });
    
    //console.log(deps);    

    const {code} = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    });

    //console.log(code);

    return {
        filename,
        deps,
        code
    };
};

//entry("./src/index.js");

// const info = entry("./src/index.js");
// console.log(info);

const deepModule = filename => {
    const entryInfo = entry(filename);
    const deepModuleArry = [entryInfo];
    for (let i = 0; i < deepModuleArry.length; i++) {
      const item = deepModuleArry[i];
      const { deps } = item;
      if (deps) {
        for (let j in deps) {
          deepModuleArry.push(entry(deps[j]));
        }
      }
    }
    const graph = {};
    deepModuleArry.forEach(item => {
      graph[item.filename] = {
        deps: item.deps,
        code: item.code
      };
    });
    return graph;
  };
  
  const code = filename => {   
    const depsAll = JSON.stringify(deepModule(filename));
    console.log(depsAll);
    return `
      (function(depsAll){
          function require(module){
              function localRequire(relativePath){
                  return require(depsAll[module].deps[relativePath])
              }
              var exports = {};
              (function(require,exports,code){
                  eval(code)
              })(localRequire,exports,depsAll[module].code)
              return exports;
          }
          require('${filename}')
      })(${depsAll})
    `;
  };
  const info = code("./src/index.js");
  
  console.log(info);
  