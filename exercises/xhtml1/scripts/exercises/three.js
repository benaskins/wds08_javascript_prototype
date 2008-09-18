document.observe('dom:loaded', function() {
  new Autocompleter.Local('autocomplete-input', 'autocomplete-container', aCountries);
})