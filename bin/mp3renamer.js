#!/usr/bin/env node

var id3 = require('id3js');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

var die = function (message) {
  console.error(message);
  process.exit(1);
};

var warn = function (message) {
  console.error(message);
  process.exit(1);
};

var generateNewFilePath = function (dst, tags) {
  var artist = tags.artist;
  var album = tags.album;
  var title = tags.title;
  var track = tags.v2.track || tags.v1.track;
  if (!artist || !album || !title || !track) {
    return null;
  }
  artist = artist.replace(/\0/g, '');
  album = album.replace(/\0/g, '');
  title = title.replace(/\0/g, '');
  track = String(track);
  track = track.replace(/\0/g, '');
  /* example: if track is 5/12, remove the /12 */
  track = track.replace(/\/.*/, '');
  /* leading zero */
  track = ('0' + track).substr(-2);
  dst = dst.replace('$artist', artist);
  dst = dst.replace('$album', album);
  dst = dst.replace('$title', title);
  dst = dst.replace('$track', track);
  dst = dst.replace(/\0/g, '');
  dst += '.mp3';
  return dst;
};

var renameFile = function (filePath, dst, callback) {
  id3({
    file: filePath,
    type: id3.OPEN_LOCAL
  }, function (err, tags) {
    if (err) {
      // TODO: handle errors
      warn(err);
      return callback(null);
    }
    var newFilePath = generateNewFilePath(dst, tags);
    if (!newFilePath) {
      // TODO: handle errors
      warn('Cannot generate a valid name for: ' + filePath);
      return callback(null);
    }
    var newDir = path.dirname(newFilePath);
    // console.log(newFilePath);
    mkdirp(newDir, function (err) {
      if (err) {
        // TODO: handle errors
        warn(err);
        return callback(null);
      }
      fs.rename(filePath, newFilePath, function (err) {
        if (err) {
          // TODO: handle errors
          warn(err);
          return callback(null);
        }
        callback(null);
      });
    });
  });
};

var renameAllFilesInDirectory = function (dirPath, dst, callback) {
  /* TODO: Must emulate find command like this:
   * find DIRECTORY -name '*.mp3' -exec ./bin/mp3renamer.js {} 'tmp/$artist/$album/$track - $title' \;
   * with async support for parallel execution
   */
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