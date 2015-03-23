define(["jquery", "knockout", "selectize", "knockout-selectize", "knockout-mapping"], function($, ko, Selectize, knockoutSelectize, knockoutMapping){

    ko.mapping = knockoutMapping;

    var ExampleViewModel = function() {
        this.value1 = ko.observable();
        this.options = ko.observableArray([
                {
                    label: ko.observable("Next 3 months"),
                    order: 1,
                    months: [
                        {
                            date: ko.observable("2015-04-01"),
                            label: ko.observable("April 2015")
                        },
                        {
                            date: ko.observable("2015-05-01"),
                            label: ko.observable("Maj 2015")
                        }
                    ]
                }
            ]);

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