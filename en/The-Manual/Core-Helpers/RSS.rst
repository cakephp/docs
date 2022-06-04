RSS
###

The RSS helper makes generating XML for RSS feeds easy.

Creating an RSS feed with the RssHelper
=======================================

This example assumes you have a Posts Controller and Post Model already
created and want to make an alternative view for RSS.

Creating an xml/rss version of posts/index is a snap with CakePHP 1.2.
After a few simple steps you can simply append the desired extension
.rss to posts/index making your URL posts/index.rss. Before we jump too
far ahead trying to get our webservice up and running we need to do a
few things. First parseExtensions needs to be activated, this is done in
app/config/routes.php

::

          Router::parseExtensions('rss');

In the call above we’ve activated the .rss extension. When using
Router::parseExtensions() you can pass as many arguments or extensions
as you want. This will activate each extension/content-type for use in
your application. Now when the address posts/index.rss is requested you
will get an xml version of your posts/index. However, first we need to
edit the controller to add in the rss-specific code.

Controller Code
---------------

It is a good idea to add RequestHandler to your PostsController's
$components array. This will allow a lot of automagic to occur.

::

        var $components = array('RequestHandler');

Before we can make an RSS version of our posts/index we need to get a
few things in order. It may be tempting to put the channel metadata in
the controller action and pass it to your view using the
Controller::set() method but this is inappropriate. That information can
also go in the view. That will come later though, for now if you have a
different set of logic for the data used to make the RSS feed and the
data for the html view you can use the RequestHandler::isRss() method,
otherwise your controller can stay the same.

::

    // Modify the Posts Controller action that corresponds to
    // the action which deliver the rss feed, which is the
    // index action in our example

    public function index(){
        if( $this->RequestHandler->isRss() ){
            $posts = $this->Post->find('all', array('limit' => 20, 'order' => 'Post.created DESC'));
            $this->set(compact('posts'));
        } else {
            // this is not an Rss request, so deliver
            // data used by website's interface
            $this->paginate['Post'] = array('order' => 'Post.created DESC', 'limit' => 10);
            
            $posts = $this->paginate();
            $this->set(compact('posts'));
        }
    }

With all the View variables set we need to create an rss layout.

Layout
~~~~~~

An Rss layout is very simple, put the following contents in
app/views/layouts/rss/default.ctp:

::

    echo $rss->header();
    if (!isset($documentData)) {
        $documentData = array();
    }
    if (!isset($channelData)) {
        $channelData = array();
    }
    if (!isset($channelData['title'])) {
        $channelData['title'] = $title_for_layout;
    } 
    $channel = $rss->channel(array(), $channelData, $content_for_layout);
    echo $rss->document($documentData,$channel);

It doesn't look like much but thanks to the power in the RssHelper its
doing a lot of lifting for us. We haven't set $documentData or
$channelData in the controller, however in CakePHP 1.2 your views can
pass variables back to the layout. Which is where our $channelData array
will come from setting all of the meta data for our feed.

Next up is view file for my posts/index. Much like the layout file we
created, we need to create a views/posts/rss/ directory and create a new
index.ctp inside that folder. The contents of the file are below.

View
~~~~

Our view, located at ``app/views/posts/rss/index.ctp``, begins by
setting the $documentData and $channelData variables for the layout,
these contain all the metadata for our RSS feed. This is done by using
the View::set() method which is analogous to the Controller::set()
method. Here though we are passing the channel's metadata back to the
layout.

::

        $this->set('documentData', array(
            'xmlns:dc' => 'https://purl.org/dc/elements/1.1/'));

        $this->set('channelData', array(
            'title' => __("Most Recent Posts", true),
            'link' => $html->url('/', true),
            'description' => __("Most recent posts.", true),
            'language' => 'en-us'));

The second part of the view generates the elements for the actual
records of the feed. This is accomplished by looping through the data
that has been passed to the view ($items) and using the
RssHelper::item() method. The other method you can use,
RssHelper::items() which takes a callback and an array of items for the
feed. (The method I have seen used for the callback has always been
called transformRss(). There is one downfall to this method, which is
that you cannot use any of the other helper classes to prepare your data
inside the callback method because the scope inside the method does not
include anything that is not passed inside, thus not giving access to
the TimeHelper or any other helper that you may need. The
RssHelper::item() transforms the associative array into an element for
each key value pair.

::

        foreach ($posts as $post) {
            $postTime = strtotime($post['Post']['created']);
     
            $postLink = array(
                'controller' => 'entries',
                'action' => 'view',
                'year' => date('Y', $postTime),
                'month' => date('m', $postTime),
                'day' => date('d', $postTime),
                $post['Post']['slug']);
            // You should import Sanitize
            App::import('Sanitize');
            // This is the part where we clean the body text for output as the description 
            // of the rss item, this needs to have only text to make sure the feed validates
            $bodyText = preg_replace('=\(.*?\)=is', '', $post['Post']['body']);
            $bodyText = $text->stripLinks($bodyText);
            $bodyText = Sanitize::stripAll($bodyText);
            $bodyText = $text->truncate($bodyText, 400, '...', true, true);
     
            echo  $rss->item(array(), array(
                'title' => $post['Post']['title'],
                'link' => $postLink,
                'guid' => array('url' => $postLink, 'isPermaLink' => 'true'),
                'description' =>  $bodyText,
                'dc:creator' => $post['Post']['author'],
                'pubDate' => $post['Post']['created']));
        }

You can see above that we can use the loop to prepare the data to be
transformed into XML elements. It is important to filter out any
non-plain text characters out of the description, especially if you are
using a rich text editor for the body of your blog. In the code above we
use the TextHelper::stripLinks() method and a few methods from the
Sanitize class, but we recommend writing a comprehensive text cleaning
helper to really scrub the text clean. Once we have set up the data for
the feed, we can then use the RssHelper::item() method to create the XML
in RSS format. Once you have all this setup, you can test your RSS feed
by going to your site /posts/index.rss and you will see your new feed.
It is always important that you validate your RSS feed before making it
live. This can be done by visiting sites that validate the XML such as
Feed Validator or the w3c site at https://validator.w3.org/feed/.

You may need to set the value of 'debug' in your core configuration to 1
or to 0 to get a valid feed, because of the various debug information
added automagically under higher debug settings that break XML syntax or
feed validation rules.
