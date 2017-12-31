El controlador Pages
####################

El esqueleto oficial de CakePHP incluye un controlador por defecto **PagesController.php**.
Este es un controlador simple y opcional que se usa para servir contenido estatico.
La pagina home que se ve despues de la instalación es generada usando este controlador
y el archivo de vista **src/Template/Pages/home.ctp**. Si se crea el archivo de vista
**src/Template/Pages/about_us.ctp** se podrá acceder a este usando la URL
**http://example.com/pages/about_us**. Sientase lobre de modificar el controlador Pages
para que cumpla con sus necesidades.

Cuando se cocina una app usando Composer el controlador Pages es creado en la carpeta
**src/Controller/**.

.. meta::
    :title lang=es: El controlador Pages
    :keywords lang=es: controlador pages, pages controller,default controller,cakephp,ships,php,file folder,home page
