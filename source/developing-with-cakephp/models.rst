3.7 Models
----------

Models represent data and are used in CakePHP applications for data
access. A model usually represents a database table but can be used
to access anything that stores data such as files, LDAP records,
iCal events, or rows in a CSV file.

A model can be associated with other models. For example, a Recipe
may be associated with the Author of the recipe as well as the
Ingredient in the recipe.

This section will explain what features of the model can be
automated, how to override those features, and what methods and
properties a model can have. It'll explain the different ways to
associate your data. It'll describe how to find, save, and delete
data. Finally, it'll look at Datasources.
