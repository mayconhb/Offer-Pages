// Quiz Flow State
let step = 0;
window.step = step; // Expose globally for checkout tracking
let loadingProgress = 0;
let rangeValue = 70;
let userName = '';
let peso = 70;
let altura = 165;
let carouselIndex = 0;
let showCTAButton = false;
let loadingInterval = null;
let carouselInterval = null;

// Video tracking
let isPlaying = false;
let lastTimestamp = 0;
let accumulatedSeconds = 0;
let wistiaBindied = false;
const CTA_THRESHOLD_SECONDS = 490;

// Preload tracking
let wistiaPreloaded = false;
let checkoutPreconnected = false;
const preloadedImages = new Set();

// SVG Icons
const icons = {
  menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>',
  user: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>',
  checkLg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>'
};

// Image paths
const images = {
  logo: 'assets/images/el-pais_1764448317569.png',
  gomita: 'assets/images/baixados_1764452903199.webp',
  protocolo: 'assets/images/protocolo_1764453061315.png',
  gomitaTestimonial: 'assets/images/Gomita_1764453233335.webp',
  fernandaTestimonial: 'assets/images/Fernanda_1764453233336.webp',
  marianaTestimonial: 'assets/images/Mariana_1764453233336.webp',
  carousel1: 'assets/images/lg-Wlmuz-slide-2-adriana-17kg_1764453347817.jpg',
  carousel2: 'assets/images/f4_1764453347817.webp',
  carousel3: 'assets/images/lg-qwnL0-slide-1nereide-16kg_1764453375116.webp',
  rosana: 'assets/images/50-year-old-woman-weight-600nw-2519627017_1764453653741.webp',
  beforeAfter: 'assets/images/dfg_1764453736974.webp',
  profilePhoto1: 'assets/images/baixados-2_1764470596368.jpg',
  profilePhoto2: 'assets/images/latina_woman_face_po_b062712e.jpg',
  profilePhoto3: 'assets/images/baixados-1_1764470596369.jpg',
  profilePhoto4: 'assets/images/latina_woman_face_po_721577a4.jpg',
  profilePhoto5: 'assets/images/latina_woman_face_po_43c11193.jpg',
  profilePhoto6: 'assets/images/middle_aged_woman_fa_da927933.jpg',
  profilePhoto7: 'assets/images/baixados_1764470596369.jpg',
  profilePhoto8: 'assets/images/images-1_1764470674545.jpg',
  profilePhoto9: 'assets/images/images_1764470674545.jpg',
  profilePhoto10: 'assets/images/images-2_1764470774467.jpg',
  patriciaBarca: 'assets/images/patricia-barca_1764452735065.webp',
  maria: 'assets/images/Maria_1764452735066.webp',
  jovemMexicana: 'assets/images/jovem-mexicana_1764452735066.webp'
};

const carouselImages = [images.carousel1, images.carousel2, images.carousel3];

// Mapeamento de imagens por etapa para preload inteligente
const stepImages = {
  0: [images.gomita],
  9: [images.protocolo],
  10: [images.gomitaTestimonial, images.fernandaTestimonial, images.marianaTestimonial],
  15: [images.carousel1, images.carousel2, images.carousel3],
  16: [images.rosana],
  17: [images.beforeAfter],
  18: [images.profilePhoto1, images.profilePhoto2, images.profilePhoto3, images.profilePhoto4, 
       images.profilePhoto5, images.profilePhoto6, images.profilePhoto7, images.profilePhoto8,
       images.profilePhoto9, images.profilePhoto10]
};

// Função para preload de imagem individual
function preloadImage(src) {
  if (preloadedImages.has(src)) return;
  preloadedImages.add(src);
  const img = new Image();
  img.src = src;
}

// Preload de imagens para as próximas etapas
function preloadNextStepImages(currentStep) {
  const stepsToPreload = [currentStep, currentStep + 1, currentStep + 2, currentStep + 3];
  stepsToPreload.forEach(s => {
    if (stepImages[s]) {
      stepImages[s].forEach(preloadImage);
    }
  });
}

