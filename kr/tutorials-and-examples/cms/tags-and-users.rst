CMS 튜토리얼 - 태그와 유져
#############################

기본 문서 작성 기능이 구축 된 상태에서 여러 작성자가 CMS에서 작업 할 수 있어야합니다.
이전에는 모든 모델, 뷰 및 컨트롤러를 손으로 제작했습니다.
이번에는 : doc :`/ bake` :을 사용하여 스켈레톤 코드를 작성하려고합니다.
Bake는 CakePHP가 : abbr :`CRUD (Create, Read, Update, Delete)` 애플리케이션을 매우 효율적으로 생성하는 데 사용하는 규칙을 활용하는 코드 생성  :abbr:`CLI (Command Line Interface)` 도구입니다.
사용자 코드를 빌드하기 위해 ``bake`` 를 사용할 것입니다.

.. code-block:: bash

    cd /path/to/our/app

    bin/cake bake model users
    bin/cake bake controller users
    bin/cake bake template users

3개의 명령은 다음을 생성합니다.

* The Table, Entity, Fixture files.
* The Controller
* The CRUD templates.
* 생성 된 각 클래스에 대한 Test case.

Bake는 또한 CakePHP 규칙을 사용하여 연관 관계를 추론합니다.
모델에 대한 유효성 검사도 합니다.

기사(Articles)에 태그 추가하기
==========================

여러 사용자가 :abbr:`CMS` 에 액세스 할 수 있으므로 콘텐츠를 분류 할 수 있는 좋은 방법이 될 것입니다.
콘텐츠의 자유 형식 카테고리 및 라벨을 만들 수 있습니다.
다시 말하지만 애플리케이션에 대한 몇 가지 기본 코드를 신속하게 생성하기 위해 ``bake`` 를 사용합니다.

.. code-block:: bash

    # 한번에 모든 코드를 생성
    bin/cake bake all tags

코드를 생성하고 나면 **http://localhost:8765/tags/add** 에서 몇 가지 샘플 태그를 만들어 볼 수 있습니다.

Tags 테이블이 생겼으니 Articles와 Tags를 만들 수 있습니다.
다음과 같이 ArticlesTable에 ``initialize`` 메소드를 추가 할 수 있습니다. ::

    public function initialize(array $config)
    {
        $this->addBehavior('Timestamp');
        $this->belongsToMany('Tags'); // 이 부분을 추가
    }

이 연관성은 따라했기 때문에 간단한 정의로 작동 할 것입니다.
테이블을 만들 때의 CakePHP 규칙. 자세한 내용은 :doc:`/orm/associations` 을 참조합니다.

태그를 적용하기 위한 기사(Articles) 업데이트
===================================

애플리케이션에 태그가 추가되었으므로 사용자가 태그를 지정할 수 있도록 해야합니다.
먼저 ``add`` 액션을 다음과 같이 수정 하시길 바랍니다 ::

    // 기존 src/Controller/ArticlesController.php 에 작성

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {
        public function add()
        {
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->getData());

                // 일시적인 것으로 나중에 삭제하겠습니다.
                $article->user_id = 1;

                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Your article has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Unable to add your article.'));
            }
            // 태그 리스트를 가져옴
            $tags = $this->Articles->Tags->find('list');

            // 리스트로 가져온 $tags 를 뷰 컨텍스트에 set함
            $this->set('tags', $tags);

            $this->set('article', $article);
        }

        // 다른 액션
    }

추가 된 줄은 태그 목록을 ``id => title`` 의 연관 배열로 로드합니다.
이 형식을 사용하면 템플릿에 새 태그 입력을 만들 수 있습니다.
**src/Template/Articles/add.ctp** 에있는 컨트롤의 PHP 블록에 다음을 추가합니다. ::

    echo $this->Form->control('tags._ids', ['options' => $tags]);

