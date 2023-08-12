const info = {
  title: 'Keyboard Purchases',
  summary: "Keyboards!",
  version: '1.0.1',
  contact: {
    name: "yes"
  },
  description: "Stuff!",
  license: {
    name: "The Unlicense",
    url: "https://unlicense.org/"
  },
}


const host = `http://${process.env.IP}:${process.env.PORT}`;
const basePath = '/api'

module.exports = {
  info: info, 
  host, // Host (optional)
  basePath, // Base path (optional)
};