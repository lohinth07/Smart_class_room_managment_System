let announcements=[];

function addAnnouncement(){

let text=document.getElementById("announcementText").value;

if(text==""){

alert("Enter announcement");

return;

}

announcements.push(text);

displayAnnouncements();

document.getElementById("announcementText").value="";

}

function displayAnnouncements(){

let list=document.getElementById("announcementList");

list.innerHTML="";

announcements.forEach((a)=>{

list.innerHTML+=`

<div class="card">

${a}

</div>

`;

});

}