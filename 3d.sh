#!/bin/bash
#3D Miovie Processing 
DLOGTO=/media/35a8/home/londonfire93/private/deluge/Scripts/logs/log_3d.txt
DOUTPATH=/media/35a8/home/londonfire93/private/deluge/3d_comp/
DLOCKFILE=/media/35a8/home/londonfire93/private/deluge/lock.3D

if [ -e ${DLOCKFILE} ] && kill -0 `cat ${DLOCKFILE}`; then
    echo "already running"
    exit
fi

# make sure the DLOCKFILE is removed when we exit and then claim it
trap "rm -f ${DLOCKFILE}; exit" INT TERM EXIT
echo $$ > ${DLOCKFILE}

# Process Files 
(cat /media/35a8/home/londonfire93/private/deluge/lists/movie.list; echo) | while IFS=',' read -r DPATH DFOLDER
do
echo "$DPATH $DFOLDER"

	if [[ "$DPATH/$DFOLDER/" == *3D* ]]; then

		echo "Processing $(date) $DPATH/$DFOLDER" >> ${DLOGTO}

		#find "$DPATH/$DFOLDER" -name "*.rar" -exec 7z x "{}" -y -o"$DPATH" \;

		mkdir -p  "${DOUTPATH}"
 
		find "$DPATH" -type f \( -iname \*.mkv -o -iname \*.mp4 -o -iname \*.avi \) -exec mv "{}" "${DOUTPATH}" \;
 
		rm -rf "$DPATH/$DFOLDER"
 
		echo "Done  $(date) $DPATH/$DFOLDER" >>  ${DLOGTO}

	fi
done 

# Remove DLOCKFILE
rm -f ${DLOCKFILE}