数据验证
########

数据验证是任何应用程序的重要组成部分，因为这有助于确保模型中的数据符合应用程序的
业务规则。例如，你也许要确保密码至少有八个字符，或者用户名是唯一的。定义验证规则
使得表单的处理容易得多得多。

验证过程包含很多方面。本节中我们只涉及模型中的部分。基本上这意味着:当你调用模型
的 save() 方法时会发生什么。有关如何处理验证错误显示的更多信息，请参看 
:doc:`/core-libraries/helpers/form` 。

数据验证的第一步是在模型中建立验证规则。这需要用到在模型中定义的 Model::validate
数组，例如::

    class User extends AppModel {
        public $validate = array();
    }

在上面的例子中，``$validate`` 数组被加到 User 模型中，但此数组还不包含任何验证规
则。假设 users 表中有login，password，email和born这些字段，下面的例子中是一些针
对这些字段的简单验证规则::

    class User extends AppModel {
        public $validate = array(
            'login' => 'alphaNumeric',
            'email' => 'email',
            'born' => 'date'
        );
    }

上面的例子展示了验证规则如何作用于模型的字段。login 字段只接受字母和数字，email 
应当是合法的电子邮件格式，以及 born 应当是合法的日期。定义了验证规则之后，如果提
交的数据不符合定义的规则，CakePHP 就能够在表单中自动显示错误信息。

CakePHP 有许多验证规则，使用起来相当容易。一些内置的验证规则可以让你检查电子邮件，
网址和信用卡的格式 – 不过我们稍后才会详细介绍这些。

这是一个利用内置验证规则的更复杂的例子::

    class User extends AppModel {
        public $validate = array(
            'login' => array(
                'alphaNumeric' => array(
                    'rule' => 'alphaNumeric',
                    'required' => true,
                    'message' => 'Letters and numbers only'
                ),
                'between' => array(
                    'rule' => array('between', 5, 15),
                    'message' => 'Between 5 to 15 characters'
                )
            ),
            'password' => array(
                'rule' => array('minLength', '8'),
                'message' => 'Minimum 8 characters long'
            ),
            'email' => 'email',
            'born' => array(
                'rule' => 'date',
                'message' => 'Enter a valid date',
                'allowEmpty' => true
            )
        );
    }

login 字段有两个验证规则:它只能包含字母和数字，长度介于5到15之间。password 字段
至少要有8个字符长。email 字段必须是合法的电子邮件，而 born 字段必须是合法的日期。
另外，请注意有关这些验证规则失败时 CakePHP 显示的错误信息。

如上例所示，一个字段可以有多个验证规则。另外，如果内置的规则不符合你的要求，在必
要时总是可以增加自己的验证规则。

现在你应该已经明白验证大致是如何工作的了，让我们再来看看这些规则在模型中是如何定
义的。定义验证规则有三种不同的方式: 简单的数组，每个字段带一个规则，每个字段带有
多个规则。


简单的规则
==========

正如名称所说的，这是定义验证规则最简单的方式。定义其规则的通常语法为::

    public $validate = array('fieldName' => 'ruleName');

其中，'fieldName' 是定义的规则针对的字段名称，'ruleName' 是预先定义的规则名称，
比如'alphaNumeric'，'email' 或者 'isUnique'。

例如，为确保用户提供正确格式的电子邮件地址，你可以使用这个规则::

    public $validate = array('user_email' => 'email');


每个字段带一个规则
==================

这种定义方式可以更好地控制验证规则工作。但在讨论这些之前，让我们先来看看给一个字
段加一个规则的常用模式::

    public $validate = array(
    	// 或者: array('ruleName', 'param1', 'param2' ...)
        'fieldName1' => array(
            'rule' => 'ruleName',
            'required' => true,
            'allowEmpty' => false,
            // 或者: 'update'
            'on' => 'create',
            'message' => 'Your Error Message'
        )
    );

'rule' 键是必需的。如果只设置 'required' => true，表单验证不会正常工作。这是因为
'required' 实际上不是一个规则。

这里你可以看到，每个字段(上面只显示了一个字段)与一个数组联系在一起，该数组有5个
键: 'rule'、'required'、'allowEmpty'、'on' 和 'message'。让我们看一下他们的具体
含义。

rule
----

'rule' 键定义了验证的方法，可以是单一的值，也可以是一个数组。指定的 'rule' 可以
是模型的方法名称，核心验证类的方法，或者正则表达式。关于在缺省情况下可用的规则的
更多信息，请参看 :ref:`core-validation-rules`。

