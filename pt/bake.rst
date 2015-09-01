Bake Console
############

O bake console do CakePHP é outro empenho para você ter o CakePHP configurado
e funcionando rápido. O bake console pode criar qualquer ingrediente básico do
CakePHP: models, behaviors, views, helpers, components, test cases, fixtures e
plugins. E nós não estamos apenas falando de classes esqueleto: O Bake pode
criar uma aplicação totalmente funcional em questão de minutos. De fato, o Bake
é um passo natural a se dar uma vez que a aplicação tem seu alicerce construído.

Instalação
==========

Antes de tentar usar ou extender o bake, tenha certeza que ele está instalado em
sua aplicação. O bake é distribuído como um plugin que você pode instalar com o
Composer::

    composer require --dev cakephp/bake:~1.0

Isto irá instalar o bake como uma dependência de desenvolvimento, sendo assim,
não instalado quando em um ambiente de produção. As seções a seguir cobrem o uso
do bake com mais detalhes:

.. toctree::
    :maxdepth: 1

    bake/usage
    bake/development

.. meta::
    :title lang=pt: Bake Console
    :keywords lang=pt: cli,linha de comando,command line,dev,desenvolvimento,bake view, bake syntax,erb tags,asp tags,percent tags
