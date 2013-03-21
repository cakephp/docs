CakeEmail
#########

.. php:class:: CakeEmail(mixed $config = null)

``CakeEmail`` est une nouvelle classe pour envoyer des emails. Avec cette 
classe, vous pouvez envoyer des emails de n'importe quel endroit de votre 
application. En plus d'utiliser le EmailComponent à partir de vos 
controllers, vous pouvez aussi envoyer des mails à partir des Shells et des 
Models.

Cette classe remplace :php:class:`EmailComponent` et donne plus de flexibilité 
dans l'envoi d'emails. Par exemple, vous pouvez créer vos propres transports 
pour envoyer l'email au lieu d'utiliser les smtp et mail fournis.

Utilisation basique
===================

Premièrement, vous devez vous assurer que la classe est chargée en utilisant 
:php:meth:`App::uses()`::

    App::uses('CakeEmail', 'Network/Email');

L'utilisation de CakeEmail est similaire à l'utilisation de 
:php:class:`EmailComponent`. Mais au lieu d'utiliser les attributs, vous devez 
utiliser les méthodes. Exemple::

    $Email = new CakeEmail();
    $Email->from(array('me@example.com' => 'My Site'));
    $Email->to('you@example.com');
    $Email->subject('About');
    $Email->send('My message');

Pour simplifier les choses, toutes les méthodes de setter retournent l'instance 
de classe. Vous pouvez ré-écrire le code ci-dessous::

    $Email = new CakeEmail();
    $Email->from(array('me@example.com' => 'My Site'))
        ->to('you@example.com')
        ->subject('About')
        ->send('Mon message');

Choisir l'emetteur
------------------

Quand on envoie des emails de la part d'autre personne, c'est souvent une 
bonne idée de définir l'emetteur original en utilisant le header Sender. 
Vous pouvez faire ceci en utilisant ``sender()`` ::

    $Email = new CakeEmail();
    $Email->sender('app@example.com', 'MyApp emailer');


.. note::

    C'est aussi une bonne idée de définir l'envelope de l'emetteur quand on 
    envoie un mail de la part d'une autre personne. Cela les empêche d'obtenir 
    tout message sur la délivrance.


Configuration
=============

La configuration est la même que pour la base de données, les emails peuvent 
avoir une classe pour centraliser toute la configuration.

Créer le fichier ``app/Config/email.php`` avec la classe ``EmailConfig``.
Le fichier ``app/Config/email.php.default`` donne un exemple de ce fichier.

``CakeEmail`` va créer une instance de la classe ``EmailConfig`` pour accéder à 
config. Si vous avez des données dynamiques à mettre dans les configs, vous 
pouvez utiliser le constructeur pour le faire::

    class EmailConfig {
        public function __construct() {
            // Faire des assignments conditionnel ici.
        }
    }

Il n'est pas nécéssaire de créer ``app/Config/email.php``, ``CakeEmail`` peut 
être utilisé sans lui et utiliser les méthodes respectives pour définir toutes 
les configurations séparément ou charger un tableau de configs.

Pour charger un config à partir de ``EmailConfig``, vous pouvez utiliser la 
méthode ``config()`` ou la passer au constructeur de ``CakeEmail``::

    $Email = new CakeEmail();
    $Email->config('default');

    //ou dans un constructeur::
    $Email = new CakeEmail('default');

Plutôt que de passer une chaîne qui correspond au nom de la configuration dans 
``EmailConfig``, vous pouvez aussi juste charger un tableau de configs::

    $Email = new CakeEmail();
    $Email->config(array('from' => 'me@example.org', 'transport' => 'MyCustom'));

    //ou dans un constructeur::
    $Email = new CakeEmail(array('from' => 'me@example.org', 'transport' => 'MyCustom'));

