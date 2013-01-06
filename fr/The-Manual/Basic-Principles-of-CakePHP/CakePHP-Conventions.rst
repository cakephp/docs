Conventions CakePHP
###################

Nous sommes de grands fans des conventions plutôt que de la
configuration. Bien que cela réclame un peu de temps pour apprendre les
conventions de CakePHP, à terme vous gagnerez du temps : en suivant les
conventions, vous aurez des fonctionnalités automatiques et vous vous
libérerez du cauchemard de la maintenance par l'analyse des fichiers de
configuration. Les conventions sont aussi là pour créer un environnement
de développement uniforme, permettant à d'autres développeurs de
s'investir dans le code plus facilement.

Les conventions de CakePHP ont été crées à partir de nombreuses années
d'expérience dans le développement Web et de bonnes pratiques. Alors que
nous vous conseillons d'utiliser ces conventions lors de vos
développements CakePHP, nous devons mentionner que la plupart de ces
principes sont facilement contournables - ce qui est particulièrement
utile lorsque vous travaillez avec d'anciennes applications.

Conventions pour le nom des fichiers et des classes
===================================================

En général, les noms de fichiers sont composés avec le caractère
souligné (*underscore*), alors que les noms de classe sont *CamelCased*.
Donc si vous avez une classe **MaChouetteClasse**, alors dans Cake, le
fichier devrait être nommé **ma\_chouette\_classe.php**. Voici des
exemples de la manière dont on nomme les fichiers, pour chacun des
différents types de classes que vous utiliseriez habituellement dans une
application CakePHP :

-  La classe Contrôleur **ContrôleurGrosBisous** devrait se trouver dans
   un fichier nommé **gros\_bisous\_controller.php** (notez l'ajout de
   \_controller dans le nom du fichier)
-  La classe Composant (*Component*) **MonSuperComposant** devrait se
   trouver dans un fichier nommé **mon\_super.php**
-  La classe Modèle **ModeleValeurOption** devrait se trouver dans un
   fichier nommé **valeur\_option.php**
-  La classe Comportement (*Behavior*)
   **ComportementSpecialementFunkable** devrait se trouver dans un
   fichier nommé **specialement\_funkable.php**
-  La classe Vue **VueSuperSimple** devrait se trouver dans un fichier
   nommé **super\_simple.ctp**
-  La classe Assistant (*Helper*) **AssistantLeMeilleurQuiSoit** devrait
   se trouver dans un fichier nommé **le\_meilleur\_qui\_soit.php**

Chaque fichier serait située dans ou sous les répertoires appropriés
(qui peuvent être dans un sous-répertoire) de votre répertoire principal
App.

Conventions pour les Modèles
============================

Les noms de classe de modèle sont au singulier et *CamelCased*.
"Personne", "GrossePersonne" et "VraimentGrossePersonne" en sont des
exemples.

Les noms de tables correspondant aux modèles CakePHP sont au pluriel et
utilisent le caractère souligné (*underscore*). Les tables
correspondantes aux modèles mentionnés ci-dessus seront donc
respectivement : "personnes", "grosse\_personnes" et
"vraiment\_grosse\_personnes".

*Note des traducteurs francophones* : seul le dernier mot est au pluriel
et tous les pluriels français ne seront pas compris par CakePHP sans lui
indiquer précisément (par exemple cheval/chevaux). Voir pour cela le
chapitre sur les inflexions.

Pour vous assurer de la syntaxe des mots pluriels et singuliers, vous
pouvez utiliser la bibliothèque utilitaire "Inflector". Voir la
documentation sur `Inflector </fr/view/491/Inflector>`_ pour plus
d'informations.

Les noms des champs avec deux mots ou plus doivent être soulignés
(*underscore*) comme ici : nom\_de\_famille.

Les clés étrangères des relations *hasMany*, *belongsTo* ou *hasOne*
sont reconnues par défaut grâce au nom (singulier) de la table associée,
suivi de "\_id". Donc, si un "cuisinier *hasMany* cakes", la table
"cakes" se référera à un cuisinier de la table "cuisiniers" via une clé
étrangère "cuisinier\_id". Pour une table avec un nom de plusieurs mots
comme "type\_categorie", la clé étrangère sera "type\_categorie\_id".

Les tables de jointure utilisées dans les relations *hasAndBelongsToMany
(HABTM)* entre modèles devraient être nommées d'après le nom des tables
des modèles qu'elles unissent, dans l'ordre alphabétique
("pommes\_zebres" plutôt que "zebres\_pommes").

