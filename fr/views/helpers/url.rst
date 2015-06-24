Url
###

.. php:namespace:: Cake\View\UrlHelper

.. php:class:: UrlHelper(View $view, array $config = [])

UrlHelper vous permet de générer facilement des liens pour vos autres Helpers.
C'est aussi un endroit unique pour personnaliser la façon dont les URLs sont
générées en surchargeant le helper du cœur avec celui d'une application.
Regardez la section :ref:`aliasing-helpers` pour voir comment faire.

Générer des URLs
================

.. php:method:: build(mixed $url = NULL, boolean $full = false)

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

URL avec des paramètres nommés::

    echo $this->Url->build([
        'controller' => 'Posts',
        'action' => 'view',
        'foo' => 'bar'
    ]);

    // Affiche
    /posts/view/foo:bar

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

URL avec des paramètres GET et des paramètres nommés (Ancre)::

    echo $this->Url->build([
        'controller' => 'Posts',
        'action' => 'search',
        '?' => ['foo'=> 'bar'],
        '#' => 'first'
    ]);

    // Affiche
    /posts/search?foo=bar#first

URL utilisant une route labellisée ::

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

Pour de plus amples informations, voir
`Router::url <http://api.cakephp.org/3.0/class-Cake.Routing.Router.html#_url>`_
dans l'API.

.. meta::
    :title lang=fr: UrlHelper
    :description lang=fr: Le role de UrlHelper dans CakePHP est de vous aider à construire des urls.
    :keywords lang=fr: url helper,url
