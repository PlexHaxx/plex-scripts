#! /media/35a8/home/londonfire93/bin/node


var path = '/media/35a8/home/londonfire93/private/deluge/watch/';
var minrt = 5.2
var minres = 1080;
var logpath = '/media/35a8/home/londonfire93/private/deluge/Scripts/movie_log.txt';


//var path = 'watch/'
//var logpath = 'movie_log.txt';
var rssurl = 'https://www.ilovetorrents.me/rss.php?feed=dl&cat=41&passkey=52cae4c812dbff0beb371f3b7d35fc92';

var rss = require('./node-rss');
var fs = require('fs');
var u = require('url');

var log = [];


if (!fs.existsSync(logpath)) {
    fs.openSync(logpath, 'w')
} else {
    log = fs.readFileSync(logpath).toString().split("\r\n");
}




function download(enclosure) {
    var fname = path + enclosure.match('.*\/([^\/]+?)(\\?.*)?$')[1];
    
    var file = fs.createWriteStream(fname);
    var parts = u.parse(enclosure);

    
    var request = require(parts.protocol.split(/:/)[0]).get(enclosure, function(response) {
        response.pipe(file);
    }).on('error', function(err) { // Handle errors
        fs.unlink(fname); // Delete the file async. (But we don't check the result)
        console.info(err.message);
    });;

    return request;
}

var response = rss.parseURL(rssurl, function(articles) {

    for(i=0; i<articles.length; i++) {
        var art = articles[i];
        
        if (!art.description || !art.link)
        	continue;
        	
        var fnm = art.link.match(/.*\/([^\/]+?)(\?.*)?$/)[1];

        if (log.indexOf(fnm) >= 0) 
            continue;
        
        var rmatch = art.description.match(/\s*(resolution|size)[\s.:-]+(\d+)\s*([x\*])\s*(\d+)([\sp#@]|$)/i);
        var fmatch = art.link.match(/[^\d]+1080p[^\d]+/i);
        
	    if (rmatch && parseInt(rmatch[4] | '0', 10) < minres)
        	rmatch = null;
        
        
        if (!rmatch && !fmatch)
        	continue;
        
        var rmatch = art.description.match(/\s*(rating|imdb)[\s.:-]+(\d+)\.(\d+)([\s\/|]|$)/i);
		
		if (!rmatch || parseInt(rmatch[2] | '0', 10) + parseInt(rmatch[3] | '0', 10) / 10 < minrt)
			continue;
        
        
        var fmatch = art.link.match(/(DVD[\s-]*RIP|WEB[\s-]*RIP|BD[\s-]*RIP)/i);
        
	    if (!fmatch)
        	continue;
       /* 
		console.log("---------------------------------------------------");
        console.log(art.link);
        console.log(fnm);
        console.log(art.description);*/
        
        
        console.log(fnm);
        
        download(art.link);
        fs.appendFileSync(logpath,  fnm + '\r\n');
                
        
    }

});
