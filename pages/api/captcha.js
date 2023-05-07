const captchapng = require('captchapng2');
export default function handler(req, res) {
    let rand = parseInt(Math.random() * 9000 + 1000);
    let png = new captchapng(80, 30, rand);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(png.getBuffer());
}
