Ang Middleware
##########

Ang Middleware na mga bagay ay nagbibigay sayo ng abilidad sa 'wrap' ng iyong aplikasyon sa magagamit muli,
composable na mga suson ng paghawak sa kahilingan, o lohika sa pagbuo ng sagot. Biswal,
ang iyong aplikasyon ay nagtatapos sa gitna, at ang middleware ay naka-wrap sa app
na tulad ng sibuyas. Dito tayo ay maaaring makakita ng isang aplikasyon na naka-wrap na may mga Route, mga Asset,
Exception Handling at CORS header middleware.

.. image:: /_static/img/middleware-setup.png

Kapag ang hiling ay hinahawakan ng iyong aplikasyon ito ay pumapasok mula sa pinakalabas
na middleware. Bawat middleware ay maaaring mag-delegate sa hiling/sagot sa sunod na suson, o magbalik ng sagot.
Ang bumabalik na sagot ay pinipigilan ang ibabang mga layer mula
sa kailanmang nakikita na hiling. Isang halimbawa sa isang AssetMiddleware na paghahawak
ay ihiling para sa isang plugin na imahe sa panahon ng development.

.. image:: /_static/img/middleware-request.png

Kung walang middleware ay gumawa ng aksyon upang hawakan ang hiling, isang controller ay matatagpuan
at magkaroon ng pagkilos nito, o isang exception ay itataas sa pagbubuo ng mga maling
pahina.

Ang middleware ay parte sa bagong HTTP stack sa CakePHP na pinakikinabangan ang PSR-7
na hiling at tugon na mga interface. Dahil ang CakePHP ay isang pinakikinabangan ang PSR-7
na pamantayan ay maaari mong gamitin ang alinman sa PSR-7 na magkasundo na magagamit sa `The Packagist
<https://packagist.org>`__.

Ang Middleware sa CakePHP
=====================

Ang CakePHP ay nagbibigay ng ilang mga middleware para i-handle ang karaniwang mga gawain sa web na mga aplikasyon:

* ``Cake\Error\Middleware\ErrorHandlerMiddleware`` nagbibitag ng mga exception mula sa 
  naka-wrap na middleware at mga render ng maling pahina gamit ang
  :doc:`/development/errors` Exception handler.
* ``Cake\Routing\AssetMiddleware`` sumusuri kung ang hiling ay nagre-refer sa isang
  tema o plugin asset na file, kagaya ng CSS, JavaScript o imahe na file na naka-imbak sa
  alinman ang plugin ng webroot folder o ang nararapat na isa para sa Tema.
* ``Cake\Routing\Middleware\RoutingMiddleware`` gumagamit ng ``Router`` upang i-parse ang
  papasok na URL at magtalaga ng routing na mga parameter sa hiniling.
* ``Cake\I18n\Middleware\LocaleSelectorMiddleware`` nagpapagana ng awtomatikong wika
  na lumilipat mula sa ``Accept-Language`` na header na ipinadala sa browser.
* ``Cake\Http\Middleware\SecurityHeadersMiddleware`` ginagawang madali ang pagdagdag
  ng seguridad na kaugnay ng mga header tulad ng ``X-Frame-Options`` para tumugon.
* ``Cake\Http\Middleware\EncryptedCookieMiddleware`` nagbibigay sayo ng abilidad upang
  manipulahin ang naka-encrypt na mga cookie na kung sakali na kailangan mong manipulahin ang cookie na may
  obfuscated na datos.
* ``Cake\Http\Middleware\CsrfProtectionMiddleware`` nagdadagdag ng CSRF na proteksyon sa iyong
  aplikasyon.

.. _using-middleware:

Paggamit sa Middleware
================

Ang Middleware ay pwedeng i-apply sa iyong aplikasyon na pangkalahatan, o para indibidwal
na mga routing na mga scope.

