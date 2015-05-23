// Configuration for JSLHint task(s)
// Runs JSHint on specified files
'use strict';

var taskConfig = function(grunt) {

  grunt.config.set('gitinfo', {

    /*local : {
      branch : {
        current : {
          SHA               : "Current HEAD SHA",
          shortSHA          : "Current HEAD short SHA",
          name              : "Current branch name",
          currentUser       : "Current git user" ,
          lastCommitTime    : "Last commit time",
          lastCommitMessage : "Last commit message",
          lastCommitAuthor  : "Last commit author",
          lastCommitNumber  : "Last commit number"
        }
      }
    },
    remote : {
      origin : {
        url : "Branch Url"
      }
    }*/
});

  grunt.log.writeln('Currently running the "default" task.');

};

module.exports = taskConfig;
