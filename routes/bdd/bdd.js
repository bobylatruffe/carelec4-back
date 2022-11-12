const express = require("express");
const router = express.Router();

const { toConnectBdd, signUp, signIn, updateUserInfos, getUserCar, updateKmUserCar, addCarToUser, createCar, createRevision, addRevisionToUser, updateRevisionStatus, updateRevisionEdl, addTacheInRevision, isEmailExist } = require("../../mesModules/bdd/controllersBdd");
const { Voiture } = require("../../mesModules/bdd/models");

// toutes les api devront passer par cette route, qui permet de se connecter à la bdd.
// est-ce efficace ? je ne sais pas encore, je verrai bien plus tard.
router.post("/*", async (req, resp, next) => {
    try {
        await toConnectBdd();
        next();
    }
    catch (err) {
        console.log(err.message)
        resp.status(500).json({ message: "Problème de connection avec la bdd" });
    }
});

router.post("/signUp", async (req, resp) => {
    const { nom, prenom, adresse, ville, cp, portable, email, passwd } = req.body;
    const data = { nom, prenom, adresse, ville, cp, portable, email, passwd };

    for (nomVariable in data) {
        if (!data[nomVariable])
            return resp.status(500).json({ message: `${nomVariable} manquant` })
    }

    const userInfos = await signUp(data);
    if (!userInfos)
        return resp.status(500).json({ message: `${email} existe déjà` });

    return resp.json(userInfos);
});

router.post("/signIn", async (req, resp) => {
    const { email, passwd } = req.body;
    if (!email)
        return resp.status(500).json({ message: `email manquant` })

    if (!passwd)
        return resp.status(500).json({ message: `passwd manquant` })

    const userInfos = await signIn(email, passwd);
    if (!userInfos)
        return resp.status(500).json({ message: `erreur d'authentification, vérifier email ou passwd` });

    return resp.json(userInfos);
});

router.post("/updateUserInfos", async (req, resp) => {
    if (Object.keys(req.body).length === 0)
        return resp.status(500).json({ message: "Aucune nouvelle information" });

    for (ppt in req.body) {
        if (!req.body[ppt])
            return resp.status(500).json({ message: `${ppt} manquant` });
    }

    const { email } = req.body;
    delete req.body.email;

    const userInfosUpdated = await updateUserInfos(email, req.body);
    if (!userInfosUpdated)
        return resp.status(500).json({ message: `Impossible de mettre à jour les informations` });

    return resp.json(userInfosUpdated);
});

router.post("/getUserCar", async (req, resp) => {
    const { voitureId } = req.body;

    const userCar = await getUserCar(voitureId);
    if (!userCar) {
        return resp.status(500).json({ message: `Aucune voiture` });
    }

    resp.json(userCar);
});

router.post("/addCarToUser", async (req, resp) => {
    const { email, carData } = req.body;
    if (!email) {
        return resp.status(500).json({ message: `Impossible d'ajouter une nouvelle voiture, email manquant` });
    }

    const newCar = await createCar(carData);
    const userInfosUpdated = await addCarToUser(email, newCar);
    if (!userInfosUpdated)
        return resp.status(500).json({ message: `Impossible d'ajouter la voiture, problème interne` });

    return resp.json(userInfosUpdated);
});

router.post("/updateKmUserCar", async (req, resp) => {
    const { email, newKm } = req.body;
    delete req.body.email;

    const userCarUpdated = await updateKmUserCar(email, newKm);
    if (!userCarUpdated)
        return resp.status(500).json({ message: `Impossible de mettre à jour le km, problème interne` });

    return resp.json(userCarUpdated);
});

router.post("/addRevisionToUser", async (req, resp) => {
    const { email, newRevision } = req.body;

    if (!email)
        return resp.status(500).json({ message: `Impossible de créer une révision, email manquant` });

    const revision = await createRevision(newRevision);
    const revisionId = await addRevisionToUser(email, revision);

    if (!revisionId)
        return resp.status(500).json({ message: `Impossible de créer une révision, erreur interne` });

    return resp.json(revisionId);
});

router.post("/updateRevisionStatus", async (req, resp) => {
    const { revisionId, statusChoisie, newValue } = req.body;

    if (!revisionId)
        return resp.status(500).json({ message: `Impossible de créer une révision, email manquant` });

    const curentRevisionUpdated = await updateRevisionStatus(revisionId, statusChoisie, newValue);
    if (!curentRevisionUpdated)
        return resp.status(500).json({ message: `Impossible de créer une révision, erreur interne` });


    return resp.json(curentRevisionUpdated);
});

router.post("/updateRevisionEdl", async (req, resp) => {
    const { revisionId, typeEdl, edls } = req.body;

    const currentRevisionUpdated = await updateRevisionEdl(revisionId, typeEdl, edls);
    if (!currentRevisionUpdated)
        return resp.status(500).json({ message: `Impossible de modifier un etat des lieux, erreur interne` });

    return resp.json(currentRevisionUpdated);
});

router.post("/addTacheInRevision", async (req, resp) => {
    const { revisionId, newTache } = req.body;

    const currentRevisionUpdated = await addTacheInRevision(revisionId, newTache);
    if (!currentRevisionUpdated)
        return resp.status(500).json({ message: `Impossible d'ajouter une tâche dans l'entretien, erreur interne` });

    return resp.json(currentRevisionUpdated);
});

router.post("/getUserInfos", async (req, resp) => {
    const { email } = req.body;

    const userInfos = await isEmailExist(email);
    if (!userInfos) return resp.status(500).json({ message: `Impossible de trouver les informations de cette user` });

    return resp.json(userInfos);
});

module.exports = router;