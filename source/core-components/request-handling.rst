5.5 Request Handling
--------------------

The Request Handler component is used in CakePHP to obtain
additional information about the HTTP requests that are made to
your applications. You can use it to inform your controllers about
Ajax as well as gain additional insight into content types that the
client accepts and automatically changes to the appropriate layout
when file extensions are enabled.

By default RequestHandler will automatically detect Ajax requests
based on the HTTP-X-Requested-With header that many javascript
libraries use. When used in conjunction with
Router::parseExtensions() RequestHandler will automatically switch
the layout and view files to those that match the requested type.
Furthermore, if a helper with the same name as the requested
extension exists, it will be added to the Controllers Helper array.
Lastly, if XML data is POST'ed to your Controllers, it will be
parsed into an XML object which is assigned to Controller::data,
and can then be saved as model data. In order to make use of
Request Handler it must be included in your $components array.

::

    <?php
    class WidgetController extends AppController {
        
        var $components = array('RequestHandler');
        
        //rest of controller
    }
    ?>


#. ``<?php``
#. ``class WidgetController extends AppController {``
#. ````
#. ``var $components = array('RequestHandler');``
#. ````
#. ``//rest of controller``
#. ``}``
#. ``?>``

5.5 Request Handling
--------------------

The Request Handler component is used in CakePHP to obtain
additional information about the HTTP requests that are made to
your applications. You can use it to inform your controllers about
Ajax as well as gain additional insight into content types that the
client accepts and automatically changes to the appropriate layout
when file extensions are enabled.

By default RequestHandler will automatically detect Ajax requests
based on the HTTP-X-Requested-With header that many javascript
libraries use. When used in conjunction with
Router::parseExtensions() RequestHandler will automatically switch
the layout and view files to those that match the requested type.
Furthermore, if a helper with the same name as the requested
extension exists, it will be added to the Controllers Helper array.
Lastly, if XML data is POST'ed to your Controllers, it will be
parsed into an XML object which is assigned to Controller::data,
and can then be saved as model data. In order to make use of
Request Handler it must be included in your $components array.

::

    <?php
    class WidgetController extends AppController {
        
        var $components = array('RequestHandler');
        
        //rest of controller
    }
    ?>


#. ``<?php``
#. ``class WidgetController extends AppController {``
#. ````
#. ``var $components = array('RequestHandler');``
#. ````
#. ``//rest of controller``
#. ``}``
#. ``?>``
