3.0 Gabay sa Paglipat
#####################

Ang pahinang ito ay nagbubuod sa mga pagbabago mula sa CakePHP 2.x na tutulong sa paglipat
ng isang proyekto patungo sa 3.0, pati na rin ang isang reperensya upang maging napapanahon
sa mga pagbabagong nagawa sa core mula sa CakePHP 2.x na branch. Siguraduhing basahin ang
ibang mga pahina sa gabay na ito para sa lahat ng bagong mga tampok at mga pagbabago ng API.

Mga Kinakailangan
=================

- Ang CakePHP 3.x  ay sumusuporta sa PHP Bersyon 5.4.16 at pataas.
- Ang CakePHP 3.x ay nangangailangan ng mbstring na ekstensiyon.
- Ang CakePHP 3.x ay nangangailangan ng intl na ekstensiyon.

.. babala::

	Ang CakePHP 3.0 ay hindi gagana kung hindi mo nakamit ang mga kinakailangan sa itaas.

Pang-Update na Kasangkapan
======================

Habang ang dokumentong ito ay tumatalakay sa lahat ng nakakasirang mga pagbabago at
mga pagpapabuti na ginawa sa CakePHP 3.0, kami ay nakalikha rin ng isang console na
aplikasyon upang tumulong sa iyo na kumpletuhin ang ilang nakakaubos ng oras na mekanikal
na mga pagbabago. Maaari kang `kumuha sa pang-upgrade na kasangkapan mula sa 
github <https://github.com/cakephp/upgrade>`_.

Layout ng Aplikasyon na Direktoryo
==================================

Ang layout ng aplikasyon na direktoryo ay nabago at ngayon ay sumusunod sa
`PSR-4 <http://www.php-fig.org/psr/psr-4/>`_. Dapat mong gamitin ang 
`app skeleton <https://github.com/cakephp/app>`_ na proyekto bilang isang 
punto ng reperensya kapag nag-a-update ng iyong aplikasyon.

Ang CakePHP ay dapat naka-install gamit ang Composer
====================================================

Dahil ang CakePHP ay hindi na nai-install gamit ang PEAR, o sa isang nakabahaging
direktoryo, ang mga opsyon na iyon ay hindi na suportado. Sa halip dapat mong 
gamitin ang `Composer <http://getcomposer.org>`_ upang i-install ang CakePHP sa
iyong aplikasyon.

Mga Namespace
=============

Lahat ng core na mga class ng CakePHP ay kasalukuyang naka-namespace at sumusunod sa
PSR-4 autoloading na mga espesipikasyon. Halimbawa ang **src/Cache/Cache.php** ay
naka-namespace bilang ``Cake\Cache\Cache``. Ang global na mga constant at katulong na
mga paraan katulad ng :php:meth:`__()` at :php:meth:`debug()` ay hindi naka-namespace 
para sa kaginhawahan.

Tinanggal ang mga Constant
========================

Ang sumusunod na hindi na ginagamit na mga constant ay tinanggal na:

* ``IMAGES``
* ``CSS``
* ``JS``
* ``IMAGES_URL``
* ``JS_URL``
* ``CSS_URL``
* ``DEFAULT_LANGUAGE``

Kumpigurasyon
=============

Ang kumpigurasyon sa CakePHP 3.0 ay makabuluhang magkaiba kaysa sa nakaraang
mga bersyon. Dapat mong basahin ang :doc:`/development/configuration` na dokumentasyon
kung paano ginagawa ang kumpigurasyon sa 3.0.

Hindi mo na magagamit ang ``App::build()`` upang i-configure ang karagdagang mga landas
ng class. Sa halip dapat mong imapa ang karagdagang mga landas gamit ang autoloader
ng iyong aplikasyon. Tingnan ang seksyon sa :ref:`additional-class-paths` para sa
higit pang impormasyon.

Ang tatlong bagong configure na mga variable ay nagbibigay ng kumpigurasyon ng landas
para sa mga plugin, mga view at lokal na mga file. Maaari kang magdagdag ng maramihang
mga landas sa ``App.paths.templates``, ``App.paths.plugins``, ``App.paths.locales`` upang
i-configure ang maramihang mga landas para sa mga template, mga plugin at lokal na mga
file ayon sa pagkakabanggit.

Ang config key na ``www_root`` ay nabago sa ``wwwRoot`` para sa pagkakaalinsunod. Mangyaring
ayusin ang iyong **app.php** config na file pati na rin sa anumang paggamit ng 
``Configure::read('App.wwwRoot')``.

Bagong ORM
==========

Ang CakePHP 3.0 ay nagtatampok ng isang bagong ORM na muling itinayo mula sa panimula paitaas.
Ang bagong ORM ay makabuluhang magkaiba at hindi tumutugma sa nakaraan.
Ang pag-upgrade sa isang bagong ORM ay nangangailangan ng malawakang pagbabago sa anumang
aplikasyon na ina-upgrade. Tingnan ang bagong :doc:`/orm` na dokumentasyon para sa
impormasyon kung paano gamitin ang bagong ORM.

Mga Batayan
======

* Ang ``LogError()`` ay tinanggal, ito ay walang benepisyong binibigay at bihira/hindi
  kailanman ginamit
* Ang sumusunod na global na mga function ay tinangal: ``config()``, ``cache()``,
  ``clearCache()``, ``convertSlashes()``, ``am()``, ``fileExistsInPath()``,
  ``sortByKey()``.

Pag-debug
=========

* ``Configure::write('debug', $bool)`` ay hindi na sumusuporta sa 0/1/2. Isang simpleng
  boolean ay ginamit sa halip upang magpalit ng debug mode sa on o off.

Object na mga setting/kumpigurasyon
===================================

* Ang mga object na ginagamit sa CakePHP ngayon ay may isang magkaalinsunod na 
  instance-configuration na storage/retrieval na sistema. Ang code na na-access dati sa
  halimbawa: Ang ``$object->settings`` ay dapat sa halip ma-update upang magamit ang
  ``$object->config()``.

Cache
=====

* Ang ``Memcache`` engine ay tinanggal, sa halip ay gumamit ng  :php:class:`Cake\\Cache\\Cache\\Engine\\Memcached`.
* Ang mga cache engine ay naka-lazy load na ngayon sa unang paggamit.
* Ang :php:meth:`Cake\\Cache\\Cache::engine()` ay naidagdag.
* Ang :php:meth:`Cake\\Cache\\Cache::enabled()` ay naidagdag. Pinalitan nito ang
  ``Cache.disable`` configure na opsyon.
* Ang :php:meth:`Cake\\Cache\\Cache::enable()` ay naidagdag.
* Ang :php:meth:`Cake\\Cache\\Cache::disable()` ay naidagdag.
* Ang cache na mga kumpigurasyon ay hindi na pwedeng baguhin ngayon. Kung kailangan
  mong baguhin ang kumpigurasyon dapat mo unang i-drop ang kumpigurasyon at
  pagkatapos ay likhain muli ito. Iniiwasan nito ang sinkronisasyon na mga isyu
  sa kumpigurasyon na mga opsyon.
* Ang ``Cache::set()`` ay tinanggal. Inirekomenda na gumawa ka ng maramihang 
  cache na mga kumpigurasyon upang palitan ang runtime na kumpigurasyon na mga tweak sa
  nakaraan na posible gamit ang ``Cache::set()``.
* Ang lahat ng ``CacheEngine`` na mga subclass ngayon ay nagpapatupad ng isang ``config()``
  na paraan.
* Ang :php:meth:`Cake\\Cache\\Cache::readMany()`, :php:meth:`Cake\\Cache\\Cache::deleteMany()`,
  at :php:meth:`Cake\\Cache\\Cache::writeMany()` ay naidagdag.

