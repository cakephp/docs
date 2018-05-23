블로그 튜토리얼 - 파트2
##############################

Article 모델 작성
====================

모델 클래스는 CakePHP 애플리케이션의 기본 중의 기본 (*bread and butter*)입니다.
CakePHP의 모델을 작성하여 데이터베이스와 통신 할 수있게 표시 (*view*)
추가 (*add*), 수정 (*edit*), 삭제 (*delete*) 등의 조작에 필요한 액션을 만들 수 있습니다.

CakePHP의 모델 클래스 파일은 ``Table`` 개체와 ``Entity`` 개체로 나뉩니다.
``Table`` 개체는 특정 테이블에 저장된 엔터티 컬렉션에 대한 액세스를 제공하며 ``src/Model/Table`` 로 이동합니다.
우리가 만들고있는 파일은  ``src/Model/Table/ArticlesTable.php`` 에 저장 될 것입니다.
완성 된 파일은 다음과 같습니다. ::

    // src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

명명 규칙은 CakePHP에서 매우 중요합니다.
Table객체인 ``ArticlesTable`` 의 이름을 지정함으로써 CakePHP는 이 Table 객체가 ArticlesController에서 사용될 것이고
``articles`` 라는 데이터베이스 테이블을 가르키고 있다는 것을 알 수 있습니다.

.. note::

   **src/Model/Table** 에서 해당 파일을 찾을 수 없다면 CakePHP는 동적으로 모델 객체를 생성합니다.
   이것은 실수로 파일의 이름을 잘못 지정하면 (예 : articlestable.php 또는 ArticleTable.php)
   CakePHP가 설정을 인식하지 못하고 대신 생성 된 모델을 사용한다는 것을 의미합니다.

콜백, 유효성 검사와 같은 모델에 대한 자세한 내용은 :doc:`/orm` 을 확인하시기 바랍니다.

.. note::

 　만약 이미 :doc:`블로그 튜토리얼 파트1 </tutorials-and-examples/blog/blog>`  을 완료하고
   ``articles`` 테이블을 블로그에 데이터베이스 작성하고 있으면
   CakePHP의 bake 콘솔을 활용하여 ``ArticlesTable`` 모델을 만들 수 있습니다. ::

            bin/cake bake model Articles

bake 및 코드 생성에 대한 자세한 내용은 :doc:`/bake/usage` 를 참조하시기 바랍니다.

Articles 컨트롤러 작성
=============================

게시물 (*articles*) 에 대한 컨트롤러를 만듭니다. 컨트롤러는 게시물의 모든 상호 작용이 발생하는 곳입니다.
간단하게 말하면 모델과 비즈니스 로직을 포함하고 게시물에 관련된 작업 장소입니다.
이 새로운 컨트롤러는 ``ArticlesController.php`` 라는 이름으로 ``src/Controller`` 디렉토리에 배치합니다.
기본 컨트롤러는 다음과 같습니다. ::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
    }

컨트롤러에 하나의 액션을 추가해보겠습니다.
액션은 응용 프로그램 중 하나의 함수 또는 인터페이스를 나타내고 있습니다.
예를 들어, 사용자가 www.example.com/articles/index (www.example.com/articles/ 과 동일합니다)
요청하는 경우 게시물 목록을 볼 수 있습니다.
이 작업의 코드는 다음과 같습니다. ::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {

        public function index()
        {
            $articles = $this->Articles->find('all');
            $this->set(compact('articles'));
        }
    }

``ArticlesController`` 에 ``index()`` 라는 함수를 정의함으로써 사용자는
www.example.com/articles/index 라는 요청에서 그 로직에 액세스 할 수 있습니다.
마찬가지로 ``foobar()`` 라는 함수를 정의하면 사용자는 www.example.com/articles/foobar
에 액세스 할 수 있습니다.

.. warning::

     URL을 지정할 때 컨트롤러 이름과 액션 이름에 맞춰서 만들 수 있지만 추천하지 않는 방법입니다.
     :doc:`/intro/conventions` (대문자 복수형의 이름 등)에 따라 읽기 쉽고 이해하기 쉬운 작업 이름을
     붙이도록 합니다. 나중에 :doc:`/development/routing` 라는 기능을 사용하여 URL과 코드를
     묶을 수 있습니다.

