Email
#####

.. php:namespace:: Cake\Network\Email

.. php:class:: Email(mixed $profile = null)

``Email`` est une nouvelle classe pour envoyer des emails. Avec cette classe,
vous pouvez envoyer des emails depuis n'importe endroit de votre application.

Utilisation basique
===================

Premièrement, vous devez vous assurer que la classe est chargée::

    use Cake\Network\Email\Email;

Après avoir chargé ``Email``, vous pouvez envoyer un email avec ce qui suit::

    $email = new Email();
    $email->from(['me@example.com' => 'My Site'])
        ->to('you@example.com')
        ->subject('About')
        ->send('My message');

Puisque les méthodes de setter d'``Email`` retournent l'instance de la classe,
vous pouvez définir ses propriétés avec le chaînage des méthodes.

Choisir l'Emetteur
------------------

Quand on envoie des emails de la part d'autre personne, c'est souvent une
bonne idée de définir l'emetteur original en utilisant le header Sender.
Vous pouvez faire ceci en utilisant ``sender()``::

    $email = new Email();
    $email->sender('app@example.com', 'MyApp emailer');

.. note::

    C'est aussi une bonne idée de définir l'envelope de l'emetteur quand on
    envoie un mail de la part d'une autre personne. Cela les empêche d'obtenir
    tout message sur la délivrance.

.. _email-configuration:

Configuration
=============

La Configuration par défaut pour ``Email`` est créé en utilisant ``config()`` et
``configTransport()``. Vous devrez mettre vos préconfigurations d'email dans
le fichier ``config/app.php``. Le fichier ``config/app.php.default`` est
un exemple de ce fichier. Il n'est pas nécessaire de définir de configuration
d'email dans ``config/app.php``. ``Email`` peut être utilisé sans cela
et utilise les méthodes séparement pour définir toutes les configurations
ou charger un tableau de configs.

En définissant des profiles et des transports, vous pouvez garder le code de
votre application sans données de configuration, et éviter de dupliquer ce qui
rend la maintenance et le déploiement moins compliqués.

Pour charger une configuration prédéfinie, vous pouvez utiliser la méthode
``profile()`` ou la passer au constructeur d'``Email``::

    $email = new Email();
    $email->profile('default');

    //ou dans le constructeur::
    $email = new Email('default');

Plutôt que de passer une chaîne avec le bon nom de configuration prédéfini,
vous pouvez aussi juste charger un tableau d'options::

    $email = new Email();
    $email->profile(['from' => 'me@example.org', 'transport' => 'my_custom']);

    //or dans le constructeur::
    $email = new Email(['from' => 'me@example.org', 'transport' => 'my_custom']);

Configurer les Transports
-------------------------

.. php:staticmethod:: configTransport($key, $config = null)

Les messages d'Email sont délivrés par les transports. Différents transports
vous permettent d'envoyer les messages par la fonction ``mail()`` de PHP,
les serveurs SMTP, ou aucun d'eux ce qui peut être utile pour débugger. La
configuration des transports vous permet de garder les données de configuration
en dehors du code de votre application et rend le déploiement plus simple
puisque vous pouvez simplement changer les données de configuration. Un
exemple de configuration des transports ressemblerai à ceci::

    use Cake\Network\Email\Email;

    // Exemple de configuration de Mail
    Email::configTransport('default', [
        'className' => 'Mail'
    ]);

    // Exemple de configuration smtp.
    Email::configTransport('gmail', [
        'host' => 'ssl://smtp.gmail.com',
        'port' => 465,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp'
    ]);

Vous pouvez configurer les serveurs SSL SMTP, comme Gmail. pour faire ceci,
mettez le prefix ``ssl://`` dans l'hôte et configurez le port avec la bonne
valeur. Vous pouvez aussi activer TLS SMTP en utilisant l'option ``tls``::

    use Cake\Network\Email\Email;

    Email::configTransport('gmail', [
        'host' => 'smtp.gmail.com',
        'port' => 465,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp',
        'tls' => true
    ]);

La configuration ci-dessis va activer la communication TLS pour tous les
messages d'email.

.. note::

    Pour utiliser SSL + SMTP, vous devrez avoir SSL configuré dans votre
    installation PHP.


.. php:staticmethod:: dropTransport($key)

