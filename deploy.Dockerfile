FROM debian:jessie

ENV DEBIAN_FRONTEND noninteractive

LABEL Description="This image is used to create an environment to contribute to the cakephp/docs"

RUN apt-get update && apt-get install -y \
    python-pip \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-lang-all \
    latexmk \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN apt-get update \
  && apt-get install -y nginx curl php5 php5-curl \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /tmp/

RUN pip install -r /tmp/requirements.txt

WORKDIR /data

COPY . /data

RUN make website

RUN rm -rf /var/www/html/* \
  && mkdir -p /var/www/html/2.0/ \
  && cp -a /data/website/. /var/www/html/2.0/ \
  && mv /data/nginx.conf /etc/nginx/sites-enabled/default

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
  && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
