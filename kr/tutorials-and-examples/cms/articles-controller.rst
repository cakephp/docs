CMS 튜터리얼 Articles컨트롤러 작성
##################################################

모델이 만들어지면 Articles 컨트롤러가 필요합니다.
CakePHP의 컨트롤러는 HTTP 요청을 처리하고 응답을 준비하기 위해 모델 메서드에 포함 된 비즈니스 로직을 실행합니다.
이 새로운 컨트롤러를 **src/Controller** 디렉토리 안에 있는 **ArticlesController.php** 라는 파일을 만듭니다.
기본 컨트롤러의 모습은 다음과 같습니다. ::

    <?php
    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
    }

이제 컨트롤러에 액션을 추가해 보겠습니다. 동작은 연결된 경로가 있는 컨트롤러 메서드입니다.
예를 들어 사용자가 **www.example.com/articles/index** (**www.example.com/articles** 와 동일 함)를 요청하면 CakePHP는 ``ArticlesController`` 의 ``index`` 메서드를 호출합니다.
이 메서드는 모델 레이어를 쿼리하고 뷰에서 템플릿을 렌더링하여 응답을 준비해야합니다. 해당 작업의 코드는 다음과 같습니다. ::

    <?php
    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
        public function index()
        {
            $this->loadComponent('Paginator');
            $articles = $this->Paginator->paginate($this->Articles->find());
            $this->set(compact('articles'));
        }
    }

``ArticlesController`` 에서 ``index()`` 함수를 정의하면 사용자는 **www.example.com/articles/index** 를 요청하여 액세스 할 수 있습니다.
마찬가지로 ``foobar()`` 라는 함수를 정의하면 사용자는 **www.example.com/articles/foobar**  에 액세스 할 수 있습니다.
특정 URL을 얻을 수 있는 방법으로 컨트롤러와 작업의 이름을 지정해야 할 수도 있지만 :doc:`/intro/conventions` 에 따라 읽기 쉽고 의미있는 액션 이름을 만드는 것을 권장합니다.
그런 다음 :doc:`/development/routing` 을 사용하여 원하는 URL을 만든 작업에 연결할 수 있습니다.

컨트롤러 동작은 매우 간단합니다. 명명 규칙을 통해 자동으로 로드되는 Ariticles 모델을 사용하여 데이터베이스에서 Articles 집합을 가져옵니다.
그런 다음 ``set()`` 을 사용하여 Articles를 템플릿으로 전달합니다.
CakePHP는 컨트롤러 동작이 완료된 후 템플릿을 자동으로 렌더링합니다.

Articles 일람표 템플릿 작성
===========================

이제 컨트롤러가 모델에서 데이터를 가져 와서 뷰 컨텍스트를 준비 했으므로 index 작업을위한 뷰 템플릿을 만들어 보겠습니다.

CakePHP 뷰 템플릿은 어플리케이션의 레이아웃 안에 삽입된 프리젠 테이션용 PHP 코드입니다.
 여기에서 HTML을 생성하는 동안, Views는 JSON, CSV 또는 심지어 PDF와 같은 바이너리 파일을 생성 할 수 있습니다.

레이아웃은 뷰를 감싸는 프리젠 테이션 코드입니다.
레이아웃 파일에는 머리글, 바닥 글 및 탐색 요소와 같은 공통 사이트 요소가 포함되어 있습니다.
어플리케이션은 여러 레이아웃을 가질 수 있으며 두 레이아웃을 전환 할 수 있습니다.
하지만 지금은 기본 레이아웃을 사용합시다.

CakePHP의 템플릿 파일은 **src/Template** 에 해당하는 컨트롤러의 이름을 가진 폴더 안에 저장됩니다.
따라서 이 경우 'Articles'라는 폴더를 만들어야합니다. 어플리케이션에 다음 코드를 작성합니다.

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp -->

    <h1>일람</h1>
    <table>
        <tr>
            <th>제목</th>
            <th>작성날짜</th>
        </tr>

        <!-- $articles 쿼리 객체를 foreach로 출력합니다. -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>

마지막 섹션에서는 ``set()`` 을 사용하여 뷰에 'articles'변수를 할당했습니다.
뷰에 전달 된 변수는 위의 코드에서 사용한 로컬 변수로 뷰 템플릿에서 사용할 수 있습니다.

