(function() {
    window.step = 1;
    window.handleNext = function() {
        console.log("handleNext chamado, passo:", window.step);
        const container = document.getElementById('quiz-container');
        if (!container) return;
        
        window.step++;
        // Lógica simples de quiz para restaurar funcionalidade
        container.innerHTML = `
            <div class="quiz-container space-y-3">
                <h2 class="quiz-title font-serif">Paso ${window.step}</h2>
                <p class="quiz-subtitle">¿Cuál es tu objetivo principal?</p>
                <div class="options-container">
                    <button onclick="handleNext()" class="option-button">Perder peso rápido <span class="option-arrow">→</span></button>
                    <button onclick="handleNext()" class="option-button">Reducir medidas <span class="option-arrow">→</span></button>
                </div>
            </div>
        `;
    };
    
    window.QuizAnalytics = {
        trackCheckout: function(url, step) {
            console.log("Tracking checkout:", url, "Step:", step);
        }
    };
})();