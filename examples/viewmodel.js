define(["jquery", "knockout", "selectize", "knockout-selectize", "knockout-mapping", "knockout-reactor"], function($, ko, Selectize, knockoutSelectize, knockoutMapping, reactor){

    ko.mapping = knockoutMapping;

    var ExampleViewModel = function() {
        this.options = ko.observableArray(["Option 1", "Option 2", "Option 3"]);
        this.values = ko.observableArray(["Option 1", "Option 2"]);

        var self = this;
        setTimeout(function(){
            self.options.push("Option 4");
            self.values.push("Option 4");
        }, 1000);

        this.categories = ko.observableArray();
        this.countries = ko.observableArray();

        this.initializeData();
    }

    ExampleViewModel.prototype = {
        getCategories: function() {
            return $.get("data/categories.json");
        },
        getCountries: function() {
            return $.get("data/countries.json");
        },
        initializeData: function() {
            var self = this;

            $.when(this.getCategories(), this.getCountries()).then(function(categories, countries){
                
                self.countries(countries[0]);
            });
        }
    }

    ko.applyBindings(new ExampleViewModel());

});