블로그 - 인증 및 권한 부여 프로그램
######################################

:doc:`/tutorials-and-examples/blog/blog`  예제에 따라 로그인 한 사용자를 특정 URL에 액세스 권한을 부여 한다고 가정 해보겠습니다.
또한 블로그에는 자신의 기사를 작성, 편집 및 삭제할 수있는 여러 명의 사용자가 있으며
다른 사용자가 자신이 소유하지 않은 기사를 변경할 수 없도록 해야합니다.

사용자 관련 코드 만들기
==================================

먼저 블로그 데이터베이스에 사용자의 데이터를 보관할 새 테이블을 만듭니다.  ::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

테이블의 이름은 CakePHP의 규칙이 있지만 다른 규칙도 활용할 수 있습니다.
username 및 password 컬럼을 사용자 테이블에 사용하면
CakePHP는 사용자 로그인 구현의 경우 대부분의 수를 자동으로 정의합니다.

다음 단계는 사용자 데이터를 찾고 저장하고 유효성을 검사하는 UsersTable 클래스를 만드는 것입니다. ::

    // src/Model/Table/UsersTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            return $validator
                ->notEmpty('username', 'A username is required')
                ->notEmpty('password', 'A password is required')
                ->notEmpty('role', 'A role is required')
                ->add('role', 'inList', [
                    'rule' => ['inList', ['admin', 'author']],
                    'message' => 'Please enter a valid role'
                ]);
        }

    }

그럼 UsersController도 작성해 보겠습니다.
다음의 내용은 기본적으로 bake 된 UsersController의 일부에 해당하는 것으로
CakePHP에 있는 코드 생성 유틸리티를 이용하고 있습니다. ::

    // src/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class UsersController extends AppController
    {

        public function beforeFilter(Event $event)
        {
            parent::beforeFilter($event);
            $this->Auth->allow('add');
        }

         public function index()
         {
            $this->set('users', $this->Users->find('all'));
        }

        public function view($id)
        {
            $user = $this->Users->get($id);
            $this->set(compact('user'));
        }

        public function add()
        {
            $user = $this->Users->newEntity();
            if ($this->request->is('post')) {
                // 3.4.0 전에는 $this->request->data() 을 사용했음
                $user = $this->Users->patchEntity($user, $this->request->getData());
                if ($this->Users->save($user)) {
                    $this->Flash->success(__('The user has been saved.'));
                    return $this->redirect(['action' => 'add']);
                }
                $this->Flash->error(__('Unable to add the user.'));
            }
            $this->set('user', $user);
        }

    }

마찬가지로 코드 생성 도구로 기사 뷰를 만들고 사용자보기를 구현할 수 있습니다.
이 튜토리얼을 위해, add.ctp을 보겠습니다.

.. code-block:: php

    <!-- src/Template/Users/add.ctp -->

    <div class="users form">
    <?= $this->Form->create($user) ?>
        <fieldset>
            <legend><?= __('Add User') ?></legend>
            <?= $this->Form->control('username') ?>
            <?= $this->Form->control('password') ?>
            <?= $this->Form->control('role', [
                'options' => ['admin' => 'Admin', 'author' => 'Author']
            ]) ?>
       </fieldset>
    <?= $this->Form->button(__('Submit')); ?>
    <?= $this->Form->end() ?>
    </div>

인증(로그인, 로그아웃)
==========================

이제 인증 레이어를 추가 할 준비가되었습니다.
CakePHP에서 이것은 :php:class:`Cake\\Controller\\Component\\AuthComponent` 에 의해 처리됩니다.
이 클래스는 특정 작업에 대한 로그인 요구, 사용자 로그인 및 로그 아웃 처리, 로그인 한 사용자가 할 수있는 동작 권한 부여를 담당합니다.

이 컴포넌트를 응용 프로그램에 추가하려면 **src/Controller/AppController.php**
파일을 열고 다음을 추가하시기 바랍니다.

    // src/Controller/AppController.php

    namespace App\Controller;

    use Cake\Controller\Controller;
    use Cake\Event\Event;

    class AppController extends Controller
    {
        //...

        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'loginRedirect' => [
                    'controller' => 'Articles',
                    'action' => 'index'
                ],
                'logoutRedirect' => [
                    'controller' => 'Pages',
                    'action' => 'display',
                    'home'
                ]
            ]);
        }

        public function beforeFilter(Event $event)
        {
            $this->Auth->allow(['index', 'view', 'display']);
        }
        //...
    }

사용자 테이블에 대한 규칙을 사용 했으므로 구성 할 부분은 많지 않습니다.
로그인 및 로그 아웃 작업이 수행 된 후 로드 될 URL을 설정합니다.
여기서는 ``/articles/`` 및 ``/`` 로 각각 설정됩니다.

``beforeFitler()`` 함수에서 한 것은 AuthComponent가 모든 컨트롤러에서
모든 ``index()`` 및 ``view()`` 액션에 대한 로그인을 요구하지 않도록 하는것입니다.

