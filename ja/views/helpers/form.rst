Form
####

.. php:namespace:: Cake\View\Helper

.. php:class:: FormHelper(View $view, array $config = [])

FormHelper は、フォーム作成時の力作業のほとんどを代行してくれます。
FormHelper は、フォームを素早く作成し、検証、再配置、レイアウトを効率化します。
FormHelper は、柔軟でもあります。通常は規約に沿ってほとんどのことをやってくれますが、
特定のメソッドを使って必要な機能だけを使うこともできます。

フォームの開始
==============

.. php:method:: create(mixed $context = null, array $options = [])

* ``$context`` - フォームが定義されているコンテキスト。 ORM エンティティー、 ORM 結果セット、
  メタデータの配列もしくは ``false/null`` (モデルのないフォームを作成するため) です。
* ``$options`` - オプションまたは HTML 属性の配列。

FormHelper を活用するために最初に使うメソッドは ``create()`` です。
このメソッドは、フォームの開始タグを出力します。

パラメーターはすべてオプションです。 ``create()`` が、パラメーターなしで呼ばれた場合、
現在の URL を元に現在のコントローラーに送信するためのフォームを作ろうとしているものとみなします。
フォーム送信のためのデフォルトのメソッドは POST です。 ``UsersController::add()`` のビューの中で
``create()`` を呼んだ場合、描画されたビューの中で次のような出力が表示されます。

.. code-block:: html

    <form method="post" action="/users/add">

``$context`` 引数は、フォームの「コンテキスト」として使用されます。
いくつかの組み込みフォームのコンテキストがあり、独自に追加することができます。次のセクションで説明します。
組み込みのプロバイダーは、 ``$context`` の次の値とマップします。

* ``Entity`` インスタンスまたはイテレーターは、
  `EntityContext <https://api.cakephp.org/3.x/class-Cake.View.Form.EntityContext.html>`_
  にマップされます。このコンテキストは、FormHelper が組み込みの ORM の結果を処理できるようにします。

* ``schema`` キーを含む配列は、
  `ArrayContext <https://api.cakephp.org/3.x/class-Cake.View.Form.ArrayContext.html>`_
  にマップされます。これは単純なデータ構造を作成してフォームを構築することができます。

* ``null`` と ``false`` は、
  `NullContext <https://api.cakephp.org/3.x/class-Cake.View.Form.NullContext.html>`_
  にマップされます。
  このコンテキストクラスは、FormHelper が必要とするインターフェイスを単に満たすだけです。
  このコンテキストは、ORM の永続性を必要としない短いフォームを作成したい場合に便利です。

すべてのコンテキストクラスは、リクエストデータにアクセスできるため、フォームを簡単に作成できます。

コンテキストを持ったフォームが作成されると、作成したすべてのコントロールはアクティブなコンテキストを使用します。
ORM バックエンドフォームの場合、FormHelper は関連データ、検証エラー、およびスキーマメタデータに
アクセスできます。 ``end()`` メソッドを使用したり、再度 ``create()`` を呼び出すことによって、
アクティブなコンテキストを閉じることができます。

エンティティーのフォームを作成するには、次の手順を実行します。 ::

    // /articles/add において
    // $article は、空の Article エンティティーである必要があります。
    echo $this->Form->create($article);

出力結果:

.. code-block:: html

    <form method="post" action="/articles/add">

これは ArticlesController の ``add()`` アクションにフォームデータを POST します。
また、編集フォームを作成するために、同じロジックを使用することができます。
FormHelper は、 *追加* または *編集* のフォームを作成するかどうかを自動的に検出するために、
``Entity`` オブジェクトを使用します。
提供されたエンティティーが「新しくない」場合は、 *編集* フォームとして作成されます。

例えば、 **http://example.org/articles/edit/5** を閲覧すると、次のことができます。 ::

    // src/Controller/ArticlesController.php:
    public function edit($id = null)
    {
        if (empty($id)) {
            throw new NotFoundException;
        }
        $article = $this->Articles->get($id);
        // 保存ロジックがここに入ります
        $this->set('article', $article);
    }

    // View/Articles/edit.ctp:
    // $article->isNew() は false なので、編集フォームが得られます
    <?= $this->Form->create($article) ?>

出力結果:

.. code-block:: html

    <form method="post" action="/articles/edit/5">
    <input type="hidden" name="_method" value="PUT" />

.. note::

    これは *編集* フォームなので、デフォルトの HTTP メソッドを上書きするために
    hidden ``input`` フィールドが生成されます。

フォーム作成のためのオプション
------------------------------

``$options`` 配列は、ほとんどのフォーム設定が行われる場所です。この特別な配列には、
form タグの生成方法に影響を与えるさまざまなキーと値のペアが含まれます。
有効な値:

* ``'type'`` - 作成するフォームの種類を選択できます。type が未指定の場合、
  フォームコンテキストに基づいて自動的に決まります。
  有効な値:

  * ``'get'`` - フォームの method に HTTP GET を設定します。
  * ``'file'`` - フォームの method に POST を設定し、 ``enctype`` に
    "multipart/form-data" を設定します。
  * ``'post'`` - method に POST を設定します。
  * ``'put', 'delete', 'patch'`` - フォームの送信時に、HTTP メソッドを
    PUT、 DELETE もしくは PATCH に上書きします。

* ``'method'`` - 有効な値は、上記と同じです。フォームの method を明示的に上書きできます。

* ``'url'`` - フォームを送信する URL を指定します。文字列および URL 配列を指定できます。

* ``'encoding'`` - フォームに ``accept-charset`` エンコーディングをセットします。
  デフォルトは、 ``Configure::read('App.encoding')`` です。

* ``'enctype'`` - 明示的にフォームのエンコーディングをセットできます。

* ``'templates'`` - このフォームで使用したいテンプレート。指定したテンプレートは、
  既に読み込まれたテンプレートの上にマージされます。 ``/config`` のファイル名 (拡張子を除く) か、
  使用したいテンプレートの配列のいずれかを指定します。

* ``'context'`` - フォームコンテキストクラスの追加オプション。(例えば、
  ``EntityContext`` は、フォームのベースとなる特定の Table クラスを設定するための
  ``'table'`` オプションを受け付けます。)

* ``'idPrefix'`` - 生成された ID 属性のプレフィックス。

* ``'templateVars'`` - ``formStart`` テンプレートのためのテンプレート変数を提供することができます。

.. tip::

    上記のオプションの他に、 ``$options`` 引数の中で、 作成した ``form`` 要素に渡したい
    有効な HTML 属性を指定できます。

.. _form-values-from-query-string:

クエリー文字列からフォームの値を取得
------------------------------------

.. versionadded:: 3.4.0

FormHelper の値ソースは、input タグなどの描画される要素がどこから値を受け取るかを定義します。

デフォルトでは、FormHelper は、「コンテキスト」をもとにその値を描画します。
``EntityContext`` などのデフォルトのコンテキストは、現在のエンティティーや
``$request->getData()`` からデータを取得します。

しかし、クエリー文字列から読み込む必要があるフォームを構築している場合は、 ``FormHelper`` の
``valueSource()`` を使って、どこから入力データを読み込むかを変更できます。 ::

    // コンテキストでクエリー文字列の優先順位をつける
    echo $this->Form->create($article, [
        'valueSources' => ['query', 'context']
    ]);

    // 同じ効果:
    echo $this->Form
        ->setValueSources(['query', 'context'])
        ->create($articles);

    // クエリー文字列からのみのデータの読み取り
    echo $this->Form->create($article);
    $this->Form->setValueSources('query');

    // 同じ効果:
    echo $this->Form->create($article, ['valueSources' => 'query']);

サポートするソースは、 ``context``, ``data`` そして ``query`` です。
単一または複数のソースを使用できます。 ``FormHelper`` によって生成されたウィジェットは
設定した順序でソースから値を集めます。

``end()`` が呼ばれた時、値ソースはデフォルト (``['context']``) にリセットされます。

フォームの HTTP メソッドを変更
------------------------------

``type`` オプションを使用することにより、フォームが使用する HTTP メソッドを変更することができます。 ::

    echo $this->Form->create($article, ['type' => 'get']);

出力結果:

.. code-block:: html

    <form method="get" action="/articles/edit/5">

``type`` の値に ``'file'`` を指定すると、フォームの送信方法は、'POST' に変更し、form タグに
"multipart/form-data" の ``enctype`` が含まれます。
これは、フォーム内部に file 要素がある場合に使用されます。
適切な ``enctype`` 属性が存在しない場合は、ファイルのアップロードが機能しない原因となります。

例::

    echo $this->Form->create($article, ['type' => 'file']);

出力結果:

.. code-block:: html

    <form enctype="multipart/form-data" method="post" action="/articles/add">

``'type'`` の値として ``'put'`` 、 ``'patch'`` または ``'delete'`` を使用すると、
フォームは機能的に 'post' フォームに相当しますが、送信されると、HTTP リクエストメソッドは、
それぞれ 'PUT'、 'PATCH' または 'DELETE' で上書きされます。
これで、CakePHP は、ウェブブラウザーで適切な REST サポートをエミュレートすることができます。

フォームの URL を設定
---------------------

``url`` オプションを使うと、フォームを現在のコントローラーやアプリケーションの別のコントローラーの
特定のアクションに向けることができます。

例えば、フォームを現在のコントローラーの ``login()`` アクションに向けるには、次のような
``$options`` 配列を与えます。 ::

    echo $this->Form->create($article, ['url' => ['action' => 'login']]);

出力結果:

.. code-block:: html

    <form method="post" action="/users/login">

目的のフォームアクションが現在のコントローラーにない場合は、フォームアクションの完全な URL を指定できます。
出力される URL は CakePHP アプリケーションに対する相対になります。 ::

    echo $this->Form->create(null, [
        'url' => ['controller' => 'Articles', 'action' => 'publish']
    ]);

出力結果:

.. code-block:: html

    <form method="post" action="/articles/publish">

または外部ドメインを指定することができます。 ::

    echo $this->Form->create(null, [
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    ]);

出力結果:

.. code-block:: html

    <form method="get" action="http://www.google.com/search">

フォームアクションに URL を出力したくない場合、 ``'url' => false`` を使用してください。

カスタムバリデーターの利用
--------------------------

多くの場合、モデルには複数の検証セットがあり、コントローラーアクションが適用される
特定の検証ルールに基づいて必要なフィールドに FormHelper を設定する必要があります。
たとえば、Users テーブルには、アカウントの登録時にのみ適用される特定の検証ルールがあります。 ::

    echo $this->Form->create($user, [
        'context' => ['validator' => 'register']
    ]);

上記では ``UsersTable::validationRegister()`` で定義されている ``register``
バリデーターの中で定義されたルールを ``$user`` と関連するすべてのアソシエーションに使用します。
関連付けられたエンティティーのフォームを作成する場合は、配列を使用して各アソシエーションの検証ルールを
定義できます。 ::

    echo $this->Form->create($user, [
        'context' => [
            'validator' => [
                'Users' => 'register',
                'Comments' => 'default'
            ]
        ]
    ]);

上記は、ユーザーには ``register`` 、そしてユーザーのコメントには ``default`` を使用します。

コンテキストクラスの作成
------------------------

組み込みのコンテキストクラスは基本的なケースをカバーすることを目的としていますが、
異なる ORM を使用している場合は新しいコンテキストクラスを作成する必要があります。
このような状況では、 `Cake\\View\\Form\\ContextInterface
<https://api.cakephp.org/3.x/class-Cake.View.Form.ContextInterface.html>`_
を実装する必要があります。
このインターフェイスを実装すると、新しいコンテキストを FormHelper に追加することができます。
``View.beforeRender`` イベントリスナーやアプリケーションビュークラスで行うのが最善の方法です。 ::

    $this->Form->addContextProvider('myprovider', function ($request, $data) {
        if ($data['entity'] instanceof MyOrmClass) {
            return new MyProvider($request, $data);
        }
    });

コンテキストのファクトリー関数では、正しいエンティティータイプのフォームオプションを確認するための
ロジックを追加できます。一致する入力データが見つかった場合は、オブジェクトを返すことができます。
一致するものがない場合は null を返します。

