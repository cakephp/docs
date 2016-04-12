Inflector
#########

.. php:namespace:: Cake\Utility

.. php:class:: Inflector

A classe ``Inflector`` recebe uma string e a manipula afim de suportar variações
de palavas como pluralizações ou CamelCase e normalmente é acessada
estaticamente. Exemplo:
``Inflector::pluralize('example')`` retorna "examples".

Você pode testar as inflexões em `inflector.cakephp.org
<http://inflector.cakephp.org/>`_.

Criando as formas singulares e plurais
======================================

.. php:staticmethod:: singularize($singular)
.. php:staticmethod:: pluralize($singular)

Tanto ``pluralize()`` quanto ``singularize()`` funcionam para a maioria dos
substantivos do Inglês. Caso seja necessário o suporte para outras línguas,
você pode usar :ref:`inflection-configuration` para personalizar as regras usadas::

    // Apples
    echo Inflector::pluralize('Apple');

.. note::
    ``pluralize()`` pode não funcionar corretamente nos casos onde um substantivo já
    esteja em sua forma plural.

.. code-block:: php

    // Person
    echo Inflector::singularize('People');

.. note::
    ``singularize()`` pode não funcionar corretamente nos casos onde um substantivo já
    esteja em sua forma singular.

Criando as formas CamelCase e nome_sublinhado
=============================================

.. php:staticmethod:: camelize($underscored)
.. php:staticmethod:: underscore($camelCase)

Estes métodos são úteis para a criação de nomes de classe ou de propriedades::

    // ApplePie
    Inflector::camelize('Apple_pie')

    // apple_pie
    Inflector::underscore('ApplePie');

É importante ressaltar que ``underscore()`` irá converter apenas palavras formatadas
em CamelCase. Palavras com espaços serão convertidas para caixa baixa, mas não serão
separadas por sublinhado.

Criando formas legíveis para humanos
====================================

.. php:staticmethod:: humanize($underscored)

Este método é útil para converter da forma sublinhada para o "Formato Título" para
a leitura humana::

    // Apple Pie
    Inflector::humanize('apple_pie');

Criando formatos para nomes de tabelas e classes
================================================

.. php:staticmethod:: classify($underscored)
.. php:staticmethod:: dasherize($dashed)
.. php:staticmethod:: tableize($camelCase)

Ao gerar o código ou usar as convenções do CakePHP, você pode precisar inferir
os nomes das tabelas ou classes::

    // UserProfileSettings
    Inflector::classify('user_profile_settings');

    // user-profile-setting
    Inflector::dasherize('UserProfileSetting');

    // user_profile_settings
    Inflector::tableize('UserProfileSetting');

Criando nomes de variáveis
==========================

.. php:staticmethod:: variable($underscored)

Nomes de variáveis geralmente são úteis em tarefas de meta-programação que 
involvem a geração de código ou rotinas baseadas em convenções::

    // applePie
    Inflector::variable('apple_pie');

Criando strings de URL seguras
==============================

.. php:staticmethod:: slug($word, $replacement = '-')

``slug()`` converte caracteres especiais em suas versões normais e converte
os caracteres não encontrados e espaços em traços. O método ``slug()`` espera
que a codificação seja UTF-8::

    // apple-puree
    Inflector::slug('apple purée');

.. note::
    ``Inflector::slug()`` foi depreciado desde a versão 3.2.7. Procure usar ``Text::slug()``
    de agora em diante.

.. _inflection-configuration:

Configuração da inflexão
========================

As convenções de nomes do CakePHP podem ser bem confortáveis. Você pode nomear sua
tabela no banco de dados como ``big_boxes``, seu modelo como ``BigBoxes``, seu
controlador como ``BigBoxesController`` e tudo funcionará automaticamente. O CakePHP
entrelaça todos estes conceitos através da inflexão das palavras em suas formas
singulares e plurais.

Porém ocasionalmente (especialmente para os nossos amigos não Anglófonos) podem encontrar
situações onde o infletor do CakePHP (a classe que pluraliza, singulariza, transforma em
CamelCase e em nome\_sublinhado) não funciona como você gostaria. Caso o CakePHP não
reconheça seu "quaisquer" ou "lápis", você pode ensiná-lo a entender seus casos especiais.

Carregando inflexões personalizadas
-----------------------------------

.. php:staticmethod:: rules($type, $rules, $reset = false)

Define novas inflexões e transliterações para o ``Inflector`` usar. Geralmente este método
deve ser chamado no seu **config/bootstrap.php**::

    Inflector::rules('singular', ['/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta']);
    Inflector::rules('uninflected', ['singulars']);
    Inflector::rules('irregular', ['phylum' => 'phyla']); // The key is singular form, value is plural form

As regras ditadas por este método serão agregadas aos conjuntos de inflexão definidos em ``Cake/Utility/Inflector``,
onde elas terão prioridade sobre as regras já declaradas por padrão. Você pode usar ``Inflector::reset()``
para limpar todas as regras e retornar o ``Inflector`` para seu estado original.

.. meta::
    :title lang=pt: Inflector
    :keywords lang=en: apple orange,word variations,apple pie,person man,latin versions,profile settings,php class,initial state,puree,slug,apples,oranges,user profile,underscore
    :keywords lang=pt: inflexão, infletor, variações de palavras, caracteres especiais, conversão, sublinhado, variações, plural, pluralização, singular, singularização, regras, urls seguras
