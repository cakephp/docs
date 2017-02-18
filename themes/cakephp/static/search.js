App = window.App || {};

App.Search = (function () {
  var searchInput,
    base = App.InlineSearch.baseUrl,
    searchResults,
    limit = 25,
    paginationContainer;

    var urldecode = function(x) {
      return decodeURIComponent(x).replace(/\+/g, ' ');
    };
/**
 * This function returns the parsed url parameters of the
 * current request. Multiple values per key are supported,
 * it will always return arrays of strings for the value parts.
 */
  var getQueryParameters = function(s) {
    if (typeof s == 'undefined') {
      s = document.location.search;
    }
    var parts = s.substr(s.indexOf('?') + 1).split('&');
    var result = {};
    for (var i = 0; i < parts.length; i++) {
      var tmp = parts[i].split('=', 2);
      var key = urldecode(tmp[0]);
      var value = urldecode(tmp[1]);
      if (key in result) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
    }
    return result;
  };

  function executeSearch(value, page) {
    var query = {lang: window.lang, q: value, version: App.config.version};
    if (page) {
      query.page = page;
    }
    var url = App.config.url + '?' + jQuery.param(query);

    showPendingSearch();
    var xhr = $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET'
    });

    xhr.done(function (response) {
      var results;
      searchResults.empty().append('<ul></ul>');
      results = response.data.slice(0, limit);
      createResults(results);
      createPagination(response.total, response.page);
    });
  }

  var delay = (function () {
    var timer;
    return function delay(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    }
  }());

  function showPendingSearch() {
    searchResults.empty().append('<ul><li>Searching...</li></ul>');
  }

  /**
   * Generate the result HTML.
   */
  function createResults(results) {
      var ul = searchResults.find('ul');
      if (results.length === 0) {
        ul.append('<li>No matches found</li>');
        return;
      }
      $.each(results, function(index, item) {
        var li = $('<li></li>');
        var link = $('<a></a>');
        link.attr('href', base + item.url);
        if (item.title) {
          link.append('<strong>' + item.title + '</strong><br />');
        }
        var span = $('<span></span>');
        span.text(item.contents.join("\n"));
        link.append(span);
        li.append(link);
        ul.append(li);
      });
  }

  /**
   * Create the pagination links for a result set.
   */
  function createPagination(total, page) {
    var element, i;
    var pages = Math.floor(total / limit);

    paginationContainer.empty();

    for (i = 1; i <= pages; i++) {
      element = $('<a href="#"></a>');
      element.text(i);
      element.attr('page', i);
      if (i == page) {
        element.addClass('active');
      }
      paginationContainer.append(element);
    }
  };

  var init = function () {
    searchInput = $('.standalone-search .search-input');
    searchResults = $('#search-results');
    paginationContainer = $('#search-pagination');

    // Handle key up on the input box.
    searchInput.bind('keyup', function(event) {
      delay(function () {
        searchResults.empty();
        executeSearch(searchInput.val(), 1);
      }, 200);
    });

    // Handle clickin on pagination links
    paginationContainer.delegate('a', 'click', function (event) {
      var active = $(event.target);
      var page = active.attr('page');
      event.preventDefault();

      $('html,body').animate({scrollTop: 0}, 200);
      executeSearch(searchInput.val(), page);
    });

    var params = getQueryParameters();
    if (params.q) {
      searchInput.val(params.q).trigger('keyup');
    }
  };

  return {
    init: init
  };
})();

$(document).ready(App.Search.init);