// Preload do SDK Wistia (começa na etapa 15 para estar pronto na etapa 18)
function preloadWistiaSDK() {
  if (wistiaPreloaded) return;
  wistiaPreloaded = true;
  
  // Preconnect já feito no HTML, aqui fazemos o prefetch do script
  const playerScript = document.createElement('link');
  playerScript.rel = 'preload';
  playerScript.as = 'script';
  playerScript.href = 'https://fast.wistia.com/player.js';
  document.head.appendChild(playerScript);
  
  // Prefetch do embed específico do vídeo
  const embedScript = document.createElement('link');
  embedScript.rel = 'preload';
  embedScript.as = 'script';
  embedScript.href = 'https://fast.wistia.com/embed/8xc87ip699.js';
  document.head.appendChild(embedScript);
  
  // Prefetch do swatch (thumbnail do vídeo)
  const swatch = document.createElement('link');
  swatch.rel = 'preload';
  swatch.as = 'image';
  swatch.href = 'https://fast.wistia.com/embed/medias/8xc87ip699/swatch';
  document.head.appendChild(swatch);
  
  console.log('[Preload] Wistia SDK preloaded');
}

// Adiciona preconnect dinâmico para checkout (chamado na etapa 16+)
function preconnectCheckout() {
  if (checkoutPreconnected) return;
  checkoutPreconnected = true;
  
  const domains = [
    'https://pay.hotmart.com',
    'https://hotmart.com',
    'https://sec.hotmart.com',
    'https://static-media.hotmart.com',
    'https://api-sec.hotmart.com'
  ];
  
  // Adiciona dns-prefetch primeiro (mais rápido)
  domains.forEach(domain => {
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = domain;
    document.head.appendChild(dnsPrefetch);
  });
  
  // Depois adiciona preconnect (conexão completa)
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
  
  // Prefetch da página de checkout
  const checkoutPrefetch = document.createElement('link');
  checkoutPrefetch.rel = 'prefetch';
  checkoutPrefetch.href = 'https://pay.hotmart.com/I103092154N?off=8pqi3d4c&checkoutMode=10';
  document.head.appendChild(checkoutPrefetch);
  
  console.log('[Preload] Checkout preconnected and prefetched at step', step);
}

// Gerenciador de preload baseado na etapa atual
function handleStepPreloading(currentStep) {
  // Preload imagens das próximas etapas
  preloadNextStepImages(currentStep);
  
  // A partir da etapa 14, começa a preparar o vídeo
  if (currentStep >= 14) {
    preloadWistiaSDK();
  }
  
  // A partir da etapa 16, prepara o checkout
  if (currentStep >= 16) {
    preconnectCheckout();
  }
}

// Calculate IMC
function calcularIMC() {
  const alturaMetros = altura / 100;
  return peso / (alturaMetros * alturaMetros);
}

function getIMCCategory(imc) {
  if (imc < 18.5) return 'bajo';
  if (imc < 25) return 'normal';
  if (imc < 30) return 'sobrepeso';
  return 'obesidad';
}

