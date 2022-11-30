import React from 'react';
import './Chatbot.css';

// liste des modèles d'association "saisie utilisateur/réponse du bot"
const patrons = [
	["(.*)(coucou|hello|bonjour|bonsoir|salut)(.*)",  // motif du patron : doit correspondre à la saisie de l'utilisateur pour avoir une réponse du bot
		"Bienvenue sur CarElec. En quoi puis-je vous aider ?",  // début des réponses aléatoires possibles
		"Bonjour. Je suis le petit robot conversationnel de CarElec. Que puis-je pour vous ?",
		"Bonjour, je suis ravi de discuter avec vous. En quoi puis-je vous aider ?"
	],
	["(.*)(entret(ien|enir))(.*)",
		"Vous souhaitez faire entretenir votre véhicule ? Veuillez vous rendre dans la partie \"Estimer mon entretien\" et suivre les étapes qui vous sont proposées.",
		"L'entretien d'un véhicule est la garantie de sa longévité. Rendez-vous dans notre partie \"Estimer mon entretien\" et laissez-vous guider."
	],
	["(.*)(contact(|er)|joindre|endroit|emplacement|lieu)(.*)",
		"Afin de savoir où nous trouver ou comment nous contacter, veuillez vous rendre dans la partie \"Contact\".",
		"La partie \"Contact\" de notre site vous permet de nous trouver et de nous joindre facilement."
	],
	["(.*)(rendez-vous|rdv|programmer|organiser|date|creneaux|recuperer)(.*)",
		"Vous souhaitez prendre rendez-vous avec nous pour entretenir votre véhicule ? Veuillez vous rendre dans la partie \"Estimer mon entretien\" et suivre les étapes qui vous sont proposées.",
		"La partie \"Estimer mon entretien\" vous permet de prendre rendez-vous avec nous pour entretenir votre véhicule."
	],
	["(.*)(vehicule|voiture|modele|immatriculation|plaque)(.*)",
		"Vous souhaitez savoir si nous pouvons entretenir votre véhicule ? Veuillez vous rendre dans la partie \"Estimer mon entretien\" et suivre les étapes qui vous sont proposées.",
		"La partie \"Estimer mon entretien\" de notre site vous permet de savoir si nous sommes en mesure d'entretenir votre véhicule."
	],
	["(.*)(suivi|camera|surveillance|progression)(.*)",
		"En faisant entretenir votre véhicule dans notre établissement, vous pouvez à tout moment suivre les étapes de notre travail. Des photos sont prises aux moments importants afin de mieux comprendre ce qu’il se passe."
	],
	["(.*)(devis|prix|cout|argent|euros|estimer|estimation)(.*)",
		"Combien cela va-t-il vous coûter ? Faites un devis en ligne et nous vous donnerons un prix en toute transparence. Veuillez vous rendre dans la partie \"Estimer mon entretien\" et suivre les étapes qui vous sont proposées.",
		"La partie \"Estimer mon entretien\" vous permet d'effectuer un devis pour votre entretien."
	],
	["(.*)(note|appreciation|reputation|avis)(.*)",
		"Les retours de nos clients sont positifs et nous encouragent à donner le meilleur de nous même afin de mieux vous satisfaire. Si vous souhaitez nous donner votre avis, veuillez nous laisser un message dans la partie \"Contact\"."
	],
	["(.*)(experience|histoire|metier|atelier|region|Alsace|Strasbourg)(.*)",
		"Le garage CarElec est doté d’une grande expérience en matière d’entretien mécanique de véhicule. Découvrez notre histoire en vous rendant dans la partie \"Notre garage\".",
		"La partie \"Notre garage\" vous présente notre entreprise et son histoire."
	],
	["(.*)(fonctionnement|etape|resume)(.*)",
		"Si vous souhaitez connaître notre fonctionnement et les étapes constituant l'entretien de votre véhicule, veuillez vous rendre dans la partie \"Comment ça marche\".",
		"La partie \"Comment ça marche\" vous permet de comprendre les étapes de fonctionnement de notre prise en charge pour l'entretien de votre véhicule."
	],
	["(.*)(pret|courtoisie|remplacement)(.*)",
		"Lorsque vous laissez votre véhicule chez nous, nous vous prêtons un véhicule de remplacement afin de ne pas perturber votre quotidien.",
		"Nous sommes conscients que votre véhicule vous est indispensable au quotidien. C'est pour celà que nous vous prêtons un de nos véhicules pendant que nous prenons soin du votre."
	],
	["(.*)(compte|connection|mot de passe|utilisateur|pseudo|mail)(.*)",
		"Nous vous offrons la possibilité d’avoir un compte chez nous afin de suivre l’entretien de votre véhicule et d’en avoir l’historique. Vous pouvez vous connecter ou créer un compte en cliquant sur le petit bonhomme en haut à droite."
	],
	["(.*)(question|FAQ|interrogation|information)(.*)",
		"Vous souhaitez connaître les réponses aux questions que nos clients se posent le plus ? Veuillez vous rendre dans la partie \"Aide\"."
	],
	["(.*)[\\?]",  // une interrogation non prévue par les patrons précédents
		"Je suis navré mais je n'ai pas compris votre question.",
		"Vraiment désolé, je n'ai pas compris. Pouvez-vous reformuler votre question ?",
		"Je n'ai pas compris votre question. Je ne suis qu'un robot..."
	],
	["(.*)",  // une saisie utilisateur non prévue par les patrons précédents
		"Je n'ai pas compris. Pouvez-vous reformuler s'il vous plaît ?",
		"Je ne suis pas certain de comprendre...",
		"Ma compréhension est limitée. Je ne suis qu'un robot. Merci de reformuler."
	]
]

