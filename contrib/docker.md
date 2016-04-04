## Docker : Build the documentation

Docker will let you create a container with all packages needed to build the
docs. You need to have docker installed, see the [official docs of
docker](http://docs.docker.com/mac/started/) for more information.

### Use images hosted on Dockerhub

You can run all the following commands to build the docs. This can take a little
while the first time you run a command because all packages need to be
downloaded via images created on
[DockerHub](https://hub.docker.com/r/cakephpfr/docs/).

```bash
# To build the html
cd /path/to/your/local/docs
docker run -it --rm -v $(pwd):/data cakephp-fr/docs:light make html

# To build the epub
cd /path/to/your/local/docs
docker run -it --rm -v $(pwd):/data cakephp-fr/docs make epub

# To build the latex
cd /path/to/your/local/docs
docker run -it --rm -v $(pwd):/data cakephp-fr/docs make latex

# To build the pdf
cd /path/to/your/local/docs
docker run -it --rm -v $(pwd):/data cakephp-fr/docs make pdf
```

All the commands below will create and start containers and build the docs in
the `build` folder. The `--rm` flag will delete the container after run.


### Build the image locally ###

There is a Dockerfile included at the root of this repository. You can build an
image using:

```bash
docker build -t cakephp/docs .
```

This can take a little while, because all packages needs to be downloaded, but
you'll only need to do this once.

You can run `docker images` to check that the image has been correctly built,
you should see this output:

```
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
cakephp/docs        latest              9783ad2c375b        3 hours ago         125.2 MB
debian              jessie              3d88cbf54477        12 days ago         125.2 MB
```

If you can't see an image called `cakephp/docs`, it can mean that the image has been wrongly built. If you notice an image called <none> like the following:

```
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
<none>              <none>              9783ad2c375b        3 hours ago         125.2 MB
debian              jessie              3d88cbf54477        12 days ago         125.2 MB
```

Run the following command (with your image id of course):

```bash
// to remove the image
docker rmi 9783ad2c375b
// re-run the build command
docker build -t cakephp/docs .
```

Now that the image is built, you can run all the commands to build the docs:

```bash
# To build the html
cd /path/to/your/local/docs
docker run -it --rm -v $(pwd):/data cakephp/docs make html

# To build the epub
cd /path/to/your/local/docs
docker run -it --rm -v $(pwd):/data cakephp/docs make epub

# To build the latex
cd /path/to/your/local/docs
docker run -it --rm -v $(pwd):/data cakephp/docs make latex

# To build the pdf
cd /path/to/your/local/docs
docker run -it --rm -v $(pwd):/data cakephp/docs make pdf
```

All the commands below will create and start containers and build the docs in
the `build` folder. The `--rm` flag will delete the container after run.
