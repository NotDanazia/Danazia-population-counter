document.getElementById('connexion').addEventListener('click', () => {
    document.getElementById('accueil').style.display = 'none';
    document.getElementById('formulaireConnexion').style.display = 'block';
});

document.getElementById('inscription').addEventListener('click', () => {
    document.getElementById('accueil').style.display = 'none';
    document.getElementById('formulaireInscription').style.display = 'block';
});

document.getElementById('boutonConnexion').addEventListener('click', async () => {
    const nom = document.getElementById('connexionNom').value;
    const motDePasse = document.getElementById('connexionMotDePasse').value;

    const response = await fetch('/api/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nom, motDePasse })
    });

    const result = await response.json();

    if (result.success) {
        window.location.href = '/chat';
    } else {
        document.getElementById('erreurConnexion').innerText = result.message;
    }
});

document.getElementById('boutonInscription').addEventListener('click', async () => {
    const nom = document.getElementById('inscriptionNom').value;
    const motDePasse = document.getElementById('inscriptionMotDePasse').value;

    if (motDePasse.length < 8 || motDePasse.length > 20) {
        document.getElementById('erreurInscription').innerText = 'Le mot de passe doit comporter entre 8 et 20 caractères.';
        return;
    }

    const response = await fetch('/api/inscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nom, motDePasse })
    });

    const result = await response.json();

    if (result.success) {
        window.location.href = '/chat';
    } else {
        document.getElementById('erreurInscription').innerText = result.message;
    }
});
