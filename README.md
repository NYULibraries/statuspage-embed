# StatusPage Embed

A script for including the NYU Libraries StatusPage alert header.

## Usage

Include the following script as close to end of your `body` tag as possible:

```
<script src="https://cdn.library.nyu.edu/statuspage-embed/index.min.js"></script>
```

## Develop

Run the vite dev server with HMR:

```shell
npm run dev
```

In Docker:

```
docker compose up dev
```

Note that HMR does not seem able to detect changes in the source files made in
the hypervisor, so all changes need to be made to the source code from inside
the container.

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

To run the unit tests:

```shell
npm run test
```

In Docker:

```
docker compose run test
```

To watch and re-run tests automatically:

```shell
npm run test:watch
```

In Docker:

```shell
docker compose run test-watch
```
