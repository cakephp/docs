HTML
####

Le rôle de l'assistant Html dans CakePHP est de créer des options
HTML-apparentées plus facilement, plus rapidement et plus résistantes au
changement. L'utilisation de cet assistant permettra à votre application
d'être plus à l'aise dans ses baskets et plus flexible selon où elle est
placée par rapport à la racine d'un domaine.

Le rôle de l'assistant Html a changé significativement depuis CakePHP
1.1. Les méthodes relatives aux formulaires ont été dépréciées et
déplacées dans le nouvel assistant Form. Si vous cherchez de l'aide pour
les formulaires HTML, jeter un oeil au nouvel assistant Form.

Avant que nous regardions les méthodes de l'assistant Html, vous aurez
besoin de connaître quelques situations de configuration et d'usage qui
vous aideront à utiliser cette classe. Premièrement, dans un souci
d'apaiser ceux qui n'aiment pas les balises courtes (<?= ?>) ou les
nombreux appels à echo() dans le code de leur vue toutes les méthodes de
l'assistant Html sont passées à la méthode output(). Si vous souhaitez
activer l'affichage automatique du HTML généré par l'assistant, vous
pouvez simplement implémenter output() dans votre classe AppHelper.

::

    function output($str) {
        echo $str;
    }

Faire cela supprimera la nécessité d'ajouter des déclarations echo au
code de votre vue.

Beaucoup de méthodes du HtmlHelper incluent aussi un paramètre
$htmlAttributes, qui vous permet d'ajouter tout attribut supplémentaire
à vos balises. Voici quelques exemples d'utilisation du paramètre
$htmlAttributes :

::

    Attributs désirés : <tag class="uneClasse" />      
    Tableau paramètre : array('class'=>'uneClasse')
     
    Attributs désirés : <tag name="foo" value="bar" />  
    Tableau paramètre :  array('name' => 'foo', 'value' => 'bar')

L'assistant Html est disponible par défaut dans toutes les vues. Si vous
obtenez une erreur vous informant qu'il n'y est pas, c'est
habituellement du au fait que son nom a été oublié lors d'une
configuration manuelle de la variable de contrôleur $helpers.

Insérer des éléments bien formatés
==================================

La tâche la plus importante accomplie par l'assistant HTML est de créer
des balises correctement formatées. N'hésitez pas à l'utiliser - vous
pouvez mettre en cache les vues dans CakePHP, afin d'économiser des
ressources CPU quand celles-ci sont affichées. Cette partie couvrira
quelques-unes des méthodes fournies par l'assistant HTML et comment les
utiliser.

charset
-------

``charset(string $charset=null)``

Utilisé pour créer une balise META précisant le type d'encodage des
caractères du document. Par défaut UTF-8.

::

     
    <?php echo $html->charset(); ?> 

Va afficher:

::

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

Ainsi que,

::

    <?php echo $html->charset('ISO-8859-1'); ?>

Va afficher:

::

    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

css
---

``css(mixed $path, string $rel = null, array $htmlAttributes = array(), boolean $inline = true)``

Crée un lien vers une feuille de style CSS. Si $inline est défini à
false, les balises seront ajoutées à la variable $scripts\_for\_layout
que vous pouvez intégrer à l'intérieur de la balise "head" du document.

Cette méthode d'inclusion suppose que le fichier spécifié réside à
l'intérieur du dossier /app/webroot/css ...

::

    <?php echo $html->css('forms'); ?> 

Affichera:

::

    <link rel="stylesheet" type="text/css" href="/fr/css/forms.css" />

Le premier paramètre peut être un tableau pour inclure plusieurs
fichiers.

::

    <?php echo $html->css(array('forms','tables','menu')); ?>

Affichera:

::

    <link rel="stylesheet" type="text/css" href="/fr/css/forms.css" />
    <link rel="stylesheet" type="text/css" href="/fr/css/tables.css" />
    <link rel="stylesheet" type="text/css" href="/fr/css/menu.css" />

meta
----

``meta(string $type, string $url = null, array $attributes = array(), boolean $inline = true)``

Cette méthode est pratique pour lier des ressources externes comme les
flux RSS/Atom et les favicons. Comme pour css(), vous pouvez spécifier
si, oui ou non, vous aimeriez que cette balise apparaissent en ligne ou
dans la balise head en utilisant le quatrième paramètre.

Si vous définissez l'attribut "type" en utilisant le paramètre
$htmlAttributes, CakePHP contient quelques raccourcis :

