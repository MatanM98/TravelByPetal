/* ============================================
   Travel By Petal - Main Script
   ============================================ */

// === SUPABASE INIT ===
const SUPABASE_URL = 'https://audtbcwgkaybqvixfjnf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1ZHRiY3dna2F5YnF2aXhmam5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDYzNDYsImV4cCI6MjA5MDkyMjM0Nn0.OlxAEW_3vt5ykzdU9_PIxJGZMC4QM9RIdf7ahVTMW84';
let sb = null;
const SESSION_ID = 'ses_' + Math.random().toString(36).substring(2, 10);

try {
    if (window.supabase) {
        sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.warn('Supabase not available, using fallback');
}

// === ANALYTICS TRACKING ===
function trackEvent(eventType, eventData = {}) {
    if (!sb) return;
    sb.from('analytics_events').insert({
        event_type: eventType,
        event_data: eventData,
        page: window.location.pathname,
        session_id: SESSION_ID,
    }).then(() => {}).catch(() => {});
}

// === DYNAMIC CONTENT LOADING ===
async function loadDynamicContent() {
    if (!sb) return;

    try {
        // Load destinations from Supabase
        const { data: dests } = await sb.from('destinations')
            .select('*')
            .eq('is_active', true)
            .order('sort_order');

        if (dests && dests.length > 0) {
            const grid = document.getElementById('destinationsGrid');
            if (grid) {
                const lang = currentLang || 'he';
                grid.innerHTML = dests.map(d => buildDestCard(d, lang)).join('');
                // Re-init effects
                initDestCardEffects();
            }
        }

        // Load testimonials from Supabase
        const { data: tests } = await sb.from('testimonials')
            .select('*')
            .eq('is_active', true)
            .order('sort_order');

        if (tests && tests.length > 0) {
            const track = document.getElementById('testimonialTrack');
            if (track) {
                track.innerHTML = tests.map(t => buildTestimonialCard(t)).join('');
                testimonialIndex = 0;
            }
        }
    } catch (e) {
        console.warn('Failed to load dynamic content:', e);
    }
}

function buildDestCard(d, lang) {
    const title = lang === 'he' ? d.title_he : d.title_en;
    const tag = lang === 'he' ? d.tag_he : d.tag_en;
    const highlights = lang === 'he' ? d.highlights_he : d.highlights_en;
    const bestTime = lang === 'he' ? d.best_time_he : d.best_time_en;
    const ctaText = lang === 'he' ? d.cta_text_he : d.cta_text_en;
    const bestTimeLabel = lang === 'he' ? 'הזמן הטוב ביותר:' : 'Best time:';

    return `
    <div class="dest-card" role="button" tabindex="0" onclick="this.classList.toggle('flipped');trackEvent('dest_click',{destination:'${d.slug}'})" onkeypress="if(event.key==='Enter')this.classList.toggle('flipped')">
        <div class="dest-card-inner">
            <div class="dest-card-front" style="background: ${d.gradient || ''}, url('${d.image_url}') center/cover">
                <div class="dest-info">
                    <span class="dest-tag">${tag}</span>
                    <h3>${title}</h3>
                </div>
            </div>
            <div class="dest-card-back">
                <h3>${title}</h3>
                <ul>${(highlights || []).map(h => `<li>${h}</li>`).join('')}</ul>
                <p class="dest-weather">${bestTimeLabel} ${bestTime}</p>
                <a href="${d.cta_url || '#trip-form'}" class="btn btn-small">${ctaText || 'Book Now'}</a>
            </div>
        </div>
    </div>`;
}

function buildTestimonialCard(t) {
    return `
    <div class="testimonial-card" style="direction:rtl; text-align:right">
        <div class="testimonial-stars" role="img" aria-label="${t.stars} out of 5 stars">${'★'.repeat(t.stars)}</div>
        <p>"${t.review_text}"</p>
        <div class="testimonial-author" style="flex-direction:row-reverse">
            <div class="author-avatar">${t.author_initials}</div>
            <div style="text-align:right">
                <strong>${t.author_name}</strong>
                <span>${t.trip_label || t.source}</span>
            </div>
        </div>
    </div>`;
}

function initDestCardEffects() {
    document.querySelectorAll('.dest-card-front').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
}

// Add ID to destinations grid for dynamic loading
document.addEventListener('DOMContentLoaded', () => {
    const destGrid = document.querySelector('.destinations-grid');
    if (destGrid && !destGrid.id) destGrid.id = 'destinationsGrid';
    const testTrack = document.querySelector('.testimonial-track');
    if (testTrack && !testTrack.id) testTrack.id = 'testimonialTrack';
});

document.addEventListener('DOMContentLoaded', () => {
    initPetals();
    initNavbar();
    initStatCounter();
    initChatbot();
    calculateBudget();
    initScrollAnimations();
    // Track page view
    trackEvent('page_view', { url: window.location.href });
    // Load dynamic content from Supabase
    loadDynamicContent();
    // Apply Hebrew as default language (unless user switched to English)
    const savedLang = sessionStorage.getItem('lang');
    if (savedLang === 'en') {
        currentLang = 'en';
        chatLang = 'en';
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
        document.getElementById('langFlag').innerHTML = '&#127470;&#127473;';
        document.getElementById('langLabel').textContent = 'עברית';
    } else if (typeof applyLanguage === 'function') {
        applyLanguage('he');
    }
});

/* --- Scroll Reveal Animations --- */
function initScrollAnimations() {
    // Add reveal classes to elements
    document.querySelectorAll('.section-title').forEach(el => el.classList.add('reveal'));
    document.querySelectorAll('.section-subtitle').forEach(el => el.classList.add('reveal'));

    // Service cards - staggered
    document.querySelectorAll('.service-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.setProperty('--i', i);
        el.style.transitionDelay = (i * 0.15) + 's';
    });

    // Destination cards - staggered scale
    document.querySelectorAll('.dest-card').forEach((el, i) => {
        el.classList.add('reveal-scale');
        el.style.transitionDelay = (i * 0.1) + 's';
    });

    // Affiliate cards
    document.querySelectorAll('.affiliate-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (i * 0.12) + 's';
    });

    // Quiz container
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) quizContainer.classList.add('reveal-scale');

    // Calculator
    const calcInputs = document.querySelector('.calc-inputs');
    const calcResult = document.querySelector('.calc-result');
    if (calcInputs) calcInputs.classList.add('reveal-left');
    if (calcResult) calcResult.classList.add('reveal-right');

    // Testimonial slider
    const testSlider = document.querySelector('.testimonial-slider');
    if (testSlider) testSlider.classList.add('reveal');

    // About section
    const aboutContent = document.querySelector('.about-content');
    const aboutImage = document.querySelector('.about-image');
    if (aboutContent) aboutContent.classList.add('reveal-left');
    if (aboutImage) aboutImage.classList.add('reveal-right');

    // Contact
    const contactInfo = document.querySelector('.contact-info');
    const contactCta = document.querySelector('.contact-cta');
    if (contactInfo) contactInfo.classList.add('reveal-left');
    if (contactCta) contactCta.classList.add('reveal-right');

    // Form
    const formWrapper = document.querySelector('.form-wrapper');
    if (formWrapper) formWrapper.classList.add('reveal');

    // Hero elements (animate on load with delay)
    const heroTitle = document.querySelector('.hero-title');
    const heroText = document.querySelector('.hero-text');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroStats = document.querySelector('.hero-stats');
    if (heroTitle) { heroTitle.classList.add('reveal'); heroTitle.style.transitionDelay = '0.2s'; }
    if (heroText) { heroText.classList.add('reveal'); heroText.style.transitionDelay = '0.4s'; }
    if (heroButtons) { heroButtons.classList.add('reveal'); heroButtons.style.transitionDelay = '0.6s'; }
    if (heroStats) { heroStats.classList.add('reveal'); heroStats.style.transitionDelay = '0.8s'; }

    // Footer
    document.querySelectorAll('.footer-grid > div').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (i * 0.1) + 's';
    });

    // Reveal elements on scroll (using scroll event for maximum compatibility)
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    function checkReveal() {
        const windowHeight = window.innerHeight;
        revealEls.forEach(el => {
            if (el.classList.contains('visible')) return;
            const rect = el.getBoundingClientRect();
            if (rect.top < windowHeight - 50) {
                el.classList.add('visible');
            }
        });
    }

    // Check on scroll (throttled) + parallax effects
    let scrollTicking = false;
    const heroContent = document.querySelector('.hero-content');
    const heroSection = document.querySelector('.hero');

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;

                // Reveal elements
                checkReveal();

                // Hero parallax - content moves slower than scroll
                if (heroContent && heroSection) {
                    const heroBottom = heroSection.offsetHeight;
                    if (scrollY < heroBottom) {
                        heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                        heroContent.style.opacity = 1 - (scrollY / heroBottom) * 0.6;
                    }
                }

                // Navbar shrink
                const navbar = document.getElementById('navbar');
                if (navbar) {
                    if (scrollY > 100) {
                        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
                    } else {
                        navbar.style.boxShadow = '';
                    }
                }

                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Initial check after short delay
    setTimeout(checkReveal, 150);

    // Cursor glow effect (follows mouse)
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // Magnetic effect on primary buttons
    document.querySelectorAll('.btn-primary, .btn-whatsapp-large').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // Tilt effect on destination cards (mouse move)
    document.querySelectorAll('.dest-card-front').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* --- Floating Petals --- */
