북마크 튜토리얼 파트 2
##################################

:doc:`튜토리얼 전편 </tutorials-and-examples/bookmarks/intro>` 을 끝내면,
아주 기본적인 북마크 응용 프로그램이 만들어집니다. 이번에는 인증 기능과
각 사용자가 자신의 북마크 보기 / 수정 할 수 있도록 제한하는 기능을 추가해 보겠습니다.

로그인 추가
==============

CakePHP에서 인증은 :doc:`/controllers/components` 로 제어합니다.
구성 요소는 재사용 가능한 특정 기능이나 개념을 만들기위한 방법이라고 생각할 수 있습니다.
구성 요소 또한 컨트롤러의 이벤트의 라이프 사이클을 연결하여 응용 프로그램에
작용 할 수 있습니다. 처음에는  :doc:`AuthComponent
</controllers/components/authentication>`를 응용 프로그램에 추가합시다.
모든 메소드에 인증을 요구하는 것을 추천합니다.
그럼 AuthComponent을 AppController에 추가합니다. ::

    // src/Controller/AppController.php
    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize()
        {
            $this->loadComponent('Flash');
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
                'unauthorizedRedirect' => $this->referer() // 인증되지 않았을 경우 원래페이지로 리디렉션
            ]);

            // PagesController 가 동작할 수 있도록
            // display 액션을 허가
            $this->Auth->allow(['display']);
        }
    }


이제 CakePHP에 ``Flash`` 와 ``Auth`` 의 구성 요소를 로드하라고 했습니다.
또한 users 테이블 ``email`` 을 사용자 이름으로 사용하도록 AuthComponent 에 설정했습니다.
Controller에 존재하지 않거나 Login전에 URL에 액세스하면 **/users/login**로 전환합니다.
그 다음은 로그인 액션을 만들어 보겠습니다. ::

    // src/Controller/UsersController.php
    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error('아이디 또는 비밀번호가 틀렸습니다.');
        }
    }

그리고 **src/Template/Users/login.ctp** 는 아래와 같습니다. ::

    <h1>Login</h1>
    <?= $this->Form->create() ?>
    <?= $this->Form->control('email') ?>
    <?= $this->Form->control('password') ?>
    <?= $this->Form->button('Login') ?>
    <?= $this->Form->end() ?>

.. note::

   ``control()`` 는 3.4 이상에서 사용 가능합니다. 그 이전 버전에서는 대신
   ``input()`` 를 사용하시기 바랍니다.

이제 간단한 로그인 템플릿을 작성했습니다.
해시 된 암호를 가진 사용자로 로그인 할 수 있습니다.

.. note::

    만약 해시 된 암호를 가진 사용자가 없으면 ``loadComponent('Auth')``
    행을 주석 처리하고 사용자를 수정하여 새 암호를 저장하시기 바랍니다.

로그아웃 추가
================

이제 로그인 할 수 있으므로 로그 아웃하는 방법도 작성해보겠습니다.
 ``UsersController`` 에 다음 코드를 추가합니다. ::

    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['logout']);
    }

    public function logout()
    {
        $this->Flash->success('로그아웃 하셨습니다.');
        return $this->redirect($this->Auth->logout());
    }

이 코드는 로그 아웃 작업을 공용 작업으로 허용하고 ``logout`` 메서드를 구현합니다.
이제 ``/users/logout`` 을 액세스해서 로그 아웃 할 수 있습니다.
그런 다음 로그인 페이지로 보내야합니다.

신규 등록 활성화
====================

로그인하지 않은 상태에서 **/users/add** 에 액세스하면 로그인 페이지로 전환합니다.
사람들이 응용 프로그램에 가입 할 수 있도록 수정해보겠습니다.
``UsersController`` 를 추가합니다. ::

    public function initialize()
    {
        parent::initialize();
        // 허가하는 액션 목록을 add에 추가
        $this->Auth->allow(['logout', 'add']);
    }

위의 코드는 ``AuthComponent`` 에게 ``add()`` 액션의 인증이나 권한 부여가 필요 없다는 것을 알려줍니다.
 **Users/add.ctp** 를 정리하고 오해의 소지가있는 링크를 삭제하거나 다음 섹션으로 계속 진행할 수 있습니다.
이 튜토리얼에서는 사용자 수정, 보기를 작성하지 않았기 때문에
``AuthComponent`` 가 해당 컨트롤러 작업에 대한 액세스를 거부하므로 작동하지 않습니다.

북마크 액세스 제한
==================================

이제 사용자가 로그인 할 수 있으므로 볼 수있는 북마크를 자신이 만든 북마크로 제한하려고합니다.
'authorization'어댑터를 사용하여이 작업을 수행합니다.
요구 사항은 매우 간단하기 때문에 ``BookmarksController`` 에 간단한 코드를 작성할 수있습니다.
하지만 작성하기 전에 AuthComponent에 애플리케이션이 동작을 인증하는 방법을 알려줘야합니다.
``AppController`` 에서 다음을 추가합니다. ::

    public function isAuthorized($user)
    {
        return false;
    }

