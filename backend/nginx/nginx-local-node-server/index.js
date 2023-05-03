const express = require('express')
const ffmpeg = require('fluent-ffmpeg');
const customLog = require('./customLog');

const app = express();
const port = 8080;

app.post('/make-thumbnail/:videoPath', (req, res) => {
  customLog(`${req.url} called`)

    const videoPath = req.params.videoPath
    const thumbName = `${videoPath}.jpg`
    const timecode = req.query.timecode || '50%'

    const proc = ffmpeg(`/opt/static/videos/${videoPath}`)
  // setup event handlers
  .on('filenames', function(filenames) {
    customLog('screenshots are ' + filenames.join(', '));
  })
  .on('end', function() {
    customLog(`thumbnail created for video ${videoPath} at ${timecode}`)
    res.status(201).send({thumbnail: `/opt/static/thumbnails/${thumbName}`})
  })
  .on('error', function(err) {
    customLog(err)
    res.status(400).send(err)
  })
  .screenshot({ count: 1, timemarks: [ timecode ], filename: thumbName, size: '640x360' }, '/opt/static/thumbnails');
});

app.post('users/set-profile-picture', (req, res) => {
  console.log(req)

  res.status(403).send()
})

app.all('*',(req,res) => {
    customLog(req.url)

    res.send("nothing to see here")
})

app.listen(port);
customLog('Server started at http://localhost:' + port);