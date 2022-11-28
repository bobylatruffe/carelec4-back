const express = require("express");
const { mongoose } = require("mongoose");
const getLatLongFromAdresseAndCp = require("../../mesModules/admin/geocodage");
const router = express.Router();
const { toConnectBdd, getAllUsers, updateRevisionEdl, getEdls } = require("../../mesModules/bdd/controllersBdd");
const { Revision, User } = require("../../mesModules/bdd/models");

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

router.post("/updateRevisionEdl", async (req, resp) => {
    const { revisionId, typeEdl, edls } = req.body;

    const currentRevisionUpdated = await updateRevisionEdl(revisionId, typeEdl, edls);
    if (!currentRevisionUpdated)
        return resp.status(500).json({ message: `Impossible de modifier un etat des lieux, erreur interne` });

    return resp.json(currentRevisionUpdated);
});

router.post("/edls", async (req, resp) => {
    const { revisionId, typeEdl } = req.body;

    const edls = (await getEdls(revisionId))[typeEdl];
    if (!edls)
        return resp.status(500).json({ message: `Aucun edls trouvée` });

    return resp.json(edls)

});

// router.get("/latLongFromRevisionId/:revisionId", async (req, resp) => {
//     if (!mongoose.isValidObjectId(req.params.revisionId))
//         return resp.status(500).json({ message: "Erreur dans revisionId fournit" });


//     const userInfos = await User.findOne({ currentRevision: req.params.revisionId });
//     if (!userInfos)
//         return resp.status(500).json({ message: "Aucune user trouvée pour cet revisionId" });

//     const latLong = await getLatLongFromAdresseAndCp(userInfos.adresse, userInfos.cp);

//     return resp.json(latLong);
// })

module.exports = router;