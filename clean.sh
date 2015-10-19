#!/bin/bash
killall -9 -u londonfire93 deluged deluge-web
sleep 10
rm -rf /media/35a8/home/londonfire93/private/deluge/Scripts/logs/*
rm -rf /media/35a8/home/londonfire93/private/deluge/completed/*
rm -rf /media/35a8/home/londonfire93/private/deluge/movies_Comp/*
rm -rf /media/35a8/home/londonfire93/private/deluge/Movies_Temp/*
rm -rf /media/35a8/home/londonfire93/private/deluge/3D/*
rm -rf /media/35a8/home/londonfire93/private/deluge/3d_comp/*
rm -rf /media/35a8/home/londonfire93/private/deluge/lists/*
deluged