액션 속에있는 하나의 명령이 ``set()`` 을 사용하여 컨트롤러에서 뷰(다음에 작성함)에 데이터를 전달합니다.
이 줄은 ``ArticlesTable`` 객체의 ``find('all')`` 메소드가 반환하는 값에서 'articles' 라는 뷰의 변수를 설정합니다.

.. note::

     만약 이미 :doc:`블로그 튜토리얼 파트1 </tutorials-and-examples/blog/blog>`
     을 완료하고 ``articles`` 테이블을 블로그에 대한 데이터베이스 작성하고 있으면,
     CakePHP의 bake 콘솔을 활용하여 ``ArticlesController`` 클래스를 만들 수 있습니다. ::

        bin/cake bake controller Articles

bake와 코드 생성을 자세히 알고싶으시면 :doc:`/bake/usage` 을 읽어주시기 바랍니다.

CakePHP컨트롤러를 자세히 알고싶으시면 :doc:`/controllers` 을 읽어주시기 바랍니다.

Article 뷰 작성
====================

이제 모델에서 데이터가 흐르고 컨트롤러의 애플리케이션 로직이 정의되었으므로 위에 작성한 색인 조치에 대한 보기를 작성해 보겠습니다.

CakePHP 뷰 (*view*) 는 응용 프로그램의 레이아웃 (*layout*) 안에 들어 맞는 프레젠테이션 형식의 단편입니다.
대부분의 애플리케이션에서 HTML과 PHP가 섞여 있지만 XML, CSV 또는 바이너리 데이터도 될 수 있습니다.

레이아웃은 (*layout*) 를 감싸는 프리젠 테이션 코드입니다.
여러 개의 레이아웃을 정의 할 수 있으며 두 개의 레이아웃간에 전환 할 수 있습니다.
하지만 지금은 기본값을 사용합시다.

마지막 섹션에서 ``set()`` 메서드를 사용하여 뷰에 어떤 변수를 전달할지 확인합니다.
그러면 ``foreach`` 반복으로 호출 할 뷰에 쿼리 개체 컬렉션을 확인 할 수 있습니다.

CakePHP의 템플릿 파일은 ``src/Template`` 에 해당하는 컨트롤러의 이름을 가진 폴더 안에 저장됩니다.
(이 경우 'Articles'라는 폴더를 만들어야합니다)
테이블에서 articles 데이터의 서식을 지정하려면 보기 코드가 다음과 같이 표시 될 수 있습니다.

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp -->

    <h1>Blog articles</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- $articles 쿼리 객체를 foreach로 각각의 기사를 표시 -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>

보시는 것과 같이 ``$this->Html`` 이라는 객체를 사용했습니다.
이것은 :php:class:`Cake\\View\\Helper\\HtmlHelper` 클래스의 인스턴스입니다.
CakePHP에는 링크, 출력 양식을 만드는 데 도움이되는 도우미가 있습니다.
:doc:`/views/helpers` 에서 사용하는 방법에 대해 더 많이 배울 수 있지만 여기서 주목해야 할 중요한 점이 ``link()`` 메소드는 주어진 제목
(첫 번째 매개 변수)과 URL (두 번째 매개 변수)을 사용하여 HTML 링크를 생성한다는 것입니다.

CakePHP에서 URL을 지정할 때 배열 형식을 사용하는 것이 좋습니다.
URL에 배열 형식을 사용하면 CakePHP의 역방향 라우팅 기능을 이용할 수 있습니다.
/ controller / action / param1 / param2 형식으로 응용 프로그램의 기본 위치와 관련된 URL을 지정하거나 명명 된 경로를 사용할 수도 있습니다.
자세한 내용은 :ref:`named routes <named-routes>` 섹션을 참조하시기 바랍니다.

이제 브라우저를 http://www.example.com/articles/index 로 지정할 수 있습니다.
기사의 제목과 표 목록으로 올바르게 형식을 지정해야 합니다.

이 뷰에서 만든 링크 중 하나 (기사의 제목을 URL ``/articles/view/some\_id`` 에 링크) 중 하나를 클릭하면 CakePHP에서 해당 작업이 아직 정의안된 것을 알 수 있습니다.
너무 많은 정보를 얻지 못했다면 무언가 잘못되었거나 이미 그것을 실제로 정의한 것입니다.
이제  ``ArticlesController`` 에 만들겠습니다. ::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {

        public function index()
        {
             $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id = null)
        {
            $article = $this->Articles->get($id);
            $this->set(compact('article'));
        }
    }

