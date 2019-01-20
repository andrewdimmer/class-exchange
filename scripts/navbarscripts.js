function toggleNav() {
    if (document.getElementById("sidenav").style.display.indexOf("block") > -1) {
        document.getElementById("sidenav").style.display = "none";
    } else {
        document.getElementById("sidenav").style.display = "block";
    }
}

var user;
function loadCurrentUser(authCurrentUser, callback) {
    if (authCurrentUser == null) {
        user = null;
        console.log("No user logged in");
        for (var i = 0; callback != null && i < callback.length; i++) {
            callback[i]();
        }
    } else {
        userID = authCurrentUser.uid;
        var userPromise = getUserJSON(userID);
        userPromise.then(function(userData) {
            if (userData[0] != null) {
                user = userData[0];
                console.log("user: " + user);
                for (var i = 0; callback != null && i < callback.length; i++) {
                    callback[i]()
                }
            } else {
                console.log("Adding new user");
                var userInfo = {
                    "id": userID,
                    "name": authCurrentUser.displayName,
                    "email": authCurrentUser.email,
                    "role": "",
                    "roleSet": false,
                    "imageName": "",
                    "imageURL": "",
                    "messages": [],
                    "classes": [],
                    "topics": []
                }
                var promise = createUser(userID, userInfo);
                promise.then(function() {
                    loadCurrentUser(authCurrentUser);
                    //Popup
                })
            }
        });
    }
}

function loadSidebarFromUser() {
    if (user == null) {
        document.getElementById("userAccounts").innerHTML = "<a href='../login.html' class='element'>Login</a>";
        docuent.getElementById("navProfilePicture").setAttribute("onclick", "function(){window.location.href='../login.html'}");
    }
}