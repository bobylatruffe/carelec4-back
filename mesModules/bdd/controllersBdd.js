const { disconnect } = require("mongoose");
const { mongoose, User, Revision, Voiture } = require("./models.js");

async function toConnectBdd() {
    try {
        await mongoose.connect("mongodb+srv://bfssfb67:w5d85qa2@cluster0.7jbewlj.mongodb.net/carelec?retryWrites=true&w=majority");
        // console.log("Connexion à la bdd ok")
    } catch (err) {
        throw err;
    }

    return true;
}

async function toDisconnectBdd() {
    await mongoose.disconnect();
    // console.log("Deconnectiond de la bdd ok");
}

async function isEmailExist(email) {
    let userInfos = null;
    try {
        userInfos = await User.findOne({ email, })
    } catch (err) {
        console.error(err.message);
        return null;
    }

    if (userInfos) {
        console.error("isEmailExist() : Un user existe déjà avec cette email");
        return userInfos
    }

    console.error(`isEmailExiste() : Aucun user avec l'email ${email}`);
    return null;
}

async function signUp(newUserInfos) {
    if (await isEmailExist(newUserInfos.email)) {
        return null;
    }

    let userInfos = null;
    try {
        userInfos = await User.create(newUserInfos);
    } catch (err) {
        console.error(err.message);
        return null;
    }

    return userInfos;
}

async function signIn(email, passwd) {
    let userInfos = null;
    try {
        userInfos = await User.findOne({ email, passwd });
    } catch (err) {
        console.error(err.message);
        return null;
    }

    if (!userInfos) {
        console.error("signIn() : Erreur dans l'email ou passwd");
        return null;
    }

    return userInfos;
}

async function updateUserInfos(email, newUserInfos) {
    if (!(await isEmailExist(email)))
        return null;

    const userInfosUpdated = await User.findOneAndUpdate({ email, }, { $set: newUserInfos }, { new: true })

    return userInfosUpdated;
}

async function createCar(carData) {
    let userCar = null;

    try {
        userCar = await Voiture.create(carData);
    } catch (err) {
        console.error(err.message);
        return null;
    }

    return userCar;
}

async function addCarToUser(email, carData) {
    if (!(carData instanceof Voiture)) {
        console.error("La voiture (2ème argument) n'est pas une instance de Voiture");
        return null;
    }

    let userInfos = await isEmailExist(email);
    if (!userInfos) {
        console.error("Impossible d'ajouter cette voiture pour l'utilisateur");
        return null;
    }

    userInfos = await updateUserInfos(email, { voiture: carData })

    return userInfos;
}

async function getUserCar(carId) {
    if (!mongoose.isValidObjectId(carId)) {
        console.error("Identifiant incorrecte");
        return null;
    }
    
    let userCar = null;
    try {
        userCar = await Voiture.findById(carId);
        return userCar;
    } catch (err) {
        console.error("getUserCar(): Impossible de trouver la voiture avec cette identifiant");
        return null;
    }
}

async function updateKmUserCar(email, newKm) {
    if (typeof (newKm) !== "number") {
        console.error("udpateKmUserCar(): le km doit être un entier");
        return null;
    }

    let userInfos = await isEmailExist(email);
    if (!userInfos) {
        console.error("updateKmUserCar(): Impossible de modifier le km, l'user n'existe pas");
        return null;
    }

    let carUserId = userInfos.voiture;
    const userCar = await Voiture.findByIdAndUpdate(carUserId, { $set: { km: newKm } }, { new: true });

    return userCar;
}

async function createRevision(revisionObj) {
    if (!revisionObj) {
        console.error("createRevision(): Aucun objet révision en argument !");
        return null;
    }

    let revision = null;
    try {
        revision = await Revision.create(revisionObj);
    } catch (err) {
        console.error(err.message);
        return null;
    }

    return revision;
}

