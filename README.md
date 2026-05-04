# StatusPage Embed

A script for including the NYU Libraries StatusPage alert header.

## Usage

Include the following script as close to end of your `body` tag as possible:

```
<script src="https://cdn.library.nyu.edu/statuspage-embed/index.min.js"></script>
```

## Develop

Run the local build server at `localhost:3000` which serves a fake host page that
loads the local _./dist/_ build:

```shell
npm run dev
```

To enable automatic rebuild of _./dist/_ on source code change, run:

```shell
npm run build:dev:watch
```

Note that the local build server is not the `webpack` dev server and will not
hot reload when _./dist/_ is rebuilt.  You will need to manually refresh the
page.  Note also that `npm run build:dev:watch` and `npm run dev` can not easily
be combined into a single command, `build:dev:watch` will not allow further
input from the user, so these commands must run in separate processes.

Later after we move from `webpack` to `vite`, we could try and set up a typical
HMR workflow with a fake host page served by the `vite` dev server. 

In Docker:

```
docker compose up dev
```

This will run both the `watch` and `dev` services.  Note that even though `watch`
is mounting the _./dist/_ and _./js/_ directories as volumes, `webpack` only
does not seem able to detect changes in _./js/_ made in the hypervisor, so all
changes need to be made to the source code from inside the container.

# To render and test alert banners locally

Unless there is an active Incident or Maintenance, nothing will be visible on
the local test page.  In order to test application logic and style changes on
your local, you can create fake Incidents or Maintenances on a status page that
is not used by our public websites:

* Create new Incidents and Maintenances using the Internal status page of
`https://manage.statuspage.io/`, or a status page that you create that is not used
on public web pages.
* Change `config.getStatuspageSummaryUrl()` in your local so that it returns the
URL of the _summary.json_ file for that statuspage:

`https://$INTERNAL_STATUSPAGE_ID.statuspage.io/api/v2/summary.json` 

Note that unless the status page has been Activated (which costs money), the
request could fail with a CORS error.  See
"A note on CORS (related to using the Status API with a Private Status Page)"
in [What are the different APIs under Statuspage?](https://support.atlassian.com/statuspage/docs/what-are-the-different-apis-under-statuspage/):

> We don't allow CORS on private pages or trial pages. You'll need to use an API
> proxy for any request which needs access to an authenticated API. This will
> allow your custom HTML page to access your local API proxy without requiring
> any Authorization header, and it will then add the required header and sent it
> downstream to our API.

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
