const sharp = require('sharp');

class ImageMW {
  static resize() {
    return (req, res, next) => {
      if (req.file?.buffer) {

        sharp(req.file.buffer)
          .resize(200, 200, {
            fit                : sharp.fit.inside,
            withoutEnlargement : true
          })
          .jpeg({ quality : 90 })
          .toBuffer()
          .then(buffer => {
            req.file.buffer = buffer;
            next();
          })
          .catch(() => {
            res.status(400).send('Failed to process image, please make sure you sent a valid image file');
          })
      }
      else {
        next();
      }
    }
  }
}

export default ImageMW;