``$this->Html`` 이라는 객체를 사용한것을 알 수 있습니다.
이것은 CakePHP :doc:`HtmlHelper </views/helpers/html>` 의 인스턴스입니다.

CakePHP에는 링크, 양식 및 페이지 버튼을 쉽게 만들 수 있는 뷰 헬퍼가 있습니다.
해당 챕터에서 :doc:`/views/helpers` 에 대해 자세히 알아볼 수 있지만
여기서 중요한 점은 ``link()`` 메서드가 주어진 링크 텍스트 (첫 번째 매개 변수)와 URL (두 번째 매개 변수)을 사용하여 HTML 링크를 생성한다는 것입니다.
CakePHP에서 URL을 지정할 때, 배열이나 :ref:`명명 <named-routes>` 된 경로를 사용하는 것이 좋습니다. 이러한 구문을 사용하면
CakePHP에서 제공하는 역방향 라우팅 기능을 활용할 수 있습니다.

이 시점에서 브라우저에서 **http://localhost:8765/articles/index** 를 가리킬 수 있어야 합니다.
Article의 제목과 표 목록으로 올바르게 형식이 지정된 목록보기가 표시되어야 합니다.

뷰 액션 만들기
=====================

Article 목록 페이지에서 ‘뷰'링크 중 하나를 클릭하면 작업이 구현되지 않았다는 오류 페이지가 표시됩니다.
이제 해결할 수 있습니다. ::

    // 기존 src/Controller/ArticlesController.php 파일에 추가

    public function view($slug = null)
    {
        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        $this->set(compact('article'));
    }

이것은 간단한 액션이지만 CakePHP의 강력한 기능을 사용했습니다. :ref:`Dynamic Finder <dynamic-finders>` 인 ``findBySlug()`` 를 사용하여 작업을 시작합니다.
이 방법을 사용하면 주어진 슬러그로 기사를 찾는 기본 쿼리를 만들 수 있습니다.
그런 다음 ``firstOrFail()`` 을 사용하여 첫 번째 레코드를 가져 오거나 ``NotFoundException`` 을 발생시킵니다.

이 액션은 $slug 매개 변수를 받는데 ``$slug`` 는 사용자가 ``/articles/view/first-post`` 를 요청하면
'first-post'값은 CakePHP의 라우팅 및 디스패치 계층에 의해 ``$slug`` 로 전달됩니다.
새로운 작업을 저장 한 상태에서 브라우저를 다시 로드하면 다른 CakePHP 오류 페이지가 표시되어 뷰 템플릿이 누락되었음을 알 수 있습니다.
그것을 편집합시다.


뷰 템플렛 작성
=======================

새로운 'view'액션에 대한 뷰를 만들고 **src/Template/Articles/view.ctp** 에 작성합니다.

.. code-block:: php

    <!-- File: src/Template/Articles/view.ctp -->

    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    <p><small>작성시간: <?= $article->created->format(DATE_RFC850) ?></small></p>
    <p><?= $this->Html->link('Edit', ['action' => 'edit', $article->slug]) ?></p>

``/articles/index`` 에서 링크를 사용하거나 ``/articles/view/slug-name`` 와 같은 URL에 액세스하여 기사를 수동으로 요청하여 이것이 작동하는지 확인할 수 있습니다.

Article추가
==========

기본 읽기보기가 생성되면 새로운 Article을 작성해야 합니다.
``ArticlesController`` 에서 ``add()`` 액션을 작성하는 것으로 시작합니다.
컨트롤러는 이제 다음과 같습니다. ::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {

        public function initialize()
        {
            parent::initialize();

            $this->loadComponent('Paginator');
            $this->loadComponent('Flash'); // FlashComponent 을 include
        }

        public function index()
        {
            $articles = $this->Paginator->paginate($this->Articles->find());
            $this->set(compact('articles'));
        }

        public function view($slug)
        {
            $article = $this->Articles->findBySlug($slug)->firstOrFail();
            $this->set(compact('article'));
        }

        public function add()
        {
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->getData());

		    // user_id는 일시적인 것이기 때문에 나중에 삭제하겠습니다.
                $article->user_id = 1;

                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Your article has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Unable to add your article.'));
            }
            $this->set('article', $article);
        }
    }

