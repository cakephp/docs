フォーム
########

CakePHPにFormHelperが新たに追加されました。複雑なフォームの組み立てのほとんどをこの新しいクラスで行えるようになりました。しばらくの間は(非推奨ですが)HtmlHelperにもメソッドがあります。FormHelperはフォームを素早く作成する事に焦点を置き,
効率的な検証、記述の削減やレイアウトの為の方法になります。またFormHelperは柔軟でもあります。
フォームの全てを魔法のように自動的に組み立てる事も出来る一方で、特定のメソッドだけを必要な時に利用する事もできます。

フォームの作成
==============

FormHelperを活用する為にまず利用するメソッドは ``create()``
です。この特別なメソッドはフォームタグの開始タグを出力します。

``create(string $model = null, array $options = array())``

全てのパラメータはオプションです。\ ``create()``
が、何のパラメータも与えられずコールされた場合、現在のコントローラーの
``add()`` もしくは ``edit()``
アクションに対するフォームを作成しようとしていると想定します。フォームのメソッドのデフォルトは
POST です。フォームの構成要素は DOM ID 付きで返されます。ID は CamelCase
化されたコントローラーのアクション名とモデル名から生成されます。\ ``create()``
を UsersControllerのビューの中で呼んだ場合、下記の様に出力されます。

::

    <form id="UserAddForm" method="post" action="/users/add">

しかしながら、\ ``create()``
メソッドはパラメータを使ってさまざまなカスタマイズを行う事ができます。まず、モデル名を指定する事が出来ます。フォームに対してモデル名を指定した場合、フォームの
*context*
を指定した事になります。これにより全てのフィールドは(別に指定されない限り)このモデルに対する項目と想定され、また関連づけられた全てのモデルを参照します。特にモデルを指定しなかった場合は現在のコントローラーのデフォルトのモデルを使用すると想定します。

::

    <?php echo $form->create('Recipe'); ?>
     
    //出力:
    </form><form id="RecipeAddForm" method="post" action="/recipes/add">

このフォームは RecipesController の ``add()`` アクションに対してデータを
POST します。さらに編集用のフォームとしても利用できます。FormHelper は
``$this->data``
プロパティを利用して自動的に追加もしくは編集用のフォームを生成します。\ ``$this->data``
はモデル名をキーとしたフォームのモデルに対するデータを保持しています。そしてモデルのプライマリキーに対して空白でない値がある場合、
FormHelper は該当のレコードに対する編集フォームを生成します。例えば
http://site.com/recipes/edit/5
にアクセスした場合は下記のようになります。

::

    // controllers/recipes_controller.php:
    <?php
    function edit($id = null) {
        if (empty($this->data)) {
            $this->data = $this->Recipe->findById($id);
        } else {
            // Save logic goes here
        }
    }
    ?>

    // views/recipes/edit.ctp:

    // Since $this->data['Recipe']['id'] = 5, we should get an edit form
    <?php echo $form->create('Recipe'); ?>

    //Output:
    </form><form id="RecipeEditForm" method="post" action="/recipes/edit/5">
    <input type="hidden" name="_method" value="PUT" />

これは編集フォームである為、デフォルトの HTTP メソッドを上書きする為の
hidden フィールドが生成されます。

``$options``
はほとんどの場合の設定に利用できる配列です。この配列にはフォームタグを作成する際に指定したいオプションのキーと値のペアを必要なだけ指定できます。

$options[‘type’]
----------------

このキーは作成するフォームの種類を指定する為に使います。指定する値は「post」「get」「file」「put」「delete」です。

「post」「get」のいずれかを与えた場合はフォームのメソッドもこれに従います。

::

    <?php echo $form->create('User', array('type' => 'get')); ?>
     
    //出力:
    <form id="UserAddForm" method="get" action="/users/add">

「file」を指定した場合は作成するフォームのメソッドは「post」になり、さらにenctypeに「multipart/form-data」が追加されます。フォームの中にfile要素が存在していない場合でも同様です。enctype属性が適切に指定されていない場合はファイルアップロード機能が正しく機能しなくなります。

::

    <?php echo $form->create('User', array('type' => 'file')); ?>
     
    //出力:
    <form id="UserAddForm" enctype="multipart/form-data" method="post" action="/users/add">

