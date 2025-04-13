フォームの保護
##############

.. php:class:: FormProtection(ComponentCollection $collection, array $config = [])

フォーム保護コンポーネントは、フォームデータの改ざんから保護する仕組みを提供します。

すべてのコンポーネントと同様に、いくつかの設定可能なパラメータを使用して設定します。
これらのプロパティはすべて直接設定するか、コントローラーの ``initialize()`` メソッドや
``beforeFilter()`` メソッドの中にある同じ名前のセッターメソッドを使って設定することができます。

もし、``startup()`` コールバックでフォームデータを処理する他のコンポーネントを使用している場合は、
``initialize()`` メソッドの中で、必ず FormProtection Component を
それらのコンポーネントの前に置いてください。

.. note::

    FormProtectionコンポーネントを使用するときは、**必ず** FormHelperを使用して
    フォームを作成してください。また、フィールドの「名前」属性を上書き **してはいけません** 。
    FormProtection コンポーネントは、FormHelper によって作成・管理される特定の指標を探します。
    （特に :php:meth:`~Cake\\View\\Helper\\FormHelper::create()` と
    :php:meth:`~Cake\\View\\Helper\\FormHelper::end()` で作成されたもの）

    POST リクエストで送信される動的なフィールド変更
    (JavaScriptによる無効化、削除、新規フィールドの作成など)
    を使用すると、フォームトークンのバリデーションに失敗する可能性が高くなります。

フォームの改ざん防止
====================

デフォルトでは　``FormProtectionComponent`` はユーザが特定の方法で
フォームを改ざんすることを防ぎます。例えば、次のようなことを防ぐことができます。

* フォームのアクション(URL)は変更できません。
* 未知のフィールドをフォームに追加することはできません。
* フォームからフィールドを削除することはできません。
* 隠し入力の値を変更することはできません。

このようなタイプの改ざんを防ぐには ``FormHelper`` を使って
どのフィールドがフォームにあるかを追跡することで可能になります。
隠されたフィールドの値も追跡されます。これらのデータはすべて結合されてハッシュ化され、
隠されたトークンフィールドは自動的にフォームに挿入されます。
フォームが送信されると、``FormProtectionComponent`` は
POSTデータを使って同じ構造を作り、ハッシュを比較します。

.. note::

    FormProtectionComponent はセレクトボックスのオプションの追加や変更を防ぎ ***ません*** 。
    また、ラジオボタンのオプションの追加や変更も防ぎません。

使用方法
========

セキュリティコンポーネントの設定は通常コントローラーの
``initialize()`` または ``beforeFilter()`` コールバックで行われます。

利用可能なオプションは以下の通りです。 :

validate
    ``false`` に設定すると、POSTリクエストのバリデーションを完全にスキップし、
    本質的にフォームのバリデーションをオフにします。

unlockedFields
    POSTのバリデーションから除外するフォームフィールドのリストを設定します。
    フィールドのロックを解除するには、コンポーネントで行うか
    :php:meth:`FormHelper::unlockField()` を使用します。
    ロックが解除されたフィールドは POST の一部である必要はありませんし、
    ロックが解除されていない非表示のフィールドの値はチェックされません。

unlockedActions
    POSTのバリデーションチェックから除外するアクションを設定します。

validationFailureCallback
    バリデーションに失敗した場合に呼び出すコールバックを指定します。
    有効なClosureでなければなりません。
    デフォルトでは未設定で、検証に失敗した場合は例外がスローされます。

フォームの改ざんチェックを無効にする
====================================

::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();

            $this->loadComponent('FormProtection');
        }

        public function beforeFilter(EventInterface $event)
        {
            parent::beforeFilter($event);

            if ($this->request->getParam('prefix') === 'Admin') {
                $this->FormProtection->setConfig('validate', false);
            }
        }
    }

上記の例では、管理者用プレフィックス付きルートのフォーム改ざん防止機能を無効にしています。

特定のアクションのためにフォームの改ざんを無効にする
====================================================

アクションに対してフォームの改ざん防止を無効にしたい場合があるかもしれません。
(例えばAJAXリクエストの場合)
これらのアクションを ``beforeFilter()`` 内の ``$this->Security->unlockedActions``
にリストアップすることで「ロックを解除」することができます。 ::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('FormProtection');
        }

        public function beforeFilter(EventInterface $event)
        {
            parent::beforeFilter($event);

            $this->FormProtection->setConfig('unlockedActions', ['edit']);
        }
    }

この例では、編集アクションのすべてのセキュリティチェックを無効にします。

コールバックによる検証失敗の処理
================================

フォーム保護の検証に失敗した場合、デフォルトでは400エラーになります。
この動作は ``validationFailureCallback`` 設定オプションを
コントローラーのコールバック関数に設定することで設定できます。

コールバックメソッドを設定することで、失敗処理の動作をカスタマイズすることができます。 ::

    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);

        $this->FormProtection->setConfig(
            'validationFailureCallback',
            function (BadRequestException $exception) {
                // You can either return a response instance or throw the exception
                // received as argument.
            }
        );
    }

.. meta::
    :title lang=ja: フォームの保護
    :keywords lang=ja: 設定可能パラメーター,フォーム保護コンポーネント,設定パラメーター,不正なリクエスト,防御機能,堅牢なセキュリティ,穴あけ,php クラス,meth,404 エラー,有効期限切れ,csrf,配列,投稿,セキュリティクラス,セキュリティ無効化,unlockActions
