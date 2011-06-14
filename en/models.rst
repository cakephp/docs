Models
######

Models represent data and are used in CakePHP applications for data
access. A model usually represents a database table but can be used
to access anything that stores data such as files, LDAP records,
iCal events, or rows in a CSV file.

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

Here is a simple example of a model definition in CakePHP:

::

    <?php
    
    class Ingredient extends AppModel {
        var $name = 'Ingredient';
    }
    
    ?>

With just this simple declaration, the Ingredient model is bestowed
with all the functionality you need to create queries along with
saving and deleting data. These magic methods come from CakePHP's
Model class by the magic of inheritance. The Ingredient model
extends the application model, AppModel, which extends CakePHP's
internal Model class. It is this core Model class that bestows the
functionality onto your Ingredient model.

This intermediate class, AppModel, is empty and if you haven't
created your own is taken from within the /cake/ folder. Overriding
the AppModel allows you to define functionality that should be made
available to all models within your application. To do so, you need
to create your own app\_model.php file that resides in the root of
the /app/ folder. Creating a project using
:doc:`Bake <console-and-shells/code-generation-with-bake>` will automatically
generate this file for you.

Create your model PHP file in the /app/models/ directory or in a
subdirectory of /app/models. CakePHP will find it anywhere in the
directory. By convention it should have the same name as the class;
for this example ingredient.php.

.. note::

    CakePHP will dynamically create a model object for you if it cannot
    find a corresponding file in /app/models. This also means that if
    your model file isn't named correctly (i.e. Ingredient.php or
    ingredients.php) CakePHP will use a instance of AppModel rather
    than your missing (from CakePHP's perspective) model file. If
    you're trying to use a method you've defined in your model, or a
    behavior attached to your model and you're getting SQL errors that
    are the name of the method you're calling - it's a sure sign
    CakePHP can't find your model and you either need to check the file
    names, clear your tmp files, or both.

See also :doc:`Behaviors <models/behaviors>` for more information on
how to apply similar logic to multiple models.

With your model defined, it can be accessed from within your
:doc:`Controller <controllers>`. CakePHP will automatically
make the model available for access when its name matches that of
the controller. For example, a controller named
IngredientsController will automatically initialize the Ingredient
model and attach it to the controller at ``$this->Ingredient``.

::

    <?php
    class IngredientsController extends AppController {
        function index() {
            //grab all ingredients and pass it to the view:
            $ingredients = $this->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }
    
    ?>

Associated models are available through the main model. In the
following example, Recipe has an association with the Ingredient
model.

::

    <?php
    class RecipesController extends AppController {
        function index() {
            $ingredients = $this->Recipe->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }
    ?>

If models have absolutely NO association between them, you can use
Controller::loadModel() to get the model.

::

    <?php
    class RecipesController extends AppController {
        function index() {
           $recipes = $this->Recipe->find('all');
           
           $this->loadModel('Car');
           $cars = $this->Car->find('all');
           
           $this->set(compact('recipes', 'cars'));
        }
    }
    ?>

.. note::

    Some class names are not usable for model names. For instance
    "File" cannot be used as "File" is a class already existing in the
    CakePHP core.


More on models
==============

.. toctree::

    models/data-validation
    models/retrieving-your-data
    models/saving-your-data
    models/deleting-data
    models/associations-linking-models-together
    models/callback-methods
    models/model-attributes
    models/additional-methods-and-properties
    models/virtual-fields
    models/transactions
    models/behaviors
    models/datasources