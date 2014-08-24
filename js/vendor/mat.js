/*jslint browser: true*/
/*global $, jQuery*/
/*global $, Foundation*/

//globals that make me sad 
var cent = 0, sec = 0, min = 0, hour = 0, pause = 0, running = 0, save = 0, compte = 0, timerStop = 0;
var started = 0, elapsedTime = new Date();


(function () {
    "use strict";

    //generates a unique id
    function generateId() {
        return "MAT-" + Foundation.utils.random_str(6);
    }
    //saves an item to localStorage
    function saveReminder (id, content) {
        localStorage.setItem(id, content);
    };

    //create the saved list of reminders
    function createReminder(id, content) {
        var task = jQuery.parseJSON(content),content = "", contentLabel = "", contentTask = "";
        if(task.label != ""){
            contentLabel = '<span class="label">' + task.label + '</span>';
        }
        if(task.task !== "") {            
            contentTask = '<span class="task">' + task.task + ' </span>';
        } else {            
            document.getElementById('message').innerHTML = "You must add a new task before adding it ! <a class='close-notification right' href='#'>&times;</a>";
        }
        document.getElementById("list").innerHTML +=  "<li id=" +
             id + " class='saved hide'>" +
             contentTask + 
             '<span class="listHour">' +
             task.timeHour + '</span><span class="listMin">' + task.timeMin + '</span><span class="listSec">' +  task.timeSec 
             + '</span>' + contentLabel + '<div class="large-3 controls text-center right"><a class="left edit" href="#">edit</a><a href="#" class="close right">&times;</a></div></li>';
    }

    //load all the reminders from the browser storage
    function loadReminders() {
        var text = "", key = 0;
        if (localStorage.length !== 0) {
            for (key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    text = localStorage.getItem(key);
                    if (key.indexOf('MAT-F-') === 0) {
                        createReminder(key, text);
                    }
                }
            }
            $("#list > li.hide").fadeIn("fast");
        }
    }

    //delete a specified item from localStorage
    function deleteReminder(id) {
        localStorage.removeItem(id);
    }

    //delete all items in localStorage
    function deleteReminders() {
        var keys = [];
        for (keys in localStorage) {
            if (localStorage.hasOwnProperty(keys)) {
                if (keys.indexOf('MAT-F-') === 0) {
                    localStorage.removeItem(keys);
                }
            }
        }
    }


    //after enter save a new element
    $('#task').on('keyup', function (e) {
        var timeSec = "", timeMin = "", timeHour = "";
        if (e.which === 13) {
            e.preventDefault();

            var content = {}, randomStr = "";

            randomStr = generateId();

            content.timeHour = document.getElementById("hour").innerHTML;
            content.timeMin = document.getElementById("min").innerHTML;
            content.timeSec = document.getElementById("sec").innerHTML;
            content.label = $("#category").val();
            content.task = document.getElementById("task").value;

            createReminder(randomStr,JSON.stringify(content));
            $(".hide").last().fadeIn("fast");
            $("#task").val('');
        }
    });

    //save and toggle the categories
    $('#category').on('keyup', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            var category = document.getElementById("category").value;
            document.getElementById("menu-category").innerHTML += "<li ><a class='category-choice' href='#'>" + category + "</a></li>";
            $("#category").val('');
        }
    });

    $(document).on("click", "a.category-choice", function (e) {
        $("#category").val($(this).text());
        $('.sub-menu').toggle("slow");
        e.preventDefault();
    });

    $(document).on("click", "a.done", function (e) {
        var liContainer = $(this).parent().parent();
        var task = {};
        task.id = $(liContainer).attr('id');
        task.state = "running";
        task.task = liContainer.find('.task').text();
        task.timeSec = liContainer.find('.listSec').text();
        task.timeMin = liContainer.find('.listMin').text();
        task.timeHour = liContainer.find('.listHour').text();
        task.label = liContainer.find('.label').text();
        if (liContainer.find('.timeConsumed').text() !== "undefined") {
            task.timestamp = liContainer.find('.timeConsumed').text();
        } else {
            task.timestamp = "00:00:00";
        }
        saveReminder(task.id, JSON.stringify(task));
        liContainer.find('.controls').find('.done').remove();
        liContainer.css('border-left','solid 10px #5cb85c');
        e.preventDefault();
    });

    $(document).on("click", "a.edit", function (e) {

        var liContainer = $(this).parent().parent();

        liContainer.find('.task').attr("contentEditable","true");
        liContainer.addClass("current");
        liContainer.css('border-left','solid 10px #f0ad4e');

        if (liContainer.find('.controls').find('.done').length === 0 ) {
            liContainer.find('.controls').append("<a class='done' href='#'>Done</a>");
            liContainer.addClass("add");
        } else {
            liContainer.find('.controls').find('.done').remove();
            liContainer.css('border-left','solid 10px #f3a1a1');
            liContainer.removeClass("add");
            liContainer.find('.task').attr("contentEditable","false");
        }

        e.preventDefault();
    });

    function timer() {

        var clock, liContainer = $("#list");

        if (running === 0) {
            running = 1;
            started = new Date();
        }

        if (pause === 0) {
            sec = sec + 1;
            //If we stopped the timer
            if (timerStop === 1) {
                timerStop = 0;
                sec = 0;
                min = 0;
                hour = 0;
            }

            if (sec >= 59) {
                sec = 0;
                min = min + 1;
            }
            if (hour >= 24) {
                hour = 0;
                hour = hour + 1;
            }

            //Prettify the clock
            clock = prettyClock(hour,min,sec);

            //we are editing the current task
            if (liContainer.find('.controls').find('.done').length > 0 ) {
                //add old timestamp to current one
               if($(".current").find('.listHour').text() != "") {
                    var s,m,h;
                    h = $(".current").find('.listHour').text();
                    m = $(".current").find('.listMin').text();
                    s = $(".current").find('.listSec').text();
                    if($(".current.add").length != 0) {
                        $(".current").removeClass("add");
                        hour = parseInt(h) + hour;
                        min = parseInt(m) + min;
                        sec = parseInt(s) + sec;                            
                    }
                } 
                   
                $(".current").find('.listHour').text(clock.hour);
                $(".current").find('.listMin').text(clock.min);
                $(".current").find('.listSec').text(clock.sec);
                
            } else {
                document.getElementById('hour').innerHTML = clock.hour;
                document.getElementById('min').innerHTML = clock.min;
                document.getElementById('sec').innerHTML = clock.sec;
            }            
        }

        compte = setTimeout(function () {
            timer();
        }, 1000); //launch the timer

    }

    function prettyClock(hour,min,sec){
        var secStr = "", minStr = "", hourStr = "";
        if (hour === 0) {
            hourStr += "00 : ";
        } else {
            hourStr += ("0" + hour).slice(-2) + " : ";
        }
        if (min === 0) {
            minStr += "00 : ";
        } else {
            minStr += ("0" + min).slice(-2) + " : ";
        }
        if (sec === 0) {
            secStr += "00";
        } else {
            secStr += ("0" + sec).slice(-2);
        }

        var clockStr = {}
        clockStr.sec = secStr
        clockStr.min = minStr
        clockStr.hour = hourStr

        return clockStr;
    }

    function stop() {
        if (compte === 'undefined') {
            document.getElementById('message').innerHTML = "You must start before clicking on stop !";
            $("#message").fadeIn().delay(3000).fadeOut();
        } else {
            clearTimeout(compte);
            running = 0;
            pause = 1;
            timerStop = 1;

            document.getElementById('message').innerHTML = "Stopped !";
            $("#message").fadeIn().delay(3000).fadeOut();
        }
    }

    $('#start').click("on", function () {
        if (running === 0) {
            pause = 0;
            timer();
        } else {
            if (pause === 0) {
                clearInterval(compte);
                pause = 1;
                document.getElementById('message').innerHTML = "Paused !";
                $("#message").fadeIn().delay(3000).fadeOut();
            } else {
                pause = 0;
                compte = setInterval(timer(), 100);
            }
        }

    });

    $('#stop').click("on", function () {
        stop();
    });

    $('#addTask').click("on", function (e) {
        e.preventDefault();
        var timeSec,timeMin,timeHour;

        if ($("#task").val() === "") {
            document.getElementById('message').innerHTML = "You must add a new task before adding it ! <a class='close-notification right' href='#'>&times;</a>";
            $("#message").fadeIn();
        } else {
            var randomStr = "";

            randomStr = generateId();
            
            var content = {}, randomStr = "";

            content.timeHour = document.getElementById("hour").innerHTML;
            content.timeMin = document.getElementById("min").innerHTML;
            content.timeSec = document.getElementById("sec").innerHTML;
            content.label = $("#category").val();
            content.task = document.getElementById("task").value;

            createReminder(randomStr,JSON.stringify(content));

            $(".hide").last().fadeIn("fast");
            $("#task").val('');
        }
    });

    $('#delete').click("on", function () {
        deleteReminders();
        document.getElementById('message').innerHTML = "All items have been deleted ! <a class='close-notification right' href='#'>&times;</a>";
        $("#message").fadeIn();
        $("#list").empty().delay(2000).fadeOut("slow");

    });


    $('.select').click("on", function () {
        $('.sub-menu').toggle("slow");
    });

    //delete an item in the reminder
    $(document).on("click", "a.close", function (e) {
        e.preventDefault();
        deleteReminder($(this).parent().parent().attr("id"));
        $(this).parent().parent().fadeOut("slow", function () {
            $(this).remove();
        });
    });

    $(document).on("click", "a.close-notification", function (e) {
        e.preventDefault();
        $(this).parent().fadeOut("slow", function () {
            $(this).children().remove();
        });
    });

    //init 
    function init() {
        $('#task').focus();
        loadReminders();
    }

    init();
}());