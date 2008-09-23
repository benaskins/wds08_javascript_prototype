var SlideManager = Class.create({
  initialize: function() {
    this.isPresenting = true;
    this.currentSlide = 0;
    this.slides       = $$('.slide');
    this.totalSlides  = this.slides.size();
    this.idAllSlides();
    this.createControls();
    this.scaleFonts();
    if (!Prototype.Browser.Opera) {
      this.isNotForOpera();      
    }
  },

  // Give every slide a unique id
  idAllSlides: function() {
    this.slides.each( function(slide, index) {
      slide.writeAttribute("id", "slide" + index);
    })    
  },

  // Create navigation controls 
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
  
  scaleFonts: function() {
  	if (this.isPresenting) {
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
  
  updateFooter: function() {
  	var cs       = $('currentSlide')
  	cs.innerHTML = '<span id="csHere">' + this.currentSlide + '</span> ' + 
                   '<span id="csSep">\/<\/span> ' + 
                   '<span id="csTotal">' + (this.totalSlides-1) + '<\/span>';
  	if (this.currentSlide == 0) {
  		cs.style.visibility = 'hidden';
  	} else {
  		cs.style.visibility = 'visible';
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
  	if (!this.slideCSS().disabled) {
  		this.slideCSS().disabled   = true;
  		this.outlineCSS().disabled = false;
  		this.isPresenting          = false;
      this.setFontSizes('1em');
      this.slides.each( function(slide) {
        slide.setStyle("visibility", "visible");
      })
  	} else {
  		this.slideCSS().disabled   = false;
  		this.outlineCSS().disabled = true;
  		this.isPresenting          = true;
  		this.setFontSizes(this.presentingFontSize);
      this.slides.each( function(slide) {
        slide.setStyle("visibility", "hidden");
      })
      this.showCurrentSlide();
  	}
  },
  
  slideCSS: function() {
    return $('slideProj');
  },
  
  outlineCSS: function() {
    return $('outlineStyle');
  }

})

document.observe('dom:loaded', function() {
  slideManager    = new SlideManager();
  window.onresize = function() {
    setTimeout('slideManager.scaleFonts()', 50);
  }
})

Event.addBehavior({
  'body:click': function(event) {
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
  }

});

