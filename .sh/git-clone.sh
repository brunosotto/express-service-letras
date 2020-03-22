#!/bin/bash

# recebe as variáveis
WORK_DIR=$1
GIT_URL=$2
BRANCH=$3

date
echo "Iniciando Git clone"

# cria a pasta de trabalho
mkdir $WORK_DIR -p
cd $WORK_DIR

# clona
git clone $GIT_URL ./ --progress
git checkout $BRANCH --progress
git pull --progress

date
echo "Git clone ok"