.. note::

    :doc:`/controllers/components/flash` 구성 요소를 사용할 컨트롤러에 Flash 구성 요소를 포함시켜야 합니다.
    그리고 ``AppController`` 에 포함시키는 것도 가능합니다.

``add()`` 액션의 기능은 다음과 같습니다.

* 요청의 HTTP 메서드가 POST 인 경우 Article 모델을 사용하여 데이터를 저장합니다.
* 어떤 이유로 든 저장하지 않으면 View 만 렌더링 하면 됩니다.
  이렇게 하면 사용자 유효성 오류 또는 기타 경고를 표시 할 수 있습니다.

모든 CakePHP 요청은 ``$this->request`` 를 사용하여 접근 할 수있는 요청 객체를 포함합니다.
요청 개체에는 방금받은 요청과 관련된 정보가 들어 있습니다. :php:meth:`Cake\\Http\\ServerRequest::is()` 메서드를 사용하여 요청이 HTTP POST 요청인지 확인합니다.

POST 데이터는 ``$this->request->getData()`` 에서 사용할 수 있습니다.
어떤 모습인지보고 싶다면 :php:func:`pr()` 또는 :php:func:`debug()` 함수를 사용하여 확인 할 수 있습니다.
데이터를 저장하기 위해 먼저 POST 데이터를 Article Entity로 '교환 (marshal)'합니다.
엔티티는 이전에 작성한 ArticlesTable을 사용하여 지속됩니다.

새 Article을 저장 한 후 FlashComponent의 ``success()`` 메서드를 사용하여 메시지를 세션에 설정합니다.
``success`` 방법은 PHP의 `매직 메서드 기능 <http://php.net/manual/ja/language.oop5.overloading.php#object.call>`_ 을 사용하여 제공됩니다.
리다이렉트 후 플래시 메시지가 다음 페이지에 표시됩니다.
레이아웃에는 플래시 메시지를 표시하고 해당 세션 변수를 클리어하는 ``<?= $this->Flash->render() ?>`` 가 있습니다.
마지막으로 저장이 완료되면 :php:meth:`Cake\\Controller\\Controller::redirect` 를 사용하여 사용자를 기사 목록으로 다시 보냅니다.
param ``['action' => 'index']`` 은 URL ``/articles``, 즉 ``ArticlesController`` 의 색인 액션으로 변환됩니다.
`API <https://api.cakephp.org>`_ 의 :php:func:`Cake\\Routing\\Router::url()` 함수를 참조하여 다양한 CakePHP 함수에 대한 URL을 지정할 수있는 형식을 확인할 수 있습니다.

Article추가 템플릿 만들기
======================

Article추가 템플릿은 다음과 같습니다.

.. code-block:: php

    <!-- File: src/Template/Articles/add.ctp -->

    <h1>Article추가</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->control('user_id', ['type' => 'hidden', 'value' => 1]);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Save Article'));
        echo $this->Form->end();
    ?>

FormHelper를 사용하여 HTML 양식의 태그를 생성합니다.
다음은 ``$this->Form->create()`` 가 생성하는 HTML입니다.

.. code-block:: html

    <form method="post" action="/articles/add">

URL 옵션없이 ``create()`` 를 호출했기 때문에 ``FormHelper`` 는 양식이 현재 작업으로 다시 제출되기를 원한다고 가정합니다.

``$this->Form->control()`` 메서드는 동일한 이름의 양식 요소를 작성하는 데 사용됩니다.
첫 번째 매개 변수는 CakePHP에게 어느 필드가 해당하는지 알려주고 두 번째 매개 변수는 다양한 옵션을 지정할 수있게 해줍니다.
이 경우 텍스트 영역의 행 수를 지정할 수 있습니다.
여기에 사용 된 내용 확인(introspection) 및 규칙이 있습니다.
``control()`` 은 지정된 모델 필드에 따라 다른 양식 요소를 출력하고 언어형태 변화(inflection)을 사용하여 레이블 텍스트를 생성합니다.
옵션을 사용하여 레이블, 입력 또는 양식 컨트롤의 다른 측면을 사용자 정의 할 수 있습니다.
``$this->Form->end()`` 호출은 폼을 닫습니다.

