Paginator
#########

The Pagination helper is used to output pagination controls such as page
numbers and next/previous links.

See also :doc:`/The-Manual/Common-Tasks-With-CakePHP/Pagination` for additional information.

Methods
=======

options($options = array())

-  mixed options() Default options for pagination links. If a string is
   supplied - it is used as the DOM id element to update. See #options
   for list of keys.

options() sets all the options for the Paginator Helper. Supported
options are:

**format**

Format of the counter. Supported formats are 'range' and 'pages' and
custom which is the default. In the default mode the supplied string is
parsed and tokens are replaced with actual values. The available tokens
are:

-  %page% - the current page displayed.
-  %pages% - total number of pages.
-  %current% - current number of records being shown.
-  %count% - the total number of records in the result set.
-  %start% - number of the first record being displayed.
-  %end% - number of the last record being displayed.

Now that you know the available tokens you can use the counter() method
to display all sorts of information about the returned results, for
example:

::


    echo $paginator->counter(array(
            'format' => 'Page %page% of %pages%, 
                         showing %current% records out of %count% total, 
                         starting on record %start%, ending on %end%'
    )); 

**separator**

The separator between the actual page and the number of pages. Defaults
to ' of '. This is used in conjunction with format = 'pages'

**url**

The url of the paginating action. url has a few sub options as well

-  sort - the key that the records are sorted by
-  direction - The direction of the sorting. Defaults to 'ASC'
-  page - The page number to display

**model**

The name of the model being paginated.

**escape**

Defines if the title field for links should be HTML escaped. Defaults to
true.

**update**

The DOM id of the element to update with the results of AJAX pagination
calls. If not specified, regular links will be created.

**indicator**

DOM id of the element that will be shown as a loading or working
indicator while doing AJAX requests.

link($title, $url = array(), $options = array())

-  string $title - Title for the link.
-  mixed $url Url for the action. See Router::url()
-  array $options Options for the link. See options() for list of keys.

Creates a regular or AJAX link with pagination parameters

::

    echo $paginator->link('Sort by title on page 5', 
            array('sort' => 'title', 'page' => 5, 'direction' => 'desc'));

If created in the view for ``/posts/index`` Would create a link pointing
at '/posts/index/page:5/sort:title/direction:desc'
