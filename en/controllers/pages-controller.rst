The Pages Controller
####################

CakePHP core ships with a default controller called the Pages
Controller (cake/libs/controller/pages\_controller.php). The home
page you see after installation is generated using this controller.
It is generally used to serve static pages. Eg. If you make a view
file app/views/pages/about\_us.ctp you can access it using url
http://example.com/pages/about\_us

When you "bake" an app using CakePHP's console utility the pages
controller is copied to your app/controllers/ folder and you can
modify it to your needs if required. Or you could just copy the
pages\_controller.php from core to your app.

.. warning::

    Do not directly modify ANY file under the ``cake`` folder to avoid
    issues when updating the core in future
