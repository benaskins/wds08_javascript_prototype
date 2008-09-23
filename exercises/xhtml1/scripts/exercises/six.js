var SlideManager = Class.create({
  
  initialize: function() {
    this.isPresenting = true;
    this.currentSlide = 0;
    this.loadSlides();
    this.idAllSlides();
    this.windowManager = new WindowManager(this);
  },

  // Load and Identify Slides

  loadSlides: function() {
    this.slides      = $$('.slide');
    this.totalSlides = this.slides.size();    
  },

  idAllSlides: function(reload) {
    if (reload) {
      this.loadSlides();
    }
    this.slides.each( function(slide, index) {
      slide.writeAttribute("id", "slide" + index);
    })    
  },
  
  // Slide Navigation
  
  nextSlide: function() {
    if ((this.currentSlide + 1) < this.totalSlides) {
      this.gotoSlide(this.currentSlide + 1);      
    }
  },

  prevSlide: function() {
    if (this.currentSlide > 0) {
      this.gotoSlide(this.currentSlide - 1);      
    }
  },

  gotoSlide: function(slideNo) {
    this.hideCurrentSlide();
    this.currentSlide = slideNo;
    this.showCurrentSlide();
    this.updateFooter();
  },

  // Slide Visibility

  showCurrentSlide: function() {
    this.showSlide(this.currentSlide);
  },

  showSlide: function(slideNo) {
    $("slide" + slideNo).setStyle({visibility: "visible"});
  },
  
  hideCurrentSlide: function() {
    this.hideSlide(this.currentSlide);
  },

  hideSlide: function(slideNo) {
    $("slide" + slideNo).setStyle({visibility: "hidden"});    
  },
  
  // Toggle Between Modes
  
  startPresenting: function() {
    this.isPresenting = true;
    this.disableSorting();
    this.disableEditing();
    this.updateFooter();
    this.showCurrentSlide();
  },
  
  stopPresenting: function() {
    this.isPresenting = false;
    this.enableSorting(this);
    this.enableEditing();
  },

  // Sorting

  enableSorting: function(manager) {
    Sortable.create(
      "slidecontainer", 
      {
        tag: "div",
        onChange: function(slide) {
          manager.idAllSlides(true);
        }
      }
    );
  },
  
  disableSorting: function() {
    Sortable.destroy("slidecontainer");
  },

  // Editing

  enableEditing: function() {
    var editors = [];
    $$(".slide h1, .slide h2, .slide h3, .slide h4, .slide li, .slide .handout").each( function(slide) {
      editors.push(new Ajax.InPlaceEditor(slide, "/edit", {okControl: "link", cancelControl: false}));
    });
    this.editors = editors;
  },
  
  disableEditing: function() {
    this.editors.each( function(editor) {
      editor.dispose();
    });
  },
    
  // Insert New Slide
  
  newSlide: function() {
    $('slidecontainer').insert(
       '<div class="slide"> \
          <h1>[slide title]</h1> \
          <ul> \
            <li>[point one]</li> \
            <li>[point two]</li> \
            <li>[point three]</li> \
            <li>[point four]</li> \
            <li>[point five]</li> \
          </ul> \
          <div class="handout"> \
            [any material that should appear in print but not on the slide] \
          </div> \
        </div>'    
    );
    this.idAllSlides(true);
    this.disableEditing();
    this.enableEditing();
  },
  
  //Delegation
  
  scaleFonts: function() {
    this.windowManager.scaleFonts();
  },

  togglePresenter: function() {
    this.windowManager.togglePresenter();
  },

  updateFooter: function() {
    this.windowManager.updateFooter();
  }

});

