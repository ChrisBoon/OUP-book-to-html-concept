$(window).load(function(){



  function makeSameHeight(item){
    var tallest = 0;
    item.each(function() {
      if ($(this).height() > tallest) {
        tallest = $(this).height();
      }
    });
    item.css("height", tallest);
  }

  var contentItem = $(".sub_section");
  makeSameHeight(contentItem);


});