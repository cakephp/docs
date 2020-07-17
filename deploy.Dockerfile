FROM debian:stretch as builder

ENV DEBIAN_FRONTEND noninteractive

LABEL Description="This image is used to create deployable images for book.cakephp.org"

RUN apt-get update && apt-get install -y \
    latexmk \
    php \
    python3-pip \
    texlive-fonts-recommended \
    texlive-lang-all \
    texlive-latex-extra \
    texlive-latex-recommended \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN apt-get update \
  && apt-get install -y curl php-cli php-curl \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /tmp/

RUN pip3 install -r /tmp/requirements.txt

WORKDIR /data

COPY . /data

RUN make website

# Create a slim nginx image.
# Final image doesn't need python or latex
FROM nginx:1.15-alpine

COPY --from=builder /data/website /data/website
COPY --from=builder /data/nginx.conf /etc/nginx/conf.d/default.conf

# Move built site into place
RUN cp -R /data/website/* /usr/share/nginx/html \
  && rm -rf /data/website/
