Event.addBehavior({
  '#button-colour:click': function(event) {
    $('changeme').morph({color:'#ff0000'}, { queue: 'end' });
    $('changeme').morph({color:'#00ff00'}, { queue: 'end' });
    $('changeme').morph({color:'#0000ff'}, { queue: 'end' });
    return false;
  },
  '#button-size:click': function(event) {
    $('changeme').morph({fontSize:'4.0em'}, { queue: 'end' });
    $('changeme').morph({fontSize:'1.0em'}, { queue: 'end' });
    return false;
  },
  '#button-both:click': function(event) {
    $('changeme').morph({fontSize:'4.0em', color:'#ff0000'}, { queue: 'end' });
    $('changeme').morph({fontSize:'1.0em', color:'#00ff00'}, { queue: 'end' });
    $('changeme').morph({fontSize:'4.0em', color:'#0000ff'}, { queue: 'end' });
    $('changeme').morph({fontSize:'1.0em', color:'#000000'}, { queue: 'end' });
    return false;
  }  
});