function initPetals() {
    const container = document.getElementById('petalsContainer');
    const colors = ['#5ba4c9', '#89c4e1', '#c9a84c', '#3d8ab3', '#e8d590', '#4a93b8', '#d4b44a'];

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.style.left = Math.random() * 100 + '%';
        petal.style.background = colors[Math.floor(Math.random() * colors.length)];
        petal.style.animationDuration = (8 + Math.random() * 12) + 's';
        petal.style.animationDelay = Math.random() * 4 + 's';
        petal.style.width = (8 + Math.random() * 10) + 'px';
        petal.style.height = (10 + Math.random() * 12) + 'px';
        container.appendChild(petal);

        setTimeout(() => petal.remove(), 22000);
    }

    // Create petals across the whole site
    setInterval(createPetal, 2000);
    for (let i = 0; i < 8; i++) setTimeout(createPetal, i * 500);
}

/* --- Navbar --- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });

    // Close menu on link click
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
        });
    });
}

/* --- Stat Counter Animation --- */
function initStatCounter() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
            animated = true;
            stats.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 30);
            });
        }
    }, { threshold: 0.5 });

    if (stats.length > 0) {
        observer.observe(stats[0].closest('.hero-stats'));
    }
}

/* --- Dream Trip Quiz --- */
let quizAnswers = {};
let currentStep = 1;

function selectQuizOption(btn) {
    const step = btn.closest('.quiz-step');
    const stepNum = parseInt(step.dataset.step);
    const value = btn.dataset.value;

    // Highlight selection
    step.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    btn.classList.add('selected');

    quizAnswers[stepNum] = value;

    // Move to next step after short delay
    setTimeout(() => {
        if (stepNum < 4) {
            step.classList.remove('active');
            currentStep = stepNum + 1;
            document.querySelector(`.quiz-step[data-step="${currentStep}"]`).classList.add('active');
            document.getElementById('quizProgress').style.width = ((currentStep - 1) / 4 * 100) + '%';
        } else {
            // Show result
            document.getElementById('quizProgress').style.width = '100%';
            step.classList.remove('active');
            showQuizResult();
        }
    }, 400);
}

function showQuizResult() {
    const result = getRecommendation(quizAnswers);
    const resultDiv = document.getElementById('quizResult');
    const content = document.getElementById('resultContent');

    content.innerHTML = `
        <div class="result-destination">${result.emoji}</div>
        <div class="result-name">${result.name}</div>
        <p class="result-desc">${result.description}</p>
    `;

    const waLink = document.getElementById('resultWhatsApp');
    waLink.href = `https://wa.me/972545581269?text=Hi!%20The%20quiz%20recommended%20${encodeURIComponent(result.name)}%20for%20me.%20I'd%20love%20to%20learn%20more!`;

    resultDiv.style.display = 'block';
}

function resetQuiz() {
    quizAnswers = {};
    currentStep = 1;
    document.getElementById('quizResult').style.display = 'none';
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    document.querySelector('.quiz-step[data-step="1"]').classList.add('active');
    document.getElementById('quizProgress').style.width = '0%';
}

