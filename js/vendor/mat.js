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
    var saveReminder = function (id, content) {
        localStorage.setItem(id, content);
    };

    //create the saved list of reminders
    function createReminder(id, content) {
        var task = jQuery.parseJSON(content);
        document.getElementById("list").innerHTML += "<li id=" +
             id + " class='saved hide'><span class='task'>" +
             task.task + "</span><span class='timeConsumed'> " +
             task.timestamp + '</span> <span class="label">' +
             task.label + '</span><a href="#" class="close right">&times;</a></li>';
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
        if (e.which === 13) {
            e.preventDefault();

            var task = document.getElementById("task").value, label = "", timeConsumed = "", randomStr = "";

            label = $("#category").val();
            timeConsumed = document.getElementById("timer").innerHTML;
            randomStr = generateId();
            document.getElementById("list").innerHTML += "<li id=" + randomStr + " class='hide'><span class='task'>" +
                task + " </span><span class='timeConsumed'> " +
                timeConsumed + '</span> <span class="label">' +
                label + '</span><a href="#" class="close right">&times;</a>' + "</li>";
            $(".hide").last().fadeIn("fast");
            $("#task").val('');
        }
    });

    //save and toggle the categories
    $('#category').on('keyup', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            var category = document.getElementById("category").value;
            document.getElementById("menu-category").innerHTML += "<li class='hide'><a class='category-choice' href='#'>" + category + "</a></li>";
            $("#menu-category > li.hide").last().fadeIn("slow");
            $("#category").val('');
        }
    });

    $(document).on("click", "a.category-choice", function (e) {
        $("#category").val($(this).text());
        $('.sub-menu').toggle("slow");
        e.preventDefault();
    });

    //save a reminder on click the button save
    $(document).on("click", "#save", function (e) {
        if ($('#list li').length !== 0) {
            e.preventDefault();
            $.each($('#list li'), function (key, value) {
                var task = {};
                task.id = $(value).attr('id');
                task.key = key;
                task.task = value.getElementsByClassName('task')[0].innerHTML;
                task.label = value.getElementsByClassName('label')[0].innerHTML;
                if (value.getElementsByClassName('timeConsumed')[0].innerHTML !== "undefined") {
                    task.timestamp = value.getElementsByClassName('timeConsumed')[0].innerHTML;
                } else {
                    task.timestamp = "00:00:00";
                }
                saveReminder(task.id, JSON.stringify(task));
                document.getElementById('message').innerHTML = "Lists is saved ! <a class='close-notification right' href='#'>&times;</a>";
                $("#message").fadeIn();

            });
        } else {
            document.getElementById('message').innerHTML = "You have to add new tasks in order to save them ! <a class='close-notification right' href='#'>&times;</a>";
            $("#message").fadeIn();
        }
    });

    function timer() {

        var clock = "";

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
            if (hour === 0) {
                clock += "00 : ";
            } else {
                clock += ("0" + hour).slice(-2) + " : ";
            }
            if (min === 0) {
                clock += "00 : ";
            } else {
                clock += ("0" + min).slice(-2) + " : ";
            }
            if (sec === 0) {
                clock += "00";
            } else {
                clock += ("0" + sec).slice(-2);
            }

            document.getElementById('timer').innerHTML = clock;

        }

        compte = setTimeout(function () {
            timer();
        }, 1000); //launch the timer

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

        if ($("#task").val() === "") {
            document.getElementById('message').innerHTML = "You must add a new task before adding it ! <a class='close-notification right' href='#'>&times;</a>";
            $("#message").fadeIn();
        } else {
            var task = document.getElementById("task").value, hour = "", min = "", sec = "", label = "", timeConsumed = "", randomStr = "";
            hour = document.getElementById("hour").innerHTML;
            min = document.getElementById("min").innerHTML;
            sec = document.getElementById("sec").innerHTML;

            label = $("#category").val();
            timeConsumed = hour + min + sec;
            randomStr = generateId();
            document.getElementById("list").innerHTML += "<li id=" + randomStr + " class='hide'><span class='task'>" +
                task + " </span><span class='timeConsumed'> " +
                timeConsumed + '</span> <span class="label">' +
                label + '</span><a href="#" class="close right">&times;</a>' + "</li>";
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
        deleteReminder($(this).parent().attr("id"));
        $(this).parent().fadeOut("slow", function () {
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