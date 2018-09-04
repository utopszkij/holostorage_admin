for i in *.js
	do
	if [ "$i" != "testFramework.js" ]
	then
		nodejs $i
	fi	
	if [ $? != 0 ]
	then
		exit 1
	fi
done
echo "      ********************"
echo "      *                  *"
echo "      * All test is OK   *"
echo "      *                  *" 
echo "      ********************"
exit 0