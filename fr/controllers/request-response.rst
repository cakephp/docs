Les Objets Request & Response
#############################

.. php:namespace:: Cake\Http

Les objets ``ServerRequest`` et ``Response`` fournissent une abstraction autour de la
requête et des réponses HTTP. L'objet ``ServerRequest`` dans CakePHP vous permet de
faire une introspection de la requête entrante, tandis que l'objet ``Response``
vous permet de créer sans effort des réponses HTTP à partir de vos controllers.

.. index:: $this->request
.. _cake-request:

ServerRequest
=============

.. php:class:: ServerRequest

``ServerRequest`` est l'objet requête utilisé par défaut dans CakePHP. Il
centralise un certain nombre de fonctionnalités pour interroger et interagir
avec les données demandées. Pour chaque requête, une ``ServerRequest`` est
créée et passée en référence aux différentes couches de l'application que la
requête de données utilise. Par défaut la requête est assignée à
``$this->request``, et est disponible dans les Controllers, Cells, Vues et
Helpers. Vous pouvez aussi y accéder dans les Components en utilisant la
référence du controller. Certaines des tâches que ``ServerRequest``
permet sont les suivantes:

* Transformer les tableaux GET, POST, et FILES en structures de données avec
  lesquelles vous êtes familiers.
* Fournir une introspection de l'environnement se rapportant à la demande.
  Des informations comme les d'en-têtes (headers) envoyés, l'adresse IP du client
  et les informations des sous-domaines/domaines sur lesquels le serveur de
  l'application tourne.
* Fournit un accès aux paramètres de la requête à la fois en tableaux indicés
  et en propriétés d'un objet.

L'objet ServerRequest de CakePHP implémente `l'interface
PSR-7 ServerServerRequestInterface <https://www.php-fig.org/psr/psr-7/>`_ facilitant
l'utilisation des librairies en-dehors de CakePHP.

Paramètres de la Requête
------------------------

``ServerRequest`` propose les paramètres de routing avec la méthode ``getParam()``::

    $controllerName = $this->request->getParam('controller');

Pour obtenir tous les paramètres de routage sous forme de tableau, utilisez getAttribute ()::

    $parameters = $this->request->getAttribute('params');

Tous les éléments de route :ref:`route-elements` sont accessibles à travers
cette interface.

En plus des éléments de routes :ref:`route-elements`, vous avez souvent besoin
d'accéder aux arguments passés :ref:`passed-arguments`. Ceux-ci sont aussi tous
les deux disponibles dans l'objet ``request``::

    // Arguments passés
    $passedArgs = $this->request->getParam('pass');

Tous vous fournissent un accès aux arguments passés. Il y a de nombreux
paramètres importants et utiles que CakePHP utilise en interne qu'on peut aussi
trouver dans les paramètres de routing:

* ``plugin`` Le plugin gérant la requête. Aura une valeur nulle quand il n'y a
  pas de plugins.
* ``controller`` Le controller gérant la requête courante.
* ``action`` L'action gérant la requête courante.
* ``prefix`` Le préfixe pour l'action courante. Voir :ref:`prefix-routing` pour
  plus d'informations.

Accéder aux Paramètres Querystring
----------------------------------

.. php:method:: getQuery($name, $default = null)

Les paramètres Querystring peuvent être lus en utilisant la méthode ``getQuery()``::

    // l'URL est /posts/index?page=1&sort=title
    $page = $this->request->getQuery('page');

Vous pouvez soit directement accéder à la propriété demandée, soit vous pouvez
utiliser ``getQuery()`` pour lire l'URL requêtée sans erreur. Toute clé qui
n'existe pas va retourner ``null``::

    $foo = $this->request->getQuery('valeur_qui_n_existe_pas');
    // $foo === null

    // Vous pouvez également définir des valeurs par défaut
    $foo = $this->request->getQuery('n_existe_pas', 'valeur par défaut');

Si vous souhaitez accéder à tous les paramètres de requête, vous pouvez utiliser
``getQueryParams()``::

    $query = $this->request->getQueryParams();

Données du Corps de la Requête
------------------------------

.. php:method:: getData($name, $default = null)

Toutes les données POST sont accessibles en utilisant
:php:meth:`Cake\\Http\\ServerRequest::getData()`. Par exemple::

    // Un input avec un attribut de nom égal à 'title' est accessible via
    $title = $this->request->getData('title');

Vous pouvez utiliser des noms séparés par des points pour accéder aux données imbriquées. Par exemple::

    $value = $this->request->getData('adresse.nom_de_rue');

Pour toute clé qui n'existe pas, la valeur par ``$default`` sera retournée::

    $foo = $this->request->getData('Valeur.qui.n.existe.pas');
    // $foo == null

Vous pouvez également utiliser :ref:`body-parser-middleware` pour analyser le corps de la requête de différents
types de contenu dans un tableau de sortie, de sorte qu'il soit accessible via ``ServerRequest::getData()``.

Si vous souhaitez accéder à tous les paramètres de requête, vous pouvez utiliser ``getQueryParams()``::

    $query = $this->request->getQueryParams();

.. _request-file-uploads:

Envoyer des fichiers
--------------------

Les fichiers téléchargés sont accessibles via les données du corps de la requête, en utilisant
la méthode :php:meth:`Cake\\Http\\ServerRequest::getData()` décrite ci-dessus. Par exemple,
un fichier correspondant au nom ``attachment``, peut
être accédé comme ceci::

    $attachment = $this->request->getData('attachment');

Par défaut, les téléchargements de fichiers sont représentés dans les données de requête comme des objets
qui implémentent
`\\Psr\\Http\\Message\\UploadedFileInterface <https://www.php-fig.org/psr/psr-7/#16-uploaded-files>`__. Dans l'actuelle
implémentation, la variable ``$attachment`` dans l'exemple ci-dessus contiendrait par défaut une instance de
``\Laminas\Diactoros\UploadedFile``.