function getRecommendation(answers) {
    const destinations = [
        { name: 'Maldives', emoji: '🏝️', vibes: ['relax', 'romance'], climates: ['tropical'], companions: ['couple'], budgets: ['premium', 'luxury'], description: 'Crystal-clear waters, overwater villas, and endless romance. The Maldives is your ultimate paradise for relaxation and luxury.' },
        { name: 'Bali, Indonesia', emoji: '🌴', vibes: ['relax', 'adventure', 'culture'], climates: ['tropical'], companions: ['couple', 'solo', 'friends'], budgets: ['budget', 'mid'], description: 'Lush temples, stunning rice terraces, world-class surfing, and vibrant nightlife. Bali offers the perfect mix of adventure and serenity.' },
        { name: 'Paris, France', emoji: '🗼', vibes: ['romance', 'culture'], climates: ['mild', 'cool'], companions: ['couple', 'solo'], budgets: ['mid', 'premium'], description: 'The city of love, art, and incredible cuisine. Paris enchants with its timeless beauty, world-class museums, and romantic ambiance.' },
        { name: 'Santorini, Greece', emoji: '🏛️', vibes: ['romance', 'relax'], climates: ['mild', 'tropical'], companions: ['couple'], budgets: ['mid', 'premium'], description: 'Blue-domed churches, breathtaking caldera views, and legendary sunsets. Santorini is pure Mediterranean magic.' },
        { name: 'Dubai, UAE', emoji: '🌆', vibes: ['adventure', 'romance'], climates: ['tropical'], companions: ['couple', 'friends', 'family'], budgets: ['premium', 'luxury'], description: 'Futuristic skylines, luxury shopping, desert safaris, and incredible dining. Dubai is where modern extravagance meets Arabian heritage.' },
        { name: 'Rome, Italy', emoji: '🏟️', vibes: ['culture'], climates: ['mild'], companions: ['couple', 'solo', 'friends'], budgets: ['budget', 'mid'], description: 'Ancient ruins, Renaissance art, and the best pasta you\'ll ever taste. Rome is a living museum of Western civilization.' },
        { name: 'Swiss Alps', emoji: '🏔️', vibes: ['adventure'], climates: ['cold', 'cool'], companions: ['couple', 'friends', 'family'], budgets: ['premium', 'luxury'], description: 'Majestic mountain peaks, charming villages, and world-class skiing. The Swiss Alps are the ultimate winter wonderland.' },
        { name: 'Tokyo, Japan', emoji: '🗾', vibes: ['culture', 'adventure'], climates: ['mild', 'cool'], companions: ['solo', 'friends'], budgets: ['mid', 'premium'], description: 'Where ancient tradition meets cutting-edge technology. Tokyo dazzles with its temples, incredible food, and endless energy.' },
        { name: 'Iceland', emoji: '🌋', vibes: ['adventure'], climates: ['cold'], companions: ['solo', 'couple', 'friends'], budgets: ['mid', 'premium'], description: 'Northern lights, volcanic landscapes, geothermal hot springs, and waterfalls. Iceland is nature\'s most dramatic masterpiece.' },
        { name: 'Thailand', emoji: '🐘', vibes: ['relax', 'adventure', 'culture'], climates: ['tropical'], companions: ['solo', 'friends', 'family'], budgets: ['budget'], description: 'Golden temples, tropical islands, street food paradise, and warm hospitality. Thailand offers incredible value and unforgettable experiences.' },
        { name: 'Barcelona, Spain', emoji: '🎭', vibes: ['culture', 'relax'], climates: ['mild'], companions: ['friends', 'solo', 'couple'], budgets: ['budget', 'mid'], description: 'Gaudi\'s architecture, Mediterranean beaches, tapas bars, and vibrant nightlife. Barcelona is a feast for all senses.' },
        { name: 'New Zealand', emoji: '🌿', vibes: ['adventure'], climates: ['cool', 'mild'], companions: ['couple', 'friends', 'solo'], budgets: ['premium', 'luxury'], description: 'Dramatic fjords, lush forests, and adrenaline-pumping activities. New Zealand is the adventure capital of the world.' },
        { name: 'Cancun, Mexico', emoji: '🏖️', vibes: ['relax'], climates: ['tropical'], companions: ['friends', 'family', 'couple'], budgets: ['budget', 'mid'], description: 'White sand beaches, all-inclusive resorts, Mayan ruins, and crystal-clear cenotes. Cancun is the perfect beach getaway.' },
        { name: 'Kenya Safari', emoji: '🦁', vibes: ['adventure'], climates: ['tropical', 'mild'], companions: ['couple', 'family'], budgets: ['premium', 'luxury'], description: 'Witness the Great Migration, spot the Big Five, and experience the raw beauty of the African savanna.' },
        { name: 'Lapland, Finland', emoji: '🎅', vibes: ['adventure', 'romance'], climates: ['cold'], companions: ['family', 'couple'], budgets: ['premium'], description: 'Northern lights, husky safaris, glass igloos, and Santa\'s village. Lapland is a magical winter fairy tale come true.' },
    ];

    // Score each destination
    let scored = destinations.map(dest => {
        let score = 0;
        if (dest.vibes.includes(answers[1])) score += 3;
        if (dest.climates.includes(answers[2])) score += 3;
        if (dest.companions.includes(answers[3])) score += 2;
        if (dest.budgets.includes(answers[4])) score += 2;
        // Add a tiny random factor to avoid always showing the same result
        score += Math.random() * 0.5;
        return { ...dest, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0];
}

/* --- Budget Calculator --- */
function calculateBudget() {
    const region = document.getElementById('calcRegion').value;
    const travelers = parseInt(document.getElementById('calcTravelers').value);
    const days = parseInt(document.getElementById('calcDays').value);
    const hotel = document.getElementById('calcHotel').value;
    const activities = document.getElementById('calcActivities').value;

    // Update labels
    document.getElementById('travelersValue').textContent = travelers;
    document.getElementById('daysValue').textContent = days;

    // Flight prices per person by region
    const flightPrices = {
        europe: 450, asia: 650, americas: 700, africa: 600, oceania: 900, middleeast: 350
    };

    // Hotel prices per night
    const hotelPrices = {
        budget: { europe: 60, asia: 30, americas: 50, africa: 40, oceania: 70, middleeast: 50 },
        mid: { europe: 120, asia: 70, americas: 100, africa: 80, oceania: 140, middleeast: 100 },
        premium: { europe: 220, asia: 140, americas: 200, africa: 160, oceania: 260, middleeast: 180 },
        luxury: { europe: 400, asia: 250, americas: 350, africa: 300, oceania: 450, middleeast: 350 }
    };

    // Activity prices per day per person
    const activityPrices = {
        light: { europe: 20, asia: 10, americas: 15, africa: 20, oceania: 25, middleeast: 15 },
        moderate: { europe: 50, asia: 25, americas: 40, africa: 45, oceania: 55, middleeast: 35 },
        full: { europe: 90, asia: 50, americas: 70, africa: 80, oceania: 100, middleeast: 60 }
    };

    // Food per day per person
    const foodPrices = {
        europe: 45, asia: 20, americas: 35, africa: 25, oceania: 50, middleeast: 30
    };

    const flights = flightPrices[region] * travelers;
    const hotels = hotelPrices[hotel][region] * days;
    const actCost = activityPrices[activities][region] * days * travelers;
    const food = foodPrices[region] * days * travelers;
    const total = flights + hotels + actCost + food;
    const perPerson = Math.round(total / travelers);

    document.getElementById('calcTotal').textContent = '$' + total.toLocaleString();
    document.getElementById('calcPerPerson').textContent = '$' + perPerson.toLocaleString();
    document.getElementById('breakFlights').textContent = '$' + flights.toLocaleString();
    document.getElementById('breakHotels').textContent = '$' + hotels.toLocaleString();
    document.getElementById('breakActivities').textContent = '$' + actCost.toLocaleString();
    document.getElementById('breakFood').textContent = '$' + food.toLocaleString();
}

/* --- Testimonial Slider --- */
let testimonialIndex = 0;

function slideTestimonial(dir) {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    testimonialIndex = (testimonialIndex + dir + cards.length) % cards.length;
    track.style.transform = `translateX(-${testimonialIndex * 100}%)`;
}

// Auto-slide
setInterval(() => slideTestimonial(1), 6000);

/* ============================================
   SMART CHATBOT
   ============================================ */

const WHATSAPP_LINK = 'https://wa.me/972545581269';

const BOOKING_FORM = '#trip-form';

const chatbotKnowledge = {
    greetings: [
        "Hello! Welcome to Travel By Petal! I'm Petal, your travel assistant. How can I help you plan your next trip?",
        "Hi there! Anyone can book online, but when you want a real professional handling your trip — that's where I come in. How can I help?",
        "Welcome! I'm Petal, your personal travel guide. Whether you need just flights or a full day-by-day itinerary, I'm here to help!"
    ],
    destinations: {
        dubai: "Dubai is incredible! Desert safaris, luxury shopping, Burj Khalifa, and amazing dining. Best Nov-Mar. I can book flights, hotels, transfers, and attractions. You can also <a href='https://tic.dubai.co.il/?sld=625' target='_blank' style='color:var(--primary);font-weight:600'>browse Dubai attractions here</a> (Hebrew, Shekels, Tashlumim!).",
        india: "India is a life-changing experience! Taj Mahal, Kerala backwaters, Rajasthan palaces, and incredible food. Best Oct-Mar. I can plan your full itinerary day by day. Want me to help?",
        athens: "Athens is where history comes alive! Acropolis, Parthenon, Greek islands, and amazing tavernas. Best Apr-Jun or Sep-Oct. I can handle flights, hotels, tours — everything!",
        rome: "Rome is a living museum! Colosseum, Vatican, Trastevere food walks, and the Amalfi Coast nearby. Best Apr-Jun or Sep-Oct. Want me to plan your trip?",
        barcelona: "Barcelona is vibrant! Gaudi's architecture, beaches, tapas, and nightlife. Best May-Jun or Sep-Oct. I can book everything from flights to guided tours!",
        london: "London is a classic! Big Ben, Tower of London, West End shows, and incredible food markets. Best May-Sep. Let me plan your perfect London trip!",
        vietnam: "Vietnam is exotic and amazing! Ha Long Bay, Hanoi, Ho Chi Minh City, and Mekong Delta. Best Feb-Apr or Oct-Dec. I can create a full itinerary for you!",
        greece: "Greece is stunning! Athens, Santorini, Mykonos, and Crete. I can arrange island-hopping, flights, ferries, and hotels. Where in Greece interests you?",
        italy: "Italy is perfect! Rome, Venice, Amalfi Coast, and Tuscany. I can plan a full itinerary with trains, restaurants, and tours. Where would you like to go?",
    },
    topics: {
        service: "I offer two main services: <br><br><strong>1. A La Carte Booking</strong> — I book exactly what you need: flights, hotels, airport transfers, trains, cruises, restaurants, guided tours, excursions, or car rental.<br><br><strong>2. Full Itinerary Planning</strong> — Your entire trip planned day by day, every detail organized so you just enjoy!<br><br>Which sounds right for you?",
        book: "I can book: flights, hotels, airport transfers, trains, cruises, restaurants, guided day tours, excursions, and car rental. Tell me what you need or <a href='" + BOOKING_FORM + "' onclick='document.getElementById(\"trip-form\").scrollIntoView({behavior:\"smooth\"})' style='color:var(--primary);font-weight:600'>fill out our trip form</a>!",
        itinerary: "I create full day-by-day itineraries! Every morning, afternoon, and evening planned out. All bookings, logistics, and timing handled. You just show up and enjoy. Want to get started?",
        honeymoon: "Congratulations! I specialize in romantic honeymoon trips! I'll plan every detail — surprise dinners, spa packages, room upgrades. What's your dream destination?",
        family: "Family trips are my specialty! I recommend Dubai, Barcelona, London, and Rome for families. I handle kid-friendly activities, family rooms, and smooth logistics. How many are traveling?",
        adventure: "For adventure seekers, I recommend Vietnam, India, and Dubai! From Ha Long Bay cruises to desert safaris — I'll plan every exciting day. What kind of adventure excites you?",
        budget: "I find the best deals for every budget! Tell me your destination and budget range, and I'll create a package that works. Or use our <a href='#calculator' style='color:var(--primary);font-weight:600'>Budget Planner</a>!",
        flights: "I search across all airlines to find the best flights for you. Business class upgrades available too! Where are you flying?",
        hotels: "I can find and book the perfect hotel for you! Or if you prefer to browse yourself, try our <a href='https://www.zenhotels.com/?cur=ILS&lang=he&partner_extra=Website&partner_slug=108573.affiliate.3022' target='_blank' style='color:var(--primary);font-weight:600'>hotel search tool</a> (Hebrew, Shekels).",
        transfer: "I book airport transfers, trains, and car rentals worldwide. Door-to-door logistics so you never have to worry. What's your destination?",
        cruise: "I can book cruises of all kinds — Mediterranean, Caribbean, river cruises, and more! What region interests you?",
        restaurant: "I book restaurants at your destination — from local gems to Michelin-starred dining. Just tell me your destination and preferences!",
        tour: "I arrange guided day tours and excursions worldwide! Or you can browse tours yourself on <a href='https://www.getyourguide.com/?partner_id=BGGPE3N&utm_medium=online_publisher' target='_blank' style='color:var(--primary);font-weight:600'>GetYourGuide</a>.",
        car: "I book car rentals at competitive rates worldwide. Manual or automatic, pick up at the airport or hotel. Where do you need a car?",
        train: "I book train tickets across Europe and Asia — including high-speed trains! Planning a rail trip?",
        visa: "Visa requirements depend on your passport and destination. As Israeli passport holders, many countries offer visa-free entry. Tell me your destination and I'll check for you!",
        insurance: "I always recommend travel insurance! I can help you find affordable plans that cover cancellation, medical emergencies, and lost luggage.",
        price: "Prices vary based on destination, dates, and preferences. Fill out our <a href='" + BOOKING_FORM + "' onclick='document.getElementById(\"trip-form\").scrollIntoView({behavior:\"smooth\"})' style='color:var(--primary);font-weight:600'>trip request form</a> and I'll send you a personalized quote!",
        why: "Anyone can book online — but when something goes wrong, that's when you really need a travel agent. Someone who knows all the laws and regulations. Think of it like eating at a restaurant — you can cook at home, but sometimes you want a professional to handle it. I'm with you every step of the way!",
    },
    fallback: [
        "Great question! I'd love to help you personally. Chat with me on WhatsApp or <a href='" + BOOKING_FORM + "' onclick='document.getElementById(\"trip-form\").scrollIntoView({behavior:\"smooth\"})' style='color:var(--primary);font-weight:600'>fill out our trip form</a>!",
        "I want to give you the perfect answer! Let's continue on WhatsApp or you can <a href='" + BOOKING_FORM + "' onclick='document.getElementById(\"trip-form\").scrollIntoView({behavior:\"smooth\"})' style='color:var(--primary);font-weight:600'>submit a trip request</a>.",
        "Interesting! Let me help you with that. Would you like to chat on WhatsApp or <a href='" + BOOKING_FORM + "' onclick='document.getElementById(\"trip-form\").scrollIntoView({behavior:\"smooth\"})' style='color:var(--primary);font-weight:600'>fill out our form</a>?"
    ]
};

// Global state used by the inline onclick fallback so the toggle still works
// even if initChatbot hasn't bound a listener yet (e.g. during a slow load).
let __chatbotIsOpen = false;
let __chatbotInited = false;

function __chatbotOpen() {
    const win = document.getElementById('chatbotWindow');
    const toggle = document.getElementById('chatbotToggle');
    if (!win || !toggle) return;
    __chatbotIsOpen = true;
    win.classList.add('open');
    const iconOpen = toggle.querySelector('.chatbot-icon-open');
    const iconClose = toggle.querySelector('.chatbot-icon-close');
    if (iconOpen) iconOpen.style.display = 'none';
    if (iconClose) iconClose.style.display = 'block';
    const badge = document.getElementById('chatbotBadge');
    if (badge) badge.style.display = 'none';
    const messages = document.getElementById('chatbotMessages');
    if (messages && messages.children.length === 0) {
        setTimeout(() => {
            if (chatLang === 'he' && typeof hebrewChatbot !== 'undefined') {
                addBotMessage(hebrewChatbot.greetings[Math.floor(Math.random() * hebrewChatbot.greetings.length)]);
                showQuickReplies(hebrewChatbot.quickReplies);
            } else if (typeof chatbotKnowledge !== 'undefined') {
                addBotMessage(chatbotKnowledge.greetings[Math.floor(Math.random() * chatbotKnowledge.greetings.length)]);
                showQuickReplies(['Popular destinations', 'What services?', 'Full itinerary', 'Get a quote']);
            }
        }, 200);
    }
    const input = document.getElementById('chatbotInput');
    if (input) setTimeout(() => input.focus(), 350);
}

function __chatbotClose() {
    const win = document.getElementById('chatbotWindow');
    const toggle = document.getElementById('chatbotToggle');
    if (!win || !toggle) return;
    __chatbotIsOpen = false;
    win.classList.remove('open');
    const iconOpen = toggle.querySelector('.chatbot-icon-open');
    const iconClose = toggle.querySelector('.chatbot-icon-close');
    if (iconOpen) iconOpen.style.display = 'block';
    if (iconClose) iconClose.style.display = 'none';
}

window.toggleChatbot = function () {
    if (__chatbotIsOpen) __chatbotClose(); else __chatbotOpen();
};

function initChatbot() {
    if (__chatbotInited) return;
    __chatbotInited = true;
    const toggle = document.getElementById('chatbotToggle');
    const window_ = document.getElementById('chatbotWindow');
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');
    if (!toggle || !window_) {
        console.warn('[chatbot] toggle or window element missing');
        return;
    }

    // Inline onclick="toggleChatbot()" on the button is the primary handler now.
    if (sendBtn) sendBtn.addEventListener('click', handleUserMessage);
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserMessage();
        });
    }
}

