// Initialize Firebase
function initializeFirebase() {
    var config = {
        apiKey: "AIzaSyAP6CteQ8w8WiC71Z071mrJ58xhO16WHxM",
        authDomain: "spartahacksv-gcp.firebaseapp.com",
        databaseURL: "https://spartahacksv-gcp.firebaseio.com",
        projectId: "spartahacksv-gcp",
        storageBucket: "spartahacksv-gcp.appspot.com",
        messagingSenderId: "612257089466"
    };
    firebase.initializeApp(config);
}

// Ensures that firebase is initialized on all pages
initializeFirebase();

var db;
function initializeDatabase() {
    // Initialize Cloud Firestore through Firebase
    db = firebase.firestore();

    // Disable deprecated features
    db.settings({
      timestampsInSnapshots: true
    });
}
initializeDatabase();

function createClass(userEmail, cID, classInfo) {
    var newClass = db.collection("classes").doc(cID);
    console.log(cID + " reserved");
    var two;
    var one = newClass.get().then(function(doc) {
        if (doc.exists) {
            console.log(cID + " exists");
            return 1;
        } else {
            console.log(cID + " does not exist");
            newClass.set(classInfo)
            .then(function() {
                console.log("Document successfully written!");
                var teacher = db.collection("users").doc(userEmail);
                two = teacher.get().then(function(doc) {
                    if (doc.exists) {
                        // console.log("Document data:", doc.data());
                        teacherData = doc.data();
                        teacherData.classes.push(cID);
                        teacher.set(teacherData)
                        .then(function() {
                            console.log("Document successfully written!");
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });
                        return 0;
                    } else {
                        console.log("Error: teacher does not exist!");
                        return 1;
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            return 0;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return Promise.all([one,two]);
}

function createTopic(tID, topicInfo, parentID) {
    var newTopic = db.collection("topics").doc(tID);
    console.log(tID + " reserved");
    var two;
    var one = newTopic.get().then(function(doc) {
        if (doc.exists) {
            console.log(tID + " exists");
            return 1;
        } else {
            console.log(tID + " does not exist");
            newTopic.set(topicInfo)
            .then(function() {
                console.log("Document successfully written!");
                if (parentID != null) {
                    var parent = db.collection("topics").doc(parentID);
                    two = parent.get().then(function(doc) {
                        if (doc.exists) {
                            // console.log("Document data:", doc.data());
                            parentData = doc.data();
                            parentData.subTopics.push(tID);
                            parent.set(parentData)
                            .then(function() {
                                console.log("Document successfully written!");
                            })
                            .catch(function(error) {
                                console.error("Error writing document: ", error);
                            });
                            return 0;
                        } else {
                            console.log("Error: parent does not exist!");
                            return 1;
                        }
                    }).catch(function(error) {
                        console.log("Error getting document:", error);
                    });
                }
            }).catch(function(error) {
                console.error("Error writing document: ", error);
            });
            return 0;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return Promise.all([one,two]);
}

function createPost(pID, postInfo, parentDoc, parentField) {
    var newPost = db.collection("posts").doc(pID);
    console.log(pID + " reserved");
    var two;
    var one = newPost.get().then(function(doc) {
        if (doc.exists) {
            console.log(pID + " exists");
            return 1;
        } else {
            console.log(pID + " does not exist");
            newPost.set(postInfo)
            .then(function() {
                console.log("Document successfully written!");
                var parent;
                if (parentDoc.indexOf("c-") > -1) {
                    parent = db.collection("classes").doc(parentDoc);
                } else if(parentDoc.indexOf("p-") > -1) {
                    parent = db.collection("posts").doc(parentDoc);
                } else if(parentDoc.indexOf("t-") > -1) {
                    parent = db.collection("topics").doc(parentDoc);
                }
                two = parent.get().then(function(doc) {
                    if (doc.exists) {
                        // console.log("Document data:", doc.data());
                        parentData = doc.data();
                        parentData[parentField].unshift(pID);
                        parent.set(parentData)
                        .then(function() {
                            console.log("Document successfully written!");
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });
                        return 0;
                    } else {
                        console.log("Error: parent does not exist!");
                        return 1;
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            return 0;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return Promise.all([one,two]);
}

function joinClassFirebase(classID, joinCode, userEmail) {
    var classToJoin = db.collection("classes").doc("c-" + classID);
    var two;
    var one = classToJoin.get().then(function(doc) {
        if (doc.exists) {
            console.log("Adding " + userEmail + " to c-" + classID);
            classData = doc.data();
            if (classData.joinCode != joinCode) {
                return 2;
            }
            if (classData.users.indexOf(userEmail) > -1) {
                return 3;
            }
            classData.users.push(userEmail);
            classToJoin.set(classData)
            .then(function() {
                console.log("Document successfully written!");
                var user = db.collection("users").doc(userEmail);
                two = user.get().then(function(doc) {
                    if (doc.exists) {
                        // console.log("Document data:", doc.data());
                        console.log("Adding c-" + classID + " to " + userEmail);
                        userData = doc.data();
                        userData.classes.push("c-" + classID);
                        user.set(userData)
                        .then(function() {
                            console.log("Document successfully written!");
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });
                        return 0;
                    } else {
                        console.log("Error: user does not exist!");
                        return 1;
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            return 0;
        } else {
            console.log("Unable to find c-" + classID);
            return 1;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return Promise.all([one,two]);
}

function followTopicFirebase(topicID, userEmail) {
    var user = db.collection("users").doc(userEmail);
    var one = user.get().then(function(doc) {
        if (doc.exists) {
            // console.log("Document data:", doc.data());
            console.log("Adding t-" + topicID + " to " + userEmail);
            userData = doc.data();
            userData.classes.push("t-" + topicID);
            user.set(userData)
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            return 0;
        } else {
            console.log("Unable to find user " + userEmail);
            return 1;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return Promise.all([one]);
}

function getTopicJSON(tID) {
    var topic = db.collection("topics").doc(tID);
    var one = topic.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            return doc.data();
        } else {
            return null;
        }
        
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return Promise.all([one]);
}

function getClassJSON(cID) {
    var classToGet = db.collection("classes").doc(cID);
    var one = classToGet.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            return doc.data();
        } else {
            return null;
        }
        
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return Promise.all([one]);
}

function getPostJSON(pID) {
    var post = db.collection("posts").doc(tID);
    var one = post.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            return doc.data();
        } else {
            return null;
        }
        
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return Promise.all([one]);
}