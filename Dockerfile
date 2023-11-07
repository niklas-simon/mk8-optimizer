FROM httpd:latest

COPY ./dist/ /usr/local/apache2/htdocs/

ENV VIRTUAL_HOST=mk8-builder.pein-gera.de

EXPOSE 80
EXPOSE 443
