if (/cakephp\.org/.test(document.domain)) {
	document.domain = 'cakephp.org';
}

App = {};
App.config = {
	url: 'http://search.cakephp.org/search',
	version: '3-0'
};

App.Book = (function() {
	function init() {
		// Make top nav responsive.
		$('#cakephp-global-navigation').menuSelect({'class': 'nav-select'});

		// Make side navigation go into a lightbox.
		$('#tablet-nav').bind('click', function (e) {
			e.preventDefault();

			// Squirt the nav and page contents into the modal.
			var contents = $('#sidebar-navigation').html();
			var localToc = $('.page-contents').html();
			var modal = $('#nav-modal').html(contents);
			modal.append(localToc);
			modal.append('<a href="#" class="close-reveal-modal">&#215;</a>');
			modal.reveal({
				animation: 'fade'
			});
		});

		// Make dropdowns work with keyboard input.
		var dropdown = $('.dropdown');
		dropdown.find('> a').bind('focus', function () {
			$(this).parents('.dropdown').find('ul').show();
		});
		dropdown.find('li:last-child a').bind('blur', function () {
			$(this).parents('.dropdown').find('ul').css('display', '');
		});

		// Show back to contents button.
		var backToTop = $('#back-to-contents'),
			contents = $('#page-contents'),
			doc = $(document),
			offset = contents.offset(),
			sidebarHeight = contents.height(),
			showing = false;

		var positionBackToTop = function() {
			if (offset === undefined) {
				return;
			}
			if (!showing && doc.scrollTop() > offset.top + sidebarHeight) {
				showing = true;
				backToTop.css({
					position: 'fixed',
					top: 20,
					left: 20,
					display:' block'
				});
			} else if (showing && doc.scrollTop() <= offset.top + sidebarHeight) {
				showing = false;
				backToTop.css({
					display:'none'
				});
			}
		};

		backToTop.bind('click', function(evt) {
			$('html,body').animate({scrollTop: offset.top}, 200);
			return false;
		});

		doc.bind('scroll', function() {
			positionBackToTop();
		});
	}

	return {
		init : init
	};
})();

// Inline search form, and standalone search form.
App.InlineSearch = (function () {
	var base = location.href.replace(location.protocol + '//' + location.host, '').split('/').slice(0, 2).join('/') + '/';

	// Track the last search value
	var lastValue;

	// Send the query to search app and get results.
	var doSearch = function (value, syncResults, asyncResults) {
		var query = {lang: window.lang, q: value, version: App.config.version};
		var url = App.config.url + '?' + jQuery.param(query);

		lastValue = value;

		var xhr = $.ajax({
			url: url,
			dataType: 'json',
			type: 'GET'
		});
		xhr.done(function (response) {
			asyncResults(response.data);
		});
	};

	var init = function () {
		var input = $('.masthead .search-input');
		input.typeahead(
			{minLength: 3, hint: false, highlight: true},
			{
				name: 'es',
				source: doSearch,
				async: true,
				limit: 10,
				templates: {
					empty: '<div class="empty-result">No matches found</div>',
					suggestion: function(item) {
						var div = $('<div></div>');
						var link = $('<a></a>');
						link.attr('href', base + item.url);
						if (item.title) {
							link.append('<strong>' + item.title + '</strong><br />');
						}
						var span = $('<span></span>');
						var text = item.contents;
						if (text.join) {
							text = text.join("\n");
						}
						span.text(text);
						div.append(link.append(span));
						return div.html();
					}
				}
			}
		);

		// When a search completes, poke GA.
		input.on('typeahead:idle', function () {
			var _gaq = _gaq || [];
			_gaq.push(['_trackEvent', 'Search', 'Search in ' + window.lang, lastValue]);
		});

		// 'click' the link.
		input.on('typeahead:select', function(event, suggestion) {
			input.typeahead('val', suggestion.title);
			window.location = base + suggestion.url;
			return false;
		});

		// update the input preview so it doesn't contain a blob of JSON.
		input.on('typeahead:cursorchange', function(event, suggestion) {
			input.parents('.twitter-typeahead').find('.tt-input').val(suggestion.title);
		});
	};

	return {
		init: init,
		baseUrl: base
	};
})();


// http://stackoverflow.com/questions/967096/using-jquery-to-test-if-an-input-has-focus
jQuery.extend(jQuery.expr[':'], {
	focus: function(element) {
		return element == document.activeElement;
	}
});

(function ($) {
var defaults = {
	'class': ''
};
$.fn.menuSelect = function (options) {
	options = $.extend({}, defaults, options || {});

	// Append the li & children to target.
	var appendOpt = function (li, target, prefix) {
		li = $(li);
		prefix = prefix || '';

		if (li.find('> ul').length) {
			prefix = li.find('> a').text() + ' - ';
			li.find('li').each(function () {
				appendOpt(this, target, prefix);
			});
		} else {
			var a = li.find('a');
			opt = $('<option />', {
				text: prefix + a.text(),
				value: a.attr('href')
			});
			target.append(opt);
		}
	};

	// Convert the ul + li elements into
	// an optgroup + option elements.
	var convert = function (element) {
		var select = $('<select />', options);
		select.appendTo(element);
		var option = $('<option />', {
			text: 'Go to..',
			selected: 'selected'
		});
		select.append(option);

		$(element).find('> ul > li').each(function () {
			var opt, optgroup;
			var li = $(this);
			if (li.find('ul').length > 0) {
				optgroup = $('<optgroup />', {
					label: li.find('> a').text()
				});
				select.append(optgroup);
				li.find('> ul > li').each(function () {
					appendOpt(this, optgroup);
				});
			} else {
				appendOpt(li, select);
			}
		});

		var handleChange = function (event) {
			window.location = $(this).val();
		};

		select.bind('change', handleChange);
	};

	return this.each(function () {
		convert(this);
	});
};
} (jQuery));


