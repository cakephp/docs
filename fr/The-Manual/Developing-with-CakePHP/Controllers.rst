Contrôleurs
###########

Introduction
============

Un contrôleur est utilisé pour gérer la logique d'une partie de votre
application. En règle générale, les contrôleurs sont utilisés pour gérer
la logique d'un seul modèle. Par exemple, si vous construisiez un site
pour une boulangerie en ligne, vous auriez sûrement un contrôleur
"Recettes" et un contrôleur "Ingredients" vous permettant de gérer vos
recettes et leurs ingrédients. Dans CakePHP, les contrôleurs portent le
nom de leur modèle correspondant, au pluriel.

Le modèle Recette est pris en charge par le Contrôleur Recettes, le
modèle Produit par le Contrôleur Produits, et ainsi de suite.

Les contrôleurs de votre application sont des classes qui étendent la
classe CakePHP AppController, qui hérite elle-même de la classe
Controller du cœur. La classe AppController peut être définie dans
/app/app\_controller.php et elle devrait contenir les méthodes partagées
par tous les contrôleurs de votre application. Elle étend la classe
Controller qui est une librairie standard de CakePHP.

Les contrôleurs peuvent inclure un nombre quelconque de méthodes qui
sont généralement appelées *actions*. Les actions sont les méthodes du
contrôleur utilisées pour afficher des vues. Une action correspond à une
seule méthode d'un contrôleur.

Le *dispatcher* (répartiteur) de CakePHP appelle ces actions quand une
requête entrante fait correspondre une URL à une action de contrôleur
(reportez-vous à la section `"Configuration des
routes" </fr/view/46/Routes-Configuration>`_, pour des explications sur
la manière dont les actions de contrôleur et leurs paramètres sont
mappés d'après l'URL).

Si l'on se réfère ainsi à notre exemple précédent de boulangerie en
ligne, notre contrôleur "Recettes" contiendra sûrement les actions
"voir()", "partager()" et "rechercher()". Ce contrôleur devrait se
trouver dans /app/controllers/recettes\_controller.php et contenir :

::

    # /app/controllers/recettes_controller.php
    <?php
        class RecettesController extends AppController {
            function voir($id) {
                //on insérera ici la logique propre à l'action
            }

            function partager($client_id, $recette_id) {
                 //on insérera ici la logique propre à l'action
            }

            function rechercher($requete) {
                 //on insérera ici la logique propre à l'action
            }
        }

    ?>

Afin d'utiliser tout le potentiel d'un contrôleur dans votre
application, nous allons aborder ici quelques-uns des principaux
attributs et méthodes offerts par les contrôleurs de CakePHP.

Le contrôleur App
=================

Comme indiqué dans l'introduction, la classe AppController est la classe
mère de tous les contrôleurs de votre application. AppController étend
elle-même la classe Controller incluse dans la librairie du cœur de
CakePHP. Ainsi, AppController est définie dans /app/app\_controller.php
comme ceci :

::

    <?php
    class AppController extends Controller {
    }
    ?>

Les attributs et méthodes de contrôleur créés dans AppController seront
disponibles dans tous les contrôleurs de votre application. C'est
l'endroit idéal pour créer du code commun à tous vos contrôleurs. Les
Composants (que vous découvrirez plus loin) sont mieux appropriés pour
du code utilisé dans la plupart (mais pas nécessairement tous) des
contrôleurs.

Bien que les règles habituelles d'héritage de la programmation orientée
objet soient appliquées, CakePHP exécute également un travail
supplémentaire si des attributs spécifiques des contrôleurs sont
fournis, comme la liste des composants ou assistants utilisés par un
contrôleur. Dans ces situations, les valeurs des tableaux de
AppController sont fusionnées avec les tableaux de la classe contrôleur
enfant.

CakePHP fusionne les variables suivantes de la classe AppController avec
celles des contrôleurs de votre application :

-  $components
-  $helpers
-  $uses

N'oubliez pas d'ajouter les assistants Html et Form si vous avez défini
``var $helpers`` dans la classe AppController.

