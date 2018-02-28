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
==========================

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
==========================

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
===========

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

- Ang Bake ay hindi na parte ng core na pinagmulan at napalitan na ng 
  `CakePHP Bake Plugin <https://github.com/cakephp/bake>`_
- Ang Bake na mga template ay inilipat sa ilalim ng **src/Template/Bake**.
- Ngayon ang palaugnayan ng Bake na mga template ay gumagamit ng erb-style na mga tag
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
* Ngayon ang mga log engine ay nagsagawa ng lazy na pag-load sa unang pagsulat sa mga log.
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
  
Mga Sesyon
==========

Ang sesyon na class ay hindi na static, sa halip ang sesyon ay maaaring i-access
gamit ang kahilingan na object. Tingnan ang :doc:`/development/sessions` na
dokumentasyon para sa paggamit ng sesyon na object.

* Ang :php:class:`Cake\\Network\\Session` at may kaugnayang sesyon na mga class
  ay nailipat sa ilalim ng ``Cake\Network`` na namespace.
* Ang ``SessionHandlerInterface`` ay itinanggal sa pabor ng isang ibinigay ng
  PHP mismo.
* Ang katangian na ``Session::$requestCountdown`` ay itinanggal.
* Ang sesyong checkAgent na tampok ay itinanggal. Ito ay nagsanhi ng ilang mga
  bug kapag nag-frame ang chrome, at hindi sangkot ang flash player.
* Ang kombensyonal na pangalan ng table ng sessions database ay ``sessions`` na
  ngayon sa halip na ``cake_sessions``.
* Ang sesyon na cookie timeout ay awtomatikong naa-update na kasunod ng timeout
  ng sesyon na datos.
* Ang landas para sa sesyon na cookie ngayon ay nagde-default ng base na landas
  ng app sa halip na "/". Ang isang bagong kumpigurasyon na variable na
  ``Session.cookiePath`` ay nadagdag upang i-customize ang landas ng cookie.
* Isang bagong kaginhawaang paraan na :php:meth:`Cake\\Network\\Session::consume()`
  ang naidagdag upang payagan ang pagbasa at pagbura ng sesyon na datos sa
  isang solong hakbang.
