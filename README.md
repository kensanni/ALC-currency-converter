# ALC-currency-converter

## About

ALC-currency-converter is a seven-days challenge project organized by [`Andela`](andela.com) in partnership with [`Udacity`](udacity.com) and Google Africa. ALC-currency-converter allow users to convert currency from different countries.

Live Demo: [https://kensanni.github.io/ALC-currency-converter/](https://kensanni.github.io/ALC-currency-converter/)

## Technologies used
This web-application is built with HTML5, CSS and Javascript.
>- [`Bootstrap4`](getbootstrap.com) framework is used for building and styling the web application
>- [`Service-worker`](https://developers.google.com/web/fundamentals/primers/service-workers/) for caching the web-page for offline access.
>- [`IndexedDB`](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for storing the currencies exchange rate for offline access.
### Features
>- Allow user to convert currencies from different countries
>- Offline access.

### How it works
ALC-currency-converter is built with the intent of [`PWA(Progressive Web App)`](https://developers.google.com/web/progressive-web-apps/). It's offers better user experience to the user. When a user visits the application for the first time, it caches some data such as the styling and home page to provide a better experience for the user. A user must have performed a conversion on the web application in-order to make such conversion in an offline mode which is saved in the indexedDB.
