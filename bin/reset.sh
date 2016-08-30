#!/usr/bin/env bash

DATABASE_NAME=$1
if [ -z "${DATABASE_NAME}" ]; then
	DATABASE_NAME='kalzate'
fi

# Stop node server instance ?

# cleaning cache
echo "Cleaning Cache"
redis-cli flushall

# clear database if exists
echo "Dropping database '$DATABASE_NAME'"
mongo $DATABASE_NAME --eval "db.dropDatabase()"

# run server ?

# Exit 
if [ $? -eq 0 ]; then
   echo "Congrats, system was reset successfully. This is now as out of the box!"
   exit 0
fi

echo >&2 "mongo could not drop database '$DATABASE_NAME'"
exit -1
