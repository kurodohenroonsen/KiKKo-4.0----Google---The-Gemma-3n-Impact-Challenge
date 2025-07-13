const uiTranslations = {
    'en': {
        flag: '🇬🇧', name: 'English', statsHeader: '📊 Statistics', descriptionHeader: '📝 Description',
        funFactsHeader: '✨ Fun Facts', monologueModalHeader: '🗣️ The Bourdon\'s Report',
        quizModalHeader: '🧠 Knowledge Challenge',
        provenanceHeader: '📜 Provenance Thread', forgerLabel: 'Forged by:', dateLabel: 'on',
        feedbackCorrect: 'Correct! Well done!', feedbackIncorrect: 'Not quite, try again!',
        quizNext: 'Next', quizPrev: 'Previous', quizFinish: 'See Results', quizScore: 'Your Score:',
        quizRestart: 'Try Again'
    },
    'fr': {
        flag: '🇫🇷', name: 'Français', statsHeader: '📊 Statistiques', descriptionHeader: '📝 Description',
        funFactsHeader: '✨ Faits Amusants', monologueModalHeader: '🗣️ Le Rapport du Bourdon',
        quizModalHeader: '🧠 Défi de Connaissances',
        provenanceHeader: '📜 Fil de Provenance', forgerLabel: 'Forgé par :', dateLabel: 'le',
        feedbackCorrect: 'Correct ! Bien joué !', feedbackIncorrect: 'Pas tout à fait, essaie encore !',
        quizNext: 'Suivant', quizPrev: 'Précédent', quizFinish: 'Voir les Résultats', quizScore: 'Votre Score :',
        quizRestart: 'Recommencer'
    },
    'es': {
        flag: '🇪🇸', name: 'Español', statsHeader: '📊 Estadísticas', descriptionHeader: '📝 Descripción',
        funFactsHeader: '✨ Datos Curiosos', monologueModalHeader: '🗣️ El Informe del Bourdon',
        quizModalHeader: '🧠 Desafío de Conocimiento',
        provenanceHeader: '📜 Hilo de Procedencia', forgerLabel: 'Forjado por:', dateLabel: 'el',
        feedbackCorrect: '¡Correcto! ¡Bien hecho!', feedbackIncorrect: '¡No del todo, inténtalo de nuevo!',
        quizNext: 'Siguiente', quizPrev: 'Anterior', quizFinish: 'Ver Resultados', quizScore: 'Tu Puntuación:',
        quizRestart: 'Intentar de Nuevo'
    },
    'zh': {
        flag: '🇨🇳', name: '中文', statsHeader: '📊 统计数据', descriptionHeader: '📝 描述',
        funFactsHeader: '✨ 有趣的事实', monologueModalHeader: '🗣️ 大黄蜂的报告',
        quizModalHeader: '🧠 知识挑战',
        provenanceHeader: '📜 来源线索', forgerLabel: '锻造者：', dateLabel: '于',
        feedbackCorrect: '正确！做得好！', feedbackIncorrect: '不太对，再试试！',
        quizNext: '下一个', quizPrev: '上一个', quizFinish: '查看结果', quizScore: '你的分数：',
        quizRestart: '再试一次'
    },
    'hi': {
        flag: '🇮🇳', name: 'हिन्दी', statsHeader: '📊 आँकड़े', descriptionHeader: '📝 विवरण',
        funFactsHeader: '✨ रोचक तथ्य', monologueModalHeader: '🗣️ बौर्डन की रिपोर्ट',
        quizModalHeader: '🧠 ज्ञान चुनौती',
        provenanceHeader: '📜 उत्पत्ति का धागा', forgerLabel: 'निर्माता:', dateLabel: 'को',
        feedbackCorrect: 'सही! बहुत बढ़िया!', feedbackIncorrect: 'पूरी तरह से नहीं, फिर से प्रयास करें!',
        quizNext: 'अगला', quizPrev: 'पिछला', quizFinish: 'परिणाम देखें', quizScore: 'आपका स्कोर:',
        quizRestart: 'पुनः प्रयास करें'
    },
    'ar': {
        flag: '🇸🇦', name: 'العربية', statsHeader: '📊 إحصائيات', descriptionHeader: '📝 وصف',
        funFactsHeader: '✨ حقائق ممتعة', monologueModalHeader: '🗣️ تقرير البوردون',
        quizModalHeader: '🧠 تحدي المعرفة',
        provenanceHeader: '📜 خيط المصدر', forgerLabel: 'صاغها:', dateLabel: 'في',
        feedbackCorrect: 'صحيح! أحسنت!', feedbackIncorrect: 'ليس تماما, حاول مرة أخرى!',
        quizNext: 'التالي', quizPrev: 'السابق', quizFinish: 'عرض النتائج', quizScore: 'نتيجتك:',
        quizRestart: 'حاول مرة أخرى'
    },
    'pt': {
        flag: '🇵🇹', name: 'Português', statsHeader: '📊 Estatísticas', descriptionHeader: '📝 Descrição',
        funFactsHeader: '✨ Fatos Divertidos', monologueModalHeader: '🗣️ O Relatório do Bourdon',
        quizModalHeader: '🧠 Desafio de Conhecimento',
        provenanceHeader: '📜 Fio de Proveniência', forgerLabel: 'Forjado por:', dateLabel: 'em',
        feedbackCorrect: 'Correto! Muito bem!', feedbackIncorrect: 'Não exatamente, tente de novo!',
        quizNext: 'Próximo', quizPrev: 'Anterior', quizFinish: 'Ver Resultados', quizScore: 'Sua Pontuação:',
        quizRestart: 'Tentar Novamente'
    },
    'ru': {
        flag: '🇷🇺', name: 'Русский', statsHeader: '📊 Статистика', descriptionHeader: '📝 Описание',
        funFactsHeader: '✨ Интересные факты', monologueModalHeader: '🗣️ Отчет Бурдона',
        quizModalHeader: '🧠 Испытание знаний',
        provenanceHeader: '📜 Нить Происхождения', forgerLabel: 'Создано:', dateLabel: ' ',
        feedbackCorrect: 'Правильно! Молодец!', feedbackIncorrect: 'Не совсем, попробуйте еще раз!',
        quizNext: 'Далее', quizPrev: 'Назад', quizFinish: 'Показать результаты', quizScore: 'Ваш счет:',
        quizRestart: 'Попробовать снова'
    },
    'ja': {
        flag: '🇯🇵', name: '日本語', statsHeader: '📊 統計', descriptionHeader: '📝 説明',
        funFactsHeader: '✨ 豆知識', monologueModalHeader: '🗣️ ブルドンの報告',
        quizModalHeader: '🧠 知識チャレンジ',
        provenanceHeader: '📜 来歴の糸', forgerLabel: '製作者：', dateLabel: 'に',
        feedbackCorrect: '正解！よくできました！', feedbackIncorrect: '不正解です、もう一度！',
        quizNext: '次へ', quizPrev: '前へ', quizFinish: '結果を見る', quizScore: 'あなたのスコア：',
        quizRestart: '再挑戦'
    },
    'de': {
        flag: '🇩🇪', name: 'Deutsch', statsHeader: '📊 Statistiken', descriptionHeader: '📝 Beschreibung',
        funFactsHeader: '✨ Wissenswertes', monologueModalHeader: '🗣️ Bourdons Bericht',
        quizModalHeader: '🧠 Wissens-Herausforderung',
        provenanceHeader: '📜 Herkunftsfaden', forgerLabel: 'Geschmiedet von:', dateLabel: 'am',
        feedbackCorrect: 'Richtig! Gut gemacht!', feedbackIncorrect: 'Nicht ganz, versuch es noch einmal!',
        quizNext: 'Weiter', quizPrev: 'Zurück', quizFinish: 'Ergebnisse anzeigen', quizScore: 'Deine Punktzahl:',
        quizRestart: 'Erneut versuchen'
    }
};