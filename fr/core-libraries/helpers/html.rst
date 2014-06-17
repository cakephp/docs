HTMLHelper
##########

.. php:namespace:: Cake\View\Helper

.. php:class:: HtmlHelper(View $view, array $config = [])

Le rôle du Helper Html dans CakePHP est de fabriquer les options du HTML plus
facilement, plus rapidement. L'utilisation de ce Helper permettra à votre
application d'être plus légère, bien ancrée et plus flexible de l'endroit ou
il est placé en relation avec la racine de votre domaine.

De nombreuses méthodes du Helper Html contiennent un paramètre
``$htmlAttributes``, qui vous permet d'insérer un attribut supplémentaire
sur vos tags. Voici quelques exemples sur la façon d'utiliser les paramètres
$htmlAttributes:

.. code-block:: html

    Attributs souhaités: <tag class="someClass" />
    Paramètre du tableau: ['class' => 'someClass']

    Attributs souhaités: <tag name="foo" value="bar" />
    Paramètre du tableau:  ['name' => 'foo', 'value' => 'bar']


.. note::

    Le Helper html est disponible dans toutes les vues par défaut.
    Si vous recevez une erreur vous informant qu'il n'est pas disponible,
    c'est habituellement dû a son nom qui a été oublié de la configuration
    manuelle de la variable $helpers du controller.

Insertion d'éléments correctement formatés
==========================================

La tâche la plus importante que le Helper Html accomplit est la création d'un
balisage bien formé. N'ayez pas peur de l'utiliser souvent - vous pouvez cacher
les vues dans cakePHP pour économiser du temps CPU quand les vues sont rendues
et délivrées. Cette section couvrira les méthodes du Helper Html et comment
les utiliser.

.. php:method:: charset($charset=null)

    :param string $charset: Jeu de caractère désiré. S'il est null, la valeur
       de ``App.encoding`` sera utilisée.

    Utilisé pour créer une balise meta spécifiant le jeu de caractères du
    document. UTF-8 par défaut.

    Exemple d'utilisation::

        echo $this->Html->charset();

    Affichera:

    .. code-block:: html

        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    Sinon::

        echo $this->Html->charset('ISO-8859-1');

    Affichera:

    .. code-block:: html

        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

.. php:method:: css(mixed $path, array $options = [])

    :param mixed $path: Soit une chaîne du fichier CSS à lier, ou un tableau
       avec plusieurs fichiers.
    :param array $options: Un tableau d'options ou :term:`attributs html`.

    Créé un ou plusieurs lien(s) vers un feuille de style CSS. Si la clé
    'inline' est définie à false dans les paramètres ``$options``, les balises
    de lien seront ajoutées au bloc ``css`` lequel sera intégré à la balise
    entête du document.

    Vous pouvez utiliser  l'option ``block`` pour contrôler sur lequel
    des blocs l'élément lié sera ajouté. Par défaut il sera ajouté au bloc
    ``css``.

    Si la clé 'rel' dans le tableau ``$options`` est définie à 'import',
    la feuille de style sera importée.

    Cette méthode d'inclusion CSS présume que le CSS spécifié se trouve dans
    le répertoire /App/webroot/css si le chemin ne commence pas par un '/'.::

        echo $this->Html->css('forms');

    Affichera:

    .. code-block:: html

        <link rel="stylesheet" type="text/css" href="/css/forms.css" />

    Le premier paramètre peut être un tableau pour inclure des fichiers
    multiples.::

        echo $this->Html->css(['forms', 'tables', 'menu']);

    Affichera:

    .. code-block:: html

        <link rel="stylesheet" type="text/css" href="/css/forms.css" />
        <link rel="stylesheet" type="text/css" href="/css/tables.css" />
        <link rel="stylesheet" type="text/css" href="/css/menu.css" />

    Vous pouvez inclure un fichier CSS depuis un plugin chargé en utilisant la
    :term:`syntaxe de plugin`. Pour inclure
    ``app/Plugin/DebugKit/webroot/css/toolbar.css``, vous pouvez utiliser ce
    qui suit::

        echo $this->Html->css('DebugKit.toolbar.css');

    Si vous voulez inclure un fichier CSS qui partage un nom avec un plugin
    chargé vous pouvez faire ce qui suit. Par exemple vous avez un plugin
    ``Blog``, et souhaitez inclure également
    ``app/webroot/css/Blog.common.css``::

        echo $this->Html->css('Blog.common.css', ['plugin' => false]);