/* --- Travel Quotes Rotator --- */
const travelQuotes = [
    { en: '"The world is a book, and those who do not travel read only one page."', he: '"העולם הוא ספר, ומי שלא נוסע קורא רק עמוד אחד."' },
    { en: '"Travel is the only thing you buy that makes you richer."', he: '"נסיעות הן הדבר היחיד שקונים שהופך אותך לעשיר יותר."' },
    { en: '"Life is short and the world is wide."', he: '"החיים קצרים והעולם רחב."' },
    { en: '"Adventure is worthwhile in itself."', he: '"הרפתקה שווה כשלעצמה."' },
    { en: '"Not all who wander are lost."', he: '"לא כל מי שמשוטט הלך לאיבוד."' },
    { en: '"Travel far enough, you meet yourself."', he: '"תסע מספיק רחוק, ותפגוש את עצמך."' },
    { en: '"To travel is to live."', he: '"לנסוע זה לחיות."' },
    { en: '"Collect moments, not things."', he: '"אספו רגעים, לא דברים."' },
];

let quoteIndex = 0;
function rotateQuote() {
    const el = document.getElementById('heroQuote');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => {
        quoteIndex = (quoteIndex + 1) % travelQuotes.length;
        el.textContent = chatLang === 'he' ? travelQuotes[quoteIndex].he : travelQuotes[quoteIndex].en;
        el.style.opacity = '0.75';
    }, 500);
}
setInterval(rotateQuote, 6000);

/* --- Weather Widget --- */
function getWeather() {
    const city = document.getElementById('weatherCity').value;
    const result = document.getElementById('weatherResult');
    if (!city) { result.innerHTML = ''; return; }

    // Static weather data (no API needed = free)
    const weatherData = {
        'Dubai': { temp: 35, desc: 'Sunny & Hot', icon: '☀️', humidity: 45, wind: 15 },
        'Delhi': { temp: 32, desc: 'Warm & Humid', icon: '🌤️', humidity: 65, wind: 10 },
        'Athens': { temp: 24, desc: 'Sunny & Warm', icon: '☀️', humidity: 40, wind: 12 },
        'Rome': { temp: 22, desc: 'Mild & Pleasant', icon: '🌤️', humidity: 50, wind: 8 },
        'Barcelona': { temp: 23, desc: 'Warm & Breezy', icon: '⛅', humidity: 55, wind: 14 },
        'London': { temp: 15, desc: 'Cloudy & Cool', icon: '☁️', humidity: 70, wind: 18 },
        'Hanoi': { temp: 28, desc: 'Warm & Humid', icon: '🌤️', humidity: 75, wind: 8 },
        'Paris': { temp: 18, desc: 'Mild & Partly Cloudy', icon: '⛅', humidity: 60, wind: 12 },
        'Bangkok': { temp: 33, desc: 'Hot & Tropical', icon: '🌴', humidity: 80, wind: 6 },
        'New York': { temp: 20, desc: 'Clear & Pleasant', icon: '🌤️', humidity: 50, wind: 15 },
    };

    const w = weatherData[city];
    if (w) {
        result.innerHTML = `
            <div class="weather-data">
                <div style="font-size:2.5rem">${w.icon}</div>
                <div class="weather-temp">${w.temp}°C</div>
                <div class="weather-desc">${w.desc}</div>
                <div class="weather-details">
                    <span>💧 ${w.humidity}%</span>
                    <span>💨 ${w.wind} km/h</span>
                </div>
            </div>
        `;
    }
}

/* --- Currency Converter --- */
function convertCurrency() {
    const amount = parseFloat(document.getElementById('currencyAmount').value) || 0;
    const to = document.getElementById('currencyTo').value;
    const result = document.getElementById('currencyResult');

    // Approximate rates from ILS
    const rates = {
        USD: 0.275, EUR: 0.252, GBP: 0.217, THB: 9.45,
        AED: 1.01, INR: 22.9, JPY: 40.5, VND: 6850
    };

    const symbols = {
        USD: '$', EUR: '€', GBP: '£', THB: '฿',
        AED: 'د.إ', INR: '₹', JPY: '¥', VND: '₫'
    };

    const converted = (amount * rates[to]).toFixed(to === 'VND' || to === 'JPY' ? 0 : 2);
    result.textContent = `≈ ${Number(converted).toLocaleString()} ${symbols[to]}`;
}

/* --- Packing Checklist Generator --- */
function generatePackingList() {
    const dest = document.getElementById('packDest').value;
    const duration = document.getElementById('packDuration').value;
    const result = document.getElementById('packingResult');

    const essentials = ['דרכון + צילום', 'ביטוח נסיעות', 'כרטיסי אשראי', 'מטען + כבל', 'אוזניות', 'תרופות אישיות', 'משקפי שמש'];

    const lists = {
        beach: { title: 'חוף / טרופי', items: ['בגד ים', 'קרם הגנה SPF50', 'כפכפים', 'מגבת חוף', 'כובע', 'שמלת קיץ / מכנסיים קצרים', 'חולצות קלות', 'סנדלים'] },
        city: { title: 'סיטי בריק', items: ['נעלי הליכה נוחות', 'מעיל קל', 'תיק גב יומי', 'מטריה מתקפלת', 'ג\'ינס', 'חולצות יפות', 'שמלה/חולצה לערב'] },
        cold: { title: 'חורף / קור', items: ['מעיל חורף', 'צעיף + כפפות + כובע', 'שכבת בסיס תרמית', 'מגפיים חמים', 'סוודרים', 'גרביים עבות', 'קרם לחות'] },
        adventure: { title: 'הרפתקה / טרקים', items: ['נעלי טרקים', 'תיק גב 30L+', 'בקבוק מים', 'פנס ראש', 'מכנסי דריי-פיט', 'חולצות מנדפות', 'מעיל רוח', 'ערכת עזרה ראשונה'] },
    };

    const multiplier = duration === 'short' ? 1 : duration === 'week' ? 1.5 : 2;
    const clothingNote = duration === 'short' ? '(3-5 ימים)' : duration === 'week' ? '(6-10 ימים)' : '(11+ ימים)';

    const list = lists[dest];
    let html = `<h4>חובה ${clothingNote}</h4><ul>${essentials.map(i => '<li>' + i + '</li>').join('')}</ul>`;
    html += `<h4>${list.title}</h4><ul>${list.items.map(i => '<li>' + i + '</li>').join('')}</ul>`;

    result.innerHTML = html;
}

