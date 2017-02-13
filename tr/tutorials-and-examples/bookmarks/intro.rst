Yerimi Eğitimi
###################

Bu eğitim size basit bir yerimi uygulaması yapmanızı sağlayacak. 
Başlangıçta, CakePHP 'yi kuracak, veritabanımızı oluşturacak, ve CakePHP 
araçlarını kullanarak uygulamamızı hızlıca yapabileceğiz.

İhtiyacınız olanlar:

#. Bir veritabanı serveri. Bu eğitimde biz MySQL serveri(local) kullanacağız.
   Genel SQL komutlarını veya SQL yapısını bilmeniz gerekiyor. Bundan gerisini
   CakePHP sizin için halledecek. MySQL kullandığımız için PHP eklentilerinden
   ``pdo_mysql`` etkin olduğuna emin olun.
#. Basit PHP bilgisi


Başlamadan önce PHP versiyonunun güncel olduğuna emin olunuz.

.. code-block:: bash

    php -v

En azından PHP |minphpversion| (CLI) veya daha yüksek bir versiyonun yüklü olması gerekmektedir.
Webserver PHP versiyonunun en azından |minphpversion| veya yükseği, ve aynı versiyonda
komut arayüzünün de olması gerekmektedir. Eğer tüm uygulamayı görmek
istiyorsanız `cakephp/bookmarker <https://github.com/cakephp/bookmarker-tutorial>`__.
kontrol edebilirsiniz. Başlayalım !

CakePHP Başlarken
=================

En kolay CakePHP kurulumunu Composer ile yapabilirsiniz. Composer, basit bir
CakePHP kurulumunu terminal veya komut arayüzünden yapılmasına imkan sağlar.
Öncelikle Composer'i indirip kurmanız gerekmektedir. Eğer cURL yüklü ise, bu
yolu da aşşağıda ki yöntem ile çok basit yapabilirsiniz::

    curl -s https://getcomposer.org/installer | php

Veya, ``composer.phar`` 'ı 
`Composer website <https://getcomposer.org/download/>`_. adresinden
indirebilirsiniz.

CakePHP iskeleti basitçe oluşturup kurmak için terminalizine **bookmarker**
komut satırını çalıştırınız::

    php composer.phar create-project --prefer-dist cakephp/app bookmarker

Eğer `Composer Windows Installer <https://getcomposer.org/Composer-Setup.exe>`_
'i indirip kurduysanız, o zaman kurulum klasöründe belirtilen komudu yazarak
devam edebilirsiniz. (Örnek kurulum klasörü C:\\wamp\\www\\dev\\cakephp3)::

    composer self-update && composer create-project --prefer-dist cakephp/app bookmarker

Composer'i kullanmanın avantajı bir takım işlemleri sizin için otomatik yapıyor
olmasıdır. Mesela dosya yetki izinleri ve **config/app.php** dosyasını sizin
için oluşturur.

Başka yöntemlerle de CakePHP yi kurmak mümkündür. Eğer composer kurmak veya
kullanmak istemiyorsanız :doc:`/installation` a göz atabilirsiniz.

Nasıl olursa olsun, CakePHP 'yi kurduktan ve ayarları yaptıktan sonra klasör
yapınız şu şekilde olmalıdır::

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

Şuanda belki CakePHP nin yapısının nasıl işlediğini öğrenmeniz güzel olabilir.
Bunun için :doc:`/intro/cakephp-folder-structure` 'i inceleyebilirsiniz.

Yüklememizi inceleyelim
=======================

Biz basitçe yüklememizin doğrulunu kontrol edebiliriz. Basitçe anasayfaya
girmeyi deneyebilirsiniz. Bunu yapmadan önce, geliştirici serveri çalıştırmanız
gerekmektedir::

    bin/cake server

.. note::

    Windows için, komut ``bin\cake server`` şeklinde olmalı. (Ters slashe dikkat ediniz).

Php nin başlangıç webserver portu 8765 dir. **http://localhost:8765** browser da
çalıştırarak hoşgeldin sayfasını görebilirsiniz.  Veritabanı erişimi hariç bütün
onay kutuları işaretli olmalıdır. Tümü işaretli değilse, php eklentilerini veya
klasör izinlerini kontrol edin.

Veritabanını oluşturalım
========================

Yerimi uygulamamızın veritabanını oluşturalım. Eğer halan bir boş veritabanı
oluşturmadıysanız, bir tane oluşturun. İstediğiniz isimle olabilir örnek
``cake_bookmarks``.  Devamında ki SQL komutunu yürüterek gerekli tabloları
oluşturabilirsiniz::

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

