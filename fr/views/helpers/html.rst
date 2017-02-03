Html
####

.. php:namespace:: Cake\View\Helper

.. php:class:: HtmlHelper(View $view, array $config = [])

Le rôle du Helper Html dans CakePHP est de fabriquer les options du HTML plus
facilement, plus rapidement. L'utilisation de ce Helper permettra à votre
application d'être plus légère, bien ancrée et plus flexible de l'endroit où
il est placé en relation avec la racine de votre domaine.

De nombreuses méthodes du Helper Html contiennent un paramètre
``$attributes``, qui vous permet d'insérer un attribut supplémentaire
sur vos tags. Voici quelques exemples sur la façon d'utiliser les paramètres
``$attributes``:

.. code-block:: html

    Attributs souhaités: <tag class="someClass" />
    Paramètre du tableau: ['class' => 'someClass']

    Attributs souhaités: <tag name="foo" value="bar" />
    Paramètre du tableau:  ['name' => 'foo', 'value' => 'bar']

Insertion d'éléments correctement formatés
==========================================

La tâche la plus importante que le Helper Html accomplit est la création d'un
balisage bien formé. Cette section couvrira quelques méthodes du Helper Html et
leur utilisation.

Créer un Tag Charset
--------------------

.. php:method:: charset($charset=null)

Utilisé pour créer une balise meta spécifiant le jeu de caractères du
document. UTF-8 par défaut. Exemple d'utilisation::

    echo $this->Html->charset();

Affichera:

.. code-block:: html

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

Sinon::

    echo $this->Html->charset('ISO-8859-1');

Affichera:

.. code-block:: html

    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

Lier des Fichiers CSS
---------------------

.. php:method:: css(mixed $path, array $options = [])

Crée un ou plusieurs lien(s) vers une feuille de style CSS. Si l'option ``block``
est définie à ``true``, les balises de liens sont ajoutées au bloc ``css`` qui
peut être dans la balise head du document.

Vous pouvez utiliser  l'option ``block`` pour contrôler sur lequel
des blocs l'élément lié sera ajouté. Par défaut il sera ajouté au bloc ``css``.

Si la clé 'rel' dans le tableau ``$options`` est définie à 'import',
la feuille de style sera importée.

Cette méthode d'inclusion CSS présume que le CSS spécifié se trouve dans
le répertoire **webroot/css** si le chemin ne commence pas par un '/'::

    echo $this->Html->css('forms');

Affichera:

.. code-block:: html

    <link rel="stylesheet" href="/css/forms.css" />

Le premier paramètre peut être un tableau pour inclure des fichiers multiples::

    echo $this->Html->css(['forms', 'tables', 'menu']);

Affichera:

.. code-block:: html

    <link rel="stylesheet" href="/css/forms.css" />
    <link rel="stylesheet" href="/css/tables.css" />
    <link rel="stylesheet" href="/css/menu.css" />

Vous pouvez inclure un fichier CSS depuis un plugin chargé en utilisant la
:term:`syntaxe de plugin`. Pour inclure
**plugins/DebugKit/webroot/css/toolbar.css**, vous pouvez utiliser ce qui suit::

        echo $this->Html->css('DebugKit.toolbar.css');

Si vous voulez inclure un fichier CSS qui partage un nom avec un plugin
chargé vous pouvez faire ce qui suit. Par exemple vous avez un plugin
``Blog``, et souhaitez inclure également **webroot/css/Blog.common.css**
vous pouvez faire ceci::

    echo $this->Html->css('Blog.common.css', ['plugin' => false]);

Créer des CSS par Programmation
-------------------------------
.. php:method:: style(array $data, boolean $oneline = true)

Construit les définitions de style CSS en se basant sur les clés et
valeurs du tableau passé à la méthode. Particulièrement pratique si votre
fichier CSS est dynamique::

    echo $this->Html->style([
        'background' => '#633',
        'border-bottom' => '1px solid #000',
        'padding' => '10px'
    ]);

