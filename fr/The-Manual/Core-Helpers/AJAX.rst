AJAX
####

L'assistant AJAX utilise les librairies populaires que sont Prototype et
script.aculo.us pour les requêtes AJAX et les effets de slide côté
client. Pour utiliser l'assistant AJAX, vous devez avoir la version
actuelle de la librairie Javascript
`www.prototypejs.org <http://www.prototypejs.org>`_ et
`http://script.aculo.us <http://script.aculo.us/>`_ placé dans
/app/webroot/js/.De plus, vous devrez inclure les librairies Javascript
Prototype et script.aculo.us dans chaque vues utilisant les
fonctionnalités de l'assistant AJAX.

Vous devez inclure les assistants AJAX et Javascript dans votre
contrôleur.

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
    }

Une fois l'assistant Javascript inclus dans votre contrôleur, vous
pouvez utiliser la méthode link() de l'assistant Javascript pour inclure
Prototype et Scriptaculous:

::

    echo $javascript->link('prototype');
    echo $javascript->link('scriptaculous'); 

Vous pouvez désormais utiliser l'assistant AJAX dans votre vue:

::

    $ajax->whatever();

Si le `Composant RequestHandler </fr/view/174/request-handling>`_ est
inclus dans le contrôleur, cakePHP appliquera automatiquement la mise en
page AJAX quand une requête sera demandée.

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
        var $components = array( 'RequestHandler' );
    }

Options de l'assistant AJAX
===========================

La plupart des méthodes de l'assistant AJAX vous autorisent à fournir un
tableau $options. Vous pouvez utiliser ce tableau pour configurer le
comportement de l'assistant AJAX. Avant que nous abordions les méthodes
spécifiques à l'assistant, jetons un œil aux différentes options
disponibles via ce tableau spécial. Vous vous référerez à cette section
quand vous commencerez à utiliser les méthodes de l'assistant AJAX.

Options générales
-----------------

``$option`` keys

Description

``$options['evalScripts']``

Détermine si les balises script dans le contenu retourné sont évaluées.
Défini à *true* par défaut.

``$options['frequency']``

Le nombre de seconde entre les vérifications à intervalle régulier.

``$options['indicator']``

L'id DOM d'un élément à montrer lorsqu'une requête est en chargement et
à cacher quand la requête est finie.

``$options['position']``

Pour insérer plutôt que remplacer, utilisez cette option pour préciser
la position d'insertion entre *top*, *bottom*, *after* ou *before*.

``$options['update']``

L'id de l'élement du DOM qui sera mis à jour avec le contenu retourné.

``$options['url']``

L'url au format contrôleur/action que vous souhaitez appeler.

``$options['type']``

Indique si la requête doit être 'synchronous' (synchrone) ou
'asynchronous' (asynchrone, valeur par défaut).

``$options['with']``

Une chaîne "URL-encodée" qui sera ajoutée à l'URL pour les méthodes get
ou dans le corps du post pour tout autre méthode. Exemple :
``x=1&toto=tata&y=2``. Les paramètres seront disponibles dans
``$this->params['form']`` ou dans ``$this->data``, en fonction du
format. Pour plus d'information, voyez la méthode `Serialize de
Prototype <http://www.prototypejs.org/api/form/serialize>`_.

Options Callback
----------------

Les options *Callbacks* vous permettent d'appeler des fonctions
JavaScript à des endroits spécifiques. Si vous cherchez un moyen
d'injecter un peu de logique, avant, après ou lors de vos opérations
utilisant l'assistant Ajax, utilisez ces *callbacks* pour mettre les
choses en place.

$options

Description

$options['condition']

Extrait de code JavaScript qui doit évaluer *true* avant que la demande
soit initialisée.

$options['before']

Exécuté avant que la demande soit faite. Une utilisation courante de ce
*callBack* est de permettre l'affichage d'un indicateur de progression.

$options['confirm']

Texte à afficher dans une alerte de confirmation JavaScript avant de
continuer.

$options['loading']

*Callback* exécuté lorsque des données sont récupérées à partir du
serveur.

