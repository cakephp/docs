O Controller Pages
##################

O CakePHP já vem com um controller padrão chamado PagesController
(``lib/Cake/Controller/PagesController.php``). A página inicial que você vê logo
após a instalação é gerada usando este controller. Este controller é geralmente
usado para servir páginas estáticas. Ex. Se você fez uma view
``app/View/Pages/sobre_nos.ctp``, você pode acessá-la usando a seguinte URL
http://example.com/pages/sobre\_nos

Quando você constrói uma aplicação utilizando o console "bake" o controller
Pages é copiado para seu diretório app/Controller/ e você pode modificá-lo se
for preciso. Ou você pode fazer uma cópia do arquivo PagesController.php da
pasta lib/Cake para seu diretório app/Controller/ existente.

.. warning::

    Não modifique nenhum arquivo dentro do diretório ``Cake`` diretamente para
    evitar problemas futuros quando for atualizar o núcleo do framework CakePHP.
