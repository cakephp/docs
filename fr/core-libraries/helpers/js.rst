JSHelper
########

.. php:class:: JsHelper(View $view, array $settings = array())

.. warning::

    JsHelper est actuellement déprécié et complètement retiré de 3.x.
    Nous recommandons d'utiliser du JavaScript classique et de directement
    intéragir avec les librairies si possible.

Depuis le début le support de CakePHP pour Javascript a été
orienté vers Prototype/Scriptaculous (librairie JavaScript).
Tandis que nous continuons de penser qu'il s'agit d'excellentes
bibliothèques Javascript, il a été demandé à la communauté de
supporter d'autres librairies. Plutôt que d'enlever Prototype en faveur
d'une autre librairie JavaScript. Nous avons créé un adaptateur fonctionnant
sur le principe d'un Helper et avons inclu 3 des librairies les plus demandées.
Prototype/scriptaculous, Mootools/Mootools-more, et jQuery/jQueryUI.
Bien que l'API n'est pas aussi vaste que le Helper Ajax, nous
pensons que la solution basée sur l'adaptateur permet une solution
plus extensible offrant aux développeurs la puissance et la
flexibilité dont ils ont besoin pour répondre à leurs besoins spécifiques.

Les moteurs Javascript forment l'épine dorsale du nouveau Helper Js.
Un moteur JavaScript traduit un élément Javascript abstrait dans
un code JavaScript concret spécifique à la librairie en cours
d'utilisation. De plus ils créent un système extensible à utiliser
pour les autres.

Utilisation d'un moteur Javascript spécifique
=============================================

Avant tout, téléchargez votre librairie JavaScript préférée et placez la
dans ``app/webroot/js``.

Puis, vous devez inclure la librairie dans votre page. Pour l'inclure
dans toutes les pages, ajoutez cette ligne dans la section <head>
de ``app/View/Layouts/default.ctp``::

    echo $this->Html->script('jquery'); // Inclut la librairie Jquery

Remplacez ``jquery`` par le nom de votre fichier de librairie (.js sera
ajouté au nom).

Par défaut les scripts sont mis en cache, et vous devez explicitement
imprimer le cache. Pour faire cela à la fin de chacune des pages, incluez
cette ligne juste avant la balise de fin de ``</body>``::

    echo $this->Js->writeBuffer(); // Écrit les scripts en mémoire cache

.. attention::

    Vous devez inclure la librairie dans votre page et afficher le cache
    pour que le helper fonctionne.

La selection du moteur Javascript est déclarée quand vous incluez le
helper dans votre controller ::

    public $helpers = array('Js' => array('Jquery'));

La partie ci-dessus utilise le moteur Jquery dans les instances
du Helper Js dans vos vues. Si vous ne déclarez pas un moteur
spécifique, le moteur Jquery sera utilisé par défaut. Comme il est
mentionné ci-dessus, il y a trois moteurs implémentés dans le noyau,
mais nous encourageons la communauté à étendre la compatibilité
des librairies.

Utilisation de jQuery avec d'autres librairies
----------------------------------------------

La librairie jQuery, et virtuellement tous ses plugins sont limités
au sein de l'espace jQuery. Comme règle générale, les objets
"globaux" sont stockés dans l'espace JQuery, ainsi vous ne devriez
pas avoir de clash entre Jquery et d'autre librairies
(comme Prototype, MooTools, ou YUI).

Ceci dit, il y a une mise en garde:
**Par défaut, jQuery utilise "$" comme raccourci de "jQuery"**

Pour redéfinir le raccourci "$", utilisez la variable jQueryObject::

    $this->Js->JqueryEngine->jQueryObject = '$j';
    echo $this->Html->scriptBlock(
        'var $j = jQuery.noConflict();',
        array('inline' => false)
    );
    // Demande à jQuery de se placer dans un mode noconflict

Utilisation du Helper Js dans des helpers personnalisés
-------------------------------------------------------

Déclarez le Helper Js dans le tableau ``$helpers`` de votre
Helper personnalisé::

    public $helpers = array('Js');

.. note::

    Il n'est pas possible de déclarer le moteur JavaScript dans un
    Helper personnalisé. Ceci n'aurait aucun effet.

