#!/usr/bin/env bash

# Description: Exports a database backup in zip format
# Usage: root/scripts/dbdump.sh <database_name> <backup_name> <output_dir>
# by default, <database_name> is 'kalzate', <backup_name> is 'kalzate_database_%d_%m_%Y.bak.zip' and <output_dir> is the current working directory where this script is executed from

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

DATABASE_NAME=$1
if [ -z "${DATABASE_NAME}" ]; then
	DATABASE_NAME='kalzate'
fi

BACKUP_FILE_NAME=$2
if [ -z "${BACKUP_FILE_NAME}" ]; then
	BACKUP_FILE_NAME="kalzate_database_$(date +"%d_%m_%Y").bak.zip"
fi

OUTPUT_DIR=$3
if [ -z "${OUTPUT_DIR}" ]; then
	OUTPUT_DIR=```pwd```
fi

# Add ending slash if not present
case "$OUTPUT_DIR" in
*/)
    OUTPUT_DIR=$OUTPUT_DIR
    ;;
*)
    OUTPUT_DIR="$OUTPUT_DIR/"
    ;;
esac

FULL_PATH="$OUTPUT_DIR$BACKUP_FILE_NAME"

echo "Database name: $DATABASE_NAME"
echo "Exporting database backup file: $FULL_PATH"

cd $OUTPUT_DIR
mongodump --db $DATABASE_NAME

if [ $? -eq 0 ]; then
   echo "Data exported from database '$DATABASE_NAME'"
else
   echo >&2 "ERROR: mongodump could not dump database '$DATABASE_NAME'"
   rm -rf 'dump'
   exit -1
fi

#echo "dumping made, now zipping ... " "$_basefolder"dump/"$_database"
zip -DTjr9 $FULL_PATH 'dump'
rm -rf 'dump'

if [ $? -eq 0 ]; then
   echo "Backup generated successfully: $FULL_PATH"
else
   echo >&2 "ERROR: zip could not generate backup zip file into dir $FULL_PATH"
   exit -1
fi

#find "$_basefolder"dump/"$_database" -path '*/.*' -prune -o -type f -print | zip "$_zipfile" -@
#send to pendrive or email
#node "$_basefolder"emit_db.js "$_zipfile"