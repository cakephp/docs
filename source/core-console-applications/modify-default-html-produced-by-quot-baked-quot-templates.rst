9.3 Modify default HTML produced by "baked" templates
-----------------------------------------------------

If you wish to modify the default HTML output produced by the
"bake" command, follow these simple steps:

**For baking custom views:**


#. Go into: cake/console/templates/default/views
#. Notice the 4 files there
#. Copy them to your:
   app/vendors/shells/templates/[themename]/views
#. Make changes to the HTML output to control the way "bake" builds
   your views

The ``[themename]`` path segment should be the name of the bake
theme that you are creating. Bake theme names need to be unique, so
don't use 'default'.

**For baking custom projects:**

Go into: cake/console/templates/skel
Notice the base application files there
Copy them to your: app/vendors/shells/templates/skel
Make changes to the HTML output to control the way "bake" builds
your views
Pass the skeleton path parameter to the project task
::

    cake bake project -skel vendors/shells/templates/skel


#. ``cake bake project -skel vendors/shells/templates/skel``

Notes

-  You must run the specific project task ``cake bake project`` so
   that the path parameter can be passed.
-  The template path is relative to the current path of the Command
   Line Interface.
-  Since the full path to the skeleton needs to be manually
   entered, you can specify any directory holding your template build
   you want, including using multiple templates. (Unless Cake starts
   supporting overriding the skel folder like it does for views)

9.3 Modify default HTML produced by "baked" templates
-----------------------------------------------------

If you wish to modify the default HTML output produced by the
"bake" command, follow these simple steps:

**For baking custom views:**


#. Go into: cake/console/templates/default/views
#. Notice the 4 files there
#. Copy them to your:
   app/vendors/shells/templates/[themename]/views
#. Make changes to the HTML output to control the way "bake" builds
   your views

The ``[themename]`` path segment should be the name of the bake
theme that you are creating. Bake theme names need to be unique, so
don't use 'default'.

**For baking custom projects:**

Go into: cake/console/templates/skel
Notice the base application files there
Copy them to your: app/vendors/shells/templates/skel
Make changes to the HTML output to control the way "bake" builds
your views
Pass the skeleton path parameter to the project task
::

    cake bake project -skel vendors/shells/templates/skel


#. ``cake bake project -skel vendors/shells/templates/skel``

Notes

-  You must run the specific project task ``cake bake project`` so
   that the path parameter can be passed.
-  The template path is relative to the current path of the Command
   Line Interface.
-  Since the full path to the skeleton needs to be manually
   entered, you can specify any directory holding your template build
   you want, including using multiple templates. (Unless Cake starts
   supporting overriding the skel folder like it does for views)