Pensez à appeler les fonctions de retour (*callbacks*) de AppController
dans celles du contrôleur enfant pour de meilleurs résultats :

::

    function beforeFilter(){
        parent::beforeFilter();
    }

Le contrôleur "Pages"
=====================

Le cœur de CakePHP est livré avec un contrôleur par défaut appelé *Pages
Controller* (cake/libs/controller/pages\_controller.php). La page
d'accueil que vous voyez juste après l'installation est d'ailleurs
générée à l'aide de ce contrôleur. Il est généralement utilisé pour
diffuser des pages statiques. Ex : Si vous écrivez un fichier de vue
app/views/pages/a\_propos.ctp, vous pouvez y accéder en utilisant l'url
http://example.com/pages/a\_propos

Quand vous "cuisinez" une applications avec l'utilitaire console de
CakePHP, le contrôleur Pages est copié dans votre dossier
app/controllers/ et vous pouvez le modifier selon vos besoin. Ou vous
pouvez simplement copier le fichier pages\_controller.php du cœur de
CakePHP vers votre dossier app.

Ne modifiez jamais AUCUN fichier dans le dossier ``cake`` pour éviter
d'avoir des problèmes lors de futures mises à jour du cœur

Attributs des Contrôleurs
=========================

Pour une liste complète des attributs des contrôleurs avec leurs
descriptions, consultez l'API CakePHP :
`http://api12.cakephp.org/class/controller <http://api12.cakephp.org/class/controller>`_.

$name
-----

Les utilisateurs de PHP4 doivent inclure dans le code de leurs
contrôleurs la définition de l'attribut $name. L'attribut $name sert à
définir le nom du contrôleur. Comme indiqué précédemment il s'agit juste
du nom du modèle, au pluriel. Cet attribut permet de contourner
certaines limitations liées au nommage des classes en PHP4 et permet
donc à CakePHP de résoudre les noms.

::

    # exemple d'usage de l'attribut $name dans un contrôleur 
    <?php

    class RecettesController extends AppController {
       var $name = 'Recettes';
    }

    ?>

$components, $helpers et $uses
------------------------------

Les autres attributs les plus souvent utilisés permettent d'indiquer à
CakePHP quels assistants (*helpers*), composants (*components*) et
modèles vous utiliserez avec le contrôleur courant. Utiliser ces
attributs rend ces classes MVC, fournies par ``$components`` et
``$uses``, disponibles pour le contrôleur, sous la forme de variables de
classe (``$this->NomModele``, par exemple) et celles fournies par
``$helpers``, disponibles pour la vue comme une variable référence à
l'objet (``$nomassistant``).

Chaque contrôleur a déjà accès, par défaut, à certaines de ces classes,
donc vous n'avez pas besoin de les redéfinir.

Les contrôleurs ont accès par défaut à leur modèle primaire respectif.
Notre contrôleur Recettes aura donc accès à son modèle Recette,
disponible via ``$this->Recette``, et notre contrôleur Produits
proposera un accès à son modèle via ``$this->Produit``.Cependant, quand
vous autorisez un contrôleur à accéder à d'autres modèles via la
variable ``$uses``, le nom du modèle primaire du contrôleur courant doit
également être inclus. Ceci est illustré dans l'exemple ci-dessous.

Les assistants (*Helpers*) Html et Session sont toujours accessibles par
défaut, tout comme le composant Session (*SessionComponent*). Mais si
vous choisissez de définir votre propre tableau $helpers dans
AppController, assurez-vous d'y inclure ``Html`` et ``Form`` si vous
voulez qu'ils soient toujours disponibles par défaut dans vos propres
contrôleurs. Pour en savoir plus au sujet de ces classes, assurez-vous
de regarder leurs sections respectives plus loin dans le manuel.

Jetons maintenant un œil sur la façon d'indiquer à CakePHP que vous avez
dans l'idée d'utiliser d'autres classes MVC :

