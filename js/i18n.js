/* ============================================
   Travel By Petal - Language Switcher (EN/HE)
   ============================================ */

let currentLang = 'en';

const translations = {
    he: {
        // Direction
        dir: 'rtl',
        lang: 'he',

        // Nav
        'nav.home': 'דף הבית',
        'nav.destinations': 'יעדים',
        'nav.quiz': 'מצא את הטיול שלי',
        'nav.calculator': 'מחשבון תקציב',
        'nav.about': 'אודות',
        'nav.contact': 'צרו קשר',

        // Hero
        'hero.welcome': 'ברוכים הבאים ל',
        'hero.text': 'כאשר כל מסע פורח להרפתקה בלתי נשכחת. סוכנות התיירות הבוטיק שלכם ברעננה, מעצבת חופשות חלומיות מותאמות אישית ברחבי העולם.',
        'hero.cta1': 'מצאו את הטיול המושלם',
        'hero.cta2': 'שוחחו בוואטסאפ',
        'hero.stat1': 'מטיילים מרוצים',
        'hero.stat2': 'יעדים',
        'hero.stat3': 'שנות ניסיון',
        'hero.explore': 'גלו',

        // Services
        'services.title': 'השירותים שלנו',
        'services.subtitle': 'חוויות טיול מותאמות אישית לכל סוג של מטייל',
        'services.1.title': 'חבילות נופש',
        'services.1.desc': 'חבילות הכל כלול ליעדים המרהיבים בעולם. טיסות, מלונות וחוויות — הכל מסודר.',
        'services.2.title': 'ירח דבש',
        'services.2.desc': 'בריחות רומנטיות שעוצבו לזוגות טריים. מחופי המלדיביים ועד שקיעות סנטוריני — אנחנו הופכים את זה לקסום.',
        'services.3.title': 'הרפתקאות משפחתיות',
        'services.3.desc': 'יעדים ידידותיים לילדים עם פעילויות לכל הגילאים. צרו זכרונות בלתי נשכחים עם יקיריכם.',
        'services.4.title': 'טיולי הרפתקאות',
        'services.4.desc': 'למחפשי אדרנלין — טרקים, צלילות, ספארי וספורט אתגרי ביעדים ברחבי העולם.',

        // Destinations
        'dest.title': 'יעדים פופולריים',
        'dest.subtitle': 'לחצו כדי להפוך ולגלות עוד על כל יעד',
        'dest.romantic': 'רומנטי',
        'dest.beach': 'חוף',
        'dest.luxury': 'יוקרה',
        'dest.adventure': 'הרפתקה',
        'dest.culture': 'תרבות',
        'dest.tropical': 'טרופי',
        'dest.from': 'החל מ-',
        'dest.book': 'הזמינו בוואטסאפ',
        'dest.besttime': 'הזמן הטוב ביותר:',

        'dest.paris.title': 'פריז, צרפת',
        'dest.paris.1': '5 לילות במלון בוטיק',
        'dest.paris.2': 'מגדל אייפל ללא תור',
        'dest.paris.3': 'שייט על נהר הסן',
        'dest.paris.4': 'סיור מודרך בלובר',
        'dest.paris.5': 'ארוחת בוקר כלולה',
        'dest.paris.time': 'הזמן הטוב ביותר: אפר-יוני, ספט-אוק',

        'dest.santorini.title': 'סנטוריני, יוון',
        'dest.santorini.1': '6 לילות מלון עם נוף לקלדרה',
        'dest.santorini.2': 'שייט קטמרן בשקיעה',
        'dest.santorini.3': 'סיור טעימות יין',
        'dest.santorini.4': 'ביקור במעיינות חמים',
        'dest.santorini.5': 'הסעות משדה התעופה כלולות',
        'dest.santorini.time': 'הזמן הטוב ביותר: מאי-אוק',

        'dest.dubai.title': 'דובאי, איחוד האמירויות',
        'dest.dubai.1': '5 לילות באתר נופש 5 כוכבים',
        'dest.dubai.2': 'ספארי מדברי וארוחת ערב BBQ',
        'dest.dubai.3': 'תצפית בורג\' חליפה',
        'dest.dubai.4': 'סיור קניות בדובאי מול',
        'dest.dubai.5': 'ארוחת ערב בשייט דאו',
        'dest.dubai.time': 'הזמן הטוב ביותר: נוב-מרץ',

        'dest.bali.title': 'באלי, אינדונזיה',
        'dest.bali.1': '7 לילות בווילה עם בריכה',
        'dest.bali.2': 'סיור מקדשים ושדות אורז',
        'dest.bali.3': 'טיול שנורקלינג',
        'dest.bali.4': 'סדנת בישול מסורתית',
        'dest.bali.5': 'טיפול ספא כלול',
        'dest.bali.time': 'הזמן הטוב ביותר: אפר-אוק',

        'dest.rome.title': 'רומא, איטליה',
        'dest.rome.1': '5 לילות מלון מרכזי',
        'dest.rome.2': 'סיור קולוסיאום והוותיקן',
        'dest.rome.3': 'סיור אוכל בטרסטווארה',
        'dest.rome.4': 'טיול יום לחוף אמלפי',
        'dest.rome.5': 'טעימת ג\'לאטו כלולה',
        'dest.rome.time': 'הזמן הטוב ביותר: אפר-יוני, ספט-אוק',

        'dest.maldives.title': 'האיים המלדיביים',
        'dest.maldives.1': '5 לילות בווילה מעל המים',
        'dest.maldives.2': 'ארוחות הכל כלול',
        'dest.maldives.3': 'טיול צלילה',
        'dest.maldives.4': 'שייט דולפינים בשקיעה',
        'dest.maldives.5': 'חבילת ספא זוגית',
        'dest.maldives.time': 'הזמן הטוב ביותר: נוב-אפר',

        // Quiz
        'quiz.title': 'מצאו את הטיול המושלם',
        'quiz.subtitle': 'ענו על 4 שאלות קצרות ונתאים לכם את היעד המושלם',
        'quiz.q1': 'מה האווירה שלכם?',
        'quiz.q1.1': 'מנוחה ורוגע',
        'quiz.q1.2': 'הרפתקה ואדרנלין',
        'quiz.q1.3': 'תרבות והיסטוריה',
        'quiz.q1.4': 'רומנטיקה ויוקרה',
        'quiz.q2': 'מה האקלים האידיאלי?',
        'quiz.q2.1': 'חם וטרופי',
        'quiz.q2.2': 'חמים ונעים',
        'quiz.q2.3': 'קריר ורענן',
        'quiz.q2.4': 'קר ושלגי',
        'quiz.q3': 'עם מי אתם טסים?',
        'quiz.q3.1': 'מטייל יחיד',
        'quiz.q3.2': 'עם בן/בת הזוג',
        'quiz.q3.3': 'טיול משפחתי',
        'quiz.q3.4': 'עם חברים',
        'quiz.q4': 'מה התקציב לאדם?',
        'quiz.q4.1': 'מתחת ל-$1,000',
        'quiz.q4.2': '$1,000 - $2,000',
        'quiz.q4.3': '$2,000 - $4,000',
        'quiz.q4.4': '$4,000+ (יוקרה)',
        'quiz.result.title': 'ההתאמה המושלמת שלכם',
        'quiz.result.book': 'הזמינו טיול זה בוואטסאפ',
        'quiz.result.retake': 'מלאו שוב',

        // Calculator
        'calc.title': 'מחשבון תקציב טיול',
        'calc.subtitle': 'הזיזו את הבקרים כדי לחשב עלות טיול משוערת',
        'calc.region': 'אזור היעד',
        'calc.region.europe': 'אירופה',
        'calc.region.asia': 'אסיה',
        'calc.region.americas': 'אמריקה',
        'calc.region.africa': 'אפריקה',
        'calc.region.oceania': 'אוקיאניה',
        'calc.region.middleeast': 'המזרח התיכון',
        'calc.travelers': 'מספר מטיילים:',
        'calc.days': 'ימים',
        'calc.duration': 'משך הטיול:',
        'calc.hotel': 'רמת מלון',
        'calc.hotel.budget': 'חסכוני (2-3 כוכבים)',
        'calc.hotel.mid': 'בינוני (3-4 כוכבים)',
        'calc.hotel.premium': 'פרימיום (4-5 כוכבים)',
        'calc.hotel.luxury': 'יוקרה (5 כוכבים+)',
        'calc.activities': 'רמת פעילויות',
        'calc.activities.light': 'קלה (בעיקר עצמאי)',
        'calc.activities.moderate': 'בינונית (כמה סיורים)',
        'calc.activities.full': 'מלאה (פעילויות יומיות)',
        'calc.estimated': 'עלות משוערת',
        'calc.perperson': 'לאדם',
        'calc.flights': 'טיסות',
        'calc.hotels': 'מלונות',
        'calc.activitiesLabel': 'פעילויות',
        'calc.food': 'אוכל ותחבורה',
        'calc.cta': 'קבלו הצעת מחיר מדויקת בוואטסאפ',

        // Testimonials
        'test.title': 'מה המטיילים שלנו אומרים',
        'test.1.text': '"Travel By Petal הפכו את ירח הדבש שלנו לקסום ממש. כל פרט היה מושלם — משדרוג החדר המפתיע ועד ארוחת הערב בשקיעה על החוף. לעולם לא נזמין אצל אף אחד אחר!"',
        'test.1.name': 'שרה ודוד',
        'test.1.trip': 'ירח דבש במלדיביים',
        'test.2.text': '"לקחתי את המשפחה שלי בת 5 נפשות לבאלי והכל היה מאורגן בצורה מושלמת. הילדים אהבו כל פעילות, ואנחנו ההורים באמת הצלחנו לנוח! חופשת המשפחה הכי טובה אי פעם."',
        'test.2.name': 'מיכאל כ.',
        'test.2.trip': 'טיול משפחתי לבאלי',
        'test.3.text': '"היה לי תקציב מצומצם אבל עדיין רציתי טיול אירופאי מדהים. Petal מצאו לי עסקאות מדהימות ויצרו מסלול שלעולם לא הייתי יכולה לתכנן בעצמי. מעל ומעבר!"',
        'test.3.name': 'רחל ל.',
        'test.3.trip': 'טיול חסכוני לאירופה',

        // About
        'about.title': 'אודות Travel By Petal',
        'about.p1': 'הממוקמים בלב <strong>רעננה, ישראל</strong>, Travel By Petal היא סוכנות תיירות בוטיק שמאמינה שכל מסע צריך לפרוח למשהו יוצא דופן.',
        'about.p2': 'אנחנו לא רק מזמינים טיולים — אנחנו מעצבים חוויות נסיעה מותאמות אישית. בין אם אתם חולמים על בריחה רומנטית, הרפתקה משפחתית, או גילוי עצמי — הצוות שלנו לוקח את הזמן להבין את המשאלות הייחודיות שלכם ומעצב כל פרט סביבכם.',
        'about.p3': 'השם שלנו אומר הכל: כמו עלי כותרת הנפתחים, אנחנו חושפים את יופי העולם טיול אחרי טיול.',
        'about.f1': 'מסלולים מותאמים אישית',
        'about.f2': 'תמיכה 24/7 בוואטסאפ',
        'about.f3': 'הבטחת מחיר הטוב ביותר',
        'about.f4': 'ידע מקומי מקצועי',

        // Contact
        'contact.title': 'בואו נתכנן את הטיול שלכם',
        'contact.subtitle': 'פנו אלינו בוואטסאפ — אנחנו בדרך כלל עונים תוך דקות!',
        'contact.location.title': 'מיקום',
        'contact.location.value': 'רעננה, ישראל',
        'contact.whatsapp.title': 'וואטסאפ',
        'contact.hours.title': 'שעות פעילות',
        'contact.hours.value': 'א-ה: 9:00 - 18:00<br>ו: 9:00 - 13:00',
        'contact.cta': 'התחילו לתכנן בוואטסאפ',
        'contact.note': 'אנחנו בדרך כלל עונים תוך 15 דקות בשעות הפעילות',

        // Footer
        'footer.brand': 'סוכנות התיירות הבוטיק שלכם ברעננה, ישראל. מעצבים מסעות בלתי נשכחים מ-2018.',
        'footer.links': 'קישורים מהירים',
        'footer.trips': 'טיולים פופולריים',
        'footer.contact': 'צרו קשר',
        'footer.copyright': '© 2026 Travel By Petal. כל הזכויות שמורות.',

        // Chatbot
        'chat.name': 'העוזר של פטל',
        'chat.status': 'מחובר',
        'chat.placeholder': 'הקלידו הודעה...',
    }
};

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'he' : 'en';
    applyLanguage(currentLang);

    // Update toggle button
    const flag = document.getElementById('langFlag');
    const label = document.getElementById('langLabel');
    if (currentLang === 'he') {
        flag.innerHTML = '&#127468;&#127463;'; // UK flag
        label.textContent = 'English';
    } else {
        flag.innerHTML = '&#127470;&#127473;'; // Israel flag
        label.textContent = 'עברית';
    }
}