如果某个规则不需要带任何参数，'rule' 就可以是单一值，例如::

    public $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric'
        )
    );

如果某个规则需要带一些参数(比如最大值，最小值或者范围)，'rule' 就应当是一个数组::

    public $validate = array(
        'password' => array(
            'rule' => array('minLength', 8)
        )
    );

谨记，'rule' 对于基于数组定义的规则是必需的。

required
--------

这个键接受布尔值，``create`` 或者 ``update``。把这个键置为 ``true`` 就会认为该字
段总是必需的。而把它设成 ``create`` 或 ``update`` 就会认为该字段只在创建或者更新
操作时是必需的。如果 'required' 的值为真，则该字段在数据数组中必须存在。例如，如
果验证规则如下定义::

    public $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'required' => true
        )
    );

传给模型的 save() 方法的数据中必须含有 login 字段的数据，否则验证就会失败。该键
的缺省值为布尔类型 false。

``required => true`` 和验证规则 ``notBlank()`` 并不是一回事。
``required => true`` 意味着数组的 *键* 必须存在 - 这不代表必须有值。所以，如果字
段在数据集中不存在，验证就会失败，但如果提交的值为空('')，验证有可能(取决于规则)
会成功。

.. versionchanged:: 2.1
    增加了对 ``create`` 和 ``update`` 的支持。

allowEmpty
----------

如果设为 ``false`` ，字段的值必须为 *非空*，而 "nonempty" 定义为 
``!empty($value) || is_numeric($value)`` 。对数字的检查是为了使 CakePHP 能正确处
理 ``$value`` 为零的情况。

``required`` 和 ``allowEmpty`` 的区别可能令人迷惑。``'required' => true`` 意味着
在 ``$this->data``中没有该字段的 *键* ，你就不能保存模型(使用 ``isset`` 检查)； 
然而，``'allowEmpty' => false`` 正如前所述，确保当前字段的 *值* 不为空。

on
--

'on'键可以设置为下列值之一: 'update' 或者 'create' 。这提供了一种机制，允许某个
规则要么在创建新记录时起作用，要么在更新记录时起作用。

如果一条规则含有 'on' => 'create'，该规则只会在新记录创建时起作用。类似的，如果
定义为 'on' => 'update' ，则只会在记录更新时起作用。

'on' 的缺省值是 null。当 'on' 为 null 时，该规则在创建和更新时都会起作用。

message
-------

message 键是为规则定义验证失败时显示的错误信息::

    public $validate = array(
        'password' => array(
            'rule' => array('minLength', 8),
            'message' => '密码至少8个字符长'
        )
    );

.. note::

    当验证失败默认显示的消息是"This field cannot be left blank."

每个字段多条规则
================

上面给出的方法比简单的规则赋值提供了更多的灵活性，但我们可以更进一步，可以更精细
地控制数据验证。下面介绍的方法可以让我们对一个模型字段设置多条验证规则。

如果想要给一个字段设置多条验证规则，大致这样::

    public $validate = array(
        'fieldName' => array(
            'ruleName' => array(
                'rule' => 'ruleName',
                // 额外的键，比如 on，required 等等，放在这里 ...
            ),
            'ruleName2' => array(
                'rule' => 'ruleName2',
                // 额外的键，比如 on，required 等等，放在这里 ...
            )
        )
    );

可以看到，这很象我们在前一节做的。在前一节，对每个字段我们只有一个数组的验证参数。
而现在，每个'字段名'有一个数组的规则索引，每个'规则名称'有一个单独数组的验证参数。

用一个实际的例子能够更好地说明::

    public $validate = array(
        'login' => array(
            'loginRule-1' => array(
                'rule' => 'alphaNumeric',
                'message' => 'Only alphabets and numbers allowed',
             ),
            'loginRule-2' => array(
                'rule' => array('minLength', 8),
                'message' => 'Minimum length of 8 characters'
            )
        )
    );

上面的例子对 login 字段设置了2个规则: loginRule-1和 loginRule-2。可以看到，每个
规则都由一个随意的名字标识。

当对一个字段使用多条规则时，'required' 和 'allowEmpty' 键只需在第一条规则中设置
一次。

last
----

当一个字段有多条规则时，缺省情况下，如果一条规则验证失败，那么这条规则的错误信息
就会返回，而该字段的其它规则就不会继续执行了。如果你希望,即使在一条规则验证失败
时，验证也继续执行，就把该条规则的 ``last`` 设置为 ``false``。

