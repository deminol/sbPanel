/**
 * 
 */

(function( $ ){
	var defaultHeight = 44,
	    defaultControlId = 'sbPanelControl',
	    defaults ={
	    		format: 'HH:mm:ss',
	    		type: 'time',
	    		height: defaultHeight,
	    		firstdigit: 'last',
	    		digitBoxClass: 'digit-box',
	    		digitPlaceClass: 'digit-place',
	    		digitClass: 'digit',
	    		digitSpacerClass: 'digit-spacer'
	        },
	    settings = {};
	
    // convert to internalformat DP(Digit Place) / SP (Separator)
    function dpFormat(format){
    	return format.replace(/[HhMmYySsD]/g, 'd');
    }

    // get Diget Place 
    function getDP (dp, id) {
    	var separators = {
    			'/': 'slash',
    			'.': 'point',
    			'-': 'dash',
    			':': 'colon',
    			',': 'comma'
    	};
    	
    	if(dp === 'd') {	
    	    return $('<div />').addClass(settings.digitPlaceClass)
    	    					.attr('id', 'digit-place-' + id).append(
    				$('<div />').addClass(settings.digitClass)
    							.attr({id: 'digit-' + id})
    							.css ({top: (-defaultHeight * parseInt(settings.value[id])) })
    	    		);
    	} else {
    		return $('<div />').addClass(settings.digitSpacerClass)
    							.addClass(settings.digitSpacerClass + '-' + separators[dp]);
    	}
    }
    
    
    // parse format
    function parseFormat(el, format) {
    	for(var i = 0; i < format.length; i++) {
    		el.append(getDP(dpFormat(format[i]),i));
    	}
    }
    
    
	// Plugin's Methods
    var methods = {
	    	// init method
    	    init : function( options ) { 

    	    	return this.each(function() {        
          	    	// Get settings 
        	    	settings = $.extend({}, defaults, settings, options);

    	    		var ele = $(this),
        	    	    data = ele.data('sbPanel'),
        	    	    control = (settings.control) ? settings.control : null;
        	    	
        	    	if(!data) {

        	    		ele.empty();

        	    		if(settings.format === 'HH:mm:ss' && !settings.value) {
                	    	settings.value = new Date().toLocaleTimeString();
                	    } 

        	    		if(!control) {
        	    			control = $('<input />').attr({
            	    			type: 'hidden',
            	    			id: defaultControlId,
            	    			value: settings.value
            	    		});
        	    			ele.append(control);
        	    		} else {
        	    			settings.value = $(control).val();
        	    		}
        	    		control.data('sbPanel',{digitBox:ele});
        	    		settings.control = control;
        	    		control.change(methods.changeControl);
        	    		//control.wrap('<div />');
        	    		
        	    		ele.data('sbPanel', {
        	    			target: ele,
        	    			settings: settings 
        	    		});
        	    		parseFormat(ele, settings.format);
        	    	}
        	    	$(control).attr('value');
        	      });

    	    },
    	    
	        // change
    	    changeControl : function(event) {
    	    	var e = $(this).data('sbPanel').digitBox;
    	    	settings = e.data('sbPanel').settings;
    	    	settings.value = event.currentTarget.value;
    	    	methods.refresh.apply(e);
    	    },
    	    
	        // get
    	    get : function( ) {
    	    	return $(settings.control).val();
    	    },
    	    
	        // getFormat
    	    getFormat : function( ) {
    	    	return settings.format;
    	    },
    	    
	        // refresh
    	    refresh : function( ) {
      	    	for(var i = 0; i < settings.format.length; i++) {
      	    		var j = (settings.firstdigit == 'last') ? settings.format.length - 1 - i : i;
      	    		if(dpFormat(settings.format[j]) == 'd') {
      	    			$(this).find('#digit-' + j).css("top", (-defaultHeight * parseInt(settings.value[j])));
      	    		}
      	    	}
    	    },
    	    
    	    update : function( content ) {
    	      // update ()
    	    	return this.each(function() {
    	    		  var newdata = {};
    	    	
		      	      if(typeof content != 'object') { 
		      	    	  newdata.value = content; 
		      	      } else {
		      	    	  newdata = $.extend({}, content);
		      	      } 
		      	      if(newdata.value.length) {
		      	    	  $(settings.control).attr('value', newdata.value);
		      	    	  settings.value = newdata.value;
		      	    	  methods.refresh.apply(this);
		      	      }
    	    	});
    	    },
    	    
    	    destroy : function( ) {

    	        return this.each(function(){
    	          settings.control.unbind();
    	        })

    	    }
    };

    
    $.fn.sbPanel = function( method ) {  

    	settings = (this.data('sbPanel')?this.data('sbPanel').settings:{});
    	
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
          } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
          } else {
            $.error( 'Method ' +  method + ' undefined in jQuery.sbPanel' );
          }    

  };
})( jQuery );