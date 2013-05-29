HTMLHelper
##########

.. php:class:: HtmlHelper(View $view, array $settings = array())

Le rôle du Helper Html dans CakePHP est de fabriquer les options
du HTML plus facilement, plus rapidement. L'utilisation de cet Helper 
permettra à votre application d'être plus légère bien ancrée et plus 
flexible de l'endroit ou il est placé en relation avec la racine de votre 
domaine.

De nombreuses méthodes du Helper Html contiennent un paramètre
``$htmlAttributes``, qui vous permet d'insérer un  attribut supplémentaire 
sur vos tags. Voici quelques exemples
sur la façon d'utiliser les paramètres $htmlAttributes:

.. code-block:: html

    Attributs souhaités: <tag class="someClass" />      
    Paramètre du tableau: array('class' => 'someClass')
     
    Attributs souhaités: <tag name="foo" value="bar" />  
    Paramètre du tableau:  array('name' => 'foo', 'value' => 'bar')

.. note::

    Le Helper html est disponible dans toutes les vues par défaut. 
    Si vous recevez une erreur vous informant qu'il n'est pas disponible,
    c'est habituellement dû a son nom qui a été oublié de la configuration
    manuelle de la variable $helpers du controller. 
    
Insertion d'éléments correctement formatés 
==========================================

La tâche la plus importante que le Helper Html accomplit est la
création d'un balisage bien formé. N'ayez pas peur de l'utiliser
souvent - vous pouvez cacher les vues dans cakePHP pour économiser
du temps CPU quand les vues sont rendues et délivrées. Cette section
couvrira les méthodes du Helper Html et comment les utiliser.

.. php:method:: charset($charset=null)

    :param string $charset: Jeu de caractère désiré.  s'il est null, la valeur de 
       ``App.encoding`` sera utilisé.

    Utilisé pour créé une balise meta spécifiant le jeu de caractères du document.
    UTF-8 par défaut

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

.. php:method:: css(mixed $path, string $rel = null, array $options = array())

    :param mixed $path: Soit une chaîne du fichier css à lier, ou un tableau 
     avec plusieurs fichiers
    :param string $rel: La valeur de l'attribut tag's rel (balise rel). Si 
     null, 'stylesheet' sera utilisé
       
    :param array $options: Un tableau d'attributs  :term:`attributs html`.

    Créé un ou plusieurs lien(s) vers un feuille de style CSS. Si la clef 
    'inline' est définie à false dans les paramètres ``$options``, les balises 
    de lien seront ajoutés au bloc ``css`` lequel sera intégré à la balise 
    entête du document.
   
    Vous pouvez utiliser  l'option ``block`` pour contrôler sur lequel
    des blocs l'élément lié sera ajouté. Par défaut il sera ajouté au bloc 
    ``css``.

    Cette méthode d'inclusion CSS présume que le CSS spécifié se trouve dans
    le répertoire /app/webroot/css.::

        echo $this->Html->css('forms');

    Affichera:

    .. code-block:: html

        <link rel="stylesheet" type="text/css" href="/css/forms.css" />

    Le premier paramètre peut être un tableau pour inclure des fichiers 
    multiples.::

        echo $this->Html->css(array('forms', 'tables', 'menu'));

    Affichera:

    .. code-block:: html

        <link rel="stylesheet" type="text/css" href="/css/forms.css" />
        <link rel="stylesheet" type="text/css" href="/css/tables.css" />
        <link rel="stylesheet" type="text/css" href="/css/menu.css" />

    Vous pouvez inclure un fichiers css depuis un plugin chargé en utilisant 
    :term:`syntaxe de plugin`.  Pour inclure ``app/Plugin/DebugKit/webroot/css/toolbar.css``
    Vous pouvez utiliser ce qui suit::

        echo $this->Html->css('DebugKit.toolbar.css');

    Si vous voulez inclure un fichier css qui partage un nom avec un plugin
    chargé vous pouvez faire ce qui suit.  Par exemple vous avez un plugin 
    ``Blog``, et souhaitez inclure également 
    ``app/webroot/css/Blog.common.css``::

        echo $this->Html->css('Blog.common.css', null, array('plugin' => false));

    .. versionchanged:: 2.1
        L'option ``block`` a été ajoutée.
        Le support de :term:`syntaxe de plugin` à été ajouté.