* Ang default na halaga ng argumentong ``$renew`` ng 
  :php:meth:`Cake\\Network\\Session::clear() ay nabago mula sa ``true`` at
  naging ``false``.

Network\\Http
=============

* Ang ``HttpSocket`` ngayon ay :php:class:`Cake\\Network\\Http\\Client` na.
* Ang Http\Client ay muling naisulat mula sa panimula paitaas. Ito ay mayroong
  isang mas simple/mas madaling magamit na API, suporta para sa bagong
  pagpapatunay na mga sistema katulad ng OAuth, at file na mga upload.
  Ito ay gumagamit ng stream na mga API ng PHP kaya walang kinakailangan para
  sa cURL. Tingnan ang :doc:`/core-libraries/httpclient` na dokumentasyon para
  sa higit pang impormasyon.

Network\\Email
==============

* Ang :php:meth:`Cake\\Network\\Email\\Email::config()` ngayon ay ginagamit
  upang tukuyin ang kumpigurasyon na mga profile. Pinapalitan nito ang 
  ``EmailConfig`` na mga class sa nakaraang mga bersyon.
* Ang :php:meth:`Cake\\Network\\Email\\Email::profile()` ay pinapalitan ang
  ``config()`` bilang paraan upang mabago ang bawat instansiya na kumpigurasyon
  na mga opsyon.
* Ang :php:meth:`Cake\\Network\\Email\\Email::drop()` ay naidagdag upang payagan
  ang pagtanggal ng email na kumpigurasyon.
* Ang :php:meth:`Cake\\Network\\Email\\Email::configTransport()` ay naidagdag upang
  payagan ang pagpakahulugan ng transport na mga kumpigurasyon. Ang pagbabagong
  ito ay nagtatanggal ng transport na mga opsyon mula sa paghahatid na mga profile
  at nagpapahintulot sa iyo na gamitin muli ang mga transport sa kabuuan ng email
  na mga profile.
* Ang :php:meth:`Cake\\Network\\Email\\Email::dropTransport()` ay naidagdag upang
  payagan ang pagtanggal ng transport na kumpigurasyon.

Controller
==========

Controller
----------

- Ang ``$helpers``, ``$components`` na mga katangian ay na-merge na ngayon
  kasama ang **lahat** ng magulang na mga class hindi lang ang ``AppController``
  at ang plugin na AppController. Ang mga katangian din ay magkaibang na-merge.
  Sa halip na lahat ng mga setting sa lahat ng mga class ang sama-samang i-merge, 
  ang kumpigurasyon na natukoy sa anak na class ay magagamit. Ito ay 
  nangangahulugan na kung mayroon kang ilang kumpigurasyon na tinukoy sa isang
  subclass, ang kumpigurasyon lamang sa subclass ang magagamit.
- Ang ``Controller::httpCodes()`` ay tinanggal, sa halip ay gamitin ang
  :php:meth:`Cake\\Network\\Response::httpCodes()`.
- Ang ``Controller::disableCache()`` ay tinanggal, sa halip ay gamitin ang
  :php:meth:`Cake\\Network\\Response::disableCache()`.
- Ang ``Controller::flash()`` ay tinanggal. Ang paraang ito ay bihira lamang
  ginamit sa tunay na mga aplikasyon at walang nang layunin na pinagsisilbihan.
- Ang ``Controller::validate()`` at ``Controller::validationErrors()`` ay
  tinanggal. Sila ay mga tirang mga paraan mula sa 1.x na kapanahunan kung saan
  ang mga alalahanin ng mga modelo + mga controller ay malayong mas magkaakibat.
- Ang ``Controller::loadModel()`` ngayon ay naglo-load ng table na mga object.
- Ang ``Controller::$scaffold`` na katangian ay tinanggal. Ang dynamic scaffolding
  ay tinanggal mula sa core ng CakePHP. Isang pinaunlad na scaffolding na plugin,
  na nakapangalang CRUD, ay maaaring matagpuan dito:
  https://github.com/FriendsOfCake/crud
- Ang ``Controller::$ext`` na katangian ay tinanggal. Ngayon kailangan mong palawigin
  at i-override ang ``View::$_ext`` na katangian kung gusto mong gumamit ng isang 
  hindi default na view file na ekstensyon.
- Ang ``Controller::$methods`` na katangian ay tinanggal. Dapat mo na ngayong
  gamitin ang ``Controller::isAction()`` upang matukoy kung ang pangalan ng 
  paraan ay isang aksyon o hindi. Ang pagbabagong ito ay ginawa upang payagan
  ang mas madaling pag-customize ng kung ano at kung ano ang hindi ang binibilang
  bilang isang aksyon.
- Ang ``Controller::$Components`` na katangian ay tinanggal at pinalitan ng 
  ``_components``. Kung kailangan mong mag-load ng mga komponent sa runtime dapat
  kang gumamit ng ``$this->loadComponent()`` sa iyong controller.
- Ang lagda ng :php:meth:`Cake\\Controller\\Controller::redirect()` ay binago
  sa ``Controller::redirect(string|array $url, int $status = null)``. Ang 
  pangatlong argumento na ``$exit`` ay tinanggal. Ang paraan ay hindi na nagpapadala
  ng tugon at labasan na iskrip, sa halip ito ay nagsasauli ng isang ``Response``
  na instansiya na may nakatakdang angkop na mga header.
- Ang ``base``, ``webroot``, ``here``, ``data``,  ``action``, at ``params``
  na madyik mga katangian ay tinanggal. Sa halip ay dapat mong i-access ang lahat 
  ng mga katangiang ito sa ``$this->request``.
- Ang naka-prefix sa underscore na controller na mga paraan katulad ng ``_someMethod()``
  ay hindi na tinatrato bilang pribadong mga paraan. Sa halip ay gumamit ng angkop na 
  kakayahang makita na mga keyword. Ang publikong mga paraan lamang ang maaaring
  gamitin bilang controller na mga aksyon.

Tinanggal ang Scaffold
----------------------

Ang dynamic scaffolding sa CakePHP ay tinanggal mula sa core ng CakePHP. Ito 
ay madalang lamang gamitin, at hindi kailanman nilayon para gamitin sa produksyon.
Isang pinaunlad na scaffolding plugin, na nakapangalang CRUD, ay maaaring matagpuan
dito:
https://github.com/FriendsOfCake/crud

Pinalitan ang ComponentCollection
---------------------------------

Ang class na ito ay napalitan ang pangalan ng
:php:class:`Cake\\Controller\\ComponentRegistry`.
Tingnan ang seksyon sa :doc:`/core-libraries/registry-objects` para sa higit
pang impormasyon sa mga tampok na ibinigay ng bagong class. Maaari mong
gamitin ang ``cake upgrade rename_collections`` upang tumulong sa 
pag-upgrade ng iyong code.

Komponent
---------

* Ang ``_Collection`` na katangian ngayon ay ``_registry`` na. Ito ngayon ay
  naglalaman na ng isang instansya ng :php:class:`Cake\\Controller\\ComponentRegistry`
* Ang lahat ng mga komponent ay dapat na ngayong gumamit ng ``config()``
  na paraan upang kumuha/magtakda ng kumpigurasyon.
* Ang default na kumpigurasyon para sa mga komponent ay dapat matukoy sa
  ``$_defaultConfig`` na katangian. Ang katangiang ito ay awtomatikong nami-merge
  sa anumang kumpigurasyon na binigay sa constructor.
* Ang kumpigurasyon na mga opsyon ay hindi na nakatakda bilang publikong mga 
  katangian.
* Ang ``Component::initialize()`` na paraan ay hindi na isang tagapakinig ng kaganapan.
  Sa halip, ito ay isang post-constructor na hook katulad ng ``Table::initialize()``
  at ``Controller::initialize()``. Ang bagong ``Component::beforeFilter()`` na
  paraan ay nakatali sa parehong kaganapan na ``Component::initialize()`` noon.
  Ang panimulang paraan ay dapat magkaroon ng sumusunod na lagda ``initialize(array
  $config)``.

Controller\\Mga Komponent
=========================

CookieComponent
---------------

- Gumagamit ng :php:meth:`Cake\\Network\\Request::cookie()` upang makabasa ng
  cookie na datos, pinapadali nito ang pagsusubok, at pinapahintulutan para sa
  ControllerTestCase upang magtakda ng mga cookie.
- Ang mga cookie na naka-encrypt sa nakaraang mga bersyon ng CakePHP na gumagamit ng 
  ``cipher()`` na paraan ay hindi na mababasa ngayon dahil ang ``Security::cipher()``
  ay tinanggal. Kailangan mong mag-encrypt muli ng mga cookie gamit ang ``rijndael()``
  o ``aes()`` na paraan bago mag-upgrade.
- Ang ``CookieComponent::type()`` ay tinanggal at pinalitan ng kumpigurasyon na datos
  na naa-access gamit ang ``config()``.
- Ang ``write()`` ay hindi na kumukuha ng ``encryption`` o ``expires`` na mga parameter.
  Ang dalawang ito ay pinamamahalaan na ngayon gamit ang config na datos. Tingnan
  ang :doc:`/controllers/components/cookie` para sa higit pang impormasyon.
- Ang landas para sa mga cookie ngayon ay nagde-default sa base na landas ng app
  sa halip na "/".

AuthComponent
-------------

- Ang ``Default`` ngayon ay ang default na password hasher na ginagamit ng pagpapatunay
  na mga class. Ito ay eksklusibong gumagamit ng bcrypt hashing na algoritmo. Kung 
  gusto mong magpatuloy sa paggamit ng SHA1 hashing na ginamit sa 2.x gamitin ang 
  ``'passwordHasher' => 'Weak'`` sa iyong authenticator na kumpigurasyon.
- Isang bagong ``FallbackPasswordHasher`` ang dinagdag upang tulungan ang mga gumagamit
  na maglipat ng lumang mga password mula sa isang algoritmo patungo sa iba pa. Suriin
  ang dokumentasyon ng AuthComponent para sa karagdagang impormasyon.
- Ang ``BlowfishAuthenticate`` na class ay tinanggal. Gumamit lamang ng ``FormAuthenticate``
- Ang ``BlowfishPasswordHasher`` na class ay tinanggal. Sa halip ay gumamit ng
  ``DefaultPasswordHasher``.
- Ang ``loggedIn()`` na paraan ay tinanggal. Sa halip ay gumamit ng ``user()``.
- Ang kumpigurasyon na mga opsyon ay hindi na nakatakda bilang publikong mga katangian.
- Ang mga paraan na ``allow()`` at ``deny()`` ay hindi na tumatanggap ng "var args".
  Ang lahat ng kinakailangan na mga pangalan ng paraan na ipapasa bilang unang argumento,
  alinman bilang string o array ng mga string.
- Ang paraan na ``login()`` ay tinanggal at sa halip ay pinalitan ng ``setUser()``.
  Upang mag-login ng isang gumagamit kailangan mo ngayong tumawag ng ``identify()``
  na nagsasauli ng info ng gumagamit sa matagumpay na pagkakakilanlan at pagkatapos
  ay gumamit ng ``setUser()`` upang i-save ang info sa sesyon para mapanatili
  sa kabuuan ng mga kahilingan.
  
  - Ang ``BaseAuthenticate::_password()`` ay tinanggal. Sa halip ay gumamit ng isang
  ``PasswordHasher`` na class.
- Ang ``BaseAuthenticate::logout()`` ay tinanggal.
- Ang ``AuthComponent`` ngayon ay nagti-trigger ng dalawang mga pangyayari
  ang ``Auth.afterIdentify`` at ang ``Auth.logout`` pagkatapos natukoy ang
  isang gumagamit at bago nag-log out ang isang gumagamit ayon sa pagkakabanggit.
  Maaari kang magtakda ng callback na mga function para sa mga kaganapang
  ito sa pamamagitan ng pagsasauli ng isang pagmapa na array mula sa 
  ``implementedEvents()`` na paraan ng iyong authenticate na class.

Ang may kaugnayan sa ACL na mga class ay nilipat sa isang hiwalay na plugin. Ang mga password hasher,
Authentication at Authorization na mga provider ay nilipat sa ``\Cake\Auth`` na namespace.
Kailangan mo ring ilipat ang iyong mga provider at mga hasher sa ``App\Auth`` na namespace.

RequestHandlerComponent
-----------------------

- Ang sumusunod na mga paraan ay tinanggal mula sa RequestHandler na komponent::
  ``isAjax()``, ``isFlash()``, ``isSSL()``, ``isPut()``, ``isPost()``, ``isGet()``, ``isDelete()``.
  Sa halip ay gamitin ang :php:meth:`Cake\\Network\\Request::is()` na paraan na may nauugnay na argumento.
- Ang ``RequestHandler::setContent()`` ay tinanggal, sa halip ay gamitin ang :php:meth:`Cake\\Network\\Response::type()`.
- Ang ``RequestHandler::getReferer()`` ay tinanggal, sa halip ay gamitin ang :php:meth:`Cake\\Network\\Request::referer()`.
- Ang ``RequestHandler::getClientIP()`` ay tinanggal, sa halip ay gamitin ang :php:meth:`Cake\\Network\\Request::clientIp()`.
- Ang ``RequestHandler::getAjaxVersion()`` ay tinanggal.
- Ang ``RequestHandler::mapType()`` ay tinanggal, sa halip ay gamitin ang :php:meth:`Cake\\Network\\Response::mapType()`.
- Ang kumpigurasyon na mga opsyon ay hindi na nakatakda bilang publikong mga katangian.

SecurityComponent
-----------------

- Ang sumusunod na mga paraan at ang kanilang nauugnay na mga katangian ay tinanggal mula sa Security na komponent:
  ``requirePost()``, ``requireGet()``, ``requirePut()``, ``requireDelete()``.
  Sa halip ay gamitin ang :php:meth:`Cake\\Network\\Request::allowMethod()`.
- Ang ``SecurityComponent::$disabledFields()`` ay tinanggal, gamitin ang
  ``SecurityComponent::$unlockedFields()``.
- Ang may kaugnayan sa CSRF na mga tampok sa SecurityComponent ay kinuha at inilipat
  sa isang hiwalay na CsrfComponent. Ito ay nagpapahintulot sa iyo na gumamit ng
  CSRF na proteksyon nang hindi ginagamit ang form tampering na pag-iiwas.
- Ang kumpigurasyon na mga opsyon ay hindi na nakatakda bilang publikong mga katangian.
- Ang mga paraan na ``requireAuth()`` at ``requireSecure()`` ay hindi na tumatanggap ng
  "var args". Ang lahat ng pangalan ng paraan ay kailangang ipasa bilang unang argumento,
  alinman bilang string o array ng mga string.

SessionComponent
----------------

- Ang ``SessionComponent::setFlash()`` ay hindi na magagamit. Sa halip dapat mong gamitin ang
  :doc:`/controllers/components/flash`

Error
-----

Ang pasadyang mga ExceptionRenderer ngayon ay inaasahan na alinman ay magsauli ng 
isang :php:class:`Cake\\Network\\Response` na object o string kapag may mga error sa pag-render.
Ito ay nangangahulugan na anumang mga paraan na nag-aasikaso ng tiyak na mga eksepsyon ay 
dapat magsauli ng tugon o string na halaga.

Model
=====

Ang Model layer sa 2.x ay pangkalahatang isinulat muli at pinalitan. Dapat mong 
suriin ang :doc:`/appendices/orm-migration` para sa impormasyon kung paano gamitin
ang bagong ORM.

- Ang ``Model`` na class ay tinanggal.
- Ang ``BehaviorCollection`` na class ay tinanggal.
- Ang ``DboSource`` na class ay tinanggal.
- Ang ``Datasource`` na class ay tinanggal.
- Ang iba't ibang datasource na mga class ay tinanggal.

ConnectionManager
-----------------

- Ang ConnectionManager ay inilipat sa ``Cake\Datasource`` na namespace.
- Ang ConnectionManager ay mayroong sumusunod na mga paraan na tinanggal:

  - ``sourceList``
  - ``getSourceName``
  - ``loadDataSource``
  - ``enumConnectionObjects``

- Ang :php:meth:`~Cake\\Database\\ConnectionManager::config()` ay naidagdag at 
  ngayon ang natatanging paraan upang mag-configure ng mga koneksyon.
- Ang :php:meth:`~Cake\\Database\\ConnectionManager::get()` ay naidagdag. Pinapalitan
  nito ang ``getDataSource()``.
- Ang :php:meth:`~Cake\\Database\\ConnectionManager::configured()` ay naidagdag. Ito
  at ang ``config()`` ay pinapalitan ang ``sourceList()`` at ``enumConnectionObjects()``
  sa isang mas standard at naaalinsunod na API.
- Ang ``ConnectionManager::create()`` ay tinanggal.
  Ito ay maaaring palitan ng ``config($name, $config)`` at ``get($name)``.

Mga Pag-uugali
--------------
- Ang naka-prefix ng underscore na pag-uugali na mga paraan katulad ng ``_someMethod()``
  ay hindi na tinatrato bilang pribadong mga paraan. Sa halip ay gumamit ng nararapat na 
  kakayahang makita na mga keyword.

TreeBehavior
------------

Ang TreeBehavior ay kumpletong isinulat muli upang magamit ang bagong ORM. Kahit na
ito ay gumagana na kapareho sa 2.x, ilang kaunting mga paraan ay napalitan ng pangalan
o natanggal:

- Ang ``TreeBehavior::children()`` ngayon ay isang pasadyang tagahanap ``find('children')``.
- Ang ``TreeBehavior::generateTreeList()`` ngayon ay isang pasadyang tagahanap ``find('treeList')``.
- Ang ``TreeBehavior::getParentNode()`` ay natanggal.
- Ang ``TreeBehavior::getPath()`` ngayon ay isang pasadyang tagahanap ``find('path')``.
- Ang ``TreeBehavior::reorder()`` ay natangggal.
- Ang ``TreeBehavior::verify()`` ay natanggal.

TestSuite
=========

TestCase
--------

- Ang ``_normalizePath()`` ay naidagdag upang payagan ang mga pagsubok sa paghahambing ng landas
  upang mapatakbo sa kabuuang lahat ng operasyon na mga sistema tungkol sa kanilang DS na mga 
  setting (``\`` sa Windows kontra sa ``/`` ng UNIX, halimbawa).

