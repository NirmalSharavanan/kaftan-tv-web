#!/usr/bin/env bash

ROOT_PATH=/home/moorthi_sarav

echo "stop service"
sudo $ROOT_PATH/scripts/kavasam-service.sh stop

echo "pull latest code"
git -C $ROOT_PATH/code/muvi/ fetch --all
git -C $ROOT_PATH/code/muvi/ reset --hard origin/master

echo "compiling angular code"
npm install --prefix $ROOT_PATH/code/muvi/web/muvisite
npm run build --prefix $ROOT_PATH/code/muvi/web/muvisite

echo "copy angular code to spring boot"
cp -Rf $ROOT_PATH/code/muvi/web/muvisite/dist/* $ROOT_PATH/code/muvi/src/main/resources/public/

echo "compiling ss-core"
mvn install -f $ROOT_PATH/code/ss-core/

echo "compiling muvi"
mvn install -f $ROOT_PATH/code/muvi/

echo "copy jar co compile"
cp -Rf $ROOT_PATH/code/muvi/target/muvi-0.0.1-SNAPSHOT.jar $ROOT_PATH/deploy/

echo "start service"
sudo $ROOT_PATH/scripts/kavasam-service.sh start

echo "start service completed"