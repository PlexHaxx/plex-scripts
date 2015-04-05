#!/bin/bash

if [[ "$3/$2/" == *completed* ]]; then
OUTPATH=/media/35a8/home/londonfire93/private/deluge/sorted/$(basename "$3")
echo "$3,$2,$OUTPATH" >> /media/35a8/home/londonfire93/private/deluge/lists/tv.list

fi

if [[ "$3/$2/" == *Movies_Temp* ]]; then

echo "$3,$2" >> /media/35a8/home/londonfire93/private/deluge/lists/movie.list

fi

if [[ "$3/$2/" == *3D* ]]; then

echo "$3,$2" >> /media/35a8/home/londonfire93/private/deluge/lists/3d.list

fi
