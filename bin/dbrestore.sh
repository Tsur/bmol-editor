#!/usr/bin/env bash

# Description: Restores a database backup(generated with mongodump) to a database given
# Usage: root/scripts/dbrestore.sh <backup_zip> <dbname>
# by default, <dbname> is 'kalzate' and <backup_zip> is the 'backup.zip' file located at the current working directory where this script is executed from

ZIP_DATA=$1
if [ -z "${ZIP_DATA}" ]; then
	ZIP_DATA=```pwd```'/backup.zip'
fi

DATABASE_NAME=$2
if [ -z "${DATABASE_NAME}" ]; then
	DATABASE_NAME='kalzate'
fi

echo "Database name: $DATABASE_NAME"
echo "Database backup file: $ZIP_DATA"

# clear database if exists (check --drop mongorestore option which is safe)
# echo "Dropping database '$DATABASE_NAME'"
# mongo $DATABASE_NAME --eval "db.dropDatabase()"

# Generate a random dir where db data will be unzipped to
_BACKUP_TEMP_DIR=/tmp/backup_data_$RANDOM
mkdir $_BACKUP_TEMP_DIR

MKDIR_OUT=$?
if [ ! $MKDIR_OUT -eq 0 ]; then
   echo >&2 "ERROR: Could not create dir '$_BACKUP_TEMP_DIR'. Check permissions at /tmp"
   exit -1
fi

unzip $ZIP_DATA -d $_BACKUP_TEMP_DIR &> /dev/null

UNZIP_OUT=$?
if [ $UNZIP_OUT -eq 0 ]; then
   echo "Unzipped '$ZIP_DATA' to temporal dir '$_BACKUP_TEMP_DIR'"
else
   echo >&2 "ERROR: '$1' looks wrong!"
   rm -rf $_BACKUP_TEMP_DIR
   exit -1
fi

# Import data
command -v mongorestore >/dev/null 2>&1 || { echo >&2 "ERROR: mongorestore is required but it's not installed or cannot find it in current PATH"; exit 1; }

echo "Restoring database '$DATABASE_NAME'"
mongorestore --drop --db $DATABASE_NAME $_BACKUP_TEMP_DIR
MONGO_RESTORE_OUT=$?

# Cleaning up temporal dir
echo "Cleaning up ..."
rm -rf $_BACKUP_TEMP_DIR

# Exit 
if [ $MONGO_RESTORE_OUT -eq 0 ]; then
   echo "Database restored succesfully"
else
   echo >&2 "Oh no!, something was wrong with mongorestore command. Is it installed? returned a wrong status $MONGO_RESTORE_OUT"
fi

exit 0

