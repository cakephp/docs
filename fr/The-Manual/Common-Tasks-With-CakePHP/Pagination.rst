Pagination
##########

L'un des principaux obstacles dans la création d'une application web
flexible et facile à utiliser est le design d'une interface utilisateur
intuitive. Beaucoup d'applications ont rapidement tendance à grandir en
taille et en complexité, et les designers et les programmeurs pensent
qu'ils sont incapables de s'en sortir en montrant des centaines de
milliers d'enregistrements. La refactorisation prend du temps, et les
performances et la satisfaction de l'utilisateur peuvent en souffrir.

Afficher un nombre raisonnable d'enregistrements par page a toujours été
une partie critique de toute application et a pour habitude de causer
beaucoup de maux de tête aux développeurs. CakePHP diminue
l'encombrement du développeur en fournissant une méthode rapide et
simple pour organiser les informations. Le "PaginatorHelper" offre une
excellente solution car il est simple à utiliser. Mis à part la
pagination, il comprend quelques méthodes de tri également très simple
d'utilisation. Le tri et la pagination avec Ajax est aussi supporté.

Configuration du contrôleur
===========================

Dans le contrôleur, nous commençons par définir la pagination par défaut
dans la variable $paginate. Il est important de noter ici, que la clé
*order* doit être définie dans une structure en tableau.

::

    class RecettesController extends AppController {

        var $paginate = array(
            'limit' => 25,
            'order' => array(
                'Post.titre' => 'asc'
            )
        );
    }

Vous pouvez aussi inclure d'autres options de find(), tel que *fields* :

::

    class RecettesController extends AppController {

        var $paginate = array(
            'fields' => array('Post.id', 'Post.created'),
            'limit' => 25,        
            'order' => array(
                'Post.titre' => 'asc'
            )
        );
    }

Les autres clés qui peuvent être incluses dans le tableau *$paginate*
sont similaires aux paramètres de la méthode *Model->find('all')*,
c'est-à-dire :*conditions*, *fields*, *order*, *limit*, *page*,
*contain* et *recursive*. En fait, vous pouvez définir plus d'une
configuration de pagination dans le contrôleur, vous nommez simplement
les parties du tableau, d'après le modèle que vous souhaitez configurer
:

::

    class RecettesController extends AppController {

        var $paginate = array(
            'Recette' => array (...),
            'Auteur' => array (...)
        );
    }

Exemple de syntaxe utilisant le Comportement Containable :

::

    class RecettesController extends AppController {

        var $paginate = array(
            'limit' => 25,
            'contain' => array('Article')
        );
    }

Une fois la variable $paginate définie, nous pouvons appeler la méthode
*paginate()* dans les actions du contrôleur. Cette méthode renvoie les
résultats paginés d'un *find()* provenant du modèle et récupère quelques
statistiques additionnelles sur la pagination, qui sont passées en
arrière-plan à la vue. Cette méthode ajoute aussi l'assistant Paginator
à la liste des assistants dans le contrôleur, s'il n'a pas déjà été
ajouté.

::

    function liste_recettes() {
        // similaire à findAll(), mais récupère les résultats sous forme paginée
        $data = $this->paginate('Recette');
        $this->set('data', $data);
    }

Vous pouvez filtrer les enregistrements en passant des conditions via le
second paramètre de la fonction ``paginate()`` :

::

    $data = $this->paginate('Recette', array('Recette.titre LIKE' => 'a%'));

Ou vous pouvez aussi configurer la clé *conditions* dans le tableau
``$paginate``

Pagination dans les vues
========================

C'est à vous de décider comment afficher les enregistrements dans la
vue, la plupart du temps, ils le seront dans des tables HTML. Les
exemples suivants supposent une mise en page tabulaire, mais l'assistant
de pagination disponible dans les vues n'a pas toujours besoin d'être
construit de cette façon.

Voyez les détails dans la section
`PaginatorHelper <https://api.cakephp.org/class/paginator-helper>`_ de
l'API.

Comme mentionné précédemment, l'assistant de pagination offre
différentes options de tri qui peuvent être facilement intégrées dans
les cellules d'en-tête de vos tableaux.

