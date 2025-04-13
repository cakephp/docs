FROM debian:bookworm

ENV DEBIAN_FRONTEND=noninteractive

LABEL Description="This image is used to create an environment to contribute to the cakephp/docs"

RUN apt-get update && apt-get install -y \
    build-essential \
    latexmk \
    php \
    python3-full \
    texlive-fonts-recommended \
    texlive-lang-all \
    texlive-latex-extra \
    texlive-latex-recommended \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /tmp/venv
ENV PATH="/tmp/venv/bin:$PATH"

COPY requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt

WORKDIR /data
VOLUME "/data"

CMD ["/bin/bash"]
