FROM jamma/server:1.0.0
MAINTAINER Jeff YU, jeff@jamma.cn
CMD npm run start
COPY . .
RUN npm install --production && npm cache clean