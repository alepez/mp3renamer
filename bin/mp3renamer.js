#!/usr/bin/env node

var id3 = require('id3js');
var path = require('path');
var fs = require('fs');

var die = function (message) {
  console.error(message);
  process.exit(1);
};

var renameFile = function (filePath, dst, callback) {
  id3({
    file: filePath,
    type: id3.OPEN_LOCAL
  }, function (err, tags) {
    if (err) {
      // TODO: handle errors
      return;
    }
    console.log(tags);
  });
};

var renameAllFilesInDirectory = function (dirPath, dst, callback) {
  // TODO
  console.log(dirPath, dst);
  callback('not implemented');
};

var main = function () {
  var src = process.argv[2];
  var dst = process.argv[3];
  var stat;
  try {
    stat = fs.lstatSync(src);
  } catch (e) {
    die(e.message);
  }
  if (stat.isDirectory()) {
    renameAllFilesInDirectory(src, dst, function (err) {
      if (err) {
        return die(err);
      }
    });
    return;
  }
  if (stat.isFile()) {
    renameFile(src, dst, function (err) {
      if (err) {
        return die(err);
      }
    });
    return;
  }
  return die('Cannot read ' + src);
};

main();