Affichera ::

    background:#633; border-bottom:1px solid #000; padding:10px;

Créer des Balises meta
----------------------

.. php:method:: meta(string|array $type, string $url = null, array $options = [])

Cette méthode est pratique pour faire des liens vers des ressources
externes comme RSS/Atom feeds et les favicons. Comme avec css(), vous
pouvez spécifier si vous voulez l'apparition de la balise en ligne ou
l'ajouter au bloc ``meta`` en définissant la clé 'block' à ``true`` dans les
paramètres $attributes, ex. - ``['block' => true]``.

Si vous définissez l'attribut "type" en utilisant le paramètre $attributes,
CakePHP contient quelques raccourcis:

======== ======================
 type     valeur résultante
======== ======================
html     text/html
rss      application/rss+xml
atom     application/atom+xml
icon     image/x-icon
======== ======================

.. code-block:: php

    <?= $this->Html->meta(
        'favicon.ico',
        '/favicon.ico',
        ['type' => 'icon']
    );
    ?>
    // Affiche (saut de lignes ajoutés)
    <link
        href="http://example.com/favicon.ico"
        title="favicon.ico" type="image/x-icon"
        rel="alternate"
    />
    <?= $this->Html->meta(
        'Comments',
        '/comments/index.rss',
        ['type' => 'rss']
    );
    ?>
    // Affiche (saut de lignes ajoutés)
    <link
        href="http://example.com/comments/index.rss"
        title="Comments"
        type="application/rss+xml"
        rel="alternate"
    />

Cette méthode peut aussi être utilisée pour ajouter les meta keywords (mots
clés) et descriptions. Exemple::

    <?= $this->Html->meta(
        'keywords',
        'entrez vos mots clés pour la balise meta ici'
    );
    ?>
    // Affiche
    <meta name="keywords" content="entrez vos mots clés pour la balise meta ici" />

    <?= $this->Html->meta(
        'description',
        'entrez votre description pour la balise meta ici'
    );
    ?>
    // Affiche
    <meta name="description" content="entrez votre description pour la balise meta ici" />

En plus de faire des balises meta prédéfinies, vous pouvez créer des éléments de
lien::

    <?= $this->Html->meta([
        'link' => 'http://example.com/manifest',
        'rel' => 'manifest'
    ]);
    ?>
    // Affiche
    <link href="http://example.com/manifest" rel="manifest"/>

Tout attribut fourni à meta() lorsqu'elle est appelée de cette façon, sera
ajoutée à la balise de lien générée.

Créer le DOCTYPE
----------------

.. php:method:: docType(string $type = 'html5')

Retourne une déclaration DOCTYPE (*document type declaration*) (X)HTML.
Spécifiez le DOCTYPE souhaité selon la table suivante:

+--------------------------+----------------------------------+
| type                     | valeur finale                    |
+==========================+==================================+
| html4-strict             | HTML 4.01 Strict                 |
+--------------------------+----------------------------------+
| html4-trans              | HTML 4.01 Transitional           |
+--------------------------+----------------------------------+
| html4-frame              | HTML 4.01 Frameset               |
+--------------------------+----------------------------------+
| html5 (défaut)           | HTML5                            |
+--------------------------+----------------------------------+
| xhtml-strict             | XHTML 1.0 Strict                 |
+--------------------------+----------------------------------+
| xhtml-trans              | XHTML 1.0 Transitional           |
+--------------------------+----------------------------------+
| xhtml-frame              | XHTML 1.0 Frameset               |
+--------------------------+----------------------------------+
| xhtml11                  | XHTML 1.1                        |
+--------------------------+----------------------------------+

::

    echo $this->Html->docType();
    // Affiche: <!DOCTYPE html>

    echo $this->Html->docType('html4-trans');
    // Affiche:
    // <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    //    "http://www.w3.org/TR/html4/loose.dtd">