在下面的例子中，即使 "rule1" 验证失败，"rule2" 也会继续执行，而且，如果 "rule2" 
也失败，则两条失败规则的错误信息都会返回::

    public $validate = array(
        'login' => array(
            'rule' => array(
                'rule' => 'alphaNumeric',
                'message' => 'Only alphabets and numbers allowed',
                'last'    => false
             ),
            'rule2' => array(
                'rule' => array('minLength', 8),
                'message' => 'Minimum length of 8 characters'
            )
        )
    );

当使用这种数组格式设置验证规则时，可以不带 ``message`` 键。请看下面的例子::

    public $validate = array(
        'login' => array(
            'Only alphabets and numbers allowed' => array(
                'rule' => 'alphaNumeric',
             ),
        )
    );

如果 ``alphaNumeric`` 规则验证失败，因为没有设置 ``message`` 键，该规则的键
'Only alphabets and numbers allowed' 就会作为错误信息返回。


自定义验证规则
==============

如果到此还没有找到你需要的验证规则，可以创建自己的验证规则。通过两种方法: 自定义
正则表达式，或者创建自定义验证方法。

使用自定义的正则表达式进行验证
------------------------------

如果可以使用正则表达式匹配需要的验证，那么可以设置自定义正则表达式作为字段验证规
则::

    public $validate = array(
        'login' => array(
            'rule' => '/^[a-z0-9]{3,}$/i',
            'message' => 'Only letters and integers, min 3 characters'
        )
    );

上面的例子检查 login 字段是否只包含字母和数字，至少3个字符。

``rule`` 中的正则表达式必须由斜线界定起始。最后一个斜线之后的 'i' 是可以省略的，
表示正则表达式是大小写无关。

添加自定义的验证方法
--------------------

有时候使用正则表达式检查数据是不够的。比如，如果你想确保一个折扣号码只能使用25次，
就需要添加自己的验证函数，如下所示::

    class User extends AppModel {

        public $validate = array(
            'promotion_code' => array(
                'rule' => array('limitDuplicates', 25),
                'message' => 'This code has been used too many times.'
            )
        );

        public function limitDuplicates($check, $limit) {
            // $check 的值为: array('promotion_code' => 'some-value')
            // $limit 的值为: 25
            $existing_promo_count = $this->find('count', array(
                'conditions' => $check,
                'recursive' => -1
            ));
            return $existing_promo_count < $limit;
        }
    }

要验证的当前字段会以关联数组的形式传入函数的第一个参数，字段名为键，提交的数据为
值。

如果要给验证函数传入其他参数，需要在 'rule' 数组中加入更多元素，再在你的函数中
(在主要的 ``$check`` 参数之后)作为其他参数处理。

自定义的验证函数可以定义在模型中(正如上面的例子)，也可以定义在一个模型实现的行为
中。这包括映射方法(*mapped method*)。

模型/行为方法会优先考虑，之后才会查找 ``Validation`` 类的方法。这意味着你可以重
载现存的验证方法(例如 ``alphaNumeric()``)，或者在应用程序级别(通过给 
``AppModel`` 添加方法)，或者在模型级别。

当编写一个可以用于多个字段的验证规则时，注意从 $check 提取字段的值。$check 数组
传入时以表单名为键，以字段的值为其值。要被验证的整个记录保存在 $this->data 成员
变量中::

    class Post extends AppModel {

        public $validate = array(
            'slug' => array(
                'rule' => 'alphaNumericDashUnderscore',
                'message' => 'Slug can only be letters,' .
                    ' numbers, dash and underscore'
            )
        );

        public function alphaNumericDashUnderscore($check) {
            // $data 数组用表单字段名为键传入
            // 必须提取其值，使函数通用
            $value = array_values($check);
            $value = $value[0];

            return preg_match('|^[0-9a-zA-Z_-]*$|', $value);
        }
    }

.. note::

    自定义的验证方法必须有 ``public``。``protected`` 和 ``private`` 的验证方法是
    不支持的。

如果值合法，方法应该返回 ``true``。如果验证失败，返回 ``false``。其它合法的返回
值可以是字符串，作为错误信息显示。返回字符串意味着验证失败。字符串会覆盖 
$validate 数组中设置的信息，作为字段不合法的原因，显示在视图的表单中。


动态改变验证规则
================

使用 ``$validate`` 属性来声明验证规则是为一个类定义静态规则的好方法。但难免会有
一些情况下，你想对预先定义的规则集动态添加、修改或删除验证规则。

所有的验证规则都保存在一个 ``ModelValidator`` 对象中，你模型中每个字段的验证规则
集都在这里。定义新的规则简单到只需告诉该对象来存储需要的字段新的验证方法。


