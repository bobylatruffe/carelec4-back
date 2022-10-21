const express = require("express");
const router = express.Router();

const { toConnectBdd, signIn, initModels, updateUserInfos } = require("../../mesModules/bdd/controllersBdd.js");

initModels();

router.post("/*", async (req, resp, next) => {
    try {
        await toConnectBdd();
        console.log("Connexion à la bdd ok");
        next();
    }
    catch (err) {
        console.log(err.message)
        resp.status(500).json({ message: "Problème de connection avec la bdd" });
    }
});

router.post("/signIn", async (req, resp) => {
    const { email, passwd } = req.body;
    if (!email)
        return resp.status(500).json({ message: "Email manquant" });

    if (!passwd)
        return resp.status(500).json({ message: "Mot de passe manquant" });

    const userInfos = await signIn(email, passwd);
    if (userInfos === null) {
        return resp.status(500).json({ message: "Connexion impossible avec ces informations" });
    }

    return resp.json(userInfos);
});

router.post("/updateUserInfos", async (req, resp) => {
    const { userId, newUserInfos } = req.body;

    if (Object.keys(newUserInfos).length === 0)
        return resp.status(500).json({ message: "Rien à mettre à jour" });

    const userInfosUpdated = await updateUserInfos(userId, newUserInfos);
    if (userInfosUpdated === null)
        return resp.status(500).json({ message: "Impossible de mettre à jours les informations" });

    return resp.json({ message: "Mise à jour réussi", userInfos: userInfosUpdated });
});

module.exports = router;