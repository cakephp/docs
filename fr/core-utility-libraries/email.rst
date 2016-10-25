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
pour envoyer l'email au lieu d'utiliser les transports SMTP et Mail fournis.

Utilisation basique
===================

Premièrement, vous devez vous assurer que la classe est chargée en utilisant
:php:meth:`App::uses()`::

    App::uses('CakeEmail', 'Network/Email');

L'utilisation de CakeEmail est similaire à l'utilisation de
:php:class:`EmailComponent`. Mais au lieu d'utiliser les attributs, vous
utilisez les méthodes. Exemple::

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

Choisir l'émetteur
------------------

Quand on envoie des emails de la part d'autre personne, c'est souvent une
bonne idée de définir l'émetteur original en utilisant le header Sender.
Vous pouvez faire ceci en utilisant ``sender()``::

    $Email = new CakeEmail();
    $Email->sender('app@example.com', 'MyApp emailer');


.. note::

    C'est aussi une bonne idée de définir l'enveloppe de l'émetteur quand on
    envoie un mail de la part d'une autre personne. Cela les empêche d'obtenir
    tout message sur la délivrance.

Configuration
=============

De même que pour la base de données, la configuration d'email peut être
centralisée dans une classe.

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

Il n'est pas nécessaire de créer ``app/Config/email.php``, ``CakeEmail`` peut
être utilisé sans lui et utiliser les méthodes respectives pour définir toutes
les configurations séparément ou charger un tableau de configs.

Pour charger un config à partir de ``EmailConfig``, vous pouvez utiliser la
méthode ``config()`` ou la passer au constructeur de ``CakeEmail``::

    $Email = new CakeEmail();
    $Email->config('default');

    //ou dans un constructeur::
    $Email = new CakeEmail('default');

    // config 'default' implicite utilisée depuis 2.7
    $Email = new CakeEmail();

Plutôt que de passer une chaîne qui correspond au nom de la configuration dans
``EmailConfig``, vous pouvez aussi juste charger un tableau de configs::

    $Email = new CakeEmail();
    $Email->config(array('from' => 'me@example.org', 'transport' => 'MyCustom'));

    //ou dans un constructeur::
    $Email = new CakeEmail(array('from' => 'me@example.org', 'transport' => 'MyCustom'));

.. note::

    Utilisez ``$Email->config()`` ou le constructeur pour définir le niveau de
    log pour enregistrer l'en-tête d'email et le message dans les logs.
    Utilisez ``$Email->config(array('log' => true));`` va utiliser LOG_DEBUG.
    Regardez aussi ``CakeLog::write()``

Vous pouvez configurer les serveurs SSL SMTP, comme Gmail. Pour faire ceci,
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

Vous pouvez également utiliser ``tls://`` pour spécifier TLS pour le chiffrement
au niveau de la connexion.

.. warning::
    Vous devrez avoir l'accès aux applications moins sécurisées activé dans votre
    compte Google pour que cela fonctionne:
    `Autoriser les applications moins sécurisées à accéder à votre
    compte <https://support.google.com/accounts/answer/6010255>`__.

.. note::

    Pour utiliser les fonctionnalités ssl:// ou tls://, vous aurez besoin
    d'avoir SSL configuré dans votre installation PHP.

Depuis 2.3.0, vous pouvez aussi activer STARTTLS SMTP en utilisant l'option
``tls``::

    class EmailConfig {
        public $gmail = array(
            'host' => 'smtp.gmail.com',
            'port' => 465,
            'username' => 'my@gmail.com',
            'password' => 'secret',
            'transport' => 'Smtp',
            'tls' => true
        );
    }

La configuration ci-dessus va activer la communication STARTTLS pour les
messages emails.

.. versionadded:: 2.3
    Le support pour le delivery TLS a été ajouté dans 2.3.


.. _email-configurations:

Configurations
--------------

La clés de configuration suivantes sont utilisées:

- ``'from'``: Email ou un tableau d'emmeteur. Regardez ``CakeEmail::from()``.
- ``'sender'``: Email ou un tableau d'émetteur réel. Regardez
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
- ``'theme'``: Theme utilisé pour le rendu du template. Voir
  ``CakeEmail::theme()``.
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
- ``'helpers'``: Tableau de helpers utilisé dans le template d'email.

