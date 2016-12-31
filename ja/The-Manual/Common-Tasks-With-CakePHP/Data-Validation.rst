データのバリデーション(Data Validation)
#######################################

あらゆるアプリケーションにおいて、データのバリデーションは重要です。これは、モデルのデータがアプリケーションのビジネスルールに必ず従うようにすることに役立ちます。例えば、パスワードは8文字以上であるとか、ユーザ名は必ずユニークにするといったことが挙げられます。バリデーションを定義することは、フォームの取り扱いをとても簡単にします。

バリデーションの仕組みは多くの異なる場面で使います。
この章ではモデルでの利用、基本的には save()
メソッドを呼び出した時の振る舞いについてを説明します。バリデーションエラーをどのように取り扱うかについての詳細な情報は、FormHelperについての項目を参照してください。

データのバリデーションを行うには、まずモデルにバリデーションのルールを作成します。これは、モデルの定義の中の
Model::validate 配列で行います。次の例を見てください。

::

    <?php
    class User extends AppModel {  
        var $name = 'User';
        var $validate = array();
    }
    ?>

この例では、User モデルに $validate 配列
を追加していますが、バリデーションのルールは何も存在しません。users
テーブルに login、password、email、born
というフィールドがあるとして、次の例では簡単なバリデーションのルールをこれらのフィールドに加えます。

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $validate = array(
            'login' => 'alphaNumeric',
            'email' => 'email',
            'born' => 'date'
        );
    }
    ?>

この例は、モデルのフィールドに対してどのようにバリデーションのルールを追加できるかを表しています。「login」フィールドがアルファベットか数字のみ、「email」は電子メールアドレスとして有効な文字列、「born」は日付として有効な文字列が許可されます。バリデーションルールを定義すると、もしそのルールに従わないデータが送信された時に
CakePHP
のオートマジック(automagic)はフォームにエラーメッセージを表示します。

CakePHPはバリデーションのルールを多く持ち、それらを使うことは大変簡単です。あらかじめ組み込まれたルールには、電子メールのアドレス、URL、クレジットカードの番号を表すものもありますが、これらは後で説明します。

次の例は、組み込みのバリデーションルールを便利に使うための、より複雑な例です。

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $validate = array(
            'login' => array(
                'alphanumeric' => array(
                    'rule' => 'alphaNumeric',
                    'required' => true,
                    'message' => 'Alphabets and numbers only'
                    ),
                'between' => array(
                    'rule' => array('between', 5, 15),
                'message' => 'Between 5 to 15 characters'
                )
            ),
            'password' => array(
                'rule' => array('minLength', '8'),
                'message' => 'Mimimum 8 characters long'
            ),
            'email' => 'email',
            'born' => array(
                'rule' => 'date',
                'message' => 'Enter a valid date',
                'allowEmpty' => true
            )
        );
    }
    ?>

フィールド「login」に対して、「文字の種類がアルファベットまたは数字」かつ「長さが5文字以上で15文字以下」という2つのバリデーションルールが定義されています。同様に、フィールド「password」は長さが8文字以上であり、「email」は電子メールアドレスとして有効な文字列、「born」は日付として有効な文字列であると定義されています。
また、データがバリデーションのルールに従わない時に、CakePHPは任意のメッセージ表示します。それををどのように追加するかに注目してください。

これまでの例の通り、1個のフィールドは複数のバリデーションのルールを持つことが出来ます。そして、もし使いたいルールが組み込まれていなければ、必要に応じて独自のバリデーションのルールを追加することができます。

さて、ここまででバリデーションがどのように動くかについての概要を説明しました。
次に、これらのルールをモデル中でどのように定義するのかを見ていきましょう。これには、「単純な配列で定義する」、「1個のフィールドに1個のルールを定義する」、「1個のフィールドに複数のルールを定義する」という3つの異なった方法があります。

単純ルール
==========

読んで字のごとく、これがバリデーションのルールを定義する最も単純な方法です。単純ルールの書き方は次の通りです。

::

    var $validate = array('fieldName' => 'ruleName');

ここで、「fieldName」にはルールの対象となるフィールドの名前を、「ruleName」には
'alphaNumeric'、'email'、'isUnique'
などの定義済みのルールの名前を書きます。

たとえば、ユーザーがちゃんとした形式のメールアドレスを入力したことを確認するためには、次のようなルールを使えばいいでしょう。

