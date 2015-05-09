Vues JSON et XML
################

Les views ``XmlView`` et ``JsonView`` vous permettent de créer facilement des
réponses XML et JSON, et sont intégrées à
:php:class:`Cake\\Controller\\Component\\RequestHandlerComponent`.

En activant ``RequestHandlerComponent`` dans votre application, et en activant
le support pour les extensions ``xml`` et/ou ``json``, vous pouvez
automatiquement vous appuyer sur les nouvelles classes de vue. ``XmlView`` et
``JsonView`` feront référence aux vues de données pour le reste de cette page.

Il y a deux façons de générer des vues de données. La première est en utilisant
la clé ``_serialize``, et la seconde en créant des fichiers de template normaux.

Activation des Vues de Données dans votre Application
=====================================================

Avant que vous ne puissiez utiliser les classes de vue de données, vous devrez
charger :php:class:`Cake\\Controller\\Component\\RequestHandlerComponent` dans
votre controller::

    public function initialize()
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
exemple ``http://example.com/posts.json``.

Par défaut, quand vous n'activez pas les :ref:`file-extensions`, l'en-tête
``Accept`` de la requête est utilisé pour sélectionner le type de format qui
doit être rendu à l'utilisateur. Un exemple de format ``Accept`` utilisé pour
rendre les réponses ``JSON`` est ``application/json``.

Utilisation des Vues de Données avec la Clé Serialize
=====================================================

La clé ``_serialize`` est une variable de vue spéciale qui indique quelle(s)
autre(s) variable(s) de vue devrai(en)t être sérialisée(s) quand on utilise la
vue de données. Cela vous permet de sauter la définition des fichiers de
template pour vos actions de controller si vous n'avez pas besoin de faire un
formatage avant que vos données ne soient converties en json/xml.

Si vous avez besoin de faire tout type de formatage ou de manipulation de vos
variables de vue avant la génération de la réponse, vous devrez utiliser les
fichiers de template. La valeur de ``_serialize`` peut être soit une chaîne de
caractère, soit un tableau de variables de vue à sérialiser::

    class PostsController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            // Défini les variables de vues qui doivent être sérialisées.
            $this->set('articles', $this->paginate());

            // Spécifie quelles variables de vues JsonView doit sérialiser.
            $this->set('_serialize', ['articles']);
        }
    }

Vous pouvez aussi définir ``_serialize`` en tableau de variables de vue à
combiner::

    class ArticlesController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            // Some code that created $articles and $comments

            // Défini les variables de vues qui doivent être sérialisées.
            $this->set(compact('articles', 'comments'));

            // Spécifie quelles variables de vues JsonView doit sérialiser.
            $this->set('_serialize', ['articles', 'comments']);
        }
    }

Définir ``_serialize`` en tableau comporte le bénéfice supplémentaire d'ajouter
automatiquement un élément de top-niveau ``<response>`` en utilisant
:php:class:`XmlView`. Si vous utilisez une valeur de chaîne de caractère pour
``_serialize`` et XmlView, assurez-vous que vos variables de vue aient un
élément unique de top-niveau. Sans un élément de top-niveau, le Xml ne pourra
être généré.

Utilisation d'une Vue de Données avec les Fichiers de Template
==============================================================

Vous devrez utiliser les fichiers de template si vous avez besoin de faire des
manipulations du contenu de votre vue avant de créer la sortie finale. Par
exemple, si vous avez des posts, qui ont un champ contenant du HTML généré,
vous aurez probablement envie d'omettre ceci à partir d'une réponse JSON.
C'est une situation où un fichier de vue est utile::

    // Code du controller
    class PostsController extends AppController
    {
        public function index()
        {
            $articles = $this->paginate('Articles');
            $this->set(compact('articles'));
        }
    }

    // Code de la vue - src/Template/Posts/json/index.ctp
    foreach ($posts as &$post) {
        unset($post->generated_html);
    }
    echo json_encode(compact('posts'));

Vous pouvez faire des manipulations encore beaucoup plus complexes, comme
utiliser les helpers pour formater.

.. note::

    Les classes de vue de données ne supportent pas les layouts. Elles
    supposent que le fichier de vue va afficher le contenu sérialisé.

Créer des Views XML
===================

.. php:class:: XmlView

Par défaut quand on utilise ``_serialize``, XmlView va envelopper vos
variables de vue sérialisées avec un nœud ``<response>``. Vous pouvez
définir un nom personnalisé pour ce nœud en utilisant la variable de vue
``_rootNode``.

Créer des Views JSON
====================

.. php:class:: JsonView

La classe JsonView intègre la variable ``_jsonOptions`` qui vous permet de
personnaliser le bit-mask utilisé pour générer le JSON. Regardez la
documentation `json_encode <http://php.net/json_encode>`_ sur les valeurs
valides de cette option.

Réponse JSONP
-------------

Quand vous utilisez ``JsonView``, vous pouvez utiliser la variable de vue
spéciale ``_jsonp`` pour retourner une réponse JSONP. La définir à ``true``
fait que la classe de vue vérifie si le paramètre de chaine de la requête
nommée "callback" est défini et si c'est le cas, permet d'envelopper la réponse
json dans le nom de la fonction fournie. Si vous voulez utiliser un nom
personnalisé de paramètre de requête à la place de "callback", définissez
``_jsonp`` avec le nom requis à la place de ``true``.
