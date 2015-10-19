FROM debian:latest

ENV DEBIAN_FRONTEND noninteractive

LABEL Description="This image is used to create an environment to contribute to the cakephp/docs"

RUN apt-get update && apt-get install -y \
  python-pip \
  texlive-full

RUN pip install sphinx==1.2.3
RUN pip install sphinxcontrib-phpdomain

VOLUME ["/data"]

WORKDIR ["/data"]

CMD ["make", "html"]
