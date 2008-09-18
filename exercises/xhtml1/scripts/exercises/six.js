var images = [
  "../graphics/jquery/mouseover.jpg",
  "../graphics/yui/mouseover.jpg",
  "../graphics/scriptaculous/mouseover.jpg",
  "../graphics/javascript/mouseover.jpg"
]

function wait(ms) {
  var date = new Date();
  var curDate = null;
  
  do { curDate = new Date() } while(curDate - date < ms);
}

Event.addBehavior({
  '#button-fade:click': function(event) {
    images.each( function(image) {
      $('rick').morph({opacity:'0'}, { queue: 'end' });
      $('rick').morph({opacity:'1'}, { queue: 'end' });
      setTimeout("$('rick').writeAttribute('src','" + image + "')", 2500);      
      wait(2000);
    });
    return false;
  }  
});
