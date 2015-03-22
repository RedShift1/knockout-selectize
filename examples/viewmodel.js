define(["jquery", "knockout", "selectize", "knockout-selectize", "knockout-mapping"], function($, ko, Selectize, knockoutSelectize, knockoutMapping){

    ko.mapping = knockoutMapping;

    var ExampleViewModel = function() {
        this.value1 = ko.observable();

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
                setTimeout(function(){
ko.mapping.fromJS(categories[0], {}, self.categories);
}, 1500);
                
                self.countries(countries[0]);
            });
        }
    }

    ko.applyBindings(new ExampleViewModel());

});