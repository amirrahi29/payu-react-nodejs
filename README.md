# PayU Demo Project

This workspace contains a simple React frontend and Node.js backend demonstrating a PayU payment integration with a dummy product.

## Overview

- **frontend/**: React application served on port 3000 using Parcel
- **backend/**: Express server on port 8080 that generates PayU transaction hash and returns a form to submit to PayU

> ⚠️ You need to provide your PayU credentials (key and salt) in the backend `.env` file.

## Getting started

1. **Backend setup**

   ```bash
   cd backend
   cp .env.example .env
   # edit .env to add your PAYU_KEY and PAYU_SALT
   # these are mandatory; the server will refuse to start if they are missing or empty
   npm install
   npm run dev    # or npm start
   ```

2. **Frontend setup**

   ```bash
   cd frontend
   npm install
   npm run start
   ```

3. Open your browser at `http://localhost:3000` and click the *Buy Now* button. After submitting you’ll be taken to PayU’s sandbox UI; use the **simulated success** or **failure** links they provide to continue the flow.

4. When PayU redirects back you should land on `/payment-success` or `/payment-failure`. Each page now fetches the most recent callback data from the backend so you can verify what PayU sent to your server.

   - The backend also exposes `/api/last` (returns the last PayU payload) and `/api/debug` (shows your current key and base URL).
   - You can manually visit `/payment-success` or `/payment-failure` using the links on the home page if you just want to view those screens directly.
   - If no callback data is shown, use the "Simulate Callback" button on the success/failure pages to test the backend integration.

5. If you configure PayU to POST to `/api/payment-callback`, the server will log the payload and store it in memory so the frontend can display it. This mimics a real webhook/notification handler.

6. When switching to production, change `PAYU_BASE_URL` to `https://secure.payu.in/_payment` and use your live credentials. Be sure to update the redirect URLs accordingly (they’ll need to be reachable by PayU).

## Customization

- Change the dummy product parameters in `frontend/src/App.jsx`.
- Update redirect URLs and PayU endpoints in `backend/index.js`.

## Notes

- This example uses the *test* PayU URL by default. Switch to the production URL once you're ready.
- The backend computes the SHA‑512 hash required by PayU.

---

Feel free to expand this template with order persistence, webhook handling, or user authentication.