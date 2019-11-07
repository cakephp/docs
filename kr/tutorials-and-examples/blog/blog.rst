블로그 튜토리얼
####################

이번 튜토리얼은 간단한 블로그 응용 프로그램을 만드는 과정을 소개하겠습니다.
먼저 CakePHP를 설치하고 데이터베이스를 만듭니다.
그리고 블로그 게시물을 일람표 (*list*), 추가 (*add*), 수정 (*edit*) 및 삭제 (*delete*) 할 수있는 응용 프로그램 로직을 만들겠습니다.

필요한 것:

#. 웹 서버.
    실행중인 웹 서버가 Apache를 사용하고 있다는 전제이지만
    다른 종류의 서버일 경우 서버의 설정 조금 바꾸는 것 이외에는 크게 다르지 않습니다.
    대부분 그대로 설정 CakePHP를 작동시킬 수 있습니다. PHP |minphpversion| 이상을 실행하고 있는지,
    그리고 PHP에서 ``mbstring`` 와 ``intl`` 가 활성화되어 있는지 확인하시기 바랍니다.

#. 데이터베이스 서버.
    이 튜토리얼에서는 MySQL을 사용합니다.
    데이터베이스를 만들 수있을 정도의 SQL 지식이 필요합니다. 그 앞은 CakePHP가 확인해 줍니다.
    MySQL을 사용하기 때문에 PHP에서 ``pdo_mysql`` 가 활성화 되어 있는지
    확인하시기 바랍니다.

#. PHP기본 지식.

#. 마지막으로 MVC 프로그래밍 패턴에 대한 기본 지식이 필요합니다.
   간략한 내용은 :doc:`/cakephp-overview/understanding-model-view-controller` 에서 확인 할 수 있습니다.

그럼 시작해보겠습니다.

CakePHP 다운로드
================

그럼 CakePHP 최신 버전을 다운로드 해보겠습니다.

CakePHP 최신 버전은 GitHub에 있는 CakePHP프로젝트를 보겠습니다.
`https://github.com/cakephp/cakephp/tags <https://github.com/cakephp/cakephp/tags>`_
그리고 최신 버전을 다운로드 합니다.

또는 `git <http://git-scm.com/>`_ 를 사용해서 리포지토리를 clone도 가능합니다. ::

    git clone -b 2.x git://github.com/cakephp/cakephp.git

어떤걸 하시든 다운로드한 코드를 DocumentRoot에 설정해줍니다.
그러면 디렉토리 구성은 다음과 같습니다. ::

    /path_to_document_root
        /app
        /lib
        /plugins
        /vendors
        .htaccess
        index.php
        README

CakePHP 디렉토리 구성을 배워보겠습니다.
:doc:`/getting-started/cakephp-folder-structure` 세션을 확인해주시기 바랍니다.

Tmp 디렉토리 권한
=================

다음은 ``app/tmp`` 디렉토리를 웹 서버에서 쓸 수 있도록 설정합니다.
이를위한 가장 좋은 방법은 웹 서버를 작동시켜 사용자를 찾을 수 있습니다.
다음 코드 ``<? php echo exec ( 'whoami');?>`` 를 임의의 PHP 파일에 작성하여
웹 서버에서 실행합니다. 그러면 웹 서버를 실행하는 사용자의 이름이
표시되는 것입니다. 사용자에 ``app/tmp`` 디렉토리의 소유권을 변경합니다.
실행 명령 (\*nix에서) 다음과 같습니다. ::

    $ chown -R www-data app/tmp

어떤 이유로 CakePHP가 그 디렉토리에 쓸 수 없는 경우 캐시 된 데이터가
쓸 수 없다는 경고나 예외가 표시됩니다.

블로그 데이터 베이스 작성
=========================

다음 블로그에서 사용하는 기초적인 데이터베이스를 설치합시다.
데이터베이스를 아직 작성하지 않은면이 튜토리얼에서 사용할 데이터베이스를 작성해야합니다.
이 페이지에서 게시물을 저장하기위한 테이블을 하나 만듭니다.
다음 SQL 데이터베이스에서 실행하겠습니다.

