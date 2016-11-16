モデルのないフォーム
####################

.. php:namespace:: Cake\Form

.. php:class:: Form

ほとんどの場合、:doc:`ORMエンティティ</orm/entities>` や :doc:`ORMテーブル </orm/table-objects>`
あるいはその他の永続的ストアが背後にあるフォームを持つでしょうが、
時にはユーザー入力を検証し、そのデータが有効であれば何らかのアクションを実行することが必要になるでしょう。
この最も一般的な例は問い合わせフォームです。

フォームの作成
==============

一般的にFormクラスを使う時はあなたのフォームを定義するためにサブクラスを使いたいでしょう。
これはテストを簡単にし、あなたのフォームを再利用できるようにします。
フォームは **src/Form** に置かれ、普通はクラスのサフィックスして ``Form`` を持ちます。
たとえば、単純な問い合わせフォームはこうなるでしょう::

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

* ``_buildSchema`` はHTMLフォームを作成するためにFormHelperによって使用されるスキーマデータを定義するために使われます。フィールドの型、長さおよび精度を定義でます。
* ``_buildValidator`` バリデータを加えることができる :php:class:`Cake\\Validation\\Validator` のインスタンスを受け取ります。
* ``_execute`` ``execute()`` が呼ばれ、データ有効な時にあなたが望むふるまいを定義します。

もちろん必要に応じて追加の公開メソッドを定義することもできます。

リクエストデータの処理
======================

フォームを定義したら、リクエストデータを処理し検証するためにコントローラ中でそれを使うことができます::

    // 何らかのコントローラ中で
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
データ検証のみ行うために ``validate()`` を使うこともできます::

    $isValid = $form->validate($this->request->getData());
    
フォーム値の設定
================

モデルのないフォームのフィールドに値を設定するために、
FormHelperによって作成される他のすべてのフォームのように
``$this->request->data()`` を使って値を定義することができます::

    // 何らかのコントローラ中で
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
    
値はリクエストメソッドがGETの時にのみ定義されるべきで、
さもないと正しくないまたは保存されていない直前のPOSTデータを上書きしてしまうでしょう。

フォームエラーの取得
====================

フォームが検証されたら、エラーを取得することができます::

    $errors = $form->errors();
    /* $errors の中身
    [
        'email' => ['有効なメールアドレスが要求されます']
    ]
    */

コントローラから各フォームフィールドを無効化
============================================

Validatorクラスの使用なしに、
コントローラからフォームの各フォームフィールドを無効化
（訳注：無効化は invalidate の訳で、ここでは「間違っていることを示す」の意味です）
することができます。
この最も一般的な使用例はリモートサーバー上で検証が行われる時です。
そうした場合、あなたは手動でリモートサーバーからのフィードバックに応じて
そのフィールドを無効化しなければなりません::

    // src/Form/ContactForm.php 中で
    public function setErrors($errors)
    {
        $this->_errors = $errors;
    }

バリデータクラスのエラーの返し方にならって、 ``$errors`` はこの形式でなければなりません::

    ["フィールド名" => ["検証名" => "表示するエラーメッセージ"]]

さてフィールド名を設定することでフォームフィールドを無効化し、その時にメッセージを設定できるようになりました::

    // コントローラの中で
    $contact = new ContactForm();
    $contact->setErrors(["email" => ["_required" => "メールアドレスは必須です"]]);

結果を見るためには「FormHelperでHTML作成」に進みます。

FormHelperでHTML作成
====================

Formクラスを作ったら、たぶんHTMLフォームを作成したいでしょう。
FormHelperはFormオブジェクトをORMエンティティとちょうど同じように理解します::

    echo $this->Form->create($contact);
    echo $this->Form->input('name');
    echo $this->Form->input('email');
    echo $this->Form->input('body');
    echo $this->Form->button('Submit');
    echo $this->Form->end();

上記は先に定義した ``ContactForm`` フォーム用のHTMLフォームを作成するでしょう。
FormHelperで作成されるHTMLフォームはフィールド型、最大長、およびエラーを決定するために
定義されたスキーマとバリデータを使用するでしょう。
