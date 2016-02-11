/**
 * 
 */

(function( $ ){
	var defaults ={
	    		format: 'HH:mm:ss',
	    		type: 'time',
	    		height: 44,
	    		firstdigit: 'last',
	    		control: 'sbPanelControl',
	    		digitBoxClass: 'digit-box',
	    		digitPlaceClass: 'digit-place',
	    		digitClass: 'digit',
	    		digitSpacerClass: 'digit-spacer'
	        };
	var settings = {};
	
    // convert to internalformat DP(Digit Place) / SP (Separator)
    function dpFormat(format){
    	return format.replace(/[HhMmYySs]/g, 'd');
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
    	    return $('<div />').addClass(settings.digitPlaceClass).attr('id', 'digit-place-' + id).append(
    				$('<div />').addClass(settings.digitClass).attr({
    					id: 'digit-' + id,
    					style: 'top:' + (-44 * parseInt(settings.value[id])) + 'px;'
    				})
    		);
    	} else {
    		return $('<div />').addClass(settings.digitSpacerClass).addClass(settings.digitSpacerClass + '-' + separators[dp]);
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

    	    	//console.log('init method' + $(this).attr('id'));
        	    
        	    return this.each(function() {        
        	        // Тут пишем код плагина tooltip
        	    	var ele = $(this),
        	    	    data = ele.data('sbPanel'),
        	    	    control = ele.find('input');
        	    	
        	    	if(!data) {
              	    	// Создаём настройки по-умолчанию, расширяя их с помощью параметров, которые были переданы
            	    	settings = $.extend(settings, options);

            	    	if(settings.format === 'HH:mm:ss' && !settings.value) {
                	    	settings.value = new Date().toLocaleTimeString();
                	    } 

            	    	//console.log('init data: data inject');
        	    		ele.data('sbPanel', {
        	    			target: ele,
        	    			settings: settings 
        	    		});
        	    		control = $('<input />').attr({
        	    			type: 'hidden',
        	    			id: settings['control'],
        	    			value: settings['value']
        	    		});
        	    		control.change(methods.changeControl);
        	    		ele.empty().append(control);
        	    		parseFormat(ele, settings.format);
        	    		//console.log('init data: data is:');
        	    		//console.log(ele);
        	    	}
        	    	data_sets = ele.data('sbPanel').settings;
        	    	control.attr('value');
        	    	//console.log(data_sets);
        	      });

    	    },
    	    
	        // change
    	    changeControl : function(event) {
    	    	//console.log($(this).attr('id') + ' change method ' + event.currentTarget.value);
    	    	settings.value = event.currentTarget.value;
    	    	methods.refresh.apply(this.parentElement);
    	    },
    	    
	        // get
    	    get : function( ) {
    	    	//console.log($(this).attr('id') + ' get method ');
    	    	return $(this).find("#" + settings.control).val();
    	    },
    	    
	        // getFormat
    	    getFormat : function( ) {
    	    	console.log($(this).attr('id') + ' getFormat method ' + settings.format);
    	    	return settings.format;
    	    },
    	    
	        // refresh
    	    refresh : function( ) {
        	    console.log($(this).attr('id') + ' refresh method ' + settings.value + ' format ' + settings.format);
      	    	for(var i = 0; i < settings.format.length; i++) {
      	    		var j = (settings.firstdigit == 'last') ? settings.format.length - 1 - i : i;
      	    		if(dpFormat(settings.format[j]) == 'd') {
      	    			$(this).find('#digit-' + j).css("top", (-44 * parseInt(settings.value[j])));
      	    			console.log("j=" + j + " -> " + settings.value[j] + " " + settings.format[j]);
      	    		}
      	    	}
    	    },
    	    
    	    update : function( content ) {
    	      // update ()
      	      console.log($(this).attr('id') + ' update method ' + content.value);
      	      var newdata = {};
      	      if(typeof content != 'object') { 
      	    	  newdata.value = content; 
      	      } else {
      	    	  newdata = $.extend({}, content);
      	      } 
      	      if(newdata.value.length == settings.format.length) {
      	    	  $(this).find("#" + settings.control).attr('value', newdata.value);
      	    	  settings.value = newdata.value;
      	    	  methods.refresh.apply(this);
      	      } 
    	    },
    	    
    	    destroy : function( ) {

    	        return this.each(function(){
    	          $(this).find("#"+settings.control).unbind();
    	        })

    	    }
    };

    
    $.fn.sbPanel = function( method ) {  

    	settings = $.extend({}, defaults, (this.data('sbPanel')?this.data('sbPanel').settings:{}));
    	
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
          } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
          } else {
            $.error( 'Метод с именем ' +  method + ' не существует для jQuery.sbPanel' );
          }    

  };
})( jQuery );