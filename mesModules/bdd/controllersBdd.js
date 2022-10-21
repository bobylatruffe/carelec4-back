const mongoose = require("mongoose");

const Models = {};

async function updateUserInfos(userId, newUserinfos) {
    try {
        return await Models.User.findOneAndUpdate(
            { _id: userId },
            {
                $set: newUserinfos
            },
            { new: true })
    } catch (err) {
        console.log("Problème lors de la mise à jour des informations de l'utilisateur");
        console.log(err.message);
        return null;
    }
}

async function signIn(email, passwd) {
    const user = await Models.User.find({ email, passwd, });
    if (user.length === 0)
        return null;

    return user[0];
}

async function signUp({ nom, prenom, email, passwd, portable, adresse, ville, cp }) {
    const isExistEmail = await Models.User.find({ email, });
    if (isExistEmail.length !== 0) {
        console.log("Email déjà utilisé")
        return null;
    }

    await Models.User.create({
        nom,
        prenom,
        email,
        passwd,
        portable,
        adressePostale: {
            adresse, ville, cp
        }
    })
}

function initModels() {
    const revisionSchema = new mongoose.Schema({
        datePriseRdv: Date,
        dateProgrammer: {
            date: Date,
            creneau: String,
        },
        pickUp: {
            status: String,
        },
        edlPickUp: {
            status: String,
            defauts: [{
                posX: String,
                posY: String,
                commentaire: String,
                imgs: [String],
            }],
        },
        backToGarage: {
            status: String,
        },
        entretien: {
            status: String,
            taches: [{
                status: String,
                name: String,
                imgs: [String],
            }]
        },
        dropUp: {
            status: String,
        },
        edlDropUp: {
            status: String,
            defauts: [{
                posX: String,
                posY: String,
                commentaire: String,
                imgs: [String],
            }],
        }
    });

    const userSchema = new mongoose.Schema({
        nom: String,
        prenom: String,
        email: {
            type: String,
            lowercase: true,
        },
        passwd: String,
        portable: String,
        adresse: String,
        ville: String,
        cp: String,

        voiture: {
            immat: String,
            motor: String,
            km: Number,
            lastRevisionDate: Date,
        },
        revisionProgrammer: revisionSchema,
        history: [revisionSchema]
    })

    Models.User = mongoose.model("User", userSchema);
    Models.Revision = mongoose.model("Revision", revisionSchema);
}

async function toConnectBdd() {
    await mongoose.connect("mongodb+srv://bfssfb67:w5d85qa2@cluster0.7jbewlj.mongodb.net/carelec?retryWrites=true&w=majority");
}

// toConnectBdd()
//     .then(() => {
//         console.log("Connection à la BDD ok")
//         updateUserInfos("6350fa26dc60d4c5e3fcbeb0", { nom: "bozlak", prenom: "raoul" })

//     })
//     .catch(err => console.log(err));

module.exports = {
    initModels,
    toConnectBdd,
    signUp,
    signIn,
    updateUserInfos,
}   