.. php:method:: meta(string $type, string $url = null, array $options = array())

    :param string $type: Le type de balise meta  désiré.
    :param mixed $url: L'url de la balise meta,  soit une chaîne ou un tableau 
     :term:`routing array`.
    :param array $options: Un tableau d'attributs :term:`html attributes`.

    Cette méthode est fournie pour le lien vers des ressources externes
    comme RSS/Atom feeds et les favicons. Comme avec css(), vous pouvez
    spécifier si vous voulez l'apparition de la balise en ligne ou l'ajouter au
    bloc ``meta`` en définissant la clef 'inline' à false dans les paramètres
    $attributes, ex. - ``array('inline' => false)``.

    Si vous définissez l'attribut "type" en utilisant le paramètre $attributes,
    CakePHP contient certains raccourcis:

    ======== ======================
     type     valeur résultante
    ======== ======================
    html     text/html
    rss      application/rss+xml
    atom     application/atom+xml
    icon     image/x-icon
    ======== ======================

    ::

        echo $this->Html->meta(
            'favicon.ico',
            '/favicon.ico',
            array('type' => 'icon')
        );
        // Affichera (sauts de lignes ajoutés)
        <link
            href="http://example.com/favicon.ico"
            title="favicon.ico" type="image/x-icon"
            rel="alternate"
        />
         
        echo $this->Html->meta(
            'Comments',
            '/comments/index.rss',
            array('type' => 'rss')
        );
        // Affichera (sauts de lignes ajoutés)
        <link
            href="http://example.com/comments/index.rss"
            title="Comments"
            type="application/rss+xml"
            rel="alternate"
        />

    Cette méthode peut aussi être utilisée pour ajouter les balise de mots clés
    et les descriptions. Exemple::

        echo $this->Html->meta(
            'mot clef',
            'entrez une balise de mot clef ici'
        );
        // Affichera
        <meta name="mot clef" content="entrez une balise de mot clef ici" />

        echo $this->Html->meta(
            'description',
            'entrez une description ici'
        );
        // Output
        <meta name="description" content="entrez une description ici" />

    Si vous voulez ajouter une balise personnalisée alors le premier
    paramètre devra être un tableau. Pour ressortir  une balise de robots 
    noindex, utilisez le code suivant::

        echo $this->Html->meta(array('name' => 'robots', 'content' => 'noindex')); 

    .. versionchanged:: 2.1
        L'option ``block`` a été ajoutée.

.. php:method:: docType(string $type = 'xhtml-strict')

    :param string $type: Le type de doctype fabriqué.

    Retourne un balise doctype (X)HTML . Fournissez le doctype en suivant la 
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
        // Affichera: <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

        echo $this->Html->docType('html5');
        // Affichera: <!DOCTYPE html>

        echo $this->Html->docType('html4-trans');
        // Affichera: <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

    .. versionchanged:: 2.1
        La valeur par défaut de doctype est html5 avec la version 2.1.

.. php:method:: style(array $data, boolean $oneline = true)

    :param array $data: Un jeu de clef => valeurs avec des propriétés CSS.
    :param boolean $oneline: Le contenu sera sur une seule ligne.

    Construit les définitions de style CSS en se basant sur les clefs et 
    valeurs du tableau passé à la méthode. Particulièrement pratique si votre 
    fichier CSS est dynamique.::

        echo $this->Html->style(array(
            'background' => '#633',
            'border-bottom' => '1px solid #000',
            'padding' => '10px'
        )); 

    Affichera ::

        background:#633; border-bottom:1px solid #000; padding:10px;

