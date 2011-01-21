3.10.1 View Templates
---------------------

The view layer of CakePHP is how you speak to your users. Most of
the time your views will be showing (X)HTML documents to browsers,
but you might also need to serve AMF data to a Flash object, reply
to a remote application via SOAP, or output a CSV file for a user.

CakePHP view files are written in plain PHP and have a default
extension of .ctp (CakePHP Template). These files contain all the
presentational logic needed to get the data it received from the
controller in a format that is ready for the audience you’re
serving to.

View files are stored in /app/views/, in a folder named after the
controller that uses the files, and named after the action it
corresponds to. For example, the view file for the Products
controller's "view()" action, would normally be found in
/app/views/products/view.ctp.

The view layer in CakePHP can be made up of a number of different
parts. Each part has different uses, and will be covered in this
chapter:


-  **layouts**: view files that contain presentational code that is
   found wrapping many interfaces in your application. Most views are
   rendered inside of a layout.
-  **elements**: smaller, reusable bits of view code. Elements are
   usually rendered inside of views.
-  **helpers**: these classes encapsulate view logic that is needed
   in many places in the view layer. Among other things, helpers in
   CakePHP can help you build forms, build AJAX functionality,
   paginate model data, or serve RSS feeds.

3.10.1 View Templates
---------------------

The view layer of CakePHP is how you speak to your users. Most of
the time your views will be showing (X)HTML documents to browsers,
but you might also need to serve AMF data to a Flash object, reply
to a remote application via SOAP, or output a CSV file for a user.

CakePHP view files are written in plain PHP and have a default
extension of .ctp (CakePHP Template). These files contain all the
presentational logic needed to get the data it received from the
controller in a format that is ready for the audience you’re
serving to.

View files are stored in /app/views/, in a folder named after the
controller that uses the files, and named after the action it
corresponds to. For example, the view file for the Products
controller's "view()" action, would normally be found in
/app/views/products/view.ctp.

The view layer in CakePHP can be made up of a number of different
parts. Each part has different uses, and will be covered in this
chapter:


-  **layouts**: view files that contain presentational code that is
   found wrapping many interfaces in your application. Most views are
   rendered inside of a layout.
-  **elements**: smaller, reusable bits of view code. Elements are
   usually rendered inside of views.
-  **helpers**: these classes encapsulate view logic that is needed
   in many places in the view layer. Among other things, helpers in
   CakePHP can help you build forms, build AJAX functionality,
   paginate model data, or serve RSS feeds.