::

    <?php

    class RecettesController extends AppController {
        var $name = 'Recettes';
        var $uses = array('Recette', 'Utilisateur');
        var $helpers = array('Ajax');
        var $components = array('Email');
    }

    ?>   

Toutes ces variables sont fusionnées (merged) avec leurs valeurs
héritées, par conséquent ce n'est pas nécessaire de re-déclarer (par
exemple) le helper Form ou tout autre déclaré dans votre contrôleur App.

Si vous ne souhaitez pas utiliser un modèle dans votre contrôleur,
indiquez ``var $uses = null`` ou ``var $uses = array()``. Ceci vous
permettra d'utiliser un contrôleur sans la nécessité d'un fichier de
modèle correspondant.

Il n'est pas conseillé d'ajouter tous les modèles systématiquement à
votre contrôleur via le tableau ``$uses``. Allez regarder
`ici <https://book.cakephp.org/fr/view/79/Relationship-Types>`_ et
`la <https://book.cakephp.org/fr/view/845/loadModel>`_ pour voir comment
accéder proprement aux modèles respectivement associés ou pas.

Les attributs en relation avec la page : $layout et $pageTitle
--------------------------------------------------------------

Quelques attributs sont à votre disposition dans les contrôleurs de
CakePHP pour vous donner le contrôle sur la mise en page (*layout*) de
vos vues.

L'attribut $layout peut ainsi prendre le nom de n'importe quel fichier
de mise en page sauvegardé dans le répertoire /app/view/layout. Pour
définir cet attribut il suffit d'y affecter le nom du fichier de mise en
page moins son extension (.ctp). Si cet attribut n'est pas redéfini,
CakePHP utilisera le fichier de mise en page par défaut, situé (ou à
créer) dans /app/views/layout/default.ctp. Si vous n'avez pas redéfini
ce fichier, CakePHP utilisera la mise en page par défaut (définie dans
/cake/lib/view/layout/default.ctp).

::

    # Utilisons $layout pour définir une mise en page alternative
    <?php

    class RecettesController extends AppController {
        function sauvegardeRapide() {
            $this->layout = 'ajax';
        }
    }

    ?>  

L'attribut $pageTitle de vos contrôleurs vous permet de définir le nom
de la page qui sera affichée. Pour que la magie puisse s'opérer, votre
fichier de mise en page doit inclure la variable $title\_for\_layout,
placée entre les balises <title> du <head> de votre document HTML.
Ainsi, il ne vous reste plus qu'à définir $pageTitle avec la chaine de
caractère que vous souhaitez voir apparaître comme titre de votre
document.

::

        
    # Utilisons $pageTitle pour définir le titre de la page
    <?php     
    class RecettesController extends AppController {     
    function sauvegardeRapide() {    
    $this->pageTitle = 'Titre de mon moteur de recherche optimisé';   
    }    
    }    
    ?> 

Vous pouvez aussi choisir un titre pour la page en utilisant
``$this->pageTitle`` (Vous devez inclure la partie $this->). Cette
technique est recommandée parce qu'elle permet de mieux séparer la
logique de mise en page et le contenu. Pour une page statique, vous
devez utiliser ``$this->pageTitle`` dans la vue si vous souhaitez un
titre différent.

Si la variable ``$this->pageTitle`` n'est pas affectée, un titre sera
automatiquement celui du contrôleur, ou de la vue s'il s'agit d'une page
statique.

L'attribut Paramètres ($params)
-------------------------------

Les paramètres d'un contrôleur sont accessible via ``$this->params``.
Cette variable est utilisée pour accéder aux informations relatives à la
requête courante. La plupart du temps ``$this->params`` est utilisé pour
accéder aux informations transmises au contrôleur via les opérations
POST ou GET.

form
~~~~

``$this->params['form']``

Toute donnée transmise par POST depuis tout formulaire est stockée dans
cette variable, incluant également les informations trouvées dans
$\_FILES.

admin
~~~~~

``$this->params['admin']``

Il est défini à 1 si l'action courante a été invoquée via le routage
d'admin.