$options['after']

JavaScript appelé après que la requête soit lancée et avant que le
*callback* $options['loading'] se lance.

$options['loaded']

*Callback* exécuté lorsque le document distant a été reçu par le client.

$options['interactive']

Appelée lorsque l'utilisateur peut interagir avec le document distant,
même si il n'a pas fini de se charger.

$options['complete']

*Callback* JavaScript à exécuter lorsque XMLHttpRequest est terminé.

Méthodes
========

link
----

``link(string $title, mixed $href, array $options, string $confirm, boolean $escapeTitle)``

Retourne un lien vers une action distante définie par
``$options['url']`` ou ``$href`` qui est appelée via la méthode
XMLHttpRequest quand le lien est cliqué. Le résultat de cette requête
peut être inséré dans un objet DOM pour qui l'id sera spécifié par
``$options['update']``.

Si ``$options['url']`` est vide le href est utilisé comme substitution

Exemple:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'View Post', 
        array( 'controller' => 'posts', 'action' => 'view', 1 ), 
        array( 'update' => 'post' )
    ); 
    ?>

Par défaut, ces requêtes distantes sont asynchrones et pendant
lesquelles une série de callbacks peuvent être déclenchés.

Exemple:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'View Post', 
        array( 'controller' => 'posts', 'action' => 'post', 1 ), 
        array( 'update' => 'post', 'complete' => 'alert( "Hello World" )'  )
    ); 
    ?>

Pour utiliser une méthode synchrone, spécifiez
``$options['type'] = 'synchronous'``.

Pour définir automatiquement le layout ajax, insérez le composant
*RequestHandler* dans votre Controller.

Par défaut le contenu de l'élément cible (DOM) sera remplacé. Pour
changer cela définissez ``$options['position']``

Exemple:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'View Post', 
        array( 'controller' => 'posts', 'action' => 'view', 1), 
        array( 'update' => 'post', 'position' => 'top'  )
    ); 
    ?>

``$confirm`` peut être utilisé pour appeler un message de confirmation
Javascript avant que la requête ne soit démarrée ceci afin de prévenir
l'utilisateur de l'exécution de la tâche.

Exemple:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'Delete Post', 
        array( 'controller' => 'posts', 'action' => 'delete', 1 ), 
        array( 'update' => 'post' ),
        'Do you want to delete this post?'
    ); 
    ?>

remoteFunction
--------------

``remoteFunction(array $options);``

Cette fonction crée le code JavaScript nécessaire pour effectuer un
appel distant. Elle est principalement utilisée en tant qu'assistant
pour link(). Ceci n'est pas utilisé très souvent, à moins que vous
n'ayez besoin de générer des scripts personnalisés.

Les ``$options`` pour cette fonction sont les mêmes que pour la méthode
``link``

Exemple :

::

    <div id="post">
    </div>
    <script type="text/javascript">
    <?php echo $ajax->remoteFunction( 
        array( 
            'url' => array( 'controller' => 'posts', 'action' => 'voir', 1 ), 
            'update' => 'post' 
        ) 
    ); ?>
    </script>

Il peut aussi être assigné à un attribut d'évènement HTML :

::

    <?php 
        $remoteFunction = $ajax->remoteFunction( 
            array( 
            'url' => array( 'controller' => 'posts', 'action' => 'voir', 1 ),
            'update' => 'post' ) 
        ); 
    ?>
    <div id="post" onmouseover="<?php echo $remoteFunction; ?>" >
    Bougez la souris ici
    </div>

Si ``$options['update']`` n'est pas transmis, le navigateur ignorera la
réponse du serveur.

remoteTimer
-----------

``remoteTimer(array $options)``

Appelle périodiquement l'action ``$options['url']``, toutes les
``$options['frequency']`` secondes. Généralement utilisé pour mettre à
jour un div spécifique (défini dans ``$options['update']``) avec le
résultat de l'appel distant. Les *Callbacks* peuvent être utilisés.

``remoteTimer`` est identique à ``remoteFunction`` à l'exception du
paramètre supplémentaire ``$options['frequency']``