::

    var $validate = array('user_email' => 'email');

1個のフィールドに1個のルールを定義する
======================================

この定義の方法は、バリデーションのルールの働きをうまく制御できるよう考慮したものです。しかしそれを論じる前に、1個のフィールドに1個のルールを定義する一般的な利用パターンをまず見てみましょう。

::

    var $validate = array(
        'fieldName1' => array(
            'rule' => 'ruleName', // または: array('ruleName', 'param1', 'param2' ...)
            'required' => true,
            'allowEmpty' => false,
            'on' => 'create', // または: 'update'
            'message' => 'バリデーションエラーの時に表示するメッセージ'
        )
    );

'rule' キーは必須です。'required' => true
をセットしただけでは、フォームバリデーションは正しく動作しません。なぜなら、
'required' は正確にはルールではないからです。

各フィールドには「rule」「required」「allowEmpty」「on」「message」という5個のキーからなる配列を結び付けます(この例ではフィールドが1個しかありませんが)。「rule」は必須であり、他はオプションです。これらのキーについて詳しく見てみましょう。

rule
----

「rule」キーはバリデーションメソッドを定義します。単一の値と配列、いずれも使用できます。「rule」の指定は、モデル中に作成したメソッド名か、コアのバリデーションクラスのメソッド名、もしくは正規表現である必要があります。全ての組み込みルールの一覧は、「組み込みのバリデーションルール」の節を参照してください。

もしパラメータを必要としないルールなら、「rule」キーには単一の値を持たせることができます。

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric'
        )
    );

もしパラメータを必要とするルールなら(たとえば「max」「min」「range」)、「rule」キーの値は配列にします。

::

    var $validate = array(
        'password' => array(
            'rule' => array('minLength', 8)
        )
    );

「rule」キーが配列をベースにした定義を必要とすることを忘れないでください。

required
--------

このキーにはブール値(boolean)を割り当てます。もし「required」がtrueであれば、このフィールドはデータの配列中に存在しなければなりません。例えば、このバリデーションルールの定義は次のように行います。

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'required' => true
        )
    );

モデルの save()
メソッドへ送られたデータには、かならずloginフィールドが存在しなければなりません。もし無ければ、バリデーションは失敗します。このキーのデフォルトはfalseです。

送られたデータに「login」というキーは存在し、値が空の場合、バリデーションは成功します。「required」を
true にすると、キーの存在だけを検証します。

allowEmpty
----------

``allowEmpty`` キーにはブール値(boolean)を割り当てます。もし
``allowEmpty`` に false を割り当てたら、データがモデルの ``save()``
メソッドを通過するには、フィールドが存在しその値が空で無いことが必要です。
true
にセットした場合、空のフィールドは他に設定された全てのバリデーションを無視します。

``allowEmpty`` のデフォルトは null です。
この設定は、そのフィールドに常にバリデーションルールが適用されることを意味します。このルールには、独自のバリデーション関数を実行することも含みます。

on
--

「on」キーには「update」「create」のいずれかの値をセットできます。これは、レコードを更新する時だけ、あるいは追加する時だけバリデーションのルールを適用する機能を提供します。

もし「on」の値が「create」に設定していた場合、バリデーションのルールは新規レコード追加の時だけ適用されます。「update」の場合は、既存レコードの更新の時だけ適用されます。

「on」キーのデフォルトの値は null です。null
のとき、バリデーションルールはレコードの追加および更新の両方で適用されます。

message
-------

「message」キーではルールに対するエラーメッセージを定義します。

::

    var $validate = array(
        'password' => array(
            'rule' => array('minLength', 8),
            'message' => 'パスワードは8文字以上の長さにしてください。'
        )
    );

1個のフィールドに複数のルールを定義する
=======================================

先に概要を説明したテクニックは、単純な定義よりずいぶん柔軟です。しかし、さらにきめ細かくバリデーションルールを制御するための付加的な方法があります。次に概説するテクニックでは、フィールドに複数のバリデーションルールを割り当てることが出来ます。

1個のフィールドに複数のバリデーションを割り当てる基本的な方法は、次のようになります。

