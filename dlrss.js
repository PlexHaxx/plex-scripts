#! /media/35a8/home/londonfire93/bin/node


var path = '/media/35a8/home/londonfire93/private/deluge/watch/';
var minrt = 5.2
var logpath = '/media/35a8/home/londonfire93/private/deluge/Scripts/movie_log.txt';

var rss = require('./node-rss');
var fs = require('fs');
var http = require('http');

var log = [];


if (!fs.existsSync(logpath)) {
    fs.openSync(logpath, 'w')
} else {
    log = fs.readFileSync(logpath).toString().split("\r\n");
}




function download(enclosure) {
    var fname = path + enclosure.match('.*\/([^\/]+?)(\\?.*)?$')[1];
    
    var file = fs.createWriteStream(fname);

    var request = http.get(enclosure, function(response) {
        response.pipe(file);
    }).on('error', function(err) { // Handle errors
        fs.unlink(fname); // Delete the file async. (But we don't check the result)
        console.info(err.message);
    });;

    return request;
}


var response = rss.parseURL('https://yts.to/rss', function(articles) {

    for(i=0; i<articles.length; i++) {
        var art = articles[i];
        var fnm = art.enclosure.match('.*\/([^\/]+?)(\\?.*)?$')[1];

        if (log.indexOf(fnm) >= 0) 
            continue;

        var matches = art.description.match('\\s*IMDB[^\\d]*(\\d+)\\.?(\\d+)?([^\\d\\.]|$)');

        if (matches) {
            var num = 10 * parseInt(matches[1] | '0', 10) + parseInt(matches[2] | '0', 10); //parseFloat glitchy

            if (num > minrt * 10 && art.description.match('[^\d]+1080p[^\d]+')) { //rating > min, 1080p
                console.log(fnm);
                fs.appendFileSync(logpath,  fnm + '\r\n');
                
                download(art.enclosure);
            }
        }
    }

});
