# StatusPage Embed

A script for including the NYU Libraries StatusPage alert header.

## Usage

Include the following script as close to end of your `body` tag as possible:
```
...
<script src="https://cdn.library.nyu.edu/statuspage-embed/index.min.js"></script>
</body>
```

## Develop

Bring up the development environment:

```
docker-compose up dev
```

and visit `localhost:8080`.

This will also bring up webpack in watch mode so any changes you make to the asset files will recompile live.

## Test

To run the unit tests with Jasmine:

```
docker-compose run test
```

## To-do

- Pull status text and link from StatusPage public API based on open issues with certain hash tags
- Full unit test coverage -- Consider mocha/chai instead of Jasmine if it simplifies
- Integration tests with karma?
- Deploy to S3 CDN bucket via CircleCI (see libguides-styles for implementation)