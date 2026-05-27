import { execSync } from 'child_process';
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';

import { test, expect } from '@playwright/test';

import {
    getTestCases,
    massageHtmlIntoGolden,
    updateGoldenFiles,
} from '../testutils';

import { getStatuspageSummaryUrl } from '../../../src/js/config.mjs';

const PAGE_URL = process.env.PLAYWRIGHT_BASE_URL;
const STATUSPAGE_SUMMARY_URL = getStatuspageSummaryUrl();

const testCases = getTestCases();

testCases.forEach( ( testCase ) => {
    test.describe( `${ testCase.name }`, () => {
        test.beforeEach( async ( { page } ) => {
            await page.route( STATUSPAGE_SUMMARY_URL, async route => {
                const body = testCase.summary;
                await route.fulfill( {
                    body,
                    headers: {
                        'content-type': 'application/json; charset=utf-8',
                    },
                } );
            } );

            await page.goto( PAGE_URL );

            // Originally didn't think needed a `waitFor`, but there was one
            // occasion when the test ran before the injected stylesheet was
            // present.  The first thing `alertBanner.init()` does is inject
            // the stylesheet, but apparently there's still a race condition
            // with the tests.
            await page.locator( 'link[ rel = "stylesheet" ]' ).waitFor(
                { state: 'attached' },
            );
        } );

        test( 'page HTML matches expected', async ( { page } ) => {
            // Clean actual/ and diffs/ files
            // NOTE:
            // We don't bother with error handling because these files get
            // overwritten anyway, and if there were no previous files, or if a
            // previous cleaning/reset script or process already deleted the
            // previous files, we don't want the errors causing distraction.
            // If deletion fails on existing files, there's a good chance there
            // will be errors thrown later, which will then correctly fail the
            // test.
            const actualFile = `tests/actual/${ testCase.key }.txt`;
            try {
                unlinkSync( actualFile );
                // eslint-disable-next-line no-unused-vars
            } catch ( error ) { /* empty */ }
            const diffFile = `tests/diffs/${ testCase.key }.txt`;
            try {
                unlinkSync( diffFile );
                // eslint-disable-next-line no-unused-vars
            } catch ( error ) { /* empty */ }

            const actual = await page.locator( 'html' ).innerHTML();
            const actualMassaged = massageHtmlIntoGolden( actual );

            const goldenFile = `tests/golden/${ testCase.key }.html`;
            if ( updateGoldenFiles() ) {
                writeFileSync( goldenFile, actualMassaged );

                console.log( `Updated golden file ${ goldenFile }` );

                return;
            }
            const golden = readFileSync( goldenFile, { encoding: 'utf8' } );

            writeFileSync( actualFile, actualMassaged );

            const ok = actualMassaged === golden;

            let message =
                `Actual HTML for "${ testCase.name }" does not match expected HTML`;
            if ( !ok ) {
                const command = `diff ${ goldenFile } ${ actualFile } | tee ${ diffFile }`;
                let diffOutput;
                try {
                    diffOutput = new TextDecoder().decode( execSync( command ) );
                    message += `

======= BEGIN DIFF OUTPUT ========
${ diffOutput }
======== END DIFF OUTPUT =========

[Recorded in diff file: ${ diffFile }]`;
                } catch ( e ) {
                    // `diff` command failed to create the diff file.
                    message += `  Diff command \`${ command }\` failed:

${ e.stderr.toString() }`;
                }
            }

            expect( ok, message ).toBe( true );
        } );
    } );
} );
