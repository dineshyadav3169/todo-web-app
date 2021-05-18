//////////////////////////////////////////////////
// Global Data and function
//////////////////////////////////////////////////
function _(qurey){
	return document.querySelector(qurey)
}
var taskAudio = new Audio('audio/pop.mp3');
taskAudio.load();
window.location.hash="";
var ldb = {
	uid:0,
	screen:0, //0 for ProjectView, 1 for task view , 2 for edit
	
	projectCount:0,
	projects: {},
	pSort:0,
	
	selectedProject:0, //project name
	
	taskCount:0,
	tasks:{},
	tSort:0,

	editTaskId:0
}






//////////////////////////////////////////////////
// Init FireStore
//////////////////////////////////////////////////
const db = firebase.firestore();
function initApp() {
  firebase.auth().onAuthStateChanged(async function(user) {
	if (user) {
		var photoURL = user.photoURL;

		ldb.uid = user.uid; //update local db
		var svgLoader = _('#svgLoader');

		var tasks = db.collection(ldb.uid).doc('project');
		try{
			var doc = await tasks.get();
			if (!doc.exists) {
				db.collection(ldb.uid).doc('project').set({created:true});
				svgLoader.style.display = 'none';
			} else {
				svgLoader.style.display = 'none';
				var projectData = doc.data();
				
				ldb.projects = projectData;
				ldb.pSort =  sortProject(projectData);
				ldb.projectCount = ldb.pSort.length;
				
				if(ldb.projectCount!=0){
					loadProjectFromFire();
				}else{
					NoTaskFound(true);
				}

			}
		}catch(err){
			console.log('Some error!',err); //error type : offline , on internet connected
		}

		if(photoURL){
			var userPhoto = _('#userPhoto');
			userPhoto.setAttribute('src',photoURL);
			userPhoto.addEventListener('load',function(){
				_('#userPhotoMaterial').style.display = 'none';
				userPhoto.style.display = 'block';
			})
		}
	} else {
		window.location = 'index.html';
	}
  });
}








_('#logOut').addEventListener('click',function(){
	firebase.auth().signOut();
	console.log('user LogedOut!')
})


window.addEventListener('load', function(){
	var clientWidth = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	var leftShift = clientWidth/2 - 36.5;
	var leftShiftLoader = clientWidth/2 - 50;
	var noTaskFound = _('#noTaskFound');
	var svgLoader = _('#svgLoader');
	noTaskFound.style.top = (clientHeight/2) + 'px';
	noTaskFound.style.left = (clientWidth - 112)/2 + 'px';
	_('#adjustPosition').style.left = leftShift + 'px';
	svgLoader.style.left = leftShiftLoader + 'px';
	svgLoader.style.bottom = (clientHeight/2) + 'px';
	_('#currentDate').innerText = currentDay();
	initApp();
})

window.onpopstate=function()
{
   if(window.location.hash=="" && window.location.href=="https://todo-lineup.web.app/dashboard"){
        _('#projectView').style.display = "block";
		_('#currentDate').innerText = currentDay();
		_('#projectHeadings').innerText = 'My Task';
        _('#pendingBox').innerHTML = '';
		_('#completedBox').innerHTML = '';
		_('.switchBox').style.display = 'none';
		ldb.screen = 0;
		NoTaskFound(false);
    }
}