Vous pouvez configurer les serveurs SSL SMTP, comme GMail. Pour faire ceci, 
mettez ``'ssl://'`` en préfixe dans le host et configurez la valeur du port 
selon. Exemple::

    class EmailConfig {
        public $gmail = array(
            'host' => 'ssl://smtp.gmail.com',
            'port' => 465,
            'username' => 'my@gmail.com',
            'password' => 'secret',
            'transport' => 'Smtp'
        );
    }

.. note::

    Pour utiliser cette fonctionnalité, vous aurez besoin d'avoir SSL configuré 
    dans votre installation PHP.

.. _email-configurations:

Configurations
--------------

La clés de configuration suivantes sont utilisés:

- ``'from'``: Email ou un tableau d'emmeteur. Regardez ``CakeEmail::from()``.
- ``'sender'``: Email ou un tableau d'emetteur réel. Regardez 
  ``CakeEmail::sender()``.
- ``'to'``: Email ou un tableau de destination. Regardez ``CakeEmail::to()``.
- ``'cc'``: Email ou un tableau de copy carbon. Regardez ``CakeEmail::cc()``.
- ``'bcc'``: Email ou un tableau de copy carbon blind. Regardez 
  ``CakeEmail::bcc()``.
- ``'replyTo'``: Email ou un tableau de repondre à cet e-mail. Regardez 
  ``CakeEmail::replyTo()``.
- ``'readReceipt'``: Adresse Email ou un tableau d'adresses pour recevoir un 
  récepissé de lecture. Regardez ``CakeEmail::readReceipt()``.
- ``'returnPath'``: Adresse Email ou un tableau des adresses à retourner si 
  vous avez une erreur. Regardez ``CakeEmail::returnPath()``.
- ``'messageId'``: ID du Message de l'e-mail. Regardez 
  ``CakeEmail::messageId()``.
- ``'subject'``: Sujet du message. Regardez ``CakeEmail::subject()``.
- ``'message'``: Contenu du message. Ne définissez pas ce champ si vous 
  utilisez un contenu rendu.
- ``'headers'``: Headers à inclure. Regardez ``CakeEmail::setHeaders()``.
- ``'viewRender'``: Si vous utilisez un contenu rendu, définissez le nom de 
  classe de la vue. Regardez ``CakeEmail::viewRender()``.
- ``'template'``: Si vous utilisez un contenu rendu, définissez le nom du 
  template. Regardez ``CakeEmail::template()``.
- ``'layout'``: Si vous utilisez un contenu rendu, définissez le layout à 
  rendre. Si vous voulez rendre un template sans layout, définissez ce champ 
  à null. Regardez ``CakeEmail::template()``.
- ``'viewVars'``: Si vous utilisez un contenu rendu, définissez le tableau avec 
  les variables devant être rendus dans la vue. Regardez 
  ``CakeEmail::viewVars()``.
- ``'attachments'``: Liste des fichiers à attacher. Regardez 
  ``CakeEmail::attachments()``.
- ``'emailFormat'``: Format de l'email (html, text ou both). Regardez 
  ``CakeEmail::emailFormat()``.
- ``'transport'``: Nom du Transport. Regardez ``CakeEmail::transport()``.
- ``'log'``: Niveau de Log pour connecter les headers del'email headers et le 
  message. ``true`` va utiliser LOG_DEBUG. Regardez aussi ``CakeLog::write()``

Toutes ces configurations sont optionnelles, excepté ``'from'``. Si vous mettez 
plus de configuration dasn ce tableau, les configurations seront utilisées dans 
la méthode :php:meth:`CakeEmail::config()` et passées à la classe de transport 
``config()``.
Par exemple, si vous utilisez le transport smtp, vous devez passer le host, 
port et autres configurations.

.. note::

    Les valeurs des clés ci-dessus utilisant Email ou un tableau, comme from, 
    to, cc etc. seront passés en premier paramètre des méthodes 
    correspondantes. L'equivalent pour 
    ``CakeEmail::from('my@example.com', 'My Site')`` sera défini comme 
    ``'from' => array('my@example.com' => 'My Site')`` dans votre config

Définir les headers
-------------------

