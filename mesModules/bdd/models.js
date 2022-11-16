const mongoose = require("mongoose");
const { isEmail } = require('validator');  // valide et nettoie les string d'adresse email

/* schéma de données d'une voiture dans la BDD (ID automatiquement généré par Mongoose) */
const voitureSchema = new mongoose.Schema({
    marque: {
        type: String,
        trim: true
    },
    model: {
        type: String,
        trim: true
    },
    motor: {
        type: String,
        trim: true
    },
    immat: {
        type: String,
        trim: true
    },
    km: {
        type: Number,
        trim: true
    },
});

/* schéma de données d'une révision dans la BDD */
const revisionSchema = new mongoose.Schema({
    datePriseRdv: {
        type: Date,
        default: () => Date.now()
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
const userSchema = mongoose.Schema(
    {
        nom: {
            type: String,
            trim: true
        },
        prenom: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true
        },
        passwd: {
            type: String,
            required: true,
            max: 1024,
            minlength: 6
        },
        portable: {
            type: String,
            trim: true
        },
        adresse: {
            type: String,
            trim: true
        },
        ville: {
            type: String,
            trim: true
        },
        cp: {
            type: String,
            trim: true
        },
        voiture: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "voitureSchema",
            default: null
        },
        currentRevision: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "revisionSchema",
            default: null
        },
        history: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "revisionSchema",
            default: null
        }]
    },
    {
        timestamps: true
    }
)

/* export des schémas en tant que modèle Mongoose afin de les rendre disponibles pour Express */
const User = mongoose.model("User", userSchema);
const Revision = mongoose.model("Revision", revisionSchema);
const Voiture = mongoose.model("Voiture", voitureSchema);

module.exports = { mongoose, User, Revision, Voiture }