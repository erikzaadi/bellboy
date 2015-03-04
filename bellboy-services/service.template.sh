#!/bin/bash
#/etc/init.d/{{name}}
### BEGIN INIT INFO
# Provides: {{name}}
# Required-Start:
# Required-Stop:
# Should-Start:
# Should-Stop:
# Default-Start: 2 3 4 5
# Default-Stop: 0 1 6
# Short-Description: {{name}}
# Description: {{description}}
### END INIT INFO

export PATH=$PATH:/usr/local/bin
export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules

FOREVER_EXEC={{{forever_exec}}}
SCRIPT_PATH={{{project_dir}}}/{{main}}
LOG_BASE_PATH=/var/log/bellboy/{{name}}

case "$1" in
    start)
        exec ${FOREVER_EXEC} -a --plain --spinSleepTime 1000 --minUptime 1000 -l ${LOG_BASE_PATH}.log -e ${LOG_BASE_PATH}.stderr.log -o ${LOG_BASE_PATH}.stdout.log start ${SCRIPT_PATH}
        ;;
    stop)
        exec ${FOREVER_EXEC} -a --plain stop ${SCRIPT_PATH}
        ;;
    status)
        AA=`${FOREVER_EXEC} list | grep ${SCRIPT_PATH}| egrep "STOPPED"  > /dev/null`
        if [[ $? -eq 0 ]]; then
            echo "{{name}} running"
        else
            echo "{{name}} not running"
            exit 1
        fi

        ;;
    *)
        echo "Usage: /etc/init.d/{{name}} {start|stop|status}"
        exit 1
        ;;
esac

exit 0
