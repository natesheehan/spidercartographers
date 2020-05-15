$(function() {
  $("#container").scrollStory();
});

$('#container').scrollStory({
    triggerOffset: 250
});


$(".next").click(function(event) {
  event.preventDefault();
  $("html,body").animate(
    {
      scrollTop: $(this)
        .parents()
        .next()
        .offset().top
    },
    "slow"
  );
});

$(".backtotop").click(function() {
  $("html,body").animate({ scrollTop: $("html,body").offset().top }, "slow");
});
