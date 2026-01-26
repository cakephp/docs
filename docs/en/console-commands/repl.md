# Interactive Console (REPL)

CakePHP offers
[REPL(Read Eval Print Loop) plugin](https://github.com/cakephp/repl) to let
you explore some CakePHP and your application in an interactive console.

> [!NOTE]
> The plugin was shipped with the CakePHP app skeleton before 4.3.

You can start the interactive console using:

``` bash
bin/cake console
```

This will bootstrap your application and start an interactive console. At this
point you can interact with your application code and execute queries using your
application's models:

``` bash
bin/cake console

>>> $articles = Cake\Datasource\FactoryLocator::get('Table')->get('Articles');
// object(Cake\ORM\Table)(
//
// )
>>> $articles->find()->all();
```

Since your application has been bootstrapped you can also test routing using the
REPL:

``` php
>>> Cake\Routing\Router::parse('/articles/view/1');
// [
//   'controller' => 'Articles',
//   'action' => 'view',
//   'pass' => [
//     0 => '1'
//   ],
//   'plugin' => NULL
// ]
```

You can also test generating URLs:

``` php
>>> Cake\Routing\Router::url(['controller' => 'Articles', 'action' => 'edit', 99]);
// '/articles/edit/99'
```

To quit the REPL you can use `CTRL-C` or by typing `exit`.