Si vous êtes prêt à utiliser un moteur JavaScript autre que celui
par défaut, faîtes le paramétrage du Helper dans votre controller
comme ceci::

    public $helpers = array(
        'Js' => array('Prototype'),
        'CustomHelper'
    );


.. warning::

    Assurez-vous de déclarer le Helper Js et son moteur **en haut**
    du tableau ``$helpers`` dans votre controller.

Le moteur JavaScript séléctionné peut disparaître (remplacé par celui par
défaut) de l'objet JsHelper dans votre helper, si vous oubliez de faire cela
et vous obtiendrez du code qui ne correspond pas à votre librairie JavaScript.

Création d'un moteur Javascript
===============================

Les helpers de moteur Javascript suivent les conventions normales
des helper, avec quelques restrictions supplémentaires. Ils doivent avoir
le suffixe ``Engine``. ``DojoHelper`` n'est pas bon, ``DojoEngineHelper``
est correct. De plus ils doivent étendre ``JsBaseEngineHelper`` afin
de tirer parti du meilleur de la nouvelle API.

Utilisation du moteur Javascript
================================

Le ``JsHelper`` fournit quelques méthodes, et agit comme une façade pour
le moteur helper. Vous ne devriez pas accéder au moteur helper excepté dans
de rares occasions. Utilisez les fonctionnalités de façade du ``Helper Js``
vous permet de tirer parti de la mise en mémoire tampon et de la méthode
caractéristique de chaînage intégré; (le chaînage de méthode ne fonctionne que
dans PHP5).

Par défaut le ``Helper Js`` bufferise presque tous les codes du script
générés, ce qui vous permet de récupérer les scripts partout
dans la vue, les éléments et les mises en page, et de les ressortir
à un endroit. La Récupération des scripts bufferisés est réalisé
avec ``$this->Js->writeBuffer();`` ceci retournera le contenu
du buffer dans une balise script. Vous pouvez désactiver le
buffering généralisé avec la propriété  ``$bufferScripts`` ou en
définissant ``buffer => false`` dans les méthodes qui prennent
des ``$options``.

Étant donné que la plupart des méthodes en Javascript commencent
avec une sélection d'éléments dans le DOM, ``$this->Js->get()``
retourne un $this, vous permettent d'enchaîner les méthodes en
utilisant la selection.  Le chaînage de méthode vous permet
d'écrire moins, et de rendre votre code plus expressif . ::

    $this->Js->get('#foo')->event('click', $eventCode);

Est un exemple de chaînage de méthode. Le chaînage de méthode
n'est pas possible dans PHP4 et l'exemple ci-dessus devrait être
écrit comme::

    $this->Js->get('#foo');
    $this->Js->event('click', $eventCode);

Options communes
----------------

Dans le but de simplifier le développement et comme les librairies JavaScript
peuvent changer, un ensemble courant d'options est pris en charge par
``JsHelper``, ces options courantes seront mappées en dehors des options
spécifiques de la librairies en interne. Si vous ne prévoyez pas la commutation
des librairies, chaque librairie supporte toutes les fonctions de callback
natives et les options.

Enveloppement de Callback
-------------------------

Par défaut, toutes les options de callback sont enveloppées dans une
fonction anonyme avec les bons arguments. Vous pouvez désactiver ce
comportement en fournissant ``wrapCallbacks = false`` dans votre tableau
d'options.

Travailler avec des scripts bufferisés
--------------------------------------

Un inconvénient à la précédente implémentation des fonctionnalités de
type d'AJAX était la dispersion des balises de script partout dans
le document , et l'impossibilité de bufferiser les scripts ajoutés par
les éléments dans la mise en page. Le nouveau Helper Js si il est
utilisé correctement évite ces deux questions. Il est recommandé
de placer ``$this->Js->writeBuffer()`` à la fin du fichier layout
au dessus la balise ``</body>``. Ceci permettra à tous les scripts
générés dans les éléments du layout d'être ressortis (output)
à un endroit. Il doit être noté que les scripts bufferisés sont gérés
séparément des scripts de fichiers inclus.

.. php:method:: writeBuffer($options = array())

