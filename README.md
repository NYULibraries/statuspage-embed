# StatusPage Embed

A script for including the NYU Libraries StatusPage alert header.

## Usage

Include the following script as close to end of your `body` tag as possible:

```
<script src="https://cdn.library.nyu.edu/statuspage-embed/index.min.js"></script>
```

## Develop

### Step #1: Run the vite dev server with HMR (hot module reloading):

```shell
npm run dev
```

In Docker:

```
docker compose up dev
```

Note that the HMR does not seem to be able to detect changes in the source files
made in the hypervisor, so all changes need to be made to the source code from
inside the container.

---

### Step #2: Run the local statuspage summary CORS proxy

The statuspage-embed widget fetches a statuspage summary from whichever URL is
configured for the current runtime environment.  For local development it is
obviously not practical to fetch the summary from real live statuspages, because
in order to test changes in application logic and CSS styles we need to create a
variety of Incidents and Maintenances that would throw up an alert banner.

While it is very easy to create a new statuspage for testing and development,
an Activated (public) page costs money, and private statuspages that have not
been Activated do not serve the necessary CORS headers to allow a local dev
instance to fetch the _summary.json_.  This is by design -- from "A note on CORS
(related to using the Status API with a Private Status Page)" in
[What are the different APIs under Statuspage?](https://support.atlassian.com/statuspage/docs/what-are-the-different-apis-under-statuspage/):

> We don't allow CORS on private pages or trial pages. You'll need to use an API
> proxy for any request which needs access to an authenticated API. This will
> allow your custom HTML page to access your local API proxy without requiring
> any Authorization header, and it will then add the required header and sent it
> downstream to our API.

So for local dev work we use a local statuspage CORS proxy to connect with
private statuspages we create for testing and development. To run the local
statuspage CORS proxy to connect to a private statuspage (note that we don't
use the API key directly so that it won't appear in shell command history):

```shell
API_KEY=$( cat [PATH TO API KEY FILE READABLE ONLY BY YOU] ) \
STATUSPAGE_URL=https://[STATUSPAGE ID].statuspage.io/api/v2/summary.json \
npm run statuspage-proxy
```

If using an IDE, these environment variables can be stored in a run configuration.

In Docker:

```shell
API_KEY=$( cat [PATH TO API KEY FILE READABLE ONLY BY YOU] ) \
STATUSPAGE_URL=https://[STATUSPAGE ID].statuspage.io/api/v2/summary.json \
docker compose up statuspage-proxy
```

Alternatively, the `API_KEY` and `STATUSPAGE_URL` values can be stored in a
[\.env file](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/#env-file).

Environment variables:

* `STATUSPAGE_URL`: This can be the URL for any valid _summary.json_ response.
If not provided, the local statuspage proxy will use the URL for the
[Internal](https://internal18.statuspage.io/) statuspage
_[summary.json](https://66x84091slz4.statuspage.io/api/v2/summary.json)_.
* `API_KEY`: the API key for the proxied private statuspage.  If `API_KEY` is not
provided, the proxy will pass through the statuspage service error:
"Your page is inactive. Please include an API key to access this resource."
Since `STATUSPAGE_URL` could be set to a public statuspage or a fake statuspage
which does not require an API key (but presumably does require CORS headers to be
added), the `API_KEY` environment variable is not strictly required by the local
statuspage proxy.

## Test

### Unit tests

To run the unit tests:

```shell
npm run test:unit
```

In Docker:

```
docker compose run unit-tests
```

To watch and re-run tests automatically:

```shell
npm run test:unit:watch
```

In Docker:

```shell
docker compose run unit-tests-watch
```

### Playwright E2E tests

To run the Playwright E2E tests, first start the dev server if it's not already
running:

```shell
npm run dev
```

Then in another terminal window, run the tests:

```shell
PLAYWRIGHT_BASE_URL=http://localhost:5173 npm run test:e2e
```

In Docker:

```shell
docker compose up e2e-tests
```

To update the golden files, first make the desired code changes, which the dev
server will automatically hot reload, then run:

```shell
PLAYWRIGHT_BASE_URL=http://localhost:5173 npm run test:e2e:update-golden-files
```

In Docker: TODO
