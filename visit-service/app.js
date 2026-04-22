const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ================= DB CONNECTION =================

// Read env variables
const user = process.env.DB_USER;
const pass = process.env.DB_PASSWORD;
const mongoUrlEnv = process.env.MONGO_URL;

// Build connection string
let mongoURL;

if (user && pass) {
    // 🔐 Auth-enabled connection
    mongoURL = `mongodb://${user}:${pass}@mongo:27017/hmis?authSource=admin`;
    console.log("Using AUTH MongoDB connection");
} else if (mongoUrlEnv) {
    // 🔁 ConfigMap fallback
    mongoURL = mongoUrlEnv;
    console.log("Using ConfigMap MongoDB URL");
} else {
    // 🧪 Local fallback
    mongoURL = 'mongodb://localhost:27017/hmis';
    console.log("Using LOCAL MongoDB");
}

// Connect to MongoDB
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
});

// ================= SCHEMA =================

const VisitSchema = new mongoose.Schema({
    patientId: String,
    doctor: String,
    date: String
});

const Visit = mongoose.model('Visit', VisitSchema);

// ================= CREATE VISIT =================

app.post('/visits', async (req, res) => {
    try {
        const visit = new Visit({
            patientId: req.body.patientId,
            doctor: req.body.doctor,
            date: req.body.date
        });

        await visit.save();
        res.send(visit);

    } catch (err) {
        console.error("❌ CREATE ERROR:", err.message);
        res.status(500).send({ error: "Failed to save visit" });
    }
});

// ================= GET VISITS =================

app.get('/visits', async (req, res) => {
    try {
        const visits = await Visit.find();
        res.send(visits);
    } catch (err) {
        console.error("❌ FETCH ERROR:", err.message);
        res.status(500).send({ error: "Failed to fetch visits" });
    }
});

// ================= HEALTH CHECK =================

app.get('/health', (req, res) => {
    res.status(200).send("OK");
});

// ================= START SERVER =================

app.listen(3001, () => {
    console.log('🚀 Visit Service running on port 3001');
});
