import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const STATUSPAGE_SUMMARY_FIXTURES_DIR = path.join(
    import.meta.dirname, '..', 'fixtures', 'statuspage-summaries',
);

const MAINTENANCE_TYPE = 'maintenance';

function getTestCases() {
    const testCases = [];

    const statuspageSummaryFixtureFiles =
        readdirSync( STATUSPAGE_SUMMARY_FIXTURES_DIR, { encoding: 'utf8' } );

    statuspageSummaryFixtureFiles.forEach( statuspageSummaryFile => {
        const statuspageSummaryFilepath = path.join(
            STATUSPAGE_SUMMARY_FIXTURES_DIR,
            statuspageSummaryFile,
        );
        const statuspageSummary =
            readFileSync( statuspageSummaryFilepath, { encoding: 'utf8' } );

        testCases.push(
            {
                key    : path.basename( statuspageSummaryFile, '.json' ),
                name   : parseTestCaseName( statuspageSummaryFile ),
                summary: statuspageSummary,
            },
        );
    } );

    return testCases;
}

// This is used to keep the golden files stable.  Originally this function
// replaced the `t` query param timestamp cache-bust with "?t=[TIMESTAMP]", but
// it turns out that the timestamps aren't added on initial dev server startup.
// Once the code is changed in any way, the cache-bust `t` query param appears.
// Since `t` is not always there, and it's not significant for testing purposes,
// we simply remove it completely from golden and actual data so they can be
// compared.
function removeCacheBustTimestampQueryParam( html ) {
    const regexp = new RegExp(
        '<script type="module" src="\\/src\\/js\\/index\\.js\\?t=[\\d]+"><\\/script>',
    );

    return html.replace(
        regexp,
        '<script type="module" src="/src/js/index.js"></script>',
    );
}

function parseTestCaseName( fixtureFilename ) {
    const filenameTokens =
        path.basename( fixtureFilename, '.json' ).split( '_' );

    // Type "incident" or "maintenance"
    const type = filenameTokens[ 0 ];
    if ( type === MAINTENANCE_TYPE ) {
        // Add impact, which in the API response is "maintenance", but in the
        // test case name is simply redundant.
        filenameTokens.splice( 1, 0, undefined );
    }
    const impact = filenameTokens[ 1 ] ?
        `${ filenameTokens [ 1 ] } impact ` :
        '';
    const updateNumber = filenameTokens[ 2 ].split( '-' )[ 1 ];
    const status = filenameTokens[ 3 ];

    // eslint-disable-next-line @stylistic/max-len
    return `${ impact }${ type } update #${ updateNumber }: status = ${ status }`;
}

// NOTE: it's currently not possible to use a custom flag like `--update-golden-files`
// with `playwright`:
// "[Feature] Add support for test.each / describe.each #7036"
// https://github.com/microsoft/playwright/issues/7036
function updateGoldenFiles() {
    return process.env.UPDATE_GOLDEN_FILES &&
           process.env.UPDATE_GOLDEN_FILES.toLowerCase() !== 'false';
}

export {
    getTestCases,
    removeCacheBustTimestampQueryParam,
    updateGoldenFiles,
};

