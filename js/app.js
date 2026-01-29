/* ================= NAVIGATION ================= */
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ================= TIMETABLE ================= */
let timetable = JSON.parse(localStorage.getItem("timetable")) || [];

function addTimetable() {
  const name = document.getElementById("courseName").value.trim();
  const day = document.getElementById("courseDay").value.trim();
  const time = document.getElementById("courseTime").value.trim();
  if(!name || !day || !time) return;

  timetable.push({name, day, time});
  localStorage.setItem("timetable", JSON.stringify(timetable));

  document.getElementById("courseName").value="";
  document.getElementById("courseDay").value="";
  document.getElementById("courseTime").value="";

  renderTimetable();
}

function renderTimetable() {
  const tbody = document.getElementById("timetableBody");
  tbody.innerHTML="";
  timetable.forEach((c,i)=>{
    tbody.innerHTML+=`<tr class="timetable-card">
      <td>${c.name}</td>
      <td>${c.day}</td>
      <td>${c.time}</td>
      <td><button onclick="deleteTimetable(${i})">❌</button></td>
    </tr>`;
  });
}

function deleteTimetable(i){
  timetable.splice(i,1);
  localStorage.setItem("timetable",JSON.stringify(timetable));
  renderTimetable();
}

renderTimetable();

/* ================= NOTES ================= */
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNote() {
  const course=document.getElementById("noteCourse").value.trim();
  const title=document.getElementById("noteTitle").value.trim();
  const content=document.getElementById("noteContent").value.trim();
  if(!course||!title||!content) return;

  notes.push({course,title,content});
  localStorage.setItem("notes",JSON.stringify(notes));

  document.getElementById("noteCourse").value="";
  document.getElementById("noteTitle").value="";
  document.getElementById("noteContent").value="";

  renderNotes();
}

function renderNotes(){
  const list=document.getElementById("notesList");
  list.innerHTML="";
  notes.forEach((n,i)=>{
    list.innerHTML=`<li>
      <small style="color:#2563eb;font-weight:bold;">${n.course}</small><br>
      <strong>${n.title}</strong><br>${n.content}<br>
      <button onclick="deleteNote(${i})">🗑 Delete</button>
    </li>`+list.innerHTML;
  });
}

function deleteNote(i){
  notes.splice(i,1);
  localStorage.setItem("notes",JSON.stringify(notes));
  renderNotes();
}

renderNotes();

/* ================= GPA ================= */
let gpaCourses=[];
function addResult(){
  const score=Number(document.getElementById("score").value);
  const unit=Number(document.getElementById("unit").value);
  if(!score||!unit) return;

  let gp=score>=70?5:score>=60?4:score>=50?3:score>=45?2:score>=40?1:0;
  gpaCourses.push({score,unit,gp});
  document.getElementById("score").value="";
  document.getElementById("unit").value="";
  renderGPA();
}

function renderGPA(){
  const list=document.getElementById("gpaList");
  list.innerHTML="";
  let totalPoints=0,totalUnits=0;
  gpaCourses.forEach((c,i)=>{
    totalPoints+=c.gp*c.unit;
    totalUnits+=c.unit;
    list.innerHTML+=`<li>
      Score: ${c.score}, Unit: ${c.unit}, GP: ${c.gp} 
      <button onclick="deleteGPA(${i})">❌</button>
    </li>`;
  });
  const cgpa=totalUnits===0?"0.00":(totalPoints/totalUnits).toFixed(2);
  document.getElementById("gpaResult").innerText="CGPA: "+cgpa;
}

function deleteGPA(i){ gpaCourses.splice(i,1); renderGPA(); }

/* ================= EXPENSES ================= */
let expenses=[];
function addExpense(){
  const item=document.getElementById("expenseItem").value.trim();
  const amount=Number(document.getElementById("expenseAmount").value);
  const date=document.getElementById("expenseDate").value;
  if(!item||!amount||!date) return;

  expenses.push({item,amount,date});
  document.getElementById("expenseItem").value="";
  document.getElementById("expenseAmount").value="";
  document.getElementById("expenseDate").value="";
  renderExpenses();
}

function renderExpenses(){
  const tbody=document.getElementById("expenseBody");
  tbody.innerHTML="";
  let total=0;
  expenses.forEach((e,i)=>{
    total+=e.amount;
    tbody.innerHTML+=`<tr class="timetable-card">
      <td>${e.item}</td>
      <td>₦${e.amount}</td>
      <td>${e.date}</td>
      <td><button onclick="deleteExpense(${i})">❌</button></td>
    </tr>`;
  });
  document.getElementById("expenseTotal").innerText="₦"+total;
}

function deleteExpense(i){
  expenses.splice(i,1);
  renderExpenses();
}

renderExpenses();

/* ================= BUTTON ANIMATION ================= */
document.querySelectorAll("button").forEach(btn=>{
  btn.addEventListener("click",()=>{ btn.style.transform="scale(0.95)";
    setTimeout(()=>btn.style.transform="scale(1)",120);
  });
});

/* ================= DARK MODE ================= */
document.addEventListener("DOMContentLoaded",()=>{
  const darkModeToggle=document.getElementById("darkModeToggle");
  if(localStorage.getItem("darkMode")==="enabled"){
    document.body.classList.add("dark-mode");
    darkModeToggle.innerText="☀️ Light Mode";
  }
  darkModeToggle.addEventListener("click",()=>{
    document.body.classList.toggle("dark-mode");
    if(document.body.classList.contains("dark-mode")){
      darkModeToggle.innerText="☀️ Light Mode";
      localStorage.setItem("darkMode","enabled");
    }else{
      darkModeToggle.innerText="🌙 Dark Mode";
      localStorage.setItem("darkMode","disabled");
    }
  });
});

/* ================= PWA SERVICE WORKER ================= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js")
      .then(reg => console.log("Service Worker registered:", reg))
      .catch(err => console.log("Service Worker registration failed:", err));
  });
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement('button');
  installBtn.innerText = '📲 Install UniPA';
  installBtn.style.position = 'fixed';
  installBtn.style.bottom = '20px';
  installBtn.style.right = '20px';
  installBtn.style.padding = '12px 18px';
  installBtn.style.border = 'none';
  installBtn.style.borderRadius = '10px';
  installBtn.style.background = '#2563eb';
  installBtn.style.color = 'white';
  installBtn.style.fontSize = '1rem';
  installBtn.style.cursor = 'pointer';
  installBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  document.body.appendChild(installBtn);

  installBtn.addEventListener('click', async () => {
    installBtn.remove();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User choice:', outcome);
    deferredPrompt = null;
  });
});