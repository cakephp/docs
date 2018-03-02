CMS 튜터리얼 - 인증
#########################

CMS는 사용자가 있으므로 로그인 할 수 있도록
기사 작성과 편집의 경험에 기본 액세스 제어를 적용해야합니다.

패스워드 해시 추가
--------------------------

만약에 사용자를 작성, 수정하고 있었다고하면 패스워드가 일반 텍스트로 저장되는 경우가 있습니다.
이것은 보안상에서 안좋은 예라고 할 수 있겠습니다.

그리고 CakePHP의 모델 계층에 대해 이야기 좋은시기입니다.
CakePHP는개체의 컬렉션에 대해 작업하는 방법과 단일 개체를 다른 클래스로 나뉘어져 있습니다.
엔티티의 컬렉션에 대해 작업하는 방법은 ``Table`` 클래스에 있고
한편, 단일 레코드에 포함 된 기능은 ``Entity`` 클래스에 있습니다.

예를 들어, 패스워드 해시는 개별 레코드에서 이루어지고 이 동작을 엔티티 객체에 구현합니다.
패스워드가 설정 될 때마다 암호를 해시 로 변경하기 위해 변경자 (mutator) / setter 메소드를 사용합니다.
CakePHP는 엔티티의 하나에 프로퍼티가 설정되어있을 때는 언제든지 약관에 따라 setter 메소드를 호출합니다.
패스워드 setter를 추가합니다. **src/Model/Entity/User.php**에 다음을 추가합니다. ::

    <?php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher; // 이 부분을 추가
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // bake 코드

        // 이 메소드를 추가
        protected function _setPassword($value)
        {
            if (strlen($value)) {
                $hasher = new DefaultPasswordHasher();

                return $hasher->hash($value);
            }
        }
    }

여기서 브라우저에서  **http://localhost:8765/users** 에 액세스하여 사용자의 목록 봅시다.
 :doc:`インストール <installation>`에 만들어진 기본 사용자를 편집 할 수 있습니다.
사용자의 패스워드를 변경하면 목록이나 뷰 페이지에서 원래 값 대신 해시 된 암호가 표시됩니다.
CakePHP는 기본적으로 `bcrypt <http://codahale.com/how-to-safely-store-a-password/>`_ 를 사용하여 암호를 해시합니다.
기존 데이터베이스를 사용하는 경우는 SHA-1 또는 MD5를 사용할 수 있지만 모든 새로운 응용 프로그램에 bcrypt을 권장합니다.

로그인 추가
==============

CakePHP에서의 인증은  :doc:`/controllers/components` 의해 처리됩니다.
구성 요소는 특정 기능이나 개념에 대한 컨트롤러 코드의 재사용 가능한 덩어리를 만드는 방법과 생각할 수 있습니다.
구성 요소는 컨트롤러의 이벤트 라이프 사이클에 연결하고 그 방법으로 응용 프로그램과 상호 작용할 수 있습니다.
첫째  :doc:`AuthComponent</controllers/components/authentication>`를 응용 프로그램에 추가합니다.
create, update 및 delete 메소드에서 인증이 필요하므로 AuthComponent을 AppController 에 추가합니다. ::

    // src/Controller/AppController.php
    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize()
        {
            // 기존 코드

            $this->loadComponent('Auth', [
                'authenticate' => [
                    'Form' => [
                        'fields' => [
                            'username' => 'email',
                            'password' => 'password'
                        ]
                    ]
                ],
                'loginAction' => [
                    'controller' => 'Users',
                    'action' => 'login'
                ],
                // 인증되지 않은 경우 이전 페이지로 돌아감
                'unauthorizedRedirect' => $this->referer()
            ]);

            // display 액션을 허용하고 PagesController가 계속작동하도록 함
            // 그리고 읽기 전용 액션을 사용함
            $this->Auth->allow(['display', 'view', 'index']);
        }
    }

