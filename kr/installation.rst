인스톨
############


CakePHP는 빠르고 간단하게 설치할 수 있습니다.
최소한의 구성으로 필요한 것은 웹서버와 CakePHP의 복사, 이 두가지 입니다.
이 항목에서는 주로 Apache에서의 셋업에 초점을 두고 있지만
CakePHP는 nginx나 lighttpd, Microsoft IIS와 같은 여러가지 웹서버에서 동작합니다.

시스템 요구사항
============

- HTTP 서버. 예: Apache。mod\_rewrite를 추천하지만 필수는 아닙니다.
- PHP |minphpversion| 이상 (PHP 7.1도 포함)
- mbstring PHP 확장
- intl PHP 확장
- simplexml PHP 확장

.. note::

    XAMPP / WAMP 중 어느쪽이라도 mcrypt확장, mbstring확장 둘 다 초기 인스톨 상태에서 동작합니다.
    XAMPP 에서는 intl확장은 포함되어 있지만, **php.ini** 의 ``extension=php_intl.dll``
    의 커멘트를 분리하여 XAMPP 컨트롤 패널에서 서버의 재기동을 할 필요가 있습니다.

    WAMP에서 intl확장은 처음부터 액티브로 되어있지만 동작은 하지않습니다.
    동작 시키기위해서는 php디렉토리 (초기상태에서는 **C:\\wamp\\bin\\php\\php{version}** ) 에 있는
    **icu*.dll** 라는 파일을 모두 apache의 bin디렉토리
    ( **C:\\wamp\\bin\\apache\\apache{version}\\bin** ) 에 복사한 뒤에
    전체 서비스를 재기동하면 동작하게 됩니다.

데이터베이스 엔진은 필수는 아니지만 대부분의 어플리케이션은 데이터베이스를 활용한다고 할 수 있습니다.
CakePHP는 여러가지 데이터베이스, 스토리지 엔진을 서포트하고 있습니다.

-  MySQL (5.1.10 이상)
-  PostgreSQL
-  Microsoft SQL Server (2008 이상)
-  SQLite 3

.. note::

    내장 드라이버는 모두 PDO가 필요합니다.
    알맞는 PDO 확장 모듈이 설치되어 있는지 반드시 확인해주세요.

CakePHP 설치
======================

시작하기 전에 PHP가 최신버전인지 확인해주세요.

.. code-block:: bash

    php -v

PHP |minphpversion| (CLI) 이상이 설치되어 있어야 합니다.
웹 서버의 PHP 또한  |minphpversion| 이상이어야 하며,
커멘드라인 인터페이스(CLI)와 같은 버전을 사용해주세요.


Composer 설치
-----------------------

CakePHP 공식 설치 방법은 의존성 관리툴
`Composer <http://getcomposer.org>`_ 을 사용합니다.

- 리눅스나 macOS에 Composer를 설치

  #. `공식 Composer 문서 <https://getcomposer.org/download/>`_ 에 기재된 내용대로
     인스톨러 스크립트를 실행하여 Composer를 설치하기 위한 지시를 따라주세요.
  #. composer.phar 를 지정한 경로의 디렉토리에 옮기기 위하여 아래의 명령어를 실행해주세요. ::

       mv composer.phar /usr/local/bin/composer

- Windows에 Composer를 설치

  Windows 환경이라면 `여기 <https://github.com/composer/windows-setup/releases/>`__ 에서
  Windows 인스톨러를 다운로드할 수 있습니다. Composer의 Windows 인스톨러에 대해 상세한 내용은
  `README <https://github.com/composer/windows-setup>`__ 를 확인해주세요.

CakePHP 프로젝트를 생성
--------------------------

이상으로 Composer 다운로드와 설치가 완료되었습니다. my_app_name 디렉토리에
CakePHP의 새로운 어플리케이션을 생성해주세요. 아래의 composer 명령어를 실행하여 생성합니다.

.. code-block:: bash

    php composer.phar create-project --prefer-dist cakephp/app my_app_name

