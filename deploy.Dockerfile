FROM markstory/cakephp-docs-builder as builder

COPY . /data/docs
COPY requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt && rm /tmp/requirements.txt

WORKDIR /data/docs

RUN make website DEST="/data/website"

# Create a slim nginx image.
# Final image doesn't need python or latex
FROM markstory/cakephp-docs-builder:runtime as runtime

# Configure search index script
ENV LANGS="de en ex fr ja pt"
ENV SEARCH_SOURCE="/data/docs/build/html"
ENV SEARCH_URL_PREFIX="/1.3"

COPY --from=builder /data/docs /data/docs
COPY --from=builder /data/website /data/website
COPY --from=builder /data/docs/nginx.conf /etc/nginx/conf.d/default.conf

# Move built site into place
RUN mkdir -p /usr/share/nginx/html/ \
 && mv /data/website /usr/share/nginx/html/1.3
