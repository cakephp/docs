Mailer
######

.. php:namespace:: Cake\Mailer

.. php:class:: Mailer(string|array|null $profile = null)

``Mailer`` est une classe utilitaire pour envoyer des emails. Avec cette classe,
vous pouvez envoyer des emails depuis n'importe endroit de votre application.

Utilisation basique
===================

Premièrement, vous devez vous assurer que la classe est chargée::

    use Cake\Mailer\Mailer;

Après avoir chargé ``Mailer``, vous pouvez envoyer un email de la façon
suivante::

    $mailer = new Mailer('default');
    $mailer->setFrom(['moi@example.com' => 'Mon Site'])
        ->setTo('toi@example.com')
        ->setSubject('À propos')
        ->send('Mon message');

Les méthodes setter de ``Mailer`` retournent l'instance de la classe, ce qui
fait que vous pouvez définir ses propriétés par un chaînage de méthodes.

``Mailer`` comporte plusieurs méthodes pour définir les destinataires -
``setTo()``, ``setCc()``, ``setBcc()``, ``addTo()``, ``addCc()`` et
``addBcc()``. La principale différence est que les trois premières méthodes vont
écraser ce que vous auriez déjà défini, tandis que les suivantes vont seulement
ajouter d'autres destinataires dans leurs champs respectifs::

    $mailer = new Mailer();
    $mailer->setTo('to@example.com', 'To Example');
    $mailer->addTo('to2@example.com', 'To2 Example');
    // Les destinataires de l'email sont: to@example.com et to2@example.com
    $mailer->setTo('test@example.com', 'ToTest Example');
    // Le destinataire de l'email est: test@example.com

Choisir l'émetteur
------------------

Quand on envoie des emails de la part d'une autre personne, il est généralement
souhaitable de définir l'émetteur original avec le header Sender. Vous pouvez le
faire en utilisant ``setSender()``::

    $mailer = new Mailer();
    $mailer->setSender('app@example.com', 'MyApp emailer');

.. note::

    Quand vous envoyez un mail de la part d'une autre personne, il est également
    préférable de définir l'émetteur de l'enveloppe . Cela lui évite de recevoir
    des messages en cas de problèmes de distribution du mail.

.. _email-configuration:

Configuration
=============

Les configurations des profils du Mailer et du transport d'emails sont définies
dans les fichiers de configuration de votre application. Les clés ``Email`` et
``MailerTransport`` définissent respectivement les configurations des profils du
mailer et du transport des emails. Pendant le bootstrap de l'application, les
paramètres de configuration sont repris de la classe ``Configure`` vers les classes
``Mailer`` et ``TransportFactory`` en utilisant ``setConfig()``. En définissant
des profils et des transports, vous pouvez alléger le code de votre application
de toutes les données de configuration, et éviter des duplications de code qui
vous compliqueraient la maintenance et le déploiement.

Pour charger une configuration prédéfinie, vous pouvez utiliser la méthode
``setProfile()`` ou la passer au constructeur de ``Mailer``::

    $mailer = new Mailer();
    $mailer->setProfile('default');

    // ou dans le constructeur::
    $mailer = new Mailer('default');

Plutôt que de passer une chaîne avec le nom d'une configuration prédéfinie, vous
pouvez aussi charger tout simplement un tableau d'options::

    $mailer = new Mailer();
    $mailer->setProfile(['from' => 'moi@example.org', 'transport' => 'transport_perso']);

    // ou dans le constructeur::
    $mailer = new Mailer(['from' => 'moi@example.org', 'transport' => 'transport_perso']);

.. _email-configurations:

Profils de Configurations
-------------------------

Le fait de définir des profils d'envoi vous permet de consolider les paramètres
habituels des emails dans des profils réutilisables. Votre application peut
avoir autant de profils que nécessaire. Voici les clés de configuration
utilisées:

- ``'from'``: Mailer ou un tableau d'expéditeur. Voir ``Mailer::setFrom()``.
- ``'sender'``: Mailer ou un tableau d'expéditeur réel. Voir
  ``Mailer::setSender()``.
- ``'to'``: Mailer ou un tableau de destinataires. Voir ``Mailer::setTo()``.
- ``'cc'``: Mailer ou un tableau de destinataires en copie. Voir
  ``Mailer::setCc()``.
