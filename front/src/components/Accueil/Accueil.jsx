import { useState } from "react";
import "./Accueil.scss";
import AddCar from "../AddCar/AddCar";
import ShowRevision from "../ShowRevision/ShowRevision";

function Accueil() {
    const [currentCar, setCurrentCar] = useState(null);
    console.log(currentCar);

    return (
        <div id="Accueil">
            <div id="container">
                <div id="content">
                    {!currentCar &&
                        <>
                            <h1><span className="red">Enretenir</span> son véhicule depuis son canapé ...</h1>
                            <h2>Plus besoin de se déplacer pour faire entretenir votre véhicule, nous venons la récupérer directement chez vous, pour vous la restituer une fois l'entretien effectué dans notre garage.</h2>


                            <AddCar setAddCar={setCurrentCar} />
                        </>
                    }
                    {currentCar &&
                        <>
                            <ShowRevision currentCar={currentCar}/>
                        </>
                    }
                </div>
            </div>

            <div id="deco">
            </div>
        </div>
    )
}

export default Accueil;