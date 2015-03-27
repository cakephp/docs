FlashComponent
##############

.. php:namespace:: Cake\Controller\Component

.. php:class:: FlashComponent(ComponentCollection $collection, array $config = [])

FlashComponent est un moyen de définir des messages de notifications à afficher
après avoir envoyé un formulaire ou des données connus. CakePHP appelle
ces messages des "messages flash". FlashComponent écrit les messages flash dans
``$_SESSION`` pour être affichés dans une View en utilisant
:doc:`FlashHelper </views/helpers/flash>`.

Définir les Messages Flash
==========================

FlashComponent fournit deux façons de définir des messages flash : sa méthode
magique ``__call()`` et sa méthode ``set()``. Pour remplir votre application
sématiquement, la méthode magique ``__call()`` de FlashComponent vous permet
d'utiliser un nom de méthode qui est lié à un element qui se trouve dans le
répertoire **src/Template/Element/Flash**. Par convention, les méthodes en
camelcase vont être liées à un nom d'element en minuscule et avec des
underscores (_)::

    // Utilise src/Template/Element/Flash/success.ctp
    $this->Flash->success('C\'était un succès');

    // Utilise src/Template/Element/Flash/great_success.ctp
    $this->Flash->greatSuccess('C\'était un grand succès');

De façon alternative, pour définir un message sans rendre un element,
vous pouvez utiliser la méthode ``set()``::

    $this->Flash->set('Ceci est un message');

.. versionadded:: 3.1
    Les messages Flash peuvent maintenant s'empiler. Des appels
    successifs à ``set()`` et ``__call()`` avec la même clé ajouteront les messages à
    ``$_SESSION``. Si vous souhaitez conserver l'ancien comportement (un message malgré
    plusieurs appels successifs), définissez le paramètre ``clear`` à ``true`` quand
    vous configurez le Component.

Les méthodes ``__call()`` et ``set()`` de FlashComponent prennent de façon
optionnelle un deuxième paramètre, un tableau d'options:

* ``key`` Par défaut à 'flash'. La clé du tableau trouvé sous la clé 'Flash'
  dans la session.
* ``element`` Par défaut à null, mais il va automatiquement être défini lors de
  l'utilisation de la méthode magique ``__call()``. Le nom d'element à utiliser
  pour le rendu.
* ``params`` Un tableau en option de clés/valeurs pour rendre disponible des
  variables dans un element.

.. versionadded:: 3.1
    Une nouvelle option ``clear`` a été ajoutée. Elle doit être un
    ``bool`` et vous permet de supprimer tous les messages de la pile pour en commencer
    une nouvelle.

Un exemple de l'utilisation de ces options::

    // Dans votre Controller
    $this->Flash->success("L'utilisateur a été sauvegardé", [
        'key' => 'positive',
        'params' => [
            'name' => $user->name,
            'email' => $user->email
        ]
    ]);

    // Dans votre Vue
    <?= $this->Flash->render('positive') ?>

    <!-- Dans src/Template/Element/Flash/success.ctp -->
    <div id="flash-<?= h($key) ?>" class="message-info success">
        <?= h($message) ?>: <?= h($params['name']) ?>, <?= h($params['email']) ?>.
    </div>

Notez que le paramètre ``element`` sera toujours surchargé en utilisant
``__call()``. Afin de récupérer un element spécifique d'un plugin, vous
devez définir le paramètre ``plugin``.
Par exemple::

    // Dans votre Controller
    $this->Flash->warning('My message', ['plugin' => 'PluginName']);

Le code ci-dessus va utiliser l'element warning.ctp dans
**plugins/PluginName/src/Template/Element/Flash** pour afficher le message
flash.

.. note::
    Par défaut, CakePHP n'échappe pas le HTML dans les messages flash. Si vous
    utilisez une requête ou des données d'utilisateur dans vos messages flash,
    vous devrez les échapper avec :php:func:`h` lors du formatage de vos
    messages flash.

Pour plus d'informations sur le rendu de vos messages flash, consultez la
section :doc:`FlashHelper </views/helpers/flash>`.
