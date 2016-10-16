FormHelper
##########

.. php:class:: FormHelper(View $view, array $settings = array())

FormHelper はフォーム作成時の力作業のほとんどを代行してくれます。
フォームをすばやく作成する機能に特化して、バリデーション
（入力値の妥当性検査）や部品の配置、レイアウトを効率化します。
FormHelper はまた柔軟でもあります。
通常は組み込まれた規則に沿ってほとんどのことをやってくれますが、
特定のメソッドを使って必要な機能だけを使うこともできます。

フォームの作成
==============

FormHelper の利点を活用するために最初に使うメソッドは ``create()``
です。この特別なメソッドはフォームの開始タグを出力します。

.. php:method:: create(string $model = null, array $options = array())

    パラメータはすべてオプションです。 もし ``create()`` が、パラメータなしで
    呼ばれたなら、現在の URL を元に現在のコントローラーに送信するための
    フォームを作ろうとしているものとみなします。フォームを送信するための
    デフォルトのメソッドは POST です。フォームの要素は DOM ID
    とともに返されますが、この ID はモデル名とコントローラーのアクション
    名をキャメルケースにしたものとして生成されます。たとえば
    UsersController ビューの中から ``create()`` を呼んだ場合、
    以下のように描画されたビューが得られます：

    .. code-block:: html

        <form id="UserAddForm" method="post" action="/users/add">

    .. note::

        ``$model`` に対して ``false`` を渡すこともできます。こうすると、
        フォームデータは（ ``$this->request->data['Model']`` サブ配列
        の中ではなく） ``$this->request->data`` 配列の中に格納されます。
        これは、データベースの中身とは関係ないちょっとしたフォームを
        作る時に便利です。

    さらに ``create()`` メソッドでは、パラメータを使っていろいろな
    カスタマイズができます。まず、モデル名の指定ができます。フォームに
    モデル名を指定すると、フォームの *中身* を作っていることになります。
    すべての項目は（特に指定されない限り）そのモデルに所属するものと
    見なされ、そのモデルから参照されるモデルについても、そのフォームに
    関連付けられます。モデルを指定しない場合、現在のコントローラー
    のデフォルトモデルを使っていると見なされます::

        // たとえば /recipes/add にいるとして、
        echo $this->Form->create('Recipe');

    出力結果:

    .. code-block:: php

        <form id="RecipeAddForm" method="post" action="/recipes/add">

    これはフォームデータを RecipesController の ``add()`` アクションに
    POST します。なお、これと同じロジックを使って編集フォームを作ることも
    できます。FormHelper はフォームの追加や編集のどちらなのかを自動的に
    検出し、 ``$this->request->data`` を適切に利用します。もし
    ``$this->request->data`` にフォームのモデルに関連する名前がついた
    配列要素が含まれていて、かつその配列に含まれるモデルのプライマリキー
    の値が空でなければ、FormHelper はそのレコードの編集用フォームを作成
    します。たとえば http://site.com/recipes/edit/5 にアクセスすると、
    以下の様な出力が得られます::

        // Controller/RecipesController.php:
        public function edit($id = null) {
            if (empty($this->request->data)) {
                $this->request->data = $this->Recipe->findById($id);
            } else {
                // ここに保存のためのロジックを置く
            }
        }

        // View/Recipes/edit.ctp:
        // $this->request->data['Recipe']['id'] = 5
        // になるので編集フォームを作る
        <?php echo $this->Form->create('Recipe'); ?>

    出力結果:

    .. code-block:: html

        <form id="RecipeEditForm" method="post" action="/recipes/edit/5">
        <input type="hidden" name="_method" value="PUT" />

    .. note::

        これは編集フォームなので hidden の入力項目が生成され、
        デフォルトの HTTP メソッドは上書きされます。

    プラグイン内のモデル用にフォームを作る場合は、常に :term:`プラグイン記法`
    を使います。これで以下のように適切なフォームが生成されます::

        echo $this->Form->create('ContactManager.Contact');

    配列 ``$options`` にはフォーム設定に関するほとんどのことを指定できます。
    この特別な配列には、フォームタグを作成する際のやり方に影響する、
    さまざまなキーバリューの組合せを数多く指定可能です。

    .. versionchanged:: 2.0
        すべてのフォームに関するデフォルトの URL は、現在の URL の後ろに
        渡されたパラメータ、名前付きパラメータ、問合せ文字列をつけたものに
        なりました。このデフォルトを変更するには、 ``$this->Form->create()``
        の第二引数の中に ``$options['url']`` を指定します。

create() のオプション
---------------------

create() には多くのオプションがあります:

* ``$options['type']`` このキーは生成するフォームのタイプを指定します。
  有効な値は 'post', 'get', 'file', 'put', 'delete' です。

  'post' と 'get' は、フォームの送信用メソッドをこの通り変更します::

      echo $this->Form->create('User', array('type' => 'get'));

  出力結果:

  .. code-block:: html

     <form id="UserAddForm" method="get" action="/users/add">

  タイプ 'file' はフォームの送信用メソッドを 'post' にして、かつフォーム
  タグに "multipart/form-data" という enctype を追加します。これはフォーム
  内に何らかのファイル要素がある場合に指定されるべきものです。適切な
  enctype 属性が抜けていると、ファイルのアップロードがうまく動きません::

      echo $this->Form->create('User', array('type' => 'file'));

  出力結果:

  .. code-block:: html

     <form id="UserAddForm" enctype="multipart/form-data"
        method="post" action="/users/add">

  'put' や 'delete' を使う場合、そのフォームは機能的に 'post' と同じですが、
  送信される際、HTTP のリクエストメソッドが 'PUT' または 'DELETE'
  に上書きされます。これにより、Web ブラウザにおける REST サポートを
  CakePHP がエミュレートできるようになります。

* ``$options['action']`` 現在のコントローラーにおいて、特定のアクションに
  対してフォームデータを送り込むことができます。たとえば現在のコントローラー
  の login() アクションにフォームデータを渡したい場合、$options 配列には
  以下のように指定します::

    echo $this->Form->create('User', array('action' => 'login'));

  出力結果:

  .. code-block:: html

     <form id="UserLoginForm" method="post" action="/users/login">

  .. deprecated:: 2.8.0
    ``$options['action']`` オプションは、 2.8.0 で非推奨になりました。
    代わりに ``$options['url']`` と ``$options['id']`` オプションを使用してください。

* ``$options['url']`` 現在のコントローラー以外にフォームデータを渡したい
  場合、$options 配列の 'url' キーを使ってフォームアクションの URL
  を指定します。指定された URL は作成中の CakePHP アプリケーションに
  対する相対値を指定できます::

    echo $this->Form->create(false, array(
        'url' => array('controller' => 'recipes', 'action' => 'add'),
        'id' => 'RecipesAdd'
    ));

  出力結果:

  .. code-block:: html

     <form method="post" action="/recipes/add">

  もしくは、外部ドメインも指定可能です::

    echo $this->Form->create(false, array(
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    ));

  出力結果:

  .. code-block:: html

    <form method="get" action="http://www.google.com/search">

  さらにいろいろなタイプの URL を指定する例は、:php:meth:`HtmlHelper::url()`
  メソッドを参照してみてください。

  .. versionchanged:: 2.8.0

    form action として URL を出力させたくない場合、
    ``'url' => false`` を使用してください。

