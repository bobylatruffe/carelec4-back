import { useState } from "react";
import "./DetailRevision.scss";
import TrackLive from "./TrackLive/TrackLive";

function setHandlerBtn(id, btn, handlerBtn, setCurrentRender) {
    switch (btn.type) {
        case "pickUpAdmin":
            return (e) => {
                setCurrentRender(<TrackLive id={id} type="pickUp" setParentCurrentRender={setCurrentRender} admin={true} />)
            }
        case "pickUp":
            return (e) => {
                setCurrentRender(<TrackLive id={id} setParentCurrentRender={setCurrentRender} />);
            }

        case "edlPickUpAdmin":
            return (e) => {
                setCurrentRender(<p>edlPickUpAdmin</p>);
            }
        case "edlPickUp":
            return (e) => {
                setCurrentRender(<p>edlPickUp</p>);
            }

        case "backToGarageAdmin":
            return (e) => {
                setCurrentRender(<TrackLive id={id} type="backToGarage" setParentCurrentRender={setCurrentRender} admin={true} />);
            }
        case "backToGarage":
            return (e) => {
                setCurrentRender(<TrackLive id={id} setParentCurrentRender={setCurrentRender} />);
            }

        case "dropUpAdmin":
            return (e) => {
                setCurrentRender(<TrackLive id={id} type="dropUp" setParentCurrentRender={setCurrentRender} admin={true} />);
            }
        case "dropUp":
            return (e) => {
                setCurrentRender(<TrackLive id={id} setParentCurrentRender={setCurrentRender} />);
            }

        case "edlDropUpAdmin":
            return (e) => {
                setCurrentRender(<p>edlDropUpAdmin</p>);
            }
        case "edlDropUp":
            return (e) => {
                setCurrentRender(<p>edlDropUp</p>);
            }

        default:
            return null;
    }
}

function DetailRevision({ id, status, right, titre, sousTitre, btn }) {
    const [currentRender, setCurrentRender] = useState(null);

    let handlerBtn = null;
    if (btn) {
        handlerBtn = setHandlerBtn(id, btn, handlerBtn, setCurrentRender);
    }

    return (
        <>
            <div className={"DetailRevision " + (right ? right : "")}>
                <div className={status}>
                    {status === "enCours" ?
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 12">
                                <circle id="Ellipse_2" data-name="Ellipse 2" cx="6" cy="6" r="6" fill="#db0000" />
                            </svg>
                            <p>En cours</p>
                        </>
                        : null
                    }

                    {status === "noStart" ?
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <path id="Tracé_12" data-name="Tracé 12" d="M10,2a8,8,0,1,0,8,8A8,8,0,0,0,10,2ZM9.2,13.2H7.6V6.8H9.2Zm.8,0V6.8L14,10Z" transform="translate(-2 -2)" fill="#f89d00" />
                            </svg>
                            <p>En attente</p>
                        </>
                        : null
                    }

                    {status === "end" ?
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <path id="Tracé_10" data-name="Tracé 10" d="M10,2a8,8,0,1,0,8,8A8,8,0,0,0,10,2ZM8.4,14l-4-4L5.528,8.872,8.4,11.736l6.072-6.072L15.6,6.8Z" transform="translate(-2 -2)" fill="#149f00" />
                            </svg>
                            <p>Terminé</p>
                        </>
                        : null
                    }
                </div>
                <p><strong>{titre}</strong></p>
                <p>{sousTitre}</p>

                {handlerBtn &&
                    <button onClick={handlerBtn}>{btn.titre}</button>
                }


            </div>
            {
                currentRender &&
                currentRender
            }
        </>
    )
}

export default DetailRevision;