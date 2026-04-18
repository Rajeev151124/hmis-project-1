const BASE = "";

// Navigation
function showPatient() {
  document.getElementById("patientScreen").style.display = "block";
  document.getElementById("visitScreen").style.display = "none";
  loadPatients();
}

function showVisit() {
  document.getElementById("patientScreen").style.display = "none";
  document.getElementById("visitScreen").style.display = "block";
  loadPatientDropdown();
  loadVisits();
}

// ================= PATIENT =================

// Add Patient
async function addPatient() {
  try {
    const data = {
      name: document.getElementById("pname").value,
      age: document.getElementById("page").value,
      gender: document.getElementById("pgender").value,
      disease: document.getElementById("pdisease").value,
      dob: document.getElementById("pdob").value   // ✅ NEW
    };

    const res = await fetch(`/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    console.log("Patient Response:", result);

    if (!res.ok) {
      throw new Error(result.error || "Failed");
    }

    alert("Patient Saved ✅");

    // Clear fields
    document.getElementById("pname").value = "";
    document.getElementById("page").value = "";
    document.getElementById("pgender").value = "";
    document.getElementById("pdisease").value = "";
    document.getElementById("pdob").value = "";   // ✅ clear DOB

    loadPatients();

  } catch (err) {
    console.error("FULL ERROR:", err);
    alert("Error saving patient ❌");
  }
}

// Load Patients
async function loadPatients() {
  try {
    const res = await fetch(`/patients`);
    const data = await res.json();

    const table = document.getElementById("patientTable");
    table.innerHTML = "";

    data.forEach(p => {
      table.innerHTML += `
        <tr>
          <td>${p._id}</td>
          <td>${p.name}</td>
          <td>${p.age}</td>
          <td>${p.gender}</td>
          <td>${p.disease || ""}</td>
          <td>${p.dob || ""}</td> <!-- ✅ SHOW DOB -->
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
  }
}

// ================= VISIT =================

// Dropdown
async function loadPatientDropdown() {
  const res = await fetch(`/patients`);
  const data = await res.json();

  const dropdown = document.getElementById("vpatientId");
  dropdown.innerHTML = '<option value="">Select Patient</option>';

  data.forEach(p => {
    dropdown.innerHTML += `
      <option value="${p._id}">
        ${p.name}
      </option>
    `;
  });
}

// Add Visit
async function addVisit() {
  try {
    const patientId = document.getElementById("vpatientId").value;

    if (!patientId) {
      alert("Select patient");
      return;
    }

    const data = {
      patientId,
      doctor: document.getElementById("vdoctor").value,
      date: document.getElementById("vdate").value
    };

    const res = await fetch(`/visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    console.log("Visit Response:", result);

    if (!res.ok) {
      throw new Error(result.error || "Failed");
    }

    alert("Visit Saved ✅");

    document.getElementById("vdoctor").value = "";
    document.getElementById("vdate").value = "";

    loadVisits();

  } catch (err) {
    console.error("FULL ERROR:", err);
    alert("Error saving visit ❌");
  }
}

// Load Visits
async function loadVisits() {
  const [visitRes, patientRes] = await Promise.all([
    fetch(`/visits`),
    fetch(`/patients`)
  ]);

  const visits = await visitRes.json();
  const patients = await patientRes.json();

  const map = {};
  patients.forEach(p => map[p._id] = p.name);

  const table = document.getElementById("visitTable");
  table.innerHTML = "";

  visits.forEach(v => {
    table.innerHTML += `
      <tr>
        <td>${map[v.patientId] || v.patientId}</td>
        <td>${v.doctor}</td>
        <td>${v.date}</td>
      </tr>
    `;
  });
}

// Initial load
window.onload = showPatient;