bare
~~~~

``$this->params['bare']``

Stocke 1 si le *layout* courant est vide, 0 s'il ne l'est pas.

isAjax
~~~~~~

``$this->params['isAjax']``

Vaut 1 si la requête courante est un appel ajax, 0 sinon. Cette variable
est seulement définie si le Composant RequestHandler est utilisé par le
contrôleur.

controller
~~~~~~~~~~

``$this->params['controller']``

Stocke le nom du contrôleur courant qui manipule la requête. Par
exemple, si l'URL /posts/voir/1 était appelée,
``$this->params['controller']`` serait égal à "posts".

action
~~~~~~

``$this->params['action']``

Stocke le nom de l'action courante exécutant la requête. Par exemple, si
l'URL /posts/voir/1 était interrogée, ``$this->params['action']`` serait
égal à "voir".

pass
~~~~

``$this->params['pass']``

Retourne un tableau (indexé numériquement) des paramètres d'URL situés
après le nom de l'action.

::

    // URL: /posts/voir/12/imprimer/reduire

    Array
    (
        [0] => 12
        [1] => imprimer
        [2] => reduire
    )

url
~~~

``$this->params['url']``

Stocke l'URL courante interrogée, ainsi que les paires clé-valeur des
variables passées en GET. Par exemple, si l'URL
/posts/voir/?var1=3&var2=4 était appelée, ``$this->params['url']``
devrait contenir :

::

    [url] => Array
    (
        [url] => posts/voir
        [var1] => 3
        [var2] => 4
    )

data
~~~~

``$this->data``

Utilisé pour traiter les données transmises au contrôleur, en POST,
depuis les formulaires du Helper Form.

::

    <?php

    // Le Helper Form est utilisé pour créer un élément de formulaire
    $form->text('Utilisateur.prenom');

Lequel, une fois affiché, ressemble à quelque chose comme :

::

    <input name="data[Utilisateur][prenom]" value="" type="text" />

Quand le formulaire est soumis au contrôleur via POST, les données sont
visibles dans ``this->data``.

::

    // Le prénom renseigné peut se trouver ici :
    $this->data['Utilisateur']['prenom'];
    ?>

prefix
~~~~~~

``$this->params['prefix']``

Rempli par le préfixe de routage. Par exemple, cet attribut contiendrait
la chaîne "admin" durant une requête à /admin/posts/uneaction.

named
~~~~~

``$this->params['named']``

Stocke tout paramètre nommé dans la chaîne de requête, sous la forme
/clé:valeur/. Par exemple, si l'URL /posts/voir/var1:3/var2:4 était
demandée, ``$this->params['named']`` serait un tableau contenant :

::

    [named] => Array
    (
        [var1] => 3
        [var2] => 4
    )

Autres attributs
----------------

L'attribut $cacheAction fournit de l'aide pour mettre en cache les vues,
et l'attribut $paginate permet de définir les options qui seront
utilisées par défaut pour la pagination. Pour plus d'informations sur
ces deux attributs, jetez un oeil sur les sections qui leur sont dédiées
dans ce manuel.

N'hésitez pas à faire un tour dans l'API pour voir le rôle des autres
attributs de la classe contrôleur, il y a en effet plusieurs autres
variables qui mériteraient également leur section dans ce manuel.

persistModel
------------

Mettez-moi à jour !

Utilisé pour créer des instances, mises en cache, des modèles qu'un
contrôleur utilise. Quand défini à *true*, tous les modèles reliés au
contrôleur seront mis en cache. Ceci peut améliorer les performances
dans de nombreux cas.

Méthodes des Contrôleurs
========================

Pour une liste complète des méthodes de contrôleur avec leurs
descriptions, consultez l'API CakePHP :
`https://api.cakephp.org/class/controller <https://api.cakephp.org/class/controller>`_.

Interaction avec les Vues
-------------------------

set
~~~

``set(string $variable, mixed $valeur)``

