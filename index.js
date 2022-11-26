const express = require('express');
const app = express();
const httpsServer = require("./mesModules/httpsServer/httpsServer")(app);
const path = require("path");
const io = require("./mesModules/admin/socketIo");

app.use((req, resp, next) => {
  resp.setHeader('Access-Control-Allow-Origin', '*');
  resp.setHeader("Access-Control-Allow-Headers", "*");
  resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  resp.setHeader("Access-Control-Max-Age", "3600");
  resp.setHeader("Access-Control-Allow-Headers", "X-PINGOTHER,Content-Type,X-Requested-With,accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization");
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

app.use(express.static("public"))

const carnetsEntretiensRoute = require("./routes/carnetsEntretiens/carnetsEntretiens");
app.use("/api/carnetsEntretiens", carnetsEntretiensRoute);

const toStandardiserRoute = require("./routes/toStandardiser/toStandardiser");
app.use("/api/toStandardiser", toStandardiserRoute);

const bdd = require("./routes/bdd/bdd");
app.use("/api/bdd", bdd);

const admin = require("./routes/admin/admin");
app.use("/api/admin", admin);

app.use((req, resp, next) => {
  resp.sendFile(path.join(__dirname, "public", "index.html"));
})

app.get("/*", (_, resp) => {
  return resp.status(404).json({ message: "rien à voir ici..." });
})

httpsServer.listen(PORT, () => {
  console.log("https server on listen " + PORT);
});

// app.listen(PORT, () =>console.log("serveru en ecoute"));