.. php:method:: meta(string $type, string $url = null, array $options = [])

    :param string $type: Le type de balise meta désiré.
    :param mixed $url: L'URL de la balise meta, soit une chaîne ou un tableau
     :term:`routing array`.
    :param array $options: Un tableau d'attributs :term:`html attributes`.

    Cette méthode est pratique pour faire des liens vers des ressources
    externes comme RSS/Atom feeds et les favicons. Comme avec css(), vous
    pouvez spécifier si vous voulez l'apparition de la balise en ligne ou
    l'ajouter au bloc ``meta`` en définissant la clé 'block' à true dans les
    paramètres $attributes, ex. - ``['block' => false]``.

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
        // Output
        <meta name="keywords" content="entrez vos mots clés pour la balise meta ici" />

        <?= $this->Html->meta(
            'description',
            'entrez votre description pour la balise meta ici'
        );
        ?>
        // Output
        <meta name="description" content="entrez votre description pour la balise meta ici" />

    Si vous voulez ajouter une balise personnalisée alors le premier paramètre
    devra être un tableau. Pour ressortir une balise de robots noindex,
    utilisez le code suivant::

        echo $this->Html->meta(['name' => 'robots', 'content' => 'noindex']);

.. php:method:: docType(string $type = 'html5')

    :param string $type: Le type de doctype fabriqué.

    Retourne une balise doctype (X)HTML. Fournissez votre doctype selon la
    table suivante:

    +--------------------------+----------------------------------+
    | type                     | valeur résultante                |
    +==========================+==================================+
    | html4-strict             | HTML4 Strict                     |
    +--------------------------+----------------------------------+
    | html4-trans              | HTML4 Transitional               |
    +--------------------------+----------------------------------+
    | html4-frame              | HTML4 Frameset                   |
    +--------------------------+----------------------------------+
    | html5                    | HTML5                            |
    +--------------------------+----------------------------------+
    | xhtml-strict             | XHTML1 Strict                    |
    +--------------------------+----------------------------------+
    | xhtml-trans              | XHTML1 Transitional              |
    +--------------------------+----------------------------------+
    | xhtml-frame              | XHTML1 Frameset                  |
    +--------------------------+----------------------------------+
    | xhtml11                  | XHTML1.1                         |
    +--------------------------+----------------------------------+

    ::

        echo $this->Html->docType();
        // Sortie: <!DOCTYPE html>

        echo $this->Html->docType('html4-trans');
        // Sortie:
        // <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        //    "http://www.w3.org/TR/html4/loose.dtd">

.. php:method:: style(array $data, boolean $oneline = true)

    :param array $data: Un ensemble de clé => valeurs avec des propriétés CSS.
    :param boolean $oneline: Le contenu sera sur une seule ligne.

    Construit les définitions de style CSS en se basant sur les clés et
    valeurs du tableau passé à la méthode. Particulièrement pratique si votre
    fichier CSS est dynamique.::

        echo $this->Html->style([
            'background' => '#633',
            'border-bottom' => '1px solid #000',
            'padding' => '10px'
        ]);

    Affichera ::

        background:#633; border-bottom:1px solid #000; padding:10px;

