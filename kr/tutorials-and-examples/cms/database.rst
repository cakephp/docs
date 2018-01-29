CMS 튜터리얼 데이터베이스 작성
#####################################

이제 CakePHP가 설치되었으므로 :abbr:`CMS (Content Management System)` 어플리케이션을 위한 데이터베이스 셋업을 해보겠습니다.
아직 셋업을 하지않았다면 cake_cms 와같이 사용하고 싶은 이름을 설정할 수 있습니다.
이 튜터리얼에 사용할 데이터베이스를 만들고 필요한 테이블을 작성하기 위해 아래의 SQL를 실행해 주시길 바랍니다. ::

    USE cake_cms;

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(191) NOT NULL,
        body TEXT,
        published BOOLEAN DEFAULT FALSE,
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (slug),
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    ) CHARSET=utf8mb4;

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(191),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    ) CHARSET=utf8mb4;

    CREATE TABLE articles_tags (
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY article_key(article_id) REFERENCES articles(id)
    );

    INSERT INTO users (email, password, created, modified)
    VALUES
    ('cakephp@example.com', 'sekret', NOW(), NOW());

    INSERT INTO articles (user_id, title, slug, body, published, created, modified)
    VALUES
    (1, 'First Post', 'first-post', 'This is the first post.', 1, now(), now());

``articles_tags`` 테이블에 복합 기본키가 사용 된 것을 확인 할 수 있습니다.
CakePHP는 거의 모든 곳에서 복합 기본 키를 지원하므로 추가 ``id`` 컬럼이 필요없는 간단한 스키마를 가질 수 있습니다.

우리가 사용한 테이블이나 컬럼 이름은 임의적이지 않습니다. CakePHP의 :doc:`명명규칙 </intro/conventions>` 을 사용함으로써 CakePHP를 보다 효과적으로 활용하고 프레임 워크를 구성 할 필요가 없습니다.
CakePHP는 거의 모든 데이터베이스 스키마를 충분히 수용 할 수있지만 CakePHP가 기본 값을 제공 하기 때문에 시간을 절약 할 수 있습니다.

데이터베이스 구성
===================

다음으로, CakePHP에서 데이터베이스가 어디에 있는지, 어떻게 연결하는지 설명 해 보겠습니다.
**config/app.php** 파일의 ``Datasources.default`` 배열에있는 값을 설정에 적용되는 값으로 바꿉니다.
완료된 구성 배열의 샘플은 다음과 같습니다. ::

    <?php
    return [
        // 上には他の設定があります
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_cms',
                'encoding' => 'utf8mb4',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // 아래에는 다른 설정이 있습니다.
    ];

**config/app.php**  파일을 저장하면 'CakePHP가 데이터베이스에 연결할 수 있습니다.

.. note::

    CakePHP의 기본 설정 파일은 **config/app.default.php** 에 있습니다.

첫 번째 모델 만들기
========================

모델은 CakePHP 어플리케이션의 핵심입니다. 모델에서 데이터를 읽고 편집 할 수 있습니다.
그리고 데이터 간의 관계를 구축하고, 데이터를 검증하고, 애플리케이션 규칙을 적용 할 수 있습니다.
모델은 컨트롤러 액션과 템플릿을 구축하는데 필요한 기반을 구축합니다.

CakePHP의 모델은 ``Table``과 ``Entity`` 객체로 구성됩니다. ``Table`` 객체는 특정 테이블에 저장된 엔터티 컬렉션에 대한 액세스를 제공합니다.
이들은 **src/Model/Table** 에 저장됩니다.
우리가 만들고있는 파일은 **src/Model/Table/ArticlesTable.php** 에 저장 될 것입니다.
완성 된 파일은 다음과 같아야 합니다. ::

    <?php
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

이 테이블에 ``created`` 와 ``modified`` 컬럼을 자동으로 갱신하는 :doc:`/orm/behaviors/timestamp` 를 추가 했습니다.
테이블 객체를 ``ArticlesTable`` 라는 이름으로 지정하고, CakePHP는 모델이 ``articles`` 테이블을 사용한다는 것을 알기 위해 명명 규칙을 사용할 수 있습니다.
CakePHP는 또한 ``id`` 컬럼이 테이블의 기본 키임을 알기 위해서 규칙을 사용합니다.

.. note::

    **src/Model/Table** 에서 해당 파일을 찾을 수 없다면 CakePHP는 동적으로 모델 객체를 생성합니다.
    이것은 실수로 파일의 이름을 잘못 지정하면 (예 : articlestable.php 또는 ArticleTable.php) CakePHP가 설정을 인식하지 못하고 대신 생성 된 모델을 사용한다는 것을 의미합니다.

그리고 Article Entity 클래스를 작성합니다. 엔티티는 데이터베이스의 단일 레코드를 나타내며 데이터에 대한 행 과 비슷한 동작을 제공합니다.
엔티티는 **src/Model/Entity/Article.php** 에 저장됩니다.
완성 된 파일은 다음과 같아야합니다. ::

    <?php
    // src/Model/Entity/Article.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            '*' => true,
            'id' => false,
            'slug' => false,
        ];
    }

엔티티는 현재 매우 슬림하고 :ref:`entities-mass-assignment` 으로 속성을 편집 하는 방법을 제어하는 ``_accessible`` 속성 만 설정했습니다.
지금 당장은 모델을 많이 사용할 수 없으므로 첫 번째 :doc:`컨트롤러와 템플릿 </tutorials-and-examples/cms/articles-controller>`을 만들어 모델과 상호 작용할 수 있도록 하겠습니다.