.. _automagic-form-elements:

フォームコントロールの作成
==========================

.. php:method:: control(string $fieldName, array $options = [])

* ``$fieldName`` - ``'Modelname.fieldname'`` の形式のフィールド名。
* ``$options`` - :ref:`control-specific-options` や (様々な HTML 要素を生成するために
  ``control()`` が内部的に使用する) 他のメソッドのオプション、および有効な HTML 属性を
  含むオプション配列。

``control()`` メソッドを使うと完全なフォームコントロールを生成できます。これらのコントロールには、
必要に応じて、囲い込む ``div`` 、 ``label`` 、コントロールウィジェット、および検証エラーが含まれます。
フォームコンテキストでメタデータを使用することにより、このメソッドは各フィールドに適切な
コントロールタイプを選択します。内部的に ``control()`` は FormHelper の他のメソッドを使います。

.. tip::

    ``control()`` メソッドによって生成されたフィールドは、このページでは一般的に
    "入力" と呼ばれますが、技術的にいえば、 ``control()`` メソッドは、 HTML の
    ``input`` 型の要素だけでなく、他の HTML フォーム要素 (``select`` 、 ``button`` 、
    ``textarea`` など) も生成できることに注意してください。

デフォルトでは、 ``control()`` メソッドは、次のウィジェットテンプレートを使用します。 ::

    'inputContainer' => '<div class="input {{type}}{{required}}">{{content}}</div>'
    'input' => '<input type="{{type}}" name="{{name}}"{{attrs}}/>'

検証エラーが発生した場合は、以下も使われます。 ::

    'inputContainerError' => '<div class="input {{type}}{{required}} error">{{content}}{{error}}</div>'

作成されたコントロールの型（生成された要素タイプを指定する追加のオプションを指定しない場合）は、
モデルの内部で推測され、列のデータ型に依存します。

作成されるコントロールの型は、カラムのデータ型に依存します。

カラムの型
    得られたフォームのフィールド
string, uuid (char, varchar, その他)
    text
boolean, tinyint(1)
    checkbox
decimal
    number
float
    number
integer
    number
text
    textarea
text で、名前が password, passwd
    password
text で、名前が email
    email
text で、名前が tel, telephone, または phone
    tel
date
    day, month, および year の select
datetime, timestamp
    day, month, year, hour, minute, および meridian の select
time
    hour, minute, および meridian の select
binary
    file

``$options`` パラメーターを使うと、必要な場合に特定のコントロールタイプを選択することができます。 ::

    echo $this->Form->control('published', ['type' => 'checkbox']);

.. tip::

    とても些細なことですが、 ``control()`` フォームメソッドを使用して特定の要素を生成すると、
    デフォルトでは ``div`` の囲い込みが常に生成されます。特定のフォームメソッド（例えば
    ``$this->Form->checkbox('published');`` ）を使用して同じタイプの要素を生成すると、
    ほとんどの場合、 ``div`` の囲い込みが生成されません。
    あなたのニーズに応じて、どちらかを使うことができます。

.. _html5-required:

モデルのフィールドの検証ルールで入力が必須であり、空を許可しない場合は、囲い込む ``div`` は、
クラス名に ``required`` が追加されます。
``required`` オプションを使用して自動的に必須フラグを無効にすることができます。 ::

    echo $this->Form->control('title', ['required' => false]);

フォーム全体のブラウザー検証トリガーをスキップするには、
:php:meth:`~Cake\\View\\Helper\\FormHelper::submit()` を使って生成する入力ボタンに対して
``'formnovalidate' => true`` オプションを設定したり、
:php:meth:`~Cake\\View\\Helper\\FormHelper::create()` のオプションで
``'novalidate' => true`` を設定できます。

たとえば、Users モデルに *username* (varchar), *password* (varchar), *approved* (datetime)
および *quote* (text) のフィールドがあるとします。FormHelper の ``control()`` メソッドを使用すると、
これらのフォームフィールドすべてに適切なコントロールを作成できます。 ::

    echo $this->Form->create($user);
    // 以下は、テキスト入力を生成します
    echo $this->Form->control('username');
    // 以下は、パスワード入力を生成します
    echo $this->Form->control('password');
    // 'approved' を datetime か timestamp フィールドとみなし、
    // 以下は、日・月・年・時・分を生成します
    echo $this->Form->control('approved');
    // 以下は、テキストエリア要素を生成します
    echo $this->Form->control('quote');

    echo $this->Form->button('Add');
    echo $this->Form->end();

日付フィールドのいくつかのオプションを示すより広範な例::

    echo $this->Form->control('birth_dt', [
        'label' => '生年月日',
        'minYear' => date('Y') - 70,
        'maxYear' => date('Y') - 18,
    ]);

特定の :ref:`control-specific-options` に加えて、選択された (または CakePHP によって推論された)
コントロールタイプや HTML 属性 (例えば ``onfocus``) に対応する特定のメソッドによって
受け入れられるオプションを指定することができます。

*belongsTo* または *hasOne* を使用していて ``select`` フィールドを作成する場合は、
Users コントローラーに次のものを追加できます（User *belongsTo* Group を前提とします）。 ::

    $this->set('groups', $this->Users->Groups->find('list'));

その後、ビューテンプレートに以下を追加します。 ::

    echo $this->Form->control('group_id', ['options' => $groups]);

*belongsToMany* で関連付く Groups の ``select`` ボックスを作成するには、
UsersController に以下を追加します。 ::

    $this->set('groups', $this->Users->Groups->find('list'));

その後、ビューテンプレートに以下を追加します。 ::

    echo $this->Form->control('groups._ids', ['options' => $groups]);

モデル名が2つ以上の単語 (たとえば "UserGroup") で構成されている場合、
``set()`` を使用してデータを渡すときは、データを次のように複数形と
`ローワーキャメルケース <https://en.wikipedia.org/wiki/Camel_case#Variations_and_synonyms>`_
で名前を付ける必要があります。 ::

    $this->set('userGroups', $this->UserGroups->find('list'));

.. note::

    送信ボタンを生成するために ``FormHelper::control()`` を使用しないでください。
    代わりに :php:meth:`~Cake\\View\\Helper\\FormHelper::submit()` を使用してください。

フィールドの命名規則
--------------------

コントロールウィジェットを作成するときは、フィールドの名前をフォームのエンティティーに一致する属性の後に
指定する必要があります。たとえば、 ``$article`` エンティティーのフォームを作成した場合、
そのプロパティーの名前を付けたフィールドを作成します。例えば ``title`` 、 ``body`` と ``published`` 。

``association.fieldname`` を最初のパラメーターとして渡すことで、関連するモデルや任意のモデルの
コントロールを作成できます。 ::

    echo $this->Form->control('association.fieldname');

フィールド名のドットは、ネストされたリクエストデータに変換されます。
たとえば、 ``0.comments.body`` という名前のフィールドを作成した場合、
``0[comments][body]`` のような名前属性が得られます。
この規則により、ORM でデータを簡単に保存できます。
さまざまなアソシエーションタイプの詳細は、 :ref:`associated-form-inputs` セクションにあります。

datetime に関連するコントロールを作成する場合、FormHelper はフィールドのサフィックスを追加します。
``year`` 、 ``month`` 、 ``day`` 、 ``hour`` 、 ``minute`` 、または ``meridian``
というフィールドが追加されていることがあります。エンティティーがマーシャリングされると、
これらのフィールドは自動的に ``DateTime`` オブジェクトに変換されます。

.. _control-specific-options:

コントロールのオプション
------------------------

``FormHelper::control()`` は、その ``$options`` 引数を通して、多数のオプションをサポートしています。
``control()`` 自身のオプションに加えて、生成されたコントロールタイプに対するオプションと
HTML 属性を受け付けます。以下は ``FormHelper::control()`` で特有のオプションについて説明します。

* ``$options['type']`` - 生成するためのウィジェットタイプを指定する文字列。
  :ref:`automagic-form-elements` にあるフィールド型に加えて、 ``'file'`` 、 ``'password'`` 、
  および HTML5 でサポートされているすべてのタイプを作成することもできます。
  ``'type'`` を指定することで、モデルの設定を上書きして、コントロールのタイプを強制することができます。
  デフォルトは ``null`` 。

  例::

      echo $this->Form->control('field', ['type' => 'file']);
      echo $this->Form->control('email', ['type' => 'email']);

  出力結果:

  .. code-block:: html

      <div class="input file">
          <label for="field">Field</label>
          <input type="file" name="field" value="" id="field" />
      </div>
      <div class="input email">
          <label for="email">Email</label>
          <input type="email" name="email" value="" id="email" />
      </div>

* ``$options['label']`` - 文字列の見出しや :ref:`ラベルのオプション<create-label>` の配列。
  このキーは、通常は ``input`` HTML 要素に付随するラベル内に表示したい文字列に設定することができます。
  デフォルトは ``null`` です。

  例::

      echo $this->Form->control('name', [
          'label' => 'The User Alias'
      ]);

  出力結果:

  .. code-block:: html

      <div class="input">
          <label for="name">The User Alias</label>
          <input name="name" type="text" value="" id="name" />
      </div>

  あるいは、 ``label`` 要素の出力を無効にするには、このキーに ``false`` を設定します。

  例::

      echo $this->Form->control('name', ['label' => false]);

  出力結果:

  .. code-block:: html

      <div class="input">
          <input name="name" type="text" value="" id="name" />
      </div>

  これに配列を設定すると、 ``label`` 要素の追加オプションが提供されます。
  これを行う場合、配列中の ``text`` キーを使ってラベルテキストをカスタマイズすることができます。

  例::

      echo $this->Form->control('name', [
          'label' => [
              'class' => 'thingy',
              'text' => 'The User Alias'
          ]
      ]);

  出力結果:

  .. code-block:: html

      <div class="input">
          <label for="name" class="thingy">The User Alias</label>
          <input name="name" type="text" value="" id="name" />
      </div>

* ``$options['options']`` - ここには、アイテムの配列を引数として必要とする ``radio`` や
  ``select`` のようなウィジェットのために、生成される要素を含む配列を提供することができます
  (詳細は、 :ref:`create-radio-button` と :ref:`create-select-picker` をご覧ください)。
  デフォルトは、 ``null`` です。

* ``$options['error']`` - このキーを使用すると、デフォルトのモデルエラーメッセージを
  無効にすることができ、たとえば国際化メッセージを設定するために使用できます。
  エラーメッセージの出力とフィールドクラスを無効にするには、 ``'error'`` キーを
  ``false`` に設定してください。デフォルトは ``null`` 。

  例::

      echo $this->Form->control('name', ['error' => false]);

  モデルのエラーメッセージを上書きするには、
  元の検証エラーメッセージと一致するキーを持つ配列を使用します。

  例::

      $this->Form->control('name', [
          'error' => ['Not long enough' => __('This is not long enough')]
      ]);

  上記のように、モデルにある各検証ルールに対してエラーメッセージを設定することができます。
  さらに、フォームに国際化メッセージを提供することもできます。

* ``$options['nestedInput']`` - チェックボックスとラジオボタンで使用。
  input 要素を ``label`` 要素の内側か外側に生成するかどうかを制御します。
  ``control()`` がチェックボックスやラジオボタンを生成する時、これに ``false`` を設定して、
  ``label`` 要素の外側に HTML の ``input`` 要素を強制的に生成することができます。

  一方、任意のコントロールタイプに対して、これを ``true`` に設定することで、
  生成された input 要素をラベルの中に強制的に入れることができます。
  これをラジオボタンで変更する場合は、デフォルトの :ref:`radioWrapper<create-radio-button>`
  テンプレートも変更する必要があります。生成されるコントロールタイプによっては、
  デフォルトが ``true`` や ``false`` になります。

* ``$options['templates']`` - この入力に使用するテンプレート。
  指定したテンプレートは、既に読み込まれたテンプレートの上にマージされます。
  このオプションは、ロードするテンプレートを含む ``/config`` のファイル名 (拡張子を除く) か、
  使用するテンプレートの配列のいずれかです。

