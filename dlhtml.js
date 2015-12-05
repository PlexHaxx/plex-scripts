#! /media/35a8/home/londonfire93/bin/node


var path = '/media/35a8/home/londonfire93/private/deluge/watch/';
var minrt = 5.2;
var minsz = 0.8;
var maxsz = 4.5;
var logpath = '/media/35a8/home/londonfire93/private/deluge/Scripts/movie_log.txt';


//var path = 'watch/'
//var logpath = 'movie_log.txt';
var rssurl = 'https://rarbg.to/torrents.php?search=&category%5B%5D=44';

var fs = require('fs');
var u = require('url');

var log = [];


if (!fs.existsSync(logpath)) {
    fs.openSync(logpath, 'w')
} else {
    log = fs.readFileSync(logpath).toString().split("\r\n");
}

function parseSubString(str) {
	var res = str.match(/href="(\/download\.php[^"]+?)"/);
	if (!res)
		return;
	
	download('https://rarbg.to' + res[1]);
}

function scheduleArray(a) {
    if (a.length == 0)
    	return;
    
    var nm = a.pop();
    
    console.log(nm);
    getData(nm, parseSubString);
    
    setTimeout(function() { scheduleArray(a); }, Math.random() * 5000 + 100);
}

function parseString(str) {
	var resl;
	var re = /class="lista2">(.*?)<\/tr>/g;
	var res = [];
	
	while ((resl = re.exec(str)) !== null) {
		var m = resl[0].match(/href="(\/torrent\/[^"]+?)"/)
		if (m && m[1].indexOf('#') < 0) {
			var m1 = resl[0].match(/IMDB: (\d+.\d+)\/10/i);
			if (m1) {
				var rt = parseFloat(m1[1]);
				if (rt > minrt) {
					m1 = resl[0].match(/class="lista">(\d+.\d+)\s*GB<\/td>/i);
					if (m1) {
						var rs = parseFloat(m1[1]);
						if (rs > minsz && rs < maxsz) {
							console.log("Rating: " + rt + " Size: " + rs + "GB");
							res.push('https://rarbg.to' + m[1]);
						}
					}
				}
			}
		}
	}
	
	setTimeout(function() { scheduleArray(res); }, 1000);
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
    	headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246', 'Cookie': 'LastVisit=' + Math.round(new Date().getTime() /1000 - 1720).toString() + '; 7fAY799j=VtdTzG69; expla=1; tcc'},
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
	            cb(body);
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



function download(url) {
    var f = url.match(/=([^=]+\.torrent)/)[1];
    
	if (log.indexOf(f) >= 0) 
    	return;

    var fname = path + f;
    
    console.log(f);
    
    var file = fs.createWriteStream(fname);
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


    var options = {
        hostname: parts.hostname,
        port: parts.port,
        path: parts.pathname,
    	headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246', 'Cookie': 'LastVisit=' + Math.round(new Date().getTime() /1000 - 1720).toString() + '; 7fAY799j=VtdTzG69; expla=1; tcc'},
        method: 'GET',        
    };

    if (parts.search) {
    	options.path += parts.search;
    }
    
    console.log(url);

    var request = http.request(options, function(response) {
    	console.log(response.statusCode);
        response.pipe(file);
        fs.appendFileSync(logpath,  f + '\r\n');
    });

    request.end();    
}

getData(rssurl, parseString);