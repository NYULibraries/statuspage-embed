// Source:
// "Mocking document in tests #2297"
// https://github.com/jestjs/jest/issues/2297
Object.defineProperty( document, 'currentScript', {
    value   : document.createElement( 'script' ),
    writable: true,
} );