- ``'bcc'``: Mailer ou un tableau de destinataires en copie cachée. Voir
  ``Mailer::setBcc()``.
- ``'replyTo'``: Mailer ou un tableau d'adresse de réponse. Voir
  ``Mailer::setReplyTo()``.
- ``'readReceipt'``: Adresse Mailer ou un tableau d'adresse pour recevoir un
  accusé de réception. Voir ``Mailer::setReadReceipt()``.
- ``'returnPath'``: Adresse Mailer ou un tableau d'adresse à laquelle écrire
  en cas d'erreur. Voir ``Mailer::setReturnPath()``.
- ``'messageId'``: ID du message de l'e-mail. Voir ``Mailer::setMessageId()``.
- ``'subject'``: Sujet du message. Voir ``Mailer::setSubject()``.
- ``'message'``: Contenu du message. Ne définissez pas ce champ si vous
  utilisez un contenu rendu par l'application.
- ``'priority'``: Nombre exprimant la priorité de l'email (généralement de 1 à
  5, 1 étant la priorité la plus haute).
- ``'headers'``: En-têtes à inclure. Voir ``Mailer::setHeaders()``.
- ``'viewRenderer'``: Si vous utilisez un contenu généré par l'application,
  définissez ici le nom de classe de la vue. Voir
  ``ViewBuilder::setClassName()``.
- ``'template'``: Si vous utilisez un contenu généré par l'application,
  définissez ici le nom du template. Voir ``Mailer::setTemplate()``.
- ``'theme'``: Thème utilisé pour le rendu du template. Voir
  ``Mailer::setTheme()``.
- ``'layout'``: Si vous utilisez un contenu généré par l'application, définissez
  ici le layout à rendre. Voir ``ViewBuilder::setTemplate()``.
- ``'autoLayout'``: Si vous voulez rendre un template sans layout, définissez ce
  champ à ``false``. Voir ``ViewBuilder::disableAutoLayout()``.
- ``'viewVars'``: Si vous utilisez un contenu généré par l'application,
  définissez ici le tableau contenant les variables devant être rendues dans la
  vue. Voir ``Mailer::setViewVars()``.
- ``'attachments'``: Liste des pièces jointes. Voir
  ``Mailer::setAttachments()``.
- ``'emailFormat'``: Format de l'email (html, text ou both). Voir
  ``Mailer::setEmailFormat()``.
- ``'transport'``: Nom de la configuration du transport. Voir
  :ref:`email-transport`.
- ``'log'``: Niveau de log pour la journalisation des headers et du message.
  ``true`` utilisera LOG_DEBUG. Voir :ref:`logging-levels`.
  Notez que les logs seront émis sous le scope nommé ``email``.
  Voir aussi :ref:`logging-scopes`.
- ``'helpers'``: Tableau de helpers utilisés dans le template de l'email.
  ``ViewBuilder::setHelpers()``/``ViewBuilder::addHelpers()``

.. note::

    Les valeurs des clés ci-dessus qui utilisent Mailer ou un tableau, telles
    que from, to, cc, etc, seront passées comme premier paramètre des méthodes
    correspondantes. L'équivalent de
    ``Mailer::setFrom('mon@example.com', 'Mon Site')`` pourrait être défini par
    ``'from' => ['mon@example.com' => 'Mon Site']`` dans votre configuration.

Définir les Headers
-------------------

Dans ``Mailer``, vous êtes libre de définir les headers que vous souhaitez.
N'oubliez pas d'ajouter le préfixe ``X-`` pour vos headers personnalisés.

Voir ``Mailer::setHeaders()`` et ``Mailer::addHeaders()``

Envoyer des Mails d'après un Template
-------------------------------------

Les mails sont souvent bien plus que de simples messages avec du texte. Pour
vous faciliter la vie, CakePHP propose d'envoyer des emails en utilisant la
:doc:`couche de rendu </views>` de CakePHP.