::

     
    var $validate = array(
        'fieldName' => array(
            'ruleName' => array(
                'rule' => 'ruleName',
                // like on, required, 等、他のキーをここに書く...
            ),
            'ruleName2' => array(
                'rule' => 'ruleName2',
                // like on, required, 等、他のキーをここに書く...
            )
        )
    );

前の章で説明した方法にとても似ていますね。さて、各フィールドにバリデーションパラメータの配列を1つ定義しました。このケースにおいて、それぞれの「fieldName」はルールのインデックスを配列として保持しています。それぞれの「ruleName」はバリデーションパラメータの配列を別々に持っています。

わかりやすく説明するために、実用的な例を見てみましょう。

::

    var $validate = array(
        'login' => array(
            'alphanumeric' => array(
                'rule' => 'alphaNumeric',  
                'message' => 'Only alphabets and numbers allowed',
                'last' => true
             ),
            'minlength' => array(
                'rule' => array('minLength', '8'),  
                'message' => 'Minimum length of 8 characters'
            ),  
        )
    );

上記の例では、「login」フィールドに「使用できる文字の種類」と「長さの最小値」という2つのルールを定義しています。ご覧の通り、それぞれのルールをインデックスの名前で区別しています。インデックスの名前は、何でも好きなものを使えます。この例では利用するルールに近いものを採用しています。

デフォルトでは、CakePHP
は宣言された全てのバリデーションルールを使用して、フィールドをバリデートしようとし、最後に失敗したルールのエラーメッセージを返します。しかし、キー「\ ``last``\ 」の値が「\ ``true``\ 」といるものが失敗した場合、このルールのエラーメッセージが返され、後ろのルールはバリデートされません。ですので、最初に失敗したルールのエラーメッセージを表示したい場合は、それぞれのルールに
``'last' => true`` をセットしてください。

もし国際化したエラーメッセージを使うことを考えているなら、モデル(model)に定義する代わりにビュー(view)へエラーメッセージを指定した方が良いでしょう。

::

    echo $form->input('login', array(
        'label' => __('Login', true), 
        'error' => array(
                'alphanumeric' => __('Only alphabets and numbers allowed', true),
                'minlength' => __('Minimum length of 8 characters', true)
            )
        )
    );

これでフィールドは完全に国際化され、モデルからエラーメッセージの指定を外すことができます。「\_\_()」関数について詳しい情報は、「地域化と国際化」の章を参照してください。

組み込みのバリデーションルール(Validation Rules)
================================================

CakePHP
のバリデーション(Validation)クラスには、あらかじめ組み込まれたルールがたくさんあり、これらを用いるとバリデーションがとても簡単になります。このクラスには、あらたに定義を書き起こさなくていいように、よく使われるバリデーションのテクニックがふんだんに盛り込まれています。全てのルールの説明と使用例の一覧は、下記を参照してください。

alphaNumeric
------------

半角のアルファベットか数字のみ許可されます。

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'message' => 'ユーザ名は半角英数字のみ使用できます。'
        )
    );

between
-------

データの長さが整数で指定された範囲におさまっていることを確認します。最小値と最大値は必須です。「<」ではなく「<=」が使用されます。

::

    var $validate = array(
        'password' => array(
            'rule' => array('between', 5, 15),
            'message' => 'Passwords must be between 5 and 15 characters long.'
        )
    );

blank
-----

このルールは、データが空かホワイトスペースのみで構成されているかどうかを確認するために使われます。ホワイトスペースは、半角スペースとタブ、復帰文字(carriage
return)および改行文字(newline)を含みます。

::

    var $validate = array(
        'id' => array(
            'rule' => 'blank',
            'on' => 'create'
        )
    );

boolean
-------

The data for the field must be a boolean value. Valid values are true or
false, integers 0 or 1 or strings '0' or '1'.

::

    var $validate = array(
        'myCheckbox' => array(
            'rule' => array('boolean'),
            'message' => 'Incorrect value for myCheckbox'
        )
    );

cc
--

このルールはデータがクレジットカードの番号として適切かどうかをチェックする時に使います。パラメータは「type」「deep」「regex」の3つです。

「type」キーには「fast」「all」あるいは次のいずれかを値として割り当てることができます。

-  bankcard
-  diners
-  disc
-  electron
-  enroute
-  jcb
-  maestro
-  mc
-  solo
-  switch
-  visa
-  voyager

