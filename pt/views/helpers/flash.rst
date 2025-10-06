Flash
#####

.. php:namespace:: Cake\View\Helper

.. php:class:: FlashHelper(View $view, array $config = [])

O FlashHelper fornece uma maneira de renderizar mensagens flash que foram definidas em
``$_SESSION`` pelo :doc:`FlashComponent </controllers/components/flash>`.
:doc:`FlashComponent </controllers/components/flash>` e FlashHelper
usam principalmente elements para renderizar mensagens flash. Elements de flash são encontrados no
diretório **templates/element/flash**. Você notará que o template App
do CakePHP vem com três elements de flash: **success.php**, **default.php**, e
**error.php**.

Renderizando Mensagens Flash
=============================

Para renderizar uma mensagem flash, você pode simplesmente usar o método ``render()``
do FlashHelper no seu arquivo de template::

    <?= $this->Flash->render() ?>

Por padrão, o CakePHP usa uma chave "flash" para mensagens flash em uma sessão. Mas, se
você especificou uma chave ao definir a mensagem flash no
:doc:`FlashComponent </controllers/components/flash>`, você pode especificar qual
chave flash renderizar::

    <?= $this->Flash->render('other') ?>

Você também pode sobrescrever qualquer uma das opções que foram definidas no FlashComponent::

    // No seu Controller
    $this->Flash->set('The user has been saved.', [
        'element' => 'success'
    ]);

    // No seu arquivo de template: Usará great_success.php ao invés de success.php
    <?= $this->Flash->render('flash', [
        'element' => 'great_success'
    ]);

    // No seu arquivo de template: o arquivo element flashy do Plugin Company
    <?= $this->Flash->render('flash', [
        'element' => 'Company.flashy'
    ]);

.. note::

    Ao construir templates de mensagens flash personalizadas, certifique-se de codificar adequadamente
    qualquer dado do usuário em HTML. O CakePHP não escapará parâmetros de mensagens flash para você.


Para mais informações sobre as opções de array disponíveis, consulte a seção
:doc:`FlashComponent </controllers/components/flash>`.

Prefixo de Roteamento e Mensagens Flash
========================================

Se você tem um prefixo de roteamento configurado, agora você pode ter seus elements de Flash
armazenados em **templates/{Prefix}/element/flash**. Dessa forma, você pode ter
layouts de mensagens específicos para cada parte da sua aplicação. Por exemplo, usando
layouts diferentes para sua seção front-end e admin.

Mensagens Flash e Temas
========================

O FlashHelper usa elements normais para renderizar as mensagens e, portanto,
obedecerá a qualquer tema que você possa ter especificado. Então, quando seu tema tiver um
arquivo **templates/element/flash/error.php**, ele será usado, assim como com qualquer
Elements e Views.

.. meta::
    :title lang=pt: FlashHelper
    :description lang=pt: O FlashHelper fornece uma maneira de renderizar mensagens flash.
    :keywords lang=pt: flash helper,cakephp flash,flash messages