Ang sumusunod na assertion na mga paraan ay tinanggal dahil sila ay matagal nang hindi ginagamit
at napalitan ang kanilang bagong PHPUnit na katapat:

- Ang ``assertEqual()`` sa pabor ng ``assertEquals()``
- Ang ``assertNotEqual()`` sa pabor ng ``assertNotEquals()``
- Ang ``assertIdentical()`` sa pabor ng ``assertSame()``
- Ang ``assertNotIdentical()`` sa pabor ng ``assertNotSame()``
- Ang ``assertPattern()`` sa pabor ng ``assertRegExp()``
- Ang ``assertNoPattern()`` sa pabor ng ``assertNotRegExp()``
- Ang ``assertReference()`` sa pabor ng ``assertSame()``
- Ang ``assertIsA()`` sa pabor ng ``assertInstanceOf()``

Tandaan na ang ilang mga paraan ay nagpalit ng pagkakaayos ng kanilang argumento, e.g.
``assertEqual($is, $expected)`` ay dapat na ngayong maging ``assertEquals($expected, $is)``.

Ang sumusunod na assertion na mga paraan ay hindi na ginagamit at matatanggal sa hinaharap:

- Ang ``assertWithinMargin()`` sa pabor ng ``assertWithinRange()``
- Ang ``assertTags()`` sa pabor ng ``assertHtml()``

