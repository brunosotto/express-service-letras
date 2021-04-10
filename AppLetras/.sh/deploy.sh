#!/bin/bash

T1=$(date +"%s")

GIT_URL=$1
GIT_URL_CHECK=$2
BRANCH=$3
ENV=$4
DEPLOY_PATH=$5
PORT=$6
SCRIPT=$7
CI_PORT=$8
PROJECT_ID=$9

echo "GIT_URL::: $GIT_URL"
echo "GIT_URL_CHECK::: $GIT_URL_CHECK"
echo "BRANCH::: $BRANCH"
echo "ENV::: $ENV"
echo "DEPLOY_PATH::: $DEPLOY_PATH"
echo "PORT::: $PORT"
echo "SCRIPT::: $SCRIPT"
echo "CI_PORT::: $CI_PORT"
echo "PROJECT_ID::: $PROJECT_ID"

TIMESTAMP=$(date +"%s")
WORK_DIR="/root/ci_workspace/$TIMESTAMP"
DEPLOY_BASE_PATH="/root/projects/"

date
echo "Iniciando"

# entra na pasta .sh
cd .sh

# check git http
STATUS_CODE=$(curl -o /dev/null --silent --head --write-out '%{http_code}\n' $GIT_URL_CHECK)
if [ "$STATUS_CODE" -ne 200 ] ; then
  echo "Testando o endereço do repositório foi recebido status $STATUS_CODE"
  echo "Http status 200 era esperado!"
  exit 1
fi

# check git branch
HAS_BRANCH=$(OP="hasBranch('$GIT_URL_CHECK', '$BRANCH')" node ci-util.js)
if [ "$HAS_BRANCH" -ne 1 ] ; then
  echo "O repositório não tem a branch $BRANCH"
  exit 1
fi

# git
chmod +x ./gti-clone.sh
sh ./git-clone.sh $WORK_DIR $GIT_URL $BRANCH

date
echo "Git concluído, verificando versão"

date
echo "Inicializado build"

# build
chmod +x ./build-$SCRIPT.sh
cmd="sh ./build-$SCRIPT.sh $WORK_DIR $DEPLOY_BASE_PATH $ENV $DEPLOY_PATH $PORT $CI_PORT $PROJECT_ID"
$cmd

# pega o status de retorno do build
status=$?

# sinaliza caso o build falhe
if [ "$status" -ne 0 ] ; then
  echo "O build falhou com status $status"
  exit $status
fi

date
echo "Finalizado build"

# apaga a pasta de trabalho
rm $WORK_DIR -R

date
echo "Terminou"

T2=$(date +"%s")

Tempo=$(OP="calculaTempo($T1, $T2)" node ci-util.js)
echo "Deploy concluído em $Tempo"

: <<'END'
END