+--------+-------------------------+
| type   | valeur correspondante   |
+========+=========================+
| html   | text/html               |
+--------+-------------------------+
| rss    | application/rss+xml     |
+--------+-------------------------+
| atom   | application/atom+xml    |
+--------+-------------------------+
| icon   | image/x-icon            |
+--------+-------------------------+

::

      <?php echo $html->meta(
        'favicon.ico',
        '/favicon.ico',
        array('type' => 'icon')
    );?> // Affiche (retours à la ligne ajoutés)
    <link
        href="http://example.com/favicon.ico"
        title="favicon.ico" type="image/x-icon"
        rel="alternate"
    />
     
    <?php echo $html->meta(
        'Commentaires',
        '/commentaires/index.rss',
        array('type' => 'rss'));
    ?>
     
    // Affiche (retours à la ligne ajoutés)
    <link
        href="http://example.com/commentaires/index.rss"
        title="Commentaires"
        type="application/rss+xml"
        rel="alternate"
    />

Cette méthode peut aussi être utilisée pour ajouter les balises meta
*keywords* et *description*. Exemple :

::

    <?php echo $html->meta(
        'keywords',
        'entrez n\'importe quelle meta keyword ici'
    );?>
    // Affiche <meta name="keywords" content="entrez n'importe quelle meta keyword ici"/>
    //

    <?php echo $html->meta(
        'description',
        'entrez n\'importe quelle meta description ici'
       );?> 

    // Affiche <meta name="description" content="entrez n'importe quelle meta description ici"/>

Si vous voulez ajouter une balise meta personnalisée, alors le premier
paramètre devrait être défini par un tableau. Pour afficher une balise
*robots noindex*, utilisez le code suivant :

::

     echo $html->meta(array('name' => 'robots', 'content' => 'noindex')); 

docType
-------

``docType(string $type = 'xhtml-strict')``

Retourne une balise doctype (X)HTML. Les doctypes fournis sont ceux du
tableau suivant:

+----------------+-----------------------+
| type           | valeur traduite       |
+================+=======================+
| html           | text/html             |
+----------------+-----------------------+
| html4-strict   | HTML4 Strict          |
+----------------+-----------------------+
| html4-trans    | HTML4 Transitional    |
+----------------+-----------------------+
| html4-frame    | HTML4 Frameset        |
+----------------+-----------------------+
| xhtml-strict   | XHTML1 Strict         |
+----------------+-----------------------+
| xhtml-trans    | XHTML1 Transitional   |
+----------------+-----------------------+
| xhtml-frame    | XHTML1 Frameset       |
+----------------+-----------------------+
| xhtml11        | XHTML 1.1             |
+----------------+-----------------------+

::

    <?php echo $html->docType(); ?> 
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

    <?php echo $html->docType('html4-trans'); ?> 
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

style
-----

``style(array $data, boolean $inline = true)``

Construit des définitions de styles CSS, basées sur les clés et valeurs
du tableau passé à la méthode. Particulièrement pratique si votre
fichier CSS est dynamique.

::

    <?php echo $html->style(array(
        'background'     => '#633',
        'border-bottom' => '1px solid #000',
        'padding' => '10px'
    )); ?>

Affichera :

::

      background:#633;
      border-bottom:1px solid #000;
      padding:10px; 

image
-----

``image(string $path, array $htmlAttributes = array())``

Crée une balise image formatée. Le chemin fourni doit être relatif à
/app/webroot/img/.

::

    <?php echo $html->image('cake_logo.png', array('alt' => 'CakePHP'))?> 

Affichera :

::

    <img src="/img/cake_logo.png" alt="CakePHP" /> 

Pour créer une image avec un lien, spécifiez l'adresse en utilisant
l'option ``url dans $htmlAttributes``.

::

    <?php echo $html->image("recettes/6.jpg", array(
        "alt" => "Brownies",
        'url' => array('controller' => 'recettes', 'action' => 'voir', 6)
    )); ?>

Affichera :

::

    <a href="/fr/recettes/voir/6">
        <img src="/img/recettes/6.jpg" alt="Brownies" />
    </a>

Vous pouvez aussi utiliser cette méthode alternative pour créer une
image lien, en assignant l'image à une variable (par ex $image) et en la
passant à ``$html->link()`` comme premier argument :

::

        <?php
        $image = $html->image('recettes/6.jpg', array(
                    'alt' => 'Brownies',
                ));

        //$image est passée comme premier argument au lieu d'un lien texte
        echo $html->link($image, array(
                'controller' => 'recettes',
                'action' => 'voir',
                6
                ),
                array(
                    'escape' => false // important pour que htmlHelper n'échappe par votre lien image
                )
        );
        ?>

