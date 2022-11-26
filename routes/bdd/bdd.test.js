const fetch = require("node-fetch");
const { toConnectBdd, toDisconnectBdd, signIn } = require("../../mesModules/bdd/controllersBdd");
const { User, Revision, Voiture } = require("../../mesModules/bdd/models");

const randNb = (max) => Math.floor(Math.random() * max);
const URL = "http://bozlak.ddns.net:5000/api/bdd";
const queryBdd = async (apiName, data) => {
    const response = await fetch(URL + "/" + apiName, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return response;
}

const newUserInfos = {
    "nom": "bozlak",
    "prenom": "fatih",
    "adresse": "16 RUE DE MACON",
    "ville": "strasbourg",
    "cp": "67100",
    "portable": "0636679200",
    "email": "bozlak.fatih@gmail.com",
    "passwd": "123456"
};

// jest.setTimeout(100000);
beforeAll(async () => {
    await toConnectBdd();
    await User.deleteMany({});
    await Voiture.deleteMany({});
    await Revision.deleteMany({});
    await toDisconnectBdd();
})

describe("Tester les API pour la gestion d'un client", () => {
    test("Créer un compte", async () => {
        const response = await queryBdd("signUp", newUserInfos);
        const dataFromBdd = await response.json();
        if (response.status === 200)
            expect(dataFromBdd).toEqual(expect.objectContaining(newUserInfos));

        if (response.status === 500)
            expect(dataFromBdd).toEqual(expect.objectContaining({ message: expect.anything() }))
    });

    test("Se connecter à un compte existant", async () => {
        const response = await queryBdd("signIn", {
            email: newUserInfos.email, passwd: newUserInfos.passwd
        });

        if (response.status === 200)
            expect(await response.json()).toEqual(expect.objectContaining(newUserInfos))

        if (response.status === 500)
            expect(await response.json()).toEqual(expect.objectContaining({ message: expect.anything() }))
    });

    test("Modifier une information alétoire (sauf email et passwd, curentRevision, voiture et history) d'un user", async () => {
        const ppts = ["nom", "prenom", "adresse", "ville", "cp", "portable"];
        const pptToUpdate = ppts[randNb(ppts.length)];
        const newValue = randNb(1E10).toString();

        const response = await queryBdd("updateUserInfos", { email: newUserInfos.email, [pptToUpdate]: newValue });

        expect(response.status).toEqual(200);
        expect((await response.json())[pptToUpdate]).toEqual(newValue);
    });
});

describe("Gestion d'une voiture d'un user", () => {
    const newUserCar = {
        immat: "CL644BL",
        marque: "Renault",
        model: "Scénic 3",
        motor: "Scénic 3 110ch",
        km: randNb(1E6)
    };
    let voitureId = null;

    test("Ajouter une nouvelle voiture à un user", async () => {
        const response = await queryBdd("addCarToUser", {
            email: newUserInfos.email,
            carData: newUserCar,
        });

        expect(response.status).toEqual(200);

        const userInfosUpdated = await response.json();

        await toConnectBdd();
        const userCarInBdd = await Voiture.findById(userInfosUpdated.voiture);
        await toDisconnectBdd();

        voitureId = userInfosUpdated.voiture;
        expect(userInfosUpdated.voiture).toEqual(userCarInBdd.id);
        expect(userCarInBdd).toEqual(expect.objectContaining(newUserCar));
    });

    test("Récupérer la voiture d'un client", async () => {
        const response = await queryBdd("getUserCar", {
            voitureId,
        });

        expect(await response.json()).toEqual(expect.objectContaining(newUserCar));
    });

    test("Modifier le km d'une voiture d'un user", async () => {
        const newKm = randNb(1E10);

        const response = await queryBdd("updateKmUserCar", {
            email: newUserInfos.email,
            newKm,
        });
        expect(response.status).toEqual(200);
        const userCar = await response.json();

        await toConnectBdd();
        const userCarInBdd = await Voiture.findById(userCar._id);
        await toDisconnectBdd();

        expect(userCarInBdd.km).toEqual(newKm);
    });
});

describe("Gestion d'une révision", () => {
    test("Ajouter une révision à un user", async () => {
        const newRevision = {
            dateProgrammer: new Date("2022-11-10T15:00:00Z")
        }

        const response = await queryBdd("addRevisionToUser", {
            email: newUserInfos.email,
            newRevision,
        });

        expect(response.status).toEqual(200);

        const currentRevisionId = await response.json();

        await toConnectBdd();
        const userInfos = await signIn(newUserInfos.email, newUserInfos.passwd);
        const curentRevisionInBdd = await Revision.findById(currentRevisionId);
        await toDisconnectBdd();

        expect(currentRevisionId).toEqual(userInfos.currentRevision.toString());
        expect(curentRevisionInBdd).toEqual(expect.objectContaining(newRevision));
    });

    test("Changer le status d'une révision", async () => {
        const statusDispo = ["pickUp", "edlPickUp", "backToGarage", "dropUp", "edlDropUp"];
        const statusChoisie = statusDispo[randNb(statusDispo.length)];

        await toConnectBdd();
        const userInfos = await signIn(newUserInfos.email, newUserInfos.passwd);
        const currentRevision = await Revision.findById(userInfos.currentRevision);
        await toDisconnectBdd();

        const response = await queryBdd("updateRevisionStatus", {
            revisionId: userInfos.currentRevision,
            statusChoisie: statusChoisie,
            newValue: "start"
        });

        expect(response.status).toEqual(200);
        const curentRevisionUpdated = await response.json();
        expect(curentRevisionUpdated[statusChoisie].status).toEqual("start");
    });

    test("Ajouter des defaults pour les etats des lieux (edl) edlPickUp ou edlDropUp", async () => {
        const edlsType = ["edlDropUp", "edlPickUp"];
        const edlChoisie = edlsType[randNb(edlsType.length)];

        await toConnectBdd();
        const userInfos = await signIn(newUserInfos.email, newUserInfos.passwd);
        await toDisconnectBdd();

        const edl = {
            commentaire: "quelque rayure",
            posX: "120px",
            posY: "200px",
        };
        const response = await queryBdd("updateRevisionEdl", {
            revisionId: userInfos.currentRevision,
            typeEdl: edlChoisie,
            edls: edl,
        });

        expect(response.status).toEqual(200);

        await toConnectBdd();
        const currentRevisionInBdd = await Revision.findById(userInfos.currentRevision);
        await toDisconnectBdd();

        const edlsInBdd = currentRevisionInBdd[edlChoisie].default;
        expect(edlsInBdd).toEqual(expect.arrayContaining([edl]));

        // deuxième tentative
        const edl2 = {
            commentaire: "quelque rayure",
            posX: "120px",
            posY: "200px",
        };
        const response2 = await queryBdd("updateRevisionEdl", {
            revisionId: userInfos.currentRevision,
            typeEdl: edlChoisie,
            edls: edl2,
        });

        expect(response2.status).toEqual(200);

        await toConnectBdd();
        const currentRevisionInBdd2 = await Revision.findById(userInfos.currentRevision);
        await toDisconnectBdd();

        const edlsInBdd2 = currentRevisionInBdd[edlChoisie].default;
        expect(edlsInBdd2).toEqual(expect.arrayContaining([edl2]));
    });
});