* ``$options['labelOptions']`` - これを ``false`` に設定すると nestedWidgets
  の周りのラベルを無効にします。または、 ``label`` タグに提供される属性の配列を設定します。

コントロールの特定のタイプを生成
================================

汎用的な ``control()`` メソッドに加えて、 ``FormHelper`` には様々な種類の
コントロールタイプを生成するために個別のメソッドがあります。
これらは、コントロールウィジェットそのものを生成するのに使えますが、
完全に独自のフォームレイアウトを生成するために
:php:meth:`~Cake\\View\\Helper\\FormHelper::label()` や
:php:meth:`~Cake\\View\\Helper\\FormHelper::error()` といった
他のメソッドを組み合わせることができます。

.. _general-control-options:

特定のコントロールのための共通オプション
----------------------------------------

さまざまなコントロール要素メソッドは、共通のオプションをサポートしており、
使用されるフォームメソッドに応じて、 ``$options`` または ``$attributes`` 配列の引数の中に
指定する必要があります。これらのオプションはすべて、 ``control()`` でもサポートされています。
繰り返しを減らすために、すべてのコントロールメソッドで共有される共通オプションは次の通りです。

* ``'id'`` - このキーを設定すると、コントロールの DOM id の値が強制的に設定されます。
  これにより、設定可能な ``'idPrefix'`` が上書きされます。

* ``'default'`` コントロールフィールドのデフォルト値を設定します。
  この値は、フォームに渡されるデータにそのフィールドに関する値が含まれていない場合
  (または、一切データが渡されない場合) に使われます。
  明示的なデフォルト値は、スキーマで定義されたデフォルト値を上書きします。

  使用例::

      echo $this->Form->text('ingredient', ['default' => 'Sugar']);

  ``select`` フィールドを持つ例（"Medium" サイズがデフォルトで選択されます） ::

      $sizes = ['s' => 'Small', 'm' => 'Medium', 'l' => 'Large'];
      echo $this->Form->select('size', $sizes, ['default' => 'm']);

  .. note::

      checkbox をチェックする目的では ``default`` は使えません。その代わり、コントローラーで
      ``$this->request->getData()`` の中の値をセットするか、またはコントロールオプションの
      ``checked`` を ``true`` にします。

      デフォルト値への代入の際 ``false`` を使うのは注意が必要です。
      ``false`` 値はコントロールフィールドのオプションを無効または除外するために使われます。
      そのため ``'default' => false`` では値を全く設定しません。
      代わりに ``'default' => 0`` を使用してください。

* ``'value'`` - コントロールフィールドに特定の値を設定するために使用します。
  これは、Form、Entity、 ``request->getData()`` などのコンテキストから
  注入される可能性のある値を上書きします。

  .. note::

      コンテキストや valuesSource から値を取得しないようにフィールドを設定したい場合、
      ``'value'`` を ``''`` に設定する必要があります (もしくは ``null`` に設定) 。

上記のオプションに加えて、任意の HTML 属性を混在させることができます。
特に規定のないオプション名は HTML 属性として扱われ、生成された HTML のコントロール要素に反映されます。

.. versionchanged:: 3.3.0
    3.3.0 では、FormHelper は、自動的にデータベーススキーマで定義されたデフォルト値を使用します。
    ``schemaDefault`` オプションを ``false`` に設定することで、この動作を無効にすることができます。

input 要素の作成
================

FormHelper で利用可能なメソッドには、さらに特定のフォーム要素を作成するためのものがあります。
これらのメソッドの多くでは、特別な ``$options`` や ``$attributes`` パラメーターを指定できます。
ただし、この場合、このパラメーターは主に (フォーム要素の DOM id の値のような) HTML タグの属性を
指定するために使われます。

テキスト入力の作成
------------------

.. php:method:: text(string $name, array $options)

* ``$name`` - ``'Modelname.fieldname'`` の形式のフィールド名。
* ``$options`` - :ref:`general-control-options` や有効な HTML 属性を含むオプション配列。

シンプルな ``text`` 型の ``input`` HTML 要素を作成します。

例::

    echo $this->Form->text('username', ['class' => 'users']);

出力結果:

.. code-block:: html

    <input name="username" type="text" class="users">

パスワード入力の作成
--------------------

.. php:method:: password(string $fieldName, array $options)

* ``$fieldName`` - ``'Modelname.fieldname'`` の形式のフィールド名。
* ``$options`` - :ref:`general-control-options` や有効な HTML 属性を含むオプション配列。

シンプルな ``password`` 型の ``input`` 要素を作成します。

例::

    echo $this->Form->password('password');

出力結果:

.. code-block:: html

    <input name="password" value="" type="password">

非表示入力の作成
----------------

.. php:method:: hidden(string $fieldName, array $options)

* ``$fieldName`` - ``'Modelname.fieldname'`` の形式のフィールド名。
* ``$options`` - :ref:`general-control-options` や有効な HTML 属性を含むオプション配列。

非表示のフォーム入力を作成します。

例::

    echo $this->Form->hidden('id');

出力結果:

.. code-block:: html

    <input name="id" value="10" type="hidden" />

テキストエリアの作成
--------------------

.. php:method:: textarea(string $fieldName, array $options)

* ``$fieldName`` - ``'Modelname.fieldname'`` の形式のフィールド名。
* ``$options`` - :ref:`general-control-options` やテキストエリア特有のオプション
  (下記参照) と、有効な HTML 属性を含むオプション配列。

textarea コントロールフィールドを作成します。使用されるデフォルトのウィジェットテンプレートは、 ::

    'textarea' => '<textarea name="{{name}}"{{attrs}}>{{value}}</textarea>'

例::

    echo $this->Form->textarea('notes');

出力結果:

.. code-block:: html

    <textarea name="notes"></textarea>

フォームが編集されると（すなわち、配列 ``$this->request->getData()`` に
``User`` モデルに渡すために保存された情報が含まれている場合）、生成される HTML には
``notes`` フィールドに対応する値が自動的に含まれます。

例:

.. code-block:: html

    <textarea name="notes" id="notes">
    このテキストは編集されます。
    </textarea>

**テキストエリアのオプション**

:ref:`general-control-options` に加えて、 ``textarea()`` はいくつかの固有のオプションを
サポートします。

* ``'escape'`` - テキストエリアの内容をエスケープするかどうかを指定します。
  デフォルトは ``true`` です。

  例::

      echo $this->Form->textarea('notes', ['escape' => false]);
      // もしくは....
      echo $this->Form->control('notes', ['type' => 'textarea', 'escape' => false]);

* ``'rows', 'cols'`` - これらの2つのキーを使用して、 ``textarea`` フィールドの行数と列数を
  指定する HTML 属性を設定することができます。

  例::

      echo $this->Form->textarea('comment', ['rows' => '5', 'cols' => '5']);

  出力結果:

  .. code-block:: html

      <textarea name="comment" cols="5" rows="5">
      </textarea>

セレクト、チェックボックス、ラジオコントロールの作成
----------------------------------------------------

これらのコントロールは、いくつかの共通点といくつかのオプションを共有し、
それらは簡単に参照するために、このサブセクションで全てグループ化します。

.. _checkbox-radio-select-options:

セレクト、チェックボックス、ラジオに関するオプション
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``select()`` 、 ``checkbox()`` そして ``radio()`` によって共有されるオプションは次の通りです。
(各メソッドの独自のセクションには、そのメソッド特有のオプションが記述されています。)

* ``'value'`` - 影響を受ける要素の値を設定または選択します。

  * チェックボックスの場合、 ``input`` 要素に割り当てられた HTML の ``'value'`` 属性を、
    値として提供するものに設定します。

  * ラジオボタンまたは選択ピッカーの場合は、フォームが描画されるときに選択される要素を定義します
    (この場合、 ``'value'`` は有効で存在する要素の値を割り当てなければなりません)。
    ``date()`` 、 ``time()`` 、 ``dateTime()`` のようなセレクト型コントロールと
    組み合わせて使用することもできます。 ::

        echo $this->Form->time('close_time', [
            'value' => '13:30:00'
        ]);

  .. note::

      ``date()`` および ``dateTime()`` コントロールの ``'value'`` キーには、
      UNIX タイムスタンプまたは DateTime オブジェクトを使用することもできます。

  ``multiple`` 属性を ``true`` に設定した ``select`` コントロールでは、
  デフォルトで選択したい値の配列を使うことができます。 ::

      // 値に 1 と 3 を持つ HTML <option> 要素が事前選択されて描画されます。
      echo $this->Form->select('rooms', [
          'multiple' => true,
          'value' => [1, 3]
      ]);

* ``'empty'`` - ``radio()`` と ``select()`` に適用します。デフォルトは ``false`` です。

  * ``radio()`` に渡して ``true`` を設定すると、最初のラジオボタンとして追加の入力要素を作成し、
    値を ``''`` に、ラベルを ``'empty'`` にします。ラベルキャプションを制御する場合は、
    このオプションを文字列に設定します。

  * ``select`` メソッドに渡されると、ドロップダウンリストに空の値を持つ空白の
    HTML ``option`` 要素が作成されます。空の値を空の ``option`` の代わりに表示させたい場合は、
    ``'empty'`` に文字列を渡します。 ::

        echo $this->Form->select(
            'field',
            [1, 2, 3, 4, 5],
            ['empty' => '(一つ選ぶ)']
        );

    出力結果:

    .. code-block:: html

        <select name="field">
            <option value="">(一つ選ぶ)</option>
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>

* ``'hiddenField'`` - チェックボックスとラジオボタンの場合、デフォルトでは、
  メインの要素とともに hidden ``input`` 要素も作成されます。そのため、
  値の指定がなくても、 ``$this->request->getData()`` の中のキーは必ず存在します。
  その値のデフォルトは、チェックボックスの場合は ``0`` 、ラジオボタンの場合は ``''`` です。

  デフォルト出力の例:

  .. code-block:: html

      <input type="hidden" name="published" value="0" />
      <input type="checkbox" name="published" value="1" />

  これは ``'hiddenField'`` を ``false`` とすることで無効にできます。 ::

      echo $this->Form->checkbox('published', ['hiddenField' => false]);

  出力結果:

  .. code-block:: html

      <input type="checkbox" name="published" value="1">

  フォーム上に複数のコントロールブロックを作成してグループ化する場合は、
  最初のコントロールを除くすべての入力で、このパラメーターを ``false`` に設定する必要があります。
  hidden 入力がページ上の複数の場所にある場合は、入力値の最後のグループだけが保存されます。

  この例では Tertiary Colors だけが渡され、Primary Colors は上書きされます。

  .. code-block:: html

      <h2>Primary Colors</h2>
      <input type="hidden" name="color" value="0" />
      <label for="color-red">
          <input type="checkbox" name="color[]" value="5" id="color-red" />
          Red
      </label>

      <label for="color-blue">
          <input type="checkbox" name="color[]" value="5" id="color-blue" />
          Blue
      </label>

      <label for="color-yellow">
          <input type="checkbox" name="color[]" value="5" id="color-yellow" />
          Yellow
      </label>

      <h2>Tertiary Colors</h2>
      <input type="hidden" name="color" value="0" />
      <label for="color-green">
          <input type="checkbox" name="color[]" value="5" id="color-green" />
          Green
      </label>
      <label for="color-purple">
          <input type="checkbox" name="color[]" value="5" id="color-purple" />
          Purple
      </label>
      <label for="color-orange">
          <input type="checkbox" name="color[]" value="5" id="color-orange" />
          Orange
      </label>

  2番目の入力グループで ``'hiddenField'`` を無効にすると、この動作を防ぐことができます。

  'N' のように 0 以外の別の hidden フィールド値を設定することができます。 ::

      echo $this->Form->checkbox('published', [
          'value' => 'Y',
          'hiddenField' => 'N',
      ]);

チェックボックスの作成
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: checkbox(string $fieldName, array $options)