이것은``$tags`` 변수를 사용하는 다중 select 요소를 선택 상자 옵션을 생성합니다.
이제 몇 개의 새로운 기사(Article)를 만들어야합니다.
또한 태그를 추가하거나 편집 할 수 있도록 ``edit`` 메소드를 업데이트해야합니다.
편집 방법은 다음과 같습니다. ::

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // Articles과 관련된 Tags를 contain함
            ->firstOrFail();
        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to update your article.'));
        }

        // Tags리스트를 가져옴
        $tags = $this->Articles->Tags->find('list');

        // 렌더링을 위해 tags를 set함
        $this->set('tags', $tags);

        $this->set('article', $article);
    }

 **add.ctp**에 추가 한 멀티 셀렉트 컨트롤을 새 태그에 추가합니다.
템플릿을 **src/Template/Articles/edit.ctp* 템플릿에도 추가합니다.

태그로 기사(Articles) 검색
========================

사용자가 콘텐츠를 분류하면 해당 콘텐츠를 검색하려고 합니다.
사용한 태그로 이 기능을 위해 경로, 컨트롤러 액션 및 파인더 메소드를 사용하여 태그별로 기사를 검색합니다.

이상적으로는, **http://localhost:8765/articles/tagged/funny/cat/gifs**과 같은 URL입니다.
그러면 "funny" "cat"또는 "gifs"태그가있는 모든 문서를 찾을 수 있습니다.
이를 구현하기 전에 새로운 루트를 추가합니다. **config/routes.php**은 다음과 같이 될 것입니다. ::

    <?php
    use Cake\Core\Plugin;
    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\Router;

    Router::defaultRouteClass(DashedRoute::class);

    // 태그로 추가 작업을 위해 추가 된 새로운 내용
    // 끝에 '*'는 이 동작이 매개 변수를 전달
    Router::scope(
        '/articles',
        ['controller' => 'Articles'],
        function ($routes) {
            $routes->connect('/tagged/*', ['action' => 'tags']);
        }
    );

    Router::scope('/', function ($routes) {
        // 디폴트로 home 과 /pages/* 루트를 연결
        $routes->connect('/', [
            'controller' => 'Pages',
            'action' => 'display', 'home'
        ]);
        $routes->connect('/pages/*', [
            'controller' => 'Pages',
            'action' => 'display'
        ]);

        // 베이스 루트로 연결
        $routes->fallbacks();
    });

    Plugin::routes();


위는 **/articles/tagged/** 경로를 연결하는 새로운 'route'를 정의하고,
``ArticlesController::tags()``에 추가합니다. 경로를 정의하면 URL이 어떻게 구현되는지 살펴 봅니다.
접속한다면 **http://localhost:8765/articles/tagged** 오류 페이지가 표시됩니다.
이것은 CakePHP에서 컨트롤러 동작이 존재하지 않는다는 것을 알려줍니다.
그럼 오류 페이지를 고치기위해  **src/Controller/ArticlesController.php**
다음을 추가합니다. ::

    public function tags()
    {
        // 'pass'키는 CakePHP에 의해 제공되며
        // 요청에 전달 된 URL 경로에 포함
        $tags = $this->request->getParam('pass');

        // ArticlesTable을 사용하여 태그가있는 기사를 찾음
        $articles = $this->Articles->find('tagged', [
            'tags' => $tags
        ]);

        // 변수를 뷰 템플릿 컨텍스트로 전달
        $this->set([
            'articles' => $articles,
            'tags' => $tags
        ]);
    }

요청 데이터의 다른 부분에 액세스하려면 :ref:`cake-request` 섹션을 참조하시길 바랍니다.

전달 된 인수는 메소드 매개 변수로 전달되므로 PHP의 가변 인수를 사용하여 액션을 작성할 수도 있습니다. ::

    public function tags(...$tags)
    {
        // ArticlesTable를 사용한 Tag 기사(Article)을 검색
        $articles = $this->Articles->find('tagged', [
            'tags' => $tags
        ]);

        // 변수를 뷰 템플릿의 컨텍스트에 전달
        $this->set([
            'articles' => $articles,
            'tags' => $tags
        ]);
    }

파인더 메소드 작성
--------------------------

CakePHP에서 컨트롤러의 액션을 유지하면서 응용 프로그램의 로직의 대부분을 모델 레이어에 구현합니다.
**/articles/tagged** URL에 액세스하면  ``findTagged()`` 메소드가 아직 구현되지 않은 오류가 표시됩니다.
**src/Model/Table/ArticlesTable.php** 에서 다음을 추가합니다. ::

    // 이 use 문을 네임 스페이스 선언 바로 아래에 추가하여
    // Query 클래스를 가져옵니다
    use Cake\ORM\Query;

    //  $query 인수는 쿼리 빌더의 인스턴스입니다
    //  $options 배열은 컨트롤러의 액션에서 find('tagged')에 전달하면
    // "tags"옵션이 포함되어 있습니다.
    public function findTagged(Query $query, array $options)
    {
        $columns = [
            'Articles.id', 'Articles.user_id', 'Articles.title',
            'Articles.body', 'Articles.published', 'Articles.created',
            'Articles.slug',
        ];

        $query = $query
            ->select($columns)
            ->distinct($columns);

        if (empty($options['tags'])) {
            // 태그가 지정되지 않은 경우에는 태그가없는 기사(Articles)를 검색합니다.
            $query->leftJoinWith('Tags')
                ->where(['Tags.title IS' => null]);
        } else {
            // 태그가 하나 이상있는 기사(Articles)를 검색합니다.
            $query->innerJoinWith('Tags')
                ->where(['Tags.title IN' => $options['tags']]);
        }

        return $query->group(['Articles.id']);
    }

