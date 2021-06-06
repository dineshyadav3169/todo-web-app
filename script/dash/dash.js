
//////////////////////////////////////////////////
// Add '+' icon click
//////////////////////////////////////////////////
_('#addInput').addEventListener('click',function(){
	const tasksText = _('#tasksText');
	const inputBox = _('#inputBox')
	if(ldb.screen==0){
		tasksText.setAttribute('placeholder','Project Name');
	}
	if(ldb.screen==1){
		tasksText.setAttribute('placeholder','Task');
	}
	tasksText.value = '';
	inputBox.classList.add('ButtomUp');
	inputBox.style.display = "block";
	tasksText.select();
	NoTaskFound(false);
})



//////////////////////////////////////////////////
// Apply Btn on PopUp
//////////////////////////////////////////////////
_('#addTaskBtn').addEventListener('click',function(){
	var taskName = _('#tasksText').value;
	const dateForTask = _('#dateForTask').innerText;
	if(ldb.screen==0){
		const projectCount = ldb.projectCount;
		const projectName = taskName;
		setProjectTask(projectName,dateForTask,projectCount);
	}
	if(ldb.screen==1){
		const selectedProject = ldb.selectedProject;
		const taskCount = ldb.taskCount;
		setTaskForProject(selectedProject,taskName,dateForTask,taskCount);
	}
	if(ldb.screen==2){
		const selectedProject = ldb.selectedProject;
		const Id = ldb.editTaskId;
		const taskCount = ldb.tasks[Id][0].sequence; //sequence
		taskUpdate(Id,selectedProject,taskCount);
	}
	const inputPopUp = _('#inputBox');
	inputPopUp.style.display = "none";
	taskName = "";
	_('#dateForTask').style.visibility = 'hidden';
})



//////////////////////////////////////////////////
// hide Pop-up on 'off click' to window
//////////////////////////////////////////////////
var inputBox0 = _('#inputBox');
window.onclick = function(event) {
  if (event.target == inputBox0) {
    inputBox0.style.display = "none";
	_('#tasksText').value = "";
	_('#dateForTask').style.visibility = 'hidden';
  }
}




//////////////////////////////////////////////////
// return Sorted List of Data from FireStore 
// (to be used after fetching data from firestore)
//////////////////////////////////////////////////
function sortTask(data){
    var list = [];
	var sortedTask = {};
    for (var i in data){
		if(i.length >=10){ //for production use 10
        	list.push(i);
		}
    }
	if(list.length==1){
		return list
	}

	for(i=0;i<list.length;i++){
		sortedTask[list[i]] = ldb.tasks[list[i]][0].sequence;
	}
	var finalTask = Object.entries(sortedTask).sort((a,b)=>a[1]-b[1]).map(el=>el[0]);
	return finalTask;
}
//////////////////////////////////////////////////
// sort project
//////////////////////////////////////////////////
function sortProject(data){
    var list = [];
	var sortedTask = {};
    for (var i in data){
		if(i.length >=10){ //for production use 10
        	list.push(i);
		}
    }
	if(list.length==1){
		return list
	}

	for(i=0;i<list.length;i++){
		sortedTask[list[i]] = ldb.projects[list[i]][0].sequence;
	}
	var finalTask = Object.entries(sortedTask).sort((a,b)=>a[1]-b[1]).map(el=>el[0]);
	return finalTask;
}


//////////////////////////////////////////////////
// User icon or Photo click
//////////////////////////////////////////////////
_('#userPhoto').addEventListener('click',function(){
	const userBoxBtn = _('.fadeON');
	if(userBoxBtn.style.display=='none'){
		userBoxBtn.style.display = 'block';
	}else{
		userBoxBtn.style.display = 'none';
	}
})