.. php:method:: image(string $path, array $options = array())

    :param string $path: Chemin de l'image.
    :param array $options: Un tableau de :term:`attributs html`.

    Créé une balise image formatée. Le chemin fournit devra être relatif à
    /app/webroot/img/.::

        echo $this->Html->image('cake_logo.png', array('alt' => 'CakePHP'));

    Affichera:

    .. code-block:: html

        <img src="/img/cake_logo.png" alt="CakePHP" /> 

    Pour créé un lien d'image spécifiez le lien de destination en 
    utilisant l'option ``url`` dans ``$htmlAttributes``.::

        echo $this->Html->image("recettes/6.jpg", array(
            "alt" => "Crèpes",
            'url' => array('controller' => 'recettes', 'action' => 'view', 6)
        ));

   Affichera:

    .. code-block:: html

        <a href="/recettes/view/6">
            <img src="/img/recettes/6.jpg" alt="Crèpes" />
        </a>

    Si vous créez des images dans des mails, ou voulez des chemins
    absolus pour les images vous pouvez utiliser l'option ``fullBase``::

        echo $this->Html->image("logo.png", array('fullBase' => true));

    Affichera:

    .. code-block:: html

        <img src="http://example.com/img/logo.jpg" alt="" />

    Vous pouvez inclure des fichiers images depuis un plugin chargé en utilisant
    :term:`plugin syntax`.  Pour inclure 
    ``app/Plugin/DebugKit/webroot/img/icon.png``, vous pouvez faire cela::

        echo $this->Html->image('DebugKit.icon.png');

    Si vous voulez inclure un fichier image qui partage un nom
    avec un plugin chargé vous pouvez faire ce qui suit. Par exemple si vous
    avez in plugin `Blog``, et voulez inclure également 
    ``app/webroot/js/Blog.icon.png``::

        echo $this->Html->image('Blog.icon.png', array('plugin' => false));

    .. versionchanged:: 2.1
        L'option ``fullBase`` a été ajouté.
        Le support de :term:`syntaxe de plugin` a été ajouté.

.. php:method:: link(string $title, mixed $url = null, array $options = array(), string $confirmMessage = false)

    :param string $title: Le texte à afficher comme le body (corp) du lien.
    :param mixed $url: Soit la chaîne spécifiant le chemin, ou un :term:`tableau routing`.
    :param array $options: Un tableau d'attributs :`html attributes`.

    Méthode générale pour la création de liens HTML. Utilisez les ``$options`` 
    pour spécifier les attributs des éléments et si le ``$title`` devra ou 
    pas être échappé.::

        echo $this->Html->link('Entrez', '/pages/accueil', array('class' => 'button', 'target' => '_blank'));

    Affichera:

    .. code-block:: html

        <a href="/pages/accueil" class="button" target="_blank">Entrez</a>

    Utilisez l'option ``'full_base'=>true`` pour des URLs absolues::

        echo $this->Html->link(
            'Dashboard',
            array('controller' => 'dashboards', 'action' => 'index', 'full_base' => true)
        );

    Affichera:

    .. code-block:: html

        <a href="http://www.yourdomain.com/dashboards/index">Dashboard</a>


    Spécifiez ``$confirmMessage`` pour afficher une boite de dialogue de 
    confirmation ``confirm()`` javascript::

        echo $this->Html->link(
            'Efface',
            array('controller' => 'recettes', 'action' => 'delete', 6),
            array(),
            "Etes-vous sûre de vouloir effacer cette recette ?"
        );

    Affichera:

    .. code-block:: html

        <a href="/recettes/delete/6" onclick="return confirm('Etes-vous sûre de vouloir effacer cette recette ?');">Efface</a>

    Les chaînes de requête peuvent aussi être créées avec ``link()``.::

        echo $this->Html->link('Voir image', array(
            'controller' => 'images',
            'action' => 'view',
            1,
            '?' => array('height' => 400, 'width' => 500))
        );

    Affichera:
  
    .. code-block:: html

        <a href="/images/view/1?height=400&width=500">Voir image</a>

    Les caractères spéciaux HTML de ``$title``seront convertis en entités 
    HTML. Pour désactiver cette conversion, définissez l'option escape à
    false dans le tableau ``$options``.::

        <?php 
        echo $this->Html->link(
            $this->Html->image("recettes/6.jpg", array("alt" => "Crêpes")),
            "recettes/view/6",
            array('escape' => false)
        );

    Affichera:

    .. code-block:: html

        <a href="/recettes/view/6">
            <img src="/img/recettes/6.jpg" alt="Crêpes" />
        </a>

    Regardez aussi la méthode :php:meth:`HtmlHelper::url` pour
    plus d'exemples des différents type d'urls.

.. php:method:: media(string|array $path, array $options)

    :param string|array $path: Chemin du fichier vidéo, relatif au répertoire
        `webroot/{$options['pathPrefix']}` . Ou un tableau ou chaque élément
        peut être la chaîne d'un chemin ou un tableau associatif contenant
        les clefs `src` et `type`.
    :param array $options: Un tableau d'attributs HTML, et d'options spéciales.

        Options:

        - `type` Type d'éléments média à générer, les valeurs valides sont
          "audio" ou "video". Si le type n'est pas fourni le type de média se 
          basera sur le mime type du fichier.
        - `text` Texte à inclure dans la balise vidéo
        - `pathPrefix` Préfixe du chemin à utiliser pour les urls relatives, par  
          défaut à 'files/'
        - `fullBase` Si il est fourni l'attribut src prendra l'adresse complète 
          incluant le nom de domaine

    .. versionadded:: 2.1

    Retourne une balise formatée audio/video::

        <?php echo $this->Html->media('audio.mp3'); ?>

        // Affichera
        <audio src="/files/audio.mp3"></audio>

        <?php echo $this->Html->media('video.mp4', array(
            'fullBase' => true,
            'text' => 'Texte de remplacement'
        )); ?>

        // Affichera
        <video src="http://www.somehost.com/files/video.mp4">Texte de remplacement</video>

        echo $this->Html->media(
            array('video.mp4', array(
                'src' => 'video.ogg',
                'type' => "video/ogg; codecs='theora, vorbis'"
            )),
            array('autoplay')
        );

        // Affichera
        <video autoplay="autoplay">
            <source src="/files/video.mp4" type="video/mp4"/>
            <source src="/files/video.ogg" type="video/ogg; codecs='theora, vorbis'"/>
        </video>

.. php:method:: tag(string $tag, string $text, array $htmlAttributes)

    :param string $tag: Le nom de la balise créée.
    :param string $text: Le contenu de la balise.
    :param array $options: Un tableau d'attributs html :term:`attributs html`.

    Retourne des textes enveloppé dans une balise spécifiée. Si il n'y a
    pas de texte spécifié alors le contenu du <tag> sera retourné::

        <?php
        echo $this->Html->tag('span', 'Bonjour le Monde', array('class' => 'bienvenue'));
        ?>

        // Affichera
        <span class="bienvenue">Bonjour le Monde</span>

        // Pas de texte spécifié.
        <?php
        echo $this->Html->tag('span', null, array('class' => 'bienvenue'));
        ?>

        // Affichera 
        <span class="bienvenue">

    .. note::

        Le texte n'est pas échappé par défaut mais vous pouvez utiliser
        ``$htmlOptions['escape'] = true`` pour échapper votre texte. Ceci
        remplace un quatrième paramètre ``boolean $escape = false`` qui était
        présent dans les précédentes versions.

.. php:method:: div(string $class, string $text, array $options)

    :param string $class: Le nom de classe de la div.
    :param string $text: Le contenu de la div.
    :param array $options: Un tableau d'attributs  :term:`attributs html`.

    Utilisé des sections de balisage enveloppés dans des div. Le premier
    paramètre spécifie une clasee CSS, et le second est utilisé pour fournir
    le texte à envelopper par les balises div. Si le dernier paramètre à été 
    défini à true, $text sera affiché en HTML-échappé.

    Si aucun texte n'est spécifié, seulement une balise div d'ouverture est 
    retournée::

        <?php
        echo $this->Html->div('error', 'Entrez votre numéro de carte bleue S.V.P');
        ?>

        // Affichera
        <div class="error">Entrez votre numéro de carte bleue S.V.P</div>

.. php:method::  para(string $class, string $text, array $options)

    :param string $class: Le nom de classe du paragraphe.
    :param string $text: Le contenu du paragraphe.
    :param array $options: Un tableau d'attributs :term:`attributs html`.

    Retourne un texte enveloppé dans une balise CSS <p>. Si aucun texte
    CSS est fourni, un simple <p> de démarrage est retourné::

        <?php
        echo $this->Html->para(null, 'Bonjour le Monde');
        ?>

        // Affichera
        <p>Bonjour le Monde</p>

.. php:method:: script(mixed $url, mixed $options)

    :param mixed $url: Soit un simple fichier Javascript, ou un
       tableau de chaînes pour plusieurs fichiers.
    :param array $options: Un tableau d'attributs :term:`attributs html`.

    Inclus un(des) fichier(s), présent soit localement soit à une url
    distante.

    Par défaut, les tags de script sont ajoutés au document inline. Si vous
    le surcharger en configurant ``$options['inline']`` à false, les tags de
    script vont plutôt être ajoutés au block ``script`` que vous pouvez
    afficher aileurs dans le document. Si vous souhaitez surcharger le nom
    du block utilisé, vous pouvez le faire en configurant
    ``$options['block']``.
   
    ``$options['once']`` contrôle si vous voulez ou pas inclure le script une
    fois par requête. Par défaut à true.

    Vous pouvez utilisez $options pour définir des propriétés additionnelles
    pour la balise script générée. Si un tableau de balise script est utilisé, 
    les attributs seront appliqués à toutes les balises script générées.

    Cette méthode d'inclusion de fichier javascript suppose que les fichiers
    javascript spécifiés se trouvent dans le répertoire ``/app/webroot/js``.::

        echo $this->Html->script('scripts');

    Affichera:

    .. code-block:: html

        <script type="text/javascript" href="/js/scripts.js"></script>

    Vous pouvez lier à des fichiers avec des chemins absolus
    tant qu'ils ne se trouvent pas dans ``app/webroot/js``::

        echo $this->Html->script('/autrerep/fichier_script');

    Vous pouvez aussi lier à une URL d'un dépôt distant::

        echo $this->Html->script('http://code.jquery.com/jquery.min.js');

    Affichera:

    .. code-block:: html

        <script type="text/javascript" href="http://code.jquery.com/jquery.min.js"></script>

    Le premier paramètre peut être un tableau pour inclure des 
    fichiers multiples.::

        echo $this->Html->script(array('jquery', 'wysiwyg', 'scripts'));

    Affichera:

    .. code-block:: html

        <script type="text/javascript" href="/js/jquery.js"></script>
        <script type="text/javascript" href="/js/wysiwyg.js"></script>
        <script type="text/javascript" href="/js/scripts.js"></script>

    Vous pouvez insérer dans la balise script un bloc spécifique en 
    utilisant l'option ``block``.::

        echo $this->Html->script('wysiwyg', array('block' => 'scriptPied'));
        
    Dans votre mise en page (layout)  vous pouvez ressortir toutes les 
    balises script ajoutées dans 'scriptPied'::

        echo $this->fetch('scriptPied');

    Vous pouvez inclure des fichiers de script depuis un plugin en utilisant 
    la syntaxe :term:`syntaxe de plugin`.  Pour inclure 
    ``app/Plugin/DebugKit/webroot/js/toolbar.js`` vous devriez faire cela::

        echo $this->Html->script('DebugKit.toolbar.js');

    Si vous voulez inclure un fichier de script qui partage un nom de fichier
    avec un plugin chargé vous pouvez faire cela. Par exemple si vous avez 
    Un plugin ``Blog``, et voulez inclure également 
    ``app/webroot/js/Blog.plugins.js``, vous devriez::

        echo $this->Html->script('Blog.plugins.js', array('plugin' => false));

    .. versionchanged:: 2.1
        L'option ``block`` à été ajouté.
        Le support  de la syntaxe :term:`syntaxe de plugin` a été ajouté.

.. php:method::  scriptBlock($code, $options = array())

    :param string $code: Le code à placer dans la balise script.
    :param array $options: Un tableau d'attributs :term:`attributs html`.

    Génère un bloc de code contenant des options ``$options['inline']``
    définies de ``$code`` a mettre à false pour voir le bloc de script
    apparaître dans le bloc de ``script`` de la vue. D'autre options définies
    seront ajoutée comme attributs dans les balises de script.
    ``$this->Html->scriptBlock('stuff', array('defer' => true));`` créera une
    balise script avec l'attribut ``defer="defer"``.

.. php:method:: scriptStart($options = array())

    :param array $options: Un tableau d'attributs :term:`html attributes` à 
        utiliser quand scriptEnd est appelé.

    Débute la mise en mémoire tampon d'un bloc de code. Ce bloc de code 
    va capturer toutes les sorties entre ``scriptStart()`` et ``scriptEnd()`` 
    et crée une balise script. Les options sont les mêmes que celles de
    ``scriptBlock()``

.. php:method:: scriptEnd()

    Termine la mise en mémoire tampon d'un bloc de script, retourne l'élément
    script généré ou null si le bloc de script à été ouvert avec inline=false.

    Un exemple de l'utilisation de ``scriptStart()`` et ``scriptEnd()`` pourrait
    être::

        $this->Html->scriptStart(array('inline' => false));

        echo $this->Js->alert('je suis dans le javascript');

        $this->Html->scriptEnd();

.. php:method:: nestedList(array $list, array $options = array(), array $itemOptions = array(), string $tag = 'ul')

    :param array $list: Jeu d'éléments à lister.
    :param array $options: Attributs HTML additionnels des balises de listes 
        (ol/ul) ou si ul/ol utilise cela comme une balise.
    :param array $itemOptions: Attributs additionnels des balises de listes 
        item(LI).
        
    :param string $tag: Type de balise liste à utiliser (ol/ul).

    Fabrique une liste imbriquée  (UL/OL) dans un tableau associatif::

        $list = array(
            'Languages' => array(
                'English' => array(
                    'American',
                    'Canadian',
                    'British',
                ),
                'Spanish',
                'German',
            )
        );
        echo $this->Html->nestedList($list);

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

    :param array $names: Un tableau de chaîne pour créé les entête de tableau.
    :param array $trOptions: Un tableau d'attributs :term:`html attributes` 
        pour le <tr>
    :param array $thOptions: Un tableau d'attributs :term:`html attributes` pour 
        l'élément <th>

    Créé une ligne de cellule d'en-tête à placer dans la balise <table>.::

        echo $this->Html->tableHeaders(array('Date', 'Titre', 'Actif'));

    // Affichera

    .. code-block:: html

        <tr>
            <th>Date</th>
            <th>Titre</th>
            <th>Actif</th>
        </tr>

    ::
        
        echo $this->Html->tableHeaders(
            array('Date','Titre','Actif'),
            array('class' => 'statut'),
            array('class' => 'table_produit')
        );
         
    Sortie:

    .. code-block:: html

        <tr class="statut">
             <th class="table_produit">Date</th>
             <th class="table_produit">Titre</th>
             <th class="table_produit">Actif</th>
        </tr>

    .. versionchanged:: 2.2
        ``tableHeaders()`` accèpte maintenant les attributs par cellule,
        regardez ci-dessous.

    Depuis 2.2 vous pouvez définir des attributs par colonne, ceux-ci sont
    utilisés à la place de ceux par défaut dans ``$thOptions``::

        echo $this->Html->tableHeaders(array(
            'id',
            array('Name' => array('class' => 'highlight')),
            array('Date' => array('class' => 'sortable'))
        ));

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
    :param array $oddTrOptions: Un tableau d'attributs :term:`html attributes` 
        pour les <tr> impairs.
    :param array $evenTrOptions: Un tableau d'attributs :term:`html attributes` 
        pour les <tr> pairs.
    :param boolean $useCount: Ajoute la classe "column-$i".
    :param boolean $continueOddEven: Si à false, utilisera une variable $count 
        non-statique, ainsi le compteur impair/pair est remis à zéro juste pour 
        cet appel.

    Créé des cellules de table, en assignant aux lignes  des attributs <tr> 
    différents pour les lignes paires et les lignes impaires. Entoure une 
    simple table de cellule dans un array() pour des attributs <td> 
    spécifiques. ::

        echo $this->Html->tableCells(array(
            array('le 07 juil, 2007', 'Meilleure Crêpe', 'Yes'),
            array('le 21 juin, 2007', 'Super Galette', 'Yes'),
            array('le 01 Aout, 2006', 'Gateau breton', 'No'),
        ));
         
        // Affichera
        <tr><td>le 07 juil, 2007</td><td>Meilleure Crêpe</td><td>Yes</td></tr>
        <tr><td>le 21 juin, 2007</td><td>Super Galette</td><td>Yes</td></tr>
        <tr><td>le 01 Aout, 2006</td><td>Gateau breton</td><td>No</td></tr>
        
        echo $this->Html->tableCells(array(
            array('le 07 juil, 2007', array('Meilleure Crêpe', array('class' => 'highlight')) , 'Yes'),
            array('le 21 juin, 2007', 'Super Galette', 'Yes'),
            array('le 01 Aout, 2006', 'Gateau breton', array('No', array('id' => 'special'))),
        ));
         
        // Affichera
        <tr><td>le 07 juil, 2007</td><td class="highlight">Meilleure Crêpe</td><td>Yes</td></tr>
        <tr><td>le 21 juin, 2007</td><td>Super Galette</td><td>Yes</td></tr>
        <tr><td>le 01 Aout, 2006</td><td>Gateau breton</td><td id="special">No</td></tr>
        
        echo $this->Html->tableCells(
            array(
                array('Rouge', 'Pomme'),
                array('Orange', 'Orange'),
                array('Jaune', 'Banane'),
            ),
            array('class' => 'darker')
        );
        
        // Affichera
        <tr class="darker"><td>Rouge</td><td>Pomme</td></tr>
        <tr><td>Orange</td><td>Orange</td></tr>
        <tr class="darker"><td>Jaune</td><td>Banane</td></tr>

.. php:method:: url(mixed $url = NULL, boolean $full = false)

    :param mixed $url: Un tableau de routing :term:`routing array`.
    :param mixed $full: Soit un booléen s'il faut ou pas que la  base du 
        chemin soit incluse ou un tableau d'options pour le router 
        :php:meth:`Router::url()`

    Retourne une URL pointant vers une combinaison controller et action.
    Si $url est vide, cela retourne la REQUEST\_URI, sinon cela génère la 
    combinaison d'une url pour le controller et d'une action. Si full est à 
    true, la base complète de l'URL sera ajouter en amont du résultat::

        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "view",
            "bar"
        ));
         
        // Restituera
        /posts/view/bar

    Voici quelques exemples supplémentaires:

    URL avec des paramètres nommés::

        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "view",
            "foo" => "bar"
        ));
         
        // Restituera
        /posts/view/foo:bar

    URL avec une extension::

        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "list",
            "ext" => "rss"
        ));
         
        // Restituera
        /posts/list.rss

    URL (commençant par  '/') avec la base complète d'URL ajoutée::

        echo $this->Html->url('/posts', true);

        // Restituera
        http://somedomain.com/posts

    URL avec des paramètres GET et une ancre nommée::

        <?php echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "search",
            "?" => array("foo" => "bar"),
            "#" => "first"));
        
        // Restituera
        /posts/search?foo=bar#first

    Pour plus d'information voir 
    `Router::url <http://api20.cakephp.org/class/router#method-Routerurl>`_
    dans l' API.

