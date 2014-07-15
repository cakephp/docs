The Pages Controller
####################

CakePHP ships with a default controller ``PagesController.php``. This is a
simple and optional controller for serving up static content. The home page
you see after installation is generated using this controller. If you make the
view file ``src/Template/Pages/about_us.ctp`` you can access it using the URL
``http://example.com/pages/about_us``. You are free to modify the Pages
Controller to meet your needs.

When you "bake" an app using CakePHP's console utility the Pages Controller is
created in your ``src/Controller/`` folder. You can also copy the file from
``/vendor/cakephp/cakephp/tests/test_app/TestApp/Controller/PagesController.php``.

.. warning::

    Do not directly modify ANY file under the ``/vendor/cakephp/cakephp`` folder to avoid
    issues when updating the core in future.


.. meta::
    :title lang=en: The Pages Controller
    :keywords lang=en: pages controller,default controller,lib,cakephp,ships,php,file folder
