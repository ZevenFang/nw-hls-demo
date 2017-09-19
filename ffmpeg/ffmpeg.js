var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath('ffmpeg/ffmpeg');

/*player.src({type:'application/x-mpegURL',src:dest});
 player.ready(function () {
 player.play(); //自动播放
 });
 play.poster(image)*/

function initPlayer(dest, videoId, options) {
  var player = videojs(videoId, options);
  if (fs.existsSync(dest)) {
    player.src({src: dest, type: 'application/x-mpegURL'});
    player.play();
  } else {
    var inter = setInterval(function () {
      if (fs.existsSync(dest)) {
        player.src({src: dest, type: 'application/x-mpegURL'});
        player.play();
        clearInterval(inter);
      }
    }, 100)
  }
}

function rtsp2m3u8(src, dest, videoId, options) {
  fs.existsSync('stream')||fs.mkdirSync('stream');
  fs.existsSync('stream/'+dest)||fs.mkdirSync('stream/'+dest);
  dest = 'stream/'+dest+'/output.m3u8';
  initPlayer(dest, videoId, options);
  var proc = ffmpeg(src, { timeout: 432000 })
    // set video bitrate
    .videoBitrate(1024)
    //set h264 preset
    // .addOption('preset', 'superfast')
    // set target codec
    .videoCodec('libx264')
    .noAudio()
    // set hls segments time
    .addOption('-hls_time', 1)
    // include all the segments in the list
    .addOption('-hls_list_size',0)
    // setup event handlers
    .on('end', function() {
      console.log('file has been converted succesfully');
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
    })
    // save to file
    .save(dest);
}