Composite Primary Key kullanılan ``bookmarks_tags`` tablosuna belki dikkat
etmişsinizdir.  CakePHP composite primary keyi neredeyse heryerde destekler. Çok
yönlü uygulama yapımını kolaylaştırır.

Tablo ve sütun isimlerini keyfe bağlı kullanmadık. CakePHP nin :doc:`naming
conventions </intro/conventions>` de anlatıldığı gibi CakePHP yi daha rahat
yapmak için framework'ü yeniden yapılandırmalardan kaçındırdık. Hatta CakePHP
eski veritabanı şablonlarını yerleştirmek için bile yeterince rahat kullanım
sağlar. Fakat düzene bağlı kalmak sizin zamanınızı kurtarır.

Veritabanı Yapılandırması
=========================

Bir sonra ki adım olarak, CakePHP ye veritabanımızın nerede olduğunu ve nasıl
bağlanacağımızı belirtelim.  Bu sizin ilk ve son ihtiyaç duyacağınız
yapılandırmalardan birisi.

Yapılandırma gerçekten çok basit: sadece **config/app.php** de ki
``Datasources.default`` array ini değiştirerek yapılandırmanızı yapabilirsiniz.
Örnek olarak tamamlanmış yapılandırmaya bakabilirsiniz::

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
        // Daha fazlası altta
    ];

Yapılandırmayı yaptıktan ve dosyayı kayıt ettikten sonra, anasayfada ki 'CakePHP
is able to connect to the database' seçeneğinin işaretli olduğunu görmeniz
gerekmektedir. Yani CakePHP veritabanına erişim sağlamıştır diyor.

.. note::

    Bir CakePHP nin varsayılan yapılandırma dosyası 
    **config/app.default.php** adresinde bulunabilir.

İskele Yapımızı Oluşturalım
===========================

Bizim veritabanımız CakePHP nin düzenini kullandığı için, :doc:`bake console
</bake/usage>` yapısını kullanarak hızlıca basit uygulamayı oluşturabiliriz.
Komut satırında şu komutları yürütün::

    // Windows da bin\cake şeklinde yapınız
    bin/cake bake all users
    bin/cake bake all bookmarks
    bin/cake bake all tags

Bu controllerimizi, modelleri, viewları, bunlara uyan test tarafını ve
fikstürleri bizim users, bookmarks, ve tags kaynakları için oluşturur.  Eğer,
serveri durdurduysanız yeniden başlatınız ve **http://localhost:8765/bookmarks**
adresine gidiniz.

Basit fakat fonksiyonel bir uygulama görüyor olmanız gerekmektedir. Birkaç veri
ekledikten sonra veritabanı tablolarını görüyor olmanız gerekmektedir. 

.. note::

    Eğer Sayfa Bulunamadı (404) hatası görüyorsanız, Apache de ki mod_rewrite
    modulünün açık olduğunu kontrol ediniz.

Parola Karıştırma Ekleme (Hashing)
==================================

Kullanıcılarınızı oluşturduktan sonra (**http://localhost:8765/users**
sayfasında ki), siz muhtemelen şifrelerin düz metin olarak saklandığını
görüyorsunuzdur. Bu gözle görünür derecede oldukça güvenlik açısından kötüdür.
Yani bunu düzeltmemiz gerekiyor. 

Aynı zamanda CakePHP deki model yapımız hakkında konuşma zamanımız geldi.
CakePHP de ayrı metotları ayırarak nesne üstünde birleştiriyoruz ve bir neste
içerisinde farklı sınıflar oluyor.  Yöntemleri ``Table`` sınıflarını içeriye
atarak topluyoruz. Bu özellikleri de tek başına ``Entity`` sınıfına aktardık.

Örnek olarak, şifre karıştırma işlemi tamamen başlı başına bir  bireysel
kayıttır, yani entity nesnesin deki işlevi uygulayacağız. Çünkü biz
şifrelerimizi her kayıt olduğu an karıştırmak istiyoruz.  Biz mutator/setter
yöntemini uygulayacağız.Her hangi bir zaman entities deki bir özellik çalıştığı
zaman CakePHP setter metotunu çağıracaktır. Şifrelerimiz için setter'i
ekleyelim.  **src/Model/Entity/User.php** de şunları izleyin::

    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher; //Bu satırı ekleyin
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Code from bake.

        protected function _setPassword($value)
        {
            $hasher = new DefaultPasswordHasher();
            return $hasher->hash($value);
        }
    }