「put」「delete」が指定された時はあなたのフォームは「post」のフォームと同等に機能します。
しかし送信された後、HTTPリクエストのメソッドはそれぞれ「PUT」「DELETE」に上書きされます。これによりCakePHPは正式なRESTをWEBブラウザでエミュレートする事ができます。

$options[‘action’]
------------------

actionキーはあなたにフォームのactionに対して、現在のコントローラーのいずれかのアクションを指定する事が出来ます。たとえばあなたがフォームのあて先に現在のコントローラーのlogin()アクションを指定したい場合、あなたが指定する$options配列は下記のようになります。

::

    <?php echo $form->create('User', array('action' => 'login')); ?>
     
    //出力:
    <form id="UserLoginForm" method="post" action="/users/login">
    </form>

$options[‘url’]
---------------

あなたが望むフォームのアクションが現在のコントローラー内に無い場合、$options配列の「url」キーを利用してURLを指定する事が出来ます。指定するURLはCakePHPのアプリケーションと連動させる事ができます。また外部のドメインのURLを指定する事も出来ます。

::

    <?php echo $form->create(null, array('url' => '/recipes/add')); ?>
    // あるいは
    <?php echo $form->create(null, array('url' => array('controller' => 'recipes', 'action' => 'add'))); ?>


    //出力:
    <form method="post" action="/recipes/add">
     
    <?php echo $form->create(null, array(
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    )); ?>
     
    //出力:
    <form method="get" action="http://www.google.com/search">

$options[‘default’]
-------------------

‘default’がbooleanのfalseにセットされた場合、フォームの送信ボタンが押された際にフォームを送信しなくなります。フォームをAJAXを利用して送信する場合は'default'にfalseをセットする事で、フォームの本来の振る舞いを抑制してデータと送信をAJAXが替わりに行う事が出来ます。

フォームの終了
==============

FormHelperにはフォームの記述を完了させる end()
メソッドも含まれています。多くの場合、end()
はフォームタグの終了タグを出力するのみですが、end()は他のメソッドが必要とした場合に
hidden 要素を同時に出力する事ができます。

::

    <?php echo $form->create(); ?>
     
    <!-- Form elements go here -->
     
    <?php echo $form->end(); ?>

end()の最初のパラメータに文字列が指定された場合、FormHelperはそれに沿った送信ボタンを終了タグと共に出力します。

::

    <?php echo $form->end('Finish'); ?>
     
    出力:
     
    <div class="submit">
        <input type="submit" value="Finish" />
    </div>
    </form>

フォーム要素の自動生成
======================

はじめに、フォームを自動的に作成する FormHelper
のいくつかのメソッドを見ていきましょう。主なメソッドは input()
です。このメソッドは各フィールドに適切な input
を生成するために、自動的に提供されたモデルのフィールドを確認します。

input(string $fieldName, array $options = array())

+--------------------------------------------------+-------------------------------------------+
| カラム型                                         | フォームフィールドの結果                  |
+==================================================+===========================================+
| string (char, varchar, etc.)                     | text                                      |
+--------------------------------------------------+-------------------------------------------+
| boolean, tinyint(1)                              | checkbox                                  |
+--------------------------------------------------+-------------------------------------------+
| text                                             | textarea                                  |
+--------------------------------------------------+-------------------------------------------+
| text, with name of password, passwd, or psword   | password                                  |
+--------------------------------------------------+-------------------------------------------+
| date                                             | 日、月、そして年の select                 |
+--------------------------------------------------+-------------------------------------------+
| datetime, timestamp                              | 日、月、年、時、分そして子午線の select   |
+--------------------------------------------------+-------------------------------------------+
| time                                             | 時、分そして子午線の select               |
+--------------------------------------------------+-------------------------------------------+

例として、 User
モデルに「username」(varchar)、「password」(varchar)、「approved」(datetime)、「quote」(text)
というフィールドが存在するとしましょう。これらの各フォームフィールドに適切な
input を作成するために、 FormHelper の input() メソッドを使用します。

::

    <?php echo $form->create(); ?>
     
        <?php
            echo $form->input('username');   //text
            echo $form->input('password');   //password
            echo $form->input('approved');   //日、月、年、時間、分そして子午線
            echo $form->input('quote');      //textarea
        ?>
     
    <?php echo $form->end('Add'); ?>

