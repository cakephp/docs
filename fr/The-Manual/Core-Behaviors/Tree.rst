Arbre transversal
#################

C'est assez courant de vouloir stocker ses données sous une forme
hiérarchique dans la table d'une base de données. Des exemples de tels
besoins pourraient être des catégories avec un nombre illimité de
sous-catégories, des données en relation avec un système de menu
multi-niveaux ou une représentation littérale d'une hiérarchie, comme
celle qui est utilisée pour stocker les objets de contrôle d'accès avec
la logique ACL.

Pour de petits arbres de données et les cas où les données n'ont que
quelques niveaux de profondeurs, c'est simple d'ajouter un champ
parent\_id à votre table et de l'utiliser pour savoir quel objet est le
parent de quel autre. En natif avec CakePHP, il existe cependant un
moyen puissant d'avoir les bénéfices de `la logique
MPTT <https://dev.mysql.com/tech-resources/articles/hierarchical-data.html>`_,
sans avoir à connaître les détails de l'implémentation technique - à
moins que ça ne vous intéresse ;).

Pré-requis
==========

Pour utiliser le comportement en Arbre (*TreeBehavior*), votre table
nécessite 3 champs tels que listés ci-dessous (tous sont des entiers) :

-  parent - le nom du champ par défaut est parent\_id, pour stocker l'id
   de l'objet parent.
-  left - le nom du champ par défaut est lft, pour stocker la valeur lft
   de la ligne courante.
-  right - le nom du champ par défaut est rght, pour stocker la valeur
   rght de la ligne courante.

Si vous êtes familier de la logique MPTT vous pouvez vous demander
pourquoi un champ parent existe - parce qu'il est tout bonnement plus
facile d'effectuer certaines tâches à l'usage si un lien parent direct
est stocké en base, comme rechercher directement les enfants.

Utilisation basique
===================

Le comportement en arbre de données (Tree behavior) possède beaucoup de
fonctionnalités, mais commençons avec un exemple simple. Créons la table
suivante :

::

    CREATE TABLE categories (
        id INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        parent_id INTEGER(10) DEFAULT NULL,
        lft INTEGER(10) DEFAULT NULL,
        rght INTEGER(10) DEFAULT NULL,
        name VARCHAR(255) DEFAULT '',
        PRIMARY KEY  (id)
    );

    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(1, 'Mes  Catégories', NULL, 1, 30);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(2, 'Fun', 1, 2, 15);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(3, 'Sport', 2, 3, 8);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(4, 'Surf', 3, 4, 5);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(5, 'Tricot extrême', 3, 6, 7);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(6, 'Amis', 2, 9, 14);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(7, 'Gérard', 6, 10, 11);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(8, 'Gwendoline', 6, 12, 13);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(9, 'Travail', 1, 16, 29);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(10, 'Rapports', 9, 17, 22);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(11, 'Annuel', 10, 18, 19);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(12, 'Statut', 10, 20, 21);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(13, 'Voyages', 9, 23, 28);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(14, 'National', 13, 24, 25);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(15, 'International', 13, 26, 27);

Dans le but de vérifier que tout est défini correctement, nous pouvons
créer une méthode de test et afficher les contenus de notre arbre de
catégories, pour voir à quoi il ressemble. Avec un simple contrôleur :

::

    <?php
    class CategoriesController extends AppController {

            var $name = 'Categories';
            
            function index() {
                    $this->data = $this->Category->generatetreelist(null, null, null, '&nbsp;&nbsp;&nbsp;');
                    debug ($this->data); die;       
            }
    }
    ?>

et une définition de modèle encore plus simple :

::

    <?php
    // app/models/category.php
    class Category extends AppModel {
        var $name = 'Category';
        var $actsAs = array('Tree');
    }
    ?>

Nous pouvons vérifier à quoi ressemble les données de notre arbre de
catégories, en visitant /categories. Vous devriez voir quelque chose
comme :

-  Mes Catégories

   -  Fun

      -  Sport

         -  Surf
         -  Tricto extrême

      -  Amis

         -  Gérard
         -  Gwendoline

   -  Travail

      -  Rapports

         -  Annuel
         -  Statut

      -  Voyages

         -  National
         -  International

Ajouter des données
-------------------

Dans la section précédente, nous utilisions des données existantes et
nous vérifiions qu'elles semblaient hiérarchiques via la méthode
``generatetreelist``. Toutefois, vous aimeriez normalement ajouter vos
données exactement de la même façon que vous le feriez pour tout modèle.
Par exemple :

::

    // pseudo code de contrôleur
    $data['Category']['parent_id'] =  3;
    $data['Category']['nom'] =  'Skate';
    $this->Category->save($data);

