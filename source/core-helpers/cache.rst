7.2 Cache
---------

The Cache helper assists in caching entire layouts and views,
saving time repetitively retrieving data. View Caching in Cake
temporarily stores parsed layouts and views with the storage engine
of choice. It should be noted that the Cache helper works quite
differently than other helpers. It does not have methods that are
directly called. Instead a view is marked with cache tags
indicating which blocks of content should not be cached.

When a URL is requested, Cake checks to see if that request string
has already been cached. If it has, the rest of the url dispatching
process is skipped. Any nocache blocks are processed normally and
the view is served. This creates a big savings in processing time
for each request to a cached URL as minimal code is executed. If
Cake doesn't find a cached view, or the cache has expired for the
requested URL it continues to process the request normally.
