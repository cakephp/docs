2.2 Migration Guide
###################

CakePHP 2.2 is a fully API compatible upgrade from 2.1. This page outlines the
changes and improvements made for 2.2.

ExceptionRenderer
=================

The `CakeErrorController` used by `ExceptionRenderer` to render error pages now
uses layout `error.ctp` instead of `default.ctp`. So create an `error.ctp` in
your app's layouts folder. This prevents nested errors caused in some cases
due to use of default layout error.