* ``$fieldName`` - ``'Modelname.fieldname'`` の形式のフィールド名。
* ``$options`` - 上記の :ref:`general-control-options` または
  :ref:`checkbox-radio-select-options` 、チェックボックス特有のオプション
  (下記参照) と有効な HTML 属性を含むオプション配列。

``checkbox`` フォーム要素を作成します。使用されるウィジェットテンプレートは、 ::

    'checkbox' => '<input type="checkbox" name="{{name}}" value="{{value}}"{{attrs}}>'

**チェックボックスのオプション**

* ``'checked'`` - このチェックボックスをオンにするかどうかを示すブール値。
  デフォルトは ``false`` です。

* ``'disabled'`` - 入力不可のチェックボックスを作成。

このメソッドは、関連する隠しフォームの ``input`` 要素も生成し、
指定されたフィールドのデータの送信を強制します。

例::

    echo $this->Form->checkbox('done');

出力結果:

.. code-block:: html

    <input type="hidden" name="done" value="0">
    <input type="checkbox" name="done" value="1">

``$options`` 配列を使って checkbox の値を指定することもできます。

例::

    echo $this->Form->checkbox('done', ['value' => 555]);

出力結果:

.. code-block:: html

    <input type="hidden" name="done" value="0">
    <input type="checkbox" name="done" value="555">

FormHelper で hidden 入力を作成したくない場合は、 ``'hiddenField'`` を使います。

例::

    echo $this->Form->checkbox('done', ['hiddenField' => false]);

出力結果:

.. code-block:: html

    <input type="checkbox" name="done" value="1">

.. _create-radio-button:

ラジオボタンの作成
~~~~~~~~~~~~~~~~~~

.. php:method:: radio(string $fieldName, array $options, array $attributes)

* ``$fieldName`` - ``'Modelname.fieldname'`` の形式のフィールド名。
* ``$options`` - 少なくともラジオボタンのラベルを含むオプション配列。
  値や HTML 属性を含むこともできます。この配列がない場合、メソッドは hidden 入力
  を生成する (``'hiddenField'`` が ``true`` の場合)、または全く要素がない
  (``'hiddenField'`` が ``false`` の場合) かのいずれかです。
* ``$attributes`` - :ref:`general-control-options` または
  :ref:`checkbox-radio-select-options` 、ラジオボタン特有の属性 (下記参照)と
  有効な HTML 属性を含むオプション配列。

radio ボタン入力を作成します。使用されるデフォルトのウィジェットテンプレートは、 ::

    'radio' => '<input type="radio" name="{{name}}" value="{{value}}"{{attrs}}>'
    'radioWrapper' => '{{label}}'

**ラジオボタンの属性**

* ``label`` - ウィジェットのラベルを表示するかどうかを示すブール値。デフォルトは ``true`` 。

* ``hiddenField`` - ``true`` に設定すると、 ``''`` の値を持つ非表示の入力がインクルードされます。
  これは、非連続的なラジオセットを作成する場合に便利です。デフォルトは ``true`` 。

* ``disabled`` - すべてのラジオボタンを無効にするには ``true`` または ``disabled`` に設定します。
  デフォルトは ``false`` 。

``$options`` 引数を通してラジオボタンのラベルの見出しを指定してください。

例::

    $this->Form->radio('gender', ['Masculine','Feminine','Neuter']);

出力結果:

.. code-block:: html

    <input name="gender" value="" type="hidden">
    <label for="gender-0">
        <input name="gender" value="0" id="gender-0" type="radio">
        Masculine
    </label>
    <label for="gender-1">
        <input name="gender" value="1" id="gender-1" type="radio">
        Feminine
    </label>
    <label for="gender-2">
        <input name="gender" value="2" id="gender-2" type="radio">
        Neuter
    </label>

一般に ``$options`` は単純な ``キー => 値`` のペアです。
ただし、カスタム属性をラジオボタンに配置する必要がある場合は、拡張形式を使用することができます。

例::

    echo $this->Form->radio(
        'favorite_color',
        [
            ['value' => 'r', 'text' => 'Red', 'style' => 'color:red;'],
            ['value' => 'u', 'text' => 'Blue', 'style' => 'color:blue;'],
            ['value' => 'g', 'text' => 'Green', 'style' => 'color:green;'],
        ]
    );

出力結果:

.. code-block:: html

    <input type="hidden" name="favorite_color" value="">
    <label for="favorite-color-r">
        <input type="radio" name="favorite_color" value="r" style="color:red;" id="favorite-color-r">
        Red
    </label>
    <label for="favorite-color-u">
        <input type="radio" name="favorite_color" value="u" style="color:blue;" id="favorite-color-u">
        Blue
    </label>
    <label for="favorite-color-g">
        <input type="radio" name="favorite_color" value="g" style="color:green;" id="favorite-color-g">
        Green
    </label>

.. _create-select-picker:

選択ピッカーの作成
~~~~~~~~~~~~~~~~~~

.. php:method:: select(string $fieldName, array $options, array $attributes)

* ``$fieldName`` - ``'Modelname.fieldname'`` の形式のフィールド名。
  これは、 ``select`` 要素の ``name`` 属性を提供します。
* ``$options`` - 選択ピッカーの項目のリストを含むオプション配列。
  この配列がない場合、メソッドは、中に ``option`` 要素が一つもない空の
  ``select`` HTML 要素のみを生成します。
* ``$attributes`` - :ref:`general-control-options` または
  :ref:`checkbox-radio-select-options` または select 特有のオプション (下記参照)と、
  有効な HTML 属性を含むオプション配列。

``$options`` 配列の項目で設定された ``select`` 要素を作成します。
``$attributes['value']`` が提供された場合、指定された値を持つ HTML ``option`` 要素が
選択ピッカーが描画される際に選択されて表示されます。

デフォルトでは、 ``select`` は次のウィジェットテンプレートを使用します。 ::

    'select' => '<select name="{{name}}"{{attrs}}>{{content}}</select>'
    'option' => '<option value="{{value}}"{{attrs}}>{{text}}</option>'

以下も使用します。 ::

    'optgroup' => '<optgroup label="{{label}}"{{attrs}}>{{content}}</optgroup>'
    'selectMultiple' => '<select name="{{name}}[]" multiple="multiple"{{attrs}}>{{content}}</select>'

**選択ピッカーの属性**

* ``'multiple'`` - ``true`` をセットすると、選択ピッカー内で複数選択ができます。
  ``'checkbox'`` をセットすると、複数チェックボックスが代わりに作成されます。
  デフォルトは ``null`` です。

* ``'escape'`` - ブール値。 ``true`` の場合、選択ピッカー内の ``option`` 要素の内容は
  エンコードされた HTML エンティティーになります。デフォルトは ``true`` です。

* ``'val'`` - 選択ピッカーで値を事前に選択できるようにします。

* ``'disabled'`` - ``disabled`` 属性を制御します。
  ``true`` をセットした場合、選択ピッカー全体を無効にします。
  配列をセットした場合、配列に含まれている値を持つ特定の ``option`` のみ無効にします。

``$options`` 引数は、 ``select`` コントロールの ``option`` 要素の内容を手動で指定できます。

例::

    echo $this->Form->select('field', [1, 2, 3, 4, 5]);

出力結果:

.. code-block:: html

    <select name="field">
        <option value="0">1</option>
        <option value="1">2</option>
        <option value="2">3</option>
        <option value="3">4</option>
        <option value="4">5</option>
    </select>

``$options`` の配列はキーと値のペアとしても指定することができます。

例::

    echo $this->Form->select('field', [
        'Value 1' => 'Label 1',
        'Value 2' => 'Label 2',
        'Value 3' => 'Label 3'
    ]);

出力結果:

.. code-block:: html

    <select name="field">
        <option value="Value 1">Label 1</option>
        <option value="Value 2">Label 2</option>
        <option value="Value 3">Label 3</option>
    </select>

optgroup 付きで ``select`` を生成したい場合は、データを階層形式 (ネストした配列) で渡すだけです。
これは複数のチェックボックスとラジオボタンでも機能しますが、 ``optgroup`` の代わりに
``fieldset`` 要素で囲みます。

例::

    $options = [
        'Group 1' => [
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2'
        ],
        'Group 2' => [
            'Value 3' => 'Label 3'
        ]
    ];
    echo $this->Form->select('field', $options);

出力結果:

.. code-block:: html

    <select name="field">
        <optgroup label="Group 1">
            <option value="Value 1">Label 1</option>
            <option value="Value 2">Label 2</option>
        </optgroup>
        <optgroup label="Group 2">
            <option value="Value 3">Label 3</option>
        </optgroup>
    </select>

``option`` タグ内で HTML 属性を生成するには::

    $options = [
        [ 'text' => 'Description 1', 'value' => 'value 1', 'attr_name' => 'attr_value 1' ],
        [ 'text' => 'Description 2', 'value' => 'value 2', 'attr_name' => 'attr_value 2' ],
        [ 'text' => 'Description 3', 'value' => 'value 3', 'other_attr_name' => 'other_attr_value' ],
    ];
    echo $this->Form->select('field', $options);

出力結果:

.. code-block:: html

    <select name="field">
        <option value="value 1" attr_name="attr_value 1">Description 1</option>
        <option value="value 2" attr_name="attr_value 2">Description 2</option>
        <option value="value 3" other_attr_name="other_attr_value">Description 3</option>
    </select>

**属性による選択ピッカーの制御**

``$attributes`` パラメーター内の特定のオプションを使用することにより、
``select()`` メソッドの特定の振る舞いを制御することができます。

* ``'empty'`` - ``$attributes`` 引数の中で ``'empty'`` キーを ``true`` にセットすると
  (デフォルトの値は ``false``)、ドロップダウンリストの先頭に空の値の空白オプションを追加できます。

  例::

      $options = ['M' => 'Male', 'F' => 'Female'];
      echo $this->Form->select('gender', $options, ['empty' => true]);

  出力結果:

  .. code-block:: html

      <select name="gender">
          <option value=""></option>
          <option value="M">Male</option>
          <option value="F">Female</option>
      </select>

* ``'escape'`` - ``select()`` メソッドは  ``'escape'`` という属性が使用でき、
  ブール値を受け取り、HTML エンティティーに select オプションの内容をエンコードするかどうかを決定します。

  例::

      // これで、各オプション要素の内容の HTML エンコードを止められます
      $options = ['M' => 'Male', 'F' => 'Female'];
      echo $this->Form->select('gender', $options, ['escape' => false]);

* ``'multiple'`` - ``true`` にセットすると、選択ピッカーは複数選択ができます。

  例::

      echo $this->Form->select('field', $options, ['multiple' => true]);

  または、関連するチェックボックスのリストを出力するために
  ``'multiple'`` を ``'checkbox'`` に設定します。 ::

    $options = [
        'Value 1' => 'Label 1',
        'Value 2' => 'Label 2'
    ];
    echo $this->Form->select('field', $options, [
        'multiple' => 'checkbox'
    ]);

  出力結果:

  .. code-block:: html

      <input name="field" value="" type="hidden">
      <div class="checkbox">
        <label for="field-1">
         <input name="field[]" value="Value 1" id="field-1" type="checkbox">
         Label 1
         </label>
      </div>
      <div class="checkbox">
         <label for="field-2">
         <input name="field[]" value="Value 2" id="field-2" type="checkbox">
         Label 2
         </label>
      </div>

* ``'disabled'`` - このオプションを設定して、すべてまたは一部の ``select`` の ``option`` 項目を
  無効にすることができます。すべての項目を無効にするには、 ``'disabled'`` に ``true`` を
  設定します。特定の項目のみを無効にするには、無効にする項目をキーに含む配列を ``'disabled'`` に
  設定してください。

  すべてのチェックボックスを無効にするには disabled を ``true`` にします。

  例::

      $options = [
          'M' => 'Masculine',
          'F' => 'Feminine',
          'N' => 'Neuter'
      ];
      echo $this->Form->select('gender', $options, [
          'disabled' => ['M', 'N']
      ]);

  出力結果:

  .. code-block:: html

      <select name="gender">
          <option value="M" disabled="disabled">Masculine</option>
          <option value="F">Feminine</option>
          <option value="N" disabled="disabled">Neuter</option>
      </select>

  このオプションは ``'multiple'`` が ``'checkbox'`` に設定されている場合にも有効です。 ::

    $options = [
        'Value 1' => 'Label 1',
        'Value 2' => 'Label 2'
    ];
    echo $this->Form->select('field', $options, [
        'multiple' => 'checkbox',
        'disabled' => ['Value 1']
    ]);

  出力結果:

  .. code-block:: html

       <input name="field" value="" type="hidden">
       <div class="checkbox">
          <label for="field-1">
          <input name="field[]" disabled="disabled" value="Value 1" type="checkbox">
          Label 1
          </label>
       </div>
       <div class="checkbox">
          <label for="field-2">
          <input name="field[]" value="Value 2" id="field-2" type="checkbox">
          Label 2
          </label>
       </div>

