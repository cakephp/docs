モデルのないフォーム
####################

.. php:namespace:: Cake\Form

.. php:class:: Form

ほとんどの場合、:doc:`ORM エンティティー</orm/entities>` や :doc:`ORM テーブル </orm/table-objects>`
あるいはその他の永続的ストアが背後にあるフォームを持つでしょうが、
時にはユーザー入力を検証し、そのデータが有効であれば何らかのアクションを実行することが必要になるでしょう。
この最も一般的な例は問い合わせフォームです。

フォームの作成
==============

一般的に Form クラスを使う時はあなたのフォームを定義するためにサブクラスを使いたいでしょう。
これはテストを簡単にし、あなたのフォームを再利用できるようにします。
フォームは **src/Form** に置かれ、普通はクラスのサフィックスして ``Form`` を持ちます。
たとえば、単純な問い合わせフォームはこうなるでしょう。 ::

    // src/Form/ContactForm.php の中で
    namespace App\Form;

    use Cake\Form\Form;
    use Cake\Form\Schema;
    use Cake\Validation\Validator;

    class ContactForm extends Form
    {

        protected function _buildSchema(Schema $schema)
        {
            return $schema->addField('name', 'string')
                ->addField('email', ['type' => 'string'])
                ->addField('body', ['type' => 'text']);
        }

        protected function _buildValidator(Validator $validator)
        {
            return $validator->add('name', 'length', [
                    'rule' => ['minLength', 10],
                    'message' => '名前は必須です'
                ])->add('email', 'format', [
                    'rule' => 'email',
                    'message' => '有効なメールアドレスが要求されます',
                ]);
        }

        protected function _execute(array $data)
        {
            // メールを送信する
            return true;
        }
    }

上の例ではフォームが提供する３つのフックメソッドが見えるでしょう。

* ``_buildSchema`` は HTML フォームを作成するために FormHelper によって使用されるスキーマデータを定義するために使われます。フィールドの型、長さおよび精度を定義できます。
* ``_buildValidator`` バリデーターを加えることができる :php:class:`Cake\\Validation\\Validator` のインスタンスを受け取ります。
* ``_execute`` ``execute()`` が呼ばれ、データが有効な時にあなたが望むふるまいを定義します。

もちろん必要に応じて追加の公開メソッドを定義することもできます。

リクエストデータの処理
======================

フォームを定義したら、リクエストデータを処理し検証するためにコントローラー中でそれを使うことができます。 ::

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

上の例では、データが有効な時にのみフォームの ``_execute()`` を走らせるために ``execute()`` メソッドを実行し、それに応じたフラッシュメッセージを設定しています。
データ検証のみ行うために ``validate()`` を使うこともできます。 ::

    $isValid = $form->validate($this->request->getData());
    
フォーム値の設定
================

モデルのないフォームのフィールドに値を設定するために、
FormHelper によって作成される他のすべてのフォームのように
``$this->request->data()`` を使って値を定義することができます。 ::

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
                // たとえばユーザーモデルの値
                $this->request->data('name', 'John Doe');
                $this->request->data('email','john.doe@example.com');
            }
            
            $this->set('contact', $contact);
        }
    }
    
値はリクエストメソッドが GET の時にのみ定義されるべきで、
さもないと正しくないまたは保存されていない直前の POST データを上書きしてしまうでしょう。

フォームエラーの取得
====================

フォームが検証されたら、エラーを取得することができます。 ::

    $errors = $form->errors();
    /* $errors の中身
    [
        'email' => ['有効なメールアドレスが要求されます']
    ]
    */

コントローラーから各フォームフィールドを無効化
==============================================

Validator クラスを使用せずに、
コントローラーから各フォームフィールドを無効化
（訳注：無効化は invalidate の訳で、ここでは「間違っていることを示す」の意味です）
することができます。
この最も一般的な使用例はリモートサーバー上で検証が行われる時です。
そうした場合、あなたは手動でリモートサーバーからのフィードバックに応じて
そのフィールドを無効化しなければなりません。 ::

    // src/Form/ContactForm.php 中で
    public function setErrors($errors)
    {
        $this->_errors = $errors;
    }

バリデータークラスのエラーの返し方にならって、 ``$errors`` はこの形式でなければなりません。 ::

    ["フィールド名" => ["検証名" => "表示するエラーメッセージ"]]

さてフィールド名を設定することでフォームフィールドを無効化し、その時にメッセージを設定できるようになりました。 ::

    // コントローラーの中で
    $contact = new ContactForm();
    $contact->setErrors(["email" => ["_required" => "メールアドレスは必須です"]]);

結果を見るためには「FormHelper で HTML 作成」に進みます。

FormHelper で HTML 作成
=======================

Form クラスを作ったら、たぶん HTML フォームを作成したいでしょう。
FormHelper は Form オブジェクトを ORM エンティティーとちょうど同じように理解します。 ::

    echo $this->Form->create($contact);
    echo $this->Form->control('name');
    echo $this->Form->control('email');
    echo $this->Form->control('body');
    echo $this->Form->button('Submit');
    echo $this->Form->end();

上記は先に定義した ``ContactForm`` フォーム用の HTML フォームを作成するでしょう。
FormHelper で作成される HTML フォームはフィールド型、最大長、およびエラーを決定するために
定義されたスキーマとバリデーターを使用するでしょう。
