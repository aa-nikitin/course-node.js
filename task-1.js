const http = require('http');
require('dotenv').config();

const { PORT, TIME, INTERVAL } = process.env;

const server = http.createServer((req, res) => {
  const handleInterval = () => {
    const utcDate = new Date().toISOString();
    if (req.url !== '/favicon.ico') {
      console.log(`${req.method} ${req.url}: ${utcDate}`);
    } else {
      res.end();
    }
    return utcDate;
  };

  let interval = setInterval(() => {
    handleInterval();
  }, INTERVAL);

  setTimeout(() => {
    res.end(handleInterval());
    clearInterval(interval);
  }, TIME);
});

server.listen(PORT, () => {
  console.log(`port: ${PORT}\nurl: http://localhost:${PORT}/`);
});
