북마크 튜토리얼
###########################

이 튜토리얼은 간단한 북마크를위한 응용 프로그램 (bookmarker)을 만듭니다.
처음은 CakePHP의 설치와 데이터베이스의 생성
그리고 응용 프로그램을 빠르게 구축하기 위한 CakePHP가 제공하는 도구를 사용합니다.

필요한 것:

#. 데이터베이스 서버. 이 튜토리얼에서는 MySQL 서버를 사용합니다.
   데이터베이스를 생성하기위한 SQL 지식이 필요합니다. CakePHP는 그것을 전제로하고 있습니다.
   MySQL을 사용하면 PHP에서``pdo_mysql``가 활성화되어 있는지 확인하시기 바랍니다.
#. 기본적인 PHP 지식.

시작하기 전에 최신 PHP 버전인지 확인하시기 바랍니다.

.. code-block:: bash

    php -v

최소한 PHP |minphpversion| (CLI) 이상을 설치합니다.
웹 서버의 PHP 버전 역시 |minphpversion| 이상이어야합니다.
그리고 명령 줄 인터페이스 (CLI) PHP 버전과 동일한 버전이 좋습니다.
전체 응용 프로그램을 확인하려면 `cakephp/bookmarker
<https://github.com/cakephp/bookmarker-tutorial>`__ 을 체크 아웃하시기 바랍니다.
그럼, 시작합시다!

CakePHP  취득
==============

가장 간단한 CakePHP의 설치 방법은 Composer를 사용하는 것입니다.
Composer는터미널이나 명령 프롬프트에서 CakePHP를 설치하는 간단한 방법입니다.
아직 준비가되지 않은 경우 먼저 Composer를 다운로드 및 설치해야합니다.
cURL이 설치되어 있으면, 다음과 같이 실행하는 것이 쉽습니다. ::

    curl -s https://getcomposer.org/installer | php

혹은 `Composer 웹사이트 <https://getcomposer.org/download/>`_
에서 ``composer.phar`` 를 다운로드 할 수 있습니다.

그리고 CakePHP 애플리케이션의 골격을 **bookmarker** 디렉토리에 설치하기 위해
설치 디렉토리에서 터미널에 다음 줄을 간단하게 입력합니다. ::

    php composer.phar create-project --prefer-dist cakephp/app bookmarker

`Composer Windows Installer <https://getcomposer.org/Composer-Setup.exe>`_
를 다운로드하여 실행하면 설치 디렉토리 (예 : C : \\ wamp \\ www \\ dev \\ cakephp3)
에서 터미널에 다음 줄을 입력합니다. ::

    composer create-project --prefer-dist cakephp/app bookmarker

Composer를 사용하는 메리트는 올바른 파일 권한 설정, **config/app.php**
파일의 작성 등과 같이 자동으로 전체 설치를 해주는 것입니다.

CakePHP를 설치하는 다른 방법이 있습니다. Composer를 사용하고 싶지 않다면,
:doc:`/installation`  섹션을 참조하시기 바랍니다.

CakePHP의 다운로드와 설치 방법에 관계없이 일단 설치가 완료되면
디렉토리 구조는 다음과 같습니다. ::

    /bookmarker
        /bin
        /config
        /logs
        /plugins
        /src
        /tests
        /tmp
        /vendor
        /webroot
        .editorconfig
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

CakePHP의 디렉토리 구조가 어떻게 작동하는지 배울 수있는 좋은 기회가 될 수 있습니다.
:doc:`/intro/cakephp-folder-structure` 섹션을 참조하시기 바랍니다.

인스톨 확인
===================

기본 홈페이지를 확인하여 설치가 올바른지 대충 확인할 수 있습니다.
그 전에 개발 서버를 시작해야합니다. ::

    bin/cake server

.. note::

    Windows에서이 명령은 ``bin\cake server`` (백 슬래시)입니다.

이제 8765 포트에서 PHP의 내장 웹 서버를 시작합니다. 시작 페이지를보기 위하여
**http://localhost:8765** 를 웹 브라우저에서 엽니다. CakePHP가 데이터베이스 연결
가능 여부 제외한 모든 확인 사항이 확인 되어야합니다. 그렇지 않으면, PHP 확장의
추가 설치 및 디렉토리 권한 설정이 필요 할지도 모릅니다.

