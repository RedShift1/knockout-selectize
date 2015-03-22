requirejs.config({
    baseUrl: '../lib',
    paths: {
        examples: "../examples",
        src: "../src",

        jquery: "jquery/dist/jquery",
        knockout: "knockout/dist/knockout.debug",
        "knockout-mapping": "../lib/bower-knockout-mapping/dist/knockout.mapping.min",
        "knockout-reactor": "knockoutjs-reactor-bower/knockout.reactor-beta",
        "knockout-selectize": "../src/js/knockout-selectize",
        "knockout-selectize-html": "../src/html",
        microplugin: "microplugin/src/microplugin",
        text: "../lib/requirejs-text/text",
        "selectable-placeholder": "../plugins/selectablePlaceholder",
        selectize: "selectize/dist/js/selectize",
        sifter: "sifter/sifter.min"
    }
});

requirejs(['examples/viewmodel'], function(selectize){

});