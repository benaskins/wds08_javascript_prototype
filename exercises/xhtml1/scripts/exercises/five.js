document.observe('dom:loaded', function() {
  var rrAccordion = new fx.Accordion($$('ul.accordion h3'), $$('div.content'));
});