Exemple :

::

    <div id="post">
    </div>
    <?php
    echo $ajax->remoteTimer(
        array(
        'url' => array( 'controller' => 'posts', 'action' => 'voir', 1 ),
        'update' => 'post', 'complete' => 'alert( "requête terminée" )',
        'position' => 'bottom', 'frequency' => 5
        )
    );
    ?>

La valeur par défaut de ``$options['frequency']`` est 10 secondes

form
----

``form(string $action, string $type, array $options)``

Retourne une balise form qui soumet à $action, en utilisant
XMLHttpRequest à la place d'une requête HTTP normale via $type ('post'
ou 'get'). Autrement, la soumission du formulaire se comportera
exactement comme d'habitude : les données soumises sont disponibles par
$this->data à l'intérieur de vos contrôleurs. Si $options['update'] est
spécifié, elles seront mises à jour avec le document résultant. Les
callbacks peuvent être utilisés.

Le tableau options devrait inclure le nom du modèle, par exemple :

::

    $ajax->form('edit','post',array('model'=>'Utilisateur','update'=>'DivInfoUtilisateur'));

Alternativement, si vous avez besoin de croiser des données post avec un
autre contrôleur depuis votre formulaire :

::

    $ajax->form(array('type' => 'post',
        'options' => array(
            'model'=>'Utilisateur',
            'update'=>'DivInfoUtilisateur',
            'url' => array(
                'controller' => 'commentaires',
                'action' => 'edit'
            )
        )
    ));

Vous ne devriez pas utiliser ``$ajax->form()`` et ``$ajax->submit()``
dans le même formulaire. Si vous voulez que la validation du formulaire
fonctionne proprement, utilisez la méthode ``$ajax->submit()`` comme
indiqué dans la section suivante.

submit
------

``submit(string $titre, array $options)``

Retourne un bouton *submit* qui soumet le formulaire à
``$options['url']`` et met à jour le div spécifié dans
``$options['update']``

::

    <div id='testdiv'>
    <?php
    echo $form->create('Utilisateur');
    echo $form->input('email');
    echo $form->input('nom');
    echo $ajax->submit('Soumettre', array('url'=> array('controller'=>'utilisateurs', 'action'=>'ajouter'), 'update' => 'testdiv'));
    echo $form->end();
    ?>
    </div>

Utilisez la méthode ``$ajax->submit()`` si vous voulez que la validation
de formulaire fonctionne proprement c'est-à-dire, si vous voulez que vos
messages que vous spécifiez dans vos règles de validation s'affichent
correctement.

observeField
------------

``observeField(string $field, array $options)``

Surveille le champ dont l'id DOM est spécifié par $field (toutes les
$options['frequency'] secondes) et réalise un XMLHttpRequest quand son
contenu a changé.

Lorsqu'aucune fréquence ou un petit intervalle de fréquence (entre 0 et
1) est spécifié, un prototype ``Form.Element.EventObserver`` sera
utilisé à la place d'un ``Form.Element.Observer``. Le
``Form.Element.EventObserver`` n'est pas minuté et sera exécuté en même
temps que la valeur de l'élément aura changé.

::

    <?php echo $form->create( 'Post' ); ?>
    <?php $titres = array( 1 => 'Tom', 2 => 'Dick', 3 => 'Harry' ); ?>   
    <?php echo $form->input( 'titre', array( 'options' => $titres ) ) ?>
    </form>

    <?php 
    echo $ajax->observeField( 'PostTitre', 
        Array
    (
            'url' => array( 'action' => 'edit' ),
            'frequency' => 0.2,
        ) 
    ); 
    ?>

``observeField`` utilise les mêmes options que ``link``

Le champ à transmettre peut être défini en utilisant
``$options['with']``. Celui-ci constitue la valeur par défaut de
``Form.Element.serialize('$field')``. Les données soumises sont
disponibles par ``$this->data`` dans vos contrôleurs. Les callbacks
peuvent être utilisés avec cette fonction.

Pour envoyer le formulaire entier quand le champ change, utilisez
``$options['with'] = Form.serialize( $('Form ID') )``

