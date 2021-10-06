FROM debian:bullseye

ENV DEBIAN_FRONTEND noninteractive

LABEL Description="This image is used to create an environment to contribute to the cakephp/docs"

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

COPY requirements.txt /tmp/
RUN pip3 install -r /tmp/requirements.txt

WORKDIR /data
VOLUME "/data"

CMD ["/bin/bash"]
