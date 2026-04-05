const express = require('express');
const app = express();
app.use(express.json());

// === CONFIGURATION ===
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'travelbypetal2026';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || '';
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '';
const OWNER_PHONE = '972545581269'; // Your phone number for forwarding

// === WEBHOOK VERIFICATION (GET) ===
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verified!');
        res.status(200).send(challenge);
    } else {
        console.log('Webhook verification failed');
        res.sendStatus(403);
    }
});

// === INCOMING MESSAGES (POST) ===
app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;

        if (body.object === 'whatsapp_business_account') {
            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;

            if (value?.messages) {
                const message = value.messages[0];
                const from = message.from; // sender phone number
                const msgBody = message.text?.body?.toLowerCase() || '';
                const senderName = value.contacts?.[0]?.profile?.name || '';

                console.log(`Message from ${senderName} (${from}): ${msgBody}`);

                // Generate response
                const response = generateResponse(msgBody, senderName);

                // Send reply
                await sendMessage(from, response);

                // If complex question, notify owner
                if (response.forwardToOwner) {
                    await sendMessage(OWNER_PHONE,
                        `📩 הודעה חדשה מ-${senderName} (${from}):\n"${message.text?.body}"\n\n🤖 תשובה אוטומטית נשלחה.`
                    );
                }
            }
        }

        res.sendStatus(200);
    } catch (err) {
        console.error('Error processing message:', err);
        res.sendStatus(200); // Always return 200 to WhatsApp
    }
});

