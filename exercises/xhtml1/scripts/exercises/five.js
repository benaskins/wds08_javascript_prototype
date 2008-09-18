document.observe('dom:loaded', function() {
  $$('ul.accordian div.content').each( function(section) {
    section.hide();
  })
});

Event.addBehavior({
  'ul.accordian li h3:click': function(event) {
    // Find the content conainer for this section
    listItem = this.up();
    contentContainer = listItem.select('div.content')[0];
    // If it's visible, hide it.
    if (contentContainer.visible()) {
      contentContainer.removeClassName("expanded");
      contentContainer.slideUp();
    } 
    // Else, hide the currently expanded section, and expand the new selection.
    else {      
      if (expandedSection = $$('ul.accordian div.expanded')[0]) {
        expandedSection.removeClassName("expanded");
        expandedSection.slideUp();
      }
      contentContainer.addClassName("expanded");
      contentContainer.slideDown();
    }
  }
});
