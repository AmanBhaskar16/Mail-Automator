# Cold Mail Sender (MERN)

Fill in HR name, company name and HR email, pick a template, and the mail goes out from your own Gmail
with `{{hrName}}` and `{{companyName}}` filled in.

## Setup

1. **Gmail App Password**: turn on 2-Step Verification on your Google account, then create one at
   https://myaccount.google.com/apppasswords. You get a 16-character password.
2. **Server config**:
   ```bash
   cd server
   cp .env.example .env   # then fill GMAIL_USER, GMAIL_APP_PASSWORD, SENDER_NAME (and optionally RESUME_PATH)
   ```
3. **MongoDB**: run it locally (`brew services start mongodb-community`) or put an Atlas URI in `MONGO_URI`.

## Run

```bash
# terminal 1
cd server && npm install && npm run dev

# terminal 2
cd client && npm install && npm run dev
```

Open http://localhost:5173.

Six starter templates (Frontend, Backend, Full Stack, SDE, Internship, Referral) are created the first
time the server starts. Edit them or add your own under **Manage Templates**.

Placeholders you can use in subject and body: `{{hrName}}`, `{{companyName}}`, `{{senderName}}`.