Ang lahat ng :php:class:`Cake\\Cache\\Cache\\CacheEngine` na mga paraan ngayon ay pumaparangal/
responsable sa pag-aasikaso ng na-configure na key prefix. Ang :php:meth:`Cake\\Cache\\CacheEngine::write()` 
ay hindi na pumapahintulot sa pagtatakda ng tagal sa pagsulat - ang tagal ay kinuha mula sa runtime
config ng cache engine. Ang pagtawag ng isang cache na paraan gamit ang isang walang laman na key
ay hindi na maghahagis ng isang :php:class:`InvalidArgumentException`, sa halip ng pagsasauli ng 
``false``.

Core
====

App
---

- Ang ``App::pluginPath()`` ay itinanggal. Sa halip ay gumamit ng ``CakePlugin::path()``.
- Ang ``App::build()`` ay itinanggal.
- Ang ``App::location()`` ay itinanggal.
- Ang ``App::paths()`` ay itinanggal.
- Ang ``App::load()`` ay itinanggal.
- Ang ``App::objects()`` ay itinanggal.
- Ang ``App::RESET`` ay itinanggal.
- Ang ``App::APPEND`` ay itinanggal.
- Ang ``App::PREPEND`` ay itinanggal.
- Ang ``App::REGISTER`` ay itinanggal.

Plugin
------

- Ang :php:meth:`Cake\\Core\\Plugin::load()` ay hindi nagsi-setup ng autoloader
  maliban kung itatakda mo ang ``autoload`` na opsyon sa ``true``.
- Kapag naglo-load ng mga plugin hindi ka na maaaring magbigay ng isang callable.
- Kapag naglo-load ng mga plugin hindi ka na maaaring magbigay ng isang array
  ng config na mga file upang i-load.

Configure
---------

- Ang ``Cake\Configure\PhpReader`` ay pinalitan ang pangalan sa 
  :php:class:`Cake\\Core\\Configure\\Engine\PhpConfig`
- Ang ``Cake\Configure\IniReader`` ay pinalitan ang pangalan sa 
  :php:class:`Cake\\Core\\Configure\\Engine\IniConfig`
- Ang ``Cake\Configure\ConfigReaderInterface`` ay pinalitan ang pangalan sa 
  :php:class:`Cake\\Core\\Configure\\ConfigEngineInterface`
- Ang :php:meth:`Cake\\Core\\Configure::consume()` ay idinagdag.
- Ang :php:meth:`Cake\\Core\\Configure::load()` ngayon ay umaasa sa pangalan
  ng file na walang ekstensyon na suffix dahil ito ay maaaring makuha mula sa 
  engine. E.g. ang paggamit ng PhpConfig gamit ang ``app`` upang i-load ang 
  **app.php**.
- Ang pagtakda ng isang ``$config`` na variable sa PHP config na file ay
  hindi na magagamit. Ang :php:class:`Cake\\Core\\Configure\\Engine\PhpConfig` 
  ngayon ay umaasa ng config na file na magsasauli ng isang array.
- Isang bagong config engine na :php:class:`Cake\\Core\\Configure\\Engine\JsonConfig`
  ay naidagdag.

Object
------

Ang ``Object`` na class ay itinanggal. Ito dati ay naglalaman ng maraming iba't ibang
mga paraan na ginamit sa magkaibang mga lugar sa kabuuan ng balangkas. Ang pinaka 
kapaki-pakinabang sa lahat ng mga paraang ito ay nakuha sa mga katangian. Maaari
mong gamitin ang :php:trait:`Cake\\Log\\LogTrait` upang ma-access ang ``log()``
na paraan. Ang :php:trait:`Cake\\Routing\\RequestActionTrait` ay nagbibigay ng 
``requestAction()``.

Console
=======

Ang ``cake`` na executable ay inilipat mula sa **app/Console** na direktoryo tungo sa
**bin** na direktoryo sa loob ng balangkas ng aplikasyon. Maaari mo na ngayong tawagin 
ang console ng CakePHP gamit ang ``bin/cake``.

Ang TaskCollection ay Napalitan
-------------------------------

Ang class na ito ay napalitan ng pangalan sa :php:class:`Cake\\Console\\TaskRegistry`.
Tingnan ang seksyon sa :doc:`/core-libraries/registry-objects` para sa higit pang
impormasyon sa mga tampok na ibinigay gamit ang bagong class. Maaari mong gamitin ang 
``cake upgrade rename_collections`` upang makatulong sa pag-upgrade ng iyong code. 
Ang mga task ay wala nang access sa mga callback, dahil walang anumang mga callback 
na magagamit.

Shell
-----

- Ang ``Shell::__construct()`` ay nabago. Ito ngayon ay kumukuha ng isang instance ng
  :php:class:`Cake\\Console\\ConsoleIo`.
- Ang ``Shell::param()`` ay naidagdag bilang kaginhawaan na pag-access sa mga param.

Bukod pa rito ang lahat ng shell na mga paraan ay mababago sa camel case kapag tinawag.
Halimbawa, kung mayroon kang isang ``hello_world()`` na paraan sa loob ng isang shell at 
tinawag ito gamit ang ``bin/cake my_shell hello_world``, kakailanganin mong palitan 
ang pangalan ng paraan sa ``helloWorld``. Walang mga pagbabagong kailangan sa paraan 
ng pagtawag mo sa mga utos.

ConsoleOptionParser
-------------------

- Ang ``ConsoleOptionParser::merge()`` ay naidagdag sa merge na mga parser.

ConsoleInputArgument
--------------------

- Ang ``ConsoleInputArgument::isEqualTo()`` ay naidagdag upang maghambing ng dalawang mga argumento.

Shell / Task
============

Ang mga Shell at mga Task ay nailipat mula sa ``Console/Command`` at
``Console/Command/Task`` tungo sa ``Shell`` at ``Shell/Task``.

Ang ApiShell ay Itinanggal
--------------------------

Ang ApiShell ay itinanggal dahil ito ay hindi nagbigay ng anumang pakinabang sa pinagmulan ng file
at ang online na dokumentasyon/`API <https://api.cakephp.org/>`_.

Ang SchemaShell ay Itinanggal
-----------------------------

Ang SchemaShell ay itinanggal dahil hindi ito kailanman isang kumpletong implementasyon ng database
migration at mas mabuting mga kasangkapan katulad ng `Phinx <https://phinx.org/>`_ ay lumitaw.
Ito ay napalitan ng `CakePHP Migrations Plugin <https://github.com/cakephp/migrations>`_ 
na kumikilos bilang isang wrapper sa pagitan ng CakePHP at `Phinx <https://phinx.org/>`_.

ExtractTask
-----------

- Ang ``bin/cake i18n extract`` ay hindi na nagsasama ng hindi isinalin na pagpapatunay
  na mga mensahe. Kung gusto mo ng nakasalin na pagpapatunay na mga mensahe dapat mong ibalot
  ang mga mensaheng iyon sa `__()` na mga pagtawag katulad ng anumang ibang nilalaman.

BakeShell / TemplateTask
------------------------

- Ang Bake ay hindi na parte ng core na pinagmulan at napalitan ng 
  `CakePHP Bake Plugin <https://github.com/cakephp/bake>`_
- Ang Bake na mga template ay inilipat sa ilalim ng **src/Template/Bake**.
- Ngayon ang syntax ng Bake na mga template ay gumagamit ng erb-style na mga tag
  (``<% %>``) upang magpakilala ng pang-template na lohika, na nagpapahintulot
  sa php code na tratuhin bilang payak na teksto.
- Ang ``bake view`` na utos ay napalitan ang pangalan ng ``bake template``.

Kaganapan
=========

Ang ``getEventManager()`` na paraan, ay itinanggal sa lahat ng mga object kung
saan naroon ito. Ang isang ``eventManager()`` na paraan ay ibinibigay na ngayon
ng ``EventManagerTrait``. Ang ``EventManagerTrait`` ay naglalaman ng lohika ng
pagbibigay ng halimbawa at pagpapanatili ng isang reperensya sa isang lokal na 
tagapamahala ng kaganapan.

