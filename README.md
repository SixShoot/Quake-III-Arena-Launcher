Quake III Arena 1.32e Launcher

This is a simple launcher made with <NW.js> for <Quake 3 Arena 1.32e Mod>.

* Auto-update game with latest 1.32e build when available.
* Launch x86/x64 binary depending on the processor architecture used by your operating system.

Usage: 
launcher.exe must be in your quake 3 folder next to the quake 3 executables.
launcher.ini and version.ini should be next to launcher.exe.

launcher.ini is for overriding hard-coded values if necessary (file is self explanatory).
version.ini defaults to 09-Feb-2018 build and if this file doesn't exist launcher will default to this date.
File will be updated / created (if doesn't exist) on succesful update.

Rem

launcher will download  the quake 3 1.32e changelog from http://www.edawn-mod.org/binaries/quake3e-changes.txt and if necessary the latest build from http://www.edawn-mod.org/binaries/quake3-1.32e.zip

By default only the following files will be extracted from the archive to perform the update : pak8a.pk3, quake3e.exe, quake3e.x64.exe.

You can change this behavior by editing launcher.ini.

Linux

This was made with a windows environnement in mind but as both nw.js and quake3 arena 1.32e mod have linux version it should be trivial to port this to linux as well
Please note that the launcher uses unzip.exe to unzip the update. 