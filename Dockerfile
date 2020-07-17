FROM debian:stretch

ENV DEBIAN_FRONTEND noninteractive

LABEL Description="This image is used to create an environment to contribute to the cakephp/docs"

RUN apt-get update && apt-get install -y \
    latexmk \
    openjdk-8-jdk \
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

ADD https://github.com/w3c/epubcheck/releases/download/v4.2.2/epubcheck-4.2.2.zip /epubcheck/epubcheck.zip
RUN unzip /epubcheck/epubcheck.zip -d /epubcheck \
  && mv /epubcheck/epubcheck-4.2.2/* /epubcheck

WORKDIR /data
VOLUME "/data"

CMD ["/bin/bash"]
