import { useEffect, useState } from "react";
import io from "socket.io-client";
import L from "leaflet";

import "./TrackLive.scss";

function getLatLong(pos, setLastPos, socket, id) {
    const latLong = [pos.coords.latitude, pos.coords.longitude];
    socket.emit("lastPos", { latLong, id });
    setLastPos(latLong);
}

let socket = null;

function TrackLive({ id, type, setParentCurrentRender, admin }) {
    const [lastPos, setLastPos] = useState([]);
    const [map, setMap] = useState(null);
    const [garagisteMarker, setGaragisteMarker] = useState(null);
    const [userMarker, setUserMarker] = useState(null);
    const [userPos, setUserPos] = useState(null);
    const [renderForAdmin, setRenderForAdmin] = useState(null);

    const handlerIArrived = () => {
        socket.emit(id + "arrived");
        handlerClose();
    }

    if (admin && !renderForAdmin) {
        setRenderForAdmin(<>
            <button onClick={handlerIArrived}>Je suis arrivé</button>
        </>)
    }

    const handlerClose = (e) => {
        setParentCurrentRender(null);
        window.location.reload();
    }

    useEffect(() => {
        socket = io("https://bozlak.ddns.net/");
        let watcher = null;

        socket.on("connect", () => {
            socket.emit("revisionId", {id, admin: false, type});
            socket.on(id + "userPos", (userLatLong) => {
                console.log(userLatLong);
                setUserPos(userLatLong);
            });

            if (admin) {
                socket.emit("revisionId", {id, admin: true, type});
                watcher = navigator.geolocation.watchPosition((pos) => getLatLong(pos, setLastPos, socket, id));
            } else {
                socket.on(id + "lastPos", (latLong) => {
                    setLastPos(latLong);
                });
            }
        });

        const map = L.map("map").setView([46.232192999999995, 2.209666999999996], 6);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const garagisteMarker = L.marker([0, 0]).addTo(map);
        const garagistePopup = L.popup().setContent("Garagiste : Je suis en route ...");
        garagisteMarker.bindPopup(garagistePopup).openPopup();
        const userMarker = L.marker([0, 0]).addTo(map);
        setMap(map);
        setUserMarker(userMarker);
        setGaragisteMarker(garagisteMarker);

        return () => {
            socket.disconnect();
            navigator.geolocation.clearWatch(watcher);
        }
    }, [admin, id, type]);

    useEffect(() => {
        if (lastPos.length !== 0 && garagisteMarker && map) {
            garagisteMarker.setLatLng(lastPos);
            map.fitBounds([lastPos, userPos]);
        }
    }, [lastPos, garagisteMarker, map, userPos]);

    useEffect(() => {
        if (userMarker && userPos) {
            userMarker.setLatLng(userPos);
            map.fitBounds([userPos]);
        }
    }, [userMarker, userPos, map]);

    return (
        <div id="TrackLive">
            <span id="clickable" onClick={handlerClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15">
                    <path id="Tracé_7" data-name="Tracé 7" d="M20,6.511,18.489,5,12.5,10.989,6.511,5,5,6.511,10.989,12.5,5,18.489,6.511,20,12.5,14.011,18.489,20,20,18.489,14.011,12.5Z" transform="translate(-5 -5)" />
                </svg>
            </span>

            <div id="map">

            </div>

            {renderForAdmin}
        </div>
    )
}

export default TrackLive;