Konsol ve Kabuklar
##################

.. php:namespace:: Cake\Console

CakePHP sadece bir web uygulama çatısı değil, aynı zamanda konsol uygulamaları
yaratmanızı sağlayan bir konsol uygulama çatısıdır. Konsol uygulamaları
bakım ve istek cevap döngüsü dışında işleri tamamlamak için gerekli olan
çeşitli arka plan uygulamalarıyla başa çıkarlar. CakePHP konsol uygulamaları,
uygulama sınıflarınızı komut satırı vasıtasıyla tekrar kullanabilmenizi sağlarlar.

CakePHP kutudan birçok konsol uygulaması ile çıkar. Bunlardan bazıları CakePHP'nin
i18n gibi özelliklerini kullanabilmek için, bazıları da işlerinizi hızlandırmakta
kullanılırlar.

CakePHP Konsolu
================

Bu bölüm, CakePHP'yi komut satırından kullanmaya giriş yapmaktadır. Konsol
araçları, cron görevleri, veya web tarayıcı tarafından ulaşılmasına gerek
olmayan işlerde kullanılmak için ideallerdir.

PHP, dosya sistemine ve uygulamasına yumuşak bir arayüz olarak bir komut satırı
istemcisi sunmaktadır. CakePHP konsolu ise kabuk komut dosyaları oluşturmaya
yarayan bir uygulama çatısı sunar. Konsol, bir kabuğu veya görevi yüklemek için
sevk-tarzı kurulum kurulum kullanır ve paramaterlerini getirir.

.. note::

    Konsolu kullanmayı amaçlıyorsanız bir PHP comput satırı (CLI) derlemesi
    sisteminizde mevcut olmalıdır.

Detaylara geçmeden önce, CakePHP konsolunu çalıştırabildiğinizden emin olalım.
Önce bir sistem kabuğu getirmeniz gerekir. Bu bölümdeki örnekler bash üzerinde
gösterilecekler, ancak CakePHP konsolu Windows ile de uyumludur.
Bu örnek, kullanıcının bir bash istemcisinde oturumu olduğunu ve CakePHP
uygulamasının kök dizininde olduğunu varsaymaktadır.

CakePHP uygulamaları bir uygulama için tüm kabuk ve görevleri içeren ``Console``
dizini içerirler. Ayrıca çalıştırılabilir uygulama da mevcuttur::

    $ cd /path/to/app
    $ bin/cake

Konsolu argümanlar olmadan çalıştırmak şu yardım mesajını üretir::

    Welcome to CakePHP v3.0.0 Console
    ---------------------------------------------------------------
    App : App
    Path: /Users/markstory/Sites/cakephp-app/src/
    ---------------------------------------------------------------
    Current Paths:

     -app: src
     -root: /Users/markstory/Sites/cakephp-app
     -core: /Users/markstory/Sites/cakephp-app/vendor/cakephp/cakephp

    Changing Paths:

    Your working path should be the same as your application path. To change your path use the '-app' param.
    Example: -app relative/path/to/myapp or -app /absolute/path/to/myapp

    Available Shells:

    [CORE] bake, i18n, server, test

    [app] behavior_time, console, orm

    To run an app or core command, type cake shell_name [args]
    To run a plugin command, type cake Plugin.shell_name [args]
    To get help on a specific command, type cake shell_name --help

Ekranda görülen ilk bilgi, sistem yollarıyla ilgilidir. Eğer konsolu dosya
siteminin farklı yollarından çağırıyorsanız bu size yardımcı olacaktır.

.. php:class:: Shell

Bir Kabuk Yaratmak
===================

Haydi Konsolda kullanmak için bir kabuk yaratalaım. Bu örnek
için basit bir Merhaba Dünya kabuğu yaratacağız. Uygulamanızın
**src/Shell** dizininde **HelloShell.php** dosyasını yaratın. Şu
kodları dosyanın içine ekleyin::

    namespace App\Shell;

    use Cake\Console\Shell;

    class HelloShell extends Shell
    {
        public function main()
        {
            $this->out('Hello world.');
        }
    }

Kabuk sınıfları için kurallar dosya isminin, sınıf ismiyle ve Kabuk soneki
ile aynı olmasını gerektirirler. Kabuğumuzda ``main()`` metodu oluşturduk.
Bu metod, kabuk ilave metodlar olmadan çağırıldığında çağırılır. Bir kaç
komut daha ekleyeceğiz, ama şimdilik, sadece kabuğumuzu çalıştıralım. Uygulama
dizininizden şu komutları çalıştırın::

    bin/cake hello

Şu çıktıyı görmelisiniz::

    Welcome to CakePHP Console
    ---------------------------------------------------------------
    App : app
    Path: /Users/markstory/Sites/cake_dev/src/
    ---------------------------------------------------------------
    Hello world.