::

    // app/views/recettes/liste_recettes.ctp
    <table>
        <tr> 
            <th><?php echo $paginator->sort('ID', 'id'); ?></th> 
            <th><?php echo $paginator->sort('Titre', 'titre'); ?></th> 
        </tr> 
           <?php foreach($data as $recette): ?> 
        <tr> 
            <td><?php echo $recette['Recette']['id']; ?> </td> 
            <td><?php echo $recette['Recette']['titre']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 

Le lien créé, provenant de la méthode sort() de l'assistant de
pagination, autorise l'utilisateur à cliquer sur les cellules d'en-tête
pour changer le tri des données par le champ cliqué.

Il est aussi possible de trier une colonne basée sur les associations :

::

    <table>
        <tr> 
            <th><?php echo $paginator->sort('Titre', 'titre'); ?></th> 
            <th><?php echo $paginator->sort('Auteur', 'Auteur.nom'); ?></th> 
        </tr> 
           <?php foreach($data as $recette): ?> 
        <tr> 
            <td><?php echo $recette['Recette']['titre']; ?> </td> 
            <td><?php echo $recette['Auteur']['nom']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 

La touche finale pour afficher la pagination dans les vues est
l'addition des pages, également fournie par l'assistant de pagination

::

    <!-- Affiche les numéros de pages -->
    <?php echo $paginator->numbers(); ?>
    <!-- Affiche les liens des pages précédentes et suivantes -->
    <?php
        echo $paginator->prev('« Précédent ', null, null, array('class' => 'disabled'));
        echo $paginator->next(' Suivant »', null, null, array('class' => 'disabled'));
    ?> 
    <!-- Affiche X de Y, où X est la page courante et Y le nombre de pages -->
    <?php echo $paginator->counter(); ?>

Le résultat de la méthode counter() peut-être personnalisé grâce à des
marqueurs spécifiques

::

    <?php
    echo $paginator->counter(array(
        'format' => 'Page %page% de %pages%, montrant %current% enregistrements sur un total de %count%, en commençant à %start% et se terminant à %end%'
    )); 
    ?>

Pour passer toute l'URL en paramètre de la fonction de pagination,
faites comme suit :

::

        $paginator->options(array('url' => $this->passedArgs));

Pour faire passer des éléments en paramètre non-standard, vous devrez
les fusionner manuellement avec ``$this->passedArgs`` :

::

    // pour les urls comme http://www.exemple.com/fr/controller/action
    // qui sont routées par : Router::connect('/:lang/:controller/:action/*', array(),array('lang'=>'fr|en'));
    $paginator->options(array('url'=>array_merge(array('lang'=>$lang),$this->passedArgs)));

Ou bien vous pouvez spécifier quels paramètres passer manuellement :

::

        $paginator->options(array('url' =>  array("0", "1")));

Pagination AJAX
===============

Il est très facile d'incorporer les fonctionalités AJAX dans la
pagination.Les seules parties de code à rajouter sont l'inclusion de la
librairie Javascript Prototype, charger les indicateurs (icône de
chargement dans une DIV) et spécifier une DIV pour qu'elle soit mise à
jour(au lieu de recharger complètement la page).

N'oubliez pas d'ajouter le composant "RequestHandler" dans le contrôleur
pour pouvoir utiliser les fonctionalités AJAX:

::

    var $components = array('RequestHandler'); 

Modification de la mise en page
-------------------------------

Premièrement, il faut inclure la librairie Prototype dans le header,
définir l'icône de chargement (spinner.gif), et définir notre DIV avec
le contenu principal qu'on appellera "content".

Voici un exemple de mise en page avec ces différents éléments:

::

    <head>
        <title><?php echo $title_for_layout; ?></title>
            <?php echo $javascript->link(array('prototype')); ?>
            <style type="text/css">
                    div.disabled {
                            display: inline;
                            float: none;
                            clear: none;
                            color: #C0C0C0;
                    }
            </style>
    </head>
    <body>
    <div id="main">
            <div id="spinner" style="display: none; float: right;">
                    <?php echo $html->image('spinner.gif'); ?>
            </div>
            <div id="content">
                    <?php echo $content_for_layout; ?>
            </div>
    </div>
    </body>
    </html>

