クッキー(Cookie)
################

CookieComponent は PHP ネイティブ関数の setcookie
のラッパーです。ただラップするだけでなく、上質な砂糖でおいしく包み込んだクッキー…というのは冗談で、コントローラの中でクッキー(\ *Cookie*)をとても便利に使えるようにしたコンポーネントです。
CookieComponent を使うには、まずその前にコントローラ変数の $components
配列の中で 'Cookie' を指定してください。

コントローラのセットアップ
==========================

クッキーを生成し管理するには、いくつかのコントローラ変数を設定します。コントローラの
beforeFilter() メソッドで、次に挙げる特別な変数を定義し、
CookieComponent の動作を設定できます。

クッキー変数

デフォルト

説明

文字列 $name

'CakeCookie'

クッキーの名前。

文字列 $key

null

この文字列はクッキーに変数を書き込むときに、それを暗号化するために使います。ランダムで推測しにくい文字列を使用してください。

文字列 $domain

''

クッキーにアクセスすることを許可するドメイン名を指定します。例えば、すべてのサブドメインから許可する場合は「.yourdomain.com」としてください。

整数または文字列 $time

'5 Days'

クッキーが有効期限切れになる時間を指定します。
整数を指定した場合は秒数として取り扱われ、 0
は「セッションクッキー(\ *session
cookie*)」に相当するものであり、ブラウザが閉じられたときに期限切れになります。文字列がセットされた場合は、
PHP の strtotime() によって解釈されます。この変数は、 write()
で直接セットすることができます。

文字列 $path

'/'

クッキーが適用されるサーバ上のパスを指定します。もし $cookiePath
が「/foo/」に設定されていた場合、クッキーはドメイン中の「/foo/」ディレクトリと、そこに含まれる「/foo/bar/」といった全てのサブディレクトリで有効になります。デフォルト値はドメイン全体です。この変数は、
write() で直接セットすることができます。

ブール値 $secure

false

クッキーがセキュアな HTTPS 接続のみで送られるかどうかを示します。 true
にセットすると、クッキーはセキュアなコネクションのみで使われます。この変数は、
write() で直接セットすることができます。

次の例は、クッキー名を「baker\_id」、ドメイン名を「example.com」、セキュアな接続のみで有効、「/bakers/preferences/」というパスで有効、有効期限を1時間と設定して
CookieComponent を読み込んだコントローラを抜粋したものです。

::

    var $components    = array('Cookie');
    function beforeFilter() {
      $this->Cookie->name = 'baker_id';
      $this->Cookie->time =  3600;  // あるいは '1 hour'
      $this->Cookie->path = '/bakers/preferences/'; 
      $this->Cookie->domain = 'example.com';   
      $this->Cookie->secure = true;  // セキュアな HTTPS を使用していた場合にのみクッキーが送信されます
      $this->Cookie->key = 'qSI232qs*&sXOw!';
    }

次に、 CookieComponent の特別なメソッドを使用法を見ていきましょう。

コンポーネントを使う
====================

このセクションでは CookieComponent のメソッドの概要を説明します。

**write(mixed $key, mixed $value, boolean $encrypt, mixed $expires)**

write() メソッドは、クッキーコンポーネントの中核部分です。 $key
はクッキー変数の名前、 $value はそれに保存する値です。

::

    $this->Cookie->write('name','Larry');

$key 変数にドットを用いた記法を使うことで変数をグループ化できます。

::

    $this->Cookie->write('User.name', 'Larry');
      $this->Cookie->write('User.role','Lead');  

クッキーに、一回の操作で複数の値を設定したい場合、配列で渡します。

::

    $this->Cookie->write(
      array('name'=>'Larry','role'=>'Lead')
      );  

クッキーに保存する全ての値は、デフォルトでは暗号化されます。平文で保存したい場合は、
write() メソッドの第三パラメータを false に設定してください。

::

    $this->Cookie->write('name','Larry',false);

write() メソッドの最後のパラメータは、 $expires
です。これはクッキーの有効期限を秒数で表すものです。便利なことに、このパラメータは
PHP の strtotime()
関数が理解できるフォーマットの文字列でも渡すことが可能です。

::

    // この記述はクッキーの有効期限を1時間と定義したものです。
    // 次の表記と同等です。 $this->Cookie->write('first_name','Larry',false, 3600);
      $this->Cookie->write('last_name','Masters',false, '1 hour');

**read(mixed $key)**

このメソッドは $key で定義された名前のクッキー変数を読み込みます。

::

    // “Larry” と出力される。
      echo $this->Cookie->read('name');
      
      // 読み込みにはドットを用いた記法も使えます。
      echo $this->Cookie->read('User.name');
      
      // グループ化した変数を取得するには、
      // ドットを用いた記法を配列のように使ってください。
      $this->Cookie->read('User');
      
      // 出力は array('name' => 'Larry', 'role'=>'Lead') というようになります。

**del(mixed $key)**

$key
で指定された名前のクッキー変数を削除します。ドットを用いた記法を使えます。

::

      // 変数を削除する
      $this->Cookie->del('bar')
      
      // bar 変数を削除するが、 foo.bar の他の foo 変数は削除しない。
      $this->Cookie->del('foo.bar')
     

**destroy()**

現在のクッキーを壊します。
