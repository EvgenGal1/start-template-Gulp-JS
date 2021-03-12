jQuery.fn.jcOnPageFilter = function(settings) {
	settings = jQuery.extend({
		animateHideNShow:false,
		focusOnLoad:false,
		highlightColor:'',
		textColorForHighlights:'#000000',
		caseSensitive:false, //искать только в первом слове строки
		hideNegatives:true,
		addClassElems:false,
		addClassParent:false,
		addClassSection:false,
		parentSearchClass:'',
		parentSectionClass:'',
		parentLookupClass:'jcorgFilterTextParent',
		childBlockClass:'jcorgFilterTextChild',
	}, settings);
	jQuery.expr[':'].icontains = function(obj, index, meta) {                    
		return jQuery(obj).text().toUpperCase().indexOf(meta[3].toUpperCase()) >= 0;                
	}; 
	if(settings.focusOnLoad) {
	  jQuery(this).focus();
	}
	var rex = /(<span.+?>)(.+?)(<\/span>)/g;
	var rexAtt = "g";
	if(!settings.caseSensitive) {
	   rex = /(<span.+?>)(.+?)(<\/span>)/gi;
	   rexAtt = "gi";
	}
	return this.each(function() {
		jQuery(this).keyup(function(e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				return false;
			}
			else {
				
				function hideSection() {
					jQuery('.'+settings.parentLookupClass).closest('.'+settings.parentSectionClass).each(function() {
						var count = 0;
						var countElem = jQuery(this).closest('.'+settings.parentSectionClass).find('.'+settings.parentLookupClass).length;
						jQuery(this).find('.'+settings.parentLookupClass).each(function() {
							if (jQuery(this).css('display') == 'none') {
								++count;
							}
						});
						if (count == countElem) {
							if(settings.animateHideNShow) {
								jQuery(this).closest('.'+settings.parentSectionClass).fadeOut(100);
							}
							else {
								jQuery(this).closest('.'+settings.parentSectionClass).hide();
							}
						} else {
							if(settings.animateHideNShow) {
								jQuery(this).closest('.'+settings.parentSectionClass).fadeIn(100);
							}
							else {
								jQuery(this).closest('.'+settings.parentSectionClass).show();
							}
						}
					});
				}
				
				var textToFilter = jQuery(this).val();
				if (textToFilter.length > 0) {
					if(settings.hideNegatives) {
						//addClass
						if(settings.addClassElems) {
							jQuery('.'+settings.childBlockClass).removeClass('search-results');
						}
						if(settings.addClassParent) {
							jQuery('.'+settings.parentLookupClass).removeClass('search-results');
						}
						if(settings.addClassSection) {
							jQuery('.'+settings.parentSectionClass).removeClass('search-results');
						}
						if(settings.animateHideNShow) {
							if (settings.parentSearchClass != '') {
								jQuery('.'+settings.parentSearchClass).find('.'+settings.parentLookupClass).stop(true, true).fadeOut('slow');
							} else {
								jQuery('.'+settings.parentLookupClass).stop(true, true).fadeOut('slow');
							}
						}
						else {
							if (settings.parentSearchClass != '') {
								jQuery('.'+settings.parentSearchClass).find('.'+settings.parentLookupClass).stop(true, true).hide();
							} else {
								jQuery('.'+settings.parentLookupClass).stop(true, true).hide();
							}
						}
					}
					var _cs = "icontains";
					if(settings.caseSensitive) {
					  _cs = "contains";
					}
					//условие проверки области поиска
					if (settings.parentSearchClass != '') {
						var currentElem = jQuery('.'+settings.parentSearchClass).find('.'+settings.childBlockClass);
					} else {
						var currentElem = jQuery('.'+settings.childBlockClass);
					}
					jQuery.each(currentElem,function(i,obj) {
					  jQuery(obj).html(jQuery(obj).html().replace(new RegExp(rex), "$2"));  
					});
					//условие проверки области поиска
					if (settings.parentSearchClass != '') {
						var currentElem2 = jQuery('.'+settings.parentSearchClass).find('.'+settings.childBlockClass+":"+_cs+"(" + textToFilter + ")");
					} else {
						var currentElem2 = jQuery('.'+settings.childBlockClass+":"+_cs+"(" + textToFilter + ")");
					}
					jQuery.each(currentElem2,function(i,obj) {
						if(settings.hideNegatives) {
							if(settings.animateHideNShow) {
								//jQuery(obj).parent().stop(true, true).fadeIn('slow');
								//jQuery(obj).addClass('search-results').closest('.'+settings.parentLookupClass).stop(true, true).fadeIn('slow');
								if(settings.addClassElems) {
									jQuery(obj).addClass('search-results').closest('.'+settings.parentLookupClass).stop(true, true).fadeIn('slow');
								} else {
									jQuery(obj).closest('.'+settings.parentLookupClass).stop(true, true).fadeIn('slow');
								}
							}
							else {
								//jQuery(obj).parent().stop(true, true).show();
								//jQuery(obj).addClass('search-results').closest('.'+settings.parentLookupClass).stop(true, true).show();
								if(settings.addClassElems) {
									jQuery(obj).addClass('search-results').closest('.'+settings.parentLookupClass).stop(true, true).show();
								} else {
									jQuery(obj).closest('.'+settings.parentLookupClass).stop(true, true).show();
								}
							}
						}
						if(settings.addClassParent) {
							jQuery(obj).closest('.'+settings.parentLookupClass).addClass('search-results');
						}
						if(settings.addClassSection) {
							jQuery(obj).closest('.'+settings.parentSectionClass).addClass('search-results');
						}
						var newhtml = jQuery(obj).text();
						jQuery(obj).html(newhtml.replace(
						new RegExp(textToFilter, rexAtt), 
						function(match) {
							//return ["<span style='background:"+settings.highlightColor+";color:"+settings.textColorForHighlights+"'>", match, "</span>"].join("");
							return ["", match, ""].join("");
							//return ["<span>", match, "</span>"].join("");
						}));
						/*
						jQuery(obj).find('.searchable').each(function () {
							var $elem = $(this);
							$elem.html( $elem.text().replace(
							new RegExp(textToFilter, rexAtt), 
							function(match) {
								return ["<span style='background:"+settings.highlightColor+";color:"+settings.textColorForHighlights+"'>", match, "</span>"].join("");
							}));
						});*/
					});
					
					//вызов функции для оценки пустоты родителя
					if (settings.parentSectionClass != '') {
						if(settings.animateHideNShow) {
							setTimeout(hideSection, 1000);
						}
						else {
							hideSection();
						}
					}
					
				} else { //все стерли из строки
					//условие проверки области поиска
					if (settings.parentSearchClass != '') {
						var currentElem = jQuery('.'+settings.parentSearchClass).find('.'+settings.childBlockClass);
					} else {
						var currentElem = jQuery('.'+settings.childBlockClass);
					}
					jQuery.each(currentElem,function(i,obj) {
						var html = jQuery(obj).html().replace(new RegExp(rex), "$2");
						if(settings.addClassElems) {
							jQuery(obj).removeClass('search-results').html(html);
						} else {
							jQuery(obj).html(html);
						}
						if(settings.addClassParent) {
							jQuery(obj).closest('.'+settings.parentLookupClass).removeClass('search-results');
						}
						if(settings.addClassSection) {
							jQuery(obj).closest('.'+settings.parentSectionClass).removeClass('search-results');
						}
					});
					if(settings.hideNegatives) {
						//условие проверки области поиска
						if (settings.parentSearchClass != '') {
							if (settings.parentSectionClass != '') {
								var currentElem2 = jQuery('.'+settings.parentSearchClass).find('.'+settings.parentSectionClass);
							}
							var currentElem3 = jQuery('.'+settings.parentSearchClass).find('.'+settings.parentLookupClass);
						} else {
							if (settings.parentSectionClass != '') {
								var currentElem2 = jQuery('.'+settings.parentSectionClass);
							}
							var currentElem3 = jQuery('.'+settings.parentLookupClass);
						}
						
						if(settings.animateHideNShow) {
							if (settings.parentSectionClass != '') {
								currentElem2.stop(true, true).fadeIn('slow');
							}
							currentElem3.stop(true, true).fadeIn('slow');
						}
						else {
							if (settings.parentSectionClass != '') {
								currentElem2.stop(true, true).show();
							}
							currentElem3.stop(true, true).show();
						}
					}
				}
			}
		});
	});
};