Les templates pour les emails se trouvent dans le dossier spécial
``templates/email`` de votre application. Les vues d'emails peuvent aussi
utiliser des layouts et des éléments, comme les vues normales::

    $mailer = new Mailer();
    $mailer
        ->setEmailFormat('html')
        ->setTo('bob@example.com')
        ->setFrom('app@domain.com')
        ->viewBuilder()
            ->setTemplate('bienvenue')
            ->setLayout('sympa');

    $mailer->deliver();

Ceci utilisera **templates/email/html/bienvenue.php** comme vue, et
**templates/layout/email/html/sympa.php** comme layout. Vous pouvez aussi
envoyer des emails templatés multipart::

    $mailer = new Mailer();
    $mailer
        ->setTemplate('bienvenue', 'sympa')
        ->setMailerFormat('both')
        ->setTo('bob@example.com')
        ->setFrom('app@domain.com')
        ->send();

    $mailer->deliver();

Ce qui utiliserait les fichiers de template suivants:

* **templates/email/text/bienvenue.php**
* **templates/layout/email/text/sympa.php**
* **templates/email/html/bienvenue.php**
* **templates/layout/email/html/sympa.php**

Quand vous envoyez des emails templatés, vous avez la possibilité d'envoyer en
``text``, ``html`` ou ``both``.

Vous pouvez définir toute la configuration se rapportant à la vue à partir du
*view builder* obtenu par ``Mailer::viewBuilder()``, comme vous le feriez dans
un controller.

Vous pouvez définir des variables de vue avec ``Mailer::setViewVars()``::

    $mailer = new Mailer('templated');
    $mailer->setViewVars(['value' => 12345]);

Ou bien vous pouvez utiliser les méthodes du *view builder*
``ViewBuilder::setVar()`` et ``ViewBuilder::setVars()``.

Dans votre template d'email, vous pouvez les utiliser ainsi::

    <p>Voici votre valeur: <b><?= $value; ?></b></p>

Vous pouvez aussi utiliser les helpers dans les emails, un peu comme vous le
faites dans des fichiers de template normaux. Seul :php:class:`HtmlHelper` est
chargé par défaut. Vous pouvez charger d'autres helpers en utilisant la méthode
``ViewBuilder::addHelpers()``::

    $mailer->viewBuilder()->addHelpers(['Html', 'Perso', 'Text']);

Quand vous ajoutez des helpers, assurez-vous d'inclure 'Html' sinon il sera
retiré des helpers chargés dans votre template d'email.

.. note::
    Dans les versions antérieures à 4.3.0, vous deviez utilisez ``setHelpers()``
    à la place.

Si vous voulez envoyer un email en utilisant des templates dans un plugin, vous
pouvez le faire en utilisant la :term:`syntaxe de plugin` qui doit vous être
familière::

    $mailer = new Mailer();
    $mailer->viewBuilder()->setTemplate('Blog.nouveau_commentaire');

Ceci utiliserait par exemple les templates du plugin Blog.

Dans certains cas, vous pouvez avoir besoin de substituer le template par défaut
fourni par les plugins. Vous pouvez le faire en utilisant les thèmes::

    $mailer->viewBuilder()
        ->setTemplate('Blog.nouveau_commentaire')
        ->setLayout('Blog.auto_message')
        ->setTheme('TestTheme');

Cela vous permet de remplacer le template `nouveau_commentaire` dans votre theme
sans modifier le plugin Blog. Le fichier de template devra être créé sous le
chemin suivant:
**templates/plugin/TestTheme/plugin/Blog/email/text/nouveau_commentaire.php**.

Envoyer des Pièces Jointes
==========================

.. php:method:: setAttachments($attachments)

Vous pouvez aussi rattacher des pièces jointes aux emails. Il y a quelques
formats différents selon le type de fichier vous avez, et la façon dont vous
voulez que les noms de fichiers apparaissent dans la boîte de réception du
client:

1. Tableau: ``$mailer->setAttachments(['/chemin/complet/vers/le/fichier.png'])``
   attacher ce fichier avec le nom fichier.png.
2. Tableau avec clé:
   ``$mailer->setAttachments(['photo.png' => '/chemin/un_hash.png'])`` va
   attacher un_hash.png avec le nom photo.png. Le destinataire verra photo.png,
   pas some_hash.png.
