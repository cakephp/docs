Tipik Bir CakePHP İsteği
#########################

CakePHP'nin temellerini tamamladığımıza göre, temel bir isteği
tamamlamak için nesnelerin birlikte nasıl çalıştıklarına bir 
göz atalım. Orjinal istek örneğimize devam edersek, arkadaşımız 
Kamil'in CakePHP uygulamasının açılış sayfasındaki "Haydi Özel Bir 
Kek Satın Al" bağlantısına tıkladığını düşünelim.

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: Tipik bir CakePHP isteğini gösteren akış diyagramı

   Tipik bir CakePHP isteğini gösteren akış diyagramı

Figure: 2. Tipik CakePHP isteği

Siyah = gerekli eleman, Gri = isteğe bağlı eleman, Mavi = callback


#. Kamil http://www.example.com/cakes/buy linkini tıklar ve tarayıcısı
   web sunucusuna bir istekte bulunur.
#. Yönlendirici iş mantığını etkileyecek olan denetçi, aksiyon ve diğer
   paramtereleri elde etmek için URL'yi ayrıştırır.
#. İsteğin URL'si denetçi aksiyonuna eşleştirilir. (Denetçi sınıfı içinde
   özel bir metod) Bu durumda CakesController denetçisi içinde buy yani
   "satın al" metodudur. Herhangi bir denetçi aksiyon mantığı çalıştırılmadan 
   önce denetçinin beforeFilter() metodu çağrılacaktır.
#. Denetçi uygulamanın verilerine erişmek için modelleri kullanabilir.
   Bu durumda, denetçi Kamil'in son satın aldıklarını veritabanından 
   getirecektir. Bu duruma uyan her model çağrısı, davranışları ve
   VeriKaynakları bu işlem sırasında kullanılabilir. Model kullanımı
   gerekmiyorsa gile, tüm CakePHP denetçileri başlangıçta en az bir 
   modele ihtiyaç duyabilirler.
#. Model veriyi çektikten sonra, denetçiye gönderir. Model çağrıları
   da kullanılmış olabilirler.
#. Denetçi veriyi sadeleştirmek veya (örneğin oturum bilgisini değiştirme, 
   kimlik doğrulama veya e-posta gönderme) farklı işlemler gerçekleştimek
   için bileşenleri kullanabilir.
#. Denetçi veriyi düzgünce hazırlamak için modelleri ve bileşenleri kullandıktan
   sonra, veriyi görünüme (View) denetçinin set() metodunu kullanarak iletir. Bu
   aşamada veri gönderilmeden önce denetçi çağrıları kullanılabilir. Görünüm mantığı
   elemanları ve/veya yardımcıların kullanımını içerebilir. Varsayılan olarak, görünüm
   bir plan (layout) içinde görüntülenir.
#. Ek olarak denetçi çağrıları kullanılabilir. (:php:meth:`~Controller::afterFilter` gibi)
   Tamamlanmış ve görüntülenmiş görünüm kodu Kamil'in tarayıcısına iletilir.


.. meta::
    :title lang=tr: Tipik bir CakePHP İsteği
    :keywords lang=tr: İsteğe bağlı eleman,model kullanımı,denetleyici sınıfı,özel kek,iş mantığı,talep örneği,istek url'si,akış şeması,temel bileşenler, verikaynakları,e-posta gönderme,çağrı,kekler,manipülasyon,kimlik doğrulama,yönlendirici, web sunucusu,parametreler,cakephp, modeller
