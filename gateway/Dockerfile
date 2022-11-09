FROM docker.io/openresty/openresty:centos
RUN set -eux; \
mkdir -p /opt/lua-resty-jwt/lib/; \
mkdir -p /logs/; \
opm get SkyLothar/lua-resty-jwt; \
rm -rf /usr/local/openresty/nginx/conf/nginx.conf
COPY nginx.conf /usr/local/openresty/nginx/conf/
COPY nginx-jwt.lua /opt/lua-resty-jwt/lib/
CMD ["nginx", "-g", "daemon off;"]
