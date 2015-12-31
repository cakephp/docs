Conventions de CakePHP
######################

Nous sommes de grands fans des conventions plutôt que de la configuration.
Bien que cela réclame un peu de temps pour apprendre les conventions de
CakePHP, à terme vous gagnerez du temps : en suivant les conventions,
vous aurez des fonctionnalités automatiques et vous vous libérerez du
cauchemar de la maintenance par l'analyse des fichiers de configuration.
Les conventions sont aussi là pour créer un environnement de développement
uniforme, permettant à d'autres développeurs de s'investir dans le code
plus facilement.

Les conventions de CakePHP ont été créées à partir de nombreuses années
d'expérience dans le développement Web et de bonnes pratiques. Alors
que nous vous conseillons d'utiliser ces conventions lors de vos
développements CakePHP, nous devons mentionner que la plupart de ces
principes sont facilement contournables - ce qui est particulièrement
utile lorsque vous travaillez avec d'anciennes applications.

Les conventions des Controllers
===============================

Les noms des classes de controller sont au pluriel, CamelCased et
se terminent par ``Controller``. ``PeopleController`` et
``LatestArticlesController`` sont des exemples respectant cette convention.

La première méthode que vous écrivez pour un controller devrait être
``index()``. Lorsqu'une requête pointe vers un controller sans action, le
comportement par défaut de CakePHP est d'exécuter la fonction ``index()``
de ce controller. Ainsi, la requête http://www.exemple.com/apples/ renvoie
à la fonction ``index()`` de ``ApplesController``, alors que
http://www.exemple.com/apples/view renvoie vers la fonction ``view()`` de
``ApplesController``.

Vous pouvez aussi changer la visibilité des méthodes des controllers
dans CakePHP en préfixant les noms de méthode des controllers avec des
underscores. Si une méthode du controller a été préfixée avec un
underscore, la méthode ne sera pas accessible directement à partir du web
mais est disponible pour une utilisation interne. Par exemple::

    class NewsController extends AppController {

        public function latest() {
            $this->_findNewArticles();
        }

        protected function _findNewArticles() {
            // Logique pour trouver les derniers articles de nouvelles
        }
    }


Alors que la page http://www.exemple.com/news/latest/ est accessible
pour l'utilisateur comme d'habitude, quelqu'un qui essaie d'aller sur la page
http://www.example.com/news/\_findNewArticles/ aura une erreur,
car la méthode est précédée d'un underscore. Vous pouvez aussi utiliser les
mots-clés de visibilité de PHP pour indiquer si la méthode peut ou non être
accessible à partir d'une URL. Les méthodes non-publiques ne sont pas
accessibles.

Considérations URL pour les noms de Controller
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Comme vous venez de voir, un controller à mot unique renvoie facilement vers
un chemin URL en minuscules. Par exemple, ``ApplesController`` (qui serait
défini dans le nom de fichier 'ApplesController.php') est accessible à
l'adresse http://exemple.com/apples.

Les controllers à multiples mots *peuvent* être de forme 'inflecté' qui
correspondent au nom du controller:

-  /redApples
-  /RedApples
-  /Red\_apples
-  /red\_apples

iront tous vers l'index du controller RedApples. Cependant,
la convention est que vos URLs soient en minuscules et avec des underscores,
c'est pourquoi /red\_apples/go\_pick est la forme correcte pour
accéder à l'action ``RedApplesController::go_pick``.

Pour plus d'informations sur les URLs de CakePHP et la gestion des paramètres,
allez voir :ref:`routes-configuration`.

.. _file-and-classname-conventions:

Conventions des Fichiers et des Noms de Classe
==============================================

En général, les noms de fichiers correspondent aux noms des classes
c'est-à-dire en CamelCase. Donc si vous avez
une classe **MaChouetteClasse**, alors dans Cake, le fichier devra être nommé
**MaChouetteClasse.php**. Voici des exemples de la manière dont on nomme les
fichiers, pour chacun des différents types de classes que vous utiliseriez
habituellement dans une application CakePHP :

-  La classe controller **BisousEtCalinsController** devra se trouver dans un
   fichier nommé **BisousEtCalinsController.php**.
-  La classe Component (Composant) **MonSuperComponent** devra se trouver dans
   un fichier nommé **MonSuperComponent.php**.
-  La classe Model **ValeurOption** devra se trouver dans un fichier
   nommé **ValeurOption.php**.
-  La classe Behavior (Comportement) **SpecialementFunkableBehavior** devra
   se trouver dans un fichier nommé **SpecialementFunkableBehavior.php**.
-  La classe View (Vue) **SuperSimpleView** devra se trouver dans un fichier
   nommé **SuperSimpleView.ctp**.
-  La classe Helper (Assistant) **LeMeilleurQuiSoitHelper** devra se trouver
   dans un fichier nommé **LeMeilleurQuiSoitHelper.php**.

Chaque fichier sera situé dans le répertoire approprié dans votre dossier app.

Conventions pour les Models et les Sources de données
=====================================================

Les noms de classe de model sont au singulier et en CamelCase. Person,
BigPerson et ReallyBigPerson en sont des exemples.

