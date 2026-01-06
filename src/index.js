const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// --- 1. CONFIGURATION ---
const PORT = process.env.PORT || 3000;
const FIREBASE_CREDENTIALS_PATH = process.env.FIREBASE_CREDENTIALS || '/app/key.json';

// --- 2. INITIALIZE FIREBASE ---
try {
    // We assume the key file is mounted at runtime
    const serviceAccount = require(FIREBASE_CREDENTIALS_PATH);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Connected to Firebase");
} catch (error) {
    console.error("❌ Failed to connect to Firebase. Did you mount the key.json?", error.message);
    process.exit(1); 
}

const db = admin.firestore();

// --- 3. THE WEBHOOK (LISTENER) ---
app.post('/webhook/salesforce', async (req, res) => {
    const data = req.body;
    console.log(`📥 Received Salesforce Update for ID: ${data.id}`);

    // SECURITY: In Production, check a shared secret here!
    // if (req.headers['x-infrablade-secret'] !== process.env.SECRET) return res.sendStatus(403);

    try {
        // --- 4. THE SYNC LOGIC ---
        // We write to a collection called 'salesforce_contacts'
        await db.collection('salesforce_contacts').doc(data.id).set({
            ...data, // Copy all fields from Salesforce
            _lastSyncedAt: admin.firestore.FieldValue.serverTimestamp(),
            _source: 'infrablade-sync'
        }, { merge: true });

        console.log(`✅ Synced ${data.id} to Firestore`);
        res.status(200).send({ success: true });

    } catch (error) {
        console.error("❌ Sync Error:", error);
        res.status(500).send({ error: error.message });
    }
});

// --- 5. HEALTH CHECK ---
app.get('/', (req, res) => res.send('Infrablade Sync Engine is Running 🟢'));

app.listen(PORT, () => {
    console.log(`🚀 Infrablade Engine listening on port ${PORT}`);
});