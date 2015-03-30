define(["jquery", "knockout", "selectize", "knockout-selectize", "knockout-mapping", "knockout-reactor"], function($, ko, Selectize, knockoutSelectize, knockoutMapping, reactor){

    ko.mapping = knockoutMapping;

    var ExampleViewModel = function() {
        this.options1 = ko.observableArray([
            {id: 1, name: "Option 1"},
            {id: 2, name: "Option 2"}
        ]);
        this.options2 = ko.computed(function(){
            return this.options1();
        }, this);
        this.options3 = ko.observableArray([
            {label: "Optgroup 1", order: 1, children: ko.observableArray([
                {id: 3, name: "Option 3"}
            ])},
            {label: "Optgroup 2", order: 0, children: ko.observableArray([
                {id: 4, name: "Option4"}
            ])}
        ]);
        this.options4 = ko.computed(function(){
            return this.options3();
        }, this);
        this.disable = ko.observable(true);

        var self = this;
        setTimeout(function(){
            self.options1.remove(function(entry){
                return entry.id === 1;
            });
            self.disable(false);
            self.options1.push({id: 3, name: ko.observable("Options 3")});
            self.options3.push({label: "Optgroup 2", children: [
                {id: 4, name: "Option 4"}
            ]});
            self.options3()[0].children.push({id: 5, name: "Option 5"});
            self.options3()[0].children.remove(function(entry){
                return entry.id === 5;
            });
            self.value4(3);
        }, 500);

        this.value1 = ko.observableArray([1, 2]);
        this.value2 = ko.observable();
        this.value3 = ko.observable();
        this.value4 = ko.observable();

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