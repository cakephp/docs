Interactive Console (REPL)
##########################

The CakePHP app skeleton comes with a built in REPL(Read Eval Print Loop) that
makes it easy to explore some CakePHP and your application in an interactive
console. You can start the interactive console using::

    $ Console/cake console

This will bootstrap your application and start an interactive console. At this
point you can interact with your application code and execute queries using your
application's models::

    $ Console/cake console

    Welcome to CakePHP v3.0.0 Console
    ---------------------------------------------------------------
    App : App
    Path: /Users/mark/projects/cakephp-app/App/
    ---------------------------------------------------------------
    [1] app > $articles = Cake\ORM\TableRegistry::get('Articles');
    // object(Cake\ORM\Table)(
    //
    // )
    [2] app > $articles->find();

