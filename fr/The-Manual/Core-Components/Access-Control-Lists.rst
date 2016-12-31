Listes de Contrôle d'Accès (ACL)
################################

La fonctionnalité de listes de contrôle d'accès (*Access Control List,
ACL*) de CakePHP est l'une des plus souvent discutée, probablement parce
qu'elle est la plus recherchée, mais aussi parce qu'elle peut-être la
plus déroutante. Si vous recherchez une bonne façon de débuter avec les
ACLs en général, lisez ce qui suit.

Soyez courageux et persévérant avec ce sujet, même si au départ cela
paraît difficile. Une fois que vous aurez pris le coup, ce sera un outil
extrêmement puissant, à garder sous la main quand vous développez votre
application.

Comprendre comment les ACL fonctionnent
=======================================

Les choses puissantes requièrent un contrôle d'accès. Les listes de
contrôles d'accès sont une façon de gérer les permissions d'une
application d'une manière très précise et pourtant facilement
maintenable et manipulable.

Les listes de contrôles d'accès, ou ACL (*Access Control Lists*),
manipulent deux choses principales : les choses qui veulent accéder à
des trucs et celles qui sont recherchées. Dans le jargon ACL, les choses
qui veulent accéder à des trucs (le plus souvent les utilisateurs) sont
appelées *access request objects* (objets requête d'accès) ou AROs. Les
choses du système qui sont recherchées (le plus souvent les actions ou
les données) sont appelées *access control objects* (objets contrôle
d'accès) ou ACOs. Les entités sont appelées "objets", parce que parfois,
l'objet demandé n'est pas une personne - des fois, vous pourriez vouloir
limiter l'accès à certains contrôleurs de Cake qui doivent initier leur
logique dans d'autres parties de votre application. Les ACOs pourraient
être n'importe quoi que vous voudriez contrôler, d'une action de
contrôleur à un service Web, en passant par une case de l'agenda en
ligne de votre Mamy.

Rappel :

-  ACO - Objet Contrôle d'Accès - Quelque chose qui est recherchée
-  ARO - Objet Requête d'Accès - Quelque chose qui veut quelque chose

Généralement, les ACL sont utilisées pour décider quand un ARO peut
obtenir l'accès à un ACO.

Afin de vous aider à comprendre comment toutes les choses travaillent
ensemble, utilisons un exemple semi-fonctionnel. Imaginons un moment, un
ordinateur utilisé par un célèbre groupe d'aventuriers tirés du roman
fantastique le *Seigneur des Anneaux*. Le chef du groupe, Gandalf, veut
gérer les biens du groupe, tout en maintenant un bon niveau de
confidentialité et de sécurité entre les autres membres de l'équipe. La
première chose dont il a besoin est de créer une liste d'AROs qui
comprend :

-  Gandalf
-  Aragorn
-  Bilbo
-  Frodo
-  Gollum
-  Legolas
-  Gimli
-  Pippin
-  Merry

Comprenez que l'ACL n'est *pas* la même chose que l'authentification.
L'ACL est ce qui vient *après* qu'un utilisateur ait été authentifié.
Par contre, les deux sont habituellement utilisés de paire, il est
important de faire la distinction entre savoir qui est quelqu'un
(authentification) et savoir ce qu'il peut faire (ACL).

La chose suivante que Gandalf doit faire, c'est de créer une liste
initiale des choses, ou ACOs, que le système va contrôler. Sa liste
devrait ressembler à quelque chose comme ça :

-  Les armes
-  L'Anneau
-  Le porc salé
-  La diplomatie
-  La bière

Traditionnellement, les systèmes étaient gérés en utilisant une sorte de
matrice, qui présentait un ensemble basique d'utilisateurs et de
permissions en relation avec les objets. Si ces informations étaient
stockées dans un tableau, il ressemblerait à ça :

Les armes

L'Anneau

Le porc salé

La diplomatie

La bière

Gandalf

Autorisé

Autorisé

Autorisé

Aragorn

Autorisé

Autorisé

Autorisé

Autorisé

Bilbo

Autorisé

Frodo

Autorisé

Autorisé

Gollum

Autorisé

Legolas

Autorisé

Autorisé

Autorisé

Autorisé

Gimli

Autorisé

Autorisé

Pippin

Autorisé

Autorisé

Merry

Autorisé

A première vue, il semble que ce système pourrait très bien fonctionner.
Les affectations peuvent être mises en place à des fin de sécurité (seul
Frodo peut accéder à l'Anneau) et pour éviter les accidents (en gardant
les hobbits à distance du porc salé et des armes). Cela paraît
suffisamment complet et assez facile à lire, n'est-ce pas ?

Pour un petit système comme celui-ci, peut-être qu'une configuration en
matrice pourrait fonctionner. Mais pour un système évolutif ou un
système avec un fort pourcentage de ressources (ACOs) et d'utilisateurs
(AROs), un tableau peut devenir plus lourd que rapide. Imaginez une
tentative de contrôler l'accès à des centaines de camps militaires et de
gérer cela par unité. Un autre inconvénient des matrices est que vous ne
pouvez par vraiment regrouper logiquement des sections d'utilisateurs ou
faire des changements de permissions en cascade, pour des groupes
d'utilisateurs basés sur ces regroupements logiques. Par exemple, il
serait certainement plus chouette d'autoriser automatiquement les
hobbits à accéder à la bière et au porc une fois que le combat est fini
: faire ça sur une base d'utilisateurs gérés individuellement pourrait
être fastidieux et source d'erreur. Faire des changements de permissions
en cascade pour tous les "hobbits" serait plus facile.

Les ACL sont très souvent implémentés dans une structure en arbre. Il y
a généralement un arbre d'AROs et un arbre d'ACOs. En organisant vos
objets en arbres, les permissions peuvent toujours être distribuées
d'une façon granulaire, tout en maintenant encore une bonne cohérence de
l'ensemble. En chef raisonnable qu'il est, Gandalf choisit d'utiliser
l'ACL dans son nouveau système et d'organiser ses objets de la manière
suivante :

-  La Communauté de l'Anneau™

   -  Les Guerriers

      -  Aragorn
      -  Legolas
      -  Gimli

   -  Les Magiciens

      -  Gandalf

   -  Les Hobbits

      -  Frodo
      -  Bilbo
      -  Merry
      -  Pippin

   -  Les Visiteurs

      -  Gollum

L'utilisation d'une structure en arbre pour les AROs permet à Gandalf,
de définir en une fois des autorisations qui s'appliquent à un groupe
entier d'utilisateurs. Ainsi, en utilisant notre arbre ARO, Gandalf peut
ajouter, après coup, quelques permissions de groupe :

-  La Communauté de l'Anneau
   (**Refuser** : tout)

   -  Guerriers
      (**Autoriser** : Armes, Bière, Rations pour les Elfes, Porc salé)

      -  Aragorn
      -  Legolas
      -  Gimli

   -  Magiciens
      (**Autoriser** : Porc salé, Diplomatie, Bière)

      -  Gandalf

   -  Hobbits
      (**Autoriser** : Bière)

      -  Frodo
      -  Bilbo
      -  Merry
      -  Pippin

   -  Visiteurs
      (**Autoriser** : Porc salé)

      -  Gollum

Si nous voulions utiliser les ACL pour voir si Pippin était autorisé à
accéder à la bière, nous devrions d'abord récupérer son chemin dans
l'arbre, lequel est Communauté->Hobbits->Pippin. Ensuite nous verrions
les différentes permissions qui résident à chacun de ces points et nous
utiliserions la plus spécifique des permissions reliant Pippin et la
bière.

+-----------------------------+---------------------------------+----------------------------------+
| Nœud de l'ARO               | Information sur la permission   | Résultat                         |
+=============================+=================================+==================================+
| La Communauté de l'Anneau   | Refuse tout                     | Refuser l'accès à la bière.      |
+-----------------------------+---------------------------------+----------------------------------+
| Les Hobbits                 | Autorise la bière               | Autoriser l'accès à la bière !   |
+-----------------------------+---------------------------------+----------------------------------+
| Pippin                      | --                              | Toujours autoriser la bière !    |
+-----------------------------+---------------------------------+----------------------------------+

Puisque le nœud "Pippin" dans l'arbre d'ACL ne refuse pas spécifiquement
l'accès à l'ACO bière, le résultat final est que nous donnons l'accès à
cet ACO.

L'arbre nous permet aussi de faire des ajustements plus fins pour un
meilleur contrôle granulaire, tout en conservant encore la capacité de
faire de grands changements pour les groupes d'AROs :

-  Communauté de l'Anneau
   (**Refuser** : tout)

   -  Guerriers
      (**Autoriser** : Armes, Bière, Rations pour les Elfes, Porc salé)

      -  Aragorn
         (Autoriser : Diplomatie)
      -  Legolas
      -  Gimli

   -  Magiciens
      (**Autoriser** : Porc salé, Diplomatie, Bière)

      -  Gandalf

   -  Hobbits
      (**Autoriser** : Bière)

      -  Frodo
         (Autoriser : Anneau)
      -  Bilbo
      -  Merry
         (Refuser : Bière)
      -  Pippin
         (Autoriser : Diplomatie)

   -  Visiteurs
      (**Autoriser** : Porc salé)

      -  Gollum

Cette approche nous donne plus de possibilités pour faire des
changements de permissions de grande ampleur, mais aussi des ajustements
plus précis. Cela nous permet de dire que tous les hobbits peuvent
accéder à la bière, avec une exception — Merry. Pour voir si Merry peut
accéder à la bière, nous aurions trouvé son chemin dans l'arbre :
Communauté->Hobbits->Merry et appliqué notre principe, en gardant une
trace des permissions liées à la bière :

+--------------------------+---------------------------------+----------------------------------+
| Nœud de l'ARO            | Information sur la permission   | Résultat                         |
+==========================+=================================+==================================+
| Communauté de l'Anneau   | Refuse tout                     | Refuser l'accès à la bière.      |
+--------------------------+---------------------------------+----------------------------------+
| Hobbits                  | Autorise la bière               | Autoriser l'accès à la bière !   |
+--------------------------+---------------------------------+----------------------------------+
| Merry                    | Refuse la bière                 | Refuser la bière                 |
+--------------------------+---------------------------------+----------------------------------+

Définir les permissions : ACL de Cake basées sur des fichiers INI
=================================================================

La première implémentation d'ACL sur Cake était basée sur des fichiers
INI stockés dans l'installation de Cake. Bien qu'elle soit stable et
pratique, nous recommandons d'utiliser plutôt les solutions d'ACL basées
sur les bases de données, surtout pour leur capacité à créer de nouveaux
ACOs et AROs à la volée. Nous recommandons son utilisation dans de
simples applications - et spécialement pour ceux qui ont une raison plus
ou moins particulière de ne pas vouloir utiliser une base de données.

Par défaut, les ACL de CakePHP sont gérés par les bases de données. Pour
activer les ACL basés sur les fichiers INI, vous devez dire à CakePHP
quel système vous utilisé en mettant à jour les lignes suivantes dans
app/config/core.php

::

    // Changer ces lignes :
    Configure::write('Acl.classname', 'DbAcl');
    Configure::write('Acl.database', 'default');

    // Pour qu'elles ressemblent à çà :
      Configure::write('Acl.classname', 'IniAcl');
    //Configure::write('Acl.database', 'default');

Les permissions des ARO/ACO sont spécifiées dans
**/app/config/acl.ini.php**. L'idée de base est que les AROs qui sont
spécifiés dans une section INI qui a trois propriétés : *groups*,
*allow* et *deny*.

-  *groups* : nom du groupe dont l'ARO est membre.
-  *allow* : nom des ACOs auxquels l'ARO a accès.
-  *deny* : nom des ACOs auxquels l'ARO ne devrait pas avoir accès.

Les ACOs sont spécifiés dans des sections INI qui incluent seulement les
propriétés *allow* et *deny*.

Par exemple, voyons à quoi la structure ARO de la Communauté que nous
avions façonnée pourrait ressembler dans une syntaxe INI :

::

    ;-------------------------------------
    ; Les AROs
    ;-------------------------------------
    [aragorn]
    groups = guerriers
    allow = diplomatie

    [legolas]
    groups = guerriers

    [gimli]
    groups = guerriers

    [gandalf]
    groups = magiciens

    [frodo]
    groups = hobbits
    allow = anneau

    [bilbo]
    groups = hobbits

    [merry]
    groups = hobbits
    deny = biere

    [pippin]
    groups = hobbits

    [gollum]
    groups = visiteurs

    ;-------------------------------------
    ; Groupe de l'ARO
    ;-------------------------------------
    [guerriers]
    allow = armes, biere, porc_sale

    [magiciens]
    allow = porc_sale, diplomatie, biere

    [hobbits]
    allow = biere

    [visiteurs]
    allow = porc_sale

Maintenant que vous avez défini vos permissions, vous pouvez passer à
`la section sur la vérification des
permissions </fr/view/471/checking-permissions-the-acl-c>`_ utilisant le
composant ACL.

Définir les permissions : ACL de Cake via une base de données
=============================================================

Maintenant que nous avons vu les permissions ACL basées sur les fichiers
INI, voyons les ACL via une base de données (les plus communément
utilisées).

Pour commencer :
----------------

L'implémentation pas défaut des permissions ACL est propulsé par les
bases de données. La base de données Cake pour les ACL est composé d'un
ensemble de modèles du cœur et d'une application en mode console qui
sont créés lors de votre installation de Cake. Les modèles sont utilisés
par Cake pour interagir avec votre base de données, afin de stocker et
de retrouver les nœuds sous forme d'arbre. L'application en mode console
est utilisée pour initialiser votre base de données et interagir avec
vos arbres d'ACO et d'ARO.

Pour commencer, vous devrez d'abord être sûr que votre
``/app/config/database.php`` soit présent et correctement configuré.
Voir la section 4.1 pour plus d'information sur la configuration d'une
base de données.

Une fois que vous l'avez fait, utilisez la console de CakePHP pour créer
vos tables d'ACL :

::

    $ cake schema create DbAcl

Lancer cette commande va supprimer et recréer les tables nécessaires au
stockage des informations des ACO et des ARO sous forme d'arbre. La
sortie console devrait ressembler à quelque chose comme ça :

::

    ---------------------------------------------------------------
    Cake Schema Shell
    ---------------------------------------------------------------

    The following tables will be dropped.
    acos
    aros
    aros_acos

    Are you sure you want to drop the tables? (y/n) 
    [n] > y
    Dropping tables.
    acos updated.
    aros updated.
    aros_acos updated.

    The following tables will be created.
    acos
    aros
    aros_acos

    Are you sure you want to create the tables? (y/n) 
    [y] > y
    Creating tables.
    acos updated.
    aros updated.
    aros_acos updated.
    End create.

Ceci remplace une commande désuète et dépréciée, "initdb".

Vous pouvez aussi vous servir du fichier SQL que vous trouverez dans
``app/config/sql/db_acl.sql``, mais ça sera moins sympa.

Quand ce sera fini, vous devriez avoir trois nouvelles tables dans votre
système de base de données : acos, aros et aros\_acos (la table de
jointure pour créer les permissions entre les deux arbres).

Si vous êtes curieux de connaitre la façon dont Cake stocke
l'information de l'arbre dans ces tables, étudiez l'arbre transversal
sur la base de données modifiée. Le composant ACL utilise `le
comportement en arbre </fr/view/91/tree-behavior>`_ de CakePHP pour
gérer les héritages d'arbres. Les fichiers de modèle de classe pour ACL
sont compilés dans un seul fichier
`db\_acl.php <https://api.cakephp.org/file/cake/libs/model/db_acl.php>`_.

Maintenant que nous avons tout configuré, attelons-nous à la création de
quelques arbres ARO et ACO.

Créer des Objet Contrôle d'Accès (ACOs) et des Objet Requête d'Accès (AROs)
---------------------------------------------------------------------------

Pour la création de nouveaux objets (ACOs et AROs), il y a deux
principales façons de nommer et d'accéder aux noeuds. La *première*
méthode est de lier un objet ACL directement à un enregistrement dans
votre base de données en spécifiant le nom du modèle et la clé
étrangère. La *seconde* méthode peut être utilisée quand un objet n'est
pas en relation directe avec un enregistrement de votre base de données
- vous pouvez fournir un alias textuel pour l'objet.

Généralement, quand vous créez un groupe ou un objet de niveau
supérieur, nous recommandons d'utiliser un alias. Si vous gérez l'accès
à un enregistrement ou à un article particulier de la base de données,
nous recommandons d'utiliser la méthode du modèle/clé étrangère.

Vous voulez créer de nouveaux objets ACL en utilisant le modèle ACL du
coeur de CalePHP. Pour ce faire, il y a un nombre de champs que vous
aurez à utiliser pour enregistrer les données : ``model``,
``foreign_key``, ``alias``, et ``parent_id``.

Les champs ``model`` et ``foreign_key`` pour un objet ACL vous
permettent de créer un lien entre les objets qui correspondent à
l'enregistrement du modèle (s'il en est). Par exemple, un certain nombre
d'AROs correspondraient aux enregistrement User de la base de données.
Il faut configurer la ``foreign_key`` pour que l'ID du User vous
permette de lier les informations de l'ARO et de User avec un seul appel
find() au modèle User avec la bonne association. Réciproquement, si vous
voulez gérer les opérations d'édition sur un article spécifique d'un
blog ou d'une liste de recette, vous devez choisir de lier un ACO à cet
enregistrement spécifique du modèle.

L'``alias`` d'un objet ACL est un simple label lisible pour un humain
que vous pouvez utiliser pour identifier un objet ACL qui n'est pas en
relation directe avec un enregistrement d'un modèle. Les alias sont
couramment utilisés pour nommer les groupes d'utilisateurs ou les
collections d'ACOs.

Le ``parent_id`` d'un objet ACL vous permet de remplir la structure de
l'arbre. Il fournit l'ID du noeud parent dans l'arbre pour créer un
nouvel enfant.

Avant que vous ne puissiez créer de nouveaux objets ACL, nous devront
charger leurs classes respectives. La façon la plus facile de le faire
et d'inclure les composants ACL de Cake dans votre tableau $composents
du contrôleur :

::

    var $components = array('Acl');

Quand ce sera fait, nous verrons quelques exemples de création de ces
objets. Le code suivant pourrait être placé quelque part dans l'action
d'un contrôleur :

Tant que les exemples que nous voyons ici nous montrent la création
d'ARO, les mêmes techniques pourront être utilisées pour la création
d'un arbre d'ACO.

Pour rester dans notre configuration de Communauté, nous allons d'abord
créer nos groups d'ARO. De fait que nos groupes n'ont pas réellement
d'enregistrements spécifiques qui leurs soient reliés, nous allons
utiliser les alias pour créer ces objets ACL. Ce que nous faisons ici
est en perspective d'une action du contrôleur mais pourrait être fait
ailleurs. Ce que nous allons aborder ici est un peu une approche
artificielle, mais vous devriez trouver ces techniques plus confortables
à utiliser pour créer des ARIs et des ACOs à la volée.

Ce ne devrait rien avoir de radicalement nouveau - nous sommes justes
entrain d'utiliser les modèles pour enregistrer les données comme nous
le faisons toujours :

::

    function touteslesActions()
    {
        $aro =& $this->Acl->Aro;
        
        //Ici ce sont toutes les informations sur le tableau de notre groupe que nous  
            //pouvons itérer comme ceci
              
            $groups = array(
            0 => array(
                'alias' => 'guerriers'
            ),
            1 => array(
                'alias' => 'magiciens'
            ),
            2 => array(
                'alias' => 'hobbits'
            ),
            3 => array(
                'alias' => 'visiteurs'
            ),
        );
        
        //Faisons une itération et créons les groupes d'ARO
        foreach($groups as $data)
        {
            //Pensez à faire un appel à create() au moment d'enregistrer dans       
                    //la boucle...

            $aro->create();
            
            //Enregistrement des données
            $aro->save($data);
        }

        //Les autres actions logiques seront à placer ici...
    }

Une fois que nous avons cela, nous pouvons utiliser la consile
d'application ACL pour vérifier la structure de l'arbre.

::

    $ cake acl view aro

    Arbre d'Aro :
    ---------------------------------------------------------------
      [1]guerriers

      [2]magiciens

      [3]hobbits

      [4]visiteurs

    ---------------------------------------------------------------

Je suppose qu'il n'y en a pas beaucoup dans l'arbre à ce niveau, mais au
minimum quelques vérifications que nous avons faites aux quatres noeuds
de niveaux supérieurs. Ajoutons quelques enfants à ces noeuds ARO en
ajoutant nos AROs utilisateurs dans ces groupes. Tous les bons citoyens
de la Terre du Milieu ont un accompte dans notre nouveau système, nous
allons alors lier les enregistrements d'ARO aux enregistrements
spécifiques du modèle de notre base de données.

Quand nous ajouterons un noeud enfant à un arbre, nous devrons nous
assurer d'utiliser les ID des noeuds ACL, plutôt que d'utiliser la
valeur de la foreign\_key (clé étrangère).

::

    function anyAction()
    {
        $aro = new Aro();
        
        //Ici nous avons les enregistrement de nos utilisateurs prêts à être liés aux
            //nouveaux enregistrements d'ARO. Ces données peuvent venir d'un modèle et 
            //modifiées, mais nous utiliserons des tableaux statiques pour les besoins de la
            //démonstration.
        
        
        $users = array(
            0 => array(
                'alias' => 'Aragorn',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 2356,
            ),
            1 => array(
                'alias' => 'Legolas',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 6342,
            ),
            2 => array(
                'alias' => 'Gimli',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 1564,
            ),
            3 => array(
                'alias' => 'Gandalf',
                'parent_id' => 2,
                'model' => 'User',
                'foreign_key' => 7419,
            ),
            4 => array(
                'alias' => 'Frodo',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 7451,
            ),
            5 => array(
                'alias' => 'Bilbo',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 5126,
            ),
            6 => array(
                'alias' => 'Merry',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 5144,
            ),
            7 => array(
                'alias' => 'Pippin',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 1211,
            ),
            8 => array(
                'alias' => 'Gollum',
                'parent_id' => 4,
                'model' => 'User',
                'foreign_key' => 1337,
            ),
        );
        
        //Faisons une itération et créons les AROs (comme des enfants)
        foreach($users as $data)
        {
            //Pensez à faire un appel à create() au moment d'enregistrer dans       
                    //la boucle...
            $aro->create();

            //Enregistrement des données
            $aro->save($data);
        }
        
        //Les autres actions logiques se trouveront ici ...
    }

Typiquement vous n'aurez pas à fournir et un alias, et un
modèle/clé\_étrangère, mais nous les utiliserons ici pour faire une
structure d'arbre plus facile à lire pour les besoins de la
démonstrations.

La sortie console de cette commande peut maintenant nous intéresser un
peu plus. Nous allons faire un essai :

::

    $ cake acl view aro

    Arbre d'Aro:
    ---------------------------------------------------------------
      [1]guerriers

        [5]Aragorn

        [6]Legolas

        [7]Gimli

      [2]magiciens

        [8]Gandalf

      [3]hobbits

        [9]Frodo

        [10]Bilbo

        [11]Merry

        [12]Pippin

      [4]visiteurs

        [13]Gollum

    ---------------------------------------------------------------

Maintenant que nous avons notre arbre d'ARO configuré proprement,
revenons sur une possible approche de structure d'arbre d'ACO. Tant que
nous pouvons structurer plus que par une représentation abstraite que
celle de nos ACO, il est parfois plus pratique de modéliser un arbre ACO
après que la configuration faite par le Contrôleur/Action de Cake. Nous
avons cinq principaux objets à manipuler dans le scénario de la
Communauté, pour la configuration naturelle de ce dernier dans une
application Cake est un groupe de modèles, et enfin pour les contrôleurs
qui le manipulent. A côté des contrôleurs eux-mêmes, nous allon vouloir
contrôler l'accès à des actions spécifiques de ces contrôleurs.

Basés sur cette idée, nous allons configurer un arbre d'ACO qui va
imiter une configuration d'application Cake. Depuis nos cinq ACOs, nous
allons créer un arbre d'ACO qui devra ressembler à ça :

-  Armes
-  Anneaux
-  MorceauxPorc
-  EffortsDiplomatiques
-  Bières

Une bonne chose concernant la configuration des ACL et que chaque ACO va
automatiquement contenir quatre propriétés relatives aux actions CRUD
(créer, lire, mettre à jour et supprimer). Vous pouvez créer des noeuds
fils sous chacun de ces cinq principaux ACOs, mais l'utilisation des
actions de management intégrées à Cake permet d'aborder les opérations
basiques de CRUD sur un objet donné. Gardez à l'esprit qu'il faudra
faire vos arbres d'ACO plus petits et plus faciles à maintenir. Nous
allons voir comment ils sont utilisés plus tard quand nous parlerons de
comment assigner les permissions.

Nous sommes maintenant des pro de l'ajout d'AROs et de l'utilisation des
techniques de création d'arbres d'ACO. La création de groupes d'un
niveau supérieur utilise le modèle Aco du coeur.

Assigner les Permissions
------------------------

Après la création de nos ACOs et AROs, nous pouvons finalement assigner
des permissions entre les deux groupes. Ceci est réalisé en utilisant le
composant Acl du cœur de CakePHP. Continuons avec notre exemple.

Ici nous travaillerons dans un contexte d'une action de contrôleur. Nous
faisons cela parce que les permissions sont managées par le composant
Acl.

::

    class ChosesController extends AppController
    {
        // Vous pourriez placer çà dans AppController
    ,
        // mais cela fonctionne bien ici aussi.

        var $components = array('Acl');

    }

Configurons quelques permissions de base, en utilisant le Composant Acl
dans une action à l'intérieur de ce contrôleur.

::

    function index()
    {
        //Autorise un accès complet aux armes pour les guerriers
        //Ces exemples utilisent tous deux la syntaxe avec un alias
        $this->Acl->allow('guerriers', 'Armes');
        
        //Encore que le Roi pourrait ne pas vouloir laisser n'importe qui
        //disposer d'un accès sans limites
        $this->Acl->deny('guerriers/Legolas', 'Armes', 'delete');
        $this->Acl->deny('guerriers/Gimli',   'Armes', 'delete');
        
        die(print_r('done', 1));
    }

Le premier appel que nous faisons au composant Acl donne, à tout
utilisateur appartenant au groupe ARO 'guerriers', un accès total à tout
ce qui appartient au groupe ACO 'Armes'. Ici nous adressons simplement
les ACOs et AROs d'après leurs alias.

Avez-vous noté l'usage du troisième paramètre ? C'est là où nous
utilisons ces actions bien pratiques qui sont intégrées à tous les ACOs
de Cake. Les options par défaut pour ce paramètre sont ``create``,
``read``, ``update`` et ``delete``, mais vous pouvez ajouter une colonne
dans la table ``aros_acos`` de la base de données (préfixée avec \_ -
par exemple ``_admin``) et l'utiliser en parallèle de celles par défaut.

Le second ensemble d'appels est une tentative de prendre une décision un
peu plus précise sur les permissions. Nous voulons qu'Aragorn conserve
ses privilèges de plein accès, mais nous refusons aux autres guerriers
du groupe, la capacité de supprimer les enregistrements de la table
Armes. Nous utilisons la syntaxe avec un alias pour adresser les AROs
ci-dessus, mais vous pourriez utiliser votre propre syntaxe modèle/clé
étrangère. Ce que nous avons ci-dessus est équivalent à ceci :

::

    // 6342 = Legolas
    // 1564 = Gimli

    $this->Acl->deny(array('model' => 'Utilisateur', 'foreign_key' => 6342), 'Armes', 'delete');
    $this->Acl->deny(array('model' => 'Utilisateur', 'foreign_key' => 1564), 'Armes', 'delete');

L'adressage d'un nœud en utilisant la syntaxe avec un alias, nécessite
une chaîne délimitée par des slashs
('/utilisateurs/salaries/developpeurs'). L'adressage d'un nœud en
utilisant la syntaxe modèle/clé étrangère nécessite un tableau avec deux
paramètres : ``array('model' => 'Utilisateur', 'foreign_key' => 8282)``.

La prochaine section nous aidera à valider notre configuration, en
utilisant le composant Acl pour contrôler les permissions que nous
venons de définir.

Vérification des Permissions : le Composant ACL
-----------------------------------------------

Utilisons le Composant Acl pour s'assurer que les nains et les elfes ne
peuvent déplacer des choses depuis l'armurerie. Maintenant, nous
devrions être en mesure d'utiliser le Composant Acl, pour faire une
vérification entre les ACOs et les AROs que nous avons créés. La syntaxe
de base pour faire une vérification des permissions est :

::

    $this->Acl->check( $aro, $aco, $action = '*');

Faisons un essai dans une action de contrôleur :

::

    function index()
    {
        // Tout cela renvoie "true"
        $this->Acl->check('guerriers/Aragorn', 'Armes');
        $this->Acl->check('guerriers/Aragorn', 'Armes', 'create');
        $this->Acl->check('guerriers/Aragorn', 'Armes', 'read');
        $this->Acl->check('guerriers/Aragorn', 'Armes', 'update');
        $this->Acl->check('guerriers/Aragorn', 'Armes', 'delete');
        
        // Souvenez-vous, nous pouvons utiliser la syntaxe modèle/clé étrangère
        // pour nos AROs utilisateur
        $this->Acl->check(array('model' => 'User', 'foreign_key' => 2356), 'Armes');
        
        // Ceci retourne "true" également :
        $result = $this->Acl->check('guerriers/Legolas', 'Armes', 'create');
        $result = $this->Acl->check('guerriers/Gimli', 'Armes', 'read');
        
        // Mais ceci retourne "false" :
        $result = $this->Acl->check('guerriers/Legolas', 'Armes', 'delete');
        $result = $this->Acl->check('guerriers/Gimli', 'Armes', 'delete');
    }

L'usage fait ici est démonstratif, mais vous pouvez sans doute voir
comment une telle vérification peut être utilisée, pour décider à quel
moment autoriser, ou pas, quelque chose à se produire, pour afficher un
message d'erreur ou rediriger l'utilisateur vers un login.
