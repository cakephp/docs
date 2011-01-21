7.7.4 toReadableSize
--------------------

``toReadableSize(string $data_size)``

This method formats data sizes in human readable forms. It provides
a shortcut way to convert bytes to KB, MB, GB, and TB. The size is
displayed with a two-digit precision level, according to the size
of data supplied (i.e. higher sizes are expressed in larger
terms):

::

    echo $this->Number->toReadableSize(0);  // 0 Bytes
    echo $this->Number->toReadableSize(1024); // 1 KB
    echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
    echo $this->Number->toReadableSize(5368709120); // 5.00 GB

7.7.4 toReadableSize
--------------------

``toReadableSize(string $data_size)``

This method formats data sizes in human readable forms. It provides
a shortcut way to convert bytes to KB, MB, GB, and TB. The size is
displayed with a two-digit precision level, according to the size
of data supplied (i.e. higher sizes are expressed in larger
terms):

::

    echo $this->Number->toReadableSize(0);  // 0 Bytes
    echo $this->Number->toReadableSize(1024); // 1 KB
    echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
    echo $this->Number->toReadableSize(5368709120); // 5.00 GB
