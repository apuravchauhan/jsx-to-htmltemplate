/**
 * @author: Apurav Chauhan <apurav.chauhan@gmail | github/twitter: @apuravchauhan>
 */
const fs = require('fs');
const path = require('path');
const babel  = require("babel-core");
module.exports = {
  getComponentDir: (loc) => {
    if(path.isAbsolute(loc)){
      return loc;
    }else{
      return path.join(process.cwd(),loc);
    }
  },

  directoryExists: (filePath) => {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  },

  mkdirSyncRecursive: (directory)=>{
    if(!path.isAbsolute(directory)){
      directory= path.join(process.cwd(),directory);
    }
    var loc = directory.replace(/\/$/, '').split('/');
    for (var i = 1; i <= loc.length; i++) {
        var segment = loc.slice(0, i).join('/');
        if(segment!='')
          !fs.existsSync(segment) ? fs.mkdirSync(segment) : null ;
    }
  }
};