Tree
####

.. php:class:: TreeBehavior()

C'est assez courant de vouloir stocker ses données sous une forme hiérarchique 
dans la table d'une base de données. Des exemples de tels besoins pourraient 
être des catégories avec un nombre illimité de sous-catégories, des données 
en relation avec un système de menu multi-niveaux ou une représentation 
littérale d'une hiérarchie, comme celle qui est utilisée pour stocker les 
objets de contrôle d'accès avec la logique ACL.

Pour de petits arbres de données et les cas où les données n'ont que quelques 
niveaux de profondeurs, c'est simple d'ajouter un champ parent_id à votre table 
et de l'utiliser pour savoir quel objet est le parent de quel autre. En natif 
avec CakePHP, il existe cependant un moyen puissant d'avoir les bénéfices de 
la logique MPTT 
`MPTT logic <http://www.sitepoint.com/hierarchical-data-database-2/>`, 
sans avoir à connaître les détails de l'implémentation technique - à moins que 
ça ne vous intéresse ;).

Pré-requis
==========

Pour utiliser le behavior en Arbre (TreeBehavior), votre table nécessite 3 
champs tels que listés ci-dessous (tous sont des entiers) :

- parent - le nom du champ par défaut est parent\_id, pour stocker l'id de 
  l'objet parent.
- left - le nom du champ par défaut est lft, pour stocker la valeur lft de 
  la ligne courante.
- right - le nom du champ par défaut est rght, pour stocker la valeur rght 
  de la ligne courante.

Si vous êtes familier de la logique MPTT vous pouvez vous demander pourquoi un 
champ parent existe - parce qu'il est tout bonnement plus facile d'effectuer 
certaines tâches à l'usage, si un lien parent direct est stocké en base, comme 
rechercher les enfants directs. 

.. note::

    Le champ ``parent`` doit être capable d'avoir une valeur NULL ! 
    Cela pourrait sembler fonctionner, si vous donnez juste une valeur parente 
    de zéro aux éléments de premier niveau, mais réordonner l'arbre (et sans 
    doute d'autres opérations) échouera.
   
Utilisation Basique
====================

Le behavior en arbre de données (Tree behavior) possède beaucoup 
de fonctionnalités, mais commençons avec un exemple simple. 
Créons la table suivante ::

    CREATE TABLE categories (
        id INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        parent_id INTEGER(10) DEFAULT NULL,
        lft INTEGER(10) DEFAULT NULL,
        rght INTEGER(10) DEFAULT NULL,
        name VARCHAR(255) DEFAULT '',
        PRIMARY KEY  (id)
    );
    
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(1, 'Mes catégories', NULL, 1, 30);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(2, 'Fun', 1, 2, 15);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(3, 'Sport', 2, 3, 8);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(4, 'Surf', 3, 4, 5);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(5, 'Tricot Extreme ', 3, 6, 7);
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

Dans le but de vérifier que tout est défini correctement, nous pouvons créer 
une méthode de test et afficher les contenus de notre arbre de catégories, 
pour voir à quoi il ressemble. Avec un simple controller ::

    class CategoriesController extends AppController {
        public $name = 'Categories';

        public function index() {
            $data = $this->Category->generateTreeList(null, null, null, '&nbsp;&nbsp;&nbsp;');
            debug($data); die;       
        }
    }

et une définition de model encore plus simple :::

    // app/Model/Category.php
    class Category extends AppModel {
        public $name = 'Category';
        public $actsAs = array('Tree');
    }

Nous pouvons vérifier à quoi ressemble les données de notre arbre 
de catégories, en visitant /categories. Vous devriez voir quelque chose comme :

-  Mes Catégories
   
   -  Fun
      
      -  Sport
         
         -  Surf
         -  Tricot Extreme

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
--------------------

Dans la section précédente, nous avons utilisé des données existentes 
et nous avons vérifié qu'elles semblaient hiérarchiques avec la méthode
``generateTreeList``. Toutefois vous devez ajouter vos données de
la même manière que vous le feriez pour n'importe quel model. Par exemple ::

    // pseudo controller code
    $data['Category']['parent_id'] =  3;
    $data['Category']['name'] =  'Faire du Skate';
    $this->Category->save($data);

Lorsque vous utilisez le behavior en arbre il n'est pas nécessaire
de faire plus que de définir l'id du parent (parent\_id), le behavior
tree prendra soin du reste.
Si vous ne définissez pas l'id du parent (parent\_id),
Le behavior Tree additionnera vos nouveaux ajouts au sommet de l'arbre::

    // pseudo code du controller 
    $data = array();
    $data['Category']['name'] =  'd\'autre catégories de gens';
    $this->Category->save($data);

