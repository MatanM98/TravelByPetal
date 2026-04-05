// Travel By Petal — AI Chatbot Edge Function
// Uses Google Gemini API (free tier)
// Deploy: supabase functions deploy chat
// Set secret: supabase secrets set GEMINI_API_KEY=your_key

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are Petal (פטל), the AI travel assistant for Travel By Petal, a boutique travel agency in Ra'anana, Israel.

ABOUT YOU:
- You are warm, professional, and enthusiastic about travel
- You speak both Hebrew and English fluently
- Respond in the same language the user writes in
- Keep responses concise (2-4 sentences max)

SERVICES YOU OFFER:
1. A La Carte Booking: flights, hotels, airport transfers, trains, cruises, restaurants, guided tours, excursions, car rental
2. Full Itinerary Planning: complete day-by-day trip planning with all logistics handled

POPULAR DESTINATIONS: Dubai, India, Athens, Rome, Barcelona, London, Vietnam

CONTACT: WhatsApp 054-558-1269
HOURS: Sun-Thu 9:00-18:00, Fri 9:00-13:00
WEBSITE: https://matanm98.github.io/TravelByPetal/

RULES:
- NEVER invent specific prices — say "prices vary by dates and preferences" and offer to get a personalized quote
- For complex booking requests, suggest filling out the trip form on the website or chatting on WhatsApp
- Be helpful, friendly, and make the customer feel excited about their trip
- If asked about something you don't know, suggest contacting Petal directly on WhatsApp
- You can recommend destinations based on preferences (budget, climate, travel style)
- Always end with a call-to-action (fill out form, chat on WhatsApp, or ask another question)`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, history = [], lang = "he" } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "No message provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!GEMINI_API_KEY) {
      // No API key — return a fallback response
      const fallback = lang === "he"
        ? "אני כאן לעזור! לצ'אט מפורט יותר, דברו איתנו בוואטסאפ: 054-558-1269"
        : "I'm here to help! For a more detailed chat, reach us on WhatsApp: 054-558-1269";
      return new Response(
        JSON.stringify({ reply: fallback, fallback: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build conversation for Gemini
    const contents = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model", parts: [{ text: "Understood! I am Petal, the travel assistant. I'll help customers plan their perfect trips." }] },
    ];

    // Add conversation history
    for (const msg of history.slice(-8)) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }

    // Add current message
    contents.push({ role: "user", parts: [{ text: message }] });

    // Call Gemini API
    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
          topP: 0.9,
        },
      }),
    });

    if (!geminiRes.ok) {
      throw new Error(`Gemini API error: ${geminiRes.status}`);
    }

    const geminiData = await geminiRes.json();
    const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!reply) {
      throw new Error("Empty Gemini response");
    }

    return new Response(
      JSON.stringify({ reply, ai: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat function error:", error);

    // Graceful fallback
    const fallbackMsg = "תודה על ההודעה! אחזור אליכם בהקדם. בינתיים, אפשר ליצור קשר בוואטסאפ: 054-558-1269";
    return new Response(
      JSON.stringify({ reply: fallbackMsg, fallback: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