または Composer にパスが通っているのであれば下記のコマンドも使えます。
또는 Composer로 경로가 되어 있다면 아래의 명령어도 사용할 수 있습니다.

.. code-block:: bash

    composer self-update && composer create-project --prefer-dist cakephp/app my_app_name

한 번 Composer가 어플리케이션의 양식과 코어 라이브러리를 다운로드 하면
설치한 CakePHP 어플리케이션을 Composer로 조작 가능하도록 해두어야 합니다.
반드시 composer.json 과 composer.lock 파일은 남겨둡시다.

이것으로 설치한 CakePHP 어플리케이션에 엑세스하여 디폴트 초기페이지를 볼 수 있게 됩니다.
이 페이지의 내용을 변경하려면 **src/Template/Pages/home.ctp** 를 수정해주세요.

composer에 의한 설치를 권장하지만
`Github <https://github.com/cakephp/cakephp/tags>`__
에는 사전 설치 버전도 있습니다.
이 파일에는 어플리케이션의 양식과 벤더 패키지 전체가 포함되어 있습니다.
또한 ``composer.phar`` 도 포함되어 있으므로, 한층더 폭 넓은 사용을 위한 필요한 것을
모두 갖추고 있습니다.

CakePHP 변경에 맞춰 최신 상태를 유지
----------------------------------------

디폴트로 어플리케이션의 **composer.json** 는 아래와 같이 되어있습니다. ::

    "require": {
        "cakephp/cakephp": "3.5.*"
    }

사용자가 ``php composer.phar update`` 를 실행할 때마다 이 마이너버전의
패치 릴리즈가 업데이트 됩니다. 대신에 ``^3.5`` 를 변경하여, ``3.x`` 브런치의
최신 안정 버전 마이너릴리즈를 받을 수도 있습니다.

만약 CakePHP를 릴리즈 전 최신상태로 유지하고 싶다면 어플리케이션의
**composer.json** 에 패키지 버전으로  **dev-master** 를 지정해주세요. ::

    "require": {
        "cakephp/cakephp": "dev-master"
    }

이 방법은 다음 메이저 버전이 릴리즈될 때에 어플리케이션이
동작하지 않게 될 가능성이 있으므로 권장하지 않으니 주의해주세요.
더불어 composer 는 개발 브런치를 캐시하지 않으므로 composer 에 의해
연속적인 설치, 업데이트는 시간이 다소 소요될 수 있습니다.

Oven을 사용한 설치
---------------------------

CakePHP를 신속하게 설치하기 위한 별도의 방법은 `Oven <https://github.com/CakeDC/oven>`_ 입니다.
이것은 필요한 시스템 요건을 체크, CakePHP 어플리케이션의 뼈대를 설치, 그리고
개발 환경을 셋업하는 간단한 PHP 스크립트 입니다.

설치가 완료되면 CakePHP 어플리케이션은 곧바로 사용할 수 있습니다!

.. note::

    중요: 이것은 디플로이 스크립트는 아닙니다. 처음으로 CakePHP를 설치하는 개발자를 돕고
    개발 환경을 신속하게 셋업하는 것이 목적입니다. 실제 운영 환경에서는 파일의 권한,
    가상 호스트 설정 등, 몇 가지의 요인을 고려할 필요가 있습니다.

권한 (permission)
==============

CakePHP는 몇가지 조작을 위해 **tmp** 디렉토리를 사용합니다.
모델의 정의나 뷰의 캐쉬, 그리고 세션 정보 등입니다.
**logs** 디렉토리는 디폴트인 ``FileLog`` 엔진이 로그파일을
출력하기 위해 사용됩니다.

그렇기 때문에 CakePHP를 설치하면 **logs**, **tmp** 디렉토리와
전체 이하 전체 디렉토리에 웹 서버의 실행 유저에 의한 쓰기 권한이 있는지를
반드시 확인해 주세요. composer에 의한 설치 처리에서는 되도록 빠르게 동작하도록
**tmp** 폴더와 이하 전체 서브 디렉토리에 모든 유저에 쓰기 권한을 부여하지만
이것을 웹 서버의 실행 유저에게만 쓰기 권한을 부여하도록 설정하면
보다 안전한 보안 상태로 할 수 있습니다.

