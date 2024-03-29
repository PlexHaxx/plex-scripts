#!/bin/bash

CURRENT_PID=$(cat /media/35a8/home/londonfire93/.config/deluge/deluged.pid|sha1sum|cut -c 1-10)
MLOGTO=/media/35a8/home/londonfire93/private/deluge/Scripts/logs/log_movie.txt
MOUTPATH=/media/35a8/home/londonfire93/private/deluge/movies_comp/
MLOCKFILE=/media/35a8/home/londonfire93/private/deluge/lock.movie

if [ -e ${MLOCKFILE} ] && kill -0 "cat ${MLOCKFILE}"; then
    echo "already running"
    exit
fi

# make sure the MLOCKFILE is removed when we exit and then claim it
trap 'rm -f ${MLOCKFILE}; exit' INT TERM EXIT
echo $$ > ${MLOCKFILE}

# Process Files 
(cat /media/35a8/home/londonfire93/private/deluge/lists/movie.list; echo) | while IFS=',' read -r MOVIEPATH MOVIEFOLDER CREATION_PID
do
echo "$MOVIEPATH $MOVIEFOLDER $CREATION_PID"
	if [ "$CURRENT_PID" = "$CREATION_PID" ]; then
	    if [[ "$MOVIEPATH/$MOVIEFOLDER/" == *Movies_Temp* ]]; then
		find "$MOVIEPATH/$MOVIEFOLDER"  -type f -size -50M -exec rm "{}" \;
		find "$MOVIEPATH/$MOVIEFOLDER" -name "*.rar" -exec 7z x "{}" -y -o"$MOVIEPATH" \;
		mkdir -p  "${MOUTPATH}"
		find "$MOVIEPATH/$MOVIEFOLDER" -type f \( -iname \*.mkv -o -iname \*.mp4 -o -iname \*.avi \) -exec mv "{}" "${MOUTPATH}" \;
		rm -rf "${MOVIEPATH:?}/${MOVIEFOLDER:?}"
            fi
	else
	     echo "Skipping..."
	fi 
done 

# Remove MLOCKFILE
rm -f ${MLOCKFILE}