Écrit tous le codes Javascript générés jusqu'ici dans un bloc de code ou les
met en mémoire cache dans un fichier et retourne un script lié.

**Options**

-  ``inline`` - Défini à true pour avoir la sortie des scripts dans
   un bloc de script inline. si cache est aussi à true, une balise
   de lien de script sera générée (par défaut à true)
-  ``cache`` - Défini à true pour avoir les scripts dans un fichier
   de la mémoire cache et s'y relié (false par défaut)
-  ``clear`` - Défini à false pour éviter au fichier de cache d'être
   effacé (true par défaut)
-  ``onDomReady`` - enveloppe les scripts en mémoire cache
   dans un evénement domready (par défaut à true)
-  ``safe`` - si un block inline est généré il sera enveloppé
   dans <![CDATA[ ... ]]> (true par défaut)

La création d'un fichier de cache avec ``writeBuffer()`` nécessite que
``webroot/js`` soit accessible en écriture et permette au navigateur de
placer dans le cache les ressources de script généré pour la page.

.. php:method:: buffer($content)

Ajoute ``$content`` au buffer de script interne.

.. php:method:: getBuffer($clear = true)

Récupère le contenu du buffer courant. Passe false pour ne pas effacer le
buffer en même temps.

**Bufferiser des méthodes qui ne sont normalement pas bufferisée**

Quelques méthodes dans le Helper sont bufferisée par défaut.
Le moteur bufferise les méthodes suivantes par défaut:

-  event
-  sortable
-  drag
-  drop
-  slider

De plus vous pouvez forcer une autre méthode du Helper Js à utiliser
la mise en mémoire cache. En ajoutant un booléen à la fin des arguments
vous pouvez forcer d'autres méthodes d'aller en mémoire cache. Par
exemple la méthode ``each()`` qui n'est normalement pas bufferisée::

    $this->Js->each('alert("sapristi!");', true);

Ce qui est ci-dessus va forcer la méthode ``each()`` à utiliser le buffer.
En revanche si vous souhaitez qu'une méthode bufferisée ne bufferise
plus, vous pouvez passer un ``false`` comme le dernier argument::

    $this->Js->event('click', 'alert("sapristi!");', false);

Ceci forcera la fonction event qui est normalement mis en mémoire cache
à retourner son résultat.

D'autres Méthodes
=================

Les moteurs Javascript du noyau fournissent les mêmes fonctionnalités
définies a travers les autres librairies, il y a aussi un sous-ensemble
d'options communes qui sont traduites dans les options spécifiques des
librairies. Tout cela pour fournir au développeurs finaux une Api unifiée
autant que possible. La liste suivante de méthodes est supportée par tous
les moteurs inclus dans le noyau CakePHP. Chaque fois que vous voyez
une liste séparée pour les ``Options`` et les ``Event Options`` Les deux
ensembles de paramètres sont fournis dans le tableau ``$options`` pour la
méthode.

.. php:method:: object($data, $options = array())

    Sérialise ``$data`` vers JSON.  Cette méthode est un proxy pour
    ``json_encode()`` avec quelques fonctionnalités supplémentaires ajoutée
    avec le paramètre ``$options``.

    **Options:**

    -  ``prefix`` - Chaîne ajoutée en début des données retournées.
    -  ``postfix`` - Chaîne ajoutée aux donnée retournée.

    **Exemple d'utilisation**::

        $json = $this->Js->object($data);