La méthode ``set()`` est la voie principale utilisée pour transmettre
des données de votre contrôleur à votre vue. Une fois ``set()``
utilisée, la variable de votre contrôleur devient accessible par la vue.

::

    <?php
        
    // Dans un premier temps vous passez les données depuis le contrôleur :
    $this->set('couleur', 'rose');

    // Ensuite vous pouvez les utiliser dans la vue de cette manière :
    ?>
    Vous avez sélectionné un glaçage <?php echo $couleur; ?> pour le gâteau.

La méthode ``set()`` peut également prendre un tableau associatif comme
premier paramètre. Cela peut souvent être une manière rapide d'affecter
en une seule fois un jeu complet d'informations à la vue.

Les clefs de votre tableau seront infléchies avant d'être assignées à la
vue (‘clef\_avec\_underscore’ devient ‘clefAvecUnderscore’, etc.).

::

    <?php
        
    $data = array(
        'couleur' => 'rose',
        'type' => 'sucré',
        'prix_de_base' => 23.95
    );

    //rend $couleur, $type, and $prixDeBase 
    //disponibles dans la vue:

    $this->set($data);  

    ?>

render
~~~~~~

``render(string $action, string $layout, string $fichier)``

La méthode ``render()`` est automatiquement appelée à la fin de chaque
action exécutée par le contrôleur. Cette méthode exécute toute la
logique liée à la présentation (en utilisant les variables transmises
via la méthode ``set()``), place le contenu de la vue à l'intérieur de
sa mise en page et transmet le tout à l'utilisateur final.

Le fichier de vue utilisé par défaut est déterminé par convention.
Ainsi, si l'action ``rechercher()`` de notre contrôleur
RecettesController est demandée, le fichier de vue situé dans
/app/view/recettes/rechercher.ctp sera utilisé.

::

    class RecettesController extends AppController {
    ...
    function rechercher() {
        // Affiche la vue située dans /views/recettes/rechercher.ctp
        $this->render();
    }
    ...
    }

Bien que CakePHP appellera cette fonction automatiquement à la fin de
chaque action (à moins que vous n'ayez défini ``$this->autoRender`` à
false), vous pouvez l'utiliser pour spécifier un fichier de vue
alternatif en précisant le nom d'une action dans le contrôleur, via le
paramètre ``$action``.

Si ``$action`` commence avec un '/' on suppose que c'est un fichier de
vue ou un element dont le chemin est relatif au dossier ``/app/views``.
Cela permet un affichage direct des éléments, ce qui est très pratique
lors d'appels ajax.

::

    // Affiche l'élement situé dans /views/elements/ajaxretour.ctp
    $this->render('/elements/ajaxretour');

Vous pouvez également spécifier un fichier alternatif en utilisant le
troisième paramètre ``$file``. Quant vous utilisez ``$file``, n'oubliez
pas d'utiliser les constantes globales de CakePHP (comme ``VIEWS``).

Le second paramètre ``$layout`` vous permet de spécifier la fichier de
mise en page qui sera utilisée pour afficher la vue.

Contrôle du flux
----------------

redirect
~~~~~~~~

``redirect(mixed $url, integer $status, boolean $exit)``

La méthode de contrôle de flux que vous utiliserez le plus souvent est
``redirect()``. Cette méthode prend son premier paramètre sous la forme
d'une URL relative à votre application CakePHP. Quand un utilisateur a
réalisé un paiement avec succès, vous aimeriez le rediriger vers un
écran affichant le reçu.

::

    <?php
    function reglerAchats() {
        // Placez ici la logique pour finaliser l'achat...
        if($succes) {
            $this->redirect(array('controller'=>'paiements', 'action'=>'remerciements'));
        } else {
            $this->redirect(array('controller'=>'paiements', 'action'=>'confirmation'));
        }
    }
    ?>

Vous pouvez aussi utiliser une URL relative ou absolue avec le paramètre
$url :

::

    $this->redirect('/paiements/remerciements'));
    $this->redirect('http://www.exemple.com');

Vous pouvez aussi passer des données à l'action :

