function googleSignInPopup() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
    .signInWithPopup(provider)
    .catch((error) => {
      console.log(error);
    });
}

function googleSignOut() {
  firebase.auth().signOut()
    .catch((error) => {
      console.log(error);
    });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User logged in already or has just logged in.
    console.log(user.uid);
    document.getElementById('login').style.display = 'none';
    document.getElementById('logout').style.display = 'inline';
    renderCalendar();
  } else {
    // User not logged in or has just logged out.
    document.getElementById('login').style.display = 'inline';
    document.getElementById('logout').style.display = 'none';
    deleteCalendar();
  }
});