자주 있는 문제점으로는 **logs** 와 **tmp** 디렉토리와 그 이하 서브디렉토리는
웹 서버와 커멘드 라인 유저 모두 쓰기 권한이 필요한 경우도 있습니다.
UNIX 시스템상에서 웹 서버 유저와 커멘드라인 유저가 다른 경우
권한 프로퍼티 설정을 확보하기 위해 프로젝트의 어플리케이션 디렉토리에서 아래의 명령어를 한 번 실행해 주세요.

.. code-block:: bash

    HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
    setfacl -R -m u:${HTTPDUSER}:rwx tmp
    setfacl -R -d -m u:${HTTPDUSER}:rwx tmp
    setfacl -R -m u:${HTTPDUSER}:rwx logs
    setfacl -R -d -m u:${HTTPDUSER}:rwx logs

CakePHP 콘솔 툴을 사용하기 위해서는 ``bin/cake`` 파일을
실행 가능하게 할 필요가 있습니다. \*nix 또는  macOS상에서는 아래의 명령어를 실행해주세요.
.. code-block:: bash

    chmod +x bin/cake

Windows 상에서는 **.bat** 파일은 이미 실행 가능하도록 되어 있을것입니다. 만약 Vagrant 또한
그 밖의 가상 환경을 사용하고 있는 경우, 공유 디렉토리가 실행 가능한 권한으로
공유될 필요가 있습니다. (설정방법은 가상 환경의 문서를 확인해주세요.)

만약 어떠한 이유로  ``bin/cake`` 파일 권한을 변경할 수 없는 경우
CakePHP 콘솔은 아래와 같이 실행할 수 있습니다.

.. code-block:: bash

    php bin/cake.php

개발 서버
============

개발용 설치는 CakePHP를 가장 빠르게 설치할 수 있는 방법입니다.
이 예로는 CakePHP 콘솔 툴을 사용하여 PHP의 내장 웹서버를 기동하여
어플리케이션에 **http://host:port** 라는 형식으로 엑세스 가능하도록 합니다.
app 디렉토리에서 아래의 명령어를 실행해주세요.

.. code-block:: bash

    bin/cake server

인수가 없는 디폴트 상태에서는  **http://localhost:8765/** 로 어플리케이션에 엑세스할 수 있습니다.

만약 해당 환경에서 **localhost** 나 8765번 포트가 이미 사용되고 있다면 CakePHP의 콘솔에서
아래와 같이 인수를 사용하여 특정 호스트명이나 포트 번호로 웹서버를 기동할 수 있습니다.

.. code-block:: bash

    bin/cake server -H 192.168.13.37 -p 5673

이렇게하면 어플리케이션은 **http://192.168.13.37:5673/** 에서 엑세스할 수 있습니다.

여기까지 입니다!
방금 설치한 CakePHP 어플리케이션은 웹 서버를 설정하지 않고도 동작합니다.

.. note::

    서버가 다른 호스트로부터 연결할 수 없는 경우 ``bin/cake server -H 0.0.0.0`` 를 시도해보세요.

.. warning::

    개발 서버는 공개 환경으로 사용해서는 *안됩니다*.
    이것은 어디까지나 기본적인 개발 서버로 사용되고 있습니다.

만약 실제 웹 서버를 사용하고 싶다면, 설치한 CakePHP의 파일을 (숨은 파일 포함)
웹서버의 문서 디렉토리 이하로 이동시킵니다.
이것으로 브라우저에서 대상 디렉토리를 지정하면 어플리케이션에 엑세스할 수 있습니다.

공개용
======

공개용 설치는 더욱 유연하게 CakePHP를 셋업하는 방법입니다.
이 방법을 사용하면 전체 도메인에서 하나의 CakePHP 어플리케이션을 사용하는 것도 가능합니다.
이번 예제에서는 파일 시스템의 어느곳에 CakePHP를 설치하더라도
http://www.example.com 와 같이 엑세스할 수 있을 것입니다.
Apache 웹 서버에서 이 방법을 사용하는 경우는 ``DocumentRoot`` 를 변경하는 권한이 필요할 수도 있으므로
주의가 필요합니다.

