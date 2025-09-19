# FormHelper

`class` **FormHelper**(View $view, array $settings = array())

FormHelper はフォーム作成時の力作業のほとんどを代行してくれます。
フォームをすばやく作成する機能に特化して、バリデーション
（入力値の妥当性検査）や部品の配置、レイアウトを効率化します。
FormHelper はまた柔軟でもあります。
通常は組み込まれた規則に沿ってほとんどのことをやってくれますが、
特定のメソッドを使って必要な機能だけを使うこともできます。

## フォームの作成

FormHelper の利点を活用するために最初に使うメソッドは `create()`
です。この特別なメソッドはフォームの開始タグを出力します。

`method` FormHelper::**create**(string $model = null, array $options = array())

### create() のオプション

create() には多くのオプションがあります:

- `$options['type']` このキーは生成するフォームのタイプを指定します。
  有効な値は 'post', 'get', 'file', 'put', 'delete' です。

  'post' と 'get' は、フォームの送信用メソッドをこの通り変更します:

  ``` php
  echo $this->Form->create('User', array('type' => 'get'));
  ```

  出力結果:

  ``` html
  <form id="UserAddForm" method="get" action="/users/add">
  ```

  タイプ 'file' はフォームの送信用メソッドを 'post' にして、かつフォーム
  タグに "multipart/form-data" という enctype を追加します。これはフォーム
  内に何らかのファイル要素がある場合に指定されるべきものです。適切な
  enctype 属性が抜けていると、ファイルのアップロードがうまく動きません:

  ``` php
  echo $this->Form->create('User', array('type' => 'file'));
  ```

  出力結果:

  ``` html
  <form id="UserAddForm" enctype="multipart/form-data"
     method="post" action="/users/add">
  ```

  'put' や 'delete' を使う場合、そのフォームは機能的に 'post' と同じですが、
  送信される際、HTTP のリクエストメソッドが 'PUT' または 'DELETE'
  に上書きされます。これにより、Web ブラウザにおける REST サポートを
  CakePHP がエミュレートできるようになります。

- `$options['action']` 現在のコントローラーにおいて、特定のアクションに
  対してフォームデータを送り込むことができます。たとえば現在のコントローラー
  の login() アクションにフォームデータを渡したい場合、\$options 配列には
  以下のように指定します:

  ``` php
  echo $this->Form->create('User', array('action' => 'login'));
  ```

  出力結果:

  ``` html
  <form id="UserLoginForm" method="post" action="/users/login">
  ```

  <div class="deprecated">

  2.8.0
  `$options['action']` オプションは、 2.8.0 で非推奨になりました。
  代わりに `$options['url']` と `$options['id']` オプションを使用してください。

  </div>

- `$options['url']` 現在のコントローラー以外にフォームデータを渡したい
  場合、\$options 配列の 'url' キーを使ってフォームアクションの URL
  を指定します。指定された URL は作成中の CakePHP アプリケーションに
  対する相対値を指定できます:

  ``` php
  echo $this->Form->create(false, array(
      'url' => array('controller' => 'recipes', 'action' => 'add'),
      'id' => 'RecipesAdd'
  ));
  ```

  出力結果:

  ``` html
  <form method="post" action="/recipes/add">
  ```

  もしくは、外部ドメインも指定可能です:

  ``` php
  echo $this->Form->create(false, array(
      'url' => 'https://www.google.com/search',
      'type' => 'get'
  ));
  ```

  出力結果:

  ``` html
  <form method="get" action="https://www.google.com/search">
  ```

  さらにいろいろなタイプの URL を指定する例は、`HtmlHelper::url()`
  メソッドを参照してみてください。

  ::: info Changed in version 2.8.0
  form action として URL を出力させたくない場合、`'url' => false` を使用してください。
  :::

- `$options['default']` 'default' がブール値の false に設定されている場合、
  フォームの submit アクションが変更され、submit ボタンを押してもフォームが
  submit されなくなります。そのフォームが AJAX を経由して submit するように
  なっている場合は 'default' を false にしてフォームのデフォルトの挙動を
  抑止し、その代わり AJAX 経由でデータを取得して submit するようにできます。

