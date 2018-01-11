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

COPY requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt

WORKDIR /data

CMD ["/bin/bash"]