添加新的验证规则
----------------

.. versionadded:: 2.2

``ModelValidator`` 对象允许多种方法添加新字段到集合中。第一种是使用 ``add`` 方法::

    // 在一个模型类中
    $this->validator()->add('password', 'required', array(
        'rule' => 'notBlank',
        'required' => 'create'
    ));

这会为模型中的 `password` 字段添加一个规则。可以链接多个 add 方法来添加任意多个
规则::

    // 在一个模型类中
    $this->validator()
        ->add('password', 'required', array(
            'rule' => 'notBlank',
            'required' => 'create'
        ))
        ->add('password', 'size', array(
            'rule' => array('between', 8, 20),
            'message' => 'Password should be at least 8 chars long'
        ));

也可以为一个字段一次添加多个规则::

    $this->validator()->add('password', array(
        'required' => array(
            'rule' => 'notBlank',
            'required' => 'create'
        ),
        'size' => array(
            'rule' => array('between', 8, 20),
            'message' => 'alphanumeric'
        )
    ));

或者，你可以用 validator 对象使用存取数组的方式直接对字段设置验证规则::

    $validator = $this->validator();
    $validator['username'] = array(
        'unique' => array(
            'rule' => 'isUnique',
            'required' => 'create'
        ),
        'alphanumeric' => array(
            'rule' => 'alphanumeric'
        )
    );

修改现存的验证规则
------------------

.. versionadded:: 2.2

使用 validator 对象也可以修改当前的验证规则。有若干种方法可以修改现存规则，
对一个字段添加验证方法，或者从一个字段的验证规则集合中完全删除一条规则::

    // 在一个模型类中
    $this->validator()->getField('password')->setRule('required', array(
        'rule' => 'required',
        'required' => true
    ));

你也可以用类似的方法完全替换掉一个字段的所有规则::

    // 在一个模型类中
    $this->validator()->getField('password')->setRules(array(
        'required' => array(...),
        'otherRule' => array(...)
    ));

如果只要改变一个规则中的一个属性，可以直接设置 ``CakeValidationRule`` 对象的属性::

    // 在一个模型类中
    $this->validator()->getField('password')
        ->getRule('required')->message = 'This field cannot be left blank';

在定义验证规则属性可以使用的数组键，就可以作为 ``CakeValidationRule`` 中的属性的
名字，比如 'message' 和 'allowEmpty'。

类似于对集合添加新规则，也可以用存取数组的方式修改现存的规则::

    $validator = $this->validator();
    $validator['username']['unique'] = array(
        'rule' => 'isUnique',
        'required' => 'create'
    );

    $validator['username']['unique']->last = true;
    $validator['username']['unique']->message = '名字已经被占用';


从集合中删除规则
----------------

.. versionadded:: 2.2

可以完全删除一个字段的所有规则，或者一个字段规则集合中的一条规则::

    // 完全删除一个字段的所有规则
    $this->validator()->remove('username');

    // 删除字段 password 的 'required' 规则
    $this->validator()->remove('password', 'required');

另外，可以用数组访问的方式从集合中删除规则::

    $validator = $this->validator();
    // 完全删除一个字段的所有规则
    unset($validator['username']);

    // 完删除 password 字段的 'required' 规则
     unset($validator['password']['required']);

.. _core-validation-rules:

核心验证规则
============

.. php:class:: Validation

CakePHP 的 Validation 类有许多验证规则，可以使模型数据的验证容易得多。这个类有许
多常用的验证方法，就可以不必自己写了。下面，可以看到所有验证规则的完整列表，以及
如何使用的例子。

.. php:staticmethod:: alphaNumeric(mixed $check)

    字段的数据只能含有字母和数字。 ::

        public $validate = array(
            'login' => array(
                'rule' => 'alphaNumeric',
                'message' => 'Usernames must only contain letters and numbers.'
            )
        );

.. php:staticmethod:: between(string $check, integer $min, integer $max)

    字段的数据长度必须在指定的数字范围内。必须提供最小值和最大值。
    Uses = not。 ::

        public $validate = array(
            'password' => array(
                'rule' => array('between', 5, 15),
                'message' => 'Passwords must be between 5 and 15 characters long.'
            )
        );

    数据的长度是"数据的字符串表示方式的字节数"。注意，在处理非 ASCII
    字符时可能会长于数据的字符数。


