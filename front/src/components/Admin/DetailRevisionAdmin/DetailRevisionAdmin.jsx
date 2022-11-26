import { useState } from "react";
import { useParams } from "react-router-dom";

import "./DetailRevisionAdmin.scss";

import DetailRevision from "../../MonCompte/RevisionEnCours/DetailRevision/DetailRevision";
import { fetchAllUsersWithCurrentRevision } from "../Admin";
import { queryBdd } from "../../../utilitaires/serveurBdd";

function getEnlevementDate(dateProgrammer) {
    const date = new Date(dateProgrammer);
    const hoursPlusOne = new Date(date);
    hoursPlusOne.setHours(hoursPlusOne.getHours() + 1);

    return `Le ${date.toLocaleDateString()} entre ${date.toLocaleTimeString().slice(0, -3).replace(":", "h")} et ${hoursPlusOne.toLocaleTimeString().slice(0, -3).replace(":", "h")}`
}

// les 3 fonctions suivantes howRender... devrait être factoriser
function howRenderPickUp(currentRevision) {
    return (<DetailRevision
        id={currentRevision._id}
        status={currentRevision.pickUp.status}
        titre="Récupérer le véhicule"
        sousTitre={getEnlevementDate(currentRevision.dateProgrammer)}
        btn={
            (currentRevision.pickUp.status === "noStart" &&
                { titre: "Chercher le véhicule", type: "pickUpAdmin" }) ||
            (currentRevision.pickUp.status === "enCours" &&
                { titre: "Continuer la recherche du véhicule", type: "pickUpAdmin" })
            // si status === "end" on affiche rien
        }
    />)
}

function howRenderBackToGarage(currentRevision) {
    return (<DetailRevision
        id={currentRevision._id}
        status={currentRevision.backToGarage.status}
        titre="Retourner au garage"
        // sousTitre={getEnlevementDate()}
        btn={
            (currentRevision.backToGarage.status === "noStart" &&
                { titre: "Retourner au garage", type: "backToGarageAdmin" }) ||
            (currentRevision.backToGarage.status === "enCours" &&
                { titre: "Retourner au garage", type: "backToGarageAdmin" })
        }
    />)
}

function howRenderDropUp(currentRevision) {
    return (
        <DetailRevision
            id={currentRevision._id}
            status={currentRevision.dropUp.status}
            titre="Restituer le véhicule"
            btn={
                (currentRevision.dropUp.status === "noStart" &&
                    { titre: "Restituer le véhicule", type: "dropUpAdmin" }) ||
                (currentRevision.dropUp.status === "enCours" &&
                    { titre: "Continuer la restitution du véhicule", type: "dropUpAdmin" })
                // si status === "end" on affiche rien
            }
        />)
}

async function fetchAllUserDataFromEmail(email, setCurrentRevision, setUserInfos, setVoiture) {
    const allUserDataFromEmail = await fetchAllUsersWithCurrentRevision(null, email);
    setUserInfos({
        nom: allUserDataFromEmail.nom,
        prenom: allUserDataFromEmail.prenom,
        adresse: allUserDataFromEmail.adresse,
        ville: allUserDataFromEmail.ville,
        cp: allUserDataFromEmail.cp,
        portable: allUserDataFromEmail.portable,
        email: allUserDataFromEmail.email
    });
    setCurrentRevision(allUserDataFromEmail.currentRevision);
    setVoiture(allUserDataFromEmail.voiture);
}

function DetailRevisionAdmin() {
    const { userInfosEmail } = useParams();
    // const localisation = useLocation();
    // const { currentRevision, userInfos, voiture } = localisation.state;

    const [currentRevision, setCurrentRevision] = useState(null);
    const [userInfos, setUserInfos] = useState(null);
    const [voiture, setVoiture] = useState(null);

    if (!userInfos)
        fetchAllUserDataFromEmail(userInfosEmail, setCurrentRevision, setUserInfos, setVoiture);

    return (
        currentRevision &&
        <div id="DetailRevisionAdmin">
            {/* à supprimer (button), c'est pour pour reset  */}
            <button
                onClick={async () => {
                    await queryBdd("/updateRevisionStatus", {
                        revisionId: currentRevision._id,
                        statusChoisie: "pickUp",
                        newValue: "noStart"
                    });
                    await queryBdd("/updateRevisionStatus", {
                        revisionId: currentRevision._id,
                        statusChoisie: "backToGarage",
                        newValue: "noStart"
                    });
                    await queryBdd("/updateRevisionStatus", {
                        revisionId: currentRevision._id,
                        statusChoisie: "dropUp",
                        newValue: "noStart"
                    });

                    window.location.reload();
                }}
                style={{
                    marginBottom: "100px"
                }}>
                reset
            </button>

            {howRenderPickUp(currentRevision)}

            <DetailRevision
                status={currentRevision.edlPickUp.status}
                titre="Etat des lieux enlevement"
                // sousTitre={getEnlevementDate()}
                btn={{ titre: "Commencer edlPickUp", type: "edlPickUpAdmin" }}
            />

            {howRenderBackToGarage(currentRevision)}

            {currentRevision.entretien.map(tache =>
                <DetailRevision
                    key={tache.tache}
                    status={tache.status}
                    titre={tache.tache}
                />
            )}

            {howRenderDropUp(currentRevision)}

            <DetailRevision
                status={currentRevision.edlDropUp.status}
                titre="Etat des lieux restitution"
                btn={{ titre: "Commencer edlDropUp", type: "edlDropUpAdmin" }}
            />
        </div>
    )
}

export default DetailRevisionAdmin;