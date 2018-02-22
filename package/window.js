var win = nw.Window.get();

win.on('loaded', function() { 
    win.show();
    win.focus();
});

win.on('close', function() {
      this.hide(); 
      this.close(true);
});

win.on('minimize', function() {
      
});

win.on('restore', function() {
      
});

win.on('enter-fullscreen', function() {
      win.leaveFullscreen();
});

win.on('maximize', function() {
      win.unmaximize();
});

win.on('new-win-policy', function(frame, url, policy) {
      policy.ignore();
      nw.Shell.openExternal(url);
});

$("#controls > #close ").click(function() { 
      win.close(); 
});
 
$("#controls > #minimize ").click(function() { 
      win.minimize(); 
});