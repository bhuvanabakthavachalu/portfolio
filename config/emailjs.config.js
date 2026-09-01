/* ============================================================
   EmailJS Configuration — Bhuvaneshwari B. Portfolio
   ============================================================
   HOW TO SET UP:
   1. Go to https://www.emailjs.com/ and create a free account.
   2. Add an Email Service (Gmail recommended):
      - Dashboard → Email Services → Add New Service → Gmail
      - Authorise your Gmail account (bhuvanabakthavachalu@gmail.com)
      - Copy the Service ID shown (e.g. "service_xxxxxxx")
   3. Create an Email Template:
      - Dashboard → Email Templates → Create New Template
      - Use these template variables (they map to the form fields):
          {{from_name}}     — sender's full name
          {{from_email}}    — sender's email address
          {{phone}}         — sender's phone number
          {{company}}       — sender's company / organisation
          {{reason}}        — reason for reaching out
          {{message}}       — the message body
          {{to_name}}       — recipient name (Bhuvaneshwari)
      - Example "To Email" field value: bhuvanabakthavachalu@gmail.com
      - Copy the Template ID shown (e.g. "template_xxxxxxx")
   4. Get your Public Key:
      - Dashboard → Account → General → Public Key
      - Copy the key (e.g. "XXXXXXXXXXXXXXXXXXXXXX")
   5. Replace the three placeholder strings below with your real values.
   ============================================================ */

const EMAILJS_CONFIG = {
   SERVICE_ID: 'service_9fdsr5d',    // e.g. 'service_abc1234'
   TEMPLATE_ID: 'template_wxlggha',  // e.g. 'template_xyz5678'
   PUBLIC_KEY: 'nfHZg5nW6jN9Z07TW',   // e.g. 'AbCdEfGhIjKlMnOpQrSt'
};