이제 돌아가서  **src/Template/Articles/index.ctp** 보기를 업데이트하여 새로운 "Article 추가"링크를 포함 시킵니다.
``<table>`` 앞에 다음 행을 추가합니다. ::

    <?= $this->Html->link('Article추가', ['action' => 'add']) ?>

심플 Slug생성
=============================

지금 Article를 저장한다면, Slug 속성을 생성하지 않고 컬럼이 ``NOT NULL`` 이되어 저장이 실패 할 것입니다.
Slug 값은 일반적으로 Article의 제목에 대한 URL 안전 버전입니다.
ORM의 :ref:`beforeSave() 콜백 <table-callbacks>` 을 사용하여 슬러그를 채울 수 있습니다. ::

    // src/Model/Table/ArticlesTable.php の中で

    // 이 use 문을 네임 스페이스 선언 바로 아래에 추가합니다.
    // Text Class를 import합니다
    use Cake\Utility\Text;

    // 다음의 메서드를 추가합니다

    public function beforeSave($event, $entity, $options)
    {
        if ($entity->isNew() && !$entity->slug) {
            $sluggedTitle = Text::slug($entity->title);
            $entity->slug = substr($sluggedTitle, 0, 191);
        }

        // 이것은 일시적인 것이기때문에 나중에 삭제 하겠습니다
        if (!$entity->user_id) {
            $entity->user_id = 1;
        }
    }

이 코드는 간단하며 중복 된 Slug는 고려하지 않습니다. 하지만 나중에 편집할 것 입니다.

Article편집
=====================

우리의 응용 프로그램은 이제 Article을 저장할 수 있지만 편집은 할 수는 없습니다.
``ArticlesController`` 에 다음 작업을 추가해주시길 바랍니다. ::

    // src/Controller/ArticlesController.php 파일

    // 다음의 메서드를 추가합니다

    public function edit($slug)
    {
        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to update your article.'));
        }

        $this->set('article', $article);
    }

이 작업은 먼저 User가 기존 레코드에 액세스하려고 시도했는지 확인합니다.
``$slug`` 매개 변수를 전달하지 않았거나 Article이 존재하지 않으면 ``NotFoundException`` 이 발생하고 CakePHP ErrorHandler가 해당 오류 페이지를 렌더링합니다.

그런 다음 요청은 POST 또는 PUT 요청인지 여부를 확인합니다.
그렇다면 POST / PUT 데이터를 사용하여 ``patchEntity()`` 메서드를 사용하여 기사 엔티티를 업데이트합니다.
마지막으로  ``save()`` 를 호출하여 적절한 플래시 메시지를 설정하고 리디렉션하거나 유효성 검사 오류를 표시합니다.

Article편집 템플릿 만들기
=======================

Articles편집 템플릿은 다음과 같습니다.

.. code-block:: php

    <!-- File: src/Template/Articles/edit.ctp -->

    <h1>Articles편집</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->control('user_id', ['type' => 'hidden']);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Save Article'));
        echo $this->Form->end();
    ?>

