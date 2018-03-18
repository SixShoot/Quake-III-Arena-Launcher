function wget(file_url,destDir,callback, progressBar = false){
  
  var url = require('url');
  var http = require('http');
  
  var url_data = {
        host: url.parse(file_url).host,
        port: 80,
        path: url.parse(file_url).pathname
  };
    
  var file_name = url.parse(file_url).pathname.split('/').pop();

  mkdirp(destDir);

  var file = fs.createWriteStream(destDir+file_name);
  
  if (progressBar != false ) {
  
  var request = http.get(url_data, function (response) {
  
                var fsize = response.headers['content-length'];
                var startDownloadTime = Date.now();
                var elapsedTime = 0;
                var speed = [];
                var averageSpeed = 0;
                var previousElapsedTime = 0;
                progressBar.alterClass('hidden','visible');
                message.text('Downloading update');
                response.pipe(file);
                response.on('data', function(data) {
                      elapsedTime = Math.floor((Date.now() - startDownloadTime) / 1000);
                      if ( elapsedTime >= 1 ) {
                        var currentSpeed = Math.floor((file.bytesWritten / 1000) / elapsedTime);
                        speed.push(currentSpeed);
                      }
                      if ( elapsedTime >= 1 && speed.length >= 1 && elapsedTime == previousElapsedTime+1) { 
                        var sum = speed.reduce((a, b) => a + b, 0);
                        averageSpeed = Math.floor(sum / speed.length);
                        speed = [];
                      }
                      progress(Math.floor(100-(((fsize-file.bytesWritten)/fsize)*100)), averageSpeed, progressBar);
                      previousElapsedTime = elapsedTime;
                      
                });
                response.on('end', function() {
                      file.end();
                      progress(100, 0, progressBar);
                      callback(destDir+file_name);
                });
              });
   }
   else {
   
   var request = http.get(url_data, function (response) {
                response.pipe(file);
                response.on('end', function() {
                        file.end();
                        callback(destDir+file_name);
                });
              });
   
   }
}

function progress(percent, speed, progressBar) {
    progressBar.children('.meter').css( "width", parseInt(percent)+"%" );
    progressBar.attr("data-percent", percent.toString());
    progressBar.attr("data-speed",  speed.toString()); 
}

isDir = function(dpath) {
    try {
        return fs.lstatSync(dpath).isDirectory();
    } catch(e) {
        return false;
    }
};
mkdirp = function(dirname) {
    dirname = path.normalize(dirname).split(path.sep);
    dirname.forEach((sdir,index)=>{
        var pathInQuestion = dirname.slice(0,index+1).join(path.sep);
        if((!isDir(pathInQuestion)) && pathInQuestion) fs.mkdirSync(pathInQuestion);
    });
};