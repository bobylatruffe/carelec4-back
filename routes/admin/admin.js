const express = require("express");
const router = express.Router();
const { toConnectBdd, getAllRevisions } = require("../../mesModules/bdd/controllersBdd");

router.all("/*", async (req, resp, next) => {
    try {
        await toConnectBdd();
        next();
    } catch (err) {
        console.log(err.message)
        resp.status(500).json({ message: "Problème de connection avec la bdd" });
    }
});

router.get("/revisions", async (req, resp) => {
    const allRevisions = await getAllRevisions();
    if (allRevisions.length === 0)
        return resp.status(500).json({ message: "Aucune révision programmée" });

    if (!allRevisions)
        return resp.status(500).json({ message: "Problème lors de la récupération de toutes les révisions" });

    return resp.json(allRevisions);
});

module.exports = router;