async function addRevisionToUser(email, revisionObj) {
    // PAS NECESSAIRE, dans updateUserInfos déjà vérifié
    // const userInfos = await User.findOne({email,});
    // if(!userInfos) {
    //     console.error("Impossible d'ajouter une révision, car l'utilisateur n'existe pas");
    //     return null;
    // }

    let userInfosUpdated = null;
    try {
        userInfosUpdated = await updateUserInfos(email, { currentRevision: revisionObj })
    } catch (err) {
        console.error(err.message);
        return null;
    }

    return userInfosUpdated.currentRevision;
}

async function updateRevisionStatus(revisionId, field, newStatus) {
    let currentRevision = await Revision.findById(revisionId);
    if (!currentRevision) {
        console.error("updateRevisionStatus() : Impossible de trouver la révision rechercher par id");
        return null;
    }

    currentRevision[field].status = newStatus;

    try {
        await currentRevision.save();
    } catch (err) {
        console.error(err.message);
        console.error("updateRevisionStatus() : Impossible de mettre à jours la révision");
        return null;
    }

    return currentRevision;
}

async function updateRevisionEdl(revisionId, typeEdl, edls) {
    let currentRevision = await Revision.findById(revisionId);
    if (!currentRevision) {
        console.error("updateRevisionEdl() : Impossible de trouver la révision rechercher par id");
        return null;
    }

    currentRevision[typeEdl].default = currentRevision[typeEdl].default.concat(edls);

    try {
        await currentRevision.save();
    } catch (err) {
        console.error(err.message);
        console.error("updateRevisionEdl() : Impossible de mettre à jours la révision");
        return null;
    }

    return currentRevision;
}

async function addTacheInRevision(revisionId, newTache) {
    let currentRevision = await Revision.findById(revisionId);
    if (!currentRevision) {
        console.error("addTacheInRevision() : Impossible de trouver la révision rechercher par id");
        return null;
    }

    currentRevision.entretien = currentRevision.entretien.concat(newTache);

    try {
        currentRevision.markModified("entretien");
        await currentRevision.save();
    } catch (err) {
        console.error(err.message);
        console.error("addTacheInRevision() : Impossible de mettre à jours la révision");
        return null;
    }

    return currentRevision;
}

async function addImgForTache(revisionId, tacheIntitule, newImg) {
    const currentRevision = await Revision.findById(revisionId);
    if (!currentRevision) {
        console.error("addImgForTache() : Impossible de trouver la révision rechercher par id");
        return null;
    }

    for (tache of currentRevision.entretien) {
        if (tache.intitule === tacheIntitule) {
            if (tache.imgs)
                tache.imgs = tache.imgs.concat(newImg);
            else
                tache.imgs = [newImg];
        }
    }

    try {
        currentRevision.markModified("entretien");
        await currentRevision.save();
    } catch (err) {
        console.error(err.message);
        console.error("addImgForTache() : Impossible de mettre à jours la révision");
        return null;
    }

    return currentRevision;
}

async function getAllRevisions() {
    let allRevisions = [];
    try {
        allRevisions = await Revision.find({});
        return allRevisions;
    } catch(err) {
        console.error(err.message);
        console.error("getAllRevisions() : Problème lors de la récupération des révisions programmée");
        return null;
    }
}

async function test() {
    if (await toConnectBdd()) {
        console.error(await signIn("bozlak.fatih@gmail.com2019926522", "w5d85qa2"));
    }
}

if (process.argv[2] === "test")
    test();

module.exports = {
    toConnectBdd,
    toDisconnectBdd,
    signUp,
    signIn,
    updateUserInfos,
    createCar,
    addCarToUser,
    getUserCar,
    updateKmUserCar,
    createRevision,
    addRevisionToUser,
    updateRevisionStatus,
    updateRevisionEdl,
    addTacheInRevision,
    addImgForTache,
    isEmailExist,
    getAllRevisions
}