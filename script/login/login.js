function _(qurey){
	return document.querySelector(qurey)
}


function toggleSignIn() {
  if (!firebase.auth().currentUser) {
	var provider = new firebase.auth.GithubAuthProvider();
	
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a GitHub Access Token. You can use it to access the GitHub API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  //document.getElementById('quickstart-oauthtoken').textContent = token;
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorMessage = error.message;
	  showErrorMessage(errorMessage)
	});
  } else {
	firebase.auth().signOut();
  }
  document.getElementById('loginBtn').disabled = true;
}


function initApp() {
  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
	  showSuccessMessage('Redirecting to Dashboard');
	  window.location = 'dashboard.html';
	} else {
	  console.log('User is signed out')
	}
	document.getElementById('loginBtn').disabled = false;
  });
  document.getElementById('loginBtn').addEventListener('click', function(){	
		showSuccessMessage('Login using Github!');
		setTimeout(function(){toggleSignIn();},1500);
	});
}







window.addEventListener('load',function(){
	if(window.innerWidth>415){
		var h3 = document.createElement('h3');
		var p = document.createElement('p');
		p.innerText = 'Please visit on a mobile to create your task!';
		var div1 = document.createElement('div');
		var div2 = document.createElement('div');
		var div3 = document.createElement('div');
		div1.className = "max-w-full mt-2 text-sm text-center text-gray-500";
		div2.className = 'px-4 py-5 sm:p-6';
		h3.innerText = 'This site is optimized for mobile';
		h3.className = 'max-w-full text-lg font-medium leading-6 text-center text-gray-900';
		div3.className = 'bg-white shadow rounded-lg mt-2.5';
		div1.append(p)
		div2.append(h3)
		div2.append(div1)
		div3.append(div2)

		document.body.innerHTML = "";
		document.body.style.backgroundColor = 'rgba(250,250,250,1)';
		document.body.append(div3);
	}
	var clientWidth = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	_('.continueBtn').style.width = (clientWidth - 72)+'px';
	
	_('#dash').style.width  = (clientWidth - 72) + 'px';
	_('#dash').style.height = (clientWidth - 72) + 'px';
	
	var elementSize = (clientWidth-72)+10+260;
	var s = (clientHeight-(elementSize))/2.5;
	_('#textBlock').style.paddingTop = s+'px';
	
	initApp();
})



function showErrorMessage(message){
	_('#errorText').innerText = message;
	_('#errorMessage').style.display = 'block';
	setTimeout(function(){ _('#errorMessage').style.display = 'none'; }, 4000);
}
function showSuccessMessage(message){
	console.log(message)
	_('#successText').innerText = message;
	_('#successMessage').style.display = 'block';
	setTimeout(function(){ _('#successMessage').style.display = 'none'; }, 4000);
}