Modèles
#######

Les Modèles sont les classes qui représentent la couche de logique dans votre 
application. Cela signifie qu'ils sont responsables de la gestion de presque 
tout ce qui concerne les données, leur validité, les interactions et 
l'évolution du flux d'informations dans votre domaine de travail.

Habituellement, les classes de modèle représentent les données et sont 
utilisées dans les applications CakePHP pour l'accès aux données, plus 
spécifiquement elles représentent une table de la base de données, mais elles 
ne sont pas limitées à cela et peuvent être utilisées pour accéder à tout ce 
qui manipule des données comme des fichiers, des services web externes, des 
évènements iCal ou des lignes dans un fichier CSV.

Un modèle peut être associé avec d'autres modèles. Par exemple, une Recette 
peut être associé avec l'Auteur de la recette ainsi qu'à l'Ingredient dans 
la recette.

Cette section vous expliquera quelles fonctionnalités du modèle peuvent 
être automatisées, comment outrepasser ces fonctionnalités, et quelles 
méthodes et propriétés un modèle peut avoir. Elle expliquera les différentes 
façons d'associer vos données. Elle décrira comment trouver, sauvegarder, 
et effacer des données. Au final, elle s'interessera aux sources de données.

Comprendre les Modèles
======================

Un Modèle est à la fois votre modèle de données. En programmation orientée 
objet, un objet qui représente une "chose", comme une voiture, une personne 
ou une maison. Un blog, par exemple, peut avoir plusieurs posts et chaque 
post peut avoir plusieurs commentaires. Blog, Post et Commentaire sont tous 
des exemples de modèles, chacun étant associé avec un autre.

Voici un simple exemple de définition de modèle dans CakePHP ::

    <?php
    class Ingredient extends AppModel {
        public $name = 'Ingredient';
    }

Avec juste cette simple déclaration, le modèle Ingredient est doté de toutes 
les fonctionnalités dont vous avez besoin pour créer des requêtes, ainsi que 
sauvegarder et supprimer des données. Ces méthodes magiques proviennent de la 
classe Model de CakePHP, grâce à la magie de l'héritage. Le modèle Ingredient 
étend le modèle de l'application AppModel, lequel étend la classe Model interne 
de CakePHP. C'est cette classe Model du cœur qui fournit les fonctionnalités à 
l'intérieur de votre modèle Ingredient.

La classe intermédiaire AppModel est vide et si vous n'avez pas créé la vôtre, 
elle provient du répertoire du coeur de cakePHP. Ecraser AppModel vous permet 
de définir des fonctionnalités qui doivent être rendues disponibles pour tous 
les modèles de votre application. Pour faire cela, vous avez besoin de créer 
votre propre fichier ``AppModel.php`` qui se loge dans le dossier Model, comme 
tous les autres modèles dans votre application. A la création d'un projet en 
utilisant :doc:`Bake <console-and-shells/code-generation-with-bake>`, ce 
fichier sera automatiquement créé pour vous.

Voir aussi :doc:`Behaviors <models/behaviors>` pour plus d'informations sur la 
façon d'appliquer la même logique pour de multiples modèles.

Retournons à notre modèle Ingredient, pour que cela fonctionne, créez le 
fichier PHP dans le repertoire ``/app/Model/``. Par convention, il devra avoir 
le même nom que la classe; pour cet exemple ``Ingredient.php``.

.. note::

    CakePHP créera dynamiquement un objet modèle pour vous si il ne peut 
    pas trouver un fichier correspondant dans /app/Model. Cela veut également 
    dire que si votre fichier de modèle n'est pas nommé correctement (ex : 
    ingredient.php ou ingredients.php) CakePHP utilisera une instance de 
    AppModel, plutôt que votre fichier de modèle "manquant" (d'un point de 
    vue CakePHP). Si vous essayez d'utiliser une méthode que vous avez définie 
    dans votre modèle ou dans un comportement attaché à votre modèle et que 
    vous obtenez des erreurs SQL qui indiquent le nom de la méthode que vous 
    appelez, c'est une indication certaine que CakePHP ne peut pas trouver 
    votre modèle et que vous devez, soit vérifier les noms de fichier, soit 
    nettoyer les fichiers temporaires ou les deux.

.. note::

    Certains noms de classe ne sont pas utilisables pour les noms de modèle.
    Par exemple, "File" ne peut pas être utilisé puisque "File" est une classe 
    existant déjà dans le coeur de CakePHP.

Une fois votre modèle défini, il peut être accédé depuis vos 
:doc:`Contrôleurs <controllers>`. CakePHP rend automatiquement un modèle 
disponible en accès, dès lors que son nom valide celui du contrôleur. Par 
exemple, un contrôleur nommé IngredientsController initialisera 
automatiquement le modèle Ingredient et y accédera par ``$this->Ingredient``::

    <?php
    class IngredientsController extends AppController {
        public function index() {
            // Récupère tous les ingrédients et les transmet à la vue :
            $ingredients = $this->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }

Les modèles associés sont accessibles à travers le modèle principal. Dans 
l'exemple suivant, Recette a une association avec le modèle Ingredient::

    <?php
    class Recette extends AppModel {

        public function steakRecipes() {
            $ingredient = $this->Ingredient->findByName('Steak');
            return $this->findAllByMainIngredient($ingredient['Ingredient']['id']);
        }
    }

Cela montre comment utiliser les modèles qui sont déjà liés. Pour comprendre 
comment les associations sont définies, allez voir la 
:doc:`Section des associations <models/associations-linking-models-together>`.

Pour en savoir plus sur les modèles
===================================

.. toctree::

    models/associations-linking-models-together
    models/retrieving-your-data
    models/saving-your-data
    models/deleting-data
    models/data-validation
    models/callback-methods
    models/behaviors
    models/datasources
    models/model-attributes
    models/additional-methods-and-properties
    models/virtual-fields
    models/transactions


.. meta::
    :title lang=fr: Modèles
    :keywords lang=fr: flux d'informations,fichier csv,programmation orientée objet,classe de modèle,classes de modèle,définition de modèle,modèle interne,modèle du coeur,déclaration simple,modèle application,classe php,table de base de données,modèle de données,accès aux données,web externe,héritage,différentes façons,validité,fonctionnalité,requêtes
