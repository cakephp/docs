Paginator
#############

.. php:class:: PaginatorHelper

The Pagination helper is used to output pagination controls such as
page numbers and next/previous links.

See also :doc:`/core-libraries/components/pagination` for additional information.

Methods
=======

.. php:method:: options($options = array())

    :param mixed $options: Default options for pagination links. If a
       string is supplied - it is used as the DOM id element to update.

    Sets all the options for the Paginator Helper. Supported options are:

    **url**
    The url of the paginating action. url has a few sub options as
    well

    -  sort - the key that the records are sorted by
    -  direction - The direction of the sorting. Defaults to 'ASC'
    -  page - The page number to display
    
    Example::

        <?php
        $this->Paginator->options(array(
            'url' => array(
                'sort' => 'email','direction' => 'desc', 'page' => 6
            )
        ));
        ?>

    When using your own custom routes you will need to manually add the params
    to the url options array. For example, let's say you want to paginate the
    result with the url 'matches/worldcups/brazil' which maps to a results
    action on a matches controller. This is a way of preserving those params
    on every pagination link.::
        
        <?php 
        $this->Paginator->options(array('url' => 
                array('controller' => 'matches', 'action' => 'results', 
                      'worldcups', 'brazil')));
        ?>

    .. note::

        Do not forget to set the url params when using custom routes. If you
        want to keep those params on all pagination links.

    **escape**
    Defines if the title field for links should be HTML escaped.
    Defaults to true.

    **update**
    The DOM id of the element to update with the results of AJAX
    pagination calls. If not specified, regular links will be created.::

        <?php
        $this->Paginator->options('update' => '#content');
        ?>

    And please check how easy it is to implement :ref:`ajax-pagination` on
    CakePHP.

    .. note::

        Do not miss the # character when setting the id of the DOM element,
        otherwise content will not replaced on the element you set.

    **model**
    The name of the model being paginated, defaults to 
    PaginatorHelper::defaultModel().

.. php:method:: counter($options = array())

    Returns a counter string for the paged result set.
    
    Supported ``$options`` are:

    **format**
    Format of the counter. Supported formats are 'range', 'pages'
    and custom. Defaults to pages which would output like '1 of 10'.
    In the custom mode the supplied string is parsed and tokens are 
    replaced with actual values. The available tokens are:

    -  ``{:page}`` - the current page displayed.
    -  ``{:pages}`` - total number of pages.
    -  ``{:current}`` - current number of records being shown.
    -  ``{:count}`` - the total number of records in the result set.
    -  ``{:start}`` - number of the first record being displayed.
    -  ``{:end}`` - number of the last record being displayed.
    -  ``{:model}`` - The pluralized human form of the model name.
       If your model was 'RecipePage', ``{:model}`` would be 'recipe pages'.
       This option was added in 2.0.
    
    You could also supply only a string to the counter method using the tokens 
    available. For example:: 

        <?php
        echo $this->Paginator->counter(
            'Page %page% of %pages%, showing %current% records out of 
             %count% total, starting on record %start%, ending on %end%'
        ); 
        ?>
    
    Setting 'format' to range would outout like '1 - 3 of 13'::
        
        <?php
        echo $this->Paginator->counter(array(
            'format' => 'range'
        ));
        ?>

    **separator**
    The separator between the actual page and the number of pages.
    Defaults to ' of '. This is used in conjunction with 'format' =
    'pages' which is 'format' default value::
        
        <?php
        echo $this->Paginator->counter(array(
            'separator' => ' of a total of '
        ));
        ?>

    **model**
    The name of the model being paginated, defaults to 
    PaginatorHelper::defaultModel().  This is used in conjunction with
    the custom string on 'format' option.

.. php:method:: prev($title = '<< Previous', $options = array(), $disabledTitle = null, $disabledOptions = array())

    :param string $title: Title for the link.
    :param mixed $options: Options for pagination link. 
    :param string $disabledTitle: Title when the link is disabled, as when
        you're already on the first page, no previous page to go.
    :param mixed $disabledOptions: Options for the disabled pagination link.

    Generates a "previous" link for a set of paged records
    
    ``$options`` and ``$disabledOptions`` supports the following keys:

        * **tag**  - The tag wrapping tag you want to use, defaults to 'span'.
        * **escape** - Whether you want the contents html entity encoded, 
            defaults to true.
        * **model** - The model to use, defaults to PaginatorHelper::defaultModel()
        
    Here is an example on a view generated by the cake console::

        <?php
        echo $this->Paginator->prev(' << ' . __('previous'), array(), null, array('class' => 'disabled'));
        ?>

