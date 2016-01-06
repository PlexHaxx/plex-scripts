#! /media/35a8/home/londonfire93/bin/node


var filepath = '/media/35a8/home/londonfire93/private/deluge/watch/';
var minrt = 5.2;//IMDB POINTS
var minsz = 0.8;//GIGABYTES !
var maxsz = 5.5;//GIGABYTES !
var logpath = '/media/35a8/home/londonfire93/private/deluge/Scripts/movie_log.txt';


//filepath = 'watch/'
//logpath = 'movie_log.txt';
var tokenurl = 'https://torrentapi.org/pubapi_v2.php?get_token=get_token';
var movieurl = 'https://torrentapi.org/pubapi_v2.php?mode=search&format=json_extended&category=movies&token='
var torurl = 'http://torcache.net/torrent/{0}.torrent'
var omdbapi = 'http://www.omdbapi.com/?plot=short&r=json&i='
	
var path = require('path');
var fs = require('fs');
var u = require('url');

var log = [];


if (!fs.existsSync(logpath)) {
    fs.openSync(logpath, 'w')
} else {
    log = fs.readFileSync(logpath).toString().split("\r\n");
}



function getData(url, cb) {
    var u = require('url');

    var parts = u.parse(url);
    
    var prot = parts.protocol.split(/:/)[0];
    http = require(prot);
    // set the default port to 80
    if(!parts.port) { 
    	if (prot == 'http')
    		parts.port = 80; 
    	else
    		parts.port = 443; 
    }

    var redirection_level = 0;


    var options = {
        hostname: parts.hostname,
        port: parts.port,
        path: parts.pathname,
    	headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'},
        method: 'GET',
        
    };


    if (parts.search) {
    	options.path += parts.search;
    }
    
	var body = '';   

    var request = http.request(options, function (response) {
		response.setEncoding("utf8");
		switch(response.statusCode) {
	        // check for ALL OK
	        case 200:
	        var body = ''; 
	        response.addListener('data', function (chunk) {
	            body += chunk;
	        });
	        response.addListener('end', function() {
	            cb(JSON.parse(body));
	        });
	        break;
	        // redirect status returned
	        case 301:
	        case 302:
	        if(redirection_level > 10) {
	            console.log("too many redirects");
	        }
	        else {
	            console.log("redirect to "+  response.headers.location);
	            getData(response.headers.location, cb);
	        }
	        break;
	        default:
        	break;
        }      
;
    });
    request.end();    
}



function downloadData(url, fname) {
    var u = require('url');

    var parts = u.parse(url);
    
    var prot = parts.protocol.split(/:/)[0];
    http = require(prot);
    // set the default port to 80
    if(!parts.port) { 
    	if (prot == 'http')
    		parts.port = 80; 
    	else
    		parts.port = 443; 
    }

    var redirection_level = 0;


    var options = {
        hostname: parts.hostname,
        port: parts.port,
        path: parts.pathname,
    	headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'},
        method: 'GET',
        
    };


    if (parts.search) {
    	options.path += parts.search;
    }
    
	var body = '';   

	var file = fs.createWriteStream(fname);
	
    var request = http.request(options, function (response) {
    	console.log(response.statusCode);
        response.pipe(file);
        fs.appendFileSync(logpath,  path.basename(fname) + '\r\n');
    });

    request.end();    
}

function dumpMagnetFile(filename, content) {
	if (log.indexOf(filename) >= 0) 
    	return;
    
    if (path.extname(filename) == '.magnet') {
		fs.writeFileSync(filepath + filename, content);
		fs.appendFileSync(logpath,  filename + '\r\n');
	} else {
		var mt = content.match('urn:btih:(.+?)([&]|$)');
		
		if (mt) {
			downloadData(torurl.replace(/\{0\}/, mt[1].toUpperCase()) , filepath + filename);
		}
	}
}

function scheduleArray(a){
	if (a.length == 0)
    	return;
    
    var nm = a.pop();
    
	if (nm.episode_info && nm.episode_info.imdb) {
		getData(omdbapi + nm.episode_info.imdb, function(xdata) {
			if (xdata.imdbRating && parseFloat(xdata.imdbRating) > minrt) {
				dumpMagnetFile(nm.title + '.torrent', nm.download);
			}
		});
	}
    
    
    setTimeout(function() { scheduleArray(a); }, 50);
}

function dumpMagnetData(data) {
	var resl = data.torrent_results;
	
	var resx = [];
	
	for(var i=0;i<resl.length;i++) {
		var size = resl[i].size / 1024 / 1024 / 1024; 
		if (resl[i].title.match('[^\d]+1080p[^\d]+') && size >= minsz && size <= maxsz) {
			//dumpMagnetFile(resl[i].title + '.torrent', resl[i].download);
			resx.push(resl[i]);
		}
	}
	
	
	scheduleArray(resx);
}


function useToken(tokdata) {
	getData(movieurl + tokdata.token, dumpMagnetData);
}


getData(tokenurl, useToken);