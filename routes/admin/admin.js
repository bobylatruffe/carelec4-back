const express = require("express");
const router = express.Router();
const { toConnectBdd, getAllUsers } = require("../../mesModules/bdd/controllersBdd");

router.all("/*", async (req, resp, next) => {
    try {
        await toConnectBdd();
        next();
    } catch (err) {
        console.log(err.message)
        resp.status(500).json({ message: "Problème de connection avec la bdd" });
    }
});

router.get("/users", async (req, resp) => {
    const allUsers = await getAllUsers();
    if (allUsers.length === 0)
        return resp.status(500).json({ message: "Aucun user trouvée" });

    if (!allUsers)
        return resp.status(500).json({ message: "Problème lors de la récupération de toutes les users" });

    return resp.json(allUsers);
});

module.exports = router;