View Conventions
################

View template files are named after the controller functions they
display, in an underscored form. The getReady() function of the
PeopleController class will look for a view template in
/app/views/people/get\_ready.ctp.

The basic pattern is
/app/views/controller/underscored\_function\_name.ctp.

By naming the pieces of your application using CakePHP conventions,
you gain functionality without the hassle and maintenance tethers
of configuration. Here’s a final example that ties the conventions


-  Database table: "people"
-  Model class: "Person", found at /app/models/person.php
-  Controller class: "PeopleController", found at
   /app/controllers/people\_controller.php
-  View template, found at /app/views/people/index.ctp

Using these conventions, CakePHP knows that a request to
http://example.com/people/ maps to a call on the index() function
of the PeopleController, where the Person model is automatically
available (and automatically tied to the ‘people’ table in the
database), and renders to a file. None of these relationships have
been configured by any means other than by creating classes and
files that you’d need to create anyway.



Now that you've been introduced to CakePHP's fundamentals, you
might try a run through the
:doc:`/tutorials-and-examples/blog` to see how things fit
together.
