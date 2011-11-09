The Pages Controller
####################

CakePHP core ships with a default controller called the Pages
Controller (lib/Cake/Controller/PagesController.php). The home
page you see after installation is generated using this controller.
It is generally used to serve static pages. Eg. If you make a view
file ``app/View/Pages/about_us.ctp`` you can access it using url
http://example.com/pages/about\_us

When you "bake" an app using CakePHP's console utility the pages
controller is copied to your app/Controller/ folder and you can
modify it to your needs if required. Or you could just copy the
PagesController.php from core to your app.

.. warning::

    Do not directly modify ANY file under the ``Cake`` folder to avoid
    issues when updating the core in future.


.. meta::
    :title lang=en: The Pages Controller
    :keywords lang=en: default controller,lib,cakephp,ships,php,file folder