여기까지 소개한 방법 중 하나로 지정한 디렉토리 (여기서는「/cake_install」을 지정했다고 가정)
에 어플리케이션을 설치하면 파일 시스템에는 아래와 같은 환경이 생길 것입니다. ::

    /cake_install/
        bin/
        config/
        logs/
        plugins/
        src/
        tests/
        tmp/
        vendor/
        webroot/ (이 디렉토리가 DocumentRoot가 됩니다.)
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

Apache를 사용하고 있는 개발자는 해당 도메인의 ``DocumentRoot`` 디렉티브에 아래와 같이 지정합니다.

.. code-block:: apacheconf

    DocumentRoot /cake_install/webroot

웹 서버가 올바르게 설정되어 있다면 이것으로 http://www.example.com 에서
CakePHP 어플리케이션에 엑세스할 수 있게 됩니다.

동작
============


다음으로 CakePHP의 동작을 확인해 봅시다. 사용자가 선택한 방법에 따라 브라우저 `http://example.com/ <http://example.com/>`_  또는 `http://localhost:8765/ <http://localhost:8765/>`_ 를 열어봅니다. 그다음 CakePHP의 기본 홈 화면에서 데이터베이스의 연결상태를 표시하는 메시지를 확인합니다.

축하합니다! 이것으로 `CakePHP 어플리케이션작성의 첫번째 준비 <https://book.cakephp.org/3.0/kr/quickstart.html>`_를 마쳤습니다.


URL Rewriting
======================

Apache
-----------------------

CakePHP는, 확장한 상태에서 mod_rewrite를 사용하도록 되어있습니다. 자신의 시스템에서 정상적으로 동작할때까지 고생하는 사용자도 있습니다.

다음은 정상적으로 동작시키기 위해 몇가지 해야할것 을 알려드립니다. 우선 httpd.conf을 확인해주십시요(유저나 사이트 개별의 httpd.conf가 아닌, 반드시 시스템의 httpd.conf를 수정해주십시오.)

이 파일은 배포 및 Apache버전에 따라 크게 달라집니다. 자세한 내용은 `http://wiki.apache.org/httpd/DistrosDefaultLayout <http://wiki.apache.org/httpd/DistrosDefaultLayout>`_ 를 참조해주십시오.

1. 적절한 DocumentRoot에서 .htaccess에 대한 설정 덮어쓰기를 허용하기위해 AllowOverride가 All이 설정되어있지 확인합니다. ::

	# Each directory to which Apache has access can be configured with respect
	# to which services and features are allowed and/or disabled in that
	# directory (and its subdirectories).
	#
	# First, we configure the "default" to be a very restrictive set of
	# features.
	<Directory />
	    Options FollowSymLinks
	    AllowOverride All
	#    Order deny,allow
	#    Deny from all
	</Directory>

2. 아래와 같이 mod_rewrite가 정상적으로 로드되는것을 확인합니다. ::
	LoadModule rewrite_module libexec/apache2/mod_rewrite.so

많은 시스템에서 이부분은 기본적으로 주석처리가 되어있습니다.
그러므로 해당 줄의 가장 처음의 "#" 문자를 제거하여 수정해야합니다.

수정내용을 반영하기위해서는 Apache를 재기동 해주십시오.

.htaccess파일이 알맞은 디렉토리에 있는것을 확인해주십시오. 일부의 운영체제에서는 파일명이 "."부터 시작하는 파일은 숨김파일로 간주되기때문에 복사되지 않습니다.

3. 사이트의 다운로드 페이지 또는 Git 저장소에서 복사 한 CakePHP가 제대로 읽을 수 있는지 .htaccess 파일을 확인합니다.

CakePHP의 응용 프로그램 디렉토리 (여러분이 Bake에서 복사 한 최상위 디렉토리) 에는 이렇게 작성 되어 있습니다. ::

	<IfModule mod_rewrite.c>
	   RewriteEngine on
	   RewriteRule    ^$    webroot/    [L]
	   RewriteRule    (.*) webroot/$1    [L]
	</IfModule>

