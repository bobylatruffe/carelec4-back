import React from 'react';

import './Contact.css';

import notreGarage3 from './notre-garage-3.png';  /* map du garage */
import facebook from './facebook.png'
import instagram from './instagram.png'
import twitter from './twitter.png'

class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nom: "",
            email: "",
            message: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ nom: event.target.nom });
        this.setState({ email: event.target.email });
        this.setState({ message: event.target.message });
    }

    handleSubmit(event) {
        event.preventDefault();
        var nom_var = this.state.nom;
        var email_var = this.state.email;
        var message_var = this.state.message;

        nom_var.push(this.state.nom);
        email_var.push(this.state.email);
        message_var.push(this.state.message);

        this.setState({ nom: nom_var });
        this.setState({ email: email_var });
        this.setState({ message: message_var });
    }

    render() {
        const { nom, email, message } = this.state
        return (
            <div className='contact-container'>
                <div className='content-n'>
                    <div className='txt-left-container'>
                        <div className='txt-left'>
                            <h1>Nos coordonnées :</h1>
                            <p>8 rue de la liberté</p>
                            <p>67 000 STRASBOURG</p>
                            <p><a href="tel:+33385459621">03 85 45 96 21</a></p>
                            <p><a href="tel:+33645789512">06 45 78 95 12</a></p>
                            <br></br>
                            <a href="https://www.facebook.com/">
                                <img src={facebook} class="meme_hauteur" />
                            </a>
                            <a href="https://www.instagram.com/">
                                <img src={instagram} class="meme_hauteur" />
                            </a>
                            <a href="https://twitter.com/">
                                <img src={twitter} class="meme_hauteur" />
                            </a>
                            <form onSubmit={this.handleSubmit}>
                                <br></br>
                                <br></br>
                                <h1>Formulaire de contact :</h1>
                                <label >
                                    Nom :&nbsp;
                                    <input
                                        type="text"
                                        value={this.state.nom}
                                        onChange={this.handleChange} />
                                </label>
                                <br></br>
                                <br></br>
                                <label>
                                    Email :&nbsp;
                                    <input
                                        type="email"
                                        value={this.state.email}
                                        onChange={this.handleChange} />
                                </label>
                                <br></br>
                                <br></br>
                                <label>
                                    Message :
                                    <br></br>
                                    <textarea
                                        rows="5"
                                        cols="50"
                                        type="text"
                                        value={this.state.message}
                                        onChange={this.handleChange} >
                                        Vous pouvez écrire ici.
                                    </textarea>
                                </label>
                                <input type="submit" value="Envoyer" />
                            </form>
                        </div>
                    </div>
                    <a href="https://www.google.fr/maps/">
                        <img src={notreGarage3} className='img-right' />
                    </a>
                </div>
            </div>
        )
    }
}

export default Contact;