const CACHE_NAME = 'hotel-inventory-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});










{
  "name": "@chargepoint/license-frontend",
  "version": "3.18.23.1.9",
  "publishConfig": {
    "registry": "https://artifactory.sw-shared.internalcp.com/artifactory/api/npm/cloud-dev-npm-local/"
  },
  "scripts": {
    "install:legacy": "npm install --legacy-peer-deps --verbose",
    "start": "export NODE_OPTIONS=--openssl-legacy-provider && node server.js",
    "start:win": "set NODE_OPTIONS=--openssl-legacy-provider && node server.js",
    "build": "export NODE_OPTIONS=--openssl-legacy-provider && webpack --config webpack.build",
    "develop": "export NODE_OPTIONS=--openssl-legacy-provider && node server.js",
    "build:dev": "export NODE_OPTIONS=--openssl-legacy-provider && webpack --mode=development",
    "build:prod": "export NODE_OPTIONS=--openssl-legacy-provider && webpack --config webpack.build",
    "serve": "export NODE_OPTIONS=--openssl-legacy-provider && node server.js",
    "publish:snapshot": "node scripts/publish-snapshot.js"
  },
  "main": "app.bundle.js",
  "dependencies": {
    "@apollo/client": "^3.5.6",
    "@babel/runtime": "^7.16.7",
    "@braid/vue-formulate": "^2.5.2",
    "@chargepoint/atomic-components-frontend": "^5.2.0",
    "@riophae/vue-treeselect": "^0.4.0",
    "@vue/apollo-composable": "^4.0.0-alpha.16",
    "add": "^2.0.6",
    "apollo-boost": "^0.4.9",
    "apollo-upload-client": "^17.0.0",
    "debug": "^4.3.3",
    "deep-diff": "^1.0.2",
    "graphql": "^15.6.0",
    "joi": "^17.5.0",
    "luxon": "^2.3.0",
    "papaparse": "^5.3.1",
    "pinia": "^2.0.28",
    "regenerator-runtime": "^0.13.9",
    "underscore": "^1.13.2",
    "v-click-outside": "^3.1.2",
    "vue": "^2.7.0",
    "vue-apollo": "^3.1.0",
    "vue-collapsible-component": "^0.1.3",
    "vue-form-generator": "^2.3.4",
    "vue-multiselect": "^2.1.6",
    "vue-notification": "^1.3.20",
    "vue-router": "^3.5.3",
    "vuebar": "^0.0.20"
  },
  "devDependencies": {
    "@babel/core": "^7.29.0",
    "@babel/plugin-proposal-nullish-coalescing-operator": "^7.18.6",
    "@babel/plugin-proposal-optional-chaining": "^7.21.0",
    "@babel/preset-env": "^7.29.2",
    "@types/underscore": "^1.11.4",
    "@typescript-eslint/eslint-plugin": "^4.18.0",
    "@typescript-eslint/parser": "^4.18.0",
    "@vue/eslint-config-prettier": "^6.0.0",
    "@vue/eslint-config-typescript": "^7.0.0",
    "babel-loader": "^8.4.1",
    "bootstrap": "^4.6.2",
    "config": "^3.3.8",
    "css-loader": "^5.0.1",
    "dotenv-webpack": "^8.0.1",
    "eslint": "^6.8.0",
    "eslint-config-prettier": "^6.15.0",
    "eslint-plugin-prettier": "^3.4.1",
    "eslint-plugin-vue": "^7.18.0",
    "eslint-plugin-wdio": "^7.4.2",
    "express": "^4.18.2",
    "html-webpack-plugin": "^4.5.2",
    "prettier": "^2.5.1",
    "pug": "^3.0.2",
    "pug-plain-loader": "^1.1.0",
    "sass": "^1.32.7",
    "sass-loader": "10.1.1",
    "style-loader": "^1.0.1",
    "style-resources-loader": "^1.4.1",
    "ts-loader": "^8.0.5",
    "typescript": "^5.3.3",
    "vue-loader": "^15.10.0",
    "vue-responsive": "1.1.0",
    "vue-style-loader": "^4.1.2",
    "webpack": "^4.44.2",
    "webpack-cli": "^3.3.12",
    "webpack-dev-middleware": "^4.0.2",
    "webpack-dev-server": "^3.11.1",
    "webpack-hot-middleware": "^2.25.0",
    "webpack-merge": "^5.7.3"
  }
}