ファイル入力の作成
------------------

.. php:method:: file(string $fieldName, array $options)

* ``$fieldName`` - ``'Modelname.fieldname'`` の形式のフィールド名。
* ``$options`` - :ref:`general-control-options` や有効な HTML 属性を含むオプション配列。

フォームの中にファイルアップロードフィールドを作成します。
デフォルトで使用されるウィジェットテンプレートは::

    'file' => '<input type="file" name="{{name}}"{{attrs}}>'

フォームにファイルアップロードフィールドを追加するためには、まずフォームの enctype に
``'multipart/form-data'`` がセットされていることを確認してください。

まずは、次のように ``create()`` メソッドを使用してください。 ::

    echo $this->Form->create($document, ['enctype' => 'multipart/form-data']);
    // または
    echo $this->Form->create($document, ['type' => 'file']);

次にフォームのビューファイルに以下のいずれかを追加します。 ::

    echo $this->Form->control('submittedfile', [
        'type' => 'file'
    ]);

    // または
    echo $this->Form->file('submittedfile');

.. note::

    HTML 自体の制限により、'file' タイプの入力フィールドにデフォルト値を設定することはできません。
    フォームを表示するたびに、内部の値は空に設定されます。

フォームの送信に際して file フィールドは、フォームを受信しようとしているスクリプトに対して拡張された
data 配列を提供します。

CakePHP が Windows サーバー上にインストールされている場合、上記の例について、
送信されるデータ配列内の値は次のように構成されます
(Unix 環境では ``'tmp_name'`` が異なったパスになります)。 ::

    $this->request->data['submittedfile']

    // 次の配列を含みます:
    [
        'name' => 'conference_schedule.pdf',
        'type' => 'application/pdf',
        'tmp_name' => 'C:/WINDOWS/TEMP/php1EE.tmp',
        'error' => 0, // Windows の場合、文字列になります。
        'size' => 41737,
    ];

この配列は PHP 自身によって生成されます。PHP が file フィールドを通してデータを
どう処理しているのかについては、 `PHP マニュアルのファイルアップロードのセクションをご覧ください
<https://secure.php.net/features.file-upload>`_ 。

.. note::

    ``$this->Form->file()`` を使う場合、 ``$this->Form->create()`` の中の ``'type'``
    オプションを ``'file'`` に設定することで、フォームのエンコーディングのタイプを設定できます。

日付と時刻に関するコントロールの作成
------------------------------------

日時関連の方法は、多くの共通の特性とオプションを共有しているため、
このサブセクションにまとめられています。

.. _datetime-options:

日付と時刻のコントロールの共通オプション
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

これらのオプションは、日付と時刻に関するコントロールに共通します。

* ``'empty'`` - ``true`` の場合、余分の空の ``option`` HTML 要素が、
  ``select`` の中のリストの先頭に追加されます。文字列の場合、
  その文字列は空の要素として表示されます。デフォルトは ``true`` です。

* ``'default'`` | ``value`` - 2つのいずれかを使用して、
  フィールドに表示されるデフォルト値を設定します。
  フィールド名と一致する ``$this->request->getData()`` の値は、この値を上書きします。
  デフォルトが指定されていない場合、 ``time()`` が使用されます。

* ``'year', 'month', 'day', 'hour', 'minute', 'second', 'meridian'`` -
  これらのオプションを使用すると、コントロール要素が生成されるかどうか制御できます。
  これらのオプションを ``false`` にセットすることにより、特定の選択ピッカーの生成を
  無効にすることができます (デフォルトでは、使用されたメソッドの中で描画されます) 。
  さらに、各オプションでは、HTML 属性を指定した ``select`` 要素に渡すことができます。

.. _date-options:

日付関連コントロールのオプション
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

これらのオプションは、日付関連のメソッド、つまり ``year()`` 、 ``month()`` 、
``day()`` 、 ``dateTime()`` そして ``date()`` に関連しています。

* ``'monthNames'`` - ``false`` の場合は、選択ピッカーの月の表示で
  テキストの代わりに2桁の数字が使用されます。配列をセットした場合
  (例 ``['01' => 'Jan', '02' => 'Feb', ...]``)、指定された配列が使用されます。

* ``'minYear'`` - 年の select フィールドで使用される最小の年。

* ``'maxYear'`` - 年の select フィールドで使用される最大の年。

* ``'orderYear'`` - 年選択ピッカー内の年の値の順序。
  利用可能な値は ``'asc'`` と ``'desc'`` 。デフォルトは ``'desc'`` です。

.. _time-options:

時刻関連コントロールのオプション
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

これらのオプションは、時刻関連のメソッド、 ``hour()`` 、 ``minute()`` 、
``second()`` 、 ``dateTime()`` そして ``time()`` に関連しています。

* ``'interval'`` - 分選択ピッカーの ``option`` 要素の中に表示される分の値の間隔。
  デフォルトは 1 です。

* ``'round'`` - 値が一定の間隔にきちんと収まらないときに、いずれかの方向に丸めるようにしたい場合は、
  ``up`` または ``down`` に設定します。デフォルトは ``null`` です。

* ``timeFormat`` - ``dateTime()`` と ``time()`` に適用されます。
  選択ピッカーで使用する時刻の書式は、 ``12`` または ``24`` のいずれかです。
  このオプションに ``24`` 以外の何かをセットした場合、書式は自動的に ``12`` がセットされ、
  秒選択ピッカーの右側に ``meridian`` 選択ピッカーが自動的に表示されます。
  デフォルトは 24 です。

* ``format`` - ``hour()`` に適用されます。
  選択ピッカーで使用する時刻の書式は、 ``12`` または ``24`` のいずれかです。
  ``12`` をセットした場合、 ``meridian`` 選択ピッカーは自動的に表示されません。
  それを追加するか、フォームコンテキストから適切な期間を推論する方法を提供するかは、
  あなた次第です。デフォルトは 24 です。

* ``second`` - ``dateTime()`` と ``time()`` に適用されます。
  秒を有効にするために ``true`` に設定します。デフォルトは ``false`` です。

日時入力の作成
~~~~~~~~~~~~~~

.. php:method:: dateTime($fieldName, $options = [])

* ``$fieldName`` - ``select`` 要素の HTML ``name`` 属性のプレフィックスとして使用される文字列。
* ``$options`` - :ref:`general-control-options` または日時特有のオプション (下記参照)、
  そして有効な HTML 属性を含むオプション配列。

日付と時刻の ``select`` 要素のセットを生成します。

コントロールの順序、およびコントロール間の要素/内容を制御するには、 ``dateWidget``
テンプレートを上書きします。デフォルトで ``dateWidget`` テンプレートは::

    {{year}}{{month}}{{day}}{{hour}}{{minute}}{{second}}{{meridian}}

オプションを指定せずにメソッドを呼び出すと、デフォルトでは、年（4桁）、月（英語の完全名）、
曜日（数値）、時間（数値）、分（数値）の5つの選択ピッカーが生成されます。

例::

    <?= $this->form->dateTime('registered') ?>

出力結果:

.. code-block:: html

    <select name="registered[year]">
        <option value="" selected="selected"></option>
        <option value="2022">2022</option>
        ...
        <option value="2012">2012</option>
    </select>
    <select name="registered[month]">
        <option value="" selected="selected"></option>
        <option value="01">January</option>
        ...
        <option value="12">December</option>
    </select>
    <select name="registered[day]">
        <option value="" selected="selected"></option>
        <option value="01">1</option>
        ...
        <option value="31">31</option>
    </select>
    <select name="registered[hour]">
        <option value="" selected="selected"></option>
        <option value="00">0</option>
        ...
        <option value="23">23</option>
    </select>
    <select name="registered[minute]">
        <option value="" selected="selected"></option>
        <option value="00">00</option>
        ...
        <option value="59">59</option>
    </select>

特定の select ボックスにカスタムクラス/属性を含む datetime コントロールを作成するには、
``$options`` 引数の中で各コンポーネントのオプションの配列として指定します。

例::

    echo $this->Form->dateTime('released', [
        'year' => [
            'class' => 'year-classname',
        ],
        'month' => [
            'class' => 'month-class',
            'data-type' => 'month',
        ],
    ]);

これは、次の2つの選択ピッカーを作成します。

.. code-block:: html

    <select name="released[year]" class="year-class">
        <option value="" selected="selected"></option>
        <option value="00">0</option>
        <option value="01">1</option>
        <!-- .. 以下省略 .. -->
    </select>
    <select name="released[month]" class="month-class" data-type="month">
        <option value="" selected="selected"></option>
        <option value="01">January</option>
        <!-- .. 以下省略 .. -->
    </select>

日付コントロールの作成
~~~~~~~~~~~~~~~~~~~~~~
.. php:method:: date($fieldName, $options = [])

* ``$fieldName`` - ``select`` 要素の HTML ``name`` 属性のプレフィックスとして使用される文字列。
* ``$options`` - :ref:`general-control-options` 、 :ref:`datetime-options` 、
  適用可能な :ref:`time-options` 、そして有効な HTML 属性を含むオプション配列。

デフォルトでは、年（4桁）、月（英語の完全名）、日（数値）の値が設定された
3つの選択ピッカーを作成します。

生成された ``select`` 要素をさらに制御するには、オプションを追加します。

例::

    // 今年が 2017 年だと仮定すると、これは日ピッカーを無効にし、年ピッカーの空の
    // オプションを削除し、最低年を制限し、年の HTML 属性を追加し、
    // 月の文字列の 'empty' オプションを追加し、月を数値に変更します。
    <?php
        echo $this->Form->date('registered', [
            'minYear' => 2018,
            'monthNames' => false,
            'empty' => [
                'year' => false,
                'month' => 'Choose month...'
            ],
            'day' => false,
            'year' => [
                'class' => 'cool-years',
                'title' => 'Registration Year'
            ]
        ]);
    ?>

出力結果:

.. code-block:: html

    <select class= "cool-years" name="registered[year]" title="Registration Year">
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        ...
        <option value="2018">2018</option>
    </select>
    <select name="registered[month]">
        <option value="" selected="selected">Choose month...</option>
        <option value="01">1</option>
        ...
        <option value="12">12</option>
    </select>

時間コントロールの作成
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: time($fieldName, $options = [])

* ``$fieldName`` - ``select`` 要素の HTML ``name`` 属性のプレフィックスとして使用される文字列。
* ``$options`` - :ref:`general-control-options` 、 :ref:`datetime-options` 、
  適用可能な :ref:`time-options` 、そして有効な HTML 属性を含むオプション配列。

デフォルトでは、 24 時間と 60 分の値が入力された２つの ``select`` 要素 (``hour`` と ``minute``)
を生成します。さらに、HTML 属性は、特定のコンポーネントごとに ``$options`` で指定することができます。
``$options['empty']`` が ``false`` の場合、選択ピッカーは空のデフォルトオプションを含みません。

たとえば、15 分単位で選択できる時間範囲を作成し、各 select ボックスにクラスを適用するには、
次のようにします。 ::

    echo $this->Form->time('released', [
        'interval' => 15,
        'hour' => [
            'class' => 'foo-class',
        ],
        'minute' => [
            'class' => 'bar-class',
        ],
    ]);

これは、次の2つの選択ピッカーを作成します。