En utilisant le comportement en arbre, il n'est pas nécessaire de faire
autre chose que de définir le parent\_id, et le comportement en arbre
s'occupera du reste. Si vous ne définissez pas le parent\_id, le
comportement en arbre ajoutera l'enregistrement à la racine, faisant de
votre nouvel ajout une nouvelle entrée de niveau supérieur :

::

    // pseudo code de contrôleur
    $data = array();
    $data['Category']['nom'] =  'Autres catégories de Personnes';
    $this->Category->save($data);

Exécuter les deux fragments de code ci-dessus modifiera votre arbre de
cette façon :

-  Mes Catégories

   -  Fun

      -  Sport

         -  Surf
         -  Tricot extrême
         -  Skate **Nouveau**

      -  Amis

         -  Gérald
         -  Gwendolyne

   -  Travail

      -  Rapports

         -  Annuel
         -  Statut

      -  Voyages

         -  National
         -  International

-  Catégories des autres Personnes **Nouveau**

Modifier les données
--------------------

Modifier des données est aussi transparent que d'en ajouter des
nouvelles. Si vous modifiez quelque chose, mais que vous ne changez pas
le champ parent\_id, la structure de vos données sera finalement
inchangée. Par exemple :

::

    // pseudo code de contrôleur
    $this->Category->id = 5; // id de Tricot extrême
    $this->Category->save(array('nom' =>'Pêche extrême'));

Le code ci-dessus n'affecte pas le champ parent\_id, même si le
parent\_id est inclus dans les données qui sont passées au save lorsque
sa valeur ne change pas, il n'affecte pas non plus la structure de
données. Par conséquent, l'arbre de données devrait maintenant
ressembler à :

-  Mes Catégories

   -  Fun

      -  Sport

         -  Surf
         -  Pêche extrême **Mis à jour**
         -  Skate

      -  Amis

         -  Gérald
         -  Gwendolyne

   -  Travail

      -  Rapports

         -  Annuel
         -  Statut

      -  Voyages

         -  National
         -  International

-  Catégories des autres Personnes

Déplacer les données au sein de votre arbre est également une simple
formalité. Disons que Pêche extrême ne va plus sous Sport, mais qu'elle
devrait plutôt être placée sous Autres catégories de Personnes. Avec le
code suivant :

::

    // pseudo code de contrôleur
    $this->Category->id = 5; // id de Pêche extrême
    $nouveauParentId = $this->Category->field('id', array('nom' => 'Autres catégories de Personnes'));
    $this->Category->save(array('parent_id' => $nouveauParentId)); 

Comme attendu, la structure est modifiée en :

-  Mes Catégories

   -  Fun

      -  Sport

         -  Surf
         -  Skate

      -  Amis

         -  Gérald
         -  Gwendolyne

   -  Travail

      -  Rapports

         -  Annuel
         -  Statut

      -  Voyages

         -  National
         -  International

-  Catégories des autres Personnes

   -  Pêche extrême **Déplacé**

Supprimer des données
---------------------

Le comportement en arbre fournit de nombreuses manières de gérer la
suppression de données. Pour commencer avec l'exemple le plus simple,
imaginons que la catégorie des rapports n'est plus utilisée. Pour la
supprimer *et tous les enfants qu'elle pourrait avoir* appelez
simplement delete comme vous le feriez pour tout modèle. Par exemple,
avec le code suivant :

::

    //  pseudo code de contrôleur
    $this->Category->id = 10;
    $this->Category->delete();

L'arbre de catégories sera modifié comme ainsi :

-  Mes Catégories

   -  Fun

      -  Sport

         -  Surf
         -  Skate

      -  Amis

         -  Gérald
         -  Gwendolyne

   -  Travail

      -  Voyages

         -  National
         -  International

-  Catégories des autres Personnes

   -  Pêche extrême

Interroger et utiliser vos données
----------------------------------

Utiliser et manipuler des données hiérarchiques peut s'avérer une
entreprise compliquée. En plus des méthodes *find* du cœur, avec le
comportement en arbre il y a quelques permutations plus orientées
arborescence à votre disposition.

La plupart des méthodes du comportement en arbre retournent et dépendent
de données qui ont été triées par le champ ``lft``. Si vous appelez
``find()`` et que vous ne faites pas un ``order by lft`` ou si vous
appelez une méthode du comportement en arbre et que vous lui passez un
ordre de tri, vous pourriez obtenir des résultats indésirables.

children
~~~~~~~~

