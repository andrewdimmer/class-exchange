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
        document.getElementById("navProfilePicture").setAttribute("onclick", "window.location.href='../login.html';");
    } else {
        document.getElementById("userAccounts").innerHTML = "<a href='../profile.html' class='element'>Profile</a>";
        document.getElementById("userAccounts").innerHTML += "<a href='#' class='element' onclick='logout();'>Log Out</a>";
        document.getElementById("navProfilePicture").setAttribute("onclick", "window.location.href='../profile.html';");
        
        var classPromises = getUserClasses();
        classPromises.then(function(classes) {
            var tempClasses = [];
            for (var i = 0; i < classes.length; i++) {
                tempClasses.push(classes[i][0].name + "-----" + classes[i][0].id);
            }
            tempClasses.sort();
            for (var i = 0; i < tempClasses.length; i++) {
                console.log(tempClasses[i]);
                document.getElementById("userClasses").innerHTML += "<a href='../classes.html#" + tempClasses[i].substring(tempClasses[i].indexOf("c-"), tempClasses[i].length) + "' class='element'>" + tempClasses[i].substring(0, tempClasses[i].indexOf("-----")) + "</a>"
            }
        });
        
        var topicPromises = getUserTopics();
        topicPromises.then(function(topics) {
            var tempTopics = [];
            for (var i = 0; i < topics.length; i++) {
                for (var j = 0; j < topics[i][0].fullPath.length; j++) {
                    if (tempTopics.indexOf(topics[i][0].fullPath[j]) < 0) {
                        tempTopics.push(topics[i][0].fullPath[j]);
                        console.log(topics[i][0].fullPath[j]);
                    }
                }
            }
            var master = getTopicJSON(masterTID);
            master.then(function(masterData) {
                var masterTemp = [];
                for (var i = 0; i < masterData[0].subTopics.length; i++) {
                    if (tempTopics.indexOf(masterData[0].subTopics[i]) > -1) {
                        
                    }
                }
            });
            //-------------------------------------------
            /*tempTopics.sort();
            for (var i = 0; i < tempClasses.length; i++) {
                console.log(tempClasses[i]);
                document.getElementById("userClasses").innerHTML += "<a href='../classes.html#" + tempClasses[i].substring(tempClasses[i].indexOf("c-"), tempClasses[i].length) + "' class='element'>" + tempClasses[i].substring(0, tempClasses[i].indexOf("-----")) + "</a>"
            }*/
        });
    }
}

function getUserClasses() {
    var promises = [];
    for (var i = 0; i < user.classes.length; i++) {
        promises.push(getClassJSON(user.classes[i]));
    }
    return Promise.all(promises);
}

function getUserTopics() {
    var promises = [];
    for (var i = 0; i < user.topics.length; i++) {
        promises.push(getTopicJSON(user.topics[i]));
    }
    return Promise.all(promises);
}

function getSubTopics(listOfTopicIDs) {
    var promises = [];
    for (var i = 0; i < listOfTopicIDs.length; i++) {
        promises.push(getTopicJSON(listOfTopicIDs[i]));
    }
    return Promise.all(promises);
}