// Variables globales
let currentStep = 1;
const totalSteps = 5;
let formData = {};
let currentTestimonialIndex = 0;
const testimonialsPerView = 3;

// Questions conditionnelles selon la thématique
const conditionalQuestions = {
    sentimental: {
        title: "Votre question sentimentale",
        subtitle: "Parlez-nous de votre situation amoureuse ou relationnelle"
    },
    financier: {
        title: "Votre question financière",
        subtitle: "Décrivez votre situation financière ou vos projets"
    },
    familial: {
        title: "Votre question familiale",
        subtitle: "Parlez-nous de votre situation familiale"
    },
    professionnel: {
        title: "Votre question professionnelle",
        subtitle: "Décrivez votre situation ou vos projets professionnels"
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeAnimations();
    initializeScrollEffects();
    initializeTestimonialsSlider();
    initializeMediaCarousel();
    createParticles();
});

// Initialisation du formulaire
function initializeForm() {
    const form = document.getElementById('consultationForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Écouter les changements de thématique
    const themeInputs = document.querySelectorAll('input[name="theme"]');
    themeInputs.forEach(input => {
        input.addEventListener('change', updateConditionalQuestion);
    });
}

// Navigation vers le formulaire
function scrollToForm() {
    const formSection = document.getElementById('consultation');
    if (formSection) {
        formSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Étape suivante
function nextStep() {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        
        if (currentStep < totalSteps) {
            // Masquer l'étape actuelle
            const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
            if (currentStepElement) {
                currentStepElement.classList.remove('active');
            }
            
            // Mettre à jour le numéro d'étape
            currentStep++;
            
            // Afficher la nouvelle étape
            const nextStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
            if (nextStepElement) {
                nextStepElement.classList.add('active');
            }
            
            // Mettre à jour la barre de progression
            updateProgressBar();
            
            // Animation d'entrée
            animateStepTransition();
        }
    }
}

// Validation de l'étape actuelle
function validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (!currentStepElement) return false;
    
    const requiredInputs = currentStepElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (input.type === 'radio') {
            const radioGroup = currentStepElement.querySelectorAll(`input[name="${input.name}"]`);
            const isRadioGroupValid = Array.from(radioGroup).some(radio => radio.checked);
            if (!isRadioGroupValid) {
                isValid = false;
                showError(input, 'Veuillez sélectionner une option');
            }
        } else if (!input.value.trim()) {
            isValid = false;
            showError(input, 'Ce champ est requis');
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            isValid = false;
            showError(input, 'Veuillez entrer une adresse email valide');
        } else {
            clearError(input);
        }
    });
    
    return isValid;
}

