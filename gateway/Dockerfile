FROM openresty/openresty

COPY nginx.conf /usr/local/openresty/nginx/conf

RUN apt-get update && \
    apt-get install --no-install-recommends --no-install-suggests -y \
    wget \
    build-essential

RUN wget https://github.com/auth0/nginx-jwt/releases/download/v1.0.1/nginx-jwt.tar.gz && \
    tar -xf nginx-jwt.tar.gz

EXPOSE 80

ENV JWT_SECRET=176169ded6d034369088bed6ee9687bd91bd41939f05e842049a5dbdb41ce148e7f28f6f832cfad412766b7851b5609b2beaceabdc5f6b35a6a0a69eafdd685a
# CMD /usr/sbin/nginx -c /usr/local/nginx/conf -g "daemon off;"