Toutes ces configurations sont optionnelles, excepté ``'from'``. Si vous mettez
plus de configurations dans ce tableau, les configurations seront utilisées
dans la méthode :php:meth:`CakeEmail::config()` et passées à la classe de
transport ``config()``.
Par exemple, si vous utilisez le transport SMTP, vous devez passer le host,
port et autres configurations.

.. note::

    Les valeurs des clés ci-dessus utilisant Email ou un tableau, comme from,
    to, cc etc. seront passées en premier paramètre des méthodes
    correspondantes. L'équivalent pour
    ``CakeEmail::from('my@example.com', 'My Site')`` sera défini comme
    ``'from' => array('my@example.com' => 'My Site')`` dans votre config.

Définir les headers
-------------------

Dans ``CakeEmail``, vous êtes libre de définir les headers que vous souhaitez.
Si vous migrez pour utiliser CakeEmail, n'oubliez pas de mettre le préfixe
``X-`` dans vos headers.

Regardez ``CakeEmail::setHeaders()`` et ``CakeEmail::addHeaders()``

Envoyer les emails templatés
----------------------------

Les Emails sont souvent bien plus que de simples messages textes. Afin de
faciliter cela, CakePHP fournit une façon d'envoyer les emails en utilisant la
:doc:`view layer </views>` de CakePHP.

Les templates pour les emails se placent dans un dossier spécial appelé
``Emails`` dans le répertoire ``View`` de votre application. Les vues des
emails peuvent aussi utiliser les layouts et éléments tout comme les vues
normales::

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
2. Tableau: ``$Email->attachments(array('/full/file/path/file.png'))`` aura le
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
       corps HTML comme ``<img src="cid:my-content-id">``.

  4.2. Vous pouvez utiliser l'option ``contentDisposition`` pour désactiver le
       header ``Content-Disposition`` pour une pièce jointe. C'est utile pour
       l'envoi d'invitations ical à des clients utilisant outlook.

   4.3 Au lieu de l'option ``file``, vous pouvez fournir les contenus de
       fichier en chaîne en utilisant l'option ``data``. Cela vous permet
       d'attacher les fichiers sans avoir besoin de chemins de fichier vers eux.

.. versionchanged:: 2.3
    L'option ``contentDisposition`` a été ajoutée.

.. versionchanged:: 2.4
    L'option ``data`` a été ajoutée.

Utiliser les transports
-----------------------

Les Transports sont des classes destinées à envoyer l'email selon certain
protocoles ou méthodes. CakePHP supporte les transports Mail (par défaut),
Debug et SMTP.

Pour configurer votre méthode, vous devez utiliser la méthode
:php:meth:`CakeEmail::transport()` ou avoir le transport dans votre
configuration.

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

Faciliter les règles de validation des adresses
-----------------------------------------------

.. php:method:: emailPattern($pattern = null)

Si vous avez des problèmes de validation lors de l'envoi vers des adresses
non conformes, vous pouvez faciliter le patron utilisé pour valider les
adresses email. C'est parfois nécessaire quand il s'agit de certains
ISP Japonais.

    $email = new CakeEmail('default');

    // Relax le patron d\'email, ainsi vous pouvez envoyer
    // vers des adresses non conformes
    $email->emailPattern($newPattern);

.. versionadded:: 2.4


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

Envoyer des emails depuis CLI
=============================

.. versionchanged:: 2.2

    La méthode ``domain()`` a été ajoutée dans 2.2

Quand vous envoyez des emails à travers un script CLI (Shells, Tasks, ...),
vous devez définir manuellement le nom de domaine que CakeEmail doit utiliser.
Il sera utilisé comme nom d'hôte pour l'id du message (puisque il n'y a pas
de nom d'hôte dans un environnement CLI)::

    $Email->domain('www.example.org');
    // Resulte en ids de message comme ``<UUID@www.example.org>`` (valid)
    // au lieu de `<UUID@>`` (invalid)

Un id de message valide peut permettre à ce message de ne pas finir dans un
dossier de spam. Si vous générez des liens dans les corps de vos emails, vous
pouvez aussi avoir besoin de définir la valeur de configuration
``App.fullBaseUrl``.

.. meta::
    :title lang=fr: CakeEmail
    :keywords lang=fr: envoyer mail,email emmetteur sender,envelope sender,classe php,database configuration,sending emails,meth,shells,smtp,transports,attributes,array,config,flexibilité,php email,nouvel email,sending email,models