/* --- Exit-Intent Popup --- */
let exitPopupShown = false;

document.addEventListener('mouseout', (e) => {
    if (e.clientY < 5 && !exitPopupShown && !sessionStorage.getItem('exitPopupClosed')) {
        document.getElementById('exitPopup').style.display = 'block';
        exitPopupShown = true;
    }
});

function closeExitPopup() {
    document.getElementById('exitPopup').style.display = 'none';
    sessionStorage.setItem('exitPopupClosed', 'true');
}

/* --- Sticky Quote Bar --- */
function initStickyBar() {
    const bar = document.getElementById('stickyBar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            bar.classList.add('visible');
        } else {
            bar.classList.remove('visible');
        }
    });
}
initStickyBar();

/* --- Affiliate Click Tracking --- */
function trackAffiliate(linkName, linkUrl) {
    if (!sb) return;
    sb.from('affiliate_clicks').insert({
        link_name: linkName,
        link_url: linkUrl,
        session_id: SESSION_ID,
        referrer: document.referrer || '',
    }).catch(() => {});
    trackEvent('affiliate_click', { link: linkName, url: linkUrl });
}

/* --- Accessibility & Dark Mode --- */
let fontSizeLevel = 0;

function changeFontSize(dir) {
    if (dir === 0) {
        fontSizeLevel = 0;
        document.documentElement.style.fontSize = '';
    } else {
        fontSizeLevel += dir;
        fontSizeLevel = Math.max(-3, Math.min(5, fontSizeLevel));
        document.documentElement.style.fontSize = (100 + fontSizeLevel * 10) + '%';
    }
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    // Turn off dark mode if enabling high contrast
    if (document.body.classList.contains('high-contrast')) {
        document.body.classList.remove('dark-mode');
    }
}

function toggleHighlightLinks() {
    document.body.classList.toggle('highlight-links');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    // Turn off high contrast if enabling dark mode
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('high-contrast');
    }
}

// Close a11y panel when clicking outside
document.addEventListener('click', (e) => {
    const toolbar = document.getElementById('a11yToolbar');
    if (toolbar && !toolbar.contains(e.target)) {
        document.getElementById('a11yPanel')?.classList.remove('open');
    }
});

/* --- Custom Form Multi-Step --- */
function nextFormStep(step) {
    if (step === 2) trackEvent('form_start'); // Track when user goes to step 2
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelector(`.form-step[data-form-step="${step}"]`).classList.add('active');

    document.querySelectorAll('.step-dot').forEach(dot => {
        const dotStep = parseInt(dot.dataset.step);
        dot.classList.remove('active', 'completed');
        if (dotStep === step) dot.classList.add('active');
        else if (dotStep < step) dot.classList.add('completed');
    });

    // Scroll form into view
    document.getElementById('trip-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function submitTripForm(e) {
    e.preventDefault();
    const form = document.getElementById('tripForm');
    const formData = new FormData(form);

    // Track form completion
    trackEvent('form_complete', { destination: formData.get('entry.1749388622') });

    // Build data object for Supabase
    const tripData = {
        full_name: formData.get('entry.1883151446') || '',
        phone: formData.get('entry.195224141') || '',
        email: formData.get('emailAddress') || '',
        ages: formData.get('entry.1984006419') || '',
        passport_valid: formData.get('entry.1643179041') || '',
        destination: formData.get('entry.1749388622') || '',
        travel_dates: formData.get('entry.1056874049') || '',
        date_flexibility: formData.get('entry.1499261677') || '',
        service_type: formData.get('entry.1169236923') || '',
        budget: formData.get('entry.617714780') || '',
        support_level: formData.get('entry.953177635') || '',
        flight_pref: formData.get('entry.1864061787') || '',
        airline_pref: formData.get('entry.741895817') || '',
        luggage_type: formData.get('entry.1085495667') || '',
        cancel_policy: formData.get('entry.776037380') || '',
        hotel_level: formData.get('entry.11084784') || '',
        bed_type: formData.get('entry.935151483') || '',
        meals: formData.get('entry.611868580') || '',
        hotel_cancel: formData.get('entry.1421429188') || '',
        shabbat_kosher: formData.get('entry.1036689062') || '',
        special_notes: formData.get('entry.180413487') || '',
    };

    // ALWAYS send to Google Forms (this is Petal's primary inbox)
    try {
        let iframe = document.getElementById('hiddenGformFrame');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'hiddenGformFrame';
            iframe.name = 'hiddenGformFrame';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        const originalAction = form.action;
        const originalTarget = form.target;
        const originalMethod = form.method;
        form.action = 'https://docs.google.com/forms/d/e/1FAIpQLSd2-mPm93x14l9DAf0bqfRqyFtY-xLTmWPs5NIvfJGON-kl5Q/formResponse';
        form.method = 'POST';
        form.target = 'hiddenGformFrame';
        form.submit();
        form.action = originalAction;
        form.target = originalTarget;
        form.method = originalMethod;
    } catch (err) {
        try {
            await fetch('https://docs.google.com/forms/d/e/1FAIpQLSd2-mPm93x14l9DAf0bqfRqyFtY-xLTmWPs5NIvfJGON-kl5Q/formResponse', {
                method: 'POST', body: formData, mode: 'no-cors'
            });
        } catch (e2) { /* ignore */ }
    }

    if (sb) {
        try {
            await sb.from('trip_requests').insert(tripData);
        } catch (e) { /* ignore */ }
    }

    showFormSuccess();
}

function showFormSuccess() {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    const indicator = document.querySelector('.form-steps-indicator');
    if (indicator) indicator.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
}

let chatLang = 'he';

function switchChatbotLanguage(lang) {
    chatLang = lang;
    // Clear messages and show new welcome
    const messages = document.getElementById('chatbotMessages');
    if (messages) messages.innerHTML = '';
    clearQuickReplies();

    if (lang === 'he' && typeof hebrewChatbot !== 'undefined') {
        setTimeout(() => {
            addBotMessage(hebrewChatbot.greetings[Math.floor(Math.random() * hebrewChatbot.greetings.length)]);
            showQuickReplies(hebrewChatbot.quickReplies);
        }, 300);
    } else {
        chatLang = 'en';
        setTimeout(() => {
            addBotMessage(chatbotKnowledge.greetings[Math.floor(Math.random() * chatbotKnowledge.greetings.length)]);
            showQuickReplies(['Popular destinations', 'What services?', 'Full itinerary', 'Get a quote']);
        }, 300);
    }
}

let chatHistory = []; // AI conversation history

async function handleUserMessage() {
    const input = document.getElementById('chatbotInput');
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = '';
    clearQuickReplies();
    showTyping();

    chatHistory.push({ role: 'user', content: text });

    // Try AI chatbot via proxy server
    const AI_PROXY_URL = 'https://travel-by-petal-bot.onrender.com/api/chat';
    let aiResponse = null;
    try {
        const aiRes = await fetch(AI_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: text,
                history: chatHistory.slice(-8),
                lang: chatLang,
            }),
        });
        if (aiRes.ok) {
            const aiData = await aiRes.json();
            if (aiData.reply && !aiData.fallback) {
                aiResponse = aiData.reply;
                chatHistory.push({ role: 'assistant', content: aiResponse });
                if (sb) {
                    sb.from('chatbot_logs').insert({
                        session_id: SESSION_ID, user_message: text,
                        bot_response: aiResponse.substring(0, 500),
                        was_ai: true, lang: chatLang,
                    }).catch(() => {});
                }
            }
        }
    } catch (e) { /* fall through to rule-based */ }

    removeTyping();

    if (aiResponse) {
        addBotMessage(aiResponse);
        // Show default quick replies for AI
        const defaultQR = chatLang === 'he'
            ? ['יעדים פופולריים', 'הצעת מחיר', 'וואטסאפ']
            : ['Popular destinations', 'Get a quote', 'Chat on WhatsApp'];
        showQuickReplies(defaultQR);
    } else {
        // Fallback to rule-based chatbot
        let response;
        if (chatLang === 'he') {
            response = generateHebrewResponse(text);
        } else {
            response = generateResponse(text);
        }
        addBotMessage(response.message);
        if (response.quickReplies) showQuickReplies(response.quickReplies);

        // Log fallback response
        if (sb) {
            sb.from('chatbot_logs').insert({
                session_id: SESSION_ID,
                user_message: text,
                bot_response: response.message.substring(0, 500),
                was_ai: false,
                lang: chatLang,
            }).catch(() => {});
        }
    }
}

