CacheHelper
###########

.. php:class:: CacheHelper(View $view, array $settings = array())

Le helper Cache permet la mise en cache des layouts (mises en page)
et des vues permettant de gagner du temps pour la récupération de données 
répétitives. Le système de cache des vues de Cake parse les layout et les vues 
comme de simple fichier PHP + HTML. Il faut noter que l'assistant Cache 
fonctionne de façon assez différente des autres assistants. Il ne possède pas 
de méthodes appelées directement. A la place, une vue est marquée de tags, 
indiquant quels blocs de contenus ne doivent pas être mis en cache. Le 
Helper Cache utilise alors les callbacks du helper pour traiter le fichier 
et ressortir pour générer le fichier de cache.

Quand une URL est appelée, Cake vérifie si cette requête a déjà été mise en 
cache. Si c'est le cas, le processus de distribution de l'URL est abandonné. 
Chacun des blocs non mis en cache sont rendus selon le processus normal, 
et la vue est servie. Cela permet de gagner beaucoup de temps pour chaque 
requête vers une URL mise en cache, puisqu'un minimum de code est exécuté. 
Si Cake ne trouve pas une vue mise en cache, ou si le cache a expiré pour 
l'URL appelée, le processus de requête normal se poursuit.

Utilisation du Helper
======================

Il y a deux étapes à franchir avant de pouvoir utiliser le Helper (assistant)
Cache. Premièrement dans votre ``APP/Config/core.php`` dé-commenter l'appel
Configure write pour ``Cache.check``. Ceci dira à CakePHP de regarder dans
le cache , et de générer l'affichage des fichiers en cache lors du traitement
des demandes.

Une fois que vous avez décommenté la ligne ``Cache.check`` vous devez
ajouter le helper à votre tableau de helper de votre contrôleur::

    class PostsController extends AppController {
        public $helpers = array('Cache');
    }

Options de configuration supplémentaires 
----------------------------------------

Le Helper Cache (CacheHelper) dispose de plusieurs options de 
configuration additionnelles que vous pouvez utiliser pour ajuster
et régler ces comportements. Ceci est réalisé a travers la variable
``$cacheAction`` dans vos contrôleurs. ``$cacheAction`` doit être
régler par un tableau qui contient l'action que vous voulez cacher,
et la durée en seconde durant laquelle vous voulez que cette vue
soit cachée. La valeur du temps peut être exprimé dans le format
``strtotime()``. (ex. "1 hour", ou "3 minutes").

En utilisant l'exemple d'un contrôleur d'articles ArticlesController,
qui reçoit beaucoup de trafics qui ont besoins d'être cachés:: 

    public $cacheAction = array(
        'view' => 36000,
        'index'  => 48000
    );

Ceci cachera l'action view 10 heures et l'action index 13 heures. En plaçant 
une valeur usuelle de ``strtotime()`` dans ``$cacheAction`` vous pouvez cacher
toutes les actions dans le contrôleur::

    public $cacheAction = "1 hour";

Vous pouvez aussi activer les callbacks contrôleur/composant pour
les vues cachées créées avec  ``CacheHelper``. Pour faire cela
vous devez utiliser le format de tableau pour ``$cacheAction``
et créer un tableau comme ceci::

    public $cacheAction = array(
        'view' => array('callbacks' => true, 'duration' => 21600),
        'add' => array('callbacks' => true, 'duration' => 36000),
        'index' => array('callbacks' => true, 'duration' => 48000)
    );

En paramétrant ``callbacks => true`` vous dites au CacheHelper 
(Assistant Cache) que vous voulez que les fichiers générés créent
les composants et les modèles pour le contrôleur. De manière 
additionnelle, lance la méthode initialize du composant, le beforeFilter
du contrôleur , et le démarrage des callbacks de component. 

.. note::

    Définir callbacks => true fait échouer en partie le but de la mise en 
    cache. C'est aussi la raison pour laquelle ceci est désactivé par défaut.
  
Marquer les contenus Non-Cachés dans les Vues
=============================================

Il y aura des fois où vous ne voudrez par mettre en cache une vue *intégrale*. 
Par exemple, certaines parties d'une page peuvent être différentes, selon que 
l'utilisateur est actuellement identifié ou qu'il visite votre site en tant 
qu'invité.

Pour indiquer que des blocs de contenu *ne doivent pas* être mis en cache, 
entourez-les par <!--nocache--> <!--/nocache-->`` comme ci-dessous :

.. code-block:: php

    <!--nocache-->
    <?php if ($this->Session->check('User.name')) : ?>
        Bienvenue, <?php echo h($this->Session->read('User.name')); ?>.
    <?php else: ?>
        <?php echo $html->link('Login', 'users/login')?>
    <?php endif; ?>
    <!--/nocache-->

.. note::

    Vous ne pouvez pas utilisez les tags ``nocache`` dans les éléments.
    puisqu'il n'y a pas de callbacks autour des éléments, ils ne peuvent
    être cachés.
    
Il est à noter, qu'une fois une action mise en cache, la méthode du contrôleur 
correspondante ne sera plus appelée. Quand un fichier cache est créé, l'objet
request , et les variables de vues  sont sérialisés avec ``serialize()`` de 
PHP.

.. warning::

    Si vous avez des variables de vues qui contiennent des contenus 
    inserialisable comme les  objets SimpleXML, des gestionnaires
    de ressource (resource handles), ou des classes closures Il se 
    peut que vous ne puissiez pas utiliser la mise en cache des vues.

Nettoyer le Cache
==================

Il est important de se rappeler que Cake va nettoyer le cache si un 
modèle utilisé dans la vue mise en cache a été modifié. Par exemple, 
si une vue mise en cache utilise des données du modèle Post et qu'il 
y a eu une requête INSERT, UPDATE, ou DELETE sur Post, le cache de 
cette vue est nettoyé, et un nouveau contenu sera généré à la prochaine 
requête.

.. note::

    Ce système de nettoyage automatique requiert que le nom du
    contrôleur/modèle fasse partie de l'Url. Si vous avez utilisé
    le routing pour changer vos Urls cela ne fonctionnera pas. 

Si vous avez besoin de nettoyer le cache manuellement, vous pouvez 
le faire en appelant Cache::clear(). Cela nettoiera **toutes** les 
données mises en cache, à l'exception des fichiers de vues mis en 
cache. Si vous avez besoin de nettoyer les fichiers de vues, 
utilisez ``clearCache()``.


.. meta::
    :title lang=fr: CacheHelper
    :description lang=fr: The Cache helper assists in caching entire layouts and views, saving time repetitively retrieving data.
    :keywords lang=en: cache helper,view caching,cache action,cakephp cache,nocache,clear cache
