document.addEventListener('DOMContentLoaded', () => {
    // Ajoute ici des interactions, par exemple un bouton qui affiche une alerte
    const btns = document.querySelectorAll('.cta-button');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Vous avez démarré une consultation!');
        });
    });

    // Ajoute d'autres fonctionnalités si besoin
});