function generateResponse(input) {
    const text = input.toLowerCase().trim();

    // Greeting patterns
    if (/^(hi|hello|hey|shalom|good (morning|afternoon|evening)|howdy|what'?s up)/i.test(text)) {
        return {
            message: chatbotKnowledge.greetings[Math.floor(Math.random() * chatbotKnowledge.greetings.length)],
            quickReplies: ['Popular destinations', 'Honeymoon packages', 'Family trips', 'Budget travel']
        };
    }

    // Thank you
    if (/thank|thanks|toda/i.test(text)) {
        return {
            message: "You're welcome! If you need anything else, I'm here. You can also reach our team directly on WhatsApp for a personalized quote!",
            quickReplies: ['Chat on WhatsApp', 'More destinations', 'Budget planner']
        };
    }

    // WhatsApp / contact / human / agent
    if (/whatsapp|contact|human|agent|real person|speak|call|phone|talk to/i.test(text)) {
        return {
            message: `Of course! You can reach our travel expert directly on WhatsApp: <a href="${WHATSAPP_LINK}?text=Hi!%20I'd%20like%20to%20plan%20a%20trip!" target="_blank" rel="noopener" style="color:#25D366;font-weight:600">Click here to chat on WhatsApp</a>. We typically respond within 15 minutes!`,
            quickReplies: ['Back to destinations', 'Tell me about prices']
        };
    }

    // Destination searches
    for (const [key, response] of Object.entries(chatbotKnowledge.destinations)) {
        if (text.includes(key)) {
            return {
                message: response,
                quickReplies: ['Chat on WhatsApp', 'Other destinations', 'Budget planner', 'Tell me more']
            };
        }
    }

    // Country / city aliases
    const aliases = {
        greek: 'greece', mykonos: 'greece', santorini: 'greece', crete: 'greece',
        uae: 'dubai', emirates: 'dubai',
        italian: 'italy', venice: 'italy', amalfi: 'italy', tuscany: 'italy', florence: 'italy',
        spanish: 'barcelona', spain: 'barcelona', gaudi: 'barcelona',
        british: 'london', england: 'london', uk: 'london',
        vietnamese: 'vietnam', hanoi: 'vietnam', saigon: 'vietnam',
        indian: 'india', delhi: 'india', mumbai: 'india', goa: 'india', rajasthan: 'india', taj: 'india', kerala: 'india',
        acropolis: 'athens', parthenon: 'athens',
        colosseum: 'rome', vatican: 'rome',
    };

    for (const [alias, dest] of Object.entries(aliases)) {
        if (text.includes(alias)) {
            return {
                message: chatbotKnowledge.destinations[dest],
                quickReplies: ['Chat on WhatsApp', 'Other destinations', 'Budget planner']
            };
        }
    }

    // Topic searches
    for (const [key, response] of Object.entries(chatbotKnowledge.topics)) {
        if (text.includes(key)) {
            return {
                message: response,
                quickReplies: ['Chat on WhatsApp', 'Popular destinations', 'Budget planner']
            };
        }
    }

    // Additional keyword patterns
    if (/beach|sea|ocean|swim|sun|tan/i.test(text)) {
        return {
            message: "Love the beach vibes! Our top beach destinations: Maldives (luxury paradise), Bali (tropical adventure), Santorini (romantic sunsets), and Cancun (fun & affordable). Which sounds like your style?",
            quickReplies: ['Maldives', 'Bali', 'Santorini', 'Chat on WhatsApp']
        };
    }

    if (/ski|snow|winter|cold|mountain/i.test(text)) {
        return {
            message: "Winter wonderland lover! We recommend: Swiss Alps (world-class skiing), Lapland Finland (Northern Lights & Santa's village), Iceland (dramatic landscapes), and Austrian Alps. Shall I get you a quote?",
            quickReplies: ['Swiss Alps', 'Iceland', 'Chat on WhatsApp']
        };
    }

    if (/food|culinar|eat|restaurant|cuisine/i.test(text)) {
        return {
            message: "A foodie trip — excellent choice! Top destinations for food lovers: Italy (pasta & pizza perfection), Japan (sushi & ramen heaven), Thailand (street food paradise), and Spain (tapas galore). Which cuisine excites you most?",
            quickReplies: ['Italy', 'Japan', 'Thailand', 'Chat on WhatsApp']
        };
    }

    if (/cheap|affordable|deal|discount|save|special|offer/i.test(text)) {
        return {
            message: "We love finding amazing deals! Right now we have great offers on: Thailand from $699, Bali from $999, and Greece from $899. Plus, we have early-bird discounts for bookings 3+ months ahead. Want a personalized budget-friendly package?",
            quickReplies: ['Thailand', 'Bali', 'Budget planner', 'Chat on WhatsApp']
        };
    }

    if (/popular|recommend|suggest|best|top|where should/i.test(text)) {
        return {
            message: "Our most popular destinations right now: 1) Dubai for luxury, 2) India for adventure, 3) Athens & Rome for culture, 4) Barcelona for vibes, 5) London for classics, 6) Vietnam for exotic experiences. Which catches your eye?",
            quickReplies: ['Dubai', 'India', 'Rome', 'Barcelona', 'Vietnam']
        };
    }

    if (/what service|what do you|what can you|how do you|help me/i.test(text)) {
        return {
            message: chatbotKnowledge.topics.service,
            quickReplies: ['A la carte booking', 'Full itinerary', 'Get a quote', 'Chat on WhatsApp']
        };
    }

    if (/how|what|tell me about|info|about|who/i.test(text) && /petal|you|company|agency/i.test(text)) {
        return {
            message: "Travel By Petal is based in Ra'anana, Israel. Anyone can book online, but when something goes wrong — that's when you need a real travel agent. I know all the laws and regulations, and I'm with you every step of the way. I can book flights, hotels, transfers, trains, cruises, restaurants, tours, excursions, and car rentals — or plan your full itinerary day by day!",
            quickReplies: ['What services?', 'Popular destinations', 'Chat on WhatsApp']
        };
    }

    if (/why.*agent|why.*you|why not.*myself|book.*myself|do it.*myself/i.test(text)) {
        return {
            message: chatbotKnowledge.topics.why,
            quickReplies: ['What services?', 'Popular destinations', 'Get a quote']
        };
    }

    if (/location|where are you|address|ra'?anana|office/i.test(text)) {
        return {
            message: "We're based in Ra'anana, Israel! We work primarily through WhatsApp for your convenience — no need to visit an office. Reach us anytime at 054-558-1269. We serve clients worldwide!",
            quickReplies: ['Chat on WhatsApp', 'Popular destinations']
        };
    }

    if (/cancel|refund|policy/i.test(text)) {
        return {
            message: "We understand plans can change! Our cancellation policies vary by package and booking. For specific details about your booking, please reach out to our team on WhatsApp and we'll help you right away.",
            quickReplies: ['Chat on WhatsApp', 'Travel insurance']
        };
    }

    if (/book|reserve|plan|trip|vacation|holiday/i.test(text)) {
        return {
            message: "Exciting! Let's plan your perfect trip! You can either: 1) Take our Dream Trip Quiz to find your ideal destination, 2) Browse our popular packages, or 3) Chat directly with our team on WhatsApp for a custom itinerary. What would you prefer?",
            quickReplies: ['Take the quiz', 'Popular destinations', 'Chat on WhatsApp']
        };
    }

    // Quick reply handlers
    if (/popular destination|other destination|more destination|back to destination/i.test(text)) {
        return {
            message: "Our most popular destinations: Dubai, India, Athens, Rome, Barcelona, London, and Vietnam. I can book flights, hotels, transfers, tours — or plan your full itinerary. Which destination interests you?",
            quickReplies: ['Dubai', 'India', 'Athens', 'Rome', 'Barcelona', 'London', 'Vietnam']
        };
    }

    if (/a la carte|booking|just.*flight|just.*hotel|individual/i.test(text)) {
        return {
            message: chatbotKnowledge.topics.book,
            quickReplies: ['Full itinerary', 'Get a quote', 'Chat on WhatsApp']
        };
    }

    if (/full itinerary|day by day|plan.*whole|plan.*entire|complete.*plan/i.test(text)) {
        return {
            message: chatbotKnowledge.topics.itinerary,
            quickReplies: ['Get a quote', 'Popular destinations', 'Chat on WhatsApp']
        };
    }

    if (/quote|form|request|get started|start/i.test(text)) {
        return {
            message: "Fill out our quick trip request form and I'll get back to you with a personalized quote! <a href='" + BOOKING_FORM + "' onclick='document.getElementById(\"trip-form\").scrollIntoView({behavior:\"smooth\"})' style='color:var(--primary);font-weight:600'>Click here to fill out the form</a>",
            quickReplies: ['Popular destinations', 'Chat on WhatsApp']
        };
    }

    if (/take.*quiz|quiz|find.*trip|dream trip/i.test(text)) {
        return {
            message: "Great idea! Scroll up to our \"Find Your Dream Trip\" section or <a href='#quiz' style='color:var(--primary);font-weight:600'>click here</a> to take the quiz. It's just 4 quick questions and I'll match you with your perfect destination!",
            quickReplies: ['Popular destinations', 'Chat on WhatsApp']
        };
    }

    if (/budget.*plan|planner|calculator|cost|estimate/i.test(text)) {
        return {
            message: "Smart thinking! Check out our Budget Planner — <a href='#calculator' style='color:var(--primary);font-weight:600'>click here</a> to estimate your trip cost with our interactive calculator. Adjust sliders for destination, duration, and hotel level to get an instant estimate!",
            quickReplies: ['Popular destinations', 'Chat on WhatsApp']
        };
    }

    if (/tell me more|more info|details/i.test(text)) {
        return {
            message: "I'd love to help with more details! What specifically are you interested in? A particular destination, type of trip, or pricing info? Or I can connect you directly with our travel expert on WhatsApp for a personalized consultation!",
            quickReplies: ['Popular destinations', 'Honeymoon packages', 'Budget travel', 'Chat on WhatsApp']
        };
    }

    if (/price|cost|how much|rate/i.test(text)) {
        return {
            message: chatbotKnowledge.topics.price,
            quickReplies: ['Budget planner', 'Chat on WhatsApp', 'Popular destinations']
        };
    }

    // Fallback
    return {
        message: chatbotKnowledge.fallback[Math.floor(Math.random() * chatbotKnowledge.fallback.length)],
        quickReplies: ['Popular destinations', 'Chat on WhatsApp', 'Take the quiz', 'Budget planner']
    };
}

function addBotMessage(html) {
    const container = document.getElementById('chatbotMessages');
    const msg = document.createElement('div');
    msg.className = 'chat-message bot';
    msg.innerHTML = html;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function addUserMessage(text) {
    const container = document.getElementById('chatbotMessages');
    const msg = document.createElement('div');
    msg.className = 'chat-message user';
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function showTyping() {
    const container = document.getElementById('chatbotMessages');
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.id = 'typingIndicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
}

function removeTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

function showQuickReplies(replies) {
    const container = document.getElementById('quickReplies');
    container.innerHTML = '';
    replies.forEach(text => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply';
        btn.textContent = text;
        btn.onclick = () => {
            if (text === 'Chat on WhatsApp') {
                window.open(WHATSAPP_LINK + '?text=Hi!%20I%27d%20like%20to%20plan%20a%20trip!', '_blank');
            } else {
                document.getElementById('chatbotInput').value = text;
                handleUserMessage();
            }
        };
        container.appendChild(btn);
    });
}

function clearQuickReplies() {
    document.getElementById('quickReplies').innerHTML = '';
}

/* --- Hebrew Chatbot Responses --- */
function generateHebrewResponse(input) {
    const text = input.trim();
    const hc = typeof hebrewChatbot !== 'undefined' ? hebrewChatbot : null;
    if (!hc) return { message: 'שגיאה', quickReplies: [] };

    const r = hc.responses;
    const qr = hc.quickReplies;

    // Check quick reply map first (exact match)
    for (const [label, key] of Object.entries(hc.quickReplyMap)) {
        if (text === label) {
            const replies = key === 'destinations'
                ? ['דובאי', 'הודו', 'אתונה', 'רומא', 'ברצלונה', 'לונדון', 'וייטנאם']
                : key === 'services' ? ['מסלול מלא', 'הצעת מחיר', 'וואטסאפ']
                : qr;
            return { message: r[key], quickReplies: replies };
        }
    }

    // Greeting
    if (/^(שלום|היי|הי|בוקר טוב|ערב טוב|אהלן)/i.test(text)) {
        return { message: hc.greetings[Math.floor(Math.random() * hc.greetings.length)], quickReplies: qr };
    }

    // Thanks
    if (/תודה|תנקיו|thanks/i.test(text)) {
        return { message: r.thanks, quickReplies: ['וואטסאפ', 'יעדים פופולריים'] };
    }

    // WhatsApp
    if (/וואטסאפ|whatsapp|טלפון|צור קשר|אדם אמיתי/i.test(text)) {
        return { message: r.whatsapp, quickReplies: ['יעדים פופולריים', 'הצעת מחיר'] };
    }

    // Destinations
    const destMap = {
        'דובאי': 'dubai', 'dubai': 'dubai',
        'הודו': 'india', 'india': 'india', 'טאג': 'india',
        'רומא': 'rome', 'rome': 'rome', 'איטליה': 'rome', 'קולוסיאום': 'rome',
        'אתונה': 'athens', 'athens': 'athens', 'יוון': 'athens', 'אקרופוליס': 'athens',
        'ברצלונה': 'barcelona', 'barcelona': 'barcelona', 'ספרד': 'barcelona',
        'לונדון': 'london', 'london': 'london', 'אנגליה': 'london',
        'וייטנאם': 'vietnam', 'vietnam': 'vietnam', 'האנוי': 'vietnam',
    };

    for (const [keyword, dest] of Object.entries(destMap)) {
        if (text.includes(keyword)) {
            return { message: r[dest], quickReplies: ['וואטסאפ', 'יעדים פופולריים', 'הצעת מחיר'] };
        }
    }

    // AI / Bot questions
    if (/AI|בוט|רובוט|אוטומט|מלאכותי|תוכנה|מחשב|אמיתי/i.test(text)) {
        return { message: 'אני העוזרת החכמה של Travel By Petal! 🌸 אני יכולה לענות על שאלות, להמליץ על יעדים, ולעזור לתכנן את הטיול שלכם. לשירות אישי ומלא, פטל עצמה זמינה בוואטסאפ! 📱', quickReplies: ['יעדים פופולריים', 'אילו שירותים?', 'וואטסאפ'] };
    }

    // Topics
    if (/שירות|מה את עושה|מה את מציע|עוזר|מה אפשר|עוזרת|יכולה/i.test(text)) {
        return { message: r.services, quickReplies: ['מסלול מלא', 'הצעת מחיר', 'וואטסאפ'] };
    }
    if (/מסלול|יום אחרי יום|תכנון מלא|תכנני|תכנן/i.test(text)) {
        return { message: r.itinerary, quickReplies: ['הצעת מחיר', 'יעדים פופולריים', 'וואטסאפ'] };
    }
    if (/הצעת מחיר|מחיר|כמה עולה|טופס|התחל|עלות|תקציב|זול|יקר/i.test(text)) {
        return { message: r.quote, quickReplies: ['יעדים פופולריים', 'וואטסאפ'] };
    }
    if (/יעד|לאן|פופולר|מומלץ|להמליץ|איפה|לנסוע|טיול/i.test(text)) {
        return { message: r.destinations, quickReplies: ['דובאי', 'הודו', 'רומא', 'ברצלונה', 'וייטנאם'] };
    }
    if (/מי את|על פטל|על החברה|אודות|מה זה/i.test(text)) {
        return { message: r.about, quickReplies: ['אילו שירותים?', 'יעדים פופולריים', 'וואטסאפ'] };
    }
    if (/טיסה|טיסות|לטוס|כרטיס טיסה|כרטיסי/i.test(text)) {
        return { message: 'אני מחפשת את הטיסות הכי טובות בכל חברות התעופה! ✈️ גם שדרוגים לביזנס. לאן אתם טסים?', quickReplies: ['יעדים פופולריים', 'הצעת מחיר'] };
    }
    if (/מלון|מלונות|לינה|איפה לישון|לילה|לילות|אירוח/i.test(text)) {
        return { message: 'אני מוצאת ומזמינה את המלון המושלם! 🏨 מבוטיק ועד 5 כוכבים. מה היעד שלכם?', quickReplies: ['הצעת מחיר', 'וואטסאפ'] };
    }
    if (/סיור|אטרקצי|פעילות|מה לעשות|דברים לעשות|לראות|לבקר/i.test(text)) {
        return { message: 'אני מארגנת סיורים מודרכים ואטרקציות בכל העולם! 🎫 ספרו לי מה היעד ואמליץ על חוויות מדהימות.', quickReplies: ['דובאי', 'רומא', 'ברצלונה', 'הצעת מחיר'] };
    }
    if (/ירח דבש|חתונה|רומנטי|זוג|חגיגה/i.test(text)) {
        return { message: 'מזל טוב! 💕 אני מתמחה בטיולי ירח דבש רומנטיים! אתכנן כל פרט — ארוחות ערב הפתעה, חבילות ספא, שדרוגי חדר. מה היעד החלום שלכם?', quickReplies: ['דובאי', 'רומא', 'ברצלונה', 'הצעת מחיר'] };
    }
    if (/משפחה|ילדים|משפחתי|עם הילדים/i.test(text)) {
        return { message: 'טיולי משפחה זה ההתמחות שלי! 👨‍👩‍👧‍👦 אני ממליצה על דובאי, ברצלונה, לונדון ורומא למשפחות. כמה אתם?', quickReplies: ['דובאי', 'לונדון', 'הצעת מחיר'] };
    }
    if (/חברים|חבר|חברה|קבוצה|גדולה/i.test(text)) {
        return { message: 'טיולים עם חברים זה הכי כיף! 🎉 אני מתכננת גם לקבוצות גדולות — מחירים מיוחדים ומסלולים מותאמים. כמה אתם וזה יעד?', quickReplies: ['יעדים פופולריים', 'הצעת מחיר'] };
    }
    if (/ויזה|ויזא|דרכון|אשרה|כניסה/i.test(text)) {
        return { message: 'דרישות ויזה תלויות ביעד ובדרכון שלכם. 📋 עם דרכון ישראלי, הרבה מדינות מאפשרות כניסה ללא ויזה. ספרו לי את היעד ואבדוק!', quickReplies: ['יעדים פופולריים', 'וואטסאפ'] };
    }
    if (/ביטוח|ביטוח נסיעות|כיסוי/i.test(text)) {
        return { message: 'תמיד ממליצה על ביטוח נסיעות! 🛡️ אני יכולה לעזור למצוא ביטוח במחיר טוב שמכסה ביטול, מצבים רפואיים ומזוודות אבודות.', quickReplies: ['הצעת מחיר', 'וואטסאפ'] };
    }
    if (/מזג אוויר|מזג האוויר|חם|קר|גשם|שלג|קיץ|חורף/i.test(text)) {
        return { message: 'מזג האוויר חשוב לתכנון! ☀️\n\n🏙️ דובאי: חם (נוב-מרץ הכי נעים)\n🏛️ אתונה: חם (אפר-יוני, ספט-אוק)\n🏟️ רומא: נעים (אפר-יוני, ספט-אוק)\n🎭 ברצלונה: חמים (מאי-אוק)\n🇬🇧 לונדון: מתון (מאי-ספט)\n🌴 וייטנאם: טרופי (פבר-אפר)\n\nלאן חושבים?', quickReplies: ['דובאי', 'רומא', 'ברצלונה', 'וייטנאם'] };
    }
    if (/אוכל|מסעדה|מסעדות|אוכל מקומי|טעים|בישול/i.test(text)) {
        return { message: 'אוכל זה חלק מהטיול! 🍽️ אני מזמינה מסעדות מקומיות, סיורי אוכל, וסדנאות בישול. היעדים הכי טעימים: איטליה (פסטה!), וייטנאם (פו!), הודו (קארי!), וספרד (טאפאס!). מה מעניין?', quickReplies: ['רומא', 'וייטנאם', 'ברצלונה', 'הצעת מחיר'] };
    }
    if (/חוף|ים|שחייה|בריכה|שיזוף|חופש/i.test(text)) {
        return { message: 'רוצים חוף? 🏖️ דובאי — חופים מהממים + מלונות יוקרה. ברצלונה — חוף עירוני + תרבות. וייטנאם — חופים טרופיים פרטיים. מה הסגנון שלכם?', quickReplies: ['דובאי', 'ברצלונה', 'וייטנאם'] };
    }
    if (/הרפתקה|אדרנלין|טרקים|טרק|צלילה|ספורט|אתגר/i.test(text)) {
        return { message: 'מחפשים אדרנלין? 🏔️ הודו — טרקים בהימלאיה, וייטנאם — מוטורבייקים, דובאי — סקיידייב ומדבר! אני אתכנן הרפתקה שלא תשכחו.', quickReplies: ['הודו', 'וייטנאם', 'דובאי', 'הצעת מחיר'] };
    }
    if (/תרבות|היסטוריה|מוזיאון|ארכיאולוגי|עתיק/i.test(text)) {
        return { message: 'אוהבים תרבות והיסטוריה? 🏛️ אתונה — אקרופוליס ויוון העתיקה. רומא — קולוסיאום והוותיקן. הודו — טאג\' מאהל. לונדון — מוזיאונים חינם! לאן נוסעים?', quickReplies: ['אתונה', 'רומא', 'הודו', 'לונדון'] };
    }
    if (/קניות|שופינג|לקנות|שוק|שווקים/i.test(text)) {
        return { message: 'קניות? 🛍️ דובאי — דובאי מול והשוקים. לונדון — הארודס וקמדן. ברצלונה — לה בוקריה ופסאז׳ דה גרסיה. איפה תרצו לעשות קניות?', quickReplies: ['דובאי', 'לונדון', 'ברצלונה'] };
    }
    if (/שייט|קרוז|ספינה/i.test(text)) {
        return { message: 'אני מזמינה שייטים בכל העולם! 🚢 ים תיכון, קריביים, נהרות באירופה ועוד. ספרו לי מה מעניין ואבנה לכם חבילה!', quickReplies: ['הצעת מחיר', 'וואטסאפ'] };
    }
    if (/רכב|השכרת רכב|נהיגה|לנהוג/i.test(text)) {
        return { message: 'אני מזמינה השכרת רכב בתעריפים מצוינים! 🚗 אוטומטי או ידני, איסוף משדה התעופה או מהמלון. באיזה יעד צריכים רכב?', quickReplies: ['יעדים פופולריים', 'הצעת מחיר'] };
    }
    if (/רכבת|רכבות|יורייל|קטע|תחבורה/i.test(text)) {
        return { message: 'אני מזמינה כרטיסי רכבת ברחבי אירופה ואסיה! 🚂 כולל רכבות מהירות. לאן נוסעים?', quickReplies: ['רומא', 'ברצלונה', 'לונדון', 'הצעת מחיר'] };
    }
    if (/העברה|טרנספר|משדה|לשדה|נמל תעופה/i.test(text)) {
        return { message: 'אני מזמינה העברות משדה תעופה לכל יעד! 🚐 פרטי או משותף, דלת לדלת. ספרו לי את היעד!', quickReplies: ['יעדים פופולריים', 'הצעת מחיר'] };
    }
    if (/למה|מה היתרון|למה דרך|בעצמי|לבד/i.test(text)) {
        return { message: r.about, quickReplies: ['אילו שירותים?', 'יעדים פופולריים', 'וואטסאפ'] };
    }
    if (/כשר|שבת|דתי|כשרות/i.test(text)) {
        return { message: 'אני מטפלת בכל הנושא! 🕊️ טיסות שלא בשבת, מלונות עם אוכל כשר, ומסלולים מותאמים. ספרו לי את היעד ואתאים הכל!', quickReplies: ['יעדים פופולריים', 'הצעת מחיר'] };
    }
    if (/ביטול|לבטל|החזר|שינוי|לשנות/i.test(text)) {
        return { message: 'אני מבינה שתוכניות משתנות! 📋 מדיניות הביטול תלויה בהזמנה. דברו איתי בוואטסאפ ואטפל בזה!', quickReplies: ['וואטסאפ'] };
    }
    if (/שעות|פתוח|זמינ|מתי|פועל/i.test(text)) {
        return { message: 'אני זמינה! ⏰\nא-ה: 9:00 - 18:00\nו: 9:00 - 13:00\nוואטסאפ: 054-558-1269\n\nאפשר גם להשאיר הודעה ואחזור אליכם! 😊', quickReplies: ['וואטסאפ', 'הצעת מחיר'] };
    }
    if (/סולו|לבד|יחיד|עצמי/i.test(text)) {
        return { message: 'טיול סולו זה חוויה מדהימה! 🧳 אני ממליצה על וייטנאם, הודו, וברצלונה לטיולים עצמאיים. אני אדאג שהכל מאורגן ובטוח!', quickReplies: ['וייטנאם', 'הודו', 'ברצלונה', 'הצעת מחיר'] };
    }
    if (/בטיחות|בטוח|מסוכן|סכנה/i.test(text)) {
        return { message: 'הבטיחות שלכם חשובה לי! 🛡️ כל היעדים שאני ממליצה עליהם בטוחים למטיילים. אני תמיד מעדכנת לגבי מצב ביטחוני ודרישות כניסה. לאיזה יעד חושבים?', quickReplies: ['יעדים פופולריים', 'וואטסאפ'] };
    }

    // Catch-all with smarter response based on message length
    if (text.length > 30) {
        // Long message = probably a detailed question
        return { message: 'קיבלתי! 📝 זו שאלה מעולה שמצריכה תשובה מפורטת. אני רוצה לתת לכם את התשובה הכי טובה — בואו נדבר בוואטסאפ כדי שאוכל להבין בדיוק מה אתם צריכים! 💬', quickReplies: ['וואטסאפ', 'הצעת מחיר', 'יעדים פופולריים'] };
    }

    // Short unknown message
    return { message: 'לא בטוחה שהבנתי 😊 אני יכולה לעזור עם:\n\n🌍 המלצות יעדים\n✈️ הזמנת טיסות ומלונות\n🗺️ תכנון מסלול מלא\n💰 הצעות מחיר\n\nמה מעניין אתכם?', quickReplies: ['יעדים פופולריים', 'אילו שירותים?', 'מסלול מלא', 'הצעת מחיר'] };
}