Parehong mga pagpapalit ng paraan din ay nagpalit ng pagkakaayos ng argumento para sa 
isang naaalinsunod na assert method na API gamit ang ``$expected`` bilang unang argumento.

Ang sumusunod na assertion na mga paraan ay naidagdag:

- Ang ``assertNotWithinRange()`` bilang katapat ng ``assertWithinRange()``

View
====

Ngayon Ang Mga Tema ay Batayan na mga Plugin
--------------------------------------------

Ang pagkakaroon ng mga tema at mga plugin bilang mga paraan sa paglikha ng 
modyular na aplikasyon na mga komponent ay napatunayang limitado, at nakakalito.
Sa CakePHP 3.0, ang mga tema ay hindi na naninirahan **sa loob** ng aplikasyon.
Sa halip sila ay standalone na mga plugin. Nilulutas nito ang ilang mga problema
gamit ang mga tema:

- Maaari kang hindi maglagay ng mga tema *sa* mga plugin.
- Ang mga tema ay hindi makapagbigay ng mga katulong, o pasadyang view na mga class.

Ang parehong mga isyu na ito ay nalutas sa pamamagitan ng pagpapalit ng mga tema
ng mga plugin.

Tingnan ang mga Folder na Napalitan ang Pangalan
------------------------------------------------

