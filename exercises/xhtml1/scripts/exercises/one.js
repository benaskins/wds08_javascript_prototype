Event.addBehavior({
  '#easel > div:mouseover': function(event) {
    if ($('rick') == null) {
      this.update("<img id='rick' src='../graphics/scriptaculous/mouseover.jpg'");      
    }
  },
  '#easel > div:mouseout': function(event) {
    this.update("<img src='../graphics/clear.gif'");
  }  
});