En exécutant les extraits de code suivant devrait modifier l'arbre comme suit:

-  Mes Catégories

   -  Fun

      -  Sport

         -  Surf
         -  Tricot Extreme 
         -  Faire du Skate **Nouveau**

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



-  D'autre catégorie de gens **Nouveau**

Modification des données
---------------------------

La modification des données est aussi transparente que l'addition
des données. Si vous modifiez quelque chose, mais ne changez pas
le champ de l\'ID du parent (parent\_id) - la structure de vos données 
reste inchangée. Par exemple ::

    // pseudo controller code
    $this->Category->id = 5; // id du Tricot Extreme 
    $this->Category->save(array('name' => 'Pêche Extreme' ));

Le code ci-dessus n'affecterait pas le champ de l\'id du parent (parent\_id) - 
même si l\'id du parent (parent\_id) est incluse dans les données passées 
à sauvegarder si les données ne changent pas, pas plus que la structure de 
données. Donc l\'arbre de données devrait maintenant ressembler à:

-  Mes Catégories
   
   -  Fun
      
      -  Sport
         
         -  Surf
         -  Pêche Extreme **Mis a jour**
         -  Faire du Skate 

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

- D'autres catégories de gens

Déplacer les données autour de votre arbre est aussi une affaire simple.
Supposons que Pêche Extreme n'appartienne pas à Sport, mais devrait se 
trouver plutôt sous "D'autres catégories de gens". Avec le code suivant ::

    // pseudo code du controller
    $this->Category->id = 5; // id de Pêche Extreme
    $newParentId = $this->Category->field('id', array('name' => 'D\'autre catégorie de gens'));
    $this->Category->save(array('parent_id' => $newParentId));

Comme on pouvait s'y attendre, la structure serait modifiée comme suit:

-  Mes Catégorie
   
   -  Fun
      
      -  Sport
         
         -  Surf
         -  Faire du Skate 

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


- D'autres catégories de gens

   -  Pêche Extreme **Deplacé**


Effacement des données
----------------------

Le behavior Tree fournit un certain nombre de façons de gérer la suppression 
des données. Pour commencer par le plus simple exemple, disons que la
catégorie des rapports n'est plus utile. Pour l'enlever * et tous les enfants 
qu'il peut avoir * il suffit d'appeler et supprimer comme vous le feriez pour 
n'importe quel model. Par exemple, avec le code suivant ::

    // pseudo code du controller
    $this->Category->id = 10;
    $this->Category->delete();

L'arbre Catégorie serait modifiée comme suit:

-  Mes Catégories
   
   -  Fun
      
      -  Sport
         
         -  Surf
         -  Faire du Skate 

      -  Amis
         
         -  Gérard
         -  Gwendoline

      -  Travail
      
      -  Voyages
         
         -  National
         -  International


- D'autres catégories de gens

    -  Pêche Extreme
 

Interroger et utiliser vos données
----------------------------------

Utiliser et manipuler des données hiérarchisées peut s'avérer assez difficile. 
C'est pourquoi le behavior tree met à votre disposition quelques méthodes 
de permutations en plus des méthodes find de bases.

.. note::

    La plupart des méthodes de tree se basent et renvoient des données triées 
    en fonction du champ ``lft``. Si vous appelez ``find()`` sans trier en 
    fonction de ``lft``, ou si vous faites une demande de tri sur un tree, vous 
    risquez d'obtenir des résultats inattendus.

