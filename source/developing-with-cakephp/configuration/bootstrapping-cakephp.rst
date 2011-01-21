3.4.7 Bootstrapping CakePHP
---------------------------

If you have any additional configuration needs, use CakePHP’s
bootstrap file, found in /app/config/bootstrap.php. This file is
executed just after CakePHP’s core bootstrapping.

This file is ideal for a number of common bootstrapping tasks:


-  Defining convenience functions
-  Registering global constants
-  Defining additional model, view, and controller paths

Be careful to maintain the MVC software design pattern when you add
things to the bootstrap file: it might be tempting to place
formatting functions there in order to use them in your
controllers.

Resist the urge. You’ll be glad you did later on down the line.

You might also consider placing things in the AppController class.
This class is a parent class to all of the controllers in your
application. AppController is a handy place to use controller
callbacks and define methods to be used by all of your
controllers.

3.4.7 Bootstrapping CakePHP
---------------------------

If you have any additional configuration needs, use CakePHP’s
bootstrap file, found in /app/config/bootstrap.php. This file is
executed just after CakePHP’s core bootstrapping.

This file is ideal for a number of common bootstrapping tasks:


-  Defining convenience functions
-  Registering global constants
-  Defining additional model, view, and controller paths

Be careful to maintain the MVC software design pattern when you add
things to the bootstrap file: it might be tempting to place
formatting functions there in order to use them in your
controllers.

Resist the urge. You’ll be glad you did later on down the line.

You might also consider placing things in the AppController class.
This class is a parent class to all of the controllers in your
application. AppController is a handy place to use controller
callbacks and define methods to be used by all of your
controllers.
