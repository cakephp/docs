从控制器验证数据
###################################

虽然通常只使用模型的 save 方法，但也许有时仅需要验证而不保存数据。例如，也许在真正的把数据
保存到数据库之前，想要给用户显示一些额外的信息。验证数据的过程与保存数据相比，有细微的差别。

首先，将数据赋值给模型::

    $this->ModelName->set($this->request->data);

然后要检查数据是否正确，使用模型的 validates 方法，如果正确就会返回 true，否则就返回 false::

    if ($this->ModelName->validates()) {
        // 验证通过的逻辑
    } else {
        // 验证未通过的逻辑
        $errors = $this->ModelName->validationErrors;
    }

也许更乐意用模型中定义的验证规则的子集来验证模型。比方说有一个 User 模型，含有 first\_name，
last\_name，email 和 password 字段。在这个例子中，当创建或者编辑一个用户时会验证整个这4个
字段。然而当用户登录时只想验证电子邮件和密码字段。要做到这点可以传入一个选项数组指定要验证
的字段::

    if ($this->User->validates(array('fieldList' => array('email', 'password')))) {
        // 有效
    } else {
        // 无效
    }

validates 方法调用 invalidFields 方法，后者填入模型的 validationErrors 属性。
invalidFields 方法也把这个属性作为结果返回::

    $errors = $this->ModelName->invalidFields(); // 包含 validationErrors 数组

在对 ``invalidFields()`` 的连续调用之间，验证错误列表不会清除。所以如果是在一个循环内
验证，并且想要分开每组错误就不要使用 ``invalidFields()`` 。而是使用 ``validates()`` 方法
再读取 ``validationErrors`` 模型属性。

重要的是要记住，在验证数据前数据必须赋值给模型。这不同于 save 方法可以允许数据作为参数传入。
另外，记住调用 save 方法之前并没有必要调用 validates 方法，因为 save 方法在真的保存数据之前会自动
验证数据。

要验证多个模型，应当使用下面的方法::

    if ($this->ModelName->saveAll($this->request->data, array('validate' => 'only'))) {
      // 验证通过
    } else {
      // 验证未通过
    }

如果在保存之前验证了数据，那么可以关闭验证以避免第二次验证::

    if ($this->ModelName->saveAll($this->request->data, array('validate' => false))) {
        // 不验证就保存
    }


.. meta::
    :title lang=zh: Validating Data from the Controller
    :keywords lang=zh: password rules,validations,subset,array,logs,logic,email,first name last name,models,options,data model