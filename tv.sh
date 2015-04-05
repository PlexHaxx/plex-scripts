#!/bin/bash

LOGTO=/media/35a8/home/londonfire93/private/deluge/Scripts/logs/log.txt
# OUTPATH=/media/35a8/home/londonfire93/private/deluge/sorted/$(basename "$TVPATH")
LOCKFILE=/media/35a8/home/londonfire93/private/deluge/lock.tv

if [ -e ${LOCKFILE} ] && kill -0 `cat ${LOCKFILE}`; then
    echo "already running"
    exit
fi

# make sure the lockfile is removed when we exit and then claim it
trap "rm -f ${LOCKFILE}; exit" INT TERM EXIT
echo $$ > ${LOCKFILE}

# Process Files 
(cat /media/35a8/home/londonfire93/private/deluge/lists/tv.list; echo) | while IFS=',' read -r TVPATH TVFOLDER OUTPATH
do
echo "$TVPATH $TVFOLDER $OUTPATH"

	if [[ "$TVPATH/$TVFOLDER/" == *completed* ]]; then

		echo "Processing $(date) $TVPATH/$TVFOLDER" >> ${LOGTO}

		find "$TVPATH/$TVFOLDER" -name "*.rar" -exec 7z x "{}" -y -o"$TVPATH" \;

		mkdir -p  "${OUTPATH}"
 
		find "$TVPATH" -type f \( -iname \*.mkv -o -iname \*.mp4 -o -iname \*.avi \) -exec mv "{}" "${OUTPATH}" \;
 
		rm -rf "$TVPATH/$TVFOLDER"
 
		echo "Done  $(date) $TVPATH/$TVFOLDER" >>  ${LOGTO}

	fi
done 

# Remove Lockfile
rm -f ${LOCKFILE}