``set()`` 호출은 이미 알고 계실것 입니다. ``find('all')`` 대신 ``get()`` 을 사용한다는 것을 알 수 있습니다.
왜냐하면 단지 하나의 기사 정보만을 원하기 때문입니다.

뷰 액션에는 매개 변수 (예 : 보려는 기사의 ID)를 사용합니다. 이 매개 변수는 요청 된 URL을 통해 액션에 전달됩니다.
사용자가 ``/articles/view/3`` 을 요청하면 '3'값이 ``$id`` 로 전달됩니다.

또한 사용자가 실제로 레코드에 액세스하고 있는지 확인하기 위해 약간의 오류를 검사합니다.
기사 테이블에서 ``get()`` 함수를 사용하여 사용자가 존재하는 레코드에 액세스했는지 확인합니다.
요청한 Article 테이블에 존재하지 않거나 id가 false 인 경우 ``get()`` 함수는 ``NotFoundException`` 을 발생시킵니다.

이제 새로운 'view' 동작에 대한 뷰를 만들어 **src/Template/Articles/view.ctp** 에 작성합니다.

.. code-block:: php

    <!-- File: src/Template/Articles/view.ctp -->

    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    <p><small>Created: <?= $article->created->format(DATE_RFC850) ?></small></p>

``/articles/index`` 에서 링크를 시도하거나 ``/articles/view/{id}`` 에 액세스하여 기사를 수동으로 요청하고 작동하는지 확인하시기 바랍니다.

기사 추가
==========

데이터베이스를 읽고 기사를 볼 수 있습니다.
이제 새 게시물을 추가할 수 있도록 하겠습니다.

