function versionCompare(ourVersion,remoteVersion){

                    if (ourVersion[2] < remoteVersion[2]) { return true; }
                    else if (ourVersion[2] == remoteVersion[2]) { 
                          
                          if (ourVersion[1] < remoteVersion[1]) { return true; }
                          else if (ourVersion[1] == remoteVersion[1]) { 
                          
                                if (ourVersion[0] < remoteVersion[0]) { return true; }
                                else { return false; } 
                          }
                          else { return false; } 
                    }
                    else { return false; }
}

function formatNumber(n){
    var result = n > 9 ? "" + n: "0" + n;
    return result.toString();
}

function monthToNumber(month){
                    switch (month) {
                          case 'Jan':
                                  result = 1;  
                          break;
                          case 'Feb':
                                  result = 2;  
                          break;
                          case 'Mar':
                                  result = 3;  
                          break;
                          case 'Apr':
                                  result = 4;  
                          break;
                          case 'May':
                                  result = 5;  
                          break;
                          case 'Jun':
                                  result = 6;  
                          break;
                          case 'Jul':
                                  result = 7;  
                          break;
                          case 'Aug':
                                  result = 8;  
                          break;
                          case 'Sep':
                                  result = 9;  
                          break;
                          case 'Oct':
                                  result = 10;  
                          break;
                          case 'Nov':
                                  result = 11;  
                          break;
                          case 'Dec':
                                  result = 12;  
                          break;
                    }
                    return result;
}

function numberToMonth(n){
                    switch (n) {
                          case 1:
                                  result = 'Jan';  
                          break;
                          case 2:
                                  result = 'Feb';  
                          break;
                          case 3:
                                  result = 'Mar';  
                          break;
                          case 4:
                                  result = 'Apr';  
                          break;
                          case 5:
                                  result = 'May';  
                          break;
                          case 6:
                                  result = 'Jun';  
                          break;
                          case 7:
                                  result = 'Jul';  
                          break;
                          case 8:
                                  result = 'Aug';  
                          break;
                          case 9:
                                  result = 'Sep';  
                          break;
                          case 10:
                                  result = 'Oct';  
                          break;
                          case 11:
                                  result = 'Nov';  
                          break;
                          case 12:
                                  result = 'Dec';  
                          break;
                    }
                    return result;
}

let getLines = function getLines (filename, lineCount, callback) {
  let stream = fs.createReadStream(filename, {
    flags: "r",
    encoding: "utf-8",
    fd: null,
    mode: 438,
    bufferSize: 64 * 1024
  });

  let data = "";
  let lines = [];
  stream.on("data", function (moreData) {
    data += moreData;
    lines = data.split("\n");
    if (lines.length > lineCount + 1) {
      stream.destroy();
      lines = lines.slice(0, lineCount);
      callback(false, lines);
    }
  });

  stream.on("error", function () {
    callback("Error");
  });

  stream.on("end", function () {
    callback(false, lines);
  });

};