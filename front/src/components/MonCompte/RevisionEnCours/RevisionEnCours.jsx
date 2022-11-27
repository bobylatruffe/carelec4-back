import { useEffect, useState } from "react";
import { queryBdd } from "../../../utilitaires/serveurBdd";

import "./RevisionEnCours.scss";

import ShowRevision from "../../ShowRevision/ShowRevision";
import DetailRevision from "./DetailRevision/DetailRevision";

function RevisionEnCours({ revisionId, voitureId, email, setUserInfos }) {
    const [currentRevision, setCurrentRevision] = useState(null);
    const [addRevision, setAddRevision] = useState(null);

    useEffect(() => {
        async function fetchCurrentRevision(revisionId) {
            setCurrentRevision(await queryBdd("getCurrentRevision", { revisionId, }))
        }
        if (revisionId)
            fetchCurrentRevision(revisionId);
    }, [revisionId]);

    const getEnlevementDate = () => {
        const date = new Date(currentRevision.dateProgrammer);
        const hoursPlusOne = new Date(date);
        hoursPlusOne.setHours(hoursPlusOne.getHours() + 1);

        return `Le ${date.toLocaleDateString()} entre ${date.toLocaleTimeString().slice(0, -3).replace(":", "h")} et ${hoursPlusOne.toLocaleTimeString().slice(0, -3).replace(":", "h")}`
    }

    return (
        <div id="RevisionEncours">
            <h3>Révision en cours</h3>
            <hr />

            {
                !revisionId && !addRevision &&
                <>
                    <p>Aucune révision programmé</p>
                    <button onClick={() => setAddRevision(true)}>Programmer une révision</button>
                </>
            }

            {
                addRevision &&
                <>
                    <ShowRevision voitureId={voitureId} email={email} setUserInfos={setUserInfos} setAddRevision={setAddRevision} />
                </>
            }

            {revisionId && currentRevision &&
                <div id="Details">
                    <DetailRevision
                        id={revisionId}
                        status={currentRevision.pickUp.status}
                        titre="Récupération de votre véhicule"
                        sousTitre={getEnlevementDate()}
                        btn={{ titre: "Suivre en direct l'avancement", type: "pickUp" }}
                    />

                    <DetailRevision
                        right="right"
                        status={currentRevision.edlPickUp.status}
                        titre="Etat des lieux de départ"
                        sousTitre="Lorsque que le garagiste arrivera chez vous il réalisera un état des lieux de votre véhicule."
                        btn={{ titre: "Consulter l'état des lieux", type: "edlPickUp" }}
                    />

                    <DetailRevision
                        id={revisionId}
                        status={currentRevision.backToGarage.status}
                        titre="Retour au garage"
                        sousTitre="Le mécanicien est en route vers le garage."
                        btn={{ titre: "Suivre en direct l'avancement", type: "backToGarage" }}
                    />

                    <DetailRevision
                        right="right"
                        titre="Début de la révision"
                        sousTitre="Le mécanicien à commencé l'entretien de votre véhicule"
                    // btn={{ titre: "Suivre en direct l'avancement", type: "backToGarage" }}
                    />

                    {currentRevision.entretien.map(tache =>
                        <DetailRevision
                            key={tache.tache}
                            status={tache.status}
                            right="right"
                            titre={tache.tache}
                        />)
                    }

                    <DetailRevision
                        id={revisionId}
                        status={currentRevision.dropUp.status}
                        titre="Restitution de votre véhicule"
                        sousTitre="Le mécanicien est en route chez vous pour vous réstituer le véhicule."
                        btn={{ titre: "Suivre en direct l'avancement", type: "dropUp" }}
                    />

                    <DetailRevision
                        status={currentRevision.edlDropUp.status}
                        right="right"
                        titre="Etat des lieux de restitution"
                        sousTitre="Lorsque que le garagiste arrivera chez vous il réalisera un état des lieux de votre véhicule."
                        btn={{ titre: "Consulter l'état des lieux", type: "edlDropUp" }}
                    />
                </div>
            }

        </div>
    )
}

export default RevisionEnCours;