Dans ``CakeEmail``, vous êtes libres de définir les headers que vous souhaitez.
Si vous migrez pour utiliser CakeEmail, n'oubliez pas de mettre le préfixe 
``X-`` dans vos headers.

Regardez ``CakeEmail::setHeaders()`` et ``CakeEmail::addHeaders()``

Envoyer les emails templatés
----------------------------

Les Emails sont souvent bien plus que de simples message textes. Afin de 
faciliter cela, CakePHP fournit une façon d'envoyer les emails en utilisant la 
:doc:`view layer </views>` de CakePHP.

Les templates pour les emails se placent dans un dossier spécial dans le 
répertoire ``View`` de votre application. Les vues des emails peuvent aussi 
utiliser les layouts et éléments tout comme les vues normales::

    $Email = new CakeEmail();
    $Email->template('welcome', 'fancy')
        ->emailFormat('html')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

Ce qui est au-dessus utilise ``app/View/Emails/html/welcome.ctp`` pour la vue,
et ``app/View/Layouts/Emails/html/fancy.ctp`` pour le layout. Vous pouvez 
aussi envoyer des messages email templaté multipart::

    $Email = new CakeEmail();
    $Email->template('welcome', 'fancy')
        ->emailFormat('both')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

Ceci utiliserait les fichiers de vue suivants:

* ``app/View/Emails/text/welcome.ctp``
* ``app/View/Layouts/Emails/text/fancy.ctp``
* ``app/View/Emails/html/welcome.ctp``
* ``app/View/Layouts/Emails/html/fancy.ctp``

Quand on envoie les emails templatés, vous avez la possibilité d'envoyer soit 
``text``, ``html`` soit ``both``.

Vous pouvez définir des variables de vue avec ``CakeEmail::viewVars()``::

    $Email = new CakeEmail('templated');
    $Email->viewVars(array('value' => 12345));

Dans votre email template, vous pouvez utiliser ceux-ci avec::

    <p>Ici est votre valeur: <b><?php echo $value; ?></b></p>

Vous pouvez aussi utiliser les helpers dans les emails, un peu comme vous 
pouvez dans des fichiers normaux de vue. Par défaut, seul 
:php:class:`HtmlHelper` est chargé. Vous pouvez chargez des helpers 
supplémentaires en utilisant la méthode ``helpers()``::

    $Email->helpers(array('Html', 'Custom', 'Text'));

Quand vous définissez les helpers, assurez vous d'inclure 'Html' ou il sera 
retiré des helpers chargés dans votre template d'email.

Si vous voulez envoyer un email en utilisant templates dans un plugin, vous 
pouvez utiliser la :term:`syntaxe de plugin` familière pour le faire::

    $Email = new CakeEmail();
    $Email->template('Blog.new_comment', 'Blog.auto_message')

Ce qui est au-dessus utiliserait les templates à partir d'un plugin de Blog par 
exemple.


Envoyer les pièces jointes
--------------------------

Vous pouvez aussi attacher des fichiers aux messages d'email. Il y a quelques 
formats différents qui dépendent de quel type de fichier vous avez, et comment 
vous voulez que les noms de fichier apparaissent dans le mail de réception du 
client:

1. Chaîne de caractères: ``$Email->attachments('/full/file/path/file.png')`` va 
   attacher ce fichier avec le nom file.png.