Ngayon ang mga folder na naglalaman ng view na mga file ay pupunta sa ilalim ng 
**src/Template** sa halip ng **src/View**.
Ito ay nagawa upang mahiwalay ang view na mga file mula sa mga file na naglalaman ng
php na mga class (eg. Helpers, View na mga class).

Ang sumusunod na View na mga folder ay napalitan ang pangalan upang maiwasan ang mga
banggaan sa pagpapangalan ng mga pangalan ng controller:

- ``Layouts`` ngayon ay ``Layout``
- ``Elements`` ngayon ay ``Element``
- ``Errors`` ngayon ay ``Error``
- ``Emails`` ngayon ay ``Email`` (pareho rin para sa ``Email`` inside ``Layout``)

Ang HelperCollection ay Napalitan
---------------------------------

Ang class na ito ay napalitan ang pangalan ng :php:class:`Cake\\View\\HelperRegistry`.
Tingnan ang seksyon sa :doc:`/core-libraries/registry-objects` para sa karagdagang
impormasyon sa mga tampok na ibinigay ng bagong class. Maaari mong gamitin ang 
``cake upgrade rename_collections`` upang tumulong sa pag-upgrade ng iyong code.

View na Class
-------------

- Ang ``plugin`` na key ay tinanggal mula sa ``$options`` na argumento ng 
  :php:meth:`Cake\\View\\View::element()`. Sa halip ay tukuyin ang pangalan ng elemento bilang 
  ``SomePlugin.element_name``.
- Ang ``View::getVar()`` ay tinanggal, sa halip ay gamitin ang :php:meth:`Cake\\View\\View::get()`.
- Ang ``View::$ext`` ay tinanggal at sa halip ay isang protektadong katangian
  na ``View::$_ext`` ang dinagdag.
- Ang ``View::addScript()`` ay tinanggal. Sa halip ay gumamit ng :ref:`view-blocks`.
- Ang ``base``, ``webroot``, ``here``, ``data``,  ``action``, at ``params``
  na madyik na mga katangian ay natanggal. Sa halip ay dapat mong i-access lahat 
  ang mga katangiang ito sa ``$this->request``.
- Ang ``View::start()`` ay hindi na dumurugtong sa isang umiiral na bloke. Sa halip ito
  ay io-overwrite ang bloke na nilalaman kapag natawag ang katapusan. Kung kailangan mong
  pagsamahin ang bloke na mga nilalaman dapat mong kunin ang bloke na nilalaman kapag
  ang pagtawag ay nagsimula sa pangalawang pagkakataon, o gamitin ang capturing mode ng 
  ``append()``.
