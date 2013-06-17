コールバックメソッド
####################

CakePHPのモデル処理の前後にだけ何かしらのロジックを忍ばせたいとするなら、
モデルのコールバックを使ってください。
この機能はモデルクラス(AppModelクラスを含む)に定義できます。
これら特別な関数それぞれの期待される返り値には注意を払ってください。

beforeFind
==========

``beforeFind(array $queryData)``

find関連の操作の前に呼ばれます。
このコールバックに渡される ``$queryData`` はconditions、fields等の現在のクエリについての情報をもっています。

もしfind操作が始まることを(おそらく ``$queryData`` オプションに関した決定に基づいて)望まない場合、 *false* を返してください。
そうでなければ、更新されたかもしれない ``$queryData`` か、findに渡したいものやそれ相応のものを返します。

ユーザの役割（権限）に基づき find 操作を制限したり、現在の読み込みに基づきキャッシュを作成するかどうかを決定したりするために、このコールバックは使われるでしょう。

afterFind
=========

``afterFind(array $results, boolean $primary = false)``

findから返された結果を変更するため、あるいは他のfindの後処理のロジックを実行するためにこのコールバックを使用します。
このコールバックに渡された$resultsパラメータには、
モデルのfindから返された結果が含まれます。たとえば次のようなものです。::

    $results = array(
        0 => array(
            'ModelName' => array(
                'field1' => 'value1',
                'field2' => 'value2',
            ),
        ),
    );

このコールバックの返り値は、このコールバックを呼び出したfindの結果(を加工したもの)にする必要があります。

``$primary`` 引数は現在のモデルがクエリが発行された源のモデルかどうか、
またはこのモデルがアソシエーションとして照会されたかを示します。
モデルがアソシエーションとして照会された場合、
``$results`` のフォーマットは少し異なり、
通常の find の結果の代わりに次のようになります::

    $results = array(
        'field_1' => 'value1',
        'field_2' => 'value2'
    );

.. warning::

    再帰的にfindを使用した場合、 ``$primary`` がtrueであると期待しているコードは
    "Cannot use string offset as an array"
    というPHPのfatalエラーになるでしょう。

afterFind によってデータをフォーマットする例を次に示します。::

    public function afterFind($results, $primary = false) {
        foreach ($results as $key => $val) {
            if (isset($val['Event']['begindate'])) {
                $results[$key]['Event']['begindate'] = $this->dateFormatAfterFind($val['Event']['begindate']);
            }
        }
        return $results;
    }
    
    public function dateFormatAfterFind($dateString) {
        return date('d-m-Y', strtotime($dateString));
    }

beforeValidate
==============

``beforeValidate(array $options = array())``

バリデーションが行われる前にモデルのデータを変更するか、
必要に応じてバリデーションルールを変更するために、このコールバックを使用します。
この関数は *true* を返さなければなりません。
そうでない場合、現在のsave()の実行が中断されます。

beforeSave
==========

``beforeSave(array $options = array())``

この関数に保存の前処理のロジックを置きます。
この関数はモデルのデータがバリデーションに成功した後、
データが保存される前に実行されます。
saveの処理を継続するには、この関数は true を返す必要があります。

このコールバックは、データが保存される前にそのデータを加工する場合、特に便利です。
ストレージエンジンが特別な形式の日付を必要とする場合、
$this->dataにアクセスし、変更してください。

beforeSaveによってどのように日付を加工するかの例を次に示します。
この例におけるコードは、begindateがデータベース中ではYYYY-MM-DDという書式で、
アプリケーションにおいてはDD-MM-YYYYという書式にするコードです。
もちろん、この変更はとても簡単に行えます。
このコードを適切なモデルにおいて使用します。

::

    public function beforeSave($options = array()) {
        if (!empty($this->data['Event']['begindate']) && !empty($this->data['Event']['enddate'])) {
            $this->data['Event']['begindate'] = $this->dateFormatBeforeSave($this->data['Event']['begindate']);
            $this->data['Event']['enddate'] = $this->dateFormatBeforeSave($this->data['Event']['enddate']);
        }
        return true;
    }

    public function dateFormatBeforeSave($dateString) {
        return date('Y-m-d', strtotime($dateString));
    }

.. tip::

    beforeSave()は必ずtrueを返すようにしてください。
    そうしないとsaveは失敗します。

afterSave
=========

``afterSave(boolean $created)``

各save操作の後に実行する必要のあるロジックがある場合、このコールバックメソッドに置きます。

新しいオブジェクトが（更新ではなく）生成された場合、 ``$created`` はtrueになります。

beforeDelete
============

``beforeDelete(boolean $cascade = true)``

この関数に削除の前処理のロジックを置きます。
削除を継続したい場合は、この関数はtrueを返す必要があります。
中止したい場合はfalseを返します。

このとき削除されるレコードに依存する(*depend*)レコードもまた削除される場合、
``$cascade`` の値は ``true`` になります。

.. tip::

    beforeDelete()は必ずtrueを返すようにしてください。
    そうしないとsaveは失敗します。

::

    // app/Model/ProductCategory.php を使用する。
    // 以下の例では、プロダクトをまだ保有してる場合、
    // プロダクトのカテゴリを削除しないようにします。
    // ProductsController.phpからの$this->Product->delete($id)の呼び出しでは、
    // $this->idがセットされます。
    // 「ProductCategory hasMany Product」と仮定すると、
    // このモデルで$this->Productにアクセスできます。
    public function beforeDelete($cascade = true) {
        $count = $this->Product->find("count", array(
            "conditions" => array("product_category_id" => $this->id)
        ));
        if ($count == 0) {
            return true;
        } else {
            return false;
        }
    }

afterDelete
===========

``afterDelete()``

このコールバックメソッドに、削除の後に実行したいロジックを置きます。

onError
=======

``onError()``

問題が起こった場合に呼び出されます。

