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
        document.getElementById("userRole").innerHTML = user.role;
        document.getElementById("newRole").value = user.role;
        document.getElementById("userImage").innerHTML = user.imageName;
        //Images
        document.getElementById("editNameIcon").href = "#";
        document.getElementById("editNameIcon").setAttribute("onclick", "toggleEdit('Name')");
        document.getElementById("editEmailIcon").href = "#";
        document.getElementById("editEmailIcon").setAttribute("onclick", "toggleEdit('Email')");
        document.getElementById("editPasswordIcon").href = "#";
        document.getElementById("editPasswordIcon").setAttribute("onclick", "toggleEdit('Password')");
        if (!user.roleSet) {
            document.getElementById("editRoleIcon").href = "#";
            document.getElementById("editRoleIcon").setAttribute("onclick", "toggleEdit('Role')");
        }
        document.getElementById("editImageIcon").href = "#";
        document.getElementById("editImageIcon").setAttribute("onclick", "toggleEdit('Image')");
    } else {
        // Error handling
        console.log("No user logged in");
        document.getElementById("userName").innerHTML = "";
        document.getElementById("newName").value = "";
        document.getElementById("userEmail").innerHTML = "";
        document.getElementById("newEmail").value = "";
        document.getElementById("userPassword").innerHTML = "";
        document.getElementById("userRole").innerHTML = "";
        document.getElementById("newRole").value = "";
        document.getElementById("userImage").innerHTML = "";
        //Images
        document.getElementById("editNameIcon").removeAttribute("href");
        document.getElementById("editEmailIcon").removeAttribute("href");
        document.getElementById("editPasswordIcon").removeAttribute("href");
        document.getElementById("editRoleIcon").removeAttribute("href");
        document.getElementById("editImageIcon").removeAttribute("href");
        document.getElementById("editNameIcon").removeAttribute("onclick");
        document.getElementById("editEmailIcon").removeAttribute("onclick");
        document.getElementById("editPasswordIcon").removeAttribute("onclick");
        document.getElementById("editRoleIcon").removeAttribute("onclick");
        document.getElementById("editImageIcon").removeAttribute("onclick");
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

function updateRole() {
    var newRole = document.getElementById("newRole").value;
    if (newRole.indexOf("Student") > -1 || newRole.indexOf("Teacher") > -1) {
        var DBUser = db.collection("users").doc(user.id)
        DBUser.get().then(function(doc) {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                console.log("Updating role for " + user.id);
                userData = doc.data();
                userData.role = newRole;
                userData.roleSet = true;
                DBUser.set(userData)
                .then(function() {
                    console.log("Document successfully written!");
                    loadCurrentUser(auth.currentUser, [getInfo]);
                    addGoodMessage("Role Updated Successfully");
                    toggleEdit("Role");
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
    } else {
        addBadMessage("Role must be either \"Student\" or \"Teacher\"!");
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