Une fois configuré, les transports ne peuvent pas être modifiés. Afin de
modifier un transport, vous devez d'abord le supprimer et le reconfigurer.

.. _email-configurations:

Profiles de Configurations
--------------------------

Définir des profiles de délivrance vous permet d'ajouter les configurations
habituelles d'email dans des profiles réutilisables. Votre application peut
avoir autant de profiles que nécessaire. Les clés de configuration suivantes
sont utilisées:

- ``'from'``: Email ou un tableau d'emmeteur. Regardez ``Email::from()``.
- ``'sender'``: Email ou un tableau d'emetteur réel. Regardez
  ``Email::sender()``.
- ``'to'``: Email ou un tableau de destination. Regardez ``Email::to()``.
- ``'cc'``: Email ou un tableau de copy carbon. Regardez ``Email::cc()``.
- ``'bcc'``: Email ou un tableau de copy carbon blind. Regardez
  ``Email::bcc()``.
- ``'replyTo'``: Email ou un tableau de repondre à cet e-mail. Regardez
  ``Email::replyTo()``.
- ``'readReceipt'``: Adresse Email ou un tableau d'adresses pour recevoir un
  récepissé de lecture. Regardez ``Email::readReceipt()``.
- ``'returnPath'``: Adresse Email ou un tableau des adresses à retourner si
  vous avez une erreur. Regardez ``Email::returnPath()``.
- ``'messageId'``: ID du Message de l'e-mail. Regardez
  ``Email::messageId()``.
- ``'subject'``: Sujet du message. Regardez ``Email::subject()``.
- ``'message'``: Contenu du message. Ne définissez pas ce champ si vous
  utilisez un contenu rendu.
- ``'headers'``: Headers à inclure. Regardez ``Email::setHeaders()``.
- ``'viewRender'``: Si vous utilisez un contenu rendu, définissez le nom de
  classe de la vue. Regardez ``Email::viewRender()``.
- ``'template'``: Si vous utilisez un contenu rendu, définissez le nom du
  template. Regardez ``Email::template()``.
- ``'theme'``: Theme utilisé pour le rendu du template. Voir
  ``Email::theme()``.
- ``'layout'``: Si vous utilisez un contenu rendu, définissez le layout à
  rendre. Si vous voulez rendre un template sans layout, définissez ce champ
  à null. Regardez ``Email::template()``.
- ``'viewVars'``: Si vous utilisez un contenu rendu, définissez le tableau avec
  les variables devant être rendus dans la vue. Regardez
  ``Email::viewVars()``.
- ``'attachments'``: Liste des fichiers à attacher. Regardez
  ``Email::attachments()``.
- ``'emailFormat'``: Format de l'email (html, text ou both). Regardez
  ``Email::emailFormat()``.
- ``'transport'``: Nom du Transport. Regardez
  :php:meth:`~Cake\\Network\\Email\\Email::configTransport()`.
- ``'log'``: Niveau de Log pour connecter les headers del'email headers et le
  message. ``true`` va utiliser LOG_DEBUG. Regardez aussi ``CakeLog::write()``.
- ``'helpers'``: Tableau de helpers utilisés dans le template email.

Toutes ces configurations sont optionnelles, excepté ``'from'``.

.. note::

    Les valeurs des clés ci-dessus utilisant Email ou un tableau, comme from,
    to, cc etc... seront passées en premier paramètre des méthodes
    correspondantes. L'equivalent pour
    ``Email::from('my@example.com', 'My Site')`` sera défini comme
    ``'from' => ['my@example.com' => 'My Site']`` dans votre config.

Définir les Headers
-------------------

Dans ``Email``, vous êtes libre de définir les headers que vous souhaitez.
Si vous migrez pour utiliser Email, n'oubliez pas de mettre le préfixe
``X-`` dans vos headers.

Regardez ``Email::setHeaders()`` et ``Email::addHeaders()``

Envoyer les Emails Templatés
----------------------------

Les Emails sont souvent bien plus que de simples message textes. Afin de
faciliter cela, CakePHP fournit une façon d'envoyer les emails en utilisant la
:doc:`view layer </views>` de CakePHP.

Les templates pour les emails se placent dans un dossier spécial appelé
``Email`` dans le répertoire ``Template`` de votre application. Les vues des
emails peuvent aussi utiliser les layouts et éléments tout comme les vues
normales::

    $Email = new Email();
    $Email->template('welcome', 'fancy')
        ->emailFormat('html')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

