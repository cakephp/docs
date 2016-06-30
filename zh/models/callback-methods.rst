回调方法
########

如果你需要在模型操作之前或之后要插入一些处理逻辑，请使用模型的回调(*callback*)函
数。这些函数可以定义在模型类中(包括 AppModel)。一定要注意这些特殊函数各自的预期
返回值。

当使用回调函数时，应该记住行为(*behavior*)的回调函数在模型的回调函数 **之前** 执
行。

beforeFind
==========

``beforeFind(array $query)``

该回调函数在任何与 find 相关的操作前被调用。传入该回调的 ``$query`` 参数包含当前
查询的信息，比如：conditions、fields，等。

如果不希望开始该查询操作(可能基于相关的 ``$query`` 选项而做出的决定)，请返回
*false*。否则，返回可能修改过的 ``$query`` ，或者任何你想传递给 find 及其它类似
方法的信息。

可以使用该回调方法基于用户的角色来限制其查询操作，或者根据当前负载作出缓存的决定。

afterFind
=========

``afterFind(array $results, boolean $primary = false)``

使用此回调函数来修改从 find 操作返回的结果，或者执行任何其它 find 之后的逻辑。传
入该回调的 $results 参数包含模型的 find 操作返回的结果，即，象这样::

    $results = array(
        0 => array(
            'ModelName' => array(
                'field1' => 'value1',
                'field2' => 'value2',
            ),
        ),
    );

该回调函数的返回值应该是触发该回调的 find 操作的(可能是经过修改的)结果。

``$primary`` 参数表示当前模型是查询发起的模型，还是作为关联来查询的模型。如果模
型是作为关联来查询的，``$results`` 的格式会不同；不是通常从 find 操作得到的结果，
会得到如下的内容::

    $results = array(
        'field_1' => 'value1',
        'field_2' => 'value2'
    );

.. warning::

    期望 ``$primary`` 为 true 的代码，如果使用递归 find，可能会遇到来自 PHP 的致
    命错误 "Cannot use string offset as an array"。

下面是如何使用 afterfind 回调来格式化日期的例子::

    public function afterFind($results, $primary = false) {
        foreach ($results as $key => $val) {
            if (isset($val['Event']['begindate'])) {
                $results[$key]['Event']['begindate'] = $this->dateFormatAfterFind(
                    $val['Event']['begindate']
                );
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

使用此回调函数来在验证之前修改模型数据，有必要也可以修改验证规则。这个函数也必须
返回 *true*，否则当前的 save() 操作会终止。

afterValidate
==============

``afterValidate()``

在检查数据的错误之后调用。如果需要，用该回调来执行任何数据的清理和准备。

beforeSave
==========

``beforeSave(array $options = array())``

在此回调函数内放入任何保存之前的逻辑。这个函数会紧接着在验证数据成功之后、但在数
据保存之前执行。如果想要保存操作成功，此函数也应该返回 true。

对于数据保存前需要进行的处理逻辑，该回调函数非常方便。如果存储引擎需要日期使用特
定的格式，可以从 $this->data 访问并进行修改。

下面是个用 beforeSave 回调进行日期转换的例子。例子中的代码用于一个应用程序，其
begindate 字段在数据库中的格式为 YYYY-MM-DD，而显示为格式 DD-MM-YYYY。当然这很容
易改变。在适当的模型中使用下面的代码。

::

    public function beforeSave($options = array()) {
        if (!empty($this->data['Event']['begindate']) &&
            !empty($this->data['Event']['enddate'])
        ) {

            $this->data['Event']['begindate'] = $this->dateFormatBeforeSave(
                $this->data['Event']['begindate']
            );
            $this->data['Event']['enddate'] = $this->dateFormatBeforeSave(
                $this->data['Event']['enddate']
            );
        }
        return true;
    }

    public function dateFormatBeforeSave($dateString) {
        return date('Y-m-d', strtotime($dateString));
    }

.. tip::

    请确保 beforeSave() 回调返回 true，否则保存会失败。

afterSave
=========

``afterSave(boolean $created, array $options = array())``

如果需要在每次保存操作后执行一些逻辑，可以将这些逻辑放在该回调方法中。保存的数据
会在 ``$this->data`` 中。

如果是插入新记录(而不是更新记录)，参数 ``$created`` 会为 true。

``$options`` 数组参数就是传给 ``Model::save()`` 方法的同一个参数。

beforeDelete
============

``beforeDelete(boolean $cascade = true)``

在此回调函数内放置任何删除之前的逻辑。若要删除操作继续，此函数应该返回 true，要
终止则返回 false。

如果依赖于该记录的记录也要删除，则参数 ``$cascade`` 会为 ``true``。

.. tip::

    请确保 beforeDelete() 回调返回 true，否则删除会失败。

::

    // 使用 app/Model/ProductCategory.php
    // 在下面的例子中，如果一个产品类别还包含产品，则不允许删除此类别。
    // 在 ProductsController.php 中调用 $this->Product->delete($id) 来设置
    // $this->id。
    // 假设 'ProductCategory hasMany Product'，可以在模型中使用 $this->Product。
    public function beforeDelete($cascade = true) {
        $count = $this->Product->find("count", array(
            "conditions" => array("product_category_id" => $this->id)
        ));
        if ($count == 0) {
            return true;
        }
        return false;
    }

afterDelete
===========

``afterDelete()``

在这个回调函数里放置每次删除之后要执行的逻辑。

::

    // 也许在从数据库中删除一条记录之后，也要删除相关联的文件
    public function afterDelete() {
        $file = new File($this->data['SomeModel']['file_path']);
        $file->delete();
    }

onError
=======

``onError()``

任何问题发生时被调用。


.. meta::
    :title lang=zh: Callback Methods
    :keywords lang=zh: querydata,query conditions,model classes,callback methods,special functions,return values,counterparts,array,logic,decisions