.. php:method:: useTag(string $tag)

    Retourne un bloc existant formaté de balise ``$tag``::

        $this->Html->useTag(
            'form',
            'http://example.com',
            array('method' => 'post', 'class' => 'myform')
        );

        // Affichera
        <form action="http://example.com" method="post" class="myform">

Changer la restitution des balises avec le Helper Html
======================================================

.. php:method:: loadConfig(mixed $configFile, string $path = null)

    Les jeux de balises pour le Helper Html :php:class:`HtmlHelper` sont 
    conforme au standard XHTML, toutefois si vous avez besoin de générer 
    du HTML pour les standards HTML5 vous aurez besoin de créer et de charger 
    un nouveau fichier de configuration de balise contenant les balises 
    que vous aimeriez utiliser. Pour changer les balises utilisées créez
    un fichier ``app/Config/html5_tags.php`` contenant::
   
        $config = array('tags' => array(
            'css' => '<link rel="%s" href="%s" %s>',
            'style' => '<style%s>%s</style>',
            'charset' => '<meta charset="%s">',
            'javascriptblock' => '<script%s>%s</script>',
            'javascriptstart' => '<script>',
            'javascriptlink' => '<script src="%s"%s></script>',
            // ...
        ));

    Vous pouvez alors charger ces balises définis en appelant
    ``$this->Html->loadConfig('html5_tags');``

