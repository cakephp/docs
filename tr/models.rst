Models
######

Models are the classes that form the business layer in your application.
They should be responsible for managing almost everything
regarding your data, its validity, and its interactions, as well as the evolution
of the information workflow in your domain.

Usually, model classes represent data and are used in CakePHP applications
for data access. They generally represent a database table but can be used 
to access anything that manipulates data
such as files, external web services, or iCal events.

A model can be associated with other models. For example, a Recipe
may be associated with an Author as well as an Ingredient.

This section will explain what features of the model can be
automated, how to override those features, and what methods and
properties a model can have. It will explain the different ways to
build associations for your data. It will describe how to find, save, and delete
data. Finally, it will look at Datasources.

Understanding Models
====================

A Model represents your data model. In object-oriented programming,
a data model is an object that represents a thing such as a car, a
person, or a house. A blog, for example, may have many blog posts
and each blog post may have many comments. The Blog, Post, and
Comment are all examples of models, each associated with another.

Here is a simple example of a model definition in CakePHP::

    App::uses('AppModel', 'Model');
    class Ingredient extends AppModel {
        public $name = 'Ingredient';
    }

With just this simple declaration, the Ingredient model is endowed
with all the functionality you need to create queries and to
save and delete data. These methods come from CakePHP's
Model class by the magic of inheritance. The Ingredient model
extends the application model, AppModel, which in turn extends CakePHP's
internal Model class. It is this core Model class that bestows the
functionality onto your Ingredient model. ``App::uses('AppModel', 'Model')``
ensures that the model is loaded when it is needed.

The intermediate class, AppModel, is empty. If you haven't
created your own, it is taken from the CakePHP core folder. Overriding
the AppModel allows you to define functionality that should be made
available to all models within your application. To do so, you need
to create your own ``AppModel.php`` file that resides in the Model folder,
as do all other models in your application. Creating a project using
:doc:`Bake <console-and-shells/code-generation-with-bake>` will automatically
generate this file for you.

See also :doc:`Behaviors <models/behaviors>` for more information on
how to apply similar logic to multiple models.

Back to our Ingredient model. In order to work on it, create the PHP file in the
``/app/Model/`` directory. By convention, it should have the same name as the class,
which for this example will be ``Ingredient.php``.

.. note::

    CakePHP will dynamically create a model object for you if it cannot
    find a corresponding file in /app/Model. This also means that if
    your model file isn't named correctly (for instance, if it is named 
    ingredient.php or Ingredients.php rather than Ingredient.php), 
    CakePHP will use an instance of AppModel rather
    than your model file (which CakePHP assumes is missing). If
    you're trying to use a method you've defined in your model, or a
    behavior attached to your model, and you're getting SQL errors that
    are the name of the method you're calling, it's a sure sign that
    CakePHP can't find your model and you need to check the file
    names, your application cache, or both.

.. note::

    Some class names are not usable for model names. For instance,
    "File" cannot be used, since "File" is a class that already exists in the
    CakePHP core.


When your model is defined, it can be accessed from within your
:doc:`Controller <controllers>`. CakePHP will automatically
make the model available for access when its name matches that of
the controller. For example, a controller named
IngredientsController will automatically initialize the Ingredient
model and attach it to the controller at ``$this->Ingredient``::

    class IngredientsController extends AppController {
        public function index() {
            //grab all ingredients and pass it to the view:
            $ingredients = $this->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }

Associated models are available through the main model. In the
following example, Recipe has an association with the Ingredient
model::

    class Recipe extends AppModel {

        public function steakRecipes() {
            $ingredient = $this->Ingredient->findByName('Steak');
            return $this->findAllByMainIngredient($ingredient['Ingredient']['id']);
        }
    }

This shows how to use models that are already linked. To understand how associations are
defined, take a look at the :doc:`Associations section <models/associations-linking-models-together>`

More on models
==============

.. toctree::
    :maxdepth: 1

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
    :title lang=en: Models
    :keywords lang=en: information workflow,csv file,object oriented programming,model class,model classes,model definition,internal model,core model,simple declaration,application model,php class,database table,data model,data access,external web,inheritance,different ways,validity,functionality,queries