(function($){
	"use strict";
/* ********************* Helper functions ********************* */

	/* Validate function */
	function validate(data, def) {
		return (data !== undefined) ? data : def;
	}

	var $win = $(window),

		$body = $('body'),

		// Window width without scrollbar
		$windowWidth = $win.width(),

		// Media Query fix (outerWidth -- scrollbar)
		// Media queries width include the scrollbar
		mqWidth = $win.outerWidth(true, true),

		// Detect Mobile Devices 
		isMobileDevice = (( navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|IEMobile|Opera Mini|Mobi/i) || (mqWidth < 767) ) ? true : false );

		// detect IE browsers
		var ie = (function(){
			var rv = 0,
				ua = window.navigator.userAgent,
				msie = ua.indexOf('MSIE '),
				trident = ua.indexOf('Trident/');

			if (msie > 0) {
					// IE 10 or older => return version number
					rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
			} else if (trident > 0) {
					// IE 11 (or newer) => return version number
					var rvNum = ua.indexOf('rv:');
					rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
			}

			return ((rv > 0) ? rv : 0);
		}());

/* ********************* Megamenu ********************* */
	var menu = $(".menu"),
		Megamenu = {
			desktopMenu: function() {

				menu.children("li").show(0);
				menu.children(".toggle-menu").hide(0);

				// Mobile touch for tablets > 768px
				if (isMobileDevice) {
					menu.on("click touchstart","a", function(e){
						if ($(this).attr('href') === '#') {
							e.preventDefault();
							e.stopPropagation();
						}

						var $this = $(this),
							$sub = $this.siblings(".submenu, .megamenu");

						$this.parent("li").siblings("li").find(".submenu, .megamenu").stop(true, true).fadeOut(300);

						if ($sub.css("display") === "none") {
							$sub.stop(true, true).fadeIn(300);
						} else {
							$sub.stop(true, true).fadeOut(300);
							$this.siblings(".submenu").find(".submenu").stop(true, true).fadeOut(300);
						}
					});

					$(document).on("click.menu touchstart.menu", function(e){
						if ($(e.target).closest(menu).length === 0) {
							menu.find(".submenu, .megamenu").fadeOut(300);
						}
					});
					
				// Desktop hover effect
				} else {
					menu.find('li').on({
						"mouseenter": function() {
							$(this).children(".submenu, .megamenu").stop(true, true).fadeIn(300);
						},
						"mouseleave": function() {
							$(this).children(".submenu, .megamenu").stop(true, true).fadeOut(300);
						}
					});
				}
			},

			mobileMenu: function() {
				var $children = menu.children("li"),
					$toggle = menu.children("li.toggle-menu"),
					$notToggle = $children.not("toggle-menu");

				$notToggle.hide(0);
				$toggle.show(0).on("click", function(){

					if ($children.is(":hidden")){
						$children.slideDown(300);
					} else {
						$notToggle.slideUp(300);
						$toggle.show(0);
					}
				});

				// Click (touch) effect
				menu.find("li").not(".toggle-menu").each(function(){
					var $this = $(this);
					if ($this.children(".submenu, .megamenu").length) {
						$this.children("a").on("click", function(e){
							if ($(this).attr('href') === '#') {
								e.preventDefault();
								e.stopPropagation();
							}

							var $sub = $(this).siblings(".submenu, .megamenu");

							if ($sub.hasClass("open")) {
								$sub.slideUp(300).removeClass("open");
							} else {
								$sub.slideDown(300).addClass("open");
							}
						});
					}
				});
			},
			unbindEvents: function() {
				menu.find("li, a").off();
				$(document).off("click.menu touchstart.menu");
				menu.find(".submenu, .megamenu").hide(0);
			}
		}; // END Megamenu object

	if ($windowWidth < 768) {
		Megamenu.mobileMenu();
	} else {
		Megamenu.desktopMenu();
	}

/* ********************* Vertical / Fullscreen Menu ********************* */
	// Vertical / Fullscreen Menu Trigger
	$('#menu-trigger').on("click",function() {

		if ($(this).hasClass('fullscreen-trigger')) {
			$(".fullscreen-menu-wrapper").toggleClass("on");
		} else if ($(this).hasClass("top-menu-trigger")) {
			$(".top-menu-wrapper").toggleClass("on");
		} else {
			$(".vertical-menu-wrapper").toggleClass("on");
			$(".vertical-menu-footer").toggleClass("on");
		}

		$(this).toggleClass("menu-close");
		return false;
	});

/* ********************* Fixed Header ********************* */
	function fixedHeader() {
		$(".main-header").sticky({ 
			topSpacing: 0,
			className:"menu-fixed"
		});
	}
	if ( (!$('.static-menu').length) && ($windowWidth > 991) && (!isMobileDevice) ) {
		fixedHeader();
	}
});

$(document).ready(App.Book.init);
$(document).ready(App.InlineSearch.init);
