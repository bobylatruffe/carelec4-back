const mongoose = require("mongoose");

/* schéma de données d'une voiture dans la BDD (ID automatiquement généré par Mongoose) */
const voitureSchema = new mongoose.Schema({
    marque: String,
    model: String,
    motor: String,
    immat: String,
    km: Number,
});

/* schéma de données d'une révision dans la BDD */
const revisionSchema = new mongoose.Schema({
    datePriseRdv: {
        type: Date,
        default: () => Date.now(),
    },
    dateProgrammer: {
        type: Date
    },
    pickUp: {
        status: {
            type: String,
            default: "noStart"
        },
    },
    edlPickUp: {
        status: {
            type: String,
            default: "noStart"
        },
        default: {
            type: Array,
            default: []
        }
    },
    backToGarage: {
        status: {
            type: String,
            default: "noStart"
        }
    },
    entretien: {
        type: Array,
        default: []
    },
    dropUp: {
        status: {
            type: String,
            default: "noStart"
        },
    },
    edlDropUp: {
        status: {
            type: String,
            default: "noStart"
        },
        default: []
    }
});

/* schéma de données d'un utilisateur dans la BDD */
const userSchema = mongoose.Schema({
    createAt: {
        type: Date,
        default: new Date(),
    },
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "voitureSchema",
        default: null,
    },
    currentRevision: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "revisionSchema",
        default: null
    },
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "revisionSchema",
        default: null,
    }]
})

/* export des schémas en tant que modèle Mongoose afin de les rendre disponibles pour Express */
const User = mongoose.model("User", userSchema);
const Revision = mongoose.model("Revision", revisionSchema);
const Voiture = mongoose.model("Voiture", voitureSchema);

module.exports = { mongoose, User, Revision, Voiture }