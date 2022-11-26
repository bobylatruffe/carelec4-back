import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import "./Admin.scss";

import { queryAdmin } from "../../utilitaires/serveurAdmin";
import { queryBdd } from "../../utilitaires/serveurBdd";
import ResumerRevision from "../ResumerRevision/ResumerRevision";
import DetailRevisionAdmin from "./DetailRevisionAdmin/DetailRevisionAdmin";

async function fetchVoiture(voitureId) {
    try {
        const voiture = await queryBdd("getUserCar", { voitureId });
        return voiture;
    } catch (err) {
        console.log(err.message);
        return null;
    }
}

async function fetchCurrentRevision(revisionId) {
    try {
        const currentRevision = await queryBdd("getCurrentRevision", { revisionId });
        return currentRevision;
    } catch (err) {
        console.log(err.message);
        return null;
    }
}

async function fetchAllUsersWithCurrentRevision(setAllUserWithCurrentRevision, email) {
    const allUsersWithCurrentRevision = [];
    try {
        const allUsers = await queryAdmin("users", null, "GET");
        for (let user of allUsers) {
            if (user.currentRevision) {
                user.currentRevision = await fetchCurrentRevision(user.currentRevision);
                user.voiture = await fetchVoiture(user.voiture);
                allUsersWithCurrentRevision.push(user);
            }
        }

        if (email) {
            for (let user of allUsers) {
                if (user.email === email)
                    return user;
            }

            return null;
        }

        setAllUserWithCurrentRevision(allUsersWithCurrentRevision);
    } catch (err) {
        console.log(err.message);
    }
}

function searchInAllUsers(search, allUsersWithCurrentRevision, setAllUserWithCurrentRevisionFiltered) {
    search = search.toLowerCase();
    const newAllUsersWithCurrentRevisionFiltered = [];
    for (let user of allUsersWithCurrentRevision) {
        if (user.email.toLowerCase().includes(search)
            || user.voiture.immat.toLowerCase().includes(search)
            || user.voiture.marque.toLowerCase().includes(search)
            || user.portable.toLowerCase().includes(search)
            || user.nom.toLowerCase().includes(search)
        ) {
            newAllUsersWithCurrentRevisionFiltered.push(user);
        }
    }

    setAllUserWithCurrentRevisionFiltered(newAllUsersWithCurrentRevisionFiltered);
}

function Admin() {
    const [allUsersWithCurrentRevision, setAllUserWithCurrentRevision] = useState(null);
    const [allUsersWithCurrentRevisionFiltered, setAllUserWithCurrentRevisionFiltered] = useState(null);

    useEffect(() => {
        if (allUsersWithCurrentRevisionFiltered === null) {
            fetchAllUsersWithCurrentRevision(setAllUserWithCurrentRevision);
        }
    }, [allUsersWithCurrentRevisionFiltered]);

    const handlerSearchRevision = (e) => {
        if (!e.target.value) {
            setAllUserWithCurrentRevisionFiltered(null);
            return;
        }

        searchInAllUsers(e.target.value, allUsersWithCurrentRevision, setAllUserWithCurrentRevisionFiltered);
    }

    return (
        <>
            <Routes>
                <Route index element={
                    <div id="Admin">
                        <input placeholder="Rechercher une révision par email, marque, date de programmation, portable ..." onChange={handlerSearchRevision} />
                        <hr />

                        {allUsersWithCurrentRevision && !allUsersWithCurrentRevisionFiltered && allUsersWithCurrentRevision.map(user =>
                            <ResumerRevision
                                key={user._id}
                                userInfos={{
                                    nom: user.nom,
                                    prenom: user.prenom,
                                    adresse: user.adresse,
                                    ville: user.ville,
                                    cp: user.cp,
                                    portable: user.portable,
                                    email: user.email,
                                }}
                                currentRevision={user.currentRevision}
                                voiture={user.voiture}
                            />)
                        }

                        {allUsersWithCurrentRevisionFiltered && allUsersWithCurrentRevisionFiltered.map(user =>
                            <ResumerRevision
                                key={user._id}
                                userInfos={{
                                    nom: user.nom,
                                    prenom: user.prenom,
                                    adresse: user.adresse,
                                    ville: user.ville,
                                    cp: user.cp,
                                    portable: user.portable,
                                    email: user.email,
                                }}
                                currentRevision={user.currentRevision}
                                voiture={user.voiture}
                            />)
                        }
                    </div>
                } />

                <Route path="details/:userInfosEmail" element={
                    <DetailRevisionAdmin

                    />
                } />
            </Routes>
        </>
    )
}

export { Admin, fetchAllUsersWithCurrentRevision }