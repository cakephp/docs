4.9.2 Pagination in Views
-------------------------

It's up to you to decide how to show records to the user, but most
often this will be done inside HTML tables. The examples below
assume a tabular layout, but the PaginatorHelper available in views
doesn't always need to be restricted as such.

See the details on
`PaginatorHelper <http://api.cakephp.org/class/paginator-helper>`_
in the API.
As mentioned, the PaginatorHelper also offers sorting features
which can be easily integrated into your table column headers:

::

    // app/views/recipes/list_recipes.ctp
    <table>
        <tr> 
            <th><?php echo $this->Paginator->sort('ID', 'id'); ?></th> 
            <th><?php echo $this->Paginator->sort('Title', 'title'); ?></th> 
        </tr> 
           <?php foreach($data as $recipe): ?> 
        <tr> 
            <td><?php echo $recipe['Recipe']['id']; ?> </td> 
            <td><?php echo $recipe['Recipe']['title']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 


#. ``// app/views/recipes/list_recipes.ctp``
#. ``<table>``
#. ``<tr>``
#. ``<th><?php echo $this->Paginator->sort('ID', 'id'); ?></th>``
#. ``<th><?php echo $this->Paginator->sort('Title', 'title'); ?></th>``
#. ``</tr>``
#. ``<?php foreach($data as $recipe): ?>``
#. ``<tr>``
#. ``<td><?php echo $recipe['Recipe']['id']; ?> </td>``
#. ``<td><?php echo $recipe['Recipe']['title']; ?> </td>``
#. ``</tr>``
#. ``<?php endforeach; ?>``
#. ``</table>``

The links output from the sort() method of the PaginatorHelper
allow users to click on table headers to toggle the sorting of the
data by a given field.

It is also possible to sort a column based on associations:

::

    <table>
        <tr> 
            <th><?php echo $this->Paginator->sort('Title', 'title'); ?></th> 
            <th><?php echo $this->Paginator->sort('Author', 'Author.name'); ?></th> 
        </tr> 
           <?php foreach($data as $recipe): ?> 
        <tr> 
            <td><?php echo $recipe['Recipe']['title']; ?> </td> 
            <td><?php echo $recipe['Author']['name']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 


#. ``<table>``
#. ``<tr>``
#. ``<th><?php echo $this->Paginator->sort('Title', 'title'); ?></th>``
#. ``<th><?php echo $this->Paginator->sort('Author', 'Author.name'); ?></th>``
#. ``</tr>``
#. ``<?php foreach($data as $recipe): ?>``
#. ``<tr>``
#. ``<td><?php echo $recipe['Recipe']['title']; ?> </td>``
#. ``<td><?php echo $recipe['Author']['name']; ?> </td>``
#. ``</tr>``
#. ``<?php endforeach; ?>``
#. ``</table>``

The final ingredient to pagination display in views is the addition
of page navigation, also supplied by the PaginationHelper.

::

    <!-- Shows the page numbers -->
    <?php echo $this->Paginator->numbers(); ?>
    <!-- Shows the next and previous links -->
    <?php echo $this->Paginator->prev('« Previous', null, null, array('class' => 'disabled')); ?>
    <?php echo $this->Paginator->next('Next »', null, null, array('class' => 'disabled')); ?> 
    <!-- prints X of Y, where X is current page and Y is number of pages -->
    <?php echo $this->Paginator->counter(); ?>


#. ``<!-- Shows the page numbers -->``
#. ``<?php echo $this->Paginator->numbers(); ?>``
#. ``<!-- Shows the next and previous links -->``
#. ``<?php echo $this->Paginator->prev('« Previous', null, null, array('class' => 'disabled')); ?>``
#. ``<?php echo $this->Paginator->next('Next »', null, null, array('class' => 'disabled')); ?>``
#. ``<!-- prints X of Y, where X is current page and Y is number of pages -->``
#. ``<?php echo $this->Paginator->counter(); ?>``

The wording output by the counter() method can also be customized
using special markers:

::

    <?php
    echo $this->Paginator->counter(array(
        'format' => 'Page %page% of %pages%, showing %current% records out of
                 %count% total, starting on record %start%, ending on %end%'
    )); 
    ?>


#. ``<?php``
#. ``echo $this->Paginator->counter(array(``
#. ``'format' => 'Page %page% of %pages%, showing %current% records out of``
#. ``%count% total, starting on record %start%, ending on %end%'``
#. ``));``
#. ``?>``

To pass all URL arguments to paginator functions, add the following
to your view:

::

    $this->Paginator->options(array('url' => $this->passedArgs));


#. ``$this->Paginator->options(array('url' => $this->passedArgs));``

Route elements that are not named arguments should manually be
merged with ``$this->passedArgs``:

::

    //for urls like http://www.example.com/en/controller/action
    //that are routed as Router::connect('/:lang/:controller/:action/*', array(), array('lang' => 'ta|en'));
    $this->Paginator->options(array('url' => array_merge(array('lang' => $lang), $this->passedArgs)));


#. ``//for urls like http://www.example.com/en/controller/action``
#. ``//that are routed as Router::connect('/:lang/:controller/:action/*', array(), array('lang' => 'ta|en'));``
#. ``$this->Paginator->options(array('url' => array_merge(array('lang' => $lang), $this->passedArgs)));``

Or you can specify which params to pass manually:

::

    $this->Paginator->options(array('url' => array("0", "1")));


#. ``$this->Paginator->options(array('url' => array("0", "1")));``

