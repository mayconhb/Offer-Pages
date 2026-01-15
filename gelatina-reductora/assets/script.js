// Constants and State
let step = 0;
let userName = '';
let peso = 70;
let altura = 160;
let rangeValue = 70;
let showCTAButton = false;
let checkoutPreconnected = false;

const images = {
  gomita: 'assets/images/gomita_1764448317569.webp',
  protocolo: 'assets/images/protocolo_1764448317569.webp',
  gomitaTestimonial: 'assets/images/gomita-testimonial_1764448317569.webp',
  fernandaTestimonial: 'assets/images/fernanda-testimonial_1764448317569.webp',
  patriciaBarca: 'assets/images/patricia_1764448317569.webp',
  maria: 'assets/images/maria_1764448317569.webp',
  jovemMexicana: 'assets/images/jovemmexicana_1764448317569.webp',
  profilePhoto1: 'assets/images/p1.webp',
  profilePhoto2: 'assets/images/p2.webp',
  profilePhoto3: 'assets/images/p3.webp',
  profilePhoto4: 'assets/images/p4.webp',
  profilePhoto5: 'assets/images/p5.webp',
  profilePhoto6: 'assets/images/p6.webp',
  profilePhoto7: 'assets/images/p7.webp',
  profilePhoto8: 'assets/images/p8.webp',
  profilePhoto9: 'assets/images/p9.webp',
  profilePhoto10: 'assets/images/p10.webp'
};

const icons = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7" /></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7" /></svg>'
};

// Utilities
function preloadImage(url) {
  const img = new Image();
  img.src = url;
}

function loadVturbPlayer() {
  if (!document.querySelector('script[src*="scripts.converteai.net"]')) {
    var s = document.createElement("script");
    s.src = "https://scripts.converteai.net/8be91a4f-8063-443e-ad7c-0bc55451c92d/players/69684ea816e3821ec3e2ab8d/v4/player.js";
    s.async = !0;
    document.head.appendChild(s);
  }
}

function preconnectCheckout() {
  if (checkoutPreconnected) return;
  checkoutPreconnected = true;
  const domains = ['https://pay.hotmart.com', 'https://hotmart.com'];
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  });
}

function handleStepPreloading(currentStep) {
  if (currentStep >= 14) loadVturbPlayer();
  if (currentStep >= 16) preconnectCheckout();
}

function handleNext() {
  step++;
  window.step = step;
  handleStepPreloading(step);
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleAnswerSelect(questionKey, answerValue) {
  handleNext();
}

function handleSliderChange(event, saveKey) {
  rangeValue = parseInt(event.target.value);
  if (saveKey === 'peso') peso = rangeValue;
  if (saveKey === 'altura') altura = rangeValue;
  const numDisplay = document.querySelector('.slider-number');
  if (numDisplay) numDisplay.textContent = rangeValue;
}

function handleSliderContinue(saveKey) {
  handleNext();
}

function handleNameInput(event) {
  userName = event.target.value;
  const btn = document.getElementById('nameSubmitBtn');
  if (btn) btn.disabled = userName.length < 2;
}

function handleNameSubmit() {
  if (userName.length >= 2) handleNext();
}

// Render Functions
function renderIntro() {
  return `
    <div class="quiz-container space-y-3">
      <h1 class="quiz-title font-serif">GOMITA SORPRENDE A SUS FANS AL REVELAR CÓMO PERDIÓ 8 KG CON UNA GELATINA REDUCTORA CONSUMIDA ANTES DE LAS COMIDAS</h1>
      <p class="quiz-subtitle font-serif">El cambio radical ocurrió después de que la influencer mexicana realizara una PRUEBA GRATUITA del Protocolo de la Gelatina Reductora.</p>
      <img src="${images.gomita}" class="quiz-image" alt="Transformación de Gomita" width="512" height="384" />
      <div class="highlight-box">
        <p class="highlight-text font-serif">👉 Haz clic en el botón de abajo y descubre si este protocolo también funciona para tu cuerpo.</p>
      </div>
      <button onclick="handleNext()" class="cta-button">Iniciar mi prueba GRATIS ahora</button>
      <div class="check-list">
        <div class="check-item"><span class="check-icon">${icons.check}</span> Prueba 100% gratuita</div>
      </div>
    </div>
  `;
}

function renderButtons(title, options) {
  return `
    <div class="quiz-container space-y-6">
      <h2 class="quiz-title quiz-title-lg font-serif">${title}</h2>
      <div class="options-container">
        ${options.map(opt => `<button onclick="handleNext()" class="option-button">${opt}<span class="option-arrow">${icons.arrowRight}</span></button>`).join('')}
      </div>
    </div>
  `;
}

function renderVideoPage() {
  return `
    <div class="quiz-container space-y-6">
      <h2 class="quiz-title text-xl font-serif text-center" style="text-transform: uppercase;">MIRA EL VIDEO A CONTINUACIÓN Y DESCUBRE CÓMO ACCEDER A TU PROTOCOLO DE GELATINA REDUCTORA.</h2>
      <div class="video-container">
        <div class="video-wrapper">
          <vturb-smartplayer id="vid-69684ea816e3821ec3e2ab8d" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"></vturb-smartplayer>
        </div>
      </div>
    </div>
  `;
}

function render() {
  const quizContainer = document.getElementById('quiz-container');
  if (!quizContainer) return;
  
  let content = '';
  if (step === 0) content = renderIntro();
  else if (step === 1) content = renderButtons('¿Cuál es tu género?', ['Mujer', 'Hombre']);
  else if (step === 2) content = renderButtons('¿Cuál es tu objetivo?', ['Perder peso', 'Ganar energía']);
  else if (step === 18) content = renderVideoPage();
  else content = renderButtons('Paso ' + step, ['Opción 1', 'Opción 2']);
  
  quizContainer.innerHTML = content;
}

function setupUTMTracking() {
  document.addEventListener('mousedown', function(e) {
    const target = e.target.closest('a');
    if (target && target.href && target.href.includes('hotmart')) {
      const currentParams = window.location.search;
      if (currentParams) {
        const separator = target.href.includes('?') ? '&' : '?';
        target.href = target.href + separator + currentParams.replace(/^\?/, '');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  render();
  setupUTMTracking();
});
