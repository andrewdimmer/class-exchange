function addClass() {
    var className = "Test Class"
    var classCategories = ["Homework", "Exams"];
    cID = "c-" + generateID(5);
    var classInfo = {
        "id": cID,
        "name": className,
        "categoryName": classCategories,
        "announcements": [],
        "teachers": [],
        "students": []
    }
    for (var cat = 0; cat < classCategories.length; cat++) {
        classInfo["cat" + cat + "posts"] = [];
    }
    var classCreated = createClass("adimmer@oakland.edu", cID, classInfo);
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

function addPost() {
    var postName = "Test Post";
    var postContent = "This is the content for the test post!";
    var userEmail = "adimmer@oakland.edu";
    var parentDoc = "c-IH2BA";
    var parentField = "announcements";
    pID = "p-" + generateID(10);
    var postInfo = {
        "id": pID,
        "title": postName,
        "content": postContent,
        "poster": userEmail,
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