Lier des Images
---------------

.. php:method:: image(string $path, array $options = [])

Crée une balise image formatée. Le chemin fourni devra être relatif à
**webroot/img/**::

    echo $this->Html->image('cake_logo.png', ['alt' => 'CakePHP']);

Affichera:

.. code-block:: html

    <img src="/img/cake_logo.png" alt="CakePHP" />

Pour créer un lien d'image, spécifiez le lien de destination en
utilisant l'option ``url`` dans ``$attributes``::

    echo $this->Html->image("recipes/6.jpg", [
        "alt" => "Brownies",
        'url' => ['controller' => 'Recipes', 'action' => 'view', 6]
    ]);

Affichera:

.. code-block:: html

    <a href="/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Si vous créez des images dans des emails, ou si vous voulez des chemins
absolus pour les images, vous pouvez utiliser l'option ``fullBase``::

    echo $this->Html->image("logo.png", ['fullBase' => true]);

Affichera:

.. code-block:: html

    <img src="http://example.com/img/logo.jpg" alt="" />

Vous pouvez inclure des fichiers images depuis un plugin chargé en
utilisant :term:`syntaxe de plugin`. Pour inclure
**plugins/DebugKit/webroot/img/icon.png**, vous pouvez faire cela::

    echo $this->Html->image('DebugKit.icon.png');

Si vous voulez inclure un fichier image qui partage un nom
avec un plugin chargé vous pouvez faire ce qui suit. Par exemple si vous
avez un plugin ``Blog``, et si vous voulez également inclure
**webroot/img/Blog.icon.png**, vous feriez::

    echo $this->Html->image('Blog.icon.png', ['plugin' => false]);

Créer des Liens
---------------

.. php:method:: link(string $title, mixed $url = null, array $options = [])

Méthode générale pour la création de liens HTML. Utilisez les ``$options``
pour spécifier les attributs des éléments et si le ``$title`` doit ou
non être échappé::

    echo $this->Html->link(
        'Enter',
        '/pages/home',
        ['class' => 'button', 'target' => '_blank']
    );

Affichera:

.. code-block:: html

    <a href="/pages/home" class="button" target="_blank">Enter</a>

Utilisez l'option ``'_full'=>true`` pour des URLs absolues::

    echo $this->Html->link(
        'Dashboard',
        ['controller' => 'Dashboards', 'action' => 'index', '_full' => true]
     );

Affichera:

.. code-block:: html

    <a href="http://www.yourdomain.com/dashboards/index">Dashboard</a>


Spécifiez la clé ``confirm`` dans les options pour afficher une boite de
dialogue de confirmation JavaScript ``confirm()``::

    echo $this->Html->link(
        'Delete',
        ['controller' => 'Recipes', 'action' => 'delete', 6],
        ['confirm' => 'Are you sure you wish to delete this recipe?']
    );

Affichera:

.. code-block:: html

    <a href="/recipes/delete/6"
        onclick="return confirm(
            'Are you sure you wish to delete this recipe?'
        );">
        Delete
    </a>

Les chaînes de requête peuvent aussi être créées avec ``link()``::

    echo $this->Html->link('View image', [
        'controller' => 'Images',
        'action' => 'view',
        1,
        '?' => ['height' => 400, 'width' => 500]
    ]);

Affichera:

.. code-block:: html

    <a href="/images/view/1?height=400&width=500">View image</a>

Les caractères spéciaux HTML de ``$title`` seront convertis en entités
HTML. Pour désactiver cette conversion, définissez l'option escape à
``false`` dans le tableau ``$options``::

    echo $this->Html->link(
        $this->Html->image("recipes/6.jpg", ["alt" => "Brownies"]),
        "recipes/view/6",
        ['escape' => false]
    );

Affichera:

.. code-block:: html

    <a href="/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Définir ``escape`` à ``false`` va aussi désactiver l'échappement des attributs
du lien. Vous pouvez utiliser l'option ``escapeTitle`` pour juste
désactiver l'échappement du titre et pas des attributs::

    echo $this->Html->link(
        $this->Html->image('recipes/6.jpg', ['alt' => 'Brownies']),
        'recipes/view/6',
        ['escapeTitle' => false, 'title' => 'hi "howdy"']
    );

Affichera:

.. code-block:: html

    <a href="/recipes/view/6" title="hi &quot;howdy&quot;">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Regardez aussi la méthode :php:meth:`Cake\\View\\Helper\\UrlHelper::build()` pour
plus d'exemples des différents types d'URLs.

Liens vers des Videos et Fichiers Audio
---------------------------------------

.. php:method:: media(string|array $path, array $options)

Options:

- ``type`` Type d'éléments média à générer, les valeurs valides sont
  "audio" ou "video". Si le type n'est pas fourni le type de média se
  basera sur le type mime du fichier.
- ``text`` Texte à inclure dans la balise vidéo.
- ``pathPrefix`` Préfixe du chemin à utiliser pour les URLs relatives,
  par défaut à 'files/'.
- ``fullBase`` S'il est fourni, l'attribut src prendra l'adresse complète
  incluant le nom de domaine.

Retourne une balise formatée audio/video:

.. code-block:: php

    <?= $this->Html->media('audio.mp3') ?>

    // Sortie
    <audio src="/files/audio.mp3"></audio>

    <?= $this->Html->media('video.mp4', [
        'fullBase' => true,
        'text' => 'Fallback text'
    ]) ?>

    // Sortie
    <video src="http://www.somehost.com/files/video.mp4">Fallback text</video>

       <?= $this->Html->media(
            ['video.mp4', ['src' => 'video.ogg', 'type' => "video/ogg; codecs='theora, vorbis'"]],
            ['autoplay']
        ) ?>

        // Sortie
        <video autoplay="autoplay">
            <source src="/files/video.mp4" type="video/mp4"/>
            <source src="/files/video.ogg" type="video/ogg;
                codecs='theora, vorbis'"/>
        </video>

Lier des Fichiers Javascript
----------------------------

.. php:method:: script(mixed $url, mixed $options)

Inclus un(des) fichier(s), présent soit localement soit à une URL
distante.

Par défaut, les balises du script sont ajoutées au document inline. Si vous
le surchargez en configurant ``$options['block']`` à ``true``, les balises du
script vont plutôt être ajoutées au block ``script`` que vous pouvez
afficher ailleurs dans le document. Si vous souhaitez surcharger le nom
du block utilisé, vous pouvez le faire en configurant
``$options['block']``.

``$options['once']`` contrôle si vous voulez ou non inclure le script une
fois par requête. Par défaut à ``true``.

Vous pouvez utiliser $options pour définir des propriétés supplémentaires
pour la balise script générée. Si un tableau de balise script est utilisé,
les attributs seront appliqués à toutes les balises script générées.

Cette méthode d'inclusion de fichier JavaScript suppose que les fichiers
JavaScript spécifiés se trouvent dans le répertoire ``webroot/js``::

    echo $this->Html->script('scripts');

Affichera:

.. code-block:: html

    <script src="/js/scripts.js"></script>

Vous pouvez lier à des fichiers avec des chemins absolus
tant qu'ils ne se trouvent pas dans ``webroot/js``::

    echo $this->Html->script('/autrerep/fichier_script');

Vous pouvez aussi lier à une URL d'un dépôt distant::

    echo $this->Html->script('http://code.jquery.com/jquery.min.js');

Affichera:

.. code-block:: html

    <script src="http://code.jquery.com/jquery.min.js"></script>

Le premier paramètre peut être un tableau pour inclure des fichiers multiples::

    echo $this->Html->script(['jquery', 'wysiwyg', 'scripts']);

Affichera:

.. code-block:: html

    <script src="/js/jquery.js"></script>
    <script src="/js/wysiwyg.js"></script>
    <script src="/js/scripts.js"></script>

Vous pouvez insérer dans la balise script un bloc spécifique en
utilisant l'option ``block``::

    echo $this->Html->script('wysiwyg', ['block' => 'scriptBottom']);

Dans votre layout, vous pouvez afficher toutes les balises script ajoutées
dans 'scriptBottom'::

    echo $this->fetch('scriptBottom');

Vous pouvez inclure des fichiers de script depuis un plugin en utilisant
la :term:`syntaxe de plugin`. Pour inclure
**plugins/DebugKit/webroot/js/toolbar.js** vous pouvez faire cela::

    echo $this->Html->script('DebugKit.toolbar.js');

Si vous voulez inclure un fichier de script qui partage un nom de fichier
avec un plugin chargé vous pouvez faire cela. Par exemple si vous avez
Un plugin ``Blog``, et voulez inclure également **webroot/js/Blog.plugins.js**,
vous feriez::

    echo $this->Html->script('Blog.plugins.js', ['plugin' => false]);

Créer des Blocs Javascript Inline
---------------------------------

.. php:method:: scriptBlock($code, $options = [])

Pour générer des blocks Javascript à partir d'un code de vue en PHP, vous pouvez
utiliser une des méthodes de script de blocks. Les scripts peuvent soit être
affichés à l'endroit où ils sont écrits, soit être mis en mémoire tampon dans un
block::

    // Définit un block de script en une fois, avec l'attribut defer.
    $this->Html->scriptBlock('alert("hi")', ['defer' => true]);

    // Mis en mémoire d'un block de script pour être affiché plus tard.
    $this->Html->scriptBlock('alert("hi")', ['block' => true]);

.. php:method:: scriptStart($options = [])
.. php:method:: scriptEnd()

Vous pouvez utiliser la méthode ``scriptStart()`` pour créer un block capturant
qui va être affiché dans une balise ``<script>``. Les bouts de code de script
capturés peuvent être affichés inline, ou mis en mémoire tampon dans un block::

    // Ajoute dans le block 'script'.
    $this->Html->scriptStart(['block' => true]);
    echo "alert('Je suis dans le JavaScript');";
    $this->Html->scriptEnd();

Une fois que vous avez mis en mémoire tampon le javascript, vous pouvez
l'afficher comme vous le feriez pour tout autre :ref:`Block de vue <view-blocks>`::

    // Dans votre layout
    echo $this->fetch('script');

Créer des Listes Imbriquées
---------------------------

.. php:method:: nestedList(array $list, array $options = [], array $itemOptions = [])

Fabrique une liste imbriquée (UL/OL) dans un tableau associatif::

    $list = [
        'Languages' => [
            'English' => [
                'American',
                'Canadian',
                'British',
            ],
            'Spanish',
            'German',
        ]
    ];
    echo $this->Html->nestedList($list);

Affichera:

.. code-block:: html

    // Affichera (sans les espaces blancs)
    <ul>
        <li>Languages
            <ul>
                <li>English
                    <ul>
                        <li>American</li>
                        <li>Canadian</li>
                        <li>British</li>
                    </ul>
                </li>
                <li>Spanish</li>
                <li>German</li>
            </ul>
        </li>
    </ul>

Créer des En-Têtes de Tableaux
------------------------------

.. php:method:: tableHeaders(array $names, array $trOptions = null, array $thOptions = null)

Crée une ligne de cellule d'en-tête à placer dans la balise <table>::

    echo $this->Html->tableHeaders(['Date', 'Title', 'Active']);

// Affichera

.. code-block:: html

    <tr>
        <th>Date</th>
        <th>Title</th>
        <th>Active</th>
    </tr>

::

    echo $this->Html->tableHeaders(
        ['Date','Title','Active'],
        ['class' => 'status'],
        ['class' => 'product_table']
    );

Affichera:

.. code-block:: html

    <tr class="status">
         <th class="product_table">Date</th>
         <th class="product_table">Title</th>
         <th class="product_table">Active</th>
    </tr>

Vous pouvez définir des attributs par colonne, ceux-ci sont utilisés à la place
de ceux par défaut dans ``$thOptions``::

    echo $this->Html->tableHeaders([
        'id',
        ['Name' => ['class' => 'highlight']],
        ['Date' => ['class' => 'sortable']]
    ]);

Sortie:

.. code-block:: html

    <tr>
        <th>id</th>
        <th class="highlight">Name</th>
        <th class="sortable">Date</th>
    </tr>

Créer des Cellules de Tableaux
------------------------------

.. php:method:: tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)

Crée des cellules de table, en assignant aux lignes  des attributs <tr>
différents pour les lignes paires et les lignes impaires. Entoure une
table simple de cellule dans un [] pour des attributs <td>
spécifiques::

    echo $this->Html->tableCells([
        ['Jul 7th, 2007', 'Best Brownies', 'Yes'],
        ['Jun 21st, 2007', 'Smart Cookies', 'Yes'],
        ['Aug 1st, 2006', 'Anti-Java Cake', 'No'],
    ]);

Sortie:

.. code-block:: html

    <tr><td>Jul 7th, 2007</td><td>Best Brownies</td><td>Yes</td></tr>
    <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
    <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td>No</td></tr>

::

    echo $this->Html->tableCells([
        ['Jul 7th, 2007', ['Best Brownies', ['class' => 'highlight']] , 'Yes'],
        ['Jun 21st, 2007', 'Smart Cookies', 'Yes'],
        ['Aug 1st, 2006', 'Anti-Java Cake', ['No', ['id' => 'special']]],
    ]);

// Sortie

.. code-block:: html

    <tr>
        <td>
            Jul 7th, 2007
        </td>
        <td class="highlight">
            Best Brownies
        </td>
        <td>
            Yes
        </td>
    </tr>
    <tr>
        <td>
            Jun 21st, 2007
        </td>
        <td>
            Smart Cookies
        </td>
        <td>
            Yes
        </td>
    </tr>
    <tr>
        <td>
            Aug 1st, 2006
        </td>
        <td>
            Anti-Java Cake
        </td>
        <td id="special">
            No
        </td>
    </tr>

::

    echo $this->Html->tableCells(
        [
            ['Red', 'Apple'],
            ['Orange', 'Orange'],
            ['Yellow', 'Banana'],
        ],
        ['class' => 'darker']
    );

Affichera:

.. code-block:: html

    <tr class="darker"><td>Red</td><td>Apple</td></tr>
    <tr><td>Orange</td><td>Orange</td></tr>
    <tr class="darker"><td>Yellow</td><td>Banana</td></tr>

Changer l'affichage des balises avec le Helper Html
===================================================

.. php:method:: templates($templates)

Le paramètre ``$templates`` peut être soit un chemin de fichier en chaîne
de caractères vers le fichier PHP contenant les balises que vous
souhaitez charger, soit avec un tableau des templates à ajouter/remplacer::

    // Charger les templates à partir de config/my_html.php
    $this->Html->templates('my_html.php');

    // Charger les templates spécifiques.
    $this->Html->templates([
        'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
    ]);

Lors du chargement des fichiers de templates, votre fichier ressemblera à::

    <?php
    return [
        'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
    ];

.. warning::

    Les chaînes de template contenant un signe pourcentage (``%``) nécessitent
    une attention spéciale, vous devriez préfixer ce caractère avec un autre
    pourcentage pour qu'il ressemble à ``%%``. La raison est que les templates
    sont compilés en interne pour être utilisé avec ``sprintf()``.
    Exemple: '<div style="width:{{size}}%%">{{content}}</div>'

Création d'un chemin de navigation avec le Helper Html
======================================================

.. php:method:: addCrumb(string $name, string $link = null, mixed $options = null)
.. php:method:: getCrumbs(string $separator = '&raquo;', string $startText = false)
.. php:method:: getCrumbList(array $options = [], $startText = false)

Beaucoup d'applications utilisent un chemin de navigation (fil d'Ariane) pour
faciliter la navigation des utilisateurs. Vous pouvez créer un chemin de
navigation avec l'aide du HtmlHelper. Pour mettre cela en service, ajoutez cela
dans votre template de layout::

    echo $this->Html->getCrumbs(' > ', 'Home');

L'option ``$startText`` peut aussi accepter un tableau. Cela donne plus de
contrôle à travers le premier lien généré::

    echo $this->Html->getCrumbs(' > ', [
        'text' => $this->Html->image('home.png'),
        'url' => ['controller' => 'Pages', 'action' => 'display', 'home'],
        'escape' => false
    ]);

Toute clé qui n'est pas ``text`` ou ``url`` sera passée à
:php:meth:`~HtmlHelper::link()` comme paramètre ``$options``.

Maintenant, dans votre vue vous allez devoir ajouter ce qui suit
pour démarrer le fil d'Ariane sur chacune de vos pages::

    $this->Html->addCrumb('Users', '/users');
    $this->Html->addCrumb('Add User', ['controller' => 'Users', 'action' => 'add']);

Ceci ajoutera la sortie "**Home > Users > Add User**" dans votre layout
où ``getCrumbs`` a été ajouté.

Vous pouvez aussi récupérer le fil d'Ariane en tant que liste Html::

    echo $this->Html->getCrumbList();

Cette méthode utilise :php:meth:`Cake\\View\\Helper\\HtmlHelper::tag()` pour
générer la liste et ses éléments. Fonctionne de la même manière
que :php:meth:`~Cake\\View\\Helper\\HtmlHelper::getCrumbs()`, il utilise toutes
les options que chacun des fils a ajouté. Vous pouvez utiliser le paramètre
``$startText`` pour fournir le premier lien de fil. C'est utile quand vous
voulez inclure un lien racine. Cette option fonctionne de la même façon que
l'option ``$startText`` pour
:php:meth:`~Cake\\View\\Helper\\HtmlHelper::getCrumbs()`.

En option vous pouvez préciser un attribut standard HTML valide pour un
``<ul>`` (Liste non ordonnées) comme ``class`` et pour des options
spécifiques, vous avez:
``separator`` (sera entre les éléments ``<li>``), ``firstClass`` et
``lastClass`` comme::

    echo $this->Html->getCrumbList(
        [
            'firstClass' => false,
            'lastClass' => 'active',
            'class' => 'breadcrumb'
        ],
        'Home'
    );

Cette méthode utilise :php:meth:`Cake\\View\\Helper\\HtmlHelper::tag()` pour
générer une liste et ses éléments. Fonctionne de la même manière que
:php:meth:`~Cake\\View\\Helper\\HtmlHelper::getCrumbs()`, donc elle utilise
des options pour lesquelles chaque crumb a été ajouté. Vous pouvez utiliser le
paramètre ``$startText`` pour fournir le premier lien/texte breadcrumb. C'est
utile quand vous voulez toujours inclure un lien avec la racine. Cette option
fonctionne de la même manière que l'option ``$startText`` pour
:php:meth:`~Cake\\View\\Helper\\HtmlHelper::getCrumbs()`.

.. meta::
    :title lang=fr: HtmlHelper
    :description lang=fr: Le rôle de HtmlHelper dans CakePHP est de faciliter la construction des options HTML-related, plus rapide, et more resilient to change.
    :keywords lang=fr: html helper,cakephp css,cakephp script,content type,html image,html link,html tag,script block,script start,html url,cakephp style,cakephp crumbs
