#!/bin/bash
SCRIPT_BASE="$( cd -P "$( dirname "$0" )" && pwd )"
RENDERED_DIR=${SCRIPT_BASE}/rendered
echo "Creating directories"
sudo mkdir /var/log/bellboy
rm -rf ${RENDERED_DIR}/*
cd ${SCRIPT_BASE}

#TODO: Check and warn about hubot conf + soundservice conf
echo "Installing projects dependencies"

npm i

cd ${SCRIPT_BASE}/..
PROJECTS=`find $PWD -type d -maxdepth 1 | egrep -v ".git$" | egrep -v broker | egrep -v "bellboy\$" | egrep -v "services\$"`
PROJECTS_STR=""
for PROJECT in $PROJECTS; do
    PROJECTS_STR="${PROJECT} ${PROJECTS_STR}"
    cd ${PROJECT}
    npm i
done
cd ${SCRIPT_BASE}/

echo "Generating init.d scripts"

node ${SCRIPT_BASE}/index.js ${PROJECTS_STR}

echo "Installing init.d scripts"

for INIT_D_SCRIPT in `ls ${RENDERED_DIR}`;do 
    sudo cp ${RENDERED_DIR}/${INIT_D_SCRIPT} /etc/init.d/${INIT_D_SCRIPT}
    sudo chmod 755 /etc/init.d/${INIT_D_SCRIPT}
    sudo update-rc.d ${INIT_D_SCRIPT} defaults
    sudo ${INIT_D_SCRIPT} start
done

echo "Donez"