La méthode ``children`` prend la valeur de la clé primaire (l'id) d'une
ligne et retourne ses enfants, par défaut dans l'ordre où ils
apparaissent dans l'arbre. Le second paramètre, optionnel, définit si
oui ou non les enfants direct uniquement doivent être retournés.
Utilisons les données de l'exemple de la section précédent :

::

    $tousEnfants = $this->Category->children(1); // un tableau simple avec 11 items
    // -- ou --
    $this->Category->id = 1;
    $tousEnfants = $this->Category->children(); // un tableau simple avec 11 items

    // Retourne uniquement les enfants directs
    $enfantsDirects = $this->Category->children(1, true); // un tableau simple avec 2 items

Si vous voulez un tableau récursif, utilisez ``find('threaded')``

childCount
~~~~~~~~~~

Tout comme la méthode ``children``, ``childCount`` prend la valeur de la
clé primaire (l'id) d'une ligne et retourne combien d'enfants elle a. Le
second paramètre, optionnel, définit si oui ou non les enfants direct
uniquement sont comptés. Utilisons les données de l'exemple de la
section précédente :

::

    $nbEnfants = $this->Category->childCount(1); // affichera11
    // -- ou --
    $this->Category->id = 1;
    $directChildren = $this->Category->childCount(); // affichera 11

    // Compte uniquement les descendants directs de cette catégorie
    $nbEnfants = $this->Category->childCount(1, true); // affichera 2

generatetreelist
~~~~~~~~~~~~~~~~

``generatetreelist (&$model, $conditions=null, $keyPath=null, $valuePath=null, $spacer= '_', $recursive=null)``

Cette méthode retourne des données similaires à un find('list'), avec un
préfixe d'indentation pour mettre en évidence la structure de l'arbre.
Voici un exemple de rendu de cette méthode.

::

    array(
        [1] =>  "Mes Catégories",
        [2] =>  "_Fun",
        [3] =>  "__Sport",
        [4] =>  "___Surf",
        [16] => "___Skate",
        [6] =>  "__Amis",
        [7] =>  "___Gérald",
        [8] =>  "___Gwendolyne",
        [9] =>  "_Travail",
        [13] => "__Voyages",
        [14] => "___National",
        [15] => "___International",
        [17] => "Catégories des autres personnes",
        [5] =>  "_Pêche extrême"
    )

getparentnode
~~~~~~~~~~~~~

Cette fonction pratique retournera, comme son nom l'indique, le nœud
parent d'un nœud ou *false* si le nœud n'a pas de parent (c'est le nœud
racine). Par exemple :

::

    $parent = $this->Category->getparentnode(2); //<- id pour fun
    // $parent contient Mes Catégories

getpath
~~~~~~~

Le 'path' quand on se réfère à des données hiérarchiques, c'est comment
vous faites pour aller d'où vous êtes jusqu'en haut. Ainsi par exemple,
le chemin depuis la catégorie "International" est :

-  Mes Catégories

   -  ...
   -  Travail

      -  Voyages

         -  ...
         -  International

Utiliser l'id de "International" pour getpath retournera chacun de ses
parents à tour de rôle (en commençant depuis le sommet).

::

    $parents = $this->Category->getpath(15);

::

    // contenus de $parents
    array(
        [0] =>  array('Category' => array('id' => 1, 'name' => 'Mes Catégories', ..)),
        [1] =>  array('Category' => array('id' => 9, 'name' => 'Travail', ..)),
        [2] =>  array('Category' => array('id' => 13, 'name' => 'Voyages', ..)),
        [3] =>  array('Category' => array('id' => 15, 'name' => 'International', ..)),
    )

Autres méthodes
===============

Le comportement en arbre de données (Tree behavior) ne travaille pas
seulement en arrière plan, il y a une certains nombres de méthodes
spécifiques définies dans ce comportemant (bahavior) qui peuvent être
appélées directement : Ci-dessous une description brève et un exemple
pour chacune d'entre elles:

moveDown
--------

Utilisé pour descendre un noeud dans l'arbre hiérarchique. Vous devez
spécifier l'id de l'élément à descendre et un entier positif spécifiant
de combien de positions le noeud devrait être descendu. Tous les
sous-noeuds seront également déplacés dans l'arbre.

Ci-dessus un exemple d'une action d'un contrôleur (dans un contrôleur
nommé Categories) qui déplace un noeud spécifique dans l'arbre
hiérarchique:

::

    function movedown($title = null, $delta = null) {
            $cat = $this->Category->findByTitle($title);
            if (empty($cat)) {
                $this->Session->setFlash('Aucune catégorie ne porte le nom ' . $title);
                $this->redirect(array('action' => 'index'), null, true);
            }
            
            $this->Category->id = $cat['Category']['id'];
            
            if ($delta > 0) {  
                $this->Category->moveDown($this->Category->id, abs($delta));
            } else {
                $this->Session->setFlash('Merci de préciser de combien de crans le noeud doit être déplacé'); 
            }
        
            $this->redirect(array('action' => 'show'), null, true);
        }

Par exemple, si vous vouliez déplacer la catégories "Cookies" d'un cran
vers la bas, votre requête serait : /categories/movedown/Cookies/1.

moveUp
------

Utilisé pour déplacer vers le haut un seul nœud dans l'arbre
hiérarchique. Vous devez spécifier l'id de l'élément à déplacer et un
entier positif spécifiant de combien de positions le nœud devra être
déplacé. Tous les nœuds enfants seront également déplacés.

Ci-dessous un exemple d'une action de contrôleur (dans un contrôleur
nommé Categories) qui déplace un nœud spécifique dans l'arbre :

::

    function moveup($name = null, $delta = null){
            $cat = $this->Category->findByName($name);
            if (empty($cat)) {
                $this->Session->setFlash('Il n\'y a pas de catégorie nommée ' . $name);
                $this->redirect(array('action' => 'index'), null, true);
            }
            
            $this->Category->id = $cat['Category']['id'];
            
            if ($delta > 0) {  
                $this->Category->moveup($this->Category->id, abs($delta));
            } else {
                $this->Session->setFlash('Merci de préciser de combien de positions la catégorie doit être montée.'); 
            }
        
            $this->redirect(array('action' => 'index'), null, true);
        
        }

Par exemple, si vous voulez déplacer la catégorie "Gwendolyn" d'un cran
vers le haut, votre requête sera : /categories/moveup/Gwendolyn/1.
Maintenant l'ordre de Friends sera Gwendolyn, Gerald.

removeFromTree
--------------

::

    removeFromTree($id=null, $delete=false)

Utiliser cette méthode supprimera ou déplacera un nœud, mais conservera
son sous-arbre, lequel sera ré-apparenté un niveau plus haut. Cela offre
plus de contrôle que ```delete()`` </fr/view/690/delete>`_ qui, pour un
modèle utilisant le comportement en arbre, effacera le nœud spécifié et
tous ses enfants.

Prenons l'arbre suivant comme point de départ :

-  Mes Catégories

   -  Fun

      -  Sport

         -  Surf
         -  Tricot extrême
         -  Skate

Lançons le code suivant avec l'id de 'Sport'

::

    $this->Category->removeFromTree($id); 

Le nœud Sport va devenir un nœud de niveau principal :

-  Mes Catégories

   -  Fun

      -  Surf
      -  Tricot extrême
      -  Skate

-  Sport **Déplacé**

Ceci démontre le comportement par défaut de ``removeFromTree`` :
déplacer le nœud pour qu'il n'ait pas de parent, puis réapparenter tous
les enfants.

Si par contre, le fragment de code suivant était utilisé avec l'id de
'Sport'

::

    $this->Category->removeFromTree($id,true); 

L'arbre deviendrait

-  Mes Catégories

   -  Fun

      -  Surf
      -  Tricot extrême
      -  Skate

Ceci démontre l'usage alternatif de ``removeFromTree`` : les enfants ont
été ré-apparenté et 'Sport' a été supprimé.

reorder
-------

Cette méthode peut être utilisée pour trier hiérarchiquement les
données.

Intégrité des données
=====================

A cause de la nature des structures de données auto-référencées
complexes comme les arbres et les listes liées, elles peuvent devenir
occasionnellement corrompues par un appel imprudent. Courage, tout n'est
pas perdu ! Le comportement Tree contient plusieurs fonctionnalités
non-documentées auparavant, élaborées pour se sortir de telles
situations.

Ces fonctions qui peuvent vous épargner du temps sont :

recover(&$model, $mode = 'parent', $missingParentAction = null)

Le paramètre mode est utilisé pour spécifier la source de l'info qui est
valide/correcte. La source de données opposée sera remplie en fonction
de cette source d'info. Par ex : si les champs MPTT sont corrompus ou
vides, avec $mode 'parent' les valeurs du champ parent\_id seront
utilisées pour remplir les champs left et right. Le paramètre
missingParentAction s'applique uniquement au mode "parent" et détermine
que faire si le champ parent contient un id qui n'est pas présent.

reorder(&$model, $options = array())

Ré-ordonne les nœuds (et les nœuds enfants) de l'arbre en accord avec le
champ et la direction spécifiés dans les paramètres. Cette méthode ne
change le parent d'aucun nœud.

Le tableau options contient, par défaut, les valeurs 'id' => null,
'field' => $model->displayField, 'order' => 'ASC' et 'verify' => true.

verify(&$model)

Retourne vrai si l'arbre est valide, sinon un tableau composé de :
"type", "incorrect left/right index", "message".
