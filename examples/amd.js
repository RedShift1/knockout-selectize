requirejs.config({
    baseUrl: '../lib',
    paths: {
        examples: "../examples",

        jquery: "jquery/dist/jquery",
        knockout: "knockout/dist/knockout",
        "knockout-mapping": "../lib/bower-knockout-mapping/dist/knockout.mapping.min",
        "knockout-reactor": "../plugins/knockoutjs-reactor/knockout.reactor-beta",
        "knockout-selectize": "../knockout-selectize",
        microplugin: "microplugin/src/microplugin",
        "selectable-placeholder": "../plugins/selectablePlaceholder",
        selectize: "selectize/dist/js/selectize",
        sifter: "sifter/sifter.min"
    }
});

requirejs(['examples/viewmodel'], function(selectize){

});