
let students = JSON.parse(localStorage.getItem("students")) || [];

function saveToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

function getGrade(percentage) {
  if (percentage >= 80) return "A+";
  if (percentage >= 70) return "A";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
}

const studentForm = document.getElementById("studentForm");
if (studentForm) {
  const nameSelect = document.getElementById("studentName");
  const newNameInput = document.getElementById("newStudentName");
  const rollInput = document.getElementById("studentRoll");
  const classInput = document.getElementById("studentClass");
  const selectStudentForMarks = document.getElementById("selectStudentForMarks");

  loadStudentDropdown();

  studentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    debugger
    // Restrict name input to alphabets only
    const newNameInput = document.getElementById("newStudentName");
    if (newNameInput) {
      newNameInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^A-Za-z\s]/g, ""); // remove non-letters
      });
    }

    const name =
      (newNameInput.value.trim() || nameSelect.value.trim()).toUpperCase();
    const roll = rollInput.value.trim();
    const studentClass = classInput.value.trim();

    if (!name || !roll || !studentClass) {
      alert("Please fill all fields!");
      return;
    }

    const exists = students.some((s) => s.roll === roll);
    if (exists) {
      alert("Student with this roll number already exists!");
      return;
    }

    const newStudent = {
      name,
      roll,
      class: studentClass,
      marks: { English: null, Urdu: null, Math: null, Science: null, Islamiyat: null },
      total: 0,
      percentage: 0,
      grade: "-"
    };

    students.push(newStudent);
    saveToLocalStorage();
    loadStudentDropdown();

    alert("Student saved successfully!");
    studentForm.reset();
  });

  document.getElementById("clearStudent").addEventListener("click", () => {
    studentForm.reset();
  });
}

//dropdown
function loadStudentDropdown() {
  const dropdowns = [
    document.getElementById("studentName"),
    document.getElementById("selectStudentForMarks")
  ];

  dropdowns.forEach((dropdown) => {
    if (!dropdown)
      return;
    dropdown.innerHTML = '<option value="">-- Select student --</option>';
    students.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.roll;//name(roll:5)
      opt.textContent = `${s.name} (Roll: ${s.roll})`;
      dropdown.appendChild(opt);
    });
  });
}

const saveMarksBtn = document.getElementById("saveMarksBtn");

if (saveMarksBtn) {
  saveMarksBtn.addEventListener("click", () => {
    const roll = document.getElementById("selectStudentForMarks").value;
    const subjectField = document.getElementById("subjectName");
    const marksField = document.getElementById("marksInput");

    if (!roll) {
      alert("Please select a student!");
      return;
    }

    let student = students.find((s) => s.roll === roll);
    if (!student) {
      alert("Student not found!");
      return;
    }

    student.marks = { English: null, Urdu: null, Math: null, Science: null, Islamiyat: null };

    const subjects = ["English", "Urdu", "Math", "Science", "Islamiyat"];
    const manualSubject = subjectField.value.trim();
    const manualMark = parseInt(marksField.value);

    if (manualSubject && !isNaN(manualMark)) {
      student.marks[manualSubject] = manualMark;
    } else {
      alert("Please enter valid subject and marks!");
      return;
    }

    for (let subject of subjects) {
      if (subject === manualSubject) continue;

      const mark = parseInt(prompt(`Enter marks for ${subject} (0–100):`));
      if (isNaN(mark) || mark < 0 || mark > 100) {
        alert("Invalid marks entered. Operation cancelled.");
        return;
      }
      student.marks[subject] = mark;
    }

    student.total = Object.values(student.marks)
      .filter((m) => typeof m === "number")
      .reduce((a, b) => a + b, 0);

    student.percentage = (student.total / 500) * 100;
    student.grade = getGrade(student.percentage);

    saveToLocalStorage();
    alert(`Marks added successfully for ${student.name}!`);

    subjectField.value = "";
    marksField.value = "";
    document.getElementById("selectStudentForMarks").value = "";
  });
}


function clearMarksForm() {
  document.getElementById("selectStudentForMarks").value = "";
  const subjectField = document.getElementById("subjectName");
  const marksField = document.getElementById("marksInput");

  if (subjectField) subjectField.value = "";
  if (marksField) marksField.value = "";
}



const displayTable = document.getElementById("displayTable");
if (displayTable)
  renderDisplayTable();