let saisie_utilisateur = ""  // entrée de l'utilisateur nommée 'Moi'
let saisie_systeme = ""  // sortie du système nommée 'CarElecBot'
let conversation = ""  // contient tout le dialogue

// fonction qui gère les variables 'saisie_utilisateur' et 'conversation', sollicite la fonction 'match' puis met à jour les zones de texte
function echange() {
	saisie_utilisateur = document.chatbot_entree.zone_texte_entree.value  // texte saisi par l'utilisateur
	conversation = conversation + "Moi : " + saisie_utilisateur + '\n'  // ajoute la saisie de l'utilisateur à la conversation
	match()  // produit la réponse du bot en fonction de la saisie de l'utilisateur
	conversation = conversation + "CarElecBot : " + saisie_systeme + '\n\n'  // ajoute la réponse du bot à la conversation
	document.chatbot_conversation.zone_texte_conversation.value = conversation  // met à jour l'affichage de la conversation complète du chatbot
	document.chatbot_entree.zone_texte_entree.value = ""  // affichage de l'entrée utilisateur réinitialisée
}

// fonction générant des réponses
function match() {
	saisie_utilisateur = saisie_utilisateur.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()  // formatage de la saisie de l'utilisateur en minuscule sans les accents
	for (let i = 0; i < patrons.length; i++) {  // boucle à exécuter une fois pour chaque élément dans le tableau "patrons"
		const regex = new RegExp(patrons[i][0])  // construit un objet RegExp en plaçant le motif du patron itéré afin d'effectuer la compilation de l'expression régulière
		if (regex.test(saisie_utilisateur)) {  // teste l'entrée utilisateur par rapport au motif du patron : si pas de correspondance, on passe au patron suivant
			const nb_reponses = patrons[i].length - 1  // nombre de réponses du bot possibles (on pense à enlever le motif)
			const nb_aleatoire = Math.floor(Math.random() * nb_reponses) + 1  // génère un nombre entier aléatoire entre 1 et le nombre de réponses possibles
			saisie_systeme = patrons[i][nb_aleatoire]  // réponse du bot choisie au hasard
			break  // termine la boucle afin d'éviter de déclencher plusieurs patrons
		}
	}
}


class Chatbot extends React.Component {
	render() {
		this.action_touche_entree = (e) => {  // fonction déclenchée par l'événement 'onKeyDown' qui se produit lorsque l'utilisateur appuie sur une touche du clavier
			if (e.keyCode === 13) {  // si la touche 'Entrée' est utilisée
				e.preventDefault()  // annule la saisie d'un retour chariot
				echange()  // soumet la saisie utilisateur au chatbot
			}
		}
		return (
			<div id="chatbot_page" >
				<form name="chatbot_conversation" >
					Dialogue<br />
					<textarea name="zone_texte_conversation" rows="20" cols="75">Bonjour, en quoi puis-je vous aider ?</textarea><br />
					<br />
				</form>
				<form name="chatbot_entree" >
					Tapez ici vos propos puis cliquez sur "Valider"<br />
					<textarea name="zone_texte_entree" rows="2" cols="75" onKeyDown={this.action_touche_entree}></textarea><br />
					<br />
				</form>
				<button onClick={echange}>Valider</button>  {/*soumet la saisie utilisateur au chatbot*/}
			</div>
		)
	}
}

export default Chatbot;