Les noms de tables correspondant aux models CakePHP sont au pluriel et
utilisent le caractère souligné (underscore). Les tables correspondantes
aux models mentionnés ci-dessus seront donc respectivement : ``people``,
``big_people``, et ``really_big_people``.

Note des traducteurs francophones : seul le dernier mot est au pluriel et
tous les pluriels français ne seront pas compris par CakePHP sans lui indiquer
précisément (par exemple cheval/chevaux). Voir pour cela le chapitre sur les
inflexions.

Pour vous assurer de la syntaxe des mots pluriels et singuliers, vous pouvez
utiliser la bibliothèque utilitaire :php:class:`Inflector`. Voir la
documentation sur :doc:`/core-utility-libraries/inflector` pour plus
d'informations.

Les noms des champs avec deux mots ou plus doivent être avec des underscores
comme ici : first\_name.

Les clés étrangères des relations hasMany, belongsTo ou hasOne sont reconnues
par défaut grâce au nom (singulier) du model associé, suivi de \_id. Donc,
si un Cuisinier hasMany Cake, la table "cakes" se référera à un cuisinier de la
table cuisiniers via une clé étrangère cuisinier\_id. Pour une table avec
un nom de plusieurs mots comme "type\_categories", la clé étrangère sera
type\_categorie\_id.

Les tables de jointure utilisées dans les relations hasAndBelongsToMany
(HABTM) entre models doivent être nommées d'après le nom des tables des
models qu'elles unissent, par ex des users qui sont liés par une relation HABTM
avec des groups seraient joints par une table groups_users et ces noms doivent
être dans l'ordre alphabétique ("pommes\_zebres" plutôt que "zebres\_pommes").

Toutes les tables avec lesquelles les models de CakePHP interagissent (à
l'exception des tables de jointure), nécessitent une clé primaire simple pour
identifier chaque ligne de manière unique. Si vous souhaitez modéliser une
table qui n'a pas de clé primaire sur un seul champ, la convention de CakePHP
veut qu'une clé primaire sur un seul champ soit ajoutée à la table.

Si le nom de la clé primaire n'est pas ``id``, vous devez définir l'attribut
``Model.primaryKey``.

CakePHP n'accepte pas les clés primaires composées. Dans l'éventualité où vous
voulez manipuler directement les données de votre table de jointure, cela veut
dire que vous devez soit utiliser les appels directs à
:ref:`query <model-query>`, soit ajouter une clé primaire pour être en mesure
d'agir sur elle comme un model normal. Exemple::

    CREATE TABLE posts_tags (
        id INT(10) NOT NULL AUTO_INCREMENT,
        post_id INT(10) NOT NULL,
        tag_id INT(10) NOT NULL,
        PRIMARY KEY(id
    );

Plutôt que d'utiliser une clé auto-incrémentée comme clé primaire, vous pouvez
aussi utiliser un champ char(36). CakePHP utilisera alors un UUID de 36
caractères (String::uuid) lorsque vous sauvegardez un nouvel enregistrement en
utilisant la méthode Model::save.

Conventions des vues
====================

Les fichiers de vue sont nommés d'après les fonctions
du controller qu'elles affichent, sous une forme avec underscores.
La fonction soyezPret() de la classe PersonnesController cherchera un gabarit
de vue dans : /app/View/Personnes/soyez\_pret.ctp.

Le schéma classique est
/app/View/Controller/nom\_de\_fonction\_avec\_underscore.ctp.

En utilisant les conventions CakePHP dans le nommage des différentes parties
de votre application, vous gagnerez des fonctionnalités sans les tracas et les
affres de la configuration. Voici un exemple récapitulant les conventions
abordées:

- Nom de la table dans la base de données : "personnes"
- Classe du Model : "Personne", se trouvant dans /app/Model/Personne.php
- Classe du Controller : "PersonnesController", se trouvant dans
  /app/Controller/PersonnesController.php
- Template de Vue : se trouve dans /app/View/Personnes/index.ctp

En utilisant ces conventions, CakePHP sait qu'une requête de type
http://exemple.com/personnes/ sera liée à un appel à la fonction index() du
Controller PersonnesController, dans lequel le model Personne est
automatiquement disponible (et automatiquement lié à la table 'personnes'
dans la base) et rendue dans un fichier. Aucune de ces relations n'a été
configurée par rien d'autre que la création des classes et des fichiers dont
vous aviez besoin de toute façon.

Maintenant que vous avez été initié aux fondamentaux de CakePHP, vous devriez
essayer de dérouler le tutoriel du Blog CakePHP
:doc:`/tutorials-and-examples/blog/blog` pour voir comment les choses
s'articulent.


.. meta::
    :title lang=fr: Conventions de CakePHP
    :keywords lang=fr: expérience de développement web,maintenance cauchemard,méthode index,systèmes légaux,noms de méthode,classe php,système uniforme,fichiers de config,tenets,pommes,conventions,controller conventionel,bonnes pratiques,maps,visibilité,nouveaux articles,fonctionnalité,logique,cakephp,développeurs