사용자 정의  :ref:`custom finder method <custom-find-methods>`를 구현했습니다.
이것은 CakePHP의 매우 강한 개념에서 재사용 가능한 쿼리를 패키지화 할 수 있습니다.
파인더 메소드는 항상 :doc:`/orm/query-builder`  객체와 options 배열을 매개 변수로 가져옵니다.
파인더는 쿼리를 조작하여 필수 조건과 조건을 추가 할 수 있습니다. 완료되면 파인더 메소드는 변경된 쿼리 개체를 반환해야합니다.
상기 측정기에서는 ``distinct()``와 ``leftJoin()``메소드를 이용하여 "일치"태그가있는 기사(Articles)를 찾을 수 있습니다.

View 작성
-----------------

**/articles/tagged** URL에 다시 액세스하면 CakePHP는 새로운 오류를 표시하여 뷰 파일이 생성되지 않음을 알려드립니다.
다음은 ``tags()`` 액션의 뷰 파일을 만들 수 있습니다. **src/Template/Articles/tags.ctp**에 다음의 내용을 작성합니다::

    <h1>
        Articles tagged with
        <?= $this->Text->toList(h($tags), 'or') ?>
    </h1>

    <section>
    <?php foreach ($articles as $article): ?>
        <article>
            <!-- link는 HtmlHelper로 사용 -->
            <h4><?= $this->Html->link(
                $article->title,
                ['controller' => 'Articles', 'action' => 'view', $article->slug]
            ) ?></h4>
            <span><?= h($article->created) ?>
        </article>
    <?php endforeach; ?>
    </section>

위의 코드에서 뷰 출력을 지원하기 위해 :doc:`/views/helpers/html` 헬퍼와 :doc:`/views/helpers/text` 헬퍼를 사용합니다.
또한 HTML 인코딩 출력을 위해 :php:func:`h` 바로 가기 기능을 사용합니다.
HTML 인젝션 문제를 방지하기 위해 데이터를 출력 할 때는 항상 ``h()``를 사용하는 것을 잊으면 안됩니다.

방금 만든 **tags.ctp** 파일은 뷰 템플릿 파일 CakePHP 약관에 따릅니다.
컨트롤러의 액션 이름을 소문자와 밑줄로 바꾼 것을 템플릿에 사용할 수 약관입니다.

뷰 템플릿에 ``$tags``와 ``$articles`` 변수를 사용할 수있는 것을 알 수 있습니다.
컨트롤러에서 ``set()`` 메소드를 사용하면, 뷰에 쓰기 특정 변수를 설정합니다.
뷰는 전달 된 모든 변수를 템플릿 범위에서 지역 변수로 사용 가능합니다.

