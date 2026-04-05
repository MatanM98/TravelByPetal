# WhatsApp Bot Setup Guide - Travel By Petal

## Step 1: Create Meta Developer Account (5 min)

1. Go to https://developers.facebook.com/
2. Click "Get Started" and log in with your Facebook account
3. Accept the developer terms

## Step 2: Create a Meta App (3 min)

1. Go to https://developers.facebook.com/apps/
2. Click "Create App"
3. Select "Business" type
4. Name it: "Travel By Petal Bot"
5. Click "Create App"

## Step 3: Add WhatsApp to Your App (2 min)

1. In your app dashboard, scroll to "Add Products"
2. Find "WhatsApp" and click "Set Up"
3. You'll see a test phone number and a temporary access token
4. **COPY these values:**
   - **Phone Number ID** (looks like: 123456789012345)
   - **Temporary Access Token** (long string starting with EAA...)

## Step 4: Deploy Bot to Render.com (5 min) - FREE

1. Go to https://render.com/ and sign up (free, no credit card)
2. Click "New" > "Web Service"
3. Connect your GitHub account
4. Select the "TravelByPetal" repository
5. Configure:
   - **Name:** travel-by-petal-bot
   - **Root Directory:** whatsapp-bot
   - **Runtime:** Node
   - **Build Command:** npm install
   - **Start Command:** npm start
   - **Instance Type:** Free
6. Add Environment Variables (click "Environment"):
   - `VERIFY_TOKEN` = `travelbypetal2026`
   - `WHATSAPP_TOKEN` = (paste your token from Step 3)
   - `PHONE_NUMBER_ID` = (paste your phone number ID from Step 3)
7. Click "Create Web Service"
8. Wait for it to deploy (2-3 minutes)
9. **Copy your Render URL** (looks like: https://travel-by-petal-bot.onrender.com)

## Step 5: Connect WhatsApp Webhook (2 min)

1. Go back to Meta Developer Dashboard > WhatsApp > Configuration
2. Under "Webhook", click "Edit"
3. **Callback URL:** `https://your-render-url.onrender.com/webhook`
4. **Verify Token:** `travelbypetal2026`
5. Click "Verify and Save"
6. Under "Webhook Fields", subscribe to: `messages`

## Step 6: Test It!

1. Open WhatsApp on your phone
2. Send "שלום" to the test number shown in Meta dashboard
3. You should get an auto-reply!

## Step 7: Connect Your Real Number (Optional)

To use your real number (054-558-1269):
1. Go to WhatsApp > Getting Started > Add Phone Number
2. Follow the verification process
3. Update the PHONE_NUMBER_ID in Render environment variables

## Notes

- Free tier: 1,000 conversations/month (plenty for starting out)
- Temporary token expires in 24 hours - create a permanent one:
  Meta Dashboard > WhatsApp > API Setup > Generate Permanent Token
- Bot forwards complex questions to your number automatically
- Bot runs 24/7 on Render (free tier may sleep after 15 min idle, wakes on message)