.. code-block:: html

    <select name="released[hour]" class="foo-class">
        <option value="" selected="selected"></option>
        <option value="00">0</option>
        <option value="01">1</option>
        <!-- .. 中略 .. -->
        <option value="22">22</option>
        <option value="23">23</option>
    </select>
    <select name="released[minute]" class="bar-class">
        <option value="" selected="selected"></option>
        <option value="00">00</option>
        <option value="15">15</option>
        <option value="30">30</option>
        <option value="45">45</option>
    </select>

年コントロールの作成
~~~~~~~~~~~~~~~~~~~~

.. php:method:: year(string $fieldName, array $options = [])

* ``$fieldName`` - ``select`` 要素の HTML ``name`` 属性のプレフィックスとして使用される文字列。
* ``$options`` - :ref:`general-control-options` 、 :ref:`datetime-options` 、
  適用可能な :ref:`time-options` 、そして有効な HTML 属性を含むオプション配列。

``minYear`` から ``maxYear`` （これらのオプションが提供されているとき）、
または今日から数えて-5年から+5年までの値を持つ ``select`` 要素を作成します。
さらに、HTML 属性は、 ``$options`` で指定することができます。
``$options ['empty']`` が ``false`` の場合、選択ピッカーはリスト内に空の項目を含みません。

たとえば、2000 年から今年までの年を作成するには、次のようにします。 ::

    echo $this->Form->year('purchased', [
        'minYear' => 2000,
        'maxYear' => date('Y')
    ]);

2009 年だった場合は、次のようになるでしょう。

.. code-block:: html

    <select name="purchased[year]">
    <option value=""></option>
    <option value="2009">2009</option>
    <option value="2008">2008</option>
    <option value="2007">2007</option>
    <option value="2006">2006</option>
    <option value="2005">2005</option>
    <option value="2004">2004</option>
    <option value="2003">2003</option>
    <option value="2002">2002</option>
    <option value="2001">2001</option>
    <option value="2000">2000</option>
    </select>

月コントロールの作成
~~~~~~~~~~~~~~~~~~~~

.. php:method:: month(string $fieldName, array $attributes)

* ``$fieldName`` - ``select`` 要素の HTML ``name`` 属性のプレフィックスとして使用される文字列。
* ``$attributes`` - :ref:`general-control-options` 、 :ref:`datetime-options` 、
  適用可能な :ref:`time-options` 、そして有効な HTML 属性を含むオプション配列。

月の名前を列挙した ``select`` 要素を作成します。

例::

    echo $this->Form->month('mob');

出力結果:

.. code-block:: html

    <select name="mob[month]">
    <option value=""></option>
    <option value="01">January</option>
    <option value="02">February</option>
    <option value="03">March</option>
    <option value="04">April</option>
    <option value="05">May</option>
    <option value="06">June</option>
    <option value="07">July</option>
    <option value="08">August</option>
    <option value="09">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>
    </select>

``'monthNames'`` 属性に独自の月の名前を配列で設定することもできます。
また ``false`` を指定すると、月が数字で表示されます。

例::

  echo $this->Form->month('mob', ['monthNames' => false]);

.. note::

    デフォルトの月は、CakePHP の :doc:`/core-libraries/internationalization-and-localization`
    機能でローカライズすることができます。

日コントロールの作成
~~~~~~~~~~~~~~~~~~~~

.. php:method:: day(string $fieldName, array $attributes)

* ``$fieldName`` - ``select`` 要素の HTML ``name`` 属性のプレフィックスとして使用される文字列。
* ``$attributes`` - :ref:`general-control-options` 、 :ref:`datetime-options` 、
  適用可能な :ref:`time-options` 、そして有効な HTML 属性を含むオプション配列。

（数字の）日を列挙する ``select`` 要素を作成します。

あなたの選択した指示テキストで空の ``option`` を作成するには（たとえば、
最初のオプションは 'Day'）、 ``'empty'`` パラメーターにテキストを指定できます。

例::

    echo $this->Form->day('created', ['empty' => 'Day']);

出力結果:

.. code-block:: html

    <select name="created[day]">
        <option value="" selected="selected">Day</option>
        <option value="01">1</option>
        <option value="02">2</option>
        <option value="03">3</option>
        ...
        <option value="31">31</option>
    </select>

時間コントロールの作成
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: hour(string $fieldName, array $attributes)

* ``$fieldName`` - ``select`` 要素の HTML ``name`` 属性のプレフィックスとして使用される文字列。
* ``$attributes`` - :ref:`general-control-options` 、 :ref:`datetime-options` 、
  適用可能な :ref:`time-options` 、そして有効な HTML 属性を含むオプション配列。

時を列挙した ``select`` 要素を作成します。

``format`` オプションを使用して、12 時間または 24 時間のピッカーを作成することができます。 ::

    echo $this->Form->hour('created', [
        'format' => 12
    ]);
    echo $this->Form->hour('created', [
        'format' => 24
    ]);

分コントロールの作成
~~~~~~~~~~~~~~~~~~~~

.. php:method:: minute(string $fieldName, array $attributes)

* ``$fieldName`` - ``select`` 要素の HTML ``name`` 属性のプレフィックスとして使用される文字列。
* ``$attributes`` - :ref:`general-control-options` 、 :ref:`datetime-options` 、
  適用可能な :ref:`time-options` 、そして有効な HTML 属性を含むオプション配列。

分の値を列挙した ``select`` 要素を作成します。
``interval`` オプションを使用して特定の値のみを含む選択ピッカーを作成することができます。

たとえば、10 分ずつ増やしたい場合は、次のようにします。 ::

    // ビューテンプレートファイルの中で
    echo $this->Form->minute('arrival', [
        'interval' => 10
    ]);

これは、以下を出力します。

.. code-block:: html

    <select name="arrival[minute]">
        <option value="" selected="selected"></option>
        <option value="00">00</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
    </select>

午前と午後コントロールの作成
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: meridian(string $fieldName, array $attributes)

* ``$fieldName`` - ``select`` 要素の HTML ``name`` 属性のプレフィックスとして使用される文字列。
* ``$attributes`` - :ref:`general-control-options` と有効な HTML 属性を含むオプション配列。

'am' と 'pm' を列挙した ``select`` 要素を生成します。これは、時間の書式を
``24`` の代わりに ``12`` をセットした時に便利で、時間が属する期間を指定することができます。

.. _create-label:

ラベルの作成
============

.. php:method:: label(string $fieldName, string $text, array $options)

* ``$fieldName`` - ``'Modelname.fieldname'`` の形式のフィールド名。
* ``$text`` - ラベルの見出しテキストを指定するためのオプション文字列。
* ``$options`` - オプション。:ref:`general-control-options` と有効な HTML 属性を含む
  文字列または配列。

``label`` 要素を作成します。引数の ``$fieldName`` は、要素の HTML ``for`` 属性を
生成するために使われます。 ``$text`` が未定義の場合、 ``$fieldName`` はラベルの
``text`` 属性を変えるために使われます。

例::

    echo $this->Form->label('User.name');
    echo $this->Form->label('User.name', 'Your username');

出力結果:

.. code-block:: html

    <label for="user-name">Name</label>
    <label for="user-name">Your username</label>

``$options`` に文字列をセットした場合、クラス名として使われます。 ::

    echo $this->Form->label('User.name', null, ['id' => 'user-label']);
    echo $this->Form->label('User.name', 'Your username', 'highlight');

出力結果:

.. code-block:: html

    <label for="user-name" id="user-label">Name</label>
    <label for="user-name" class="highlight">Your username</label>

エラーの表示と確認
==================

FormHelper は、フィールドエラーを簡単にチェックしたり、必要に応じてカスタマイズされた
エラーメッセージを表示できる、いくつかのメソッドを公開しています。

エラーの表示
------------

.. php:method:: error(string $fieldName, mixed $text, array $options)

* ``$fieldName`` - ``'Modelname.fieldname'`` の形式のフィールド名。
* ``$text`` - オプション。エラーメッセージを提供する文字列または配列。
  配列の場合、 キー名 => メッセージのハッシュになります。デフォルトは ``null`` 。
* ``$options`` - ``'escape'`` キーのブール値のみを含みます。これは、
  エラーメッセージの内容を HTML エスケープするかどうかを定義します。デフォルトは ``true`` です。

検証エラーが発生した際に、与えられたフィールドの ``$text`` で指定された、
検証エラーメッセージを表示します。フィールドの ``$text`` がない場合、
そのフィールドのデフォルトの検証エラーメッセージが使用されます。

次のテンプレートウィジェットを使います。 ::

    'error' => '<div class="error-message">{{content}}</div>'
    'errorList' => '<ul>{{content}}</ul>'
    'errorItem' => '<li>{{text}}</li>'

``'errorList'`` と ``'errorItem'`` テンプレートは、１つのフィールドに複数の
エラーメッセージを書式化するために使用されます。

例::

    // TicketsTable に 'notEmpty' 検証ルールがある場合:
    public function validationDefault(Validator $validator)
    {
        $validator
            ->requirePresence('ticket', 'create')
            ->notEmpty('ticket');
    }

    // そして、 Templates/Tickets/add.ctp の中が次のような場合:
    echo $this->Form->text('ticket');

    if ($this->Form->isFieldError('ticket')) {
        echo $this->Form->error('ticket', 'Completely custom error message!');
    }

もし、 *Ticket* フィールドの値を指定せずにフォームの *Submit* ボタンをクリックした場合、
フォームは次のように出力されます。
  
.. code-block:: html

    <input name="ticket" class="form-error" required="required" value="" type="text">
    <div class="error-message">Completely custom error message!</div>

.. note::

    :php:meth:`~Cake\\View\\Helper\\FormHelper::control()` を使用している時、
    デフォルトではエラーは描画されますので、 ``isFieldError()`` を使用したり、
    手動で ``error()`` を呼び出す必要はありません。

.. tip::

    あるモデルのフィールドを使用して、 ``control()`` で複数のフォームフィールドを生成し、
    それぞれ同じ検証エラーメッセージを表示させたい場合、それぞれの
    :ref:`検証ルール <creating-validators>` の中でカスタムエラーメッセージを
    定義する方が良いでしょう。

.. TODO:: Add examples.

エラーの確認
------------

.. php:method:: isFieldError(string $fieldName)

* ``$fieldName`` - ``'Modelname.fieldname'`` の形式のフィールド名。

指定された ``$fieldName`` に有効な検証エラーがある場合は ``true`` を返します。
そうでなければ ``fales`` を返します。

例::

    if ($this->Form->isFieldError('gender')) {
        echo $this->Form->error('gender');
    }

ボタンと submit 要素の作成
==========================

Submit 要素の作成
-----------------

.. php:method:: submit(string $caption, array $options)

* ``$caption`` - ボタンのテキスト見出しまたは画像へのパスを提供するオプション文字列。
  デフォルトは、 ``'Submit'`` です。
* ``$options`` - :ref:`general-control-options` 、または submit 特有のオプション
  (下記参照) 。

``$caption`` を値としてもつ ``submit`` タイプの ``input`` 要素を作成します。
指定された ``$caption`` が画像の URL である場合 (つまり、 '://' を含む文字列または、拡張子
'.jpg, .jpe, .jpeg, .gif' を含む場合)、画像の送信ボタンが生成され、指定された画像が
存在する場合は、それを使用します。最初の文字が '/' の場合、画像は *webroot* からの
相対パスになり、最初の文字が '/' ではない場合、画像は *webroot/img* からの相対パスになります。

デフォルトで次のウィジェットテンプレートを使用します。 ::

    'inputSubmit' => '<input type="{{type}}"{{attrs}}/>'
    'submitContainer' => '<div class="submit">{{content}}</div>'

**Submit のオプション**

* ``'type'`` - リセットボタンを生成するためにこのオプションに ``'reset'`` を設定します。
  デフォルトは ``'submit'`` です。

* ``'templateVars'`` - input 要素や、そのコンテナーにテンプレート変数を追加するために、
  この配列を設定します。

* その他の指定された属性は ``input`` 要素に割り当てられます。

例::

    echo $this->Form->submit('Click me');

