Protection de Formulaire
########################

.. php:class:: FormProtection(ComponentCollection $collection, array $config = [])

Le Component FormProtection fournit une protection contre l'altération des
données de formulaire.

Comme tous les components, il dispose de plusieurs paramèters de configuration.
Chacune de ces propriétés peut être définie directement ou par des *setters* du
même nom, dans les méthodes ``initialize()`` ou ``beforeFilter()`` de votre
controller.

Si vous utilisez d'auutres components qui traitent des données de formulaire
dans leurs callbacks ``startup()``, veillez à placer le Component FormProtection
avant ceux-ci dans votre méthode ``initialize()``.

.. note::

    Quand vous utilisez le Component FormProtection vous **devez** utiliser le
    FormHelper pour créer vos formulaires. De plus, vous **ne devez pas**
    réécrire les attributs "name" des champs. Le Component FormProtection
    observe certains indicateurs créés et gérés par le FormHelper (en
    particulier ceux qui sont créés dans
    :php:meth:`~Cake\\View\\Helper\\FormHelper::create()` et
    :php:meth:`~Cake\\View\\Helper\\FormHelper::end()`). L'altération dynamique
    des champs soumis dans une requête POST (par exemple désactiver, supprimer
    ou créer de nouveaux champs via JavaScript) est susceptible d'entraîner
    l'échec de validation du jeton de formulaire.

Prévention des altérations de formulaire
========================================

Par défaut, le ``FormProtectionComponent`` empêche certaines altérations de
formulaire par les utilisateurs. Il les empêche:

* de modifier l'action du formulaire (URL)
* d'ajouter des champs inconnus
* de supprimer des champs du formulaire
* de modifier des valeurs dans des inputs cachés.

La prévention de ces altérations fonctionne en collaboration avec le
``FormHelper``, et consiste à tracer les champs du formulaire. Les valeurs des
champs cachés sont également tracées. Toutes ces données sont hachées, et des
jetons cachés sont insérés automatiquement dans le formulaire. Quand le
formulaire est transmis, le ``FormProtectionComponent`` utilise les données POST
pour reconstruire la même structure et comparer le hash.

.. note::

    Le FormProtectionComponent **n'empêchera pas** l'ajout et la modification
    d'options dans les select. Il n'empêchera pas non plus l'ajout ou la
    modification d'options radio.

Utilisation
===========

La configuration du component security se fait générallement dans les callbacks
``initialize()`` ou ``beforeFilter()`` du controller.

Les options possibles sont:

validate
    Définir à ``false`` pour passer complètement la validation des requêtes
    POST, désactivant de fait l'essentiel de la validation de formulaires.

unlockedFields
    Défini comme une liste de champs à exclure de la validation POST. Les champs
    peuvent être déverrouillés (*unlocked*) soit dans le Component, soit avec
    :php:meth:`FormHelper::unlockField()`. Les champs déverrouillés peuvent être
    absents du POST et les valeurs des champs cachés déverrouillés ne sont pas
    vérifiées.

unlockedActions
    Actions à exclure des vérifications de validation de POST.

validationFailureCallback
    Callback à appeler en cas d'échec de validation. Doit être une Closure
    valide. Non défini par défaut, auquel cas une exception est lancée en cas
    d'échec de validation.

Désactiver les vérifications d'altération de formulaire
=======================================================

::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();

            $this->loadComponent('FormProtection');
        }

        public function beforeFilter(EventInterface $event)
        {
            parent::beforeFilter($event);

            if ($this->request->getParam('prefix') === 'Admin') {
                $this->FormProtection->setConfig('validate', false);
            }
        }
    }

L'exemple ci-dessus désactiverait la prévention d'altération de formulaire pour
les routes préfixées par ``Admin``.

Désactiver l'altération de formulaire pour certaines actions
============================================================

Il peut y avoir des cas dans lesquels vous voudrez désactiver la prévention
d'altération de formulaire pour une action (par exemple des requêtes AJAX). Vous
pouvez "déverrouiller" ces actions en les listant dans
``$this->Security->unlockedActions`` dans votre ``beforeFilter()``::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('FormProtection');
        }

        public function beforeFilter(EventInterface $event)
        {
            parent::beforeFilter($event);

            $this->FormProtection->setConfig('unlockedActions', ['edit']);
        }
    }

Cet exemple désactiverait toutes les vérifications de sécurité pour l'action
``edit``.

Gestion des échecs de validation par des callbacks
==================================================

Si la validation de protection du formulaire échoue, elle renverra par défaut
une erreur 400. Vous pouvez configurer ce comportement en définissant l'option
de configuration ``validationFailureCallback`` vers une fonction callback du
controller.

En configurant une méthode de callback, vous pouvez personnaliser le mode de
fonctionnement de la gestion d'erreur::

    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);

        $this->FormProtection->setConfig(
            'validationFailureCallback',
            function (BadRequestException $exception) {
                // Vous pouvez soit renvoyer une instance response, soit lever
                // l'exception reçue en argument.
            }
        );
    }

.. meta::
    :title lang=fr: FormProtection
    :keywords lang=en: configurable parameters,form protection component,configuration parameters,protection features,tighter security,php class,meth,array,submission,security class,disable security,unlockActions
