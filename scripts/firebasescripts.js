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
                        teacherData.classes.sort();
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