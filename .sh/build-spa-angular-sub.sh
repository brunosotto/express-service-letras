#!/bin/bash

WORK_DIR=$1
DEPLOY_BASE_PATH=$2
ENV=$3
D_PATH=$4

DEPLOY_PATH="$DEPLOY_BASE_PATH/$ENV/$D_PATH/"
PACKAGE_NAME=$(OP="getPackageName()" node ci-util.js)

echo "Package:: $PACKAGE_NAME"
echo "Env:: $ENV"

# vai para a pasta de trabalho
cd $WORK_DIR

# executa instalação e construção
npm install --verbose
npm run build

echo "----------------------- LS -----------------------"
ls
echo "----------------------- LS -----------------------"

# apaga a pasta de destino e move a dist para lá
mkdir $DEPLOY_PATH -p
rm -R $DEPLOY_PATH
mv dist $DEPLOY_PATH

echo "terminou"
