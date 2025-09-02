5.0 Guia de atualização
#######################

Primeiro, verifique se seu aplicativo está sendo executado na versão mais recente do CakePHP 4.x.

Corrigir Avisos de Descontinuação
=================================

Depois que seu aplicativo estiver sendo executado na versão mais recente do CakePHP 4.x, 
habilite os avisos de descontinuação em **config/app.php**::

    'Error' => [
        'errorLevel' => E_ALL,
    ]

Agora que você pode ver todos os avisos, certifique-se de que eles sejam corrigidos antes de prosseguir com a atualização.

Algumas descontinuações potencialmente impactantes que você deve ter certeza de ter abordado
são:

- ``Table::query()`` foi descontinuado na versão 4.5.0. Em vez disso, use ``selectQuery()``,
  ``updateQuery()``, ``insertQuery()`` e ``deleteQuery()``.

Atualizar para PHP 8.1
======================

Se você não estiver usando **PHP 8.1 ou superior**, será necessário atualizar o PHP antes de atualizar o CakePHP.

.. note::
    O CakePHP 5.0 requer **no mínimo PHP 8.1**.

.. _upgrade-tool-use:

Use a Ferramenta de Atualização
===============================

.. note::
    A ferramenta de atualização só funciona em aplicativos que executam a versão mais recente do CakePHP 4.x. 
    Você não pode executar a ferramenta de atualização após atualizar para o CakePHP 5.0.

Como o CakePHP 5 utiliza tipos de união e ``mixed``, há muitas
mudanças incompatíveis com versões anteriores relacionadas a assinaturas de métodos e renomeação de arquivos.
Para ajudar a agilizar a correção dessas mudanças tediosas, existe uma ferramenta de CLI de atualização:

.. code-block:: console

    # Install the upgrade tool
    git clone https://github.com/cakephp/upgrade
    cd upgrade
    git checkout 5.x
    composer install --no-dev

Com a ferramenta de atualização instalada, você pode executá-la em seu aplicativo ou
plugin::

    bin/cake upgrade rector --rules cakephp50 <path/to/app/src>
    bin/cake upgrade rector --rules chronos3 <path/to/app/src>

Atualizar Dependência do CakePHP
================================

Após aplicar as refatorações do rector, você precisa atualizar o CakePHP, seus plugins, o PHPUnit
e talvez outras dependências no seu ``composer.json``.
Este processo depende muito da sua aplicação, por isso recomendamos que você compare o seu
``composer.json`` com o que está presente em `cakephp/app
<https://github.com/cakephp/app/blob/5.x/composer.json>`__.

Após as strings de versão serem ajustadas em seu ``composer.json``, execute
``composer update -W`` e verifique sua saída.

Atualizar arquivos do aplicativo com base no modelo de aplicativo mais recente
==============================================================================

Em seguida, certifique-se de que o restante do seu aplicativo foi atualizado para se basear na
versão mais recente de `cakephp/app
<https://github.com/cakephp/app/blob/5.x/>`__.
