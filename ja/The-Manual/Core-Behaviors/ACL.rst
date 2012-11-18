ACL
###

ACL
ビヘイビアはモデルとアクセス制御システムを速やかに統合する方法を提供します。
これを使うことで、 ARO と ACO の両方を透過的に作成することができます。

新しいビヘイビアを使おうとする場合には、まずモデルの $actsAs
プロパティにそのビヘイビアを追加します。 $actsAs 配列に ACL
ビヘイビアを追加したら、 ARO と ACO
が関連付いたアクセス制御リストのエントリーを作成することができます。
デフォルトでは ARO が作成されます。

::

    class User extends AppModel {
        var $actsAs = array('Acl' => array('type' => 'requester'));
    }

この例では ACL ビヘイビアを ARO モードにしています。 ACO
モードにするには、次のようにします。

::

    class Post extends AppModel {
        var $actsAs = array('Acl' => array('type' => 'controlled'));
    }

次のようにすることで自動的にビヘイビアを付けることもできます。

::

        $this->Post->Behaviors->attach('Acl', array('type' => 'controlled'));

AclBehavior を使う
==================

AclBehavior は、 Model の afterSave() で動作させることが多いでしょう。
しかしこれを使うにあたり、モデル中で parentNode()
メソッドを定義しておく必要があります。 このメソッドは AclBehavior
が親子関係を確定するために使用されます。 parentNode() メソッドは null
または親モデルの情報を返すようにしなければなりません。

::

    function parentNode() {
        return null;
    }

ACO または ARO ノードをモデルの親としてセットしたい場合は、 parentNode()
は ACO または ARO の別名を返す必要があります。

::

    function parentNode() {
            return 'root_node';
    }

より複雑な User モデルを例にしてみましょう。 この例では User
モデルがどの Group モデルに対して belongsTo
の関係を持つかをあらわします。

::

    function parentNode() {
        if (!$this->id && empty($this->data)) {
            return null;
        }
        $data = $this->data;
        if (empty($this->data)) {
            $data = $this->read();
        } 
        if (!$data['User']['group_id']) {
            return null;
        } else {
            $this->Group->id = $data['User']['group_id'];
            $groupNode = $this->Group->node();
            return array('Group' => array('id' => $groupNode[0]['Aro']['foreign_key']));
        }
    }

上記の例では Model::find() の結果に似た体裁の配列を返します。 id
の値をセットすることは重要です。さもないと親ノード(parentNode)との関連付けは失敗します。
AclBehavior はその木構造において、このデータの構成を使用します。

node()
======

AclBehavior は、モデルのレコードから ACL
ノードの結びつきを見つけ出すことも行います。 これを行うには、 $model->id
をセットした後に $model->node() を実行します。

データの配列を渡すことで、任意の列から ACL
ノードを検索することもできます。

::

        $this->User->id = 1;
        $node = $this->User->node();
        
        $user = array('User' => array(
            'id' => 1
        ));
        $node = $this->User->node($user);

この例は両方とも同じ ACL ノードの情報を返します。