.. php:staticmethod:: blank(mixed $check)

    这个规则用来保证字段为空或者只含有空字符。空字符包括空格、制表符、回车和换行。 ::

        public $validate = array(
            'id' => array(
                'rule' => 'blank',
                'on' => 'create'
            )
        );


.. php:staticmethod:: boolean(string $check)

    字符的数据必须是布尔值。合法的值为 true 或 false，整数0或1，或者字符串'0'或
    '1'。 ::

        public $validate = array(
            'myCheckbox' => array(
                'rule' => array('boolean'),
                'message' => 'myCheckbox 的值不正确'
            )
        );


.. php:staticmethod:: cc(mixed $check, mixed $type = 'fast', boolean $deep = false, string $regex = null)

    这个规则用来检查数据是否是一个合法的信用卡号码。它接受3个参数: 'type'、
    'deep' 和 'regex'。

    'type' 键可以赋值为 'fast'，'all' 或者任意下面的值:

    -  amex
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

    如果 'type' 设置为 'fast'，数据就会用主要的信用卡号码格式来检查。设置 'type'
    为 'all'，就会检查所有信用卡类型。你也可以设置 type 为一个你想匹配的类型的数
    组。

    'deep' 键应当设置为布尔值。如果设为 true，就会检查信用卡的 Luhn 算法(
    `http://en.wikipedia.org/wiki/Luhn\_algorithm <http://en.wikipedia.org/wiki/Luhn_algorithm>`_ 
    )。缺省值为 false。

    'regex' 键允许提供自定义正则表达式，用来验证信用卡号码::

        public $validate = array(
            'ccnumber' => array(
                'rule' => array('cc', array('visa', 'maestro'), false, null),
                'message' => 'The credit card number you supplied was invalid.'
            )
        );


.. php:staticmethod:: comparison(mixed $check1, string $operator = null, integer $check2 = null)

    Comparison 用来比较数值。它支持"大于"、"小于"、"大于等于"、"小于等于"、
    "等于"、"不等于"。下面是一些例子::

        public $validate = array(
            'age' => array(
                'rule' => array('comparison', '>=', 18),
                'message' => 'Must be at least 18 years old to qualify.'
            )
        );

        public $validate = array(
            'age' => array(
                'rule' => array('comparison', 'greater or equal', 18),
                'message' => 'Must be at least 18 years old to qualify.'
            )
        );


.. php:staticmethod:: custom(mixed $check, string $regex = null)

    当需要自定义的正则表达式时使用::

        public $validate = array(
            'infinite' => array(
                'rule' => array('custom', '\u221E'),
                'message' => 'Please enter an infinite number.'
            )
        );


.. php:staticmethod:: date(string $check, mixed $format = 'ymd', string $regex = null)

    这个规则确保数据是以合法的日期格式输入的。可以传入单个参数(可以是一个数组)，
    用来检查输入日期的格式。参数的值可以为下列之一:

    -  'dmy' 例如27-12-2006或者27-12-06(分隔符可以是空格，英文句号，破折号，斜线)
    -  'mdy' 例如12-27-2006或者12-27-06(分隔符可以是空格，英文句号，破折号，斜线)
    -  'ymd' 例如2006-12-27或者06-12-27(分隔符可以是空格，英文句号，破折号，斜线)
    -  'dMy' 例如27 December 2006或者27 Dec 2006
    -  'Mdy' 例如December 27, 2006或者Dec 27, 2006(逗号可以省略)
    -  'My'  例如(December 2006或者Dec 2006)
    -  'my'  例如12/2006或者12/06(分隔符可以是空格，英文句号，破折号，斜线)

    如果没有提供该键，将使用缺省的键值 'ymd'::

        public $validate = array(
            'born' => array(
                'rule' => array('date', 'ymd'),
                'message' => 'Enter a valid date in YY-MM-DD format.',
                'allowEmpty' => true
            )
        );

    虽然很多数据存储方式要求某个特定的日期格式，但是也许应该考虑承担麻烦的部分，
    接受众多的日期格式，然后再尝试进行转换，而不是强制用户使用指定的格式。能为用
    户做的越多越好。

    .. versionchanged:: 2.4
         加入 ``ym`` 和 ``y`` 格式。

