App = {};
 
App.Book = (function() {

	function init() {

		// Make top nav responsive.
		$('#cakephp-global-navigation ul').responsiveMenu();

		// Make side navigation go into a lightbox.
		$('#tablet-nav').bind('click', function (e) {
			e.preventDefault();

			// Squirt the nav into the modal.
			var contents = $('#sidebar-navigation').html();
			var modal = $('#nav-modal').html(contents);
			modal.append('<a href="#" class="close-reveal-modal">&#215;</a>');
			modal.reveal({
				animation: 'fade'
			});
		});

		// Display page contents
		$('#page-contents-button').bind('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			$('#page-contents').fadeIn('fast');
		});

		var hideContents = function (e) {
			$('#page-contents').fadeOut('fast');
		};
	
		$(document).bind('click', hideContents);
		$(document).bind('keyup', function (e) {
			if (e.keyCode == 27) {
				hideContents();
			}
		});
	}
 
	function compare_scores(a, b) {
		return b.score - a.score;
	}
 
	return {
		init : init
	}
})();

// Inline search form, and standalone search form.
App.Book.Search = (function () {

	var segments = location.pathname.split('/');
	var base = '/' + segments.slice(1, segments.length - 2).join('/') + '/';
	var searchResults;
	var searchInput;
	var searchUrl = 'http://localhost/docs_search/search';

	var delay = (function(){
		var timer = 0;
		return function(callback, ms){
			clearTimeout(timer);
			timer = setTimeout(callback, ms);
		};
	})();

	var positionElement = function (to, element) {
		var position = to.offset();
		var height = to.outerHeight();
		var width = to.outerWidth();

		element.css({
			position: 'absolute',
			top: position.top + height + 'px',
			left: position.left + 'px',
			width: width + 'px'
		});
	};

	var handleKeyEvent = function (event) {
		if ($(this).val() === '') {
			searchResults.fadeOut('fast');
		} else {
			var _this = $(this);
			delay(function() {
				positionElement(_this, searchResults);
				searchResults.show();
				doSearch(_this.val());
			}, 200);
		}
	};

	// escape key
	var handleEscape = function (event) {
		if (event.keyCode == 27 && searchInput.val() === '') {
			searchResults.fadeOut('fast');
		}
	};

	var doSearch = function (value) {
		var url = searchUrl + '?lang=en&q=' + encodeURIComponent(value);
		var xhr = $.ajax({
			url: url,
			dataType: 'json',
			type: 'GET'
		});

		xhr.done(function (response) {
			searchResults.empty().append('<ul></ul>');
			var results = response.data.slice(0, 10);
			$.each(results, function(index, item) {
				searchResults.find('ul').append(
					"<li><a href='" + base + item.url + "'>" + 
					item.contents.join("\n") + "</a></li>");
			});
		});

	};

	var init = function () {
		searchInput = $('.search-input');
		searchResults = $('#inline-search-results');

		searchInput.keyup(handleKeyEvent);
		$(document).keyup(handleEscape);
	};

	return {
		init: init
	};
})();


function levenshtein (s1, s2) {
	  // http://kevin.vanzonneveld.net
	  // +			  original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
	  // +			  bugfixed by: Onno Marsman
	  // +			   revised by: Andrea Giammarchi (http://webreflection.blogspot.com)
	  // + reimplemented by: Brett Zamir (http://brett-zamir.me)
	  // + reimplemented by: Alexander M Beedie
	  // *				  example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
	  // *				  returns 1: 3

	if (s1 == s2) {
		return 0;
	}

	var s1_len = s1.length;
	var s2_len = s2.length;
	if (s1_len === 0) {
		return s2_len;
	}
	if (s2_len === 0) {
		return s1_len;
	}

	// BEGIN STATIC
	var split = false;
	try{
		split=!('0')[0];
	} catch (e){
		split=true; // Earlier IE may not support access by string index
	}
	// END STATIC
	if (split){
		s1 = s1.split('');
		s2 = s2.split('');
	}

	var v0 = new Array(s1_len+1);
	var v1 = new Array(s1_len+1);

	var s1_idx=0, s2_idx=0, cost=0;
	for (s1_idx=0; s1_idx<s1_len+1; s1_idx++) {
		v0[s1_idx] = s1_idx;
	}
	var char_s1='', char_s2='';
	for (s2_idx=1; s2_idx<=s2_len; s2_idx++) {
		v1[0] = s2_idx;
		char_s2 = s2[s2_idx - 1];

		for (s1_idx=0; s1_idx<s1_len;s1_idx++) {
			char_s1 = s1[s1_idx];
			cost = (char_s1 == char_s2) ? 0 : 1;
			var m_min = v0[s1_idx+1] + 1;
			var b = v1[s1_idx] + 1;
			var c = v0[s1_idx] + cost;
			if (b < m_min) {
				m_min = b; }
			if (c < m_min) {
				m_min = c; }
			v1[s1_idx+1] = m_min;
		}
		var v_tmp = v0;
		v0 = v1;
		v1 = v_tmp;
	}
	return v0[s1_len];
}