이제 새로운 사용자를 등록하고 사용자 이름과 암호를 저장할 수 있어야하며 더 중요한 것은 암호를 해시로 변환해서
데이터베이스에 저장해야 합니다.
인증되지 않은 사용자가 사용자 추가 기능에 액세스하고 로그인 및 로그 아웃 작업을 구현할 수 있도록 AuthComponent에 작성합니다. ::

    // src/Controller/UsersController.php
    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class UsersController extends AppController
    {
        public function beforeFilter(Event $event)
        {
            parent::beforeFilter($event);
            // 사용자 등록과 로그아웃을 허가
            // allow에 “login” 액션을 추가하면 안됨
            // 안그러면 AuthComponent기능에 문제발생
            $this->Auth->allow(['add', 'logout']);
        }

        public function login()
        {
            if ($this->request->is('post')) {
                $user = $this->Auth->identify();
                if ($user) {
                    $this->Auth->setUser($user);
                    return $this->redirect($this->Auth->redirectUrl());
                }
                $this->Flash->error(__('Invalid username or password, try again'));
            }
        }

        public function logout()
        {
            return $this->redirect($this->Auth->logout());
        }
    }

암호 해싱이 아직 완료되지 않았으므로, 사용자 고유의 특정 논리를 처리하기 위해 사용자에 대한 Entity 클래스가 필요합니다.
**src/Model/Entity/User.php** 엔티티 파일을 만들고 다음을 추가합니다. ::

    // src/Model/Entity/User.php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // 주 키인 “id”를 제외하고 모든 필드를 허가
        protected $_accessible = [
            '*' => true,
            'id' => false
        ];

        // ...

        protected function _setPassword($password)
        {
            if (strlen($password) > 0) {
                return (new DefaultPasswordHasher)->hash($password);
            }
        }

        // ...
    }

이제 암호 속성이 사용자에게 할당 될 때마다 ``DefaultPasswordHasher`` 클래스를 사용하여 해시됩니다.
로그인 템플릿 파일이 완성되지않았습니다.
**src/Template/Users/login.ctp** 파일을 열고 다음 행을 추가하시기 바랍니다.

.. code-block:: php

    <!-- File: src/Template/Users/login.ctp -->

    <div class="users form">
    <?= $this->Flash->render() ?>
    <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Please enter your username and password') ?></legend>
            <?= $this->Form->control('username') ?>
            <?= $this->Form->control('password') ?>
        </fieldset>
    <?= $this->Form->button(__('Login')); ?>
    <?= $this->Form->end() ?>
    </div>

이제 ``/users/add`` URL에 액세스하여 새 사용자를 등록하고 ``/users/login`` URL로 이동하여 새로 만든 인증으로 로그인 할 수 있습니다.
또한 ``/articles/add`` 와 같이 명시 적으로 허용되지 않은 다른 URL에 액세스하려고하면 응용 프로그램이 자동으로 로그인 페이지로 리디렉션되는 것을 볼 수 있습니다.

보기에는 간단해 보입니다. 무엇을 작성했는지 설명하기 위해 설명을 조금 돌아가겠습니다.
AppController의 ``beforeFilter()`` 는 이미 ``index()``. 와  ``view()`` 액션을 추가하고
``add()`` 액션는 로그인 없이도 액세스 할 수있도록 AuthComponent의 ``beforeFilter()`` 에 작성합니다.

``login()`` 액션은 AuthComponent에서 ``$this->Auth->identify()`` 함수를 호출합니다.
이전에 언급 한 규칙을 따르고 있기 때문에 더 이상 설정하지 않아도 작동합니다.
즉, 사용자 이름과 암호 열이있는 Users 테이블을 가지며 사용자 데이터가있는 컨트롤러에 게시 된 양식을 사용합니다.
이 함수는 로그인 성공 여부를 반환하고 성공한 경우 사용자에게 AuthComponent를 응용 프로그램에 추가 할 때 사용한 구성된 리디렉션 URL로 사용자를 리디렉션합니다.

로그 아웃은 ``/users/logout`` URL에 액세스하여 작동하며 이전에 작성한 logout Url로 사용자를 리디렉션합니다.
이 URL은 성공시 ``AuthComponent::logout()`` 함수의 결과입니다.

승인 (누가 무엇에 액세스 할 수 있는지)
========================================

기사는 여러 사용자 작성이 가능하기 때문에 기사 테이블을 수정해서
사용자 테이블에 참조 키를 추가해야합니다. ::

    ALTER TABLE articles ADD COLUMN user_id INT(11);

또한, 현재 로그인 한 사용자가 생성 된 기사를 참조로 저장하려면 ArticlesController에서 약간의 수정이 필요합니다. ::

    // src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            // 3.4.0 전에는 $this->request->data() 를 사용함
            $article = $this->Articles->patchEntity($article, $this->request->getData());
            // 이 행을 추가
            $article->user_id = $this->Auth->user('id');
            // 그러면 다음과같은 것도 가능함
            //$newData = ['user_id' => $this->Auth->user('id')];
            //$article = $this->Articles->patchEntity($article, $newData);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to add your article.'));
        }
        $this->set('article', $article);

        // 기사의 카테고리를 선택할 수 있도록 카테로리 리스트를 추가
        $categories = $this->Articles->Categories->find('treeList');
        $this->set(compact('categories'));
    }