webroot디렉터리에는 이렇게 작성되어 있습니다. ::

	<IfModule mod_rewrite.c>
	    RewriteEngine On
	    RewriteCond %{REQUEST_FILENAME} !-f
	    RewriteRule ^ index.php [L]
	</IfModule>

아직, 여러분의 CakePHP사이트에서 mod_rewrite문제가 발생한다면, 가상 호스트 (virtualhosts) 설정을 수정하는것이 좋습니다. Ubuntu에서는 **/etc/apache2/sites-available/default** (배포판에 따른 위치) 의 파일을 수정해주십시오. 이 파일의 ``AllowOverride None``이 ``AllowOverride All``로 수정되어있는것을 확인해주십시오. 즉, 아래와 같이 됩니다.::

	<Directory />
	    Options FollowSymLinks
	    AllowOverride All
	</Directory>
	<Directory /var/www>
	    Options Indexes FollowSymLinks MultiViews
	    AllowOverride All
	    Order Allow,Deny
	    Allow from all
	</Directory>

macOS에서 다른 방법은 가상 호스트를 폴더로 향하게하는데 `virtualhostx <https://clickontyler.com/virtualhostx/>`_ 도구를 사용할 수 있습니다.


많은 호스팅 서비스(GoDaddy, 1and1) 는 웹 서버가 이미 mod_rewrite를 사용하는 사용자 디렉토리에서 전송됩니다. CakePHP를 사용자 디렉토리 (`http://example.com/~username/cakephp/ <http://example.com/~username/cakephp/>`_) 또는 이미 mod_rewrite를 활용하는 기타 URL 구조로 설치하고 있다면 RewriteBase 문을 CakePHP가 사용하는 .htaccess 파일 (/.htaccess、/app/.htaccess、/app/webroot/.htaccess) 에 추가해야합니다.

이것는 RewriteEngine지시문과 같은 섹션에 추가할 수 있습니다. 예를 들면 webroot의 .htaccess파일은 다음과 같이 됩니다.::

	<IfModule mod_rewrite.c>
	    RewriteEngine On
	    RewriteBase /path/to/app
	    RewriteCond %{REQUEST_FILENAME} !-f
	    RewriteRule ^ index.php [L]
	</IfModule>

4. (옵션) 발행 환경 설정에서 필요없는 요청은 CakePHP에서 처리되지 않도록합시다. webroot의 .htaccess 파일을 다음과 같이 수정합니다.::

	<IfModule mod_rewrite.c>
	    RewriteEngine On
	    RewriteBase /path/to/app/
	    RewriteCond %{REQUEST_FILENAME} !-f
	    RewriteCond %{REQUEST_URI} !^/(webroot/)?(img|css|js)/(.*)$
	    RewriteRule ^ index.php [L]
	</IfModule>

위의 예는 잘못된 요청을 index.php로 보내지 않고 웹 서버의 404 페이지를 표시합니다.

HTML의 404 페이지를 만들 수 있으며, ``ErrorDocument``지시문에 추기하여 CakePHP안에 있는 404 페이지를 사용할 수 있습니다.::

	ErrorDocument  404  / 404-not-found

nginx
-----------------------

	nginx는 Apache 같은 .htaccess 파일을 사용하지 않으므로 사이트의 설정에서 URL 재 작성 규칙을 작성해야합니다. 이것은 기본적으로 ``/etc/nginx/sites-available/your_virtual_host_conf_file``에 기재합니다. 당신의 환경 구성에 따라이 이 파일을 재 작성해야하지만, 적어도 PHP를 FastCGI로 실행시킬 필요가있을 것입니다. 아래의 설정은 요청을 ``webroot/index.php``로 리다이렉트합니다.::

	location / {
	    try_files $uri $uri/ /index.php?$args;
	}

