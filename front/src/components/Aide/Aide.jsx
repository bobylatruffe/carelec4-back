import React from 'react';
import Faq from 'react-faq-component';

import './Aide.css';

const data = {
	title: "FAQ - Aide sur CarElec avec les questions les plus frequemment posées",
	rows: [
		{
			title: "Quand puis-je déposer mon véhicule dans le garage CarElec à Strasbourg ?",
			content: "CarElec vous accueille du lundi au vendredi de 9h à 12h et de 13h à 17h30, et le samedi de 9h à 12h."
		},
		{
			title: "Ma voiture est toute neuve, l'entretien peut-il être fait dans un autre garage que chez mon concessionnaire ?",
			content: "Depuis 2002, vous pouvez choisir le garage que vous voulez pour maintenir votre garantie constructeur. Il n'y pas d'obligation à réaliser l'entretien chez un concessionnaire de la marque. Il suffit de respecter les délais d'entretien de votre constructeur pour maintenir la garantie du véhicule. L'équipe CarElec se charge pour vous de l'organisation de votre planning d'entretien en fonction du modèle de votre véhicule."
		},
		{
			title: "Quels sont les délais d'entretien à respecter pour mon véhicule ?",
			content: "Les délais d'entretien dépend du modèle de véhicule. Toutes ces informations sont dans votre manuel d'entretien, généralement dans la section calendrier d'entretien."
		},
		{
			title: "Comment être assuré qu'un garage respecte le suivi du calendrier d'entretien de mon véhicule ?",
			content: "Depuis 2015, les techniciens automobiles peuvent suivre les entretiens recommandés par le constructeur, via un ordinateur dans lequel toutes les maintenances de votre voiture sont répertoriées."
		},
		{
			title: "Les pièces utilisées par CarElec sont-elles identiques à celles du constructeur ?",
			content: "Les pièces utilisées par CarElec sont fabriquées par le constructeur d'origine. La garantie des pièces est parfois plus étendue chez CarElec, que chez le manufacturier."
		},
		{
			title: "Le garage propose t-il le prêt d'un véhicule de remplacement ?",
			content: "CarElec propose toujours un véhicule de remplacement. Si vous faites appel à nos services, le garage CarElec de Strasbourg vous prête un véhicule de remplacement sans surcoût."
		},
		{
			title: "Le contrôle technique, qu'est ce que c'est ?",
			content: "Depuis 1992, le contrôle technique est obligatoire pour tous les véhicules légers. Il doit être effectué avant la quatrième année du véhicule, puis tous les deux ans, dans un centre de contrôle technique agréé."
		},
		{
			title: "Pourquoi acheter un véhicule dans le garage CarElec ?",
			content: "Carelec vous propose de trouver le véhicule qui vous convient. Les avantages d'acheter une voiture chez CarElec sont la garantie de 3 mois des pièces détachées et la prise en charge immédiate de votre véhicule en cas de réparations ou entretiens."
		},
		{
			title: "Quels sont les avantages de Carelec ?",
			content: "La qualité du service, un contrôle stricte des véhicules par le garage, une disponibilité facilitée, une implantation locale dans Strasbourg et sa périphérie"
		}
	]
}

class Aide extends React.Component {
    render() {
		return (
			<div id="aide">
				<Faq 
					data={data} 
					styles={{
						bgColor: "white",
						titleTextColor: "#48482a",
						rowTitleColor: "#78789a",
						rowTitleTextSize: 'large',
						rowContentColor: "#48484a",
						rowContentTextSize: '16px',
						rowContentPaddingTop: '10px',
						rowContentPaddingBottom: '10px',
						rowContentPaddingLeft: '50px',
						rowContentPaddingRight: '150px',
						arrowColor: "black",
					}} 
				/>
			</div>
		)
    }
}

export default Aide