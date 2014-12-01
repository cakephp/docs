RSS
###

.. php:class:: RssHelper(View $view, array $settings = array())

The RSS helper makes generating XML for RSS feeds easy.

Creating an RSS feed with the RssHelper
=======================================

This example assumes you have a Posts Controller and Post Model
already created and want to make an alternative view for RSS.

Creating an xml/rss version of posts/index is a snap with CakePHP.
After a few simple steps you can simply append the desired
extension .rss to ``posts/index`` making your URL ``posts/index.rss``.
Before we jump too far ahead trying to get our webservice up and
running we need to do a few things. First parseExtensions needs to
be activated, this is done in ``app/Config/routes.php``::

    Router::parseExtensions('rss');

In the call above we've activated the .rss extension. When using
:php:meth:`Router::parseExtensions()` you can pass as many arguments or
extensions as you want. This will activate each
extension/content-type for use in your application. Now when the
address ``posts/index.rss`` is requested you will get an xml version of
your ``posts/index``. However, first we need to edit the controller to
add in the rss-specific code.

Controller Code
---------------

It is a good idea to add RequestHandler to your PostsController's
$components array. This will allow a lot of automagic to occur::

    public $components = array('RequestHandler');

Our view will also use the :php:class:`TextHelper` for formatting, so that
should be added to the controller as well::

    public $helpers = array('Text');

Before we can make an RSS version of our posts/index we need to get
a few things in order. It may be tempting to put the channel
metadata in the controller action and pass it to your view using
the :php:meth:`Controller::set()` method but this is inappropriate. That
information can also go in the view. That will come later though,
for now if you have a different set of logic for the data used to
make the RSS feed and the data for the HTML view you can use the
:php:meth:`RequestHandler::isRss()` method, otherwise your controller can stay
the same::

    // Modify the Posts Controller action that corresponds to
    // the action which deliver the rss feed, which is the
    // index action in our example

    public function index() {
        if ($this->RequestHandler->isRss() ) {
            $posts = $this->Post->find(
                'all',
                array('limit' => 20, 'order' => 'Post.created DESC')
            );
            return $this->set(compact('posts'));
        }

        // this is not an Rss request, so deliver
        // data used by website's interface
        $this->paginate['Post'] = array(
            'order' => 'Post.created DESC',
            'limit' => 10
        );

        $posts = $this->paginate();
        $this->set(compact('posts'));
    }

With all the View variables set we need to create an rss layout.

Layout
------

An Rss layout is very simple, put the following contents in
``app/View/Layouts/rss/default.ctp``::

    if (!isset($documentData)) {
        $documentData = array();
    }
    if (!isset($channelData)) {
        $channelData = array();
    }
    if (!isset($channelData['title'])) {
        $channelData['title'] = $this->fetch('title');
    }
    $channel = $this->Rss->channel(array(), $channelData, $this->fetch('content'));
    echo $this->Rss->document($documentData, $channel);

It doesn't look like much but thanks to the power in the ``RssHelper``
it's doing a lot of lifting for us. We haven't set ``$documentData`` or
``$channelData`` in the controller, however in CakePHP your views
can pass variables back to the layout. Which is where our
``$channelData`` array will come from setting all of the meta data for
our feed.

Next up is view file for my posts/index. Much like the layout file
we created, we need to create a ``View/Posts/rss/`` directory and
create a new ``index.ctp`` inside that folder. The contents of the file
are below.

View
----