컴포넌트에서 제공하는 ``user()`` 함수는 현재 로그인 한 사용자의 모든 열을 반환합니다.
이 메소드를 사용하여 저장된 요청 정보에 데이터를 추가했습니다.

일부 작성자가 다른 사용자의 기사를 수정하거나 삭제하지 못하도록 앱을 보호합시다.
앱의 기본 규칙은 관리 사용자가 모든 URL에 액세스 할 수있는 반면 일반 사용자 (작성자 역할)는 허용 된 작업에만 액세스 할 수 있다는 것입니다.
다시, AppController 클래스를 열고 Auth config에 몇 가지 옵션을 추가합니다.  ::

    // src/Controller/AppController.php

    public function initialize()
    {
        $this->loadComponent('Flash');
        $this->loadComponent('Auth', [
            'authorize' => ['Controller'], // 이 행을 추가
            'loginRedirect' => [
                'controller' => 'Articles',
                'action' => 'index'
            ],
            'logoutRedirect' => [
                'controller' => 'Pages',
                'action' => 'display',
                'home'
            ]
        ]);
    }

    public function isAuthorized($user)
    {
        // 관리자는 모든액세스가능
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // 디폴트 거부
        return false;
    }

방금 간단한 인증 메커니즘을 만들었습니다. 관리 역할을 가진 사용자는 로그인 할 때 사이트의 모든 URL에 액세스 할 수 있습니다.
다른 모든 사용자 (작성자 역할을 가진 사용자)는 로그인하지 않은 사용자와 동일한 액세스 권한을가집니다.

이것은 정확히 우리가 원하는 것이 아닙니다. ``isAuthorized()`` 메소드에 더 많은 규칙을 제공해야 합니다.
그러나 AppController에 이를 수행하는 대신, 추가 규칙을 각각의 개별 컨트롤러에 제공해야 합니다.
ArticlesController에 추가 할 규칙은 작성자가 기사를 만들 수 있지만 사용자가 소유하지 않은 기사를 편집하지 못하게 해야합니다.
ArticlesController.php에 다음 내용을 추가합니다. ::

    // src/Controller/ArticlesController.php

    public function isAuthorized($user)
    {
        // 모든 사용자는 등록가능
        // 3.4.0 전에는 $this->request->param('action’) 을 사용
        if ($this->request->getParam('action') === 'add') {
            return true;
        }

        // 사용자가 등록한 기사만 편집, 삭제
        // 3.4.0 전에는 $this->request->param('action') 을 사용
        if (in_array($this->request->getParam('action'), ['edit', 'delete'])) {
            // 3.4.0 전에는 $this->request->params('pass.0’) 을 사용
            $articleId = (int)$this->request->getParam('pass.0');
            if ($this->Articles->isOwnedBy($articleId, $user['id'])) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

이제 AppController의 ``isAuthorized()`` 호출을 재정의하고 부모 클래스가 이미 사용자를 인증하고 있는지 내부적으로 검사합니다.
사용자가 아니라면 추가 작업에 액세스 할 수있게하고 조건부로 편집 및 삭제에 액세스합니다. 마지막으로 한 가지는 구현하지 않았습니다.
사용자가 기사를 편집 할 권한이 있는지 여부를 알기 위해 기사 테이블에서 ``isOwnedBy()`` 함수를 호출합니다.
그 함수를 구현해 보겠습니다. ::

    // src/Model/Table/ArticlesTable.php

    public function isOwnedBy($articleId, $userId)
    {
        return $this->exists(['id' => $articleId, 'user_id' => $userId]);
    }

이것으로 간단한 인증 및 인증 작성을 마칩니다. UsersController를 보호하기 위해 ArticlesController에서했던 것과 같은 기술일 수 있습니다.
또한 자신의 규칙에 따라 AppController에서보다 창의적이고 코드가 좀 더 일반적인 코드 일 수 있습니다.

더 많은 제어가 필요하면 인증 섹션에서 전체 :doc:`/controllers/components/authentication` 가이드를 읽고 컴포넌트 구성, 맞춤 인증 클래스 생성 등에 대해 자세히 알아 보시기 바랍니다.

더 자세히 알 고싶은 분들을 위핸 자료
------------------------------------

#. :doc:`/bake/usage` 기본적인 CRUD와 코드 작성에 대해서
#. :doc:`/controllers/components/authentication`: 사용자 등록 로그인에 대해서

.. meta::
    :title lang=kr: Simple Authentication and Authorization Application
    :keywords lang=kr: auto increment,authorization application,model user,array,conventions,authentication,urls,cakephp,delete,doc,columns
