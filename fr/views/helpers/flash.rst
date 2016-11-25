Flash
#####

.. php:namespace:: Cake\View\Helper

.. php:class:: FlashHelper(View $view, array $config = [])

FlashHelper fournit une façon de rendre les messages flash qui sont définis dans
``$_SESSION`` par :doc:`FlashComponent </controllers/components/flash>`.
:doc:`FlashComponent </controllers/components/flash>` et FlashHelper
utilisent principalement des elements pour rendre les messages flash. Les
elements flash se trouvent dans le répertoire **src/Template/Element/Flash**.
Vous remarquerez que le template de l'App de CakePHP est livré avec deux
elements flash: **success.ctp** et **error.ctp**.

Rendre les Messages Flash
=========================

Pour rendre un message flash, vous pouvez simplement utiliser la méthode
``render()`` du FlashHelper::

    <?= $this->Flash->render() ?>

Par défaut, CakePHP utilise une clé "flash" pour les messages flash dans une
session. Mais si vous spécifiez une clé lors de la définition du message
flash dans :doc:`FlashComponent </controllers/components/flash>`, vous
pouvez spécifier la clé flash à rendre::

    <?= $this->Flash->render('other') ?>

Vous pouvez aussi surcharger toutes les options qui sont définies dans
FlashComponent::

    // Dans votre Controller
    $this->Flash->set('The user has been saved.', [
        'element' => 'success'
    ]);

    // Dans votre View: Va utiliser great_success.ctp au lieu de succcess.ctp
    <?= $this->Flash->render('flash', [
        'element' => 'great_success'
    ]);

.. note::

    Quand vous construisez vos propres templates de messages flash, assurez-
    vous de correctement encoder les données utilisateurs. CakePHP n'échappera
    pas les paramètres passés aux templates des messages flash pour vous.

.. versionadded:: 3.1

    Le :doc:`FlashComponent </controllers/components/flash>` empile maintenant
    les messages. Si vous définissez plusieurs messages, lors d'un appel à
    ``render()``, chaque message sera rendu dans son élément, dans l'ordre
    dans lequel les messages ont été définis.

Pour plus d'informations sur le tableau d'options disponibles, consultez la
section :doc:`FlashComponent </controllers/components/flash>`.

Préfixe de Routage et Messages Flash
====================================

.. versionadded:: 3.0.1

Si vous avez configuré un préfixe de Routage, vous pouvez maintenant stocker vos
elements de messages Flash dans **src/Template/{Prefix}/Element/Flash**. De
cette manière, vous pouvez avoir des layouts de messages spécifiques en
fonction des différentes parties de votre application (par exemple, avoir des
layouts différents pour votre front-end et votre administration).

Les Messages Flash et les Themes
================================

FlashHelper utilise des elements normaux pour afficher les messages et va donc
correspondre à n'importe quel thème que vous avez éventuellement spécifié. Donc
quand votre thème a un fichier **src/Template/Element/Flash/error.ctp**, il sera
utilisé, comme avec tout Element et View.