Ang Event na subsystem ay may iilang opsyonal na mga tampok na itinanggal.
Kapag nagpapadala ng mga kaganapan hindi mo na maaaring gamitin ang sumusunod
na mga opsyon:

* ``passParams`` Ngayon ang opsyon na ito ay palagi nang ganap na gumagana.
  Hindi mo na maaaring i-off ito. 
* ``break`` Ang opsyon na ito ay itinanggal. Dapat mo na ngayong itigil ang mga
  kaganapan.
* ``breakOn`` Ang opsyon na ito ay itinanggal. Dapat mo na ngayong itigil ang mga
  kaganapan.

Log
===

* Ngayon ang log na mga kumpigurasyon ay hindi na mababago. Kung kailangan mong
  baguhin ang kumpigurasyon dapat mo unang i-drop ang kumpigurasyon at pagkatapos
  ay ilikha itong muli. Iniiwasan nito ang sinkronisasyon na mga isyu gamit ang
  kumpigurasyon na mga opsyon.
* Ngayon ang mga log engine ay nali-lazy load na sa unang pagsulat sa mga log.
* Ang :php:meth:`Cake\\Log\\Log::engine()` ay naidagdag.
* Ang sumusunod na mga paraan ay itinangal mula sa :php:class:`Cake\\Log\\Log` ::
  ``defaultLevels()``, ``enabled()``, ``enable()``, ``disable()``.
* Hindi ka na maaaring gumawa ng pasadyang mga antas gamit ang ``Log::levels()``.
* Kapag nagko-configure ng mga logger dapat kang gumamit ng ``'levels'``
  sa halip ng ``'types'``.
* Hindi mo na maaaring matukoy ang pasadyang log na mga antas. Dapat kang gumamit
  ng default na hanay ng log na mga antas. Dapat kang gumamit ng mga logging scope
  upang lumikha ng pasadyang log na mga file o tiyak na pag-asikaso para sa
  magkaibang mga seksyon ng iyong aplikasyon. Ang paggamit ng isang non-standard na 
  antas ng log ay maghahagis na ngayong ng isang eksepsyon.
* Ang :php:trait:`Cake\\Log\\LogTrait` ay naidagdag. Maaari mong gamitin ang katangiang
  ito sa iyong mga class upang magdagdag ng ``log()`` na paraan.
* Ang logging scope na ipinasa sa :php:meth:`Cake\\Log\\Log::write()` ay
  naipasa na ngayon sa ``write()`` na paraan ng mga log engine upang magbigay
  ng mas mabuting konteksto sa mga engine.
* Ngayon ang mga log engine ay nangangailangang magpatupad ng ``Psr\Log\LogInterface``
  sa halip ng ``LogInterface`` ng Cake. Sa pangkalahatan, kung pinalawak ang 
  :php:class:`Cake\\Log\\Engine\\BaseEngine` kailangan mo lang palitan ang pangalan 
  ng ``write()`` na paraan ng ``log()``.
* Ang :php:meth:`Cake\\Log\\Engine\\FileLog` ngayon ay magsusulat ng mga file sa
  ``ROOT/logs`` sa halip ng ``ROOT/tmp/logs``.

Pag-Route
=========

Nakapangalang mga Parameter
---------------------------

Ang nakapangalang mga parameter ay itinanggal sa 3.0. Ang nakapangalang mga 
parameter ay idinagdag sa 1.2.0 bilang isang 'magandang' bersyon ng query string
na mga parameter. Habang ang biswal na pakinabang ay malabo, ang mga problema
na ginawa ng nakapangalang mga parameter ay hindi.

Ang nakapangalang mga parameter ay nangangailangan ng espesyal na pag-aasikaso
sa CakePHP pati na rin sa anumang PHP o JavaScript na library na kailangang
makipag-ugnayan sa kanila, dahil ang nakapangalang mga parameter ay hindi 
naipatupad o naintindihan ng anumang library *maliban sa* CakePHP. Ang karagdagang
pagkakumplikado at code na kailangan upang sumuporta ng nakapangalang mga 
parameter ay hindi nagbibigay-katwiran sa kanilang pag-iral, at sila ay itinanggal.
Sa kanilang lugar dapat kang gumamit ng standard query string na mga parameter o
naipasang mga argumento. Bilang default ang ``Router`` ay makikitungo sa 
anumang karagdagang mga parameter sa ``Router::url()`` bilang query string na
mga argumento.

Dahil maraming mga aplikasyon ang nangangailangan pa ring mag-parse ng paparating
na mga URL na naglalamang ng nakapangalang mga parameter. Ang 
:php:meth:`Cake\\Routing\\Router::parseNamedParams()` ay naidagdag upang 
magpahintulot ng backwards compatibility gamit ang umiiral na mga URL.

RequestActionTrait
------------------

- Ang :php:meth:`Cake\\Routing\\RequestActionTrait::requestAction()` ay mayroong
  ilan sa karagdagang mga opsyon na nabago:

  - Ang ``options[url]`` ngayon ay ``options[query]`` na.
  - Ang ``options[data]`` ngayon ay ``options[post]`` na.
  - Ang nakapangalang mga parameter ay hindi na suportado.

Router
------

* Ang nakapangalang mga parameter ay itinanggal, tingnan ang itaas para sa
  higit pang impormasyon.
* Ang ``full_base`` na opsyon ay napalitan ng ``_full`` na opsyon.
* Ang ``ext`` na opsyon ay napalitan ng ``_ext`` na opsyon.
* Ang ``_scheme``, ``_port``, ``_host``, ``_base``, ``_full``, ``_ext`` na mga
  opsyon ay nadagdag.
* Ang String na mga URL ay hindi na nababago sa pamamagitan ng pagdagdag ng 
  plugin/controller/prefix na mga pangalan.
* Ang default na fallback route na pag-aasikaso ay itinanggal. Kung walang route 
  na tumutugma ang isang hanay ng parameter na ``/`` ang maisasauli.
* Ang Route na mga class ay responsable para sa *lahat* ng pagbuo ng URL pati na
  rin sa query string na mga parameter. Ginagawa nitong sobrang mas makapangyarihan
  at umaangkop ang mga route.
* Ang paulit-ulit na mga parameter ay natanggal. Sila ay napalitan ng 
  :php:meth:`Cake\\Routing\\Router::urlFilter()` na nagpapahintulot ng isang
  mas umaangkop na paraan upang mag-mutate ng mga URL na iniri-reverse route.
* Ang ``Router::parseExtensions()`` ay itinanggal.
  Sa halip ay gamitin ang :php:meth:`Cake\\Routing\\Router::extensions()`. Ang
  paraang ito ay **dapat** tawagin bago makonektado ang mga route. Hindi nito
  babaguhin ang umiiral na mga route.
* Ang ``Router::setExtensions()`` ay itinanggal.
  Sa halip ay gimitin ang :php:meth:`Cake\\Routing\\Router::extensions()`.
* Ang ``Router::resourceMap()`` ay itinanggal.
* Ang ``[method]`` na opsyon ay napalitan ang pangalan ng ``_method``.
* Ang kakayahang tumugma ng mga arbitrary headers gamit ang ``[]`` na estilo
  na mga parameter ay itinanggal. Kung kailangan mong mag-parse/tumugma sa 
  arbitrary na mga kondisyon isaalang-alang ang paggamit ng pasadyang route
  na mga class.
* Ang ``Router::promote()`` ay itinanggal.
* Ang ``Router::parse()`` ngayon ay magtataas ng isang eksepsyon kapag ang isang
  URL ay hindi kayang maasikaso gamit ang anumang route.
* Ang ``Router::url()`` ngayon ay magtataas ng isang eksepsyon kapag walang route
  na tumutugma sa isang hanay ng mga parameter.