出力結果:

.. code-block:: html

    <div class="submit"><input value="Click me" type="submit"></div>

見出しテキストの代わりに見出しパラメーターとして画像への相対 URL または
絶対 URL を渡すことができます。 ::

    echo $this->Form->submit('ok.png');

出力結果:

.. code-block:: html

    <div class="submit"><input type="image" src="/img/ok.png"></div>

submit 入力は、基本的なテキストやイメージが必要な場合に便利です。
より複雑なボタンの内容が必要な場合は、 ``button()`` を使用してください。

ボタン要素の作成
----------------

.. php:method:: button(string $title, array $options = [])

* ``$title`` - ボタンの見出しテキストを提供する必須の文字列。
* ``$options`` - :ref:`general-control-options` やボタン特有のオプション (下記参照)と
  有効な HTML 属性を含むオプション配列。

指定されたタイトルと ``'button'`` のデフォルトタイプの HTML ボタンを作成します。

**ボタンのオプション**

* ``$options['type']`` - これを設定すると、次の3つの button タイプのどれかが出力されます。

  #. ``'submit'`` - ``$this->Form->submit()`` と同様に送信ボタンを作成します。
     しかしながら、 ``submit()`` のように ``div`` の囲い込みは生成しません。
     これがデフォルトのタイプです。
  #. ``'reset'`` - フォームのリセットボタンを作成します。
  #. ``'button'`` - 標準の押しボタンを作成します。

* ``$options['escape']`` - ブール値。 ``true`` をセットした場合、
  ``$title`` で指定された値を HTML エンコードします。デフォルトは ``false`` です。

例::

    echo $this->Form->button('ボタン');
    echo $this->Form->button('別のボタン', ['type' => 'button']);
    echo $this->Form->button('フォームのリセット', ['type' => 'reset']);
    echo $this->Form->button('フォームの送信', ['type' => 'submit']);

出力結果:

.. code-block:: html

    <button type="submit">ボタン</button>
    <button type="button">別のボタン</button>
    <button type="reset">フォームのリセット</button>
    <button type="submit">フォームの送信</button>

``'escape'`` オプションの使用例::

    // エスケープされた HTML を描画します。
    echo $this->Form->button('<em>Submit Form</em>', [
        'type' => 'submit',
        'escape' => true
    ]);

フォームを閉じる
================

.. php:method:: end($secureAttributes = [])

* ``$secureAttributes`` - オプション。SecurityComponent 用に生成された非表示の
  input 要素に HTML 属性として渡されるセキュアな属性を提供できます。

``end()`` は、フォームを閉じて完成します。
多くの場合、 ``end()`` は終了タグだけを出力しますが、 ``end()`` を使うと、
FormHelper が :php:class:`Cake\\Controller\\Component\\SecurityComponent` に必要な
hidden フォーム要素を挿入できるようになります。

.. code-block:: php

    <?= $this->Form->create(); ?>

    <!-- フォーム要素はここにあります -->

    <?= $this->Form->end(); ?>

生成された hidden 入力に属性を追加する必要がある場合は、
``$secureAttributes`` 引数を使用できます。 ::

    echo $this->Form->end(['data-type' => 'hidden']);

出力結果:

.. code-block:: html

    <div style="display:none;">
        <input type="hidden" name="_Token[fields]" data-type="hidden"
            value="2981c38990f3f6ba935e6561dc77277966fabd6d%3AAddresses.id">
        <input type="hidden" name="_Token[unlocked]" data-type="hidden"
            value="address%7Cfirst_name">
    </div>

.. note::

    アプリケーションで :php:class:`Cake\\Controller\\Component\\SecurityComponent`
    を使用している場合は、必ずフォームを ``end()`` で終わらせてください。

単独のボタンと POST リンクの作成
================================

POST ボタンの作成
-----------------

.. php:method:: postButton(string $title, mixed $url, array $options = [])

* ``$title`` - ボタンの見出しテキストを提供する必須の文字列。
  デフォルトでは HTML エンコードされません。
* ``$url`` - 文字列や配列として提供される URL。
* ``$options`` - :ref:`general-control-options` 、特定のオプション（下記参照）と
  有効な HTML 属性を含むオプション配列。

デフォルトでは、POST で送信する ``<form>`` 要素で囲まれた ``<button>`` タグを作成します。
また、デフォルトでは、SecurityComponent のために非表示入力フィールドも生成します。

**POST ボタンのオプション**

* ``'data'`` - hidden 入力に渡すキーと値の配列。

* ``'method'`` - 使用するリクエスト方法。例えば、 ``'delete'`` をセットすると、
  HTTP/1.1 DELETE リクエストをシミュレートします。デフォルトは ``'post'`` です。

* ``'form'`` - ``FormHelper::create()`` に渡す任意のオプションの配列。

* また、 ``postButton()`` メソッドは、 ``button()`` メソッドで有効なオプションも受け付けます。

例::

    // Templates/Tickets/index.ctp の中で
    <?= $this->Form->postButton('Delete Record', ['controller' => 'Tickets', 'action' => 'delete', 5]) ?>

出力結果:

.. code-block:: html

    <form method="post" accept-charset="utf-8" action="/Rtools/tickets/delete/5">
        <div style="display:none;">
            <input name="_method" value="POST" type="hidden">
        </div>
        <button type="submit">Delete Record</button>
        <div style="display:none;">
            <input name="_Token[fields]" value="186cfbfc6f519622e19d1e688633c4028229081f%3A" type="hidden">
            <input name="_Token[unlocked]" value="" type="hidden">
            <input name="_Token[debug]" value="%5B%22%5C%2FRtools%5C%2Ftickets%5C%2Fdelete%5C%2F1%22%2C%5B%5D%2C%5B%5D%5D" type="hidden">
        </div>
    </form>

このメソッドは ``form`` 要素を作成します。
なので、開かれたフォームの中でこのメソッドを使用しないでください。
代わりに :php:meth:`Cake\\View\\Helper\\FormHelper::submit()` または
:php:meth:`Cake\\View\\Helper\\FormHelper::button()` を使用して、
開かれたフォームの中でボタンを作成してください。

POST リンクの作成
-----------------

.. php:method:: postLink(string $title, mixed $url = null, array $options = [])

