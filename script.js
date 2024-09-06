document.addEventListener("DOMContentLoaded", function() {
    const sectionPochListe = document.getElementById("content");

    // Fonction pour afficher le formulaire d'ajout
    function afficherFormulaireAjout() {
        // Retirer le bouton d'ajout
        document.getElementById("boutonAjouterLivre").remove();

        // Créer et afficher le formulaire d'ajout
        const formulaireAjout = document.createElement("div");
        formulaireAjout.id = "formulaireAjout";

        const labelTitre = document.createElement("label");
        labelTitre.textContent = "Titre du livre :";
        const champTitre = document.createElement("input");
        champTitre.type = "text";
        champTitre.id = "titre";
        champTitre.name = "titre";
        champTitre.required = true;
        formulaireAjout.appendChild(labelTitre);
        formulaireAjout.appendChild(champTitre);
        formulaireAjout.appendChild(document.createElement("br"));

        const labelAuteur = document.createElement("label");
        labelAuteur.textContent = "Auteur :";
        const champAuteur = document.createElement("input");
        champAuteur.type = "text";
        champAuteur.id = "auteur";
        champAuteur.name = "auteur";
        champAuteur.required = true;
        formulaireAjout.appendChild(labelAuteur);
        formulaireAjout.appendChild(champAuteur);
        formulaireAjout.appendChild(document.createElement("br"));

        const boutonRechercher = document.createElement("button");
        boutonRechercher.textContent = "Rechercher";
        boutonRechercher.className = "rechercher"; // Ajout de la classe
        boutonRechercher.addEventListener("click", rechercherLivres);
        formulaireAjout.appendChild(boutonRechercher);

        const boutonAnnuler = document.createElement("button");
        boutonAnnuler.textContent = "Annuler";
        boutonAnnuler.className = "annuler"; // Ajout de la classe
        boutonAnnuler.addEventListener("click", annulerAjoutLivre);
        formulaireAjout.appendChild(boutonAnnuler);

        // Ajouter le formulaire en haut de la section de contenu
        sectionPochListe.insertBefore(formulaireAjout, sectionPochListe.firstChild);

        const blocResultat = document.createElement("div");
        blocResultat.id = "resultatRecherche";
        sectionPochListe.appendChild(blocResultat);
    }

    // Fonction pour afficher le bouton Ajouter un livre
    function afficherBoutonAjouterLivre() {
        // Vérifiez si le bouton existe déjà
        if (!document.getElementById("boutonAjouterLivre")) {
            const boutonAjouterLivre = document.createElement("button");
            boutonAjouterLivre.textContent = "Ajouter un livre";
            boutonAjouterLivre.id = "boutonAjouterLivre";
            boutonAjouterLivre.addEventListener("click", afficherFormulaireAjout);

            // Trouver l'élément hr et insérer le bouton juste après
            const hr = document.querySelector("hr");
            if (hr) {
                hr.parentNode.insertBefore(boutonAjouterLivre, hr.nextSibling);
            } else {
                sectionPochListe.appendChild(boutonAjouterLivre);
            }
        }
    }

    // Fonction pour afficher la liste des livres stockés dans sessionStorage
    function afficherPochListe() {
        let pochListeSection = document.getElementById("pochListeSection");
        if (!pochListeSection) {
            pochListeSection = document.createElement("div");
            pochListeSection.id = "pochListeSection";
            sectionPochListe.appendChild(pochListeSection);
        }

        pochListeSection.innerHTML = "";

        const pochListe = JSON.parse(sessionStorage.getItem("pochListe")) || [];

        pochListe.forEach(livre => {
            const livrePochListe = document.createElement("div");
            livrePochListe.classList.add("livre-poch-liste");

            const titreLivrePochListe = document.createElement("h3");
            titreLivrePochListe.textContent = livre.titre;
            livrePochListe.appendChild(titreLivrePochListe);

            const idLivrePochListe = document.createElement("p");
            idLivrePochListe.textContent = "ID: " + livre.id;
            livrePochListe.appendChild(idLivrePochListe);

            const auteurLivrePochListe = document.createElement("p");
            auteurLivrePochListe.textContent = "Par " + livre.auteur;
            livrePochListe.appendChild(auteurLivrePochListe);

            // Description du livre
            const descriptionLivrePochListe = document.createElement("p");
            descriptionLivrePochListe.textContent = livre.description;
            livrePochListe.appendChild(descriptionLivrePochListe);

             // Image du livre
             const imageLivrePochListe = document.createElement("img");
             imageLivrePochListe.src = livre.image; // URL de l'image
             imageLivrePochListe.alt = livre.titre; // Texte alternatif pour l'image
             livrePochListe.appendChild(imageLivrePochListe);

            const boutonSupprimer = document.createElement("button");
            boutonSupprimer.innerHTML = '<i class="fa-solid fa-trash-alt icon"></i>';
            boutonSupprimer.addEventListener("click", function() {
                supprimerDeLaPochListe(livre);
            });
            livrePochListe.appendChild(boutonSupprimer);

            pochListeSection.appendChild(livrePochListe);
        });
    }

    // Fonction pour rechercher des livres via l'API Google Books
    function rechercherLivres() {
        const titre = document.getElementById("titre").value.trim();
        const auteur = document.getElementById("auteur").value.trim();

        if (titre === "" && auteur === "") {
            alert("Les champs Titre du livre et Auteur ne peuvent pas être vides !");
            return;
        }

        const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${titre}+inauthor:${auteur}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const resultatRecherche = document.getElementById("resultatRecherche");
                resultatRecherche.innerHTML = "";

                const titreResultats = document.createElement("h2");
                titreResultats.textContent = "RESULTATS DE RECHERCHE";
                resultatRecherche.appendChild(titreResultats);

                if (data.items && data.items.length > 0) {
                    data.items.forEach(item => {
                        const livre = {
                            id: item.id,
                            titre: item.volumeInfo.title,
                            auteur: item.volumeInfo.authors ? item.volumeInfo.authors[0] : "Auteur inconnu",
                            description: item.volumeInfo.description ? item.volumeInfo.description.substring(0, 200) + "..." : "Information manquante",
                            image: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : "unavailable.png"
                        };

                        const livreResultat = document.createElement("div");
                        livreResultat.classList.add("livre-resultat");

                        const boutonBookmark = document.createElement("button");
                        boutonBookmark.innerHTML = '<i class="fa-solid fa-bookmark icon"></i>';
                        boutonBookmark.addEventListener("click", function() {
                            ajouterALaPochListe(livre);
                        });
                        livreResultat.appendChild(boutonBookmark);
                        
                        const titreLivre = document.createElement("h3");
                        titreLivre.textContent = livre.titre;
                        livreResultat.appendChild(titreLivre);

                        const auteurLivre = document.createElement("p");
                        auteurLivre.textContent = "Par " + livre.auteur;
                        livreResultat.appendChild(auteurLivre);

                        const descriptionLivre = document.createElement("p");
                        descriptionLivre.textContent = livre.description;
                        livreResultat.appendChild(descriptionLivre);

                        const imageLivre = document.createElement("img");
                        imageLivre.src = livre.image;
                        livreResultat.appendChild(imageLivre);

                        

                        resultatRecherche.appendChild(livreResultat);
                    });
                } else {
                    const messageAucunResultat = document.createElement("p");
                    messageAucunResultat.textContent = "Aucun livre n’a été trouvé.";
                    resultatRecherche.appendChild(messageAucunResultat);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la recherche de livres:', error);
                alert("Une erreur est survenue lors de la recherche de livres.");
            });
    }

    // Fonction pour ajouter un livre à la liste
    function ajouterALaPochListe(livre) {
        let pochListe = JSON.parse(sessionStorage.getItem("pochListe")) || [];
        const existeDeja = pochListe.some(item => item.id === livre.id);

        if (existeDeja) {
            alert("Vous ne pouvez ajouter deux fois le même livre.");
            return;
        }

        pochListe.push(livre);
        sessionStorage.setItem("pochListe", JSON.stringify(pochListe));

        afficherPochListe();
    }

    // Fonction pour supprimer un livre de la liste
    function supprimerDeLaPochListe(livre) {
        let pochListe = JSON.parse(sessionStorage.getItem("pochListe")) || [];
        pochListe = pochListe.filter(item => item.id !== livre.id);
        sessionStorage.setItem("pochListe", JSON.stringify(pochListe));

        afficherPochListe();
    }

    // Fonction pour annuler l'ajout de livre
    function annulerAjoutLivre() {
        const formulaireAjout = document.getElementById("formulaireAjout");
        if (formulaireAjout) {
            formulaireAjout.remove();
        }

        const resultatRecherche = document.getElementById("resultatRecherche");
        if (resultatRecherche) {
            resultatRecherche.innerHTML = "";
        }

        afficherBoutonAjouterLivre();
    }

    // Initialisation de la page
    afficherBoutonAjouterLivre();
    afficherPochListe();
});