이상  **/articles/tagged/funny** URL로 이동하여 ‘funny’와 태그 된 모든 기사(Articles)를 볼 수 있습니다.

태그 추가 환경 개선
================================

현재 새로운 태그를 추가하는 것은 번거로운 과정입니다. 작성자는 사용하고자하는 태그를 미리 작성해야합니다.
쉼표로 구분 된 텍스트 필드를 사용하여 태그 선택 UI를 개선 할 수 있습니다.
이렇게하면 사용자에게 더 나은 경험을 제공하고 ORM에서 더욱 뛰어난 기능을 사용할 수 있습니다.

계산 된 필드 추가
-----------------------

엔티티 서식 된 태그에 쉽게 액세스 할 수 있도록 가상/계산 필드를 엔티티에 추가 할 수 있습니다.
**src/Model/Entity/Article.php**에서 다음을 추가합니다. ::

    // 이 use 문을 네임 스페이스 선언 바로 아래에 추가하여
    // Collection 클래스를 가져옴
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

따라서 ``$article->tag_string``  계산 된 속성에 액세스 할 수 있습니다.
나중에 컨트롤이 등록 정보를 사용합니다.

Views 업데이트
------------------

엔티티가 업데이트되고, 태그의 새로운 개념을 추가했습니다
**src/Template/Articles/add.ctp**와 **src/Template/Articles/edit.ctp**의 중,
기존 태그 ``tags._ids`` 을 다음의 것과 바꿉니다. ::

    echo $this->Form->control('tag_string', ['type' => 'text']);

태그 문자열로 유지하기
-------------------------

기존의 태그를 문자열로 표시 할 수있게 되었기 때문에 그 데이터도 저장해야 합니다.
 ``tag_string``를 액세스 가능한 것으로 표시하기 때문에 ORM은 데이터 요청에서 엔티티에 복사합니다.
 ``beforeSave()`` 훅 메소드를 사용하여 태그 문자열을 분석하고 관련 엔티티를 검색/구축 할 수 있습니다.
src / Model / Table / ArticlesTable.php에 다음을 추가합니다::

    public function beforeSave($event, $entity, $options)
    {
        if ($entity->tag_string) {
            $entity->tags = $this->_buildTags($entity->tag_string);
        }

        // 다른 코드
    }

    protected function _buildTags($tagString)
    {
        // 태그 trim
        $newTags = array_map('trim', explode(',', $tagString));
        // 태그 전체 삭제
        $newTags = array_filter($newTags);
        // 중복태그 삭제
        $newTags = array_unique($newTags);

        $out = [];
        $query = $this->Tags->find()
            ->where(['Tags.title IN' => $newTags]);

        // 새로운 태그 리스트에서 기존태그를 삭제
        foreach ($query->extract('title') as $existing) {
            $index = array_search($existing, $newTags);
            if ($index !== false) {
                unset($newTags[$index]);
            }
        }
        // 기존 태그를 추가
        foreach ($query as $tag) {
            $out[] = $tag;
        }
        // 새로운 태그를 추가
        foreach ($newTags as $tag) {
            $out[] = $this->Tags->newEntity(['title' => $tag]);
        }
        return $out;
    }

기사를 작성하거나 편집 할 때 태그를 쉼표로 구분 된 태그 목록으로 저장하고 태그와 링크 레코드를 자동으로 생성 할 수 있도록 해야합니다.

이 코드는 지금까지의 방식보다 조금 복잡하지만 'CakePHP의 ORM이 얼마나 강력한가?'를 소개하는 데 도움이됩니다.
:doc:`/core-libraries/collections`의 메소드를 사용하여 쿼리 결과를 조작하거나 엔티티를 쉽게 생성 할 시나리오를 처리 할 수 있습니다.

다음은 :doc:`authentication </tutorials-and-examples/cms/authentication>` 을 추가해보겠습니다.