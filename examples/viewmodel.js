define(["jquery", "knockout", "selectize", "knockout-selectize", "knockout-mapping"], function($, ko, Selectize, knockoutSelectize, knockoutMapping){

    ko.mapping = knockoutMapping;

    var ExampleViewModel = function() {
        this.value1 = ko.observable();
        this.value2 = ko.observableArray();
        this.value3 = ko.observable();
        this.value4 = ko.observableArray();
        this.value5 = ko.observable();
        this.value6 = ko.observableArray();

        this.categories = ko.observableArray();
        this.countries = ko.observableArray();

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
                //self.countries(countries[0]);

                self.value6([2, 3]);

               setTimeout(function(){
                   self.categories.remove(function(category){
                       return category.name() === "Mens";
                   });
                   //self.value6(null);
               }, 1000);

                setTimeout(function(){
                    //console.log(self.value6());
                }, 2000);

            });
        }
    }

    ko.applyBindings(new ExampleViewModel());

});