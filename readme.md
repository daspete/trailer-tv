# trailer-tv

This package is a prototype of an multi device movie list with a trailer player. You can start the display on any device, which has a modern browser installed, like Smart-TVs, Raspberry PIs, PCs, Notebooks, etc.

You can control the movie list with your smartphone.

## requirements

- nodejs >= 8.6
- npm package: yarn ``` npm install -g yarn ```
- npm package: pm2 ``` npm install -g pm2 ```


## installation

- create a new ```.env``` file in the project folder
- create a new ``` json-server.json``` file in the project folder
- create a new ```db.json``` file in the /api folder
- install dependencies with yarn: ``` yarn ```

## run a development instance

- start the json-server with ``` pm2 start --name="api" yarn -- run api ```
- start the web with ``` pm2 start --name="web-dev" yarn -- run dev ```

Now, you can go to your host and scan the qrcode

## run a production instance

- start the json-server with ``` pm2 start --name="api" yarn -- run api ```
- build nuxt components with ``` yarn run nuxt-build ```
- build the server with ``` yarn run build ```
- run the production server with ``` pm2 start --name="web-production" yarn -- run start ```



