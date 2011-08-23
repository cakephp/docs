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

    ``$options`` sets all the options for the Paginator Helper. Supported
    options are:

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
    to the url options array. For example, let's say you want paginate the 
    result with the url 'matches/worldcups/brazil' which maps to a results 
    action on a matches controller. This is a way of preserving those params 
    on every pagination link.::
        
        <?php 
        $this->Paginator->options(array('url' => 
                array('controller' => 'matches', 'action' => 'results', 
                      'worldcups', 'brazil')));
        ?>
      
    **escape**
    Defines if the title field for links should be HTML escaped.
    Defaults to true.

    **update**
    The DOM id of the element to update with the results of AJAX
    pagination calls. If not specified, regular links will be created.

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

.. php:method:: link($title, $url = array(), $options = array())

    :param string $title: Title for the link.
    :param mixed $url: Url for the action. See Router::url()
    :param array $options: Options for the link. See options() for list of keys.

    Creates a regular or AJAX link with pagination parameters::

        <?php
        echo $this->Paginator->link('Sort by title on page 5', 
                array('sort' => 'title', 'page' => 5, 'direction' => 'desc'));
        ?>

    If created in the view for ``/posts/index`` Would create a link
    pointing at '/posts/index/page:5/sort:title/direction:desc'

.. todo::

    This section needs a lot of expanding, perhaps roll the pagination docs
    into one place though.
