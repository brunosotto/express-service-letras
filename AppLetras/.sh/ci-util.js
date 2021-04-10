const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

function getPackageName() {
  // pega o path para acessar o arquivo
  const packagePath = path.resolve('package.json');

  // lê o json
  const packageJson = fs.readJSONSync(packagePath);

  console.log(packageJson.name);
}

function getVersionCode() {
  // pega o path para acessar o arquivo
  const packagePath = path.resolve('package.json');

  // lê o json
  const packageJson = fs.readJSONSync(packagePath);

  console.log(packageJson.version);
}

function pm2Ecosystem(origin, dest, name, PORT, NODE_ENV) {
  const pm2Eco = require(origin);

  // pega o app 0
  const app = pm2Eco.apps[0];

  // atribui valores
  app.name = name;
  app.env.PORT = PORT;
  app.env.NODE_ENV = NODE_ENV;

  // refaz o array
  pm2Eco.apps = [app];

  // grava o arquivo
  const prefix = 'module.exports = ';
  const data = prefix + JSON.stringify(pm2Eco, null, 2);
  fs.writeFileSync(dest, data);

  console.log('OK');
}

function upper(a) {
  console.log(a.toUpperCase());
}

function calculaTempo(ini, fin) {
  const inicial = parseInt(ini, 10);
  const final = parseInt(fin, 10);
  const tempo = final - inicial;

  mostraTempo(tempo);
}

function mostraTempo(seconds) {
  const minuto = 60;
  const minutoHora = 60;
  const hora = minutoHora * minuto;
  const horaDia = 24;
  const dia = horaDia * hora;
  const diaAno = 365.25;
  const ano = diaAno * dia; // foi compensado ano bissexto com ano tendo 365,25 dias
  const mesesAno = 12;
  const mes = ano / mesesAno; // foi dividido a quantidade de segundos do ano direto por 12 para não ter 2a12m

  let interval;
  let compl;

  interval = Math.floor(seconds / ano);
  if (interval >= 1) {
    compl = Math.floor((seconds % ano) / mes) || null;

    const b = compl ? `${compl}m` : '';

    console.log(`${interval}a${b}`);
    return;
  }

  interval = Math.floor(seconds / mes);
  if (interval >= 1) {
    compl = Math.floor((seconds % mes) / dia) || null;

    const b = compl ? `${compl}d` : '';

    console.log(`${interval}m${b}`);
    return;
  }

  interval = Math.floor(seconds / dia);
  if (interval >= 1) {
    compl = Math.floor((seconds % dia) / hora) || null;

    const b = compl ? `${compl}h` : '';

    console.log(`${interval}d${b}`);
    return;
  }

  interval = Math.floor(seconds / hora);
  if (interval >= 1) {
    compl = Math.floor((seconds % hora) / minuto) || null;

    const b = compl ? `${compl}min` : '';

    console.log(`${interval}h${b}`);
    return;
  }

  interval = Math.floor(seconds / minuto);
  if (interval >= 1) {
    compl = Math.floor(seconds % minuto) || null;

    const b = compl ? `${compl}s` : '';

    console.log(`${interval}min${b}`);
    return;
  }

  if (seconds >= 1) {
    console.log(`${seconds}s`);
    return;
  }

  console.log('agora');
}

function hasBranch(url, branch) {
  // usado pelo deploy, verifica se tem a branch no json passado do gir
  try {
    const command = 'curl ' + url;
    shell.exec(command, { silent: true }, (code, stdout, stderr) => {
      const json = JSON.parse(stdout);

      const found = json.find(b => b.name === branch);
      if (found) {
        console.log('1');
      } else {
        console.log('0');
      }
    });

    // curl('www.google.com', { VERBOSE: 1, RAW: 1 }, function (err) {
    //   console.info(this);
    // });

    // Request.get("http://httpbin.org/ip", (error, response, body) => {
    //   if (error) {
    //     console.log('FALSE');
    //   }

    //   json = JSON.parse(body);

    //   const found = json.find(b => b.name === branch);
    //   if (found) {
    //     console.log('TRUE');
    //   } else {
    //     console.log('FALSE');
    //   }
    // });
  } catch (e) {
    console.log('FALSE');
  }
}

function exec() {
  eval(process.env.OP);
}

exec();