Şimdi daha önceden kayıt ettiğiniz bir kullanıcıyı güncelleyin. Eğer şifreyi
değiştirirseniz, orjinal değerden farklı olarak karıştırılmış şifrenin
kullanıldığını listede veya view sayfasında göreceksiniz.  CakePHP şifre
karıştırma yöntemlerinden `bcrypt
<http://codahale.com/how-to-safely-store-a-password/>`_ ı varsayılan olarak
kullanır.  Siz aynı zamanda sha1 veya md5'i de kullanabilir, zaten var olan bir
veritabanını uyarlayabilirsiniz.

Yerimlerini Özel Taglar ile getirelim
=====================================

Şuanda güçlü şifreleri güvenli olarak koruyoruz. Biz daha enterasan özellikleri
uygulamamızda kurabiliriz.  Yerimlerileri yığınca bir şekilde olduktan sonra,
etiketler ile onları arayabilmek tabiki yardımcı olacaktır.  Şimdi ise bir rota
yöntemini uygulayalım. Controller faliyeti ve arayıcı yöntemi ile etiket
yardımıyla yerimi araması yapalım.

İdeal olarak **http://localhost:8765/bookmarks/tagged/funny/cat/gifs**
adresimize benzeyebilir. Bu bize 'funny, 'cat' veya 'gifs' geçen taglarla tüm
yerimilerini bulmamızı sağlar. Bu işlevi uygulamadan önce yeni bir rota
ekleyelim. Sizin **config/routes.php** niz şu şekilde gözükmeli::

    <?php
    use Cake\Routing\Router;

    Router::defaultRouteClass('Route');
    // Yeni rota tag işlevi için ekliyoruz.
    // Sonda ki `*` işareti CakePHP nin aktarılabilir parametrelerinin
    // olduğunu belirtir.
    Router::scope(
        '/bookmarks',
        ['controller' => 'Bookmarks'],
        function ($routes) {
            $routes->connect('/tagged/*', ['action' => 'tags']);
        }
    );

    Router::scope('/', function ($routes) {
        // Varsayılan olarak home ve /pages/* bağlantı rotası.
        $routes->connect('/', [
            'controller' => 'Pages',
            'action' => 'display', 'home'
        ]);
        $routes->connect('/pages/*', [
            'controller' => 'Pages',
            'action' => 'display'
        ]);

        // Connect the conventions based default routes.
        $routes->fallbacks('InflectedRoute');
    });

Yukarıda ki 'route' tanımlaması **/bookmarks/tagged/** uzantısıyla
``BookmarksController::tags()`` ını bağlar.  Rota tanımlamayla, url görünümünü
izole edebilirsiniz. Eğer biz **http://localhost:8765/bookmarks/tagged**
i ziyaret edersek yardımcı bir hata sayfasını göreceğiz. CakePHP nin controller
fonksiyonunun olmadığını birdiren yardımcı hata sayfası gözükür. Şimdi eksik
olan metodu da sistemimize entegre edelim.
**src/Controller/BookmarksController.php** ye şunları ekleyelim::

    public function tags()
    {
        // 'pass' CakePHP tarafından tüm sorguda ki
        // url yolunu kapsar.
        $tags = $this->request->param('pass');

        // BookmarksTable 'ı kullanarak taglı yerimlerini bulabilirsiniz.
        $bookmarks = $this->Bookmarks->find('tagged', [
            'tags' => $tags
        ]);

        // Değerleri View Şablon İçeriğine aktarır
        $this->set([
            'bookmarks' => $bookmarks,
            'tags' => $tags
        ]);
    }

Sorguda ki diğer değerlere erişebilmek için, :ref:`cake-request` bölümüne bakınız.

Bulucu Metot Oluşturma
--------------------------

CakePHP de Controller Fonksiyonlarını kısa tutmayı sever, uygulamamızın çoğu
mantık işlevlerini modelde tutarız.  Eğer **/bookmarks/tagged** url 'ı ziyaret
ederseniz bu sefer de ``findTagged()`` metodunun daha uygulanmadığı hatasını
görürüsünüz.  Şimdi de bunu uygulayalım. **src/Model/Table/BookmarksTable.php**
de şunları ekleyiniz::

    // $query konusu sorgu oluşturucu örneğidir.
    // $options arrayi controller fonksiyonun da ki find('tagged') ile gönderdiğimiz
    // 'tags' seçeneğini içerir.
    public function findTagged(Query $query, array $options)
    {
        return $this->find()
            ->distinct(['Bookmarks.id'])
            ->matching('Tags', function ($q) use ($options) {
                if (empty($options['tags'])) {
                    return $q->where(['Tags.title IS' => null]);
                }
                return $q->where(['Tags.title IN' => $options['tags']]);
            });
    }

