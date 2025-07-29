const { create } = require("ipfs-http-client");

const ipfs = create({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http',
  fetch: async (url, options) => {
    if (options && options.body) {
      options.duplex = 'half';
    }
    return fetch(url, options);
  }
});

module.exports = ipfs;