* ``$options['default']``  'default' がブール値の false に設定されている場合、
  フォームの submit アクションが変更され、submit ボタンを押してもフォームが
  submit されなくなります。そのフォームが AJAX を経由して submit するように
  なっている場合は 'default' を false にしてフォームのデフォルトの挙動を
  抑止し、その代わり AJAX 経由でデータを取得して submit するようにできます。

* ``$options['inputDefaults']`` ``input()`` のデフォルトオプションの
  組合せを ``inputDefaults`` キーとしてセットすると、入力生成における
  標準の振る舞いをカスタマイズできます。::

    echo $this->Form->create('User', array(
        'inputDefaults' => array(
            'label' => false,
            'div' => false
        )
    ));

  これ以降に生成される入力項目は、すべて inputDefaults で宣言された
  オプションを継承します。デフォルトのオプションを上書きするには
  input() 呼び出しで以下のようにオプションを指定します::

    echo $this->Form->input('password'); // div も label も持たない
    // label 要素を持つ
    echo $this->Form->input(
        'username',
        array('label' => 'Username')
    );

フォームを閉じる
================

.. php:method:: end($options = null, $secureAttributes = array())

    FormHelper にはフォームを完成させる ``end()`` メソッドがあります。
    多くの場合 ``end()`` はフォームの閉じタグを出力するだけですが、
    :php:class:`SecurityComponent` が要求する hidden のフォーム要素を
    FormHelper に挿入させることもできます:

    .. code-block:: php

        <?php echo $this->Form->create(); ?>

        <!-- ここにフォームの構成要素を置きます -->

        <?php echo $this->Form->end(); ?>

    ``end()`` の第一パラメータで文字列が与えられると、FormHelper は
    フォームの綴じタグと一緒にその文字列の名前のついた submit ボタンを
    出力します::

        <?php echo $this->Form->end('Finish'); ?>

    出力結果:

    .. code-block:: html

        <div class="submit">
            <input type="submit" value="Finish" />
        </div>
        </form>

    ``end()`` に配列を渡して詳細を指定することもできます::

        $options = array(
            'label' => 'Update',
            'div' => array(
                'class' => 'glass-pill',
            )
        );
        echo $this->Form->end($options);

    出力結果:

    .. code-block:: html

        <div class="glass-pill"><input type="submit" value="Update" name="Update">
        </div>

    詳細は
    `Form Helper API <http://api.cakephp.org/2.8/class-FormHelper.html>`_
    を参照してください。

    .. note::

        アプリケーション内で :php:class:`SecurityComponent` を使っている
        場合、タグを閉じる際は常に ``end()`` を使わなければなりません。

    .. versionchanged:: 2.5
        2.5 で ``$secureAttributes`` パラメータが追加されました。

.. _automagic-form-elements:

フォーム要素の生成
==================

FormHelper でフォームの input 要素を作る方法はいくつかあります。まずは
``input()`` に注目してみましょう。このメソッドは与えられたモデル内の
項目を自動的に調べて、それらの項目に対応する適切な入力項目を作ります。
内部的には ``input()`` は FormHelper 内で他のメソッドに処理を委託します。

.. php:method:: input(string $fieldName, array $options = array())

    それぞれの ``Model.field`` により以下の要素を生成します:

    * div のラッピング
    * Label 要素
    * Input 要素
    * 適用できる場合はメッセージを含むエラー要素

    生成される input の型は（テーブルの）カラムのデータ型に依存します:

    カラムの型
        フォーム項目の型
    string (char, varchar, etc.)
        text
    boolean, tinyint(1)
        checkbox
    text
        textarea
    text, with name of password, passwd, または psword
        password
    text, with name of email
        email
    text, with name of tel, telephone, または phone
        tel
    date
        day, month, and year selects
    datetime, timestamp
        day, month, year, hour, minute, および meridian selects
    time
        hour, minute, および meridian selects
    binary
        file

    ``$options`` パラメータで ``input()`` の挙動をカスタマイズできます。
    また生成されるデータを細やかに制御できます。

    モデルの項目に関するバリデーションルールで ``allowEmpty =>true`` が
    指定されない場合、ラッピングする div には ``required`` というクラス
    名が付加されます。この振る舞いにおける一つの制限事項として、
    そのリクエストの間に入力項目のモデルがロードされている必要があります。
    そうでなければ  :php:meth:`~FormHelper::create()` で指定されたモデルが
    直接関連付けられます。

    .. versionadded:: 2.5
        binary 型が file 入力にマッピングされるようになりました。

    .. versionadded:: 2.3

    .. _html5-required:

    2.3 から、バリデーションルールに基いて、HTML5 の ``required`` 属性が input に
    付加されるようになりました。options 配列で明示的に ``required`` キーを
    セットしてその項目の定義を上書きすることもできます。フォーム全体を
    トリガーすることでブラウザによるバリデーションをスキップするためには、
    :php:meth:`FormHelper::submit()` を使って生成した入力ボタンの
    オプションに ``'formnovalidate' => true``  を指定するか、もしくは
    :php:meth:`FormHelper::create()` の options で ``'novalidate' => true``
    をセットします。

    たとえば、あなたの User モデルには username (varchar), password (varchar),
    approved (datetime) , quote (text) という項目があるとします。
    FormHelper の input() メソッドを使ってこれらすべてのフォーム項目に
    対する適切な input 項目を作ります::

        echo $this->Form->create();

        echo $this->Form->input('username');   //text
        echo $this->Form->input('password');   //password
        echo $this->Form->input('approved');   //day, month, year, hour, minute,
                                               //meridian
        echo $this->Form->input('quote');      //textarea

        echo $this->Form->end('Add');

    日付項目について、より具体的なオプションの例を以下に示します::

        echo $this->Form->input('birth_dt', array(
            'label' => 'Date of birth',
            'dateFormat' => 'DMY',
            'minYear' => date('Y') - 70,
            'maxYear' => date('Y') - 18,
        ));

    ``input()`` のオプションでは、後述する特別なオプションの他にも、
    input のタイプについての任意のオプションや、（たとえば onfocus
    のように）任意の HTML 属性を指定できます。``$options`` と
    ``$htmlAttributes`` に関する詳細は :doc:`/core-libraries/helpers/html`
    を参照してください。

    User の hasAndBelongsToMany グループを考えます。コントローラーでは
    select の options でキャメルケースの複数形の変数（このケースでは
    group -> groups や ExtraFunkyModel -> extraFunkyModels）をセットします。
    コントローラーの action では以下のように指定します::

        $this->set('groups', $this->User->Group->find('list'));

    そしてビューの中では、以下のシンプルなコードで複数の select が
    生成できます::

        echo $this->Form->input('Group', array('multiple' => true));

    belongsTo や hasOne 関係を使うケースで select 項目を生成したい場合、
    Users コントローラーに以下のコードを追加します（User は Group に
    belongsTo していると仮定しています）::

        $this->set('groups', $this->User->Group->find('list'));

    その後フォームビューに以下を追加します::

        echo $this->Form->input('group_id');

    あなたの使っているモデルの名前が、たとえば "UserGroup" のように
    ２つ以上の単語で構成されている場合、set() でデータを渡す際の
    データにつける名前は複数形のキャメルケースでなければなりません::

        $this->set('userGroups', $this->UserGroup->find('list'));
        // または
        $this->set(
            'reallyInappropriateModelNames',
            $this->ReallyInappropriateModelName->find('list')
        );

    .. note::

        submit ボタンを作る際は `FormHelper::input()` の利用を避け、
        :php:meth:`FormHelper::submit()` の方を使ってください。

