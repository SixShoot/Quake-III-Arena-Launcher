var fs = require('fs');
var os = require('os');
var path = require('path');
var spawn = require('child_process').spawn;

var nwPath = process.execPath;
var nwDir = path.dirname(nwPath);
var nwPackageDir = nwDir+"\\package\\";
var ini = require(nwPackageDir+'\\lib\\node_modules\\ini');
var bin = nwDir+"\\package\\bin\\";
var tmpDir = os.tmpdir()+"\\q3_"+Math.floor(Date.now() / 1000)+"\\";

var is64 = os.arch() === 'x64' || process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');

const exec_x86 = "quake3e.exe";
const exec_x64 = "quake3e.x64.exe";

var url_quake3e_latest = "";
var url_quake3e_changelog = "";
var update_file_list = "";
var ourVersion = "";
var remoteVersion = "";

(function($, window, document) {
   $(function() {
   
   message = $('#message');
   spinner = $('.spinner','#bottom');
   progressBar = $('.loadingBar','#bottom');
   playbtn = $('#playBtn'); 
   
   fs.stat(nwDir+'\\version.ini', function(err, stat) {
      if(err == null) {
           var config = ini.parse(fs.readFileSync(nwDir+'\\version.ini', 'utf8'));
           ourVersion = config.version.build.split("-");
      }
      else {
          ourVersion = "09-Feb-2018".split("-");
      } 
      fs.stat(nwDir+'\\launcher.ini', function(err, stat) {
          if(err == null) {
               config = ini.parse(fs.readFileSync(nwDir+'\\launcher.ini', 'utf8'));
            
               url_quake3e_latest = config.url.latest;
               url_quake3e_changelog = config.url.changelog;
               update_file_list = config.update.fileList;
          }
          else {
              url_quake3e_latest = "http://www.edawn-mod.org/binaries/quake3-1.32e.zip";
              url_quake3e_changelog = "http://www.edawn-mod.org/binaries/quake3e-changes.txt";
              update_file_list = "baseq3\pak8a.pk3 quake3e.exe quake3e.x64.exe";
          } 
          wget(url_quake3e_changelog,tmpDir
          ,function(){ 
            spinner.addClass('hidden');
            rmdirf(tmpDir);
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

                        wget(url_quake3e_latest,tmpDir
                         ,function(){ 
                           spinner.addClass('hidden');
                           rmdirf(tmpDir);
                           display_play_button();
                         }
                        ,function(filePath){
                            
                                  var cmdline = ['--uo', filePath,'-d', nwDir];
                                  var file_list = update_file_list.split(" ");
                                  
                                  file_list.forEach(function(file) {
                                      cmdline.push(file);
                                  });
                            
                                  var unzip = spawn(bin+"unzip.exe", cmdline , {stdio: ['pipe', 'pipe', 'pipe']});
                                  
                                  message.text('Applying update');
                                  
                                  unzip.on('exit', (code) => {
                                      
                                      fs.stat(nwDir+'\\version.ini', function(err, stat) {
                                               if(err == null) {
                                                    config = ini.parse(fs.readFileSync(nwDir+'\\version.ini', 'utf8'));     
                                               }
                                               else{ 
                                                    version = { build:"09-Feb-2018"};
                                                    config = { version };
                                               }
                                               
                                               remoteVersion[0] = formatNumber(remoteVersion[0]);
                                               remoteVersion[1] = numberToMonth(remoteVersion[1]);
                                               remoteVersion[2] = formatNumber(remoteVersion[2]);
                                               config.version.build = remoteVersion[0]+"-"+remoteVersion[1]+"-"+remoteVersion[2];
                                               fs.writeFileSync(nwDir+'\\version.ini', ini.stringify(config), 'utf8');
                                               
                                               rmdirf(tmpDir);
                                               display_play_button();
                                     }); 
                                  });
                        },progressBar);
                    }
                    else {
                        rmdirf(tmpDir);
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

  message.hide();
  progressBar.hide();
  playbtn.removeClass('hide');
  
  playbtn.click(function() {
  
    if (is64) { execPath = nwDir+"\\"+exec_x64; }
    else { execPath = nwDir+"\\"+exec_x86; }

       fs.stat(execPath, function(err, stat) {
          if(err == null) {
            nw.Shell.openItem(execPath); 
            win.close();
          } else {
              alert("Unable to locate quake3 executable.");
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
      console.log(e);
   }
}