* Ang mga routing scope ay naipakilala. Ang mga routing scope ay nagpapahintulot
  sa iyo na mapanatiling TUYO ang iyong mga route na file at nagbibigay ng 
  mga pahiwatig sa Router kung papaano i-optimize ang pag-parse at pag-reverse
  routing ng mga URL.

Route
-----

* Ang ``CakeRoute`` ay napalitan ang pangalan ng ``Route``.
* Ang lagda ng ``match()`` na binago sa ``match($url, $context = [])``
  Tingnan ang :php:meth:`Cake\\Routing\\Route::match()` para sa impormasyon
  sa bagong lagda.


Ang Kumpigurasyon ng Dispatcher na mga Filter ay Nabago
-------------------------------------------------------

Ang Dispatcher na mga filter ay hindi na nadagdag sa iyong aplikasyon gamit 
ang ``Configure``. Idaragdag mo na ngayon ang mga ito gamit ang 
:php:class:`Cake\\Routing\\DispatcherFactory`. Ito ay nangangahulugang kung
ang iyong aplikasyon ay gumamit ng ``Dispatcher.filters``, dapat mo na ngayong
gamitin ang :php:meth:`Cake\\Routing\\DispatcherFactory::add()`.

Sa karagdagan sa pagkumpigura ng mga pagbabago, ang dispatcher na mga filter
ay may mga kombensiyon na na-update, at mga tampok na nadagdag. Tingnan ang 
:doc:`/development/dispatch-filters` na dokumentasyon para sa karagdagang
impormasyon.

Filter\AssetFilter
------------------

* Ang plugin at theme na mga asset na inasikaso ng AssetFilter ay hindi na 
  nababasa gamit ang ``include`` sa halip sila ay tinatrato bilang payak na teksto
  na mga file. Inaayos nito ang ilang mga isyu gamit ang JavaScript na mga library
  katulad ng TinyMCE at mga environment gamit ang gumaganang short_tags.
* Ang suporta para sa ``Asset.filter`` na kumpigurasyon at mga hook ay tinanggal.
  Ang tampok na ito ay dapat mapalitan ng isang plugin o dispatcher na filter.

Network
=======

Kahilingan
----------

* Ang ``CakeRequest`` ay napalitan ang pangalan ng :php:class:`Cake\\Network\\Request`.
* Ang :php:meth:`Cake\\Network\\Request::port()` ay nadagdag.
* Ang :php:meth:`Cake\\Network\\Request::scheme()` ay nadagdag.
* Ang :php:meth:`Cake\\Network\\Request::cookie()` ay nadagdag.
* Ang :php:attr:`Cake\\Network\\Request::$trustProxy` ay nadagdag. Ginagawa nitong mas
  madali ang paglagay ng CakePHP na mga aplikasyon sa likod ng mga load balancer.
* Ang :php:attr:`Cake\\Network\\Request::$data` ay hindi na naka-merge sa naka-prefix
  na data key, dahil ang prefix na iyon ay tinanggal.
* Ang :php:meth:`Cake\\Network\\Request::env()` ay nadagdag.
* Ang :php:meth:`Cake\\Network\\Request::acceptLanguage()` ay nabago mula sa static na
  paraan at naging hindi static.
* Ang detektor ng kahilingan para sa "mobile" ay tinanggal mula sa core. Sa halip ang app
  na template ay nagdagdag ng mga detektor para sa "mobile" at "table" gamit ang 
  ``MobileDetect`` na lib.
* Ang paraan na ``onlyAllow()`` ay napalitan ang pangalan ng ``allowMethod()`` at hindi
  na tumatanggap ng "var args". Ang lahat ng mga pangalan ng paraan na ipapasa bilang
  unang argumento, alinman bilang string o array ng mga string.

Tugon
-----

* Ang pagmapa ng mimetype na ``text/plain`` sa ekstensyon na ``csv`` ay itinanggal.
  Bilang kapalit ang :php:class:`Cake\\Controller\\Component\\RequestHandlerComponent`
  ay hindi nagtatakda ng ekstensyon sa ``csv`` kung ang ``Accept`` na header ay
  naglalaman ng mimetype na ``text/plain`` na isang karaniwang kaguluhan kapag
  tumatanggap ng isang jQuery XHR na kahilingan.  
  
Sessions
========

The session class is no longer static, instead the session can be accessed
through the request object. See the :doc:`/development/sessions` documentation
for using the session object.

* :php:class:`Cake\\Network\\Session` and related session classes have been
  moved under the ``Cake\Network`` namespace.
* ``SessionHandlerInterface`` has been removed in favor of the one provided by
  PHP itself.
* The property ``Session::$requestCountdown`` has been removed.
* The session checkAgent feature has been removed. It caused a number of bugs
  when chrome frame, and flash player are involved.
* The conventional sessions database table name is now ``sessions`` instead of
  ``cake_sessions``.
* The session cookie timeout is automatically updated in tandem with the timeout
  in the session data.
* The path for session cookie now defaults to app's base path instead of "/".
  A new configuration variable ``Session.cookiePath`` has been added to
  customize the cookie path.
* A new convenience method :php:meth:`Cake\\Network\\Session::consume()` has been added
  to allow reading and deleting session data in a single step.
* The default value of :php:meth:`Cake\\Network\\Session::clear()`'s argument ``$renew`` has been changed
  from ``true`` to ``false``.

Network\\Http
=============

* ``HttpSocket`` is now :php:class:`Cake\\Network\\Http\\Client`.
* Http\Client has been re-written from the ground up. It has a simpler/easier to
  use API, support for new authentication systems like OAuth, and file uploads.
  It uses PHP's stream APIs so there is no requirement for cURL. See the
  :doc:`/core-libraries/httpclient` documentation for more information.

Network\\Email
==============

* :php:meth:`Cake\\Network\\Email\\Email::config()` is now used to define
  configuration profiles. This replaces the ``EmailConfig`` classes in previous
  versions.
* :php:meth:`Cake\\Network\\Email\\Email::profile()` replaces ``config()`` as
  the way to modify per instance configuration options.
* :php:meth:`Cake\\Network\\Email\\Email::drop()` has been added to allow the
  removal of email configuration.
* :php:meth:`Cake\\Network\\Email\\Email::configTransport()` has been added to allow the
  definition of transport configurations. This change removes transport options
  from delivery profiles and allows you to re-use transports across email
  profiles.
* :php:meth:`Cake\\Network\\Email\\Email::dropTransport()` has been added to allow the
  removal of transport configuration.

Controller
==========

Controller
----------

- The ``$helpers``, ``$components`` properties are now merged
  with **all** parent classes not just ``AppController`` and the plugin
  AppController. The properties are merged differently now as well. Instead of
  all settings in all classes being merged together, the configuration defined
  in the child class will be used. This means that if you have some
  configuration defined in your AppController, and some configuration defined in
  a subclass, only the configuration in the subclass will be used.
- ``Controller::httpCodes()`` has been removed, use
  :php:meth:`Cake\\Network\\Response::httpCodes()` instead.
- ``Controller::disableCache()`` has been removed, use
  :php:meth:`Cake\\Network\\Response::disableCache()` instead.
- ``Controller::flash()`` has been removed. This method was rarely used in real
  applications and served no purpose anymore.
- ``Controller::validate()`` and ``Controller::validationErrors()`` have been
  removed. They were left over methods from the 1.x days where the concerns of
  models + controllers were far more intertwined.
- ``Controller::loadModel()`` now loads table objects.
- The ``Controller::$scaffold`` property has been removed. Dynamic scaffolding
  has been removed from CakePHP core.  An improved scaffolding plugin, named CRUD, can be found here: https://github.com/FriendsOfCake/crud
- The ``Controller::$ext`` property has been removed. You now have to extend and
  override the ``View::$_ext`` property if you want to use a non-default view file
  extension.
- The ``Controller::$methods`` property has been removed. You should now use
  ``Controller::isAction()`` to determine whether or not a method name is an
  action. This change was made to allow easier customization of what is and is
  not counted as an action.