이 템플릿은 필요한 유효성 검사 오류 메시지와 함께 편집 템플릿을 출력합니다.
이제 Articles를 편집 할 수있는 링크로 색인보기를 업데이트 할 수 있습니다.

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp  (편집링크) -->

    <h1>Articles일람</h1>
    <p><?= $this->Html->link("Articles추가", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>제목</th>
            <th>작성날짜</th>
            <th>조작</th>
        </tr>

    <!-- $articles 쿼리를 foreach로 출력합니다. -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Html->link('編集', ['action' => 'edit', $article->slug]) ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

Article 유효성 검사 규칙 업데이트
====================================

이 시점까지 Article은 입력 검증이 완료되지 않았습니다. :ref:`유효성 검사(Validator) <validating-request-data>` 를 사용하여 해결할 수 있습니다. ::

    // src/Model/Table/ArticlesTable.php

    // 이 use 문을 네임 스페이스 선언 바로 아래에 추가하여 가져옵니다.
    // Validator 클래스를 선언합니다.
    use Cake\Validation\Validator;

    // 다음의 메서드를 추가합니다.
    public function validationDefault(Validator $validator)
    {
        $validator
            ->notEmpty('title')
            ->minLength('title', 10)
            ->maxLength('title', 255)

            ->notEmpty('body')
            ->minLength('body', 10);

        return $validator;
    }

``validationDefault()`` 메서드는 ``save()`` 메서드가 호출 될 때 CakePHP에 데이터의 유효성을 검사하는 방법을 알려줍니다.
여기에서는 title 필드와 body 필드가 모두 비어 있으면 안되며 특정 길이 제한이 있어야한다고 지정했습니다.

CakePHP의 검증 엔진은 강력하고 유연합니다.
전자 메일 주소, IP 주소 등의 작업에 자주 사용되는 규칙 집합과 고유 한 유효성 검사 규칙을 추가 할 수있는 유연성을 제공합니다.
해당 설정에 대한 자세한 내용은 :doc:`/core-libraries/validation` 설명서를 확인합니다.

이제 유효성 검사 규칙이 적용되었으므로 앱을 사용하여 빈 제목이나 본문이있는 기사를 추가하여 작동 원리를 확인합니다.
formHelper의 :php:meth:`Cake\\View\\Helper\\FormHelper::control()` 메소드를 사용하여 양식 요소를 작성 했으므로 유효성 검증 오류 메시지가 자동으로 표시됩니다.

Article삭제 액션 추가
=======================

다음으로 사용자가 Articles를 삭제할 수있는 방법을 만들어 보겠습니다.
``ArticlesController`` 에서 ``delete()`` 액션으로 시작합니다. ::

    // src/Controller/ArticlesController.php

    public function delete($slug)
    {
        $this->request->allowMethod(['post', 'delete']);

        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        if ($this->Articles->delete($article)) {
            $this->Flash->success(__('The {0} article has been deleted.', $article->title));
            return $this->redirect(['action' => 'index']);
        }
    }

이 로직은 ``$slug`` 에 지정된 기사를 삭제하고 ``$this->Flash->success()`` 를 사용하여 / articles로 리디렉션 한 후 사용자에게 확인 메시지를 표시합니다.
사용자가 GET 요청을 사용하여 ``/articles`` 을 삭제하려고 시도하면 ``allowMethod()`` 가 예외를 throw합니다.
캐치되지 않은 예외는 CakePHP의 예외 핸들러에 의해 캡쳐되고 멋진 오류 페이지가 표시됩니다.
응용 프로그램에서 생성해야하는 다양한 HTTP 오류를 나타내는 데 사용할 수있는 기본 제공 :doc:`예외 </development/errors>`가 많이 있습니다.

.. warning::

    웹 크롤러가 실수로 모든 콘텐츠를 삭제할 수 있으므로 GET 요청을 사용하여 콘텐츠를 삭제하는 것은 매우 위험합니다.
    그래서 컨트롤러에서 ``allowMethod()`` 를 사용했습니다.

단지 로직을 실행하고 다른 액션으로 리디렉션하기 때문에 이 액션에는 템플릿이 없습니다.
사용자가 Article을 삭제할 수있는 링크로 색인 템플릿을 업데이트 할 수 있습니다.

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp  (삭제링크 추가) -->

    <h1>記事一覧</h1>
    <p><?= $this->Html->link("Articles추가", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>제목</th>
            <th>작성날짜</th>
            <th>조작</th>
        </tr>

    <!-- $articles 쿼리를 foreach로 출력합니다. -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Html->link('편집', ['action' => 'edit', $article->slug]) ?>
                <?= $this->Form->postLink(
                    '삭제',
                    ['action' => 'delete', $article->slug],
                    ['confirm' => 'よろしいですか?'])
                ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

:php:meth:`~Cake\\View\\Helper\\FormHelper::postLink()` 를 사용하면 JavaScript를 사용하여 Article을 삭제하는 POST 요청을하는 링크가 생성됩니다.

.. note::

    또한 이 보기 코드는 ``Form Helper`` 를 사용하여 기사를 삭제하기 전에 JavaScript 확인 대화 상자를 통해 사용자에게 메시지를 표시합니다.

기본 Article 관리 설정을 사용하여 :doc:`태그 및 사용자 테이블의 기본 동작</tutorials-and-examples/cms/tags-and-users>` 을 만듭니다.
