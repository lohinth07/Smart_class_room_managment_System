let students=[];

function addStudent(){

let name=document.getElementById("name").value;
let roll=document.getElementById("roll").value;

if(name=="" || roll==""){
alert("Fill all fields");
return;
}

students.push({name,roll});

displayStudents();

}

function displayStudents(){

let table=document.getElementById("studentTable");

table.innerHTML="";

students.forEach((s,index)=>{

table.innerHTML+=`

<tr>

<td>${s.name}</td>
<td>${s.roll}</td>

<td>

<button onclick="deleteStudent(${index})">Delete</button>

</td>

</tr>

`;

});

}

function deleteStudent(i){

students.splice(i,1);

displayStudents();

}
function searchStudent(){

let input=document.getElementById("searchStudent").value.toLowerCase();

let rows=document.querySelectorAll("#studentTable tr");

rows.forEach(row=>{

let name=row.children[0].innerText.toLowerCase();

row.style.display=name.includes(input) ? "" : "none";

});

}