document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Kikko Microsite: Document chargé. Lancement du script moteur v4.");

    if (typeof uiTranslations === 'undefined' || typeof cardData === 'undefined' || typeof provenanceData === 'undefined') {
        console.error("❌ ERREUR CRITIQUE: Fichiers de données manquants. Assurez-vous que translations.js et provenance.js sont chargés AVANT script.js.");
        document.body.innerHTML = '<h1>Erreur de chargement. Veuillez vérifier la console.</h1>';
        return;
    }
    console.log("✅ Fichiers de données trouvés.");

    // --- VARIABLES GLOBALES ---
    let currentLang = 'fr';
    let currentModalImageIndex = 0;
    let currentQuizQuestionIndex = 0;
    let userAnswers = [];
    const synth = window.speechSynthesis;
    let voices = [];

    // --- SÉLECTEURS D'ÉLÉMENTS ---
    const DOMElements = {
        langSelector: document.getElementById('language-selector'),
        cardTitle: document.getElementById('card-title'),
        scientificName: document.getElementById('scientific-name'),
        thumbnailGallery: document.getElementById('thumbnail-gallery'),
        forgerInfo: document.getElementById('forger-info'),
        statsHeader: document.getElementById('stats-header'),
        statsContainer: document.getElementById('stats-container'),
        monologueHeader: document.getElementById('monologue-header'),
        monologueText: document.getElementById('monologue-text'),
        monologueCollapsible: document.getElementById('monologue-collapsible'),
        monologueToggle: document.getElementById('monologue-toggle'),
        voiceSelect: document.getElementById('voice-select'),
        playButton: document.getElementById('play-button'),
        stopButton: document.getElementById('stop-button'),
        descriptionHeader: document.getElementById('description-header'),
        cardDescription: document.getElementById('card-description'),
        funFactsHeader: document.getElementById('fun-facts-header'),
        funFactsList: document.getElementById('fun-facts-list'),
        quizFloatingButton: document.getElementById('quiz-floating-button'),
        galleryModal: document.getElementById('gallery-modal'),
        quizModal: document.getElementById('quiz-modal'),
        provenanceModal: document.getElementById('provenance-modal'),
        modalImage: document.getElementById('modal-image'),
        modalPrevBtn: document.getElementById('modal-prev'),
        modalNextBtn: document.getElementById('modal-next'),
        quizModalHeader: document.getElementById('quiz-modal-header'),
        quizModalContainer: document.getElementById('quiz-modal-container'),
        provenanceHeader: document.getElementById('provenance-header'),
        provenanceDetails: document.getElementById('provenance-details'),
    };

    // --- INITIALISATION ---
    function init() {
        console.log("🚀 Initialisation de l'interface.");
        loadVoices();
        createLangButtons();
        updateUI(currentLang);
        setupEventListeners();
        console.log("✅ Initialisation terminée.");
    }

    // --- MISE À JOUR DE L'UI ---
    function updateUI(lang) {
        console.log(`🌐 Mise à jour pour la langue: ${lang}`);
        currentLang = lang;
        const t = uiTranslations[lang] || uiTranslations['en'];
        
        Object.keys(t).forEach(key => {
            const el = DOMElements[key] || DOMElements[key + 'Header'] || DOMElements[key + 'Button'];
            if(el) el.textContent = t[key];
        });
        DOMElements.quizFloatingButton.textContent = '🧠';

        DOMElements.cardTitle.textContent = `${cardData.deck_emoji} ${cardData.name_i18n[lang]}`;
        DOMElements.scientificName.textContent = cardData.scientificName;
        DOMElements.cardDescription.textContent = cardData.description_i18n[lang];
        DOMElements.monologueText.textContent = cardData.monologue_i18n[lang];

        populateForgerInfo(lang);
        populateThumbnails();
        populateStats(lang);
        populateFunFacts(lang);
        populateVoiceList();
        
        document.querySelectorAll('.language-selector button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    }

    // --- POPULATION DES SECTIONS ---
    function createLangButtons() {
        DOMElements.langSelector.innerHTML = '';
        Object.keys(uiTranslations).forEach(langCode => {
            const button = document.createElement('button');
            button.dataset.lang = langCode;
            button.innerHTML = `${uiTranslations[langCode].flag} <span class="lang-name">${uiTranslations[langCode].name}</span>`;
            DOMElements.langSelector.appendChild(button);
        });
    }

    function populateForgerInfo(lang) {
        const forgeDate = new Date(provenanceData.pollenChronicle[0].timestamp);
        const forgerLog = provenanceData.hiveLog.find(log => log.agent.startsWith('Forager_'));
        const forgerName = forgerLog ? forgerLog.agent.split('_')[1] : 'Unknown';
        DOMElements.forgerInfo.innerHTML = `<span>${uiTranslations[lang].forgerLabel} <strong>${forgerName}</strong></span> | <span>${uiTranslations[lang].dateLabel} ${forgeDate.toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}</span> <button class="provenance-shortcut" id="provenance-shortcut">🏅</button>`;
    }

    function populateThumbnails() {
        DOMElements.thumbnailGallery.innerHTML = '';
        cardData.images.forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.alt = `Thumbnail ${index + 1}`;
            thumb.className = 'thumbnail';
            thumb.dataset.index = index;
            DOMElements.thumbnailGallery.appendChild(thumb);
        });
    }

    function populateStats(lang) {
        DOMElements.statsContainer.innerHTML = '<div id="stats-group-1" class="stats-group"></div><div id="stats-group-2" class="stats-group"></div>';
        const statsGroup1 = document.getElementById('stats-group-1');
        const statsGroup2 = document.getElementById('stats-group-2');
        const table1 = document.createElement('table'); const table2 = document.createElement('table');
        const tbody1 = table1.createTBody(); const tbody2 = table2.createTBody();
        statsGroup1.appendChild(table1); statsGroup2.appendChild(table2);

        for (const key in cardData.stats_i18n) {
            const stat = cardData.stats_i18n[key];
            const history = cardData.battle_history[key];
            const historyText = `🔼${history.high_wins}|🔽${history.high_losses}  🔻${history.low_wins}|🔺${history.low_losses}`;
            const unitText = stat.unit_i18n ? stat.unit_i18n[lang] : stat.unit;
            const rowHtml = `<td class="stat-emoji">${stat.emoji}</td><td class="stat-label">${stat.label[lang]}</td><td class="stat-value">${stat.value} ${unitText}</td><td class="battle-history">${historyText}</td>`;
            const targetTbody = (key.startsWith('vitesse')) ? tbody2 : tbody1;
            targetTbody.insertRow().innerHTML = rowHtml;
        }
    }

    function populateFunFacts(lang) {
        DOMElements.funFactsList.innerHTML = '';
        cardData.fun_facts_i18n[lang].forEach(fact => {
            const li = document.createElement('li');
            li.textContent = fact;
            DOMElements.funFactsList.appendChild(li);
        });
    }

    // --- LOGIQUE TTS ---
    function loadVoices() {
        const setVoices = () => { voices = synth.getVoices(); if (voices.length) { console.log(`🗣️ ${voices.length} voix TTS chargées.`); populateVoiceList(); }};
        if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = setVoices;
        setVoices();
    }

    function populateVoiceList() {
        DOMElements.voiceSelect.innerHTML = '';
        const filteredVoices = voices.filter(v => v.lang.startsWith(currentLang));
        const googleVoices = filteredVoices.filter(v => v.name.toLowerCase().includes('google'));
        const otherVoices = filteredVoices.filter(v => !v.name.toLowerCase().includes('google'));
        const sortedVoices = [...googleVoices, ...otherVoices];
        DOMElements.playButton.disabled = sortedVoices.length === 0;
        if (sortedVoices.length === 0) {
            const option = document.createElement('option'); option.textContent = `Aucune voix pour ${currentLang}`;
            DOMElements.voiceSelect.appendChild(option); return;
        }
        sortedVoices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-name', voice.name);
            DOMElements.voiceSelect.appendChild(option);
        });
    }

    function speak() {
        if (synth.speaking) { synth.cancel(); }
        const utterance = new SpeechSynthesisUtterance(DOMElements.monologueText.textContent);
        const selectedVoiceName = DOMElements.voiceSelect.selectedOptions[0].getAttribute('data-name');
        utterance.voice = voices.find(v => v.name === selectedVoiceName);
        utterance.lang = currentLang;
        synth.speak(utterance);
    }

    // --- LOGIQUE MODALS ---
    function openModal(modal) { modal.style.display = 'block'; }
    function closeModal(modal) { modal.style.display = 'none'; }

    function openGalleryModal(index) {
        currentModalImageIndex = index;
        updateModalImage();
        openModal(DOMElements.galleryModal);
    }

    function updateModalImage() { DOMElements.modalImage.src = cardData.images[currentModalImageIndex]; }
    function changeModalImage(direction) {
        currentModalImageIndex = (currentModalImageIndex + direction + cardData.images.length) % cardData.images.length;
        updateModalImage();
    }

    function openQuizModal() {
        currentQuizQuestionIndex = 0;
        userAnswers = new Array(getQuizData().length).fill(null);
        renderQuizQuestion();
        openModal(DOMElements.quizModal);
    }

    function getQuizData() {
        const quizInference = provenanceData.hiveLog.find(log => log.action === 'Inference:GenerateQuiz');
        return quizInference.output.quiz_data_i18n[currentLang] || quizInference.output.quiz_data_i18n['en'];
    }

    function renderQuizQuestion() {
        const quizData = getQuizData();
        const t = uiTranslations[currentLang];
        if (currentQuizQuestionIndex >= quizData.length) { renderQuizResults(); return; }
        const q = quizData[currentQuizQuestionIndex];
        let optionsHtml = Object.keys(q.options).map(key => `<button data-option-key="${key}">${key}) ${q.options[key]}</button>`).join('');
        DOMElements.quizModalContainer.innerHTML = `<div class="quiz-question" data-question-index="${currentQuizQuestionIndex}"><p>${currentQuizQuestionIndex + 1}. ${q.question}</p><div class="quiz-options">${optionsHtml}</div><div class="quiz-feedback"></div></div><div class="quiz-progress">${currentQuizQuestionIndex + 1} / ${quizData.length}</div><div class="quiz-nav"><button id="quiz-prev" ${currentQuizQuestionIndex === 0 ? 'disabled' : ''}>${t.quizPrev}</button><button id="quiz-next">${currentQuizQuestionIndex === quizData.length - 1 ? t.quizFinish : t.quizNext}</button></div>`;
    }

    function renderQuizResults() {
        const quizData = getQuizData(); let score = 0;
        userAnswers.forEach((answer, index) => { if (answer === quizData[index].answer) score++; });
        const t = uiTranslations[currentLang];
        DOMElements.quizModalContainer.innerHTML = `<h3>${t.quizFinish}</h3><p class="quiz-score">${t.quizScore} ${score} / ${quizData.length}</p><button id="quiz-restart">${t.openQuizButton}</button>`;
    }

    function handleQuizActions(event) {
        const target = event.target;
        if (target.id === 'quiz-next') { currentQuizQuestionIndex++; renderQuizQuestion(); } 
        else if (target.id === 'quiz-prev') { currentQuizQuestionIndex--; renderQuizQuestion(); } 
        else if (target.id === 'quiz-restart') { openQuizModal(); } 
        else if (target.closest('.quiz-options')) {
            const button = target.closest('button'); if (!button || button.disabled) return;
            const questionBlock = button.closest('.quiz-question');
            userAnswers[currentQuizQuestionIndex] = button.dataset.optionKey;
            const correctAnswerKey = getQuizData()[currentQuizQuestionIndex].answer;
            const isCorrect = userAnswers[currentQuizQuestionIndex] === correctAnswerKey;
            const feedbackEl = questionBlock.querySelector('.quiz-feedback');
            feedbackEl.textContent = isCorrect ? uiTranslations[currentLang].feedbackCorrect : uiTranslations[currentLang].feedbackIncorrect;
            feedbackEl.className = `quiz-feedback show ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
            questionBlock.querySelectorAll('.quiz-options button').forEach(btn => {
                btn.disabled = true;
                if (btn.dataset.optionKey === correctAnswerKey) btn.classList.add('correct');
                if (btn.dataset.optionKey === userAnswers[currentQuizQuestionIndex] && !isCorrect) btn.classList.add('incorrect');
            });
        }
    }

    // --- GESTION DES ÉVÉNEMENTS ---
    function setupEventListeners() {
        DOMElements.langSelector.addEventListener('click', (e) => { if (e.target.tagName === 'BUTTON') updateUI(e.target.dataset.lang); });
        DOMElements.thumbnailGallery.addEventListener('click', (e) => { if (e.target.classList.contains('thumbnail')) openGalleryModal(parseInt(e.target.dataset.index)); });
        DOMElements.modalNextBtn.addEventListener('click', () => changeModalImage(1));
        DOMElements.modalPrevBtn.addEventListener('click', () => changeModalImage(-1));
        DOMElements.quizFloatingButton.addEventListener('click', openQuizModal);
        DOMElements.quizModal.addEventListener('click', handleQuizActions);
        DOMElements.playButton.addEventListener('click', speak);
        DOMElements.stopButton.addEventListener('click', () => synth.cancel());
        DOMElements.monologueToggle.addEventListener('click', () => { DOMElements.monologueCollapsible.classList.toggle('open'); DOMElements.monologueToggle.classList.toggle('open'); });
        document.body.addEventListener('click', e => { if (e.target.id === 'provenance-shortcut') openModal(DOMElements.provenanceModal); if (e.target.classList.contains('close-button')) closeModal(e.target.closest('.modal')); });
        window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) closeModal(e.target); });
    }

    // --- DÉMARRAGE ---
    init();
});