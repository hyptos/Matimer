
        var cent = 0 // initialise les dixtièmes
        var sec = 0 //initialise les secdes
        var min = 0 //initialise les mintes
        var hour = 0 //initialise les mintes
        var pause = 0
        var running = 0
        var save = 0;

        //after enter save a new element
        $('#task').on('keyup', function(e) {
            if (e.which == 13) {
                e.preventDefault();

                var task = document.getElementById("task").value;
                var hour = document.getElementById("hour").innerHTML;
                var min = document.getElementById("min").innerHTML;
                var sec = document.getElementById("sec").innerHTML;

                var label = $("#category").val();
                timeConsumed = hour + min + sec;
                randomStr = generateId();
                document.getElementById("list").innerHTML += "<li id="+randomStr+" class='hide'><span class='task'>" + 
                task + " </span><span class='timeConsumed'> " +  
                timeConsumed +'</span> <span class="label">'+
                label+'</span><a href="#" class="close right">&times;</a>' + "</li>" ;
                var nb = $( this ).width() + 300;
                $(".hide").last().fadeIn("fast");
                $( "#task" ).val('');
            }
        });

        //save and toggle the categories
        $('#category').on('keyup', function(e) {
            if (e.which == 13) {
                e.preventDefault();
                var category = document.getElementById("category").value;
                document.getElementById("menu-category").innerHTML += "<li class='hide'><a class='category-choice' href='#'>" + category + "</a></li>" ;
                $("#menu-category > li.hide").last().fadeIn("slow");
                $( "#category" ).val('');

            }
        });

        $( document ).on( "click", "a.category-choice", function(e) {  
            $( "#category" ).val($( this ).text());
            $('.sub-menu').toggle("slow");
            e.preventDefault();
        });

        //save a reminder on click the button save
        $( document ).on( "click", "#save", function(e) { 
        if ($('#list li').length != 0) {
            $.each( $('#list li'), function( key, value ) {              
                var task = new Object();
                task.id = $(value).attr('id');
                task.task = value.getElementsByClassName( 'task' )[0].innerHTML
                task.label = value.getElementsByClassName( 'label' )[0].innerHTML
                if(value.getElementsByClassName( 'timeConsumed' )[0].innerHTML != "undefined"){
                    task.timestamp = value.getElementsByClassName( 'timeConsumed' )[0].innerHTML   
                }
                else{
                    task.timestamp = "00:00:00"
                }
                saveReminder(task.id, JSON.stringify(task));
                document.getElementById('message').innerHTML = "Lists is saved ! <a class='close-notification right' href='#'>&times;</a>";
                $("#message").fadeIn();

            });
        }else{
            document.getElementById('message').innerHTML = "You have to add new tasks in order to save them ! <a class='close-notification right' href='#'>&times;</a>";
            $("#message").fadeIn();
        }
        });

        //load all the reminders from the browser storage
        var loadReminders = function(){
            if(localStorage.length!==0){
                for(var key in localStorage){
                    var text = localStorage.getItem(key);
                    if(key.indexOf('MAT-F-') == 0){
                        createReminder(key,text );
                    }
                }
                $("#list > li.hide").fadeIn("fast");
            }
        };

        //create the saved list of reminders
        var createReminder = function(id, content, index){
            var task = jQuery.parseJSON( content );
            document.getElementById("list").innerHTML += "<li id="+
            id+" class='saved hide'><span class='task'>" + 
            task.task + " </span><span class='timeConsumed'> " +  
            task.timestamp +'</span> <span class="label">'+
            task.label +'</span><a href="#" class="close right">&times;</a></li>' ;
        }



        function timer() {

            if (running == 0) {
                running = 1;               
            }

            if (pause == 0){
                cent++;
            }

            if (cent > 9) {
                cent = 0;
                sec++
            }
            if (sec > 59) {
                sec = 0;
                min++;
            }
            if (hour > 24) {
                hour = 0;
                hour++;
            }

            if(sec == 0){
                sec = "00"
            }else{
                sec = ("0" + sec).slice(-2);
            }            
            if(min == 0){
                min = "00"
            } else{
                sec = ("0" + min).slice(-2);
            }         
            if(hour == 0){
                hour = "00"
            }else{
                sec = ("0" + hour).slice(-2);
            }

            document.getElementById('sec').innerHTML = ": " + sec;
            document.getElementById('min').innerHTML = ": " + min;
            document.getElementById('hour').innerHTML = hour;


            if (running = 1 && pause == 0) {
                document.getElementById('message').innerHTML = "Running ! <a class='close-notification right' href='#'>&times;</a>"
            }

            compte = setTimeout('timer()', 100) //la fonction est relancée 
        }

        function stop() {
            if (typeof compte != 'undefined') {
                clearTimeout(compte) //stop the timer
                cent = "00";
                sec = "00";
                min = "00";
                hour = "00";

                running = 0;
                pause = 1

                document.getElementById('sec').innerHTML = ": " + sec;
                document.getElementById('min').innerHTML = ": " + min;
                document.getElementById('hour').innerHTML = hour;

                document.getElementById('message').innerHTML = "Stopped ! <a class='close-notification right' href='#'>&times;</a>"

            } else {
                document.getElementById('message').innerHTML = "You must start before clicking on stop ! <a class='close-notification right' href='#'>&times;</a>"
                $("#message").fadeIn();
            }
        }

        $('#start').click("on", function() {
            if (running == 0) {
                pause = 0
                timer();
            } else {
                if (pause == 0) {
                    pause = 1;
                    clearInterval(compte);
                    document.getElementById('message').innerHTML = "Paused ! <a class='close-notification right' href='#'>&times;</a>"
                } else {
                    pause = 0;
                    compte = setInterval(timer(), 100)
                }
            }

        })

        $('#stop').click("on", function() {
            stop();
        })

        $('#addTask').click("on", function(e) {
                e.preventDefault();

                if($("#task").val() == ""){
                    document.getElementById('message').innerHTML = "You must add a new task before adding it ! <a class='close-notification right' href='#'>&times;</a>"
                    $("#message").fadeIn();
                }else{

                    var task = document.getElementById("task").value;
                    var hour = document.getElementById("hour").innerHTML;
                    var min = document.getElementById("min").innerHTML;
                    var sec = document.getElementById("sec").innerHTML;

                    var label = $("#category").val();
                    timeConsumed = hour + min + sec;
                    randomStr = generateId();
                    document.getElementById("list").innerHTML += "<li id="+randomStr+" class='hide'><span class='task'>" + 
                    task + " </span><span class='timeConsumed'> " +  
                    timeConsumed +'</span> <span class="label">'+
                    label+'</span><a href="#" class="close right">&times;</a>' + "</li>" ;
                    var nb = $( this ).width() + 300;
                    $(".hide").last().fadeIn("fast");
                    $( "#task" ).val('');
                }
        })

         $('#delete').click("on", function() {
            deleteReminders();
            document.getElementById('message').innerHTML = "All items have been deleted ! <a class='close-notification right' href='#'>&times;</a>" ;
            $("#message").fadeIn();
        })


        $('.select').click("on", function() {
            $('.sub-menu').toggle("slow");
        })

        //delete an item in the reminder
        $( document ).on( "click", "a.close", function(e) {
          e.preventDefault()
          deleteReminder($( this ).parent().attr("id"))
          $( this ).parent().fadeOut("slow",function(){
                $( this ).remove();
          })
        });

        $( document ).on( "click", "a.close-notification", function(e) {
          e.preventDefault()
            $( this ).parent().fadeOut("slow",function(){
            $( this ).children().remove();
          })
        });

        //generates a unique id
        function generateId(){
            return "MAT-" + Foundation.utils.random_str(6);    
        }

        //saves an item to localStorage
        var saveReminder = function(id, content){
            localStorage.setItem(id, content);
        };

        //delete a specified item from localStorage
        var deleteReminder = function(id){
            localStorage.removeItem(id);
        };

        //delete all items in localStorage
        var deleteReminders = function(){
             var keys = [];
              for(var key in localStorage){ 
                 if(key.indexOf('MAT-F-') == 0){
                   localStorage.removeItem(key);
                 }
              }              
        }

        //init 
        var init = function(){
               $('#task').focus();
               loadReminders();
        };

        init();
       