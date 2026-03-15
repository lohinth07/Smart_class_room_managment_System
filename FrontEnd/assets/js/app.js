// Global Application JavaScript
console.log("Smart Classroom Frontend initialized.");

// ----------------------------------------------------
// Authentication Logic
// ----------------------------------------------------
function handleLogin(event) {
    event.preventDefault(); 
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleInput = document.getElementById('role');
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const role = roleInput.value;
    let hasError = false;

    document.querySelectorAll('.input-wrapper').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    if (!username) { document.getElementById('usernameWrapper').classList.add('error'); document.getElementById('usernameError').style.display = 'block'; hasError = true; }
    if (!password) { document.getElementById('passwordWrapper').classList.add('error'); document.getElementById('passwordError').style.display = 'block'; hasError = true; }
    if (!role) { document.getElementById('roleWrapper').classList.add('error'); document.getElementById('roleError').style.display = 'block'; hasError = true; }
    if (hasError) return;

    simulateLoading(document.querySelector('.btn-primary'));
    setTimeout(() => {
        localStorage.setItem('userObj', JSON.stringify({ username: username, role: role }));
        window.location.href = 'dashboard.html';
    }, 1000);
}

function simulateLoading(btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Authenticating...';
    btn.disabled = true;
    setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
}

// ----------------------------------------------------
// Data Initialization & Utilities
// ----------------------------------------------------