먼저 ``ArticlesController`` 에서 ``add()`` 액션을 만들겠습니다. ::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {

        public function initialize()
        {
            parent::initialize();

            $this->loadComponent('Flash'); // FlashComponent 로드
        }

        public function index()
        {
            $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id)
        {
            $article = $this->Articles->get($id);
            $this->set(compact('article'));
        }

        public function add()
        {
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
                // 3.4.0 보다 전에는 $this->request->data() 를 사용함
                $article = $this->Articles->patchEntity($article, $this->request->getData());
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

   :doc:`/controllers/components/flash` 컨포넌트를 사용할 컨트롤러에 Flash 구성 요소를 포함시켜야합니다.
   필요하다면 ``AppController`` 에 작성합니다.

``add()`` 액션은 다음과 같습니다. 요청의 HTTP 메소드가 POST 인 경우 Article 모델을 사용하여 데이터를 저장합니다.
만약에 저장하지않았다면 뷰 만 표시됩니다.
이때 사용자 유효성 오류 또는 기타 경고를 표시 할 수 있습니다.

모든 CakePHP 요청은 ``ServerRequest`` 객체에 저장되어 있으며,
``$this->request`` 에 액세스 할 수 있습니다. 요청 객체는받은 요청
대한 여러가지 정보가 포함되어 있기 때문에 응용 프로그램의 흐름을 제어하는 데 사용할 수 있습니다.
이번에는 요청이 HTTP POST 여부의 확인에 :php:meth:`Cake\\Http\\ServerRequest::is()` 메소드를 사용하고 있습니다.

사용자가 응용 프로그램에 POST 데이터로 양식을 사용하면 해당 정보는 ``$this->request->getData()``
(또는 CakePHP v3.3 이하의 경우 ``$this->request->data()``)에서 사용할 수 있습니다.
데이터를 확인하시고 싶다면 :php:func:`pr()` 또는 :php:func:`debug()` 함수를 사용하여 확인 할 수 있습니다.

FlashComponent의 ``success()`` 및 ``error()`` 메서드를 사용하여 메시지를 세션 변수에 설정합니다.
이 메소드들은 PHP의 `매직 메서드
<http://php.net/manual/en/language.oop5.overloading.php#object.call>`_ 기능을 제공합니다.
리디렉션 후 플래시 메시지가 페이지에 표시됩니다. 레이아웃에서 메시지를 표시하는 ``<?= $this->Flash->render() ?>`` 가 있습니다.
컨트롤러의 :php:meth:`Cake\\Controller\\Controller::redirect` 함수가 다른 URL로 리디렉션됩니다.
``['action' => 'index']`` 은 URL /articles, 즉 ArticlesController의 색인 액션으로 변환됩니다.
`API <https://api.cakephp.org>`_ 의 :php:func:`Cake\\Routing\\Router::url()` 함수를 참조하여 다양한 CakePHP 함수에 대한 URL을 지정할 수있는 형식을 확인할 수 있습니다.

``save()`` 메소드를 호출하면 검증 오류가 체크되어 에러가있는 경우에는 저장을 중지합니다.
이러한 오류가 어떻게 처리되는지는 다음 섹션에서 살펴 보겠습니다.

데이터 유효성 검사
======================

CakePHP는 유효성 검사 작업을 쉽고 빠르게 할 수 있도록 제공하고 있습니다.

유효성 검사 기능을 활용하기 위해서는 뷰에서 CakePHP의 :doc:`/views/helpers/form` 을
사용해야합니다. :php:class:`Cake\\View\\Helper\\FormHelper` 는 기본적으로
모든 뷰에서 ``$this->Form``  으로 액세스 할 수 있도록되어 있습니다.

add 뷰는 다음과 같습니다.

.. code-block:: php

    <!-- File: src/Template/Articles/add.ctp -->

    <h1>Add Article</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Save Article'));
        echo $this->Form->end();
    ?>

여기서 FormHelper를 사용하여 HTML 양식의 시작 태그를 생성합니다.
``$this->Form->create()`` 가 생성 된 HTML은 다음과 같습니다.

.. code-block:: html

    <form method="post" action="/articles/add”>

``create()`` 에 매개 변수를 전달하지 호출하면 현재 컨트롤러의 add() 액션
(또는 ``id`` 폼 데이터에 포함 된 경우 ``edit()`` 액션)에
POST로 보냅니다.

``$this->Form->control()`` 메서드는 이름이 같은 양식 요소를 만드는 데 사용되고 있습니다.
첫 번째 매개 변수는 모든 필드에 대응하고 있는지를 CakePHP에게 알려줍니다.
두 번째 매개 변수는 다양한 옵션의 배열을 지정할 수 있습니다.
``control()`` 은 지정된 모델 필드를 기반으로 다른 양식 요소를 출력합니다.

``$this->Form->end()`` 호출 양식의 끝 부분이 출력됩니다.
hidden input 요소의 출력에서는 CSRF/양식 변조 방지가 유효합니다.

방금 전의 ``src/Template/Articles/index.ctp`` 뷰에서 "Add Article"링크를
새로 표시하도록 수정하겠습니다. ``<table>`` 앞에 다음 행을 추가하시기 바랍니다. ::

        <?= $this->Html->link('Add Article', ['action' => 'add']) ?>

CakePHP에서 유효성 검사 요구 사항을 지시하는 곳은 모델에서 정의 할 수 있습니다.
Article 모델을 검토하고 수정해보겠습니다. ::

    // src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }

        public function validationDefault(Validator $validator)
        {
            $validator
                ->notEmpty('title')
                ->requirePresence('title')
                ->notEmpty('body')
                ->requirePresence('body');

            return $validator;
        }
    }

``validationDefault()`` 메소드를 사용하여 ``save()`` 메소드가 호출 될 때
유효성 검사 결과를 CakePHP에게 알려줍니다. 여기에서는 본문과 제목 필드의 값이 있어야 합니다.
그리고 작성 및 수정 할 때 두개의 필드값이 존재해야한다는 것을 설정해 보겠습니다.
CakePHP 유효성 검사 엔진은 강력하고 기본 규칙이 여러 가지 있습니다. (신용 카드 번호, 이메일 주소 등)
또한 유연하게 자체 규칙을 만들어 설정할 수도 있습니다.
이 설정에 대한 자세한 내용은 :doc:`/core-libraries/validation` 를 참조하시기 바랍니다.

유효성 검사를 하기 위해 값을 입력하지 않고 확인해 보겠습니다. :php:meth:`Cake\\View\\Helper\\FormHelper::control()`
메서드를 사용하여 양식 요소를 작성했기 때문에 유효성 검사 오류 메시지가 자동으로 표시됩니다.

기사 수정
==============

그러면 즉시 기사를 수정 할 수 있도록 작업을 해보겠습니다.
보통 CakePHP는 액션을 만들고, 다음 뷰를 만드는 패턴입니다.
``ArticlesController`` 의 ``edit()`` 액션은 아래와 같습니다. ::

    // src/Controller/ArticlesController.php

    public function edit($id = null)
    {
        $article = $this->Articles->get($id);
        if ($this->request->is(['post', 'put'])) {
            // 3.4.0 보다 전은 $this->request->data()을 사용
            $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to update your article.'));
        }

        $this->set('article', $article);
    }

이 액션은 먼저 사용자가 알맞게 액세스 하는지 확인합니다.
만약 ``$id`` 매개 변수가 전달되지 않은가 게시물이 존재하지 않는 경우
``NotFoundException`` 을 발생시키고 CakePHP의 ErrorHandler에서 처리합니다.

다음 요청이 POST 또는 PUT인지 확인합니다. 만약 요청이 POST 또는 PUT라면
``patchEntity()`` 메소드를 사용하여 POST 데이터를 문서 엔티티에 수정합니다.
마지막으로 테이블 객체를 이용하여 엔티티를 저장하거나 유효성 검사를 보고합니다.

edit 뷰는 다음과 같습니다.

.. code-block:: php

    <!-- File: src/Template/Articles/edit.ctp -->

    <h1>Edit Article</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Save Article'));
        echo $this->Form->end();
    ?>

(값이 입력되어있는 경우)이 뷰는 수정 양식을 출력합니다.
필요한 경우, 검증 오류 메시지를 표시합니다.

``save()`` 가 불려 갔을 때, 엔티티의 내용에 따라
CakePHP는 삽입 또는 수정 중 생성할지 여부를 결정합니다.

이제 특정 기사를 수정 할 수있는 링크를 index 뷰에서 확인할 수 있습니다.

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp  (edit links added) -->

    <h1>Blog articles</h1>
    <p><?= $this->Html->link("Add Article", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
            <th>Action</th>
        </tr>

    <!-- $articles 쿼리객체를 foreach로 표시 -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Html->link('Edit', ['action' => 'edit', $article->id]) ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

기사 삭제
==============

그런 다음 사용자가 올린 글을 삭제할 수 있는 기능을 만들겠습니다.
``ArticlesController`` 의 ``delete()`` 액션을 만드는 것부터 시작하겠습니다. ::

    // src/Controller/ArticlesController.php

    public function delete($id)
    {
        $this->request->allowMethod(['post', 'delete']);

        $article = $this->Articles->get($id);
        if ($this->Articles->delete($article)) {
            $this->Flash->success(__('The article with id: {0} has been deleted.', h($id)));
            return $this->redirect(['action' => 'index']);
        }
    }

이 로직은  ``$id`` 에서 지정된 문서를 삭제하고  ``$this->Flash->success()``
로 사용자에게 메시지를 표시하고 그 때 ``/articles`` 로 리디렉션합니다.
사용자가 GET 요청을 사용하여 삭제를 시도하려고하면 ``allowMethod()`` 이 예외를 발생시킵니다.
포착되지 않는 예외는 CakePHP의 ErrorHandler가 확인해 오류 페이지가 표시됩니다.
그리고 :doc:`Exceptions </development/errors>` 는 다양한 HTTP오류를 가르키는 데 사용합니다.

로직을 실행하여 리디렉션하기 때문에이 작업에는 뷰가 없습니다.
그러나 index 뷰에 링크를 붙여 게시물을 삭제하도록 할 것입니다.

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp (delete links added) -->

    <h1>Blog articles</h1>
    <p><?= $this->Html->link('Add Article', ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
            <th>Actions</th>
        </tr>

    <!-- $articles 쿼리객체를 foreach로 표시 -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Form->postLink(
                    'Delete',
                    ['action' => 'delete', $article->id],
                    ['confirm' => 'Are you sure?'])
                ?>
                <?= $this->Html->link('Edit', ['action' => 'edit', $article->id]) ?>
            </td>
        </tr>
        <?php endforeach; ?>

    </table>

:php:meth:`~Cake\\View\\Helper\\FormHelper::postLink()` 는 기사를 삭제할 POST
요청 하기위한 JavaScript를 사용하는 링크가 생성됩니다.

.. warning::

    웹 크롤러가 갑자기 콘텐츠 모두를 제거 하기 때문에,
    GET 요청을 사용하여 콘텐츠 삭제를 허용하는 것은 위험합니다.

.. note::

    이 뷰 코드는 ``FormHelper`` 을 사용하여 삭제하기 전에
    JavaScript로 확인 대화 상자에서 사용자에게 확인합니다.

라우트(*Routes*)
======================

CakePHP의 기본 라우팅 동작이 충분하다고 생각하시는 분도 계실겁니다.
그러나 친화적이고 일반 검색 엔진에 대응할 수있는 작업에 관심이있는 개발자라면 CakePHP에서
URL이 어떻게 특정 함수의 호출에 매핑되는지를 이해하고 싶으실 것입니다.
이 튜토리얼에서는 routes를 쉽게 바꾸는 방법에 대해 다룹니다.

라우팅 기법의 응용에 관한 정보는 :ref:`routes-configuration` 에서 확인할 수 있습니다.

지금은 사용자가 사이트 (예를 들어, http://www.example.com) 을 보러 와서
CakePHP는 ``PagesController`` 에 연결하고 "home"라는 뷰를 표시하도록되어 있습니다.
그럼 라우팅 규칙을 작성하고 ArticlesController에서 작동하도록 해보겠습니다.

CakePHP의 라우팅은 **config/routes.php** 안에 있습니다.
기본 홈 루트를 주석 처리하거나 삭제합니다.

.. code-block:: php

    $routes->connect('/', ['controller' => 'Pages', 'action' => 'display', 'home']);

이 행은 '/' URL을 기본 CakePHP의 홈페이지에 연결합니다.
이것을 자신의 컨트롤러에 연결하기 위해 다음과 같은 행을 추가합니다.

.. code-block:: php

    $routes->connect('/', ['controller' => 'Articles', 'action' => 'index']);

이제 '/' 로 요청 해 온 사용자를 ArticlesController의 index() 액션에
연결시킬 수 있습니다.

.. note::

    CakePHP는 '리버스 라우팅' 도 이용할 수 있습니다.
    위의 경로가 정의되어있는 상태에서 배열을 기대하는 함수
    ``['controller' => 'Articles', 'action' => 'index']`` 를 전달하면 결과 URL은 '/' 입니다.
    URL 지정에 항상 배열을 사용하는 것이 좋습니다.
    즉 경로가 URL의 위치를 정의하고 링크가 같은 위치를 가리키는 것을 의미합니다.

마무리
======

이 튜토리얼은 매우 기본적인 사항 만 다루고 있지만 CakePHP는 더 *많은* 기능이 있습니다.
간단한 튜토리얼하기 위해 여기에서 다루지 않았습니다.
설명서의 나머지 부분을 가이드로 사용하여 더 기능이 풍부한 응용 프로그램을 작성하시기바랍니다.

기본 응용 프로그램 만들기가 끝났으니 :doc:`/tutorials-and-examples/blog/part-three`
으로 진행하거나 자신의 프로젝트를 시작하시기 바랍니다.
CakePHP에 대해 더 배우기 위해
:doc:`/topics` 과 `API <https://api.cakephp.org>`_  를 사용합시다.

도움이 필요하면 :doc:`/intro/where-to-get-help` 를 참조시기 바랍니다.
그럼 CakePHP에 오신 것을 환영합니다!

추천 참고 문헌
----------------

CakePHP를 학습하는 분들께 추천하는 작업이 있습니다.

1. :ref:`view-layouts`: 웹 사이트 레이아웃 커스터마이즈
2. :ref:`view-elements`: 뷰 부품화 및 재사용
3. :doc:`/bake/usage`: 기본적인 CRUD코드 작성
4. :doc:`/tutorials-and-examples/blog-auth-example/auth`: 유저 인증과 승인 튜토리얼


.. meta::
    :title lang=kr: Blog Tutorial Adding a Layer
    :keywords lang=kr: doc models,validation check,controller actions,model post,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
