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
