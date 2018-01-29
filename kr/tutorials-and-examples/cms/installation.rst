컨텐츠 관리 튜토리얼
############################

이 튜토리얼은 :abbr:`CMS (Content Management System)` 어플리케이션 작성입니다.
처음에는 CakePHP인스톨을 하고 데이터베이스 작성한 후　어플리케이션을 간단하게 구축하기 위해 CakePHP에서 제공하는 툴을 사용해봅시다.

필요한것:

1.데이터베이스 서버. 이 튜토리얼은 MySQL서버를 사용하려고 합니다. 그러므로 데이터베이스를 실행하려면 SQL에 대해 충분히 알고 있어야 합니다.
   MySQL를 사용하고 있기 때문에 PHP에서 ``pdo_mysql``을 활성화 했는지 확인 해주시길 바랍니다.
2.기초적인 PHP지식이 필요합니다.

시작하기 전에 PHP버전을 확인해 보겠습니다.

.. code-block:: bash

    php -v

최소사양 PHP |minphpversion| (CLI)이상이 설치 되어 있어야 합니다.

CakePHP 준비
==============

CakePHP를 설치하는 가장 쉬운 방법은 Composer를 사용하는 것입니다.
Composer는 터미널이나 명령 행 인터페이스(CLI)에서 CakePHP를 간단하게 설치할 수 있는 방법입니다.
먼저 Composer를 다운로드해서 설치합니다. cURL을 설치 한 경우 다음을 실행합니다.

.. code-block:: bash

    curl -s https://getcomposer.org/installer | php

아니면 `Composer 웹사이트 <https://getcomposer.org/download/>`_
에서 ``composer.phar``를 다운로드 할 수 있습니다.

그리고 인스톨한 디렉토리에서 아래의 명령어를 입력하면 **cms** 라는 디렉토리에 CakePHP어플리케이션을 인스톨 할 수 있습니다.

.. code-block:: bash

    php composer.phar create-project --prefer-dist cakephp/app cms

만약에 `Composer Windows Installer <https://getcomposer.org/Composer-Setup.exe>`_
를 다운로드 한 경우 설치 디렉토리(예: c:\Wamp\www\dev\cakephp3)에서 터미널에 다음을 입력합니다.

.. code-block:: bash

    composer self-update && composer create-project --prefer-dist cakephp/app cms

Composer의 장점은 올바른 파일권한이나 설정, **config/app.php** 파일작성등 이러한 것 들을 자동으로 생성해 줍니다.

CakePHP를 인스톨 할 수 있는 다른 방법도 있습니다. Composer를 사용하지 않는 경우
:doc:`/installation` 세션를 참고해 주시길 바랍니다.

CakePHP설치가 완료되면 디렉토리 설정은 아래와 같이 보일 것 입니다. ::

    /cms
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

CakePHP디렉토리 구성을 더 자세히 배우고 싶으시면
:doc:`/intro/cakephp-folder-structure` 세션을 참고해 주시길 바랍니다.

만약에 이 튜토리얼이 제대로 실행되지 않을 경우 `GitHub <https://github.com/cakephp/cms-tutorial>`_
에서 완성된 결과를 볼 수 있습니다.

인스톨 확인
===================

기본 홈 페이지를 확인해서 인스톨이 되있는지 확인 할 수 있습니다. 하지만 그전에 개발용 서버를 작동합니다.

.. code-block:: bash

    cd /path/to/our/app

    bin/cake server

.. note::

    윈도우에서는 ``bin\cake server`` (백 슬러쉬)를 사용합니다.

포트 8765에서 PHP 웹 서버를 작동합니다. 환영 페이지를 보려면 웹 브라우저에서 **http://localhost:8765** 로 확인하면
데이터베이스와 PHP설정 정보를 확인 할 수 있습니다.

다음은 :doc:`데이터베이스를 구축 </tutorials-and-examples/cms/database>` 을 해보도록 하겠습니다.