Création d'un chemin de navigation avec le Helper Html
======================================================

.. php:method:: getCrumbs(string $separator = '&raquo;', string $startText = false)

    CakePHP inclus la possibilité de créer automatiquement un chemin de
    navigation (fil d’Ariane) dans votre application. Pour mettre cela en 
    service , ajouter cela dans votre template de mise en page (layout template)::

        echo $this->Html->getCrumbs(' > ', 'Home');

    L'option ``$startText`` peut aussi accepter un tableau.  Cela donne plus de 
    contrôle à travers le premier lien généré::

        echo $this->Html->getCrumbs(' > ', array(
            'text' => $this->Html->image('home.png'),
            'url' => array('controller' => 'pages', 'action' => 'display', 'home'),
            'escape' => false
        ));

    Une clefs qui n'est pas ``text`` ou ``url`` sera passée à
    :php:meth:`~HtmlHelper::link()` comme paramètre ``$options``.

    .. versionchanged:: 2.1
        Le paramètre ``$startText`` accepte maintenant un tableau.

.. php:method:: addCrumb(string $name, string $link = null, mixed $options = null)

    Maintenant, dans votre vue vous allez devoir ajouter ce qui suit 
    pour démarrer le fil d'Ariane sur chacune de vos pages.::

        $this->Html->addCrumb('Users', '/users');
        $this->Html->addCrumb('Add User', '/users/add');

    Ceci ajoutera la sortie  "**Home > Users > Add User**" dans votre mise en 
    page (layout) ou le fil d'Ariane a été ajouté.

