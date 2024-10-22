Vues JSON et XML
################

Les views ``JsonView`` et ``XmlView`` vous permettent de créer des réponses JSON
et XML, et sont intégrées à
:php:class:`Cake\\Controller\\Component\\RequestHandlerComponent`.

En activant ``RequestHandlerComponent`` dans votre application, et en activant
le support pour les extensions ``json`` et/ou ``xml``, vous pouvez
automatiquement vous appuyer sur les nouvelles classes de vue. ``JsonView`` et
``XmlView`` feront référence aux vues de données pour le reste de cette page.

Il y a deux façons de générer des vues de données. La première est en utilisant
l'option ``serialize``, et la seconde en créant des fichiers de template normaux.

Activation des Vues de Données dans votre Application
=====================================================

Avant que vous ne puissiez utiliser les classes de vue de données, vous devrez
charger :php:class:`Cake\\Controller\\Component\\RequestHandlerComponent` dans
votre controller::

    public function initialize(): void
    {
        ...
        $this->loadComponent('RequestHandler');
    }

Ceci peut être fait dans votre `AppController` et va activer automatiquement
la classe de vue en s'adaptant selon les types de contenu. Vous pouvez aussi
configurer le component avec le paramètre ``viewClassMap``, pour faire
correspondre les types à vos classes personnalisées et/ou les faire correspondre
à d'autres types de données.

Vous pouvez en option activer les extensions json et ou xml avec les
:ref:`file-extensions`. Ceci va vous permettre d'accéder à ``JSON``, ``XML`` ou
tout autre format spécial de vue en utilisant une URL personnalisée finissant
avec le nom du type de réponse en tant qu'extension de fichier comme par
exemple ``http://example.com/articles.json``.

Par défaut, quand vous n'activez pas les :ref:`file-extensions`, l'en-tête
``Accept`` de la requête est utilisé pour sélectionner le type de format qui
doit être rendu à l'utilisateur. Un exemple de format ``Accept`` utilisé pour
rendre les réponses ``JSON`` est ``application/json``.

Utilisation des Vues de Données avec l'option Serialize
=======================================================

L'option ``serialize`` indique quelle(s)
autre(s) variable(s) de vue devrai(en)t être sérialisée(s) quand on utilise la
vue de données. Cela vous permet de sauter la définition des fichiers de
template pour vos actions de controller si vous n'avez pas besoin de faire un
formatage avant que vos données ne soient converties en json/xml.

Si vous avez besoin de faire tout type de formatage ou de manipulation de vos
variables de vue avant la génération de la réponse, vous devrez utiliser les
fichiers de template. La valeur de ``serialize`` peut être soit une chaîne de
caractère, soit un tableau de variables de vue à sérialiser::

    class ArticlesController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            // Défini les variables de vues qui doivent être sérialisées.
            $this->set('articles', $this->paginate());

            // Spécifie quelles variables de vues JsonView doit sérialiser.
            $this->viewBuilder()->setOption('serialize', 'articles');
        }
    }

Vous pouvez aussi définir ``serialize`` en tableau de variables de vue à
combiner::

    class ArticlesController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            // Du code qui crée created $articles et $comments

            // Définit les variables de vues qui doivent être sérialisées.
            $this->set(compact('articles', 'comments'));

            // Spécifie les variables de vues JsonView à sérialiser.
            $this->viewBuilder()->setOption('serialize', ['articles', 'comments']);
        }
    }

Définir ``serialize`` en tableau comporte le bénéfice supplémentaire d'ajouter
automatiquement un élément de top-niveau ``<response>`` en utilisant
:php:class:`XmlView`. Si vous utilisez une valeur de chaîne de caractère pour
``serialize`` et XmlView, assurez-vous que vos variables de vue aient un
élément unique de top-niveau. Sans un élément de top-niveau, le Xml ne pourra
être généré.

Utilisation d'une Vue de Données avec les Fichiers de Template
==============================================================

Vous devrez utiliser les fichiers de template si vous avez besoin de faire des
manipulations du contenu de votre vue avant de créer la sortie finale. Par
exemple, si vous avez des articles, qui ont un champ contenant du HTML généré,
vous aurez probablement envie d'omettre ceci à partir d'une réponse JSON.
C'est une situation où un fichier de vue est utile::

    // Code du controller
    class ArticlesController extends AppController
    {
        public function index()
        {
            $articles = $this->paginate('Articles');
            $this->set(compact('articles'));
        }
    }

    // Code de la vue - templates/Articles/json/index.php
    foreach ($articles as &$article) {
        unset($article->generated_html);
    }
    echo json_encode(compact('articles'));