L'accès aux détails du fichier téléchargé est assez simple, voici comment obtenir les mêmes données que celles
fournies par le tableau de téléchargement de fichier des anciennes versions de cakePHP::

    $name = $attachment->getClientFilename();
    $type = $attachment->getClientMediaType();
    $size = $attachment->getSize();
    $tmpName = $attachment->getStream()->getMetadata('uri');
    $error = $attachment->getError();

Le déplacement du fichier téléchargé de son emplacement temporaire vers l'emplacement cible souhaité ne nécessite pas
d'accéder manuellement au fichier temporaire, à la place cela peut être facilement fait en utilisant les méthodes
``moveTo()`` des objets::

   $attachment->moveTo($targetPath);

Dans un environnement HTTP, la méthode ``moveTo()`` validera automatiquement si le fichier est un fichier téléchargé,
et lancera une exception si nécessaire. Dans un environnement CLI, où le concept de téléchargement de fichiers
n'existe pas, il permettra de déplacer le fichier que vous avez référencé indépendamment de ses origines,
ce qui rend possible le test des téléchargements de fichiers.

Pour revenir à l'utilisation des tableaux de téléchargement de fichiers des versions antérieures, définissez la valeur
de configuration ``App.uploadedFilesAsObjects`` à ``false``, par exemple dans votre fichier ``config/app.php``::


    return [
        // ...
        'App' => [
            // ...
            'uploadedFilesAsObjects' => false,
        ],
        // ...
    ];

