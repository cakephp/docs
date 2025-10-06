Inflector
#########

.. php:namespace:: Cake\Utility

.. php:class:: Inflector

A classe Inflector pega uma string e pode manipulá-la para lidar com variações de palavras
como pluralização ou camelização e normalmente é acessada
estaticamente. Exemplo:
``Inflector::pluralize('example')`` retorna "examples".

Você pode testar as inflexões online em `inflector.cakephp.org
<https://inflector.cakephp.org/>`_ ou `sandbox.dereuromark.de
<https://sandbox.dereuromark.de/sandbox/inflector>`_.

.. _inflector-methods-summary:

Resumo dos Métodos do Inflector e Suas Saídas
==============================================

Resumo rápido dos métodos integrados do Inflector e os resultados que eles produzem
quando fornecido um argumento com várias palavras:

+-------------------+---------------+---------------+
| Método            | Argumento     | Saída         |
+===================+===============+===============+
| ``pluralize()``   | BigApple      | BigApples     |
+                   +---------------+---------------+
|                   | big_apple     | big_apples    |
+-------------------+---------------+---------------+
| ``singularize()`` | BigApples     | BigApple      |
+                   +---------------+---------------+
|                   | big_apples    | big_apple     |
+-------------------+---------------+---------------+
| ``camelize()``    | big_apples    | BigApples     |
+                   +---------------+---------------+
|                   | big apple     | BigApple      |
+-------------------+---------------+---------------+
| ``underscore()``  | BigApples     | big_apples    |
+                   +---------------+---------------+
|                   | Big Apples    | big apples    |
+-------------------+---------------+---------------+
| ``humanize()``    | big_apples    | Big Apples    |
+                   +---------------+---------------+
|                   | bigApple      | BigApple      |
+-------------------+---------------+---------------+
| ``classify()``    | big_apples    | BigApple      |
+                   +---------------+---------------+
|                   | big apple     | BigApple      |
+-------------------+---------------+---------------+
| ``dasherize()``   | BigApples     | big-apples    |
+                   +---------------+---------------+
|                   | big apple     | big apple     |
+-------------------+---------------+---------------+
| ``tableize()``    | BigApple      | big_apples    |
+                   +---------------+---------------+
|                   | Big Apple     | big apples    |
+-------------------+---------------+---------------+
| ``variable()``    | big_apple     | bigApple      |
+                   +---------------+---------------+
|                   | big apples    | bigApples     |
+-------------------+---------------+---------------+

Criando Formas Plural e Singular
=================================

.. php:staticmethod:: singularize($singular)
.. php:staticmethod:: pluralize($singular)

Tanto ``pluralize`` quanto ``singularize()`` funcionam na maioria dos substantivos em inglês. Se você precisa
suportar outros idiomas, você pode usar :ref:`inflection-configuration` para
personalizar as regras usadas::

    // Apples
    echo Inflector::pluralize('Apple');

.. note::

    ``pluralize()`` não deve ser usado em um substantivo que já está em sua forma plural.

.. code-block:: php

    // Person
    echo Inflector::singularize('People');

.. note::

    ``singularize()`` não deve ser usado em um substantivo que já está em sua forma singular.

Criando Formas CamelCase e under_scored
========================================

.. php:staticmethod:: camelize($underscored)
.. php:staticmethod:: underscore($camelCase)

Esses métodos são úteis ao criar nomes de classes ou nomes de propriedades::

    // ApplePie
    Inflector::camelize('Apple_pie')

    // apple_pie
    Inflector::underscore('ApplePie');

Deve-se notar que underscore converterá apenas palavras formatadas em camelCase.
Palavras que contêm espaços serão colocadas em minúsculas, mas não conterão um
underscore.

Criando Formas Legíveis para Humanos
=====================================

.. php:staticmethod:: humanize($underscored)

Este método é útil ao converter formas com underscore em formas "Title Case"
para valores legíveis por humanos::

    // Apple Pie
    Inflector::humanize('apple_pie');

Criando Formas de Nome de Tabela e Classe
==========================================

.. php:staticmethod:: classify($underscored)
.. php:staticmethod:: dasherize($dashed)
.. php:staticmethod:: tableize($camelCase)

Ao gerar código ou usar as convenções do CakePHP, você pode precisar inflexionar
nomes de tabelas ou nomes de classes::

    // UserProfileSetting
    Inflector::classify('user_profile_settings');

    // user-profile-setting
    Inflector::dasherize('UserProfileSetting');

    // user_profile_settings
    Inflector::tableize('UserProfileSetting');

Criando Nomes de Variáveis
===========================

.. php:staticmethod:: variable($underscored)

Nomes de variáveis são frequentemente úteis ao fazer tarefas de meta-programação que envolvem
gerar código ou fazer trabalho baseado em convenções::

    // applePie
    Inflector::variable('apple_pie');


.. _inflection-configuration:

Configuração de Inflexão
=========================

As convenções de nomenclatura do CakePHP podem ser realmente boas - você pode nomear sua tabela
de banco de dados ``big_boxes``, seu modelo ``BigBoxes``, seu controller
``BigBoxesController``, e tudo funciona junto automaticamente. A
maneira como o CakePHP sabe como unir as coisas é *inflexionando* as palavras
entre suas formas singular e plural.

Há ocasiões (especialmente para nossos amigos que não falam inglês) em que você
pode se deparar com situações em que o inflector do CakePHP (a classe que pluraliza,
singulariza, cameliza e usa under\_scores) pode não funcionar como você gostaria. Se
o CakePHP não reconhecer seus Foci ou Fish, você pode informar ao CakePHP sobre seus
casos especiais.

Carregando Inflexões Personalizadas
------------------------------------

.. php:staticmethod:: rules($type, $rules, $reset = false)

Defina novas regras de inflexão e transliteração para o Inflector usar. Frequentemente,
este método é usado em seu **config/bootstrap.php**::

    Inflector::rules('singular', ['/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta']);
    Inflector::rules('uninflected', ['singulars']);
    Inflector::rules('irregular', ['phylum' => 'phyla']); // A chave é a forma singular, o valor é a forma plural

As regras fornecidas serão mescladas nos respectivos conjuntos de inflexão definidos em
``Cake/Utility/Inflector``, com as regras adicionadas tendo precedência sobre as regras
principais. Você pode usar ``Inflector::reset()`` para limpar regras e restaurar o
estado original do Inflector.

.. meta::
    :title lang=pt: Inflector
    :keywords lang=pt: apple orange,word variations,apple pie,person man,latin versions,profile settings,php class,initial state,puree,slug,apples,oranges,user profile,underscore
