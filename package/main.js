var ini = require(App.path.lib+'\\ini');

const tmpDir = sys.path.temp+"\\q3_"+Math.floor(Date.now() / 1000);
const exec = { x86: 'quake3e.exe', x64: 'quake3e.x64.exe' };

const iniFile = {
    version: App.path.self+'\\version.ini',
    launcher: App.path.self+'\\launcher.ini'
};

(function($, window, document) {
   $(function() {
   
   url_quake3e_latest = "";
   url_quake3e_changelog = "";
   update_file_list = "";
   ourVersion = "";
   remoteVersion = "";
   
   message = $('#message');
   spinner = $('.spinner','#bottom');
   progressBar = $('.loadingBar','#bottom');
   playbtn = $('#playBtn');
   
   $('#version').text(App.version); 

   fs.stat(iniFile.version, function(err, stat) {
      if(err == null) {
           var config = ini.parse(fs.readFileSync(iniFile.version, 'utf8'));
           ourVersion = config.version.build.split("-");
      }
      else {
          ourVersion = "09-Feb-2018".split("-");
          log(iniFile.version + ' not found ! Using default value(s)');
      } 
      fs.stat(iniFile.launcher, function(err, stat) {
          if(err == null) {
               config = ini.parse(fs.readFileSync(iniFile.launcher, 'utf8'));
            
               url_quake3e_latest = config.url.latest;
               url_quake3e_changelog = config.url.changelog;
               update_file_list = config.update.fileList;
          }
          else {
              url_quake3e_latest = "http://www.edawn-mod.org/binaries/quake3-1.32e.zip";
              url_quake3e_changelog = "http://www.edawn-mod.org/binaries/quake3e-changes.txt";
              update_file_list = "baseq3\pak8a.pk3 quake3e.exe quake3e.x64.exe";
              log(iniFile.launcher + ' not found ! Using default value(s)');
          } 
          wget(url_quake3e_changelog,tmpDir
          ,function(){ 
            log(url_quake3e_changelog+' download failed ... aborting.');
            display_play_button();
          }
          ,function(filePath){

                  getLines(filePath, 1, function (err, lines) {
                    remoteVersion = lines[0].replace(':','').split("-");
                    
                    ourVersion[0] = parseInt(ourVersion[0]);
                    ourVersion[1] = monthToNumber(ourVersion[1]);
                    ourVersion[2] = parseInt(ourVersion[2]);
                    remoteVersion[0] = parseInt(remoteVersion[0]);
                    remoteVersion[1] = monthToNumber(remoteVersion[1]);
                    remoteVersion[2] = parseInt(remoteVersion[2]);

                    mustUpdate = versionCompare(ourVersion,remoteVersion);
                    
                    spinner.addClass('hidden');
                    message.text("");
                    
                    if (mustUpdate) {
                        log('Update found !');
                        
                        wget(url_quake3e_latest,tmpDir
                         ,function(){ 
                           log(url_quake3e_latest+' download failed ... aborting.');
                           display_play_button();
                         }
                        ,function(filePath){
                            
                                  var spawn = require('child_process').spawn;
                                  var cmdline = ['--uo', filePath,'-d', App.path.self];
                                  var file_list = update_file_list.split(" ");
                                  
                                  file_list.forEach(function(file) {
                                      cmdline.push(file);
                                      copy(App.path.self+"\\"+file,tmpDir+"\\"+file);
                                      log("Backing up "+file);
                                  });
                            
                                  var unzip = spawn(App.path.bin+"\\unzip.exe", cmdline , {stdio: ['pipe', 'pipe', 'pipe']});
                                  
                                  message.text('Applying update');

                                  unzip.stdout.on('data', (data) => {
                                    if (!data.toString().replace(/^\s+|\s+$/gm,'').length == 0){
                                      log(`${data}`);
                                    }
                                  });

                                  unzip.stderr.on('data', (data) => {
                                    if (!data.toString().replace(/^\s+|\s+$/gm,'').length == 0){
                                      log(`${data}`);
                                    }
                                  });
                                  
                                  unzip.on('exit', (code) => {
                                  
                                      if (code == 0) {
                                      
                                        fs.stat(iniFile.version, function(err, stat) {
                                                 if(err == null) {
                                                      config = ini.parse(fs.readFileSync(iniFile.version, 'utf8'));     
                                                 }
                                                 else{ 
                                                      version = { build:"09-Feb-2018"};
                                                      config = { version };
                                                 }
                                                 
                                                 remoteVersion[0] = formatNumber(remoteVersion[0]);
                                                 remoteVersion[1] = numberToMonth(remoteVersion[1]);
                                                 remoteVersion[2] = formatNumber(remoteVersion[2]);
                                                 config.version.build = remoteVersion[0]+"-"+remoteVersion[1]+"-"+remoteVersion[2];
                                                 fs.writeFileSync(iniFile.version, ini.stringify(config), 'utf8');
                                                 log("Update complete");
                                       }); 
                                     }
                                     else {
                                        log("Error while updating. Exit code "+code);
                                        file_list.forEach(function(file) {
                                          copy(tmpDir+"\\"+file,App.path.self+"\\"+file);
                                          log("Reverting "+file);
                                        });
                                     }
                                     display_play_button();
                                  });
                        },progressBar);
                    }
                    else {
                        log('No update found !');
                        display_play_button();
                    }
                  });  
         });   
      });  
   });


 
   });
  $.fn.alterClass = function ( removals, additions ) {
    
    var self = this;
    
    if ( removals.indexOf( '*' ) === -1 ) {
      self.removeClass( removals );
      return !additions ? self : self.addClass( additions );
    }

    var patt = new RegExp( '\\s' + 
        removals.
          replace( /\*/g, '[A-Za-z0-9-_]+' ).
          split( ' ' ).
          join( '\\s|\\s' ) + 
        '\\s', 'g' );

    self.each( function ( i, it ) {
      var cn = ' ' + it.className + ' ';
      while ( patt.test( cn ) ) {
        cn = cn.replace( patt, ' ' );
      }
      it.className = $.trim( cn );
    });

    return !additions ? self : self.addClass( additions );
  };
}(window.jQuery, window, document));

function display_play_button() {

  spinner.addClass('hidden');
  message.hide();
  progressBar.hide();
  playbtn.removeClass('hide');
  rmdirf(tmpDir);
  
  playbtn.click(function() {

    var exe = (sys.info.is64) ? App.path.self+"\\"+exec.x64 : App.path.self+"\\"+exec.x86;

       fs.stat(exe, function(err, stat) {
          if(err == null) {
            nw.Shell.openItem(exe); 
            win.close();
          } else {
              alert("Unable to locate quake3 executable.");
              log("Unable to locate quake3 executable: "+exe);
        }
      });
  });
}

function rmdirf(dir_path) {
   try {
      if (fs.existsSync(dir_path)) {
          fs.readdirSync(dir_path).forEach(function(entry) {
              var entry_path = path.join(dir_path, entry);
              if (fs.lstatSync(entry_path).isDirectory()) {
                  rmdirf(entry_path);
              } else {
                  fs.unlinkSync(entry_path);
              }
          });
          fs.rmdirSync(dir_path);
      }
   }catch(e){
      log(e);
   }
}

function copy(from,to){
    var exec = require('child_process').execSync;
    
    fs.stat(from, function(err, stat) {
      if(err == null) {
        try{
          exec('copy /Y "'+from+'" "'+to+'"',{windowsHide: true});
        }
        catch(e){
          log(e);
        }  
      } else {
          log(from+" doesn't exist.");
      }
    });      
}