.. php:method:: image(string $path, array $options = [])

    :param string $path: Chemin de l'image.
    :param array $options: Un tableau de :term:`attributs html`.

    Créé une balise image formatée. Le chemin fourni devra être relatif à
    /App/webroot/img/.::

        echo $this->Html->image('cake_logo.png', ['alt' => 'CakePHP']);

    Affichera:

    .. code-block:: html

        <img src="/img/cake_logo.png" alt="CakePHP" />

    Pour créer un lien d'image, spécifiez le lien de destination en
    utilisant l'option ``url`` dans ``$htmlAttributes``.::

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
    utilisant :term:`plugin syntax`. Pour inclure
    ``app/Plugin/DebugKit/webroot/img/icon.png``, vous pouvez faire cela::

        echo $this->Html->image('DebugKit.icon.png');

    Si vous voulez inclure un fichier image qui partage un nom
    avec un plugin chargé vous pouvez faire ce qui suit. Par exemple si vous
    avez un plugin `Blog``, et si vous voulez également inclure
    ``app/webroot/js/Blog.icon.png``, vous feriez::

        echo $this->Html->image('Blog.icon.png', ['plugin' => false]);

.. php:method:: link(string $title, mixed $url = null, array $options = [], string $confirmMessage = false)

    :param string $title: Le texte à afficher comme corps du lien.
    :param mixed $url: Soit la chaîne spécifiant le chemin, ou un :term:`tableau routing`.
    :param array $options: Un tableau de :`html attributes`.

    Méthode générale pour la création de liens HTML. Utilisez les ``$options``
    pour spécifier les attributs des éléments et si le ``$title`` doit ou
    non être échappé.::

        echo $this->Html->link(
            'Enter',
            '/pages/home',
            ['class' => 'button', 'target' => '_blank']
        );

    Affichera:

    .. code-block:: html

        <a href="/pages/home" class="button" target="_blank">Enter</a>

    Utilisez l'option ``'full_base' => true`` pour des URLs absolues::

        echo $this->Html->link(
            'Dashboard',
            ['controller' => 'Dashboards', 'action' => 'index', '_full' => true]
        );

    Affichera:

    .. code-block:: html

        <a href="http://www.yourdomain.com/dashboards/index">Dashboard</a>


    Spécifiez ``$confirmMessage`` pour afficher une boite de dialogue de
    confirmation JavaScript ``confirm()``::

        echo $this->Html->link(
            'Delete',
            ['controller' => 'Recipes', 'action' => 'delete', 6],
            [],
            "Are you sure you wish to delete this recipe?"
        );

    Affichera:

    .. code-block:: html

        <a href="/recipes/delete/6"
            onclick="return confirm(
                'Are you sure you wish to delete this recipe?'
            );">
            Delete
        </a>

    Les chaînes de requête peuvent aussi être créées avec ``link()``.::

        echo $this->Html->link('View image', [
            'controller' => 'Images',
            'action' => 'view',
            1,
            '?' => ['height' => 400, 'width' => 500]
        ]);

    Affichera:

    .. code-block:: html

        <a href="/images/view/1?height=400&width=500">View image</a>

    Quand vous utilisez les paramètres nommés, utilisez la syntaxe en
    tableau et incluez les noms pour TOUS les paramètres dans l'URL. En
    utilisant la syntaxe en chaîne pour les paramètres (par ex
    "recipes/view/6/comments:false") va faire que les caractères
    seront echappés du HTML et le lien ne fonctionnera pas comme souhaité.::

        <?php
        echo $this->Html->link(
            $this->Html->image("recipes/6.jpg", ["alt" => "Brownies"]),
            ['controller' => 'Recipes', 'action' => 'view', 'id' => 6, 'comments' => false]
        );

    Affichera:

    .. code-block:: html

        <a href="/recipes/view/id:6/comments:false">
            <img src="/img/recipes/6.jpg" alt="Brownies" />
        </a>

    Les caractères spéciaux HTML de ``$title`` seront convertis en entités
    HTML. Pour désactiver cette conversion, définissez l'option escape à
    false dans le tableau ``$options``::

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

    Définir ``escape`` à false va aussi désactiver l'échappement des attributs
    du lien. Vous pouvez utiliser l'option ``escapeTitle`` pour juste
    désactiver l'échappement du titre et pas des attributs.::

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

    Regardez aussi la méthode :php:meth:`HtmlHelper::url` pour
    plus d'exemples des différents types d'URLs.

.. php:method:: media(string|array $path, array $options)

    :param string|array $path: Chemin du fichier vidéo, relatif au répertoire
        `webroot/{$options['pathPrefix']}`. Ou un tableau où chaque élément
        peut être la chaîne d'un chemin ou un tableau associatif contenant
        les clés `src` et `type`.
    :param array $options: Un tableau d'attributs HTML, et d'options spéciales.

        Options:

        - `type` Type d'éléments média à générer, les valeurs valides sont
          "audio" ou "video". Si le type n'est pas fourni le type de média se
          basera sur le type mime du fichier.
        - `text` Texte à inclure dans la balise vidéo.
        - `pathPrefix` Préfixe du chemin à utiliser pour les URLs relatives,
          par défaut à 'files/'.
        - `fullBase` Si il est fourni, l'attribut src prendra l'adresse complète
          incluant le nom de domaine.

    Retourne une balise formatée audio/video:

    .. code-block:: php

        <?php echo $this->Html->media('audio.mp3'); ?>

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

.. php:method:: tag(string $tag, string $text, array $htmlAttributes)

    :param string $tag: Le nom de la balise créée.
    :param string $text: Le contenu de la balise.
    :param array $options: Un tableau de :term:`attributs html`.

    Retourne des textes enveloppés dans une balise spécifiée. Si il n'y a
    pas de texte spécifié alors le contenu du <tag> sera retourné.:

    .. code-block:: php

        <?= $this->Html->tag('span', 'Hello World.', ['class' => 'welcome']) ?>

        // Affichera
        <span class="welcome">Hello World</span>

        // Aucun texte spécifié.
        <?= $this->Html->tag('span', null, ['class' => 'welcome']) ?>

        // Affichera
        <span class="welcome">

    .. note::

        Le texte n'est pas échappé par défaut mais vous pouvez utiliser
        ``$htmlOptions['escape'] = true`` pour échapper votre texte. Ceci
        remplace un quatrième paramètre ``boolean $escape = false`` qui était
        présent dans les précédentes versions.

.. php:method:: div(string $class, string $text, array $options)

    :param string $class: Le nom de classe de la div.
    :param string $text: Le contenu de la div.
    :param array $options: Un tableau de :term:`attributs html`.

    Utilisé pour les sections de balisage enveloppés dans des div. Le premier
    paramètre spécifie une clasee CSS, et le second est utilisé pour fournir
    le texte à envelopper par les balises div. Si le dernier paramètre à été
    défini à true, $text sera affiché en HTML-échappé.

    Si aucun texte n'est spécifié, seulement une balise div d'ouverture est
    retournée.:

    .. code-block:: php

        <?= $this->Html->div('error', 'Entrez votre numéro de carte bleue S.V.P.') ?>

        // Affichera
        <div class="error">Entrez votre numéro de carte bleue S.V.P.</div>

.. php:method::  para(string $class, string $text, array $options)

    :param string $class: Le nom de classe du paragraphe.
    :param string $text: Le contenu du paragraphe.
    :param array $options: Un tableau de :term:`attributs html`.

    Retourne un texte enveloppé dans une balise CSS <p>. Si aucun texte
    CSS n'est fourni, un simple <p> de démarrage est retourné.:

    .. code-block:: php

        <?= $this->Html->para(null, 'Hello World.') ?>

        // Affichera
        <p>Hello World.</p>

.. php:method:: script(mixed $url, mixed $options)

    :param mixed $url: Soit un simple fichier Javascript, soit un
       tableau de chaînes pour plusieurs fichiers.
    :param array $options: Un tableau de :term:`attributs html`.

    Inclus un(des) fichier(s), présent soit localement soit à une URL
    distante.

    Par défaut, les balises du script sont ajoutés au document inline. Si vous
    le surcharger en configurant ``$options['block']`` à true, les balises du
    script vont plutôt être ajoutées au block ``script`` que vous pouvez
    afficher aileurs dans le document. Si vous souhaitez surcharger le nom
    du block utilisé, vous pouvez le faire en configurant
    ``$options['block']``.

    ``$options['once']`` contrôle si vous voulez ou non inclure le script une
    fois par requête. Par défaut à true.

    Vous pouvez utiliser $options pour définir des propriétés supplémentaires
    pour la balise script générée. Si un tableau de balise script est utilisé,
    les attributs seront appliqués à toutes les balises script générées.

    Cette méthode d'inclusion de fichier JavaScript suppose que les fichiers
    JavaScript spécifiés se trouvent dans le répertoire ``/App/webroot/js``.::

        echo $this->Html->script('scripts');

    Affichera:

    .. code-block:: html

        <script src="/js/scripts.js"></script>

    Vous pouvez lier à des fichiers avec des chemins absolus
    tant qu'ils ne se trouvent pas dans ``app/webroot/js``::

        echo $this->Html->script('/autrerep/fichier_script');

    Vous pouvez aussi lier à une URL d'un dépôt distant::

        echo $this->Html->script('http://code.jquery.com/jquery.min.js');

    Affichera:

    .. code-block:: html

        <script src="http://code.jquery.com/jquery.min.js"></script>

    Le premier paramètre peut être un tableau pour inclure des
    fichiers multiples.::

        echo $this->Html->script(['jquery', 'wysiwyg', 'scripts']);

    Affichera:

    .. code-block:: html

        <script src="/js/jquery.js"></script>
        <script src="/js/wysiwyg.js"></script>
        <script src="/js/scripts.js"></script>

    Vous pouvez insérer dans la balise script un bloc spécifique en
    utilisant l'option ``block``.::

        echo $this->Html->script('wysiwyg', ['block' => 'scriptBottom']);

    Dans votre layout, vous pouvez afficher toutes les balises script ajoutées
    dans 'scriptBottom'::

        echo $this->fetch('scriptBottom');

    Vous pouvez inclure des fichiers de script depuis un plugin en utilisant
    la :term:`syntaxe de plugin`. Pour inclure
    ``app/Plugin/DebugKit/webroot/js/toolbar.js`` vous pouvez faire cela::

        echo $this->Html->script('DebugKit.toolbar.js');

    Si vous voulez inclure un fichier de script qui partage un nom de fichier
    avec un plugin chargé vous pouvez faire cela. Par exemple si vous avez
    Un plugin ``Blog``, et voulez inclure également
    ``app/webroot/js/Blog.plugins.js``, vous feriez::

        echo $this->Html->script('Blog.plugins.js', ['plugin' => false]);

.. php:method:: scriptBlock($code, $options = [])

    :param string $code: Le code à placer dans la balise script.
    :param array $options: Un tableau de :term:`attributs html`.

    Génère un bloc de code contenant ``code`` et définit ``$options['inline']``
    à true pour voir le bloc de script apparaître dans le bloc de vue
    ``script``. D'autre options définies seront ajoutées comme attributs dans
    les balises de script.
    ``$this->Html->scriptBlock('stuff', ['defer' => true]);`` va créer une
    balise script avec l'attribut ``defer="defer"``.

.. php:method:: scriptStart($options = [])

    :param array $options: Un tableau de :term:`html attributes` à
        utiliser quand scriptEnd est appelée.

    Débute la mise en mémoire tampon d'un block de code. Ce block de code
    va capturer toutes les sorties entre ``scriptStart()`` et ``scriptEnd()``
    et créé une balise script. Les options sont les mêmes que celles de
    ``scriptBlock()``

.. php:method:: scriptEnd()

    Termine la mise en mémoire tampon d'un bloc de script, retourne l'élément
    script généré ou null si le block de script à été ouvert avec block = true.

    Un exemple de l'utilisation de ``scriptStart()`` et ``scriptEnd()``
    pourrait être::

        $this->Html->scriptStart(['block' => true]);

        echo $this->Js->alert('je suis dans le JavaScript');

        $this->Html->scriptEnd();

.. php:method:: nestedList(array $list, array $options = [], array $itemOptions = [])

    :param array $list: Ensemble d'éléments à lister.
    :param array $options: Options et attributs HTML supplémentaires des balises
        de liste (ol/ul).
    :param array $itemOptions: Options et attributs HTML supplémentaires des
        balises de liste item (LI).

    Fabrique une liste imbriquée (UL/OL) dans un tableau associatif::

        $list = [
            'Languages' => [
                'English' => [
                    'American',
                    'Canadian',
                    'British',
                [,
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

.. php:method:: tableHeaders(array $names, array $trOptions = null, array $thOptions = null)

    :param array $names: Un tableau de chaîne pour créé les entêtes de tableau.
    :param array $trOptions: Un tableau de :term:`html attributes`
        pour le <tr>.
    :param array $thOptions: Un tableau de :term:`html attributes`
        pour l'élément <th>.

    Créé une ligne de cellule d'en-tête à placer dans la balise <table>.::

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

    Vous pouvez définir des attributs par colonne, ceux-ci sont
    utilisés à la place de ceux par défaut dans ``$thOptions``::

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

.. php:method:: tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)

    :param array $data: Un tableau à deux dimensions avec les données pour les
        lignes.
    :param array $oddTrOptions: Un tableau de :term:`html attributes`
        pour les <tr> impairs.
    :param array $evenTrOptions: Un tableau de :term:`html attributes`
        pour les <tr> pairs.
    :param boolean $useCount: Ajoute la classe "column-$i".
    :param boolean $continueOddEven: Si à false, utilisera une variable $count
        non-statique, ainsi le compteur impair/pair est remis à zéro juste pour
        cet appel.

    Créé des cellules de table, en assignant aux lignes  des attributs <tr>
    différents pour les lignes paires et les lignes impaires. Entoure une
    table simple de cellule dans un [] pour des attributs <td>
    spécifiques. ::

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

.. php:method:: url(mixed $url = NULL, boolean $full = false)

    :param mixed $url: Un :term:`routing array`.
    :param mixed $full: Soit un booléen s'il faut ou pas que la base du
        chemin soit incluse ou un tableau d'options pour le routeur
        :php:meth:`Router::url()`.

    Retourne une URL pointant vers une combinaison controller et action.
    Si $url est vide, cela retourne la REQUEST\_URI, sinon cela génère la
    combinaison d'une URL pour le controller et d'une action. Si full est à
    true, la base complète de l'URL sera ajoutée en amont du résultat::

        echo $this->Html->url([
            "controller" => "posts",
            "action" => "view",
            "bar"
        ]);

        // Affichera
        /posts/view/bar

    Voici quelques exemples supplémentaires:

    URL avec des paramètres nommés::

        echo $this->Html->url([
            "controller" => "posts",
            "action" => "view",
            "foo" => "bar"
        ]);

        // Affichera
        /posts/view/foo:bar

    URL avec une extension::

        echo $this->Html->url([
            "controller" => "posts",
            "action" => "list",
            "ext" => "rss"
        ]);

        // Affichera
        /posts/list.rss

    URL (commençant par '/') avec la base complète d'URL ajoutée::

        echo $this->Html->url('/posts', true);

        // Affichera
        http://somedomain.com/posts

    URL avec des paramètres GET et une ancre nommée::

        echo $this->Html->url([
            "controller" => "posts",
            "action" => "search",
            "?" => ["foo" => "bar"],
            "#" => "first"
        ]);

        // Affichera
        /posts/search?foo=bar#first

    Pour plus d'information voir 
    `Router::url <http://api.cakephp.org/3.0/class-Cake.Routing.Router.html#_url>`_
    dans l' API.

