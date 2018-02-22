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
                progressBar.alterClass('hidden','visible');
                message.text('Downloading update');
                response.pipe(file);
                response.on('data', function(data) {
                      progress(100-(((fsize-file.bytesWritten)/fsize)*100), progressBar);
                });
                response.on('end', function() {
                      file.end();
                      progress(100, progressBar);
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

function progress(percent, progressBar) {
    progressBar.children('.meter').css( "width", parseInt(percent)+"%" );
    progressBar.attr("data-percent", Math.floor(percent).toString()); 
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