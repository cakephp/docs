Flash
#####

.. php:class:: FlashHelper(View $view, array $config = array())

FlashHelper fournit une façon de rendre les messages flash qui sont définis dans
``$_SESSION`` par :doc:`FlashComponent </core-libraries/components/flash>`.
:doc:`FlashComponent </core-libraries/components/flash>` et FlashHelper
utilisent principalement des elements pour rendre les messages flash. Les
elements flash se trouvent dans le répertoire ``app/View/Elements/Flash``.
Vous remarquerez que le template de l'App de CakePHP est livré avec deux
elements flash: ``success.ctp`` et ``error.ctp``.

FlashHelper remplace la méthode ``flash()`` de ``SessionHelper``
et doit être utilisé à la place de cette méthode.

Rendre les Messages Flash
=========================

Pour afficher un message flash, vous pouvez simplement utiliser la méthode
``render()`` du FlashHelper::

    <?php echo $this->Flash->render() ?>

Par défaut, CakePHP utilise une clé "flash" pour les messages flash dans une
session. Mais si vous spécifiez une clé lors de la définition du message
flash dans :doc:`FlashComponent </core-libraries/components/flash>`, vous
pouvez spécifier la clé flash à rendre::

    <?php echo $this->Flash->render('other') ?>

Vous pouvez aussi surcharger toutes les options qui sont définies dans
FlashComponent::

    // Dans votre Controller
    $this->Flash->set('The user has been saved.', array(
        'element' => 'success'
    ));

    // Dans votre View: Va utiliser great_success.ctp au lieu de success.ctp
    <?php echo $this->Flash->render('flash', array(
        'element' => 'great_success'
    ));

.. note::
    Par défaut, CakePHP n'échappe pas le HTML dans les messages flash. Si vous
    utilisez une requête ou des données d'utilisateur dans vos messages flash,
    vous devez les échapper avec :php:func:`h` lors du formatage de vos
    messages.

Pour plus d'informations sur le tableau d'options disponibles, consultez la
section :doc:`FlashComponent </core-libraries/components/flash>`.

.. meta::
    :title lang=fr: FlashHelper
    :description lang=fr: FlashHelper fournit une façon de rendre les messages flash qui sont définis dans $_SESSION par FlashComponent.
    :keywords lang=fr: flash helper,message,cakephp,element,session
