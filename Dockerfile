FROM node:lts
LABEL maintainer="who <who@whooami.me>"

RUN npm install --location=global cordova @ionic/cli @angular/cli cordova-res

EXPOSE 8100

RUN echo 'root:secret' | chpasswd
USER node

WORKDIR /home/node/

CMD bash
#ENTRYPOINT /usr/local/bin/ionic
#CMD [“serve”]

