const express = require('express');
const app = express();
const https = require("https");
const fs = require("fs");
const path = require("path");
const options = {
  key: fs.readFileSync(path.join(__dirname, './cert/myserver.key')),
  cert: fs.readFileSync(path.join(__dirname, './cert/bozlak_ddns_net.pem-chain'))
  // ca: fs.readFileSync(path.join(__dirname, "./cert/bozlak_ddns_net.pem-chain"))
}

app.use((req, resp, next) => {
  resp.setHeader('Access-Control-Allow-Origin', '*');
  resp.setHeader("Access-Control-Allow-Headers", "*");
  // resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  // resp.setHeader("Access-Control-Max-Age", "3600");
  // resp.setHeader("Access-Control-Allow-Headers", "X-PINGOTHER,Content-Type,X-Requested-With,accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization");
  next();
});

// const cors = require("cors"); 
// app.use(cors()); //ne fonctionne plus avec httpsServer
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = 5000;

// initialiser notre structure de donnée pour les préconisations constructeurs
const { initCarnetsEntretiensSdd } = require("./mesModules/carnetsEntretiens/initCarnetsEntretiensSdd");
initCarnetsEntretiensSdd();

app.get('/', (req, resp) => {
  resp.json("ok");
})

const carnetsEntretiensRoute = require("./routes/carnetsEntretiens/carnetsEntretiens");
app.use("/api/carnetsEntretiens", carnetsEntretiensRoute);

const toStandardiserRoute = require("./routes/toStandardiser/toStandardiser");
app.use("/api/toStandardiser", toStandardiserRoute);

const bdd = require("./routes/bdd/bdd");
app.use("/api/bdd", bdd);

const admin = require("./routes/admin/admin");
app.use("/api/admin", admin);

app.get("/*", (_, resp) => {
  return resp.status(404).json({ message: "rien à voir ici..." });
})

const httpsServer = https.createServer(options, app);
httpsServer.listen(PORT, () => {
  console.log("https server on listen " + PORT);
});

// app.listen(PORT, () =>console.log("serveru en ecoute"));