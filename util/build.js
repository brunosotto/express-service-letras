const fs = require('fs-extra');
const childProcess = require('child_process');
const buildPackage = require('./buildPackage')();

console.log('iniciando o build...');

// remove current build, and create new one
fs.removeSync('./dist/');
fs.copySync('./src/public', './dist/public');
fs.copySync('./angular-controller', './dist/public');
fs.copySync('./src/views', './dist/views');

const sh = childProcess.exec('tsc --build --extendedDiagnostics tsconfig.prod.json');

sh.stdout.on('data', (data) => {
  console.log(data);
});

sh.stderr.on('data', (data) => {
  console.log('ERROR:');
  console.log(data);
});

sh.on('close', (code) => {
  console.log('transpile concluído');

  // copia o .sh
  fs.copySync('./.sh', './dist/.sh');
  console.log('Cópia do .sh para a dist');

  // package dist
  console.log('buildPackage');
  buildPackage.exec();
  console.log('buildPackage concluído');

  console.log(`Processo concluído com código ${code}`);
});