혹은、 ``AppController`` 에서 ``Auth`` 설정을 아래와 같이 작성합니다. ::

    'authorize' => 'Controller',

``initialize()`` 메소드는 다음과 같습니다. ::

        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'authorize'=> 'Controller',//이행을 추가
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
                'unauthorizedRedirect' => $this->referer()
            ]);

            // PagesController 가 동작할 수 있도록
            // display 액션을 허가
            $this->Auth->allow(['display']);
        }

기본적으로 액세스 거부를 설정하고 점진적으로 액세스 권한을 부여합니다.
먼저 북마크에 대한 승인 로직을 추가합니다.
``BookmarksController`` 에 다음을 추가합니다. ::

    public function isAuthorized($user)
    {
        $action = $this->request->getParam('action');

        // add 와 index 액션은 항상 허가
        if (in_array($action, ['index', 'add', 'tags'])) {
            return true;
        }
        // 다른 모든액션은 id를 요청함
        if (!$this->request->getParam('pass.0')) {
            return false;
        }

        // 북마크에 사용자가 존재하는지 확인
        $id = $this->request->getParam('pass.0');
        $bookmark = $this->Bookmarks->get($id);
        if ($bookmark->user_id == $user['id']) {
            return true;
        }
        return parent::isAuthorized($user);
    }

이제 사용자가 소유하지 않은 북마크를 보거나 수정하거나 삭제하려고하면 사용자가 방문한 페이지로 리디렉션되어야 합니다.
오류 메시지가 표시되지 않으면 레이아웃에 다음을 추가합니다.

    // src/Template/Layout/default.ctp
    <?= $this->Flash->render() ?>

이제 권한 오류 메시지가 표시될 것입니다.

목록보기 및 템플릿 수정
============================

보기 및 삭제가 작동하는 동안 수정, 추가 및 색인에는 몇 가지 문제가 있습니다.

#. 북마크를 추가 할 때 사용자를 선택할 수 있습니다.
#. 북마크를 수정 할 때 사용자를 선택할 수 있습니다.
#. 목록 페이지에는 다른 사용자의 책갈피가 표시됩니다.

