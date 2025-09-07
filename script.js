const scanBtn = document.getElementById('scanBtn');
const imageInput = document.getElementById('imageInput');
const output = document.getElementById('output');
const loading = document.getElementById('loading');
const progressFill = document.getElementById('progressFill');

loading.style.display = 'none';  // cacher l'animation au départ

scanBtn.addEventListener('click', () => {
    const file = imageInput.files[0];
    if (!file) {
        alert("Choisis une image d'abord !");
        return;
    }

    output.textContent = '';        // reset texte
    progressFill.style.width = '0%'; // reset barre progression
    loading.style.display = 'block'; // afficher animation

    const reader = new FileReader();
    reader.onload = function() {
        Tesseract.recognize(
            reader.result,
            'fra',
            {
                logger: m => {
                    if(m.status === 'recognizing text') {
                        // mise à jour barre de progression entre 0 et 100%
                        let progress = Math.floor(m.progress * 100);progressFill.style.width = progress + '%';
                    }
                    console.log(m);
                }
            }
        ).then(({ data: { text } }) => {
            output.textContent = text.trim() || 'Aucun texte détecté.';
        }).catch(err => {
            output.textContent = 'Erreur lors de l\'extraction : ' + err.message;
        }).finally(() => {
            loading.style.display = 'none'; // cacher animation à la fin
        });
    };
    reader.readAsDataURL(file);
});