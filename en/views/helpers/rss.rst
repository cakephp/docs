Rss
###

.. php:namespace:: Cake\View\Helper

.. php:class:: RssHelper(View $view, array $config = [])

The RssHelper makes generating XML for `RSS feeds <https://en.wikipedia.org/wiki/RSS>`_ easy.

Creating an RSS Feed with the RssHelper
=======================================

This example assumes you have a Articles Controller, Articles Table and an
Article Entity already created and want to make an alternative view for RSS.

Creating an XML/RSS version of ``articles/index`` is a snap with CakePHP.
After a few simple steps you can simply append the desired extension .rss to
``articles/index`` making your URL ``articles/index.rss``. Before we jump too
far ahead trying to get our webservice up and running we need to do a few
things. First extensions parsing needs to be activated, this is done in
**config/routes.php**::

    Router::extensions('rss');

In the call above we've activated the .rss extension. When using
:php:meth:`Cake\\Routing\\Router::extensions()` you can pass a string or an
array of extensions as first argument. This will activate each
extension/content-type for use in your application. Now when the address
``articles/index.rss`` is requested you will get an XML version of
your ``articles/index``. However, first we need to edit the controller to
add in the rss-specific code.

Controller Code
---------------

It is a good idea to add RequestHandler to your ArticlesController's
``initialize()`` method. This will allow a lot of automagic to occur::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler');
    }

Before we can make an RSS version of our ``articles/index`` we need to get a few
things in order. It may be tempting to put the channel metadata in the
controller action and pass it to your view using the
:php:meth:`Cake\\Controller\\Controller::set()` method but this is
inappropriate. That information can also go in the view. That will come later
though, for now if you have a different set of logic for the data used to make
the RSS feed and the data for the HTML view you can use the
:php:meth:`Cake\\Controller\\Component\\RequestHandler::isRss()` method,
otherwise your controller can stay the same::

    // Modify the Posts Controller action that corresponds to
    // the action which deliver the rss feed, which is the
    // Index action in our example.

    public function index()
    {
        if ($this->RequestHandler->isRss() ) {
            $articles = $this->Articles
                ->find()
                ->limit(20)
                ->order(['created' => 'desc']);
            $this->set(compact('articles'));
        } else {
            // this is not an Rss request, so deliver
            // data used by website's interface.
            $this->paginate = [
                'order' => ['created' => 'desc'],
                'limit' => 10
            ];
            $this->set('articles', $this->paginate($this->Articles));
            $this->set('_serialize', ['articles']);
        }
    }

With all the View variables set we need to create an rss layout.

Layout
------

An Rss layout is very simple, put the following contents in
**src/Template/Layout/rss/default.ctp**::

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
can pass variables back to the layout. Which is where our ``$channelData``
array will come from setting all of the meta data for our feed.

Next up is view file for my articles/index. Much like the layout file
we created, we need to create a **src/Template/Posts/rss/** directory and
create a new **index.ctp** inside that folder. The contents of the file
are below.

View
----

Our view, located at **src/Template/Posts/rss/index.ctp**, begins by setting the
``$documentData`` and ``$channelData`` variables for the layout, these contain
all the metadata for our RSS feed. This is done by using the
:php:meth:`Cake\\View\\View::set()` method which is analogous to the
:php:meth:`Cake\\Controller\\Controller::set()` method. Here though we are
passing the channel's metadata back to the layout::

    $this->set('channelData', [
        'title' => __("Most Recent Posts"),
        'link' => $this->Url->build('/', true),
        'description' => __("Most recent posts."),
        'language' => 'en-us'
    ]);

The second part of the view generates the elements for the actual records of
the feed. This is accomplished by looping through the data that has been passed
to the view ($items) and using the :php:meth:`RssHelper::item()` method. The
other method you can use, :php:meth:`RssHelper::items()` which takes a callback
and an array of items for the feed. The callback method is usually called
``transformRss()``. There is one downfall to this method, which is that you
cannot use any of the other helper classes to prepare your data inside the
callback method because the scope inside the method does not include anything
that is not passed inside, thus not giving access to the TimeHelper or any
other helper that you may need. The :php:meth:`RssHelper::item()` transforms
the associative array into an element for each key value pair.

.. note::

    You will need to modify the $link variable as appropriate to
    your application. You might also want to use a
    :ref:`virtual property <entities-virtual-properties>` in your Entity.

::

    foreach ($articles as $article) {
        $created = strtotime($article->created);

        $link = [
            'controller' => 'Articles',
            'action' => 'view',
            'year' => date('Y', $created),
            'month' => date('m', $created),
            'day' => date('d', $created),
            'slug' => $article->slug
        ];

        // Remove & escape any HTML to make sure the feed content will validate.
        $body = h(strip_tags($article->body));
        $body = $this->Text->truncate($body, 400, [
            'ending' => '...',
            'exact'  => true,
            'html'   => true,
        ]);

        echo  $this->Rss->item([], [
            'title' => $article->title,
            'link' => $link,
            'guid' => ['url' => $link, 'isPermaLink' => 'true'],
            'description' => $body,
            'pubDate' => $article->created
        ]);
    }

You can see above that we can use the loop to prepare the data to be transformed
into XML elements. It is important to filter out any non-plain text characters
out of the description, especially if you are using a rich text editor for the
body of your blog. In the code above we used ``strip_tags()`` and
:php:func:`h()` to remove/escape any XML special characters from the content,
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
    :title lang=en: RssHelper
    :description lang=en: The RssHelper makes generating XML for RSS feeds easy.
    :keywords lang=en: rss helper,rss feed,isrss,rss item,channel data,document data,parse extensions,request handler
