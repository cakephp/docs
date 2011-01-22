3.5 Controllers
---------------

Introduction
~~~~~~~~~~~~

A controller is used to manage the logic for a part of your
application. Most commonly, controllers are used to manage the
logic for a single model. For example, if you were building a site
for an online bakery, you might have a RecipesController and a
IngredientsController managing your recipes and their ingredients.
In CakePHP, controllers are named after the model they handle, in
plural form.

The Recipe model is handled by the RecipesController, the Product
model is handled by the ProductsController, and so on.

Your application's controllers are classes that extend the CakePHP
AppController class, which in turn extends a core Controller class,
which are part of the CakePHP library. The AppController class can
be defined in /app/app\_controller.php and it should contain
methods that are shared between all of your application’s
controllers.

Controllers can include any number of methods which are usually
referred to as *actions*. Actions are controller methods used to
display views. An action is a single method of a controller.

CakePHP’s dispatcher calls actions when an incoming request matches
a URL to a controller’s action (refer to
:doc:`/developing-with-cakephp/configuration/routes-configuration` for an
explanation on how controller actions and parameters are mapped
from the URL).

Returning to our online bakery example, our RecipesController might
contain the ``view()``, ``share()``, and ``search()`` actions. The
controller would be found in
/app/controllers/recipes\_controller.php and contain:

::

        <?php
        
        # /app/controllers/recipes_controller.php
    
        class RecipesController extends AppController {
            function view($id)     {
                //action logic goes here..
            }
    
            function share($customer_id, $recipe_id) {
                //action logic goes here..
            }
    
            function search($query) {
                //action logic goes here..
            }
        }
    
        ?>

In order for you to use a controller effectively in your own
application, we’ll cover some of the core attributes and methods
provided by CakePHP’s controllers.
