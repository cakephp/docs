Consola interactiva (REPL)
##########################

CakePHP ofrece el complemento
`REPL (Read Eval Print Loop) <https://github.com/cakephp/repl>`__ para
permitirle explorar algo de CakePHP y su aplicación en una consola interactiva.

Puede iniciar la consola interactiva usando:

.. code-block:: console

    bin/cake console

Esto iniciará su aplicación e iniciará una consola interactiva. En este punto,
puede interactuar con el código de su aplicación y ejecutar consultas utilizando
los modelos de su aplicación:

.. code-block:: console

    bin/cake console

    >>> $articles = Cake\Datasource\FactoryLocator::get('Table')->get('Articles');
    // object(Cake\ORM\Table)(
    //
    // )
    >>> $articles->find()->all();

Dado que su aplicación ha sido iniciada, también puede probar el enrutamiento
usando REPL::

    >>> Cake\Routing\Router::parse('/articles/view/1');
    // [
    //   'controller' => 'Articles',
    //   'action' => 'view',
    //   'pass' => [
    //     0 => '1'
    //   ],
    //   'plugin' => NULL
    // ]

También puedes probar la generación de URL::

    >>> Cake\Routing\Router::url(['controller' => 'Articles', 'action' => 'edit', 99]);
    // '/articles/edit/99'

Para salir de REPL, puede usar ``CTRL-C`` o escribir ``exit``.