::

    $this->redirect(array('action' => 'editer', $id));

Le second paramètre de la fonction ``redirect()`` vous permet de définir
un code de statut HTTP accompagnant la redirection. Vous aurez peut-être
besoin d'utiliser le code 301 (document déplacé de façon permanente) ou
303 (voir ailleurs), en fonction de la nature de la redirection.

Cette méthode réalise un ``exit()`` après la redirection, tant que vous
ne mettez pas le troisième paramètre à ``false``.

Si vous avez besoin de rediriger à la page appelante, vous pouvez
utiliser :

::

    $this->redirect($this->referer());

flash
~~~~~

``flash(string $message, string $url, integer $pause)``

Tout comme ``redirect()``, la méthode ``flash()`` est utilisée pour
rediriger un utilisateur vers une autre page à la fin d'une opération.
La méthode ``flash()`` est toutefois différente en ce sens qu'elle
affiche un message avant de diriger l'utilisateur vers une autre url.

Le premier paramètre devrait contenir le message qui sera affiché et le
second paramètre une URL relative à votre application CakePHP. CakePHP
affichera le ``$message`` pendant ``$pause`` secondes avant de rediriger
l'utilisateur.

Pour définir des messages flash dans une page, regardez du côté de la
méthode ``setFlash()`` du composant Session (*SessionComponent*).

Méthodes de Callbacks
---------------------

Les contrôleurs de CakePHP sont livrés par défaut avec des méthodes de
rappel (ou callback) qui vous pouvez utiliser pour insérer de la logique
juste avant ou juste après que les actions du contrôleur soient
effectuées.

``beforeFilter()``

Cette fonction est exécutée avant chaque action du contrôleur. C'est un
endroit pratique pour vérifier le statut d'une session ou les
permissions d'un utilisateur.

``beforeRender()``

Cette méthode est appelée après l'action du contrôleur mais avant que la
vue ne soit rendue. Ce callback n'est pas souvent utilisé, mais
peut-être nécessaire si vous appellez render() manuellement à la fin
d'une action donnée.

``afterFilter()``

Cette méthode est appelée après chaque action du contrôleur, et après
que l'affichage soit terminé. C'est la dernière méthode du contrôleur
qui est exécutée.

``afterRender()``

Appelée lorsque la vue correspondant à l'action a été affichée.

CakePHP supporte également des rappels (callbacks) liés au prototypage
rapide (scaffolding).

``_beforeScaffold($methode)``

$methode nom de la méthode appelée exemple index, edit, etc.

``_afterScaffoldSave($methode)``

$methode nom de la méthode appelée, soit edit soit update.

``_afterScaffoldSaveError($methode)``

$methode nom de la méthode appelée, soit edit soit update.

``_scaffoldError($methode)``

$methode nom de la méthode appelée exemple index, modifier, etc.

Autres méthodes utiles
----------------------

 
-

constructClasses
~~~~~~~~~~~~~~~~

Cette méthode charge en mémoire les modèles requis par le contrôleur.
Cette procédure de chargement est normalement effectuée par CakePHP,
mais cette méthode est à garder sous le coude quand vous avez besoin
d'accéder à certains contrôleurs depuis une perspective différente. Si
vous avez besoin de CakePHP dans un script utilisable en ligne de
commande ou d'autres utilisations externes, constructClasses() peut
devenir pratique.

referer
~~~~~~~

``string referer(mixed $default = null, boolean $local = false)``

Retourne l'URL référente de la requête courante. Le paramètre
``$default`` peut être utilisé pour fournir une URL par défaut à
utiliser si HTTP\_REFERER ne peut être lu dans les headers. Donc, au
lieu de faire ceci :

::

    <?php
    class UtilisateurController extends AppController {
        function delete($id) {
            // le code de suppression va ici, et ensuite...
            if ($this->referer() != '/') {
                $this->redirect($this->referer());
            } else {
                $this->redirect(array('action' => 'index'));
            }
        }
    }
    ?>

vous pouvez faire ceci :