observeForm
-----------

``observeForm(string $form, array $options)``

Similaire à observeField(), mais fonctionne sur un formulaire complet,
identifié par son id DOM $form. Les $options fournies sont les mêmes que
observeField(), à l'exception de la valeur par défaut de l'option
$options['with'], qui est évaluée à la valeur sérialisée (chaine de
requête) du formulaire.

autoComplete
------------

``autoComplete(string $field, string $url, array $options)``

Affiche un champ texte avec auto-complétion pour $field. L'action
distante située à $url devrait retourner une liste appropriée de termes
auto-completés. Une liste non-ordonnée est souvent utilisée pour celà.
Premièrement, vous avez besoin de paramétrer une action de contrôleur,
qui récupère et organise les données dont vous avez besoin pour votre
liste, en fonction de la saisie utilisateur :

::

    function autoComplete() {
        // Chaînes partielles qui arriveront du champ auto-complété comme
        // $this->data['Post']['sujet'] 
        $this->set('posts', $this->Post->find('all', array(
                    'conditions' => array(
                        'Post.sujet LIKE' => $this->data['Post']['sujet'].'%'
                    ),
                    'fields' => array('sujet')
        )));
        $this->layout = 'ajax';
    }

Ensuite, créez ``app/views/posts/auto_complete.ctp`` qui utilise ces
données et crée une liste non-ordonnée en (X)HTML :

::

    <ul>
     <?php foreach($posts as $post): ?>
         <li><?php echo $post['Post']['sujet']; ?></li>
     <?php endforeach; ?>
    </ul> 

Enfin, utilisez autoComplete() dans une vue pour créer votre champ de
formulaire auto-complété :

::

    <?php echo $form->create('Utilisateur', array('url' => '/utilisateurs/index')); ?>
        <?php echo $ajax->autoComplete('Post.sujet', '/posts/autoComplete')?>
    <?php echo $form->end('Voir le Post')?>

Une fois que vous obtenez un appel autoComplete() qui fonctionne
correctement, utilisez les CSS pour styler la boîte de suggestion de
l'auto-complétion. Vous pourriez terminer en utilisant quelque chose de
similaire à ce qui suit :

::

    div.auto_complete    {
         position         :absolute;
         width            :250px;
         background-color :white;
         border           :1px solid #888;
         margin           :0px;
         padding          :0px;
    } 
    li.selected    { background-color: #ffb; }

Si vous voulez que l'utilisateur saisisse un nombre minimum de
caractères avant que l'auto-complétion ne démarre, vous pouvez utiliser
l'option minChars comme ceci :

::

    $ajax->autoComplete('Post.sujet', '/posts/autoComplete',array('minChars' => 3));

isAjax
------

``isAjax()``

Vous permet de vérifier si la requête actuelle est une requête Ajax de
Prototype à l'intérieur d'une vue. Renvoie un booléen. Peut être utilisé
pour une logique de présentation, pour afficher/cacher des blocs de
contenu.

drag & drop
-----------

``drag(string $id, array $options)``

Rend un élément déplaçable à l'extérieur de l'élément DOM spécifié par
$id. Pour plus d'informations sur les paramètres acceptés dans $options,
voir
`https://github.com/madrobby/scriptaculous/wikis/draggable <https://github.com/madrobby/scriptaculous/wikis/draggable>`_.

Des options courantes peuvent être incluses :

+--------------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Clés $options            | Description                                                                                                                                                                                                                                                                                                                            |
+==========================+========================================================================================================================================================================================================================================================================================================================================+
| $options['handle']       | Détermine si l'élément devrait être déplaçable seulement par une poignée intégrée. La valeur doit être une référence d'élément ou un id d'élément ou une chaîne référençant une valeur de classe CSS. Le premier élément enfant/petit-enfant/etc. trouvé dans l'élément qui a cette valeur de classe CSS sera utilisé comme poignée.   |
+--------------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['revert']       | Si défini à true, l'élément retourne à sa position de départ quand le déplacement prend fin. Revert peut aussi être une référence de fonction arbitraire, appelée quand le déplacement se termine.                                                                                                                                     |
+--------------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['constraint']   | Contraint le déplacement à 'horizontal' ou 'vertical', laisser blanc pour ne pas contraindre.                                                                                                                                                                                                                                          |
+--------------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

``drop(string $id, array $options)``

Rend l'élément DOM spécifié par $id, capable de recevoir des éléments
déplacés. Des paramètres additionnels peuvent être spécifiés avec
$options. Pour plus d'informations, voir
`https://github.com/madrobby/scriptaculous/wikis/droppables <https://github.com/madrobby/scriptaculous/wikis/droppables>`_.

Des options courantes peuvent être incluses :

+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Clés $options             | Description                                                                                                                                                                                                                  |
+===========================+==============================================================================================================================================================================================================================+
| $options['accept']        | Définir par une chaîne, ou un tableau javascript de chaînes, décrivant les classes CSS que l'élément capable de recevoir acceptera. L'élément récepteur acceptera seulement des éléments ayant les classes CSS spécifiées.   |
+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['containment']   | L'élément capable de recevoir acceptera seulement l'élément déplacé s'il fait partie des éléments précisés (ids d'éléments). Peut être une chaîne ou un tableau javascript de références à des id.                           |
+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['overlap']       | Si défini à 'horizontal' ou 'vertical', l'élément capable de recevoir réagira seulement à un élément déplaçable, s'il chevauche la zone de dépôt à plus de 50% de l'axe donné.                                               |
+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['onDrop']        | Un rappel javascript appelé quand l'élément déplacé est déposé sur l'élément capable de recevoir.                                                                                                                            |
+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

