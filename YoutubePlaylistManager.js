/*Removes watched videos from a YouTube playlist twice at a time*/
(function(){
    "use strict";
    var simultaneous_operations = 2;
    var loadAll = function() {
        if (document.querySelector(".yt-uix-load-more")) {
            document.querySelector(".yt-uix-load-more").click();
            setTimeout(loadAll, 50);
        } else if (document.querySelector("yt-uix-load-more-loading")) {
            setTimeout(loadAll, 50);
        } else {
            markDeletion();
        }
    };
    var markDeletion = function() {
        var last_eligible_video = document.querySelectorAll(".watched")[document.querySelectorAll(".watched").length-1].parentNode.parentNode.parentNode;
        var video_collection = document.querySelectorAll(".pl-video");
        var style = document.createElement("style");
        style.innerHTML = "[killList] {background-color: red;}";
        document.head.appendChild(style);
        var i = -1;
        while (last_eligible_video != video_collection[i]) {
            i++;
            video_collection[i].setAttribute("killList", i % simultaneous_operations);
        }
        confirmDeletion(i + 1);
    };
    var delFirst = function(thread) {
        console.warn("Deleting Next Video in playlist, group " + thread);
        var killList = document.querySelectorAll("[killList = '" + thread + "']");
        for (let i = 0, ii = killList.length; i != ii; i++) {
            if (!killList[i].classList.contains("handled_deletion")) {
                killList[i].querySelector(".pl-video-edit-remove").click();
                killList[i].classList.add("handled_deletion");
                break;
            }
        }
    };
    var confirmDeletion = function(vids_to_delete) {
        var confirm = document.createElement("div");
        confirm.style = "position:fixed;background-color:yellow;bottom:0;width:100%;z-index:2147483647;";
        confirm.innerHTML = '<p style="margin:10px;cursor:default">' + vids_to_delete + ' Videos will be removed.</p';
        var button = document.createElement("button");
        button.style.margin = "10px";
        button.style.cursor = "pointer";
        button.innerText = "OK";
        confirm.appendChild(button);
        document.body.appendChild(confirm);
        button.addEventListener("click",function(){
            document.body.removeChild(confirm);
            startDeletion();
        }.bind(this));
    };
    var updated_kill_list, cached_kill_list = [];
    var startDeletion = function() {
        updated_kill_list = function(group) {
            return document.querySelectorAll("[killList = '" + group + "']");
        };
        for (let i = 0; i <= simultaneous_operations; i++) {
            cached_kill_list[i] = document.querySelectorAll("[killList = '"+i+"']");
            setTimeout(function() {
                delFirst(i);
                checkDeletion(i);
            }.bind(this), i * 100);
        }
    };
    var checkDeletion = function(thread) {
        if (cached_kill_list[thread].length != updated_kill_list(thread).length) {
            cached_kill_list[thread] = updated_kill_list(thread);
            delFirst(thread);
        }
        if (cached_kill_list.length > 0) {
            setTimeout(checkDeletion.bind(this, thread), 100);
        }
    };
    if (location.href.indexOf("youtube.com/playlist?") === -1) {
        window.open("https://www.youtube.com/playlist?list=WL");
    } else {
        loadAll();
    }
})();
