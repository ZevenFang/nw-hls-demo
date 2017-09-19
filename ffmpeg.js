var fs = require('fs');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(path.join(process.env.PWD, 'ffmpeg'));

function rtsp2m3u8(src, dest, videoId) {
  fs.existsSync('stream')||fs.mkdirSync('stream');
  fs.existsSync('stream/'+dest)||fs.mkdirSync('stream/'+dest);
  dest = 'stream/'+dest+'/output.m3u8';
  var player = videojs(videoId, options);
  var proc = ffmpeg(src, { timeout: 432000 })
  // set video bitrate
  // .videoBitrate(1024)
  // set target codec
    .videoCodec('libx264')
    // set audio bitrate
    // .audioBitrate('128k')
    // set audio codec
    .audioCodec('libmp3lame')
    // set number of audio channels
    .audioChannels(2)
    // set hls segments time
    .addOption('-hls_time', 10)
    // include all the segments in the list
    .addOption('-hls_list_size',0)
    // setup event handlers
    .on('progress', function() {
      /*player.src({type:'application/x-mpegURL',src:dest});
      player.ready(function () {
        player.play(); //自动播放
      });*/
      // play.poster(image)
    })
    .on('end', function() {
      console.log('file has been converted succesfully');
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
    })
    // save to file
    .save(dest);
}