3. Tableaux imbriqués::

    $mailer->setAttachments([
        'photo.png' => [
            'file' => '/chemin/un_hash.png',
            'mimetype' => 'image/png',
            'contentId' => 'mon-id-unique'
        ]
    ]);

   Ceci attachera le fichier avec un mimetype différent et avec un content ID
   personnalisé (quand vous définissez le content ID, la pièce jointe est
   transformée en inline). Le mimetype et le contentId sont optionnels sous
   cette forme.

   3.1. Quand vous utilisez le ``contentId``, vous pouvez utiliser le fichier
   dans le corps HTML avec ``<img src="cid:mon-content-id">``.

   3.2. Vous pouvez utiliser l'option ``contentDisposition`` pour désactiver le
   header ``Content-Disposition`` pour une pièce jointe. C'est utile pour
   l'envoi d'invitations ical à des clients utilisant outlook.

   3.3 Au lieu de l'option ``file``, vous pouvez fournir les contenus de
   fichiers en tant que chaîne de caractères en utilisant l'option ``data``.
   Cela vous permet d'attacher des fichiers sans avoir besoin d'un chemin sur le
   disque.

Assouplir les Règles de Validation d'Adresses
---------------------------------------------

.. php:method:: setEmailPattern($pattern)

Si vous avez des problèmes de validation lors de l'envoi vers des adresses
considérées comme non conformes, vous pouvez assouplir le pattern utilisé pour
valider les adresses email. C'est parfois nécessaire quand il s'agit de certains
ISP Japonais::

    $mailer = new Mailer('default');

    // Assouplir le pattern d'email, de façon à pouvoir écrire
    // à des adresses non conformes.
    $mailer->setEmailPattern($newPattern);

Envoyer des Messages Rapidement
===============================

Parfois vous avez besoin d'un moyen rapide d'envoyer un email, et vous n'avez
pas particulièrement envie de définir une tonne de configuration juste pour
cela. :php:meth:`Cake\\Mailer\\Mailer::deliver()` est fait pour vous.

Vous pouvez créer votre configuration dans
:php:meth:`Cake\\Mailer\\Email::config()`, ou utiliser un tableau avec toutes
les options dont avez besoin, puis utiliser la méthode statique
``Mailer::deliver()``.
Exemple::

    Mailer::deliver('toi@example.com', 'Sujet', 'Message', ['from' => 'moi@example.com']);

Cette méthode enverra un email à toi@example.com, à partir de moi@example.com
avec le sujet "Sujet" et le contenu "Message".

La valeur de retour de ``deliver()`` est une instance
:php:class:`Cake\\Mailer\\Email` entièrement configurée. Si vous ne voulez pas
envoyer l'email tout de suite et souhaitez configurer encore certaines choses
avant de l'envoyer, vous pouvez définir le 5ème paramètre à ``false``.