date フィールドはたくさんのオプションを持ちます。例を見てみましょう。

::

            echo $form->input('birth_dt', array( 'label' => 'Date of birth'
                                        , 'dateFormat' => 'DMY'
                                        , 'minYear' => date('Y') - 70
                                        , 'maxYear' => date('Y') - 18 ));

仕上げに、 hasAndBelongsToMany の select を生成する例を示します。User が
Group に hasAndBelongsToMany
のアソシエーションを持っていると仮定します。コントローラで、キャメル記法で複数形の変数(この例では
group -> groups あるいは ExtraFunkyModel -> extraFunkyModels)を select
オプションにセットしてください。コントローラアクション中で次のようにします。

::

    $this->set('groups', $this->User->Group->find('list'));

そして view での複数選択が簡単なコードで作成できるはずです。

::

    echo $form->input('Group');

belongsTo あるいは hasOne の関連において、select
フィールドを生成するなら、Users
コントローラに次のコードを追加してください(User belongsTo Group
とします)。:

::

    $this->set('groups', $this->User->Group->find('list'));

その後に、フォームを作成するビューに、次のコードを追加してください。

::

    echo $form->input('group_id');

フィールドの命名に関する慣習
----------------------------

フォームヘルパーはとてもスマートです。フォームヘルパーのメソッドでフィールドの命名規則を定義する時はいつでも、input
タグを構築するにあたり現在使用しているモデルの名前を使用します。例えば次のようになります。

::

    <input type="text" id="ModelnameFieldname" name="data[Modelname][fieldname]">

第一引数として Modelname.fieldname
という形式を渡すことで、手動でモデル名を定義することができます。

::

    echo $form->input('Modelname.fieldname');

同じフィールド名を使って複数のフィールドを定義する場合、次のような方法で配列を生成すると、
saveAll() で一度に保存することができます。

::

    <?php 
       echo $form->input('Modelname.0.fieldname');
       echo $form->input('Modelname.1.fieldname');
    ?>

    <input type="text" id="Modelname0Fieldname" name="data[Modelname][0][fieldname]">
    <input type="text" id="Modelname1Fieldname" name="data[Modelname][1][fieldname]">

$options[‘type’]
----------------

型を定義することで、 input
タグの型を強制的にそれにし、モデルが持つフィールドの型も上書きします。テーブルで定義されうる型に加え、「file」と「password」の入力フィールドを作成することもできます。

::

    <?php echo $form->input('field', array('type' => 'file')); ?>
     
    Output:
     
    <div class="input">
        <label for="UserField">Field</label>
        <input type="file" name="data[User][field]" value="" id="UserField" />
    </div>

$options[‘before’], $options[‘between’], $options[‘separator’] and $options[‘after’]
------------------------------------------------------------------------------------

input()
メソッドの出力の中に、何か記述を挿入する必要がある場合は、これらのキーを使用してください。

::

    <?php echo $form->input('field', array(
        'before' => '--before--',
        'after' => '--after--',
        'between' => '--between---'
    ));?>
     
    Output:
     
    <div class="input">
    --before--
    <label for="UserField">Field</label>
    --between---
    <input name="data[User][field]" type="text" value="" id="UserField" />
    --after--
    </div>

「separator」属性はラジオボタンを作成するときに使用し、各 input/label
ペアの間に記述を挿入することができます。

::

    <?php echo $form->input('field', array(
        'before' => '--before--',
        'after' => '--after--',
        'between' => '--between---',
        'separator' => '--separator--',
        'options' => array('1', '2') 
    ));?>
     
    Output:
     
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

$options[‘options’]
-------------------

このキーは select
による入力、ラジオボタンのグループに対する定義を手動で行います。「type」が「radio」と定義されていない場合、
FormHelper は対象となる出力は select
による入力フォームであると仮定します。

::

    <?php echo $form->input('field', array('options' => array(1,2,3,4,5))); ?>
     
    Output:
     
    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>
    </div>

オプションはキーと値のペアで提供することもできます。

::

    <?php echo $form->input('field', array('options' => array(
        'Value 1'=>'Label 1',
        'Value 2'=>'Label 2',
        'Value 3'=>'Label 3'
     ))); ?>

    Output:
     
    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <option value="Value 1">Label 1</option>
            <option value="Value 2">Label 2</option>
            <option value="Value 3">Label 3</option>
        </select>
    </div>

