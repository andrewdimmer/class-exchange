//Profile page Firebase functions
function getInfo() {
    document.getElementById("userName").innerHTML = "loading...";
    document.getElementById("userEmail").innerHTML = "loading...";
    document.getElementById("userPassword").innerHTML = "loading...";
    if (user != null) {
        console.log("Display user profile information");
        document.getElementById("userName").innerHTML = user.name;
        document.getElementById("newName").value = user.name;
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
    var FBUser = auth.currentUser;
    var newName = document.getElementById("newName").value;
    
    FBUser.updateProfile({
        displayName: newName,
    }).then(function() {
        // Update successful.
        var DBUser = db.collection("users").doc(user.id)
        DBUser.get().then(function(doc) {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                console.log("Updating name for " + user.id);
                userData = doc.data();
                userData.name = newName;
                DBUser.set(userData)
                .then(function() {
                    console.log("Document successfully written!");
                    loadCurrentUser(auth.currentUser, [getInfo]);
                    addGoodMessage("Name Updated Successfully");
                    toggleEdit("Name");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                    addBadMessage(error);
                });
                return 0;
            } else {
                console.log("Unable to find user " + user.id);
                addBadMessage("Unable to find user"+ user.id);
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
            addBadMessage(error);
        });
    }).catch(function(error) {
        // An error happened.
        addBadMessage(error);
    });
}

function updateEmail() {
    var FBUser = auth.currentUser;
    var newEmail = document.getElementById("newEmail").value;
    
    FBUser.updateProfile({
        email: newEmail,
    }).then(function() {
        // Update successful.
        var DBUser = db.collection("users").doc(user.id)
        DBUser.get().then(function(doc) {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                console.log("Updating email for " + user.id);
                userData = doc.data();
                userData.email = newEmail;
                DBUser.set(userData)
                .then(function() {
                    console.log("Document successfully written!");
                    loadCurrentUser(auth.currentUser, [getInfo]);
                    addGoodMessage("Email Updated Successfully");
                    toggleEdit("Email");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                    addBadMessage(error);
                });
                return 0;
            } else {
                console.log("Unable to find user " + user.id);
                addBadMessage("Unable to find user"+ user.id);
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
            addBadMessage(error);
        });
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
            toggleEdit("Password");
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
function toggleEdit(element) {
    if (document.getElementById("edit" + element + "Form").style.display == "none") {
        document.getElementById("edit" + element + "Form").style.display = "";
        document.getElementById("edit" + element + "Icon").style.display = "none";
        document.getElementById("user" + element).style.display = "none";
    } else {
        document.getElementById("edit" + element + "Form").style.display = "none";
        document.getElementById("edit" + element + "Icon").style.display = "";
        document.getElementById("user" + element).style.display = ""; 
    }
}