* ``$title`` - ``<a>`` タグに囲まれたテキストを提供する必須の文字列。
* ``$url`` - オプション。フォームの URL (相対 URL 、または ``http://`` で始まる外部 URL)
  を含む文字列または配列。
* ``$options`` - :ref:`general-control-options` 、特有のオプション（下記参照）と
  有効な HTML 属性を含むオプション配列。

HTML リンクを作成しますが、指定した方法 (デフォルトは POST)で URL にアクセスします。
ブラウザーで有効にするには JavaScript が必要です。

**POST リンクのオプション**

* ``'data'`` - hidden 入力に渡すキーと値の配列。

* ``'method'`` - 使用するリクエスト方法。例えば、 ``'delete'`` をセットすると、
  HTTP/1.1 DELETE リクエストをシミュレートします。デフォルトは ``'post'`` です。

* ``'confirm'`` - クリック時に表示される確認メッセージ。デフォルトは ``null`` です。

* ``'block'`` - ビューブロック ``'postLink'`` へフォームの追加するために
  このオプションに ``true`` をセットしたり、カスタムブロック名を指定します。
  デフォルトは ``null`` です。

* また、 ``postLink`` メソッドは、 ``link()`` メソッドの有効なオプションを受け付けます。

このメソッドは ``<form>`` 要素を作成します。
このメソッドを既存のフォームの中で使いたい場合は、 ``block`` オプションを使用して、
新しいフォームがメインフォームの外部でレンダリング可能な
:ref:`ビューブロック <view-blocks>` に設定されるようにする必要があります。

あなたが探しているものがフォームを送信するボタンであれば、代わりに
:php:meth:`Cake\\View\\Helper\\FormHelper::button()` または
:php:meth:`Cake\\View\\Helper\\FormHelper::submit()` を使用してください。

.. note::

    開いているフォームの中に postLink を入れないように注意してください。
    代わりに、 ``block`` オプションを使ってフォームを
    :ref:`ビューブロック <view-blocks>` にバッファリングしてください。

.. _customizing-templates:

FormHelper で使用するテンプレートのカスタマイズ
===============================================

CakePHP の多くのヘルパーと同じように、FormHelper は、
作成する HTML をフォーマットするための文字列テンプレートを使用しています。
既定のテンプレートは、合理的な既定値のセットを意図していますが、
アプリケーションに合わせてテンプレートをカスタマイズする必要があるかもしれません。

ヘルパーが読み込まれたときにテンプレートを変更するには、コントローラーにヘルパーを含めるときに
``templates`` オプションを設定することができます。 ::

    // View クラスの中で
    $this->loadHelper('Form', [
        'templates' => 'app_form',
    ]);

これは、 **config/app_form.php** の中のタグを読み込みます。
このファイルには、名前で索引付けされたテンプレートの配列が含まれている必要があります。 ::

    // config/app_form.php の中で
    return [
        'inputContainer' => '<div class="form-control">{{content}}</div>',
    ];

定義したテンプレートは、ヘルパーに含まれるデフォルトのテンプレートを置き換えます。
置き換えられていないテンプレートは引き続きデフォルト値を使用します。
``setTemplates()`` メソッドを使って実行時にテンプレートを変更することもできます。 ::

    $myTemplates = [
        'inputContainer' => '<div class="form-control">{{content}}</div>',
    ];
    $this->Form->setTemplates($myTemplates);
    // 3.4 より前
    $this->Form->templates($myTemplates);

.. warning::

    パーセント記号 (``%``) を含むテンプレート文字列には特別な注意が必要です。
    この文字の先頭に ``%%`` のようにもう一つパーセンテージを付ける必要があります。
    なぜなら、内部的なテンプレートは ``sprintf()`` で使用されるためにコンパイルされているからです。
    例: ``'<div style="width:{{size}}%%">{{content}}</div>'``

テンプレート一覧
----------------

デフォルトのテンプレートのリスト、それらのデフォルトのフォーマット、そして期待される変数は
`FormHelper API ドキュメント
<https://api.cakephp.org/3.x/class-Cake.View.Helper.FormHelper.html#%24_defaultConfig>`_
で見つけることができます。

異なるカスタムコントロールコンテナーの使用
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

これらのテンプレートに加えて、 ``control()`` メソッドはコントロールコンテナーごとに異なるテンプレートを
使用しようとします。たとえば、datetime コントロールを作成する場合、 ``datetimeContainer``
が存在する場合にはそれが使用されます。
そのコンテナーがない場合、 ``inputContainer`` テンプレートが使用されます。
例えば::

    // 独自の HTML で囲まれた radio を追加
    $this->Form->templates([
        'radioContainer' => '<div class="form-radio">{{content}}</div>'
    ]);

    // 独自の div で囲まれた radio セットを作成
    echo $this->Form->control('User.email_notifications', [
        'options' => ['y', 'n'],
        'type' => 'radio'
    ]);

異なるカスタムフォームグループの使用
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

コンテナーの制御と同様に、 ``control()`` メソッドはフォームグループごとに異なるテンプレートを
使用しようとします。フォームグループは、ラベルとコントロールの組み合わせです。
例えば、radio 入力を作成する時、 ``radioFormGroup`` が存在する場合、それが使用されます。
そのテンプレートが存在しない場合、デフォルトでは、ラベル＆入力の各セットは、
``formGroup`` テンプレートを使用して描画されます。

例::

    // 独自の radio フォームグループを追加
    $this->Form->setTemplates([
        'radioFormGroup' => '<div class="radio">{{label}}{{input}}</div>'
    ]);

テンプレートにテンプレート変数を追加
------------------------------------

カスタムテンプレートにテンプレートプレースホルダを追加し、
コントロールを生成するときにプレースホルダを設定することができます。

例::

    // help プレースホルダ付きでテンプレートを追加
    $this->Form->setTemplates([
        'inputContainer' => '<div class="input {{type}}{{required}}">
            {{content}} <span class="help">{{help}}</span></div>'
    ]);

    // help 変数を設定し入力を生成
    echo $this->Form->control('password', [
        'templateVars' => ['help' => '少なくとも 8 文字の長さ。']
    ]);

出力結果:

.. code-block:: html

    <div class="input password">
        <label for="password">
            Password
        </label>
        <input name="password" id="password" type="password">
        <span class="help">少なくとも 8 文字の長さ。</span>
    </div>

.. versionadded:: 3.1
    templateVars オプションは 3.1.0 で追加されました。

チェックボックスとラジオのラベル外への移動
------------------------------------------

デフォルトでは、CakePHP は、 ``control()`` で作成されたチェックボックスと
``control()`` と ``radio()`` の両方で作成されたラジオボタンをラベル要素内でネストします。
これにより、人気の CSS フレームワークとの統合に役立ちます。
ラベルの外に checkbox/radio 入力を配置する必要がある場合は、
テンプレートを変更することで行うことができます。 ::

    $this->Form->setTemplates([
        'nestingLabel' => '{{input}}<label{{attrs}}>{{text}}</label>',
        'formGroup' => '{{input}}{{label}}',
    ]);

これにより、ラジオボタンとチェックボックスがラベルの外側に描画されます。

フォーム全体の生成
==================

複数のコントロールの作成
------------------------

.. php:method:: controls(array $fields = [], $options = [])

* ``$fields`` - 生成するフィールドの配列。指定した各フィールドのカスタムタイプ、
  ラベル、その他のオプションを設定できます。
* ``$options`` - オプション。オプションの配列。有効なキーは:

  #. ``'fieldset'`` - filedset を無効にするために ``false`` を設定してください。
     空の配列を渡すと、fieldset は有効になります。
     HTML 属性として適用するパラメーターの配列を ``fieldset`` タグに渡すこともできます。
  #. ``legend`` - ``legend`` のテキストをカスタマイズするための文字列。
     生成された入力セットの legend を無効にするために ``false`` を設定してください。

``fieldset`` で囲まれた指定された一連のコントロールセットを生成します。
生成されたフィールドを含めることで指定できます。 ::

    echo $this->Form->controls([
        'name',
        'email'
    ]);

オプションを使用して legend のテキストをカスタマイズすることができます。 ::

    echo $this->Form->controls($fields, ['legend' => 'Update news post']);

``$fields`` パラメーターで追加のオプションを定義することによって、
生成されたコントロールをカスタマイズすることができます。 ::

    echo $this->Form->controls([
        'name' => ['label' => 'カスタムラベル']
    ]);

``$fields`` をカスタマイズする場合、生成された legend/fieldset を制御するために
``$options`` パラメーターを使用することができます。

例えば::

    echo $this->Form->controls(
        [
            'name' => ['label' => 'カスタムラベル']
        ],
        ['legend' => 'Update your post']
    );

``fieldset`` を無効にすると、 ``legend`` は出力されません。

エンティティー全体のコントロールを作成
--------------------------------------

.. php:method:: allControls(array $fields, $options = [])

* ``$fields`` - オプション。生成するフィールドのカスタマイズ配列。
  カスタムタイプ、ラベル、その他のオプションを設定できます。
* ``$options`` - オプション。オプションの配列。有効なキーは:

  #. ``'fieldset'`` - これに ``false`` を設定すると fieldset が無効になります。
     空の場合、fieldset は有効になります。パラメーターの配列を渡すと、 ``fieldset`` の
     HTML 属性として適用されます。
  #. ``legend`` - ``legend`` テキストをカスタマイズするための文字列。
     これに ``false`` を設定すると、生成されたコントロールセットの ``legend`` が無効になります。

このメソッドは ``controls()`` と密接に関係していますが、 ``$fields`` 引数は
現在のトップレベルエンティティーの *全ての* フィールドにデフォルト設定されています。
生成されたコントロールから特定のフィールドを除外するには、 ``$fields`` パラメーターで
``false`` を設定します。 ::

    echo $this->Form->allControls(['password' => false]);
    // 3.4.0 より前の場合:
    echo $this->Form->allInputs(['password' => false]);

.. _associated-form-inputs:

関連データの入力を作成
======================

関連するデータのフォームを作成するのは簡単で、エンティティーのデータ内のパスに密接に関連しています。
次のテーブルリレーションを仮定します。

* Authors HasOne Profiles
* Authors HasMany Articles
* Articles HasMany Comments
* Articles BelongsTo Authors
* Articles BelongsToMany Tags

アソシエーション付きで読み込まれた記事を編集していた場合、次のコントロールを作成できます。 ::

    $this->Form->create($article);

    // Article 入力
    echo $this->Form->control('title');

    // Author 入力 (belongsTo)
    echo $this->Form->control('author.id');
    echo $this->Form->control('author.first_name');
    echo $this->Form->control('author.last_name');

    // Author の profile (belongsTo + hasOne)
    echo $this->Form->control('author.profile.id');
    echo $this->Form->control('author.profile.username');

    // Tags 入力 (belongsToMany)
    echo $this->Form->control('tags.0.id');
    echo $this->Form->control('tags.0.name');
    echo $this->Form->control('tags.1.id');
    echo $this->Form->control('tags.1.name');

    // belongsToMany の複数選択要素
    echo $this->Form->control('tags._ids', [
        'type' => 'select',
        'multiple' => true,
        'options' => $tagList,
    ]);

    // 結合テーブルの入力 (articles_tags)
    echo $this->Form->control('tags.0._joinData.starred');
    echo $this->Form->control('tags.1._joinData.starred');

    // Comments 入力 (hasMany)
    echo $this->Form->control('comments.0.id');
    echo $this->Form->control('comments.0.comment');
    echo $this->Form->control('comments.1.id');
    echo $this->Form->control('comments.1.comment');

上記のコントロールは、コントローラー内の次のコードを使用して完成したエンティティーグラフに
マーシャリングすることができます。 ::

    $article = $this->Articles->patchEntity($article, $this->request->getData(), [
        'associated' => [
            'Authors',
            'Authors.Profiles',
            'Tags',
            'Comments'
        ]
    ]);

独自ウィジェットの追加
======================

CakePHP を使うと、アプリケーションに独自のコントロールウィジェットを簡単に追加でき、
他のコントロールタイプと同様に使用することができます。
すべてのコアコントロールタイプはウィジェットとして実装されています。
つまり、独自の実装でコアウィジェットを上書きすることができます。

Widget クラスの構築
-------------------

Widget クラスは、とても単純で必須のインターフェイスを持っています。
これらは :php:class:`Cake\\View\\Widget\\WidgetInterface` を実装しなければなりません。
このインターフェイスを実装するには、 ``render(array $data)`` メソッドと
``secureFields(array $data)`` メソッドが必要です。
``render()`` メソッドは、ウィジェットを構築するためのデータ配列を受け取り、
ウィジェットの HTML 文字列を返すことが期待されています。
``secureFields()`` メソッドは、同様にデータ配列を受け取り、
このウィジェットで保護するフィールドのリストを含む配列を返すことが期待されています。
CakePHP がウィジェットを構築している場合、最初の引数として ``Cake\View\StringTemplate``
インスタンスを取得し、その後にあなたが定義した依存関係が続くことが期待できます。
autocomplete ウィジェットを作成したい場合、以下を実行できます。 ::

    namespace App\View\Widget;

    use Cake\View\Form\ContextInterface;
    use Cake\View\Widget\WidgetInterface;

    class AutocompleteWidget implements WidgetInterface
    {

        protected $_templates;

        public function __construct($templates)
        {
            $this->_templates = $templates;
        }

        public function render(array $data, ContextInterface $context)
        {
            $data += [
                'name' => '',
            ];
            return $this->_templates->format('autocomplete', [
                'name' => $data['name'],
                'attrs' => $this->_templates->formatAttributes($data, ['name'])
            ]);
        }

        public function secureFields(array $data)
        {
            return [$data['name']];
        }
    }

明らかに、これは非常に簡単な例ですが、独自ウィジェットの構築方法を示しています。

ウィジェットの使用
------------------

FormHelper を読み込むときや、
``addWidget()`` メソッドを使って独自のウィジェットを読み込むことができます。
FormHelper を読み込むとき、ウィジェットは設定として定義されます。 ::

    // View クラスの中で
    $this->loadHelper('Form', [
        'widgets' => [
            'autocomplete' => ['Autocomplete']
        ]
    ]);

あなたのウィジェットが他のウィジェットを必要とする場合は、それらの依存関係を宣言することによって
FormHelper に取り込ませることができます。 ::

    $this->loadHelper('Form', [
        'widgets' => [
            'autocomplete' => [
                'App\View\Widget\AutocompleteWidget',
                'text',
                'label'
            ]
        ]
    ]);

上記の例では、 ``autocomplete`` ウィジェットは ``text`` と ``label`` ウィジェットに依存します。
ウィジェットがビューにアクセスする必要がある場合は、 ``_view`` 'ウィジェット' を使用してください。
autocomplete ウィジェットが作成されると、 ``text`` と ``label``
の名前に関連するウィジェットオブジェクトが渡されます。
``addWidget()`` メソッドを使ってウィジェットを追加すると、次のようになります。 ::

    // classname の使用。
    $this->Form->addWidget(
        'autocomplete',
        ['Autocomplete', 'text', 'label']
    );

    // インスタンスの使用 - 依存関係を解決する必要があります。
    $autocomplete = new AutocompleteWidget(
        $this->Form->getTemplater(),
        $this->Form->widgetRegistry()->get('text'),
        $this->Form->widgetRegistry()->get('label'),
    );
    $this->Form->addWidget('autocomplete', $autocomplete);

追加/置換されると、ウィジェットはコントロールの 'type' として使用できます。 ::

    echo $this->Form->control('search', ['type' => 'autocomplete']);

これは、 ``controls()`` とまったく同じように ``label`` と囲い込む ``div``
を持つ独自ウィジェットを作成します。
あるいは、マジックメソッドを使用してコントロールウィジェットだけを作成することもできます。 ::

    echo $this->Form->autocomplete('search', $options);

SecurityComponent との連携
==========================

:php:meth:`Cake\\Controller\\Component\\SecurityComponent` には、
フォームをより安全で安全にするためのいくつかの機能があります。
コントローラーに ``SecurityComponent`` を含めるだけで、
フォームの改ざん防止機能が自動的に有効になります。

SecurityComponent を利用する際は、前述のようにフォームを閉じる際は、
必ず :php:meth:`~Cake\\View\\Helper\\FormHelper::end()` を使う必要があります。
これにより特別な ``_Token`` 入力が生成されます。

.. php:method:: unlockField($name)

* ``$name`` - オプション。ドット区切りのフィールド名。

``SecurityComponent`` によるフィールドのハッシュ化が行われないようにフィールドのロックを
解除します。またこれにより、そのフィールドを JavaScript で操作できるようになります。
``$name`` には入力のためのエンティティーのプロパティー名を指定します。 ::

    $this->Form->unlockField('id');

.. php:method:: secure(array $fields = [], array $secureAttributes = [])

* ``$fields`` - オプション。ハッシュの生成に使用するフィールドの一覧を含む配列。
  指定がない場合、 ``$this->fields`` が使用されます。
* ``$secureAttributes`` - オプション。生成される hidden 入力要素の中に渡す
  HTML 属性の配列。

フォームで使用されるフィールドに基づくセキュリティーハッシュをもつ
非表示の ``input`` フィールドを生成し、または、保護されたフォームが使用されていない場合は
空の文字列を生成します。
``$secureAttributes`` を設定した場合、これらの HTML 属性は、
SecurityCompnent によって生成された非表示の input タグの中にマージされます。
これは、 ``'form'`` のような HTML5 属性を設定するのに特に便利です。

.. meta::
    :title lang=ja: FormHelper
    :description lang=ja: FormHelper は、フォームの作成を迅速に行い、検証、再配置、レイアウトを効率化します。
    :keywords lang=ja: form helper,cakephp form,form create,form input,form select,form file field,form label,form text,form password,form checkbox,form radio,form submit,form date time,form error,validate upload,unlock field,form security