function applyLanguage(lang) {
    const html = document.documentElement;

    if (lang === 'he') {
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'he');
        applyHebrewTranslations();
    } else {
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', 'en');
        restoreEnglish();
    }
}

function applyHebrewTranslations() {
    const t = translations.he;

    // Nav links
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    // Hero
    const heroSub = document.querySelector('.hero-sub');
    const heroText = document.querySelector('.hero-text');
    const heroCta1 = document.querySelector('.hero-buttons .btn-primary');
    const heroCta2 = document.querySelector('.hero-buttons .btn-secondary');
    const statLabels = document.querySelectorAll('.stat-label');
    const scrollText = document.querySelector('.scroll-indicator span');

    if (heroSub) heroSub.textContent = t['hero.welcome'];
    if (heroText) heroText.textContent = t['hero.text'];
    if (heroCta1) heroCta1.textContent = t['hero.cta1'];
    if (heroCta2) {
        const svg = heroCta2.querySelector('svg');
        heroCta2.textContent = '';
        if (svg) heroCta2.appendChild(svg);
        heroCta2.append(' ' + t['hero.cta2']);
    }
    if (statLabels[0]) statLabels[0].textContent = t['hero.stat1'];
    if (statLabels[1]) statLabels[1].textContent = t['hero.stat2'];
    if (statLabels[2]) statLabels[2].textContent = t['hero.stat3'];
    if (scrollText) scrollText.textContent = t['hero.explore'];

    // Services
    const servicesTitle = document.querySelector('.services .section-title');
    const servicesSubtitle = document.querySelector('.services .section-subtitle');
    const serviceCards = document.querySelectorAll('.service-card');

    if (servicesTitle) servicesTitle.textContent = t['services.title'];
    if (servicesSubtitle) servicesSubtitle.textContent = t['services.subtitle'];

    serviceCards.forEach((card, i) => {
        const num = i + 1;
        const h3 = card.querySelector('h3');
        const p = card.querySelector('p');
        if (h3 && t[`services.${num}.title`]) h3.textContent = t[`services.${num}.title`];
        if (p && t[`services.${num}.desc`]) p.textContent = t[`services.${num}.desc`];
    });

    // Destinations
    const destTitle = document.querySelector('.destinations .section-title');
    const destSubtitle = document.querySelector('.destinations .section-subtitle');
    if (destTitle) destTitle.textContent = t['dest.title'];
    if (destSubtitle) destSubtitle.textContent = t['dest.subtitle'];

    const destKeys = ['paris', 'santorini', 'dubai', 'bali', 'rome', 'maldives'];
    const destCards = document.querySelectorAll('.dest-card');
    destCards.forEach((card, i) => {
        const key = destKeys[i];
        if (!key) return;

        // Front
        const frontH3 = card.querySelector('.dest-card-front h3');
        if (frontH3) frontH3.textContent = t[`dest.${key}.title`];

        // Back
        const backH3 = card.querySelector('.dest-card-back h3');
        if (backH3) backH3.textContent = t[`dest.${key}.title`];

        const lis = card.querySelectorAll('.dest-card-back ul li');
        for (let j = 0; j < lis.length; j++) {
            const txt = t[`dest.${key}.${j + 1}`];
            if (txt) lis[j].textContent = txt;
        }

        const weather = card.querySelector('.dest-weather');
        if (weather) weather.textContent = t[`dest.${key}.time`];

        const bookBtn = card.querySelector('.btn-small');
        if (bookBtn) bookBtn.textContent = t['dest.book'];
    });

    // Tags
    const tags = document.querySelectorAll('.dest-tag');
    const tagKeys = ['dest.romantic', 'dest.beach', 'dest.luxury', 'dest.adventure', 'dest.culture', 'dest.tropical'];
    tags.forEach((tag, i) => {
        if (t[tagKeys[i]]) tag.textContent = t[tagKeys[i]];
    });

    // Quiz
    const quizTitle = document.querySelector('.quiz-section .section-title');
    const quizSubtitle = document.querySelector('.quiz-section .section-subtitle');
    if (quizTitle) quizTitle.textContent = t['quiz.title'];
    if (quizSubtitle) quizSubtitle.textContent = t['quiz.subtitle'];

    const quizSteps = document.querySelectorAll('.quiz-step');
    const quizQs = ['quiz.q1', 'quiz.q2', 'quiz.q3', 'quiz.q4'];
    quizSteps.forEach((step, i) => {
        const h3 = step.querySelector('h3');
        if (h3 && t[quizQs[i]]) h3.textContent = t[quizQs[i]];

        const options = step.querySelectorAll('.quiz-option span:last-child');
        options.forEach((opt, j) => {
            const key = `${quizQs[i]}.${j + 1}`;
            if (t[key]) opt.textContent = t[key];
        });
    });

    const resultTitle = document.querySelector('.result-card h3');
    const resultBook = document.getElementById('resultWhatsApp');
    const resultRetake = document.querySelector('.result-card .btn-outline');
    if (resultTitle) resultTitle.textContent = t['quiz.result.title'];
    if (resultBook) resultBook.textContent = t['quiz.result.book'];
    if (resultRetake) resultRetake.textContent = t['quiz.result.retake'];

    // Calculator
    const calcTitle = document.querySelector('.calculator-section .section-title');
    const calcSubtitle = document.querySelector('.calculator-section .section-subtitle');
    if (calcTitle) calcTitle.textContent = t['calc.title'];
    if (calcSubtitle) calcSubtitle.textContent = t['calc.subtitle'];

    const calcLabels = document.querySelectorAll('.calc-group label');
    if (calcLabels[0]) calcLabels[0].textContent = t['calc.region'];
    // Update region options
    const regionSelect = document.getElementById('calcRegion');
    if (regionSelect) {
        regionSelect.options[0].textContent = t['calc.region.europe'];
        regionSelect.options[1].textContent = t['calc.region.asia'];
        regionSelect.options[2].textContent = t['calc.region.americas'];
        regionSelect.options[3].textContent = t['calc.region.africa'];
        regionSelect.options[4].textContent = t['calc.region.oceania'];
        regionSelect.options[5].textContent = t['calc.region.middleeast'];
    }

    // Hotel select
    const hotelSelect = document.getElementById('calcHotel');
    if (hotelSelect) {
        hotelSelect.options[0].textContent = t['calc.hotel.budget'];
        hotelSelect.options[1].textContent = t['calc.hotel.mid'];
        hotelSelect.options[2].textContent = t['calc.hotel.premium'];
        hotelSelect.options[3].textContent = t['calc.hotel.luxury'];
    }

    // Activities select
    const actSelect = document.getElementById('calcActivities');
    if (actSelect) {
        actSelect.options[0].textContent = t['calc.activities.light'];
        actSelect.options[1].textContent = t['calc.activities.moderate'];
        actSelect.options[2].textContent = t['calc.activities.full'];
    }

    // Calc result labels
    const calcLabel = document.querySelector('.calc-label');
    if (calcLabel) calcLabel.textContent = t['calc.estimated'];

    const breakItems = document.querySelectorAll('.breakdown-item span:first-child');
    if (breakItems[0]) breakItems[0].textContent = t['calc.flights'];
    if (breakItems[1]) breakItems[1].textContent = t['calc.hotels'];
    if (breakItems[2]) breakItems[2].textContent = t['calc.activitiesLabel'];
    if (breakItems[3]) breakItems[3].textContent = t['calc.food'];

    const calcCta = document.querySelector('.calc-cta');
    if (calcCta) calcCta.textContent = t['calc.cta'];

    // Testimonials
    const testTitle = document.querySelector('.testimonials .section-title');
    if (testTitle) testTitle.textContent = t['test.title'];

    const testCards = document.querySelectorAll('.testimonial-card');
    testCards.forEach((card, i) => {
        const num = i + 1;
        const p = card.querySelector('p');
        const name = card.querySelector('.testimonial-author strong');
        const trip = card.querySelector('.testimonial-author span');
        if (p && t[`test.${num}.text`]) p.textContent = t[`test.${num}.text`];
        if (name && t[`test.${num}.name`]) name.textContent = t[`test.${num}.name`];
        if (trip && t[`test.${num}.trip`]) trip.textContent = t[`test.${num}.trip`];
    });

    // About
    const aboutTitle = document.querySelector('.about .section-title');
    const aboutPs = document.querySelectorAll('.about-content > p');
    if (aboutTitle) aboutTitle.textContent = t['about.title'];
    if (aboutPs[0]) aboutPs[0].innerHTML = t['about.p1'];
    if (aboutPs[1]) aboutPs[1].textContent = t['about.p2'];
    if (aboutPs[2]) aboutPs[2].textContent = t['about.p3'];

    const aboutFeatures = document.querySelectorAll('.about-feature span:last-child');
    if (aboutFeatures[0]) aboutFeatures[0].textContent = t['about.f1'];
    if (aboutFeatures[1]) aboutFeatures[1].textContent = t['about.f2'];
    if (aboutFeatures[2]) aboutFeatures[2].textContent = t['about.f3'];
    if (aboutFeatures[3]) aboutFeatures[3].textContent = t['about.f4'];

    // Contact
    const contactTitle = document.querySelector('.contact .section-title');
    const contactSubtitle = document.querySelector('.contact .section-subtitle');
    if (contactTitle) contactTitle.textContent = t['contact.title'];
    if (contactSubtitle) contactSubtitle.textContent = t['contact.subtitle'];

    const contactItems = document.querySelectorAll('.contact-item');
    if (contactItems[0]) {
        contactItems[0].querySelector('h4').textContent = t['contact.location.title'];
        contactItems[0].querySelector('p').textContent = t['contact.location.value'];
    }
    if (contactItems[1]) {
        contactItems[1].querySelector('h4').textContent = t['contact.whatsapp.title'];
    }
    if (contactItems[2]) {
        contactItems[2].querySelector('h4').textContent = t['contact.hours.title'];
        contactItems[2].querySelector('p').innerHTML = t['contact.hours.value'];
    }

    const contactCtaBtn = document.querySelector('.btn-whatsapp-large span');
    if (contactCtaBtn) contactCtaBtn.textContent = t['contact.cta'];
    const contactNote = document.querySelector('.contact-note');
    if (contactNote) contactNote.textContent = t['contact.note'];

    // Footer
    const footerBrand = document.querySelector('.footer-brand p');
    const footerLinksTitles = document.querySelectorAll('.footer-links h4');
    const footerContactTitle = document.querySelector('.footer-contact h4');
    const footerBottom = document.querySelector('.footer-bottom p');

    if (footerBrand) footerBrand.textContent = t['footer.brand'];
    if (footerLinksTitles[0]) footerLinksTitles[0].textContent = t['footer.links'];
    if (footerLinksTitles[1]) footerLinksTitles[1].textContent = t['footer.trips'];
    if (footerContactTitle) footerContactTitle.textContent = t['footer.contact'];
    if (footerBottom) footerBottom.textContent = t['footer.copyright'];

    // Chatbot
    const chatName = document.querySelector('.chatbot-header strong');
    const chatStatus = document.querySelector('.chatbot-status');
    const chatInput = document.getElementById('chatbotInput');
    if (chatName) chatName.textContent = t['chat.name'];
    if (chatStatus) chatStatus.textContent = t['chat.status'];
    if (chatInput) chatInput.placeholder = t['chat.placeholder'];

    document.body.classList.add('lang-he');
}

// Store original English text for restoration
const englishCache = {};
let englishCached = false;

function cacheEnglish() {
    if (englishCached) return;

    // We'll just reload the page for simplicity — a more complex approach
    // would cache every single text node. Since this is a static site,
    // reloading is fast and reliable.
    englishCached = true;
}

function restoreEnglish() {
    // The simplest reliable way to restore English on a static site
    // is to reload. We set a flag to prevent re-triggering.
    document.body.classList.remove('lang-he');
    location.reload();
}
