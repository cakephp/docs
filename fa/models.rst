Models
######

Models are the classes that sit as the business layer in your application.
This means that they should be responsible for managing almost everything
that happens regarding your data, its validity, interactions and evolution
of the information workflow in your domain of work.

Usually model classes represent data and are used in CakePHP applications
for data access, more specifically they represent a database table but they are
not limited to this, but can be used to access anything that manipulates data
such as files, external web services, iCal events, or rows in a CSV file.

A model can be associated with other models. For example, a Recipe
may be associated with the Author of the recipe as well as the
Ingredient in the recipe.

This section will explain what features of the model can be
automated, how to override those features, and what methods and
properties a model can have. It'll explain the different ways to
associate your data. It'll describe how to find, save, and delete
data. Finally, it'll look at Datasources.

Understanding Models
====================

A Model represents your data model. In object-oriented programming
a data model is an object that represents a "thing", like a car, a
person, or a house. A blog, for example, may have many blog posts
and each blog post may have many comments. The Blog, Post, and
Comment are all examples of models, each associated with another.

Here is a simple example of a model definition in CakePHP::

    <?php
    class Ingredient extends AppModel {
        public $name = 'Ingredient';
    }

With just this simple declaration, the Ingredient model is bestowed
with all the functionality you need to create queries along with
saving and deleting data. These magic methods come from CakePHP's
Model class by the magic of inheritance. The Ingredient model
extends the application model, AppModel, which extends CakePHP's
internal Model class. It is this core Model class that bestows the
functionality onto your Ingredient model.

This intermediate class, AppModel, is empty and if you haven't
created your own, is taken from within the CakePHP core folder. Overriding
the AppModel allows you to define functionality that should be made
available to all models within your application. To do so, you need
to create your own ``AppModel.php`` file that resides in the Model folder,
as all other models in your application. Creating a project using
:doc:`Bake <console-and-shells/code-generation-with-bake>` will automatically
generate this file for you.

See also :doc:`Behaviors <models/behaviors>` for more information on
how to apply similar logic to multiple models.

Back to our Ingredient model, in order to work on it, create the PHP file in the
``/app/Model/`` directory. By convention it should have the same name as the class;
for this example ``Ingredient.php``.

.. note::

    CakePHP will dynamically create a model object for you if it cannot
    find a corresponding file in /app/Model. This also means that if
    your model file isn't named correctly (i.e. ingredient.php or
    Ingredients.php) CakePHP will use an instance of AppModel rather
    than your missing (from CakePHP's perspective) model file. If
    you're trying to use a method you've defined in your model, or a
    behavior attached to your model and you're getting SQL errors that
    are the name of the method you're calling - it's a sure sign
    CakePHP can't find your model and you either need to check the file
    names, your application cache, or both.

.. note::

    Some class names are not usable for model names. For instance
    "File" cannot be used as "File" is a class already existing in the
    CakePHP core.


With your model defined, it can be accessed from within your
:doc:`Controller <controllers>`. CakePHP will automatically
make the model available for access when its name matches that of
the controller. For example, a controller named
IngredientsController will automatically initialize the Ingredient
model and attach it to the controller at ``$this->Ingredient``::

    <?php
    class IngredientsController extends AppController {
        function index() {
            //grab all ingredients and pass it to the view:
            $ingredients = $this->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }

Associated models are available through the main model. In the
following example, Recipe has an association with the Ingredient
model::

    <?php
    class Recipe extends AppModel {

        function steakRecipes() {
            $ingredient = $this->Ingredient->findByName('Steak');
            return $this->findAllByMainIngredient($ingredient['Ingredient']['id']);
        }
    }

This shows how to use models that are already linked. To understand how associations are
defined take a look at the :doc:`Associations section <models/associations-linking-models-together>`

More on models
==============

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
    :title lang=en: Models
    :keywords lang=en: information workflow,csv file,object oriented programming,model class,model classes,model definition,internal model,core model,simple declaration,application model,php class,database table,data model,data access,external web,inheritance,different ways,validity,functionality,queries