.. php:staticmethod:: datetime(array $check, mixed $dateFormat = 'ymd', string $regex = null)

    这条规则确保数据是合法的 datetime 格式。可以传入一个参数(可以是数组)
    来指定日期的格式。参数的值可以是下面的一个或多个:

    -  'dmy' 例如27-12-2006或者27-12-06(分隔符可以是空格，英文句号，破折号，斜线)
    -  'mdy' 例如12-27-2006或者12-27-06(分隔符可以是空格，英文句号，破折号，斜线)
    -  'ymd' 例如2006-12-27或者06-12-27(分隔符可以是空格，英文句号，破折号，斜线)
    -  'dMy' 例如27 December 2006或者27 Dec 2006
    -  'Mdy' 例如December 27, 2006或者Dec 27, 2006(逗号可以省略)
    -  'My' 例如(December 2006或者Dec 2006)
    -  'my' 例如12/2006或者12/06(分隔符可以是空格，英文句号，破折号，斜线)

    如果没有提供该键，将使用缺省的键值 'ymd'::

        public $validate = array(
            'birthday' => array(
                'rule' => array('datetime', 'dmy'),
                'message' => 'Please enter a valid date and time.'
            )
        );

    也可以传入第二个参数，指定一个定制的正则表达式。如果使用这个参数，这就会是
    执行的唯一验证。

    注意，和 date()不同，datetime()会验证日期和时间。


.. php:staticmethod:: decimal(integer $check, integer $places = null, string $regex = null)

    这个规则确保数据是合法的 decimal 数值。可以传入参数来指定小数点后需要多少位
    小数。如果没有参数传入，数据将会当做科学计数法的浮点数来验证，这样的话，如果
    小数点后面没有数字，验证就会失败::

        public $validate = array(
            'price' => array(
                'rule' => array('decimal', 2)
            )
        );


.. php:staticmethod:: email(string $check, boolean $deep = false, string $regex = null)

    这条规则检查数据是否是合法的电子邮件地址。给规则的第二个参数传入布尔值
    true，就会同时也验证电子邮件的主机地址是否也是合法的::

        public $validate = array('email' => array('rule' => 'email'));

        public $validate = array(
            'email' => array(
                'rule' => array('email', true),
                'message' => 'Please supply a valid email address.'
            )
        );


.. php:staticmethod:: equalTo(mixed $check, mixed $compareTo)

    这条规则确保数据的值等于给定的值，并且是相同的类型。

    ::

        public $validate = array(
            'food' => array(
                'rule' => array('equalTo', 'cake'),
                'message' => 'This value must be the string cake'
            )
        );


.. php:staticmethod:: extension(mixed $check, array $extensions = array('gif', 'jpeg', 'png', 'jpg'))

    这条规则检查合法的文件扩展名，比如.jpg或者.png。
    允许多个扩展名以数组的形式传入。

    ::

        public $validate = array(
            'image' => array(
                'rule' => array('extension', array('gif', 'jpeg', 'png', 'jpg')),
                'message' => 'Please supply a valid image.'
            )
        );

.. php:staticmethod:: fileSize($check, $operator = null, $size = null)

    这条规则用来检查文件大小。可以用 ``$operator`` 来决定要
    使用的比较方法。所有 :php:func:`~Validation::comparison()` 支持的
    操作符这里都可以使用。这个方法可以自动处理来自 ``$_FILES`` 的数组，
    它可以从 ``tmp_name`` 键读取，只要 ``$check`` 是个数组，并且含有这个键::

        public $validate = array(
            'image' => array(
                'rule' => array('fileSize', '<=', '1MB'),
                'message' => 'Image must be less than 1MB'
            )
        );

    .. versionadded:: 2.3
        这个方法是在2.3版本中添加的。

.. php:staticmethod:: inList(string $check, array $list)

    这条规则确保数据限于一个给定的集合中。它需要以数组形式提供的一组值。如果数据
    能够和给定的数组中的一个值匹配，字段就是合法的。

    例如::

        public $validate = array(
            'function' => array(
                 'allowedChoice' => array(
                     'rule' => array('inList', array('Foo', 'Bar')),
                     'message' => 'Enter either Foo or Bar.'
                 )
             )
         );

    默认区分大小写，可以设置 ``$caseInsensitive`` 为真来不区分大小写。

.. php:staticmethod:: ip(string $check, string $type = 'both')

    这条规则确保提交的是合法的 IPv4 或 IPv6 的地址。允许 'both' (缺省值)，
    'IPv4'或者'IPv6'。

    ::

        public $validate = array(
            'clientip' => array(
                'rule' => array('ip', 'IPv4'), // 或者'IPv6'， 或者'both'(缺省值)
                'message' => 'Please supply a valid IP address.'
            )
        );


