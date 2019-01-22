function loadTopicsPage() {
    
    console.log("loadTopicsPage");
    var url = window.location.href;
    var tID;
    if (url.indexOf("#") > -1) {
        tID = url.substring(url.indexOf("#")+1, url.length);
    } else {
        tID = null;
    }
    console.log(tID);
    var topics = loadPossibleTopics(tID);
    topics.then(function(topicOptions) {
        var topicData; 
        if(topicOptions[0] != null && topicOptions[0][0] != null) {
            topicData = topicOptions[0][0];
        } else {
            topicData = topicOptions[1][0];
            if (url.indexOf("#") > -1) {
                addBadMessage("Invalid Topic ID. Displaying the Master Topic Instead...");
            }
        }
        document.getElementsByClassName("content")[0].innerHTML = "<h1>" + topicData.name + "</h1>";
        document.getElementsByClassName("content")[0].innerHTML += "<div id='breadcrumbs'></div>";
        var breadCrumbsData = getSubTopics(topicData.fullPath);
        breadCrumbsData.then(function(data) {
            document.getElementById("breadcrumbs").innerHTML = "<a href='../topics.html#" + data[0][0].id + "'>" + data[0][0].name + "</a>";
            
            for (var i = 1; i < data.length; i++) {
                document.getElementById("breadcrumbs").innerHTML += " > <a href='../topics.html#" + data[i][0].id + "'>" + data[i][0].name + "</a>";
            }
        });
        
        if (topicData.type.indexOf("super") > -1) {
            var subtopics = getSubTopics(topicData.subTopics);
            subtopics.then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    document.getElementsByClassName("content")[0].innerHTML += "<div class='contentBackground addPadding center'><a href='../topics.html#" + data[i][0].id + "'>" + data[i][0].name + "</a></div>";
                }
            })
        } else {
            printPosts(topicData, "posts");
            document.getElementsByClassName("content")[0].innerHTML += "<div class='center' id='" + topicData.id + "_postButton'><input type='button' class='btn btn-outline-info' style=' margin-top: .5rem;' value='Create New Post' onclick='toggleNewPostBox(\"" + topicData.id + "\");'/></div><div class='card' id='" + topicData.id + "_replyToggle' style='display: none;'><div class='card-body form contentBackground'><h6 class='seperateDown'>Title</h6><input class='textStyle fullWidth seperateDown' placeholder='Title your post here' id='" + topicData.id + "_title'/><br /><h6 class='seperateDown'>Body</h6><textarea class='textStyle fullWidth' placeholder='Type your post here' id='" + topicData.id + "_content'></textarea><br /><h6 class='seperateDown'>Links</h6><input class='textStyle fullWidth seperateDown' placeholder='Place comma seperated resource links here' id='" + topicData.id + "_links'/><br /><input class='textStyle fullWidth ' placeholder='Place comma seperated YouTube video links here' id='" + topicData.id + "_video'/><br /><input type='button' class='btn btn-outline-info' style='margin-top: .5rem' id='" + topicData.id + "_submitButton' value='Post' onclick='addPost(\"" + topicData.id + "\",\"posts\");'/><input type='button' class='btn btn-outline-info' style='margin-top: .5rem' id='" + topicData.id + "_cancelButton' value='Cancel' onclick='toggleNewPostBox(\"" + topicData.id + "\");'/></div></div>";
        }
    });  
}

function loadPossibleTopics(tID) {
    var specificTopic;
    if (tID != null) {
        specificTopic = getTopicJSON(tID);
    } else {
        specificTopic = null;
    }
    var masterTopic = getTopicJSON(masterTID);
    return Promise.all([specificTopic,masterTopic]);
}

function printPosts(topicOfClassData, field) {
    var promise = printPostsHelper(topicOfClassData, field);
    promise.then(function(postData) {
        for (var i = 0; i < postData.length; i++) {
            console.log(postData[i][0]);
            document.getElementsByClassName("content")[0].innerHTML += "<div class='totalContainer'><div class='post'><div class='card postContent'><div class='card-body'><div class='titleLine'><h5 class='card-title'>" + postData[i][0].title + "</h5><div class='profilePicture'><img src='images/Profile%20Picture%20Placeholder.jpg' width='40px' class='profilePicture' style='float: left;'/></div><div class='sideInfo'><div class='usersName'><h6>" + postData[i][0].user + "</h6></div><div class='timestamp'><em><h7>" + postData[i][0].dateTime + "</h7></em></div></div></div>";
            for (var c = 0; c < postData[i][0].content.length; c++) {
                document.getElementsByClassName("content")[0].innerHTML += "<p class='card-text'>" + postData[i][0].content[c] +"</p>";
            }
            document.getElementsByClassName("content")[0].innerHTML += "<div class='links'><div class='linkBox'>";
            for (var l = 0; l < postData[i][0].resourceLinks.length; l++) {
                document.getElementsByClassName("content")[0].innerHTML += "<a href=" + postData[i][0].resourceLinks[l] + " class='card-link'>" + postData[i][0].resourceLinks[l] + "</a>";
            }
            document.getElementsByClassName("content")[0].innerHTML += "</div><div class='linkBox'>";
            for (var y = 0; y < postData[i][0].youtubeLinks.length; y++) {
                document.getElementsByClassName("content")[0].innerHTML += "<a href=" + postData[i][0].youtubeLinks[y] + " class='card-link'>" + postData[i][0].youtubeLinks[y] + "</a>";
            }                
            document.getElementsByClassName("content")[0].innerHTML += "</div></div><br/><div class='buttons'><input type='button' type='button' class='btn btn-outline-info reply' value='Reply'/><!--<input type='button' class='btn btn-outline-info edit' value='Edit'/>--></div></div></div></div><div class='comment'></div></div>";
        }
    });
}

function printPostsHelper(topicOfClassData, field) {
    var promise = [];
    console.log(topicOfClassData.field);
    for (var i = 0; i < topicOfClassData[field].length; i++) {
        promise.push(getPostJSON(topicOfClassData[field][i]));
    }
    return Promise.all(promise);
}