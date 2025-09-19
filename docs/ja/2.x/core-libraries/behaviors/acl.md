# ACL

`class` **AclBehavior**

Acl ビヘイビアは、ACL システムとモデルをシームレスに統合する方法を提供します。
それは、透過的に ARO や ACO ともに作成できます。

新しいビヘイビアを使うために、モデルの \$actsAs プロパティにそれを追加できます。
actsAs 配列にそれを追加した時、関連した Acl 入力を ARO または ACO にすることを
選びます。 デフォルトでは、ACO を作成します。 :

``` php
class User extends AppModel {
    public $actsAs = array('Acl' => array('type' => 'requester'));
}
```

これは、ARO モードで Aclビヘイビアをアタッチします。ACO モードで ACL
ビヘイビアを追加するには:

``` php
class Post extends AppModel {
    public $actsAs = array('Acl' => array('type' => 'controlled'));
}
```

以下のようにすると User モデルは、ACO と ARO ノードの両方を持つことができます:

``` php
class User extends AppModel {
    public $actsAs = array('Acl' => array('type' => 'both'));
}
```

以下のようにビヘイビアを動的にアタッチできます。 :

``` php
$this->Post->Behaviors->load('Acl', array('type' => 'controlled'));
```

::: info Changed in version 2.1
AppModel に AclBehavior を安全にアタッチできるようになりました。Aco, Aro や AclNode は、無限ループが発生するため AppModel の代わりに Model を継承します。もし、あなたのアプリケーションが、何らかの理由で AppModel を継承したモデルに依存している場合、AclNode をコピーし、AppModel を再び継承してください。
:::

## AclBehavior の使用

ほとんどの AclBehavior は、モデルの afterSave() 中で透過的に動作します。
しかしながら、それを使うためには、モデルで parentNode() メソッドの定義が必要です。
これは、 parent-\>child 関係を決めるために AclBehavior によって使用されます。
モデルの parentNode() メソッドは、戻り値に null または、親モデルの参照を
返さなければなりません。 :

``` php
public function parentNode() {
    return null;
}
```

もし、モデルの親として ACO や ARO ノードを設定したい場合、parentNode() は、
ACO や ARO ノードのエイリアスを返さなければなりません。 :

``` php
public function parentNode() {
    return 'root_node';
}
```

より詳しい例。 「User belongsTo Group」の User モデルの例です。 :

``` php
public function parentNode() {
    if (!$this->id && empty($this->data)) {
        return null;
    }
    $data = $this->data;
    if (empty($this->data)) {
        $data = $this->read();
    }
    if (!$data['User']['group_id']) {
        return null;
    }
    return array('Group' => array('id' => $data['User']['group_id']));
}
```

上記の例では、戻り値は、モデルの find の結果と同じ形式の配列です。id と値が
設定されていることが重要で、そうでなければ parentNode のリレーションは失敗します。
AclBehavior はツリー構造を構築するために、このデータを使用します。

## node()

AclBehavior は、モデルレコードと関連した Acl ノードを検索できます。
\$model-\>id を設定した後。 関連する Acl ノードを検索するために
\$model-\>node() が使用できます。

データ配列を設定することによって、どのような列の Acl ノードでも取得できます。 :

``` php
$this->User->id = 1;
$node = $this->User->node();

$user = array('User' => array(
    'id' => 1
));
$node = $this->User->node($user);
```

両方とも、同じ Acl ノードの情報を返します。

もし、ACO と ARO ノードの両方を作成するために AclBehavior を設定していた場合、
どのノードタイプを取得したいのかを指定する必要があります。 :

``` php
$this->User->id = 1;
$node = $this->User->node(null, 'Aro');

$user = array('User' => array(
    'id' => 1
));
$node = $this->User->node($user, 'Aro');
```
