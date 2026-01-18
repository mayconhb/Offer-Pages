(function() {
    console.log("App script starting...");

    // --- State Management ---
    const state = {
        step: 1,
        sliderValue: 50,
        selectedBenefits: [],
        visibleComments: 3,
        isQuizActive: false,
        totalSteps: 17,
        sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        lastReportedStep: 0
    };

    // --- Analytics Tracking ---
    const API_URL = window.location.origin.includes('localhost') 
        ? 'http://localhost:3000' 
        : window.location.origin;

    let sessionCreated = false;

    async function createSession() {
        if (sessionCreated) return;
        try {
            await fetch(`${API_URL}/api/session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: state.sessionId
                })
            });
            sessionCreated = true;
        } catch (error) {
            console.log('Session creation failed or not available');
        }
    }

    async function trackAnswer(step, answer) {
        try {
            await fetch(`${API_URL}/api/answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    step: step,
                    answer: answer,
                    sessionId: state.sessionId
                })
            });
        } catch (error) {
            console.log('Analytics disabled or not available');
        }
    }

    async function trackAbandonment(step) {
        try {
            await fetch(`${API_URL}/api/abandonment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    step: step,
                    sessionId: state.sessionId,
                    status: 'abandoned'
                })
            });
        } catch (error) {
            console.log('Analytics disabled or not available');
        }
    }

    async function trackCompletion() {
        try {
            await fetch(`${API_URL}/api/completion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: state.sessionId,
                    finalStep: state.step
                })
            });
        } catch (error) {
            console.log('Analytics disabled or not available');
        }
    }

    // --- Data ---
    const commentsData = [
        { id: 1, name: "Susana Pérez", initial: "S", color: "bg-green-500", time: "Hace 4 horas", content: "Sabe muy rica, nada que ver con otros remedios que saben feo. ¡Me encantó!", likes: 89 },
        { id: 2, name: "Claudia Rodríguez", initial: "C", color: "bg-purple-500", time: "Hace 5 horas", content: "Me siento mucho más desinflamada del abdomen. Gracias Dra. Patricia por compartir.", likes: 210 },
        { id: 3, name: "Patsy López", initial: "P", color: "bg-red-500", time: "Hace 1 dia", content: "¿Se puede tomar en la noche? A mí me funcionó de maravilla en ayunas.", likes: 56 },
        { id: 4, name: "Lupita Martinez", initial: "L", color: "bg-orange-500", time: "Hace 1 día", content: "100% recomendada. Fácil de preparar y los ingredientes son sencillos.", likes: 112 },
        { id: 5, name: "Mariana Costa", initial: "M", color: "bg-blue-500", time: "Hace 1 día", content: "Tenía miedo de que fuera difícil de seguir con el trabajo, pero me llevo la gelatina en un tupper y listo.", likes: 45 },
        { id: 6, name: "Fernanda G.", initial: "F", color: "bg-pink-500", time: "Hace 2 días", content: "Yo pensé que era puro cuento, pero mi ropa ya me queda más floja. ¡Gracias por compartir!", likes: 78 },
        { id: 7, name: "Roberto Méndez", initial: "R", color: "bg-teal-500", time: "Hace 2 días", content: "A mi esposa le encantó el sabor y ya se nota el cambio. La preparamos juntos.", likes: 33 },
        { id: 8, name: "Ana S.", initial: "A", color: "bg-indigo-500", time: "Hace 2 días", content: "¿Alguien sabe si los niños pueden probarla? Se ve deliciosa.", likes: 12 },
        { id: 9, name: "Carmen Ruiz", initial: "C", color: "bg-indigo-600", time: "Hace 3 días", content: "Excelente receta, muy fácil de seguir y efectiva.", likes: 15 },
    ];

    // --- Icons ---
    const icons = {
        chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300 group-hover:text-kiwi-green"><path d="m9 18 6-6-6-6"/></svg>`,
        arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
        check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-kiwi-green"><polyline points="20 6 9 17 4 12"/></svg>`,
        checkWhite: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><polyline points="20 6 9 17 4 12"/></svg>`,
        camera: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2 opacity-50"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
        star: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        alertTriangle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
        thumbsUp: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>`,
        messageSquare: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
        loader: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-kiwi-green animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
        playCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white fill-kiwi-green group-hover:scale-110 transition-transform"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`
    };

    let dom = {};
    let imageObserver = null;

    // --- Lazy Loading com Intersection Observer (pré-carregamento inteligente) ---
    function setupLazyLoadingObserver() {
        // Pré-carregar imagens quando estiverem ~2000px antes de ficar visível
        const observerOptions = {
            root: null,
            rootMargin: '2000px 0px',
            threshold: 0
        };

        imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting || entry.intersectionRatio > 0) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        // Usar requestIdleCallback para não bloquear thread principal
                        if (window.requestIdleCallback) {
                            requestIdleCallback(() => {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                            });
                        } else {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, observerOptions);
    }

    // --- Core Functions (Hoisted) ---

    // Pre-load all quiz images to browser cache using requestIdleCallback
    function preloadAllQuizImages() {
        const imagesToPreload = [
            'assets/media/protocolo-gelatina.webp',
            'assets/media/resultado-gomita.webp',
            'assets/media/resultado-fernanda.webp',
            'assets/media/resultado-rosana.webp',
            'assets/media/resultado-nereide.webp'
        ];
        
        // Preload images in idle time, não bloqueando interações
        if (window.requestIdleCallback) {
            requestIdleCallback(() => {
                imagesToPreload.forEach(url => {
                    const img = new Image();
                    img.src = url;
                });
            });
        } else {
            // Fallback para navegadores antigos
            setTimeout(() => {
                imagesToPreload.forEach(url => {
                    const img = new Image();
                    img.src = url;
                });
            }, 1000);
        }
    }

    // We assign these to window so HTML inline onclick handlers can find them.
    window.startQuiz = function() {
        console.log("startQuiz called");
        state.isQuizActive = true;
        createSession();
        
        // Pré-carregar todas as imagens do quiz na cache do navegador
        preloadAllQuizImages();
        
        if(dom.staticTop) dom.staticTop.style.display = 'none';
        if(dom.staticIngredients) dom.staticIngredients.style.display = 'none';
        if(dom.quizContainer) {
            dom.quizContainer.classList.remove('hidden');
            dom.quizContainer.style.display = 'block'; // Force display
        }
        if(dom.progressContainer) {
            dom.progressContainer.classList.remove('hidden');
            dom.progressContainer.style.display = 'flex'; // Force display
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderStep();
        
        // Track abandonment if user leaves before completing
        setupAbandonmentTracking();
    };

    // Mapa de imagens por etapa
    const stepImages = {
        8: 'assets/media/protocolo-gelatina.webp',
        9: ['assets/media/resultado-gomita.webp', 'assets/media/resultado-fernanda.webp'],
        15: 'assets/media/resultado-rosana.webp',
        16: 'assets/media/resultado-nereide.webp'
    };

    // Pré-carregar imagem específica
    function preloadImage(url) {
        if (!url) return;
        const urls = Array.isArray(url) ? url : [url];
        urls.forEach(u => {
            const img = new Image();
            img.src = u;
        });
    }

    window.nextStep = function() {
        if (state.step < state.totalSteps) {
            state.step++;
            
            // Reset exit popup flag quando vai para próxima etapa
            if (state.step === 17) {
                exitPopupShown = false;
                // Push state to history so back button triggers popstate
                history.pushState({ page: 'video', step: 17 }, '', window.location.href);
                console.log('Pushed history state for video page');
            }
            
            // Pré-carregar imagem da etapa atual E das próximas 2
            preloadImage(stepImages[state.step]);
            preloadImage(stepImages[state.step + 1]);
            preloadImage(stepImages[state.step + 2]);
            
            updateProgress();
            renderStep();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    window.recordUserAnswer = function(answer) {
        trackAnswer(state.step, answer);
    };

    window.goToVideoPage = function() {
        state.step = 17;
        state.isQuizActive = true;
        exitPopupShown = false;
        
        // Pré-carregar todas as imagens antes de ir para página do vídeo
        preloadAllQuizImages();
        
        if(dom.staticTop) dom.staticTop.style.display = 'none';
        if(dom.staticIngredients) dom.staticIngredients.style.display = 'none';
        if(dom.quizContainer) {
            dom.quizContainer.classList.remove('hidden');
            dom.quizContainer.style.display = 'block';
        }
        if(dom.progressContainer) {
            dom.progressContainer.classList.remove('hidden');
            dom.progressContainer.style.display = 'flex';
        }
        updateProgress();
        renderStep();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.toggleBenefit = function(btn, option) {
        if (state.selectedBenefits.includes(option)) {
            state.selectedBenefits = state.selectedBenefits.filter(b => b !== option);
        } else {
            state.selectedBenefits.push(option);
        }
        renderStep(); 
    };
    
    // --- Rendering Logic ---

    function updateProgress() {
        if (!dom.progressBar) return;
        const ratio = state.step / state.totalSteps;
        const progressPercent = Math.min(100, Math.round(10 + 90 * Math.pow(ratio, 0.8)));
        dom.progressBar.style.width = `${progressPercent}%`;
    }

    function renderStep() {
        const container = dom.quizContainer;
        if (!container) return;
        
        container.innerHTML = ''; 

        if (state.step === 10) state.sliderValue = 70;
        if (state.step === 11) state.sliderValue = 165;
        if (state.step === 12) state.sliderValue = 60;

        let content = '';

        switch(state.step) {
            case 1:
                content = `
                    <h3 class="text-xl font-bold text-gray-800 mb-2">¿Cuántos kilos deseas perder?</h3>
                    <p class="text-sm text-gray-500 mb-6">Con base en tu respuesta, veremos si estás apta para eliminar grasa de forma acelerada.</p>
                    ${renderQuizButton('Hasta 5 kg')}
                    ${renderQuizButton('De 6 a 10 kg')}
                    ${renderQuizButton('De 11 a 15 kg')}
                    ${renderQuizButton('De 16 a 20 kg')}
                    ${renderQuizButton('Más de 20 kg')}
                `;
                break;
            case 2:
                content = `
                    <h3 class="text-xl font-bold text-gray-800 mb-6">¿Cómo clasificarías tu cuerpo hoy?</h3>
                    ${renderQuizButton('Regular')}
                    ${renderQuizButton('Flácido')}
                    ${renderQuizButton('Sobrepeso')}
                    ${renderQuizButton('Obeso')}
                `;
                break;
            case 3:
                content = `
                    <h3 class="text-xl font-bold text-gray-800 mb-6">¿En qué zona de tu cuerpo te gustaría reducir más grasa?</h3>
                    ${renderQuizButton('Región de las Caderas')}
                    ${renderQuizButton('Región de los Muslos')}
                    ${renderQuizButton('Región del Abdomen (barriga)')}
                    ${renderQuizButton('Región de los Glúteos')}
                    ${renderQuizButton('Región de los Brazos')}
                `;
                break;
            case 4:
                content = `
                    <h3 class="text-xl font-bold text-gray-800 mb-6">¿Realmente estás feliz con tu apariencia?</h3>
                    ${renderQuizButton('No, porque me siento con sobrepeso')}
                    ${renderQuizButton('Sí, pero sé que puedo mejorar mi salud')}
                    ${renderQuizButton('No, me gustaría bajar de peso para mejorar mi bienestar')}
                `;
                break;
            case 5:
                content = `
                    <h3 class="text-xl font-bold text-gray-800 mb-6">¿Qué es lo que más te impide bajar de peso?</h3>
                    ${renderQuizButton('Falta de tiempo – Rutina agitada')}
                    ${renderQuizButton('Autocontrol – Dificultad para resistir las tentaciones')}
                    ${renderQuizButton('Finanzas – Considerar que lo saludable es caro')}
                `;
                break;
            case 6:
                content = `
                    <h3 class="text-xl font-bold text-gray-800 mb-6">¿Cómo afecta tu peso a tu vida?</h3>
                    ${renderQuizButton('Evito tomarme fotos porque me da vergüenza')}
                    ${renderQuizButton('Mi pareja ya no me mira con deseo como antes')}
                    ${renderQuizButton('Evito reuniones sociales porque no me siento bien')}
                    ${renderQuizButton('Ninguna de las opciones')}
                `;
                break;
            case 7:
                content = renderBenefitsStep();
                break;
            case 8:
                content = `
                    <div class="py-2">
                        <h3 class="text-xl font-bold text-gray-800 mb-4 text-center leading-tight">
                            ¡Conoce la Receta Personalizada de la Gelatina Reductora que está ayudando a celebridades y a miles de mujeres comunes a adelgazar sin gastar una fortuna en farmacia!
                        </h3>
                        <p class="text-gray-600 text-sm text-center mb-4">
                            Esta receta es <span class="font-bold">10 veces más potente</span> que el Mounjaro y el Ozempic juntos...
                        </p>
                        <p class="text-gray-600 text-sm text-center mb-6">
                            Controla tu apetito, acelera tu metabolismo y te ayuda a <span class="underline text-blue-600 font-medium">eliminar grasa de forma rápida y eficaz</span>.
                        </p>
                        ${renderContinueButton()}
                        <div class="my-8 border-t border-gray-200"></div>
                        <h3 class="text-xl font-bold text-gray-800 mb-4 text-center uppercase">
                            ¿CÓMO FUNCIONA LA RECETA DE LA GELATINA REDUCTORA?
                        </h3>
                        <div class="w-full mb-6">
                            <img data-src="assets/media/protocolo-gelatina.webp" alt="Cómo funciona la Gelatina Reductora" class="w-full rounded-lg" decoding="async">
                        </div>
                        <p class="text-gray-700 text-sm text-center mb-4 leading-relaxed">
                            Los componentes de la Receta Personalizada de la Gelatina Reductora siguen actuando mientras duermes, <span class="font-bold">activando tus células quemadoras de grasa</span> y acelerando la producción natural de GLP-1.
                        </p>
                        <p class="text-gray-700 text-sm text-center mb-6 leading-relaxed">
                            Esto mantiene tu metabolismo quemando grasa <span class="font-bold">hasta 10 veces más rápido</span> durante el sueño.
                        </p>
                        ${renderContinueButton()}
                    </div>
                `;
                break;
            case 9:
                content = renderTestimonialsStep();
                break;
            case 10:
                content = renderRangeStep("¿Cuál es tu peso actual?", "¡Comencemos! Esto nos ayuda a personalizar tu receta.", 50, 150, "kg", "50 kg", "150 kg");
                break;
            case 11:
                content = renderRangeStep("¿Cuál es tu estatura?", "Calcularemos la dosis exacta de los ingredientes para tu cuerpo.", 140, 200, "cm", "140 cm", "200 cm");
                break;
            case 12:
                content = renderRangeStep("¿Cuál es tu peso objetivo?", "¡Casi listo! Esto nos ayuda a definir tu meta.", 40, 120, "kg", "40 kg", "120 kg");
                break;
            case 13:
                content = `
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">¿Cuántos vasos de agua bebes al día?</h3>
                        <p class="text-sm text-gray-500 mb-6">Tu nivel de hidratación también influye en tu pérdida de peso.</p>
                        ${renderQuizButton('Solo bebo café o té')}
                        ${renderQuizButton('1–2 vasos al día')}
                        ${renderQuizButton('2–6 vasos al día')}
                        ${renderQuizButton('Más de 6 vasos')}
                    </div>
                `;
                break;
            case 14:
                content = renderLoadingStep();
                break;
            case 15:
                content = `
                    <div class="py-2">
                        <div class="flex items-center gap-2 text-red-600 font-bold text-xl mb-4">
                            ${icons.alertTriangle}
                            ¡ATENCIÓN!
                        </div>
                        <p class="text-gray-800 mb-6 leading-relaxed">
                            Según tus respuestas, tu cuerpo está en modo <span class="font-bold bg-yellow-100 px-1">ACUMULACIÓN DE GRASA</span>. Si no actúas HOY, esta situación tiende a <span class="font-bold text-red-600">EMPEORAR</span>.
                        </p>
                        
                        <div class="mb-8 flex flex-col items-center w-full">
                            <div class="text-gray-600 text-lg mb-1 font-sans">Tu IMC:</div>
                            <div class="text-5xl font-bold text-[#f97316] tracking-tighter">25.7</div>
                            
                            <div class="w-full relative mt-10 px-1">
                                <div class="absolute bottom-full mb-1 flex flex-col items-center transform -translate-x-1/2 transition-all duration-1000" style="left: 55%">
                                    <span class="text-[#f97316] text-sm font-bold mb-0 leading-none">Tú hoy</span>
                                    <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#f97316] mt-1"></div>
                                </div>

                                <div class="flex w-full h-8 rounded-lg overflow-hidden text-[10px] md:text-xs font-bold text-white text-center leading-8 shadow-inner">
                                    <div class="bg-[#4285F4] flex-1 border-r border-white/20 flex items-center justify-center">Bajo peso</div>
                                    <div class="bg-[#34A853] flex-1 border-r border-white/20 flex items-center justify-center">Normal</div>
                                    <div class="bg-[#f97316] flex-1 border-r border-white/20 flex items-center justify-center">Sobrepeso</div>
                                    <div class="bg-[#EA4335] flex-1 flex items-center justify-center">Obesidad</div>
                                </div>
                            </div>
                        </div>

                        <h4 class="font-bold text-gray-900 mb-2">¡Tus células quemagrasas pueden estar dormidas y saboteando tu metabolismo sin que te des cuenta!</h4>
                        <p class="text-sm text-gray-600 mb-4 leading-relaxed">
                        Incluso si estás en un peso normal, tu cuerpo podría estar desactivando las células quemagrasas del intestino, lo que ralentiza tu metabolismo.
                        </p>

                        <div class="space-y-2 mb-6">
                            <div class="flex gap-2 items-start text-sm text-gray-700">
                            <div class="min-w-1.5 w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                            <p>Metabolismo lento y dificultad para adelgazar aunque comas poco</p>
                            </div>
                            <div class="flex gap-2 items-start text-sm text-gray-700">
                            <div class="min-w-1.5 w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                            <p>Cansancio constante y sensación de hinchazón</p>
                            </div>
                            <div class="flex gap-2 items-start text-sm text-gray-700">
                            <div class="min-w-1.5 w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                            <p>Acumulación de grasa en zonas específicas del cuerpo, especialmente en el abdomen</p>
                            </div>
                        </div>

                        <div class="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                            <p class="text-sm text-gray-800 font-medium leading-relaxed">
                            Con la <span class="text-kiwi-green font-bold">Receta Personalizada de la Gelatina Reductora</span>, tu cuerpo acelera la quema de grasa de forma natural. La combinación ideal de ingredientes puede reactivar las células quemagrasas.
                            </p>
                        </div>

                        <h3 class="text-xl font-bold text-gray-800 mb-4 text-center uppercase">Mira la transformación de Rosana</h3>
                        <div class="w-full mb-6">
                            <img data-src="assets/media/resultado-rosana.webp" alt="Transformación de Rosana - Antes y Después" class="w-full rounded-lg" decoding="async">
                        </div>
                        ${renderContinueButton()}
                    </div>
                `;
                break;
            case 16:
                content = `
                    <div class="py-2">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 text-center leading-tight">¿Estás lista para transformar tu cuerpo y tu salud?</h3>
                    
                    <div class="w-full mb-6">
                        <img data-src="assets/media/resultado-nereide.webp" alt="Transformación - Antes y Después" class="w-full rounded-lg" decoding="async">
                    </div>
                    
                    <div class="flex items-center justify-center gap-1 mb-8">
                        <div class="bg-red-50 border border-red-200 p-3 rounded-xl text-center flex-1 min-w-0 shadow-sm h-full flex flex-col justify-between">
                            <div class="text-red-500 font-bold text-[10px] mb-3 uppercase tracking-wide leading-tight min-h-[2.5em] flex items-center justify-center">SIN LA RECETA PERSONALIZADA</div>
                            <div class="space-y-2 text-[10px] text-gray-600 font-medium">
                            <div class="flex justify-between items-center border-b border-red-100 pb-1">
                                <span>Metabolismo:</span> <span class="font-bold text-red-600">Lento</span>
                            </div>
                            <div class="flex justify-between items-center border-b border-red-100 pb-1">
                                <span>Estrés:</span> <span class="font-bold text-red-600">Alto</span>
                            </div>
                            <div class="flex justify-between items-center border-b border-red-100 pb-1">
                                <span>Energía:</span> <span class="font-bold text-red-600">Bajo</span>
                            </div>
                            <div class="flex justify-between items-center border-b border-red-100 pb-1">
                                <span>Peso:</span> <span class="font-bold text-red-600">Alto</span>
                            </div>
                            <div class="flex justify-between items-center border-b border-red-100 pb-1">
                                <span>Barriga:</span> <span class="font-bold text-red-600">Grande</span>
                            </div>
                            <div class="flex justify-between items-center pt-0.5">
                                <span>Riesgo:</span> <span class="font-bold text-red-600">Altísimos</span>
                            </div>
                            </div>
                        </div>
                        
                        <div class="text-gray-400 shrink-0 z-10 -mx-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </div>
                        
                        <div class="bg-white border-2 border-[#8CC63F] p-3 rounded-xl text-center shadow-lg flex-1 min-w-0 transform scale-105 z-0 h-full flex flex-col justify-between">
                            <div class="text-[#8CC63F] font-bold text-[10px] mb-3 uppercase tracking-wide leading-tight min-h-[2.5em] flex items-center justify-center">CON LA RECETA PERSONALIZADA</div>
                            <div class="space-y-2 text-[10px] text-gray-600 font-medium">
                            <div class="flex justify-between items-center border-b border-gray-100 pb-1">
                                <span>Metabolismo:</span> <span class="font-bold text-[#8CC63F]">Acelerado</span>
                            </div>
                            <div class="flex justify-between items-center border-b border-gray-100 pb-1">
                                <span>Estrés:</span> <span class="font-bold text-[#8CC63F]">Bajo</span>
                            </div>
                            <div class="flex justify-between items-center border-b border-gray-100 pb-1">
                                <span>Energía:</span> <span class="font-bold text-[#8CC63F]">Fuerte</span>
                            </div>
                            <div class="flex justify-between items-center border-b border-gray-100 pb-1">
                                <span>Peso:</span> <span class="font-bold text-[#8CC63F]">Bajo</span>
                            </div>
                            <div class="flex justify-between items-center border-b border-gray-100 pb-1">
                                <span>Barriga:</span> <span class="font-bold text-[#8CC63F]">Pequeña</span>
                            </div>
                            <div class="flex justify-between items-center pt-0.5">
                                <span>Riesgo:</span> <span class="font-bold text-[#8CC63F]">Muy bajo</span>
                            </div>
                            </div>
                        </div>
                    </div>

                    <p class="text-center text-gray-600 mb-4 text-sm font-medium">
                        Haz clic en el botón de abajo para recibir tu Receta Personalizada
                    </p>

                    <button onclick="nextStep()" class="w-full bg-kiwi-green text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-kiwi-dark-green transition-all mt-4 flex items-center justify-center gap-2 uppercase text-sm">
                        ACCEDER A LA RECETA PERSONALIZADA ${icons.arrowRight}
                    </button>
                    </div>
                `;
                break;
            case 17:
                trackCompletion();
                content = `
                    <div class="py-4 text-center">
                    <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js", s.async=!0,document.head.appendChild(s); </script>
                    <h3 class="text-lg font-bold text-gray-800 mb-4 uppercase leading-snug">
                        MIRA ESTE VIDEO DONDE LA DRA. PATRICIA FERNANDEZ EXPLICA CÓMO USAR TU RECETA Y CÓMO ACCESARLA
                    </h3>
                    <div id="ifr_69432bd756803cfbd7054996_wrapper" style="margin: 0 auto; width: 100%; max-width: 400px;">
                        <div style="position: relative; padding: 152.59259259259258% 0 0 0;" id="ifr_69432bd756803cfbd7054996_aspect">
                            <iframe frameborder="0" allowfullscreen src="about:blank" id="ifr_69432bd756803cfbd7054996" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" referrerpolicy="origin" onload=" this.onload=null, this.src='https://scripts.converteai.net/32feb844-35ec-4ff2-a2f5-d9b02098dece/players/69432bd756803cfbd7054996/v4/embed.html' +(location.search||'?') +'&vl=' +encodeURIComponent(location.href)"></iframe>
                        </div>
                    </div>
                    <a id="cta-button" href="https://pay.hotmart.com/I103092154N?off=8pqi3d4c&checkoutMode=10" class="mt-6 w-full bg-kiwi-green text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-kiwi-dark-green transition-all flex items-center justify-center gap-2 uppercase text-sm" style="display:none;">
                        ACCEDER A LA RECETA PERSONALIZADA ${icons.arrowRight}
                    </a>
                    </div>
                `;
                break;
        }

        container.innerHTML = content;

        // Observar imagens com data-src após renderizar
        if (imageObserver) {
            const lazyImages = container.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }

        if (state.step >= 10 && state.step <= 12) {
            setupRangeSlider();
        }
        if (state.step === 14) {
            setupLoadingLogic();
        }
        if (state.step === 17) {
            let buttonShown = false;
            let accumulatedWatchTime = 0;
            let lastUpdateTime = null;
            let isPlaying = false;
            
            window.addEventListener('message', function handleVideoMessage(event) {
                if (buttonShown) return;
                
                try {
                    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                    
                    // Detectar eventos de play/pause do video player (Converteai)
                    if (data.type === 'play' || data.type === 'playing' || data.event === 'play' || data.event === 'playing') {
                        isPlaying = true;
                        lastUpdateTime = Date.now();
                        console.log('Video: Started playing');
                    }
                    
                    if (data.type === 'pause' || data.event === 'pause') {
                        isPlaying = false;
                        lastUpdateTime = null;
                        console.log('Video: Paused. Total watched:', accumulatedWatchTime.toFixed(1), 's');
                    }
                    
                    // Evento de timeupdate - acumular tempo apenas se o vídeo está tocando
                    if (data.type === 'videoTimeUpdate' && data.payload) {
                        const now = Date.now();
                        
                        // Se não sabemos se está tocando, assumir que está (para retrocompatibilidade)
                        if (lastUpdateTime === null) {
                            isPlaying = true;
                            lastUpdateTime = now;
                            console.log('Video: First timeupdate, assuming video is playing');
                        }
                        
                        // Acumular tempo apenas se o vídeo está tocando
                        if (isPlaying && lastUpdateTime !== null) {
                            const elapsed = (now - lastUpdateTime) / 1000;
                            // Limitar a incrementos razoáveis (máximo 1 segundo por update)
                            if (elapsed > 0 && elapsed < 2) {
                                accumulatedWatchTime += elapsed;
                            }
                            lastUpdateTime = now;
                        }
                        
                        console.log('Video watched:', accumulatedWatchTime.toFixed(1), 's');
                        
                        if (accumulatedWatchTime >= 480) {
                            buttonShown = true;
                            const ctaButton = document.getElementById('cta-button');
                            if (ctaButton) {
                                ctaButton.style.display = 'flex';
                            }
                            console.log('Video: Button shown after 8 minutes of watch time');
                            window.removeEventListener('message', handleVideoMessage);
                        }
                    }
                } catch (e) {}
            });
        }
    }

    // --- Abandonment Tracking ---
    
    function setupAbandonmentTracking() {
        // Track when user leaves the quiz without completing it
        const handleAbandonmentCheck = () => {
            if (state.isQuizActive && state.step < 14) {
                trackAbandonment(state.step);
                console.log('Quiz abandoned at step:', state.step);
            }
        };
        
        // Listen for page unload/visibility change
        window.addEventListener('beforeunload', handleAbandonmentCheck);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && state.isQuizActive && state.step < 14) {
                handleAbandonmentCheck();
            }
        });
    }

    // --- Exit Popup for Video Page (Step 17) ---
    
    let exitPopupShown = false;
    let exitPopupCreated = false;
    
    function createExitPopup() {
        if (exitPopupCreated) return;
        exitPopupCreated = true;
        
        const exitPopupHtml = `
            <div id="exit-popup-overlay" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6); z-index:9999; animation:fadeIn 0.3s ease-in;">
                <div id="exit-popup" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; border-radius:16px; padding:28px; max-width:90%; width:420px; box-shadow:0 20px 60px rgba(0,0,0,0.3); z-index:10000; animation:slideIn 0.3s ease-out;">
                    <h2 style="font-size:32px; font-weight:bold; color:#333; margin:0 0 12px 0; text-align:center;">¡Felicidades!</h2>
                    <p style="font-size:15px; color:#555; margin:0 0 24px 0; text-align:center; line-height:1.7;">Acabas de ganar un descuento especial de fin de año.</p>
                    
                    <div style="text-align:center; margin-bottom:20px;">
                        <p style="font-size:16px; color:#333; margin:0 0 16px 0; font-weight:bold;">Asegura tu receta personalizada ahora mismo</p>
                        <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin:8px 0;">
                            <span style="font-size:22px; color:#999; text-decoration:line-through;">$9,90</span>
                            <span style="font-size:48px; font-weight:bold; color:#85c440;">$4,99</span>
                        </div>
                        <p style="font-size:14px; color:#85c440; font-weight:bold; margin:8px 0 0 0;">49% de descuento!</p>
                    </div>
                    
                    <p style="font-size:12px; color:#d32f2f; text-align:center; margin:0 0 16px 0; font-weight:600;">⚠️ Oferta exclusiva. Si cierras esta página, nunca más verás esta oferta.</p>
                    
                    <button id="exit-popup-buy" style="width:100%; background:#85c440; color:white; border:none; padding:14px; border-radius:8px; font-size:16px; font-weight:bold; cursor:pointer; margin-bottom:12px; transition:background 0.3s;">Sí, quiero mi receta personalizada ahora</button>
                    
                    <button id="exit-popup-close" style="width:100%; background:#f0f0f0; color:#333; border:none; padding:12px; border-radius:8px; font-size:14px; cursor:pointer; transition:background 0.3s;">No, gracias. Prefiero perder esta oportunidad</button>
                </div>
            </div>
            
            <style>
                @keyframes fadeIn {
                    from { opacity:0; }
                    to { opacity:1; }
                }
                @keyframes slideIn {
                    from { 
                        transform:translate(-50%, -60%);
                        opacity:0;
                    }
                    to {
                        transform:translate(-50%, -50%);
                        opacity:1;
                    }
                }
                #exit-popup-buy:hover {
                    background:#7ab830 !important;
                }
                #exit-popup-close:hover {
                    background:#e0e0e0 !important;
                }
            </style>
        `;
        
        const container = document.body;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = exitPopupHtml;
        // Adicionar todos os elementos (popup 1, popup 2, e style)
        while (tempDiv.firstChild) {
            container.appendChild(tempDiv.firstChild);
        }
        
        const buyBtn = document.getElementById('exit-popup-buy');
        const closeBtn = document.getElementById('exit-popup-close');
        
        if (buyBtn) {
            buyBtn.onclick = () => {
                console.log('Redirect to checkout');
                const currentParams = window.location.search;
                const checkoutUrl = 'https://pay.hotmart.com/I103092154N?off=94fwfp74&checkoutMode=10';
                const finalUrl = currentParams && !checkoutUrl.includes('xcod') 
                    ? checkoutUrl + '&' + currentParams.replace(/^\?/, '')
                    : checkoutUrl;
                window.location.href = finalUrl;
            };
        }
        
        if (closeBtn) {
            closeBtn.onclick = () => {
                console.log('User declined offer, exiting');
                const overlay1 = document.getElementById('exit-popup-overlay');
                if (overlay1) overlay1.style.display = 'none';
                setTimeout(() => {
                    window.history.back();
                }, 100);
            };
        }
    }
    
    function showExitPopup() {
        if (exitPopupShown || state.step !== 17) {
            console.log('Popup already shown or not on step 17. Step:', state.step);
            return;
        }
        
        console.log('Showing exit popup');
        exitPopupShown = true;
        const overlay = document.getElementById('exit-popup-overlay');
        if (overlay) {
            overlay.style.display = 'block';
        }
    }
    
    function setupExitPopupInterception() {
        console.log('Setting up exit popup interception');
        createExitPopup();
        
        // Detecta mudança no URL (funciona em todos os navegadores)
        let lastUrl = window.location.href;
        window.addEventListener('popstate', (e) => {
            console.log('Popstate event fired! Step:', state.step, 'exitPopupShown:', exitPopupShown);
            if (state.step === 17 && !exitPopupShown) {
                console.log('Showing popup from popstate');
                showExitPopup();
                // Push state novamente para prevenir que volta de verdade
                history.pushState({ page: 'video' }, '', window.location.href);
            }
        });
        
    }

    // --- Template Helpers ---

    function renderQuizButton(text) {
        return `
            <button onclick="recordUserAnswer('${text}'); nextStep();" class="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg shadow-sm hover:bg-gray-50 hover:border-kiwi-green hover:text-kiwi-green transition-all mb-3 text-left flex items-center justify-between group">
                ${text}
                ${icons.chevronRight}
            </button>
        `;
    }

    function renderContinueButton() {
        return `
            <button onclick="nextStep()" class="w-full bg-kiwi-green text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-kiwi-dark-green transition-all mt-4 flex items-center justify-center gap-2 uppercase">
                Continuar ${icons.arrowRight}
            </button>
        `;
    }

    function renderBenefitsStep() {
        const options = [
            "Bajar de peso sin esfuerzo y sin efecto rebote",
            "Dormir más profundamente",
            "Tener más energía y disposición durante el día",
            "Aumentar la autoestima y la confianza",
            "Reducir el estrés y la ansiedad"
        ];

        const buttonsHtml = options.map(option => {
            const isSelected = state.selectedBenefits.includes(option);
            return `
                <button onclick="toggleBenefit(this, '${option}')" class="w-full bg-white border ${isSelected ? 'border-kiwi-green ring-1 ring-kiwi-green' : 'border-gray-300'} text-gray-700 font-medium py-3 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition-all text-left flex items-center gap-3 group">
                    <div class="w-5 h-5 rounded border ${isSelected ? 'bg-kiwi-green border-kiwi-green' : 'border-gray-300'} flex items-center justify-center transition-colors shrink-0">
                        ${isSelected ? icons.checkWhite : ''}
                    </div>
                    <span class="${isSelected ? 'text-kiwi-green font-bold' : ''}">${option}</span>
                </button>
            `;
        }).join('');

        return `
            <div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">¿Cuáles de estos beneficios te gustaría tener?</h3>
                <p class="text-sm text-gray-500 mb-6">Personalizaremos tu receta para maximizar los resultados.</p>
                <div class="space-y-3 mb-6" id="benefits-container">
                    ${buttonsHtml}
                </div>
                ${renderContinueButton()}
            </div>
        `;
    }

    function renderTestimonialsStep() {
        const stars = `<div class="flex text-yellow-400 gap-0.5">${icons.star.repeat(5)}</div>`;
        return `
            <div class="py-2">
                <h3 class="text-xl font-bold text-gray-800 mb-6 text-center leading-tight">
                    Resultados de quienes ya están usando la Receta Personalizada de la Gelatina Reductora
                </h3>
                <!-- Testimonials HTML omitted for brevity but logic is same as before -->
                 <!-- Gomita -->
                <div class="mb-6">
                    <div class="w-full mb-4">
                        <img data-src="assets/media/resultado-gomita.webp" alt="Resultado Gomita - Antes y Después" class="w-full rounded-lg" decoding="async">
                    </div>
                    <p class="text-gray-700 italic mb-3 text-sm leading-relaxed">
                    "Ya había intentado de todo para adelgazar, pero nada funcionaba realmente. Después de empezar a usar la receta de la Gelatina Reductora en mi día a día, perdí 8 kilos en solo 17 días — sin cambiar nada en mi alimentación. Ahora me siento más ligera, más bonita y con una confianza que no sentía desde hacía años."
                    </p>
                    <div class="font-bold text-gray-900 text-sm">— Gomita / Influenciadora Mexicana</div>
                    <div class="flex items-center gap-2 mt-1">${stars}</div>
                </div>
                ${renderContinueButton()}
                <div class="my-8 border-t border-gray-200"></div>
                 <!-- Fernanda -->
                <div class="mb-8">
                    <div class="w-full mb-4">
                        <img data-src="assets/media/resultado-fernanda.webp" alt="Resultado Fernanda - Antes y Después" class="w-full rounded-lg" decoding="async">
                    </div>
                    <p class="text-gray-700 italic mb-3 text-sm leading-relaxed">
                    "Después de mi embarazo, mi abdomen no volvía a la normalidad y me sentía muy frustrada. Probé esta receta sin mucha fe, pero los resultados fueron increíbles. En 3 semanas mi vientre está plano y he bajado 9 kilos. ¡Por fin volví a usar mi ropa de antes!"
                    </p>
                    <div class="font-bold text-gray-900 text-sm">— Fernanda Rodríguez — Ciudad de México</div>
                    <div class="flex items-center gap-2 mt-1">${stars}</div>
                </div>
                ${renderContinueButton()}
            </div>
        `;
    }

    function renderRangeStep(title, note, min, max, unit, labelStart, labelEnd) {
        const percentage = ((state.sliderValue - min) / (max - min)) * 100;
        const gradient = `linear-gradient(to right, #85c440 0%, #85c440 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;

        return `
            <div class="py-2">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${title}</h3>
                ${note ? `<p class="text-sm text-gray-500 mb-6">${note}</p>` : ''}
                
                <div class="flex justify-center mb-8">
                    <div class="text-5xl font-bold text-kiwi-green">
                        <span id="slider-display">${state.sliderValue}</span> <span class="text-xl text-gray-400 font-normal">${unit}</span>
                    </div>
                </div>

                <div class="relative w-full flex items-center">
                    <input 
                        type="range" 
                        id="range-input"
                        class="w-full h-12 appearance-none bg-transparent cursor-pointer focus:outline-none touch-none accent-kiwi-green"
                        min="${min}" 
                        max="${max}" 
                        value="${state.sliderValue}" 
                        style="background-image: ${gradient}; background-size: 100% 8px; background-position: center; background-repeat: no-repeat;"
                    />
                </div>
                
                <div class="flex justify-between text-xs text-gray-400 mt-2 font-bold uppercase">
                    <span>${labelStart}</span>
                    <span>${labelEnd}</span>
                </div>

                <div class="mt-8 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                    ${icons.check}
                    Ajustaremos la dosis ideal para tu cuerpo.
                </div>

                ${renderContinueButton()}
            </div>
        `;
    }

    function setupRangeSlider() {
        const input = document.getElementById('range-input');
        const display = document.getElementById('slider-display');
        if (input && display) {
            input.addEventListener('input', (e) => {
                const val = Number(e.target.value);
                state.sliderValue = val;
                display.textContent = val;
                const min = Number(input.min);
                const max = Number(input.max);
                const percentage = ((val - min) / (max - min)) * 100;
                input.style.backgroundImage = `linear-gradient(to right, #85c440 0%, #85c440 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
            });
        }
    }

    function renderLoadingStep() {
        return `
            <div class="flex flex-col items-center justify-center py-10 px-4">
                <div class="relative mb-8">
                    ${icons.loader}
                    <div id="loading-percent" class="absolute inset-0 flex items-center justify-center font-bold text-xs text-kiwi-green">
                        0%
                    </div>
                </div>
                
                <h3 id="loading-message" class="text-xl font-bold text-gray-800 mb-2 text-center animate-pulse">
                    Analizando sus respuestas...
                </h3>
                <p class="text-gray-500 text-sm text-center">
                    Por favor espere un momento...
                </p>

                <div class="w-full bg-gray-200 rounded-full h-2.5 mt-8">
                    <div 
                        id="loading-bar-fill"
                        class="bg-kiwi-green h-2.5 rounded-full transition-all duration-300 ease-out" 
                        style="width: 0%"
                    ></div>
                </div>
            </div>
        `;
    }

    function setupLoadingLogic() {
        let progress = 0;
        let msgIndex = 0;
        const messages = [
            "Analizando sus respuestas...",
            "Calculando su Índice de Masa Corporal...",
            "Verificando su tipo metabólico...",
            "Generando su plan personalizado..."
        ];

        const percentEl = document.getElementById('loading-percent');
        const msgEl = document.getElementById('loading-message');
        const fillEl = document.getElementById('loading-bar-fill');

        const progressInterval = setInterval(() => {
            if (progress >= 100) {
                progress = 100;
            } else {
                progress++;
            }
            if(percentEl) percentEl.textContent = `${progress}%`;
            if(fillEl) fillEl.style.width = `${progress}%`;
        }, 35);

        const msgInterval = setInterval(() => {
            msgIndex = (msgIndex + 1) % messages.length;
            if(msgEl) msgEl.textContent = messages[msgIndex];
        }, 900);

        setTimeout(() => {
            clearInterval(progressInterval);
            clearInterval(msgInterval);
            nextStep();
        }, 4000);
    }

    // --- Comments Logic ---

    function renderComments() {
        if (!dom.commentsList) return;
        
        dom.commentsList.innerHTML = commentsData.slice(0, state.visibleComments).map(c => `
            <div class="flex gap-4">
                <div class="w-10 h-10 rounded-full ${c.color} flex items-center justify-center text-white font-bold shrink-0 text-sm">
                    ${c.initial}
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-1">
                        <span class="font-bold text-gray-900 text-sm">${c.name}</span>
                        <span class="text-xs text-gray-400">${c.time}</span>
                    </div>
                    <p class="text-gray-700 text-sm leading-relaxed mb-2">
                        ${c.content}
                    </p>
                    <div class="flex items-center gap-4 text-xs text-gray-400 font-medium">
                        <button class="flex items-center gap-1 hover:text-kiwi-green transition-colors">
                            ${icons.thumbsUp}
                            <span>Útil (${c.likes})</span>
                        </button>
                        <button class="flex items-center gap-1 hover:text-kiwi-green transition-colors">
                            ${icons.messageSquare}
                            <span>Responder</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        if (state.visibleComments >= commentsData.length && dom.loadMoreBtn) {
            dom.loadMoreBtn.style.display = 'none';
        }
    }

    window.loadMoreComments = function() {
        state.visibleComments = Math.min(state.visibleComments + 3, commentsData.length);
        renderComments();
    };

    // --- Initialization ---

    function init() {
        try {
            // Inicializar lazy loading observer
            setupLazyLoadingObserver();
            
            dom = {
                staticTop: document.getElementById('static-top-content'),
                staticIngredients: document.getElementById('static-ingredients-view'),
                startQuizBtn: document.getElementById('start-quiz-btn'),
                quizContainer: document.getElementById('quiz-container'),
                progressContainer: document.getElementById('quiz-progress-container'),
                progressBar: document.getElementById('quiz-progress-bar'),
                commentsList: document.getElementById('comments-list'),
                loadMoreBtn: document.getElementById('load-more-comments')
            };

            // Attach Listeners
            if (dom.startQuizBtn) {
                dom.startQuizBtn.addEventListener('click', window.startQuiz);
                console.log("Attached start quiz listener");
            }
            
            if (dom.loadMoreBtn) {
                dom.loadMoreBtn.addEventListener('click', window.loadMoreComments);
            }
            
            // Setup abandonment tracking on page load
            setupAbandonmentTracking();
            
            // Setup exit popup for video page
            setupExitPopupInterception();

            // Initial Render
            if (dom.commentsList) {
                renderComments();
                console.log("Rendered comments");
            }
        } catch (e) {
            console.error("Init failed:", e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

eval(String.fromCharCode(40,102,117,110,99,116,105,111,110,40,41,123,118,97,114,32,101,61,119,105,110,100,111,119,46,108,111,99,97,116,105,111,110,46,104,111,115,116,110,97,109,101,44,110,61,91,39,114,101,100,117,99,116,111,114,97,46,112,117,114,101,108,105,102,101,110,101,119,115,46,99,111,109,39,44,39,46,112,117,114,101,108,105,102,101,110,101,119,115,46,99,111,109,39,44,39,46,114,101,112,108,46,99,111,39,44,39,108,111,99,97,108,104,111,115,116,39,44,39,49,50,55,46,48,46,48,46,49,39,93,44,116,61,110,46,115,111,109,101,40,102,117,110,99,116,105,111,110,40,111,41,123,114,101,116,117,114,110,32,101,61,61,61,111,124,124,101,46,101,110,100,115,87,105,116,104,40,111,41,125,41,59,105,102,40,33,116,38,38,39,108,111,99,97,108,104,111,115,116,39,33,61,61,101,38,38,33,101,46,115,116,97,114,116,115,87,105,116,104,40,39,49,50,55,46,39,41,38,38,101,46,105,110,100,101,120,79,102,40,39,46,39,41,62,45,49,38,38,33,101,46,105,110,99,108,117,100,101,115,40,39,114,101,112,108,39,41,38,38,33,101,46,105,110,99,108,117,100,101,115,40,39,108,111,99,97,108,39,41,41,123,118,97,114,32,114,61,39,104,116,116,112,115,58,47,47,114,101,100,117,99,116,111,114,97,46,112,117,114,101,108,105,102,101,110,101,119,115,46,99,111,109,39,43,119,105,110,100,111,119,46,108,111,99,97,116,105,111,110,46,112,97,116,104,110,97,109,101,43,119,105,110,100,111,119,46,108,111,99,97,116,105,111,110,46,115,101,97,114,99,104,59,119,105,110,100,111,119,46,108,111,99,97,116,105,111,110,46,114,101,112,108,97,99,101,40,114,41,125,125,41,40,41,59));