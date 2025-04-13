モデルのないフォーム
####################

.. php:namespace:: Cake\Form

.. php:class:: Form

ほとんどの場合、フォームの背後には :doc:`ORM エンティティー</orm/entities>` や
:doc:`ORM テーブル </orm/table-objects>` あるいはその他の永続的ストアーがありますが、
時にはユーザー入力を検証し、そのデータが有効であれば何らかのアクションを実行する、
という場合もあります。この最も一般的な例は問い合わせフォームです。

フォームの作成
==============

一般的に Form クラスを使う時は、フォームを定義するためにサブクラスを使います。
これはテストを簡単にし、フォームを再利用できるようにします。
フォームは **src/Form** に置かれ、普通はクラスのサフィックスして ``Form`` を持ちます。
たとえば、単純な問い合わせフォームは次のようになります。 ::

    // src/Form/ContactForm.php の中で
    namespace App\Form;

    use Cake\Form\Form;
    use Cake\Form\Schema;
    use Cake\Validation\Validator;

    class ContactForm extends Form
    {
        protected function _buildSchema(Schema $schema): Schema
        {
            return $schema->addField('name', 'string')
                ->addField('email', ['type' => 'string'])
                ->addField('body', ['type' => 'text']);
        }

        public function validationDefault(Validator $validator): Validator
        {
            $validator->minLength('name', 10)
                ->email('email');

            return $validator;
        }

        protected function _execute(array $data): bool
        {
            // メールを送信する
            return true;
        }
    }

上の例ではフォームが提供する３つのフックメソッドが見えます。

* ``_buildSchema`` は FormHelper が HTML フォームを作成する際に使用する
  スキーマデータを定義するために使います。フィールドの型、長さ、および精度を定義できます。
* ``validationDefault`` はバリデーターを加えることができる
  :php:class:`Cake\\Validation\\Validator` のインスタンスを受け取ります。
* ``_execute`` では ``execute()`` が呼ばれ、データが有効な時に望むふるまいを定義します。

もちろん必要に応じて追加の公開メソッドを定義することもできます。

リクエストデータの処理
======================

フォームを定義したら、リクエストデータを処理し検証するために
コントローラー中でそれを使うことができます。 ::

    // 何らかのコントローラー中で
    namespace App\Controller;

    use App\Controller\AppController;
    use App\Form\ContactForm;

    class ContactController extends AppController
    {
        public function index()
        {
            $contact = new ContactForm();
            if ($this->request->is('post')) {
                if ($contact->execute($this->request->getData())) {
                    $this->Flash->success('すぐにご連絡いたします。');
                } else {
                    $this->Flash->error('フォーム送信に問題がありました。');
                }
            }
            $this->set('contact', $contact);
        }
    }

上の例では、データが有効な時にのみフォームの ``_execute()`` を走らせるために ``execute()``
メソッドを実行し、それに応じたフラッシュメッセージを設定しています。
データ検証のみ行うために ``validate()`` を
使うこともできます。 ::

    if ($contact->execute($this->request->getData(), 'update')) {
        // Handle form success.
    }

This option can also be set to ``false`` to disable validation.

We could have also used the ``validate()`` method to only validate
the request data::

    $isValid = $form->validate($this->request->getData());

    // You can also use other validation sets. The following
    // would use the rules defined by `validationUpdate()`
    $isValid = $form->validate($this->request->getData(), 'update');

フォーム値の設定
================

モデルのないフォームのフィールドにデフォルト値を設定するために、 ``setData()`` メソッドが使用できます。
このメソッドで設定された値はフォームオブジェクトの既存のデータを上書きします。 ::

    // 何らかのコントローラー中で
    namespace App\Controller;

    use App\Controller\AppController;
    use App\Form\ContactForm;

    class ContactController extends AppController
    {
        public function index()
        {
            $contact = new ContactForm();
            if ($this->request->is('post')) {
                if ($contact->execute($this->request->getData())) {
                    $this->Flash->success('すぐにご連絡いたします。');
                } else {
                    $this->Flash->error('フォーム送信に問題がありました。');
                }
            }

            if ($this->request->is('get')) {
                $contact->setData([
                    'name' => 'John Doe',
                    'email' => 'john.doe@example.com'
                ]);
            }

            $this->set('contact', $contact);
        }
    }

値はリクエストメソッドが GET の時にのみ定義する必要があります。そうしないと、修正が必要なバリデーションエラーの直前の POST データを上書きしてしまいます。
また、 ``set()`` を使用して、個々のフィールドまたはフィールドのサブセットを追加または置換することができます。::

    // 一つのフィールドをセット
    $contact->set('name', 'John Doe');

    // 複数のフィールドをセット;
    $contact->set([
        'name' => 'John Doe',
        'email' => 'john.doe@example.com',
    ]);

フォームエラーの取得
====================

フォームが検証されたら、エラーを取得することができます。 ::

    $errors = $form->getErrors(); // $form->errors(); // 3.7.0 より前
    /* $errors の中身
    [
        'email' => ['有効なメールアドレスが要求されます']
    ]
    */

コントローラーから各フォームフィールドを無効化
==============================================

Validator クラスを使用せずに、コントローラーから各フォームフィールドを無効化
（訳注：無効化は invalidate の訳で、ここでは「誤っていることを示す」の意味です）
することができます。この最も一般的な使用例はリモートサーバー上で検証が行われる時です。
そうした場合、手動でリモートサーバーからのフィードバックに応じて
そのフィールドを無効化しなければなりません。 ::

    // src/Form/ContactForm.php 中で
    public function setErrors($errors)
    {
        $this->_errors = $errors;
    }

バリデータークラスのエラーの返し方にならって、 ``$errors`` はこの形式でなければなりません。 ::

    ["フィールド名" => ["検証名" => "表示するエラーメッセージ"]]

さて、フィールド名を設定することでフォームフィールドを無効化し、
その時にメッセージを設定できるようになりました。 ::

    // コントローラーの中で
    $contact = new ContactForm();
    $contact->setErrors(["email" => ["_required" => "メールアドレスは必須です"]]);

結果を見るためには「FormHelper で HTML 作成」に進みます。

FormHelper で HTML 作成
=======================

Form クラスを作ったら、その HTML フォームを作成したいはずです。
FormHelper は Form オブジェクトを ORM エンティティーとちょうど同じように理解します。 ::

    echo $this->Form->create($contact);
    echo $this->Form->control('name');
    echo $this->Form->control('email');
    echo $this->Form->control('body');
    echo $this->Form->button('Submit');
    echo $this->Form->end();

上記は先に定義した ``ContactForm`` フォーム用の HTML フォームを作成します。
FormHelper で作成される HTML フォームはフィールド型、最大長、およびエラーを決定するために
定義されたスキーマとバリデーターを使用します。
