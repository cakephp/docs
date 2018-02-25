I18N na Shell
##########

Ang i18n na mga tampok ng CakePHP ay gumagamit ng `po files <http://en.wikipedia.org/wiki/GNU_gettext>`_
bilang kanilang pinagmulan ng pagsasalin. Angg PO na mga file ay i-integrate sa karaniwang ginagamit na mga tool sa pagsasalin 
tulad ng `Poedit <http://www.poedit.net/>`_.

Ang i18n na shell ay nagbibigay ng isang mabilis at madaling paraan upang makabuo ng mga file ng template ng po.
Ang mga file ng mga template na ito ay maaaring ibigay sa mga tagasalin upang maisalin nila ang 
mga string na iyong aplikasyon. Kapag meron ka nang natapos na pagsasalin, ang mga file ng pot ay maaaring 
i-merge sa umiiral na mga pagsasalin upang tulungang i-update ang iyong aplikasyon.

Pagbubuo ng mga File ng POT
====================

Ang mga POT na mga file ay maaaring mabuo para sa umiiral na aplikasyon gamit ang ``extract``
na utos. Ang utos na ito ay i-scan ang iyong buong aplikasyon para sa ``__()`` na estilo
ng pagtawag ng function, at i-extract ang string ng mensahe. Ang bawat natatanging string sa iyong 
aplikasyon ay sasamahin sa isang file ng POT::

    bin/cake i18n extract

Ang nasa itaas ay ipatatakbo ang shell ng pagkuha. Ang resulta ng utos na ito ay ang 
file na **src/Locale/default.pot**. Ginagamit mo ang file ng pot bilang isang template para sa paglikha ng 
mga file ng po. Kung ikaw ay manu-manong lumikha ng mga file ng po mula sa file ng pot, siguraduhin na 
tama ang na-set na ``Plural-Forms`` na line ng header.

Pagbuo ng mga File ng POT para sa mga Plugin
--------------------------------

Maaari kang magbuo ng isang file ng POT para sa isang tiyak na plugin gamit ang::

    bin/cake i18n extract --plugin <Plugin>

Ito ay bubuo ng kinakailangang mga file ng POT na ginamit sa mga plugin.

Pag-extract mula sa maramihang mga folder nang sabay-sabay
----------------------------------------

Minsan, maaaring kailanganin mong kunin ang mga string mula sa higit sa isang direktoryo ng 
iyong aplikasyon. Halimbawa, kung tinutukoy mo ang ilang mga string sa 
``config`` na direktoryo ng iyong aplikasyon, baka gusto mong kunin ang mga string 
mula sa direktoryo na ito pati na rin mula sa ``src`` na direktoryo. Magagawa mo ito sa pamamagitan ng 
paggamit ng ``--paths`` na opsyon. Ito ay kumukuha ng isang comma-separated na listahan ng absolute na mga path
upang makuha::

    bin/cake i18n extract --paths /var/www/app/config,/var/www/app/src

Pag-exclude ng mga Folder
-----------------

Maaari kang pumasa ng listahan ng isang pinaghiwalay ng comma na mga folder na nais mong i-exclude.
Anumang path na naglalaman ng isang segment ng path na may ibinigay na mga halaga ay hindi papansinin::

    bin/cake i18n extract --exclude Test,Vendor

Paglaktaw sa mga Pag-Overwrite na Babala para sa Umiiral na POT na mga File
--------------------------------------------------

Sa pagdaragdag ng ``--overwrite``, ang script ng shell ay hindi ka na babalaan kung ang file ng POT 
ay umiiral na at mag-overwrite bilang default::

    bin/cake i18n extract --overwrite

Pag-extract ng mga Mensahe mula sa Core na mga Library ng CakePHP
---------------------------------------------------

Bilang default, ang shell na script ng pag-extract ay tatanungin ka kung gusto mong i-extract 
ang mga mensahe na ginamit sa core na mga library ng CakePHP. I-set ang ``--extract-core`` sa oo 
o hindi upang itakda ang default na gawi::

    bin/cake i18n extract --extract-core yes

    // or

    bin/cake i18n extract --extract-core no

.. meta::
    :title lang=en: I18N shell
    :keywords lang=en: pot files,locale default,translation tools,message string,app locale,php class,validation,i18n,translations,shell,models
