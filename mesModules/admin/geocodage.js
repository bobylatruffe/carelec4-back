const fetch = require("node-fetch");

async function getLatLongFromAdresseAndCp(adresse, cp) {
    
    // https://adresse.data.gouv.fr/api-doc/adresse
    const reponse = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${adresse}&postcode=${cp}&limit=1`);

    const reponseJson = await reponse.json();

    return {
        lat: reponseJson.features[0].geometry.coordinates[1],
        lng: reponseJson.features[0].geometry.coordinates[0],
    }
}

module.exports = getLatLongFromAdresseAndCp;