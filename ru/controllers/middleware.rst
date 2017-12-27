Промежуточное ПО
################

Объекты промежуточного ПО дают вам возможность 'обернуть' ваше приложение в
повторно используемые, составные уровни обработки запроса или логику построения
ответа. Визуально ваше приложение заканчивается в центре, а промежуточное
ПО обёрнуто в приложение подобно луковице. Здесь мы можем увидеть приложение,
завёрнутое в Routes, Assets, Exception Handling и в промежуточное ПО заголовка
- CORS.

.. image:: /_static/img/middleware-setup.png

Когда запрос обрабатывается вашим приложением, он поступает из самого удалённого
промежуточного программного обеспечения. Каждое промежуточное ПО может делегировать
запрос/ответ на следующий уровень или возвращать ответ. Возврат ответа предотвращает
просмотр нижних слоёв. Примером этого является AssetMiddleware, обрабатывающий
запрос на изображение плагина во время разработки.

.. image:: /_static/img/middleware-request.png

Если никакое промежуточное ПО не предпринимает действия для обработки запроса,
контроллер вызовет экшен, или будет создано исключение, генерирующее страницу с
ошибкой.

Пормежуточное ПО (Middleware) является частью нового HTTP-стека в CakePHP, который
использует интерфейсы запросов и ответов PSR-7. Поскольку CakePHP использует
стандарт PSR-7, вы можете использовать любое промежуточное ПО, совместимое с
PSR-7, доступное на `The Packagist <https://packagist.org>`__.

Промежуточное ПО в CakePHP
==========================

CakePHP предоставляет несколько промежуточных программ для обработки общих
задач в веб-приложениях:

* ``Cake\Error\Middleware\ErrorHandlerMiddleware`` ловит исключения из обёрнутого
  промежуточного ПО и отображает страницу с ошибкой с помощью обработчика исключений
  :doc:`/development/errors`.
* ``Cake\Routing\AssetMiddleware`` проверяет, обращается ли запрос к теме или файлу
  активов плагина, например, к CSS, JavaScript или файлу изображения, хранящимся в
  папке webroot плагина или в папке с соответствующей темой.
* ``Cake\Routing\Middleware\RoutingMiddleware`` использует ``Router`` для анализа
  входящего URL-адреса и назначения параметров маршрутизации для запроса.
* ``Cake\I18n\Middleware\LocaleSelectorMiddleware`` позволяет автоматически
  переключать язык в заголовке ``Accept-Language``, отправленного браузером.
* ``Cake\Http\Middleware\SecurityHeadersMiddleware`` упрощает добавление заголовков,
  связанных с безопасностью, таких как ``X-Frame-Options`` для ответов.
* ``Cake\Http\Middleware\EncryptedCookieMiddleware`` даёт вам возможность
  манипулировать зашифрованными файлами cookie, если вам нужно манипулировать файлом
  cookie с обфускацией данных.
* ``Cake\Http\Middleware\CsrfProtectionMiddleware`` добавляет CSRF-защиту в ваше
  приложение.

.. _using-middleware:

Использование промежуточного ПО
===============================

Промежуточное ПО может применяться в вашему приложении как глобально, так и к отдельным
областям маршрутизации.

Чтобы применить промежуточное ПО ко всем запросам, используйте метод ``middleware``
вашего класса ``App\Application``. Если у вас нет класса``App\Application``, обратитесь
к разделу :ref:`adding-http-stack` для получения дополнительной информации.
В начале процесса запроса вызывается hook-метод ``middleware`` вашего приложения,
вы можете использовать объект ``MiddlewareQueue`` для подключения промежуточног ПО::

    namespace App;

    use Cake\Http\BaseApplication;
    use Cake\Error\Middleware\ErrorHandlerMiddleware;

    class Application extends BaseApplication
    {
        public function middleware($middlewareQueue)
        {
            // Привяжите обработчик ошибок к очереди промежуточного ПО.
            $middlewareQueue->add(new ErrorHandlerMiddleware());
            return $middlewareQueue;
        }
    }

