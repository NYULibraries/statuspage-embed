import { beforeEach, describe, expect, it, vi } from 'vitest';

import config from '../../../src/js/config';

describe( 'getStylesheetUrl', () => {
    beforeEach( () => {
        vi.resetModules();
    } );

    it( 'should return the correct URL for local', () => {
        document.currentScript.src = 'https://localhost';
        expect( config.getStylesheetUrl() ).toEqual(
            'http://localhost:3000/index.min.css',
        );
    } );

    it( 'should return the correct URL for the Docker Compose `e2e-tests` service use case', () => {
        document.currentScript.src = 'http://dev';
        expect( config.getStylesheetUrl() ).toEqual(
            'http://dev:3000/index.min.css',
        );
    } );

    it( 'should return the correct URL for dev', () => {
        document.currentScript.src = 'https://cdn-dev.library.nyu.edu';
        expect( config.getStylesheetUrl() ).toEqual(
            'https://cdn-dev.library.nyu.edu/statuspage-embed/index.min.css',
        );
    } );

    it( 'should return the correct URL for prod', () => {
        document.currentScript.src = 'https://cdn.library.nyu.edu';
        expect( config.getStylesheetUrl() ).toEqual(
            'https://cdn.library.nyu.edu/statuspage-embed/index.min.css',
        );
    } );
} );

describe( 'getStatuspageSummaryUrl', () => {
    it( 'should return the correct URL for dev CDN widget instance', () => {
        document.currentScript.src = 'https://cdn-dev.library.nyu.edu';
        expect( config.getStatuspageSummaryUrl() ).toEqual( config.DEV_STATUSPAGE_SUMMARY_URL );
    } );

    it( 'should return the correct URL for prod CDN widget instance', () => {
        document.currentScript.src = 'https://cdn.library.nyu.edu';
        expect( config.getStatuspageSummaryUrl() ).toEqual( config.PROD_STATUSPAGE_SUMMARY_URL );
    } );

    it( 'should return the correct URL for local dev server instance', () => {
        document.currentScript.src = 'http://localhost:5173';
        expect( config.getStatuspageSummaryUrl() ).toEqual( config.LOCAL_STATUSPAGE_SUMMARY_URL );
    } );

    it( 'should return the correct URL for the Docker Compose `dev` service in' +
        'the bridge network used for `e2e-tests` service', () => {
        document.currentScript.src = 'http://dev:5173';
        expect( config.getStatuspageSummaryUrl() ).toEqual( config.FAKE_STATUSPAGE_SUMMARY_URL );
    } );

    it( 'should return the correct URL for the fallthrough case', () => {
        document.currentScript.src = 'https://some-cdn.company.com';
        expect( config.getStatuspageSummaryUrl() ).toEqual( config.PROD_STATUSPAGE_SUMMARY_URL );
    } );
} );
