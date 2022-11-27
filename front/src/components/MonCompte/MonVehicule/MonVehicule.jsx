import { useEffect, useState } from "react";
import { queryBdd } from "../../../utilitaires/serveurBdd";
import "./MonVehicule.scss";

import AddCar from "../../AddCar/AddCar";

async function fetchCarInfos(voitureId) {
    let userCar = null;
    try {
        userCar = await queryBdd("getUserCar", { voitureId, })
        return userCar;
    } catch (err) {
        // window.alert(err.message);
        return null;
    }
}

function MonVehicule({ voitureId, email, setUserInfos }) {
    const [userCar, setUserCar] = useState(null);
    const [newKm, setNewKm] = useState(null);
    const [addCar, setAddCar] = useState(null);

    useEffect(() => {
        fetchCarInfos(voitureId)
            .then(result => setUserCar(result));
    }, [voitureId]);

    const handlerNewKm = (e) => {
        setNewKm(e.target.value);
    }

    const updateWithNewKm = async (e) => {
        e.preventDefault();

        if (!newKm) {
            window.alert("Pas de nouveau kilométrage");
            return;
        }

        let userCarUpdated = null;
        try {
            userCarUpdated = await queryBdd("updateKmUserCar", { email, newKm: parseInt(newKm) });
            // bon pas obliger de faire ça pour tous les inputs,
            // mais je me dis que plus tard faudrait avoir la possibiliter de changer de voiture aussi
            const allInput = document.querySelectorAll("input");
            for (let input of allInput)
                input.value = "";

            setUserCar(userCarUpdated);
        } catch (err) {
            window.alert(err.message);
            return null;
        }
    }

    const handlerAddCar = () => {
        setAddCar(true);
    }

    return (
        <div id="MonVehicule">

            <h3>Mon vehicule</h3>
            <hr />
            {userCar ?
                <>
                    <form onSubmit={updateWithNewKm}>
                        <label htmlFor="immat">Immatriculation</label>
                        <input type="text" placeholder={userCar.immat} id="immat" name="immat" disabled />
                        <br />
                        <label htmlFor="marque">Marque</label>
                        <input type="text" placeholder={userCar.marque} id="marque" name="marque" disabled />
                        <br />
                        <label htmlFor="model">Modèle</label>
                        <input type="text" placeholder={userCar.model} id="model" name="model" disabled />
                        <br />
                        <label htmlFor="motor">Motorisation</label>
                        <input type="text" placeholder={userCar.motor} id="motor" name="motor" disabled />
                        <br />
                        <label htmlFor="km">Kilométrage actuel</label>
                        <input type="number" placeholder={userCar.km} id="km" name="km" onChange={handlerNewKm} />
                        <br />
                        <button>Mettre à jour le km</button>
                    </form>
                </>
                :
                <>
                    {!addCar ?
                        <>
                            <p>Aucun véhicule enregistré</p>
                            <button id="BtnAddCar" type="button" onClick={handlerAddCar}>Ajouter une voiture</button>
                        </> :
                        < AddCar email={email} setAddCar={setAddCar} setUserInfos={setUserInfos} />
                    }
                </>
            }


        </div>
    )
}

export default MonVehicule;