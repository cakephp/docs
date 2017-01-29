Breadcrumbs
###########

.. php:namespace:: Cake\View\Helper

.. php:class:: BreadcrumbsHelper(View $view, array $config = [])

.. versionadded:: 3.3.6

BreadcrumbsHelper vous offre la possibilité de gérer la création et le rendu
de vos *breadcrumbs* (fil d'Ariane) pour vos applications.

Créer un fil d'Ariane
=====================

Vous pouvez ajouter un élément à la liste en utilisant la méthode ``add()``.
Elle accepte trois arguments :

- ``title`` La chaîne affichée comme titre de l'élément.
- ``url`` Une chaîne ou un tableau de paramètres qui sera passé au :doc:`/views/helpers/url`
- ``options`` Un tableau d'attribut pour les templates ``item`` et
  ``itemWithoutLink``. Référez-vous à la section sur :ref:`la définition d'attributs pour un élément <defining_attributes_item>`
  pour plus d'informations.

En plus de pouvoir ajouter un élément à la fin de la liste, vous pouvez effectuer
diverses opérations::

    // Ajoute à la fin de la liste
    $this->Breadcrumbs->add(
        'Produits',
        ['controller' => 'products', 'action' => 'index']
    );

    // Ajoute plusieurs éléments à la fin de la liste
    $this->Breadcrumbs->add([
        ['title' => 'Produits', 'url' => ['controller' => 'products', 'action' => 'index']],
        ['title' => 'Nom du produit', 'url' => ['controller' => 'products', 'action' => 'view', 1234]]
    ]);

    // Ajoute l'élément en premier dans la liste
    $this->Breadcrumbs->prepend(
        'Produits',
        ['controller' => 'products', 'action' => 'index']
    );

    // Ajoute plusieurs éléments en premier dans la liste
    $this->Breadcrumbs->prepend([
        ['title' => 'Produits', 'url' => ['controller' => 'products', 'action' => 'index']],
        ['title' => 'Nom du produit', 'url' => ['controller' => 'products', 'action' => 'view', 1234]]
    ]);

    // Insert l'élément à un index spécifique. Si l'index n'existe pas
    // une exception sera levée.
    $this->Breadcrumbs->insertAt(
        2,
        'Produits',
        ['controller' => 'products', 'action' => 'index']
    );

    // Insert l'élément avant un autre, basé sur le titre.
    // Si l'élément ne peut pas être trouvé, une exception sera levée
    $this->Breadcrumbs->insertBefore(
        'Un nom de produit', // le titre de l'élément devant lequel on veut faire l'insertion
        'Produits',
        ['controller' => 'products', 'action' => 'index']
    );

    // Insert l'élément après un autre, basé sur le titre.
    // Si l'élément ne peut pas être trouvé, une exception sera levée
    $this->Breadcrumbs->insertAfter(
        'Un nom de produit', // le titre de l'élément derrière lequel on veut faire l'insertion
        'Produits',
        ['controller' => 'products', 'action' => 'index']
    );

Utilisez ces méthodes vous donne la possibilité de contourner la façon dont
CakePHP rend les vues. Puisque les templates et les layouts sont rendu de
l'intérieur vers l'extérieur (entendez par là que les éléments inclus sont
rendus avant les éléments qui les inclusent), cela vous permet de définir
précisemment où vous voulez ajouter un élément.

Afficher le fil d'Ariane
========================

Affichage simple
----------------

Après avoir ajouté un élément à la liste, vous pouvez facilement l'afficher
avec la méthode ``render()``.
Cette méthode accepte deux tableaux comme arguments :

- ``$attributes`` : Un tableau d'attributs qui seront appliqués au template
  ``wrapper``. Cela vous donne lapossibilité d'ajouter des attributs au tag
  HTML utilisé. Il accepte également la clé ``templateVars`` ce qui vous permet
  d'insérer des variables de template personnalisées dans le template.
- ``$separator`` : Un tableau d'attributs pour le template ``separator``.
  Voici les propriétés disponibles :

  - ``separator`` La chaîne qui sera utilisée comme séparateur
  - ``innerAttrs`` Pour fournir des attributs dans le cas où votre séparateur
    est en deux éléments
  - ``templateVars`` Vous permet de définir des variables de templates
    personnalisées dans le template

  Toutes les autres propriétés seront converties en attributs HTML et
  remplaceront la clé ``attrs`` dans le template. Si vous fournissez un tableau
  vide (le défaut) pour cet argument, aucun séparateur ne sera affiché.

Voici un exemple d'affichage d'un fil d'Ariane::

    echo $this->Breadcrumbs->render(
        ['class' => 'breadcrumbs-trail'],
        ['separator' => '<i class="fa fa-angle-right"></i>']
    );

Personnaliser l'affichage
-------------------------

Personnaliser les templates
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Le BreadcrumbsHelper utiliser le trait ``StringTemplateTrait`` en interne, ce
qui vous permet de facilement personnaliser le rendu des différentes chaînes
HTML qui composent votre fil d'Ariane.
Quatre templates sont inclus. Voici leur déclaration par défaut::

    [
        'wrapper' => '<ul{{attrs}}>{{content}}</ul>',
        'item' => '<li{{attrs}}><a href="{{url}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}',
        'itemWithoutLink' => '<li{{attrs}}><span{{innerAttrs}}>{{title}}</span></li>{{separator}}',
        'separator' => '<li{{attrs}}><span{{innerAttrs}}>{{custom}}{{separator}}</span></li>'
    ]

Vous pouvez facilement personnaliser ces templates via la méthode ``templates()``
du ``StringTemplateTrait``::

    $this->Breadcrumbs->templates([
        'wrapper' => '<nav class="breadcrumbs"><ul{{attrs}}>{{content}}</ul></nav>',
    ]);

Puisque les templates supportent l'option ``templateVars``, vous pouvez ajouter
vos propres variables de templates::

    $this->Breadcrumbs->templates([
        'item' => '<li{{attrs}}>{{icon}}<a href="{{url}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}'
    ]);

Et pour définir le paramètre ``{{icon}}``, vous n'avez qu'à la spécifier
lorsque vous ajouter l'élément à la liste::

    $this->Breadcrumbs->add(
        'Produits',
        ['controller' => 'products', 'action' => 'index'],
        [
            'templateVars' => [
                'icon' => '<i class="fa fa-money"></i>'
            ]
        ]
    );

.. _defining_attributes_item:

Defining Attributes for the Item
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Si vous voulez déclarez des attributs HTML à l'élément et ses sous-éléments,
vous pouvez utiliser la clé ``innerAttrs`` supportée par l'argument ``$options``.
Toutes les clés exceptées ``innerAttrs`` et ``templateVars`` seront affichés
comme attributs HTML::

    $this->Breadcrumbs->add(
        'Produits',
        ['controller' => 'products', 'action' => 'index'],
        [
            'class' => 'products-crumb',
            'data-foo' => 'bar',
            'innerAttrs' => [
                'class' => 'inner-products-crumb',
                'id' => 'the-products-crumb'
            ]
        ]
    );

    // En se basant sur le template par défaut, la chaîne suivante sera affichée :
    <li class="products-crumb" data-foo="bar">
        <a href="/products/index" class="inner-products-crumb" id="the-products-crumb">Produits</a>
    </li>

Réinitialiser la Liste d'éléments
=================================

Vous pouvez réinitialiser la liste d'éléments dans à l'aide de la méthode
``reset()``. Ceci est particulièrement utile quand vous souhaitez modifier les
éléments et complètement réinitialiser la liste::

    $crumbs = $this->Breadcrumbs->getCrumbs();
    $crumbs = collection($crumbs)->map(function ($crumb) {
        $crumb['options']['class'] = 'breadcrumb-item';
        return $crumb;
    })->toArray();

    $this->Breadcrumbs->reset()->add($crumbs);

.. versionadded:: 3.4.0
    La méthode ``reset()`` a été ajoutée dans la version 3.4.0

.. meta::
    :title lang=fr: BreadcrumbsHelper
    :description lang=fr: Le BreadcrumbsHelper de CakePHP vous permet de gérer facilement un fil d'Ariane
    :keywords lang=fr: breadcrumbs helper,cakephp crumbs,fil d'ariane,cakephp fil d'ariane