Ce qui est au-dessus utilise ``src/Template/Email/html/welcome.ctp`` pour la vue,
et ``src/Template/Layout/Email/html/fancy.ctp`` pour le layout. Vous pouvez
aussi envoyer des messages email templaté multipart::

    $Email = new Email();
    $Email->template('welcome', 'fancy')
        ->emailFormat('both')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

Ceci utiliserait les fichiers de vue suivants:

* ``src/Template/Email/text/welcome.ctp``
* ``src/Template/Layout/Email/text/fancy.ctp``
* ``src/Template/Email/html/welcome.ctp``
* ``src/Template/Layout/Email/html/fancy.ctp``

Quand on envoie les emails templatés, vous avez la possibilité d'envoyer soit
``text``, ``html`` soit ``both``.

Vous pouvez définir des variables de vue avec ``Email::viewVars()``::

    $email = new Email('templated');
    $email->viewVars(['value' => 12345]);

Dans votre email template, vous pouvez utiliser ceux-ci avec::

    <p>Ici est votre valeur: <b><?= $value; ?></b></p>

Vous pouvez aussi utiliser les helpers dans les emails, un peu comme vous
pouvez dans des fichiers normaux de vue. Par défaut, seul
:php:class:`HtmlHelper` est chargé. Vous pouvez chargez des helpers
supplémentaires en utilisant la méthode ``helpers()``::

    $Email->helpers(['Html', 'Custom', 'Text']);

Quand vous définissez les helpers, assurez vous d'inclure 'Html' ou il sera
retiré des helpers chargés dans votre template d'email.

Si vous voulez envoyer un email en utilisant templates dans un plugin, vous
pouvez utiliser la :term:`syntaxe de plugin` familière pour le faire::

    $email = new Email();
    $email->template('Blog.new_comment', 'Blog.auto_message')

Ce qui est au-dessus utiliserait les templates à partir d'un plugin de Blog par
exemple.

Dans certains cas, vous devez remplacer le template par défaut fourni par
les plugins. Vous pouvez faire ceci en utilisant les themes en disant à Email
d'utiliser le bon theme en utilisant la méthode ``Email::theme()``::

    $email = new Email();
    $email->template('Blog.new_comment', 'Blog.auto_message');
    $email->theme('TestTheme');

Ceci vous permet de remplacer le template `new_comment` dans votre theme sans
modifier le plugin Blog. Le fichier de template devra être créé dans le
chemin suivant:
``src/View/Themed/TestTheme/Blog/Email/text/new_comment.ctp``.

Envoyer les pièces jointes
==========================

.. php:method:: attachments($attachments = null)

Vous pouvez aussi attacher des fichiers aux messages d'email. Il y a quelques
formats différents qui dépendent de quel type de fichier vous avez, et comment
vous voulez que les noms de fichier apparaissent dans le mail de réception du
client:

1. Chaîne de caractères: ``$Email->attachments('/full/file/path/file.png')`` va
   attacher ce fichier avec le nom file.png.
2. Tableau: ``$Email->attachments(['/full/file/path/file.png'])`` aura le
   même comportement qu'en utilisant une chaîne de caractères.
3. Tableau avec clé:
   ``$Email->attachments(['photo.png' => '/full/some_hash.png'])`` va
   attacher some_hash.png avec le nom photo.png. Le récipiendaire va voir
   photo.png, pas some_hash.png.
4. Tableaux imbriqués::

    $Email->attachments([
        'photo.png' => [
            'file' => '/full/some_hash.png',
            'mimetype' => 'image/png',
            'contentId' => 'my-unique-id'
        ]
    ]);

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

Utiliser les Transports
=======================

Les Transports sont des classes destinées à envoyer l'email selon certain
protocoles ou méthodes. CakePHP supporte les transports Mail (par défaut),
Debug et SMTP.

Pour configurer votre méthode, vous devez utiliser la méthode
:php:meth:`Cake\\Network\Email\\Email::transport()` ou avoir le transport dans
votre configuration::

    $email = new Email();

    // Utilise un transport nommé déjà configuré en utilisant Email::configTransport()
    $email->transport('gmail');

    // Utilise un objet construit.
    $transport = new DebugTransport();
    $email->transport($transport);