.. code-block:: mysql

    # posts 테이블 작성
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    # 테스트로 쓸 기사를 insert함
    INSERT INTO posts (title,body,created)
        VALUES ('제목', '기사본문 입니다.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('다른 제목', '본문을 씁니다.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('또 다른 제목', '다른 본문을 쓸 수 있습니다.', NOW());

테이블 이름과 필드 이름은 완벽하지 않을 수 있습니다. CakePHP의 데이터베이스 명명 규약 및
클래스의 명명 (:doc:`/getting-started/cakephp-conventions` 을 참고)을 준수하면 문제없이 사용할 수 있습니다.
CakePHP는 유연한 때문에 기존 데이터베이스 스키마도 대응 할 수 있지만 약관에 따르면 시간을 절약 할 수 있습니다.

자세히는 :doc:`/getting-started/cakephp-conventions` 를 참고하시기 바랍니다.
간단히 말해서 'posts' 와 같은 이름은 자동으로 포스트 모델에 연결되고 'modified' 와
'created' 와 같은 필드가 있을 때 자동적으로 CakePHP가 관리되는 것처럼 보입니다.

CakePHP 데이터 베이스 설정
==========================

데이터베이스가 어디에 있고 어떻게 연결 하는지를 CakePHP에게 알려줘야 합니다.

CakePHP의 데이터베이스 설정 파일 원본은 ``app/Config/database.php.default`` 에 있습니다.
동일한 디렉토리에 ``database.php`` 라는 이름으로 파일을 복사합니다.

설정 파일은 간단해야 합니다. ``$default`` 배열의 값을 자신의 설정에 맞게 변경하면됩니다.
전체 설정의 배열의 예는 다음과 같습니다. ::

    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => 'utf8'
    );

새로만든 ``database.php`` 파일은 저장하고 브라우저를 보면 CakePHP welcome페이지를 확인 할 수 있습니다.
또한 데이터 베이스 연결과 함께 성공적으로 연결되었다고 알려줍니다.

.. note::

   PDO가 있어야하고 php.ini에서 pdo_mysql이 활성화되어 있어야합니다.

추가 설정
==============

구성 할 수있는 몇 가지 다른 항목이 있습니다.
대부분의 개발자는 여러 항목을 같이 구성하지만 이 튜터리얼에서는 필수 항목이 아닙니다.
그중에 하나는 보안 해시에 사용할 사용자 지정 문자열 (또는 'salt')을 정의하는 것입니다.
두 번째는 암호화에 사용할 사용자 지정 번호 (또는 'seed')를 정의하는 것입니다.

보안 salt는 해시 생성에 사용됩니다. ``/app/Config/core.php`` 에서 기본 ``Security.salt`` 값을 변경합니다.
대체 값은 길어야하며 추측하기 어렵고 무작위로 작성해야합니다. ::

    /**
     * A random string used in security hashing methods.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');


암호화 시드(*cipher seed*)는 암호화/복호화 문자열에 사용됩니다. ``/app/Config/core.php`` 를 수정하여 기본 ``Security.cipherSeed`` 값을 변경합니다.
대체 값은 큰 임의의 정수이여야합니다. ::

    /**
     * A random numeric string (digits only) used to encrypt/decrypt strings.
     */
    Configure::write('Security.cipherSeed', '7485712659625147843639846751');

mod_rewrite에 관해서
====================

때로는 새로운 사용자가 mod_rewrite 로 실행됩니다.
예를 들어 CakePHP 환영 페이지가 약간 부족한 것처럼 보이면 (이미지 나 CSS 스타일이 없음) 아마도 mod_rewrite가 시스템에서 작동하지 않는다는 것을 의미합니다.
웹 서버를 다시 시작하기 위해 URL 재 작성에 대한 아래 섹션 중 하나를 참조하시기 바랍니다.

이제 CakePHP 응용 프로그램을 구축하기위해 :doc:`/tutorials-and-examples/blog/part-two`
를 계속 읽어주시기 바랍니다.

.. meta::
    :title lang=kr: Blog Tutorial
    :keywords lang=kr: model view controller,object oriented programming,application logic,directory setup,basic knowledge,database server,server configuration,reins,documentroot,readme,repository,web server,productivity,lib,sql,aim,cakephp,servers,apache,downloads
