mp3renamer
==========

> Rename mp3 files by id3 tags

## Install

    npm install -g mp3renamer

## Usage

### Single file

    mp3renamer FILENAME 'music/$artist/$album/$track - $title' \;

### Multiple files

Not yet implemented. Can be done with:

    find DIRECTORY -name '*.mp3' -exec mp3renamer {} 'tmp/$artist/$album/$track - $title' \;
