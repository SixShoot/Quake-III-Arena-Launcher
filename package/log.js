function logger(debug=false) {
  var that = this;
  
  this.debug = debug;
  this.logForFirstTime = true;

  return function(event, option={}){

    if (that.debug) {
      console.log(event);
    }
    else {
    
      var options = {
        fileRoot: option.fileRoot || sys.path.temp,
        fileName: option.fileName || App.name+".log"
      };
    
      var logFile = options.fileRoot+"\\"+options.fileName;
      
      var flag = {'flag':'a'};
      if (that.logForFirstTime) { flag = {'flag':'w'}; }
      
      var date = new Date();
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();
      var formattedTime = '['+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '] ';
      
      try {
        fs.writeFileSync(logFile, formattedTime + event.toString() + os.EOL, flag);
        if (that.logForFirstTime) { that.logForFirstTime = false; }
      }catch(e){ if (e) throw e; }
    }
  }
}
log = new logger();