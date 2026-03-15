let students=[
{name:"Arun"},
{name:"Vijay"},
{name:"Karthik"},
{name:"Rahul"}
];

let attendance={};

function loadStudents(){

let table=document.getElementById("attendanceTable");

students.forEach((s,i)=>{

table.innerHTML+=`

<tr>

<td>${s.name}</td>

<td>

<select onchange="markAttendance(${i},this.value)">

<option value="">Select</option>
<option value="Present">Present</option>
<option value="Absent">Absent</option>

</select>

</td>

</tr>

`;

});

}

function markAttendance(i,status){

attendance[students[i].name]=status;

console.log(attendance);

}

loadStudents();