먼저 템플릿을 추가합니다.  **src/Template/Bookmarks/add.ctp** 에서 ``control('user_id')`` 을 제거합니다.
제거한 후 **src/Controller/BookmarksController.php** 에서 ``add()`` 액션을 다음과 같이 수정합니다. ::

    public function add()
    {
        $bookmark = $this->Bookmarks->newEntity();
        if ($this->request->is('post')) {
            $bookmark = $this->Bookmarks->patchEntity($bookmark, $this->request->getData());
            $bookmark->user_id = $this->Auth->user('id');
            if ($this->Bookmarks->save($bookmark)) {
                $this->Flash->success('북마크를 저장했습니다.');
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error('북바크 저장에 실패헸습니다. 한번 더 확인 부탁드리겠습니다.');
        }
        $tags = $this->Bookmarks->Tags->find('list');
        $this->set(compact('bookmark', 'tags'));
        $this->set('_serialize', ['bookmark']);
    }

엔티티 프로퍼티를 세션 데이터로 설정함으로써, 본인이 등록한 북마크만 수정 할 수있도록 합니다.
수정 양식과 행동에 대해서도 똑같이 할 것입니다.
**src/Controller/BookmarksController.php** 에서 ``edit()`` 액션은 다음과 같아야합니다. ::

    public function edit($id = null)
    {
        $bookmark = $this->Bookmarks->get($id, [
            'contain' => ['Tags']
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $bookmark = $this->Bookmarks->patchEntity($bookmark, $this->request->getData());
            $bookmark->user_id = $this->Auth->user('id');
            if ($this->Bookmarks->save($bookmark)) {
                $this->Flash->success(‘북마크를 저장했습니다.');
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(‘북마크 저장에 실패했습니다. 한번 더 확인 부탁드립니다.');
        }
        $tags = $this->Bookmarks->Tags->find('list');
        $this->set(compact('bookmark', 'tags'));
        $this->set('_serialize', ['bookmark']);
    }

목록표시
--------

이제는 현재 로그인 한 사용자의 북마크 만 표시하면됩니다. ``paginate()`` 호출해야 합니다.
**src/Controller/BookmarksController.php** 에서 ``index()`` 액션을 다음과 같이 만듭니다. ::

    public function index()
    {
        $this->paginate = [
            'conditions' => [
                'Bookmarks.user_id' => $this->Auth->user('id'),
            ]
        ];
        $this->set('bookmarks', $this->paginate($this->Bookmarks));
        $this->set('_serialize', ['bookmarks']);
    }

``tags()``  액션과 관련 finder 메소드도 수정해야하지만,
앞서 설명한 예를 보고 작성해주시기 바랍니다.

태그 추가 환경 개선
======================

``TagsController`` 가 모든 액세스를 허용하지 않기 때문에 현재 새 태그를 추가하는 것은 어려운 과정입니다.
액세스를 허용하는 대신 쉼표로 구분 된 텍스트 필드를 사용하여 태그 선택 UI를 개선 할 수 있습니다.
이렇게하면 사용자에게 더 나은 환경을 제공하고 ORM에서 더 우수한 기능을 사용할 수 있습니다.

계산(computed) 된 필드를 추가
------------------------

엔티티에 대해 형식이 지정된 태그에 액세스하는 간단한 방법을 원할 것이므로 엔티티에 virtual/computed 필드를 추가 할 수 있습니다.
**src/Model/Entity/Bookmark.php** 에서 다음을 추가합니다. ::

    use Cake\Collection\Collection;

    protected function _getTagString()
    {
        if (isset($this->_properties['tag_string'])) {
            return $this->_properties['tag_string'];
        }
        if (empty($this->tags)) {
            return '';
        }
        $tags = new Collection($this->tags);
        $str = $tags->reduce(function ($string, $tag) {
            return $string . $tag->title . ', ';
        }, '');
        return trim($str, ', ');
    }

이렇게하면 ``$bookmark->tag_string`` computed 된 속성에 액세스 할 수 있습니다. 나중에 컨트롤에서 이 속성을 사용합니다.
엔터티의 ``_accessible`` 목록에 tag_string 속성을 추가해야합니다.
나중에 태그를 저장하시기 바랍니다.

**src/Model/Entity/Bookmark.php** 에서 ``$_accessible`` 에 ``tag_string`` 을
이와 같이 추가합니다. ::

    protected $_accessible = [
        'user_id' => true,
        'title' => true,
        'description' => true,
        'url' => true,
        'user' => true,
        'tags' => true,
        'tag_string' => true,
    ];

뷰 수정
----------------

엔티티가 수정되면 태그에 대한 새로운 컨트롤을 추가 할 수 있습니다.
**src/Template/Bookmarks/add.ctp** 및 **src/Template/Bookmarks/edit.ctp** 에서 기존 ``tags._ids`` 컨트롤을 다음으로 대체합니다. ::

    echo $this->Form->control('tag_string', ['type' => 'text']);

태그 문자열 저장
--------------------

기존 태그를 문자열로 볼 수 있으므로 해당 데이터도 저장해야합니다.
``tag_string`` 을 액세스 가능한 것으로 표시 했으므로 요청의 데이터를 엔티티에 복사합니다.
``beforeSave()`` 훅 메소드를 사용하여 태그 문자열을 파싱하고 관련 엔티티를 찾기 / 구축 할 수 있습니다.
다음을 **src/Model/Table/BookmarksTable.php*에 추가합니다. ::

    public function beforeSave($event, $entity, $options)
    {
        if ($entity->tag_string) {
            $entity->tags = $this->_buildTags($entity->tag_string);
        }
    }

    protected function _buildTags($tagString)
    {
        // trim 적용
        $newTags = array_map('trim', explode(',', $tagString));
        // 빈칸을 삭제
        $newTags = array_filter($newTags);
        // 중복 태그를 삭제
        $newTags = array_unique($newTags);

        $out = [];
        $query = $this->Tags->find()
            ->where(['Tags.title IN' => $newTags]);

        // 새로운 태그에서 기존태그를 삭제
        foreach ($query->extract('title') as $existing) {
            $index = array_search($existing, $newTags);
            if ($index !== false) {
                unset($newTags[$index]);
            }
        }
        // 기존태그 추가
        foreach ($query as $tag) {
            $out[] = $tag;
        }
        // 새로운 태그 추가
        foreach ($newTags as $tag) {
            $out[] = $this->Tags->newEntity(['title' => $tag]);
        }
        return $out;
    }

이 코드는 지금까지 했던 것보다 좀 복잡하지만, CakePHP의 ORM이 얼마나 강력한지를 보여주는 데 도움이됩니다.
:doc:`/core-libraries/collections` 메소드를 사용하여 쿼리 결과를 조작하고 쉽게 엔티티를 생성하는 시나리오를 처리 할 수 있습니다.

마무리
======

인증 및 기본 인증 / 액세스 제어 시나리오를 처리하기 위해 북마크 응용 프로그램을 확장했습니다.
또한 FormHelper 및 ORM 기능을 활용하여 멋진 UX 개선 사항을 추가했습니다.

CakePHP를 봐주셔서 감사합니다. 다음으로 :doc:`/tutorials-and-examples/blog/blog` 를 완성하거나
:doc:`/orm` 를 배우거나 :doc:`/topics` 를 읽어주시기 바랍니다.