Ceci est pratique si vous voulez garder votre lien et votre image un peu
plus séparés ou si vous voulez inclure un peu de balisage dans votre
lien. Assurez-vous de passer ``'escape' => false`` dans le tableau
d'options de `` $html->link($string, $url, $options)`` pour éviter au
htmlHelper d'échapper le code.

link
----

``link(string $title, mixed $url = null, array $htmlAttributes = array(), string $confirmMessage = false, boolean $escapeTitle = true)``

Méthode universelle pour créer des liens HTML. Utilisez
``$htmlAttributes`` pour spécifier les attributs de l'élément.

::

    <?php echo $html->link('Entrer', '/pages/home', array('class'=>'bouton','target'=>'_blank')); ?>

Affichera :

::

      
    <a href="/fr/pages/home" class="bouton" target="_blank">Entrer</a>

Spécifiez ``$confirmMessage`` pour afficher un dialogue javascript
``confirm()``.

::

    <?php echo $html->link(
        'Supprimer',
        array('controller'=>'recettes', 'action'=>'supprimer', 6),
        array().
        "Etes-vous certain de vouloir supprimer cette recette ?"
    );?>

Affichera :

::

      
    <a href="/fr/recettes/supprimer/6" onclick="return confirm('Etes-vous certain de vouloir supprimer cette recette ?');">Supprimer</a>

Des chaînes de requête peuvent aussi être créées avec ``link()``.

::

    <?php echo $html->link('Voir image', array(
        'controller' => 'images',
        'action' => 'voir',
        1,
        '?' => array( 'height' => 400, 'width' => 500))
    );

Affichera :

::

      
    <a href="/fr/images/voir/1?height=400&width=500">Voir image</a>

Les caractères spéciaux HTML dans ``$title`` seront convertis en entités
HTML. Pour désactiver cette conversion, définissez l'option escape à
false dans ``$htmlAttributes`` ou définissez ``$escapeTitle`` à false.

::

    <?php 
    echo $html->link(
        $html->image("recettes/6.jpg", array("alt" => "Brownies")),
        "recettes/voir/6",
        array('escape'=>false)
    );

    echo $html->link(
        $html->image("recettes/6.jpg", array("alt" => "Brownies")),
        "recettes/voir/6",
        null, null, false
    );
    ?>

Afficheront tous deux :

::

    <a href="/fr/recettes/voir/6">
        <img src="/img/recettes/6.jpg" alt="Brownies" />
    </a>

Voyez également la méthode
`HtmlHelper::url <https://book.cakephp.org/fr/view/842/url>`_ pour
davantage d'exemples des différents types d'urls.

tag
---

``tag(string $tag, string $text, array $htmlAttributes, boolean $escape = false)``

Retourne le texte entouré du tag spécifié. Si aucun texte n'est
spécifié, seul le <tag> ouvrant sera retourné.

::

    <?php echo $html->tag('span', 'Bonjour le Monde.', array('class' => 'bienvenue'));?>
     
    // Affichera
    <span class="bienvenue">Bonjour le Monde.</span>
     
    // Aucun texte spécifié
    <?php echo $html->tag('span', null, array('class' => 'bienvenue'));?>
     
    // Affichera
    <span class="bienvenue">

div
---

``div(string $class, string $text, array $htmlAttributes, boolean $escape = false)``

Utilisé pour créer des sections de balisage entourées de div. Le premier
paramètre spécifie une classe CSS et le second est utilisé pour fournir
le texte à entourer par les balises div. Si le dernier paramètre a été
défini à true, $text sera affiché en HTML échappé.

Si aucun texte n'est spécifié, seul une balise div ouvrante est
retournée.

::

     
    <?php echo $html->div('erreur', 'SVP, entrez votre numéro de carte de crédit.');?>

    // Affiche
    <div class="erreur">SVP, entrez votre numéro de carte de crédit.</div>

para
----

``para(string $class, string $text, array $htmlAttributes, boolean $escape = false)``

Retourne un texte entouré par une balise <p> avec une classe CSS. Si
aucun texte n'est soumis, seule une balise <p> ouvrante est retournée.

::

    <?php echo $html->para(null, 'Bonjour le Monde.');?>
     
    //Output
    <p>Bonjour le Monde.</p>

tableHeaders
------------

``tableHeaders(array $names, array $trOptions = null, array $thOptions = null)``

Crée une rangée de cellules d'en tête de tableau, à placer à l'intérieur
des tags <table>.