Daha önceden belirtildiği gibi kabuklardaki ``main()`` metodu, kabuğa başka bir komut
veya argüman verilmediğinde çağırılmaktadır. Main metodu çok ilginç olmadığı için
birşeyler yapan başka bir metod daha ekleyelim::

    namespace App\Shell;

    use Cake\Console\Shell;

    class HelloShell extends Shell
    {
        public function main()
        {
            $this->out('Hello world.');
        }

        public function heyThere($name = 'Anonymous')
        {
            $this->out('Hey there ' . $name);
        }
    }

Bu dosyayı kaydettikten sonra şu komutu çalıştırabilmeli ve kendi adınızı
çıktı olarak görebilmelisiniz::

    bin/cake hello hey_there your-name

``_`` karakterleri ile başlamayan tüm public metodlar komut satırından çağırılabilirler.
Gördüğünüz gibi komut satırından çağırılan metodlar, altçizgili kabuk argümanından, doğru
camel-case metod adına dönüşmektedirler.

``heyThere()`` metodumuzda, pozisyona bağlı argümanların metodumuza gönderildiğini
görmekteyiz. Pozisyona bağlı argümanlar, ``args`` özelliğinde de mevcutturlar.

In our ``heyThere()`` method we can see that positional arguments are provided to our
``heyThere()`` function. Positional arguments are also available in the ``args`` property.
Kabuk uygulamalarındaki anahtarlara veya seçeneklere ``$this->params`` ile de ulaşabiliriz,
ancak bu konuya daha sonra değineceğiz.

``main()`` metodunu kullanıdğınızda pozisyona bağlı argümanlara erişmeniz mümkün değildir.
Çünkü, ilk pozisyona bağlı argüman, komut ismi olarak yorumlanmaktadır. Eğer argüman kullanmak
istiyorsanız, ``main`` dışında bir metod ismi kullanmalısınız.

Kabuklarınızda Model Kullanmak
--------------------------------

Kabuk araçlarında sıklıkla uygulamanızın iş mantığına ulaşmaya ihtiyaç duyacaksınız ki;
CakePHP bu işi acayip kolaylaştırıyor. Modelleri denetçilerde ``loadModel()`` metodu ile
yüklediğiniz gibi, kabuklarda da yükleyebilirsiniz. Yüklenmiş modeller, kabuğa iliştirilmiş
özellikler olarak ayarlanırlar::

    namespace App\Shell;

    use Cake\Console\Shell;

    class UserShell extends Shell
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadModel('Users');
        }

        public function show()
        {
            if (empty($this->args[0])) {
                return $this->error('Please enter a username.');
            }
            $user = $this->Users->findByUsername($this->args[0])->first();
            $this->out(print_r($user, true));
        }
    }

Yukarıdaki kabuk, bir kullanıcıyı, kullanıcı adına göre getirecek ve veritabanında
depolanan bilgiyi gösterecektir.

Kabuk Görevleri
================

Tekrar kullanılabilir sınıflarınızı diğer kabuklar arasında paylaşmak ve
kullanmak isteyeceğiniz zamanlar olabilir. Görevler komutları
There will be times when building more advanced console applications, you'll want
to compose functionality into re-usable classes that can be shared across many shells.
Görevler, komutları sınıflara çıkarmanıza yarar. Örneğin, ``bake`` neredeyse tamamen
görevlerden oluşmuştur. ``$tasks`` özelliğini kullanarak bir görev tanımayabilirsiniz::

    class UserShell extends Shell {
        public $tasks = ['Template'];
    }