「type」を「fast」にセットすると、主要なクレジットカード番号の型でチェックします。「all」にセットすると、全てのクレジットカード番号のタイプでチェックします。マッチさせたいクレジットカードのタイプを配列にして、それを「type」にセットすることもできます。

「deep」キーにはブール値(boolean)をセットします。 true
にセットした場合、バリデーションはクレジットカードのルーン・アルゴリズム(Luhn
algorithm,
`https://en.wikipedia.org/wiki/Luhn\_algorithm <https://en.wikipedia.org/wiki/Luhn_algorithm>`_)を用いてチェックします。この項目のデフォルトは
false です。

「regex」キーにはクレジットカード番号であるかを検証するための、独自の正規表現を設定します。

::

    var $validate = array(
        'ccnumber' => array(
            'rule' => array('cc', array('visa', 'maestro'), false, null),
            'message' => 'あなたが入力したデータは、クレジットカードの番号ではありません。'
        )
    );

comparison
----------

「comparison」は数字を比較する時に使います。「is greater
(～より大きい)」「is less (～より小さい)」「greater or equal
(～以上)」「less or equal (～以下)」「equal to (～と等しい)」「not equal
(～と等しくない)」というものをサポートしています。
いくつか例を次に示します。

::

    var $validate = array(
        'age' => array(
            'rule' => array('comparison', '>=', 18),
            'message' => '18歳以上の方のみ対象です。'
        )
    );

    var $validate = array(
        'age' => array(
            'rule' => array('comparison', 'greater or equal', 18),
            'message' => '18歳以上の方のみ対象です。'
        )
    );

date
----

このルールは、送信されたデータが日付として有効なフォーマットであるかどうかを確認します。フォーマットの確認に使うためのパラメータを一つ持たせることができます。(パラメタは配列にすることもできます。)
パラメータの値として、次のものが指定できます。

-  ‘dmy’
   例:「27-12-2006」または「27-12-06」(セパレータには、スペース、ピリオド、ダッシュ、スラッシュを使用できます)
-  ‘mdy’
   例:「12-27-2006」または「12-27-06」(セパレータには、スペース、ピリオド、ダッシュ、スラッシュを使用できます)
-  ‘ymd’
   例:「2006-12-27」または「06-12-27」(セパレータには、スペース、ピリオド、ダッシュ、スラッシュを使用できます)
-  ‘dMy’ 例:「27 December 2006」または「27 Dec 2006」
-  ‘Mdy’ 例:「December 27, 2006」または「Dec 27,
   2006」(カンマはオプションです)
-  ‘My’ 例:「December 2006」または「Dec 2006」
-  ‘my’
   例:「12/2006」または「12/06」(セパレータには、スペース、ピリオド、ダッシュ、スラッシュを使用できます)

デフォルトのパラメータは「ymd」です。

::

    var $validate = array(
        'born' => array(
            'rule' => 'date',
            'message' => '正しいデータを「YY-MM-DD」のフォーマットで入力してください。',
            'allowEmpty' => true
        )
    );

大抵のデータ・ストアは、特定の日付の書式を必要とします。しかし、指定の書式に従った入力をユーザに強要するのではなく、労を惜しまずにさまざまな形式のデータを受け付けて変換するというやりかたを考えるかもしれません。ユーザのためにできることは、やったほうが好ましいでしょう。

decimal
-------

このルールは、データが小数かどうかを確認します。パラメータは、小数点以下の桁数(位)のみ与えられます。もしパラメータを何も与えなかったら、データが浮動小数点であってもバリデーションは成功します。ただしこの時、小数点以下に数字が無いとバリデーションは失敗します。

::

    var $validate = array(
        'price' => array(
            'rule' => array('decimal', 2)
        )
    );

email
-----

このルールは、データが電子メールのアドレスとして適切な文字列かどうかを判定します。第一引数にブール値で
true
を設定すると、このルールはメールサーバーのホストが存在するかどうかを確認しようとします。

::

    var $validate = array('email' => array('rule' => 'email'));
     
    var $validate = array(
        'email' => array(
            'rule' => array('email', true),
            'message' => 'メールアドレスを正しく入力してください。'
        )
    );

equalTo
-------

このルールは、データと第一引数が、値と型の両方で同じかどうかを確認します。

::

    var $validate = array(
        'food' => array(
            'rule' => array('equalTo', 'cake'),  
            'message' => 'この項目は文字列で「cake」としなければなりません。'
        )
    );