4.9.2 Pagination in Views
-------------------------

It's up to you to decide how to show records to the user, but most
often this will be done inside HTML tables. The examples below
assume a tabular layout, but the PaginatorHelper available in views
doesn't always need to be restricted as such.

See the details on
`PaginatorHelper <http://api.cakephp.org/class/paginator-helper>`_
in the API.
As mentioned, the PaginatorHelper also offers sorting features
which can be easily integrated into your table column headers:

::

    // app/views/recipes/list_recipes.ctp
    <table>
        <tr> 
            <th><?php echo $this->Paginator->sort('ID', 'id'); ?></th> 
            <th><?php echo $this->Paginator->sort('Title', 'title'); ?></th> 
        </tr> 
           <?php foreach($data as $recipe): ?> 
        <tr> 
            <td><?php echo $recipe['Recipe']['id']; ?> </td> 
            <td><?php echo $recipe['Recipe']['title']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 


#. ``// app/views/recipes/list_recipes.ctp``
#. ``<table>``
#. ``<tr>``
#. ``<th><?php echo $this->Paginator->sort('ID', 'id'); ?></th>``
#. ``<th><?php echo $this->Paginator->sort('Title', 'title'); ?></th>``
#. ``</tr>``
#. ``<?php foreach($data as $recipe): ?>``
#. ``<tr>``
#. ``<td><?php echo $recipe['Recipe']['id']; ?> </td>``
#. ``<td><?php echo $recipe['Recipe']['title']; ?> </td>``
#. ``</tr>``
#. ``<?php endforeach; ?>``
#. ``</table>``

The links output from the sort() method of the PaginatorHelper
allow users to click on table headers to toggle the sorting of the
data by a given field.

It is also possible to sort a column based on associations:

::

    <table>
        <tr> 
            <th><?php echo $this->Paginator->sort('Title', 'title'); ?></th> 
            <th><?php echo $this->Paginator->sort('Author', 'Author.name'); ?></th> 
        </tr> 
           <?php foreach($data as $recipe): ?> 
        <tr> 
            <td><?php echo $recipe['Recipe']['title']; ?> </td> 
            <td><?php echo $recipe['Author']['name']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 


#. ``<table>``
#. ``<tr>``
#. ``<th><?php echo $this->Paginator->sort('Title', 'title'); ?></th>``
#. ``<th><?php echo $this->Paginator->sort('Author', 'Author.name'); ?></th>``
#. ``</tr>``
#. ``<?php foreach($data as $recipe): ?>``
#. ``<tr>``
#. ``<td><?php echo $recipe['Recipe']['title']; ?> </td>``
#. ``<td><?php echo $recipe['Author']['name']; ?> </td>``
#. ``</tr>``
#. ``<?php endforeach; ?>``
#. ``</table>``

The final ingredient to pagination display in views is the addition
of page navigation, also supplied by the PaginationHelper.

::

    <!-- Shows the page numbers -->
    <?php echo $this->Paginator->numbers(); ?>
    <!-- Shows the next and previous links -->
    <?php echo $this->Paginator->prev('« Previous', null, null, array('class' => 'disabled')); ?>
    <?php echo $this->Paginator->next('Next »', null, null, array('class' => 'disabled')); ?> 
    <!-- prints X of Y, where X is current page and Y is number of pages -->
    <?php echo $this->Paginator->counter(); ?>


#. ``<!-- Shows the page numbers -->``
#. ``<?php echo $this->Paginator->numbers(); ?>``
#. ``<!-- Shows the next and previous links -->``
#. ``<?php echo $this->Paginator->prev('« Previous', null, null, array('class' => 'disabled')); ?>``
#. ``<?php echo $this->Paginator->next('Next »', null, null, array('class' => 'disabled')); ?>``
#. ``<!-- prints X of Y, where X is current page and Y is number of pages -->``
#. ``<?php echo $this->Paginator->counter(); ?>``

The wording output by the counter() method can also be customized
using special markers:

::

    <?php
    echo $this->Paginator->counter(array(
        'format' => 'Page %page% of %pages%, showing %current% records out of
                 %count% total, starting on record %start%, ending on %end%'
    )); 
    ?>


#. ``<?php``
#. ``echo $this->Paginator->counter(array(``
#. ``'format' => 'Page %page% of %pages%, showing %current% records out of``
#. ``%count% total, starting on record %start%, ending on %end%'``
#. ``));``
#. ``?>``

To pass all URL arguments to paginator functions, add the following
to your view:

::

    $this->Paginator->options(array('url' => $this->passedArgs));


#. ``$this->Paginator->options(array('url' => $this->passedArgs));``

Route elements that are not named arguments should manually be
merged with ``$this->passedArgs``:

::

    //for urls like http://www.example.com/en/controller/action
    //that are routed as Router::connect('/:lang/:controller/:action/*', array(), array('lang' => 'ta|en'));
    $this->Paginator->options(array('url' => array_merge(array('lang' => $lang), $this->passedArgs)));


#. ``//for urls like http://www.example.com/en/controller/action``
#. ``//that are routed as Router::connect('/:lang/:controller/:action/*', array(), array('lang' => 'ta|en'));``
#. ``$this->Paginator->options(array('url' => array_merge(array('lang' => $lang), $this->passedArgs)));``

Or you can specify which params to pass manually:

::

    $this->Paginator->options(array('url' => array("0", "1")));


#. ``$this->Paginator->options(array('url' => array("0", "1")));``