Modification des vues
---------------------

La seule configuration supplémentaire pour la pagination AJAX se fait en
utilisant la méthode options() de l'assistant de pagination, en lui
indiquant les paramètres AJAX requis. Dans ce cas, nous lui indiquons
que les liens de la pagination mettront à jour le contenu de la DIV
"content" avec le résultat de la requête, ainsi que d'afficher l'image
'spinner.gif' comme icône de chargement.

Si la clé 'update', n'est pas spécifiée, l'assistant de pagination fera
une pagination non-AJAX.

::

    <?php 
    //Sets the update and indicator elements by DOM ID
    $paginator->options(array('update' => 'content', 'indicator' => 'spinner'));
     
    echo $paginator->prev('<< Previous', null, null, array('class' => 'disabled'));
     
    echo $paginator->next('Next >>', null, null, array('class' => 'disabled')); 
    ?>
     
    <!-- prints X of Y, where X is current page and Y is number of pages -->
    <?php echo $paginator->counter(); ?>

Requête de pagination personnalisée
===================================

Fix me: Please add an example where overriding paginate is justified

Un bon exemple de cas où vous auriez besoin de ceci, c'est si la base de
données sous-jacente ne supporte pas la syntaxe SQL LIMIT. Ceci est vrai
pour DB2 d'IBM. Vous pouvez quand même utiliser la pagination CakePHP en
ajoutant la requête personnalisée au modèle.

Si vous devez créer des requêtes personnalisées pour générer les données
que vous souhaitez paginer, vous pouvez surcharger les méthodes du
modèle ``paginate()`` et ``paginateCount()`` utilisées par la logique de
pagination du contrôleur.

Avant de continuer, vérifiez que vous ne pouvez pas atteindre votre
objectif avec les méthodes du modèle de base.

La méthode ``paginate()`` utilise les mêmes paramètres que
``Model::find()``. Pour utiliser votre propre méthode/logique,
surchargez-là dans le modèle souhaité pour obtenir les données.

::

    /**
     * Surcharge de la méthode paginate() - grouper par semaine, equipe_exterieure_id et equipe_locale_id
     */
    function paginate($conditions, $fields, $order, $limit, $page = 1, $recursive = null, $extra = array()) {
        $recursive = -1;
        $group = $fields = array('semaine', 'equipe_exterieure_id', 'equipe_locale_id');
         return $this->find('all', compact('conditions', 'fields', 'order', 'limit', 'page', 'recursive', 'group'));
    }

Vous devez aussi surcharger le ``paginateCount()`` du cœur, cette
méthode attend les mêmes paramètres que ``Model::find('count')``.
L'exemple suivant utilise quelques fonctions spécifiques à Postgresql,
merci de bien vouloir l'ajuster en fonction de la base de données que
vous utilisez.

::

    /**
     * Surcharge de la méthode paginateCount()
     */
    function paginateCount($conditions = null, $recursive = 0, $extra = array()) {
        $sql = "SELECT DISTINCT ON(semaine, equipe_locale_id, equipe_exterieure_id) semaine, equipe_locale_id, equipe_exterieure_id FROM parties";
        $this->recursive = $recursive;
        $results = $this->query($sql);
        return count($results);
    }

Le lecteur attentif aura remarqué que la méthode de pagination que nous
avons définie n'était pas vraiment nécessaire. Tout ce que nous avons à
faire est d'ajouter le mot-clé dans la variable de classe ``$paginate``
du contrôleur.

::

    /**
    * Ajout de la clause GROUP BY
    */
    var $paginate = array(
        'MonModele' => array('limit' => 20, 
                               'order' => array('semaine' => 'desc'),
                               'group' => array('semaine', 'equipe_locale_id', 'equipe_exterieure_id'))
                              );

    /**
    * Ou bien à la volée, dans l'action du contrôleur
    */
    function index() {
        $this->paginate = array(
            'MonModele' => array('limit' => 20, 
                               'order' => array('semaine' => 'desc'),
                               'group' => array('semaine', 'equipe_locale_id', 'equipe_exterieure_id'))
                              );

Cependant, il sera tout de même nécessaire de surcharger la méthode
``paginateCount()`` pour obtenir une valeur exacte.
