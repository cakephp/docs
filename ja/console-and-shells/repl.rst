インタラクティブ・コンソール (REPL)
###################################

CakePHP の app スケルトンは、組み込みの REPL (Read Eval Print Loop) を備えており、
このことで CakePHP やアプリケーションがインタラクティブ・コンソール内で探索しやすくなります。
以下のようにするとインタラクティブ・コンソールを使い始めることができます。 ::

    $ bin/cake console

これは、アプリケーションを自動実行し、インタラクティブコンソールを開始します。
この時点で、アプリケーションコードを対話的に実行したり、
アプリケーションのモデルを利用してクエリーを実行することができます。 ::

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

アプリケーションが自動実行されたら、REPL を利用してルーティングを試すこともできます。 ::

    >>> Cake\Routing\Router::parse('/articles/view/1');
    // [
    //   'controller' => 'Articles',
    //   'action' => 'view',
    //   'pass' => [
    //     0 => '1'
    //   ],
    //   'plugin' => NULL
    // ]

URL 生成を試すこともできます。 ::

    >>> Cake\Routing\Router::url(['controller' => 'Articles', 'action' => 'edit', 99]);
    // '/articles/edit/99'

REPL を終了するには、 ``CTRL-C`` を使用するか、あるいは ``exit`` と入力してください。
