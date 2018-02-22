Quake III Arena 1.32e Launcher
==============================

This is a simple launcher made with [NW.js](https://nwjs.io/) for [Quake 3 Arena 1.32e Mod](http://edawn-mod.org/forum/viewtopic.php?f=5&t=7).

* Auto-update game with latest 1.32e build when available.
* Launch x86/x64 binary depending on the processor architecture used by your operating system.

Usage:
------
`launcher.exe` must be in your quake 3 folder next to the quake 3 executables.<br>
`launcher.ini` and `version.ini` should be next to `launcher.exe`.<br>

`launcher.ini` is for overriding hard-coded values if necessary (file is self explanatory).<br>
`version.ini` defaults to 09-Feb-2018 build and if this file doesn't exist launcher will default to this date.<br>
File will be updated / created (if doesn't exist) on successful update.

Rem:
----
Launcher will download  the quake 3 1.32e changelog from http://www.edawn-mod.org/binaries/quake3e-changes.txt and if necessary the latest build from http://www.edawn-mod.org/binaries/quake3-1.32e.zip

By default only the following files will be extracted from the archive to perform the update:<br> pak8a.pk3, quake3e.exe, quake3e.x64.exe.

You can change this behavior by editing `launcher.ini`.<br>

Linux:
------
This was made with a windows environnement in mind but as both nw.js and quake3 arena 1.32e mod have linux version it should be trivial to port this to linux as well.<br>
Please note that the launcher uses unzip.exe to unzip the update. 

Screenshot:
-----------


Legal
-----
Other trademarks and copyright are the property of their respective owners.