.. php:class:: TreeBehavior

    .. php:method:: children($id = null, $direct = false, $fields = null, $order = null, $limit = null, $page = 1, $recursive = null)
    
    :param $id: L'id de l'enregistrement à rechercher
    :param $direct: Defini à true pour ne retourner que les descendants directs
    :param $fields: Un simple champ texte ou  un tableau de champs à inclure 
      dans le retour
    :param $order: Chaine SQL des conditions ORDER BY 
    :param $limit: SQL LIMIT déclaration
    :param $page: pour accéder aux resultats paginés
    :param $recursive: Nombre de niveau de profondeur pour la recursivité des 
      models associés
    
    La méthode ``children`` prends la clé primaire (l\'id d'une ligne) et 
    retourne l'enfant (children), par défaut dans l'ordre d\'apparition dans 
    l'arbre. Le second paramètre optionnel definit si il faut ou non 
    retourner les enfants directs. En utilisant l'exemple des données 
    de la section précédente::
     
        $allChildren = $this->Category->children(1); // un tableau plat à 11 éléments
                // -- ou --
        $this->Category->id = 1;
        $allChildren = $this->Category->children(); // un tableau plat à 11 éléments

        // Ne retourne que les enfants directs
        $directChildren = $this->Category->children(1, true); // un tableau plat avec 2 éléments

    .. note::

        Si vous voulez un tableau recursif utilisez ``find('threaded')``

    .. php:method:: childCount($id = null, $direct = false)

    Comme avec la méthode ``children``, ``childCount`` prends la valeur 
    de la clé primaire (l\'id) d'une ligne et retourne combien d'enfant elle 
    contient.

    Le second paramêtre optionnel definit si il faut ou non compter 
    les enfants directs.En reprenant l\'exemple ci dessus ::
   
        $totalChildren = $this->Category->childCount(1); // retournera 11
        // -- or --
        $this->Category->id = 1;
        $directChildren = $this->Category->childCount(); //retournenra 11

        // Seulement les comptes des descendants directs de cette category
        $numChildren = $this->Category->childCount(1, true); // retournera 2

    .. php:method:: generateTreeList ($conditions=null, $keyPath=null, $valuePath=null, $spacer= '_', $recursive=null)

    :param $conditions: Utilise les mêmes conditions qu'un find().
    :param $keyPath: Chemin du champ à utiliser pour la clé.
    :param $valuePath: Chemin du champ à utiliser pour le label.
    :param $spacer: La chaîne à utiliser devant chaque élément pour indiquer la 
      profondeur.
    :param $recursive: Le nombre de niveaux de profondeur pour rechercher les 
      enregistrements associés

    Cette méthode retourne des données similaires à :ref: `model-find-list`, 
    avec un préfixe en retrait pour montrer la structure de vos données. Voici 
    un exemple de ce à quoi vous attendre comme retour avec cette méthode ::
    
      $treelist = $this->Category->generateTreeList();

    Sort::

      array(
          [1] =>  "Mes Catégories",
          [2] =>  "_Fun",
          [3] =>  "__Sport",
          [4] =>  "___Surf",
          [16] => "___Faire du Skate",
          [6] =>  "__Amis",
          [7] =>  "___Gérard",
          [8] =>  "___Gwendoline",
          [9] =>  "_Travail",
          [13] => "__Voyages",
          [14] => "___National",
          [15] => "___International",
          [17] => "D\'autre Catégorie de gens",
          [5] =>  "_Pêche extreme"
      )

    .. php:method:: getParentNode()

    Cette fonction comme son nom l'indique, donne en retour le noeud 
    parent d'un nœud, ou * false * si le noeud n'a pas de parent (c'est
    le nœud racine). Par exemple ::

        $parent = $this->Category->getParentNode(2); //<- id de fun
        // $parent contient toutes les catégories

    .. php:method:: getPath( $id = null, $fields = null, $recursive = null )

    Le 'path' (chemin) quand vous vous réferez à des données hiérarchiques, 
    c'est comment retrouver ou vous êtes depuis le sommet.
    Par exemple le path (chemin) de la catégorie "International" est:

    -  Mes  Catégories
 
        -  ...
        
        -  Travail
    
        -  Voyages
       
           -  ...
           
           -  International


    En utilisant l\'id d\'international' getPath retournera chacun des parents 
    rencontrés (depuis le haut)::
    
        $parents = $this->Category->getPath(15);

    ::

      // contenu de $parents
      array(
          [0] =>  array('Category' => array('id' => 1, 'name' => 'Mes Catégories', ..)),
          [1] =>  array('Category' => array('id' => 9, 'name' => 'Travail', ..)),
          [2] =>  array('Category' => array('id' => 13, 'name' => 'Voyages', ..)),
          [3] =>  array('Category' => array('id' => 15, 'name' => 'International', ..)),
      )

Utilisation avancée
===================

Le behavior Tree ne fonctionne pas uniquement en tâche de fond,
il y a un certain nombre de méthodes spécifiques dans le behavior Tree 
pour répondre a vos besoins de données hierarchiques, et des problèmes 
inattendus qui pourraient survenir durant le processus.

.. php:method:: moveDown()

Utilisé pour déplacer un seul nœud dans l'arbre. Vous devez fournir l\'
ID de l'élément à déplacer et un nombre positif de combien de
positions le noeud devrait être déplacé vers le bas. 
Tous les nœuds enfants pour le noeud spécifié seront également déplacés.

Voici l\'exemple d'une action d'un controller (dans un controller nommé 
Category) qui déplace un noeud spécifié vers le bas de l'arbre::
    

        public function movedown($id = null, $delta = null) {
            $this->Category->id = $id;
            if (!$this->Category->exists()) {
               throw new NotFoundException(__('Categorie Invalide'));
            }
            
            if ($delta > 0) {
                $this->Category->moveDown($this->Category->id, abs($delta));
            } else {
                $this->Session->setFlash('Merci de fournir de combien de positions vous souhaiteriez 
                le déplacer vers le bas.'); 
            }

            $this->redirect(array('action' => 'index'), null, true);
        }

Par exemple, si vous souhaitez déplacer le "Sport" (id de 3) d'une catégorie 
vers le bas, vous devriez requêter: /categories/movedown/3/1.
   
.. php:method:: moveUp()

Utilisé pour déplacer un seul nœud de l'arbre. Vous devez fournir l'ID
de l'élément à déplacer et un nombre positif de combien de positions le
noeud devrait être déplacé vers le haut. Tous les nœuds enfants seront 
également déplacés.

Voici un exemple d\'un controller action (dans un controller categories)
déplacant un noeud plus haut dans un arbre::

        public function moveup($id = null, $delta = null) {            
            $this->Category->id = $id;
            if (!$this->Category->exists()) {
               throw new NotFoundException(__('Catégorie invalide'));
            }
      
            if ($delta > 0) {
                $this->Category->moveUp($this->Category->id, abs($delta));
            } else {
                $this->Session->setFlash('Merci de fournir de combien de positions vous souhaiteriez le déplacer 
                vers le haut.'); 
            }

            $this->redirect(array('action' => 'index'), null, true);
        }

Par exemple , si vous souhaitez déplacer la catégory "Gwendoline" (id de 8) 
plus haut d'une position vous devriez requêter: /categories/moveup/8/1.
Maintenant l'ordre des Amis sera Gwendoline, Gérard.

.. php:method:: removeFromTree($id = null, $delete = false)

En utilisant cette méthode, un neud sera supprimée ou déplacée, tout en 
conservant son sous-arbre, qui sera apparenté à un niveau supérieur. 
Il offre plus de contrôle que: ref: `model-delete` qui, pour un model
en utilisant le behavior tree supprimera le noeud spécifié et tous
ses enfants.

Prenons l\'arbre suivant au début:

    -  Mes Catégories

       -  Fun

          -  Sport

             -  Surf
             -  Tricot Extreme         
             -  Skate

En executant le code suivant avec l\'id de 'Sport'::

        $this->Node->removeFromTree($id); 

Le noeud Sport sera retiré du haut du noeud:

      -  Mes Catégories

         -  Fun

             -  Surf
             -  Tricot Extreme
             -  Skate

      -  Sport **Déplacé**
    
Cela démontre le behavior par défaut du ``removeFromTree`` de
déplacement d'un noeud pour ne plus avoir de parent,et de re-parenter tous 
les enfants.

Si toutefois  l'extrait de code suivant était utilisé avec l\'id  'Sport'::

        $this->Node->removeFromTree($id, true); 

L'arbre deviendrait.

    -  Mes Catégories

       -  Fun

         -  Surf
         -  Tricot Extreme
         -  Skate

Ceci démontre l'utilisation alternative de ``removeFromTree``, les enfants 
ont été reparentés et 'Sport' a été effacé.

.. php:method:: reorder(array('id' => null, 'field' => $Model->displayField, 'order' => 'ASC', 'verify' => true))

Réordonne les nœuds (et nœuds enfants) de l'arbre en fonction du champ et de la 
direction spécifiée dans les paramètres. Cette méthode ne changera pas le 
parent d'un nœud.::

        $model->reorder(array(
            'id' => ,    //id de l\'enregistrement à utiliser comme noeud haut pour réordonner, default: $Model->id
            'field' => , //champ à utiliser pour réordonner, par défaut: $Model->displayField
            'order' => , //direction de l\'ordonnement, par défaut: 'ASC'
            'verify' =>  //vérifier ou pas l'arbre avant de réordonner, par défaut: true
        ));

    .. note::

    Si vous avez sauvegardé vos données ou fait d'autres opérations sur le 
    model, vous pouvez définir ``$model->id = null`` avant d'appeler 
    ``reorder``. Sinon, seul les enfants du nœud actuel et ses enfants 
    seront réordonnés.    

Intégrité des données
=====================

En raison de la nature complexe auto-référentielle de ces structures de 
<<<<<<< HEAD
données comme les arbres et les listes chaînées, elles peuvent parfois se 
=======
données comme les arbres et listes chaînées, elles peuvent parfois se 
>>>>>>> 5648f19a0bcbc77e37bb6dc66d6ea78e3d9f33ff
rompre par un appel négligent. Rassurez-vous, tout n'est pas perdu! Le behavior 
Tree contient plusieurs fonctionnalités précédemment non-documentées destinées 
à se remettre de telles situations.
    
.. php:method:: recover($mode = 'parent', $missingParentAction = null)

Le parmètre ``mode`` est utilisé pour spécifier la source de l'info qui est
correcte. La source opposée de données sera peuplée en fonction de cette source 
d'information. Ex: si le champ MPTT est corrompu ou vide, avec le 
``$mode 'parent'`` la valeur du champ ``parent_id`` sera utilisée pour peupler 
les champs gauche et droite.

Le paramètre ``missingParentAction`` s'applique uniquement aux
"parent" mode et détermine ce qu'il faut faire si le champ parent
contient un identifiant qui n'est pas présent.


Options ``$mode`` permises:

-  ``'parent'`` - utilise l'actuel``parent_id``pour mettre à jour les champs 
   ``lft`` and ``rght``.
-  ``'tree'`` - utilise  les champs actuels ``lft``et``rght``pour mettre à jour 
   le champ ``parent_id``

Les options de ``missingParentActions`` autorisées durant l\'utilisation de
``mode='parent'``:

-  ``null`` - ne fait rien et continue
-  ``'return'`` - ne fait rien et fait un return
-  ``'delete'`` - efface le noeud
-  ``int`` - definit parent\_id à cet id

Exemple::

        // Reconstruit tous les champs gauche et droit en se basant sur parent_id
        $this->Category->recover();
        // ou
        $this->Category->recover('parent');

        // Reconstruit tous les parent_id en se basant sur les champs lft et rght
        $this->Category->recover('tree');
        
.. php:method:: reorder($options = array())

Réordonne les nœuds (et nœuds enfants) de l'arbre en fonction du
champ et de la direction spécifiés dans les paramètres. Cette méthode ne
change pas le parent d'un nœud.
    
La réorganisation affecte tous les nœuds dans l'arborescence par défaut, mais 
les options suivantes peuvent influer sur le processus:

-  ``'id'`` - ne réordonne que les noeuds sous ce noeud.
-  ``'field``' - champ à utiliser pour le tri, par défaut le ``displayField`` du model.
-  ``'order'`` - ``'ASC'`` pour tri ascendant, ``'DESC'`` pour tri descendant.
-  ``'verify'`` - avec ou sans vérification avant tri.

``$options`` est utilisé pour passer tous les paramètres supplémentaires, et 
les clés suivantes par défaut, toutes sont facultatives::
     
        array(
            'id' => null,
            'field' => $model->displayField,
            'order' => 'ASC',
            'verify' => true
        )

.. php:method:: verify()

Retourne ``True`` si l'arbre est valide sinon un tableau d'erreurs,
avec des champs pour le type, l'index, et le message d'erreur.

Chaque enregistrement dans le tableau de sortie est un tableau de la forme 
(type, id,message)

-  ``type`` est soit ``'index'`` ou ``'node'``
-  ``'id'`` est l\'id du noeud erroné.
-  ``'message'`` dépend de l'erreur rencontrée

Exemple d'utilisation::

        $this->Category->verify();

Exemple de sortie::

        Array
        (
            [0] => Array
                (
                    [0] => node
                    [1] => 3
                    [2] => left and right values identical
                )
            [1] => Array
                (
                    [0] => node
                    [1] => 2
                    [2] => The parent node 999 doesn't exist
                )
            [10] => Array
                (
                    [0] => index
                    [1] => 123
                    [2] => missing
                )
            [99] => Array
                (
                    [0] => node
                    [1] => 163
                    [2] => left greater than right
                )

        )


.. meta::
    :title lang=fr: Tree
    :keywords lang=fr: auto increment,représentation littérale,parent id,table catégories,table base de données,données hiérarchisées,valeur null,système de menu,intricacies,contrôle accès,hiérarchie,logique,élements,trees, arbres
