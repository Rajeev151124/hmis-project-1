const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/hmis');

// ✅ UPDATED SCHEMA
const PatientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    disease: String,
    dob: { type: String, default: "" }   // ✅ ADD THIS
});

const Patient = mongoose.model('Patient', PatientSchema);

// Create Patient
app.post('/patients', async (req, res) => {
    try {
        const patient = new Patient({
            ...req.body,
            dob: req.body.dob || ""   // ✅ SAFE HANDLING
        });

        await patient.save();
        res.send(patient);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to save patient" });
    }
});

// Get Patients
app.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.send(patients);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch patients" });
    }
});

app.listen(3000, () => console.log('Patient Service running'));