데이터베이스 작성
===================

다음 북마크 응용 프로그램 데이터베이스를 설치합시다.
아직 설치하지 않은 경우, 예를 들어 ``cake_bookmarks`` 처럼 좋아하는 이름으로
이 튜토리얼로 사용하는 빈 데이터베이스를 작성합니다. 필요한 테이블을 작성하기 위해
다음 SQL을 실행 할 수 있습니다. ::

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(50),
        description TEXT,
        url TEXT,
        created DATETIME,
        modified DATETIME,
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    );

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    );

    CREATE TABLE bookmarks_tags (
        bookmark_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (bookmark_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY bookmark_key(bookmark_id) REFERENCES bookmarks(id)
    );

복합 기본 키를 가진 ``bookmarks_tags`` 테이블을 확인해 봅니다.
CakePHP는 복합 기본 키를 지원합니다.
그로 인해 멀티 테넌트(Multi-Tenant) 애플리케이션의 구축이 쉬워집니다.

데이터베이스 설정
===================

다음은 어디 데이터베이스 있는지 그리고 어떻게 테이터베이스에 연결하는 방법을 CakePHP에 전합니다.
아마도 이것이 어떤 설정이 필요한 처음이자 마지막입니다.

이 설정은 매우 간단합니다. 당신의 설정을 적용하기 위해 **config/app.php**
파일의 ``Datasources.default`` 배열의 값을 대체합니다.
전체 설정 배열의 예는 다음과 같습니다. ::

    return [
        // More configuration above.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_bookmarks',
                'encoding' => 'utf8',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // More configuration below.
    ];

**config/app.php** 파일을 저장하고 'CakePHP is able to connect to the database'
이 체크되어 있는지 확인하시기 바랍니다.

.. note::

    CakePHP의 기본 설정 파일은**config/app.default.php**에 있습니다.

Scaffold 코드 작성
=====================

데이터베이스가 CakePHP의 명명 규칙에 따르고 있으므로 기본적인 응용 프로그램을
빠르게 생성하기 위해  :doc:`bake 콘솔 </bake/usage>` 응용 프로그램을 사용할 수 있습니다.
명령 줄에서 다음 명령을 실행합니다. ::

    // Windows 에서는 bin\cake 을 사용함
    bin/cake bake all users
    bin/cake bake all bookmarks
    bin/cake bake all tags

이것은 users bookmarks, tags 자원을위한 컨트롤러, 모델, 뷰,
이에 해당하는 테스트 케이스, 픽스처를 생성합니다. 서버가 정지하고있는 경우
다시 시작하고 **http://localhost:8765/bookmarks** 로 이동합니다.

응용 프로그램의 데이터베이스 테이블에 데이터 액세스를 제공하는 기본이지만 기능적인
응용 프로그램을확인합니다.
북마크 목록을 표시하고 일부 사용자, 북마크, 태그를 추가하시기 바랍니다.

패스워드 해시 추가
========================

(**http://localhost:8765/users** 에 액세스하여)
사용자를 생성 할 때 암호가 일반 텍스트로 저장될 것입니다.
이것은 보안의 관점에서 매우 좋지 않으므로 수정합시다.

이것은 또한 CakePHP의 모델 계층을 설명하는 좋은 기회입니다.
CakePHP는 객체의 집합과 다른 클래스의 단일 개체를 조작하는 방법을 나누고 있습니다.
엔티티의 집합은 ``Table``  클래스 내에 포함 된 하나의 레코드에 포함 된 기능은
``Entity``  클래스에 저장됩니다.

예를 들어, 암호 해시는 개별 레코드에서 열린 엔티티 객체에 이 동작을 구현합니다.
암호가 설정 될 때마다 해시설정을 해야하기 때문에
변경자 (mutator) 메소드와 setter 메소드를 사용합니다. CakePHP는 약관에 따라
엔티티의 하나로 등록 정보를 설정하는 세터 메소드를 호출합니다.
비밀번호 세터는 **src/Model/Entity/User.php** 에
다음을 추가하시기 바랍니다. ::

    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher; // 이 부분을 추가
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // bake로 생성한 코드

        protected function _setPassword($value)
        {
            $hasher = new DefaultPasswordHasher();
            return $hasher->hash($value);
        }
    }

지금부터 기존의 사용자 암호를 수정합니다.
암호를 변경했을 때, 목록 또는 세부 페이지에서입력 한 값 대신 해시 된 암호가 있는지 확인합니다.
CakePHP는기본적으로`bcrypt <http://codahale.com/how-to-safely-store-a-password/>`_ 를 사용하여 암호를 해시합니다.
기존 데이터베이스가 실행중인 경우 sha1와 md5도사용할 수 있습니다.

.. note::

      암호 해시 지정이 안되있을 경우 세터 함수 이름 지정하고
      클래스의 비밀번호 멤버와 대소 문자가 동일한지 확인하시기 바랍니다.

태그를 지정해서 북마크를 취득
=================================

이제 암호를 안전하게 저장하여 응용 프로그램에 다양한 기능을 구축 할 수 있습니다.
일단 북마크 컬렉션을 모아 태그에서 검색 할 수있게되면 편리합니다.
다음은 태그에서 책갈피를 검색하기 위해 루트 컨트롤러의 액션, finder 메소드를 구현합니다.

이상적으로는 **http://localhost:8765/bookmarks/tagged/funny/cat/gifs** 같은 URL이 되겠습니다.
이 URL은 'funny', 'cat'또는 'gifs' 태그 북마크 모든 것을 검색하는 것을 의도하고 있습니다.
이를 구현하기 전에 새로운 루트를 추가합니다.
**config/routes.php** 을 다음과 같이합니다. ::

    <?php
    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\Router;

    Router::defaultRouteClass(DashedRoute::class);

    // 새로운 루트를　tagged 액션을 위해 추가함
    // 마지막 '*' 는 전달 된 인수를 가지고 있는지
    // CakePHP에게 전함
    Router::scope(
        '/bookmarks',
        ['controller' => 'Bookmarks'],
        function ($routes) {
            $routes->connect('/tagged/*', ['action' => 'tags']);
        }
    );

    Router::scope('/', function ($routes) {
        // 기봄 홈과 /pages/* 루트에 접속
        $routes->connect('/', [
            'controller' => 'Pages',
            'action' => 'display', 'home'
        ]);
        $routes->connect('/pages/*', [
            'controller' => 'Pages',
            'action' => 'display'
        ]);

        // 기본루트에 접속
        $routes->fallbacks();
    });

위는 **/bookmarks/tagged/** 경로를 ``BookmarksController::tags()`` 에 연결
새로운 '루트' 를 정의합니다. 경로를 정의하게 잘하여 URL의 모습과
그들은 어떻게 구현되었는지를 분리 할 수 있습니다.
**http://localhost:8765/bookmarks/tagged**에 액세스하는 경우 CakePHP에서
컨트롤러의 액션이없는 것을 전하는 유용한 오류 페이지가 표시됩니다.
지금부터 존재하지 않는 메소드를 구현해보겠습니다. **src/Controller/BookmarksController.php**
다음을 추가하시기 바랍니다. ::

    public function tags()
    {

        // CakePHP에서 제공 한 'pass'키는 모든
        // 요청에 전달 된 URL 경로 세그먼트
        $tags = $this->request->getParam('pass');

        //태그 북마크를 찾기 위해 BookmarksTable 를 사용
        $bookmarks = $this->Bookmarks->find('tagged', [
            'tags' => $tags
        ]);

        // 뷰 템플릿에 변수를 전달함
        $this->set([
            'bookmarks' => $bookmarks,
            'tags' => $tags
        ]);
    }

요청 데이터의 다른 부분에 액세스하려면 :ref:`cake-request` 섹션을 참고하시기 바랍니다.

Finder 메소드 작성
----------------------

CakePHP에서 컨트롤러의 액션을 슬림하게 유지하면서 응용 프로그램의 많은 로직을
모델에 두는 것이 좋습니다. **/bookmarks/tagged** 의 URL에 액세스하는 경우
``findTagged()`` 메소드가 아직 구현되지 않은 오류가 표시됩니다.
**src/Model/Table/BookmarksTable.php** 에 다음을 추가하시기 바랍니다. ::

    // $query 인수는 쿼리 빌더의 인스턴스
    // $options 배열은 컨트롤러의 액션 중에서 find ( 'tagged')에 전달
    //  'tag'옵션이 포함되어있음
    public function findTagged(Query $query, array $options)
    {
        $bookmarks = $this->find()
            ->select(['id', 'url', 'title', 'description']);

        if (empty($options['tags'])) {
            $bookmarks
                ->leftJoinWith('Tags')
                ->where(['Tags.title IS' => null]);
        } else {
            $bookmarks
                ->innerJoinWith('Tags')
                ->where(['Tags.title IN ' => $options['tags']]);
        }

        return $bookmarks->group(['Bookmarks.id']);
    }

:ref:`커스텀 Finder 메서드 <custom-find-methods>` 을 구현했습니다.
이것은 재사용 가능한 쿼리를 정리하는 것을 실현하는 CakePHP의 매우 강력한 개념입니다.
Finder 메소드는 항상 :doc:`/orm/query-builder` 개체 및 옵션 배열을 매개 변수로 가져옵니다.
Finder 메소드는 쿼리를 조작하여 임의의 필수 조건과 조건을 추가 할 수 있습니다.
완료되면 Finder 메소드는 수정 된 쿼리 개체를 반환해야합니다.
finder에서 일치하는 태그가있는 특정 책갈피를 검색하기 위해
``innerJoinWith()``, ``where()`` 그리고 ``group`` 메소드를 사용합니다.
태그의 지정이없는 경우, 태그없이 북마크를 검색하기 위해 ``leftJoinWith()`` 를 사용하여
'where'조건을 변경합니다.

뷰 작성
-------------

**/bookmarks/tagged** 의 URL에 액세스하면 CakePHP는 뷰 파일이 없는지 알리는 오류를 표시합니다.
그런 다음보기 파일을 ``tags()`` 행동에 대한 만듭니다.
**src/Template/Bookmarks/tags.ctp** 아래 내용을 추가합니다. ::

    <h1>
        Bookmarks tagged with
        <?= $this->Text->toList(h($tags)) ?>
    </h1>

    <section>
    <?php foreach ($bookmarks as $bookmark): ?>
        <article>
            <!-- 링크를 만드는데 HtmlHelper를 사용 -->
            <h4><?= $this->Html->link($bookmark->title, $bookmark->url) ?></h4>
            <small><?= h($bookmark->url) ?></small>

            <!-- 텍스트를 형성하기 위해 TextHelper를 사용-->
            <?= $this->Text->autoParagraph(h($bookmark->description)) ?>
        </article>
    <?php endforeach; ?>
    </section>

위의 코드는 :doc:`/views/helpers/html` 과 :doc:`/views/helpers/text` 을
뷰의 출력 생성을 보조하기 위해 사용했습니다. 또한 HTML 인코딩 출력하기 위해
:php:func:`h`  바로 가기 기능을 사용했습니다. HTML 삽입 문제를 방지하기 위해
사용자 데이터 출력시에는 반드시 ``h()`` 를 사용하는 것을 기억하시기 바랍니다.

뷰 템플릿 파일을위한 CakePHP의 규약에 따라 **tags.ctp** 파일을 만들었습니다.
이 약관은 문자를 사용하여 컨트롤러의 액션 이름을 밑줄 화 된 템플릿 이름을 사용하는 것입니다.

보기에서 ``$tags`` 과 ``$bookmarks`` 변수를 사용할 것을 알 것입니다.
컨트롤러에서 ``set()`` 메소드를 사용하여 지정된 변수를 뷰에 쓰기 위해 설정합니다.
뷰는 전달 된 모든 변수를 템플릿 내에서 로컬 변수로 이용 가능합니다.

**/bookmarks/tagged/funny** 의 URL에 액세스 할 수 있도록하여
모든 'funny'태그 된 북마크를 확인합니다.

여기까지 북마크, 태그, 사용자를 관리하는 기본적인 응용 프로그램을 만들어 봤습니다.
그러나 모든 태그가 모든 사람에게 보일 것 입니다.
다음 장에서는 인증을 구현하고 현재 사용자에 속하는 책갈피 만 표시하도록 제한합니다.

당신의 응용 프로그램의 구축을 계속하기 위해서
:doc:`/tutorials-and-examples/bookmarks/part-two` 를 읽고 하거나
CakePHP에서 할 수있는 것을 :doc:`문서에서 </topics>` 더 자세히 배우시기 바랍니다.