.. php:method:: Model::isUnique()

    字段的数据必须唯一，它不可以被其他任何数据行使用。

    ::

        public $validate = array(
            'login' => array(
                'rule' => 'isUnique',
                'message' => 'This username has already been taken.'
            )
        );

    可以提供多个字段并且设置 ``$or`` 为 ``false`` 来验证一组字段是否唯一::

        public $validate = array(
            'email' => array(
                'rule' => array('isUnique', array('email', 'username'), false),
                'message' => 'This username & email combination has already been used.'
            )
        );

    当跨多字段进行唯一规则验证时要确保字段列表中包含原始的字段。

.. php:staticmethod:: luhn(string|array $check, boolean $deep = false)

    Luhn 算法：一个校验码公式，来验证各种识别号码。更多信息，请参见
    `Luhn 算法 <http://en.wikipedia.org/wiki/Luhn_algorithm>`_。


.. php:staticmethod:: maxLength(string $check, integer $max)

    这个规则确保数据在最大长度范围内。

    ::

        public $validate = array(
            'login' => array(
                'rule' => array('maxLength', 15),
                'message' => 'Usernames must be no larger than 15 characters long.'
            )
        );

    这里的长度是"数据的字符串表示的字节数"。注意，在处理非 ASCII 字符时，这可能
    会长于数据的字符数。

.. php:staticmethod:: mimeType(mixed $check, array $mimeTypes)

    .. versionadded:: 2.2

    这个规则检查合法的 mimeType

    .. versionchanged:: 2.5

    从 2.5 版本开始 ``$mimeTypes`` 可以是正则表达式字符串.

    ::

        public $validate = array(
            'image' => array(
                'rule' => array('mimeType', array('image/gif')),
                'message' => 'Invalid mime type.'
            ),
            'logo' => array(
                'rule' => array('mimeType', '#image/.+#'),
                'message' => 'Invalid mime type.'
            ),
        );

.. php:staticmethod:: minLength(string $check, integer $min)

    这个规则确保数据满足最小长度要求。

    ::

        public $validate = array(
            'login' => array(
                'rule' => array('minLength', 8),
                'message' => 'Usernames must be at least 8 characters long.'
            )
        );

    这里的长度是"数据的字符串表示的字节数"。注意，在处理非 ASCII 字符时，这可能
    会长于数据的字符数。


.. php:staticmethod:: money(string $check, string $symbolPosition = 'left')

    这条规则确保数值是正确的财务金额。

    第二个参数指定货币符号在哪里(左/右)。

    ::

        public $validate = array(
            'salary' => array(
                'rule' => array('money', 'left'),
                'message' => 'Please supply a valid monetary amount.'
            )
        );

.. php:staticmethod:: multiple(mixed $check, mixed $options = array())

    用这条规则验证一个多选输入。它支持"in"，"max"和"min"参数。

    ::

        public $validate = array(
            'multiple' => array(
                'rule' => array('multiple', array(
                    'in'  => array('do', 're', 'mi', 'fa', 'sol', 'la', 'ti'),
                    'min' => 1,
                    'max' => 3
                )),
                'message' => 'Please select one, two or three options'
            )
        );

    默认区分大小写，可以设置 ``$caseInsensitive`` 为真来不区分大小写。

.. php:staticmethod:: notEmpty(mixed $check)

    .. deprecated:: 2.7

    不要再使用，而是用 ``notBlank``。

.. php:staticmethod:: notBlank(mixed $check)

    .. versionadded:: 2.7

    确保一个字段不为空的基本规则。 ::

        public $validate = array(
            'title' => array(
                'rule' => 'notBlank',
                'message' => 'This field cannot be left blank'
            )
        );

    不要对一个多选输入使用该规则，因为这会引起错误。请使用 "multiple"。


.. php:staticmethod:: numeric(string $check)

    检查传入的数据是一个合法的数。 ::

        public $validate = array(
            'cars' => array(
                'rule' => 'numeric',
                'message' => 'Please supply the number of cars.'
            )
        );

.. php:staticmethod:: naturalNumber(mixed $check, boolean $allowZero = false)

    .. versionadded:: 2.2

    这个规则检查传入的数据是否是正确的自然数。如果 ``$allowZero`` 设为 true，零
    也可以接受。

    ::

        public $validate = array(
            'wheels' => array(
                'rule' => 'naturalNumber',
                'message' => 'Please supply the number of wheels.'
            ),
            'airbags' => array(
                'rule' => array('naturalNumber', true),
                'message' => 'Please supply the number of airbags.'
            ),
        );


