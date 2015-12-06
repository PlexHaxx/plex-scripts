#! /media/35a8/home/londonfire93/bin/node


var filepath = '/media/35a8/home/londonfire93/private/deluge/watch/';
var minrt = 5.2;
var minsz = 0.8;
var maxsz = 4.5;
var logpath = '/media/35a8/home/londonfire93/private/deluge/Scripts/movie_log.txt';


//var filepath = 'watch/'
//var logpath = 'movie_log.txt';
var tokenurl = 'https://torrentapi.org/pubapi_v2.php?get_token=get_token';
var movieurl = 'https://torrentapi.org/pubapi_v2.php?mode=search&format=json_extended&category=movies&token='

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



function download(url, fname) {
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

	fs.writeFileSync(filepath + filename, content);
	fs.appendFileSync(logpath,  filename + '\r\n');
}

function dumpMagnetData(data) {
	console.log(data.torrent_results);
	var resl = data.torrent_results;
	
	for(var i=0;i<resl.length;i++) {
		var size = resl[i].size / 1024 / 1024 / 1024; 
		if (resl[i].title.match('[^\d]+1080p[^\d]+') && size >= minsz && size <= maxsz) {
			dumpMagnetFile(resl[i].title + '.magnet', resl[i].download);
		}
	}
}


function useToken(tokdata) {
	getData(movieurl + tokdata.token, dumpMagnetData);
}


getData(tokenurl, useToken);