// Validation email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Afficher erreur
function showError(input, message) {
    clearError(input);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 14px;
        margin-top: 5px;
        text-align: left;
    `;
    
    input.parentNode.appendChild(errorElement);
    input.style.borderColor = '#ef4444';
}

// Effacer erreur
function clearError(input) {
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '';
}

// Sauvegarder les données de l'étape
function saveCurrentStepData() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (!currentStepElement) return;
    
    const inputs = currentStepElement.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type === 'radio') {
            if (input.checked) {
                formData[input.name] = input.value;
            }
        } else {
            formData[input.name] = input.value;
        }
    });
}

// Mettre à jour la barre de progression
function updateProgressBar() {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Mettre à jour la question conditionnelle
function updateConditionalQuestion() {
    const selectedTheme = document.querySelector('input[name="theme"]:checked');
    if (selectedTheme && conditionalQuestions[selectedTheme.value]) {
        const questionData = conditionalQuestions[selectedTheme.value];
        
        const questionTitle = document.getElementById('questionTitle');
        const questionSubtitle = document.getElementById('questionSubtitle');
        
        if (questionTitle) questionTitle.textContent = questionData.title;
        if (questionSubtitle) questionSubtitle.textContent = questionData.subtitle;
    }
}

// Animation de transition entre étapes
function animateStepTransition() {
    const activeStep = document.querySelector('.form-step.active');
    if (activeStep) {
        activeStep.style.opacity = '0';
        activeStep.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            activeStep.style.opacity = '1';
            activeStep.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Soumission du formulaire
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (validateCurrentStep()) {
        saveCurrentStepData();
        
        // Simulation d'envoi des données
        submitFormData();
    }
}

// Envoi des données
function submitFormData() {
    // Afficher un indicateur de chargement
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
    }
    
    // Simulation d'un délai d'envoi
    setTimeout(() => {
        // Masquer le formulaire
        const form = document.getElementById('consultationForm');
        const progressBar = document.querySelector('.progress-bar');
        if (form) {
            form.style.display = 'none';
        }
        if (progressBar) {
            progressBar.style.display = 'none';
        }
        
        // Afficher le message de succès
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.classList.add('fade-in-up');
        }
        
        // Envoyer les données (simulation)
        console.log('Données du formulaire:', formData);
        
        // Ici, vous pourriez intégrer avec un service comme Zapier, Google Sheets, etc.
        // sendToZapier(formData);
        // sendToGoogleSheets(formData);
        
    }, 2000);
}

// Initialisation des témoignages slider
function initializeTestimonialsSlider() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;
    
    const testimonials = track.children;
    const totalTestimonials = testimonials.length;
    
    // Cloner les témoignages pour un effet de boucle infinie
    for (let i = 0; i < testimonialsPerView; i++) {
        const clone = testimonials[i].cloneNode(true);
        track.appendChild(clone);
    }
    
    updateTestimonialsPosition();
}

// Navigation témoignages
function nextTestimonial() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;
    
    const testimonials = track.children;
    const totalOriginal = Math.floor(testimonials.length / 2); // Nombre original sans clones
    
    currentTestimonialIndex = (currentTestimonialIndex + 1) % totalOriginal;
    updateTestimonialsPosition();
}

function previousTestimonial() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;
    
    const testimonials = track.children;
    const totalOriginal = Math.floor(testimonials.length / 2); // Nombre original sans clones
    
    currentTestimonialIndex = (currentTestimonialIndex - 1 + totalOriginal) % totalOriginal;
    updateTestimonialsPosition();
}

function updateTestimonialsPosition() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;
    
    const cardWidth = 350; // Largeur d'une carte + gap
    const gap = 30;
    const offset = currentTestimonialIndex * (cardWidth + gap);
    
    track.style.transform = `translateX(-${offset}px)`;
}

// Auto-scroll des témoignages
setInterval(() => {
    nextTestimonial();
}, 5000);

// Initialisation du carrousel médias
function initializeMediaCarousel() {
    const track = document.getElementById('mediaTrack');
    if (!track) return;
    
    // Le CSS gère déjà l'animation automatique
}

// Fonctionnalité accordéon pour les features
function toggleFeature(element) {
    const isActive = element.classList.contains('active');
    
    // Fermer tous les autres
    document.querySelectorAll('.feature-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Ouvrir celui-ci s'il n'était pas actif
    if (!isActive) {
        element.classList.add('active');
    }
}

// Initialisation des animations
function initializeAnimations() {
    // Animation des cartes flottantes
    animateFloatingCards();
}

// Animation des cartes flottantes
function animateFloatingCards() {
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 2}s`;
    });
}

// Créer des particules flottantes
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(139, 92, 246, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Effets de scroll
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const elementsToAnimate = document.querySelectorAll('.service-card, .testimonial-card, .stat-card, .feature-item');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Navigation fluide
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Effet de parallaxe léger sur le hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    
    // Effet sur les particules
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = (index % 3 + 1) * 0.05;
        particle.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    // Réajuster les animations si nécessaire
    debounce(() => {
        updateTestimonialsPosition();
    }, 250)();
});

// Fonction utilitaire debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Intégrations possibles (à personnaliser selon vos besoins)

// Exemple d'intégration Zapier
function sendToZapier(data) {
    const zapierWebhookURL = 'YOUR_ZAPIER_WEBHOOK_URL';
    
    fetch(zapierWebhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Données envoyées à Zapier:', result);
    })
    .catch(error => {
        console.error('Erreur Zapier:', error);
    });
}

// Exemple d'intégration Google Sheets
function sendToGoogleSheets(data) {
    const googleSheetsURL = 'YOUR_GOOGLE_SHEETS_SCRIPT_URL';
    
    fetch(googleSheetsURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        console.log('Données envoyées à Google Sheets');
    })
    .catch(error => {
        console.error('Erreur Google Sheets:', error);
    });
}

// Animations supplémentaires au chargement
window.addEventListener('load', () => {
    // Animation d'entrée pour le hero
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(30px)';
        
        setTimeout(() => {
            heroImage.style.transition = 'all 0.8s ease';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 600);
    }
});

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('Erreur JavaScript:', event.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Temps de chargement:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Préchargement des images
function preloadImages() {
    const images = [
        'background.jpg',
        'pexels_fortune_teller_1.jpeg',
        'pexels_fortune_teller_2.jpeg',
        'pexels_tarot_reading_1.jpeg',
        'pexels_tarot_reading_2.jpeg',
        'icon_tarot.jpg',
        'icon_numerology.jpg',
        'icon_astrology.jpg',
        'icon_mediumnity.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Lancer le préchargement
preloadImages();