.. php:method:: inputs(mixed $fields = null, array $blacklist = null, $options = array())

    ``$fields`` についての入力項目のセットを作成します。 ``$fields``
    が null の場合は全項目が対象となりますが、その場合でも現在の
    モデルのうち ``$blacklist`` に定義されているものは除外されます。

    コントローラー項目の出力の他にも、 ``$fields`` は ``fieldset`` や
    ``legend`` キーと一緒に使うことで legend や fieldset の描画制御
    のためにも使われます。
    ``$this->Form->inputs(array('legend' => 'My legend'));``
    はカスタム legend を伴った input の組み合わせを生成します。
    ``$fields`` を通して個々の input をカスタマイズすることも可能です。::

        echo $this->Form->inputs(array(
            'name' => array('label' => 'custom label')
        ));

    項目のコントロールの他にも、inputs() では以下のオプションが使えます。

    - ``fieldset`` false にすることで fieldset を無効にします。
      文字列が渡されると、それは fieldset 要素のクラス名として使われます。
    - ``legend`` false にすることで生成された input 項目についての
      legend を無効にします。もしくは legend テキストをカスタマイズ
      するための文字列を渡します。

項目名の命名規則
----------------

FormHelper は結構よくできています。FormHelper のメソッドで
項目名を指定すれば、常に自動的に現在のモデル名を使って以下のような
書式で input タグを作ってくれます:

.. code-block:: html

    <input type="text" id="ModelnameFieldname" name="data[Modelname][fieldname]">

これにより、そのフォームが対象とするモデルの input タグを生成する際、
モデル名を省略できます。関連付けられたモデルや任意のモデルについての
input タグを生成する場合は、最初のパラメータとして モデル名.項目名 を
渡します。::

    echo $this->Form->input('Modelname.fieldname');

同じ項目名で複数の項目を指定したい場合、すなわち一度の saveAll()
で配列として値を保存したい場合は以下の様な書式を使います::

    echo $this->Form->input('Modelname.0.fieldname');
    echo $this->Form->input('Modelname.1.fieldname');

その出力は以下のようになります:

.. code-block:: html

    <input type="text" id="Modelname0Fieldname"
        name="data[Modelname][0][fieldname]">
    <input type="text" id="Modelname1Fieldname"
        name="data[Modelname][1][fieldname]">


FormHelper は日時項目の入力を生成する際、内部的に複数の 項目名-接尾辞
を使います。もし項目名として ``year``, ``month``, ``day``, ``hour``,
``minute``, ``meridian`` を使っており、かる正確な入力値を得ることが
できない場合は、 ``name`` 属性をセットすることでデフォルトの振る舞いを
上書きすることができます::

    echo $this->Form->input('Model.year', array(
        'type' => 'text',
        'name' => 'data[Model][year]'
    ));

オプション
----------

``FormHelper::input()`` は非常に多数のオプションをサポートしています。
それ自身のオプション以外にも、 ``input()`` は生成された input のタイプや
HTML 属性などもオプションとして設定可能です。ここでは
``FormHelper::input()`` に特化したオプションを記載しています。

* ``$options['type']`` タイプを指定することで、モデルが推測したものに
  優先して、input のタイプを強制指定できます。 :ref:`automagic-form-elements`
  で見つかったフィールドタイプの他にも HTML5 でサポートされている
  'file', 'password' 等のタイプも生成可能です::

    echo $this->Form->input('field', array('type' => 'file'));
    echo $this->Form->input('email', array('type' => 'email'));

  出力はこうなります:

  .. code-block:: html

    <div class="input file">
        <label for="UserField">Field</label>
        <input type="file" name="data[User][field]" value="" id="UserField" />
    </div>
    <div class="input email">
        <label for="UserEmail">Email</label>
        <input type="email" name="data[User][email]" value="" id="UserEmail" />
    </div>

* ``$options['div']`` このオプションを使って、input を囲んでいる div の
  属性を指定できます。文字列を渡すと div のクラス名になります。
  配列を渡すと div の属性として扱われますが、この場合はキー／値の形式で
  指定します。なおこのキーを false と指定すると、div の出力を行わなく
  なります。

  クラス名の指定::

    echo $this->Form->input('User.name', array(
        'div' => 'class_name'
    ));

  出力結果:

  .. code-block:: html

    <div class="class_name">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

  複数の属性の指定::

    echo $this->Form->input('User.name', array(
        'div' => array(
            'id' => 'mainDiv',
            'title' => 'Div Title',
            'style' => 'display:block'
        )
    ));

  出力結果:

  .. code-block:: html

    <div class="input text" id="mainDiv" title="Div Title"
        style="display:block">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

  div の出力抑制::

    echo $this->Form->input('User.name', array('div' => false)); ?>

  出力結果:

  .. code-block:: html

    <label for="UserName">Name</label>
    <input name="data[User][name]" type="text" value="" id="UserName" />

* ``$options['label']`` input とともに指定されることの多い label のテキストを文字列で指定します::

    echo $this->Form->input('User.name', array(
        'label' => 'The User Alias'
    ));

  出力結果:

  .. code-block:: html

    <div class="input">
        <label for="UserName">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

  このキーに false を指定すると、label タグが出力されなくなります::

    echo $this->Form->input('User.name', array('label' => false));

  出力結果:

  .. code-block:: html

    <div class="input">
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

  これを配列で指定することで、 ``label`` 要素に対する追加
  オプションを指定できます。この場合、label のテキストをカスタマイズ
  するには ``text`` キーを使います::

    echo $this->Form->input('User.name', array(
        'label' => array(
            'class' => 'thingy',
            'text' => 'The User Alias'
        )
    ));

  出力結果:

  .. code-block:: html

    <div class="input">
        <label for="UserName" class="thingy">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

* ``$options['error']`` このキーを使うと、モデルが持つデフォルトの
  エラーメッセージを上書きしたり、また、たとえば i18n メッセージを
  セットしたりできます。これには多数のサブオプションがあり、これを
  使って外側の要素やそのクラス名をコントロールしたり、
  エラーメッセージの中の HTML をエスケープするかどうかなどを指定
  できます。

  エラーメッセージ出力やフィールドのクラス名を無効にするには
  error キーに false を設定します::

    $this->Form->input('Model.field', array('error' => false));

  エラーメッセージのみを無効にし、フィールドのクラス名は有効にするには
  errorMessage キーを false にします::

    $this->Form->input('Model.field', array('errorMessage' => false));

  外側の要素のタイプやそのクラスを変更するには以下の書式を
  使います::

    $this->Form->input('Model.field', array(
        'error' => array(
            'attributes' => array('wrap' => 'span', 'class' => 'bzzz')
        )
    ));

  エラーメッセージ出力において HTML が自動的にエスケープされるのを
  抑制するには、escape サブオプションを false にします::

    $this->Form->input('Model.field', array(
        'error' => array(
            'attributes' => array('escape' => false)
        )
    ));

  モデルのエラーメッセージを上書きするには、
  バリデーションの rule 名にマッチしたキーを持つ配列を使います::

    $this->Form->input('Model.field', array(
        'error' => array('tooShort' => __('This is not long enough'))
    ));

  これまで見てきたように、モデルの中にあるそれぞれのバリデーション
  ルールのためのエラーメッセージを設定できます。さらにフォームの
  中のメッセージに i18n を提供することも可能です。

  .. versionadded:: 2.3
    ``errorMessage`` オプションのサポートは 2.3 で追加されました。