Biz :ref:`özel bulucu metodu <custom-find-methods>` geliştirdik. Bu CakePHP nin
çok güçlü olduğu yönlerinden paketle, yeniden kullan sorgularından dır.  Bulucu
metodu her zaman bir :doc:`/orm/query-builder` nesne ve seçenekli array
parametresi sağlar. Bulucular sorguyu değiştirebilir ve gerekli koşul yada
kriter ekleyebilir.  Bittiği zaman, bulucu metodu değiştirilmiş sorgu nesnesi
döndürmek zorundadır. Bizim bulucumuzda ``distinct()`` ve ``matching()``
metotlarını kullanarak farklı 'matching' tagına sahip yerimilerini bulmamızı
sağlar. ``matching()`` metodu `anonymous function
<http://php.net/manual/en/functions.anonymous.php>`_ 'u kabul ederek onu bir
argument şeklinde sorgu oluşturucu olarak karşılar. Geri Çağırmanın içerisinde
biz sorgu oluşturucuyu koşulları tanımlamak için yani yerimilerini filterlayıp
özel taglara sahip olması için kullanırız.

View'ı Oluşturma
----------------

Şimdi eğer **/bookmarks/tagged** url sayfasını ziyaret ederseniz CakePHP size
bir başka hata sayfası daha gösterecektir.  Burada ise sizin View dosyasının var
olmadığını belirtir. Bir sonra ki adım olarak view dosyasını bizim ``tags()``
fonksiyonu için oluşturalım. **src/Template/Bookmarks/tags.ctp** de şu
içerikleri izleyiniz::

    <h1>
        Bookmarks tagged with
        <?= $this->Text->toList(h($tags)) ?>
    </h1>

    <section>
    <?php foreach ($bookmarks as $bookmark): ?>
        <article>
            <!-- HtmlHelper kullanarak link oluşturun -->
            <h4><?= $this->Html->link($bookmark->title, $bookmark->url) ?></h4>
            <small><?= h($bookmark->url) ?></small>

            <!-- TextHelper kullanarak text'in formatını ayarlayın-->
            <?= $this->Text->autoParagraph(h($bookmark->description)) ?>
        </article>
    <?php endforeach; ?>
    </section>

Yukarıda ki kodda :doc:`/views/helpers/html` kullanıyoruz ve
:doc:`/views/helpers/text` yardımcıyı yönlendirerek çıktı sayfamızı
oluşturuyoruz.  Biz aynı zaman da :php:func:`h` kısayol fonksiyonunu kullanarak
HTML encode çıktısını alıyoruz.Kullanıcı verisin de html injeksiyonlarından
önlemek için her zaman  ``h()`` kullanmayı hatırlayın.

Yeni oluşturduğumuz **tags.ctp** dosyası CakePHP'nin view şablon dosyası
standartlarına bağlıdır.  Bu standartda şablonların düşük karakterli ve alt
tireli controller fonksiyon isimleri yer alır.

Belki bizim view da ki ``$tags`` ve ``$bookmarks`` değişkenleri
kullanabildiğimize dikkat etmişsinizdir. Biz ne zaman ``set()`` metodunu
kontrollerda kullansak, özel değişkenleri view'a aktarmış oluruz. View tüm
aktarılan değişkenlere local değişken gibi erişebilir yapar.

Artık **/bookmarks/tagged/funny** e erişebiliyor olmanız ve tüm 'funny' etiketli
yerimilerini görüyorsunuzdur.

Öyleyse, biz basit yerimileri, etiketleri, kullanıcıları olan bir uygulama
oluşturduk.  Her nasılsa, herkes diğerlerin etiketlerini görebilir. Bir sonra ki
bölümde, biz yetki düzeyini uygulayacağız ve yerimilerinin görünümünü sadece
geçerli kullanıcıya göre kısıtlayacağız.

Şimdi :doc:`/tutorials-and-examples/bookmarks/part-two` ile uygulamanızı
geliştirmeye devam edebilir veya :doc:`dive into the documentation</topics>`
CakePHP nin neler yapabileceğine göz atabilirsiniz.