Vous pouvez faire des manipulations encore beaucoup plus complexes, comme
utiliser les helpers pour formater. Les classes de vue ded onnées ne supportent
pas les layouts. Elles supposent que le fichier de vue va afficher le contenu
sérialisé.

Créer des Views XML
===================

.. php:class:: XmlView

Par défaut quand on utilise ``serialize``, XmlView va envelopper vos
variables de vue sérialisées avec un nœud ``<response>``. Vous pouvez
définir un nom personnalisé pour ce nœud en utilisant l'option ``rootNode``.

La classe XmlView intègre l'option ``xmlOptions`` qui vous permet de
personnaliser les options utilisées pour générer le XML, par exemple ``tags``
au lieu d'``attributes``.

Comme exemple d'utilisation de ``XmlView``, on peut imaginer la génération d'un
`sitemap.xml <https://www.sitemaps.org/protocol.html>`_. Ce tye de document
nécessite de changer ``_rootNode`` et de définir des attributs. Les attributs
sont définis en utilisant le préfixe ``@``::

    use Cake\View\XmlView;

    public function viewClasses(): array
    {
        return [XmlView::class];
    }

    public function sitemap()
    {
        $pages = $this->Pages->find()->all();
        $urls = [];
        foreach ($pages as $page) {
            $urls[] = [
                'loc' => Router::url(['controller' => 'Pages', 'action' => 'view', $page->slug, '_full' => true]),
                'lastmod' => $page->modified->format('Y-m-d'),
                'changefreq' => 'daily',
                'priority' => '0.5'
            ];
        }

        // Définir un root node personnalisé dans le document généré.
        $this->viewBuilder()
            ->setOption('rootNode', 'urlset')
            ->setOption('serialize', ['@xmlns', 'url']);
        $this->set([
            // Définir un attribut sur le root node.
            '@xmlns' => 'http://www.sitemaps.org/schemas/sitemap/0.9',
            'url' => $urls
        ]);
    }

Créer des Views JSON
====================

.. php:class:: JsonView

La classe JsonView intègre la variable ``_jsonOptions`` qui vous permet de
personnaliser le masque utilisé pour générer le JSON. Regardez la
documentation `json_encode <https://php.net/json_encode>`_ sur les valeurs
valides de cette option.

Par exemple, pour serializer le rendu des erreurs de validation des entités de
CakePHP de manière cohérente, vous pouvez le faire de la manière suivante::

    // Dans l'action de votre controller, quand une sauvegarde échoue
    $this->set('errors', $articles->errors());
    $this->viewBuilder()
        ->setOption('serialize', ['errors'])
        ->setOption('jsonOptions', JSON_FORCE_OBJECT);

Réponse JSONP
-------------

Quand vous utilisez ``JsonView``, vous pouvez utiliser la variable de vue
spéciale ``_jsonp`` pour retourner une réponse JSONP. La définir à ``true``
fait que la classe de vue vérifie si le paramètre de chaine de la requête
nommée "callback" est défini et si c'est le cas, permet d'envelopper la réponse
json dans le nom de la fonction fournie. Si vous voulez utiliser un nom
personnalisé de paramètre de requête à la place de "callback", définissez
``_jsonp`` avec le nom requis à la place de ``true``.

Exemple d'Utilisation
=====================

Alors que :doc:`RequestHandlerComponent
</controllers/components/request-handling>` peut automatiquement définir la vue
en fonction du content-type ou de l'extension de la requête, vous pouvez aussi
gérer les mappings de vue dans votre controller::

    // src/Controller/VideosController.php
    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Http\Exception\NotFoundException;

    class VideosController extends AppController
    {
        public function export($format = '')
        {
            $format = strtolower($format);

            // Format pour le view mapping
            $formats = [
              'xml' => 'Xml',
              'json' => 'Json',
            ];

            // Erreur sur un type inconnu
            if (!isset($formats[$format])) {
                throw new NotFoundException(__('Unknown format.'));
            }

            // Définit le format de la Vue
            $this->viewBuilder()->className($formats[$format]);

            // Récupérer les données
            $videos = $this->Videos->find('latest');

            // Définir les Données de la Vue
            $this->set(compact('videos'));
            $this->viewBuilder()->setOption('serialize', ['videos']);

            // Définit le téléchargement forcé
            return $this->response->withDownload('report-' . date('YmdHis') . '.' . $format);
        }
    }