.. php:method:: sortable($options = array())

    Sortable génère un extrait de code pour fabriquer un ensemble
    d'éléments (souvent une liste) drag and drop triable.

    Les options normalisées sont:

    **Options**

    -  ``containment`` - Conteneur de l'action de déplacement.
    -  ``handle`` - Selecteur de l'élément. Seul cet élément
       commencera l'action de tri.
    -  ``revert`` - S'il faut ou pas utiliser un effet pour déplacer l'élément
       triable dans sa position finale.
    -  ``opacity`` - Opacité de l'espace réservé.
    -  ``distance`` - Distance a laquelle l'élément triable doit être draggé
        avant que le tri n'opère.

    **Event Options**

    -  ``start`` - Événement lancé quand le tri commence.
    -  ``sort`` - Événement lancé quand le tri est en cours.
    -  ``complete`` - Événement lancé quand le tri est terminé.

    D'autres options sont supportées par chacune des librairies
    Javascript, et vous pouvez obtenir dans leurs documentation
    respective des informations plus détaillées sur les options
    et les paramètres.

    **Exemple d'utilisation**::

        $this->Js->get('#ma-liste');
        $this->Js->sortable(array(
            'distance' => 5,
            'containment' => 'parent',
            'start' => 'onStart',
            'complete' => 'onStop',
            'sort' => 'onSort',
            'wrapCallbacks' => false
        ));

    En imaginant que vous étiez en train d'utiliser le moteur Jquery, vous
    devriez avoir le code suivant dans votre block Javascript généré.

    .. code-block:: javascript

        $("#myList").sortable({
            containment:"parent",
            distance:5,
            sort:onSort,
            start:onStart,
            stop:onStop
        });

.. php:method:: request($url, $options = array())

    Génère un morceau de code Javascript pour créer une requête
    ``XmlHttpRequest`` ou 'AJAX'.

    **Options de l'événement**

    -  ``complete`` - Callback à lancer si complété.
    -  ``success`` - Callback à lancer en cas de succès.
    -  ``before`` - Callback à lancer à l'initialisation de la requête.
    -  ``error`` - Callback à lancer en cas d'erreur de requête.

    **Options**

    -  ``method`` - La méthode pour fabriquer la requête avec GET
       dans plus de librairies.
    -  ``async`` - S'il faut ou pas utiliser une requête asynchrone.
    -  ``data`` - Données additionnelles à envoyer.
    -  ``update`` - L'ID du Dom id à mettre à jour avec le contenu de la
        requête.
    -  ``type`` - Le Type des données de la réponse.'json' et 'html' sont
       supportés. Par défaut à html pour la plupart des librairies.
    -  ``evalScripts`` - s'il faut ou pas évaluer la balise <script>.
    -  ``dataExpression`` -Si la clef  ``data`` doit être traitée comme un
        callback. Utile pour fournir ``$options['data']`` comme une autre
        expression Javascript.

    **Exemple d'utilisation**::

        $this->Js->event(
            'click',
            $this->Js->request(
                array('action' => 'foo', 'param1'),
                array('async' => true, 'update' => '#element')
            )
        );

.. php:method:: get($selector)

    Définit la 'sélection' interne dans un sélecteur CSS. La sélection
    active est utilisée dans les opérations ultérieures jusqu'à ce qu'une
    nouvelle soit faite. ::

        $this->Js->get('#element');

    Le ``JsHelper`` fait maintenant référence à toutes les méthodes de
    la sélection basées sur #element. Pour changer la sélection active
    appelez ``get()`` à nouveau avec un nouvel élément.

.. php:method:: set(mixed $one, mixed $two = null)

    Passe des variables dans JavaScript. Vous permet de définir des variables
    qui seront retournées quand le buffer est extrait avec
    :php:meth:`Helper Js::getBuffer()` ou :php:meth:`Helper Js::writeBuffer()`.
    La variable Javascript utilisée pour retourner les variables peut être
    controllée avec :php:attr:`Helper Js::$setVariable`.

.. php:method:: drag($options = array())

    Rend un élément draggable.

    **Options**

    -  ``handle`` - selecteur de l'élément.
    -  ``snapGrid`` - La grille de pixel qui  déclenche les mouvements, un
       tableau(x, y)
    -  ``container`` - L'élément qui agit comme un rectangle de selection pour
        l'élément draggable.

    **Options d'événements**

    -  ``start`` - Événement lancé quand le drag démarre.
    -  ``drag`` - Événement lancé à chaque étape du drag.
    -  ``stop`` - Événement lancé quand le drag s'arrête. (souris relâchée)

    **Exemple d'utilisation**::

        $this->Js->get('#element');
        $this->Js->drag(array(
            'container' => '#content',
            'start' => 'onStart',
            'drag' => 'onDrag',
            'stop' => 'onStop',
            'snapGrid' => array(10, 10),
            'wrapCallbacks' => false
        ));


   Si vous utilisiez le moteur Jquery le code suivant devrait être ajouté
    au buffer

    .. code-block:: javascript

        $("#element").draggable({
            containment:"#content",
            drag:onDrag,
            grid:[10,10],
            start:onStart,
            stop:onStop
        });