::

    <?php
    class UtilisateurController extends AppController {
        function delete($id) {
            // le code de suppression va ici, et ensuite...
            $this->redirect($this->referer(array('action' => 'index')));
        }
    }
    ?>

Si ``$default`` n'est pas défini, la fonction redirige par défaut à la
racine de votre domaine - '/'.

Si le paramètre ``$local`` est défini à ``true``, cela restreint les
URLs référentes à votre serveur local.

disableCache
~~~~~~~~~~~~

Utilisée pour indiquer au **navigateur** de l'utilisateur de ne pas
mettre en cache le résultat de la requête courante. Ceci est différent
du système de cache de vue couvert dans le chapitre suivant.

Les entêtes HTTP envoyés à cet effet sont :

-  ``Expires: Mon, 26 Jul 1997 05:00:00 GMT``
-  ``Last-Modified: [current datetime] GMT``
-  ``Cache-Control: no-store, no-cache, must-revalidate``
-  ``Cache-Control: post-check=0, pre-check=0``
-  ``Pragma: no-cache``

postConditions
~~~~~~~~~~~~~~

``postConditions(array $donnees, mixed $op, string $bool, boolean $exclusif)``

Utilisez cette méthode pour transformer des données de formulaire,
transmises par POST (depuis les inputs du Helper Form), en des
conditions de recherche pour un modèle. Cette fonction offre un
raccourci appréciable pour la construction de la logique de recherche.
Par exemple, un administrateur aimerait pouvoir chercher des commandes
dans le but de connaître quels produits doivent être emballés. Vous
pouvez utiliser les Helpers Form et Html pour construire un formulaire
rapide basé sur le modèle Commande. Ensuite une action du contrôleur
peut utiliser les données postées par ce formulaire pour construire
automatiquement les conditions de la recherche :

::

    function index() {
        $conditions=$this->postConditions($this->data);
        $commandes = $this->Commande->find('all',compact('conditions'));
        $this->set('commandes', $orders);
    }

Si ``$this->data[‘Commande’][‘destination’]`` vaut "Boulangerie du
village", postConditions convertit cette condition en un tableau
compatible avec la méthode Model->find(). Soit dans notre cas,
array("Commande.destination" => "Boulangerie du village").

Si vous voulez utiliser un opérateur SQL différent entre chaque terme,
remplacez-le en utilisant le second paramètre :

::

    /*
    Contenu de $this->data
    array(
        'Commande' => array(
            'nb_items' => '4',
            'referrer' => 'Ye Olde'
        )
    )
    */

    //Trouvons les commandes qui ont au moins 4 items et qui contiennent ‘Ye Olde’
    $conditions = $this->postConditions(
        $this->data,
        array(
            'nb_items' => '>=',  
            'referrer' => 'LIKE'
        )
    ));
    );
    $commandes = $this->Commande->find("all",compact('conditions'));

Le troisième paramètre vous permet de dire à CakePHP quel opérateur
booléen SQL utilisé entre les conditions de recherche. Les chaînes comme
"AND", "OR" et "XOR" sont des valeurs possibles.

Enfin, si le dernier paramètre est défini à vrai et que $op est un
tableau, les champs non-inclus dans $op ne seront pas inclus dans les
conditions retournées.

paginate
~~~~~~~~

Cette méthode est utilisée pour paginer les résultats retournés par vos
modèles. Vous pouvez définir les tailles de la page, les conditions à
utiliser pour la recherche de ces données et bien plus. Consultez la
section `pagination </fr/view/164/pagination>`_ pour plus de détails sur
l'utilisation de la pagination.

requestAction
~~~~~~~~~~~~~

``requestAction(string $url, array $options)``

Cette fonction appelle l'action d'un contrôleur depuis tout endroit du
code et retourne les données associées à cette action. L'``$url`` passée
est une adresse relative à votre application CakePHP
(/contrôleur/action/paramètres). Pour passer des données supplémentaires
au contrôleur destinataire ajoutez le tableau $options.

