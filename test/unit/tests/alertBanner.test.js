import { beforeEach, describe, expect, it, vi } from 'vitest';

// Include the alertBanner module
import AlertBanner from '../../../src/js/alertBanner';

let alertBanner;

// Setup DOM for testing
beforeEach( () => {
    document.currentScript.src = 'https://localhost';
    document.body.innerHTML = '<div class="container"></div>';
    alertBanner = new AlertBanner();
} );

describe( '#bannerClass', () => {
    it( 'should return red when investigating', () => {
        alertBanner.status = 'investigating';
        expect( alertBanner.bannerClass() ).toEqual(
            'nyulibraries-alert-banner alert-red' );
    } );

    it( 'should return orange when identified', () => {
        alertBanner.status = 'identified';
        expect( alertBanner.bannerClass() ).toEqual(
            'nyulibraries-alert-banner alert-orange' );
    } );

    it( 'should return orange when in_progress', () => {
        alertBanner.status = 'in_progress';
        expect( alertBanner.bannerClass() ).toEqual(
            'nyulibraries-alert-banner alert-orange' );
    } );

    it( 'should return green when monitoring', () => {
        alertBanner.status = 'monitoring';
        expect( alertBanner.bannerClass() ).toEqual(
            'nyulibraries-alert-banner alert-green' );
    } );

    it( 'should return green when resolved', () => {
        alertBanner.status = 'resolved';
        expect( alertBanner.bannerClass() ).toEqual(
            'nyulibraries-alert-banner alert-green' );
    } );

    it( 'should return green when scheduled', () => {
        alertBanner.status = 'scheduled';
        expect( alertBanner.bannerClass() ).toEqual(
            'nyulibraries-alert-banner alert-green' );
    } );

    it( 'should return undefined when unrecognized', () => {
        alertBanner.status = 'something else';
        expect( alertBanner.bannerClass() ).toEqual(
            'nyulibraries-alert-banner alert-undefined' );
    } );

    it( 'should return undefined when blank', () => {
        expect( alertBanner.bannerClass() ).toEqual(
            'nyulibraries-alert-banner alert-undefined' );
    } );
} );

describe( '#insertBanner', () => {
    beforeEach( () => {
        alertBanner.message = 'Some content';
        alertBanner.linkPath = 'http://example.com';
        alertBanner.bannerClass =
            vi.fn( () => 'mock-banner-class1 mock-banner-class2' );
    } );

    it( 'should not be called automatically', () => {
        expect( document.body.children.length ).toBe( 1 );
    } );

    it( 'should insert banner element when called', () => {
        expect( alertBanner.insertBanner() ).toBeTruthy();
        expect( document.body.children.length ).toBe( 2 );
        expect( document.body.firstChild.tagName ).toContain( 'ASIDE' );
        expect( document.body.firstChild.classList ).toContain(
            'mock-banner-class1' );
        expect( document.body.firstChild.classList ).toContain(
            'mock-banner-class2' );
        expect( document.body.firstChild.innerHTML ).toEqual(
            'Some content <a href="http://example.com" target="_blank">See more</a>'  );
    } );
} );

describe( '#insertStylesheet', () => {
    it( 'should not be called automatically', () => {
        expect( document.head.children.length ).toBe( 0 );
    } );

    it( 'should insert stylesheet when called', () => {
        document.currentScript.src = 'https://localhost';

        expect( AlertBanner.insertStylesheet() ).toBeTruthy();
        expect( document.head.children.length ).toBe( 1 );
        expect( document.head.firstChild.tagName ).toEqual( 'LINK' );
        expect( document.head.firstChild.href ).toEqual(
            'http://localhost:3000/index.min.css' );
        expect( document.head.firstChild.rel ).toEqual( 'stylesheet' );
        expect( document.head.firstChild.type ).toEqual( 'text/css' );
    } );
} );

describe( '#init', () => {
    let mockChosenIncident = true;

    beforeEach( () => {
        AlertBanner.insertStylesheet = vi.fn( () => true );
        alertBanner.insertBanner = vi.fn( () => true );
        alertBanner.statuspage.fetchData = vi.fn( () => true );
        alertBanner.statuspage.chosenIncident = vi.fn(
            () => mockChosenIncident );
        alertBanner.statuspage.alertName = vi.fn(
            () => 'Incident Name' );
        alertBanner.statuspage.alertUrl = vi.fn(
            () => 'http://example.com/path' );
        alertBanner.statuspage.status = vi.fn(
            () => 'somestatus' );
    } );

    describe( 'without valid incident', () => {
        it( 'should not call insertBanner', async () => {
            await alertBanner.init();
            expect( AlertBanner.insertStylesheet ).toHaveBeenCalled();
            expect( alertBanner.statuspage.fetchData ).toHaveBeenCalled();
            expect( alertBanner.insertBanner ).not.toHaveBeenCalled();
        } );

        it( 'should not assign values', async () => {
            await alertBanner.init();
            expect( alertBanner.message ).toBeUndefined();
            expect( alertBanner.linkPath ).toBeUndefined();
            expect( alertBanner.status ).toBeUndefined();
        } );
    } );
} );
