Console Shell
#############

The ConsoleShell is an interactive tool for testing parts of your application.
It's useful for doing quick finds, and creates in your application,  
as well as Router testing and debugging.

Model Manipulation
==================
To get a list of you models available::

    > models
    
    - User
    - Comment
    - Post

To test model results, use the name of your model without a leading $

    Post->find("all")
    User->find("first", array('conditions' => array('User.id' => 1)))

To dynamically set associations, you can do the following: ``ModelA bind <association> ModelB``

    User bind hasMany Comment
    Comment bind belongsTo User
    
To dynamically remove associations you can do the following: ``ModelA unbind <association> ModelB``

    User unbind hasMany Comment
    Comment unbind belongsTo User

Supported associations are ``hasOne``, ``hasMany``, ``belongsTo``, ``hasAndBelongsToMany``.

To save a new field in a model, you can do the following: where you are passing a hash of data to be saved in the format ``field => value`` pairs

    Post->save(array('Post.body' => 'CakePHP is Awesome'))

You can also retrieve schema inforamation about any model by running ``ModelA columns``
which returns a list of columns and their type.

    Post columns
    
        id: integer
        body: text
        created: datetime
        modified: datetime
        is_active: boolean


Router Testing
==============
To test URLs against your app's route configuration run ``Route <url>`` where ``<url>``
is the url you want to parse and see where it would be routed to in your application.

    Route /posts/view/1
    
       array(
          'controller' => 'posts',
          'action' => 'view',
          'named => array(),
          'pass' => array(
          	0 => '1'
          ),
          'plugin' => NULL
        )

To reload your routes config (Config/routes.php), do the following::

    Routes reload

To show all connected routes, do the following::

    Routes show
    
    [/::controller/::action/*] => array(
       [plugin] => 
       [action] => index
    )

To exit the shell type ``exit``

   exit


.. meta::
    :title lang=en: Console Shell
    :keywords lang=en: record style,style reference,console,database tables,model,router,shell,databases