Vous pouvez utiliser ``requestAction()`` pour récupérer l'intégralité de
l'affichage d'une vue en passant la valeur 'return' dans les options :
``requestAction($url, array('return'));``

Si elle est utilisée sans cache, la méthode ``requestAction`` peut
engendrer des faibles performances. Il est rarement approprié de
l'utiliser dans un contrôleur ou un modèle.

``requestAction`` est plutôt utilisé en conjonction avec des éléments
(mis en cache) - comme moyen de récupérer les données pour un élément
avant de l'afficher. Prenons l'exemple de la mise en place d'un élément
"derniers commentaires" dans le gabarit (layout). Nous devons d'abord
créer une méthode de controller qui retourne les données.

::

    // controllers/commentaires_controller.php
    class CommentairesController extends AppController {
        function derniers() {
            return $this->Commentaire->find('all', array('order' => 'Commentaire.created DESC', 'limit' => 10));
        }
    }

Si nous créons un élément simple pour appeler cette fonction :

::

    // views/elements/derniers_commentaires.ctp

    $commentaires = $this->requestAction('/commentaires/derniers');
    foreach($commentaires as $commentaire) {
        echo $commentaire['Commentaire']['title'];
    }

On peut ensuite placer cet élément n'importe où pour obtenir la sortie
en utilisant :

::

    echo $this->element('derniers_commentaires');

Ecrit de cette manière, dès que l'élément est affiché, une requête sera
faite au contrôleur pour obtenir les données, les données seront
traitées, et retournées. Cependant, compte tenu de l'avertissement
ci-dessus il vaut mieux utiliser des éléments mis en cache pour
anticiper des traitements inutiles. En modifiant l'appel à l'élément
pour qu'il ressemble à ceci :

::

    echo $this->element('derniers_commentaires', array('cache'=>'+1 hour'));

L'appel à ``requestAction`` ne sera pas effectué tant que le fichier de
vue de l'élément en cache existe et est valide.

De plus, ``requestAction`` prends désormais des urls basées sur des
tableau dans le style de cake :

::

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'particuliers'), array('return'));

Cela permet à l'appel de requestAction d'éviter l'utilisation de
Router::url ce qui peut améliorer la performance. Les url basées sur des
tableaux sont les mêmes que celles utilisées par HtmlHelper::link avec
une seule différence. Si vous utilisez des paramètres nommés ou passés
dans vos url, vous devez les mettre dans un second tableau et les
inclures dans la clé correcte. La raison de cela est que requestAction
fusionne seulement le tableau des arguments nommés avec les membres du
tableau de Controller::params et ne place pas les arguments nommés dans
la clé 'named'.

::

    echo $this->requestAction('/articles/particuliers/limit:3');
    echo $this->requestAction('/articles/voir/5');

Ceci en tant que tableau dans le requestAction serait alors :

::

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'particuliers'), array('named' => array('limit' => 3)));

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'voir'), array('pass' => array(5)));

A la différence d'autres endroits où les tableaux d'urls sont identiques
aux chaînes d'url, requestAction les manipule différemment.

Lors de l'utilisation d'un tableau d'url en conjonction avec
requestAction() vous devez spécifier **tous** les paramètres dont vous
aurez besoin dans l'action demandée. Ceci inclut des paramètres comme
``$this->data`` et ``$this->params['form']``. De plus, en passant tous
les paramètres requis, *named* et *pass* doivent êtres conformes dans le
second tableau, comme vu ci-dessus.

loadModel
~~~~~~~~~

``loadModel(string $modelClass, mixed $id)``

La fonction ``loadModel`` est très pratique quand vous avez besoin
d'utiliser un modèle qui n'est pas le modèle par défaut du contrôleur ou
ses modèles associés.

::

    $this->loadModel('Article');
    $articles_recents = $this->Article->find('all', array('limit' => 5, 'order' => 'Article.created DESC'));

::

    $this->loadModel('Utilisateur', 2);
    $utilisateur = $this->Utilisateur->read();