// === RESPONSE GENERATOR ===
function generateResponse(text, name) {
    const greeting = name ? `שלום ${name}! ` : 'שלום! ';

    // Greeting
    if (/^(שלום|היי|הי|בוקר טוב|ערב טוב|אהלן|hello|hi|hey)$/i.test(text.trim())) {
        return {
            text: `${greeting}ברוכים הבאים ל-Travel By Petal! ✈️\n\nאני פטל, סוכנת הנסיעות שלכם 🌸\n\nאיך אפשר לעזור?\n\n1️⃣ הזמנת טיסות ומלונות\n2️⃣ תכנון מסלול מלא\n3️⃣ הצעת מחיר לטיול\n4️⃣ מידע על יעדים\n5️⃣ סטטוס הזמנה קיימת\n\nפשוט כתבו מספר או שאלה חופשית 😊`,
            forwardToOwner: false
        };
    }

    // Menu options
    if (text === '1' || /טיסה|טיסות|מלון|מלונות|הזמנ/i.test(text)) {
        return {
            text: `✈️ *הזמנת טיסות ומלונות*\n\nאני מזמינה עבורכם:\n• טיסות ✈️\n• מלונות 🏨\n• העברות משדה תעופה 🚐\n• רכבות 🚂\n• שייטים 🚢\n• מסעדות 🍽️\n• סיורים מודרכים 🗺️\n• אטרקציות 🎫\n• השכרת רכב 🚗\n\nספרו לי לאן ומתי אתם רוצים לטוס, ואחזור אליכם עם הצעה! 😊`,
            forwardToOwner: true
        };
    }

    if (text === '2' || /מסלול|תכנון|יום אחרי|itinerary/i.test(text)) {
        return {
            text: `🗺️ *תכנון מסלול מלא*\n\nאני מתכננת מסלולים יום אחרי יום!\n\n📋 כל בוקר, צהריים וערב מתוכננים\n📍 כל ההזמנות והלוגיסטיקה\n⏰ תזמון מושלם\n\nאתם פשוט נהנים! 🎉\n\nספרו לי:\n• לאן? 🌍\n• מתי? 📅\n• כמה אנשים? 👥\n• תקציב משוער? 💰`,
            forwardToOwner: true
        };
    }

    if (text === '3' || /הצעת מחיר|מחיר|כמה עולה|price|quote/i.test(text)) {
        return {
            text: `💰 *הצעת מחיר*\n\nבשמחה! כדי להכין הצעה מותאמת, אשמח לדעת:\n\n1. לאן אתם רוצים לטוס? 🌍\n2. תאריכים מבוקשים? 📅\n3. כמה מטיילים + גילאים? 👥\n4. מה אתם צריכים? (טיסה/מלון/מסלול)\n5. תקציב משוער? 💰\n\nאפשר גם למלא טופס באתר שלנו:\nhttps://matanm98.github.io/TravelByPetal/#trip-form`,
            forwardToOwner: true
        };
    }

    if (text === '4' || /יעד|יעדים|לאן|recommend|המלצ/i.test(text)) {
        return {
            text: `🌍 *היעדים הפופולריים שלנו:*\n\n🏙️ *דובאי* - יוקרה, ספארי, קניות\n🕌 *הודו* - טאג' מאהל, תרבות, אוכל\n🏛️ *אתונה* - היסטוריה, אקרופוליס, אוכל\n🏟️ *רומא* - קולוסיאום, ותיקן, פסטה\n🎭 *ברצלונה* - גאודי, חופים, טאפאס\n🇬🇧 *לונדון* - ביג בן, מוזיאונים, תיאטרון\n🌴 *וייטנאם* - הא לונג, אוכל, טבע\n\nאיזה יעד מעניין אתכם? 😊`,
            forwardToOwner: false
        };
    }

    if (text === '5' || /סטטוס|הזמנה קיימת|שאלה על הזמנה/i.test(text)) {
        return {
            text: `📋 *סטטוס הזמנה*\n\nאני בודקת ועוברת על ההזמנה שלכם.\nפטל תחזור אליכם בהקדם עם עדכון! ⏳\n\nאם זה דחוף, אפשר להתקשר: 054-558-1269 📱`,
            forwardToOwner: true
        };
    }

    // Destination specific
    if (/דובאי|dubai/i.test(text)) {
        return {
            text: `🏙️ *דובאי*\n\nיעד מדהים!\n\n🌡️ הזמן הטוב: נוב-מרץ\n✨ חובה: ספארי מדברי, בורג' חליפה, דובאי מול\n💰 חבילות מ-$1,499\n\nרוצים הצעת מחיר? ספרו לי תאריכים וכמה מטיילים! 😊\n\nאפשר גם לחפש אטרקציות בדובאי בעברית ובשקלים:\nhttps://tic.dubai.co.il/affiliate/`,
            forwardToOwner: true
        };
    }

    if (/הודו|india|דלהי|טאג/i.test(text)) {
        return {
            text: `🕌 *הודו*\n\nחוויה משנה חיים!\n\n🌡️ הזמן הטוב: אוק-מרץ\n✨ חובה: טאג' מאהל, קראלה, רג'סטאן\n🍛 אוכל מדהים!\n\nרוצים שאתכנן לכם מסלול יום אחרי יום? 🗺️`,
            forwardToOwner: true
        };
    }

    if (/רומא|rome|איטליה|italy/i.test(text)) {
        return {
            text: `🏟️ *רומא, איטליה*\n\nהעיר הנצחית!\n\n🌡️ הזמן הטוב: אפר-יוני, ספט-אוק\n✨ חובה: קולוסיאום, ותיקן, טרסטווארה\n🍝 פסטה, פיצה, ג'לאטו!\n\nרוצים הצעת מחיר? 😊`,
            forwardToOwner: true
        };
    }

    if (/אתונה|athens|יוון|greece/i.test(text)) {
        return {
            text: `🏛️ *אתונה, יוון*\n\nהיסטוריה חיה!\n\n🌡️ הזמן הטוב: אפר-יוני, ספט-אוק\n✨ חובה: אקרופוליס, פלאקה, טיולי איים\n🥗 אוכל יווני מדהים!\n\nרוצים הצעת מחיר? 😊`,
            forwardToOwner: true
        };
    }

    if (/ברצלונה|barcelona|ספרד|spain/i.test(text)) {
        return {
            text: `🎭 *ברצלונה, ספרד*\n\nעיר תוססת!\n\n🌡️ הזמן הטוב: מאי-יוני, ספט-אוק\n✨ חובה: סגרדה פמיליה, לה בוקריה, רובע גותי\n🍷 טאפאס וסנגריה!\n\nרוצים הצעת מחיר? 😊`,
            forwardToOwner: true
        };
    }

    if (/לונדון|london|אנגליה|england/i.test(text)) {
        return {
            text: `🇬🇧 *לונדון*\n\nקלאסית ומדהימה!\n\n🌡️ הזמן הטוב: מאי-ספט\n✨ חובה: ביג בן, מגדל לונדון, ווסט אנד\n🫖 תה של אחר הצהריים!\n\nרוצים הצעת מחיר? 😊`,
            forwardToOwner: true
        };
    }

    if (/וייטנאם|vietnam|האנוי|hanoi/i.test(text)) {
        return {
            text: `🌴 *וייטנאם*\n\nאקזוטית ומרגשת!\n\n🌡️ הזמן הטוב: פבר-אפר, אוק-דצמ\n✨ חובה: הא לונג ביי, האנוי, מקונג\n🍜 אוכל רחוב מהטובים בעולם!\n\nרוצים שאתכנן מסלול? 🗺️`,
            forwardToOwner: true
        };
    }

    // Thanks
    if (/תודה|thanks|thank you/i.test(text)) {
        return {
            text: `בשמחה! 🌸\n\nאני תמיד כאן בשבילכם.\nTravel By Petal — איתכם בכל צעד בדרך! ✈️\n\nאתר: https://matanm98.github.io/TravelByPetal/`,
            forwardToOwner: false
        };
    }

    // About / who
    if (/מי את|על פטל|מה זה|about/i.test(text)) {
        return {
            text: `🌸 *Travel By Petal*\n\nאני פטל, סוכנת נסיעות מרעננה 🇮🇱\n\nכולם יכולים להזמין באינטרנט — אבל כשמשהו משתבש, צריכים סוכנת אמיתית! 💪\n\nאני מציעה:\n1️⃣ הזמנות א-לה קארט (טיסות, מלונות, סיורים...)\n2️⃣ תכנון מסלול מלא יום אחרי יום\n\n⭐ 5.0 בגוגל | 24/7 זמינה\n🌐 https://matanm98.github.io/TravelByPetal/`,
            forwardToOwner: false
        };
    }

    // Default / complex question - forward to owner
    return {
        text: `${greeting}תודה על ההודעה! 🌸\n\nקיבלתי את השאלה שלכם ואחזור אליכם בהקדם עם תשובה מפורטת.\n\nבינתיים, אפשר:\n• לעיין באתר שלנו: https://matanm98.github.io/TravelByPetal/\n• למלא טופס בקשה: https://matanm98.github.io/TravelByPetal/#trip-form\n\nTravel By Petal — איתכם בכל צעד! ✈️`,
        forwardToOwner: true
    };
}

// === SEND MESSAGE VIA WHATSAPP API ===
async function sendMessage(to, response) {
    const text = typeof response === 'string' ? response : response.text;

    try {
        const res = await fetch(
            `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'text',
                    text: { body: text }
                })
            }
        );

        const data = await res.json();
        if (!res.ok) {
            console.error('WhatsApp API error:', data);
        } else {
            console.log('Message sent to', to);
        }
    } catch (err) {
        console.error('Failed to send message:', err);
    }
}

// === HEALTH CHECK ===
app.get('/', (req, res) => {
    res.send('Travel By Petal WhatsApp Bot is running! 🌸✈️');
});

// === START SERVER ===
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`WhatsApp bot running on port ${PORT}`);
});
