const https = require("https");
const fs = require("fs");
const path = require("path");
const options = {
    key: fs.readFileSync(path.join(__dirname, '../../cert/myserver.key')),
    cert: fs.readFileSync(path.join(__dirname, '../../cert/bozlak_ddns_net.pem-chain')),
    // ca: fs.readFileSync(path.join(__dirname, "./cert/bozlak_ddns_net.pem-chain"))
    cors: {
        origin: "*"
    }
}

let httpsServer = null;
function linkServerToExpress(app) {
    httpsServer = https.createServer(options, app);
    return httpsServer;
}

module.exports = (app) => {
    if (app)
        return linkServerToExpress(app);
    else
        return httpsServer;
}