.. php:method:: useTag(string $tag)

    Retourne un bloc existant formaté de ``$tag``::

        $this->Html->useTag(
            'form',
            'http://example.com',
            ['method' => 'post', 'class' => 'myform']
        );

    Affichera:

    .. code-block:: html

        <form action="http://example.com" method="post" class="myform">

Changer l'affichage des balises avec le Helper Html
===================================================

.. php:method:: templates($templates)

    Le paramètre ``$templates`` peut être soit un chemin de fichier en chaîne
    de caractères vers le fichier PHP contenant les balises que vous
    souhaitez charger, soit avec un tableau des templates à ajouter/remplacer::

        // Charger les templates à partir de App/Config/my_html.php
        $this->Html->templates('my_html.php');

        // Charger les templates spécifiques.
        $this->Html->templates([
            'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
        ]);

    Lors du chargement des fichiers de templates, votre fichier ressemblera à::

        <?php
        $config = [
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

.. php:method:: getCrumbs(string $separator = '&raquo;', string $startText = false)

    CakePHP inclut la possibilité de créer automatiquement un chemin de
    navigation (fil d'Ariane) dans votre application. Pour mettre cela en
    service, ajoutez cela dans votre template de layout::

        echo $this->Html->getCrumbs(' > ', 'Home');

    L'option ``$startText`` peut aussi accepter un tableau. Cela donne plus de
    contrôle à travers le premier lien généré::

        echo $this->Html->getCrumbs(' > ', [
            'text' => $this->Html->image('home.png'),
            'url' => ['controller' => 'Pages', 'action' => 'display', 'home'],
            'escape' => false
        ]);

    Une clé qui n'est pas ``text`` ou ``url`` sera passée à
    :php:meth:`~HtmlHelper::link()` comme paramètre ``$options``.

.. php:method:: addCrumb(string $name, string $link = null, mixed $options = null)

    Maintenant, dans votre vue vous allez devoir ajouter ce qui suit
    pour démarrer le fil d'Ariane sur chacune de vos pages.::

        $this->Html->addCrumb('Users', '/users');
        $this->Html->addCrumb('Add User', ['controller' => 'Users', 'action' => 'add']);

    Ceci ajoutera la sortie "**Home > Users > Add User**" dans votre layout
    où le fil d'Ariane a été ajouté.

.. php:method:: getCrumbList(array $options = [], mixed $startText)

    :param array $options: Un tableau de :term:`html attributes` pour les
        elements contenant ``<ul>``. Peut aussi contenir les options
        'separator', 'firstClass', 'lastClass' et 'escape'.
    :param string|array $startText: Le texte ou l'elément qui précède ul.

    Retourne le fil d'Ariane comme une liste (x)html.

    Cette méthode utilise :php:meth:`HtmlHelper::tag()` pour générer la
    liste et ces éléments. Fonctionne de la même manière
    que :php:meth:`~HtmlHelper::getCrumbs()`, il utilise toutes les options
    que chacun des fils a ajouté. Vous pouvez utiliser le paramètre
    ``$startText`` pour fournir le premier lien de fil. C'est utile quand vous
    voulez inclure un lien racine. Cette option fonctionne de la même façon que
    l'option ``$startText`` pour :php:meth:`~HtmlHelper::getCrumbs()`.


.. meta::
    :title lang=fr: HtmlHelper
    :description lang=fr: Le rôle de HtmlHelper dans CakePHP est de faciliter la construction des options HTML-related, plus rapide, et more resilient to change.
    :keywords lang=fr: html helper,cakephp css,cakephp script,content type,html image,html link,html tag,script block,script start,html url,cakephp style,cakephp crumbs