- The ``Controller::$Components`` property has been removed and replaced with
  ``_components``. If you need to load components at runtime you should use
  ``$this->loadComponent()`` on your controller.
- The signature of :php:meth:`Cake\\Controller\\Controller::redirect()` has been
  changed to ``Controller::redirect(string|array $url, int $status = null)``.
  The 3rd argument ``$exit`` has been dropped. The method can no longer send
  response and exit script, instead it returns a ``Response`` instance with
  appropriate headers set.
- The ``base``, ``webroot``, ``here``, ``data``,  ``action``, and ``params``
  magic properties have been removed. You should access all of these properties
  on ``$this->request`` instead.
- Underscore prefixed controller methods like ``_someMethod()`` are no longer
  treated as private methods. Use proper visibility keywords instead. Only
  public methods can be used as controller actions.

Scaffold Removed
----------------

The dynamic scaffolding in CakePHP has been removed from CakePHP core. It was
infrequently used, and never intended for production use. An improved
scaffolding plugin, named CRUD, can be found here:
https://github.com/FriendsOfCake/crud

ComponentCollection Replaced
----------------------------

This class has been renamed to :php:class:`Cake\\Controller\\ComponentRegistry`.
See the section on :doc:`/core-libraries/registry-objects` for more information
on the features provided by the new class. You can use the ``cake upgrade
rename_collections`` to assist in upgrading your code.

Component
---------

* The ``_Collection`` property is now ``_registry``. It contains an instance
  of :php:class:`Cake\\Controller\\ComponentRegistry` now.
* All components should now use the ``config()`` method to get/set
  configuration.
* Default configuration for components should be defined in the
  ``$_defaultConfig`` property. This property is automatically merged with any
  configuration provided to the constructor.
* Configuration options are no longer set as public properties.
* The ``Component::initialize()`` method is no longer an event listener.
  Instead, it is a post-constructor hook like ``Table::initialize()`` and
  ``Controller::initialize()``. The new ``Component::beforeFilter()`` method is
  bound to the same event that ``Component::initialize()`` used to be. The
  initialize method should have the following signature ``initialize(array
  $config)``.

Controller\\Components
======================

CookieComponent
---------------

- Uses :php:meth:`Cake\\Network\\Request::cookie()` to read cookie data,
  this eases testing, and allows for ControllerTestCase to set cookies.
- Cookies encrypted in previous versions of CakePHP using the ``cipher()`` method
  are now un-readable because ``Security::cipher()`` has been removed. You will
  need to re-encrypt cookies with the ``rijndael()`` or ``aes()`` method before upgrading.
- ``CookieComponent::type()`` has been removed and replaced with configuration
  data accessed through ``config()``.
- ``write()`` no longer takes ``encryption`` or ``expires`` parameters. Both of
  these are now managed through config data. See
  :doc:`/controllers/components/cookie` for more information.
- The path for cookies now defaults to app's base path instead of "/".

AuthComponent
-------------

- ``Default`` is now the default password hasher used by authentication classes.
  It uses exclusively the bcrypt hashing algorithm. If you want to continue using
  SHA1 hashing used in 2.x use ``'passwordHasher' => 'Weak'`` in your authenticator configuration.
- A new ``FallbackPasswordHasher`` was added to help users migrate old passwords
  from one algorithm to another. Check AuthComponent's documentation for more
  info.
- ``BlowfishAuthenticate`` class has been removed. Just use ``FormAuthenticate``
- ``BlowfishPasswordHasher`` class has been removed. Use
  ``DefaultPasswordHasher`` instead.
- The ``loggedIn()`` method has been removed. Use ``user()`` instead.
- Configuration options are no longer set as public properties.
- The methods ``allow()`` and ``deny()`` no longer accept "var args". All method names need
  to be passed as first argument, either as string or array of strings.
- The method ``login()`` has been removed and replaced by ``setUser()`` instead.
  To login a user you now have to call ``identify()`` which returns user info upon
  successful identification and then use ``setUser()`` to save the info to
  session for persistence across requests.

- ``BaseAuthenticate::_password()`` has been removed. Use a ``PasswordHasher``
  class instead.
- ``BaseAuthenticate::logout()`` has been removed.
- ``AuthComponent`` now triggers two events ``Auth.afterIdentify`` and
  ``Auth.logout`` after a user has been identified and before a user is
  logged out respectively. You can set callback functions for these events by
  returning a mapping array from ``implementedEvents()`` method of your
  authenticate class.

ACL related classes were moved to a separate plugin. Password hashers, Authentication and
Authorization providers where moved to the ``\Cake\Auth`` namespace. You are
required to move your providers and hashers to the ``App\Auth`` namespace as
well.

RequestHandlerComponent
-----------------------

- The following methods have been removed from RequestHandler component::
  ``isAjax()``, ``isFlash()``, ``isSSL()``, ``isPut()``, ``isPost()``, ``isGet()``, ``isDelete()``.
  Use the :php:meth:`Cake\\Network\\Request::is()` method instead with relevant argument.
- ``RequestHandler::setContent()`` was removed, use :php:meth:`Cake\\Network\\Response::type()` instead.
- ``RequestHandler::getReferer()`` was removed, use :php:meth:`Cake\\Network\\Request::referer()` instead.
- ``RequestHandler::getClientIP()`` was removed, use :php:meth:`Cake\\Network\\Request::clientIp()` instead.
- ``RequestHandler::getAjaxVersion()`` was removed.
- ``RequestHandler::mapType()`` was removed, use :php:meth:`Cake\\Network\\Response::mapType()` instead.
- Configuration options are no longer set as public properties.

SecurityComponent
-----------------

- The following methods and their related properties have been removed from Security component:
  ``requirePost()``, ``requireGet()``, ``requirePut()``, ``requireDelete()``.
  Use the :php:meth:`Cake\\Network\\Request::allowMethod()` instead.
- ``SecurityComponent::$disabledFields()`` has been removed, use
  ``SecurityComponent::$unlockedFields()``.
- The CSRF related features in SecurityComponent have been extracted and moved
  into a separate CsrfComponent. This allows you to use CSRF protection
  without having to use form tampering prevention.
- Configuration options are no longer set as public properties.
- The methods ``requireAuth()`` and ``requireSecure()`` no longer accept "var args".
  All method names need to be passed as first argument, either as string or array of strings.

SessionComponent
----------------

- ``SessionComponent::setFlash()`` is deprecated. You should use
  :doc:`/controllers/components/flash` instead.

Error
-----

Custom ExceptionRenderers are now expected to either return
a :php:class:`Cake\\Network\\Response` object or string when rendering errors. This means
that any methods handling specific exceptions must return a response or string
value.

Model
=====

The Model layer in 2.x has been entirely re-written and replaced. You should
review the :doc:`/appendices/orm-migration` for information on how to use the
new ORM.

- The ``Model`` class has been removed.
- The ``BehaviorCollection`` class has been removed.
- The ``DboSource`` class has been removed.
- The ``Datasource`` class has been removed.
- The various datasource classes have been removed.

ConnectionManager
-----------------

- ConnectionManager has been moved to the ``Cake\Datasource`` namespace.
- ConnectionManager has had the following methods removed:

  - ``sourceList``
  - ``getSourceName``
  - ``loadDataSource``
  - ``enumConnectionObjects``

- :php:meth:`~Cake\\Database\\ConnectionManager::config()` has been added and is
  now the only way to configure connections.
- :php:meth:`~Cake\\Database\\ConnectionManager::get()` has been added. It
  replaces ``getDataSource()``.
- :php:meth:`~Cake\\Database\\ConnectionManager::configured()` has been added. It
  and ``config()`` replace ``sourceList()`` & ``enumConnectionObjects()`` with
  a more standard and consistent API.
