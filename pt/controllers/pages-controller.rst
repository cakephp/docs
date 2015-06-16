The Pages Controller
####################

CakePHP é distribuído com o controlador **PagesController.php**. Este controlador
é simples, seu uso é opcional e normalmente usado para prover paginas estáticas.
A homepage que você vê logo depois de instalar CakePHP utiliza este contralador
e o arquivo da view fica em **src/Template/Pages/home.ctp**. Se você criar o arquivo
**src/Template/Pages/sobre.ctp** você poderá acessar em **http://example.com/pages/sobre**.
Fique a vontade de alterar este controlador para atender suas necessacidades ou
mesmo excluí-lo.

Quando você usa Composer para construir sua página este controlador vai ser criado
na pasta **src/Controller/**.

.. meta::
    :title lang=pt: O Controlador Pages
    :keywords lang=pt: pages controller,default controller,cakephp,ships,php,home page,página estática