- `$options['inputDefaults']` `input()` のデフォルトオプションの
  組合せを `inputDefaults` キーとしてセットすると、入力生成における
  標準の振る舞いをカスタマイズできます。:

  ``` php
  echo $this->Form->create('User', array(
      'inputDefaults' => array(
          'label' => false,
          'div' => false
      )
  ));
  ```

  これ以降に生成される入力項目は、すべて inputDefaults で宣言された
  オプションを継承します。デフォルトのオプションを上書きするには
  input() 呼び出しで以下のようにオプションを指定します:

  ``` php
  echo $this->Form->input('password'); // div も label も持たない
  // label 要素を持つ
  echo $this->Form->input(
      'username',
      array('label' => 'Username')
  );
  ```

## フォームを閉じる

`method` FormHelper::**end**($options = null, $secureAttributes = array())

## フォーム要素の生成

FormHelper でフォームの input 要素を作る方法はいくつかあります。まずは
`input()` に注目してみましょう。このメソッドは与えられたモデル内の
項目を自動的に調べて、それらの項目に対応する適切な入力項目を作ります。
内部的には `input()` は FormHelper 内で他のメソッドに処理を委託します。

`method` FormHelper::**input**(string $fieldName, array $options = array())

`method` FormHelper::**inputs**(mixed $fields = null, array $blacklist = null, $options = array())

### 項目名の命名規則

FormHelper は結構よくできています。FormHelper のメソッドで
項目名を指定すれば、常に自動的に現在のモデル名を使って以下のような
書式で input タグを作ってくれます:

``` html
<input type="text" id="ModelnameFieldname" name="data[Modelname][fieldname]">
```

これにより、そのフォームが対象とするモデルの input タグを生成する際、
モデル名を省略できます。関連付けられたモデルや任意のモデルについての
input タグを生成する場合は、最初のパラメータとして モデル名.項目名 を
渡します。:

``` php
echo $this->Form->input('Modelname.fieldname');
```

同じ項目名で複数の項目を指定したい場合、すなわち一度の saveAll()
で配列として値を保存したい場合は以下の様な書式を使います:

``` php
echo $this->Form->input('Modelname.0.fieldname');
echo $this->Form->input('Modelname.1.fieldname');
```

その出力は以下のようになります:

``` html
<input type="text" id="Modelname0Fieldname"
    name="data[Modelname][0][fieldname]">
<input type="text" id="Modelname1Fieldname"
    name="data[Modelname][1][fieldname]">
```

FormHelper は日時項目の入力を生成する際、内部的に複数の 項目名-接尾辞
を使います。もし項目名として `year`, `month`, `day`, `hour`,
`minute`, `meridian` を使っており、かる正確な入力値を得ることが
できない場合は、 `name` 属性をセットすることでデフォルトの振る舞いを
上書きすることができます:

``` php
echo $this->Form->input('Model.year', array(
    'type' => 'text',
    'name' => 'data[Model][year]'
));
```

### オプション

`FormHelper::input()` は非常に多数のオプションをサポートしています。
それ自身のオプション以外にも、 `input()` は生成された input のタイプや
HTML 属性などもオプションとして設定可能です。ここでは
`FormHelper::input()` に特化したオプションを記載しています。