.. php:method:: drop($options = array())

    Fabrique un élément accepte des éléments dragguables et agit comme
    dropzone pour les éléments draggés.

    **Options**

    -  ``accept`` - Sélecteur des éléments que ce droppable acceptera.
    -  ``hoverclass`` - Classe pour ajouter à droppable quand un draggable est
       terminé.

    **Event Options**

    -  ``drop`` - Événement lancé quand un élément est droppé dans la drop
       zone.
    -  ``hover`` - Événement lancé quand un drag entre dans une drop zone.
    -  ``leave`` - Événement lancé quand un drag est retiré depuis une drop
       zone sans être droppé.

    **Exemple d'utilisation**::

        $this->Js->get('#element');
        $this->Js->drop(array(
            'accept' => '.items',
            'hover' => 'onHover',
            'leave' => 'onExit',
            'drop' => 'onDrop',
            'wrapCallbacks' => false
        ));

    Si vous utilisiez le moteur jQuery le code suivant devrait être
    ajouté au buffer.

    .. code-block:: javascript

        $("#element").droppable({
            accept:".items",
            drop:onDrop,
            out:onExit,
            over:onHover
        });

    .. note::

        Les éléments Droppables dans Mootools fonctionnent différemment des
        autres librairies.
        Les Droppables sont implémentés comme une extension de Drag. Donc pour
        faire une selection get() pour l'élément droppable. Vous devez aussi
        fournir une règle de selecteur à l'élément draggable. De plus,
        les droppables Mootools héritent de toutes les option de Drag.

.. php:method:: slider($options = array())

    Créé un morceau de code Javascript qui converti un élément dans un
    morceau de code slider ui. Voir les implémentations des différentes
    librairies pour des utilisations supplémentaires et les fonctionnalités.

    **Options**

    -  ``handle`` - l' id de l'élément utilisé dans le sliding.
    -  ``direction`` - La direction du slider soit 'vertical' ou
       'horizontal'.
    -  ``min`` - La valeur minimale pour le slider.
    -  ``max`` - La valeur maximale pour le slider.
    -  ``step`` - Le nombre d'étapes que le curseur aura.
    -  ``value`` - Le décalage initial du slider.

    **Events**

    -  ``change`` - Lancé quand la valeur du slider est actualisé.
    -  ``complete`` - Lancé quand un utilisateur arrête de slider le
       gestionnaire.

    **Exemple d'utilisation**::

        $this->Js->get('#element');
        $this->Js->slider(array(
            'complete' => 'onComplete',
            'change' => 'onChange',
            'min' => 0,
            'max' => 10,
            'value' => 2,
            'direction' => 'vertical',
            'wrapCallbacks' => false
        ));

    Si vous utilisiez le moteur jQuery le code suivant devrait être
    ajouté au buffer.

    .. code-block:: javascript

        $("#element").slider({
            change:onChange,
            max:10,
            min:0,
            orientation:"vertical",
            stop:onComplete,
            value:2
        });

.. php:method:: effect($name, $options = array())

    Créé un effet basique. Par défaut cette méthode n'est pas bufferisée et
    retourne ses résultats.

    **noms des effets supportés**

    Les effets suivants sont supportés par tous les moteurs JS:

    -  ``show`` - révèle un élément.
    -  ``hide`` - dissimule un élément.
    -  ``fadeIn`` - Fade in un élément.
    -  ``fadeOut`` - Fade out un élément.
    -  ``slideIn`` - Slide un élément in.
    -  ``slideOut`` - Slide un élément out.

    **Options**

    -  ``speed`` - Vitesse à laquelle l'animation devrait se produire. Les
       valeurs acceptées sont 'slow', 'fast'. Tous les effets n'utilisent pas
       l'option speed.

    **Exemple d'utilisation**

    Si vous utilisez le moteur jQuery::

        $this->Js->get('#element');
        $result = $this->Js->effect('fadeIn');

        // $result contient $("#foo").fadeIn();

