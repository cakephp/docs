RssHelper
#########

.. php:namespace:: Cake\View\Helper

.. php:class:: RssHelper(View $view, array $config = [])

The RSS helper makes generating XML for `RSS feeds <https://en.wikipedia.org/wiki/RSS>`_ easy.

Creating an RSS Feed with the RssHelper
=======================================

This example assumes you have a Posts Controller and Post Model
already created and want to make an alternative view for RSS.

Creating an xml/rss version of posts/index is a snap with CakePHP.
After a few simple steps you can simply append the desired
extension .rss to ``posts/index`` making your URL ``posts/index.rss``.
Before we jump too far ahead trying to get our webservice up and
running we need to do a few things. First extensions parsing needs to
be activated, this is done in ``config/routes.php``::

    Router::extensions('rss');

In the call above we've activated the .rss extension. When using
:php:meth:`Cake\\Routing\\Router::extensions()` you can pass a string or array
of extensions as first argument. This will activate each
extension/content-type for use in your application. Now when the
address ``posts/index.rss`` is requested you will get an xml version of
your ``posts/index``. However, first we need to edit the controller to
add in the rss-specific code.

Controller Code
---------------

It is a good idea to add RequestHandler to your PostsController's
``initialize()`` method. This will allow a lot of automagic to occur::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler');
    }

Our view will also use the :php:class:`TextHelper` for formatting, so that
should be added to the controller as well::

    public $helpers = ['Text'];

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
    // Index action in our example.

    public function index()
    {
        if ($this->RequestHandler->isRss() ) {
            $posts = $this->Posts->find(
                'all',
                ['limit' => 20, 'order' => 'Post.created DESC']
            );
            return $this->set(compact('posts'));
        }

        // this is not an Rss request, so deliver
        // data used by website's interface.
        $this->paginate['Post'] = [
            'order' => 'Post.created DESC',
            'limit' => 10
        ];

        $posts = $this->paginate();
        $this->set(compact('posts'));
    }

With all the View variables set we need to create an rss layout.

Layout
------

An Rss layout is very simple, put the following contents in
``src/Template/Layout/rss/default.ctp``::

    if (!isset($documentData)) {
        $documentData = [];
    }
    if (!isset($channelData)) {
        $channelData = [];
    }
    if (!isset($channelData['title'])) {
        $channelData['title'] = $this->fetch('title');
    }
    $channel = $this->Rss->channel([], $channelData, $this->fetch('content'));
    echo $this->Rss->document($documentData, $channel);

It doesn't look like much but thanks to the power in the ``RssHelper``
it's doing a lot of lifting for us. We haven't set ``$documentData`` or
``$channelData`` in the controller, however in CakePHP your views
can pass variables back to the layout. Which is where our
``$channelData`` array will come from setting all of the meta data for
our feed.

Next up is view file for my posts/index. Much like the layout file
we created, we need to create a ``src/Template/Posts/rss/`` directory and
create a new ``index.ctp`` inside that folder. The contents of the file
are below.

View
----

Our view, located at ``src/Template/Posts/rss/index.ctp``, begins by
setting the ``$documentData`` and ``$channelData`` variables for the
layout, these contain all the metadata for our RSS feed. This is
done by using the :php:meth:`View::set()`` method which is analogous to the
Controller::set() method. Here though we are passing the channel's
metadata back to the layout::

    $this->set('channelData', [
        'title' => __("Most Recent Posts"),
        'link' => $this->Html->url('/', true),
        'description' => __("Most recent posts."),
        'language' => 'en-us'
    ]);

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

        $postLink = [
            'controller' => 'Posts',
            'action' => 'view',
            'year' => date('Y', $postTime),
            'month' => date('m', $postTime),
            'day' => date('d', $postTime),
            $post['Post']['slug']
        ];

        // Remove & escape any HTML to make sure the feed content will validate.
        $bodyText = h(strip_tags($post['Post']['body']));
        $bodyText = $this->Text->truncate($bodyText, 400, [
            'ending' => '...',
            'exact'  => true,
            'html'   => true,
        ]);

        echo  $this->Rss->item([], [
            'title' => $post['Post']['title'],
            'link' => $postLink,
            'guid' => ['url' => $postLink, 'isPermaLink' => 'true'],
            'description' => $bodyText,
            'pubDate' => $post['Post']['created']
        ]);
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
    to ``false`` to get a valid feed, because of the various debug
    information added automagically under higher debug settings that
    break XML syntax or feed validation rules.

.. meta::
    :title lang=ja: RssHelper
    :description lang=ja: The RSS helper makes generating XML for RSS feeds easy.
    :keywords lang=ja: rss helper,rss feed,isrss,rss item,channel data,document data,parse extensions,request handler
