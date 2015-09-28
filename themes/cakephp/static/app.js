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

$(document).ready(App.Book.init);
$(document).ready(App.InlineSearch.init);