$options[‘multiple’]
--------------------

select を出力するにあたり「multiple」が true
にセットしてあった場合、その select
の入力は複数選択が許可されます。「multiple」の代わりに「checkbox」を指定することで、関連したチェックボックスのリストを出力することができます。

::

    $form->input('Model.field', array( 'type' => 'select', 'multiple' => true ));
    $form->input('Model.field', array( 'type' => 'select', 'multiple' => 'checkbox' ));

$options[‘maxLength’]
---------------------

text の input において許容する最大の文字列長を定義します。

$options[‘div’]
---------------

このオプションは input タグを内包する div
タグの属性をセットします。文字列によって、 div タグの class
の名前を指定します。配列をセットすると、 div
の属性をその配列のキーと値でセットされます。これらの代わりに、このキーの値を
false にセットすると div が出力されないようになります。

クラス名をセットする:

::

        echo $form->input('User.name', array('div' => 'class_name'));

出力:

::

    <div class="class_name">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

複数の属性をセットする:

::

        echo $form->input('User.name', array('div' => array('id' => 'mainDiv', 'title' => 'Div Title', 'style' => 'display:block')));

出力:

::

    <div class="input text" id="mainDiv" title="Div Title" style="display:block">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

div の出力を無効にする:

::

        <?php echo $form->input('User.name', array('div' => false));?>

出力:

::

        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />

$options[‘label’]
-----------------

このキーに文字列をセットすると、 input タグにいつも付いてくる label
タグの中に、その文字列が表示されます。

::

    <?php echo $form->input( 'User.name', array( 'label' => 'ユーザの別名' ) );?>

Output:

::

    <div class="input">
        <label for="UserName">ユーザの別名</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

このキーに文字列の代わりに false をセットすると、 label
タグの出力は無効化されます。

::

    <?php echo $form->input( 'User.name', array( 'label' => false ) ); ?>

Output:

::

    <div class="input">
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

``label``
要素に追加的なオプションを提供する場合は、配列をセットしてください。この場合、独自の
label のテキストは、配列中の「\ ``text``\ 」キーを使用してください。

::

    <?php echo $form->input( 'User.name', array( 'label' => array('class' => 'thingy', 'text' => 'ユーザの別名') ) ); ?>

Output:

::

    <div class="input">
        <label for="UserName" class="thingy">ユーザの別名</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

$options['legend']
------------------

ラジオボタンのようないくつかの入力項目は、フィールド名から得られる見出しで自動的にラップされます。この見出しを
legend オプションで上書きすることができます。このオプションを false
にセットすると、フィールドセットを完全に消し去ります。

$options[‘id’]
--------------

このキーは input タグの DOM の id を指定します。

$options['error']
-----------------

このキーを使うと、デフォルトのモデルのエラーメッセージを上書きすることができ、国際化したメッセージをセットするといった使い方をすることができます。
このオプションには、要素や要素クラス名のラッピングを制御するための、サブオプションがいくつかあります。

エラーメッセージの出力を行わないようにするには、「error」キーを false
にします。

::

    $form->input('Model.field', array('error' => false));

要素をラップするタイプとそのクラス名を変更するには、次の書式を利用します。

::

    $form->input('Model.field', array('error' => array('wrap' => 'span', 'class' => 'bzzz')));

モデルのエラーメッセージを上書きするには、バリデーションルールをキーの名前にした連想配列を使います。

::

    $form->input('Model.field', array('error' => array('tooShort' => __('This is not long enough', true) )));

前述したとおり、各バリデーションルールのエラーメッセージはモデル中でセットすることができます。追加的に、国際化したメッセージをフォームに用意することができます。

$options['default']
-------------------

select
型入力を組み合わせるために使用します。フォームがはじめに表示された時にデフォルトで選択された状態にする
option
をマークします。エラーが含まれたフォームの送信が行われた後は、選ばれた(あるいは変更された)値を保持します。

使用例:

::

    <?php 
        echo $form->input('country', array('options'=>$countries, 'default'=>'US')); 
    ?>

$options[‘selected’]
--------------------

