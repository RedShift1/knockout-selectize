requirejs.config({
    baseUrl: '../lib',
    paths: {
        examples: "../examples",
        src: "../src",

        jquery: "jquery/dist/jquery",
        knockout: "knockout/dist/knockout.debug",
        "knockout-change-subscriber": "knockout-change-subscriber/dist/knockout-change-subscriber",
        "knockout-mapping": "../lib/bower-knockout-mapping/dist/knockout.mapping.min",
        "knockout-reactor": "knockoutjs-reactor-bower/knockout.reactor-beta",
        "knockout-selectize": "../src/js/knockout-selectize",
        "knockout-selectize-html": "../src/html",
        "knockout-subscriptions-manager": "knockout-subscriptions-manager/dist/knockout-subscriptions-manager",
        microplugin: "microplugin/src/microplugin",
        text: "../lib/requirejs-text/text",
        "selectable-placeholder": "../plugins/selectablePlaceholder",
        selectize: "selectize/dist/js/selectize",
        sifter: "sifter/sifter.min",
        underscore: "underscore/underscore"
    }
});

requirejs(['examples/viewmodel'], function(selectize){

});