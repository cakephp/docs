Url
###

.. php:namespace:: Cake\View\Helper

.. php:class:: UrlHelper(View $view, array $config = [])

UrlHelper vous permet de générer facilement des liens pour vos autres Helpers.
C'est aussi un endroit unique pour personnaliser la façon dont les URLs sont
générées en surchargeant le helper du cœur avec celui d'une application.
Regardez la section :ref:`aliasing-helpers` pour voir comment faire.

Générer des URLs
================

.. php:method:: build(mixed $url = null, boolean|array $full = false)

Cette méthode retourne une URL pointant vers la combinaison du controller
et de l'action.
Si ``$url`` est vide, elle retourne ``REQUEST\_URI``, dans les autre cas,
elle génère le lien utilisant le controller et l'action. Si ``full`` vaut
``true``, le lien fourni contiendra le chemin complet menant à la page::

    echo $this->Url->build([
        'controller' => 'Posts',
        'action' => 'view',
        'bar'
    ]);

    // Affiche
    /posts/view/bar

D'autres exemples d'utilisation:

URL avec une extension::

    echo $this->Url->build([
        'controller' => 'Posts',
        'action' => 'list',
        '_ext' => 'rss'
    ]);

    // Affiche
    /posts/list.rss

URL (commençant par '/') avec le chemin complet::

    echo $this->Url->build('/posts', true);

    // Affiche
    http://somedomain.com/posts

URL avec des paramètres GET et des ancres::

    echo $this->Url->build([
        'controller' => 'Posts',
        'action' => 'search',
        '?' => ['foo'=> 'bar'],
        '#' => 'first'
    ]);

    // Affiche
    /posts/search?foo=bar#first

L'exemple du dessus utilise la clé ``?`` qui est utile quand vous voulez être
explicite sur les paramètres query string que vous utilisez ou si vous voulez
un query string qui partage un nom avec un de vos placeholders de route.

URL utilisant une route labellisée::

    echo $this->Url->build(['_name' => 'produit-page', 'slug' => 'i-m-slug']);

    // Il faut que la route soit configurée comme suit :
    // $router->connect(
    //     '/produits/:slug',
    //     [
    //         'controller' => 'Produits',
    //         'action' => 'view'
    //     ],
    //     [
    //         '_name' => 'produit-page'
    //     ]
    // );
    /produits/i-m-slug

Le deuxième paramètre vous permet de définir l'option qui contrôle
l'échappement du HTML et si vous souhaitez ou non que le chemin de base soit
ajouté::

    $this->Url->build('/posts', [
        'escape' => false,
        'fullBase' => true
    ]);

.. versionadded:: 3.3.5
    ``build()`` accepte un tableau comme 2ème argument à partir de3.3.5

Si vous générez des URLs pour du CSS, du Javascript ou des fichiers image, il
existe des méthodes d'helper pour chacun de ces types d'assets::

    // Affiche /img/icon.png
    $this->Url->image('icon.png');

    // Affiche /js/app.js
    $this->Url->script('app.js');

    // Affiche /css/app.css
    $this->Url->css('app.css');

.. versionadded:: 3.2.4
    Les méthodes de helper d'asset ont été ajoutées dans la version 3.2.4.

Pour de plus amples informations, voir
`Router::url <https://api.cakephp.org/3.0/class-Cake.Routing.Router.html#_url>`_
dans l'API.

.. meta::
    :title lang=fr: UrlHelper
    :description lang=fr: Le role de UrlHelper dans CakePHP est de vous aider à construire des urls.
    :keywords lang=fr: url helper,url