Toutes les tables avec lesquelles les modèles de CakePHP interagissent
(à l'exception des tables de jointure), nécessitent une clé primaire
simple pour identifier chaque ligne de manière unique. Si vous souhaitez
modéliser une table qui n'a pas de clé primaire sur un seul champ, comme
les lignes de votre table de jointure "posts\_tags", la convention de
CakePHP veut qu'une clé primaire sur un seul champs soit ajoutée à la
table.

CakePHP n'accepte pas les clés primaires composées. Dans l'éventualité
où vous voulez manipuler directement les données de votre table de
jointure, cela veut dire que vous devez soit utiliser les appels directs
à `query </fr/view/456/query>`_, soit ajouter une clé primaire pour être
en mesure d'agir sur elle comme un modèle normal. Exemple :

::

    CREATE TABLE posts_tags (
    id INT(10) NOT NULL AUTO_INCREMENT,
    post_id INT(10) NOT NULL, 
    tag_id INT(10) NOT NULL, 
    PRIMARY KEY(id));

Plutôt que d'utiliser une clé auto-incrémentée comme clé primaire, vous
pouvez aussi utiliser un champ char(36). Cake utilisera alors un uuid de
36 caractères (String::uuid) lorsque vous sauvegardez un nouvel
enregistrement en utilisant la méthode Model::save.

Conventions pour les Contrôleurs
================================

Les noms des classes de contrôleur sont au pluriel, CamelCased et se
terminent par 'Controller'. PersonnesController,
GrossePersonnesController et VraimentGrossePersonnesController sont des
exemples respectant cette convention.

La première fonction que vous écrivez pour un contrôleur devrait être
index(). Lorsqu'une requête adresse un contrôleur mais pas d'action, le
comportement par défaut de CakePHP est d'exécuter la fonction index() de
ce contrôleur. Ainsi, la requête http://www.exemple.com/pommes/ renvoie
à la fonction index() de PommesController, alors que
http://www.exemple.com/pommes/view renvoie vers la fonction view() de
PommesController.

Dans CakePHP, vous pouvez aussi changer la visibilité des fonctions d'un
contrôleur en préfixant le nom par des caractères soulignés. Si une
fonction d'un contrôleur a été préfixée avec un souligné, elle ne sera
pas visible sur le Web, via le répartiteur, mais elle sera disponible
pour un usage interne. Exemple :

::

    <?php
    class ActualitesController extends AppController {

        function dernieres() {
            $this->_chercherNouvellesActualites();
        }
        
        function _chercherNouvellesActualites() {
            //Logique de recherche des dernières actualités
        }
    }

    ?>

Alors que la page http://www.exemple.com/actualites/dernieres/ sera
accessible pour les utilisateurs, quelqu'un qui essayera cette page
http://www.exemple.com/actualites/\_chercherNouvellesActualites/ aura
une erreur, parce que cette méthode est précédée d'un souligné.

Considérations sur les URL pour les noms de Contrôleur
------------------------------------------------------

Comme vous venez juste de le voir, les noms de contrôleurs en un seul
mot se transforment facilement en un simple chemin d'URL en minuscule.
Par exemple, le contrôleur ``PommesController`` (qui devrait être défini
dans un fichier nommé 'pommes\_controller.php') est accédé par
http://exemple.com/\ **pommes**.

Plusieurs mots peuvent être dans des formes 'infléchies' équivalentes au
nom du contrôleur comme :

-  /pommesRouges
-  /PommesRouges
-  /Pommes\_rouges
-  /pommes\_rouges

qui résolveront tous l'index du contrôleur PommesRouges. Cependant, la
convention veut que vos urls soit en minuscule et *underscored*, ainsi
/pommes\_rouges/aller\_cueillir est la forme correcte pour accéder à
l'action de contrôleur ``PommesRougesController::aller_cueillir``.

Pour plus d'informations sur les URLs CakePHP et la gestion des
paramètres, lisez `Configuration des
Routes </fr/view/46/Configuration-des-Routes>`_.

Conventions pour les Vues
=========================

Les fichiers de gabarits de vue (*template*) sont nommés d'après les
fonctions du contrôleur qu'elles affichent, sous une forme "soulignée"
(*underscored*). La méthode soyezPret() de la classe PersonnesController
cherchera un gabarit de vue dans : /app/views/personnes/soyez\_pret.ctp

Le schéma classique est
"/app/views/contrôleur/nom\_de\_fonction\_avec\_underscore.ctp".

En utilisant les conventions CakePHP dans le nommage des différentes
parties de votre application, vous gagnerez des fonctionnalités sans les
tracas et les affres de la configuration. Voici un exemple récapitulant
les conventions abordées :

-  Nom de la table dans la base de données : "personnes"
-  Classe du Modèle : "Personne", trouvée dans /app/models/personne.php
-  Classe du Contrôleur : "PersonnesController", trouvée dans
   /app/controllers/personnes\_controller.php
-  Gabarit de la Vue : trouvé dans /app/views/personnes/index.ctp

En utilisant ces conventions, CakePHP sait qu'une requête à
http://exemple.com/personnes/ sera liée à un appel à la fonction index()
du Contrôleur PersonnesController, dans lequel le modèle Personne est
automatiquement disponible (et automatiquement lié à la table
'personnes' dans la base) et rendue dans un fichier. Aucune de ces
relations n'a été configurée par rien d'autre que la création des
classes et des fichiers dont vous aviez besoin de toutes façons.

Maintenant que vous avez été initié aux fondamentaux de CakePHP, vous
devriez essayer de dérouler le `tutoriel du Blog
CakePHP </fr/view/219/blog>`_ pour voir comment les choses s'articulent.
