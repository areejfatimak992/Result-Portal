
let students = JSON.parse(localStorage.getItem("students")) || [];

function saveToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

function getGrade(percentage)
 {
  if(percentage>=80)return "A+";
  if(percentage>=70)return "A";
  if(percentage>=60)return "B";
  if(percentage>=50)return "C";
  if(percentage>=40)return "D";
  return "F";
}

const studentForm=document.getElementById("studentForm");
if(studentForm) 
  {
  const nameSelect=document.getElementById("studentName");
  const newNameInput=document.getElementById("newStudentName");
  const rollInput=document.getElementById("studentRoll");
  const classInput=document.getElementById("studentClass");
  const selectStudentForMarks=document.getElementById("selectStudentForMarks");

  loadStudentDropdown();

  studentForm.addEventListener("submit",(e)=>{
    e.preventDefault();
       debugger
    const name=
      newNameInput.value.trim()||nameSelect.value.trim();
    const roll=rollInput.value.trim();
    const studentClass=classInput.value.trim();

    if(!name||!roll||!studentClass) 
      {
      alert("Please fill all fields!");
      return;
    }

    const exists=students.some((s)=>s.roll===roll);
    if (exists)
       {
      alert("Student with this roll number already exists!");
      return;
    }

    const newStudent={
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

  document.getElementById("clearStudent").addEventListener("click",()=>{
    studentForm.reset();
  });
}

//dropdown
function loadStudentDropdown() {
  const dropdowns=[
    document.getElementById("studentName"),
    document.getElementById("selectStudentForMarks")
  ];

  dropdowns.forEach((dropdown)=> {
    if(!dropdown)
      return;
    dropdown.innerHTML='<option value="">-- Select student --</option>';
    students.forEach((s)=>{
      const opt=document.createElement("option");
      opt.value=s.roll;//name(roll:5)
      opt.textContent=`${s.name} (Roll: ${s.roll})`;
      dropdown.appendChild(opt);
    });
  });
}


const saveMarksBtn=document.getElementById("saveMarksBtn");
if(saveMarksBtn) 
  {
  saveMarksBtn.addEventListener("click",()=>{
    const roll=document.getElementById("selectStudentForMarks").value;

    if(!roll)
      {
      alert("Please select a student!");
      return;
    }

    const subjects = ["English", "Urdu", "Math", "Science", "Islamiyat"];
    const marks = {};
    for(let subject of subjects) {
      const mark = parseInt(prompt(`Enter marks for ${subject} (0-100):`));
      if(isNaN(mark)||mark<0||mark>100) {
        alert("Invalid marks entered. Operation cancelled.");
        return;
        
      }
      marks[subject] = mark;

    }
const clearMarksBtn = document.getElementById("clearMarks");
if (clearMarksBtn) {
  clearMarksBtn.addEventListener("click", () => {
    document.getElementById("selectStudentForMarks").value = "";
    document.getElementById("subjectName").value = "";
    document.getElementById("marksInput").value = "";

    //alert("Form cleared! You can now enter marks for another student.");
  });
}

    const student = students.find((s) =>s.roll===roll);
    if(!student)
       return;

    student.marks = marks;
    student.total = Object.values(marks).reduce((a, b) => a + b, 0);
    student.percentage = (student.total / 500) * 100;
    student.grade = getGrade(student.percentage);

    saveToLocalStorage();
    alert(` Marks added successfully for ${student.name}!`);
    clearMarksForm();
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

  students.forEach((s)=>{
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
    `;
    tbody.appendChild(row);
  });
}


//student list pick code from last project
const studentTable=document.getElementById("studentTable");
if(studentTable) 
renderStudentList();

function renderStudentList() {
  const tbody=studentTable.querySelector("tbody");
  tbody.innerHTML = "";

  students.forEach((s,index)=>{
    const row=document.createElement("tr");
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
  if(confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    saveToLocalStorage();
    renderStudentList();
  }
}



const resultsTable = document.getElementById("allResultsTable");
if(resultsTable) 
renderResultsTable();

function renderResultsTable(filtered = null) {
  const tbody=resultsTable.querySelector("tbody");
  tbody.innerHTML="";
  const dataToRender=filtered||students;

  dataToRender.sort((a, b)=>b.percentage - a.percentage);

  dataToRender.forEach((s)=>{
    const row=document.createElement("tr");
    row.innerHTML= `
      <td>${s.name}</td>
      <td>${s.roll}</td>
      <td>${s.class}</td>
      <td>${s.total}</td>
      <td>${s.percentage.toFixed(2)}%</td>
      <td>${s.grade}</td>
    `;
    tbody.appendChild(row);
  });
}

const searchForm=document.getElementById("searchForm");
if(searchForm) 
  {
  searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const query=document.getElementById("searchInput").value.toLowerCase();
    const filtered=students.filter((s) =>
        s.name.toLowerCase().includes(query)||s.roll.toLowerCase().includes(query)
    );
    renderResultsTable(filtered);
  });

  document.getElementById("clearSearch").addEventListener("click",()=>{
    document.getElementById("searchInput").value= "";
    renderResultsTable();
  });
}