Our view, located at ``app/View/Posts/rss/index.ctp``, begins by
setting the ``$documentData`` and ``$channelData`` variables for the
layout, these contain all the metadata for our RSS feed. This is
done by using the :php:meth:`View::set()`` method which is analogous to the
Controller::set() method. Here though we are passing the channel's
metadata back to the layout::

    $this->set('channelData', array(
        'title' => __("Most Recent Posts"),
        'link' => $this->Html->url('/', true),
        'description' => __("Most recent posts."),
        'language' => 'en-us'
    ));

The second part of the view generates the elements for the actual
records of the feed. This is accomplished by looping through the
data that has been passed to the view ($items) and using the
:php:meth:`RssHelper::item()` method. The other method you can use,
:php:meth:`RssHelper::items()` which takes a callback and an array of items for
the feed. (The method I have seen used for the callback has always
been called ``transformRss()``. There is one downfall to this method,
which is that you cannot use any of the other helper classes to
prepare your data inside the callback method because the scope
inside the method does not include anything that is not passed
inside, thus not giving access to the TimeHelper or any other
helper that you may need. The :php:meth:`RssHelper::item()` transforms the
associative array into an element for each key value pair.

.. note::

    You will need to modify the $postLink variable as appropriate to
    your application.

::

    foreach ($posts as $post) {
        $postTime = strtotime($post['Post']['created']);

        $postLink = array(
            'controller' => 'posts',
            'action' => 'view',
            'year' => date('Y', $postTime),
            'month' => date('m', $postTime),
            'day' => date('d', $postTime),
            $post['Post']['slug']
        );

        // Remove & escape any HTML to make sure the feed content will validate.
        $bodyText = h(strip_tags($post['Post']['body']));
        $bodyText = $this->Text->truncate($bodyText, 400, array(
            'ending' => '...',
            'exact'  => true,
            'html'   => true,
        ));

        echo  $this->Rss->item(array(), array(
            'title' => $post['Post']['title'],
            'link' => $postLink,
            'guid' => array('url' => $postLink, 'isPermaLink' => 'true'),
            'description' => $bodyText,
            'pubDate' => $post['Post']['created']
        ));
    }

You can see above that we can use the loop to prepare the data to be transformed
into XML elements. It is important to filter out any non-plain text characters
out of the description, especially if you are using a rich text editor for the
body of your blog. In the code above we used ``strip_tags()`` and
:php:func:`h()` to remove/escape any XML special characaters from the content,
as they could cause validation errors. Once we have set up the data for the
feed, we can then use the :php:meth:`RssHelper::item()` method to create the XML
in RSS format. Once you have all this setup, you can test your RSS feed by going
to your site ``/posts/index.rss`` and you will see your new feed. It is always
important that you validate your RSS feed before making it live. This can be
done by visiting sites that validate the XML such as Feed Validator or the w3c
site at http://validator.w3.org/feed/.

.. note::

    You may need to set the value of 'debug' in your core configuration
    to 1 or to 0 to get a valid feed, because of the various debug
    information added automagically under higher debug settings that
    break XML syntax or feed validation rules.

Rss Helper API
==============

.. php:attr:: action

    Current action

.. php:attr:: base

    Base URL

.. php:attr:: data

    POSTed model data

.. php:attr:: field

    Name of the current field

.. php:attr:: helpers

    Helpers used by the RSS Helper

.. php:attr:: here

    URL to current action

.. php:attr:: model

    Name of current model

.. php:attr:: params

    Parameter array

.. php:attr:: version

    Default spec version of generated RSS.

.. php:method:: channel(array $attrib = array (), array $elements = array (), mixed $content = null)

    :rtype: string

    Returns an RSS ``<channel />`` element.

.. php:method:: document(array $attrib = array (), string $content = null)

    :rtype: string

    Returns an RSS document wrapped in ``<rss />`` tags.

.. php:method:: elem(string $name, array $attrib = array (), mixed $content = null, boolean $endTag = true)

    :rtype: string

    Generates an XML element.

.. php:method:: item(array $att = array (), array $elements = array ())

    :rtype: string

    Converts an array into an ``<item />`` element and its contents.

.. php:method:: items(array $items, mixed $callback = null)

    :rtype: string

    Transforms an array of data using an optional callback, and maps it to a
    set of ``<item />`` tags.

.. php:method:: time(mixed $time)

    :rtype: string

    Converts a time in any format to an RSS time. See
    :php:meth:`TimeHelper::toRSS()`.


.. meta::
    :title lang=en: RssHelper
    :description lang=en: The RSS helper makes generating XML for RSS feeds easy.
    :keywords lang=en: rss helper,rss feed,isrss,rss item,channel data,document data,parse extensions,request handler