//////////////////////////////////////////////////
// Pending and completed listner
//////////////////////////////////////////////////
_('#pending').addEventListener('click', ()=>{
	_('#pending').className = 'switchPending';
	_('#completed').className = 'switchCompleted';
	_('#completedBox').style.display = 'none';
	_("#pendingBox").style.display = 'block';
})
_('#completed').addEventListener('click', ()=>{
	_('#pending').className = 'switchCompleted';
	_('#completed').className = 'switchPending';
	_("#pendingBox").style.display = 'none';
	_('#completedBox').style.display = 'block';
})



//////////////////////////////////////////////////
// tongle between pending and completed
//////////////////////////////////////////////////
function tongleDone(element){
	const d = element.innerText;
	if(d=='panorama_fish_eye'){
		taskAudio.play();

		var elementId = element.offsetParent.id;
		var elementDb = ldb.tasks[elementId][0];
		//update local database
		elementDb.completed = "true";

		//update firestore
		const preJson = `{"${elementId}":[{"deadline":  "${elementDb.deadline}","task": "${elementDb.task}","completed": "${elementDb.completed}","id": "${elementId}","sequence":"${elementDb.sequence}"}]}`
		const postJosn = JSON.parse(preJson);
		db.collection(ldb.uid).doc(ldb.selectedProject).update(postJosn);

		element.offsetParent.firstElementChild.nextElementSibling.firstElementChild.classList.add('taskDoneLine')
		element.innerText = 'check_circle';
		element.offsetParent.classList.add('taskFadeOut');
		setTimeout(function(){
			element.offsetParent.classList.remove('taskFadeOut');
			_('#completedBox').append(element.offsetParent);
			
		},900)
	}else{
		taskAudio.play();

		var elementId = element.offsetParent.id;
		var elementDb = ldb.tasks[elementId][0];
		//update local database
		elementDb.completed = "false";
		
		//update firestore
		const preJson = `{"${elementId}":[{"deadline":  "${elementDb.deadline}","task": "${elementDb.task}","completed": "${elementDb.completed}","id": "${elementId}","sequence":"${elementDb.sequence}"}]}`
		const postJosn = JSON.parse(preJson);
		db.collection(ldb.uid).doc(ldb.selectedProject).update(postJosn);
		
		
		element.offsetParent.firstElementChild.nextElementSibling.firstElementChild.classList.remove('taskDoneLine')
		element.innerText = 'panorama_fish_eye';
		element.offsetParent.classList.add('taskFadeIn');
		setTimeout(function(){
			element.offsetParent.classList.remove('taskFadeIn');
			_('#pendingBox').append(element.offsetParent);
			
		},900)
	}
}



//////////////////////////////////////////////////
// calender listner
//////////////////////////////////////////////////
var month = {01:'Jan',02:'Feb',03:'Mar',04:'Apr',05:'May',06:'Jun',07:'Jul',08:'Aug',09:'Sep',10:'Oct',11:'Nov',12:'Dec'}
_('.datepicker-input').addEventListener('change',function(){
    const  dateForTask = _('#dateForTask');
    const dateInput = _('.datepicker-input').value;
    dateForTask.innerText = dateInput.split('-')[2]+' '+ month[Number(dateInput.split('-')[1])];
	dateForTask.style.visibility = '';
})





//////////////////////////////////////////////////
// Edit Task for Project
//////////////////////////////////////////////////
function editTask(element){
	var inputBox = _('#inputBox');
    inputBox.classList.add('ButtomUp');
	inputBox.style.display = "block";
	
    var elementId = element.offsetParent.id;
	var elementDb = ldb.tasks[elementId][0];
	
	var tasksText = _('#tasksText');
	tasksText.value = elementDb.task;
	tasksText.select();

	var dateForTask =  _('#dateForTask');
	if(elementDb.deadline!=''){
		dateForTask.style.visibility = 'visible';
		dateForTask.innerText = elementDb.deadline;
	}

	ldb.editTaskId = elementId;
	ldb.screen = 2; //2 for edit on 'Apply' Btn 
}