- Ang ``View::prepend()`` ay hindi na isang capturing mode.
- Ang ``View::startIfEmpty()`` ay tinanggal. Ngayon na ang start() ay palaging 
  nag-o-overwrite ng startIfEmpty ay wala nang pinasisilbihang layunin.
- Ang ``View::$Helpers`` na katangian ay tinanggal at pinalitan gamit ang 
  ``_helpers``. Kung kailangan mong mag-load ng mga katulong sa runtime dapat mong
  gamitin ang ``$this->addHelper()`` sa iyong view na mga file.
- Ang ``View`` ngayon ay magtataas ng ``Cake\View\Exception\MissingTemplateException``
  kapag ang mga template ay nawawala sa halip ng ``MissingViewException``.

ViewBlock
---------

- Ang ``ViewBlock::append()`` ay tinanggal, sa halip ay gamitin ang :php:meth:`Cake\\View\ViewBlock::concat()`.
  Gayunpaman, ang ``View::append()`` ay umiiral pa rin.

JsonView
--------

- Bilang default ang JSON na datos ay magkakaroon ng HTML na mga entity na naka-encode ngayon.
  Pinipigilan nito ang posibleng XSS na mga isyu kapag ang JSON view na nilalaman ay naka-embed
  sa HTML na mga file.
- Ang :php:class:`Cake\\View\\JsonView` ngayon ay sumusuporta sa ``_jsonOptions`` view na variable.
  Pinapayagan ka nitong mag-configure ng bit-mask na mga opsyon na ginagamit kapag bumubuo ng JSON.

XmlView
-------

- Ang :php:class:`Cake\\View\\XmlView` ngayon ay sumusuporta ng ``_xmlOptions`` view na variable.
  Pinapayagan ka nitong mag-configure ng mga opsyon na ginagamit kapag bumubuo ng XML.

View\\Helper
============

- Ang ``$settings`` na katangian ay tinatawag na ngayong ``$_config`` at dapat ma-access
  sa pamamagitan ng ``config()`` na paraan.
- Ang kumpigurasyon na mga opsyon ay hindi na nakatakda bilang publikong mga katangian.
- Ang ``Helper::clean()`` ay tinanggal. Ito ay hindi kailanmang sapat na matatag
  upang buong mapigilan ang XSS. Sa halip ay dapat kang lumabas sa nilalaman
  gamit ang :php:func:`h` o gumamit ng isang dedikadong library katulad ng htmlPurifier.
- Ang ``Helper::output()`` ay natanggal. Ang paraang ito ay
  hindi na magagamit sa 2.x.
- Ang mga paraang ``Helper::webroot()``, ``Helper::url()``, ``Helper::assetUrl()``,
  ``Helper::assetTimestamp()`` ay inilipat sa bagong :php:class:`Cake\\View\\Helper\\UrlHelper`
  na helper. Ang ``Helper::url()`` ay magagamit na ngayon bilang
  :php:meth:`Cake\\View\\Helper\\UrlHelper::build()`.
- Ang madyik na mga accessor sa mga hindi na ginagamit na mga katangian ay tinanggal.
  Ang sumusunod na mga katangian ay nangangailangan na ngayong i-access mula
  sa kahilingan na object:

  - base
  - here
  - webroot
  - data
  - action
  - params

Helper
------

Ang helper ay mayroong sumusunod na mga paraan na tinanggal:

* ``Helper::setEntity()``
* ``Helper::entity()``
* ``Helper::model()``
* ``Helper::field()``
* ``Helper::value()``
* ``Helper::_name()``
* ``Helper::_initInputField()``
* ``Helper::_selectedArray()``

Ang mga paraang ito ay parteng ginamit lamang ng FormHelper, at parte ng paulit-ulit
na patlang na mga tampok na napatunayang nakapag-aalingan sa paglipas ng panahon.
Ang FormHelper ay hindi na umaasa sa mga paraang ito at ang pagkakumplikado na 
binigay nila ay hindi na kinakailangan.

Ang sumusunod na mga paraan ay tinanggal:

* ``Helper::_parseAttributes()``
* ``Helper::_formatAttribute()``

Ang mga paraang ito ay maaari na ngayong matagpuan sa ``StringTemplate`` na class
na kadalasang ginagamit ng mga helper. Tingnan ang ``StringTemplateTrait`` para sa
isang madaling paraan upang pagsamahin ang mga string template sa iyong sariling
mga helper.

FormHelper
----------

Ang FormHelper ay pangkalahatang isinulat muli para sa 3.0. Ito ay nagtatampok ng
ilang malalaking mga pagbabago:

* Ang FormHelper ay gumagana sa bagong ORM. Ngunit mayroong isang napapalawak na 
  sistema para sa pagsasama ng ibang mga ORM o mga datasource.
* Ang FormHelper na mga tampok ay isang napapalawak na widget system na nagpapahintulot
  sa iyo na lumikha ng bagong pasadyang input na mga widget at dagdagan ang
  mga built-in.
* Ang string na mga template ay ang pundasyon ng helper. Sa halip na kasamang 
  manipulahin ang mga array kahit saan, kadalasan sa mga HTML FormHelper na mga
  binuo ay maaaring i-customize sa isang sentral na lugar gamit ang mga
  template set.

