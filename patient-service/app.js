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
    // 🔁 Fallback to ConfigMap
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

const PatientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    disease: String,
    dob: { type: String, default: "" },
    email: { type: String, default: "" }
});

const Patient = mongoose.model('Patient', PatientSchema);

// ================= CREATE PATIENT =================

app.post('/patients', async (req, res) => {
    try {
        const patient = new Patient({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender || "",
            disease: req.body.disease || "",
            dob: req.body.dob || "",
            email: req.body.email || ""
        });

        await patient.save();
        res.send(patient);

    } catch (err) {
        console.error("❌ CREATE ERROR:", err.message);
        res.status(500).send({ error: "Failed to save patient" });
    }
});

// ================= GET PATIENTS =================

app.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.send(patients);
    } catch (err) {
        console.error("❌ FETCH ERROR:", err.message);
        res.status(500).send({ error: "Failed to fetch patients" });
    }
});

// ================= HEALTH CHECK (VERY IMPORTANT) =================

app.get('/health', (req, res) => {
    res.status(200).send("OK");
});

// ================= START SERVER =================

app.listen(3000, () => {
    console.log('🚀 Patient Service running on port 3000');
});
