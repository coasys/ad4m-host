[ -f "./temp/binary/swipl" ] && rm ./temp/binary/swipl
cp `which swipl` ./temp/binary/ && echo "Copied swipl to temp/binary"