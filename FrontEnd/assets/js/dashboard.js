const ctx = document.getElementById('attendanceChart');
function toggleTheme(){

document.body.classList.toggle("dark");

}
new Chart(ctx, {

type: 'bar',

data: {

labels: ['Mon','Tue','Wed','Thu','Fri'],

datasets: [{

label: 'Attendance %',

data: [90,85,92,88,95],

borderWidth:1

}]

},

options:{

scales:{

y:{

beginAtZero:true

}

}

}

});