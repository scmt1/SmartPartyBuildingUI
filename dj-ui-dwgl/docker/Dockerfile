FROM nginx:stable-alpine-perl

#MAINTAINER 维护者信息
MAINTAINER hxh

#REPLACE CONF 替换配置文件
RUN rm -f /etc/nginx/nginx.conf \
    && rm -f /etc/nginx/conf.d/default.conf
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

#ADD RESOUCES 添加静态资源
COPY ./dist /usr/share/nginx/html/static

#EXPOSE 映射端口
EXPOSE 7105

ENTRYPOINT ["nginx", "-g", "daemon off;"]
