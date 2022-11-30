import React from 'react';


import "./Footer.css"

class Footer extends React.Component {
  render() {

    // eslint-disable-next-line 
    return (
      <nav className='footer'>
        <div className='footer-container'>
          <ul>
            <li><a href='/' className='logo'><span className='red'>Car</span>Elec</a></li>
            <br></br>
            <div id='col'>
              <p>
                <li><a href='/NotreGarage'>Qui sommes-nous ?</a></li><br></br>
                <li><a href='/Aides'>Contactez-nous</a></li>
              </p>
              <p>
                <br></br>
                <li><a href='#versMention'>Mentions légales</a></li><br></br>
                <li><a href='#versConditions'>Conditions générales</a></li>
              </p>
              <p>
                <li><a href='/'>Nous sommes ouverts du lundi au vendredi <br></br>de 9h à 12h et de 13h à 17h30.<br></br>Le samedi de 9h à 12h.</a></li>
              </p>
            </div>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Footer;