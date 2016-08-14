View Cells
##########

View cells sont des mini-controllers qui peuvent invoquer de la logique de vue
et afficher les templates. L'idée des cells est empruntée aux `cells dans ruby
<https://github.com/apotonick/cells>`_, où elles remplissent un rôle et un
sujet similaire.

Quand utiliser les Cells
========================

Les Cells sont idéales pour la construction de components de page réutilisables
qui nécessitent une interaction avec les models, la logique de view, et la
logique de rendu. Un exemple simple serait un caddie dans un magasin en ligne,
ou un menu de navigation selon des données dans un CMS.

Créer une Cell
==============

Pour créer une cell, vous définissez une classe dans **src/View/Cell**, et un
template dans **src/Template/Cell/**. Dans cet exemple, nous ferons une cell
pour afficher le nombre de messages dans la boite de message de notification de
l'utilisateur. D'abord, créons le fichier de classe. Son contenu devrait
ressembler à ceci::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class InboxCell extends Cell
    {

        public function display()
        {
        }

    }

Sauvegardez ce fichier dans **src/View/Cell/InboxCell.php**. Comme vous pouvez
le voir, comme pour les autres classes dans CakePHP, les Cells ont quelques
conventions:

* Les Cells se trouvent dans le namespace ``App\View\Cell``. Si vous faîtes une
  cell dans un plugin, le namespace sera ``PluginName\View\Cell``.
* Les noms de classe doivent finir en Cell.
* Les classes doivent hériter de ``Cake\View\Cell``.

Nous avons ajouté une méthode vide ``display()`` à notre cell, c'est la méthode
conventionnelle par défaut pour le rendu de cell. Nous couvrirons la façon
d'utiliser les autres méthodes plus tard dans la doc. Maintenant, créons le
fichier **src/Template/Cell/Inbox/display.ctp**. Ce sera le template pour notre
nouvelle cell.

Vous pouvez générer ce bout de code rapidement en utilisant ``bake``::

    bin/cake bake cell Inbox

Générera le code que nous avons tapé.

Implémenter la Cell
-------------------

Supposons que nous travaillions sur une application qui permette aux
utilisateurs d'envoyer des messages aux autres. Nous avons un model
``Messages``, et nous voulons montrer le nombre de messages non lus sans avoir
à polluer AppController. C'est un cas d'utilisation parfait pour une cell. Dans
la classe, nous avons juste ajouté ce qui suit::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class InboxCell extends Cell
    {

        public function display()
        {
            $this->loadModel('Messages');
            $unread = $this->Messages->find('unread');
            $this->set('unread_count', $unread->count());
        }

    }

Puisque les cells utilisent ``ModelAwareTrait`` et ``ViewVarsTrait``, elles
se comportent un peu comme un controller. Nous pouvons utiliser les méthodes
``loadModel()`` et ``set()`` un peu comme nous le ferions dans un controller.
Dans notre fichier de template, ajoutons ce qui suit::

    <!-- src/Template/Cell/Inbox/display.ctp -->
    <div class="notification-icon">
        Vous avez <?= $unread_count ?> messages non lus.
    </div>

.. note::

    Les templates des cells ont une portée isolée et ne partage pas la même
    instance de View que celle utilisée pour rendre le template et le layout
    de l'action du controller courant ou d'autres cells. Ils ne sont donc pas
    au courant de tous les appels aux helpers ou aux blocs définis dans
    template / layout de l'action et vice versa.

Charger les Cells
=================

Les cells peuvent être chargées à partir des views en utilisant la méthode
``cell()`` et fonctionne de la même manière dans les deux contextes::

    // Charge une celle d'une application
    $cell = $this->cell('Inbox');

    // Charge une cell d'un plugin
    $cell = $this->cell('Messaging.Inbox');

Ce qui est au-dessus va charger la classe de cell nommée et exécuter la méthode
``display()``.
Vous pouvez exécuter d'autres méthodes en utilisant ce qui suit::

    // Lance la méthode expanded() dans la cell Inbox
    $cell = $this->cell('Inbox::expanded');

Si vous avez besoin que votre controller décide quelles cells doivent être
chargées dans une requête, vous pouvez utiliser le ``CellTrait`` dans votre
controller pour y activer la méthode ``cell()``::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\View\CellTrait;

    class DashboardsController extends AppController
    {
        use CellTrait;

        // More code.
    }

Passer des Arguments à une Cell
-------------------------------

Vous voudrez souvent paramétrer les méthodes cell pour rendre les cells plus
flexibles. En utilisant les deuxième et troisième arguments de ``cell()``, vous
pouvez passer des paramètres d'action, et des options supplémentaires à vos
classes de cell, en tableau indexé::

    $cell = $this->cell('Inbox::recent', ['-3 days']);

Ce qui est au-dessus correspondra à la signature de la fonction suivante::

    public function recent($since)
    {
    }

Afficher une Cell
=================

Une fois qu'une cell a été chargée et exécutée, vous voudrez probablement
l'afficher. La façon la plus simple pour rendre une cell est de faire une echo::

    <?= $cell ?>

Ceci va afficher le template correspondant à la version en minuscule et avec des
underscores de notre nom d'action, par exemple **display.ctp**.

Puisque les cells utilisent ``View`` pour afficher les templates, vous pouvez
charger les cells supplémentaires dans un template de cell si nécessaire.

.. note::

    L'affichage d'une cell utilise la méthode magique PHP ``__toString()`` qui
    empêche PHP de montrer le nom du fichier et le numéro de la ligne pour
    toutes les erreurs fatales levées. Pour obtenir un message d'erreur qui a
    du sens, il est recommandé d'utiliser la méthode ``Cell::render()``, par
    exemple ``<?= $cell->render() ?>``.

Afficher un Template alternatif
-------------------------------

Par convention, les cells affichent les templates qui correspondent à l'action
qu'ils exécutent. Si vous avez besoin d'afficher un template de vue différent,
vous pouvez spécifier le template à utiliser lors de l'affichage de la cell::

    // Appel de render() explicitement
    echo $this->cell('Inbox::recent', ['-3 days'])->render('messages');

    // Définit le template avant de faire un echo de la cell.
    $cell = $this->cell('Inbox'); ?>
    $cell->template = 'messages';
    echo $cell;

Mettre en Cache la Sortie de Cell
---------------------------------

Quand vous affichez une cell, vous pouvez mettre en cache la sortie rendue si
les contenus ne changent pas souvent ou pour aider à améliorer la performance
de votre application. Vous pouvez définir l'option ``cache`` lors de la création
d'une cell pour activer & configurer la mise en cache::

    // Le Cache utilisant la config par défaut et une clé générée
    $cell = $this->cell('Inbox', [], ['cache' => true]);

    // Mise en cache avec une config de cache spécifique et une clé générée
    $cell = $this->cell('Inbox', [], ['cache' => ['config' => 'cell_cache']]);

    // Spécifie la clé et la config à utiliser.
    $cell = $this->cell('Inbox', [], [
        'cache' => ['config' => 'cell_cache', 'key' => 'inbox_' . $user->id]
    ]);

Si une clé est générée, la version en underscore de la classe cell et le nom du
template seront utilisés.

.. note::

    Une nouvelle instance de ``View`` est utilisée pour retourner chaque cell et
    ces nouveaux objets ne partagent pas de contexte avec le template /layout
    principal. Chaque cell est auto-contenu et a seulement accès aux variables
    passés en arguments par l'appel de ``View::cell()``.
