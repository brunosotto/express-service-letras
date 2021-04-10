#!/bin/bash

# recebe os parâmetros
WORK_DIR=$1
DEPLOY_BASE_PATH=$2
ENV=$3
D_PATH=$4
PORT=$5
CI_PORT=$6
PROJECT_ID=$7

# guarda a pasta das ferramentas
TOOLS_DIR=$PWD

# vai para a pasta de trabalho
cd $WORK_DIR

# prepara os dados
PACKAGE_NAME=$(OP="getPackageName()" node $TOOLS_DIR/ci-util.js)
VERSION_CODE=$(OP="getVersionCode()" node $TOOLS_DIR/ci-util.js)
DEPLOY_PATH="$DEPLOY_BASE_PATH/$ENV/$D_PATH/"
PM2_NAME="$PACKAGE_NAME-$ENV-$PORT"
URL_CHECK_VERSION="http://127.0.0.1:$CI_PORT/api/run-deploy/can-build/$PROJECT_ID/$ENV/$VERSION_CODE"

# exibe os dados
echo "PACKAGE_NAME:==$PACKAGE_NAME:=="
echo "VERSION_CODE:==$VERSION_CODE:=="

# check version
STATUS_CODE=$(curl -o /dev/null --silent --head --write-out '%{http_code}\n' $URL_CHECK_VERSION)
if [ "$STATUS_CODE" -ne 200 ] ; then
  echo "A versão $VERSION_CODE já teve seu deploy anteriormente no ambiente selecionado"
  exit 1
fi

# executa instalação e construção
echo $PWD
npm install --verbose
npm install --only=dev --verbose # força instalar devdependencies
npm run build

echo "----------------------- LS -----------------------"
ls
echo "----------------------- LS -----------------------"

# gera o pm2-ecosystem.config.js
PM2_O="$WORK_DIR/pm2-ecosystem.config.js"
PM2_D="$WORK_DIR/dist/pm2-ecosystem.config.js"
echo "OP=\"pm2Ecosystem('$PM2_O', '$PM2_D', '$PM2_NAME', $PORT, '$ENV')\" node $TOOLS_DIR/ci-util.js"
PM2=$(OP="pm2Ecosystem('$PM2_O', '$PM2_D', '$PM2_NAME', $PORT, '$ENV')" node $TOOLS_DIR/ci-util.js)

# apaga a pasta de destino e move a dist para lá
mkdir $DEPLOY_PATH -p
rm -R $DEPLOY_PATH
mv dist $DEPLOY_PATH

# roda o npm install no destino
cd $DEPLOY_PATH
npm install --verbose

# deleta o projeto no pm2 e recria
pm2 delete $PM2_NAME
pm2 start pm2-ecosystem.config.js
pm2 save

echo "Terminou"
