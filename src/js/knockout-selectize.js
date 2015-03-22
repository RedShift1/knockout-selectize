(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["jquery", "knockout", "knockout-mapping", "knockout-reactor", "selectize", "selectable-placeholder", "text", "text!knockout-selectize-html/select.html"],
            function ($, ko, knockoutMapping, knockoutReactor, Selectize, selectablePlaceholder, text, selectHtml) {
            return (root.knockoutSelectize = factory($, ko, knockoutMapping, knockoutReactor, Selectize, selectablePlaceholder, text, selectHtml));
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(require("jquery", "knockout", "knockout-mapping", "knockout-reactor", "selectize", "selectable-placeholder", "text", "text!knockout-selectize-html/select.html"));
    } else {
        root.knockoutSelectize = factory(root.$, root.ko, root.ko.mapping, root.ko, root.Selectize, root.Selectize);
    }
}(this, function ($, ko, knockoutMapping, knockoutReactor, Selectize, selectablePlaceholder, text, selectHtml) {

    if (ko.mapping === undefined) {
        ko.mapping = knockoutMapping;
    }

    /**
     * Add an option group to the field
     *
     * @param selectizeInstance
     * @param optgroup
     * @param selectizeSettings
     * @returns {*}
     */
    var addOptgroup = function(selectizeInstance, optgroup, selectizeSettings)
    {
        var value = optgroup[selectizeSettings.optgroupValueField];
        var label = optgroup[selectizeSettings.optgroupLabelField];

        selectizeInstance.addOptionGroup(value, {
            label: label
        });

        return value;
    }

    /**
     * Adds an option to the field, optionally with an option group
     *
     * @param selectizeInstance
     * @param option
     * @param selectizeSettings
     * @param optgroup
     */
    var addOption = function(selectizeInstance, option, selectizeSettings, optgroup)
    {
        if (optgroup !== undefined) {
            option.optgroup = optgroup;
        }

        selectizeInstance.addOption(option);
    }

    /**
     * Add multiple options to the select box
     *
     * @param selectizeInstance
     * @param options
     * @param selectizeSettings
     * @param optgroup
     */
    var addOptions = function(selectizeInstance, options, selectizeSettings, optgroup)
    {
        for(var i in options) {
            addOption(selectizeInstance, options[i], selectizeSettings, optgroup);
        }
    }

    /**
     * Is the selectize binding applied to a valid element
     *
     * @param el
     * @returns {boolean}
     */
    var isElementTypeAllowed = function(el)
    {
        // element is neither select nor text field
        var elementType = el.tagName.toLowerCase();
        if (elementType !== 'select' && (elementType !== "input" || el.getAttribute("type") !== "text")) {
            return false;
        }

        return true;
    }

    /**
     * Is the element a multiple select box
     *
     * @param el
     * @returns {*}
     */
    var isMultiple = function(el)
    {
        return el.prop("multiple");
    }

    /**
     * Get the right value binding depending on whether
     * or not the element is a multiple box
     *
     * @param el
     * @param allBindings
     * @returns {*}
     */
    var getValueObservable = function(el, allBindings)
    {
        var multiple = isMultiple(el);
        if (multiple === true) {
            return allBindings.get("selectedOptions") || ko.observableArray();
        } else {
            return allBindings.get("value") || ko.observable(null);
        }
    }

    /**
     * Remove all options from an option group
     *
     * @param selectizeInstance
     * @param optgroup
     */
    var removeOptgroupOptions = function(selectizeInstance, optgroup)
    {
        var options = selectizeInstance.options;

        for(var i in options) {
            var option = options[i];
            if (option.optgroup === optgroup) {
                removeOption(selectizeInstance, option.value);
            }
        }
    }

    /**
     * Remove an option group from the select box
     *
     * @param selectizeInstance
     * @param optgroup
     */
    var removeOptgroup = function(selectizeInstance, optgroup)
    {
        selectizeInstance.removeOptionGroup(optgroup);
    }

    /**
     * Remove an option from the select box
     *
     * @param selectizeInstance
     * @param value
     */
    var removeOption = function(selectizeInstance, value)
    {
        removeValue(selectizeInstance, value);
        selectizeInstance.removeOption(value);
    }

    /**
     * Deselect a given value in the select box
     *
     * @param selectizeInstance
     * @param removeValue
     */
    var removeValue = function(selectizeInstance, removeValue)
    {
        var currentValue = selectizeInstance.getValue();

        // multiple values
        if ($.isArray(currentValue)) {
            var values = selectizeInstance.items.concat([]);

            values = $.grep(values, function(value){
                return value !== removeValue;
            });

            selectizeInstance.setValue(values);
        } else {
            if (selectizeInstance.getValue() === removeValue) {
                selectizeInstance.setValue("");
            }
        }
    }

    /**
     * Fallback for selectable placeholder. If there is a empty option
     * in the field, use its text as a selectable placeholder.
     *
     * @param el
     * @param selectizeSettings
     */
    var setSelectablePlaceholderOptions = function(el, selectizeSettings)
    {
        var emptyOption = el.find("option[value='']");

        // Add the selectable_placeholder plugin if it does not already exist
        if ($.inArray("selectable_placeholder", selectizeSettings.plugins) === -1) {
            selectizeSettings.plugins.push("selectable_placeholder");
        }

        // An actual empty value option is present
        if (emptyOption.length > 0) {
            selectizeSettings.placeholder = emptyOption.text();
        // If a placeholder is not sent, then set a default value.
        } else if(selectizeSettings.placeholder === undefined) {
            selectizeSettings.placeholder = "Select a value";
        }
    }

    /**
     * Setup a subscriber looking for changes in the options observable
     *
     * @param selectizeInstance
     * @param options
     * @param selectizeSettings
     * @param settings
     * @returns {*}
     */
    var setupOptionsSubscriber = function(selectizeInstance, options, selectizeSettings, settings)
    {
        if (ko.isObservable(options)) {
            // Use knockout reactor to watch for nested changes
            return ko.watch(options, {}, function(parents, child, item){
                // the change was not of array character
                if (item === undefined) { return true; }

                // unwrap recursively
                item = ko.mapping.toJS(item);

                if (item.status !== "added" && item.status !== "deleted") {
                    throw "An invalid change status was given.";
                }

                // optgroup change
                if (settings.optgrouped === true && parents.length === 0) {
                    if (item.status === "added") {
                        var optgroupId = addOptgroup(selectizeInstance, item.value, selectizeSettings);
                        addOptions(selectizeInstance, item.value[settings.optgroupValues], selectizeSettings, optgroupId);
                    } else if (item.status === "deleted") {
                        var optgroup = item.value[selectizeSettings.optgroupValueField];

                        removeOptgroupOptions(selectizeInstance, optgroup);
                        removeOptgroup(selectizeInstance, optgroup);
                    }
                // single option change
                } else {
                    if (item.status === "added") {
                        addOption(selectizeInstance, item.value, selectizeSettings);
                    } else {
                        removeOption(selectizeInstance, item.value[selectizeSettings.valueField]);
                    }
                }
            });
        }

        return false;
    }

    /**
     * Set the values of a multiple select box
     *
     * @param selectizeInstance
     * @param changes
     */
    var setMultipleValues = function(selectizeInstance, changes)
    {
        var values = selectizeInstance.items.concat([]);

        for(var i in changes) {
            var change = changes[i];

            if (change.status === "added") {
                if ($.inArray(change.value, values) === -1) {
                    values.push(change.value);
                }
            } else if (change.status === "deleted") {
                values = $.grep(values, function(value){
                    return value !== change.value;
                });
            }
        }

        selectizeInstance.setValue(values);
    }

    /**
     * Set the value of a single select box
     *
     * @param selectizeInstance
     * @param value
     * @returns {*}
     */
    var setSingleValue = function(selectizeInstance, value)
    {
        return selectizeInstance.setValue(value);
    }

    /**
     * Create a value subscriber for a multiple select box
     *
     * @param selectizeInstance
     * @param value
     * @returns {*}
     */
    var setupMultipleValueSubscriber = function(selectizeInstance, value)
    {
        if (ko.isObservable(value)) {
            return value.subscribe(function(changes){
                setMultipleValues(selectizeInstance, changes);
            }, null, "arrayChange");
        }

        return false;
    }

    /**
     * Create a value subscriber for a single select box
     *
     * @param selectizeInstance
     * @param value
     * @returns {*}
     */
    var setupSingleValueSubscriber = function(selectizeInstance, value)
    {
        if (ko.isObservable(value)) {
            return value.subscribe(function(newValue) {
                if (newValue !== selectizeInstance.getValue()) {
                    setSingleValue(selectizeInstance, newValue);
                }
            });
        }

        return false;
    }

    /**
     * Set's the correct value subscriber depending on the type of select box
     *
     * @param selectizeInstance
     * @param value
     * @returns {*}
     */
    var setupValueSubscriber = function(selectizeInstance, value)
    {
        // check if multiple
        var multiple = isMultiple(selectizeInstance.$input);

        if (multiple) {
            return setupMultipleValueSubscriber(selectizeInstance, value);
        } else {
            return setupSingleValueSubscriber(selectizeInstance, value);
        }
    }

    /**
     * Initialize the field and setup susbscribers
     *
     * @param el
     * @param valueAccessor
     * @param allBindings
     */
    var initialize = function(el, valueAccessor, allBindings) {
        if (!isElementTypeAllowed(el)) {
            throw "Element has to be a select or input text for selectize.js to work"
        }

        // Wrap element in jquery for easier management
        el = $(el);

        // Override default options with options given by the valueAccessor
        var settings = valueAccessor();
        var options = settings.options;
        var subscriptions = {
            options: false,
            value: false
        };
        var selectizeSettings = allBindings.get("selectizeSettings") || {};

        // If selectize is a multiple, set the value to the appropriate
        // knockout.js binding
        var value = getValueObservable(el, allBindings);

        // Selectize.js bug https://github.com/brianreavis/selectize.js/issues/739
        // Still have to use selectable_placeholder
        if (allBindings.get("valueAllowUnset") === true) {
            selectizeSettings.allowEmptyOption = true;
            setSelectablePlaceholderOptions(el, selectizeSettings);
        }

        el.selectize(selectizeSettings);
        var selectizeInstance = el[0].selectize;

        // Setup the subscribers
        subscriptions.options = setupOptionsSubscriber(selectizeInstance, options, selectizeSettings, settings);
        subscriptions.value   = setupValueSubscriber(selectizeInstance, value);

        // Clean up
        ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
            // destroy the selectize.js instance
            selectizeInstance.destroy();

            // dispose of all subscriptions to prevent memory leaks
            for(var i in subscriptions) {
                subscriptions[i].dispose();
            }
        });
    };

    ko.bindingHandlers.selectize = {
        init: initialize,
        after: ["foreach"]
    };

    ko.bindingHandlers.option = {
        update: function(element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            ko.selectExtensions.writeValue(element, value);
        }
    };

    ko.bindingHandlers.isOptionSelected = {
        update: function(element, valueAccessor) {
            var selectValue = ko.utils.unwrapObservable(valueAccessor());
            var optionValue = $(element).attr("value");

            if (selectValue == optionValue) {
                $(element).prop("selected", true);
            }
        }
    };

    ko.bindingHandlers.controlsDescendantBindings = {
        init: function() {
            return { controlsDescendantBindings: true } 
        }
    }

    ko.components.register("selectize", {
        viewModel: function(params) {
            params.selectizeSettings = $.extend({
                labelField: params.optionsText || "text",
                optgroupLabelField: "name",
                optgroupValueField: "name",
                plugins: [],
                valueField: params.optionsValue || "value"
            }, params.selectizeSettings || {});

            this.params = $.extend({
                options: ko.observableArray(),
                value: params.value,
                multiple: false,
                optgrouped: false,
                optgroupValues: "children"
            }, params);

            var self = this;
            this.initializeSelectizeBinding = function(elements) {
                var select = $(elements[0]).find("select");

                if (select.length === 0) {
                    throw "No select element was found.";
                }

                var bindingString = "";
                var saveValue = ko.unwrap(params.value);

                if (params.multiple === true) {
                    select[0].multiple = true;
                    bindingString += "selectedOptions: value";
                } else {
                    bindingString += "value: value";
                }

                if (params.emptyValue !== undefined) {
                    self.params.valueAllowUnset = true;
                    self.params.selectizeSettings.placeholder = params.emptyValue;
                    bindingString += ", valueAllowUnset: valueAllowUnset";
                }

                bindingString += ", foreach: options, selectize: {optgrouped: optgrouped, optgroupValues: optgroupValues, options: options}, " +
                                    "selectizeSettings: selectizeSettings";
                                    
                select.attr("data-bind", bindingString);

                ko.applyBindings(self.params, select[0]);

                /*
                 * When options and value binding are rendered, value is being set to undefined
                 * We therefore reset it after the bindings have been applied
                 */
                setTimeout(function(){
                    params.value(saveValue);
                });
            }
        },
        template: selectHtml
    });

}));