.. php:staticmethod:: phone(mixed $check, string $regex = null, string $country = 'all')

    Phone 规则验证美国的电话号码。如果要验证美国以外的电话号码，可以在第二个参数
    用一个正则表达式来处理其他的号码格式。

    ::

        public $validate = array(
            'phone' => array(
                'rule' => array('phone', null, 'us')
            )
        );


.. php:staticmethod:: postal(mixed $check, string $regex = null, string $country = 'us')

    Postal 规则验证美国(us)、加拿大(ca)、英国(uk)、意大利(it)、德国(de)和比利时
    (be)的邮政编码。对于其他的邮政编码格式，可以在第二个参数提供一个正则表达式。

    ::

        public $validate = array(
            'zipcode' => array(
                'rule' => array('postal', null, 'us')
            )
        );


.. php:staticmethod:: range(string $check, integer $lower = null, integer $upper = null)

    这条规则确保数值在一个给定范围内。如果没有指定范围，规则会检查数值是当前平台
    上的合法有限数。

    ::

        public $validate = array(
            'number' => array(
                'rule' => array('range', -1, 11),
                'message' => 'Please enter a number between -1 and 11'
            )
        );


    上面的例子会接受大于-1(比如 -0.99)而且小于11(比如 10.99)的任何数值。

    .. note::

        上下限的值是不包括在内的。


.. php:staticmethod:: ssn(mixed $check, string $regex = null, string $country = null)

    Ssn 规则验证美国(us)，丹麦(dk)，和荷兰(nl)的社会保险号码。对于其他的社会保险
    号码，可以指定正则表达式。

    ::

        public $validate = array(
            'ssn' => array(
                'rule' => array('ssn', null, 'us')
            )
        );


.. php:staticmethod:: time(string $check)

    Time 验证规则决定传入的字符串是否是正确的时间。以24小时(HH:MM)或上午/下午(
    [H]H:MM[a|p]m)来验证。不允许/验证秒。

.. php:staticmethod:: uploadError(mixed $check)

    .. versionadded:: 2.2

    这条规则检查文件上载是否有错。

    ::

        public $validate = array(
            'image' => array(
                'rule' => 'uploadError',
                'message' => 'Something went wrong with the upload.'
            ),
        );

.. php:staticmethod:: url(string $check, boolean $strict = false)

    这条规则检查合法的网址格式。支持 http(s)、ftp(s)、file、news 和 gopher 协议::

        public $validate = array(
            'website' => array(
                'rule' => 'url'
            )
        );

    为确保协议在网址中，可以象这样使用严格模式::

        public $validate = array(
            'website' => array(
                'rule' => array('url', true)
            )
        );

    这个验证方法用到了复杂正则表达式，有时会在 Windows 平台上在使用 mod\_php 
    模块的 Apache2 中出现问题。

.. php:staticmethod:: userDefined(mixed $check, object $object, string $method, array $args = null)

    执行用户定义的验证。


.. php:staticmethod:: uuid(string $check)

    检查数据是合法的 UUID: http://tools.ietf.org/html/rfc4122。


本地化验证
==========

验证规则 phone() 和 postal() 会把它们不知道如何处理的国家前缀交给适当命名的其他
类来处理。例如，如果住在荷兰，就可以创建这样一个类::

    class NlValidation {
        public static function phone($check) {
            // ...
        }
        public static function postal($check) {
            // ...
        }
    }

这个文件可以放在 ``APP/Validation/`` 或者 ``App/PluginName/Validation/``，但必须
在使用之前用 App::uses() 导入。在模型验证中可以这样使用 NlValidation 类::

    public $validate = array(
        'phone_no' => array('rule' => array('phone', null, 'nl')),
        'postal_code' => array('rule' => array('postal', null, 'nl')),
    );

当模型数据被验证时，验证程序会知道它无法处理 ``nl`` 地区，就会尝试把任务
交给 ``NlValidation::postal()``，该方法的返回值就会被用作验证通过/失败的标志。这
个方法允许你创建一些类来处理一组或一个子集的地区，这是一个大的 switch 语句无法实
现的。单个验证方法的用法并没有改变，只是增加了跳转到其他验证的功能。

.. tip::

    Localized 插件已经包括许多可以使用的规则:
    https://github.com/cakephp/localized。另外，随意贡献你的本地化验证规则。

.. toctree::
    :maxdepth: 1

    data-validation/validating-data-from-the-controller


.. meta::
    :title lang=zh: Data Validation
    :keywords lang=zh: validation rules,validation data,validation errors,data validation,credit card numbers,core libraries,password email,model fields,login field,model definition,php class,many different aspects,eight characters,letters and numbers,business rules,validation process,date validation,error messages,array,formatting
