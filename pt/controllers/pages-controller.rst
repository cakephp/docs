O Pages Controller
##################

CakePHP é distribuído com o controller **PagesController.php**. Esse controller
é simples, seu uso é opcional e normalmente direcionado a prover páginas
estáticas. A homepage que você vê logo depois de instalar o CakePHP utiliza esse
controller e o arquivo da view fica em **src/Template/Pages/home.php**. Se você
criar o arquivo **src/Template/Pages/about.php**, você poderá acessá-lo em
**http://example.com/pages/about**. Fique a vontade para alterar esse controller
para atender suas necessacidades ou mesmo excluí-lo.

Quando você cria sua aplicação pelo Composer, o ``PagesController`` vai ser
criado na pasta **src/Controller/**.

.. meta::
    :title lang=pt: O Controlador Pages
    :keywords lang=pt: pages controller,default controller,cakephp,ships,php,home page,página estática
