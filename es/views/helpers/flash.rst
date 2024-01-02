FlashHelper
###########

.. php:namespace:: Cake\View\Helper

.. php:class:: FlashHelper(View $view, array $config = [])

FlashHelper proporciona una forma de representar mensajes flash que se establecieron en
``$_SESSION`` a través de :doc:`FlashComponent </controllers/components/flash>`. Tanto
:doc:`FlashComponent </controllers/components/flash>` como FlashHelper
utilizan principalmente ``elements`` para renderizar mensajes flash.  Flash elements se pueden encontrar en
el directorio **templates/element/flash**.  Puedes notar CakePHP's App
template viene con tres elementos flash:  **success.php**, **default.php**, and
**error.php**.

Renderizando Mensajes Flash
=============================

Para renderizar un mensaje flash, puedes simplemente utilizar el método ``render()``
del FlashHelper en el template default ``templates/layout/default.php``::

    <?= $this->Flash->render() ?>

Por defecto, CakePHP utiliza un "flash" key para los mensajes flash messages en la sesión.  Sin embargo,
si has especificado un "key" al establecer el mensaje flash en
:doc:`FlashComponent </controllers/components/flash>`, puedes especificar cuál "key" de flash renderizar::

    <?= $this->Flash->render('other') ?>

También puedes sobreescribir cualquiera de las opciones establecidas en FlashComponent::

    // En el Controller
    $this->Flash->set('The user has been saved.', [
        'element' => 'success'
    ]);

    // En el template: Utilizará great_success.php en vez de success.php
    <?= $this->Flash->render('flash', [
        'element' => 'great_success'
    ]);

    // En el template: el elemento flashy del plugin "Company"
    <?= $this->Flash->render('flash', [
        'element' => 'Company.flashy'
    ]);

.. note::

    Cuando construyas algun template personalizado para mensajes flash, asegúrate de
    codificar (encode) correctamente en HTML cualquier dato del usuario.
    CakePHP no escapará  (escape) los parámetros de los mensajes flash por ti.


Para obtener más información sobre las opciones disponibles en el arreglo, consulta la sección
:doc:`FlashComponent </controllers/components/flash>`

Routing Prefix y Mensajes Flash
=================================

If you have a Routing prefix configured, ahora puedes tener tus elementos Flash almacenados en
**templates/{Prefix}/element/flash**. De esta manera, puedes tener
mensajes específicos para cada parte de tu aplicación. Por ejemplo, puedes utilizar
diferentes "layoouts" para la sección de frontend y la sección de administración.


Mensajes Flash y Tema
=========================

El The FlashHelper utiliza ``elements`` normales para renderizar los mensajes y, por lo tanto,
respetará cualquier Tema que hayas especificado. Entonces, cuando tu Tema tiene un archivo
templates/element/flash/error.php, se utilizará, al igual que con cualquier otro ``Elements`` y ``Views``.