Avec l'option désactivée, les téléchargements de fichiers sont représentés dans les données de la requête sous
forme de tableaux, avec une structure normalisée qui reste la même y compris pour pour les entrées/noms imbriqués,
ce qui est différent de la façon dont PHP les représente dans la variable ``$ _FILES``
(reportez-vous au `manuel PHP <https://www.php.net/manual/en/features.file-upload.php>` __ pour plus d'informations),
c'est-à-dire que la valeur ``$attachment`` ressemblerait à quelque chose comme ceci::

    [
        'name' => 'attachment.txt',
        'type' => 'text/plain',
        'size' => 123,
        'tmp_name' => '/tmp/hfz6dbn.tmp'
        'error' => 0
    ]

.. tip::

    Les fichiers téléchargés sont également accessibles en tant qu'objets séparément des données de requête via les
    méthodes :php:meth:`Cake\\Http\\ServerRequest::getUploadedFile()` et
    :php:meth:`Cake\\Http\\ServerRequest::getUploadedFiles()`. Ces méthodes renverront toujours des objets,
    indépendamment de la configuration ``App.uploadedFilesAsObjects``.


.. php:method:: getUploadedFile($path)

Renvoie le fichier téléchargé à un chemin spécifique. Le chemin utilise la même syntaxe de point (dot) que la
méthode :php:meth:`Cake\\Http\\ServerRequest::getData()`::

    $attachment = $this->request->getUploadedFile('attachment');

Contrairement à :php:meth:`Cake\\Http\\ServerRequest::getData()`,
:php:meth:`Cake\\Http\\ServerRequest::getUploadedFile()` ne renvoie des données que lorsqu'un téléchargement de fichier
réel existe pour le chemin donné, s'il existe des données de corps de requête régulières, non liées à un fichier,
correspondant au chemin donné, alors cette méthode retournera ``null``, comme elle le ferait pour tout chemin
inexistant.

.. php:method:: getUploadedFiles()

Renvoie tous les fichiers téléchargés dans une structure de tableau normalisée. Pour l'exemple ci-dessus avec le
nom d'entrée de fichier ``attachement``, la structure ressemblerait à::

    [
          'attachment' => object(Laminas\Diactoros\UploadedFile) {
              // ...
          }
    ]

.. php:method:: withUploadedFiles(array $files)

Cette méthode définit les fichiers téléchargés de l'objet de requête, elle accepte un tableau d'objets qui implémentent
`\\Psr\\Http\\Message\\UploadedFileInterface <https://www.php-fig.org/psr/psr-7/#16-uploaded-files>`__. Elle va
remplacer tous les fichiers téléchargés éventuellement existants::

    $files = [
        'MyModel' => [
            'attachment' => new \Laminas\Diactoros\UploadedFile(
                $streamOrFile,
                $size,
                $errorStatus,
                $clientFilename,
                $clientMediaType
            ),
            'anotherAttachment' => new \Laminas\Diactoros\UploadedFile(
                '/tmp/hfz6dbn.tmp',
                123,
                \UPLOAD_ERR_OK,
                'attachment.txt',
                'text/plain'
            ),
        ],
    ];

    $this->request = $this->request->withUploadedFiles($files);

.. note::

    Les fichiers téléchargés qui ont été ajoutés à la demande via cette méthode ne seront *pas* disponibles
    dans les données du corps de la requête, c'est-à-dire que vous ne pouvez pas les récupérer via
    :php:meth:`Cake\\Http\\ServerRequest::getData()`! Si vous en avez besoin également dans les données de la requête,
    vous devez les définir via :php:meth:`Cake\\Http\\ServerRequest::withData()` ou
    :php:meth:`Cake\\Http\\ServerRequest::withParsedBody()`.

Accéder aux Données PUT, PATCH ou DELETE
----------------------------------------

.. php:method:: input($callback, [$options])

Quand vous construisez des services REST, vous acceptez souvent des données
requêtées sur des requêtes ``PUT`` et ``DELETE``. Toute donnée de corps de
requête ``application/x-www-form-urlencoded`` va automatiquement être parsée et
définie dans ``$this->data`` pour les requêtes ``PUT`` et ``DELETE``. Si vous
acceptez les données JSON ou XML, regardez la section ci-dessous pour voir
comment vous pouvez accéder aux corps de ces requêtes.

Lorsque vous accédez aux données d'entrée, vous pouvez les décoder avec une
fonction optionnelle. Cela peut être utile quand vous devez interagir avec du
contenu de requête XML ou JSON. Les paramètres supplémentaires pour la fonction
de décodage peuvent être passés comme arguments à ``input()``::

    $jsonData = $this->request->input('json_decode');

Variables d'Environnement (à partir de $_SERVER et $_ENV)
---------------------------------------------------------

.. php:method:: env($key, $value = null)

``ServerRequest::env()`` est un wrapper pour la fonction globale ``env()`` et agit
comme un getter/setter pour les variables d'environnement sans avoir à modifier
les variables globales ``$_SERVER`` et ``$_ENV``::

    // Obtenir l'host
    $host = $this->request->env('HTTP_HOST');

    // Définir une valeur, généralement utile pour les tests.
    $this->request->env('REQUEST_METHOD', 'POST');

Pour accéder à toutes les variables d'environnement dans une requête, utilisez
``getServerParams()``::

    $env = $this->request->getServerParams();

Données XML ou JSON
-------------------

Les applications employant :doc:`/development/rest` échangent souvent des
données dans des corps de requête post non encodés en URL. Vous pouvez lire les données
entrantes dans n'importe quel format en utilisant
:php:meth:`~Cake\\Http\\ServerRequest::input()`. En fournissant une fonction de
décodage, vous pouvez recevoir le contenu dans un format déserializé::

    // Obtenir les données encodées JSON soumises par une action PUT/POST
    $jsonData = $this->request->input('json_decode');

Certaines méthodes de desérialization requièrent des paramètres supplémentaires
quand elles sont appelées, comme le paramètre de type 'comme tableau' de
``json_decode``. Si vous voulez convertir du XML en objet DOMDocument,
:php:meth:`~Cake\\Http\\ServerRequest::input()` supporte aussi le passage de
paramètres supplémentaires::

    // Obtenir les données encodées en XML soumises avec une action PUT/POST
    $data = $this->request->input('Cake\Utility\Xml::build', ['return' => 'domdocument']);

Informations du Chemin
----------------------

L'objet ``ServerRequest`` fournit aussi des informations utiles sur les chemins dans
votre application. Les attributs ``base`` et ``webroot`` sont utiles pour
générer des URLs et déterminer si votre application est ou n'est pas dans un
sous-dossier. Les attributs que vous pouvez utiliser sont::

    // Suppose que la requête URL courante est /subdir/articles/edit/1?page=1

    // Contient /subdir/articles/edit/1?page=1
    $here = $request->getRequestTarget();

    // Contient /subdir
    $base = $request->getAttribute('base');

    // Contient /subdir/
    $base = $request->getAttribute('webroot');

.. _check-the-request:

Vérifier les Conditions de la Requête
-------------------------------------

.. php:method:: is($type, $args...)

L'objet ``ServerRequest`` fournit une façon d'inspecter différentes conditions de la
requête. En utilisant la méthode ``is()``, vous pouvez vérifier un
certain nombre de conditions, ainsi qu'inspecter d'autres critères de la requête
spécifique à l'application::

    $isPost = $this->request->is('post');

Vous pouvez aussi étendre les détecteurs de la requête qui sont disponibles, en
utilisant :php:meth:`Cake\\Http\\ServerRequest::addDetector()` pour créer de
nouveaux types de détecteurs. Il y a différents types de détecteurs que
vous pouvez créer:

* Comparaison avec valeur d'environnement - Compare l'égalité de la valeur
  extraite à partir de :php:func:`env()` avec la valeur fournie.
* Comparaison de la valeur d'en-tête - Si l'en-tête spécifié existe avec la
   valeur spécifiée, la fonction appelable renvoie true.
* Comparaison de valeur avec motif - Vous permet de comparer la valeur
  extraite de :php:func:`env()` avec une expression régulière.
* Comparaison basée sur les options -  Utilise une liste d'options pour créer
  une expression régulière. Les appels suivants pour ajouter un détecteur
  d'option déjà défini, vont fusionner les options.
* Les détecteurs de Callback - Vous permettent de fournir un type 'callback'
  pour gérer la vérification. Le callback va recevoir l'objet ``ServerRequest`` comme
  seul paramètre.

.. php:method:: addDetector($name, $options)

Quelques exemples seraient::

    // Ajouter un détecteur d'environnement.
    $this->request->addDetector(
        'post',
        ['env' => 'REQUEST_METHOD', 'value' => 'POST']
    );

    // Ajouter un détecteur de valeur avec motif.
    $this->request->addDetector(
        'iphone',
        ['env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i']
    );

    // Ajouter un détecteur d'options
    $this->request->addDetector('internalIp', [
        'env' => 'CLIENT_IP',
        'options' => ['192.168.0.101', '192.168.0.100']
    ]);

    // Ajouter un détecteur d'en-tête avec comparaison de valeurs
    $this->request->addDetector('fancy', [
        'env' => 'CLIENT_IP',
        'header' => ['X-Fancy' => 1]
    ]);

    // Ajouter un détecteur d'en-tête avec comparaison appelable
    $this->request->addDetector('fancy', [
        'env' => 'CLIENT_IP',
        'header' => ['X-Fancy' => function ($value, $header) {
            return in_array($value, ['1', '0', 'yes', 'no'], true);
        }]
    ]);

    // Ajouter un détecteur de callback. Doit être un callable valide.
    $this->request->addDetector(
        'awesome',
        function ($request) {
            return $request->getParam('awesome');
        }
    );

    // Ajouter un détecteur qui utilise des arguments supplémentaires.
    $this->request->addDetector(
        'csv',
        [
            'accept' => ['text/csv'],
            'param' => '_ext',
            'value' => 'csv',
        ]
    );

Il y a plusieurs détecteurs intégrés que vous pouvez utiliser:

* ``is('get')`` Vérifie si la requête courante est un GET.
* ``is('put')`` Vérifie si la requête courante est un PUT.
* ``is('patch')`` Vérifie si la requête courante est un PATCH.
* ``is('post')`` Vérifie si la requête courante est un POST.
* ``is('delete')`` Vérifie si la requête courante est un DELETE.
* ``is('head')`` Vérifie si la requête courante est un HEAD.
* ``is('options')`` Vérifie si la requête courante est OPTIONS.
* ``is('ajax')`` Vérifie si la requête courante vient d'un
  X-Requested-With = XMLHttpRequest.
* ``is('ssl')`` Vérifie si la requête courante est via SSL.
* ``is('flash')`` Vérifie si la requête courante a un User-Agent de Flash.
* ``is('json')`` Vérifie si la requête a l'extension 'json' ajoutée et si elle
  accepte le mimetype 'application/json'.
* ``is('xml')`` Vérifie si la requête a l'extension 'xml' ajoutée et si elle
  accepte le mimetype 'application/xml' ou 'text/xml'.

``ServerRequest`` inclut aussi des méthodes comme
:php:meth:`Cake\\Http\\ServerRequest::domain()`,
:php:meth:`Cake\\Http\\ServerRequest::subdomains()`
et :php:meth:`Cake\\Http\\ServerRequest::host()` qui facilitent la vie des
applications avec sous-domaines.


Données de Session
------------------

Pour accéder à la session pour une requête donnée, utilisez la méthode ``getSession()`` ou l'attribut
``session``::

    $session = $this->request->getSession();
    $session = $this->request->getAttribute('session');

    $userName = $session->read('Auth.User.name');

Pour plus d'informations, consultez la documentation
:doc:`/development/sessions` sur la façon d'utiliser l'objet ``Session``.

Hôte et Nom de Domaine
----------------------

.. php:method:: domain($tldLength = 1)

Retourne le nom de domaine sur lequel votre application tourne::

    // Affiche 'example.org'
    echo $request->domain();

.. php:method:: subdomains($tldLength = 1)

Retourne un tableau avec les sous-domaines sur lequel votre application tourne::

    // Retourne ['my', 'dev'] pour 'my.dev.example.org'
    $subdomains = $request->subdomains();

.. php:method:: host()

Retourne l'hôte sur lequel votre application tourne::

    // Affiche 'my.dev.example.org'
    echo $request->host();

Lire la Méthode HTTP
--------------------

.. php:method:: getMethod()

Retourne le type de méthode HTTP avec lequel la requête a été faite::

    // Affiche POST
    echo $request->getMethod();


Restreindre les Méthodes HTTP qu'une Action Accepte
---------------------------------------------------

.. php:method:: allowMethod($methods)

Définit les méthodes HTTP autorisées. Si elles ne correspondent pas, elle
va lancer une ``MethodNotAllowedException``. La réponse 405 va inclure
l'en-tête ``Allow`` nécessaire avec les méthodes passées::

    public function delete()
    {
        // Accepter uniquement les demandes POST et DELETE
        $this->request->allowMethod(['post', 'delete']);
        ...
    }

Lire les en-têtes HTTP
----------------------

Ces méthodes vous permettent d'accéder à n'importe quel en-tête ``HTTP_*`` qui
a été utilisé dans la requête. Par exemple::

    // Récupère le header dans une chaîne
    $userAgent = $this->request->getHeaderLine('User-Agent');

    // Récupère un tableau contenant toutes les valeurs.
    $acceptHeader = $this->request->getHeader('Accept');

    // Vérifie l'existence d'un header
    $hasAcceptHeader = $this->request->hasHeader('Accept');


Du fait que certaines installations d'Apache ne rendent pas le header
``Authorization`` accessible, CakePHP le rend disponible via des méthodes
spécifiques.

.. php:method:: referer($local = true)

Retourne l'adresse référente de la requête.

.. php:method:: clientIp()

Retourne l'adresse IP du visiteur.

Faire Confiance aux Headers de Proxy
------------------------------------

Si votre application est derrière un load balancer ou exécutée sur un service
cloud, vous voudrez souvent obtenir l'hôte de load balancer, le port et le
schéma dans vos requêtes. Souvent les load balancers vont aussi envoyer
des en-têtes ``HTTP-X-Forwarded-*`` avec les valeurs originales. Les en-têtes
forwardés ne seront pas utilisés par CakePHP directement. Pour que l'objet
request utilise les en-têtes, définissez la propriété ``trustProxy`` à
``true``::

    $this->request->trustProxy = true;

    // Ces méthodes utiliseront maintenant les en-têtes du proxy.
    $port = $this->request->port();
    $host = $this->request->host();
    $scheme = $this->request->scheme();
    $clientIp = $this->request->clientIp();

Une fois que les proxys sont approuvés, la méthode ``clientIp()`` utilisera la *dernière*
adresse IP dans l'en-tête ``X-Forwarded-For``. Si votre application est derrière
plusieurs proxies, vous pouvez utiliser ``setTrustedProxies()`` pour définir les adresses IP
des proxies sous votre contrôle::

    request->setTrustedProxies(['127.1.1.1', '127.8.1.3']);

Une fois les proxys approuvés, ``clientIp()`` utilisera la première adresse IP de
l'en-tête ``X-Forwarded-For`` à condition que ce soit la seule valeur qui ne provienne pas
d'un proxy approuvé.

Vérifier les En-têtes Acceptés
------------------------------

.. php:method:: accepts($type = null)

Trouve les types de contenu que le client accepte ou vérifie s'il accepte un
type particulier de contenu.

Récupère tous les types::

    $accepts = $this->request->accepts();

Vérifie pour un unique type::

    $acceptsJson = $this->request->accepts('application/json');

.. php:staticmethod:: acceptLanguage($language = null)

Obtenir toutes les langues acceptées par le client, ou alors vérifier si une
langue spécifique est acceptée.

Obtenir la liste des langues acceptées::

    $acceptsLanguages = $this->request->acceptLanguage();

Vérifier si une langue spécifique est acceptée::

    $acceptsFrench = $this->request->acceptLanguage('fr-fr');

.. _request-cookies:

Lire des Cookies
----------------

Les cookies de la requête peuvent être lus à travers plusieurs méthodes::

    // Récupère la valeur du cookie, ou null si le cookie n'existe pas
    $rememberMe = $this->request->getCookie('remember_me');

    // Lit la valeur ou retourne le défaut (qui est 0 ici)
    $rememberMe = $this->request->getCookie('remember_me', 0);

    // Récupère tous les cookies dans un tableau
    $cookies = $this->request->getCookieParams();

    // Récupère une instance de CookieCollection
    $cookies = $this->request->getCookieCollection()

Référez-vous à la documentation de :php:class:`Cake\\Http\\Cookie\\CookieCollection`
pour savoir comment travailler avec les collections de cookies.

Fichiers uploadés
-----------------

Les requêtes exposent les données du fichier téléchargé dans ``getData()` ou
``getUploadedFiles()`` comme objets implémentant l'interface``UploadedFileInterface``::

    // Récupère une liste des objets UploadedFile
    $files = $request->getUploadedFiles();

    // Lire les données du fichier.
    $files[0]->getStream();
    $files[0]->getSize();
    $files[0]->getClientFileName();

    // Déplacer le fichier.
    $files[0]->moveTo($targetPath);


Manipuler les URIs
------------------

Les requêtes contiennent un objet URI, qui contient des méthodes pour interagir avec l'URI demandée::

    // Récupère l'URI
    $uri = $request->getUri();

    // Extrait les données de l'URI.
    $path = $uri->getPath();
    $query = $uri->getQuery();
    $host = $uri->getHost();

.. index:: $this->response

Response
========

.. php:class:: Response

:php:class:`Cake\\Http\\Response` est la classe de réponse par défaut dans
CakePHP. Elle encapsule un nombre de fonctionnalités et de caractéristiques
pour la génération de réponses HTTP dans votre application. Elle aide aussi à
tester des objets factices (mocks/stubs), vous permettant d'inspecter les
en-têtes qui vont être envoyés.
:php:class:`Cake\\Http\\ServerRequest`, :php:class:`Cake\\Http\\Response`
consolide un certain nombre de méthodes qu'on pouvait trouver avant dans
:php:class:`Controller`,
:php:class:`RequestHandlerComponent` et :php:class:`Dispatcher`. Les anciennes
méthodes sont dépréciées en faveur de l'utilisation de
:php:class:`Cake\\Http\\Response`.

``Response`` fournit une interface pour envelopper les tâches de réponse
communes liées, telles que:

* Envoyer des en-têtes pour les redirections.
* Envoyer des en-têtes de type de contenu.
* Envoyer n'importe quel en-tête.
* Envoyer le corps de la réponse.

Gérer les Types de Contenu
--------------------------

.. php:method:: withType($contentType = null)

Vous pouvez contrôler le Content-Type des réponses de votre application en
utilisant :php:meth:`Cake\\Http\\Response::withType()`. Si votre application a
besoin de gérer les types de contenu qui ne sont pas construits dans Response,
vous pouvez faire correspondre ces types avec ``setTypeMap()`` comme ceci::

    // Ajouter un type vCard
    $this->response->setTypeMap('vcf', ['text/v-card']);

    // Configurer la réponse de Type de Contenu pour vcard.
    $this->response = $this->response->withType('vcf');

Habituellement, vous voudrez faire correspondre des types de contenu
supplémentaires dans le callback :php:meth:`~Controller::beforeFilter()` de
votre controller afin que vous puissiez tirer parti de la fonctionnalité de commutation
automatique de vue de :php:class:`RequestHandlerComponent`, si vous l'utilisez.

.. _cake-response-file:

Envoyer des fichiers
--------------------

.. php:method:: withFile($path, $options = [])

Il y a des moments où vous souhaitez envoyer des fichiers en réponse à vos demandes.
Vous pouvez accomplir cela en utilisant :php:meth:`Cake\\Http\\Response::withFile()`::

    public function sendFile($id)
    {
        $file = $this->Attachments->getFile($id);
        $response = $this->response->withFile($file['path']);
        // Renvoie la réponse pour empêcher le contrôleur d'essayer
        // de rendre une vue
        return $response;
    }

Comme indiqué dans l'exemple ci-dessus, vous devez transmettre le chemin du fichier à la méthode.
CakePHP enverra un en-tête de type de contenu approprié s'il s'agit d'un type de fichier connu répertorié
dans `Cake\\Http\\Response::$_mimeTypes`. Vous pouvez ajouter de nouveaux types avant d'appeler
:php:meth:`Cake\\Http\\Response::withFile()` en utilisant la méthode
:php:meth:`Cake\\Http\\Response::withType()`.

Si vous le souhaitez, vous pouvez également forcer le téléchargement d'un fichier
au lieu de l'afficher dans le navigateur en spécifiant les options::

    $response = $this->response->withFile(
        $file['path'],
        ['download' => true, 'name' => 'foo']
    );

Les options prises en charge sont:

name
     Le nom vous permet de spécifier un autre nom de fichier à envoyer
     l'utilisateur.
download
     Une valeur booléenne indiquant si les en-têtes doivent être définis pour
     forcer le téléchargement.

Envoyer une Chaîne de Caractères comme Fichier
----------------------------------------------

Vous pouvez répondre avec un fichier qui n'existe pas sur le disque, par
exemple si vous voulez générer un pdf ou un ics à la volée à partir d'une
chaine::

     public function sendIcs()
     {
        $icsString = $this->Calendars->generateIcs();
        $response = $this->response;

        // Injecter le contenu de la chaîne dans le corps de la réponse
        $response = $response->withStringBody($icsString);

        $response = $response->withType('ics');

        // Force le téléchargement de fichier en option
        $response = $response->withDownload('filename_for_download.ics');

        // Renvoie la réponse pour empêcher le contrôleur d'essayer
        // de rendre une vue
        return $response;
     }

Les fonctions de rappel (callbacks) peuvent également renvoyer le corps en tant que chaîne
de caractères::

    $path = '/some/file.png';
    $this->response->body(function () use ($path) {
        return file_get_contents($path);
    });

Définir les En-têtes
--------------------

.. php:method:: withHeader($header, $value)

La définition de headers se fait avec la méthode :php:meth:`Cake\\Http\\Response::withHeader()`.
Comme toutes les méthodes de l'interface PSR-7, cette méthode retourne une
nouvelle instance avec le nouvel header::

    // Ajoute/remplace un header
    $response = $response->withHeader('X-Extra', 'My header');

    // Définit plusieurs headers
    $response = $response->withHeader('X-Extra', 'My header')
        ->withHeader('Location', 'http://example.com');

    // Ajoute une valeur à un header existant
    $response = $response->withAddedHeader('Set-Cookie', 'remember_me=1');

Les headers ne sont pas envoyés dès que vous les définissez. Ils sont stockés
jusqu'à ce que la réponse soit émise par ``Cake\Http\Server``.

Vous pouvez maintenant utiliser la méthode :php:meth:`Cake\\Http\\Response::withLocation()`
pour définir ou obtenir directement le header "redirect location".

Définir le Corps de la réponse
------------------------------

.. php:method:: withStringBody($string)

Pour définir une chaîne comme corps de réponse, écrivez ceci::

    // Définit une chaîne dans le corps
    $response = $response->withStringBody('My Body');

    // Si vous souhaitez une réponse JSON
    $response = $response->withType('application/json')
        ->withStringBody(json_encode(['Foo' => 'bar']));

.. php:method:: withBody($body)

Pour définir le corps de la réponse, utilisez la méthode ``withBody()`` qui est
fournie par le :php:class:`Laminas\\Diactoros\\MessageTrait`::

    $response = $response->withBody($stream);

Assurez-vous que ``$stream`` est un objet de type :php:class:`Psr\\Http\\Message\\StreamInterface`.
Concernant la manière de créer un nouveau stream, voyez ci-dessous.

Vous pouvez également "*streamer*" les réponses depuis des fichiers en
utilisant des streams :php:class:`Laminas\\Diactoros\\Stream`::

    // Pour "streamer" depuis un fichier
    use Laminas\Diactoros\Stream;

    $stream = new Stream('/path/to/file', 'rb');
    $response = $response->withBody($stream);

Vous pouvez aussi streamer des réponses depuis un callback en utilisant un
``CallbackStream``. C'est utile si vous avez des ressources comme des images,
des fichiers CSV ou des fichiers PDF à streamer au client::

    // Streamer depuis un callback
    use Cake\Http\CallbackStream;

    // Création d'une image
    $img = imagecreate(100, 100);
    // ...

    $stream = new CallbackStream(function () use ($img) {
        imagepng($img);
    });
    $response = $response->withBody($stream);

Définir le Character Set
------------------------

.. php:method:: withCharset($charset)

Cette méthode permet de définir le charset qui sera utilisé dans la réponse::

    $this->response = $this->response->withCharset('UTF-8');

Interagir avec le Cache du Navigateur
-------------------------------------

.. php:method:: withDisabledCache()

Parfois, vous avez besoin de forcer les navigateurs à ne pas mettre en cache les
résultats de l'action d'un controller.
:php:meth:`Cake\\Http\\Response::withDisabledCache()` est justement prévue pour
cela::

    public function index()
    {
        // Désactive le cache
        $this->response = $this->response->withDisabledCache();
    }

.. warning::

    Désactiver le cache à partir de domaines SSL pendant
    que vous essayez d'envoyer des fichiers à Internet Explorer peut entraîner
    des erreurs.

.. php:method:: withCache($since, $time = '+1 day')

Vous pouvez aussi dire aux clients que vous voulez qu'ils mettent en cache
des réponses. En utilisant :php:meth:`Cake\\Http\\Response::withCache()`::

    public function index()
    {
        // Autoriser la mise en cache
        $this->response = $this->response->withCache('-1 minute', '+5 days');
    }

Ce qui est au-dessus indiquera aux clients de mettre en cache la réponse résultante
pendant 5 jours, espérant ainsi accélérer l'expérience de vos visiteurs.
La méthode ``withCache()`` définit valeur ``Last-Modified`` en
premier argument. L'entête ``Expires`` et ``max-age`` sont définis en se basant
sur le second paramètre. Le Cache-Control est défini aussi à ``public``.

.. _cake-response-caching:

Configuration fine du Cache HTTP
--------------------------------

L'une des meilleures méthodes et des plus simples pour rendre votre application
plus rapide est d'utiliser le cache HTTP. Selon ce modèle de mise en cache,
vous êtes seulement tenu d'aider les clients à décider s'ils doivent utiliser
une copie de la réponse mise en cache en définissant quelques propriétés
d'en-têtes comme la date de mise à jour et la balise entity de réponse.

Plutôt que d'avoir à coder la logique de mise en cache et de sa désactivation
(rafraîchissement) une fois que les données ont changé, HTTP utilise deux
méthodes, l'expiration et la validation qui sont habituellement beaucoup plus
simples à utiliser.

En dehors de l'utilisation de :php:meth:`Cake\\Http\\Response::withCache()`, vous
pouvez également utiliser d'autres méthodes pour régler finement les en-têtes de
cache HTTP et ainsi tirer profit du cache du navigateur ou du proxy inverse.

L'En-tête de Contrôle du Cache
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withSharable($public, $time = null)

Utilisé par la méthode méthode d'expiration, cet en-tête contient de multiples
indicateurs qui peuvent changer la façon dont les navigateurs ou les proxies
utilisent le contenu mis en cache. Un en-tête ``Cache-Control`` peut ressembler
à ceci::

    Cache-Control: private, max-age=3600, must-revalidate

La classe ``Response`` vous aide à configurer cet en-tête avec quelques
méthodes utiles qui vont produire un en-tête final ``Cache Control`` valide.
La première est la méthode ``withSharable()``, qui indique si une réponse peut
être considérée comme partageable pour différents utilisateurs ou clients.
Cette méthode contrôle en fait la partie `public` ou `private` de cet en-tête.
Définir une réponse en `private` indique que tout ou partie de celle-ci est
prévue pour un unique utilisateur.
Pour tirer profit des mises en cache partagées, il est nécessaire de définir la
directive de contrôle en `public`.

Le deuxième paramètre de cette méthode est utilisé pour spécifier un ``max-age``
pour le cache qui est le nombre de secondes après lesquelles la réponse n'est
plus considérée comme récente::

    public function view()
    {
        ...
        // Définit le Cache-Control en public pour 3600 secondes
        $this->response = $this->response->withSharable(true, 3600);
    }

    public function mes_donnees()
    {
        ...
        // Définit le Cache-Control en private pour 3600 secondes
        $this->response = $this->response->withSharable(false, 3600);
    }

``Response`` expose des méthodes séparées pour la définition de chaque component
dans l'en-tête de ``Cache-Control``.

L'En-tête d'Expiration
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withExpires($time)

Vous pouvez définir l'en-tête ``Expires`` avec une date et un temps après
lesquels la réponse n'est plus considérée comme à jour. Cet en-tête peut être
défini en utilisant la méthode ``withExpires()``::

    public function view()
    {
        $this->response = $this->response->withExpires('+5 days');
    }

Cette méthode accepte aussi une instance :php:class:`DateTime` ou toute chaîne
de caractère qui peut être parsée par la classe :php:class:`DateTime`.

L'En-tête Etag
~~~~~~~~~~~~~~

.. php:method:: withEtag($tag, $weak = false)

La validation du Cache dans HTTP est souvent utilisée quand le contenu change
constamment et demande à l'application de générer seulement les contenus de la
réponse si le cache n'est plus à jour. Sous ce modèle, le client continue
de stocker les pages dans le cache, mais au lieu de l'utiliser directement,
il demande à l'application à chaque fois si les ressources ont changé ou non.
C'est utilisé couramment avec des ressources statiques comme les images et
autres ressources.

La méthode ``withEtag()`` (appelée balise d'entité) est une
chaîne de caractère qui identifie de façon unique les ressources requêtées
comme le fait un checksum pour un fichier, afin de déterminer si elle
correspond à une ressource du cache.

Pour réellement tirer profit de l'utilisation de cet en-tête, vous devez
soit appeler manuellement la méthode
``isNotModified()`` ou inclure le
:doc:`/controllers/components/request-handling` dans votre controlleur::

    public function index()
    {
        $articles = $this->Articles->find('all')->all();

        // Somme de contrôle simple du contenu de l'article.
        // Vous devriez utiliser une implémentation plus efficace
        // dans une application du monde réel.
        $checksum = md5(json_encode($articles));

        $response = $this->response->withEtag($checksum);
        if ($response->isNotModified($this->request)) {
            return $response;
        }

        $this->response = $response;
        // ...
    }

.. note::

    La plupart des utilisateurs proxy devront probablement penser à utiliser
    l'en-tête Last Modified plutôt que Etags pour des raisons de performance et
    de compatibilité.

L'En-tête Last-Modified
~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withModified($time)

De même, avec la méthode consistant à valider du cache HTTP, vous pouvez définir
l'en-tête ``Last-Modified`` pour indiquer la date et l'heure à laquelle la
ressource a été modifiée pour la dernière fois. Définir cet en-tête aide CakePHP
à indiquer à ces clients si la réponse a été modifiée ou n'est pas basée sur
leur cache.

Pour réellement tirer profit de l'utilisation de cet en-tête, vous devez soit
appeler manuellement la méthode ``isNotModified()`` ou inclure le
:doc:`/controllers/components/request-handling` dans votre controlleur::

    public function view()
    {
        $article = $this->Articles->find()->first();
        $response = $this->response->withModified($article->modified);
        if ($response->isNotModified($this->request)) {
            return $response;
        }
        $this->response;
        // ...
    }

L'En-tête Vary
~~~~~~~~~~~~~~

.. php:method:: withVary($header)

Dans certains cas, vous voudrez offrir différents contenus en utilisant la même
URL. C'est souvent le cas quand vous avez une page multilingue ou que vous
répondez avec différentes pages HTML selon le navigateur qui requête la
ressource. Dans ces circonstances, vous pouvez utiliser l'en-tête ``Vary``::

    $response = $this->response->withVary('User-Agent');
    $response = $this->response->withVary('Accept-Encoding', 'User-Agent');
    $response = $this->response->withVary('Accept-Language');

Envoyer des Réponses Non-Modifiées
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: isNotModified(Request $request)

Compare les en-têtes de cache pour l'objet requêté avec l'en-tête du cache de
la réponse et determine s'il peut toujours être considéré comme à jour. Si oui,
il supprime le contenu de la réponse et envoie l'en-tête `304 Not Modified`::

    // Dans une action de controller.
    if ($this->response->isNotModified($this->request)) {
        return $this->response;
    }

.. _response-cookies:

Définir des Cookies
-------------------

Des cookies peuvent être ajoutés aux réponses en utilisant soit un tableau, soit
un objet :php:class:`Cake\\Http\\Cookie\\Cookie`::

    use Cake\Http\Cookie\Cookie;
    use DateTime;

    // Ajoute un cookie
    $this->response = $this->response->withCookie(Cookie::create(
        'remember_me',
        'yes',
        // Toutes les clés sont facultatives
        [
            'expires' => new DateTime('+1 year'),
            'path' => '',
            'domain' => '',
            'secure' => false,
            'http' => false,
        ]
    ]);

Référez-vous à la section :ref:`creating-cookies` pour savoir comment utiliser
l'objet Cookie. Vous pouvez utiliser ``withExpiredCookie()`` pour envoyer un cookie
expiré dans la réponse. De cette manière, le navigateur supprimera son cookie local::

    $this->response = $this->response->withExpiredCookie(new Cookie('remember_me'));

.. _cors-headers:

Définir les En-têtes de Requête d'Origine Croisée (Cross Origin Request Headers = CORS)
=======================================================================================

La méthode ``cors()`` est utilisée pour définir `le Contrôle
d'Accès HTTP <https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS>`__
et ses en-têtes liés au travers d'une interface simple::

    $this->response = $this->response->cors($this->request)
        ->allowOrigin(['*.cakephp.org'])
        ->allowMethods(['GET', 'POST'])
        ->allowHeaders(['X-CSRF-Token'])
        ->allowCredentials()
        ->exposeHeaders(['Link'])
        ->maxAge(300)
        ->build();

Les en-têtes liés au CORS vont seulement être appliqués à la réponse si les
critères suivants sont vérifiés:

#. La requête a un en-tête ``Origin``.
#. La valeur ``Origin`` de la requête correspond à une des valeurs autorisées de
   Origin.

Erreurs Communes avec les Responses Immutables
==============================================

Les objets responses offrent de nombreuses méthodes qui
traitent les responses comme des objets immutables. Les objets immutables
permettent de prévenir les effets de bord difficiles à repérer.
Malgré leurs nombreux avantages, s'habituer aux objets immutables peut prendre
un peu de temps. Toutes les méthodes qui commencent par ``with`` intéragiront
avec la réponse à la manière immutable et retourneront **toujours** une
**nouvelle** instance. L'erreur la plus fréquente quand les développeurs
travaillent avec les objets immutables est d'oublier de persister l'instance
modifiée::

    $this->response->withHeader('X-CakePHP', 'yes!');

Dans le code ci-dessus, la réponse ne contiendra pas le header ``X-CakePHP``
car la valeur retournée par ``withHeader()`` n'a pas été persistée. Pour avoir
un code fonctionnel, vous devrez écrire::

    $this->response = $this->response->withHeader('X-CakePHP', 'yes!');

.. php:namespace:: Cake\Http\Cookie

CookieCollections
=================

.. php:class:: CookieCollection

Les objets ``CookieCollection`` sont accessibles depuis les objets Request et
Response. Ils vous permettent d'intéragir avec des groupes de cookies en utilisant
des patterns immutables, ce qui permet au caractère immutable des Request et des
Response d'être préservé.

.. _creating-cookies:

Créer des Cookies
-----------------

.. php:class:: Cookie

Les objets ``Cookie`` peuvent être définis via le constructor ou en utilisant
l'interface fluide qui suit les patterns immutables::

    use Cake\Http\Cookie\Cookie;

    // Tous les arguments dans le constructor
    $cookie = new Cookie(
        'remember_me', // nom
        1, // valeur
        new DateTime('+1 year'), // durée d'expiration, si applicable
        '/', // chemin, si applicable
        'example.com', // domaine, si applicable
        false, // seulement en mode 'secure' ?
        true // seulement en http ?
    );

    // En utilisant les méthodes immutables
    $cookie = (new Cookie('remember_me'))
        ->withValue('1')
        ->withExpiry(new DateTime('+1 year'))
        ->withPath('/')
        ->withDomain('example.com')
        ->withSecure(false)
        ->withHttpOnly(true);

Une fois que vous avez créer un cookie, vous pouvez l'ajouter à une nouvelle
``CookieCollection``, ou à une existante::

    use Cake\Http\Cookie\CookieCollection;

    // Crée une nouvelle collection
    $cookies = new CookieCollection([$cookie]);

    // Ajoute à une collection existante
    $cookies = $cookies->add($cookie);

    // Supprime un cookie via son nom
    $cookies = $cookies->remove('remember_me');

.. note::
    Gardez bien à l'esprit que les collections sont immutables et qu'ajouter des
    cookies dans une collection ou retirer des cookies d'une collection va créer
    *une nouvelle* collection.

Vous devriez utiliser la méthode ``withCookie()`` pour ajouter des cookies aux
objets ``Response``::

    // Ajoute un cookie
    $response = $this->response->withCookie($cookie);

    // Remplace la collection de cookies
    $response = $this->response->withCookieCollection($cookies);

Les cookies ajoutés aux Response peuvent être chiffrés en utilisant le
:ref:`encrypted-cookie-middleware`

Lire des Cookies
----------------

Une fois que vous avez une instance de ``CookieCollection``, vous pouvez accéder
aux cookies qu'elle contient::

    // Vérifie l'existence d'un cookie
    $cookies->has('remember_me');

    // Récupère le nombre de cookie dans une collection
    count($cookies);

    // Récupère l'instance d'un cookie
    $cookie = $cookies->get('remember_me');

Une fois que vous avez un objet ``Cookie``, vous pouvez intéragir avec son état
et le modifier. Gardez à l'esprit que les cookies sont immutables, donc vous allez
devoir mettre à jour la collection si vous modifiez un cookie::

    // Récupère la valeur
    $value = $cookie->getValue()

    // Accède à une donnée dans une valeur JSON
    $id = $cookie->read('User.id');

    // Vérifie l'état
    $cookie->isHttpOnly();
    $cookie->isSecure();

.. meta::
    :title lang=fr: Objets ServerRequest et Response
    :keywords lang=fr: requête controller,paramètres de requête,tableaux indicés,purpose index,objets réponse,information domaine,Objet requête,donnée requêtée,interrogation,params,parameters,précédentes versions,introspection,dispatcher,rout,structures de données,tableaux,adresse ip,migration,indexes,cakephp
