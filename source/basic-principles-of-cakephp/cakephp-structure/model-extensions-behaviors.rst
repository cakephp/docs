2.1.3 Model Extensions ("Behaviors")
------------------------------------

Similarly, Behaviors work as ways to add common functionality
between models. For example, if you store user data in a tree
structure, you can specify your User model as behaving like a tree,
and gain free functionality for removing, adding, and shifting
nodes in your underlying tree structure.

Models also are supported by another class called a DataSource.
DataSources are an abstraction that enable models to manipulate
different types of data consistently. While the main source of data
in a CakePHP application is often a database, you might write
additional DataSources that allow your models to represent RSS
feeds, CSV files, LDAP entries, or iCal events. DataSources allow
you to associate records from different sources: rather than being
limited to SQL joins, DataSources allow you to tell your LDAP model
that it is associated to many iCal events.

Just like controllers, models are featured with callbacks as well:


-  beforeFind()
-  afterFind()
-  beforeValidate()
-  beforeSave()
-  afterSave()
-  beforeDelete()
-  afterDelete()

The names of these methods should be descriptive enough to let you
know what they do. You can find the details in the models chapter.