Para i-apply ang middleware sa lahat na mga hiling, gamitin ang ``middleware`` na pamamaraan sa iyong
``App\Application`` na class.  Kung ikaw ay walang isang ``App\Application`` na class, tingnan
ang seksyon sa :ref:`adding-http-stack` para sa karagdagang impormasyon. Ang iyong proseso
``middleware`` hook method will be called at the beginning of the request
ng aplikasyon, maaari kang gumamit ng ``MiddlewareQueue`` na object na ilakip sa middleware::

    namespace App;

    use Cake\Http\BaseApplication;
    use Cake\Error\Middleware\ErrorHandlerMiddleware;

    class Application extends BaseApplication
    {
        public function middleware($middlewareQueue)
        {
            // Itali ang tagahawak ng pagkakamali sa middleware na pila.
            $middlewareQueue->add(new ErrorHandlerMiddleware());
            return $middlewareQueue;
        }
    }

At saka sa pagdaragdag sa katapusan sa ``MiddlewareQueue`` maaari kang makagawa
ng iba't ibang mga operasyon::

        $layer = new \App\Middleware\CustomMiddleware;

        // Idinagdag na middleware ay magiging huli sa linya.
        $middlewareQueue->add($layer);

        // Inihanda na middleware ay magiging una sa linya.
        $middlewareQueue->prepend($layer);

        // Magsingit ng isang tiyak na puwang. Kung ang puwang ay labas sa
        // hangganan, ito ay maidagdag sa katapusan.
        $middlewareQueue->insertAt(2, $layer);

        // Magsingit bago ang ibang middleware.
        // Kung ang nakapangalan na class ay hindi mahanap,
        // isang exception ay maipahayag.
        $middlewareQueue->insertBefore(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

        // Magsingit pagkatapos ng ibang middleware.
        // Kung ang nakapangalan na class ay hindi mahanap, ang
        // middleware ay idaragdag sa dulo.
        $middlewareQueue->insertAfter(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

Karagdagan sa paggamit ng middleware sa iyong buong aplikasyon, maaari kang gumamit
ng middleware sa partikular na mga hanay ng mga ruta na gamit ang :ref:`connecting-scoped-middleware`.

Pagdaragdag ng Middleware mula sa mga Plugin
------------------------------

Pagkatapos ang middleware ay naka-pila ay inihanda ng aplikasyon, ang
``Server.buildMiddleware`` na kaganapan ay na-trigger. Ang kaganapan ay maaaring kapaki-pakinabang na idagdag
ang middleware mula sa mga plugin. Ang mga plugin ay maaaring magrehistro ng mga tagapakinig sa kanilang bootstrap
na mga script, na magdagdag sa middleware::

    // Sa ContactManager na plugin sa bootstrap.php
    use Cake\Event\EventManager;

    EventManager::instance()->on(
        'Server.buildMiddleware',
        function ($event, $middlewareQueue) {
            $middlewareQueue->add(new ContactPluginMiddleware());
        });

Ang PSR-7 na mga Hiling at mga Tugon
============================

Ang Middleware at ang bagong HTTP stack ay itinayo sa ibabaw ng `PSR-7 Request
& Response Interfaces <http://www.php-fig.org/psr/psr-7/>`__. Habang lahat
ng middleware ay malantad sa mga interfaces na ito, iyong mga controller, mga components
at mga view ay *hindi*.

Pakikipag-ugnay sa mga Hiling
-------------------------

Ang ``RequestInterface`` ay nagbibigay ng mga pamamaraan para sa pag-uugnay sa mga header,
pamamaraan, URI, at katawan ng isang hiling. Para makapag-ugnay sa mga header, kaya mo::

    // Basahin ang header bilang teksto
    $value = $request->getHeaderLine('Content-Type');

    // Basahin ang header bilang isang array
    $value = $request->getHeader('Content-Type');

    // Basahhin lahat ng mga header bilang isang nag-uugnay na array.
    $headers = $request->getHeaders();

Lahat ng mga hiling ay nagbigay din ng access sa mga cookie at na-upload na mga file na naglalaman ng mga ito::

    // Kumuha ng mga halaga sa cookie.
    $cookies = $request->getCookieParams();

    // Kumuha ng listahan sa UploadedFile na mga object
    $files = $request->getUploadedFiles();

    // Basahin ang datos ng file.
    $files[0]->getStream();
    $files[0]->getSize();
    $files[0]->getClientFileName();

    // Ilipat ang file.
    $files[0]->moveTo($targetPath);

Ang mga hiling ay naglalaman ng URI object, na kung saan ay naglalaman ng mga pamamaraan para sa pag-ugnayan sa mga hiniling na URI::

    // Kunin ang URI
    $uri = $request->getUri();

    // Basahin ang datos na inilabas sa URI.
    $path = $uri->getPath();
    $query = $uri->getQuery();
    $host = $uri->getHost();

Panghuli, maaari kang mag-ugnay sa isang humihiling na 'attributes'. Ang CakePHP ay gumagamit nito
na mga katangian upang dalhin ang framework sa tiyak na mga parameter ng kahilingan. Mayroong kunting
importante na mga katangian sa anumang hiling na hinawakan ni CakePHP:

* ``base`` ay naglalaman ng base na direktoryo para sa iyong aplikasyon kung meron mang isa.
* ``webroot`` ay naglalaman ng webroot na direktoryo para sa iyong aplikasyon.
* ``params`` ay naglalaman ng mga resulta sa ruta na tumutugma kapang ang mga patakaran ng pag-ruta ay
  nai-proseso.
* ``session`` ay naglalaman ng isang instance sa CakePHP ``Session`` na object. Tingnan
  :ref:`accessing-session-object` para sa karagdagang impormasyon kung papaano gamitin ang sesyon
  na object.

Pag-uugnay ng mga Tugon
--------------------------

Ang pamamaraan ay magagamit upang lumikha ng server na tugon ay pareho sa mga
magagamit na iyon kapag nag-uugnay sa :ref:`httpclient-response-objects`. Habang ang
interface ay pareho lamang ang gamit ng mga sitwasyon ay magkaiba.

Kapag nagbago sa tugon, ito ay importante na tandaan na ang mga tugon ay
**immutable**. Dapat mong laging tandaan na mag-imbak ng mga resulta sa anumang mga setter
na mga pamamaraan. Halimbawa::

    // Ito ay *hindi* nagbabago sa $response. Ang bagong object ay hindi
    // itinalaga sa isang variable.
    $response->withHeader('Content-Type', 'application/json');

    // Ito ay gumagana!
    $newResponse = $response->withHeader('Content-Type', 'application/json');

Madalas ikaw ay magtatakda ng mga header at mga tugon na kumakatawan sa mga hiling::

    // Magtakda ng mga header at isang code ng katayuan
    $response = $response->withHeader('Content-Type', 'application/json')
        ->withHeader('Pragma', 'no-cache')
        ->withStatus(422);

    // Sumulat sa katawan
    $body = $response->getBody();
    $body->write(json_encode(['errno' => $errorCode]));

Paglikha ng Middleware
===================

Ang Middleware ay maaaring ipatupad bilang hindi kilalang mga function (Closures), o bilang
nanawagan na mga class. Habang ang Closures ay karapatdapat para sa maliit na mga gawain na ginagawa nila
na pag-test sa mas mahirap, at maaaring lumikha ng isang kumplikadong ``Application`` na class. Ang Middleware
na class sa CakePHP ay nagkaroon ng ilang mga kombensiyon:

* Ang Middleware class na mga file ay dapat ilagay sa **src/Middleware**. Halimbawa:
  **src/Middleware/CorsMiddleware.php**
* Ang Middleware na mga class ay dapat naka-suffix sa ``Middleware``. Halimbawa:
  ``LinkMiddleware``.
* Ang Middleware ay inaasahan na ipatupad ang middleware na protocol.

Habang hindi sa isang pormal na interface (hindi pa), Ang Middleware ay mayroong isang soft-interface o
'protocol'. Ang protocol ay ang mga sumusunod:

#. Ang Middleware ay dapat nagpatupad ng ``__invoke($request, $response, $next)``.
#. Ang Middleware ay dapat magbalik ng isang object na nagpapatupad sa PSR-7 ``ResponseInterface``.

Ang Middleware ay maaaring bumalik ng sagot na alinman sa pamamgitan ng pagtawag sa ``$next`` o sa pamamagitan ng paglilikha
ng sarili nilang mga tugon. Maaari naming makita ang parehong mga opsyon sa aming simple na middleware::

    // Sa src/Middleware/TrackingCookieMiddleware.php
    namespace App\Middleware;
    use Cake\I18n\Time;

    class TrackingCookieMiddleware
    {
        public function __invoke($request, $response, $next)
        {
            // Calling $next() delegates control to the *next* middleware
            // In your application's queue.
            $response = $next($request, $response);

            // When modifying the response, you should do it
            // *after* calling next.
            if (!$request->getCookie('landing_page')) {
                $expiry = new Time('+ 1 year');
                $response = $response->withCookie('landing_page' ,[
                    'value' => $request->here(),
                    'expire' => $expiry->format('U'),
                ]);
            }
            return $response;
        }
    }

Ngayon na ginawa na namin ang isang pinaka simple na middleware, isama natin ito sa ating
aplikasyon::

    // In src/Application.php
    namespace App;

    use App\Middleware\TrackingCookieMiddleware;

    class Application
    {
        public function middleware($middlewareQueue)
        {
            // Idagadg sa iyong simple na middleware papunta sa queue
            $middlewareQueue->add(new TrackingCookieMiddleware());

            // Magdagdag ng higit pa na middleware papunta sa queue

            return $middlewareQueue;
        }
    }

.. _security-header-middleware:

Pagdagdag ng Seguridad sa mga Header
=======================

Ang ``SecurityHeaderMiddleware`` na layer ay ginagawang madali upang mag-apply ng kaugnay sa seguridad
na mga header sa iyong aplikasyon. Sa sandaling i-setup ang middleware ay maaaring ilapat ang sumusunod
na mga header sa mga tugon:

* ``X-Content-Type-Options``
* ``X-Download-Options``
* ``X-Frame-Options``
* ``X-Permitted-Cross-Domain-Policies``
* ``Referrer-Policy``

Itong middleware ay naka-configure gamit ang mataas na interface bago ito inilapat sa
iyong aplikasyon sa middleware stack::

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
    The ``SecurityHeadersMiddleware`` was added in 3.5.0

.. _encrypted-cookie-middleware:

Pag-encrypt ng Cookie sa Middleware
===========================

Kung ang iyong aplikasyon ay mayroong mga cookie na merong laman na datos na gusto mong tumalbog at
protektahan laban sa pakikialam sa gumagamit, maaari kang gumamit ng naka-encrypt na cookie sa CakePHP
na middleware upang halatang naka-encrypt at decrypt cookie sa datos gamit ang middleware.
Ang Cookie na datos ay naka-encrypt at dumadaan sa OpenSSL gamit ang AES::

    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    $cookies = new EncryptedCookieMiddleware(
        // Names of cookies to protect
        ['secrets', 'protected'],
        Configure::read('Security.cookieKey')
    );

    $middlewareQueue->add($cookies);

.. note::
    Ito ay inirerekomenda na ang naka-encrypt na key na ginagamit mo para sa cookie na datos, ay nagamit
    *exclusively* para sa cookie na datos.

Ang encryption na mga algorithm at padding na estilo ay ginagamit sa cookie middleware ay
paurong na compatible sa ``CookieComponent`` mula sa mas naunang mga bersyon sa CakePHP.

.. versionadded:: 3.5.0
    Ang ``EncryptedCookieMiddleware`` ay idinagdag sa 3.5.0

.. _csrf-middleware:

Cross Site Request Forgery (CSRF) na Middleware
============================================

CSRF na proteksyon ay maaaring ilapat sa iyong buong aplikasyon, o sa partikular na mga scope
sa pamamagitan ng paglapat ng ``CsrfProtectionMiddleware`` sa iyong middleware na stack::

    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    $options = [
        // ...
    ];
    $csrf = new CsrfProtectionMiddleware($options);

    $middlewareQueue->add($csrf);

Ang mga opsyon ay maaaring maipasa sa constructor ng middleware.
Ang magagamit na configuration na mga opsyon ay:

- ``cookieName`` Ang pangalan sa cookie na ipapadala. Ay naka-default sa ``csrfToken``.
- ``expiry`` Gaano katagal ang CSRF token na dapat magtagal. Ang mga default sa browser na sesyon.
- ``secure`` Kung o hindi ang cookie ay itatakda na may Secure na flag. Yan ay,
  ang cookie ay magtatakda lamang sa HTTPS na koneksyon at anumang pagtatangka na higit sa normal na HTTP
  ay mabibigo. Ang mga default ay ``false``.
- ``httpOnly`` Kung o hindi ang cookie ay itatakda na may HttpOnly na flag. Ang mga default ay ``false``.
- ``field`` Ang patlang ng form upang suriin. Ang mga defaults ay ``_csrfToken``. Pagbabago nito
  ay nangangailangan din ng pag-configure sa FormHelper.

Kapag pinagana, maaari kang mag-access sa kasalukuyang CSRF na token sa hiling na object::

    $token = $this->request->getParam('_csrfToken');

.. versionadded:: 3.5.0
    The ``CsrfProtectionMiddleware`` was added in 3.5.0

Integration with FormHelper
---------------------------

Ang ``CsrfProtectionMiddleware`` ay naka pag-ugnayan nang walang putol sa ``FormHelper``. Baway
oras na nilikha mo ang isang form na may ``FormHelper``, ito ay nagsingit ng isang nakatagong patlang na nilalaman
ang CSRF na token.

.. note::

    Kapag gumagamit ng CSRF na proteksyon ay dapay kang laging magsimula sa iyong mga form na may
    ``FormHelper``. Kung ayaw mo, kakailanganin mo nang mano-mano sa paglikha ng nakatagong mga input sa
    bawat isa sa iyong form.

Ang CSRF na Proteksyon at AJAX na mga Hiling
---------------------------------

At saka sa hiling sa datos ng mga parameter, ang CSRF na mga token ay maaaring masumite sa pamamagitan ng
isang espesyal ``X-CSRF-Token`` na header. Paggamit ng header ay madalas na ginagawang mas madali sa
pag-uugnay sa CSRF na token na may JavaScript na may mabigat na mga aplikasyon, o XML/JSON batay sa API
na mga endpoint.

Ang CSRF Token ay maaaring makakuha sa pamamagitan ng Cookie ``csrfToken``.

.. _adding-http-stack:

Pagdagdag ng bagong HTTP Stack sa isang Umiiral na Aplikasyon
====================================================

Paggamit ng HTTP na Middleware sa isang umiiral na aplikasyon ay nangangailangan ng ilang mga pagbabago ng iyong
aplikasyon.

#. Una ay i-update ang iyong **webroot/index.php**. Kopyahin ang nilalaman ng file mula sa `app
   skeleton <https://github.com/cakephp/app/tree/master/webroot/index.php>`__.
#. Lumikha ng ``Application`` na class. Tingnan ang :ref:`using-middleware` na seksyon
   sa itaas kung paano gawin iyon. O kopyahin ang halimbawa sa `app skeleton
   <https://github.com/cakephp/app/tree/master/src/Application.php>`__.
#. Lumikha sa **config/requirements.php** kung hindi ito umiiral at idagdag ang nilalaman mula sa `app skeleton <https://github.com/cakephp/app/blob/master/config/requirements.php>`__.

Sa sandaling ang tatlong mga hakbang ay nakumpleto, handa ka na magsimula sa pagpapatupad ng anumang
aplikasyon/plugin dispatch na mga filter bilang HTTP na middleware.

Kung ikaw ay nagpapatakbo ng mga pagsusuri ay kakailanganin mo din na i-update ang iyong
**tests/bootstrap.php** sa pamamagitan sa pagkopya ng mga nilalaman ng file mula sa `app skeleton
<https://github.com/cakephp/app/tree/master/tests/bootstrap.php>`_.

.. meta::
    :title lang=en: Http Middleware
    :keywords lang=en: http, middleware, psr-7, request, response, wsgi, application, baseapplication