CakePHP에 ``Auth`` 구성 요소를 로드하도록 지시했습니다.
users 테이블 사용자 이름으로``email``을 사용하기 때문에 AuthComponent 설정을 사용자 정의했습니다.
지금 ``/articles/add`` 같은 보호 된 URL에 가서 **/users/login**에 리디렉션됩니다.
이것은 아직 코드를 작성하지 않기 때문에 오류 페이지를 표시합니다. login 액션을 만들어 봅니다. ::

    // src/Controller/UsersController.php
    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error(‘유저 혹은 패스워드가 틀렸습니다. 다시 시도하십시오.');
        }
    }

그리고 **src/Template/Users/login.ctp** 에 다음을 추가합니다. ::

    <h1>로그인</h1>
    <?= $this->Form->create() ?>
    <?= $this->Form->control('email') ?>
    <?= $this->Form->control('password') ?>
    <?= $this->Form->button(‘로그인') ?>
    <?= $this->Form->end() ?>

간단한 로그인 폼이 완성되었으므로 해시 된 패스워드를 가진 사용자로 로그인 할 수 있습니다.

.. note::

만약 해시 된 암호를 가진 사용자가없는 경우  ``loadComponent('Auth')`` 블록과 ``$this->Auth->allow()`` 를 임시로 주석처리합니다.
그런 다음 사용자의 패스워드를 저장하고 편집합니다. 사용자의 새 패스워드를 저장 한 후 임시로 주석 행을 취소합니다.

그럼 시작해 보겠습니다. 로그인하기 전에``/articles/add``에 액세스합니다.
이 작업이 허용되지 않아 로그인 페이지로 리디렉션됩니다.
로그인에 성공하면 CakePHP는 자동으로``/articles/add``로 리디렉션합니다.

로그아웃 추가
================

사용자가 로그인 할 수있게 되었습니다. 이제 다음 단계인 로그아웃을 진행해보도록 하겠습니다.
그럼``UsersController``에 다음 코드를 추가합니다. ::

    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['logout']);
    }

    public function logout()
    {
        $this->Flash->success(‘로그아웃 했습니다.');
        return $this->redirect($this->Auth->logout());
    }

이 코드는 인증을 필요로하지 않는 작업 목록에``logout`` 액션을 추가하고 logout 메소드를 구현합니다.
로그 아웃을 위해``/users/logout``에 액세스 할 수 있습니다.
그때 로그인 페이지로 보내집니다.

사용자 등록 활성화
====================

로그인하지 않고 **/users/add**에 액세스하려고하면 로그인 페이지로 리디렉션됩니다.
다른 사용자들이 이 애플리케이션에 가입 할 수 있도록 수정해야합니다.
``UsersController```에 다음을 추가합니다. ::

    public function initialize()
    {
        parent::initialize();
        // 허가 작업목록에 ‘add’ 액션을 추가
        $this->Auth->allow(['logout', 'add']);
    }

위의 예는``AuthComponent``에 ``UsersController``의``add()``액션이 인증 및 승인을 필요로 “하지않음" 을 전하고 있습니다.
**Users/add.ctp**를 정리하고 잘못된 링크를 제거 할 시간이 걸리거나 다음 섹션으로 진행하고자합니다.
이 튜토리얼에서는 사용자의 편집,보기, 목록 작성하지 않기 때문에 그 부분은 별도로 진행해 주시기 바랍니다.

기사에 대한 액세스 제한
======================

사용자가 로그인 할 수있게 되었기 때문에, 작성한 기사 만 편집하도록 사용자를 제한하려고 합니다.
'authorization'어댑터를 사용하여 작업을 수행합니다.
요구 사항은 기본적인 것이므로,``ArticlesController``에 컨트롤러 연결 방법을 사용할 수 있습니다.
그러나 이렇게하기 전에 응용 프로그램이 작업을 허용하는 방법을
"AuthComponent"에 전하려고 합니다. ``AppController``을 업데이트하고 다음을 추가합니다. ::

    public function isAuthorized($user)
    {
        // 기본적으로 액세스 거부
        return false;
    }

다음은``AuthComponent``에 컨트롤러 후크 메소드를 사용하여 인증을 수행하도록 지시합니다.
``AppController::initialize()``메소드는 다음과 같습니다. ::

        public function initialize()
        {
            // 기존 코드

            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                // 이 부분을 추가
                'authorize'=> 'Controller',
                'authenticate' => [
                    'Form' => [
                        'fields' => [
                            'username' => 'email',
                            'password' => 'password'
                        ]
                    ]
                ],
                'loginAction' => [
                    'controller' => 'Users',
                    'action' => 'login'
                ],
                 // 인증되지 않은 경우 이전 페이지로 돌아감
                'unauthorizedRedirect' => $this->referer()
            ]);

            // display 액션을 허용하고 PagesController가 계속작동하도록 함
            // 그리고 읽기 전용 액션을 사용함
            $this->Auth->allow(['display', 'view', 'index']);
        }

기본적으로 액세스를 거부하고 의미있는 장소에서 단계적으로 액세스를 허용합니다.
먼저 기사의 허가 로직을 추가합니다. ``ArticlesController``에 다음을 추가합니다. ::

    public function isAuthorized($user)
    {
        $action = $this->request->getParam('action');
        // add 및 tags 작업은 항상 로그인 한 사용자에게 부여함
        if (in_array($action, ['add', 'tags'])) {
            return true;
        }

        // 다른 액션에 대해서는 분기 처리실행
        $slug = $this->request->getParam('pass.0');
        if (!$slug) {
            return false;
        }

        // 현재 사용자가 속해있는 문서인지 확인
        $article = $this->Articles->findBySlug($slug)->first();

        return $article->user_id === $user['id'];
    }

사용자가 속하지 않는 문서를 편집하거나 삭제하려고하면 원래 페이지로 리디렉션되는 것입니다.
오류 메시지가 표시되지 않는 경우 레이아웃에 다음을 추가니다. ::

    // src/Template/Layout/default.ctp
    <?= $this->Flash->render() ?>

그렇다면 **src/Controller/ArticlesController.php**의``initialize()``에 다음을 추가하여
인증되지 않은 사용자에게 허가 된 액션에``tags`` 액션을 추가합니다. ::

    $this->Auth->allow(['tags']);

위는 매우 간단하지만 유연한 인증 로직을 구축하기 위해 현재 사용자와
요청 데이터를 결합하여보다 복잡한 논리를 구축하는 방법을 보여줍니다.

add 와 edit 액션 수정
==============================

edit 액션에 대한 액세스를 차단하고 있지만 편집중인 문서 ``user_id`` 속성을 변경할 수 있습니다.
그렇다면 이러한 문제를 해결합니다. 처음에는``add`` 액션입니다.
기사를 작성할 때``user_id``을 현재 로그인 한 사용자에게 수정하려고 한다면
add 액션을 다음과 같이 대체합니다. ::

    // src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());

            // 변경:세션에서 user_id를 set
            $article->user_id = $this->Auth->user('id');

            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to add your article.'));
        }
        $this->set('article', $article);
    }

다음은 ``edit`` 액션을 업데이트합니다. edit 메소드를 다음과 같이 대체합니다. ::

    // src/Controller/ArticlesController.php

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // Tags와 연결
            ->firstOrFail();

        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData(), [
                // 등록:user_id 변경을 비활성화
                'accessibleFields' => ['user_id' => false]
            ]);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to update your article.'));
        }

        // Tags 리스트를 가져옴
        $tags = $this->Articles->Tags->find('list');

        // 뷰 컨텍스트에 기사와 Tags를 set
        $this->set('tags', $tags);
        $this->set('article', $article);
    }

여기에서는``patchEntity()```옵션을 사용하여 어떤 특성을 일괄 할당 할 수 있는지를 변경합니다.
자세한 정보는 :ref:`changing-accessible-fields` 섹션을 참조합니다.
**src/Templates/Articles/edit.ctp**에서 필요하지 않은``user_id`` 컨트롤을 삭제합니다.

마무리
===========

사용자가 로그인하거나 기사를 게시하거나 태그하거나 게시 된 기사를 태그로 검색하거나
기사에 대한 기본 액세스 제어를 적용 할 수있는 간단한 CMS는 응용 프로그램을 구축했습니다.
또한 FormHelper와 ORM 기능을 활용하여 UX의 일부 개선 사항을 추가했습니다.
CakePHP의 탐구에 시간 내 주셔서 감사합니다.
다음은 :doc:`/orm` 대해 더 배우고 :doc:`/topics`을 알아 보시길 바랍니다.