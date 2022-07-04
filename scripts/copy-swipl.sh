#!/bin/bash
[ -f "./temp/binary/swipl" ] && rm -f ./temp/binary/swipl

SWIPL_BIN=`which swipl`
SWIPL_BIN_DIR=`dirname $SWIPL_BIN`
SWIPL_MAIN_DIR=`dirname $SWIPL_BIN_DIR`

cp $SWIPL_BIN ./temp/binary/ 
echo "Copied swipl binary to temp/binary"

cp -r $SWIPL_MAIN_DIR/lib ./temp
echo "Copied swipl lib dir to temp"

#cp -r $SWIPL_MAIN_DIR/share ./temp
#echo "Copied swipl share dir to temp"