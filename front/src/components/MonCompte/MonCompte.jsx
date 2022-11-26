import { useState } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { queryBdd } from "../../utilitaires/serveurBdd";
import { getSession, removeSession, setSession } from "../../utilitaires/session";

import "./MonCompte.scss";
import MonVehicule from "./MonVehicule/MonVehicule";
import RevisionEnCours from "./RevisionEnCours/RevisionEnCours";

function MonCompte() {
    const [userInfos, setUserInfos] = useState(null);
    const [userInfosUpdated, setUserInfosUpdated] = useState({});
    //eslint-disable-next-line
    const [alreadySignIn, _] = useState(
        () => {
            // faut vérifier que les données dans la sessions sont valide !!!
            const userInfosInSession = getSession("userInfos");
            if (!userInfosInSession)
                return <Navigate to="/SignIn" replace={true} />

            setUserInfos(userInfosInSession);
        }
    );

    const handlerUpdateUserInfos = (e) => {
        setUserInfosUpdated({
            ...userInfosUpdated,
            [e.target.name]: e.target.value
        });
    };

    const updateUserInfos = async (e) => {
        e.preventDefault();

        const userInfosUpdatedCleaned = {};
        for (let ppt in userInfosUpdated) {
            if (userInfosUpdated[ppt])
                userInfosUpdatedCleaned[ppt] = userInfosUpdated[ppt];
        }

        if (Object.keys(userInfosUpdatedCleaned).length === 0) {
            window.alert("Aucune information à mettre à jour");
            return;
        }

        userInfosUpdatedCleaned.email = userInfos.email;

        let newUserInfos = null;
        try {
            newUserInfos = await queryBdd("updateUserInfos", userInfosUpdatedCleaned);
        } catch (err) {
            window.alert(err.message);
            return
        }

        window.alert("Informations mises à jour");

        const allInput = document.querySelectorAll("input");
        for (let input of allInput)
            input.value = "";

        setSession("userInfos", newUserInfos);
        setUserInfos(newUserInfos);
        setUserInfosUpdated({});
    };

    return (
        <>
            {alreadySignIn ? alreadySignIn :
                userInfos ?
                    <div id="MonCompte">
                        <h1><span className="red">Bonjour</span> {userInfos.nom} {userInfos.prenom}</h1>
                        <h2>Suivez une révision en cours, modifier vos informations personnelles</h2>

                        <div id="container">
                            <div id="sousMenu">
                                <NavLink to="/MonCompte">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                        <path id="Tracé_2" data-name="Tracé 2" d="M19,3H5A2.006,2.006,0,0,0,3,5V19a2.006,2.006,0,0,0,2,2H19a2.006,2.006,0,0,0,2-2V5A2.006,2.006,0,0,0,19,3ZM14,17H7V15h7Zm3-4H7V11H17Zm0-4H7V7H17Z" transform="translate(-3 -3)" />
                                    </svg>Mes informations
                                </NavLink>
                                <NavLink to="MonVehicule">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 16">
                                        <path id="Tracé_3" data-name="Tracé 3" d="M18.92,6.01A1.494,1.494,0,0,0,17.5,5H6.5A1.5,1.5,0,0,0,5.08,6.01L3,12v8a1,1,0,0,0,1,1H5a1,1,0,0,0,1-1V19H18v1a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1V12ZM6.5,16A1.5,1.5,0,1,1,8,14.5,1.5,1.5,0,0,1,6.5,16Zm11,0A1.5,1.5,0,1,1,19,14.5,1.5,1.5,0,0,1,17.5,16ZM5,11,6.5,6.5h11L19,11Z" transform="translate(-3 -5)" />
                                    </svg>
                                    Mon véhicule
                                </NavLink>
                                <NavLink to="RevisionEnCours">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 21.375">
                                        <path id="Tracé_4" data-name="Tracé 4" d="M17.747,13.125a1.373,1.373,0,1,0-1.372-1.373A1.364,1.364,0,0,0,17.747,13.125ZM6.88,11.752A1.372,1.372,0,1,0,8.252,10.38,1.371,1.371,0,0,0,6.88,11.752ZM8.061,4.125l-1.5,4.5H19.424l-1.5-4.5ZM17.815,3a1.407,1.407,0,0,1,1.035.608.476.476,0,0,1,.056.079,1.862,1.862,0,0,1,.214.45c.247.731,1.755,5.265,1.755,5.265v7.312a.894.894,0,0,1-.878.911h-.5a.894.894,0,0,1-.877-.911V15.375H7.375v1.339a.894.894,0,0,1-.878.911H6a.894.894,0,0,1-.878-.911V9.4S6.633,4.879,6.869,4.125a2.09,2.09,0,0,1,.214-.45.382.382,0,0,0,.067-.067A1.407,1.407,0,0,1,8.185,3ZM4,18.761H22V21H14.125v3.375h-2.25V21H4Z" transform="translate(-4 -3)" />
                                    </svg>
                                    Révision en cours
                                </NavLink>
                                <NavLink to="Historique">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 21 18">
                                        <path id="Tracé_5" data-name="Tracé 5" d="M13,3a9,9,0,0,0-9,9H1l3.89,3.89.07.14L9,12H6a7.034,7.034,0,1,1,2.06,4.94L6.64,18.36A9,9,0,1,0,13,3ZM12,8v5l4.28,2.54L17,14.33l-3.5-2.08V8Z" transform="translate(-1 -3)" />
                                    </svg>
                                    Historique de révision
                                </NavLink>
                                <NavLink to="/" className="red" onClick={() => removeSession("userInfos")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 18">
                                        <path id="Tracé_8" data-name="Tracé 8" d="M17,7,15.59,8.41,18.17,11H8v2H18.17l-2.58,2.58L17,17l5-5ZM4,5h8V3H4A2.006,2.006,0,0,0,2,5V19a2.006,2.006,0,0,0,2,2h8V19H4Z" transform="translate(-2 -3)" />
                                    </svg>
                                    Deconnexion
                                </NavLink>
                            </div>

                            <div id="content">
                                <Routes>
                                    <Route index element={
                                        <form onSubmit={updateUserInfos}>
                                            <h3>Mes informations personnelles</h3>
                                            <hr />
                                            <label htmlFor="nom">Nom</label>
                                            <input type="text" placeholder={userInfos.nom} name="nom" id="nom" onChange={handlerUpdateUserInfos} />
                                            <br />
                                            <label htmlFor="prenom">Prenom</label>
                                            <input type="text" placeholder={userInfos.prenom} name="prenom" id="prenom" onChange={handlerUpdateUserInfos} />
                                            <br />
                                            <label htmlFor="adresse">Adresse postale</label>
                                            <input type="text" placeholder={userInfos.adresse} name="adresse" id="adresse" onChange={handlerUpdateUserInfos} />
                                            <br />
                                            <label htmlFor="ville">Ville</label>
                                            <input type="text" placeholder={userInfos.ville} name="ville" id="ville" onChange={handlerUpdateUserInfos} />
                                            <br />
                                            <label htmlFor="cp">Code postale</label>
                                            <input type="number" placeholder={userInfos.cp} name="cp" id="cp" onChange={handlerUpdateUserInfos} />
                                            <br />
                                            <br />
                                            <h3>Mes informations de contact</h3>
                                            <hr />
                                            <label htmlFor="email">Adresse email</label>
                                            <input type="text" placeholder={userInfos.email} name="email" id="email" disabled />
                                            <br />
                                            <label htmlFor="portable">Numéro de portable</label>
                                            <input type="text" placeholder={userInfos.portable} name="portable" id="portable" disabled />
                                            <br />

                                            <button>Mettre à jour</button>
                                        </form>
                                    } />

                                    <Route path="MonVehicule" element={<MonVehicule voitureId={userInfos.voiture} email={userInfos.email} setUserInfos={setUserInfos} />} />

                                    <Route path="RevisionEnCours" element={<RevisionEnCours revisionId={userInfos.currentRevision} voitureId={userInfos.voiture} email={userInfos.email} setUserInfos={setUserInfos}/>} />
                                </Routes>
                            </div>
                        </div>
                    </div>
                    : null
            }
        </>
    )
}

export default MonCompte;