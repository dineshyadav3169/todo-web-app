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
		document.write('This Website Only Available for "Mobile"')
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