Помимо добавления в конец ``MiddlewareQueue``, вы можете выполнять различные операции::

        $layer = new \App\Middleware\CustomMiddleware;

        // Добавленное промежуточное ПО будет последним в очереди.
        $middlewareQueue->add($layer);

        // Промежуточное ПО будет первым в очереди.
        $middlewareQueue->prepend($layer);

        // Вставьте в определенный слот. Если слот выходит за пределы,
        // он будет добавлен в конец.
        $middlewareQueue->insertAt(2, $layer);

        // Вставить перед другим промежуточным ПО.
        // Если названный класс не может быть найден,
        // будет создано исключение.
        $middlewareQueue->insertBefore(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

        // Вставить после другого промежуточного ПО.
        // Если названный класс не может быть найден, промежуточное
        // ПО будет добавлено в конец.
        $middlewareQueue->insertAfter(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

Помимо применения промежуточного ПО для всего приложения, вы можете применять
его и к определённым наборам маршрутов, используя :ref:`connecting-scoped-middleware`.

Добавление промежуточного ПО из плагинов
----------------------------------------

После того как очередь промежуточного ПО была подготовлена приложением, запускается
событие ``Server.buildMiddleware``. Это событие может быть полезно для добавления
промежуточного ПО из плагинов. Плагины могут регистрировать слушателей в своих сценариях
начальной загрузки, которые добавляют промежуточное ПО::

    // В плагине ContactManager bootstrap.php
    use Cake\Event\EventManager;

    EventManager::instance()->on(
        'Server.buildMiddleware',
        function ($event, $middlewareQueue) {
            $middlewareQueue->add(new ContactPluginMiddleware());
        });

Запросы и ответы PSR-7
======================

Промежуточное ПО и новый HTTP-стек построены поверх `интерфейсов запроса и
ответа PSR-7 <http://www.php-fig.org/psr/psr-7/>`__. В то время как всё 
промежуточное ПО будет подвержено этим интерфейсам, ваши контроллеры, компоненты
и представления *не* будут зависеть от этих интерфейсов.

Взаимодействие с запросами
--------------------------

``RequestInterface`` предоставляет методы взаимодействия с заголовками, методом,
URI и телом запроса. Чтобы взаимодействовать с заголовками, вы можете::

    // Чтение заголовка в виде текста
    $value = $request->getHeaderLine('Content-Type');

    // Чтение заголовка в виде массива
    $value = $request->getHeader('Content-Type');

    // Прочитайте все заголовки как ассоциативный массив.
    $headers = $request->getHeaders();

Запросы также предоставляют доступ к файлам cookie и загружаемым файлам,
которые они содержат::

    // Получите массив значений cookie.
    $cookies = $request->getCookieParams();

    // Получить список объектов UploadedFiles (загруженных файлов).
    $files = $request->getUploadedFiles();

    // Прочитайте данные файла.
    $files[0]->getStream();
    $files[0]->getSize();
    $files[0]->getClientFileName();

    // Переместите файл.
    $files[0]->moveTo($targetPath);

Запросы содержат объект URI, который содержит методы для взаимодействия с
запрошенным URI::

    // Получить URI
    $uri = $request->getUri();

    // Чтение данных из URI.
    $path = $uri->getPath();
    $query = $uri->getQuery();
    $host = $uri->getHost();

Наконец, вы можете взаимодействовать с 'атрибутами' запроса. CakePHP использует
эти атрибуты для переноса специфических параметров запроса. В любом запросе,
обрабатываемом CakePHP, есть несколько важных атрибутов:

* ``base`` содержит базовый каталог для вашего приложения, если он есть.
* ``webroot`` содержит каталог webroot для вашего приложения.
* ``params`` содержит результаты сопоставления маршрутов после обработки
  правил маршрутизации.
* ``session`` содержит экземпляр объекта CakePHP - ``Session``.
  См. :ref:`accessing-session-object` для получения дополнительной информации о том,
  как использовать объект сеанса (сессии).

Взаимодействие с ответами
-------------------------

Методы, доступные для создания ответа сервера, такие же, как и методы для
взаимодействии с :ref:`httpclient-response-objects`. Хотя интерфейс одинаковый, но
сценарии использования различны.

При изменении ответа важно помнить, что ответы **неизменяемы**. Вы всегда должны
помнить о сохранении результатов любого метода сеттера. Например::

    // Это *не* модифицирует $response.
    // Новый объект не был присвоен переменной.
    $response->withHeader('Content-Type', 'application/json');

    // Это работает!
    $newResponse = $response->withHeader('Content-Type', 'application/json');

Чаще всего вы будете устанавливать заголовки и тела ответов по запросам::

    // Назначить заголовки и код состояния
    $response = $response->withHeader('Content-Type', 'application/json')
        ->withHeader('Pragma', 'no-cache')
        ->withStatus(422);

    // Записать в тело
    $body = $response->getBody();
    $body->write(json_encode(['errno' => $errorCode]));

Создание промежуточного ПО
==========================

Промежуточное ПО может быть реализовано как анонимные функции(Closures) или как
invokable классы. В то время как Closures подходят для небольших задач, они же и
усложняют тестирование и могут создавать сложный класс ``Application``.
Классы промежуточного ПО в CakePHP имеют несколько соглашений:

* Файлы классов промежуточного ПО должны быть помещены в **src/Middleware**.
  Например: **src/Middleware/CorsMiddleware.php**
* Классы промежуточного ПО должны быть помечены как ``Middleware``.
  Например: ``LinkMiddleware``.
* Предполагается, что промежуточное ПО реализует протокол промежуточного ПО.

Пока что не формальный интерфейс, Middleware действительно имеет soft-интерфейс
или 'протокол'. Протокол выглядит следующим образом:

#. Промежуточное ПО должно реализовывать(implement) ``__invoke($request, $response, $next)``.
#. Промежуточное ПО должно возвращать объект, реализующий PSR-7 ``ResponseInterface``.

Промежуточное ПО может возвращать ответ либо путём вызова ``$next``, либо путём создания
собственного ответа. Мы можем видеть(использовать) оба варианта в нашем простом
промежуточном ПО::

    // В src/Middleware/TrackingCookieMiddleware.php
    namespace App\Middleware;

    class TrackingCookieMiddleware
    {
        public function __invoke($request, $response, $next)
        {
            // Вызов делегатов $next() для следующего промежуточного ПО
            // в очереди приложения.
            $response = $next($request, $response);

            // При изменении ответа, вы должны сделать это после
            // *следующего* вызова.
            if (!$request->getCookie('landing_page')) {
                $response->cookie([
                    'name' => 'landing_page',
                    'value' => $request->here(),
                    'expire' => '+ 1 year',
                ]);
            }
            return $response;
        }
    }

Теперь, когда мы создали очень для простого промежуточного ПО, давайте приложим
его к нашему приложению::

    // В src/Application.php
    namespace App;

    use App\Middleware\TrackingCookieMiddleware;

    class Application
    {
        public function middleware($middlewareQueue)
        {
            // Добавьте своё промежуточное ПО в очередь
            $middlewareQueue->add(new TrackingCookieMiddleware());

            // Можете добавить и другое промежуточное ПО в очередь

            return $middlewareQueue;
        }
    }

.. _security-header-middleware:

Добавление заголовков безопасности
==================================

Слой ``SecurityHeaderMiddleware`` позволяет легко применять заголовки, связанные с безопасностью,
к вашему приложению. После настройки, промежуточное ПО может применять следующие заголовки к
ответам:

* ``X-Content-Type-Options``
* ``X-Download-Options``
* ``X-Frame-Options``
* ``X-Permitted-Cross-Domain-Policies``
* ``Referrer-Policy``

Это промежуточное ПО настраивается с использованием свободного интерфейса до его применения к
стеку(очереди) промежуточного ПО вашего приложения::

    use Cake\Http\Middleware\SecurityHeadersMiddleware;

    $headers = new SecurityHeadersMiddleware();
    $headers
        ->setCrossDomainPolicy()
        ->setReferrerPolicy()
        ->setXFrameOptions()
        ->setXssProtection()
        ->noOpen()
        ->noSniff();

    $middlewareQueue->add($headers);

.. versionadded:: 3.5.0
    ``SecurityHeadersMiddleware`` добавлено в 3.5.0

.. _encrypted-cookie-middleware:

Промежуточное ПО для шифрования файлов cookie
=============================================

Если в вашем приложении есть файлы cookie, содержащие данные, которые вы хотите
обфусцировать, чтобы защитить от вмешательства пользователя, вы можете использовать
шифрующее промежуточное ПО CakePHP для шифрования и дешифрования файлов cookie.
Данные cookie шифруются через OpenSSL с использованием AES::

    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    $cookies = new EncryptedCookieMiddleware(
        // Имена файлов cookie, которые нужно защитить
        ['secrets', 'protected'],
        Configure::read('Security.cookieKey')
    );

    $middlewareQueue->add($cookies);

.. note::
    Рекомендуется, чтобы ключ шифрования, который вы используете для данных cookie,
    использовался *исключительно* для данных cookie.

Алгоритмы шифрования и стиль заполнения, используемые промежуточным ПО для cookie,
обратно совместимы с ``CookieComponent`` из более ранних версий CakePHP.

.. versionadded:: 3.5.0
    ``EncryptedCookieMiddleware`` было добавлено 3.5.0

.. _csrf-middleware:

Cross Site Request Forgery (CSRF) Middleware
============================================

Защита CSRF может применяться ко всему вашему приложению или к конкретным областям,
Применяя ``CsrfProtectionMiddleware`` к вашему промежуточному стеку, защита CSRF может
быть применена ко всему вашему приложению или к конкретным областям::

    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    $options = [
        // ...
    ];
    $csrf = new CsrfProtectionMiddleware($options);

    $middlewareQueue->add($csrf);

Параметры могут быть переданы в конструктор промежуточного ПО.
Доступные параметры конфигурации:

- ``cookieName`` Имя файла cookie для отправки. По умолчанию используется ``csrfToken``.
- ``expiry`` Как долго должен продолжаться токен CSRF. По умолчанию используется сеанс браузера.
- ``secure`` Будет ли cookie установлен с флагом Secure. То есть, cookie будет установлен только
  на HTTPS-соединение, и любая попытка соединения по HTTP не удастся.
  По умолчанию используется ``false``.
- ``httpOnly`` Будет ли cookie установлен с флагом HttpOnly. По умолчанию используется ``false``.
- ``field`` Поле формы для проверки. По умолчанию используется ``_csrfToken``. Для изменения
  этого также потребуется настроить FormHelper.

Когда включено, вы можете получить доступ к текущему токену CSRF в объекте запроса::

    $token = $this->request->getParam('_csrfToken');

.. versionadded:: 3.5.0
    ``CsrfProtectionMiddleware`` добавлено в 3.5.0


Интеграция с FormHelper
-----------------------

``CsrfProtectionMiddleware`` легко интегрируется с ``FormHelper``. Каждый раз, когда вы
создаёте форму с помощью ``FormHelper``, она вставляет скрытое поле, содержащее токен CSRF.

.. note::
    При использовании защиты CSRF вы всегда должны начинать свои формы с помощью ``FormHelper``.
    Если вы этого не сделаете, вам нужно будет вручную создавать скрытые входы в каждой из ваших форм.

Защита CSRF и AJAX запросы
--------------------------

Помимо параметров данных запроса, токены CSRF могут быть отправлены через
специальный заголовок ``X-CSRF-Token``. Использование заголовка часто
упрощает интеграцию токена CSRF с тяжелыми приложениями JavaScript или
конечными точками API на основе XML/JSON.

CSRF Token можно получить через Cookie ``csrfToken``.

.. _adding-http-stack:

Добавление нового HTTP-стека в существующее приложение
======================================================

Добавление промежуточного ПО для HTTP, в ваше уже существующее приложение, потребует
нескольких изменений в вашем приложении.

#. Сначала обновите свой **webroot/index.php**. Скопируйте содержимое файла из скелета
   `скелета приложения <https://github.com/cakephp/app/tree/master/webroot/index.php>`__.
#. Создайте класс ``Application``. См. выше раздел :ref:`using-middleware`, чтобы это сделать.
   Или скопируйте пример из `скелета приложения <https://github.com/cakephp/app/tree/master/src/Application.php>`__.
#. Создайте **config/requirements.php**, если он не существует, и добавьте содержимое из `скелета приложения <https://github.com/cakephp/app/blob/master/config/requirements.php>`__.

Как только эти три этапа будут завершены, вы готовы начать повторное внедрение любых
фильтров отправки приложений/плагинов в качестве промежуточного программного обеспечения HTTP.

Если вы запускаете тесты, вам также нужно будет обновить **tests/bootstrap.php** , скопировав
содержимое файла из `скелета приложения <https://github.com/cakephp/app/tree/master/tests/bootstrap.php>`_.

.. meta::
    :title lang=ru: Промежуточное ПО
    :keywords lang=en: http, middleware, psr-7, request, response, wsgi, application, baseapplication 