- ``ConnectionManager::create()`` has been removed.
  It can be replaced by ``config($name, $config)`` and ``get($name)``.

Behaviors
---------
- Underscore prefixed behavior methods like ``_someMethod()`` are no longer
  treated as private methods. Use proper visibility keywords instead.

TreeBehavior
------------

The TreeBehavior was completely re-written to use the new ORM. Although it works
the same as in 2.x, a few methods were renamed or removed:

- ``TreeBehavior::children()`` is now a custom finder ``find('children')``.
- ``TreeBehavior::generateTreeList()`` is now a custom finder ``find('treeList')``.
- ``TreeBehavior::getParentNode()`` was removed.
- ``TreeBehavior::getPath()`` is now a custom finder ``find('path')``.
- ``TreeBehavior::reorder()`` was removed.
- ``TreeBehavior::verify()`` was removed.

TestSuite
=========

TestCase
--------

- ``_normalizePath()`` has been added to allow path comparison tests to run across all
  operation systems regarding their DS settings (``\`` in Windows vs ``/`` in UNIX, for example).

The following assertion methods have been removed as they have long been deprecated and replaced by
their new PHPUnit counterpart:

- ``assertEqual()`` in favor of ``assertEquals()``
- ``assertNotEqual()`` in favor of ``assertNotEquals()``
- ``assertIdentical()`` in favor of ``assertSame()``
- ``assertNotIdentical()`` in favor of ``assertNotSame()``
- ``assertPattern()`` in favor of ``assertRegExp()``
- ``assertNoPattern()`` in favor of ``assertNotRegExp()``
- ``assertReference()`` if favor of ``assertSame()``
- ``assertIsA()`` in favor of ``assertInstanceOf()``

Note that some methods have switched the argument order, e.g. ``assertEqual($is, $expected)`` should now be
``assertEquals($expected, $is)``.

The following assertion methods have been deprecated and will be removed in the future:

- ``assertWithinMargin()`` in favor of ``assertWithinRange()``
- ``assertTags()`` in favor of ``assertHtml()``

Both method replacements also switched the argument order for a consistent assert method API
with ``$expected`` as first argument.

The following assertion methods have been added:

- ``assertNotWithinRange()`` as counter part to ``assertWithinRange()``

View
====

Themes are now Basic Plugins
----------------------------

Having themes and plugins as ways to create modular application components has
proven to be limited, and confusing. In CakePHP 3.0, themes no longer reside
**inside** the application. Instead they are standalone plugins. This solves
a few problems with themes:

- You could not put themes *in* plugins.
- Themes could not provide helpers, or custom view classes.

Both these issues are solved by converting themes into plugins.

View Folders Renamed
--------------------

The folders containing view files now go under **src/Template** instead of **src/View**.
This was done to separate the view files from files containing php classes (eg. Helpers, View classes).

The following View folders have been renamed to avoid naming collisions with controller names:

- ``Layouts`` is now ``Layout``
- ``Elements`` is now ``Element``
- ``Errors`` is now ``Error``
- ``Emails`` is now ``Email`` (same for ``Email`` inside ``Layout``)

HelperCollection Replaced
-------------------------

This class has been renamed to :php:class:`Cake\\View\\HelperRegistry`.
See the section on :doc:`/core-libraries/registry-objects` for more information
on the features provided by the new class. You can use the ``cake upgrade
rename_collections`` to assist in upgrading your code.

View Class
----------

- The ``plugin`` key has been removed from ``$options`` argument of :php:meth:`Cake\\View\\View::element()`.
  Specify the element name as ``SomePlugin.element_name`` instead.
- ``View::getVar()`` has been removed, use :php:meth:`Cake\\View\\View::get()` instead.
- ``View::$ext`` has been removed and instead a protected property ``View::$_ext``
  has been added.
- ``View::addScript()`` has been removed. Use :ref:`view-blocks` instead.
- The ``base``, ``webroot``, ``here``, ``data``,  ``action``, and ``params``
  magic properties have been removed. You should access all of these properties
  on ``$this->request`` instead.
- ``View::start()`` no longer appends to an existing block. Instead it will
  overwrite the block content when end is called. If you need to combine block
  contents you should fetch the block content when calling start a second time,
  or use the capturing mode of ``append()``.
- ``View::prepend()`` no longer has a capturing mode.
- ``View::startIfEmpty()`` has been removed. Now that start() always overwrites
  startIfEmpty serves no purpose.
- The ``View::$Helpers`` property has been removed and replaced with
  ``_helpers``. If you need to load helpers at runtime you should use
  ``$this->addHelper()`` in your view files.
- ``View`` will now raise ``Cake\View\Exception\MissingTemplateException`` when
  templates are missing instead of ``MissingViewException``.

ViewBlock
---------

- ``ViewBlock::append()`` has been removed, use :php:meth:`Cake\\View\ViewBlock::concat()` instead. However,
  ``View::append()`` still exists.

JsonView
--------

- By default JSON data will have HTML entities encoded now. This prevents
  possible XSS issues when JSON view content is embedded in HTML files.
- :php:class:`Cake\\View\\JsonView` now supports the ``_jsonOptions`` view
  variable. This allows you to configure the bit-mask options used when generating
  JSON.

XmlView
-------

- :php:class:`Cake\\View\\XmlView` now supports the ``_xmlOptions`` view
  variable. This allows you to configure the options used when generating
  XML.

View\\Helper
============

- The ``$settings`` property is now called ``$_config`` and should be accessed
  through the ``config()`` method.
- Configuration options are no longer set as public properties.
- ``Helper::clean()`` was removed. It was never robust enough
  to fully prevent XSS. instead you should escape content with :php:func:`h` or
  use a dedicated library like htmlPurifier.
- ``Helper::output()`` was removed. This method was
  deprecated in 2.x.
- Methods ``Helper::webroot()``, ``Helper::url()``, ``Helper::assetUrl()``,
  ``Helper::assetTimestamp()`` have been moved to new :php:class:`Cake\\View\\Helper\\UrlHelper`
  helper. ``Helper::url()`` is now available as :php:meth:`Cake\\View\\Helper\\UrlHelper::build()`.
- Magic accessors to deprecated properties have been removed. The following
  properties now need to be accessed from the request object:

  - base
  - here
  - webroot
  - data
  - action
  - params

Helper
------

Helper has had the following methods removed:

* ``Helper::setEntity()``
* ``Helper::entity()``
* ``Helper::model()``
* ``Helper::field()``
* ``Helper::value()``
* ``Helper::_name()``
* ``Helper::_initInputField()``
* ``Helper::_selectedArray()``

These methods were part used only by FormHelper, and part of the persistent
field features that have proven to be problematic over time. FormHelper no
longer relies on these methods and the complexity they provide is not necessary
anymore.

The following methods have been removed:

* ``Helper::_parseAttributes()``
* ``Helper::_formatAttribute()``

These methods can now be found on the ``StringTemplate`` class that helpers
frequently use. See the ``StringTemplateTrait`` for an easy way to integrate
string templates into your own helpers.

FormHelper
----------

FormHelper has been entirely rewritten for 3.0. It features a few large changes:

* FormHelper works with the new ORM. But has an extensible system for
  integrating with other ORMs or datasources.
* FormHelper features an extensible widget system that allows you to create new
  custom input widgets and augment the built-in ones.
* String templates are the foundation of the helper. Instead of munging arrays
  together everywhere, most of the HTML FormHelper generates can be customized
  in one central place using template sets.

In addition to these larger changes, some smaller breaking changes have been
made as well. These changes should help streamline the HTML FormHelper generates
and reduce the problems people had in the past:

