var fs = require('fs');
var os = require('os');
var path = require('path');

const selfPath = path.dirname(process.execPath);

const App = {
  id: nw.App.manifest.name,
  name: nw.App.manifest.description,
  version: nw.App.manifest.version,
  path: {
    self: selfPath,
    package: selfPath+'\\package',
    lib: selfPath+'\\package\\lib\\node_modules', 
    dll: selfPath+'\\package\\dll',
    bin: selfPath+'\\package\\bin',
    l10n: selfPath+'\\package\\l10n',
    resources: selfPath+'\\package\\resources',
    selfData: nw.App.dataPath
  }
}

const sys = {
  path: {
     temp: os.tmpdir() || process.env.TEMP
  },
  info: {
   is64: os.arch() === 'x64' || process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432'),
  }
}