Le 3ème paramètre est le contenu du message ou un tableau avec les variables
(quand vous utilisez un contenu généré par l'application).

Le 4ème paramètre peut être un tableau avec la configuration ou une chaîne de
caractères avec le nom d'une configuration figurant dans ``Configure``.

Si vous voulez, vous pouvez passer null pour les arguments *to*, *subject* et
*message*, et passer toutes les configurations dans le 4ème paramètre (en
tableau ou en utilisant ``Configure``).
Faites un tour par la liste des :ref:`configurations <email-configurations>`
pour connaître toutes les configs acceptées.

Envoyer des Emails en Ligne de Commande
=======================================

Quand vous envoyez des emails depuis un script CLI (Shells, Tasks, ...), vous
devez définir manuellement le nom de domaine à utiliser pour Mailer. Il sera
utilisé comme nom d'hôte pour l'id du message (puisqu'il n'y a pas de nom d'hôte
dans un environnement CLI)::

    $email->setDomain('www.example.org');
    // Envoie des ids de message tels que ``<UUID@www.example.org>`` (valide)
    // au lieu de `<UUID@>`` (invalide)

Un id de message valide peut permettre à ce message de ne pas finir dans les
spams.

Créer des Emails Réutilisables
==============================

Jusqu'à présent, nous avons vu comment utiliser la classe ``Mailer`` pour créer
et envoyer des emails. Mais la principale fonctionnalité d'un mailer est de vous
permettre de créer des emails réutilisables n'importe où dans votre application.
Ils peuvent aussi servir à contenir différentes configurations d'emails en un
seul et même endroit, ce qui vous aide à garder votre code DRY et à déplacer la
configuration des emails en dehors des autres parties de votre application.

Dans cet exemple, vous allez créer un ``Mailer`` qui contient des emails
dépendant des utilisateurs. Pour créer votre ``UserMailer``, créez un fichier
**src/Mailer/UserMailer.php**. Le contenu de ce fichier devra ressembler à ceci::

    namespace App\Mailer;

    use Cake\Mailer\Mailer;

    class UserMailer extends Mailer
    {
        public function welcome($user)
        {
            $this
                ->setTo($user->email)
                ->setSubject(sprintf('Bienvenue %s', $user->name))
                ->viewBuilder()
                    ->setTemplate('message_de_bienvenue', 'personnalisé'); // Par défaut le template utilisé a le même nom que la méthode.
        }

        public function resetPassword($user)
        {
            $this
                ->setTo($user->email)
                ->setSubject('Reset password')
                ->setViewVars(['token' => $user->token]);
        }
    }

Dans notre exemple, nous avons créé deux méthodes, une pour envoyer l'email de
bienvenue et l'autre pour envoyer un email de réinitialisation de mot de passe.
Chacune de ces méthodes reçoit une ``Entity`` ``User`` et utilise ses propriétés
pour configurer chacun des emails.

Vous pouvez maintenant utiliser votre ``UserMailer`` pour envoyer tous les
emails dépendant des utilisateurs, depuis n'importe quel endroit de votre
application. Par exemple, pour envoyer l'email de bienvenue, vous pouvez faire
la chose suivante::

    namespace App\Controller;

    use Cake\Mailer\MailerAwareTrait;

    class UsersController extends AppController
    {
        use MailerAwareTrait;

        public function register()
        {
            $user = $this->Users->newEmptyEntity();
            if ($this->request->is('post')) {
                $user = $this->Users->patchEntity($user, $this->request->getData())
                if ($this->Users->save($user)) {
                    $this->getMailer('User')->send('welcome', [$user]);
                }
            }
            $this->set('user', $user);
        }
    }

Si vous voulez complètement séparer l'envoi de l'email de bienvenue du code de
l'application, votre ``UserMailer`` peut écouter l'évènement
``Model.afterSave``. En utilisant l'évènement, vous pouvez séparer complètement
la logique d'envoi d'emails du reste de votre logique "utilisateurs".
Vous pourriez par exemple ajouter ceci à votre ``UserMailer``::

    public function implementedEvents()
    {
        return [
            'Model.afterSave' => 'onRegistration'
        ];
    }

    public function onRegistration(EventInterface $event, EntityInterface $entity, ArrayObject $options)
    {
        if ($entity->isNew()) {
            $this->send('welcome', [$entity]);
        }
    }

L'objet mailer sera ainsi enregistré en tant qu'écouteur (*listener*)
d'événement et la méthode ``onRegistration()`` sera appelée chaque fois que
l'événement ``Model.afterSave`` sera déclenché::

    // attache un gestionnaire d'événements sur Users
    $this->Users->getEventManager()->on($this->getMailer('User'));

.. note::

    Plus d'informations sur la façon d'enregistrer des écouteurs d'événements
    dans la documentation :ref:`registering-event-listeners`.

.. _email-transport:

Configurer les Transports
=========================

Les emails sont délivrés par des 'transports'. Divers transports vous permettent
d'envoyer des messages par la fonction ``mail()`` de PHP, par des serveurs SMTP,
voire pas du tout, ce qui est utile pour le débogage. La configuration des
transports vous permet de garder les données de configuration en-dehors du code
de votre application, et simplifie le déploiement puisque vous pouvez changer
facilement les données de configuration. Voici un exemple de configuration de
transport::

    // Dans config/app.php
    'EmailTransport' => [
        // Exemple de configuration de Mail
        'default' => [
            'className' => 'Mail',
        ],
        // Exemple de configuration SMTP
        'gmail' => [
            'host' => 'smtp.gmail.com',
            'port' => 587,
            'username' => 'mon@gmail.com',
            'password' => 'secret',
            'className' => 'Smtp',
            'tls' => true
        ]
    ],

Vous pouvez aussi configurer les transports pendant l'exécution, en utilisant
``TransportFactory::setConfig()``::

    use Cake\Mailer\TransportFactory;

    // Définit un transport SMTP
    TransportFactory::setConfig('gmail', [
        'host' => 'ssl://smtp.gmail.com',
        'port' => 465,
        'username' => 'mon@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp'
    ]);

Vous pouvez configurer des serveurs SMTP SSL, tels que GMail. Pour ce faire,
ajoutez le préfixe ``ssl://`` dans le nom d'hôte et configurez le numéro de port
de façon correspondante. Vous pouvez aussi activer le protocole SMTP TLS en
utilisant l'option ``tls``::

    use Cake\Mailer\TransportFactory;

    TransportFactory::setConfig('gmail', [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'mon@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp',
        'tls' => true
    ]);

La configuration ci-dessus active la communication TLS pour les emails.

Pour configurer votre mailer pour qu'il utilise un transport spécifique, vous
pouvez utiliser la méthode :php:meth:`Cake\\Mailer\\Mailer::setTransport()` ou
placer le transport dans votre configuration::

    // Utilise un transport nommé déjà configuré dans TransportFactory::setConfig()
    $mailer->setTransport('gmail');

    // Utilise un objet construit.
    $mailer->setTransport(new \Cake\Mailer\Transport\DebugTransport());

.. warning::
    Pour que cela fonctionne avec Google, vous devrez activer l'accès aux
    applications moins sécurisées:
    `Allowing less secure apps to access your account <https://support.google.com/accounts/answer/6010255>`__.

.. note::
    `Configuration SMTP Gmail <https://support.google.com/a/answer/176600?hl=en>`__.

.. note::
    Pour utiliser SSL et SMTP, SSL devra être configuré dans votre installation
    PHP.

Les options de configuration peuvent aussi être fournies en chaîne :term:`DSN`.
C'est utile quand vous travaillez avec des variables d'environnement ou des
fournisseurs :term:`PaaS`::

    TransportFactory::setConfig('default', [
        'url' => 'smtp://mon@gmail.com:secret@smtp.gmail.com:587?tls=true',
    ]);

Quand vous utilisez une chaîne DSN, vous pouvez définir d'autres paramètres ou
options en tant qu'arguments query string.

.. php:staticmethod:: drop($key)

Une fois configurés, les transports ne peuvent plus être modifiés. Pour modifier
un transport, vous devez d'abord le supprimer puis le reconfigurer.

Créer des Transports Personnalisés
----------------------------------

Vous pouvez créer vos propres transports pour des situations telles que l'envoi
d'emails par des services comme SendGrid, MailGun ou Postmark. Pour créer votre
transport, commencez par créer le fichier
**src/Mailer/Transport/ExampleTransport.php** (où 'Example' est le nom de votre
transport). Au départ, votre fichier doit ressembler à cela::

    namespace App\Mailer\Transport;

    use Cake\Mailer\AbstractTransport;
    use Cake\Mailer\Message;

    class ExampleTransport extends AbstractTransport
    {
        public function send(Message $message): array
        {
            // Faire quelque chose.
        }
    }

Vous devez implémenter la méthode ``send(Message $message)`` avec votre propre
logique.

Envoyer des Emails sans utiliser Mailer
=======================================

Le ``Mailer`` est une classe à haut niveau d'abstraction, qui agit commme un
pont entre les classes ``Cake\Mailer\Message``, ``Cake\Mailer\Renderer`` et
``Cake\Mailer\AbstractTransport`` pour configuer les emails avec une interface
fluide.

Si vous voulez, vous pouvez aussi utiliser ces classes directement avec le
Mailer.

Par exemple::

    $render = new \Cake\Mailer\Renderer();
    $render->viewBuilder()
        ->setTemplate('perso')
        ->setLayout('brillant');

    $message = new \Cake\Mailer\Message();
    $message
        ->setFrom('admin@cakephp.org')
        ->setTo('user@foo.com')
        ->setBody($render->render());

    $transport = new \Cake\Mailer\Transport\MailTransport();
    $result = $transport->send($message);

Vous pouvez aussi écarter le ``Renderer`` et définir directement le corps du
message avec les méthodes ``Message::setBodyText()`` et
``Message::setBodyHtml()``.

.. _email-testing:

Tester les Mailers
==================

Pour tester les mailers, ajoutez ``Cake\TestSuite\EmailTrait`` à vos cas de
test. Le ``MailerTrait`` utilise les crochets de PHPUnit pour remplacer les
transports d'emails de votre application par un proxy qui intercepte les
messages et vous permet de faire des assertions sur le mail qui aurait été
envoyé.

Pour commencer à tester les emails, ajoutez le trait à votre cas de test, et
chargez les routes au cas où vos emails auraient besoin de générer des URL::

    namespace App\Test\TestCase\Mailer;

    use App\Mailer\WelcomeMailer;
    use App\Model\Entity\User;

    use Cake\TestSuite\EmailTrait;
    use Cake\TestSuite\TestCase;

    class WelcomeMailerTestCase extends TestCase
    {
        use EmailTrait;

        public function setUp(): void
        {
            parent::setUp();
            $this->loadRoutes();
        }
    }

Supposons maintenant que nous ayons un mailer qui consiste à envoyer des emails
de bienvenue quand un nouvel utilisateur s'inscrit. Nous voulons vérifier que le
sujet et le corps du message contiennent le nom de l'utilisateur::

    // dans notre classe WelcomeMailerTestCase.
    public function testName()
    {
        $user = new User([
            'name' => 'Alice Alittea',
            'email' => 'alice@example.org',
        ]);
        $mailer = new WelcomeMailer();
        $mailer->send('welcome', [$user]);

        $this->assertMailSentTo($user->email);
        $this->assertMailContainsText('Bonjour ' . $user->name);
        $this->assertMailContainsText('Bienvenue dans CakePHP!');
    }

Méthodes d'Assertion
--------------------

Le trait ``Cake\TestSuite\EmailTrait`` fournit les assertions suivantes::

    // Un nombre précis d'emails ont été envoyés
    $this->assertMailCount($count);

    // Aucun email n'a été envoyé
    $this->assertNoMailSent();

    // Un email a été envoyé à une certaine adresse
    $this->assertMailSentTo($address);

    // Un email a été envoyé par une certaine adresse
    $this->assertMailSentFrom($emailAddress);
    $this->assertMailSentFrom([$emailAddress => $displayName]);

    // Un email contient un certain contenu
    $this->assertMailContains($contents);

    // Un email contient un certain contenu HTML
    $this->assertMailContainsHtml($contents);

    // Un email contient un certain contenu en texte brut
    $this->assertMailContainsText($contents);

    // Un email contient une certaine valeur dans un getter de Message (par exemple "subject")
    $this->assertMailSentWith($expected, $parameter);

    // L'email à l'index spécifié a été envoyé à une certaine adresse
    $this->assertMailSentToAt($at, $address);

    // L'email à l'index spécifié a été envoyé depuis une certaine adresse
    $this->assertMailSentFromAt($at, $address);

    // L'email à l'index spécifié contient un certain contenu
    $this->assertMailContainsAt($at, $contents);

    // L'email à l'index spécifié contient un certain contenu HTML
    $this->assertMailContainsHtmlAt($at, $contents);

    // L'email à l'index spécifié contient un certain contenu en texte brut
    $this->assertMailContainsTextAt($at, $contents);

    // Un email contient une certaine pièce jointe
    $this->assertMailContainsAttachment('test.png');

    // L'email à l'index spécifié contient une certaine valeur dans un getter de Message (par example, "cc")
    $this->assertMailSentWithAt($at, $expected, $parameter);

    // Le sujet d'un email contient un certain texte
    $this->assertMailSubjectContains('Offre gratuite');

    // L'email à l'index spécifié a un sujet qui contient un certain texte
    $this->assertMailSubjectContainsAt(1, 'Offre gratuite');

.. meta::
    :title lang=fr: Mailer
    :keywords lang=fr: envoyer mail,email emmetteur sender,envelope sender,classe php,database configuration,sending emails,meth,shells,smtp,transports,attributes,array,config,flexibilité,php email,nouvel email,sending email,models
