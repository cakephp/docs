RSS
###

L'assistant RSS réalise facilement la génération XML pour les flux RSS.

Créer un flux RSS avec le Helper Rss
====================================

Cet exemple suppose que vous ayez un Contrôleur Posts et un modèle Post
déjà créés et que vous vouliez créer une vue alternative pour les flux
RSS.

Créer une version xml/rss de l'index de vos posts est vraiment simple
avec CakePHP 1.2. Après quelques étapes faciles, vous pouvez tout
simplement ajouter l'extension .rss demandée à posts/index pour en faire
votre URL posts/index.rss. Avant d'aller plus loin en essayant
d'initialiser et de lancer notre service Web, nous avons besoin de faire
un certain nombre de choses. Premièrement, le parsing d'extensions doit
être activé dans app/config/routes.php

::

          Router::parseExtensions('rss');

Dans l'appel ci-dessus, nous avons activé l'extension .rss. Quand vous
utilisez Router::parseExtensions(), vous pouvez passer autant
d'arguments ou d'extensions que vous le souhaitez. Cela activera le
content-type de chaque extension utilisée dans votre application.
Maintenant, quand l'adresse posts/index.rss est demandée, vous
obtiendrez une version XML de votre posts/index. Cependant, nous avons
d'abord besoin d'éditer le contrôleur pour y ajouter le code
"rss-spécifique".

Le code du Contrôleur
---------------------

C'est une bonne idée d'ajouter RequestHandler au tableau $components de
votre contrôleur Posts. Cela permettra à beaucoup d'automagie de se
produire.

::

        
    var $components = array('RequestHandler');   

Avant que nous puissions faire une version RSS de notre posts/index,
nous avons besoin de mettre certaines choses en ordre. Il pourrait être
tentant de mettre le canal des métadonnées dans l'action du contrôleur
et de le passer à votre vue en utilisant la méthode Controller::set(),
mais ceci est inapproprié. Cette information pourrait également aller
dans la vue. Cela arrivera sans doute plus tard, mais pour l'instant, si
vous avez un ensemble de logique différent entre les données utilisées
pour créer le flux RSS et les données pour la page HTML, vous pouvez
utiliser la méthode RequestHandler::isRss(), sinon votre contrôleur
pourrait rester le même.

::

    // Modifie l'action du Contrôleur Posts correspondant à
    // l'action qui délivre le flux rss, laquelle est
    // l'action index dans notre exemple
    public function index(){
        if( $this->RequestHandler->isRss() ){
            $posts = $this->Post->find('all', array('limit' => 20, 'order' => 'Post.created DESC'));
            $this->set(compact('posts'));
        } else {
            // ceci n'est pas une requête RSS
            // donc on retourne les données utilisées par l'interface du site web
            $this->paginate['Post'] = array('order' = 'Post.created DESC', 'limit' => 10);
            
            $posts = $this->paginate();
            $this->set(compact('posts'));
        }
    }

Maintenant que toutes ces variables de Vue sont définies, nous avons
besoin de créer un layout rss.

Layout
~~~~~~

An Rss layout is very simple, put the following contents in
app/views/layouts/rss/default.ctp:

::

    echo $this->Rss->header();
    if (!isset($documentData)) {
        $documentData = array();
    }
    if (!isset($channelData)) {
        $channelData = array();
    }
    if (!isset($channelData['title'])) {
        $channelData['title'] = $title_for_layout;
    } 
    $channel = $this->Rss->channel(array(), $channelData, $content_for_layout);
    echo $this->Rss->document($documentData,$channel);

It doesn't look like much but thanks to the power in the RssHelper its
doing a lot of lifting for us. We haven't set $documentData or
$channelData in the controller, however in CakePHP 1.3 your views can
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
            'xmlns:dc' => 'http://purl.org/dc/elements/1.1/'));

        $this->set('channelData', array(
            'title' => __("Most Recent Posts", true),
            'link' => $this->Html->url('/', true),
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

You will need to modify the $postLink variable as appropriate to your
application.

::

        foreach ($posts as $post) {
            $postTime = strtotime($post['Post']['created']);
     
            $postLink = array(
                'controller' => 'posts',
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
            $bodyText = $this->Text->stripLinks($bodyText);
            $bodyText = Sanitize::stripAll($bodyText);
            $bodyText = $this->Text->truncate($bodyText, 400, array(
                'ending' => '...',
                'exact'  => true,
                'html'   => true,
            ));
     
            echo  $this->Rss->item(array(), array(
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
