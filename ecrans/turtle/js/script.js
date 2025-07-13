document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Kikko Microsite: Document chargé. Lancement du script moteur v10 (FINAL, COMPLET ET CORRIGÉ).");

    // --- VÉRIFICATION DE LA PRÉSENCE DES DONNÉES ---
    if (typeof uiTranslations === 'undefined' || typeof cardData === 'undefined' || typeof provenanceData === 'undefined') {
        console.error("❌ ERREUR CRITIQUE: Fichiers de données manquants. Assurez-vous que translations.js et provenance.js sont chargés AVANT script.js.");
        document.body.innerHTML = '<h1>Erreur de chargement. Veuillez vérifier la console.</h1>';
        return;
    }
    console.log("✅ Fichiers de données trouvés.");

    // --- VARIABLES GLOBALES ---
    let currentLang = 'fr';
    let currentThumbnailIndex = 0;
    let currentModalImageIndex = 0;
    let currentQuizQuestionIndex = 0;
    let userAnswers = [];
    const synth = window.speechSynthesis;
    let voices = [];

    // --- SÉLECTEURS D'ÉLÉMENTS ---
    const DOMElements = {
        languageBar: document.getElementById('language-bar'),
        cardTitle: document.getElementById('card-title'),
        scientificName: document.getElementById('scientific-name'),
        thumbnailSlideshow: document.getElementById('thumbnail-slideshow'),
        thumbnailImage: document.getElementById('thumbnail-image'),
        thumbPrev: document.getElementById('thumb-prev'),
        thumbNext: document.getElementById('thumb-next'),
        thumbCounter: document.getElementById('thumb-counter'),
        forgerInfo: document.getElementById('forger-info'),
        statsHeader: document.getElementById('stats-header'),
        statsContainer: document.getElementById('stats-container'),
        descriptionHeader: document.getElementById('description-header'),
        cardDescription: document.getElementById('card-description'),
        funFactsHeader: document.getElementById('fun-facts-header'),
        funFactsList: document.getElementById('fun-facts-list'),
        quizFloatingButton: document.getElementById('quiz-floating-button'),
        bourdonFloatingButton: document.getElementById('bourdon-floating-button'),
        // Modals
        galleryModal: document.getElementById('gallery-modal'),
        quizModal: document.getElementById('quiz-modal'),
        monologueModal: document.getElementById('monologue-modal'),
        provenanceModal: document.getElementById('provenance-modal'),
        // Contenus des Modals
        modalImage: document.getElementById('modal-image'),
        modalPrevBtn: document.getElementById('modal-prev'),
        modalNextBtn: document.getElementById('modal-next'),
        quizModalHeader: document.getElementById('quiz-modal-header'),
        quizModalContainer: document.getElementById('quiz-modal-container'),
        provenanceHeader: document.getElementById('provenance-header'),
        provenanceDetails: document.getElementById('provenance-details'),
        monologueModalHeader: document.querySelector('#monologue-modal h3'),
        monologueModalText: document.querySelector('#monologue-modal p'),
        monologueModalVoiceSelect: document.querySelector('#monologue-modal #monologue-voice-select'),
        monologueModalPlayPause: document.querySelector('#monologue-modal #play-pause-button'),
        monologueModalStop: document.querySelector('#monologue-modal #stop-button'),
    };
    console.log("🔍 Sélecteurs DOM initialisés.");

    // --- INITIALISATION ---
    function init() {
        console.log("🚀 Initialisation de l'interface.");
        loadVoices();
        createLangButtons();
        updateUI(currentLang);
        setupEventListeners();
        updateThumbnail();
        console.log("✅ Initialisation terminée.");
    }

    // --- MISE À JOUR DE L'UI ---
    function updateUI(lang) {
        console.log(`🌐 Mise à jour pour la langue: ${lang}`);
        currentLang = lang;
        const t = uiTranslations[lang] || uiTranslations['en'];
        
        try {
            // Mettre à jour les textes statiques
            DOMElements.statsHeader.textContent = t.statsHeader;
            DOMElements.descriptionHeader.textContent = t.descriptionHeader;
            DOMElements.funFactsHeader.textContent = t.funFactsHeader;
            DOMElements.provenanceHeader.textContent = t.provenanceHeader;
            DOMElements.quizModalHeader.textContent = t.quizModalHeader;
            if(DOMElements.monologueModalHeader) DOMElements.monologueModalHeader.textContent = t.monologueHeader;
            
            // Mettre à jour les données de la carte
            DOMElements.cardTitle.textContent = `${cardData.deck_emoji} ${cardData.name_i18n[lang]}`;
            DOMElements.scientificName.textContent = cardData.scientificName;
            DOMElements.cardDescription.textContent = cardData.description_i18n[lang];
            if(DOMElements.monologueModalText) DOMElements.monologueModalText.textContent = cardData.monologue_i18n[lang];
            
            populateForgerInfo(lang);
            populateStats(lang);
            populateFunFacts(lang);
            populateVoiceList();
            
            document.querySelectorAll('.language-bar button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
        } catch (error) {
            console.error("❌ ERREUR lors de la mise à jour de l'UI:", error);
        }
    }

    // --- POPULATION DES SECTIONS ---
    function createLangButtons() {
        DOMElements.languageBar.innerHTML = '';
        Object.keys(uiTranslations).forEach(langCode => {
            const button = document.createElement('button');
            button.dataset.lang = langCode;
            button.innerHTML = `${uiTranslations[langCode].flag} <span class="lang-name">${uiTranslations[langCode].name}</span>`;
            DOMElements.languageBar.appendChild(button);
        });
    }
    
    function populateForgerInfo(lang) {
        const forgeDate = new Date(provenanceData.pollenChronicle[0].timestamp);
        const forgerLog = provenanceData.hiveLog.find(log => log.agent.startsWith('Forager_'));
        const forgerName = forgerLog ? forgerLog.agent.split('_')[1] : 'Unknown';
        DOMElements.forgerInfo.innerHTML = `<span>${uiTranslations[lang].forgerLabel} <strong>${forgerName}</strong></span> | <span>${uiTranslations[lang].dateLabel} ${forgeDate.toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}</span> <button class="provenance-shortcut" id="provenance-shortcut">🏅</button>`;
    }
    
    function populateStats(lang) {
        DOMElements.statsContainer.innerHTML = '';
        const group1 = document.createElement('div');
        group1.className = 'stats-group';
        const group2 = document.createElement('div');
        group2.className = 'stats-group';
        Object.keys(cardData.stats_i18n).forEach(key => {
            const stat = cardData.stats_i18n[key];
            const history = cardData.battle_history[key];
            const historyText = `🔼${history.high_wins}|🔽${history.high_losses}  🔻${history.low_wins}|🔺${history.low_losses}`;
            const unitText = stat.unit_i18n ? stat.unit_i18n[lang] : stat.unit;
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            statItem.innerHTML = `<div class="stat-line-1"><span class="stat-label">${stat.emoji} ${stat.label[lang]}</span></div><div class="stat-line-2"><span class="stat-value">${stat.value} ${unitText}</span></div><div class="stat-line-3 battle-history">${historyText}</div>`;
            if (key.startsWith('vitesse')) { group2.appendChild(statItem); } else { group1.appendChild(statItem); }
        });
        DOMElements.statsContainer.appendChild(group1);
        DOMElements.statsContainer.appendChild(group2);
    }

    function populateFunFacts(lang) {
        DOMElements.funFactsList.innerHTML = '';
        cardData.fun_facts_i18n[lang].forEach(fact => { const li = document.createElement('li'); li.textContent = fact; DOMElements.funFactsList.appendChild(li); });
    }

    // --- LOGIQUE TTS ---
    function loadVoices() {
        const setVoices = () => { voices = synth.getVoices(); if (voices.length) { console.log(`🗣️ ${voices.length} voix TTS chargées.`); populateVoiceList(); }};
        if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = setVoices;
        setVoices();
    }

    function populateVoiceList() {
        const voiceSelect = DOMElements.monologueModalVoiceSelect;
        if (!voiceSelect) { console.error("❌ Sélecteur de voix introuvable dans le modal !"); return; }
        voiceSelect.innerHTML = '';
        const filteredVoices = voices.filter(v => v.lang.startsWith(currentLang));
        const googleVoices = filteredVoices.filter(v => v.name.toLowerCase().includes('google'));
        const otherVoices = filteredVoices.filter(v => !v.name.toLowerCase().includes('google'));
        const sortedVoices = [...googleVoices, ...otherVoices];
        if (DOMElements.monologueModalPlayPause) DOMElements.monologueModalPlayPause.disabled = sortedVoices.length === 0;
        if (sortedVoices.length === 0) { const option = document.createElement('option'); option.textContent = `Aucune voix pour ${currentLang}`; voiceSelect.appendChild(option); return; }
        sortedVoices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name.replace(/Google/i, 'G.')} (${voice.lang})`;
            option.setAttribute('data-name', voice.name);
            voiceSelect.appendChild(option);
        });
    }

    function speak(autoPlay = false) {
        if (synth.speaking) synth.cancel();
        if (!autoPlay) return;

        const textToSpeak = DOMElements.monologueModalText.textContent;
        if (textToSpeak) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            const selectedVoiceName = DOMElements.monologueModalVoiceSelect.selectedOptions[0]?.getAttribute('data-name');
            utterance.voice = voices.find(v => v.name === selectedVoiceName);
            utterance.lang = currentLang;
            utterance.onstart = () => DOMElements.monologueModalPlayPause.textContent = '⏸️';
            utterance.onend = () => DOMElements.monologueModalPlayPause.textContent = '▶️';
            utterance.onpause = () => DOMElements.monologueModalPlayPause.textContent = '▶️';
            utterance.onresume = () => DOMElements.monologueModalPlayPause.textContent = '⏸️';
            console.log(`▶️ Lancement de la lecture TTS avec la voix: ${utterance.voice ? utterance.voice.name : 'défaut'}`);
            synth.speak(utterance);
        }
    }
    
    function handlePlayPause() {
        if (synth.speaking && !synth.paused) synth.pause();
        else if (synth.paused) synth.resume();
        else speak(true);
    }

    // --- LOGIQUE MODALS ET GALERIES ---
    function openModal(modal) { if(modal) modal.style.display = 'block'; }
    function closeModal(modal) { synth.cancel(); if(modal) modal.style.display = 'none'; }
    
    function updateThumbnail() { DOMElements.thumbnailImage.src = cardData.images[currentThumbnailIndex]; DOMElements.thumbCounter.textContent = `${currentThumbnailIndex + 1}/${cardData.images.length}`; }
    function changeThumbnail(direction) { currentThumbnailIndex = (currentThumbnailIndex + direction + cardData.images.length) % cardData.images.length; updateThumbnail(); }
    
    function openGalleryModal(index) { currentModalImageIndex = index; updateModalImage(); openModal(DOMElements.galleryModal); }
    function updateModalImage() { DOMElements.modalImage.src = cardData.images[currentModalImageIndex]; }
    function changeModalImage(direction) { currentModalImageIndex = (currentModalImageIndex + direction + cardData.images.length) % cardData.images.length; updateModalImage(); }
    
    function openQuizModal() { console.log("🧠 Ouverture du modal de quiz."); currentQuizQuestionIndex = 0; userAnswers = new Array(getQuizData().length).fill(null); renderQuizQuestion(); openModal(DOMElements.quizModal); }
    function getQuizData() { const quizInference = provenanceData.hiveLog.find(log => log.action === 'Inference:GenerateQuiz'); return quizInference.output.quiz_data_i18n[currentLang] || quizInference.output.quiz_data_i18n['en']; }
    
    function renderQuizQuestion() {
        const quizData = getQuizData(); const t = uiTranslations[currentLang];
        const container = DOMElements.quizModalContainer;
        if (currentQuizQuestionIndex >= quizData.length) { renderQuizResults(); return; }
        const q = quizData[currentQuizQuestionIndex];
        let optionsHtml = Object.keys(q.options).map(key => `<button data-option-key="${key}" ${userAnswers[currentQuizQuestionIndex] ? 'disabled' : ''}>${key}) ${q.options[key]}</button>`).join('');
        container.innerHTML = `<div class="quiz-question" data-question-index="${currentQuizQuestionIndex}"><p>${currentQuizQuestionIndex + 1}. ${q.question}</p><div class="quiz-options">${optionsHtml}</div><div class="quiz-feedback"></div></div><div class="quiz-progress">${currentQuizQuestionIndex + 1} / ${quizData.length}</div><div class="quiz-nav"><button id="quiz-prev" ${currentQuizQuestionIndex === 0 ? 'disabled' : ''}>${t.quizPrev}</button><button id="quiz-next">${currentQuizQuestionIndex === quizData.length - 1 ? t.quizFinish : t.quizNext}</button></div>`;
        if (userAnswers[currentQuizQuestionIndex]) { showQuizAnswerResult(userAnswers[currentQuizQuestionIndex]); }
    }

    function renderQuizResults() {
        const quizData = getQuizData(); let score = 0;
        userAnswers.forEach((answer, index) => { if (answer === quizData[index].answer) score++; });
        const t = uiTranslations[currentLang];
        DOMElements.quizModalContainer.innerHTML = `<h3>${t.quizFinish}</h3><p class="quiz-score">${t.quizScore} ${score} / ${quizData.length}</p><button id="quiz-restart">${t.openQuizButton || "Recommencer le Quiz"}</button>`;
    }
    
    function showQuizAnswerResult(selectedOptionKey) {
        const questionBlock = DOMElements.quizModalContainer.querySelector('.quiz-question');
        const feedbackEl = questionBlock.querySelector('.quiz-feedback');
        const correctAnswerKey = getQuizData()[currentQuizQuestionIndex].answer;
        const isCorrect = selectedOptionKey === correctAnswerKey;
        feedbackEl.textContent = isCorrect ? uiTranslations[currentLang].feedbackCorrect : uiTranslations[currentLang].feedbackIncorrect;
        feedbackEl.className = `quiz-feedback show ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
        questionBlock.querySelectorAll('.quiz-options button').forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.optionKey === correctAnswerKey) btn.classList.add('correct');
            if (btn.dataset.optionKey === selectedOptionKey && !isCorrect) btn.classList.add('incorrect');
        });
    }

    function handleQuizActions(event) {
        const target = event.target;
        if (target.id === 'quiz-next') { currentQuizQuestionIndex++; renderQuizQuestion(); } 
        else if (target.id === 'quiz-prev') { currentQuizQuestionIndex--; renderQuizQuestion(); } 
        else if (target.id === 'quiz-restart') { openQuizModal(); } 
        else if (target.closest('.quiz-options')) {
            const button = target.closest('button'); if (!button || button.disabled) return;
            userAnswers[currentQuizQuestionIndex] = button.dataset.optionKey;
            showQuizAnswerResult(button.dataset.optionKey);
        }
    }
    
    // --- GESTION DES ÉVÉNEMENTS ---
    function setupEventListeners() {
        console.log("🎧 Mise en place des écouteurs d'événements.");
        DOMElements.languageBar.addEventListener('click', (e) => { const btn = e.target.closest('button'); if (btn) updateUI(btn.dataset.lang); });
        DOMElements.thumbnailImage.addEventListener('click', () => openGalleryModal(currentThumbnailIndex));
        DOMElements.thumbNext.addEventListener('click', () => changeThumbnail(1));
        DOMElements.thumbPrev.addEventListener('click', () => changeThumbnail(-1));
        DOMElements.modalNextBtn.addEventListener('click', () => changeModalImage(1));
        DOMElements.modalPrevBtn.addEventListener('click', () => changeModalImage(-1));
        DOMElements.quizFloatingButton.addEventListener('click', openQuizModal);
        DOMElements.bourdonFloatingButton.addEventListener('click', () => { openModal(DOMElements.monologueModal); speak(true); });
        DOMElements.quizModal.addEventListener('click', handleQuizActions);
        
        if (DOMElements.monologueModalPlayPause) DOMElements.monologueModalPlayPause.addEventListener('click', handlePlayPause);
        if (DOMElements.monologueModalStop) DOMElements.monologueModalStop.addEventListener('click', () => synth.cancel());
        
        document.body.addEventListener('click', e => {
            if (e.target && e.target.id === 'provenance-shortcut') openModal(DOMElements.provenanceModal);
            if (e.target.classList.contains('close-button')) closeModal(e.target.closest('.modal'));
        });
        window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) closeModal(e.target); });
    }

    // --- DÉMARRAGE ---
    init();
});