Standart :term:`eklenti sözdizimi` kullanarak, eklenti görevlerini kullanabilirsiniz.
Görevler, kendi sınıflarının ismini alan **Shell/Task/** dizinlerinde bulunurlar.
Örneğin yeni bir 'FileGenerator' görevi yaratmak isteseydik **src/Shell/Task/FileGeneratorTask.php**
dosyasını yaratmanız gerekecekti.

Her görev bir ``main()`` metoduna sahip olmak zorundadır. ShellDispatcher
görev her çalıştırıldığında bu metodu çağıracaktır. Bir görev sınıfı şu
şekilde görünür::

    namespace App\Shell\Task;

    use Cake\Console\Shell;

    class FileGeneratorTask extends Shell {
        public function main() {

        }
    }

Bir kabuk, kendi görevinin özelliklerine de erişebilir ki, bu da görevleri,
yeniden kullanılabilir işlevleri :doc:`/controllers/components` gibi
kullanabilmemizi sağlar::

    // Found in src/Shell/SeaShell.php
    class SeaShell extends Shell
    {
        // Found in src/Shell/Task/SoundTask.php
        public $tasks = ['Sound'];

        public function main()
        {
            $this->Sound->main();
        }
    }

Görevlere doğrudan komut satırından ulaşabilirsiniz::

    $ cake sea sound

.. note::

    Görevlere doğrudan ulaşabilmek için, görev **kesinlikle**
    kabuk sınıfının $tasks özelliğinde mevcut olmalıdır.

Ayrıca görev ismi, Kabuğun OptionParser'ine de alt komut olarak
eklenmelidir::

	public function getOptionParser() {
		$parser = parent::getOptionParser();
		$parser->addSubcommand('sound', [
			'help' => 'Execute The Sound Task.'
		]);
		return $parser;
	}

Görevleri TaskRegistry İle Anında Yüklemek
------------------------------------------

Görev kayıt nesnesi (TaskRegistry) ile görevleri anında yükleyebilirsiniz. $tasks
özelliğinde bildirilmemiş görevleri şu şekilde yükleyebilirsiniz::

    $project = $this->Tasks->load('Project');

ProjectTask nesnesinden örneği (instance) yükleyecek ve döndürecektir. Eklentilerdeki
görevleri şunu kullanarak yükleyebilirsiniz::

    $progressBar = $this->Tasks->load('ProgressBar.ProgressBar');

.. _invoking-other-shells-from-your-shell:

Kabuğunuzdan Başka Kabukları Çağırmak
======================================

.. php:method:: dispatchShell($args)

Başka bir kabuktan başka bir kabuğu çağırmayı isteyeceğiniz bir çok durum olacaktır.
``Shell::dispatchShell()`` size ``argv`` sunarak, alt kabukta diğer sınıfları çalışma
becerisi sağlar. Argümanları ve seçenekleri, args değişkeni olarak veya metin (string)
olarak sunabilirsiniz::

    // Metin olarak
    $this->dispatchShell('schema create Blog --plugin Blog');

    // Dizi olarak
    $this->dispatchShell('schema', 'create', 'Blog', '--plugin', 'Blog');

Yukarıdaki örnek şema kabuğunu eklenti kabuğunda çağırarak bir eklenti için nasıl
yeni bir şema oluşturabileceğinizi göstermektedir.

Kullanıcı Girdisi Almak
=======================

.. php:method:: in($question, $choices = null, $defaut = null)

Ektileşimli konsol uygulamaları yaparken, kullanıcısan girdi almanız gerekir.
CakePHP bunun için kulay bir yol sunar::

    // Kullanıcıdan isteğe bağlı metin almak
    $color = $this->in('What color do you like?');

    // Kullanıcının bir seçeneği seçmesini istemek
    $selection = $this->in('Red or Green?', ['R', 'G'], 'R');

Seçim doğrulaması harf duyarsızdır.

Dosya Yaratmak
==============

.. php:method:: createFile($path, $contents)

Çoğu kabuk uygulaması, geliştirme ve yükleme (deployment) görevlerini otomatiğe
bağlamaya yerdımcı olur. Dosya yaratma işi de sıkça karşımıza çıkan önemli durumlardan
biridir. CakePHP verilen yolda dosyayı yaratmanın kolay bir yolunu sunar::

    $this->createFile('bower.json', $stuff);

Eğer kabuk etkileşimli ise, bir uyarı üretilecektir ve eğer dosya mevcutsa,
kullanıcıya dosyanın üzerine yazıp yazmamak istediği sorulacaktır. Eğer
kabuğun etkileşim özelliği ``false`` ise, soru sorulmayacak ve dosya doğrudan
üzerine yazılacaktır.

Konsol Çıktısı
==============

.. php:method:out($message, $newlines, $level)
.. php:method:err($message, $newlines)

``Shell`` sınıfı çıktı almak için bir kaç metod sunar::

    // stdout'a yazar
    $this->out('normal message');

    // stderr'e yazar
    $this->err('error message');

    // stderr'e yazar ve işlemi durdurur
    $this->error('Fatal error');

Kabuk ayrıca, çıktıyı temizlemek, boş satırlar üretmek veya noktalı çizgi satırı
çizmek için metodlar içerir::

    // İki yeni satır çıkarır
    $this->out($this->nl(2));

    // Kullanıcının ekranını temizler
    $this->clear();

    // Yatay bir çizgi çizer
    $this->hr();

Son olarak ``_io->overwrite()`` ekrandaki metin satırını güncelleyebilirsiniz::

    $this->out('Counting down');
    $this->out('10', 0);
    for ($i = 9; $i > 0; $i--) {
        sleep(1);
        $this->_io->overwrite($i, 0, 2);
    }

Eğer bir metin çıktısı yapıldıysa, üzerine yazılamayacağını hatırlamak
önemlidir.

.. _shell-output-level:

Konsol Çıktı Seviyeleri
-----------------------

Kabuklar sıklıkla farklı önem seviyelerine ihtiyaç duyarlar. Kabuklar cron
işleri olarak çağırıldıklarında çoğu çıktı gereksizdir. Ve kabuğun her
söylediği şeyle ilgilenmiyor olduğunuz durumlar olacaktır. Çıktıları uygun
olarak işaretlemek için, çıktı seviyelerini kullanabilirsiniz. Kabuğu kullanan
kişi, çıktının detay seviyesini belirterek, kabuğun üreteceği çıktıları
sınırlandırabilir. :php:meth:`Cake\\Console\\Shell::out()` varsayılan
olarak 3 çıktı türünü desteklemektedir.

* QUIET - Sadece kesinlikle önemli olan bilgi sessiz çıktı için işaretlenmelidir.
* NORMAL - Varsayılan seviye, normal kullanım.
* VERBOSE - Günlük kullanım için fazla gürültülü, ancak hata ayıklama işleri için
  faydalı olan mesajları işaretler

Çıktıyı şu şekilde işaretleyebilirsiniz::

    // Her seviyede görünecektir.
    $this->out('Quiet message', 1, Shell::QUIET);
    $this->quiet('Quiet message');

    // Sessiz çıktı seçildiğinde görünmeyecektir.
    $this->out('normal message', 1, Shell::NORMAL);
    $this->out('loud message', 1, Shell::VERBOSE);
    $this->verbose('Verbose output');

    // Sadece gürültülü (verbose) çıktı seçildiğinde görünecektir.
    $this->out('extra message', 1, Shell::VERBOSE);
    $this->verbose('Verbose output');

Kabukların çıktı seviyelerini ``--quiet`` ve ``--verbose`` seçeneklerini kullanarak
kontrol edebilirsiniz. Bu seçenekler varsayılan olarak eklenmişlerdir ve CakePHP kabuklarınız
içinde çıktıyı uyumlu olarak kontrol etmenizi sağlarlar.

Çıktıyı Şekillendirmek
-----------------------

Çıktıyı şekillendirme işi, - aynen HTML gibi - çıktılarda etiketler kullanılarak
yapılır. ConsoleOutput bu etiketleri doğru ansi kodu sıralaması ile değiştirecek,
ya da ansi kodlarını desteklemeyen bir konsoldaysanız, kaldıracaktır. Birkaç gömülü
şekil vardır ve daha fazlasını da yaratabilirsiniz. Gömülü olanlar şunlardır

* ``error`` Hata mesajları. Kırmızı renki alt çizgili metin.
* ``warning`` Uyarı mesajları. Sarı renkli metin.
* ``info`` Bilgi mesajları. Camgöbeği renkli metin.
* ``comment`` İlave metin. Mavi renkli medit.
* ``question`` Kabuk tarafından otomatik olarak eklenen soru metni.

Ek şekillednirmeleri ``$this->stdout->styles()`` kullanarak yaratabilirsiniz. Yeni bir
çıktı şekli yaratmak için::

    $this->_io->styles('flashy', ['text' => 'magenta', 'blink' => true]);

Bu kabuk çıktılarınızda ``<flashy>`` etiketi kullanmanıza izin verecektir ve eğer ansi
renkleri etkinleştirildiyse, bu kod yanıp sönen aflatun renkli metin olarak gösterilecektir
``$this->out('<flashy>Whoooa</flashy> Something went wrong');``. Şekillendirmeleri
belirlerken ``text`` ve ``background`` özellikleri için şu renkleri kullanabilirsiniz:

* black (siyah)
* red (kırmızı)
* green (yeşil)
* yellow (sarı)
* blue (mavi)
* magenta (eflatun)
* cyan (camgöbeği)
* white (beyaz)

Ayrıca şu seçenekleri de etkinleştirip kullanabilirsiniz.

* bold (kalın)
* underline (altçizgi)
* blink (yanıp sönen)
* reverse (ters)

Bir şekillendirme eklendiğine, tüm ConsoleOutput örneklerinden erişilir olur,
bu sayede stdout ve stderr nesnelerinde yeniden tanımlanmaları gerekmez.

Renklendirmeyi Kapatmak
------------------------

Renklendirmeler çok güzel olsalar da, renklendirmeyi kapatmak veya hep açık tutmak
isteyeceğiniz zamanlar olabilir::

    $this->_io->outputAs(ConsoleOutput::RAW);

Üstteki kod, çıktı nesnesini, ham çıktı moduna sokacaktır. Ham çıktı modunda
hiç şekillendirme yapılmaz. Kullanabileceğiniz üç mod mevucttur.

* ``ConsoleOutput::RAW`` - Ham çıktı, stil veya biçimlendirme yok.
  Bu yöntem, eğer XML çıktısı alıyorsanız, hata ayıklama işlemi yapıyorsanız
  ya da stil çalışmıyorsa tercih edilmelidir.
* ``ConsoleOutput::PLAIN`` - Güz metin çıktısı, bilinen biçimlendirme etiketleri
  silinecektir.
* ``ConsoleOutput::COLOR`` - Renk kaçış kodları ile çıktı

Varsayılan olarak Unix sistemleri ConsoleOutput nesnelerini renkli olarak çıkarırlar.
Windows sitemlerde ise, düz metin çıktısı, ``ANSICON`` çevre değişkeni tanımlanmadıysa
varsayılan durumdadır.

Kanca metodları
================

.. php:method:: initialize()

    Kabuğu başlatır, alt sınıflar için yapıcı metod olarak çalışır ve
    kabuk çalıştırılmadan önceki görevlerin yürütülmesini yapılandırır.

.. php:method:: startup()

    Kabuğu başlatır ve hoşgeldiniz mesajını görüntüler. Komut veya ana yürütmeden
    önce kontrolü ve yapılandırmayı sağlar.

    Sadece hoşgeldiniz bilgisini ya da ön komut akışını değiştirmek istiyorsanız
    bu metodu aşırı yükleyiniz.

Seçenekleri Yapılandırmak ve Yardım Üretmek
===========================================

.. php:class:: ConsoleOptionParser

``ConsoleOptionParser`` bir komut satırı seçeneği sağlar ve argüman ayrıştırıcıdır.

OptionParser, sizin aynı anda iki hedefi gerçekleştirmenize olanak sağlar. İllin
komutunuzdaki seçenekleri ve agümanları tanımlamanıza izin verir. Bu basit girdi
doğrulamasını ve metod argümanlarını ayırmanızı sağlar. İkincisi, iyi biçimlendirilmiş
bir doküman sunmanıza olanak verir.

CakePHP'deki konsol çerçevesi, kabuğun yapılandırma ayrıştırıcısını,
``$this->getOptionParser()`` çağırarak elde eder. Bu metodu aşırı yüklemek,
OptionPArseri, beklenen kabuk girdisine göre yapılandırmanızı sağlar.
Ayrıca altkomutlar ve görevler için farklı yapılandırmalar kullanabilmek için
alkomut yapılandırması ayrıştırıcıları da yanımlayabilirsiniz.
ConsoleOptionParser akıcı bir arayüz sağlar ve kolayca birden fazla
yapılandırma/argüman ayarlamanızı sağlayan metodları içerir::

    public function getOptionParser() {
        $parser = parent::getOptionParser();
        // Configure parser
        return $parser;
    }

Akıcı Arayüz ile Bir Seçenek Ayrıştırıcıyı Yapılandırmak
--------------------------------------------------------

Tüm seçenek ayrıştırıcı metodları zincirli olabilir (art arda gelebilir),
bu sizin, tek bir dizi metod çağrısı haline tüm seçenek yapılandırıcısını
tanımlanamanıza olanak sağlar::

    public function getOptionParser()
    {
        $parser = parent::getOptionParser();
        $parser->addArgument('type', [
            'help' => 'Either a full path or type of class.'
        ])->addArgument('className', [
            'help' => 'A CakePHP core class name (e.g: Component, HtmlHelper).'
        ])->addOption('method', [
            'short' => 'm',
            'help' => __('The specific method you want help on.')
        ])->description(__('Lookup doc block comments for classes in CakePHP.'));
        return $parser;
    }

Zincirlemede izin verilen metodlar şunlardır:

- description()
- epilog()
- command()
- addArgument()
- addArguments()
- addOption()
- addOptions()
- addSubcommand()
- addSubcommands()

.. php:method:: description($text = null)

Seçenek ayrıştırıcısının açıklamasını gösterir ya da ayarlar. Açıklama
aşağıdaki argüman ve seçenek bilgisini gösterir. Bir metin veya dizi
göndererek, açıklamayı değiştirebilirsiniz. Argümanlarla çağırmak
hali hazırdaki değeri döndürecektir::

    // Set multiple lines at once
    $parser->description(['line one', 'line two']);

    // Read the current value
    $parser->description();

.. php:method:: epilog($text = null)

Seçenek ayrıştırıcısının sonuç bölümünü döndürür. Sonuç bölümü
argüman ya da seçenek bilgisinden sonra gösterilir. Bir metin veya dizi
göndererek, sonuç bölümünü değiştirebilirsiniz. Argümanlarla çağırmak
hali hazırdaki değeri döndürecektir::

    // Set multiple lines at once
    $parser->epilog(['line one', 'line two']);

    // Read the current value
    $parser->epilog();

Argümanları Eklemek
--------------------

.. php:method:: addArgument($name, $params = [])

Konuma bağlı argümanlar, komut satırı araçları tarafından
sıklıkla kullanılırlar ve ``ConsoleOptionParser`` konuma bağlı
argümanları tanımlamanızı ve gerekli kılmanızı sağlar.
``$parser->addArgument();`` ile bir seferde bir defa, ya da
``$parser->addArguments();`` ile bir seferde birden fazla argüman
ekleyebilirsiniz::

    $parser->addArgument('model', ['help' => 'The model to bake']);

Argüman yaratırken şu seçenekleri de kullanabilirsiniz:

* ``help`` Argüman için gösterilecek yardım metni
* ``required`` Bu parametre gerekli ise.
* ``index`` Argüman için dizin, eğer tanımsız ise, argüman, diğer argümanların
  sonuna konacaktır. Eğer aynı dizini birden fazla tanımlarsanız, ilkinin üzerine
  yazılacaktır.
* ``choices`` Bu argüman için geçerli seçenekler dizisi. Boş bırakılmışsa, bütün
  değerler geçerlidir. parse() geçersiz bir değerle karşılaşırsa bir istisna (Exception)
  fırlatılacaktır.

Gerekli olarak işaretlenmiş argümanlar, ihmal edilirlerse, bir istisna (Exception)
fırlatacaklardır. Sonuç olarak bunu kabuğunuzda işemek zorunda değilsiniz.

.. php:method:: addArguments(array $args)

Birden fazla argümanı içeren bir diziye sahipseniz, birden fazla argümanı
tek seferde eklemek için ``$parser->addArguments()`` kullanabilirsiniz. ::

    $parser->addArguments([
        'node' => ['help' => 'The node to create', 'required' => true],
        'parent' => ['help' => 'The parent node', 'required' => true]
    ]);

ConsoleOptionParser'daki tüm yapıcı sınıflar gibi addArguments, akıcı
bir metod zincirinin bir parçası olarak kullanılabilir.

Argümanları Doğrulamak
----------------------

When creating positional arguments, you can use the ``required`` flag, to
indicate that an argument must be present when a shell is called.
Additionally you can use ``choices`` to force an argument to
be from a list of valid choices::

    $parser->addArgument('type', [
        'help' => 'The type of node to interact with.',
        'required' => true,
        'choices' => ['aro', 'aco']
    ]);

Bu örnek, girdi üzerinde doğrulaması bulunan gerekli bir argüman
oluşturacaktır. Argüman yoksa veya hatalı bir değere sahipse,
bir istisna fırlatılacak ve kabuk duracaktır.

Seçenekleri Eklemek
-------------------

.. php:method:: addOption($name, $options = [])

Seçenekler veya bayraklar da sıklıkla komut satırı araçlarında
kullanılırlar. ``ConsoleOptionParser`` uzun veya kısa takma adlar
kullanan ayarlar oluşturmayı, varsayılanlar ve boole anahtarları
sunarak, sağlar. Seçenkler ``$parser->addOption()`` veya
``$parser->addOptions()`` kullanılarak yaratılabilirler. ::

    $parser->addOption('connection', [
        'short' => 'c',
        'help' => 'connection',
        'default' => 'default',
    ]);

Buradaki örnek, kabuğu çağırdığınızda ``cake myshell --connection=other``,
``cake myshell --connection other``, veya ``cake myshell -c other`` kullanmanızı
sağlamaktadır. Boole anahtarları da oluşturabilirsiniz. Bu anahtartlar, değerleri
tüketmezler ve varlıkları ayrıştırılan parametrede etkinleştirilmelerini sağlar. ::

    $parser->addOption('no-commit', ['boolean' => true]);

Bu seçenek ile, bir kabuğu ``cake myshell --no-commit something`` şeklinde
çağırdığınıza, no-commit parametresi ``true`` değerini alacak ve 'something'
konumsal argüman olarak değerlendirilecektir. Hazır olan ``--help``, ``--verbose``,
ve ``--quiet`` seçenekleri bu özelliği kullanırlar.

Seçenekleri yaratırken, seçenek davranışını belirlemek için şu seçenekleri
kullanabilirsiniz:

* ``short`` - Bu seçenek için tek harf alternatifi. Boş bırakılabilir veya none.
* ``help`` - Bu seçenek için yardım metni. Seçenk için yardım metni yaratılırken kullanılır.
* ``default`` - Bu seçenek için varsayılan değer. Tanımlanmadıysa, varsayılan değer ``true`` olacaktır.
* ``boolean`` - Bu seçenek, değer kullanmaz, sadece bir boole anahtarıdır.
  Varsayılan olarak ``false``.
* ``choices`` - Bu seçenek için geçerli bir seçimler dizisi. Eğer boş bırakıldıysa,
  tüm değerler geçerlidir. Eğer parse() geçersiz bir değerler karşılaşırse bir istisna
  fırlatılacaktır.

.. php:method:: addOptions(array $options)

Birden fazla seçenek içeren bir diziye sahipseniz, birden fazla seçeneği tek
seferde eklemek için ``$parser->addOptions()`` kullanabilirsiniz. ::

    $parser->addOptions([
        'node' => ['short' => 'n', 'help' => 'The node to create'],
        'parent' => ['short' => 'p', 'help' => 'The parent node']
    ]);

ConsoleOptionParser'deki tüm diğer yapıcı metodlarla birlikte, addOrtions akıcı
metod zincirinin bir parçası olarak kullanılabilir.

Seçenekleri Doğrulamak
----------------------

Seçenekler, konumsal argümanlar gibi, seçimler kümesiyle birlikte sunulabilirler.
Bir seçenek, seçimleri tanımladıys, o seçenek için, geçerli olan tek seçimler
bunlardır. Tüm diğer değerler bir ``InvalidArgumentException`` istisnası
fırlatacaklardır::

    $parser->addOption('accept', [
        'help' => 'What version to accept.',
        'choices' => ['working', 'theirs', 'mine']
    ]);

Boole Seçenekler Eklemek
------------------------

Bazı bayrak seçenekleri tanımlamak istediğinizde boole kullanabilirsiniz.
Varsayılana sahip olan seçenekler gibi, boole seçenekleri, her zaman
kendilerini ayrıştırılan parametreler içinde tanımlarlar. Eğer bir bayrak
mevcutsa değeri ``true``, eğer bayrak yoksa değeri ``false`` olur::

    $parser->addOption('verbose', [
        'help' => 'Enable verbose output.',
        'boolean' => true
    ]);

Bir sonraki seçenek, ``$this->params['verbose']`` içinde her zaman mevcut
olacaktır. Bu size boole bayrakları için ``empty()`` ve ``isset()`` kontrollerini
ihmal edebilme olanağı verir::

    if ($this->params['verbose']) {
        // Do something.
    }

Boole seçenekleri her zaman ``true`` veya ``false`` olacakları için, ek
kontrol metodlarını ihmal etmeniz mümkündür.

Altkomutları Eklemek
---------------------

.. php:method:: addSubcommand($name, $options = [])

Konsol uygulamaları genellikle altkomutlardan oluşurlar ve bu altkomutlar
özel seçenek ayrıştıma ve kendi yardım metodlarını ihtiyaç duyabilirler.
Bunun için en mükemmel örnek ``bake`` dir. Bake, kendine ait yardım ve
seçenekleri içeren görevlerden oluşur. ``ConsoleOptionParser`` size
alkomutlarını tanımlama ve komuta özel seçenek ayrıştırıcıları sunmanız
olanağını sağlar. Bu sayede kabuk görevler için komutların nasıl
ayrıştırılacağını bilecektir::

    $parser->addSubcommand('model', [
        'help' => 'Bake a model',
        'parser' => $this->Model->getOptionParser()
    ]);

Üstteki örnek, bir kabuk görevi için, nasıl yardım ve özelleştirilmiş
seçenek ayrıştırıcısı sunacağınızı göstermektedir. Görevin ``getOptionParser()``
metodunu çağırarak, seçenek ayrıştırıcısı üretimini iki kere çalıştırmamış ve
birşeyleri karıştırmaktan endişe duymamış oluyoruz. Altkomutları
bu şekilde eklemenin iki avantajı mevcuttur. İlk olarak, oluşturulan
yardım içerisinde kabuğunuzun altkomutlarını kolayca dokümante etmesini
sağlar. Aynı zamanda, altkomut yardımına kolay erişim sağlar. Şu komut ile
``cake myshell --help`` altkomutların listesini görebilir, ``cake myshell model --help``
çalıştırarak da, yardımı veya sadece model görevi görüntüleyebilirsiniz.

.. note::

    Bir kez Kabuk altkomutları tanımladığında, tüm altkomutlar açıkça
    tanımlanmalıdırlar.

Bir altkomutu tanımlarken şu seçenekleri kullanabilirsiniz:

* ``help`` - Alt Komut için yardım metni.
* ``parser`` - Alt Komut için ConsoleOptionParser. Bu size
  metoda özel seçenek ayrıştırıcıları yaratma olanağı verir. Yardım üretildiğinde
  eğer bir ayrıştırıcı mevcutsa, kullanılacaktır. Aynı zamanda ayrıştırıcıyı
  :php:meth:`Cake\\Console\\ConsoleOptionParser::buildFromArray()` ile uyumlu
  bir dizi olarak da sunabilirsiniz.

Altkomut eklemek, akıcı metod zincirinin bir parçası olarak yapılabilir.

Bir Diziden ConsoleOptionParser Oluşturmak
--------------------------------------------

.. php:method:: buildFromArray($spec)

Daha önceden belirtildiği üzere, alkomut seçenek ayrıştırıcısı yaratırken,
ayrıştırıcı tanımlamasını, o metod için bir dizi olarak tanımlayabilirsiniz.
Bu altkomut ayrıştırıcılarının yapılmasını, herşeyi bir dizi içine atmak kadar
kolaylaştırır::

    $parser->addSubcommand('check', [
        'help' => __('Check the permissions between an ACO and ARO.'),
        'parser' => [
            'description' => [
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ],
            'arguments' => [
                'aro' => ['help' => __('ARO to check.'), 'required' => true],
                'aco' => ['help' => __('ACO to check.'), 'required' => true],
                'action' => ['help' => __('Action to check')]
            ]
        ]
    ]);

Ayrıştırıcı tanımlaması içerisinde, ``arguments``, ``options``,
``description`` ve ``epilog`` için anahtarlar tanımlayabilirsiniz. Dizi
stili bir kurucu içinde ``subcommands`` (altkomutlar) tanımlayamazsınız.
Argümanlar ve seçenekler için değerler, :php:func:`Cake\\Console\\ConsoleOptionParser::addArguments()`
ve :php:func:`Cake\\Console\\ConsoleOptionParser::addOptions()` metodlarının
kullandıkları formata uygun olmalıdırlar. Ayrıca bir seçenek ayrıştırıcısı
yaratmak için buildFromArray metodunu tek başına da kullanabilirsiniz::

    public function getOptionParser()
    {
        return ConsoleOptionParser::buildFromArray([
            'description' => [
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ],
            'arguments' => [
                'aro' => ['help' => __('ARO to check.'), 'required' => true],
                'aco' => ['help' => __('ACO to check.'), 'required' => true],
                'action' => ['help' => __('Action to check')]
            ]
        ]);
    }

ConsoleOptionParsers (KonsolSeçenekAyrıştırıcıları) Birleştirmek
-----------------------------------------------------------------

.. php:method:: merge($spec)

Bir grup metodunu oluştururken, birden fazla ayrıştırıcıları bir arada kullanmak
isteyebilirsiniz::

    $parser->merge($anotherParser);

Çalışma için argümanların sırasının her ayrıştırıcı için aynı olduğunu ve seçeneklerin
uyumlu olması gerektiğini not ediniz. Bu yüzden farklı şeyler için anahtarlar kullanmayınız.

Kabuklardan Yardım Almak
------------------------

ConsoleOptionParser eklenmesiyle, kabuklardan yardım almak tutarlı ve muntazam bir
şekilde yapılmaktadır. ``--help`` veya -``h`` seçeneğini kullanarak, herhangi bir
çekirdek veya ConsoleOptionParser uygulayan herhangi bir kabuktaki
yardımı görüntüleyebilirsiniz::

    cake bake --help
    cake bake -h

İkisi de bake için yardımı üretecektir. Eğer kabuk altkomutları destekliyorsa
benzer bir şekilde yardımı görüntüleyebilirsiniz::

    cake bake model --help
    cake bake model -h

Bu bake işleminin model görevine özel yardımı size gösterecektir.

XML Olarak Yardım Almak
-----------------------

CakePHP kabuklarıyla etkileşimli olması gereken otomatik araçlar yaparken,
yardımın makinenin ayrıştıabileceği bir biçimde olması faydalı olacaktır.
ConsoleOptionParser bir ek argümanın tanımlanmasıyla yardımı xml olarak
sunabilir::

    cake bake --help xml
    cake bake -h xml

Üstteki örnek seçilen kabuk için yardım, seçenekler, argümanlar ve altkomutlar
içeren XML belgesini döndürecektir. Örnek bir XML belgesi şu sekilde görünür:

.. code-block:: xml

    <?xml version="1.0"?>
    <shell>
        <command>bake fixture</command>
        <description>Generate fixtures for use with the test suite. You can use
            `bake fixture all` to bake all fixtures.</description>
        <epilog>
            Omitting all arguments and options will enter into an interactive
            mode.
        </epilog>
        <subcommands/>
        <options>
            <option name="--help" short="-h" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--verbose" short="-v" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--quiet" short="-q" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--count" short="-n" boolean="">
                <default>10</default>
                <choices/>
            </option>
            <option name="--connection" short="-c" boolean="">
                <default>default</default>
                <choices/>
            </option>
            <option name="--plugin" short="-p" boolean="">
                <default/>
                <choices/>
            </option>
            <option name="--records" short="-r" boolean="1">
                <default/>
                <choices/>
            </option>
        </options>
        <arguments>
            <argument name="name" help="Name of the fixture to bake.
                Can use Plugin.name to bake plugin fixtures." required="">
                <choices/>
            </argument>
        </arguments>
    </shell>

Kabuklarda Yönlendirme / CLI (KSA)
==================================

Komut Satırı Arayüzünde (KSA/CLI), özellikle kabuk ve görevlerinizde ``env('HTTP_HOST')`` ve
diğer web tarayıcı bağımlı çevre değişkenleri tanımlı değillerdir.

Eğer rapor üretiyorsanız veya varsayılan ana sunucu ``http://localhost/`` içeren ``Router::url()``
metodlarını kullanan raporlar ve epostalar gönderiyorsanız, hatalı URL'lerle karşılaşabilirsiniz.
Bu durumda, alanı (domain'i) el lie belirtmelisiniz.
Örnek olarak bunu bootstrap veya config dosyalarından ``App.fullBaseUrl`` Yapılandırma (Configure) değerlerini
kullanarak yapabilirsiniz.

Eposta göndermek için Email sınıfını maili göndermek istediğiniz ana makine ile getirmelisiniz::

    use Cake\Mailer\Email;

    $email = new Email();
    $email->domain('www.example.org');

Üretilen mesaj ID'lerinin doğrulanmış ve epostaların alanlarına uyduğu farzedilmektedir.

Diğer Konular
=============

.. toctree::
    :maxdepth: 1

    console-and-shells/helpers
    console-and-shells/repl
    console-and-shells/cron-jobs
    console-and-shells/i18n-shell
    console-and-shells/completion-shell
    console-and-shells/plugin-shell
    console-and-shells/routes-shell
    console-and-shells/upgrade-shell
    console-and-shells/server-shell
    console-and-shells/cache

.. meta::
    :title lang=tr: Konsol ve Kabuklar
    :keywords lang=tr: kabuk betikleri,sistem kabuğu,uygulama sınıfları,arka plan görevleri,komut satırı,cron işi,istek yanıtı,sistem yolu,acl,yeni projeler,kabuklar,özellikler,parametreler,i18n,cakephp,dizin,bakım,i̇deal,uygulamalar,mvc