選択型の入力、つまりタイプが select, date, time, datetime
の入力で使用します。入力する部分をレンダリングする時に selected
属性を設定して、デフォルトで選択状態にしたい項目の値を指定します。

::

    echo $form->input('close_time', array('type' => 'time', 'selected' => '13:30:00'));

$options[‘rows’], $options[‘cols’]
----------------------------------

これらふたつのキーは textarea
の入力項目において行と列の大きさを定義します。

$options[‘empty’]
-----------------

このキーを true にセットすると、 input タグの値を必ず空にします。

select
リストにこの値が渡された場合、空の値が入った空のオプションがドロップダウンリストに生成されます。
ブランクオプションを使わずに空の値の text の表示が必要なら、 string
に空の文字列を渡してください。

::

    <?php echo $form->input('field', array('options' => array(1,2,3,4,5), 'empty' => '(一つ選んでください)')); ?>

出力:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <option value="">(一つ選んでください)</option>
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>
    </div>

パスワードフィールドのデフォルトの値を空にしたいなら、これの代わりに「'value'
=> ''」を使用してください。

オプションはキーと値のペアで渡すこともできます。

$options[‘timeFormat’]
----------------------

時刻に関連した入力に関する select
のフォーマットを定義します。有効な値は「12」、「24」そして「none」です。

$options[‘dateFormat’]
----------------------

日付に関連した入力のセットに関する input
タグのフォーマットを定義します。有効な値は「DMY」、「MDY」、「YMD」そして「NONE」です。

$options['minYear'], $options['maxYear']
----------------------------------------

date または datetime の入力に併せて使用します。 select
フィールドに表示する最初と最後の年を定義します。

$options['interval']
--------------------

このオプションは分のセレクトボックスにおいて、何分間隔を空けるのかを定義します。

::

    <?php echo $form->input('Model.time', array('type' => 'time', 'interval' => 15)); ?>

分を選ぶ欄に、15分ごとの4つの選択肢ができたはずです。

$options['class']
-----------------

You can set the classname for an input field using ``$options['class']``

::

    echo $form->input('title', array('class' => 'custom-class'));

File フィールド
===============

select タイプ、すなわち select, date, time, datetime
の入力において使用します。入力する部分がレンダリングされた時にデフォルトで選択されているアイテムの値を「selected」にセットします。

::

    echo $form->input('close_time', array('type' => 'time', 'selected' => '13:30:00'));

アップロードをバリデートする
----------------------------

次に示すものは、モデルに定義するバリデーションメソッドの例です。このメソッドは、アップロードが成功したかどうかをバリデートします。

::

    // https://bakery.cakephp.org/articles/view/improved-advance-validation-with-parameters のコメント 8 に基づきます

    function isUploadedFile($params){
        $val = array_shift($params);
        if ((isset($val['error']) && $val['error'] == 0) ||
        (!empty($val['tmp_name']) && $val['tmp_name'] != 'none')) 
        {
            return is_uploaded_file($val['tmp_name']);
        } else {
            return false;
        }
    } 

Form 要素固有のメソッド
=======================

FormHelper
で利用可能な残りのメソッドは、特定のフォーム要素の生成するためのものです。これらのメソッドの多くは特別な
$options パラメータも使用します。しかしこの場合、 $options は主に HTML
タグの属性（たとえば value あるいはフォームの要素の DOM id
など）を指定するために使用されます。

::

    <?php echo $form->text('username', array('class' => 'users')); ?>
     
    出力:
     
    <input name="data[User][username]" type="text" class="users" id="UserUsername" />

checkbox
--------

``checkbox(string $fieldName, array $options)``

チェックボックスフォーム要素を生成します。このメソッドは指定されたフィールドのデータを
強制的に submit するために関連する hidden フォーム入力も生成します。

::

    <?php echo $form->checkbox('done'); ?>
     
    出力:
     
    <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
    <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />

button
------

``button(string $title, array $options = array())``

Creates an HTML button with the specified title and a default type of
"button". Setting ``$options['type']`` will output one of the three
possible button types:

#. button: Creates a standard push button (the default).
#. reset: Creates a form reset button.
#. submit: Same as the ``$form->submit`` method.