extension
---------

このルールはデータとして与えられたファイル名の拡張子(「.jpg」や「.png」など)が、指定したものにマッチするか確認します。複数の拡張子をマッチさせる場合は、配列で指定します。

::

    var $validate = array(
        'image' => array(
            'rule' => array('extension', array('gif', 'jpeg', 'png', 'jpg'),
            'message' => '適切な画像ファイル名を入力してください。'
        )
    );

file
----

This rule ensures that the value is a valid file name. This validation
rule is currently non-functional.

ip
--

このルールはデータがIPv4の形式であるかどうかを確認します。

::

    var $validate = array(
        'clientip' => array(
            'rule' => 'ip',
            'message' => 'IPアドレスを正しく入力してください。'
        )
    );

isUnique
--------

与えられた値が他の行で出現せず、ユニークであるかどうかを確認します。

::

    var $validate = array(
        'login' => array(
            'rule' => 'isUnique',
            'message' => 'このユーザ名はすでに使用されています。'
        )
    );

minLength
---------

このルールはデータの長さが指定したものより小さくならないようにします。

::

    var $validate = array(
        'login' => array(
            'rule' => array('minLength', '8'),  
            'message' => 'ユーザ名は8文字以上にしてください。'
        )
    );

maxLength
---------

このルールはデータの長さが指定したものより大きくならないようにします。

::

    var $validate = array(
        'login' => array(
            'rule' => array('maxLength', '15'),  
            'message' => 'ユーザ名は15文字以下にしてください。'
        )
    );

money
-----

このルールは、値が金額として有効なものであるかを確認します。

二番目のパラメータは通貨記号の位置(右か左)を定義します。

::

    var $validate = array(
        'salary' => array(
            'rule' => array('money', 'left'),
            'message' => '金額として有効なものを入力してください。'
        )
    );

Multiple
--------

これは、複数選択する入力のバリデーションに使用します。パラメータとして「in」「max」そして「min」をサポートします。

::

    var $validate = array(
        'multiple' => array(
            'rule' => array('multiple', array('in' => array('foo', 'bar'), 'min' => 1, 'max' => 3)),
            'message' => '1～3個の項目を選択してください'
        )
    );

inList
------

このルールは、送信されたデータが、あらかじめ指定したリストの中に含まれているかを確認します。リストは必ず配列で指定してください。その配列の値のどれかが一致した場合、バリデーションは成功します。

例:

::

        var $validate = array(
          'function' => array(
            'allowedChoice' => array(
                'rule' => array('inList', array('Foo', 'Bar')),
                'message' => '「Foo」か「Bar」を入力してください。'
            )
          )
        );

numeric
-------

データが数字もしくは数値形式であるかどうかをチェックします。

::

    var $validate = array(
        'cars' => array(
            'rule' => 'numeric',  
            'message' => '車の番号を入力してください。'
        )
    );

notEmpty
--------

フィールドが空で無いかどうかを確認する基本的なルールです。

::

    var $validate = array(
        'title' => array( 
            'rule' => 'notEmpty',
            'message' => 'このフィールドは必ず入力してください。'
        )
    );

このルールを複数選択のinputで使うとエラーになります。代わりに、「multiple」ルールを使ってください。

phone
-----

アメリカの電話番号の形式であるかを確認します。もしアメリカ以外の電話番号形式を検証したいのなら、それに適する正規表現を第二パラメータに指定してください。

::

    var $validate = array(
        'phone' => array(
            'rule' => array('phone', null, 'us')
        )
    );

postal
------

郵便番号かどうかを確認します。対応している国は、アメリカ(us)、カナダ(ca)、イギリス(uk)、イタリア(it)、ドイツ(de)、ベルギー(be)です。その他の国の郵便番号を確認したい場合、それに適する正規表現を第二引数で定義してください。

::

    var $validate = array(
        'zipcode' => array(
            'rule' => array('postal', null, 'us')
        )
    );

range
-----

このルールは、指定した範囲にデータがおさまるかどうかを確認します。もし範囲を指定しなかった場合は、プログラムが実行されているプラットフォーム上で有限な数値かどうかを判定します。

::

    var $validate = array(
        'number' => array(
            'rule' => array('range', 0, 10),
            'message' => '0より大きく10より小さい数を入力してください。'
        )
    );

この例では、0より大きく (たとえば 0.01) 10より小さい (たとえば9.99)
値が許されます。

ssn
---

データが社会保障番号であるかを確認します。対応している国は、アメリカ(us)、デンマーク(dk)、オランダ(dk)です。その他の国の社会保障番号を確認したい場合、それに適する正規表現を第二引数で定義してください。

::

    var $validate = array(
        'ssn' => array(
            'rule' => array('ssn', null, 'us')
        )
    );

url
---

正しいURLの形式であるかどうかを確認します。http(s)、ftp(s)、file、news、gopher
のプロトコルに対応しています。

::

    var $validate = array(
        'website' => array(
            'rule' => 'url'
        )
    );

URLがプロトコル名から始まっていることを確認するためには、次のように厳密モードを有効にしてください。

::

    var $validate = array(
        'website' => array(
            'rule' => array('url',　true)
        )
    );

独自のバリデーションルール
==========================

もし必要とするものが見つからないなら、バリデーションルールを新たに作成してください。これには正規表現による定義と、独自のバリデーションメソッドの作成という2つの方法があります

独自の正規表現による定義
------------------------

もし必要とするバリデーションのテクニックが正規表現で完全に表せるなら、その正規表現をバリデーションルールのフィールドに定義してください。

::

    var $validate = array(
        'login' => array(
            'rule' => array('custom', '/[a-z0-9]{3,}$/i'),  
            'message' => '半角英数字が3文字以上必要です。'
        )
    );

この例では、「login」が半角アルファベットか数字で、長さは3文字以上であることを確認します。

独自のバリデーションメソッド
----------------------------

正規表現だけではデータのチェックが十分に行えない時があります。たとえば、販促コードは25回までしか使えないといった場合です。こうした時には独自のバリデーション関数を追加する必要があります。次に例を示します:

::

    <?php
    class User extends AppModel {
        var $name = 'User';
      
        var $validate = array(
            'promotion_code' => array(
                'rule' => array('limitDuplicates', 25),
                'message' => 'この販促コードは使い切りました。'
            )
        );
     
        function limitDuplicates($data, $limit){
            $existing_promo_count = $this->find( 'count', array('conditions' => $data, 'recursive' => -1) );
            return $existing_promo_count < $limit;
        }
    }
    ?>

独自に定義するバリデーション関数へパラメータを渡すには、まず「rule」キーに2つ以上の要素を持つ配列を割り当てます。そしてその2番目以降の要素を、バリデーション関数で必要な
``$data`` パラメータの後に続けて渡すようにしてください。

独自のバリデーション関数は、この例のように、モデルの中や、このモデルが実行するビヘイビアの中で定義できます。これにはマップされたメソッドも含みます。

モデルとビヘイビアのメソッドはバリデーションクラスのメソッドよりも前に実行されることに注意してください。これは、組み込みのバリデーションメソッド(たとえば
``alphaNumeric()``) を、\ ``AppModel``
クラスやモデルなどのアプリケーションレベルで上書きできることを意味します。

コントローラ(Controller)からデータのバリデーションを実行する
============================================================

データを保存する前に、データのバリデーションを実行したい時があるでしょう。例えば、データをデータベースへ保存してしまう前に、ユーザに対して追加の情報を表示したい時です。こういった場合のバリデーションは、データをただ保存する時とは少し異なる方法で行います。

まずは、モデルにデータをセットします。

::

    $this->ModelName->set( $this->data );

次に、データがバリデーションのルールに適しているかを確認するために、モデルの
validates
メソッドを実行します。このメソッドは、バリデーションが成功すれば true
を、失敗したら false を返します。

::

    if ($this->ModelName->validates()) {
        // バリデーションが成功した場合のロジックをここに書く
    } else {
        // バリデーションが失敗した場合のロジックをここに書く
    }

validates メソッドは、invalidFields メソッドを内部で実行し、それにより
validationErrors
プロパティがセットされます。結果のデータは、invalidFields
メソッドで取得します。

::

    $errors = $this->ModelName->invalidFields(); // validationErrors 配列を含むデータを取得する

save メソッドではデータをパラメータとして渡せます。validates
メソッドでは、実行前に必ず、モデルへデータをセットしなければなりません。この点に注意してください。