.. php:method:: getCrumbList(array $options = array(), mixed $startText)

    :param array $options: Un tableau de :term:`html attributes` pour les
        elements contenant ``<ul>``. Peut aussi contenir les options
        'separator', 'firstClass' et 'lastClass'.
    :param string|array $startText: Le texte ou l'elément qui précède ul.

    Retourne le fil d'Ariane comme une liste (x)html.

    Cette méthode utilise :php:meth:`HtmlHelper::tag()` pour générer la 
    liste et ces éléments. Fonctionne de la même manière 
    que  :php:meth:`~HtmlHelper::getCrumbs()`,  il utilise toutes les options
    que chacun des fils a ajouté. Vous pouvez utiliser le paramètre  ``$startText``
    pour fournir le premier lien de fil. C'est utile quand vous voulez inclure
    un lien racine. Cette option fonctionne de la même façon que l'option
    ``$startText`` pour  :php:meth:`~HtmlHelper::getCrumbs()`.
   

    .. versionchanged:: 2.1
        Le paramètre ``$startText`` a été ajouté.

    .. versionchanged:: 2.3
        Les options 'separator', 'firstClass' et 'lastClass' ont été ajoutées.


.. meta::
    :title lang=fr: HtmlHelper
    :description lang=fr: Le rôle de HtmlHelper dans CakePHP est de faciliter la construction des options HTML-related, plus rapide, and more resilient to change.
    :keywords lang=fr: html helper,cakephp css,cakephp script,content type,html image,html link,html tag,script block,script start,html url,cakephp style,cakephp crumbs
