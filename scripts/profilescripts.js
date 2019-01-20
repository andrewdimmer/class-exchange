//Profile page Firebase functions
function getInfo() {
    document.getElementById("userName").innerHTML = "loading...";
    document.getElementById("userEmail").innerHTML = "loading...";
    document.getElementById("userPassword").innerHTML = "loading...";
    if (user != null) {
        console.log("Display user profile information");
        document.getElementById("userName").innerHTML = user.displayName;
        document.getElementById("newName").value = user.displayName;
        document.getElementById("userEmail").innerHTML = user.email;
        document.getElementById("newEmail").value = user.email;
        document.getElementById("userPassword").innerHTML = "********";
    } else {
        // Error handling
        console.log("No user logged in");
        document.getElementById("userName").innerHTML = "";
        document.getElementById("newName").value = "";
        document.getElementById("userEmail").innerHTML = "";
        document.getElementById("newEmail").value = "";
        document.getElementById("userPassword").innerHTML = "";
        }
}

function updateName() {
    var user = firebase.auth().currentUser;
    var newName = document.getElementById("newName").value;

    user.updateProfile({
        displayName: newName,
    }).then(function() {
        // Update successful.
        addGoodMessage("Name Updated Successfully");
        getInfo();
        toggleEditName();
    }).catch(function(error) {
        // An error happened.
        addBadMessage(error);
    });
}

function updateEmail() {
    var user = firebase.auth().currentUser;
    var newEmail = document.getElementById("newEmail").value;

    user.updateEmail(newEmail).then(function() {
        // Update successful.
        addGoodMessage("Email Updated Successfully");
        getInfo();
        toggleEditEmail();
    }).catch(function(error) {
        // An error happened.
        addBadMessage(error);
    });
}

function updatePassword() {
    var user = firebase.auth().currentUser;
    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword == confirmPassword) {
        user.updatePassword(newPassword).then(function() {
            // Update successful.
            addGoodMessage("Password Updated Successfully");
            getInfo();
            toggleEditPassword();
        }).catch(function(error) {
            // An error happened.
            addBadMessage(error);
        });
    } else {
        // Mismatch Passwords
        addBadMessage("Warning: Passwords do not match. Please try again.");
    }
}

//Profile page display functions
function toggleEditName() {
    if (document.getElementById("editNameForm").style.display == "none") {
        document.getElementById("editNameForm").style.display = "";
        document.getElementById("editNameIcon").style.display = "none";
        document.getElementById("userName").style.display = "none";
    } else {
        document.getElementById("editNameForm").style.display = "none";
        document.getElementById("editNameIcon").style.display = "";
        document.getElementById("userName").style.display = ""; 
    }
}

function toggleEditEmail() {
    if (document.getElementById("editEmailForm").style.display == "none") {
        document.getElementById("editEmailForm").style.display = "";
        document.getElementById("editEmailIcon").style.display = "none";
        document.getElementById("userEmail").style.display = "none";
    } else {
        document.getElementById("editEmailForm").style.display = "none";
        document.getElementById("editEmailIcon").style.display = "";
        document.getElementById("userEmail").style.display = ""; 
    }
}

function toggleEditPassword() {
    if (document.getElementById("editPasswordForm").style.display == "none") {
        document.getElementById("editPasswordForm").style.display = "";
        document.getElementById("editPasswordIcon").style.display = "none";
        document.getElementById("userPassword").style.display = "none";
    } else {
        document.getElementById("editPasswordForm").style.display = "none";
        document.getElementById("editPasswordIcon").style.display = "";
        document.getElementById("userPassword").style.display = ""; 
    }
}