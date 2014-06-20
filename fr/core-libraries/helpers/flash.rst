FlashHelper
###########

.. php:namespace:: Cake\View\Helper

.. php:class:: FlashHelper(View $view, array $config = [])

FlashHelper fournit une façon de rendre les messages flash qui sont définis dans
``$_SESSION`` par :doc:`FlashComponent </core-libraries/components/flash>`.
:doc:`FlashComponent </core-libraries/components/flash>` et FlashHelper
utilisent principalement des elements pour rendre les messages flash. Les
elements flash se trouvent dans le répertoire ``App/Template/Element/Flash``.
Vous remarquerez que le template de l'App de CakePHP est livré avec deux
elements flash: ``success.ctp`` et ``error.ctp``.

Rendre les Messages Flash
=========================

Pour rendre un message flash, vous pouvez simplement utiliser la méthode
``render()`` du FlashHelper::

    <?= $this->Flash->render() ?>

Par défaut, CakePHP utilise une clé "flash" pour les messages flash dans une
session. Mais si vous spécifiez une clé lors de la définition du message
flash dans :doc:`FlashComponent </core-libraries/components/flash>`, vous
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
    Par défaut, CakePHP n'échappe pas le HTML dans les messages flash. Si vous
    utilisez une requête ou des données d'utilisateur dans vos messages flash,
    vous devez les échapper avec :php:func:`h` lors du formatage de vos
    messages.

Pour plus d'informations sur les options de tableau disponible, merci de
consulter la section :doc:`FlashComponent </core-libraries/components/flash>`.
