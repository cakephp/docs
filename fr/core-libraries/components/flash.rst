Flash
#####

.. php:class:: FlashComponent(ComponentCollection $collection, array $config = array())

.. versionadded:: 2.7.0 en replacement de :php:meth:`SessionHelper::flash()`

FlashComponent est un moyen de définir des messages de notifications à afficher
après avoir envoyé un formulaire ou des données connus. CakePHP appelle
ces messages des "messages flash". FlashComponent écrit les messages flash dans
``$_SESSION`` pour être affichés dans une View en utilisant
:doc:`FlashHelper </core-libraries/helpers/flash>`.

FlashComponent remplace la méthode ``setFlash()`` de ``SessionComponent``
et doit être utilisé à la place de cette méthode.

Définir les Messages Flash
==========================

FlashComponent fournit deux façons pour définir les messages flash: sa méthode
magique ``__call`` et sa méthode ``set()``.

Pour utiliser le gestionnaire de message flash par défaut, vous pouvez utiliser
la méthode ``set()``::

    $this->Flash->set('Ceci est un message');

.. versionadded:: 2.10.0

    Les messages Flash peuvent maintenant s'empiler. Des appels
    successifs à ``set()`` et ``__call()`` avec la même clé ajouteront les messages à
    ``$_SESSION``. Si vous souhaitez conserver l'ancien comportement (un message malgré
    plusieurs appels successifs), définissez le paramètre ``clear`` à ``true`` quand
    vous configurez le Component.

Pour créer des elements Flash personnalisés, la méthode magique ``__call``
de FlashComponent vous permet d'utiliser un nom de méthode qui est lié à un
element qui se trouve dans le répertoire ``app/View/Elements/Flash``. Par
convention, les méthodes en camelcase vont être liées à un nom d'element en
minuscule et avec des underscores (_)::

    // Utilise app/View/Elements/Flash/success.ctp
    $this->Flash->success('C\'était un succès');

    // Utilise app/View/Elements/Flash/great_success.ctp
    $this->Flash->greatSuccess('C\'était un grand succès');

Les méthodes ``__call`` et ``set()`` de FlashComponent prennent de façon
optionnelle un deuxième paramètre, un tableau d'options:

* ``key`` Par défaut à 'flash'. La clé du tableau trouvé sous la clé 'Flash'
  dans la session.
* ``element`` Par défaut à null, mais il va automatiquement être défini lors de
  l'utilisation de la méthode magique ``__call``. Le nom d'element à utiliser
  pour le rendu.
* ``params`` Un tableau en option de clés/valeurs pour rendre disponible des
  variables dans un element.
* ``clear`` Définissez à ``true`` pour supprimer les messages flashs existants
  pour la clé / l'élément spécifié. (Ajoutée dans la version 2.10.0).

Un exemple de l'utilisation de ces options::

    // Dans votre Controller
    $this->Flash->success('The user has been saved', array(
        'key' => 'positive',
        'params' => array(
            'name' => $user['User']['name'],
            'email' => $user['User']['email']
        )
    ));

    // Dans votre Vue
    <?php echo $this->Flash->render('positive') ?>

    <!-- Dans app/View/Elements/Flash/success.ctp -->
    <div id="flash-<?php echo h($key) ?>" class="message-info success">
        <?php echo h($message) ?>: <?php echo h($params['name']) ?>, <?php echo h($params['email']) ?>.
    </div>

Si vous utilisez la méthode magique ``__call()``, l'option ``element`` sera
toujours remplacée. Afin de récupérer un element spécifique d'un plugin, vous
devez définir le paramètre ``plugin``. Par exemple::

    // Dans votre Controller
    $this->Flash->warning('My message', array('plugin' => 'PluginName'));

Le code ci-dessus va utiliser l'element warning.ctp dans
``plugins/PluginName/View/Elements/Flash`` pour afficher le message
flash.

.. note::
    Par défaut, CakePHP n'échappe pas le HTML dans les messages flash. Si vous
    utilisez une requête ou des données d'utilisateur dans vos messages flash,
    vous devrez les échapper avec :php:func:`h` lors du formatage de vos
    messages flash.

Pour plus d'informations sur le rendu de vos messages flash, consultez la
section :doc:`FlashHelper </core-libraries/helpers/flash>`.
