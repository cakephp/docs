Interactive Console (REPL)
##########################

The CakePHP app skeleton comes with a built in REPL(Read Eval Print Loop) that
makes it easy to explore some CakePHP and your application in an interactive
console. You can start the interactive console using::

    $ bin/cake console

This will bootstrap your application and start an interactive console. At this
point you can interact with your application code and execute queries using your
application's models::

    $ bin/cake console

    Welcome to CakePHP v3.0.0 Console
    ---------------------------------------------------------------
    App : App
    Path: /Users/mark/projects/cakephp-app/src/
    ---------------------------------------------------------------
    >>> $articles = Cake\ORM\TableRegistry::get('Articles');
    // object(Cake\ORM\Table)(
    //
    // )
    >>> $articles->find()->all();

Since your application has been bootstrapped you can also test routing using the
REPL::

    >>> Cake\Routing\Router::parse('/articles/view/1');
    // [
    //   'controller' => 'Articles',
    //   'action' => 'view',
    //   'pass' => [
    //     0 => '1'
    //   ],
    //   'plugin' => NULL
    // ]

You can also test generating URL's::

    >>> Cake\Routing\Router::url(['controller' => 'Articles', 'action' => 'edit', 99]);
    // '/articles/edit/99'

To quit the REPL you can use ``CTRL-C`` or by typing ``exit``.
