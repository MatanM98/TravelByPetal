/* ============================================
   Travel By Petal - Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initPetals();
    initNavbar();
    initStatCounter();
    initChatbot();
    calculateBudget();
});

/* --- Floating Petals --- */
function initPetals() {
    const container = document.getElementById('petalsContainer');
    const colors = ['#5ba4c9', '#89c4e1', '#c9a84c', '#a8d4ea', '#e8d590'];

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

    // Create petals periodically (gentle)
    setInterval(createPetal, 5000);
    for (let i = 0; i < 3; i++) setTimeout(createPetal, i * 1200);
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

const BOOKING_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSd2-mPm93x14l9DAf0bqfRqyFtY-xLTmWPs5NIvfJGON-kl5Q/viewform?usp=header';

const chatbotKnowledge = {
    greetings: [
        "Hello! Welcome to Travel By Petal! I'm Petal, your travel assistant. How can I help you plan your next trip?",
        "Hi there! Anyone can book online, but when you want a real professional handling your trip — that's where I come in. How can I help?",
        "Welcome! I'm Petal, your personal travel guide. Whether you need just flights or a full day-by-day itinerary, I'm here to help!"
    ],
    destinations: {
        dubai: "Dubai is incredible! Desert safaris, luxury shopping, Burj Khalifa, and amazing dining. Best Nov-Mar. I can book flights, hotels, transfers, and attractions. You can also <a href='https://tic.dubai.co.il/affiliate/' target='_blank' style='color:var(--primary);font-weight:600'>browse Dubai attractions here</a> (Hebrew, Shekels, Tashlumim!).",
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
        book: "I can book: flights, hotels, airport transfers, trains, cruises, restaurants, guided day tours, excursions, and car rental. Tell me what you need or <a href='" + BOOKING_FORM + "' target='_blank' style='color:var(--primary);font-weight:600'>fill out our trip form</a>!",
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
        price: "Prices vary based on destination, dates, and preferences. Fill out our <a href='" + BOOKING_FORM + "' target='_blank' style='color:var(--primary);font-weight:600'>trip request form</a> and I'll send you a personalized quote!",
        why: "Anyone can book online — but when something goes wrong, that's when you really need a travel agent. Someone who knows all the laws and regulations. Think of it like eating at a restaurant — you can cook at home, but sometimes you want a professional to handle it. I'm with you every step of the way!",
    },
    fallback: [
        "Great question! I'd love to help you personally. Chat with me on WhatsApp or <a href='" + BOOKING_FORM + "' target='_blank' style='color:var(--primary);font-weight:600'>fill out our trip form</a>!",
        "I want to give you the perfect answer! Let's continue on WhatsApp or you can <a href='" + BOOKING_FORM + "' target='_blank' style='color:var(--primary);font-weight:600'>submit a trip request</a>.",
        "Interesting! Let me help you with that. Would you like to chat on WhatsApp or <a href='" + BOOKING_FORM + "' target='_blank' style='color:var(--primary);font-weight:600'>fill out our form</a>?"
    ]
};

function initChatbot() {
    const toggle = document.getElementById('chatbotToggle');
    const window_ = document.getElementById('chatbotWindow');
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');
    const badge = document.getElementById('chatbotBadge');
    const iconOpen = toggle.querySelector('.chatbot-icon-open');
    const iconClose = toggle.querySelector('.chatbot-icon-close');
    let isOpen = false;

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        window_.classList.toggle('open', isOpen);
        iconOpen.style.display = isOpen ? 'none' : 'block';
        iconClose.style.display = isOpen ? 'block' : 'none';
        badge.style.display = 'none';

        if (isOpen) {
            // Send welcome message on first open
            const messages = document.getElementById('chatbotMessages');
            if (messages.children.length === 0) {
                setTimeout(() => {
                    addBotMessage(chatbotKnowledge.greetings[Math.floor(Math.random() * chatbotKnowledge.greetings.length)]);
                    showQuickReplies(['Popular destinations', 'What services?', 'Full itinerary', 'Get a quote']);
                }, 300);
            }
            setTimeout(() => input.focus(), 400);
        }
    });

    sendBtn.addEventListener('click', handleUserMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });
}

let chatLang = 'en';

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

