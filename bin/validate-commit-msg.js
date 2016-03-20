#!/usr/bin/env node

'use strict';

var exec = require('child_process').exec;
var exists = require('fs').existsSync;
var fileInfo = require('fs').lstatSync;
var read = require('fs').readFileSync;
var filename = './.git';

function stdExecCallback(error, stdout, stderr) {
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.log(stderr);
  }
  if (error !== null) {
    //console.log(error);
  }
}

function prehook() {
  exec('rm -f ' + getGitFolder() + '/hooks/commit-msg');
}

function posthook() {
  exec('chmod +x ' + getGitFolder() + '/hooks/commit-msg',
    function callback(error, stdout, stderr) {
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.log(stderr);
      }
      if (error !== null) {
        console.log('Removing symlink');
        prehook();
      }
    }
  );
}

function hook() {
  prehook();
  exec('ln -s ../../node_modules/validate-commit-message/lib/validate-commit-msg.js' +
    ' ' + getGitFolder() + '/hooks/commit-msg', stdExecCallback);
  posthook();
}

function getGitFolder() {
    var gitDirLocation = filename;
    if (!exists(gitDirLocation)) {
        throw new Error('Cannot find file ' + gitDirLocation);
    }

    if(!fileInfo(gitDirLocation).isDirectory()) {
        var unparsedText = '' + read(gitDirLocation);
        gitDirLocation = unparsedText.substring('gitdir: '.length).trim();
    }

    if (!exists(gitDirLocation)) {
        throw new Error('Cannot find file ' + gitDirLocation);
    }

    return gitDirLocation;

}

hook();
