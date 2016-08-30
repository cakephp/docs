I18N shell
##########

A internacionalização no CakePHP é realizada através de
`arquivos po <https://pt.wikipedia.org/wiki/Gettext>`_. Isto faz com que seja
fácil utilizar ferramentas como o `poedit <http://www.poedit.net/>`_ e outras.

O shell i18n (é chamado de i18n pois é derivado da palavra inglesa
internationalization, que inicia com a letra i, termina com a letra n e possui
18 letras entre a letra inicial e a letra final) provê um jeito simples e fácil
de gerar modelos de arquivos po. Estes modelos podem ser enviados a tradutores
para então realizar as traduções dos textos da sua aplicação. Depois das
traduções feitas, os arquivos pot podem ser mesclados com arquivos de traduções
existentes para ajudar a atualizar suas traduções.

Gerando arquivos POT
====================

Para gerar arquivos POT para uma aplicação existente, você pode utilizar o
comando ``extract``. Este comando irá escanear sua aplicação inteira em busca de
chamadas de funções no estilo ``__()``, e então extrairá todas as strings
passadas como argumento para estas funções. Cada string única em sua aplicação
será combinada em um único arquivo POT::

    ./Console/cake i18n extract

O comando acima irá executar o shell de extração. Além de extrair as strings em
``__()``, mensagens de validação em models também serão extraídas. O resultado
deste comando será um arquivo ``app/Locale/default.pot``. Você pode usar o
arquivo pot como um modelo para criar arquivos po. Se você estiver criando
arquivos po manualmente, assegure-se de setar a linha de cabeçalho
``Plural-Forms``.

Gerando arquivos POT para plugins
---------------------------------

Você pode gerar arquivos POT para um plugin específico usando::

    ./Console/cake i18n extract --plugin <Plugin>

Isto irá gerar os arquivos POT necessários utilizados nos plugins.

Mensagens de validação de models
--------------------------------

Você pode definir o domínio que será utilizado para as mensagens de validação
extraídas em seu model. Se o model já tiver uma propriedade
``$validationDomain``, o domínio informado será ignorado::

    ./Console/cake i18n extract --validation-domain validation_errors

Você também pode impedir o shell de extrair mensagens de validação::

    ./Console/cake i18n extract --ignore-model-validation


Excluindo pastas
----------------

Você pode passar uma lista separada por vírgula de pastas que você deseja que
sejam excluídas. Qualquer caminho que conter um segmento de caminho com os
valores fornecidos será ignorado::

    ./Console/cake i18n extract --exclude Test,Vendor

Ignorando os avisos de substituição para arquivos POT existentes
----------------------------------------------------------------
.. versionadded:: 2.2

Ao adicionar `` --overwrite``, o shell script não irá avisá-lo se um arquivo POT
já existe e irá substituir por padrão::

    ./Console/cake i18n extract --overwrite

Extraindo mensagens das bibliotecas do CakePHP
----------------------------------------------
.. versionadded:: 2.2

Por padrão, o shell script de extração irá perguntar se você deseja extrair as
mensagens utilizadas no núcleo do CakePHP. Defina a opção  ``--extract-core``
para ``yes`` ou ``no`` para definir o comportamento padrão::

    ./Console/cake i18n extract --extract-core yes

    ou

    ./Console/cake i18n extract --extract-core no




Criar as tabelas utilizadas pelo TranslateBehavior
==================================================

O shell i18n também pode ser utilizado para inicializar as tabelas padrão
utilizadas pelo :php:class:`TranslateBehavior`::

    ./Console/cake i18n initdb

Isto irá criar a tabela ``i18n`` utilizada pelo translate behavior.


.. meta::
    :title lang=pt: I18N shell
    :keywords lang=pt: pot files,locale default,translation tools,message string,app locale,php class,validation,i18n,translations,shell,models