.. php:method:: event($type, $content, $options = array())

    Attache un événement à la sélection courante. ``$type`` peut être un
    événement DOM normal ou un type d'événement personnalisé si votre
    librairie les supporte. ``$content`` devrait contenir les fonctions du
    body pour le callback. Les Callbacks seront enveloppés avec la fonction
    ``function (event) { ... }`` à moins qu'ils ne soient désactivés avec
    ``$options``.

    **Options**

    -  ``wrap`` - Si vous souhaitez que le callback soit enveloppé dans une
       fonction anonyme. (par défaut à true)
    -  ``stop`` - Si vous souhaitez que l'événement s'arrète. (par défaut à
       true)

    **Exemple d'utilisation**::

        $this->Js->get('#some-link');
        $this->Js->event('click', $this->Js->alert('saperlipopette!'));

    Si vous employiez la librairie jQuery, vous devriez avoir le code suivant:

    .. code-block:: javascript

        $('#some-link').bind('click', function (event) {
            alert('saperlipopette!');
            return false;
        });

    Vous pouvez retirer le ``return false;`` en passant l'option
    ``stop`` à false::

        $this->Js->get('#some-link');
        $this->Js->event(
            'click',
            $this->Js->alert('saperlipopette!'),
            array('stop' => false)
        );

    Si vous employiez la librairie jQuery vous devriez avoir le code
    Javascript suivant ajouté au buffer. Notez que l'événement du navigateur
    par défaut n'est pas annulé:

    .. code-block:: javascript

        $('#some-link').bind('click', function (event) {
            alert('hey you!');
        });

.. php:method:: domReady($callback)

    Créé l'événement spécial 'DOM ready'. :php:func:`JsHelper::writeBuffer()`
    enveloppe automatiquement les scripts bufferisés dans une méthode domReady.

.. php:method:: each($callback)

    Créé un morceau de code qui effectue une itération sur les éléments
    sélectionnés, et insère ``$callback``.

    **Exemple**::

        $this->Js->get('div.message');
        $this->Js->each('$(this).css({color: "red"});');

    L'utilisation du moteur jQuery aurait créé le Javascript suivant:

    .. code-block:: javascript

        $('div.message').each(function () { $(this).css({color: "red"}); });

.. php:method:: alert($message)

    Créé un extrait de code JavaScript contenant un ``alert()``. Par
    défaut, ``alert`` ne bufferise pas, et retourne le morceau de script
    suivant. ::

        $alert = $this->Js->alert('Zogotunga!');

.. php:method:: confirm($message)

    Créé un bout de code contenant ``confirm()``. Par défaut, ``confirm``
    ne bufferise pas, et retourne le morceau de script suivant. ::

        $alert = $this->Js->confirm('Vraiment certain?');

