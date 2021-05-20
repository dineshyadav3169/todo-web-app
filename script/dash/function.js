////////////////////////////////////////////////////////////////
// set New Project
///////////////////////////////////////////////////////////////
function setProjectTask(projectName,dateForTask,projectCount){

	const timeStamp = new Date().toISOString().split('.')[0].replaceAll('-','').replaceAll(':','').replace('T','');

    const taskBox = document.createElement('div');
	taskBox.classList.add('taskBox');
	taskBox.setAttribute('id',timeStamp);
	const taskOption = document.createElement('div');
	taskOption.classList.add('taskOption');
	const grid = document.createElement('div');
	grid.style.display = 'grid';
	grid.setAttribute('onclick','openProject(this)');

	const taskInfo = document.createElement('span');
	taskInfo.setAttribute('class','taskInfo');

	const dragIndicator = document.createElement('span');
	dragIndicator.setAttribute('class','material-icons rotate90 disable-select');
	dragIndicator.innerText = 'drag_indicator';

	grid.append(taskInfo);
	taskOption.append(dragIndicator);
	taskBox.append(grid);
	taskBox.append(taskOption);
	
	if(dateForTask!=""){
		const subTaskInfo = document.createElement('span');
		subTaskInfo.setAttribute('class','subTaskInfo');
		subTaskInfo.innerText = dateForTask;
		
		grid.append(subTaskInfo);
		taskInfo.classList.add('datePadding');		
	}
	taskInfo.innerText = projectName;
	
	_('#projectView').append(taskBox);


	var preJson = `{"${timeStamp}":[{"deadline":  "${dateForTask}","projectName": "${projectName}","completed": "${false}","id": "${timeStamp}","sequence":"${projectCount}"}]}`
	var postJosn = JSON.parse(preJson);
	//send to FireStore
	db.collection(ldb.uid).doc('project').update(postJosn);

	//update local DataBase
	ldb.projects[timeStamp] = [{deadline:dateForTask,projectName:projectName,completed:"false",id:timeStamp,sequence:projectCount}]
	ldb.projectCount = projectCount+1;
	if(ldb.projectCount!=0){
		NoTaskFound(false);
	}
}



////////////////////////////////////////////////////////////////
// set Tasks for Project Opned
///////////////////////////////////////////////////////////////
function setTaskForProject(selectedProject,taskName,dateForTask,taskCount) {
	const timeStamp = new Date().toISOString().split('.')[0].replaceAll('-','').replaceAll(':','').replace('T','');

	var taskBox = document.createElement('div');
	taskBox.classList.add('taskBox');
	taskBox.setAttribute('id',timeStamp);
	var checkBox = document.createElement('div');
	checkBox.classList.add('checkBox');
	var taskOption = document.createElement('div');
	taskOption.classList.add('taskOption');
	var grid = document.createElement('div');
	grid.style.display = 'grid';

	var circle = document.createElement('span');
	circle.setAttribute('class','material-icons disable-select');
	circle.setAttribute('onclick', 'tongleDone(this);')
	circle.innerText = 'panorama_fish_eye';

	var taskInfo = document.createElement('span');
	taskInfo.setAttribute('class','taskInfo');

	var dragIndicator = document.createElement('span');
	dragIndicator.setAttribute('class','material-icons rotate90 disable-select');
	dragIndicator.innerText = 'drag_indicator';

	checkBox.append(circle);
	grid.append(taskInfo);
	taskOption.append(dragIndicator);

	taskBox.append(checkBox);
	taskBox.append(grid);
	taskBox.append(taskOption);
	
	if(dateForTask!=""){
		
		console.log("one")
		var subTaskInfo = document.createElement('span');
		subTaskInfo.setAttribute('class','subTaskInfo');
		subTaskInfo.innerText = dateForTask;
		
		grid.append(subTaskInfo);
		taskInfo.classList.add('datePadding');		
	}
	taskInfo.innerText = taskName;
	taskInfo.setAttribute('onclick','editTask(this)');

	var pendingBox = _('#pendingBox');
	pendingBox.append(taskBox);
	
	var preJson = `{"${timeStamp}":[{"deadline":  "${dateForTask}","task": "${taskName}","completed": "${false}","id": "${timeStamp}","sequence":"${taskCount}"}]}`
	var postJosn = JSON.parse(preJson);
	//send to FireStore
	db.collection(ldb.uid).doc(selectedProject).update(postJosn);

	//update local DataBase
	ldb.tasks[timeStamp] = [{deadline:dateForTask,task:taskName,completed:"false",id:timeStamp,sequence:taskCount}]
	ldb.taskCount = taskCount + 1; //update sequence
	if(ldb.taskCount!=0){
		NoTaskFound(false);
	}
}







