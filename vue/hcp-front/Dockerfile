FROM registry.xiaojukeji.com/didionline/sre-didi-lnp7-centos7-base-v2:stable

COPY ./dockerconfig/nginx.conf  /home/xiaoju/nginx/conf/nginx.conf
COPY ./dockerconfig/hcp-views.conf  /home/xiaoju/nginx/conf/conf.d/hcp-views.conf
COPY ./dockerconfig/90-start_php_nginx.required.sh  /etc/container/init/

RUN mkdir -p /home/xiaoju/webroot/ipd-cloud/application/hcp/webapp

COPY ./home-xiaoju-webroot-ipd-cloud-application-hcp-webapp /home/xiaoju/webroot/ipd-cloud/application/hcp/webapp