var WindowManager = Class.create({
  initialize: function(slideManager) {
    this.slideManager = slideManager;
    this.createControls();
    this.scaleFonts();
    if (!Prototype.Browser.Opera) {
      this.isNotForOpera();      
    }
  },

  // Create Controls
  
  createControls: function() {
    this.createNavigationControls();
    this.createOutlineToolbar();
  },
  
  createNavigationControls: function() {
    $('controls').insert('<form action="#" id="controlForm"> \
                      	    <div id="navLinks"> \
                      	      <a accesskey="t" id="showoutline">&#216;</a> \
                      	      <a accesskey="z" id="prev">&laquo;</a> \
                      	      <a accesskey="x" id="next">&raquo;</a> \
                      	    </div> \
                      	  </form>');
  },

  createOutlineToolbar: function() {
    $('toolbar').insert('<ul id="actions"> \
                      	   <li><a id="newslide" href="#">New Slide</a></li> \
                      	   <li><a id="slideshow" href="#">Slide Show</a></li> \
                      	 </ul>');
  },

  // Font Scaling

  scaleFonts: function() {
  	var vScale  = 22;
  	var hScale  = 32;
  	var vSize   = document.viewport.getHeight();
  	var hSize   = document.viewport.getWidth();
  	var newSize = Math.min(Math.round(vSize/vScale),Math.round(hSize/hScale));
  	this.presentingFontSize = newSize + 'px';
  	this.setFontSizes(this.presentingFontSize);
    if (Prototype.Browser.Gecko) {  // hack to counter incremental reflow bugs
     var body           = document.getElementsByTagName('body')[0];
     body.style.display = 'none';
     body.style.display = 'block';
    }
  },
  
  setFontSizes: function(size) {
    if (!(s5ss = $('s5ss'))) {
  		if (Prototype.Browser.IE) {
  			document.createStyleSheet();
  			document.s5ss = document.styleSheets[document.styleSheets.length - 1];
  		} else {
  			$$('head')[0].insert(s5ss = document.createElement('style'));
  			s5ss.writeAttribute('media','screen, projection');
  			s5ss.writeAttribute('id','s5ss');
  		}
  	}
  	if (Prototype.Browser.IE) {
  		document.s5ss.addRule('body','font-size: ' + size + ' !important;');
  	} else {
  		while (s5ss.lastChild) s5ss.removeChild(s5ss.lastChild);
  		s5ss.appendChild(document.createTextNode('body {font-size: ' + size + ' !important;}'));
  	}
  },
  
  isNotForOpera: function() {
  	var slideCSSLink = this.slideCSS().href;
  	this.slideCSS().setAttribute('media', 'screen');
  	this.outlineCSS().disabled = true;
  	if (Prototype.Browser.Gecko) {
  		this.slideCSS().setAttribute('href', 'null');   // Gecko fix
  		this.slideCSS().setAttribute('href', slideCSSLink); // Gecko fix
  	}
  	if (Prototype.Browser.IE && document.styleSheets && document.styleSheets[0]) {
  		document.styleSheets[0].addRule('img', 'behavior: url(ui/default/iepngfix.htc)');
  		document.styleSheets[0].addRule('div', 'behavior: url(ui/default/iepngfix.htc)');
  		document.styleSheets[0].addRule('.slide', 'behavior: url(ui/default/iepngfix.htc)');
  	}
    
  },
  
  togglePresenter: function() {
  	if (this.slideCSS().disabled) {
  	  // Presenting
  		this.outlineCSS().disabled = true;
  		this.slideCSS().disabled   = false;
  		this.setFontSizes(this.presentingFontSize);
      this.slideManager.slides.each( function(slide) {
        slide.style.visibility = "hidden";
        // Reset styles left over by Scriptaculous Sortable
        slide.style.position   = null;
        slide.style.zIndex     = null;
        slide.style.top        = null;
        slide.style.left       = null;        
      })
  		this.slideManager.startPresenting();
  	} else {
  	  // Outline
  		this.slideCSS().disabled   = true;
  		this.outlineCSS().disabled = false;
      this.setFontSizes('1em');
      this.slideManager.slides.each( function(slide) {
        slide.style.visibility = "visible";
      })
      this.slideManager.stopPresenting();
  	}
  },
  
  slideCSS: function() {
    return $('slideProj');
  },
  
  outlineCSS: function() {
    return $('outlineStyle');
  },
  
  // Update Footer
  
  updateFooter: function() {
  	var cs       = $('currentSlide')
  	cs.innerHTML = '<span id="csHere">' + this.slideManager.currentSlide + '</span> ' + 
                   '<span id="csSep">\/<\/span> ' + 
                   '<span id="csTotal">' + (this.slideManager.totalSlides-1) + '<\/span>';
  	if (this.currentSlide == 0) {
  		cs.style.visibility = 'hidden';
  	} else {
  		cs.style.visibility = 'visible';
  	}    
  }
  
});

// Kick it all off

document.observe('dom:loaded', function() {
  slideManager    = new SlideManager();
  window.onresize = function() {
    setTimeout('slideManager.scaleFonts()', 50);
  }
});

// Behaviour

Event.addBehavior({
  'html:click': function(event) {
    if (slideManager.isPresenting) {
      slideManager.nextSlide();      
    }
    return false;      
  },
  '#next:click': function(event) {
    if (slideManager.isPresenting) {
      slideManager.nextSlide();
    }
    return false;
  },
  '#prev:click': function(event) {
    if (slideManager.isPresenting) {
      slideManager.prevSlide();
    }
    return false;
  },
  '#showoutline:click, #slideshow:click': function(event) {
    slideManager.togglePresenter();
    return false;
  },
  '#newslide:click': function(event) {
    slideManager.newSlide();
    return false;
  }
});