``dropRemote(string $id, array $options)``

Produit une cible dépôt qui crée un XMLHttpRequest quand un élément
déplaçable est déposée sur elle. Le tableau $options pour cette fonction
est le même que ceux spécifiés pour drop() et link().

slider
------

``slider(string $id, string $track_id, array  $options)``

Crée un contrôle de défilement directionnel. Pour plus d'informations,
voir
`http://wiki.github.com/madrobby/scriptaculous/slider <http://wiki.github.com/madrobby/scriptaculous/slider>`_.

Des options courantes peuvent être incluses :

Clés $options

Description

$options['axis']

Définit la direction dans laquelle le défilement se produira.
'horizontal' ou 'vertical'. Horizontal par défaut

$options['handleImage']

L'id de l'image qui représente la poignée. Ceci est utilisé pour
échanger le src de l'image avec le src de l'image désactivée, quand la
barre de défilement est activé. Utilisé en conjonction avec
handleDisabled.

$options['increment']

Définit le rapport des pixels aux valeurs. Définir à 1, fera que chaque
pixel ajustera de un la valeur de la barre de défilement.

$options['handleDisabled']

L'id de l'image qui représente la poignée désactivée. Ceci est utilisé
pour changer le src de l'image quand la barre de défilement est
désactivée. Utilisé en conjonction avec handleImage.

$options['change']
 $options['onChange']

Rappel JavaScript exécuté quand la barre de défilement a fini de bouger
ou que sa valeur a changé. La fonction de rappel reçoit la valeur
courante de la barre de défilement comme paramètre.

$options['slide']
 $options['onSlide']

Rappel JavaScript qui est appelé chaque fois que la barre de défilement
est déplacée par étirement. Il reçoit la valeur courante de la barre de
défilement comme paramètre.

editor
------

``editor(string $id, string $url, array $options)``

Crée un éditeur local au niveau de l'id DOM $id. L'``$url`` fournie
devrait être une action en charge de sauvegarder des données. Pour plus
d'informations et des démos, voir
`https://github.com/madrobby/scriptaculous/wikis/ajax-inplaceeditor <https://github.com/madrobby/scriptaculous/wikis/ajax-inplaceeditor>`_.

Des options courantes peuvent être incluses :

Clés $options

Description

``$options['collection']``

