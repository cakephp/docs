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

Gabarit
~~~~~~~

Un gabarit Rss est vraiment simple, placez les contenus suivants dans
app/views/layouts/rss/default.ctp :

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

Çà n'a l'air de rien, mais remercions la puissance de l'assistant Rss
qui réalise pas mal de lifting pour nous. Nous n'avons pas défini
$documentData ou $channelData dans le contrôleur, cependant, dans
CakePHP 1.2 vos vues peuvent passer des variables au gabarit. C'est là
où notre tableau $channelData viendra paramétrer toutes les méta données
pour notre flux.

La suite c'est le fichier de vue pour mon action posts/index. De même
que nous avons créé le fichier de gabarit, nous avons besoin de créer un
répertoire views/posts/rss/ et de créer un nouvel index.ctp à
l'intérieur de ce dossier. Le contenu de ce fichier se trouve
ci-dessous.

Vue
~~~

Notre vue, située dans ``app/views/posts/rss/index.ctp``, commence par
définir les variables $documentData et $channelData pour le gabarit,
celles-ci contiennent toutes les meta-données pour notre flux. Ceci est
réalisé en utilisant la méthode View::set() qui est analogue à la
méthode Controller::set(). Ici cependant, nous passons en retour les
méta-données du canal au gabarit.

::

        $this->set('documentData', array(
            'xmlns:dc' => 'http://purl.org/dc/elements/1.1/'));

        $this->set('channelData', array(
            'title' => __("Posts les plus récents", true),
            'link' => $html->url('/', true),
            'description' => __("Posts les plus récents.", true),
            'language' => 'fr-fr'));

La seconde partie de la vue génère les éléments pour les enregistrements
actuels du flux. Ceci est effectué en bouclant sur les données qui ont
été passées à la vue ($items) et en utilisant la méthode
RssHelper::item(). L'autre méthode que vous pouvez utiliser,
RssHelper::items(), prend un callback et un tableau des items pour le
flux. La méthode que j'ai vue utilisée pour le callback a toujours été
appelée transformRss(). Il y a une faille avec cette méthode, c'est que
vous ne pouvez utiliser aucune autre des classes de helper pour préparer
vos données à l'intérieur de la méthode de callback, parce que la portée
au sein de cette méthode n'inclut rien qui ne lui soit passé, par
conséquent il n'y a pas d'accès à l'assistant Time ou à tout autre
assistant dont vous pourriez avoir besoin. La méthode RssHelper::item()
transforme le tableau associatif en élément pour chaque paire
clé/valeur.

::

        foreach ($posts as $post) {
            $postTime = strtotime($post['Post']['created']);
     
            $postLink = array(
                'controller' => 'articles',
                'action' => 'voir',
                'year' => date('Y', $postTime),
                'month' => date('m', $postTime),
                'day' => date('d', $postTime),
                $post['Post']['slug']);
            // Vous devriez importer Sanitize
            App::import('Sanitize');
            // Voici la partie où nous nettoyons le corps du texte pour l'afficher comme description 
            // de l'item rss, ceci exige d'avoir seulement du texte pour s'assurer de valider le flux
            $corpsTexte = preg_replace('=\(.*?\)=is', '', $post['Post']['corps']);
            $corpsTexte = $text->stripLinks($corpsTexte);
            $corpsTexte = Sanitize::stripAll($corpsTexte);
            $corpsTexte = $text->truncate($corpsTexte, 400, '...', true, true);
     
            echo  $rss->item(array(), array(
                'title' => $post['Post']['titre'],
                'link' => $postLink,
                'guid' => array('url' => $postLink, 'isPermaLink' => 'true'),
                'description' =>  $corpsTexte,
                'dc:creator' => $post['Post']['auteur'],
                'pubDate' => $post['Post']['created']));
        }

Vous pouvez voir ci-dessus, que nous pouvons utiliser la boucle pour
préparer les données à se transformer en éléments XML. Il est important
de filtrer tous les caractères qui ne sont pas en texte brut dans la
description, spécialement si vous utilisez un éditeur de texte riche
pour le corps de votre blog. Dans le code ci-dessus, nous utilisons la
méthode TextHelper::stripLinks() et quelques méthodes issues de la
classe Sanitize, mais nous recommandons d'écrire un assistant complet de
nettoyage de texte pour vraiment récurer le texte. Une fois que nous
avons paramétré les données pour le flux, nous pouvons alors utiliser la
méthode RssHelper::item() pour créer le XML au format RSS. Une fois que
vous avez fait toute cette configuration, vous pouvez tester votre flux
RSS en allant sur votre site à /posts/index.rss et vous verrez votre
nouveau flux. Il est toujours important que vous validiez votre flux RSS
avant de le rendre actif. Ceci peut être effectué en visitant des sites
qui valident le XML comme Feed Validator ou le site du w3c :
https://validator.w3.org/feed/.

Vous aurez besoin de définir la valeur de 'debug' à 1 ou 0 dans votre
configuration du cœur pour obtenir un flux valide, à cause des
différentes informations de debug ajoutées automagiquement par les hauts
niveaux de paramétrage du debug, qui cassent la syntaxe XML ou les
règles de validation de flux.