* ``$options['before']``, ``$options['between']``, ``$options['separator']``,
  ``$options['after']``

  input() メソッドの出力の中に何らかのマークアップを差し込みたい場合、
  これらのキーを使います::

      echo $this->Form->input('field', array(
          'before' => '--before--',
          'after' => '--after--',
          'between' => '--between---'
      ));

  出力結果:

  .. code-block:: html

      <div class="input">
      --before--
      <label for="UserField">Field</label>
      --between---
      <input name="data[User][field]" type="text" value="" id="UserField" />
      --after--
      </div>

  radio input では、'separator' 属性を使ってそれぞれの input と
  label のペアを分けるためのマークアップを挿入できます::

      echo $this->Form->input('field', array(
          'before' => '--before--',
          'after' => '--after--',
          'between' => '--between---',
          'separator' => '--separator--',
          'options' => array('1', '2'),
          'type' => 'radio'
      ));

  出力結果:

  .. code-block:: html

      <div class="input">
      --before--
      <input name="data[User][field]" type="radio" value="1" id="UserField1" />
      <label for="UserField1">1</label>
      --separator--
      <input name="data[User][field]" type="radio" value="2" id="UserField2" />
      <label for="UserField2">2</label>
      --between---
      --after--
      </div>

  ``date`` および ``datetime`` 型の要素では、'separator'
  属性を使って select 要素の間の文字列を変更できます。
  デフォルトは '-' です。

* ``$options['format']`` FormHelper が生成する HTML の順序もまた制御可能
  です。'format' オプションは文字列の配列を取り、希望する要素の
  並び順を表すテンプレートを指定します。サポートされている配列キーは
  以下の通りです:
  ``array('before', 'input', 'between', 'label', 'after','error')``

* ``$options['inputDefaults']`` 複数の input() コールで同じオプションを
  使いたい場合、 ``inputDefaults`` を使うことで繰り返し指定を避ける事が
  できます::

    echo $this->Form->create('User', array(
        'inputDefaults' => array(
            'label' => false,
            'div' => false
        )
    ));

  その時点より先で生成されるすべての input において、inputDefaults
  にあるオプション宣言が継承されます。input() コール時のオプション
  指定はデフォルトのオプションより優先されます::

    // div も label もなし
    echo $this->Form->input('password');

    // label 要素あり
    echo $this->Form->input('username', array('label' => 'Username'));

  ここより先のデフォルトを変更するには
  :php:meth:`FormHelper::inputDefaults()` が使えます。

* ``$opsions['maxlength']`` ``input`` フィールドの ``maxlength`` 属性に指定した値をセットするために
  使用します。このキーを省略して、 input タイプが ``text``, ``textarea``, ``email``, ``tel``, ``url``,
  または ``search`` で、データベースのフィールドの定義が ``decimal``, ``time`` または ``datetime``
  以外の場合、フィールドの length オプションが使用されます。

GET フォーム入力
----------------

``GET`` フォーム入力を生成するために ``FormHelper`` を使用した時、
人が読みやすくするために入力名は、自動的に短くなります。例::

    //  <input name="email" type="text" /> になります
    echo $this->Form->input('User.email');

    // <select name="Tags" multiple="multiple"> になります
    echo $this->Form->input('Tags.Tags', array('multiple' => true));

もし、生成された name 属性を上書きしたい場合、 ``name`` オプションが使えます。 ::

    // より典型的な <input name="data[User][email]" type="text" /> になります
    echo $this->Form->input('User.email', array('name' => 'data[User][email]'));

特殊なタイプの入力を生成する
============================

一般的な ``input()`` メソッド以外にも、 ``FormHelper`` には様々に
異なったタイプの input を生成するための特別なメソッドがあります。
これらは input ウィジェットそのものを生成するのに使えますが、
さらに :php:meth:`~FormHelper::label()` や
:php:meth:`~FormHelper::error()` といった別のメソッドと組み合わせる
ことで、完全にカスタムメイドのフォームレイアウトを生成できます。

.. _general-input-options:

一般的なオプション
------------------

input 要素に関連するメソッドの多くは、一般的なオプションの
組合せをサポートしています。これらのオプションはすべて ``input()``
でもサポートされています。繰り返しを減らすために、すべての input
メソッドで使える共通オプションを以下に示します:

* ``$options['class']`` input のクラス名を指定できます::

    echo $this->Form->input('title', array('class' => 'custom-class'));

* ``$options['id']`` input の DOM id の値を強制的に設定します。

* ``$options['default']`` input フィールドのデフォルト値をセットする
  のに使われます。この値は、フォームに渡されるデータにそのフィールド
  に関する値が含まれていない場合（かまたは、一切データが渡されない場合）
  に使われます。

  使用例::

    echo $this->Form->input('ingredient', array('default' => 'Sugar'));

  select フィールドを持つ例（"Medium" サイズがデフォルトで選択されます）::

    $sizes = array('s' => 'Small', 'm' => 'Medium', 'l' => 'Large');
    echo $this->Form->input(
        'size',
        array('options' => $sizes, 'default' => 'm')
    );

  .. note::

    checkbox をチェックする目的では ``default`` は使えません。
    その代わり、コントローラーで ``$this->request->data`` の中の
    値をセットするか、または input オプションの ``checked`` を true
    にします。

    日付と時刻フィールドのデフォルト値は 'selected' キーでセットできます。

    デフォルト値への代入の際 false を使うのは注意が必要です。
    false 値は input フィールドのオプションを無効または除外するのに
    使われます。そのため ``'default' => false`` では何の値もセット
    されません。この場合は ``'default' => 0`` としてください。

前述のオプションに加えて、任意の HTML 属性を混在させる
ことができます。特に規定のないオプション名は HTML 属性として
扱われ、生成された HTML の input 要素に反映されます。

select, checkbox, radio に関するオプション
------------------------------------------

* ``$options['selected']`` は select 型の input （たとえば select,
  date, time, datetime）と組み合わせて使われます。その項目の値に
  'selected' をセットすると、その input が描画される際にデフォルトで
  その項目が選択されます::

    echo $this->Form->input('close_time', array(
        'type' => 'time',
        'selected' => '13:30:00'
    ));

  .. note::

    date や datetime input の selected キーは UNIX のタイムスタンプ
    で設定することもできます。

* ``$options['empty']`` true がセットされると、その input 項目を
  強制的に空にします。

  select リストに渡される際、これはドロップダウンの値として空値を
  持つ空のオプションを作ります。単にオプションを空白にする代わりに、
  何らかのテキストを表示しつつ空値を受け取りたい場合は empty に
  文字列を設定してください::

      echo $this->Form->input('field', array(
          'options' => array(1, 2, 3, 4, 5),
          'empty' => '(choose one)'
      ));

  出力結果:

  .. code-block:: html

      <div class="input">
          <label for="UserField">Field</label>
          <select name="data[User][field]" id="UserField">
              <option value="">(choose one)</option>
              <option value="0">1</option>
              <option value="1">2</option>
              <option value="2">3</option>
              <option value="3">4</option>
              <option value="4">5</option>
          </select>
      </div>

  .. note::

    パスワードフィールドのデフォルト値を空値にしたい場合は、
    'value' => '' の方を使ってください。

  date や datetime フィールドのために、 empty にキー・バリューペアの配列を指定できます。 ::


    echo $this->Form->dateTime('Contact.date', 'DMY', '12',
        array(
            'empty' => array(
                'day' => 'DAY', 'month' => 'MONTH', 'year' => 'YEAR',
                'hour' => 'HOUR', 'minute' => 'MINUTE', 'meridian' => false
            )
        )
    );

  出力結果:

  .. code-block:: html

    <select name="data[Contact][date][day]" id="ContactDateDay">
        <option value="">DAY</option>
        <option value="01">1</option>
        // ...
        <option value="31">31</option>
    </select> - <select name="data[Contact][date][month]" id="ContactDateMonth">
        <option value="">MONTH</option>
        <option value="01">January</option>
        // ...
        <option value="12">December</option>
    </select> - <select name="data[Contact][date][year]" id="ContactDateYear">
        <option value="">YEAR</option>
        <option value="2036">2036</option>
        // ...
        <option value="1996">1996</option>
    </select> <select name="data[Contact][date][hour]" id="ContactDateHour">
        <option value="">HOUR</option>
        <option value="01">1</option>
        // ...
        <option value="12">12</option>
        </select>:<select name="data[Contact][date][min]" id="ContactDateMin">
        <option value="">MINUTE</option>
        <option value="00">00</option>
        // ...
        <option value="59">59</option>
    </select> <select name="data[Contact][date][meridian]" id="ContactDateMeridian">
        <option value="am">am</option>
        <option value="pm">pm</option>
    </select>