function handleUserMessage() {
    const input = document.getElementById('chatbotInput');
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = '';
    clearQuickReplies();

    // Show typing indicator
    showTyping();

    // Process and respond after delay
    setTimeout(() => {
        removeTyping();
        if (chatLang === 'he') {
            const response = generateHebrewResponse(text);
            addBotMessage(response.message);
            if (response.quickReplies) showQuickReplies(response.quickReplies);
        } else {
            const response = generateResponse(text);
            addBotMessage(response.message);
            if (response.quickReplies) showQuickReplies(response.quickReplies);
        }
    }, 800 + Math.random() * 700);
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
            message: "Fill out our quick trip request form and I'll get back to you with a personalized quote! <a href='" + BOOKING_FORM + "' target='_blank' style='color:var(--primary);font-weight:600'>Click here to fill out the form</a>",
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

    // Topics
    if (/שירות|מה את עושה|מה את מציע|עוזר/i.test(text)) {
        return { message: r.services, quickReplies: ['מסלול מלא', 'הצעת מחיר', 'וואטסאפ'] };
    }
    if (/מסלול|יום אחרי יום|תכנון מלא|תכנני/i.test(text)) {
        return { message: r.itinerary, quickReplies: ['הצעת מחיר', 'יעדים פופולריים', 'וואטסאפ'] };
    }
    if (/הצעת מחיר|מחיר|כמה עולה|טופס|התחל/i.test(text)) {
        return { message: r.quote, quickReplies: ['יעדים פופולריים', 'וואטסאפ'] };
    }
    if (/יעד|לאן|פופולר|מומלץ|להמליץ/i.test(text)) {
        return { message: r.destinations, quickReplies: ['דובאי', 'הודו', 'רומא', 'ברצלונה', 'וייטנאם'] };
    }
    if (/מי את|על פטל|על החברה|אודות/i.test(text)) {
        return { message: r.about, quickReplies: ['אילו שירותים?', 'יעדים פופולריים', 'וואטסאפ'] };
    }
    if (/טיסה|טיסות|לטוס/i.test(text)) {
        return { message: 'אני מחפשת את הטיסות הכי טובות בכל חברות התעופה! גם שדרוגים לביזנס. לאן אתם טסים?', quickReplies: ['יעדים פופולריים', 'הצעת מחיר'] };
    }
    if (/מלון|מלונות|לינה/i.test(text)) {
        return { message: 'אני מוצאת ומזמינה את המלון המושלם! או שאפשר <a href="https://www.zenhotels.com/?cur=ILS&lang=he&partner_extra=Website&partner_slug=108573.affiliate.3022" target="_blank" style="color:var(--primary);font-weight:600">לחפש מלונות בעצמכם</a> (בעברית, בשקלים).', quickReplies: ['הצעת מחיר', 'וואטסאפ'] };
    }
    if (/סיור|אטרקצי|פעילות/i.test(text)) {
        return { message: 'אני מארגנת סיורים מודרכים ואטרקציות בכל העולם! או שאפשר <a href="https://www.getyourguide.com/?partner_id=BGGPE3N" target="_blank" style="color:var(--primary);font-weight:600">לחפש אטרקציות ב-GetYourGuide</a>.', quickReplies: ['הצעת מחיר', 'וואטסאפ'] };
    }
    if (/ירח דבש|חתונה|רומנטי/i.test(text)) {
        return { message: 'מזל טוב! אני מתמחה בטיולי ירח דבש רומנטיים! אתכנן כל פרט — ארוחות ערב הפתעה, חבילות ספא, שדרוגי חדר. מה היעד החלום שלכם?', quickReplies: ['דובאי', 'רומא', 'ברצלונה', 'הצעת מחיר'] };
    }
    if (/משפחה|ילדים|משפחתי/i.test(text)) {
        return { message: 'טיולי משפחה זה ההתמחות שלי! אני ממליצה על דובאי, ברצלונה, לונדון ורומא למשפחות. כמה אתם?', quickReplies: ['דובאי', 'לונדון', 'הצעת מחיר'] };
    }

    // Fallback
    return { message: r.fallback, quickReplies: ['יעדים פופולריים', 'וואטסאפ', 'הצעת מחיר'] };
}
