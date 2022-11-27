import { useEffect, useState } from "react";
import { queryBdd } from "../../utilitaires/serveurBdd";
import { queryCarnetsEntretiens } from "../../utilitaires/serveurCarnetsEntretiens";
import { setSession } from "../../utilitaires/session";
import "./AddCar.scss";

function AddCar({ email, setAddCar, setUserInfos }) {
    const [marques, setMarques] = useState(null);
    const [selectedMarque, setSelectedMarque] = useState(null);
    const [models, setModels] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [motors, setMotors] = useState(null);
    const [selectedMotor, setSelectedMotor] = useState(null);
    const [km, setKm] = useState(null);
    const [immat, setImmat] = useState(null);

    useEffect(() => {
        async function fetchAllMarques() {
            let marques = null;
            try {
                marques = await queryCarnetsEntretiens("marques");
                setMarques(marques);
            } catch (err) {
                window.alert(err.message);
            }
        }
        fetchAllMarques();
    }, []);

    useEffect(() => {
        if (!selectedMarque) return;

        async function fetchAllModelsFromSelectedMarque() {
            let models = null;
            try {
                models = await queryCarnetsEntretiens(selectedMarque);
                setModels(models);
            } catch (err) {
                window.alert(err.message);
            }
        }

        fetchAllModelsFromSelectedMarque();
    }, [selectedMarque]);

    useEffect(() => {
        if (!selectedModel || !selectedMarque) return;

        async function fetchAllMotorsFromSelectedModel() {
            let motors = null;
            try {
                motors = await queryCarnetsEntretiens(`${selectedMarque}/${selectedModel}`);
                setMotors(motors);
            } catch (err) {
                window.alert(err.message);
            }
        }

        fetchAllMotorsFromSelectedModel();
    }, [selectedMarque, selectedModel]);

    const handlerSelectedMarque = (e) => {
        if (e.target.value)
            setSelectedMarque(e.target.value);

        setModels(null);
        setSelectedModel(null);
        setMotors(null);
        setSelectedMotor(null);
        setKm(null);
        setImmat(null);
    }

    const handlerSelectedModel = (e) => {
        if (e.target.value)
            setSelectedModel(e.target.value);

        setMotors(null);
        setSelectedMotor(null);
        setKm(null);
        setImmat(null);
    }

    const handlerSelectedMotor = (e) => {
        if (e.target.value)
            setSelectedMotor(e.target.value);
    }

    const handlerImmat = (e) => {
        if (e.target.value)
            setImmat(e.target.value);
        else {
            setImmat(null);
            document.getElementById("km").value = "";
            setKm(null);
        }
    }

    const handlerKm = (e) => {
        if (e.target.value)
            setKm(e.target.value);
        else
            setKm(null);
    }

    const handlerAddCar = async (e) => {
        let userInfosUpdated = null;
        try {
            userInfosUpdated = await queryBdd("addCarToUser", {
                email,
                carData: {
                    marque: selectedMarque,
                    model: selectedModel,
                    motor: selectedMotor,
                    km: parseInt(km),
                    immat,
                }
            });

            setSession("userInfos", userInfosUpdated);
            setUserInfos(userInfosUpdated);
            setAddCar(null);
        } catch (err) {
            window.alert(err.message);
        }
    }

    return (
        <div id="AddCar">
            {marques ?
                <>
                    <select name="marques" onChange={handlerSelectedMarque}>
                        <option value="">Sélectionner la marque</option>
                        {marques.map(marque => <option key={marque} value={marque}>{marque}</option>)}
                    </select>
                    <br />

                    {models ?
                        <>
                            <select name="models" onChange={handlerSelectedModel}>
                                <option value="">Sélectionner le modèle</option>
                                {models.map(model => {
                                    model = model.slice(0, -5);
                                    return <option key={model} value={model}>{model}</option>
                                })}
                            </select>
                            <br />

                            {motors ?
                                <>
                                    <select name="motors" onChange={handlerSelectedMotor}>
                                        <option value="">Sélectionner la motorisation</option>
                                        {motors.map(motor => <option key={motor} value={motor}>{motor}</option>)}
                                    </select>
                                    <br />

                                    {selectedMotor ?
                                        <>
                                            <input type="text" placeholder="Quelle est l'immatriculation ?" onChange={handlerImmat} />
                                            <br />

                                            {immat ?
                                                <>
                                                    <input type="number" placeholder="Quel est le kilométrage ?" onChange={handlerKm} id="km" />
                                                    <br />

                                                    <button type="button" onClick={handlerAddCar}>Valider ce véhicule</button>
                                                </> :
                                                null
                                            }
                                        </> :
                                        null
                                    }
                                </> :
                                null
                            }
                        </> :
                        null
                    }
                </> :
                null
            }
        </div>
    )
}

export default AddCar;