- `$options['type']` タイプを指定することで、モデルが推測したものに
  優先して、input のタイプを強制指定できます。 [Automagic Form Elements](#automagic-form-elements)
  で見つかったフィールドタイプの他にも HTML5 でサポートされている
  'file', 'password' 等のタイプも生成可能です:

  ``` php
  echo $this->Form->input('field', array('type' => 'file'));
  echo $this->Form->input('email', array('type' => 'email'));
  ```

  出力はこうなります:

  ``` html
  <div class="input file">
      <label for="UserField">Field</label>
      <input type="file" name="data[User][field]" value="" id="UserField" />
  </div>
  <div class="input email">
      <label for="UserEmail">Email</label>
      <input type="email" name="data[User][email]" value="" id="UserEmail" />
  </div>
  ```

- `$options['div']` このオプションを使って、input を囲んでいる div の
  属性を指定できます。文字列を渡すと div のクラス名になります。
  配列を渡すと div の属性として扱われますが、この場合はキー／値の形式で
  指定します。なおこのキーを false と指定すると、div の出力を行わなく
  なります。

  クラス名の指定:

  ``` php
  echo $this->Form->input('User.name', array(
      'div' => 'class_name'
  ));
  ```

  出力結果:

  ``` html
  <div class="class_name">
      <label for="UserName">Name</label>
      <input name="data[User][name]" type="text" value="" id="UserName" />
  </div>
  ```

  複数の属性の指定:

  ``` php
  echo $this->Form->input('User.name', array(
      'div' => array(
          'id' => 'mainDiv',
          'title' => 'Div Title',
          'style' => 'display:block'
      )
  ));
  ```

  出力結果:

  ``` html
  <div class="input text" id="mainDiv" title="Div Title"
      style="display:block">
      <label for="UserName">Name</label>
      <input name="data[User][name]" type="text" value="" id="UserName" />
  </div>
  ```

  div の出力抑制:

  ``` php
  echo $this->Form->input('User.name', array('div' => false)); ?>
  ```

  出力結果:

  ``` html
  <label for="UserName">Name</label>
  <input name="data[User][name]" type="text" value="" id="UserName" />
  ```

- `$options['label']` input とともに指定されることの多い label のテキストを文字列で指定します:

  ``` php
  echo $this->Form->input('User.name', array(
      'label' => 'The User Alias'
  ));
  ```

  出力結果:

  ``` html
  <div class="input">
      <label for="UserName">The User Alias</label>
      <input name="data[User][name]" type="text" value="" id="UserName" />
  </div>
  ```

  このキーに false を指定すると、label タグが出力されなくなります:

  ``` php
  echo $this->Form->input('User.name', array('label' => false));
  ```

  出力結果:

  ``` html
  <div class="input">
      <input name="data[User][name]" type="text" value="" id="UserName" />
  </div>
  ```

  これを配列で指定することで、 `label` 要素に対する追加
  オプションを指定できます。この場合、label のテキストをカスタマイズ
  するには `text` キーを使います:

  ``` php
  echo $this->Form->input('User.name', array(
      'label' => array(
          'class' => 'thingy',
          'text' => 'The User Alias'
      )
  ));
  ```

  出力結果:

  ``` html
  <div class="input">
      <label for="UserName" class="thingy">The User Alias</label>
      <input name="data[User][name]" type="text" value="" id="UserName" />
  </div>
  ```

- `$options['error']` このキーを使うと、モデルが持つデフォルトの
  エラーメッセージを上書きしたり、また、たとえば i18n メッセージを
  セットしたりできます。これには多数のサブオプションがあり、これを
  使って外側の要素やそのクラス名をコントロールしたり、
  エラーメッセージの中の HTML をエスケープするかどうかなどを指定
  できます。

  エラーメッセージ出力やフィールドのクラス名を無効にするには
  error キーに false を設定します:

  ``` php
  $this->Form->input('Model.field', array('error' => false));
  ```

  エラーメッセージのみを無効にし、フィールドのクラス名は有効にするには
  errorMessage キーを false にします:

  ``` php
  $this->Form->input('Model.field', array('errorMessage' => false));
  ```

  外側の要素のタイプやそのクラスを変更するには以下の書式を
  使います:

  ``` php
  $this->Form->input('Model.field', array(
      'error' => array(
          'attributes' => array('wrap' => 'span', 'class' => 'bzzz')
      )
  ));
  ```

  エラーメッセージ出力において HTML が自動的にエスケープされるのを
  抑制するには、escape サブオプションを false にします:

  ``` php
  $this->Form->input('Model.field', array(
      'error' => array(
          'attributes' => array('escape' => false)
      )
  ));
  ```

  モデルのエラーメッセージを上書きするには、
  バリデーションの rule 名にマッチしたキーを持つ配列を使います:

  ``` php
  $this->Form->input('Model.field', array(
      'error' => array('tooShort' => __('This is not long enough'))
  ));
  ```

  これまで見てきたように、モデルの中にあるそれぞれのバリデーション
  ルールのためのエラーメッセージを設定できます。さらにフォームの
  中のメッセージに i18n を提供することも可能です。

  ::: info Added in version 2.3
  `errorMessage` オプションのサポートは 2.3 で追加されました。
  :::

- `$options['before']`, `$options['between']`, `$options['separator']`,
  `$options['after']`

  input() メソッドの出力の中に何らかのマークアップを差し込みたい場合、
  これらのキーを使います:

  ``` php
  echo $this->Form->input('field', array(
      'before' => '--before--',
      'after' => '--after--',
      'between' => '--between---'
  ));
  ```

  出力結果:

  ``` html
  <div class="input">
  --before--
  <label for="UserField">Field</label>
  --between---
  <input name="data[User][field]" type="text" value="" id="UserField" />
  --after--
  </div>
  ```

  radio input では、'separator' 属性を使ってそれぞれの input と
  label のペアを分けるためのマークアップを挿入できます:

  ``` php
  echo $this->Form->input('field', array(
      'before' => '--before--',
      'after' => '--after--',
      'between' => '--between---',
      'separator' => '--separator--',
      'options' => array('1', '2'),
      'type' => 'radio'
  ));
  ```

  出力結果:

  ``` html
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
  ```

  `date` および `datetime` 型の要素では、'separator'
  属性を使って select 要素の間の文字列を変更できます。
  デフォルトは '-' です。

- `$options['format']` FormHelper が生成する HTML の順序もまた制御可能
  です。'format' オプションは文字列の配列を取り、希望する要素の
  並び順を表すテンプレートを指定します。サポートされている配列キーは
  以下の通りです:
  `array('before', 'input', 'between', 'label', 'after','error')`

- `$options['inputDefaults']` 複数の input() コールで同じオプションを
  使いたい場合、 `inputDefaults` を使うことで繰り返し指定を避ける事が
  できます:

  ``` php
  echo $this->Form->create('User', array(
      'inputDefaults' => array(
          'label' => false,
          'div' => false
      )
  ));
  ```

  その時点より先で生成されるすべての input において、inputDefaults
  にあるオプション宣言が継承されます。input() コール時のオプション
  指定はデフォルトのオプションより優先されます:

  ``` php
  // div も label もなし
  echo $this->Form->input('password');

  // label 要素あり
  echo $this->Form->input('username', array('label' => 'Username'));
  ```

  ここより先のデフォルトを変更するには
  `FormHelper::inputDefaults()` が使えます。

- `$opsions['maxlength']` `input` フィールドの `maxlength` 属性に指定した値をセットするために
  使用します。このキーを省略して、 input タイプが `text`, `textarea`, `email`, `tel`, `url`,
  または `search` で、データベースのフィールドの定義が `decimal`, `time` または `datetime`
  以外の場合、フィールドの length オプションが使用されます。

### GET フォーム入力

`GET` フォーム入力を生成するために `FormHelper` を使用した時、
人が読みやすくするために入力名は、自動的に短くなります。例:

``` php
//  <input name="email" type="text" /> になります
echo $this->Form->input('User.email');

// <select name="Tags" multiple="multiple"> になります
echo $this->Form->input('Tags.Tags', array('multiple' => true));
```

もし、生成された name 属性を上書きしたい場合、 `name` オプションが使えます。 :

``` php
// より典型的な <input name="data[User][email]" type="text" /> になります
echo $this->Form->input('User.email', array('name' => 'data[User][email]'));
```

## 特殊なタイプの入力を生成する

一般的な `input()` メソッド以外にも、 `FormHelper` には様々に
異なったタイプの input を生成するための特別なメソッドがあります。
これらは input ウィジェットそのものを生成するのに使えますが、
さらに `~FormHelper::label()` や
`~FormHelper::error()` といった別のメソッドと組み合わせる
ことで、完全にカスタムメイドのフォームレイアウトを生成できます。

### 一般的なオプション

input 要素に関連するメソッドの多くは、一般的なオプションの
組合せをサポートしています。これらのオプションはすべて `input()`
でもサポートされています。繰り返しを減らすために、すべての input
メソッドで使える共通オプションを以下に示します:

- `$options['class']` input のクラス名を指定できます:

  ``` php
  echo $this->Form->input('title', array('class' => 'custom-class'));
  ```

- `$options['id']` input の DOM id の値を強制的に設定します。

- `$options['default']` input フィールドのデフォルト値をセットする
  のに使われます。この値は、フォームに渡されるデータにそのフィールド
  に関する値が含まれていない場合（かまたは、一切データが渡されない場合）
  に使われます。

  使用例:

  ``` php
  echo $this->Form->input('ingredient', array('default' => 'Sugar'));
  ```

  select フィールドを持つ例（"Medium" サイズがデフォルトで選択されます）:

  ``` php
  $sizes = array('s' => 'Small', 'm' => 'Medium', 'l' => 'Large');
  echo $this->Form->input(
      'size',
      array('options' => $sizes, 'default' => 'm')
  );
  ```

  > [!NOTE]
  > checkbox をチェックする目的では `default` は使えません。
  > その代わり、コントローラーで `$this->request->data` の中の
  > 値をセットするか、または input オプションの `checked` を true
  > にします。
  >
  > 日付と時刻フィールドのデフォルト値は 'selected' キーでセットできます。
  >
  > デフォルト値への代入の際 false を使うのは注意が必要です。
  > false 値は input フィールドのオプションを無効または除外するのに
  > 使われます。そのため `'default' => false` では何の値もセット
  > されません。この場合は `'default' => 0` としてください。

前述のオプションに加えて、任意の HTML 属性を混在させる
ことができます。特に規定のないオプション名は HTML 属性として
扱われ、生成された HTML の input 要素に反映されます。

### select, checkbox, radio に関するオプション

- `$options['selected']` は select 型の input （たとえば select,
  date, time, datetime）と組み合わせて使われます。その項目の値に
  'selected' をセットすると、その input が描画される際にデフォルトで
  その項目が選択されます:

  ``` php
  echo $this->Form->input('close_time', array(
      'type' => 'time',
      'selected' => '13:30:00'
  ));
  ```

  > [!NOTE]
  > date や datetime input の selected キーは UNIX のタイムスタンプ
  > で設定することもできます。

- `$options['empty']` true がセットされると、その input 項目を
  強制的に空にします。

  select リストに渡される際、これはドロップダウンの値として空値を
  持つ空のオプションを作ります。単にオプションを空白にする代わりに、
  何らかのテキストを表示しつつ空値を受け取りたい場合は empty に
  文字列を設定してください:

  ``` php
  echo $this->Form->input('field', array(
      'options' => array(1, 2, 3, 4, 5),
      'empty' => '(choose one)'
  ));
  ```

  出力結果:

  ``` html
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
  ```

  > [!NOTE]
  > パスワードフィールドのデフォルト値を空値にしたい場合は、
  > 'value' =\> '' の方を使ってください。

  date や datetime フィールドのために、 empty にキー・バリューペアの配列を指定できます。 :

  ``` php
  echo $this->Form->dateTime('Contact.date', 'DMY', '12',
      array(
          'empty' => array(
              'day' => 'DAY', 'month' => 'MONTH', 'year' => 'YEAR',
              'hour' => 'HOUR', 'minute' => 'MINUTE', 'meridian' => false
          )
      )
  );
  ```

  出力結果:

  ``` html
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
  ```

- `$options['hiddenField']` 一部の input タイプ（チェックボックス、ラジオボタン）では
  hidden フィールドが生成されるため、 \$this-\>request-\>data の中のキーは値を伴わない形式でも
  存在します:

  ``` html
  <input type="hidden" name="data[Post][Published]" id="PostPublished_"
      value="0" />
  <input type="checkbox" name="data[Post][Published]" value="1"
      id="PostPublished" />
  ```

  これは `$options['hiddenField'] = false` とすることで無効にできます:

  ``` php
  echo $this->Form->checkbox('published', array('hiddenField' => false));
  ```

  出力結果:

  ``` html
  <input type="checkbox" name="data[Post][Published]" value="1"
      id="PostPublished" />
  ```

  １つのフォームの中でそれぞれグルーピングされた複数の input ブロック
  を作りたい場合は、最初のものを除くすべての input でこのパラメータを
  使うべきです。ページ上の複数の場所に hidden input がある場合は
  最後のグループの input の値が保存されます。

  この例では Tertiary Colors だけが渡され、Primary Colors は上書きされます:

  ``` html
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
  ```

  ２つ目の input グループで `'hiddenField'` を無効にすることで、
  この挙動を防ぐことができます。

  hidden フィールドには 0 ではなく 'N' のように異なった値も
  設定できます:

  ``` php
  echo $this->Form->checkbox('published', array(
      'value' => 'Y',
      'hiddenField' => 'N',
  ));
  ```

### 日時関連オプション

- `$options['timeFormat']` 時刻関連の入力に関する select input の書式を
  指定します。有効な値は `12`, `24`, `null` です。

- `$options['dateFormat']` 日付関連の入力に関する select input の書式を
  指定します。有効な値は 'D', 'M', 'Y' の組み合わせまたは `null` です。
  入力は dateFormat オプションで定義した順序で格納されます。

- `$options['minYear'], $options['maxYear']` date/datetime と組み合わせて
  使います。年の select フィールドで表示される値の最小値および／または
  最大値を定義します。

- `$options['orderYear']` date/datetime と組み合わせて、年の値を表示する
  順序を定義します。有効な値は 'asc', 'desc' で、デフォルトは 'desc' です。

- `$options['interval']` このオプションでは分の select ボックスにおける
  分間隔の数値を指定します:

  ``` php
  echo $this->Form->input('Model.time', array(
      'type' => 'time',
      'interval' => 15
  ));
  ```

  この例では分の select で 15 分間隔で４つのオプションを生成します。

- `$options['round']` それぞれの命令で <span class="title-ref">up</span> または <span class="title-ref">down</span> を指定する
  ことで強制的な端数の切り上げ／切り下げを指示します。デフォルトは null
  で、これは <span class="title-ref">interval</span> にしたがって四捨五入します。

  ::: info Added in version 2.4
  :::

## フォーム要素固有のメソッド

これまでの例では、すべての要素が `User` モデルのフォームの配下で
作られていました。このため、生成された HTML のコードには User モデルを
参照する属性が含まれます。
例：name=data\[User\]\[username\], id=UserUsername

`method` FormHelper::**label**(string $fieldName, string $text, array $options)

`method` FormHelper::**text**(string $name, array $options)

`method` FormHelper::**password**(string $fieldName, array $options)

`method` FormHelper::**hidden**(string $fieldName, array $options)

`method` FormHelper::**textarea**(string $fieldName, array $options)

`method` FormHelper::**checkbox**(string $fieldName, array $options)

`method` FormHelper::**radio**(string $fieldName, array $options, array $attributes)

`method` FormHelper::**select**(string $fieldName, array $options, array $attributes)

`method` FormHelper::**file**(string $fieldName, array $options)

### アップロードの検証

モデルの中で定義できる、ファイルが正しくアップロードされたかどうかを
検証するためのバリデーションメソッドの例を以下に示します:

``` php
public function isUploadedFile($params) {
    $val = array_shift($params);
    if ((isset($val['error']) && $val['error'] == 0) ||
        (!empty( $val['tmp_name']) && $val['tmp_name'] != 'none')
    ) {
        return is_uploaded_file($val['tmp_name']);
    }
    return false;
}
```

file タイプの入力フィールドを生成:

``` php
echo $this->Form->create('User', array('type' => 'file'));
echo $this->Form->file('avatar');
```

出力結果:

``` html
<form enctype="multipart/form-data" method="post" action="/users/add">
<input name="data[User][avatar]" value="" id="UserAvatar" type="file">
```

> [!NOTE]
> `$this->Form->file()` を使う場合、 `$this->Form->create()`
> の中の type オプションを 'file' に設定することで、フォームの
> エンコーディングのタイプを設定できます。

## ボタンと submit 要素の生成

`method` FormHelper::**submit**(string $caption, array $options)

`method` FormHelper::**button**(string $title, array $options = array())

`method` FormHelper::**postButton**(string $title, mixed $url, array $options = array ())

`method` FormHelper::**postLink**(string $title, mixed $url = null, array $options = array ())

## 日付と時刻入力の生成

`method` FormHelper::**dateTime**($fieldName, $dateFormat = 'DMY', $timeFormat = '12', $attributes = array())

`method` FormHelper::**year**(string $fieldName, int $minYear, int $maxYear, array $attributes)

`method` FormHelper::**month**(string $fieldName, array $attributes)

`method` FormHelper::**day**(string $fieldName, array $attributes)

`method` FormHelper::**hour**(string $fieldName, boolean $format24Hours, array $attributes)

`method` FormHelper::**minute**(string $fieldName, array $attributes)

`method` FormHelper::**meridian**(string $fieldName, array $attributes)

## エラーの表示とチェック

`method` FormHelper::**error**(string $fieldName, mixed $text, array $options)

`method` FormHelper::**isFieldError**(string $fieldName)

`method` FormHelper::**tagIsInvalid**()

## 全項目に対するデフォルト値の設定

::: info Added in version 2.2
:::

`FormHelper::inputDefaults()` を使って `input()` に関する
デフォルトのオプションを宣言できるようになりました。デフォルトの
オプションを変更することで、オプション設定の繰り返しをひとつの
メソッドの呼び出しに統合できます:

``` php
$this->Form->inputDefaults(array(
        'label' => false,
        'div' => false,
        'class' => 'fancy'
    )
);
```

その時点以降に生成された input 項目はすべて inputDefaults で宣言された
オプションを継承します。input() の呼び出し時に option を指定することで、
デフォルトのオプションを上書きできます:

``` php
echo $this->Form->input('password'); // No div, no label with class 'fancy'
// has a label element same defaults
echo $this->Form->input(
    'username',
    array('label' => 'Username')
);
```

## セキュリティコンポーネントを使う

`SecurityComponent` は、あなたのフォームをより安全にするための
いくつかの機能を提供します。あなたのコントローラーに `SecurityComponent`
を含めるだけで、自動的に CSRF やフォームの不正改造を防いでくれます。

SecurityComponent を利用する際は、前述のようにフォームを閉じる際は
必ず `FormHelper::end()` を使う必要があります。これにより
特別な `_Token` input が生成されます。

`method` FormHelper::**unlockField**($name)

`method` FormHelper::**secure**(array $fields = array())

## 2.0 アップデート内容

**\$selected パラメータは削除されました**

FormHelper のいくつかのメソッドから `$selected` パラメータが
削除されました。現在はすべてのメソッドで `$attributes['value']`
キーがサポートされており、これを `$selected` の代わりに使うべきです。
この変更は FormHelper のメソッドをシンプルにし、引数の数を減らし、
`$selected` が生成する重複を減らします。影響を受けるメソッドは
以下の通りです:

- FormHelper::select()
- FormHelper::dateTime()
- FormHelper::year()
- FormHelper::month()
- FormHelper::day()
- FormHelper::hour()
- FormHelper::minute()
- FormHelper::meridian()

**フォーム上のデフォルトの URL は、現在のアクションです**

すべてのフォームに関するデフォルトの URL は、現在の pass パラメータ、named パラメータ、
クエリー文字列を含みます。 `$this->Form->create()` の第二パラメータである
`$options['url']` を指定することで、このデフォルト動作を変更できます。

**FormHelper::hidden()**

hidden フィールドは、class 属性を削除しなくなりました。
つまり、hidden フィールドにバリデーションエラーがあった場合、
クラス名として error-field が適用されます。
