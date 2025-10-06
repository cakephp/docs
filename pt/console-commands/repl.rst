Console Interativo (REPL)
#########################

O CakePHP oferece o
`plugin REPL(Read Eval Print Loop) <https://github.com/cakephp/repl>`__ para permitir
que você explore o CakePHP e sua aplicação em um console interativo.

.. note::

    O plugin era incluído no esqueleto da aplicação CakePHP antes da versão 4.3.

Você pode iniciar o console interativo usando:

.. code-block:: console

    bin/cake console

Isso inicializará sua aplicação e iniciará um console interativo. Neste
ponto você pode interagir com o código da sua aplicação e executar consultas usando os
models da sua aplicação:

.. code-block:: console

    bin/cake console

    >>> $articles = Cake\Datasource\FactoryLocator::get('Table')->get('Articles');
    // object(Cake\ORM\Table)(
    //
    // )
    >>> $articles->find()->all();

Como sua aplicação foi inicializada, você também pode testar o roteamento usando o
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

Você também pode testar a geração de URLs::

    >>> Cake\Routing\Router::url(['controller' => 'Articles', 'action' => 'edit', 99]);
    // '/articles/edit/99'

Para sair do REPL você pode usar ``CTRL-C`` ou digitando ``exit``.
