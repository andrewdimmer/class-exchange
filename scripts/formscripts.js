function addClass() {
    var className = "Test Class"
    var classCategories = ["Homework", "Exams"];
    var cID = "c-" + generateID(5);
    var classInfo = {
        "id": cID,
        "name": className,
        "categoryName": classCategories,
        "announcements": [],
        "users": [user.id],
        "joinCode": Math.floor(Math.random()*10000)
    }
    for (var cat = 0; cat < classCategories.length; cat++) {
        classInfo["cat" + cat + "posts"] = [];
    }
    var classCreated = createClass(cID, classInfo, user.id);
    console.log(classCreated);
    classCreated.then(function(results){
        if (results[0] == 0) {
            console.log("Class Added Successfully!");
        } else {
            console.log("Duplicate ID. Trying again...");
            addClass();
        }
    },function(error){
        console.err(error);
    })
}

function addTopic() {
    var topicName = "SpartaHack V";
    var topicParentID = "t-L2DP8";
    var topicType = "regular";
    var tID = "t-" + generateID(5);
    var topicInfo = {
        "id": tID,
        "name": topicName,
        "parentID": topicParentID,
        "type": topicType
    }
    if (topicType.indexOf("super") > -1) {
        topicInfo["subTopics"] = [];
    } else if (topicType.indexOf("regular") > -1) {
        topicInfo["posts"] = [];
    } else {
        console.error("Unknown topic type");
    }
    if (topicParentID == null) {
        topicInfo["fullPath"] = [];
        topicInfo["fullPath"].push(tID);
    } else {
        getTopicJSON(topicParentID).then(function(result) {
            if (result == null) {
                console.log("Parent does not exist");
                topicInfo["fullPath"] = [];
                topicInfo["fullPath"].push(tID);
            } else {
                topicInfo["fullPath"] = result[0].fullPath;
                topicInfo["fullPath"].push(tID);
            }
        })
    }
    var topicCreated = createTopic(tID, topicInfo, topicParentID);
    console.log(topicCreated);
    topicCreated.then(function(results){
        if (results[0] == 0) {
            console.log("Topic Added Successfully!");
        } else {
            console.log("Duplicate ID. Trying again...");
            addClass();
        }
    },function(error){
        console.err(error);
    })
}

function addPost() {
    var postName = "Test Post";
    var postContent = "This is the content for the test post!";
    var parentDoc = "c-IH2BA";
    var parentField = "announcements";
    var pID = "p-" + generateID(10);
    var postInfo = {
        "id": pID,
        "title": postName,
        "content": postContent,
        "user": user.id,
        "dateTime": new Date(Date.now()).toJSON(),
        "resourceLinks": [],
        "youtubeLinks": [],
        "replies": []
    }
    var postCreated = createPost(pID, postInfo, parentDoc, parentField);
    console.log(postCreated);
    postCreated.then(function(results){
        if (results[0] == 0) {
            console.log("Post Added Successfully!");
        } else {
            console.log("Duplicate ID. Trying again...");
            addPost();
        }
    },function(error){
        console.err(error);
    })
}

function generateID(length) {
    var id = "";
    var allIDChars= "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (var i = 0; i < length; i++) {
        id += allIDChars[Math.floor(Math.random()*allIDChars.length)];
    }
    return id;
}

function joinClass() {
    var id = "4S62A";
    var joinCode = 6218;
    var classJoined = joinClassFirebase(id, joinCode, user.id);
    console.log(classJoined);
    classJoined.then(function(results){
        if (results[0] == 0) {
            console.log("Class Joined Successfully!");
        } else if (results[0] == 1) {
            console.log("Unable to find class!");
        } else if (results[0] == 2) {
            console.log("Join code does not match!");
        } else if (results[0] == 3) {
            console.log("You are already a member of that class!");
        } else {
            console.log("Unknown error");
        }
    },function(error){
        console.err(error);
    })    
}

function followTopic(id) {
    var classJoined = followTopicFirebase(id, user.id);
    console.log(classJoined);
    classJoined.then(function(results){
        if (results[0] == 0) {
            console.log("Topic Followed Successfully!");
        } else if (results[0] == 1) {
            console.log("Unable to find user!");
        } else if (results[0] == 2) {
            console.log("You are already following that topic!");
        } else {
            console.log("Unknown error");
        }
    },function(error){
        console.err(error);
    })    
}