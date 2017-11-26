CakePHP 개요
############

CakePHP는 웹을 쉽게 개발 할 수 있도록 도와주는 프레임워크 입니다.
이 개요의 목표는 CakePHP의 일반적인 개념을 소개하고 이러한 개념이 어떻게 구현되는지에 대한
간단한 개요를 제공하는 것 입니다. 

프로젝트를 시작하려면 :doc:`튜토리얼부터 시작
</tutorials-and-examples/cms/installation>` 하거나 :doc:`도큐멘트 </topics>` 를 참고해주시길 바랍니다.

설정보다 규약
============

CakePHP는 기초적인 구조를 클래스 이름, 파일 이름, DB테이블 이름 및 기타 규약을 정해서 기본 조직 구조를 제공합니다.
CakePHP가 제공하는 :doc:`규약 </intro/conventions>` 에 따르면, 불필요한 설정을 방지할 수 있으며, 다양한 프로젝트를 간단하게 처리 할 수 있는 일관된 애플리케이션 구조를 만들 수 있습니다. 

모델 계층
========

모델 계층은 비즈니스 로직을 구현하는 애플리케이션의 일부를 나타냅니다.
데이터를 검색하여 애플리케이션에 맞는 형식으로 변환하거나 처리, 검증(*validating*), 연결(*associating*)등
데이터 처리와 관련된 작업을 실행하는 곳 입니다. 

SNS의 경우 모델 계층은 사용자 저장, 친구 저장, 사용자 사진 저장 및 검색, 새 친구 찾기 등과 같은 작업을 처리합니다.
여기서 모델 오브젝트는 '친구(*Friend*)', '사용자(*User*)', '댓글(*Comment*)', '사진(*Photo*)'을 생각해 볼 수가 있습니다.
 ``users`` 테이블에서 데이터를 읽는다면 아래와 같습니다.::

    use Cake\ORM\TableRegistry;

    $users = TableRegistry::get('Users');
    $query = $users->find();
    foreach ($query as $row) {
        echo $row->username;
    }

데이터를 가지고 작업하기 전에 코드가 간단하다는 것을 확인 할 수 있습니다. 
이러한 CakePHP만의 규약으로 아직 정의하지 않은 테이블과 엔티티 클래스의 목적을 위한 스탠다스 클래스를 사용하게 되어 있습니다.

새로운 사용자를 만들어서 검증(*validating*)한 후 저장한다면 아래와 같습니다.::

    use Cake\ORM\TableRegistry;

    $users = TableRegistry::get('Users');
    $user = $users->newEntity(['email' => 'mark@example.com']);
    $users->save($user);

뷰 계층
========

뷰 계층은 모델에서 온 데이터 정보를 가지고 사용자 인터페이스를 생성합니다.
예를 들면, 뷰는 모델 데이터를 사용하여 HTML뷰 템플릿이나 XML형식의 결과를 렌더링 할 수 있습니다. ::

    // 뷰 템블릿에 “element”를 각각의 사용자에 대해 렌더링 한다.
    <?php foreach ($users as $user): ?>
        <li class="user">
            <?= $this->element('user_info', ['user' => $user]) ?>
        </li>
    <?php endforeach; ?>

이 처럼 :ref:`view-templates` :ref:`view-elements` 그리고 :doc:`/views/cells`
과 같은 확장 기능을 제공합니다.
뷰 계층은 HTML, 데이터 텍스트 뿐만 아니라 JSON, XML 과 같은 데이터 형식을 제공하고
플러그인 형식 아키텍처를 통해 다른 데이터 형식도 처리 할 수 있습니다.


컨트롤러 계층
================

컨트롤러 계층은 사용자의 리퀘스트를 처리합니다. 이것은 모델 계층과 뷰 계층을 통한 응답을 렌더링 합니다.

컨트롤러는 작업 완료에 필요한 모든 리소스를 작업자가 받을 수 있도록 합니다. 클라이언트의 리퀘스트를 기다리고, 인증 또한 권한 부여 규칙에 따라
유효성을 검사합니다.  그리고 데이터는 모델 계층에서 처리하고 클라이언트가 뷰 계층에 필요한 데이터 유형을 선택합니다.
예를 들면 사용자 등록은 아래와 같습니다. ::

    public function add()
    {
        $user = $this->Users->newEntity();
        if ($this->request->is('post')) {
            $user = $this->Users->patchEntity($user, $this->request->getData());
            if ($this->Users->save($user, ['validate' => 'registration'])) {
                $this->Flash->success(__('You are now registered.'));
            } else {
                $this->Flash->error(__('There were some problems.'));
            }
        }
        $this->set('user', $user);
    }

명시적으로 뷰를 렌더링 하지 않았지만 CakaPHP에서는 ``set()`` 으로 처리한 데이터를 렌더링 합니다.

.. _request-cycle:

CakePHP의 리퀘스트 사이클
============================

이제 CakePHP의 여러 계층에 익숙해 졌으므로 리퀘스트 사이클이 어떻게 작동하는지 확인 해 볼수 있습니다.

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: Flow diagram showing a typical CakePHP request

전형적인 CakePHP의 리퀘스트 사이클은 사용자가 어플리케이션 안에서 페이지나 리소스를 리퀘스트 하는 것으로 시작됩니다.
위의 그림에 있는 리퀘스트의 순서는 아래와 같습니다.

#. 웹서버가 **webroot/index.php** 에서 리퀘스트를 제어하는 룰을 작성합니다.
#. 어플리케이션이 로드되어 ``HttpServer`` 에 바인딩 됩니다.
#. 어플리케이션의 미들웨어가 초기화 됩니다.
#. 리퀘스트 및 리스폰스는 어플리케이션에서 사용하는 PSR-7미들웨어를 통해 전달됩니다. 일반적으로 여기에는 오류 트래핑 및 라우팅이 포함 됩니다.
#. 미들웨어에서 리스폰스가 없는 경우나 리퀘스트가 루팅정보를 포함하는 경우 컨트롤러와 액션이 선택됩니다.
#. 컨트롤러의 액션이 읽히면서 컨트롤러가 요구한 모델과 컨포넌트를 리퀘스트합니다.
#. 컨트롤러에서 생성한 데이터를 뷰에게 전달합니다.
#. 뷰가 헬퍼과 셀을 사용해서 body랑 header에 출력합니다.
#. 리스폰스는 :doc:`/controllers/middleware` 를 통해 송신됩니다.
#. ``HttpServer`` 는 웹서버에 리스폰스를 보냅니다.

바로 시작해 봅시다
====================

CakePHP에서는 여러분의 흥미를 높이기 위해 다른 특징들도 소개해 드리겠습니다.

* Memcached, Redis 나 다른 백앤드과 통합된 :doc:`캐쉬 </core-libraries/caching>`
  프래임 워크.
* 강력한 :doc:`코드생성 툴 bake </bake/usage>` 로 간단하게 프로젝트를 생성.
* :doc:`통합된 테스트 프레임워크 </development/testing>` 로 코드가 완벽하게 움직이는지 확인가능.

다음 단계는 :doc:`download CakePHP </installation>` 한 후,
:doc:`튜토리얼
</tutorials-and-examples/cms/installation>` 을 읽어 주시길 바랍니다.

부록
====

.. toctree::
    :maxdepth: 1

    /intro/where-to-get-help
    /intro/conventions
    /intro/cakephp-folder-structure

.. meta::
    :title lang=kr: 시작
    :keywords lang=kr: folder structure,table names,initial request,database table,organizational structure,rst,filenames,conventions,mvc,web page,sit, 파일구성, 테이블이름, 파일이름,
