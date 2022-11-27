import { useEffect, useState } from "react";
import { queryBdd } from "../../utilitaires/serveurBdd";
import { queryCarnetsEntretiens } from "../../utilitaires/serveurCarnetsEntretiens";
import { setSession } from "../../utilitaires/session";

import "./ShowRevision.scss";

async function fetchCarInfos(voitureId) {
    let userCar = null;
    try {
        userCar = await queryBdd("getUserCar", { voitureId, })
        return userCar;
    } catch (err) {
        return Promise.reject(err.message);
        // return null;
    }
}

async function fetchRevision({ marque, model, motor }) {
    let allRevision = null;
    try {
        allRevision = await queryCarnetsEntretiens(`${marque}/${model}.json/${motor}?what=km`);
        return allRevision
    } catch (err) {
        console.log(err.message);
        return null;
    }
}

function findBestRevisionForKm(revisions, km, setRevisionPropose) {
    let bestRevision = null;

    for (let revision in revisions) {
        const kmInRevision = parseInt(revision.replaceAll(/[\u00a0km]/g, ""));

        if (km > kmInRevision)
            continue;

        bestRevision = revisions[revision];
        break;
    }

    if (!bestRevision)
        bestRevision = revisions[Object.keys(revisions)[Object.keys(revisions).length - 1]];

    setRevisionPropose(bestRevision);
}

function testerPresenceStrDansTab(str, tab) {
    for (let item of tab) {
        if (str === item.trim())
            return true;
    }

    return false;
}

// ces données devrait être récupérer du serveur !
const allTaches = ["Révision avec vidange", "Remplacement Kit de Courroie de Distribution", "Remplacement Filtre à air", "Purge du Liquide de Frein", "Remplacement Filtre d’Habitacle", "Remplacement Courroie d\u2019Accessoires", "Remplacement Filtre à Carburant", "Vidange de Boîte de Vitesses Manuelle", "Remplacement Bougies d’Allumage"];

