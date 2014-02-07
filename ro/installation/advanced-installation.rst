Instalarea avansată
###################

Există multe situații în care doriți să plasați fișierele în CakePHP intr-un alt
director din sistemul de fișiere. Acest lucru se poate întâmpla datorita
restricțiilor impuse de serverul de găzduire, sau pur și simplu deoarece mai
multe aplicații partajeaza aceeași versiune de CakePHP. Această secțiune descrie
modul de configurare al directoarelor CakePHP pentru a se potrivi cerințelor
dumneavoastră.

În primul rând, rețineți că există trei părți intr-o aplicatie CakePHP:

#. Fișierele proprii ale framework-ului cakePHP în /cake
#. Codul specific aplicației dvs.  în /app
#. Directorul rădăcină al aplicației dumneavoastră, de obicei în /app/webroot

Fiecare dintre aceste directoare poate fi pozitionat în orice alta adresa doriți
în sistemul dvs. de fișiere, cu excepția directorului rădăcină (*webroot*),
care trebuie să fie accesibil prin serverul de web. Puteți chiar să-l mutati din
/app daca i-ati spus CakePHP unde este.

Modificați următoarele fișiere dacă doriți să configurați CakePHP pentru a functiona
cu o structura de director diferita:

- /app/webroot/index.php
- /app/webroot/test.php (dacă utilizați teste
   `Testing <view/1196/Testing>`_ .)

Există 3 constante pe care trebuie sa le schimbati: ``ROOT``,
``APP_DIR`` si ``CAKE_CORE_INCLUDE_PATH``

- ``ROOT`` ar trebui să aiba ca valoare folderul care conține directorul app.
- ``APP_DIR`` ar trebui să fie directorul ce contine app.
- ``CAKE_CORE_INCLUDE_PATH`` trebuie să indice către directorul care conține CakePHP.

Să vedem acest lucru cu un exemplu. Imaginați-vă că doriți să creați o structură de
directoare după cum urmează:

- Instalarea CakePHP vreau sa fie în /usr/lib/cake
- Directorul meu rădăcină * webroot * se va plasa în /var/www/mysite/
- Directorul meu app cu codul meu de aplicatie se va plasa în /home/me/AplicatiaMea

Pentru a realiza acest lucru, va trebui să editați fișierul /var/www/mysite/index.php
pentru a arata ca aceasta::

    // /app/webroot/index.php (partial, comments removed) 
    
    if (!defined('ROOT')) {
        define('ROOT', DS . 'home' . DS . 'me');
    }
    
    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'AplicatiaMea');
    }
    
    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS . 'usr' . DS . 'lib');
    }

Vă recomandăm să utilizați constanta ``DS`` în loc de caracterul "/" pentru a delimita
căile de director. Acest lucru permite coduri mai portabile, deoarece
acesta se schimbă în unele sisteme de operare. Utilizați ``DS``.

Apache, mod\_rewrite și .htaccess
=================================

CakePHP este scris pentru a lucra cu mod\_rewrite fără sa faceti nicio
modificare. În mod normal, nu veți realiza că acesta este in functiune, cu toate
că am văzut că este un pic mai complicat pentru unele persoane sa-l configureze
pentru a rula bine pe sistemul dumneavoastră.

Vă sugerăm câteva lucruri care v-ar putea ajuta sistemul să devina bine configurat.

În primul rând: verificați fișierul de configurare Apache httpd.conf
(asigurați-vă că editati fișierul corect, deoarece puteți avea fișiere cu acest nume 
pentru fiecare utilizator sau pentru site-ul web. Editați fișierul de configurare
principal).

#. Ar trebui să se permită suprascrierea .htaccess ( * ovverride * ), iar
   parametrul AllowOverride trebuie să fie setat la " All " pentru DocumentRoot in care
   locuiește aplicația dvs. web. Ar trebui să vedeți ceva de genul::

       # Fiecare director la care Apache are acces trebuie să fie configurat
       # pentru a indica ce caracteristici sunt activate și dezactivate
       #
       # În primul rând un director este configurat în mod implicit pentru securitate cu acces restricționat
       #
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. Verificați dacă în mod eficient se incarca mod\_rewrite deoarece în unele
   sisteme este dezactivat în mod implicit în Apache. Pentru a face acest lucru ar trebui să vedeți
   linia următoare * fără niciun * comentariu ('#') la început::

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

Dacă aveți un comentariu la începutul liniei, scoateți-l. Dacă ați facut
orice modificări la acest fișier, va trebui să reporniți serviciul Apache::

    sudo service apache2 restart

Verifica ca fisierul .htaccess este acolo.

Uneori, atunci când se copiaza fișierele dintr-un loc in altul fișierele cu un nume care
începe cu "." sunt considerate ascunse și nu sunt copiate. Este necesar sa copiati forțat
aceste fișiere.

#. Asigurați-vă că CakePHP este descarcat de pe site-ul nostru oficial sau
   dintr-un depozit oficial GIT, și pe care l-ati dezarhivat corect.

În directorul rădăcină al CakePHP trebuie in .htaccess sa se gaseasca urmatorul cod 
pentru a redirecționa toate cererile catre aplicatia dumneavoastră CakePHP::

    <IfModule mod_rewrite.c>
      RewriteEngine on
      RewriteRule    ^$ app/webroot/    [L]
      RewriteRule    (.*) app/webroot/$1 [L]
    </IfModule>

În directorul app (va fi copiat în directorul dvs de aplicatie de bake) se va gasi 
in .htaccess urmatorul cod::

    <IfModule mod_rewrite.c>
       RewriteEngine on
       RewriteRule    ^$    webroot/    [L]
       RewriteRule    (.*) webroot/$1    [L]
    </IfModule>

În directorul rădăcină * webroot * (de asemenea va fi copiat de bake)::

    <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteRule ^(.*)$ index.php [QSA,L]
    </IfModule>

Multe dintre companiile de hosting (GoDaddy, 1and1) au deja mod\_rewrite activ
și server web și un director de utilizator folosit pentru a servi conținut.
Dacă instalați CakePHP într-un director de utilizator, de exemplu,
(http://site_exemplu.com/~numele_dvs_de_utilizator/CakePHP/) sau orice altă cale 
și utilizati mod\_rewrite aveti nevoie sa adăugati o directivă ``RewriteBase`` 
la fișierele .htaccess folosite (la toate).


.. note ::

    Dacă încărcați pagina de bun venit CakePHP si veți vedea că nu se aplică bine
    stilurile, ati putea avea nevoie de această directivă ``RewriteBase`` în fișierele dvs.
    .htaccess.

Pentru a adăuga aceasta directiva, deschideti cele 3 fisiere .htaccess și introduceți 
noua directiva sub linia RewriteEngine (în cadrul blocului IfModule din fișierul de 
configurare pentru a se incarca numai în cazul în care exista mod\_rewrite)::

    <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /path/to/cake/app
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteRule ^(.*)$ index.php [QSA,L]
    </IfModule>

Această schimbare depinde de configurația dumneavoastră. Poate ar trebui să se facă alte
modificări în funcție de serverul dumneavoastră. Pentru întrebări, consultați documentația
Apache.