.. php:method:: prompt($message, $default)

    Créé un bout de code Javascript contenant ``prompt()``. Par
    défaut, ``prompt`` ne bufferise pas, et retourne le morceau de code
    suivant. ::

        $prompt = $this->Js->prompt('C'est quoi ta couleur préférée?', 'bleu');

.. php:method:: submit($caption = null, $options = array())

    Créé un bouton submit qui permet les formulaires de soumission
    ``XmlHttpRequest``. Les options peuvent inclure soit celles de
    :php:func:`FormHelper::submit()` et JsBaseEngine::request(),
    JsBaseEngine::event();

    La soumission a travers un formulaire avec cette méthode, ne permet pas
    l'envoi de fichiers. Les fichiers ne se transferts pas à travers
    ``XmlHttpRequest`` et requièrent un iframe, ou d'autres paramétrages plus
    spécialisés qui sont hors de portée de cet helper.

    **Options**

    -  ``confirm`` - Message de confirmation affiché avant l'envoi de la
       requête. L'utilisation de 'confirm' , ne remplace pas les méthodes
       de callback ``before`` dans le XmlHttpRequest généré.
    -  ``buffer`` - Désactive le buffering et retourne une balise script
       en plus du lien.
    -  ``wrapCallbacks`` - Mis à false pour désactiver l'enveloppement
       automatique des callbacks.

    **Exemple d'utilisation**::

        echo $this->Js->submit('Save', array('update' => '#content'));

    Va créé un bouton submit et un événement onclick attaché.
    L'événement click sera bufferisé par défaut. ::

        echo $this->Js->submit('Save', array(
            'update' => '#content',
            'div' => false,
            'type' => 'json',
            'async' => false
        ));

    Montre comment vous pouvez combiner les options de
    :php:func:`FormHelper::submit()` et :php:func:`Helper Js::request()` à
    l'utilisation des submits.

.. php:method:: link($title, $url = null, $options = array())

    Créé un élément ancre HTML qui a un événement clic rattaché.
    Les options peuvent inclure celle pour :php:func:`HtmlHelper::link()`
    et :php:func:`Helper Js::request()`, :php:func:`Helper Js::event()`,
    ``$options`` est un tableau d'attribut :term:`attributs html` qui sont
    ajoutés à l'élément ancre généré. Si une option ne fait pas parti
    des attributs standard de ``$htmlAttributes`` elle sera passée à
    :php:func:`Helper Js::request()` comme une option. Si une Id n'est
    pas fournie, une valeur aléatoire sera créée pour chacun des
    liens générés.

    **Options**

    -  ``confirm`` - Génère une boite de dialogue de confirmation avant
       l'envoi de l'événement.
    -  ``id`` - utilise une id personnalisée .
    -  ``htmlAttributes`` - attributs HTML non standard supplémentaires.
       Les attributs standards sont class, id, rel, title, escape, onblur et
       onfocus.
    -  ``buffer`` - Désactive le buffering et retourne une balise script
       en plus du lien.

    **Exemple d'utilisation**::

        echo $this->Js->link(
            'Page 2',
            array('page' => 2),
            array('update' => '#content')
        );

    Va créé un lien pointant vers ``/page:2`` et mettre à jour  #content
    avec la réponse.

    Vous pouvez utiliser les options de ``htmlAttributes`` pour ajouter des
    attributs personnalisés. ::

        echo $this->Js->link('Page 2', array('page' => 2), array(
            'update' => '#content',
            'htmlAttributes' => array('other' => 'value')
        ));

        // Créé le HTML suivant

    .. code-block:: html

        <a href="/posts/index/page:2" other="value">Page 2</a>

.. php:method:: serializeForm($options = array())

    Sérialise le formulaire attaché au $selector. Passe ``true`` pour $isForm
    si la selection courante est un élément de formulaire. Converti le
    formulaire ou l'élément de formulaire attaché à la sélection courante dans
    un objet chaîne/json (dépendant de l'implémentation de la librairie) pour
    utilisation avec les opérations XHR.

    **Options**

    -  ``isForm`` - est ce que la sélection courante est un formulaire ou un
       input? (par défaut à false)
    -  ``inline`` - est ce que le traitement du rendu sera utilisé dans un
       autre traitement JS? (par défaut à false)

    En définissant inline == false vous permet de retirer la bordure ``;``.
    Ceci est utile quand vous avez besoin de sérialiser un élément de
    formulaire comme faisant parti d'une autre opération Javascript
    ou utilisez la méthode de sérialisation dans un Objet littéral.

.. php:method:: redirect($url)

    Redirige la page vers ``$url`` en utilisant ``window.location``.

.. php:method:: value($value)

    Convertit une variable native PHP d'un type dans une représentation
    JSON équivalente. Échappe une valeur de chaîne dans une chaîne
    compatible JSON. Les caractère UTF-8 seront échappés .

.. _ajax-pagination:

La Pagination AJAX
==================

Bien mieux qu'avec la pagination AJAX de la 1.2, vous pouvez utiliser
le Helper JS pour gérer les liens de pagination AJAX au lieu de
liens HTML.

Fabriquer les liens AJAX
------------------------

Avant de pouvoir créer les liens ajax vous devez inclure la librairie
Javascript qui correspond à l'adaptateur que vous utilisez avec
le ``Helper JS``. Par défaut le ``Helper Js`` utilise jQuery. Donc
dans votre layout incluez jQuery (ou la librairie que vous utilisez).
Assurez vous également d'inclure ``RequestHandlerComponent``
dans votre behavior. Ajoutez ce qui suit dans votre controller::

    public $components = array('RequestHandler');
    public $helpers = array('Js');

Ce qui suit relie la librairie Javascript que vous voulez utiliser.
Pour cet exemple nous utiliserons jQuery::

    echo $this->Html->script('jquery');

De même qu'avec la 1.2 vous devez dire au ``PaginatorHelper`` que vous
voulez faire des liens Javascript avancés au lieu des plain HTML.
Pour faire cela utilisez ``options()``::

    $this->Paginator->options(array(
        'update' => '#content',
        'evalScripts' => true
    ));

La classe :php:class:`PaginatorHelper` sait maintenant qu'il faut
créer des liens Javascript étendus, et  que ces liens devront mettre
à jour le contenu ``#content`` de l'élément. Bien sûr cet élément doit
exister, et la plupart du temps vous voulez envelopper
le ``$content_for_layout`` par une div qui correspond à l'id utilisée
dans l'option ``update``. Vous devez également définir ``evalScripts``
à true si vous utilisez des adaptateurs Mootools ou Prototype, sans
``evalScripts`` ces librairies seront incapables de relier les requêtes
entrent elles. L'option ``indicator`` n'est pas supportée par le ``Helper JS``
et sera ignorée.

Vous venez donc de créer tous les liens demandés pour le fonctionnement
de la pagination. Puisque le ``Helper Js`` bufferise automatiquement
tous les contenus de scripts pour réduire les balises ``<script>``
dans vos codes sources vous **devez** appeler la restitution
du buffer. A la fin de votre fichier de vue. Vérifiez l'inclusion de::

    echo $this->Js->writeBuffer();

Si vous oubliez cela vous ne pourrez **pas** enchaîner les liens de
pagination AJAX. Quand vous écrivez le buffer, cela l'efface également ,
et vous n'avez donc pas à vous inquiéter de doublon de code Javascript.

Ajouter des effets et des transitions
-------------------------------------

Depuis que `indicator`` n'est plus supporté, vous devez ajouter
les effets d'indicator vous même.:

.. code-block:: php

    <!DOCTYPE html>
    <html>
        <head>
            <?php echo $this->Html->script('jquery'); ?>
            //more stuff here.
        </head>
        <body>
        <div id="content">
            <?php echo $this->fetch('content'); ?>
        </div>
        <?php
            echo $this->Html->image(
                'indicator.gif',
                array('id' => 'busy-indicator')
            );
        ?>
        </body>
    </html>

Rappelez vous de placer le fichier indicator.gif dans le répertoire
app/webroot/img. Vous devriez voir une situation où indicator.gif
s'affiche immédiatement au chargement de la page. Vous avez
besoin d'insérer cet indicateur  ``#busy-indicator { display:none; }``
dans votre fichier CSS principal.

Avec le layout ci-dessus, nous avons inclus un indicateur, qui affichera
une animation "occupé" que nous aurons à montrer et cacher
avec le ``Helper Js``. Pour faire cela, nous avons besoin de mettre
à jour notre fonction ``options()``::

    $this->Paginator->options(array(
        'update' => '#content',
        'evalScripts' => true,
        'before' => $this->Js->get('#busy-indicator')->effect(
            'fadeIn',
            array('buffer' => false)
        ),
        'complete' => $this->Js->get('#busy-indicator')->effect(
            'fadeOut',
            array('buffer' => false)
        ),
    ));

Ceci montrera/cachera l'élément 'indicateur occupé' avant et après
que le contenu de la balise ``#content`` soit mis à jour. Bien que
``indicator`` ait été enlevé, les nouvelles fonctionnalités du
``JsHelper`` permettent la création de plus de contrôle et d'effets plus
complexes.


.. meta::
    :title lang=fr: JsHelper
    :description lang=fr: JsHelper supporte les librairies javascript Prototype, jQuery et Mootools et fournit des méthodes pour la manipulation de javascript.
    :keywords lang=fr: js helper,javascript,cakephp jquery,cakephp mootools,cakephp prototype,cakephp jquery ui,cakephp scriptaculous,cakephp javascript,javascript engine
