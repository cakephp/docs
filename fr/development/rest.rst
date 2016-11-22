REST
####

Beaucoup de programmeurs néophytes d'application réalisent qu'ils ont
besoin d'ouvrir leurs fonctionnalités principales à un public plus important.
Fournir facilement, un accès sans entrave à votre API du cœur peut
aider à ce que votre plateforme soit acceptée, et permettre les
mashups et une intégration facile avec les autres systèmes.

Alors que d'autres solutions existent, REST est un bon moyen de fournir
facilement un accès à la logique que vous avez créée dans votre application.
C'est simple, habituellement basé sur XML (nous parlons de XML simple, rien
de semblable à une enveloppe SOAP), et dépend des headers HTTP pour la
direction. Exposer une API via REST dans CakePHP est simple.

Mise en place Simple
====================

Le moyen le plus rapide pour démarrer avec REST est d'ajouter quelques lignes
pour configurer :ref:`resource routes <resource-routes>` dans votre fichier
config/routes.php.

Une fois que le router a été configuré pour mapper les requêtes REST vers
certaines actions de controller, nous pouvons continuer et créer la logique
dans nos actions de controller. Un controller basique pourrait ressembler
à ceci::

    // src/Controller/RecipesController.php
    class RecipesController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            $recipes = $this->Recipes->find('all');
            $this->set([
                'recipes' => $recipes,
                '_serialize' => ['recipes']
            ]);
        }

        public function view($id)
        {
            $recipe = $this->Recipes->get($id);
            $this->set([
                'recipe' => $recipe,
                '_serialize' => ['recipe']
            ]);
        }

        public function add()
        {
            $recipe = $this->Recipes->newEntity($this->request->getData());
            if ($this->Recipes->save($recipe)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                'recipe' => $recipe,
                '_serialize' => ['message', 'recipe']
            ]);
        }

        public function edit($id)
        {
            $recipe = $this->Recipes->get($id);
            if ($this->request->is(['post', 'put'])) {
                $recipe = $this->Recipes->patchEntity($recipe, $this->request->getData());
                if ($this->Recipes->save($recipe)) {
                    $message = 'Saved';
                } else {
                    $message = 'Error';
                }
            }
            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }

        public function delete($id)
        {
            $recipe = $this->Recipes->get($id);
            $message = 'Deleted';
            if (!$this->Recipes->delete($recipe)) {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }
    }

Les controllers RESTful utilisent souvent les extensions parsées pour servir
différentes views basées sur différents types de requête. Puisque nous gérons
les requêtes REST, nous ferons des views XML. Vous pouvez aussi faire des views
JSON en utilisant les :doc:`/views/json-and-xml-views` intégrées à CakePHP. En
utilisant :php:class:`XmlView` intégré, nous pouvons définir une variable de vue
``_serialize``. Cette variable de vue spéciale est utilisée pour définir les
variables de vue que ``XmlView`` doit sérialiser en XML.

Si nous voulons modifier les données avant qu'elles soient converties en XML,
nous ne devons pas définir la variable de vue ``_serialize``, et à la place
utiliser les fichiers de template. Nous plaçons les vues REST pour notre
RecipesController à l'intérieur de **src/Template/Recipes/xml**. Nous pouvons
aussi utiliser :php:class:`Xml` pour une sortie XML facile et rapide dans ces
vues. Voici ce que notre vue index pourrait ressembler à::

    // src/Template/Recipes/xml/index.ctp
    // Faire du formatage et de la manipulation sur le tableau
    // $recipes.
    $xml = Xml::fromArray(['response' => $recipes]);
    echo $xml->asXML();

Quand vous servez le type de contenu spécifique en utilisant parseExtensions(),
CakePHP recherche automatiquement un helper de view qui matche le type.
Puisque nous utilisons le XML en type de contenu, il n'y a pas de helper intégré
cependant si vous en créez un, il va être automatiquement chargé pour notre
utilisation dans ces vues.

Le XML rendu va finir par ressembler à ceci::

    <recipes>
        <recipe>
            <id>234</id>
            <created>2008-06-13</created>
            <modified>2008-06-14</modified>
            <author>
                <id>23423</id>
                <first_name>Billy</first_name>
                <last_name>Bob</last_name>
            </author>
            <comment>
                <id>245</id>
                <body>Yummy yummmy</body>
            </comment>
        </recipe>
        ...
    </recipes>

Créer la logique pour l'action edit est un tout petit peu plus compliqué.
Puisque vous fournissez une API qui sort du XML, c'est un choix naturel de
recevoir le XML en input. Ne vous inquiétez pas, les classes
:php:class:`Cake\\Controller\\Component\\RequestHandler` et
:php:class:`Cake\\Routing\\Router` vous facilitent les choses. Si une requête
POST ou PUT a un type de contenu XML, alors l'input est lancé à travers la
classe :php:class:`Xml` de CakePHP, et la representation en tableau des données
est assigné à `$this->request->data`. Avec cette fonctionnalité, la gestion
de XML et les données POST en parallèle est seamless: aucun changement n'est
nécessaire pour le code du controller ou du model.
Tout ce dont vous avez besoin devrait se trouver dans ``$this->request->getData()``.

Accepter l'Input dans d'Autres Formats
======================================

Typiquement les applications REST ne sortent pas seulement du contenu dans des
formats de données alternatifs, elles acceptent aussi des données dans des
formats différents. Dans CakePHP, :php:class:`RequestHandlerComponent` facilite
ceci. Par défaut, elle va décoder toute donnée d'input JSON/XML entrante pour
des requêtes POST/PUT et fournir la version du tableau de ces données dans
`$this->request->data`. Vous pouvez aussi connecter avec des deserialisers
supplémentaires dans des formats alternatifs si vous avez besoin d'eux en
utilisant :php:meth:`RequestHandler::addInputType()`

RESTful Routing
===============

Le Router de CakePHP facilite la connection des routes pour les ressources
RESTful. Consultez la section :ref:`resource-routes` pour plus d'informations.

.. meta::
    :title lang=fr: REST
    :keywords lang=fr: application programmers,default routes,core functionality,result format,mashups,recipe database,request method,easy access,config,soap,recipes,logic,audience,cakephp,running,api
