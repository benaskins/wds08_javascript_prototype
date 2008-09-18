Element.addMethods({
  morph_chain: function(element, states) {
    states.each( function(state) {
      $(element).morph(state, {queue: 'end'});
    })
  }
})

Event.addBehavior({
  '#button-colour:click': function(event) {
    $('changeme').morph_chain([
      {color:'#ff0000'}, 
      {color:'#00ff00'}, 
      {color:'#0000ff'}
    ]);
    return false;
  },
  '#button-size:click': function(event) {
    $('changeme').morph_chain([
      {fontSize:'4.0em'}, 
      {fontSize:'1.0em'}
    ]);
    return false;
  },
  '#button-both:click': function(event) {
    $('changeme').morph_chain([
      {fontSize:'4.0em', color:'#ff0000'},
      {fontSize:'1.0em', color:'#00ff00'},
      {fontSize:'4.0em', color:'#0000ff'},
      {fontSize:'1.0em', color:'#000000'}
    ]);
    return false;
  }  
});
