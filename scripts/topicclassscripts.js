function loadTopicsPage() {
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
                document.getElementById("breadcrumbs").innerHTML += " > <a href='../topics.html#" + data[0][0].id + "'>" + data[0][0].name + "</a>";
            }
        });
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