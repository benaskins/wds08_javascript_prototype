Event.addBehavior({
  '#easel img:mouseover': function(event) {
    this.writeAttribute('src', '../graphics/scriptaculous/mouseover.jpg');      
  },
  '#easel img:mouseout': function(event) {
    this.writeAttribute('src', '../graphics/clear.gif');
  }  
});
