ORM na Shell ng Cache
###############

Ang OrmCacheShell ay nagbibigay ng isang simpleng CLI na kasangkapan para sa pamamahala ng iyong aplikasyon na 
mga cache ng metadata. Sa mga sitwasyon ng pagdeploy ito ay makakatulong na muling itayo ang cache ng metadata 
sa parehong lugar na hindi i-clear ang umiiral na data ng cache. Maaari mong gawin ito sa pamamagitan ng 
pagpapatabko ng::

    bin/cake orm_cache build --connection default

Muling itatayo nito ang cache ng metadata para sa lahat ng mga table sa ``default``
na koneksyon. Kung kailangan mo lamang muling itayo ang isang table maaari mong gawin iyon sa pamamagitan ng 
pagbibigay ng pangalan nito::

    bin/cake orm_cache build --connection default articles

Bilang karagdagan sa pagtatayo ng naka-cache na data, maaari mong gamitin ang OrmCacheShell para tanggalin 
na rin ang naka-cache na metadata::

    # Clear all metadata
    bin/cake orm_cache clear

    # Clear a single table
    bin/cake orm_cache clear articles