::

    <?php
    echo $form->button('A Button');
    echo $form->button('Another Button', array('type'=>'button'));
    echo $form->button('Reset the Form', array('type'=>'reset'));
    echo $form->button('Submit Form', array('type'=>'submit'));
    ?>

Will output:

::

    <input type="button" value="A Button" />
    <input type="button" value="Another Button" />
    <input type="reset" value="Reset the Form" />
    <input type="Submit" value="Submit Form" />

year
----

``year(string $fieldName, int $minYear, int $maxYear, mixed $selected, array $attributes, boolean $showEmpty)``

``$minYear`` から ``$maxYear`` までの年を表示する select
要素を生成します。デフォルトでは $selected
で指定された年が選択されます。HTML 属性は $attributes
で指定できます。\ ``$showEmpty`` が false の場合、select は空の option
を含まなくなります。

month
-----

``month(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

月名に関する select 要素を生成します。

::

    <?php
    echo $form->month('mob');
    ?>

と入力すると以下のソースを出力します:

::

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

'monthNames'
属性を使うことで、月の配列を指定することが出来ます。もしくは'monthNames'
属性をfalseにすることで月を数字で表示することもできます。(注意:
標準の月表示は国際化されており、ローカライズすることで翻訳されます)

::

    <?php
    echo $form->month('mob', null, array('monthNames' => false));
    ?>

::

    <select name="data[User][mob][month]" id="UserMobMonth">
    <option value=""></option>
    <option value="01">01</option>
    <option value="02">02</option>
    <option value="03">03</option>
    <option value="04">04</option>
    <option value="05">05</option>
    <option value="06">06</option>
    <option value="07">07</option>
    <option value="08">08</option>
    <option value="09">09</option>
    <option value="10">10</option>
    <option value="11">11</option>
    <option value="12">12</option>
    </select>

dateTime
--------

``dateTime(string $fieldName, string $dateFormat = ‘DMY’, $timeFormat = ‘12’, mixed $selected, array $attributes, boolean $showEmpty)``

日付や時間用の select 入力を生成します。$dateformat で有効な値は、‘DMY’,
‘MDY’, ‘YMD’, ‘NONE’ です。$timeFormat で有効な値は、‘12’, ‘24’, ‘NONE’
です。

day
---

``day(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

月の日にち（数値）に関する select 要素を生成します。

hour
----

``hour(string $fieldName, boolean $format24Hours, mixed $selected, array $attributes, boolean $showEmpty)``

時間に関する select 要素を生成します。

minute
------

``minute(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

分に関する select 要素を生成します。

meridian
--------

``meridian(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

‘am’ や ‘pm’ に関する select 要素を生成します。

error
-----

``error(string $fieldName, string $text, array $options)``

バリデーションエラーが起こったイベントで、指定されたフィールドの $text
で指定したバリデーションエラーメッセージを表示します。

file
----

``file(string $fieldName, array $options)``

ファイル入力を生成します。

hidden
------

``hidden(string $fieldName, array $options)``

hidden フォーム入力を生成します。

isFieldError
------------

``isFieldError(string $fieldName)``

指定された $fieldName にアクティブなバリデーションエラーがある場合に
true を返します。

label
-----

``label(string $fieldName, string $text, array $attributes)``

ラベルタグを生成します。$text でラベルを指定します。

password
--------

``password(string $fieldName, array $options)``

password フィールドを生成します。

radio
-----

``radio(string $fieldName, array $options, array $attributes)``

ラジオボタン入力を生成します。attributes['value']
はデフォルトで選択される値をセットするために使用します。

select
------

``select(string $fieldName, array $options, mixed $selected, array $attributes, boolean $showEmpty)``

select 要素を生成します。\ ``$options``
で選択項目を指定し、\ ``$selected``
で指定されたオプションがデフォルトで選択状態になります。空の選択オプションを表示したくない場合、\ ``$showEmpty``
を false にします。

submit
------

``submit(string $caption, array $options)``

キャプションが ``$caption`` である submit ボタンを生成します。指定された
``$caption`` は画像（‘.’ 文字を含みます）の URL である場合、submit
ボタンは画像として描画されます。

text
----

``text(string $fieldName, array $options)``

テキスト入力フィールドを生成します。

textarea
--------

``textarea(string $fieldName, array $options)``

textarea 入力フィールドを生成します。