function renderDisplayTable() {
  const tbody = displayTable.querySelector("tbody");
  tbody.innerHTML = "";

  students.forEach((s,index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.name}</td>
      <td>${s.roll}</td>
      <td>${s.class}</td>
      <td>${s.marks.English ?? "-"}</td>
      <td>${s.marks.Urdu ?? "-"}</td>
      <td>${s.marks.Math ?? "-"}</td>
      <td>${s.marks.Science ?? "-"}</td>
      <td>${s.marks.Islamiyat ?? "-"}</td>
      <td>${s.total}</td>
      <td>${s.percentage.toFixed(2)}%</td>
      <td>${s.grade}</td>
      <td>
         <button class="edit-btn" data-index="${index}" title="Edit Marks">
         <i class="fa-solid fa-pen-to-square"></i>
         </button>
      </td>
    `;
    tbody.appendChild(row);
  });
   document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.currentTarget.dataset.index;
      editMarks(index);
    });
  });
function editMarks(index) {
  const student = students[index];
  if (!student) return;

  const subjects = ["English", "Urdu", "Math", "Science", "Islamiyat"];

  alert(`Editing marks for ${student.name}`);

  subjects.forEach((subject) => {
    const currentMark = student.marks[subject] ?? "";
    const newMark = prompt(`Enter new marks for ${subject} (0–100):`, currentMark);

    if (newMark === null) return; // if user cancels prompt

    const mark = parseInt(newMark);
    if (isNaN(mark) || mark < 0 || mark > 100) {
      alert(`Invalid marks for ${subject}, keeping old value.`);
    } else {
      student.marks[subject] = mark;
    }
  });

  student.total = Object.values(student.marks)
    .filter((m) => typeof m === "number")
    .reduce((a, b) => a + b, 0);

  student.percentage = (student.total / 500) * 100;
  student.grade = getGrade(student.percentage);

  saveToLocalStorage();
  renderDisplayTable(); 
  alert(`Marks updated successfully for ${student.name}!`);
}

}


const studentTable = document.getElementById("studentTable");
if (studentTable)
  renderStudentList();

function renderStudentList() {
  const tbody = studentTable.querySelector("tbody");
  tbody.innerHTML = "";

  students.forEach((s, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.name}</td>
      <td>${s.roll}</td>
      <td>${s.class}</td>
      <td>
        <button class="btn outline" onclick="deleteStudent(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}
function deleteStudent(index) {
  //confirm is built in function that show popup with ok or cancel.
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    saveToLocalStorage();
    renderStudentList();
  }
}



const resultsTable = document.getElementById("allResultsTable");
if (resultsTable)
  renderResultsTable();

function renderResultsTable(filtered = null) {
  const tbody = resultsTable.querySelector("tbody");
  tbody.innerHTML = "";
  const dataToRender = filtered || students;

  dataToRender.sort((a, b) => b.percentage - a.percentage);

  dataToRender.forEach((s) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.name}</td>
      <td>${s.roll}</td>
      <td>${s.class}</td>
      <td>${s.total}</td>
      <td>${s.percentage.toFixed(2)}%</td>
      <td>${s.grade}</td>
      <td>
       <button class="btn reportBtn" data-roll="${s.roll}">Generate Report</button>
<div class="report-options" id="options-${s.roll}" style="display:none; margin-top:5px;">
  <button class="btn small pdfBtn" data-roll="${s.roll}">
        <i class="fa-solid fa-file-pdf" style="color:#d32f2f"></i> PDF
  </button>
  <button class="btn small csvBtn" data-roll="${s.roll}">
    <i class="fa-solid fa-file-csv"></i> CSV
  </button>
</div>

      </td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".reportBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const roll = e.target.dataset.roll;
      const options = document.getElementById(`options-${roll}`);

      options.style.display = options.style.display === "block" ? "none" : "block";
    });
  });
  //pdf button
  document.querySelectorAll(".pdfBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const roll = e.target.dataset.roll;
      generatePDFReport(roll);
    });
  });
  function generatePDFReport(roll) {
    const student = students.find((s) => s.roll === roll);
    if (!student)
      return alert("Student not found!");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 🎓 Title Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("Student Report", 70, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("Result Management Portal", 75, 27);

    // 🧾 Divider Line
    doc.setDrawColor(150);
    doc.line(15, 30, 195, 30);

    // 🧍 Student Information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Student Information", 15, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Name: ${student.name}`, 20, 48);
    doc.text(`Roll No: ${student.roll}`, 20, 55);
    doc.text(`Class: ${student.class}`, 20, 62);

    // ✏️ Subject Marks
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Marks Details", 15, 75);

    let y = 83;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);

    // Table header
    doc.setFillColor(220, 220, 220);
    doc.rect(20, y - 5, 100, 8, "F");
    doc.text("Subject", 25, y);
    doc.text("Marks", 100, y);
    y += 5;

    // Marks rows
    for (let [subject, mark] of Object.entries(student.marks)) {
      y += 8;
      doc.text(subject, 25, y);
      doc.text(`${mark ?? "-"}`, 100, y);
    }

    //  Totals and Grades
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(44, 62, 80);
    doc.text("Summary", 15, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`Total Marks: ${student.total}`, 20, y);
    y += 8;
    doc.text(`Percentage: ${student.percentage.toFixed(2)}%`, 20, y);
    y += 8;
    doc.text(`Grade: ${student.grade}`, 20, y);

    //  Footer
    y += 15;
    doc.setDrawColor(150);
    doc.line(15, y, 195, y);
    y += 10;

    const date = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 15, y);
    doc.text("© Result Management System", 135, y);

    // Save file
    doc.save(`${student.name}_Report.pdf`);
  }



  //CSV
  document.querySelectorAll(".csvBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const roll = e.target.dataset.roll;
      generateCSVReport(roll);
    });
  });
  function generateCSVReport(roll) {
    const student = students.find((s) => s.roll === roll);
    if (!student) {
      alert("Student not found!");
      return;
    }

    // CSV header 
    const headers = [
      "Name",
      "Roll No",
      "Class",
      "English",
      "Urdu",
      "Math",
      "Science",
      "Islamiyat",
      "Total",
      "Percentage",
      "Grade"
    ];

    // CSV row for this student
    const row = [
      student.name,
      student.roll,
      student.class,
      student.marks.English ?? "-",
      student.marks.Urdu ?? "-",
      student.marks.Math ?? "-",
      student.marks.Science ?? "-",
      student.marks.Islamiyat ?? "-",
      student.total,
      `${student.percentage.toFixed(2)}%`,
      student.grade
    ];

    // Combine into CSV string
    const csvContent = [headers.join(","), row.join(",")].join("\n");

    // Create and download file
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${student.name}_Report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}

const searchForm = document.getElementById("searchForm");
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = students.filter((s) =>
      s.name.toLowerCase().includes(query) || s.roll.toLowerCase().includes(query)
    );
    renderResultsTable(filtered);
  });

  document.getElementById("clearSearch").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    renderResultsTable();
  });
}
