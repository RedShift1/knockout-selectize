define(["jquery", "knockout", "selectize", "knockout-selectize", "knockout-mapping"], function($, ko, Selectize, knockoutSelectize, knockoutMapping){

    ko.mapping = knockoutMapping;

    var ExampleViewModel = function() {
        this.value1 = ko.observable("AF");
        this.value2 = ko.observableArray();
        this.value3 = ko.observable();
        this.value4 = ko.observableArray();
        this.value5 = ko.observable();
        this.value6 = ko.observableArray([6]);

        this.categories = ko.observableArray();
        this.countries = ko.observableArray();

        this.test = ko.observableArray([
            {
                "name": "Mens",
                "children": [
                    {"value": 1, "name": "Footwear"},
                    {"value": 2, "name": "Jeans"},
                    {"value": 3, "name": "Shirts"},
                    {"value": 4, "name": "Trousers"}
                ]
            },
            {
                "name": "Womens",
                "children": [
                    {"value": 5, "name": "Dresses"},
                    {"value": 6, "name": "Jewelry"},
                    {"value": 7, "name": "Leggins"}
                ]
            }
        ]);

        this.initializeData();
    }

    ExampleViewModel.prototype = {
        getCategories: function() {
            return $.get("/examples/data/categories.json");
        },
        getCountries: function() {
            return $.get("/examples/data/countries.json");
        },
        initializeData: function() {
            var self = this;

            $.when(this.getCategories(), this.getCountries()).then(function(categories, countries){
                ko.mapping.fromJS(categories[0], {}, self.categories);
                self.countries(countries[0]);

                self.test.push({
                    "name": "Childrens",
                    "children": [
                        {"value": 8, "name": "Dresses"},
                        {"value": 9, "name": "Jewelry"},
                        {"value": 10, "name": "Leggins"}
                    ]
                });

                setTimeout(function(){
                            console.log(self.value6());
                }, 2000);
            });
        }
    }

    ko.applyBindings(new ExampleViewModel());

});