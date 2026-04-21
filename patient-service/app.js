const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// DB Connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/hmis', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// ✅ UPDATED SCHEMA (ADD EMAIL HERE)
const PatientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    disease: String,
    dob: { type: String, default: "" },
    email: { type: String, default: "" }   // ✅ NEW FIELD
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
            email: req.body.email || ""   // ✅ SAVE EMAIL
        });

        await patient.save();
        res.send(patient);

    } catch (err) {
        console.error("CREATE ERROR:", err);
        res.status(500).send({ error: "Failed to save patient" });
    }
});

// ================= GET PATIENTS =================
app.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.send(patients);
    } catch (err) {
        console.error("FETCH ERROR:", err);
        res.status(500).send({ error: "Failed to fetch patients" });
    }
});

app.listen(3000, () => console.log('Patient Service running on port 3000'));