////////////////////////////////////////////////////////////////
// update Task (text and date)
///////////////////////////////////////////////////////////////
function taskUpdate(Id,selectedProject,taskCount){
	const elementDb = ldb.tasks[Id][0];
		
	const tasksText = _('#tasksText');
	const dateForTask =  _('#dateForTask');

	//fireStore Update
	const preJson = `{"${Id}":[{"deadline":  "${dateForTask.innerText}","task": "${tasksText.value}","completed": "${elementDb.completed}","id": "${Id}","sequence":"${taskCount}"}]}`
	const postJosn = JSON.parse(preJson);
	db.collection(ldb.uid).doc(selectedProject).update(postJosn);
	
	//update local database
	elementDb.task = tasksText.value;
	elementDb.deadline = dateForTask.innerText;

	var element = document.getElementById(Id);
	element.firstElementChild.nextElementSibling.firstElementChild.innerText = tasksText.value;
	if(elementDb.deadline!=''){
		if(element.firstElementChild.nextElementSibling.childElementCount==1){
			element.firstElementChild.nextElementSibling.firstElementChild.classList.add('datePadding');
			const span = document.createElement('span');
			span.setAttribute('class','subTaskInfo');
			span.innerText = dateForTask.innerText;
			element.firstElementChild.nextElementSibling.append(span);
		}else{
			element.firstElementChild.nextElementSibling.lastElementChild.innerText = dateForTask.innerText;
		}
	}
}









////////////////////////////////////////////////////////////////
// load Project From FireStore
///////////////////////////////////////////////////////////////
function loadProjectFromFire() {
	const sortedProj = ldb.pSort;
	const project = ldb.projects;

	for(i=0;i<sortedProj.length;i++){
		
		var deadline = project[sortedProj[i]][0].deadline;
		var id = project[sortedProj[i]][0].id;
		var projectName = project[sortedProj[i]][0].projectName;
		
		var taskBox = document.createElement('div');
		taskBox.classList.add('taskBox');
		taskBox.setAttribute('id',id);
		var taskOption = document.createElement('div');
		taskOption.classList.add('taskOption');
		var grid = document.createElement('div');
		grid.style.display = 'grid';
		grid.setAttribute('onclick','openProject(this)');

		var taskInfo = document.createElement('span');
		taskInfo.setAttribute('class','taskInfo');

		var dragIndicator = document.createElement('span');
		dragIndicator.setAttribute('class','material-icons rotate90 disable-select');
		dragIndicator.innerText = 'drag_indicator';

		grid.append(taskInfo);
		taskOption.append(dragIndicator);

		taskBox.append(grid);
		taskBox.append(taskOption);
		
		if(deadline!=""){
			var subTaskInfo = document.createElement('span');
			subTaskInfo.setAttribute('class','subTaskInfo');
			subTaskInfo.innerText = deadline;
			
			grid.append(subTaskInfo);
			taskInfo.classList.add('datePadding');		
		}
		taskInfo.innerText = projectName;

		
		var projectView = _('#projectView');
		projectView.append(taskBox);
		
	}
}
	








////////////////////////////////////////////////////////////////
// load Task From FireStore
///////////////////////////////////////////////////////////////
function loadTaskFromFire() {
	const sortedTask = ldb.tSort;
	const tasks = ldb.tasks;
	if(ldb.taskCount==0) return;
	for(i=0;i<ldb.taskCount;i++){

		var completed = tasks[sortedTask[i]][0].completed;
		var deadline = tasks[sortedTask[i]][0].deadline;
		var id = tasks[sortedTask[i]][0].id;
		var task = tasks[sortedTask[i]][0].task;
		
		var taskBox = document.createElement('div');
		taskBox.classList.add('taskBox');
		taskBox.setAttribute('id',id);
		var checkBox = document.createElement('div');
		checkBox.classList.add('checkBox');
		var taskOption = document.createElement('div');
		taskOption.classList.add('taskOption');
		var grid = document.createElement('div');
		grid.style.display = 'grid';

		var circle = document.createElement('span');
		circle.setAttribute('class','material-icons disable-select');
		circle.setAttribute('onclick', 'tongleDone(this);')
		circle.innerText = 'panorama_fish_eye';

		var taskInfo = document.createElement('span');
		taskInfo.setAttribute('class','taskInfo');

		var dragIndicator = document.createElement('span');
		dragIndicator.setAttribute('class','material-icons rotate90 disable-select');
		dragIndicator.innerText = 'drag_indicator';

		checkBox.append(circle);
		grid.append(taskInfo);
		taskOption.append(dragIndicator);

		taskBox.append(checkBox);
		taskBox.append(grid);
		taskBox.append(taskOption);
		
		if(deadline!=""){
			var subTaskInfo = document.createElement('span');
			subTaskInfo.setAttribute('class','subTaskInfo');
			subTaskInfo.innerText = deadline;
			
			grid.append(subTaskInfo);
			taskInfo.classList.add('datePadding');		
		}
		taskInfo.innerText = task;
		taskInfo.setAttribute('onclick','editTask(this)');

		if(completed=="true"){
			circle.innerText = 'check_circle';
			taskInfo.classList.add('taskDoneLine');
			var completedBox = _('#completedBox');
			completedBox.append(taskBox);
		}else{
			var pendingBox = _('#pendingBox');
			pendingBox.append(taskBox);
		}
	}
}
	
