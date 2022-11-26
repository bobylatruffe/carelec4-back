import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import "./SignIn.scss";

import { queryBdd } from "../../utilitaires/serveurBdd";
import { getSession, setSession } from "../../utilitaires/session";

function SignIn() {
    // eslint-disable-next-line
    const [alreadySignIn, _] = useState(
        () => {
            if (getSession("userInfos"))
                return <Navigate to="/MonCompte" replace={true} />

            return null;
        }
    )
    const [email, setEmail] = useState("");
    const [passwd, setPasswd] = useState("");
    const navigate = useNavigate();

    const updateEmail = (e) => {
        setEmail(e.target.value);
    }

    const updatePasswd = (e) => {
        setPasswd(e.target.value);
    }

    const signIn = async (e) => {
        e.preventDefault();

        // en vrai pas nécessaire puisque l'élément possède l'attribut required
        if (!email) {
            window.alert("Email manquant");
            return;
        }

        if (!passwd) {
            window.alert("Mot de passe manquant");
            return;
        }

        let tryToSignIn = null;
        try {
            tryToSignIn = await queryBdd("signIn", { email, passwd });
        } catch (err) {
            window.alert(err.message);
            return;
        }

        setSession("userInfos", tryToSignIn);
        navigate("/MonCompte", { replace: true });
    }

    return (
        <>
            {!alreadySignIn ?
                <div id="SignIn">
                    <div className="deco"></div>
                    <div className="container">
                        <div className="contain">
                            <h1><span className="red">Connectez</span>-vous</h1>
                            <h2>Afin de programmer un entretien, suivre l'avancement d'un entretien déjà programmé, ou encore consulter l'historique des entretiens.</h2>

                            <form onSubmit={signIn}>
                                <input type="email" placeholder="votre@email.fr" name="email" onChange={updateEmail} required />
                                <br />
                                <input type="password" placeholder="mot de passe" name="passwd" onChange={updatePasswd} required />
                                <br />
                                <button>Me connecter</button>

                                <div id="pasDeCompte">
                                    <p>Pas de compte ?</p>
                                    <Link to="/SignUp">Créer un compte</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div> : alreadySignIn}
        </>
    )
}

export default SignIn;