Console Interactive (REPL)
##########################

.. todo::

    REPL is shipped as a plugin since 4.3. Update the translation.

Le squelette de l'application CakePHP intègre un REPL(Read Eval Print Loop
= Lire Evaluer Afficher Boucler) qui permet l'exploration de CakePHP et
de votre application avec une console interactive. Vous pouvez commencer la
console interactive en utilisant::

    $ bin/cake console

Cela va démarrer votre application et lancer une console interactive. A ce
niveau-là, vous pouvez interagir avec le code de votre application et exécuter
des requêtes en utilisant les models de votre application::

    $ bin/cake console

    Welcome to CakePHP v3.0.0 Console
    ---------------------------------------------------------------
    App : App
    Path: /Users/mark/projects/cakephp-app/src/
    ---------------------------------------------------------------
    >>> $articles = Cake\ORM\TableRegistry::getTableLocator()->get('Articles');
    // object(Cake\ORM\Table)(
    //
    // )
    >>> $articles->find()->all();

Puisque votre application a été démarrée, vous pouvez aussi tester le routing
en utilisant le REPL::

    >>> Cake\Routing\Router::parse('/articles/view/1');
    // [
    //   'controller' => 'Articles',
    //   'action' => 'view',
    //   'pass' => [
    //     0 => '1'
    //   ],
    //   'plugin' => NULL
    // ]

Vous pouvez aussi tester la génération d'URL::

    >>> Cake\Routing\Router::url(['controller' => 'Articles', 'action' => 'edit', 99]);
    // '/articles/edit/99'

Pour quitter le REPL, vous pouvez utiliser ``CTRL-C`` ou en tapant ``exit``.