At saka sa mas malaking mga pagbabagong ito, ilang mas maliit na nakakasirang mga
pagbabago ang nagawa rin. Ang mga pagbabagong ito ay dapat tumulong sa pag-streamline
sa mga binuo ng HTML FormHelper at magbawas ng mga problema na nakasalubong sa 
mga tao sa nakaraan:

- Ang ``data[`` na prefix ay natanggal mula sa lahat ng nabuong mga input.
  Ang prefix ay wala nang tunay na layunin na pinagsisilbihan.
- Ang iba't ibang standalone na input na mga paraan katulad ng ``text()``, ``select()``
  at iba pa ay hindi na bumubuo ng id na mga katangian.
- Ang ``inputDefaults`` na opsyon ay tinanggal mula sa ``create()``.
- Ang mga opsyon na ``default`` at ``onsubmit`` ng ``create()`` ay tinanggal.
  Sa halip ang isa ay dapat gumamit ng JavaScript event binding o itakda ang lahat
  na kinakailangan na js code para sa ``onsubmit``.
- Ang ``end()`` ay hindi na maaaring gumawa ng mga pindutan. Dapat kang gumawa ng 
  mga pindutan gamit ang ``button()`` o ``submit()``.
- Ang ``FormHelper::tagIsInvalid()`` ay tinanggal. Sa halip ay gumamit ng
  ``isFieldError()``.
- Ang ``FormHelper::inputDefaults()`` ay tinanggal. Maaari kang gumamit ng 
  ``templates()`` upang tumukoy/magdagdag ng mga template na ginagamit ng FormHelper.
- Ang ``wrap`` at ``class`` na mga opsyon ay tinanggal mula sa ``error()``
  na paraan.
- Ang ``showParents`` na opsyon ay tinanggal mula sa select().
- Ang ``div``, ``before``, ``after``, ``between`` at ``errorMessage`` na mga opsyon
  ay tinanggal mula sa ``input()``. Maaari kang gumamit ng mga template upang mag-update
  ng wrapping na HTML. Ang ``templates`` na opsyon ay nagpapahintulot sa iyo na
  i-override ang na-load na mga template para sa isang input.
- Ang ``separator``, ``between``, at ``legend`` na mga opsyon na tinanggal mula 
  sa ``radio()``. Maaari kang gumamit ng mga template upang baguhin ang wrapping na
  HTML ngayon.
- Ang ``format24Hours`` na parameter ay tinanggal mula sa ``hour()``.
  Ito ay napalitan ng ``format`` na opsyon.
- Ang ``minYear``, at ``maxYear`` na mga parameter ay natanggal mula sa ``year()``.
  Parehong ang mga parameter na ito ay maaari na ngayong ibigay bilang mga opsyon.
- Ang ``dateFormat`` at ``timeFormat`` na mga parameter ay tinanggal mula sa 
  ``datetime()``. Maaari mong gamitin ang template upang tukuyin ang pagkakaayos ng
  mga input kung paano ipapakita ang mga ito.
- Ang ``submit()`` dati ay may ``div``, ``before`` at ``after`` na mga opsyon na
  natanggal. Maaari mong i-customize ang ``submitContainer`` na template upang
  baguhin ang nilalamang ito.
- Ang ``inputs()`` na paraan ay hindi na tumatanggap ng ``legend`` at ``fieldset``
  sa ``$fields`` na parameter, dapat mong gamitin ang ``$options`` na parameter.
  Ito ngayon ay nangangailangan na rin ng ``$fields`` na parameter upang maging
  isang array. Ang ``$blacklist`` na parameter ay tinanggal, ang functionality ay
  napalitan sa pamamagitan ng pagtukoy ng ``'field' => false`` sa ``$fields``
  na parameter.
- Ang ``inline`` na parameter ay tinanggal mula sa postLink() na paraan.
  Sa halip ay dapat mong gamitin ang ``block``. Ang pagtatakda ng ``block => true``
  ay magtutulad sa nakaraang pagkilos.
- Ang ``timeFormat`` na parameter para sa ``hour()``, ``time()`` at ``dateTime()``
  ngayon ay nagde-default sa 24, sumusunod sa ISO 8601.
- Ang ``$confirmMessage`` na argumento ng :php:meth:`Cake\\View\\Helper\\FormHelper::postLink()`
  ay tinanggal. Dapat ka na ngayong gumamit ng key na ``confirm`` sa ``$options``
  upang tumukoy ng mensahe.
- Ang checkbox at radio input na mga uri ay nare-render na ngayon *sa loob* ng
  label na mga elemento bilang default. Tinutulungan nitong pataasin ang 
  pagkakangkop sa popular na CSS na mga library katulad ng 
  `Bootstrap <http://getbootstrap.com/>`_ at
  `Foundation <http://foundation.zurb.com/>`_.
- Ang mga templates tag ngayon ay naka-camelBack. Ang nauuna sa 3.0 na mga tag na
  ``formstart``, ``formend``, ``hiddenblock`` at ``inputsubmit`` ay
  ``formStart``, ``formEnd``, ``hiddenBlock`` at ``inputSubmit`` na ngayon.
  Siguraduhing baguhin mo ang mga iyon kung sila ay naka-customize sa iyong app.

Inirerekomenda na suriin mo ang :doc:`/views/helpers/form`
na dokumentasyon para sa karagdagang mga detalye sa kung paano gamitin
ang FormHelper sa 3.0.

HtmlHelper
----------

- Ang ``HtmlHelper::useTag()`` ay tinanggal, sa halip ay gamitin ang ``tag()``.
- Ang ``HtmlHelper::loadConfig()`` ay tinanggal. Ang pag-customize ng mga tag ay
  maaari na ngayong gawin gamit ang ``templates()`` o ang ``templates`` na setting.
- Ang pangalawang parameter na ``$options`` para sa ``HtmlHelper::css()`` ay palagi
  na ngayong nangangailangan ng isang array batay sa nadokumento.
- Ang unang parameter na ``$data`` para sa ``HtmlHelper::style()`` ay palagi na ngayong
  nangangailangan ng isang array batay sa nadokumento.
- Ang ``inline`` na parameter ay tinanggal mula sa meta(), css(), script(), scriptBlock()
  na mga paraan. Sa halip ay dapat mong gamitin ang ``block``. Ang pagtatakda ng 
  ``block => true`` ay magtutulad sa nakaraang pagkilos.
- Ang ``HtmlHelper::meta()`` ngayon ay nangangailangan ng ``$type`` na maging isang string.
  Ang karagdagang mga opsyon ay maaaring mas higit pang maipasa bilang ``$options``.
- Ang ``HtmlHelper::nestedList()`` ngayon ay nangangailangan ng ``$options`` na maging isang array.
  Ang pang-apat na argumento para sa tag na uri ay tinanggal at isinama sa ``$options`` na array.
- Ang ``$confirmMessage`` na argumento ng :php:meth:`Cake\\View\\Helper\\HtmlHelper::link()`
  ay tinanggal. Dapat mo na ngayong gamitin ang key na ``confirm`` sa ``$options`` upang
  matukoy ang mensahe.

PaginatorHelper
---------------

- Ang ``link()`` ay tinanggal. Ito ay hindi na panloob na ginagamit ng helper.
  Ito ay may mababang paggamit sa user land code, at hindi na kasya sa mga 
  layunin ng helper.
- Ang ``next()`` ay wala nang 'class', o 'tag' na mga opsyon. Wala na itong naka-disable
  na mga argumento. Sa halip ay ginamit ang mga template.
- Ang ``prev()`` ay wala nang 'class', o 'tag' na mga opsyon. Wala na itong naka-disable
  na mga argumento. Sa halip ay ginamit ang mga template.
- Ang ``first()`` ay wala nang 'after', 'ellipsis', 'separator', 'class', o 'tag' na mga opsyon.
- Ang ``last()`` ay wala nang 'after', 'ellipsis', 'separator', 'class', o 'tag' na mga opsyon.
- Ang ``numbers()`` ay wala nang 'separator', 'tag', 'currentTag', 'currentClass',
  'class', 'tag', 'ellipsis' na mga opsyon. Ang mga opsyon na ito ay pinadali na ngayon gamit 
  ang mga template. Ito rin ay nangangailangan ng ``$options`` na parameter na maging 
  isang array na ngayon.
- Ang ``%page%`` na estilo na mga placeholder ay tinanggal mula sa 
  :php:meth:`Cake\\View\\Helper\\PaginatorHelper::counter()`.
  Sa halip ay gamitin ang ``{{page}}`` na estilo na mga placeholder.
- Ang ``url()`` ay napalitan ang pangaln sa ``generateUrl()`` upang maiwasan ang banggaan sa deklarasyon ng paraan
  gamit ang ``Helper::url()``.

Bilang default ang lahat ng mga link at hindi aktibong mga teksto ay nakabalot sa ``<li>`` na
nga elemento. Tinutulungan nitong gawing mas madali ang pagsulat ng CSS, at papabutihin ang
pagkakatugma sa popular na mga balangkas ng CSS.

Sa halip ng iba't ibang mga opsyon sa bawat paraan, dapat mong gamitin ang mga template
na tampok. Tingnan ang :ref:`paginator-templates` dokumentasyon para sa impormasyon
kung paano gamitin ang mga template.

TimeHelper
----------

- Ang ``TimeHelper::__set()``, ``TimeHelper::__get()``, at  ``TimeHelper::__isset()`` ay
  tinanggal. Ito ay ang madyik na mga paraan para sa hindi na nagagamit na mga katangian.
- Ang ``TimeHelper::serverOffset()`` ay tinanggal. Ito ay nagtataguyod ng hindi wastong
  time match na mga gawi.
- Ang ``TimeHelper::niceShort()`` ay tinanggal.

NumberHelper
------------

- Ang :php:meth:`NumberHelper::format()` ay nangangailangan na ngayon ng ``$options``
  na maging isang array.

SessionHelper
-------------

- Ang ``SessionHelper`` ay hindi na nagagamit. Maaari mong direktang gamitin ang 
  ``$this->request->session()``, at sa halip ang functionality ng flash na mensahe ay nailipat sa 
  :doc:`/views/helpers/flash`
  
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