// Handle next step
function handleNext() {
  const completedStep = step;
  
  step++;
  window.step = step;
  handleStepPreloading(step);
  render();
  
  // Track completion of the step that was just completed
  if (window.QuizAnalytics) {
    window.QuizAnalytics.trackStepComplete(completedStep);
    window.QuizAnalytics.trackStepView(step);
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle answer selection with tracking
function handleAnswerSelect(questionKey, answerValue) {
  const currentStep = step;
  if (window.QuizAnalytics) {
    window.QuizAnalytics.trackAnswer(currentStep, questionKey, answerValue);
  }
  handleNext();
}

// Render functions
function renderIntro() {
  return `
    <div class="quiz-container space-y-3">
      <h1 class="quiz-title font-serif">
        GOMITA SORPRENDE A SUS FANS AL REVELAR CÓMO PERDIÓ 8 KG CON UNA GELATINA REDUCTORA CONSUMIDA ANTES DE LAS COMIDAS
      </h1>
      <p class="quiz-subtitle font-serif">
        El cambio radical ocurrió después de que la influencer mexicana realizara una <strong>PRUEBA GRATUITA</strong> del Protocolo de la Gelatina Reductora, que activa las células adelgazantes del intestino y permite perder de <strong>3 a 5 kg en solo 7 días</strong> — sin dieta, sin medicamentos y sin gimnasio.
      </p>
      
      <div style="width: 100%; overflow: hidden; border-radius: 0.375rem;">
        <img src="${images.gomita}" class="quiz-image" alt="Transformación de Gomita" width="512" height="384" fetchpriority="high" />
      </div>

      <div class="highlight-box">
        <p class="highlight-text font-serif">
          👉 Haz clic en el botão de abajo y descubre si este protocolo también funciona para tu cuerpo. <strong>¡Haz la prueba gratuita ahora!</strong>
        </p>
      </div>

      <button onclick="handleNext()" class="cta-button">
        Iniciar mi prueba GRATIS ahora
      </button>

      <div class="check-list">
        <div class="check-item">
          <span class="check-icon">${icons.check}</span> Prueba 100% gratuita
        </div>
        <div class="check-item">
          <span class="check-icon">${icons.check}</span> Toma menos de 2 minutos
        </div>
        <div class="check-item">
          <span class="check-icon">${icons.check}</span> Información 100% encriptada
        </div>
      </div>
    </div>
  `;
}

function renderButtons(title, options, subtitle, questionKey) {
  const optionsHtml = options.map((opt, idx) => `
    <button onclick="handleAnswerSelect('${questionKey || 'step_' + step}', '${opt.replace(/'/g, "\\'")}')" class="option-button">
      ${opt}
      <span class="option-arrow">${icons.arrowRight}</span>
    </button>
  `).join('');

  return `
    <div class="quiz-container space-y-6">
      <h2 class="quiz-title quiz-title-lg font-serif">${title}</h2>
      ${subtitle ? `<p class="text-gray-600 font-serif">${subtitle}</p>` : ''}
      <div class="options-container">
        ${optionsHtml}
      </div>
    </div>
  `;
}

function renderSlider(title, min, max, unit, subtitle, defaultValue, saveKey) {
  const currentValue = rangeValue < min || rangeValue > max ? (defaultValue || Math.round((min + max) / 2)) : rangeValue;
  const percentage = ((currentValue - min) / (max - min)) * 100;
  
  return `
    <div class="quiz-container space-y-8">
      <div class="text-center">
        <h2 class="quiz-title quiz-title-lg font-serif">${title}</h2>
        ${subtitle ? `<p class="text-gray-500 font-serif text-sm mt-4">${subtitle}</p>` : ''}
      </div>

      <div class="slider-value">
        <span class="slider-number">${currentValue}</span>
        <span class="slider-unit">${unit}</span>
      </div>

      <div class="slider-container">
        <div class="slider-track-container">
          <div class="slider-track">
            <div class="slider-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="slider-thumb" style="left: ${percentage}%"></div>
          <input 
            type="range" 
            min="${min}" 
            max="${max}" 
            value="${currentValue}" 
            class="slider-input"
            oninput="handleSliderChange(event, '${saveKey}')"
          />
        </div>
        <div class="slider-labels">
          <span>${min} ${unit}</span>
          <span>${max} ${unit}</span>
        </div>
      </div>

      <div class="slider-helper">
        <p class="slider-helper-text font-serif">
          <span style="color: var(--news-yellow);">✓</span> Ajustaremos la <strong>dosis ideal</strong> del Protocolo para tu cuerpo.
        </p>
      </div>

      <button onclick="handleSliderContinue('${saveKey}')" class="cta-button cta-button-lg">
        Continuar
      </button>
    </div>
  `;
}

function handleSliderChange(event, saveKey) {
  rangeValue = parseInt(event.target.value);
  if (saveKey === 'peso') peso = rangeValue;
  if (saveKey === 'altura') altura = rangeValue;
  
  // Update display
  const container = document.querySelector('.slider-value');
  if (container) {
    container.querySelector('.slider-number').textContent = rangeValue;
  }
  
  // Update visual
  const percentage = ((rangeValue - parseInt(event.target.min)) / (parseInt(event.target.max) - parseInt(event.target.min))) * 100;
  document.querySelector('.slider-fill').style.width = percentage + '%';
  document.querySelector('.slider-thumb').style.left = percentage + '%';
}

function handleSliderContinue(saveKey) {
  if (saveKey === 'peso') peso = rangeValue;
  if (saveKey === 'altura') altura = rangeValue;
  
  // Track slider answer
  if (window.QuizAnalytics) {
    window.QuizAnalytics.trackAnswer(step, saveKey, rangeValue.toString());
  }
  
  handleNext();
}

function renderInput() {
  return `
    <div class="quiz-container space-y-6">
      <h2 class="quiz-title quiz-title-lg font-serif">
        Para crear tu plan personalizado, necesitamos tu nombre.
      </h2>
      <p class="text-gray-600 font-serif">Tranquila, tus datos están protegidos 🔒</p>

      <input 
        type="text" 
        placeholder="Escribe tu nombre..." 
        id="nameInput"
        class="input-field"
        oninput="handleNameInput(event)"
      />

      <button onclick="handleNameSubmit()" id="nameSubmitBtn" class="cta-button cta-button-lg" disabled>
        Continuar
      </button>
    </div>
  `;
}

function handleNameInput(event) {
  userName = event.target.value;
  const btn = document.getElementById('nameSubmitBtn');
  btn.disabled = userName.length < 2;
}

function handleNameSubmit() {
  if (userName.length >= 2) {
    handleNext();
  }
}

function renderProtocolIntro() {
  return `
    <div class="quiz-container space-y-6">
      <h2 class="quiz-title quiz-title-lg font-serif text-center">
        ¡Conoce el Protocolo Gelatina Reductora que está ayudando a celebridades y a miles de mujeres comunes a adelgazar sin gastar una fortuna en farmacia!
      </h2>
      
      <p class="font-serif text-gray-700 text-center">
        Descubre el Protocolo <strong>10 veces mais potente</strong> que el Mounjaro y el Ozempic juntos...
      </p>
      
      <p class="font-serif text-gray-700 text-center">
        Controla tu apetito, acelera tu metabolismo y te ayuda a <span class="underline-yellow">eliminar grasa de forma rápida y eficaz</span>.
      </p>

      
      <div style="width: 100%; overflow: hidden; border-radius: 0.5rem; margin-top: 1.5rem;">
        <img src="${images.protocolo}" style="width: 100%; height: auto; object-fit: contain;" alt="Protocolo Gelatina Reductora" width="512" height="384" />
      </div>

      <button onclick="handleNext()" class="cta-button cta-button-lg">
        Continuar
      </button>
    </div>
  `;
}

function renderTestimonials() {
  const reviews = [
    { name: 'Gomita / Influenciadora Mexicana', photo: images.gomitaTestimonial, text: '"Ya había intentado de todo para adelgazar, pero nada funcionaba realmente. Después de empezar a usar la fórmula de la Gelatina Reductora en mi día a día, perdí 8 kilos en solo 17 días — sin cambiar nada en mi alimentación. Ahora me siento más ligera, más bonita y con una confianza que no sentía desde hacía años."' },
    { name: 'Fernanda Rodríguez — Ciudad de México', photo: images.fernandaTestimonial, text: '"Ya había intentado de todo para adelgazar, pero nada funcionaba. Después de incluir la fórmula de la Gelatina Reductora en mi rutina, perdí 11 kg en solo 3 semanas sin cambiar nada en mi alimentación. Ahora me siento más segura y llena de energía. ¡Este Protocolo cambió mi vida!"' },
    { name: 'Mariana López - Buenos Aires', photo: images.marianaTestimonial, text: '"Siempre luché con mi peso y me sentía cansada todo el tiempo. Desde que empecé con la fórmula de la Gelatina Reductora, logré bajar 15 kilos en 2 semanas. No tuve que hacer dietas extremas ni pasar hambre. Hoy tengo más energía, mi ropa me queda mejor y me siento orgullosa de mi misma."' }
  ];

  return `
    <div class="quiz-container space-y-6">
      <h2 class="quiz-title quiz-title-lg font-serif text-center">
        Historias Reales de Transformación de nuestras clientas con el Protocolo Gelatina Reductora
      </h2>

      ${reviews.map(rev => `
        <div class="testimonial-card">
          <img src="${rev.photo}" class="testimonial-image" alt="Transformación de ${rev.name}" width="400" height="400" loading="lazy" />
          <div class="testimonial-content">
            <p class="testimonial-quote font-serif">${rev.text}</p>
            <p class="testimonial-author">${rev.name}</p>
            <div class="testimonial-rating">
              <span class="stars">★★★★★</span>
              <span class="text-xs">Cliente Verificada</span>
            </div>
          </div>
        </div>
      `).join('')}

      <button onclick="handleNext()" class="cta-button cta-button-lg">
        Continuar
      </button>
    </div>
  `;
}

function renderLoading() {
  return `
    <div class="quiz-container loading-container">
      <h2 class="quiz-title quiz-title-lg font-serif mb-8">
        Espera mientras preparamos tu Protocolo Gelatina Reductora...
      </h2>

      <div class="carousel-container">
        ${carouselImages.map((img, idx) => `
          <img 
            src="${img}" 
            class="carousel-image"
            style="opacity: ${idx === carouselIndex ? 1 : 0}"
            alt="Transformación ${idx + 1}"
            width="512"
            height="256"
          />
        `).join('')}
        <div class="carousel-dots">
          ${carouselImages.map((_, idx) => `
            <div class="carousel-dot ${idx === carouselIndex ? 'active' : ''}"></div>
          `).join('')}
        </div>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" style="width: ${loadingProgress}%"></div>
      </div>
      <p class="progress-text font-serif">${Math.round(loadingProgress)}%</p>
    </div>
  `;
}

function startLoading() {
  loadingProgress = 0;
  loadingInterval = setInterval(() => {
    loadingProgress += 1.5;
    if (loadingProgress >= 100) {
      loadingProgress = 100;
      clearInterval(loadingInterval);
      clearInterval(carouselInterval);
      setTimeout(() => {
        handleNext();
      }, 100);
    }
    updateLoadingUI();
  }, 50);
  
  carouselInterval = setInterval(() => {
    carouselIndex = (carouselIndex + 1) % carouselImages.length;
    updateCarouselUI();
  }, 800);
}

function updateLoadingUI() {
  const fill = document.querySelector('.progress-fill');
  const text = document.querySelector('.progress-text');
  if (fill) fill.style.width = loadingProgress + '%';
  if (text) text.textContent = Math.round(loadingProgress) + '%';
}

function updateCarouselUI() {
  const imgs = document.querySelectorAll('.carousel-image');
  const dots = document.querySelectorAll('.carousel-dot');
  imgs.forEach((img, idx) => img.style.opacity = idx === carouselIndex ? 1 : 0);
  dots.forEach((dot, idx) => dot.classList.toggle('active', idx === carouselIndex));
}

function renderResult() {
  const imcValue = calcularIMC();
  const cat = getIMCCategory(imcValue);
  const pos = Math.min(Math.max(((imcValue - 15) / (35 - 15)) * 100, 0), 100);
  const name = userName.toUpperCase() || 'AMIGA';

  return `
    <div class="quiz-container space-y-6">
      <h2 class="quiz-title quiz-title-lg font-serif">
        ¡ATENCIÓN, ${name}!
      </h2>

      <p class="font-serif text-gray-700" style="line-height: 1.6;">
        Según tus respuestas, tu cuerpo está en modo <strong>ACUMULACIÓN DE GRASA</strong>. Si no actúas HOY, esta situación tiende a <strong>EMPEORAR</strong>.
      </p>

      <div class="space-y-4 mt-6">
        <div class="imc-display">
          <p class="imc-label">Tu IMC:</p>
          <p class="imc-value">${imcValue.toFixed(1)}</p>
        </div>
        
        <div class="imc-bar-container">
          <div class="imc-indicator" style="left: ${pos}%">
            <span class="imc-indicator-label">Tú hoy</span>
            <div class="imc-indicator-arrow"></div>
          </div>
          
          <div class="imc-bar">
            <div class="imc-bar-section imc-bajo ${cat === 'bajo' ? 'active' : ''}">Bajo peso</div>
            <div class="imc-bar-section imc-normal ${cat === 'normal' ? 'active' : ''}">Normal</div>
            <div class="imc-bar-section imc-sobrepeso ${cat === 'sobrepeso' ? 'active' : ''}">Sobrepeso</div>
            <div class="imc-bar-section imc-obesidad ${cat === 'obesidad' ? 'active' : ''}">Obesidad</div>
          </div>
        </div>
      </div>

      <div class="alert-list mt-8">
        <div class="alert-item">
          <span class="alert-icon red">${icons.x}</span>
          <span>Metabolismo lento y dificultad para adelgazar aunque comas poco</span>
        </div>
        <div class="alert-item">
          <span class="alert-icon red">${icons.x}</span>
          <span>Cansancio constante y sensación de hinchazón</span>
        </div>
        <div class="alert-item">
          <span class="alert-icon green">${icons.checkLg}</span>
          <span>Con el Protocolo Gelatina Reductora, tu cuerpo acelera la quema de grasa de forma natural</span>
        </div>
      </div>

      <div class="text-center py-4 mt-4">
        <p class="text-sm text-gray-600 mb-4">Mira la transformación de <span style="color: var(--news-yellow); font-weight: 600;">Rosana Rosalez</span>.</p>
        <img src="${images.rosana}" style="width: 100%; border-radius: 0.5rem;" alt="Transformación de Rosana" />
      </div>

      <button onclick="handleNext()" class="cta-button cta-button-lg">
        Continuar
      </button>
    </div>
  `;
}

function renderTransformReady() {
  return `
    <div class="quiz-container space-y-6">
      <h2 class="quiz-title quiz-title-lg font-serif">
        ¿Estás lista para transformar tu cuerpo y tu salud?
      </h2>

      <div style="width: 100%; overflow: hidden; border-radius: 0.5rem;">
        <img src="${images.beforeAfter}" style="width: 100%; height: auto;" alt="Antes y Después" />
      </div>

      <div class="comparison-grid">
        <div class="comparison-column">
          <h4 class="comparison-title red">Sin el Protocolo</h4>
          <div class="comparison-list">
            <div class="comparison-item">
              <span class="comparison-icon" style="color: #ef4444;">${icons.x}</span>
              <span>Metabolismo Lento</span>
            </div>
            <div class="comparison-item">
              <span class="comparison-icon" style="color: #ef4444;">${icons.x}</span>
              <span>Energía Baja</span>
            </div>
          </div>
        </div>
        <div class="comparison-column">
          <h4 class="comparison-title green">Con el Protocolo</h4>
          <div class="comparison-list">
            <div class="comparison-item">
              <span class="comparison-icon" style="color: #16a34a;">${icons.checkLg}</span>
              <span>Metabolismo Acelerado</span>
            </div>
            <div class="comparison-item">
              <span class="comparison-icon" style="color: #16a34a;">${icons.checkLg}</span>
              <span>Energía Fuerte</span>
            </div>
          </div>
        </div>
      </div>

      <button onclick="handleNext()" class="cta-button cta-button-lg">
        Continuar
      </button>
    </div>
  `;
}

function renderVideoPage() {
  return `
    <div class="quiz-container space-y-6">
      <h2 class="quiz-title text-xl font-serif text-center" style="text-transform: uppercase;">
        MIRA EL VIDEO A CONTINUACIÓN Y DESCUBRE CÓMO ACCEDER A TU PROTOCOLO DE GELATINA REDUCTORA.
      </h2>

      <div class="video-container">
        <div class="video-wrapper">
          <style>
            wistia-player[media-id='8xc87ip699']:not(:defined) {
              background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/8xc87ip699/swatch');
              display: block;
              filter: blur(5px);
              padding-top: 152.5%;
            }
          </style>
          <wistia-player media-id="8xc87ip699" seo="false" aspect="0.6557377049180327"></wistia-player>
        </div>
      </div>

      <div id="ctaButtonContainer" class="${showCTAButton ? '' : 'hidden'}" style="margin-top: 1rem;">
        <a
          href="https://pay.hotmart.com/I103092154N?off=8pqi3d4c&checkoutMode=10"
          onclick="handleCTAClick()"
          class="cta-link animate-pulse-cta-strong"
        >
          <span>ACCEDER A MI PROTOCOLO PERSONALIZADO AHORA</span>
          ${icons.arrowRight}
        </a>
      </div>

      <div class="comments-section">
        <h4 class="comments-title">Comentarios (154)</h4>
        <div class="comments-list">
          <div class="comment">
            <img src="${images.profilePhoto1}" class="comment-avatar" width="32" height="32" />
            <div class="comment-content">
              <p class="comment-author">Mariana Gutiérrez</p>
              <p class="comment-text">Este video me abrió los ojos. En pocas semanas vi cómo mi abdomen desinflamaba y la ropa volvía a quedarme.</p>
              <p class="comment-meta">Me gusta · Responder · hace 2 min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function handleCTAClick() {
  if (window.QuizAnalytics) {
    window.QuizAnalytics.trackCheckout('https://pay.hotmart.com/I103092154N?off=8pqi3d4c&checkoutMode=10', step);
  }
}

function render() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  switch(step) {
    case 0: container.innerHTML = renderIntro(); break;
    case 1: container.innerHTML = renderButtons('¿Cuál es su género?', ['Mujer', 'Hombre'], null, 'genero'); break;
    case 2: container.innerHTML = renderButtons('¿Qué edad tienes?', ['18 a 29 años', '30 a 39 años', '40 a 49 años', '50 a 59 años', '60 años o más'], null, 'edad'); break;
    case 3: container.innerHTML = renderSlider('¿Cuál es su peso actual?', 40, 160, 'kg', 'Su peso será fundamental para ajustar la dosis del Protocolo.', 70, 'peso'); break;
    case 4: container.innerHTML = renderSlider('¿Cuál es su altura?', 140, 200, 'cm', null, 165, 'altura'); break;
    case 5: container.innerHTML = renderButtons('¿Cuántas veces has intentado adelgazar?', ['Menos de 3 veces', 'De 3 a 5 veces', 'Más de 5 veces', 'Ya perdí la cuenta'], null, 'intentos'); break;
    case 6: container.innerHTML = renderButtons('¿Cómo es tu nivel de ansiedad?', ['Bajo', 'Moderado', 'Alto', 'Tengo mucha hambre emocional'], null, 'ansiedad'); break;
    case 7: container.innerHTML = renderButtons('¿Cuál es tu mayor dificultad para adelgazar?', ['Falta de tiempo', 'Metabolismo lento', 'Hambre excesiva', 'Ganas de comer dulces'], null, 'dificultad'); break;
    case 8: container.innerHTML = renderInput(); break;
    case 9: container.innerHTML = renderProtocolIntro(); break;
    case 10: container.innerHTML = renderTestimonials(); break;
    case 11: container.innerHTML = renderLoading(); startLoading(); break;
    case 12: container.innerHTML = renderResult(); break;
    case 13: container.innerHTML = renderTransformReady(); break;
    case 14: container.innerHTML = renderVideoPage(); break;
  }
}

// Global handleNext for inline calls
window.handleNext = handleNext;
window.handleAnswerSelect = handleAnswerSelect;
window.handleSliderChange = handleSliderChange;
window.handleSliderContinue = handleSliderContinue;
window.handleNameInput = handleNameInput;
window.handleNameSubmit = handleNameSubmit;
window.handleCTAClick = handleCTAClick;

document.addEventListener('DOMContentLoaded', () => {
  render();
  
  // Wistia tracking
  window._wq = window._wq || [];
  window._wq.push({
    id: "8xc87ip699",
    onReady: (video) => {
      video.bind("play", () => isPlaying = true);
      video.bind("pause", () => isPlaying = false);
      video.bind("secondchange", (s) => {
        if (s >= CTA_THRESHOLD_SECONDS && !showCTAButton) {
          showCTAButton = true;
          const cta = document.getElementById('ctaButtonContainer');
          if (cta) cta.classList.remove('hidden');
        }
      });
    }
  });
});