Créer des Transports Personnalisés
----------------------------------

Vous pouvez créer vos transports personnalisés pour intégrer avec d'autres
systèmes email (comme SwiftMailer). Pour créer votre transport, créez tout
d'abord le fichier ``src/Network/Email/ExampleTransport.php`` (où
Exemple est le nom de votre transport). Pour commencer, votre fichier devrait
ressembler à cela::

    use Cake\Network\Email\AbstractTransport;

    class ExampleTransport extends AbstractTransport {

        public function send(Email $email) {
            // Magie à l'intérieur!
        }

    }

Vous devez intégrer la méthode ``send(Email $Email)`` avec votre
logique personnalisée. En option, vous pouvez intégrer la méthode
``config($config)``. ``config()`` est appelée avant send() et vous permet
d'accepter les configurations de l'utilisateur. Par défaut, cette méthode
met la configuration dans l'attribut protégé ``$_config``.

Si vous avez besoin d'appeler des méthodes supplémentaires sur le transport
avant l'envoi, vous pouvez utiliser
:php:meth:`Cake\\Network\\Email\\Email::transportClass()` pour obtenir une
instance du transport. Exemple::

    $yourInstance = $Email->transport('your')->transportClass();
    $yourInstance->myCustomMethod();
    $Email->send();

Faciliter les Règles de Validation des Adresses
-----------------------------------------------

.. php:method:: emailPattern($pattern = null)

Si vous avez des problèmes de validation lors de l'envoi vers des adresses
non conformes, vous pouvez faciliter le patron utilisé pour valider les
adresses email. C'est parfois nécessaire quand il s'agit de certains
ISP Japonais::

    $email = new Email('default');

    // Relax le patron d'email, ainsi vous pouvez envoyer
    // vers des adresses non conformes
    $email->emailPattern($newPattern);


Envoyer des Messages Rapidement
===============================

Parfois vous avez besoin d'une façon rapide d'envoyer un email, et vous n'avez
pas particulièrement envie en même temps de définir un tas de configuration.
:php:meth:`Cake\\Network\Email\\Email::deliver()` est présent pour ce cas.

Vous pouvez créer votre configuration dans
:php:meth:`Cake\\Network\\Email\\Email::config()`, ou utiliser un
tableau avec toutes les options dont vous aurez besoin et utiliser
la méthode statique ``Email::deliver()``.
Exemple::

    Email::deliver('you@example.com', 'Subject', 'Message', ['from' => 'me@example.com']);

Cette méthode va envoyer un email à you@example.com, à partir de me@example.com
avec le sujet Subject et le contenu Message.

Le retour de ``deliver()`` est une instance de :php:class:`Cake\\Email\\Email`
avec l'ensemble des configurations. Si vous ne voulez pas envoyer l'email
maintenant, et souhaitez configurer quelques trucs avant d'envoyer, vous pouvez
passer le 5ème paramètre à false.

Le 3ème paramètre est le contenu du message ou un tableau avec les variables
(quand on utilise le contenu rendu).

Le 4ème paramètre peut être un tableau avec les configurations ou une chaîne de
caractères avec le nom de configuration dans ``Configure``.

Si vous voulez, vous pouvez passer les to, subject et message à null et faire
toutes les configurations dans le 4ème paramètre (en tableau ou en utilisant
``Configure``).
Vérifiez la liste des :ref:`configurations <email-configurations>` pour voir
toutes les configs acceptées.

Envoyer des Emails depuis CLI
=============================

Quand vous envoyez des emails à travers un script CLI (Shells, Tasks, ...),
vous devez définir manuellement le nom de domaine que Email doit utiliser.
Il sera utilisé comme nom d'hôte pour l'id du message (puisque il n'y a pas
de nom d'hôte dans un environnement CLI)::

    $Email->domain('www.example.org');
    // Resulte en ids de message comme ``<UUID@www.example.org>`` (valid)
    // au lieu de `<UUID@>`` (invalid)

Un id de message valide peut permettre à ce message de ne pas finir dans un
dossier de spam.

.. meta::
    :title lang=fr: Email
    :keywords lang=fr: envoyer mail,email emmetteur sender,envelope sender,classe php,database configuration,sending emails,meth,shells,smtp,transports,attributes,array,config,flexibilité,php email,nouvel email,sending email,models
