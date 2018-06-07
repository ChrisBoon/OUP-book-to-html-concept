$(window).load(function(){

  //function for making page controls inactive when appropriate
  var checkNavButtons = function(){
    $(".page_controls li").removeClass("inactive_button already_graded");
    if(currentPage == 0){
      $(".page_controls_to_prev").addClass("inactive_button");
    }
    if(currentPage == lessonCount){
      $(".page_controls_to_next").addClass("inactive_button");
    }
    if( $(".active_lesson").data('grading') == "no"){
      $(".page_controls_to_gradepage").addClass("inactive_button");
    }
    if( $(".active_lesson").data('send') == "no"){
      $(".page_controls_to_evernote, .page_controls_to_email, .page_controls_to_print").addClass("inactive_button");
    }
    if( $(".active_lesson").data('graded') == "yes"){
      $(".page_controls_to_gradepage").addClass("already_graded");
    }
  };

  //function for checking current page/lesson variable matches localstorage value
  var updateCurrentPage = function(){
    currentPage = localStorage.getItem("q_rw_3_u1_currentpage");
  }

  //function for adding correct note to page
  var showPageNote = function(){
    var callNote = "q_rw_3_u1_note_"+currentPage.toString();
    var callNoteStore = localStorage[callNote];
    $(".the_actual_note textarea").val(callNoteStore);
  }

  //count number of lessons in unit
  var lessonCount = $(".lesson").length;
  lessonCount = lessonCount - 1;

  //hide all pages on load
  $(".lesson").hide();
  //check to see which page is to be viewed and display it
  if (localStorage.getItem("q_rw_3_u1_currentpage") == null){
    localStorage.setItem("q_rw_3_u1_currentpage", "0");
  }
  var currentPage = localStorage.getItem("q_rw_3_u1_currentpage");
  $('.lesson:eq('+currentPage+')').addClass("active_lesson").show();
  $('.page_thumbs li:eq('+currentPage+')').addClass("active_lesson_thumb");
  checkNavButtons();
  showPageNote();
  
  //use next and back to navigate
  $(".page_controls_to_next").click(function(){
    currentPage = parseInt(currentPage);
    if(currentPage < lessonCount){
      $(".active_lesson").removeClass("active_lesson").hide().next(".lesson").show().addClass("active_lesson");
      $('.active_lesson_thumb').removeClass("active_lesson_thumb").next("li").addClass("active_lesson_thumb");
      $('html, body').animate({ scrollTop: 0 }, 0);
      var newCurrentPage = currentPage + 1;
      localStorage.setItem("q_rw_3_u1_currentpage", newCurrentPage);
    };
    updateCurrentPage();
    checkNavButtons();
    showPageNote();
    pauseAllAudio();
  })

  $(".page_controls_to_prev").click(function(){
    currentPage = parseInt(currentPage);
    if(currentPage > 0){
      $(".active_lesson").removeClass("active_lesson").hide().prev(".lesson").show().addClass("active_lesson");
      $('.active_lesson_thumb').removeClass("active_lesson_thumb").prev("li").addClass("active_lesson_thumb");
      $('html, body').animate({scrollTop:0}, 'fast');
      var newCurrentPage = currentPage - 1;
      localStorage.setItem("q_rw_3_u1_currentpage", newCurrentPage);
    };
    updateCurrentPage();
    checkNavButtons();
    showPageNote();
    pauseAllAudio();
  })

  //use page thumbs to navigate
  // note '$(this).index()<3' requirement used for demo to prevent clicks on thumbs with no pages associated
  $('.page_thumbs li').click(function(){
    if (!$(this).hasClass("active_lesson_thumb") && $(this).index()<3){
      var skipToPage = $(this).index();
      $(".active_lesson_thumb").removeClass("active_lesson_thumb");
      $(".active_lesson").removeClass("active_lesson").hide();
      $(this).addClass("active_lesson_thumb");
      $('.lesson:eq('+skipToPage+')').show().addClass("active_lesson");
      $('html, body').animate({scrollTop:0}, 'fast');
      localStorage.setItem("q_rw_3_u1_currentpage", skipToPage);
      updateCurrentPage();
      checkNavButtons();
      showPageNote();
      pauseAllAudio();
    };
  });


  //allows horizontal scroll for page thumbs
  function makeWider(container,content){
    var sum = 0;
    content.each(function(){sum += $(this).width()});
    container.css('width', sum);
  };

  function revealContent(button,content){
    button.click(function() {
      $(this).toggleClass("active");
      content.toggle();
    });
  };



  //Scrolls page controls
  $(function() {
    if($("html").hasClass("no-touch")){
      var nav_container = $(".page_controls_container");
      var nav = $(".page_controls");
      nav_container.waypoint({
        handler: function(event, direction) {
          nav.toggleClass('sticky', direction=='down');
          if (direction == 'down')
            nav_container.css({ 'height':nav.outerHeight() });
          else
            nav_container.css({ 'height':'auto' });
        }
      });
    }
  });


    $(".page_controls>h1").click(function() {
      $(this).toggleClass("active");
      $(".contents_navigation").toggle();
      makeWider($(".page_thumbs"),$(".page_thumbs li"));
    });

  //grading - need to create reusable functions and objects to make code lighter
  $(".page_controls_to_gradepage:not(.inactive_button)").click(function(){
    if($(this).hasClass("already_graded")){
      alert("Page already graded");
    }
    else{
      var markLessons = $(".active_lesson .interactivity");
      markLessons.each(function(){
        if( $(this).hasClass("multiple_choice") ){
          var eachQuestion = $(".custom_question");
          var theGrade = 0;
          var graded = "yes";
          eachQuestion.each(function(){
            var studentAnswer = $(this).find('input[type=radio]:checked');
            if(studentAnswer.attr('value') == undefined){
              graded = "no"
              return false;
            };
            if(studentAnswer.data('correct') == "yes"){
              studentAnswer.parent('label').addClass('is_correct');
              theGrade = theGrade + 1;
            };
            if(studentAnswer.data('correct') == undefined){
              studentAnswer.parent('label').addClass('is_incorrect');
            };

          });
          if (graded == "yes"){
            markLessons.css({'pointer-events': 'none'}).find(".activity_grade").addClass("graded").html("<span class='userscore'>"+theGrade+"</span><span class='totalscore'> "+eachQuestion.length+"</span>");
            $(".page_controls_to_gradepage").addClass("already_graded");
            $(".active_lesson").data('graded', "yes");
          }

          if (graded == "no"){
              markLessons.find("label").removeClass("is_correct is_incorrect");
              alert("Please answer all questions before grading");
          }
        }
      });
    }
  });

  //page notes
  var checkNotes = function(){
    var n;
    for(n=0; n<=lessonCount; n++){
      var storageName = "q_rw_3_u1_note_"+n;
      if (localStorage.getItem(storageName) == null){
        localStorage.setItem(storageName, "");
      }
    }
  }
  checkNotes();

  $(".the_actual_note textarea").keyup(function(){
    var saveNoteTo = "q_rw_3_u1_note_"+currentPage.toString();
    var noteContent = $(this).val();
    localStorage.setItem(saveNoteTo, noteContent);
  });

  $(".this_page_note").hide();
  revealContent($(".page_controls_to_addnote"),$(".this_page_note"));

  //play audio
  var allAudioEls = $('audio');

    function pauseAllAudio() {
       allAudioEls.each(function() {
          var a = $(this).get(0);
          a.pause();
          a.currentTime = 0;
          $(this).parents(".audio_play").removeClass('playing');
       });
    }

  $(".audio_play").each(function(){
    var container = $(this);
    var sound= container.find('audio');

    container.click(function() { 
      if($(this).hasClass("playing")){
      pauseAllAudio();
      }
      else{
        pauseAllAudio();
        sound.get(0).play();

        sound.bind('play',function(){
          container.addClass('playing'); 
        });

        sound.bind('ended',function(){
          container.removeClass('playing'); 
        });        
      }

    });
  });


//reveal menu on mobile phones
  revealContent($(".course_controls_h1"),$(".course_controls"));

});