::

    <?php echo $html->tableHeaders(array('Date','Titre','Actif'));?> //Output 
    <tr><th>Date</th><th>Titre</th><th>Actif</th></tr>
     
    <?php echo $html->tableHeaders(
        array('Date','Titre','Actif'),
        array('class' => 'status'),
        array('class' => 'product_table')
    );?>
     
    // Affichera
    <tr class="status">
         <th class="product_table">Date</th>
         <th class="product_table">Titre</th>
         <th class="product_table">Actif</th>
    </tr>

tableCells
----------

``tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)``

Crée des cellules de tableau, en lignes, en assignant des attributs
différents aux

pour les lignes paires et impaires. Entoure une cellule simple par un
tableau d'attributs spécifiques aux

.

::

    <?php echo $html->tableCells(array(
        array('7 juillet 2007', 'Meilleurs Brownies', 'Oui'),
        array('21 juin 2007', 'Gâteaux chics', 'Oui'),
        array('1er août 2006', 'Cake Anti-Java', 'Non'),
    ));
    ?>
     
    // Affichera
    <tr><td>7 juillet 2007</td><td>Meilleurs Brownies</td><td>Oui</td></tr>
    <tr><td>21 juin 2007</td><td>Gâteaux chics</td><td>Oui</td></tr>
    <tr><td>1er août 2006</td><td>Cake Anti-Java</td><td>Non</td></tr>
     
    <?php echo $html->tableCells(array(
        array('7 juillet 2007', array('Meilleurs Brownies', array('class'=>'surligne')) , 'Oui'),
        array('21 juin 2007', 'Gâteaux chics', 'Oui'),
        array('1er août 2006', 'Cake Anti-Java', array('Non', array('id'=>'special'))),
    ));
    ?>
     
    // Affichera
    <tr><td>7 juillet 2007</td><td class="surligne">Meilleurs Brownies</td><td>Oui</td></tr>
    <tr><td>21 juin 2007</td><td>Gâteaux chics</td><td>Oui</td></tr>
    <tr><td>1er août 2006</td><td>Cake Anti-Java</td><td id="special">Non</td></tr>
     
    <?php echo $html->tableCells(
        array(
            array('Rouge', 'Pomme'),
            array('Orange', 'Orange'),
            array('Jaune', 'Banane'),
        ),
        array('class' => 'sombre')
    );
    ?>
     
    // Affichera
    <tr class="sombre"><td>Rouge</td><td>Pomme</td></tr>
    <tr><td>Orange</td><td>Orange</td></tr>
    <tr class="sombre"><td>Jaune</td><td>Banane</td></tr>

url
---

``url(mixed $url = NULL, boolean $full = false)``

Retourne une URL pointant sur une combinaison de contrôleur et action.
Si $url est vide, retourne le REQUEST\_URI, sinon génère l'url pour le
groupe contrôleur/action. Si full est à true, l'URL de base complète
sera préfixée au résultat.

::

    <?php echo $html->url(array(
        "controller" => "posts",
        'action' => 'voir',
        "bar"));?>
     
    // Affiche
    /posts/voir/bar

Voici quelques exemples supplémentaires d'utilisation :

URL avec paramètres nommés

::

    <?php echo $html->url(array(
        "controller" => "posts",
        'action' => 'voir',
        "foo" => "bar"));
    ?>
     
    // Affiche
    /posts/voir/foo:bar

URL avec extension

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "liste",
        "ext" => "rss"));
    ?>
     
    // Affiche
    /posts/liste.rss

URL (débutant par '/') avec l'URL de base complète préfixée.

::

    <?php echo $html->url('/posts', true); ?>

    // Affiche
    http://undomaine.com/posts

URL avec des paramètrges GET et une ancre nommée

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "cherche",
        "?" => array("foo" => "bar"),
        "#" => "premier"));
    ?>

    // Affiche
    /posts/cherche?foo=bar#premier

Pour davantage d'information voyez
`Router::url <https://api.cakephp.org/class/router#method-Routerurl>`_
dans l'API.

Modifier les balises avec HtmlHelper
====================================

La construction des balises avec ``HtmlHelper`` sont compatible XHTML,
si vous avez besoin de générer des balises HTML compatibles HTML4 vous
devrez créer et charger un nouveau fichier de configuration de balises,
avec les nouvelles balises dont vous aurez besoin. Pour se faire créez
le fichier ``app/config/tags.php`` qui contiendra vos balises:

::

    $tags = array(
        'metalink' => '<link href="%s"%s >',
        'input' => '<input name="%s" %s >',
        //...
    );

Vous pouvez désormais charger ces balises en appelant
``$html->loadConfig('tags');``