function generateId(prefix) {
    return prefix + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

function initData() {
    if(!localStorage.getItem('studentsData')) {
        localStorage.setItem('studentsData', JSON.stringify([
            {id: '#S0001', name: 'John Doe', grade: 'Grade 10 - A', email: 'john@example.com'},
            {id: '#S0002', name: 'Jane Smith', grade: 'Grade 10 - B', email: 'jane@example.com'}
        ]));
    }
    
    if(!localStorage.getItem('teachersData')) {
        localStorage.setItem('teachersData', JSON.stringify([
            {id: '#T0001', name: 'Mr. Wilson Roberts', subject: 'Mathematics', quals: 'B.Sc, B.Ed (Exp: 10 yrs)'},
            {id: '#T0002', name: 'Ms. Sarah Connor', subject: 'Physics', quals: 'M.Sc, M.Ed (Exp: 8 yrs)'}
        ]));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initData();
    initTheme();
    enforceRBAC();
    renderStudents();
    renderTeachers();
});

// ----------------------------------------------------
// Role-Based Access Control (RBAC) Logic
// ----------------------------------------------------
function enforceRBAC() {
    // If not on the login page and not logged in, redirect to login
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    const userJson = localStorage.getItem('userObj');
    
    if(!userJson && !isLoginPage) {
        window.location.href = 'index.html';
        return;
    }
    
    if(userJson) {
        const user = JSON.parse(userJson);
        const role = user.role; // 'admin', 'teacher', 'student'
        const path = window.location.pathname;
        
        // 1. Student Restrictions
        if(role === 'student') {
            // Restrictions on pages
            if(path.endsWith('teachers.html') || path.endsWith('attendance.html')) {
                alert("Access Denied: Students can only view their own portal.");
                window.location.href = 'dashboard.html';
            }
            
            // Hide all action/add buttons
            document.querySelectorAll('.btn-add, .action-btns, .teacher-actions, .post-box').forEach(el => el.style.display = 'none');
            
            // Hide Action columns in tables
            document.querySelectorAll('th:last-child, td:last-child').forEach(el => {
                if(el.classList.contains('action-btns') || el.innerText.toUpperCase() === 'ACTIONS') {
                    el.style.display = 'none';
                }
            });
            
            // Hide restricted sidebar links
            const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
            sidebarLinks.forEach(link => {
                const text = link.innerText.toLowerCase();
                if(text.includes('teachers') || text.includes('attendance')) {
                    link.parentElement.style.display = 'none';
                }
            });
        }
        
        // 2. Teacher Restrictions
        if(role === 'teacher') {
            if(path.endsWith('teachers.html')) {
                alert("Access Denied: Only Admins can manage teachers.");
                window.location.href = 'dashboard.html';
            }
            // Hide Teacher Management link in sidebar
            const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
            sidebarLinks.forEach(link => {
                if(link.innerText.toLowerCase().includes('teachers')) {
                    link.parentElement.style.display = 'none';
                }
            });
        }
        
        // Update user profile display UI if it exists
        const headerTitle = document.querySelector('.topbar h2');
        if(headerTitle && !document.querySelector('.role-badge')) {
           const badge = document.createElement('span');
           badge.style.cssText = 'font-size: 12px; padding: 4px 10px; border-radius: 12px; font-weight: 600; margin-left: 10px; vertical-align: middle;';
           
           if(role === 'admin') { 
               badge.innerText = 'Admin'; 
               badge.style.background = 'rgba(239, 68, 68, 0.1)'; badge.style.color = '#ef4444';
           } else if(role === 'teacher') { 
               badge.innerText = 'Teacher'; 
               badge.style.background = 'rgba(59, 130, 246, 0.1)'; badge.style.color = '#3b82f6';
           } else { 
               badge.innerText = 'Student'; 
               badge.style.background = 'rgba(16, 185, 129, 0.1)'; badge.style.color = '#10b981';
           }
           
           badge.classList.add('role-badge');
           headerTitle.appendChild(badge);
        }
    }
}

// ----------------------------------------------------
// Global Theme Logic
// ----------------------------------------------------
function initTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    if(isDark) {
        document.body.classList.add('dark-mode');
        // Update dashboard icon if it exists
        const themeIcon = document.getElementById('themeIcon');
        if(themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
}

window.toggleTheme = function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    // Save to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update dashboard icon if on dashboard
    const themeIcon = document.getElementById('themeIcon');
    if(themeIcon) {
        if(isDark) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    
    // If on dashboard, re-render chart to fix text colors
    if(typeof renderChart === 'function') {
        renderChart();
    }
};

// ----------------------------------------------------
// Students CRUD Logic
// ----------------------------------------------------

function renderStudents() {
    const tableBody = document.getElementById('studentTableBody');
    if(!tableBody) return; // Not on students page
    
    const students = JSON.parse(localStorage.getItem('studentsData')) || [];
    tableBody.innerHTML = '';
    
    students.forEach(student => {
        tableBody.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.grade}</td>
                <td>${student.email}</td>
                <td class="action-btns">
                    <button class="btn-edit" onclick="editStudent('${student.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-delete" onclick="deleteStudent('${student.id}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

window.saveStudent = function(e) {
    e.preventDefault();
    const id = document.getElementById('studentIdInput').value;
    const name = document.getElementById('studentNameInput').value;
    const grade = document.getElementById('studentGradeInput').value;
    const email = document.getElementById('studentEmailInput').value;
    
    let students = JSON.parse(localStorage.getItem('studentsData')) || [];
    
    if(id) {
        // Edit existing
        const index = students.findIndex(s => s.id === id);
        if(index > -1) {
            students[index] = {id, name, grade, email};
        }
    } else {
        // Add new
        students.push({ id: generateId('#S'), name, grade, email });
    }
    
    localStorage.setItem('studentsData', JSON.stringify(students));
    if(typeof closeStudentModal === 'function') closeStudentModal(); 
    else if(typeof closeModal === 'function') closeModal();
    
    renderStudents();
};

window.deleteStudentData = function(id) {
    if(confirm("Are you sure you want to delete this student?")) {
        let students = JSON.parse(localStorage.getItem('studentsData')) || [];
        students = students.filter(s => s.id !== id);
        localStorage.setItem('studentsData', JSON.stringify(students));
        renderStudents();
    }
};

// ----------------------------------------------------
// Teachers CRUD Logic
// ----------------------------------------------------

function renderTeachers() {
    const gridContainer = document.getElementById('teacherGridContainer');
    if(!gridContainer) return; // Not on teachers page
    
    const teachers = JSON.parse(localStorage.getItem('teachersData')) || [];
    gridContainer.innerHTML = '';
    
    // An array of colors for dynamic avatars
    const colors = [
        'linear-gradient(135deg, #10b981, #34d399)', // Green
        'linear-gradient(135deg, #f59e0b, #fbbf24)', // Orange
        'linear-gradient(135deg, #3b82f6, #60a5fa)', // Blue
        'linear-gradient(135deg, #8b5cf6, #a78bfa)', // Purple
        'linear-gradient(135deg, #ec4899, #f472b6)'  // Pink
    ];
    
    teachers.forEach((teacher, idx) => {
        const bg = colors[idx % colors.length];
        
        gridContainer.innerHTML += `
            <div class="teacher-card">
                <div class="teacher-avatar" style="background: ${bg};"><i class="fa-solid fa-user-tie"></i></div>
                <div class="teacher-name">${teacher.name}</div>
                <div class="teacher-subject">${teacher.subject}</div>
                <div style="font-size: 13px; color: #6b7280;">${teacher.quals}</div>
                <div class="teacher-actions">
                    <button title="View Profile"><i class="fa-solid fa-eye"></i></button>
                    <button title="Edit" onclick="editTeacher('${teacher.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button title="Delete" onclick="deleteTeacher('${teacher.id}')"><i class="fa-solid fa-trash" style="color:#ef4444;"></i></button>
                </div>
            </div>
        `;
    });
}

window.saveTeacher = function(e) {
    e.preventDefault();
    console.log("Saving teacher...");
    
    // Explicitly grab the DOM elements from the form to avoid global ID conflicts
    const form = document.getElementById('teacherDataForm');
    const idInput = form.querySelector('#teacherIdInput');
    const nameInput = form.querySelector('#teacherNameInput');
    const subjectInput = form.querySelector('#teacherSubjectInput');
    const qualsInput = form.querySelector('#teacherQualsInput');
    
    if (!nameInput || !subjectInput || !qualsInput) {
        console.error("Could not find teacher form inputs!");
        return;
    }
    
    const id = idInput.value;
    const name = nameInput.value;
    const subject = subjectInput.value;
    const quals = qualsInput.value;
    
    let teachers = JSON.parse(localStorage.getItem('teachersData')) || [];
    
    if(id) {
        // Edit existing
        const index = teachers.findIndex(t => t.id === id);
        if(index > -1) {
            teachers[index] = {id, name, subject, quals};
            console.log("Updated existing teacher", id);
        }
    } else {
        // Add new
        const newTeacher = { id: generateId('#T'), name, subject, quals };
        teachers.push(newTeacher);
        console.log("Added new teacher", newTeacher);
    }
    
    localStorage.setItem('teachersData', JSON.stringify(teachers));
    
    if(typeof closeTeacherModal === 'function') {
        closeTeacherModal();
    }
    
    // Force DOM update
    renderTeachers();
};

window.deleteTeacherData = function(id) {
    if(confirm("Are you sure you want to delete this teacher?")) {
        let teachers = JSON.parse(localStorage.getItem('teachersData')) || [];
        teachers = teachers.filter(t => t.id !== id);
        localStorage.setItem('teachersData', JSON.stringify(teachers));
        renderTeachers();
    }
};