- The ``data[`` prefix was removed from all generated inputs.  The prefix serves no real purpose anymore.
- The various standalone input methods like ``text()``, ``select()`` and others
  no longer generate id attributes.
- The ``inputDefaults`` option has been removed from ``create()``.
- Options ``default`` and ``onsubmit`` of ``create()`` have been removed. Instead
  one should use JavaScript event binding or set all required js code for ``onsubmit``.
- ``end()`` can no longer make buttons. You should create buttons with
  ``button()`` or ``submit()``.
- ``FormHelper::tagIsInvalid()`` has been removed. Use ``isFieldError()``
  instead.
- ``FormHelper::inputDefaults()`` has been removed. You can use ``templates()``
  to define/augment the templates FormHelper uses.
- The ``wrap`` and ``class`` options have been removed from the ``error()``
  method.
- The ``showParents`` option has been removed from select().
- The ``div``, ``before``, ``after``, ``between`` and ``errorMessage`` options
  have been removed from ``input()``.  You can use templates to update the
  wrapping HTML. The ``templates`` option allows you to override the loaded
  templates for one input.
- The ``separator``, ``between``, and ``legend`` options have been removed from
  ``radio()``. You can use templates to change the wrapping HTML now.
- The ``format24Hours`` parameter has been removed from ``hour()``.
  It has been replaced with the ``format`` option.
- The ``minYear``, and ``maxYear`` parameters have been removed from ``year()``.
  Both of these parameters can now be provided as options.
- The ``dateFormat`` and ``timeFormat`` parameters have been removed from
  ``datetime()``. You can use the template to define the order the inputs should
  be displayed in.
- The ``submit()`` has had the ``div``, ``before`` and ``after`` options
  removed. You can customize the ``submitContainer`` template to modify this
  content.
- The ``inputs()`` method no longer accepts ``legend`` and ``fieldset`` in the
  ``$fields`` parameter, you must use the ``$options`` parameter.
  It now also requires ``$fields`` parameter to be an array. The ``$blacklist``
  parameter has been removed, the functionality has been replaced by specifying
  ``'field' => false`` in the ``$fields`` parameter.
- The ``inline`` parameter has been removed from postLink() method.
  You should use the ``block`` option instead. Setting ``block => true`` will
  emulate the previous behavior.
- The ``timeFormat`` parameter for ``hour()``, ``time()`` and ``dateTime()`` now
  defaults to 24, complying with ISO 8601.
- The ``$confirmMessage`` argument of :php:meth:`Cake\\View\\Helper\\FormHelper::postLink()`
  has been removed. You should now use key ``confirm`` in ``$options`` to specify
  the message.
- Checkbox and radio input types are now rendered *inside* of label elements
  by default. This helps increase compatibility with popular CSS libraries like
  `Bootstrap <http://getbootstrap.com/>`_ and
  `Foundation <http://foundation.zurb.com/>`_.
- Templates tags are now all camelBacked. Pre-3.0 tags ``formstart``, ``formend``, ``hiddenblock``
  and ``inputsubmit`` are now ``formStart``, ``formEnd``, ``hiddenBlock`` and ``inputSubmit``.
  Make sure you change them if they are customized in your app.

It is recommended that you review the :doc:`/views/helpers/form`
documentation for more details on how to use the FormHelper in 3.0.

HtmlHelper
----------

- ``HtmlHelper::useTag()`` has been removed, use ``tag()`` instead.
- ``HtmlHelper::loadConfig()`` has been removed. Customizing the tags can now be
  done using ``templates()`` or the ``templates`` setting.
- The second parameter ``$options`` for ``HtmlHelper::css()`` now always requires an array as documented.
- The first parameter ``$data`` for ``HtmlHelper::style()`` now always requires an array as documented.
- The ``inline`` parameter has been removed from meta(), css(), script(), scriptBlock()
  methods. You should use the ``block`` option instead. Setting ``block =>
  true`` will emulate the previous behavior.
- ``HtmlHelper::meta()`` now requires ``$type`` to be a string. Additional options can
  further on be passed as ``$options``.
- ``HtmlHelper::nestedList()`` now requires ``$options`` to be an array. The forth argument for the tag type
  has been removed and included in the ``$options`` array.
- The ``$confirmMessage`` argument of :php:meth:`Cake\\View\\Helper\\HtmlHelper::link()`
  has been removed. You should now use key ``confirm`` in ``$options`` to specify
  the message.

PaginatorHelper
---------------

- ``link()`` has been removed. It was no longer used by the helper internally.
  It had low usage in user land code, and no longer fit the goals of the helper.
- ``next()`` no longer has 'class', or 'tag' options. It no longer has disabled
  arguments. Instead templates are used.
- ``prev()`` no longer has 'class', or 'tag' options. It no longer has disabled
  arguments. Instead templates are used.
- ``first()`` no longer has 'after', 'ellipsis', 'separator', 'class', or 'tag' options.
- ``last()`` no longer has 'after', 'ellipsis', 'separator', 'class', or 'tag' options.
- ``numbers()`` no longer has 'separator', 'tag', 'currentTag', 'currentClass',
  'class', 'tag', 'ellipsis' options. These options are now facilitated through
  templates. It also requires the ``$options`` parameter to be an array now.
- The ``%page%`` style placeholders have been removed from :php:meth:`Cake\\View\\Helper\\PaginatorHelper::counter()`.
  Use ``{{page}}`` style placeholders instead.
- ``url()`` has been renamed to ``generateUrl()`` to avoid method declaration clashes with ``Helper::url()``.

By default all links and inactive texts are wrapped in ``<li>`` elements. This
helps make CSS easier to write, and improves compatibility with popular CSS
frameworks.

Instead of the various options in each method, you should use the templates
feature. See the :ref:`paginator-templates` documentation for
information on how to use templates.

TimeHelper
----------

- ``TimeHelper::__set()``, ``TimeHelper::__get()``, and  ``TimeHelper::__isset()`` were
  removed. These were magic methods for deprecated attributes.
- ``TimeHelper::serverOffset()`` has been removed.  It promoted incorrect time math practices.
- ``TimeHelper::niceShort()`` has been removed.

NumberHelper
------------

- :php:meth:`NumberHelper::format()` now requires ``$options`` to be an array.

SessionHelper
-------------

- The ``SessionHelper`` has been deprecated. You can use ``$this->request->session()`` directly,
  and the flash message functionality has been moved into :doc:`/views/helpers/flash` instead.

JsHelper
--------

- ``JsHelper`` and all associated engines have been removed. It could only
  generate a very small subset of JavaScript code for selected library and
  hence trying to generate all JavaScript code using just the helper often
  became an impediment. It's now recommended to directly use JavaScript library
  of your choice.

CacheHelper Removed
-------------------

CacheHelper has been removed. The caching functionality it provided was
non-standard, limited and incompatible with non-HTML layouts and data views.
These limitations meant a full rebuild would be necessary. Edge Side Includes
have become a standardized way to implement the functionality CacheHelper used
to provide. However, implementing `Edge Side Includes
<http://en.wikipedia.org/wiki/Edge_Side_Includes>`_ in PHP has a number of
limitations and edge cases. Instead of building a sub-par solution, we recommend
that developers needing full response caching use `Varnish
<http://varnish-cache.org>`_ or `Squid <http://squid-cache.org>`_ instead.

I18n
====

The I18n subsystem was completely rewritten. In general, you can expect the same
behavior as in previous versions, specifically if you are using the ``__()``
family of functions.

Internally, the ``I18n`` class uses ``Aura\Intl``, and appropriate methods are
exposed to access the specific features of this library. For this reason most
methods inside ``I18n`` were removed or renamed.

Due to the use of ``ext/intl``, the L10n class was completely removed. It
provided outdated and incomplete data in comparison to the data available from
the ``Locale`` class in PHP.

The default application language will no longer be changed automatically by the
browser accepted language nor by having the ``Config.language`` value set in the
browser session. You can, however, use a dispatcher filter to get automatic
language switching from the ``Accept-Language`` header sent by the browser::

    // In config/bootstrap.php
    DispatcherFactory::addFilter('LocaleSelector');

There is no built-in replacement for automatically selecting the language by
setting a value in the user session.

The default formatting function for translated messages is no longer
``sprintf``, but the more advanced and feature rich ``MessageFormatter`` class.
In general you can rewrite placeholders in messages as follows::

    // Before:
    __('Today is a %s day in %s', 'Sunny', 'Spain');

    // After:
    __('Today is a {0} day in {1}', 'Sunny', 'Spain');

You can avoid rewriting your messages by using the old ``sprintf`` formatter::

    I18n::defaultFormatter('sprintf');

Additionally, the ``Config.language`` value was removed and it can no longer be
used to control the current language of the application. Instead, you can use
the ``I18n`` class::

    // Before
    Configure::write('Config.language', 'fr_FR');

    // Now
    I18n::setLocale('en_US');

- The methods below have been moved:

    - From ``Cake\I18n\Multibyte::utf8()`` to ``Cake\Utility\Text::utf8()``
    - From ``Cake\I18n\Multibyte::ascii()`` to ``Cake\Utility\Text::ascii()``
    - From ``Cake\I18n\Multibyte::checkMultibyte()`` to ``Cake\Utility\Text::isMultibyte()``

- Since CakePHP now requires the mbstring extension, the
  ``Multibyte`` class has been removed.
- Error messages throughout CakePHP are no longer passed through I18n
  functions. This was done to simplify the internals of CakePHP and reduce
  overhead. The developer facing messages are rarely, if ever, actually translated -
  so the additional overhead reaps very little benefit.

L10n
====

- :php:class:`Cake\\I18n\\L10n` 's constructor now takes a :php:class:`Cake\\Network\\Request` instance as argument.

Testing
=======

- The ``TestShell`` has been removed. CakePHP, the application skeleton and
  newly baked plugins all use ``phpunit`` to run tests.
- The webrunner (webroot/test.php) has been removed. CLI adoption has greatly
  increased since the initial release of 2.x. Additionaly, CLI runners offer
  superior integration with IDE's and other automated tooling.

  If you find yourself in need of a way to run tests from a browser you should
  checkout `VisualPHPUnit <https://github.com/NSinopoli/VisualPHPUnit>`_. It
  offers many additional features over the old webrunner.
- ``ControllerTestCase`` is deprecated and will be removed for CakePHP 3.0.0.
  You should use the new :ref:`integration-testing` features instead.
- Fixtures should now be referenced using their plural form::

    // Instead of
    $fixtures = ['app.article'];

    // You should use
    $fixtures = ['app.articles'];

Utility
=======

Set Class Removed
-----------------

The Set class has been removed, you should use the Hash class instead now.

Folder & File
-------------

The folder and file classes have been renamed:

- ``Cake\Utility\File`` renamed to :php:class:`Cake\\Filesystem\\File`
- ``Cake\Utility\Folder`` renamed to :php:class:`Cake\\Filesystem\\Folder`

Inflector
---------

- The default value for ``$replacement`` argument of :php:meth:`Cake\\Utility\\Inflector::slug()`
  has been changed from underscore (``_``) to dash (``-``). Using dashes to
  separate words in URLs is the popular choice and also recommended by Google.

- Transliterations for :php:meth:`Cake\\Utility\\Inflector::slug()` have changed.
  If you use custom transliterations you will need to update your code. Instead
  of regular expressions, transliterations use simple string replacement. This
  yielded significant performance improvements::

    // Instead of
    Inflector::rules('transliteration', [
        '/ä|æ/' => 'ae',
        '/å/' => 'aa'
    ]);

    // You should use
    Inflector::rules('transliteration', [
        'ä' => 'ae',
        'æ' => 'ae',
        'å' => 'aa'
    ]);

- Separate set of uninflected and irregular rules for pluralization and
  singularization have been removed. Instead we now have a common list for each.
  When using :php:meth:`Cake\\Utility\\Inflector::rules()` with type 'singular'
  and 'plural' you can no longer use keys like 'uninflected', 'irregular' in
  ``$rules`` argument array.

  You can add / overwrite the list of uninflected and irregular rules using
  :php:meth:`Cake\\Utility\\Inflector::rules()` by using values 'uninflected' and
  'irregular' for ``$type`` argument.

Sanitize
--------

- ``Sanitize`` class has been removed.

Security
--------

- ``Security::cipher()`` has been removed. It is insecure and promoted bad
  cryptographic practices. You should use :php:meth:`Security::encrypt()`
  instead.
- The Configure value ``Security.cipherSeed`` is no longer required. With the
  removal of ``Security::cipher()`` it serves no use.
- Backwards compatibility in :php:meth:`Cake\\Utility\\Security::rijndael()` for values encrypted prior
  to CakePHP 2.3.1 has been removed. You should re-encrypt values using
  ``Security::encrypt()`` and a recent version of CakePHP 2.x before migrating.
- The ability to generate a blowfish hash has been removed. You can no longer use type
  "blowfish" for ``Security::hash()``. One should just use PHP's `password_hash()`
  and `password_verify()` to generate and verify blowfish hashes. The compability
  library `ircmaxell/password-compat <https://packagist.org/packages/ircmaxell/password-compat>`_
  which is installed along with CakePHP provides these functions for PHP < 5.5.
- OpenSSL is now used over mcrypt when encrypting/decrypting data. This change
  provides better performance and future proofs CakePHP against distros dropping
  support for mcrypt.
- ``Security::rijndael()`` is deprecated and only available when using mcrypt.

.. warning::

    Data encrypted with Security::encrypt() in previous versions is not
    compatible with the openssl implementation. You should :ref:`set the
    implementation to mcrypt <force-mcrypt>` when upgrading.

Time
----

- ``CakeTime`` has been renamed to :php:class:`Cake\\I18n\\Time`.
- ``CakeTime::serverOffset()`` has been removed.  It promoted incorrect time math practises.
- ``CakeTime::niceShort()`` has been removed.
- ``CakeTime::convert()`` has been removed.
- ``CakeTime::convertSpecifiers()`` has been removed.
- ``CakeTime::dayAsSql()`` has been removed.
- ``CakeTime::daysAsSql()`` has been removed.
- ``CakeTime::fromString()`` has been removed.
- ``CakeTime::gmt()`` has been removed.
- ``CakeTime::toATOM()`` has been renamed to ``toAtomString``.
- ``CakeTime::toRSS()`` has been renamed to ``toRssString``.
- ``CakeTime::toUnix()`` has been renamed to ``toUnixString``.
- ``CakeTime::wasYesterday()`` has been renamed to ``isYesterday`` to match the rest
  of the method naming.
- ``CakeTime::format()`` Does not use ``sprintf`` format strings anymore, you can use
  ``i18nFormat`` instead.
- :php:meth:`Time::timeAgoInWords()` now requires ``$options`` to be an array.

Time is not a collection of static methods anymore, it extends ``DateTime`` to
inherit all its methods and adds location aware formatting functions with the
help of the ``intl`` extension.

In general, expressions looking like this::

    CakeTime::aMethod($date);

Can be migrated by rewriting it to::

    (new Time($date))->aMethod();

Number
------

The Number library was rewritten to internally use the ``NumberFormatter``
class.

- ``CakeNumber`` has been renamed to :php:class:`Cake\\I18n\\Number`.
- :php:meth:`Number::format()` now requires ``$options`` to be an array.
- :php:meth:`Number::addFormat()` was removed.
- ``Number::fromReadableSize()`` has been moved to :php:meth:`Cake\\Utility\\Text::parseFileSize()`.

Validation
----------

- The range for :php:meth:`Validation::range()` now is inclusive if ``$lower`` and
  ``$upper`` are provided.
- ``Validation::ssn()`` has been removed.

Xml
---

- :php:meth:`Xml::build()` now requires ``$options`` to be an array.
- ``Xml::build()`` no longer accepts a URL. If you need to create an XML
  document from a URL, use :ref:`Http\\Client <http-client-xml-json>`.
