#!/bin/bash
nl=$'\n'
TOKEN=
USER=
if [[ "$3/$2/" == *completed* ]]; then

TYPE=TV_Show
   curl -s \
        -F "token=$TOKEN" \
        -F "user=$USER" \
        -F "message=$TYPE${nl}$2" \
        https://api.pushover.net/1/messages
fi

if [[ "$3/$2/" == *Movies_Temp* ]]; then

TYPE=Movie
   curl -s \
        -F "token=$TOKEN" \
        -F "user=$USER" \
        -F "message=$TYPE${nl}$2" \
        https://api.pushover.net/1/messages
fi

if [[ "$3/$2/" == *3D* ]]; then

TYPE=3D
   curl -s \
        -F "token=$TOKEN" \
        -F "user=$USER" \
        -F "message=$TYPE${nl}$2" \
        https://api.pushover.net/1/messages

fi
