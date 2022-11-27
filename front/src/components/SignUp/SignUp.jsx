import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import "./SignUp.scss";

import { queryBdd } from "../../utilitaires/serveurBdd";
import { getSession, setSession } from "../../utilitaires/session";

function SignUp() {
    // eslint-disable-next-line
    const [alreadySignIn, _] = useState(
        () => {
            if (getSession("userInfos"))
                return <Navigate to="/" replace={true} />

            return null;
        }
    );
    const [newUserInfos, setNewUserInfos] = useState({});
    const navigate = useNavigate();

    const updateNewUserInfos = (e) => {
        setNewUserInfos({
            ...newUserInfos,
            [e.target.name]: e.target.value
        });
    };

    const signUp = async (e) => {
        e.preventDefault();

        if (newUserInfos.email !== newUserInfos.confirmEmail) {
            window.alert("Email ne correspond pas");
            return;
        }

        if (newUserInfos.passwd !== newUserInfos.confirmPasswd) {
            window.alert("Mot de passe ne correspond pas");
            return;
        }

        let tryToSignUp;
        try {
            tryToSignUp = await queryBdd("signUp", newUserInfos);
        } catch (err) {
            window.alert(err.message);
            return;
        }

        // attention faut supp le passwd (coté serveur !!!)
        setSession("userInfos", tryToSignUp);

        navigate("/MonCompte", { replace: true });
    }

    return (
        <>
            {!alreadySignIn ?
                <div id="SignUp">
                    <div className="container">
                        <div className="contain">
                            <h1><span className="red">Créer</span> un compte</h1>
                            <h2>Créer un compte afin de pouvoir réserver un entretien et suivre son avancement, mais également gérer vos informations personnelles.</h2>
                            <form onSubmit={signUp}>
                                <input className="inputLeft" type="text" name="nom" placeholder="Nom" onChange={updateNewUserInfos} required />
                                <input type="text" name="prenom" placeholder="Prenom" onChange={updateNewUserInfos} required />
                                <br />
                                <input className="inputLeft" type="text" name="adresse" placeholder="Adresse postale" onChange={updateNewUserInfos} required />
                                <input type="text" name="ville" placeholder="Ville" onChange={updateNewUserInfos} required />
                                <br />
                                <input className="inputLeft" type="number" name="cp" placeholder="Code postale" onChange={updateNewUserInfos} required />
                                <input type="number" name="portable" placeholder="Numéro de portable" onChange={updateNewUserInfos} required />
                                <br />
                                <input className="inputLeft" type="text" name="email" placeholder="Adresse email" onChange={updateNewUserInfos} required />
                                <input type="text" name="confirmEmail" placeholder="Confirmer adresse email" onChange={updateNewUserInfos} required />
                                <br />
                                <input className="inputLeft" type="password" name="passwd" placeholder="Mot de passe" onChange={updateNewUserInfos} required />
                                <input type="password" name="confirmPasswd" placeholder="Confirmer mot de passe" onChange={updateNewUserInfos} required />
                                <br />

                                <button>Créer mon compte</button>

                                <div id="dejaUnCompte">
                                    <p>Déjà un compte ?</p>
                                    <Link to="/SignIn">Connectez-vous</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="deco"></div>
                </div> : alreadySignIn}
        </>
    );
}

export default SignUp;