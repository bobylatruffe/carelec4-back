import { useNavigate } from "react-router-dom";
import "./ResumerRevision.scss";

function findFirstNoStart(currentRevision) {
    for (let tache in currentRevision) {
        if (currentRevision[tache].status === "noStart")
            return tache;
    }
}

function ResumerRevision({ userInfos, currentRevision, voiture }) {
    const navigate = useNavigate();

    if (!currentRevision)
        return null;
        
    const firstNoStart = findFirstNoStart(currentRevision);

    return (
        <div className="ResumerRevision"
            onClick={() => navigate("details/" + userInfos.email)}
        >
            <p className="currentTache">{firstNoStart}</p>
            <p className="date">{new Date(currentRevision.dateProgrammer).toLocaleString()}</p>
            <br />

            <p>{userInfos.nom} {userInfos.prenom}</p>
            <p>{userInfos.adresse} {userInfos.cp} {userInfos.ville}</p>
            <p>{userInfos.portable}</p>
            <p>{userInfos.email}</p>
            <br />

            <p>{voiture.immat}</p>
            <p>{voiture.km} km</p>
            <p>{voiture.marque}</p>
            <p>{voiture.motor}</p>
            <br />

            {currentRevision.entretien.map(tache =>
                <p className={tache.status === "end" ? "barrer" : ""} key={tache.tache}>{tache.tache}</p>)
            }
        </div>
    )
}

export default ResumerRevision;