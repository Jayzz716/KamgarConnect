const https = require('https');
const fs = require('fs');
const path = require('path');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

const images = [
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Painter_working.jpg/640px-Painter_working.jpg', dest: path.join(__dirname, 'public/images/service_painter.png') },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Bricklayer%2C_Construction_Worker.jpg/640px-Bricklayer%2C_Construction_Worker.jpg', dest: path.join(__dirname, 'public/images/service_mason.png') }
];

console.log('Downloading missing images...');
Promise.all(images.map(img => download(img.url, img.dest)))
  .then(() => console.log('Downloaded successfully'))
  .catch(err => console.error('Error:', err));
