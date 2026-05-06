import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    DEV_STATUSPAGE_SUMMARY_URL,
    PROD_STATUSPAGE_SUMMARY_URL,
    getBaseUrl,
    getStatuspageSummaryUrl,
} from '../src/js/config';

describe( 'getBaseUrl', () => {
    beforeEach( () => {
        vi.resetModules();
    } );

    it( 'should set properly for local', () => {
        document.currentScript.src = 'https://localhost';
        expect( getBaseUrl() ).toEqual( 'http://localhost:3000' );
    } );

    it( 'should set properly for dev', () => {
        document.currentScript.src = 'https://cdn-dev.library.nyu.edu';
        expect( getBaseUrl() ).toEqual( 'https://cdn-dev.library.nyu.edu/statuspage-embed' );
    } );

    it( 'should set properly for prod', () => {
        document.currentScript.src = 'https://cdn.library.nyu.edu';
        expect( getBaseUrl() ).toEqual( 'https://cdn.library.nyu.edu/statuspage-embed' );
    } );
} );

describe( 'getStatuspageSummaryUrl', () => {
    it( 'should return the correct URL for dev CDN widget instance', () => {
        document.currentScript.src = 'https://cdn-dev.library.nyu.edu';
        expect( getStatuspageSummaryUrl() ).toEqual( DEV_STATUSPAGE_SUMMARY_URL );
    } );

    it( 'should return the correct URL for prod CDN widget instance', () => {
        document.currentScript.src = 'https://cdn.library.nyu.edu';
        expect( getStatuspageSummaryUrl() ).toEqual( PROD_STATUSPAGE_SUMMARY_URL );
    } );

    it( 'should return the correct URL for any instance that is not hosted in dev or prod CDN', () => {
        document.currentScript.src = 'https://some-cdn.company.com';
        expect( getStatuspageSummaryUrl() ).toEqual( PROD_STATUSPAGE_SUMMARY_URL );
    } );
} );