.. php:method:: next($title = 'Next >>', $options = array(), $disabledTitle = null, $disabledOptions = array())

    Configuration of this method goes extactly as the ``prev()`` method

.. php:method:: sort($key, $title = null, $options = array())

    :param string $key: The name of the key that the recordset should be sorted.
    :param string $title: Title for the link. If $title is null $key will be
        used for the title and will be generated by inflection.
    :param array $options: Options for sorting link. 
    
    Accepted keys for ``$options``: 

        * **escape** Whether you want the contents html entity encoded, 
            defaults to true.
        * **model** The model to use, defaults to 
            PaginatorHelper::defaultModel() .

    Generates a sorting link. Sets named parameters for the sort and direction.
    Handles direction switching automatically. Link sorting default by 'asc'.
    If the resultset is sorted 'asc' by the specified key the returned link 
    will sort by 'desc'.  

    This is one of the nice stuff cake console already takes care of when
    genrerating grid views.::

        <tr>
            <th><?php echo $this->Paginator->sort('username');?></th>
            <th><?php echo $this->Paginator->sort('birth');?></th>
        </tr>

.. php:method:: link($title, $url = array(), $options = array())

    :param string $title: Title for the link.
    :param mixed $url: Url for the action. See Router::url()
    :param array $options: Options for the link. See options() for list of keys.

    Accepted keys for ``$options``: 

        * **update** - The Id of the DOM element you wish to update. Creates 
            Ajax enabled links.
        * **escape** Whether you want the contents html entity encoded, 
            defaults to true.
        * **model** The model to use, defaults to 
            PaginatorHelper::defaultModel() .

    Creates a regular or AJAX link with pagination parameters::

        <?php
        echo $this->Paginator->link('Sort by title on page 5', 
                array('sort' => 'title', 'page' => 5, 'direction' => 'desc'));
        ?>

    If created in the view for ``/posts/index`` Would create a link
    pointing at '/posts/index/page:5/sort:title/direction:desc'


.. php:method:: url($options = array(), $asArray = false, $model = null)

    :param array $options: Pagination/URL options array. As used on 
        ``options()`` or ``link()`` method.
    :param boolean $asArray: Return the url as an array, or a URI string.
        Defaults to false.
    :param string $model: Which model to paginate on

    By default returns a full pagination URL string for use in non-standard
    contexts (i.e. JavaScript).::

        <?php
        echo $this->Paginator->url(array('sort' => 'title'), true); 
        ?>

.. php:method:: numbers($options = array())

    Returns a set of numbers for the paged result set. Uses a modulus to 
    decide how many numbers to show on each side of the current page 
    (default: 8).

    Supported options are:

    **before** - Content to be inserted before the numbers.

    **after** - Content to be inserted after the numbers.

    **model** - Model to create numbers for, defaults to 
    PaginatorHelper::defaultModel()

    **modulus** - how many numbers to include on either side of the current 
    page, defaults to 8.

    **separator** - Separator content defaults to ' | '

    **tag** -  The tag to wrap links in, defaults to 'span'

    **first** - Whether you want first links generated, set to an integer 
    to define the number of 'first' links to generate. Defaults to false.
    If a string is set a link to the first page will be generated
    with the value as the title.::
         
        <?php 
        echo $this->Paginator->numbers(array('first' => 'First page')); 
        ?>
    
    There's also a ``first()`` method to be used separately which holds the
    same logic as on the ``first`` option above..::
    
        <?php
        # This creates a single link for the first page.  Will output nothing 
        # if you are on the first page.
        echo $this->Paginator->first('< first');

        # This will create links for the first 3 pages, once you get to the 
        # third or greater page. Prior to that nothing will be output.
        echo $this->Paginator->first(3);
        ?>

    **last** - Whether you want last links generated, set to an integer 
    to define the number of 'last' links to generate. Defaults to false.
    Follows the same logic as the **first** option, including a ``last()``
    method to be used separately as well if you wish.

    **ellipsis** - Ellipsis content, defaults to '...'

    Though this method allows a lot of customization for its output, it is
    also ok to just call the method without any params.::

        <?php
        echo $this->Paginator->numbers();
        ?>

    Using the first and last options you can create links to the beginning 
    and end of the page set.::
        
        <?php
        echo $this->Paginator->numbers(array('first' => 2, 'last' => 2));
        ?>
 

.. todo::

    This section needs a lot of expanding, perhaps roll the pagination docs
    into one place though.