////////////////////////////////////////////////////////////////
// Get Current Date( called window on-load)
///////////////////////////////////////////////////////////////
function currentDay(){
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const time = new Date();
	
	return `${days[time.getDay()]},${time.getDate()} ${months[time.getMonth()]}`
}






////////////////////////////////////////////////////////////////
// Open Project Onclick
///////////////////////////////////////////////////////////////
function openProject(element){
	var id = element.parentElement.id;
	var project = ldb.projects[id][0];

	ldb.selectedProject = project.projectName;
	ldb.screen = 1; //set screen to task view
	
	const projectLink = document.createElement('a');
	projectLink.setAttribute('href','#'+ldb.selectedProject);
	projectLink.click();

	_('#projectView').style.display = 'none';
	_('.switchBox').style.display = 'flex';
	_('#pendingBox').style.display = 'block';

	//set project name and dates
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const projectHeadings = _('#projectHeadings');
	const currentDate = _('#currentDate');
	projectHeadings.innerText = ldb.selectedProject;
	if(project.deadline!=''){
		var deadline = project.deadline;
		var time = new Date();
		time.setMonth(months.indexOf(deadline.split(' ')[1]));
		time.setDate(deadline.split(' ')[0]);
		currentDate.innerText =	`${days[time.getDay()]},${time.getDate()} ${months[time.getMonth()]}`
	}
	
	try{
		var tasks = db.collection(ldb.uid).doc(ldb.selectedProject);
		tasks.get().then((doc) =>{
			if (!doc.exists) {
				db.collection(ldb.uid).doc(ldb.selectedProject).set({created:true});
				svgLoader.style.display = 'none';
			} else {
				svgLoader.style.display = 'none';
				var taskData = doc.data();
				
				ldb.tasks = taskData;
				ldb.tSort =  sortTask(taskData);
				ldb.taskCount = ldb.tSort.length;
				
				if(ldb.taskCount!=0){
					loadTaskFromFire();
				}else{
					NoTaskFound(true);
				}
			}
		})
	}catch(err){
		console.log('errorr!')
	}
}






////////////////////////////////////////////////////////////////
// Display No task Found function
///////////////////////////////////////////////////////////////
function NoTaskFound(event){
	const element = _('#noTaskFound');
	if(event==true){
		element.style.display = 'block';
	}else{
		element.style.display = 'none';
	}
}




////////////////////////////////////////////////////////////////
// event listner for home icon click
///////////////////////////////////////////////////////////////
_('#homeBtn').addEventListener('click',function(){
	_('#projectView').style.display = "block";
	_('#currentDate').innerText = currentDay();
	_('#projectHeadings').innerText = 'My Task';
        	_('#pendingBox').innerHTML = '';
	_('#completedBox').innerHTML = '';
	_('.switchBox').style.display = 'none';
	ldb.screen = 0;
	NoTaskFound(false);
})







////////////////////////////////////////////////////////////////
// Dark Mode
///////////////////////////////////////////////////////////////
_('#darkMode').addEventListener('click',function(){
	const currentTheme = _('#darkMode').innerText.split(' ')[0].toLowerCase();
	_('#darkMode').innerText = currentTheme=='dark'? 'Light Mode' : 'Dark Mode';
	_('#userPhoto').style.filter = _('#userPhoto').style.filter=='invert(0) hue-rotate(0deg)'? 'invert(1) hue-rotate(180deg)': 'invert(0) hue-rotate(0deg)';
	_('#overlayDark').style.display = _('#overlayDark').style.display=='none'? 'block':'none';
	let root = document.documentElement;

	if(currentTheme=='dark'){
		root.style.setProperty('--outset', "outset");
		root.style.setProperty('--bgcolor', "#e3e3e3");
	}else{
		root.style.setProperty('--outset', "0");
		root.style.setProperty('--bgcolor', "#f7f7f7");
	}

	localStorage.setItem("theme",currentTheme);
})