2. Tableau: ``$Email->attachments(array('/full/file/path/file.png')`` aura le 
   même comportement qu'en utilisant une chaîne de caractères.
3. Tableau avec clé:
   ``$Email->attachments(array('photo.png' => '/full/some_hash.png'))`` va
   attacher some_hash.png avec le nom photo.png. Le récipiendaire va voir 
   photo.png, pas some_hash.png.
4. Tableaux imbriqués::

    $Email->attachments(array(
        'photo.png' => array(
            'file' => '/full/some_hash.png',
            'mimetype' => 'image/png',
            'contentId' => 'my-unique-id'
        )
    ));

   Ce qui est au-dessus va attacher le fichier avec différent mimetype et avec 
   un content ID personnalisé (Quand vous définissez le content ID, la pièce 
   jointe est transformée en inline). Le mimetype et contentId sont optionels 
   dans ce formulaire.

  4.1. Quand vous utilisez ``contentId``, vous pouvez utiliser le fichier dans 
  corps html comme ``<img src="cid:my-content-id">``.

Utiliser les transports
-----------------------

Les Transports sont des classes destinés à envoyer l'email selon certain 
protocoles ou méthodes. CakePHP supporte les transports Mail (par défaut), 
Debug et Smtp.

Pour configurer votre méthode, vous devez utiliser la méthode 
:php:meth:`CakeEmail::transport()` ou avoir transport dans votre configuration.

Créer des Transports personnalisés
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Vous pouvez créer vos transports personnalisés pour intégrer avec d'autres 
systèmes email (comme SwiftMailer). Pour créer votre transport, créez tout 
d'abord le fichier ``app/Lib/Network/Email/ExampleTransport.php`` (où 
Exemple est le nom de votre transport). Pour commencer, votre fichier devrait 
ressembler à cela::

    App::uses('AbstractTransport', 'Network/Email');

    class ExempleTransport extends AbstractTransport {

        public function send(CakeEmail $Email) {
            // magique à l'intérieur!
        }

    }

Vous devez intégrer la méthode ``send(CakeEmail $Email)`` avec votre 
logique personnalisée. En option, vous pouvez intégrer la méthode 
``config($config)``. ``config()`` est appelé avant send() et vous permet 
d'accepter les configurations de l'utilisateur. Par défaut, cette méthode 
met la configuration dans l'attribut protégé ``$_config``.

Si vous avez besoin d'appeler des méthodes supplémentaires sur le transport 
avant l'envoi, vous pouvez utiliser :php:meth:`CakeEmail::transportClass()` 
pour obtenir une instance du transport.
Exemple::

    $yourInstance = $Email->transport('your')->transportClass();
    $yourInstance->myCustomMethod();
    $Email->send();


Envoyer des messages rapidement
===============================

Parfois vous avez besoin d'une façon rapide d'envoyer un email, et vous n'avez 
pas particulièrement envie en même temps de définir un tas de configuration.
:php:meth:`CakeEmail::deliver()` est présent pour ce cas.

Vous pouvez créer votre configuration dans ``EmailConfig``, ou utiliser un 
tableau avec toutes les options dont vous aurez besoin et utiliser 
la méthode statique ``CakeEmail::deliver()``.
Exemple::

    CakeEmail::deliver('you@example.com', 'Subject', 'Message', array('from' => 'me@example.com'));

Cette méthode va envoyer un email à you@example.com, à partir de me@example.com 
avec le sujet Subject et le contenu Message.

Le retour de ``deliver()`` est une instance de :php:class:`CakeEmail` avec 
l'ensemble des configurations. Si vous ne voulez pas envoyer l'email 
maintenant, et souhaitez configurer quelques trucs avant d'envoyer, vous pouvez 
passer le 5ème paramètre à false.

Le 3ème paramètre est le contenu du message ou un tableau avec les variables 
(quand on utilise le contenu rendu).

Le 4ème paramètre peut être un tableau avec les configurations ou une chaîne de 
caractères avec le nom de configuration dans ``EmailConfig``.

Si vous voulez, vous pouvez passer les to, subject et message à null et faire 
toutes les configurations dans le 4ème paramètre (en tableau ou en utilisant 
``EmailConfig``).
Vérifiez la liste des :ref:`configurations <email-configurations>` pour voir 
toutes les configs acceptées.


.. meta::
    :title lang=fr: CakeEmail
    :keywords lang=fr: envoyer mail,email emmetteur sender,envelope sender,classe php,database configuration,sending emails,meth,shells,smtp,transports,attributes,array,config,flexibilité,php email,nouvel email,sending email,models