server 지시문의 예는 다음과 같습니다.::

	server {
	    listen   80;
	    listen   [::]:80;
	    server_name www.example.com;
	    return 301 http://example.com$request_uri;
	}

	server {
		listen   80;
		listen   [::]:80;
		server_name example.com;

		root   /var/www/example.com/public/webroot;
		index  index.php;

		access_log /var/www/example.com/log/access.log;
		error_log /var/www/example.com/log/error.log;

		location / {
		    try_files $uri $uri/ /index.php?$args;
		}

		location ~ \.php$ {
		    try_files $uri =404;
		    include fastcgi_params;
		    fastcgi_pass 127.0.0.1:9000;
		    fastcgi_index index.php;
		    fastcgi_intercept_errors on;
		    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
		}
	}

.. note::

	최근에 PHP-FPM 설정은 주소 127.0.0.1의 TCP 9000 포트 대신 unix php-fpm 소켓을 수신하도록 설정합니다. 만약 위의 설정에서 502 bad gateway 오류가 발생한 경우 TCP 포트 대신 unix 소켓 경로를 사용하기 위해 ``fastcgi_pass``를 업데이트하십시오 (예: fastcgi_pass unix : /var/run/php/php7.1- fpm.sock;).

IIS7 (Windows hosts)
-----------------------

IIS7은 기본적으로 .htaccess 파일을 지원하지 않습니다. 이를 추가 할 수있는 있지만, CakePHP고유의 재작성을 사용하도록 IIS에 htaccess로 규칙을 가져올 수 있습니다. 이것을하려면 다음의 단계를 진행해 주십시오:

1. URL `Rewrite Module 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_ 을 설치하기 위해 `Microsoft의 Web Platform Installer <http://www.microsoft.com/web/downloads/platform.aspx>`_ 를 사용하거나 직접 다운로드합니다. ( `32 비트 <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_ / `64 비트 <https://www.microsoft.com/en-us/download/details.aspx?id=7435>`_ )
2. CakePHP의 루트 폴더에 web.config라는 새 파일을 작성하십시오.
3. 메모장 또는 XML을 편집 할 수있는 편집기를 사용하여 다음의의 코드를 지금 만든 web.config 파일에 복사하십시오. ::

	<?xml version="1.0" encoding="UTF-8"?>
	<configuration>
	    <system.webServer>
	        <rewrite>
	            <rules>
	                <rule name="Exclude direct access to webroot/*"
	                  stopProcessing="true">
	                    <match url="^webroot/(.*)$" ignoreCase="false" />
	                    <action type="None" />
	                </rule>
	                <rule name="Rewrite routed access to assets(img, css, files, js, favicon)"
	                  stopProcessing="true">
	                    <match url="^(font|img|css|files|js|favicon.ico)(.*)$" />
	                    <action type="Rewrite" url="webroot/{R:1}{R:2}"
	                      appendQueryString="false" />
	                </rule>
	                <rule name="Rewrite requested file/folder to index.php"
	                  stopProcessing="true">
	                    <match url="^(.*)$" ignoreCase="false" />
	                    <action type="Rewrite" url="index.php"
	                      appendQueryString="true" />
	                </rule>
	            </rules>
	        </rewrite>
	    </system.webServer>
	</configuration>

일단 IIS에서 사용할 수있는 재 작성 규칙을 포함하는 web.config 파일이 되었으면 CakePHP 링크, CSS, JavaScript, 재 라우팅 (rerouting)은 제대로 작동하는 것입니다.

URL リライティングを使わない場合
-----------------------

	만약 당신의 서버에 mod_rewrite (또는 이것와 호환되는 모듈)을 사용하고 싶지 않거나 사용할 수없는 경우, CakePHP의 기본의 URL을 사용해야합니다. **config/app.php** 의 아래에 덧글을 해제합니다.::

	'App' => [
	    // ...
	    // 'baseUrl' => env('SCRIPT_NAME'),
	]

그리고 아래의 .htaccess 파일을 삭제합니다.::

	/.htaccess
	webroot/.htaccess

이제 URL은 www.example.com/controllername/actionname/param 가 아닌 www.example.com/index.php/controllername/actionname/param 라는 형식이 될 것입니다.