Active le mode 'collection' de l'édition locale. $options['collection']
prend un tableau qui se transforme en options pour le select. Pour en
apprendre plus sur 'collection', voir
`https://github.com/madrobby/scriptaculous/wikis/ajax-inplacecollectioneditor <https://github.com/madrobby/scriptaculous/wikis/ajax-inplacecollectioneditor>`_.

``$options['callback']``

Une fonction à exécuter avant que la requête ne soit envoyée au serveur.
Ceci peut être utilisé pour formater l'information envoyée au serveur.
La signature est ``fonction(formulaire, valeur)``

``$options['okText']``

Texte du bouton de soumission en mode édition

``$options['cancelText']``

Le texte du lien qui efface l'édition

``$options['savingText']``

Le texte affiché pendant que le texte est envoyé au serveur

``$options['formId']``

``$options['externalControl']``

``$options['rows']``

La hauteur de la ligne du champ input

``$options['cols']``

Le nombre de colonnes que la zone de texte devrait couvrir

``$options['size']``

Synonyme de 'cols' quand utilisé sur une seule ligne

``$options['highlightcolor']``

La couleur de surlignement

``$options['highlightendcolor']``

La couleur avec laquelle le surlignement se confond

``$options['savingClassName']``

``$options['formClassName']``

``$options['loadingText']``

``$options['loadTextURL']``

Exemple

::

    <div id="id_editeur_local">Texte à Editer</div>
    <?php
    echo $ajax->editor( 
        "id_editeur_local", 
        array
    ( 
            'controller' => 'Posts', 
            'action' => 'update_titre',
            $id
        ), 
        array()
    );
    ?>

sortable
--------

``sortable(string $id, array $options)``

Crée une liste ou un groupe d'objets flottants contenus dans le
conteneur triable $id. Le tableau options supporte un certain nombre de
paramètres. Pour vous informez davantage au sujet de sortable, voyez
`http://wiki.github.com/madrobby/scriptaculous/sortable <http://wiki.github.com/madrobby/scriptaculous/sortable>`_.

::

    <div id='conteneurTriable'>
        <div id='element_1' class='itemTriable'>
            Elément 1
        </div>
        <div id='element_2' class='itemTriable'>
            Elément 2
        </div>
        <div id='element_3' class='itemTriable'>
            Elément 3
        </div>
    </div>
    <script type='text/javascript'>
    function ecriremiseajour () {
        var id_array = Sortable.sequence('conteneurTriable');
        new Ajax.Request('/rapports/mettre_a_jour_ordre_des_commandes/'+ id_array.join(','),
                             {
                            onSuccess: function() {alert("Commande mise à jour");}
                            }
                        );
    }
    </script>
    <?php
    echo $ajax->sortable('conteneurTriable',array('tag'=>'div','only'=>'itemTriable','onUpdate'=>'ecriremiseajour'));
    ?>

Assurez-vous que vous n'incluez pas les parenthèses dans le callback
onUpdate ou bien il ne sera pas exécuté.

Des options courantes peuvent être incluses :

Clés $options

Description

$options['tag']

Indique quelle sorte d'éléments fils du conteneur seront rendus
triables. Par défaut 'li'.

$options['only']

Permet d'augmenter le filtrage des éléments fils. Accepte une classe
CSS.

$options['overlap']

Soit 'vertical', soit 'horizontal'. Vertical par défaut.

$options['constraint']

Restreint le mouvement des éléments déplaçables. Accepte 'horizontal' ou
'vertical'. Vertical par défaut.

$options['handle']

Permet aux éléments *Draggables* créés d'utiliser des poignées, voir
l'option *handle* des éléments *Draggables*.

$options['onUpdate']

Appelé quand le glissé se termine et que l'ordre de tri est modifié
d'une façon ou d'une autre. Quand on glisse depuis un élément triable
vers un autre, le *callback* est appelé une fois sur chaque élément
triable.

$options['hoverclass']

Donne une classe css de survol (*hoverclass*) à l'élément déplaçable
créé.

$options['ghosting']

Si défini à true, les éléments glissés du conteneur triable seront
clonés et apparaîtront comme des fantômes, au lieu de manipuler
directement l'élément original.