* ``$options['hiddenField']`` 一部の input タイプ（チェックボックス、ラジオボタン）では
  hidden フィールドが生成されるため、 $this->request->data の中のキーは値を伴わない形式でも
  存在します:

  .. code-block:: html

    <input type="hidden" name="data[Post][Published]" id="PostPublished_"
        value="0" />
    <input type="checkbox" name="data[Post][Published]" value="1"
        id="PostPublished" />

  これは ``$options['hiddenField'] = false`` とすることで無効にできます::

    echo $this->Form->checkbox('published', array('hiddenField' => false));

  出力結果:

  .. code-block:: html

    <input type="checkbox" name="data[Post][Published]" value="1"
        id="PostPublished" />

  １つのフォームの中でそれぞれグルーピングされた複数の input ブロック
  を作りたい場合は、最初のものを除くすべての input でこのパラメータを
  使うべきです。ページ上の複数の場所に hidden input がある場合は
  最後のグループの input の値が保存されます。

  この例では Tertiary Colors だけが渡され、Primary Colors は上書きされます:

  .. code-block:: html

    <h2>Primary Colors</h2>
    <input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />
    <input type="checkbox" name="data[Color][Color][]" value="5"
        id="ColorsRed" />
    <label for="ColorsRed">Red</label>
    <input type="checkbox" name="data[Color][Color][]" value="5"
        id="ColorsBlue" />
    <label for="ColorsBlue">Blue</label>
    <input type="checkbox" name="data[Color][Color][]" value="5"
        id="ColorsYellow" />
    <label for="ColorsYellow">Yellow</label>

    <h2>Tertiary Colors</h2>
    <input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />
    <input type="checkbox" name="data[Color][Color][]" value="5"
        id="ColorsGreen" />
    <label for="ColorsGreen">Green</label>
    <input type="checkbox" name="data[Color][Color][]" value="5"
        id="ColorsPurple" />
    <label for="ColorsPurple">Purple</label>
    <input type="checkbox" name="data[Addon][Addon][]" value="5"
        id="ColorsOrange" />
    <label for="ColorsOrange">Orange</label>

  ２つ目の input グループで ``'hiddenField'`` を無効にすることで、
  この挙動を防ぐことができます。

  hidden フィールドには 0 ではなく 'N' のように異なった値も
  設定できます::

      echo $this->Form->checkbox('published', array(
          'value' => 'Y',
          'hiddenField' => 'N',
      ));

日時関連オプション
------------------

* ``$options['timeFormat']`` 時刻関連の入力に関する select input の書式を
  指定します。有効な値は ``12``, ``24``, ``null`` です。

* ``$options['dateFormat']`` 日付関連の入力に関する select input の書式を
  指定します。有効な値は 'D', 'M', 'Y' の組み合わせまたは ``null`` です。
  入力は dateFormat オプションで定義した順序で格納されます。

* ``$options['minYear'], $options['maxYear']`` date/datetime と組み合わせて
  使います。年の select フィールドで表示される値の最小値および／または
  最大値を定義します。

* ``$options['orderYear']`` date/datetime と組み合わせて、年の値を表示する
  順序を定義します。有効な値は 'asc', 'desc' で、デフォルトは 'desc' です。

* ``$options['interval']`` このオプションでは分の select ボックスにおける
  分間隔の数値を指定します::

    echo $this->Form->input('Model.time', array(
        'type' => 'time',
        'interval' => 15
    ));

  この例では分の select で 15 分間隔で４つのオプションを生成します。

* ``$options['round']`` それぞれの命令で `up` または `down` を指定する
  ことで強制的な端数の切り上げ／切り下げを指示します。デフォルトは null
  で、これは `interval` にしたがって四捨五入します。

  .. versionadded:: 2.4

フォーム要素固有のメソッド
==========================

これまでの例では、すべての要素が ``User`` モデルのフォームの配下で
作られていました。このため、生成された HTML のコードには User モデルを
参照する属性が含まれます。
例：name=data[User][username], id=UserUsername

.. php:method:: label(string $fieldName, string $text, array $options)

    label 要素を作ります。``$fieldName`` は DOM id を生成する
    のに使われます。``$text`` が指定されない場合は ``$fieldName``
    を活用することで label テキストが作られます::

        echo $this->Form->label('User.name');
        echo $this->Form->label('User.name', 'Your username');

    出力結果:

    .. code-block:: html

        <label for="UserName">Name</label>
        <label for="UserName">Your username</label>

    ``$options`` は HTML 属性の配列、またはクラス名として
    使われる文字列のいずれかを指定します::

        echo $this->Form->label('User.name', null, array('id' => 'user-label'));
        echo $this->Form->label('User.name', 'Your username', 'highlight');

    出力結果:

    .. code-block:: html

        <label for="UserName" id="user-label">Name</label>
        <label for="UserName" class="highlight">Your username</label>

.. php:method:: text(string $name, array $options)

    FormHelper で利用可能なメソッドには、さらに特定のフォーム
    要素を生成するものがあります。これらのメソッドの多くでは、
    特別な $options パラメータを指定できます。ただしこの場合、
    $options は主に（フォームの要素の DOM id の値のような）
    HTML タグの属性を指定するために使われます::

        echo $this->Form->text('username', array('class' => 'users'));

    出力結果:

    .. code-block:: html

        <input name="data[User][username]" type="text" class="users"
            id="UserUsername" />

.. php:method:: password(string $fieldName, array $options)

    パスワードフィールドを生成します::

        echo $this->Form->password('password');

    出力結果:

    .. code-block:: html

        <input name="data[User][password]" value="" id="UserPassword"
            type="password" />

.. php:method:: hidden(string $fieldName, array $options)

    hidden フィールドを生成します。例::

        echo $this->Form->hidden('id');

    出力結果:

    .. code-block:: html

        <input name="data[User][id]" id="UserId" type="hidden" />

    フォームが編集されると（すなわち、配列 ``$this->request->data`` に
    ``User`` モデルに渡されるべき情報が含まれている場合）、生成される
    HTML の中に ``id`` フィールドに対応する値が自動的に追加されます。
    たとえば data[User][id] = 10 とすると、以下のようになります:

    .. code-block:: html

        <input name="data[User][id]" id="UserId" type="hidden" value="10" />

    .. versionchanged:: 2.0
        hidden フィールドは class 属性を削除しなくなりました。
        これにより、hidden フィールドでバリデーションエラーが発生した場合、
        error-field というクラス名が適用されるようになります。