function ShowRevision({ voitureId, email, setUserInfos, setAddRevision }) {
    const [userCar, setUserCar] = useState(null);
    const [revisions, setRevisions] = useState(null);
    const [revisionPropose, setRevisionPropose] = useState([]);
    const [tachesDispo, setTachesDispo] = useState([]);

    const [choisirDate, setChoisirDate] = useState(null);
    const [dateChoisie, setDateChoisie] = useState(null);
    const [creneauChoisie, setCreaneauChoisie] = useState(null);

    useEffect(() => {
        if (voitureId) {
            fetchCarInfos(voitureId)
                .then(carInfos => setUserCar(carInfos))
                .catch(err => window.alert(err))
        }
    }, [voitureId]);

    useEffect(() => {
        if (userCar) {
            fetchRevision(userCar)
                .then(response => setRevisions(response));
        }
    }, [userCar]);

    useEffect(() => {
        if (revisions) {
            findBestRevisionForKm(revisions, userCar.km, setRevisionPropose);
        }
    }, [revisions, userCar]);

    useEffect(() => {
        if (revisions) {
            setTachesDispo(allTaches.filter(tache => !testerPresenceStrDansTab(tache, revisionPropose)));
        }
    }, [revisionPropose, revisions]);

    const handlerRemoveTache = (e) => {
        const newRevisionPropose = Object.assign([], revisionPropose)
        newRevisionPropose.splice(newRevisionPropose.indexOf(e), 1);

        setRevisionPropose(newRevisionPropose);
    }

    const handlerAddTache = (e) => {
        if (e.target.value) {
            const newRevisionPropose = Object.assign([], revisionPropose)
            newRevisionPropose.push(e.target.value);

            setRevisionPropose(newRevisionPropose);
        }
    }

    const handlerChoisirDate = (e, type) => {
        // e.preventDefault();

        if (!e.target.className) {
            e.target.className = "active"
            e.target.disabled = true;
        }
        else {
            e.target.className = "";
        }

        for (let button of document.querySelectorAll(`#${type} > button`)) {
            if (button === e.target)
                continue;

            button.className = "";
            button.disabled = false;
        }
        if (type === "dates")
            setDateChoisie(e.target.value);
        else
            setCreaneauChoisie(e.target.value);
    }

    const handlerValiderRdv = async (e) => {
        console.log(new Date(`${dateChoisie}T${creneauChoisie}`));
        console.log(email);

        let revisionId = null;
        try {
            revisionId = await queryBdd("addRevisionToUser", {
                email,
                newRevision: {
                    dateProgrammer: new Date(`${dateChoisie}T${creneauChoisie}`)
                }
            });
        } catch (err) {
            console.log(err.message);
        }

        const entretiens = [];
        revisionPropose.forEach(async tache => {
            entretiens.push({ status: "noStart", tache, })
        });

        try {
            await queryBdd("addTacheInRevision", {
                revisionId,
                newTache: entretiens
            });
        } catch (err) {
            window.alert(err.message);
            return null;
        }

        let newUserInfos = null;
        try {
            newUserInfos = await queryBdd("getUserInfos", { email });
            setUserInfos(newUserInfos);
            setSession("userInfos", newUserInfos);
            setAddRevision(null);
        } catch (err) {
            console.log(err.message);
            return null;
        }
    }

    return (
        <div id="ShowRevision">
            {userCar && !choisirDate &&
                <>
                    <p><strong><span className="red">Personnalisez</span> l'entretien de votre véhicule</strong></p>
                    <p>Voici de ce qui est recommandé pour votre {userCar.marque} {userCar.motor} à {userCar.km} km</p>
                    <br />

                    <div className="taches">
                        {revisionPropose.map(revision =>
                            <div className="tache" key={revision}>
                                <p>{revision}</p>
                                <div className="clickable" onClick={() => handlerRemoveTache(revision)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
                                        <path id="Tracé_7" data-name="Tracé 7" d="M20,6.511,18.489,5,12.5,10.989,6.511,5,5,6.511,10.989,12.5,5,18.489,6.511,20,12.5,14.011,18.489,20,20,18.489,14.011,12.5Z" transform="translate(-5 -5)" />
                                    </svg>
                                </div>
                            </div>

                        )}
                        {tachesDispo.length > 0 &&
                            <select name="addTache" id="addTache" onChange={handlerAddTache}>
                                <option value="">Selectionner une tâche à ajouter</option>
                                {tachesDispo.map(tache => <option key={tache}>{tache}</option>)}
                            </select>
                        }
                    </div>

                    {revisionPropose.length > 0 &&
                        <>
                            <br />
                            <button onClick={() => setChoisirDate(true)}>Prendre rendez-vous</button>
                        </>
                    }
                </>
            }
            {userCar && choisirDate &&
                <div id="ChoisirDate">
                    <p><strong><span className="red">Resumer</span> de votre entretien</strong></p>
                    <br />
                    <p>Votre véhicule :</p>
                    <p>{userCar.immat}</p>
                    <p>{userCar.marque} {userCar.motor}</p>
                    <p>{userCar.km} km</p>
                    <br />

                    <p>Tâches à accomplir :</p>
                    {revisionPropose.map(tache => <p key={tache}>{tache}</p>)}
                    <br />
                    <br />
                    <br />

                    <p><strong>Choisissez la <span className="red">date</span> que vous souhaitez pour qu'on réalise l'entretien de votre véhicule</strong></p>

                    {/* faut que les données des différents bouton soit généré par le serveur  */}
                    <div id="dates">
                        <button value="2022-10-10" onClick={(e) => handlerChoisirDate(e, "dates")}>Lun 10/10</button>
                        <button value="2022-10-11" onClick={(e) => handlerChoisirDate(e, "dates")}>Mar 11/10</button>
                        <button value="2022-10-12" onClick={(e) => handlerChoisirDate(e, "dates")}>Mer 12/10</button>
                        <button value="2022-10-13" onClick={(e) => handlerChoisirDate(e, "dates")}>Jeu 13/10</button>
                        <button value="2022-10-10" onClick={(e) => handlerChoisirDate(e, "dates")}>Lun 10/10</button>
                        <button value="2022-10-11" onClick={(e) => handlerChoisirDate(e, "dates")}>Mar 11/10</button>
                        <button value="2022-10-12" onClick={(e) => handlerChoisirDate(e, "dates")}>Mer 12/10</button>
                        <button value="2022-10-13" onClick={(e) => handlerChoisirDate(e, "dates")}>Jeu 13/10</button>
                    </div>
                    <br />
                    <br />
                    <br />

                    {dateChoisie &&
                        <>
                            <p><strong>Indiquez-nous le <span className="red">créneau horaire</span> à lequel nous puissions récupérer votre véhicule</strong></p>
                            <div id="heures">
                                <button value="08:00" onClick={(e) => handlerChoisirDate(e, "heures")}>08h00 et 09h00</button>
                                <button value="09:00" onClick={(e) => handlerChoisirDate(e, "heures")}>09h00 et 10h00</button>
                                <button value="11:00" onClick={(e) => handlerChoisirDate(e, "heures")}>11h00 et 12h00</button>
                                <button value="14:00" onClick={(e) => handlerChoisirDate(e, "heures")}>14h00 et 15h00</button>
                            </div>
                            <br />
                            <br />
                            <br />
                        </>
                    }

                    {creneauChoisie &&
                        <>
                            <button onClick={handlerValiderRdv}>Valider mon rendez-vous</button>
                        </>
                    }
                </div>
            }

        </div >
    )
}

export default ShowRevision;