// qs_score - Quicksilver Score
// 
// A port of the Quicksilver string ranking algorithm
// 
// "hello world".score("axl") //=> 0.0
// "hello world".score("ow") //=> 0.6
// "hello world".score("hello world") //=> 1.0
//
// Tested in Firefox 2 and Safari 3
//
// The Quicksilver code is available here
// http://code.google.com/p/blacktree-alchemy/
// http://blacktree-alchemy.googlecode.com/svn/trunk/Crucible/Code/NSString+BLTRRanking.m
//
// The MIT License
// 
// Copyright (c) 2008 Lachie Cox
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


String.prototype.score = function(abbreviation,offset) {
  offset = offset || 0 // TODO: I think this is unused... remove
 
  if(abbreviation.length == 0) return 0.9
  if(abbreviation.length > this.length) return 0.0

  for (var i = abbreviation.length; i > 0; i--) {
	var sub_abbreviation = abbreviation.substring(0,i)
	var index = this.indexOf(sub_abbreviation)


	if(index < 0) continue;
	if(index + abbreviation.length > this.length + offset) continue;

	var next_string		  = this.substring(index+sub_abbreviation.length)
	var next_abbreviation = null

	if(i >= abbreviation.length)
	  next_abbreviation = ''
	else
	  next_abbreviation = abbreviation.substring(i)
 
	var remaining_score   = next_string.score(next_abbreviation,offset+index)
 
	if (remaining_score > 0) {
	  var score = this.length-next_string.length;

	  if(index != 0) {
		var j = 0;

		var c = this.charCodeAt(index-1)
		if(c==32 || c == 9) {
		  for(var j=(index-2); j >= 0; j--) {
			c = this.charCodeAt(j)
			score -= ((c == 32 || c == 9) ? 1 : 0.15)
		  }

		  // XXX maybe not port this heuristic
		  // 
		  //		  } else if ([[NSCharacterSet uppercaseLetterCharacterSet] characterIsMember:[self characterAtIndex:matchedRange.location]]) {
		  //			for (j = matchedRange.location-1; j >= (int) searchRange.location; j--) {
		  //			  if ([[NSCharacterSet uppercaseLetterCharacterSet] characterIsMember:[self characterAtIndex:j]])
		  //				score--;
		  //			  else
		  //				score -= 0.15;
		  //			}
		} else {
		  score -= index
		}
	  }
   
	  score += remaining_score * next_string.length
	  score /= this.length;
	  return score
	}
  }
  return 0.0
}

// http://stackoverflow.com/questions/967096/using-jquery-to-test-if-an-input-has-focus
jQuery.extend(jQuery.expr[':'], {
	focus: function(element) { 
		return element == document.activeElement; 
	}
});

// Create a responsive design menu.
(function($) {
	$.fn.responsiveMenu = function(options) {
		var defaults = {
			autoArrows: false,
			width: 768
		}

		options = $.extend(defaults, options);
		return this.each(function() {
			var $this = $(this);
			var $window = $(window);
			var setClass = function() {
				if ($window.width() > options.width) {
					$this.addClass('dropdown').removeClass('accordion');
				} else {
					$this.addClass('accordion').removeClass('dropdown');
				}
			}

			$window.resize(function() {
				setClass();
				$this.children('ul').css('display', 'none');
			});

			setClass();
			$this
				.addClass('responsive-menu')
				.find('a')
					.live('click', function(e) {
						var $a = $(this);
						var container = $a.next('ul,div');
						if ($this.hasClass('accordion') && container.length > 0) {
							container.slideToggle();
							return false;
						}
					})
					.stop()
					.siblings('ul').parent('li').addClass('hasChild');

			if (options.autoArrows) {
				$('.hasChild > a', $this)
					.append('<span class="arrow">&nbsp;</span>');
			}
		});
	}
})(jQuery);
	

$(App.Book.init);
$(App.Book.Search.init);