.. php:method:: textarea(string $fieldName, array $options)

    textarea の入力フィールドを生成します。::

        echo $this->Form->textarea('notes');

    出力結果:

    .. code-block:: html

        <textarea name="data[User][notes]" id="UserNotes"></textarea>

    フォームが編集されると（すなわち、配列 ``$this->request->data`` に
    ``User`` モデルに渡すために保存された情報が含まれている場合）、
    生成される HTML には ``notes`` フィールドに対応する値が自動的に
    含まれます。例:

    .. code-block:: html

        <textarea name="data[User][notes]" id="UserNotes">
        ここのテキストが編集対象となります。
        </textarea>

    .. note::

        ``textarea`` input タイプでは ``$options`` 属性の
        ``'escape'`` キーにより、textarea の内容をエスケープするか
        どうかを指定できます。デフォルトは ``true`` です。

    ::

        echo $this->Form->textarea('notes', array('escape' => false);
        // または ....
        echo $this->Form->input(
            'notes',
            array('type' => 'textarea', 'escape' => false)
        );


    **オプション**

    textarea() は :ref:`general-input-options` 以外にもいくつか
    特定のオプションをサポートしています:

    * ``$options['rows'], $options['cols']`` この２つのキーは行と
      列の数を指定します::

        echo $this->Form->textarea(
            'textarea',
            array('rows' => '5', 'cols' => '5')
        );

      出力結果:

      .. code-block:: html

        <textarea name="data[Form][textarea]" cols="5" rows="5" id="FormTextarea">
        </textarea>

.. php:method:: checkbox(string $fieldName, array $options)

    フォームのチェックボックス要素を生成します。このメソッドはまた、
    そのフィールドについてデータの送信を強制するための hidden 項目を生成します。::

        echo $this->Form->checkbox('done');

    出力結果:

    .. code-block:: html

        <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
        <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />

    $options 配列を使って checkbox の値を指定することもできます::

        echo $this->Form->checkbox('done', array('value' => 555));

    出力結果:

    .. code-block:: html

        <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
        <input type="checkbox" name="data[User][done]" value="555" id="UserDone" />

    FormHelper で hidden 項目を生成したくない場合::

        echo $this->Form->checkbox('done', array('hiddenField' => false));

    出力結果:

    .. code-block:: html

        <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />


.. php:method:: radio(string $fieldName, array $options, array $attributes)

    radio ボタンの組み合わせを生成します。

    **オプション**

    * ``$attributes['value']`` デフォルトで選択される値を設定します。

    * ``$attributes['separator']`` ラジオボタンの間に置かれる HTML
      （たとえば <br />）を指定します。

    * ``$attributes['between']`` legend と最初の要素の間に挿入される
      コンテンツを指定します。

    * ``$attributes['disabled']`` これを ``true`` または ``'disabled'``
      にすると、生成されたすべてのラジオボタンを無効にします。

    * ``$attributes['legend']`` radio 要素はデフォルトでは label
      と fieldset で囲まれます。 ``$attributes['legend']`` を
      false にするとこれらを取り除きます::

        $options = array('M' => 'Male', 'F' => 'Female');
        $attributes = array('legend' => false);
        echo $this->Form->radio('gender', $options, $attributes);

      出力結果:

      .. code-block:: html

        <input name="data[User][gender]" id="UserGender_" value=""
            type="hidden" />
        <input name="data[User][gender]" id="UserGenderM" value="M"
            type="radio" />
        <label for="UserGenderM">Male</label>
        <input name="data[User][gender]" id="UserGenderF" value="F"
            type="radio" />
        <label for="UserGenderF">Female</label>


    何らかの理由で hidden input が不要な場合、 ``$attributes['value']``
    を選択される値もしくは false にすることで hidden を出力しなく
    なります。

    * ``$attributes['fieldset']`` legend 属性に false がセットされていなければ、
      この属性は fieldset 要素のクラスを設定するために使用できます。

 
    .. versionchanged:: 2.1
        ``$attributes['disabled']`` オプションは 2.1 で追加されました。
        
    .. versionchanged:: 2.8.5
        ``$attributes['fieldset']`` オプションは 2.8.5 で追加されました。

.. php:method:: select(string $fieldName, array $options, array $attributes)

    select 要素を作成します。 ``$options`` で項目を定義し、デフォルトで
    選択される値を ``$attributes['value']`` で指定します。``$attributes``
    変数に 'empty' キーを作って false を設定することで、デフォルトの
    empty オプションを無効にします。::

        $options = array('M' => 'Male', 'F' => 'Female');
        echo $this->Form->select('gender', $options);

    出力結果:

    .. code-block:: html

        <select name="data[User][gender]" id="UserGender">
        <option value=""></option>
        <option value="M">Male</option>
        <option value="F">Female</option>
        </select>

    ``select`` input タイプでは、 ``'escape'`` と呼ばれる特別な
    ``$option`` 属性に真偽値を設定することで、select オプションの中身を
    エンコードするかどうかを指定できます。デフォルトは true です::

        $options = array('M' => 'Male', 'F' => 'Female');
        echo $this->Form->select('gender', $options, array('escape' => false));

    * ``$attributes['options']`` このキーにより、select input または
      ラジオボタンのグループについて、オプションをマニュアルで指定できます。
      'type' に 'radio' と指定されない限り、FormHelper は目的とする
      出力を select input と仮定します::

        echo $this->Form->select('field', array(1,2,3,4,5));

      出力結果:

      .. code-block:: html

        <select name="data[User][field]" id="UserField">
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>

      オプションはキー／バリューの組み合わせでも指定できます::

        echo $this->Form->select('field', array(
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2',
            'Value 3' => 'Label 3'
        ));

      出力結果:

      .. code-block:: html

        <select name="data[User][field]" id="UserField">
            <option value=""></option>
            <option value="Value 1">Label 1</option>
            <option value="Value 2">Label 2</option>
            <option value="Value 3">Label 3</option>
        </select>

      select を optgroup 付きで作成したい場合は、データを階層的に指定
      します。これは複数のチェックボックスやラジオボタンでも有効ですが、
      optgroup では要素をフィールドセットで囲みます::

        $options = array(
           'Group 1' => array(
              'Value 1' => 'Label 1',
              'Value 2' => 'Label 2'
           ),
           'Group 2' => array(
              'Value 3' => 'Label 3'
           )
        );
        echo $this->Form->select('field', $options);

      出力結果:

      .. code-block:: html

        <select name="data[User][field]" id="UserField">
            <optgroup label="Group 1">
                <option value="Value 1">Label 1</option>
                <option value="Value 2">Label 2</option>
            </optgroup>
            <optgroup label="Group 2">
                <option value="Value 3">Label 3</option>
            </optgroup>
        </select>

    * ``$attributes['multiple']`` input に対して 'multiple' が true に
      セットされると、ひとつの select として出力されます::

        echo $this->Form->select(
            'Model.field',
            $options,
            array('multiple' => true)
        );

      一方、'multiple' を 'checkbox' にすると、関連するチェックボックス
      の一覧を出力します::

        $options = array(
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2'
        );
        echo $this->Form->select('Model.field', $options, array(
            'multiple' => 'checkbox'
        ));

      出力結果:

      .. code-block:: html

        <div class="input select">
           <label for="ModelField">Field</label>
           <input name="data[Model][field]" value="" id="ModelField"
            type="hidden">
           <div class="checkbox">
              <input name="data[Model][field][]" value="Value 1"
                id="ModelField1" type="checkbox">
              <label for="ModelField1">Label 1</label>
           </div>
           <div class="checkbox">
              <input name="data[Model][field][]" value="Value 2"
                id="ModelField2" type="checkbox">
              <label for="ModelField2">Label 2</label>
           </div>
        </div>

    * ``$attributes['disabled']`` チェックボックスを生成する際、この
      オプションをセットするとすべてもしくは特定のチェックボックスを
      無効にします。すべてのチェックボックスを無効にするには
      'disabled' を ``true`` にします::

        $options = array(
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2'
        );
        echo $this->Form->select('Model.field', $options, array(
            'multiple' => 'checkbox',
            'disabled' => array('Value 1')
        ));

      出力結果:

      .. code-block:: html

        <div class="input select">
           <label for="ModelField">Field</label>
           <input name="data[Model][field]" value="" id="ModelField"
            type="hidden">
           <div class="checkbox">
              <input name="data[Model][field][]" disabled="disabled"
                value="Value 1" id="ModelField1" type="checkbox">
              <label for="ModelField1">Label 1</label>
           </div>
           <div class="checkbox">
              <input name="data[Model][field][]" value="Value 2"
                id="ModelField2" type="checkbox">
              <label for="ModelField2">Label 2</label>
           </div>
        </div>

    .. versionchanged:: 2.3
        ``$attributes['disabled']`` の中の配列のサポートは 2.3 で
        追加されました。

.. php:method:: file(string $fieldName, array $options)

    フォームにファイルアップロードのための項目を追加するためには、
    まずフォームの enctype を "multipart/form-data" にする必要が
    ありますので、create 関数で以下のようにしています::

        echo $this->Form->create('Document', array(
            'enctype' => 'multipart/form-data'
        ));
        // または
        echo $this->Form->create('Document', array('type' => 'file'));

    次にフォームビューファイルに以下のいずれかを追加します::

        echo $this->Form->input('Document.submittedfile', array(
            'between' => '<br />',
            'type' => 'file'
        ));

        // または

        echo $this->Form->file('Document.submittedfile');

    HTML 自体の制限により、'file' タイプの入力フィールドにデフォルト
    値を設定することはできません。フォームを表示するたびに毎回、
    中の値は空に設定されます。

    フォームの送信に際して file フィールドは、フォームを受信しようと
    しているスクリプトに対して拡張された data 配列を提供します。

    CakePHP が Windows サーバ上にインストールされている場合、上記の例
    について、送信されるデータ配列内の値は以下のように構成されます。
    Unix 環境では 'tmp\_name' が異なったパスになります::

        $this->request->data['Document']['submittedfile'] = array(
            'name' => 'conference_schedule.pdf',
            'type' => 'application/pdf',
            'tmp_name' => 'C:/WINDOWS/TEMP/php1EE.tmp',
            'error' => 0,
            'size' => 41737,
        );

    この配列は PHP 自体によって生成されます。PHP が file フィールドを
    通してデータをどう処理しているのかについては、PHP マニュアルの
    ファイルアップロードのセクション
    `<http://php.net/features.file-upload>`_ を読んでみてください。

アップロードの検証
------------------

モデルの中で定義できる、ファイルが正しくアップロードされたかどうかを
検証するためのバリデーションメソッドの例を以下に示します::

    public function isUploadedFile($params) {
        $val = array_shift($params);
        if ((isset($val['error']) && $val['error'] == 0) ||
            (!empty( $val['tmp_name']) && $val['tmp_name'] != 'none')
        ) {
            return is_uploaded_file($val['tmp_name']);
        }
        return false;
    }

file タイプの入力フィールドを生成::

    echo $this->Form->create('User', array('type' => 'file'));
    echo $this->Form->file('avatar');

出力結果:

.. code-block:: html

    <form enctype="multipart/form-data" method="post" action="/users/add">
    <input name="data[User][avatar]" value="" id="UserAvatar" type="file">

.. note::

    ``$this->Form->file()`` を使う場合、 ``$this->Form->create()``
    の中の type オプションを 'file' に設定することで、フォームの
    エンコーディングのタイプを設定できます。

ボタンと submit 要素の生成
==========================

.. php:method:: submit(string $caption, array $options)

    submit ボタンをキャプション ``$caption`` 付きで作成します。
    ``$caption`` が画像への URL の場合（'.' 文字を含む場合）、
    submit ボタンは画像として描画されます。

    デフォルトでは submit ボタンは ``div`` タグで括られます。
    これを避けるには ``$options['div'] = false`` を指定します::

        echo $this->Form->submit();

    出力結果:

    .. code-block:: html

        <div class="submit"><input value="Submit" type="submit"></div>

    caption パラメーターではキャプション文字列の代わりに画像への
    相対または絶対 URL を指定できます::

        echo $this->Form->submit('ok.png');

    出力結果:

    .. code-block:: html

        <div class="submit"><input type="image" src="/img/ok.png"></div>

.. php:method:: button(string $title, array $options = array())

    指定されたタイトルとデフォルトの "button" タイプで HTML のボタンを
    作成します。 ``$options['type']`` では以下の３つのいずれかを
    指定できます:

    #. submit: ``$this->Form->submit`` メソッドと同じ（デフォルト）
    #. reset: フォームのリセットボタンを作成
    #. button: 標準のプッシュボタンを作成

    ::

        echo $this->Form->button('A Button');
        echo $this->Form->button('Another Button', array('type' => 'button'));
        echo $this->Form->button('Reset the Form', array('type' => 'reset'));
        echo $this->Form->button('Submit Form', array('type' => 'submit'));

    出力結果:

    .. code-block:: html

        <button type="submit">A Button</button>
        <button type="button">Another Button</button>
        <button type="reset">Reset the Form</button>
        <button type="submit">Submit Form</button>


    ``button`` タイプは ``escape`` オプションをサポートしています。
    これはそのボタンの $title を HTML エンティティでエンコードするか
    どうかを表す真偽値で、デフォルトは false です::

        echo $this->Form->button('Submit Form', array(
            'type' => 'submit',
            'escape' => true
        ));

.. php:method:: postButton(string $title, mixed $url, array $options = array ())

    POST で送信するための、 ``<form>`` で囲まれた  ``<button>`` タグを生成します。

    このメソッドは ``<form>`` 要素を作成します。そのため、この
    メソッドを開いているフォームの中では使わないでください。
    開いているフォームの中でボタンを生成するには、代わりに
    :php:meth:`FormHelper::submit()` または
    :php:meth:`FormHelper::button()` を使ってください。

.. php:method:: postLink(string $title, mixed $url = null, array $options = array ())

    HTML のリンクを作りますが、その URL へのアクセス方法を POST にします。
    ブラウザで JavaScript を有効にする場合はこれが必要です。

    このメソッドは ``<form>`` 要素を作成します。もし、このメソッドを、既存のフォームの中で
    使用したい場合、 新しいフォームが既存のフォームの外に作成されるようにするために ``inline``
    や ``block`` オプションを使用しなければなりません。

    もし、あなたのフォームを投稿するボタンを探しているなら、代わりに
    :php:meth:`FormHelper::submit()` を使用してください。

    .. versionchanged:: 2.3
        ``method`` オプションが追加されました。

    .. versionchanged:: 2.5
        ``inline`` と ``block`` オプションが追加されました。これらは、リンクを返す代わりに
        生成されたフォームタグのバッファリングができます。これは、ネストされたフォームタグを
        避けることを助けます。 ``'inline' => true`` 設定は、 フォームタグを ``postLink``
        コンテントブロックもしくは、 ``block`` オプションで指定したカスタムブロックに追加します。

    .. versionchanged:: 2.6
        引数 ``$confirmMessage`` は非推奨です。 代わりに ``$options`` の中の
        ``confirm`` キーを使用してください。

日付と時刻入力の生成
====================

.. php:method:: dateTime($fieldName, $dateFormat = 'DMY', $timeFormat = '12', $attributes = array())

    日付と時刻の select input の組み合わせを生成します。$dateformat
    で有効な値は 'DMY', 'MDY', 'YMD', 'NONE'  です。$timeFormat
    で有効な値は '12', '24', null です。

    attributes パラメータの中で "array('empty' => false)" を設定すると
    空の値を表示しなくなります。この設定はまた、現在の日付と時刻を
    事前に選択されている状態にします。

.. php:method:: year(string $fieldName, int $minYear, int $maxYear, array $attributes)

    ``$minYear`` と ``$maxYear`` の範囲で年の select 要素を生成します。
    $attributes の中で HTML 属性を指定可能です。
    ``$attributes['empty']`` を false にすると、空のオプションが
    含まれなくなります::

        echo $this->Form->year('purchased', 2000, date('Y'));

    出力結果:

    .. code-block:: html

        <select name="data[User][purchased][year]" id="UserPurchasedYear">
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

.. php:method:: month(string $fieldName, array $attributes)

    月の名前を羅列した select 要素を生成します::

        echo $this->Form->month('mob');

    出力結果:

    .. code-block:: html

        <select name="data[User][mob][month]" id="UserMobMonth">
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

    'monthNames' 属性に固有の月の名前を設定することもできます。
    また false を指定すると、月が数字で表示されます。（注意：デフォルト
    の月の名前はローカライゼーションによって翻訳されたものがセット
    されます。）::

        echo $this->Form->month('mob', array('monthNames' => false));

.. php:method:: day(string $fieldName, array $attributes)

    （数字の）日を列挙する select 要素を生成します。

    （たとえば最初のオプションが 'Day' とすると）空のオプションを作って
    選択中のテキストを表示させるために、最終パラメータとして以下のように
    テキストを指定できます（意味不明：原文は以下のとおり＞
    To create an empty option with prompt text of your choosing (e.g.
    the first option is 'Day'), you can supply the text as the final
    parameter as follows）::

        echo $this->Form->day('created');

    出力結果:

    .. code-block:: html

        <select name="data[User][created][day]" id="UserCreatedDay">
        <option value=""></option>
        <option value="01">1</option>
        <option value="02">2</option>
        <option value="03">3</option>
        ...
        <option value="31">31</option>
        </select>

.. php:method:: hour(string $fieldName, boolean $format24Hours, array $attributes)

    時を列挙した select 要素を生成します。

.. php:method:: minute(string $fieldName, array $attributes)

    分を列挙した select 要素を生成します。

.. php:method:: meridian(string $fieldName, array $attributes)

    'am' または 'pm' を列挙した select 要素を生成します。

エラーの表示とチェック
======================

.. php:method:: error(string $fieldName, mixed $text, array $options)

    $text で指定された入力項目について、バリデーションエラーが発生した場合に
    バリデーションエラーメッセージを表示します。

    オプション:

    -  'escape' ブール値：エラーコンテンツを HTML エスケープするかどうか。
    -  'wrap' mixed: エラーメッセージを div で囲うかどうか。
       文字列の場合、HTML タグとして使われます。
    -  'class' 文字列：エラーメッセージのクラス名

.. php:method:: isFieldError(string $fieldName)

    与えられた $fieldName がアクティブなバリデーションエラーになって
    いるかどうかを返します::

        if ($this->Form->isFieldError('gender')) {
            echo $this->Form->error('gender');
        }

    .. note::

        :php:meth:`FormHelper::input()` を使う場合、デフォルトではエラーが表示されます。

.. php:method:: tagIsInvalid()

    現在のエンティティで示されるフォーム項目にエラーがなければ
    false を返します。そうでなければバリデーションメッセージを返します。

全項目に対するデフォルト値の設定
================================

.. versionadded:: 2.2

:php:meth:`FormHelper::inputDefaults()` を使って ``input()`` に関する
デフォルトのオプションを宣言できるようになりました。デフォルトの
オプションを変更することで、オプション設定の繰り返しをひとつの
メソッドの呼び出しに統合できます::

    $this->Form->inputDefaults(array(
            'label' => false,
            'div' => false,
            'class' => 'fancy'
        )
    );

その時点以降に生成された input 項目はすべて inputDefaults で宣言された
オプションを継承します。input() の呼び出し時に option を指定することで、
デフォルトのオプションを上書きできます::

    echo $this->Form->input('password'); // No div, no label with class 'fancy'
    // has a label element same defaults
    echo $this->Form->input(
        'username',
        array('label' => 'Username')
    );

セキュリティコンポーネントを使う
================================

:php:meth:`SecurityComponent` は、あなたのフォームをより安全にするための
いくつかの機能を提供します。あなたのコントローラーに ``SecurityComponent``
を含めるだけで、自動的に CSRF やフォームの不正改造を防いでくれます。

SecurityComponent を利用する際は、前述のようにフォームを閉じる際は
必ず :php:meth:`FormHelper::end()` を使う必要があります。これにより
特別な ``_Token`` input が生成されます。

.. php:method:: unlockField($name)

    ``SecurityComponent`` によるフィールドのハッシュ化が行われないように
    フィールドをアンロックします。またこれにより、そのフィールドを
    JavaScript で操作できるようになります。 ``$name`` にはその input の
    エンティティ名を指定します::

        $this->Form->unlockField('User.id');

.. php:method:: secure(array $fields = array())

    フォームの中で使われるフィールドについて、セキュリティハッシュ化
    された hidden フィールドを生成します。

.. _form-improvements-1-3:

2.0 アップデート内容
====================

**$selected パラメータは削除されました**

FormHelper のいくつかのメソッドから ``$selected`` パラメータが
削除されました。現在はすべてのメソッドで ``$attributes['value']``
キーがサポートされており、これを ``$selected`` の代わりに使うべきです。
この変更は FormHelper のメソッドをシンプルにし、引数の数を減らし、
``$selected`` が生成する重複を減らします。影響を受けるメソッドは
以下の通りです:

* FormHelper::select()
* FormHelper::dateTime()
* FormHelper::year()
* FormHelper::month()
* FormHelper::day()
* FormHelper::hour()
* FormHelper::minute()
* FormHelper::meridian()

**フォーム上のデフォルトの URL は、現在のアクションです**

すべてのフォームに関するデフォルトの URL は、現在の pass パラメータ、named パラメータ、
クエリー文字列を含みます。 ``$this->Form->create()`` の第二パラメータである
``$options['url']`` を指定することで、このデフォルト動作を変更できます。

**FormHelper::hidden()**

hidden フィールドは、class 属性を削除しなくなりました。
つまり、hidden フィールドにバリデーションエラーがあった場合、
クラス名として error-field が適用されます。

.. meta::
    :title lang=ja: FormHelper
    :description lang=ja: The FormHelper focuses on creating forms quickly, in a way that will streamline validation, re-population and layout.
    :keywords lang=ja: html helper,cakephp html,form create,form input,form select,form file field,form label,form text,form password,form checkbox,form radio,form submit,form date time,form error,validate upload,unlock field,form security
