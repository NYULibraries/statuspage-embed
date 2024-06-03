# StatusPage Embed

A script for including the NYU Libraries StatusPage alert header.

## Usage

Include the following script as close to end of your `body` tag as possible:

```
<script src="https://cdn.library.nyu.edu/statuspage-embed/index.min.js"></script>
```

## Develop

Bring up the development environment:

```
docker compose up dev
```

and visit `localhost:8080`.

This will also bring up webpack in watch mode so any changes you make to the asset files will recompile live.

To render and test alert banners locally:
- create them using the Internal page of `https://manage.statuspage.io/`
- comment out the `statuspageUrl` key value of the config object in config.js and replace it with the following string:

`https://$INTERNAL_PAGE_ID.statuspage.io/api/v2/summary.json?api_key=$LIB_SERVICES_API_KEY` 

env variables can be found in the `API Info` section of the Profile menu of `https://manage.statuspage.io/`

## Test

To run the unit tests with Jest:

```
docker compose run test
```

To watch and re-run tests automatically, after uncommenting the volumes under the `test` service in the docker-compose file:

```
docker compose run test jest --watchAll
```

## To-do

- Integration tests with karma?
- Deploy to S3 CDN bucket via CircleCI (see libguides-styles for implementation)
