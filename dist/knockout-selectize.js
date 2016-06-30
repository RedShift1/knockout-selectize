(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'jquery', 'knockout', 'knockout-mapping', 'knockout-reactor', 'selectize', 'selectable-placeholder', 'knockout-change-subscriber', 'knockout-subscriptions-manager'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('jquery'), require('knockout'), require('knockout-mapping'), require('knockout-reactor'), require('selectize'), require('selectable-placeholder'), require('knockout-change-subscriber'), require('knockout-subscriptions-manager'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.$, global.ko, global.knockoutMapping, global.knockoutReactor, global.Selectize, global.selectablePlaceholder, global.ChangeSubscriber, global.SubscriptionsManager);
        global.knockoutSelectize = mod.exports;
    }
})(this, function (exports, _jquery, _knockout, _knockoutMapping, _knockoutReactor, _selectize, _selectablePlaceholder, _knockoutChangeSubscriber, _knockoutSubscriptionsManager) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _$ = _interopRequireDefault(_jquery);

    var _ko = _interopRequireDefault(_knockout);

    var _knockoutMapping2 = _interopRequireDefault(_knockoutMapping);

    var _knockoutReactor2 = _interopRequireDefault(_knockoutReactor);

    var _Selectize = _interopRequireDefault(_selectize);

    var _selectablePlaceholder2 = _interopRequireDefault(_selectablePlaceholder);

    var _ChangeSubscriber = _interopRequireDefault(_knockoutChangeSubscriber);

    var _SubscriptionsManager = _interopRequireDefault(_knockoutSubscriptionsManager);

    if (_ko['default'].mapping === undefined) {
        _ko['default'].mapping = _knockoutMapping2['default'];
    }

    var addOptgroup = function addOptgroup(selectizeInstance, optgroup, selectizeSettings, settings) {
        var value = optgroup[selectizeSettings.optgroupValueField];
        var label = optgroup[selectizeSettings.optgroupLabelField];

        selectizeInstance.addOptionGroup(value, {
            "label": label,
            "$order": optgroup[settings["optgroupSort"]]
        });

        return value;
    };

    var addOption = function addOption(selectizeInstance, option, optgroup) {
        if (optgroup !== undefined) {
            option.optgroup = optgroup;
        }

        selectizeInstance.addOption(option);
    };

    var addOptions = function addOptions(selectizeInstance, options, optgroup) {
        for (var i in options) {
            addOption(selectizeInstance, options[i], optgroup);
        }
    };

    var isElementTypeAllowed = function isElementTypeAllowed(el) {
        var elementType = el.tagName.toLowerCase();
        if (elementType !== 'select' && (elementType !== "input" || el.getAttribute("type") !== "text")) {
            return false;
        }

        return true;
    };

    var isMultiple = function isMultiple(el) {
        return el.prop("multiple");
    };

    var getObjectPropertyOrString = function getObjectPropertyOrString(objectOrString, property) {
        if (typeof objectOrString === "object") {
            return _ko['default'].unwrap(objectOrString[property]);
        } else {
                return objectOrString;
            }
    };

    var getValueObservable = function getValueObservable(el, allBindings) {
        var multiple = isMultiple(el);
        if (multiple === true) {
            return allBindings.get("selectedOptions") || _ko['default'].observableArray();
        } else {
            return allBindings.get("value") || _ko['default'].observable(null);
        }
    };

    var removeOptgroupOptions = function removeOptgroupOptions(selectizeInstance, optgroup) {
        var options = selectizeInstance.options;

        for (var i in options) {
            var option = options[i];
            if (option.optgroup === optgroup) {
                removeOption(selectizeInstance, option.value);
            }
        }
    };

    var removeOptgroup = function removeOptgroup(selectizeInstance, optgroup) {
        selectizeInstance.removeOptionGroup(optgroup);
    };

    var removeOption = function removeOption(selectizeInstance, value) {
        removeValue(selectizeInstance, value);
        selectizeInstance.removeOption(value);
    };

    var removeValue = function removeValue(selectizeInstance, _removeValue) {
        var currentValue = selectizeInstance.getValue();

        if (_$['default'].isArray(currentValue)) {
            var values = selectizeInstance.items.concat([]);

            values = _$['default'].grep(values, function (value) {
                return value !== _removeValue;
            });

            selectizeInstance.setValue(values);
        } else {
            if (selectizeInstance.getValue() === _removeValue) {
                selectizeInstance.setValue("");
            }
        }
    };

    var setupDisableSubscriber = function setupDisableSubscriber(selectizeInstance, disable) {
        if (_ko['default'].isObservable(disable)) {
            return disable.subscribe(function (newValue) {
                if (newValue === true) {
                    selectizeInstance.disable();
                } else {
                    selectizeInstance.enable();
                }
            });
        }

        return false;
    };

    var setSelectablePlaceholderOptions = function setSelectablePlaceholderOptions(el, selectizeSettings) {
        var emptyOption = el.find("option[value='']");

        if (_$['default'].inArray("selectable_placeholder", selectizeSettings.plugins) === -1) {
            selectizeSettings.plugins.push("selectable_placeholder");
        }

        if (emptyOption.length > 0) {
            selectizeSettings.placeholder = emptyOption.text();
        } else if (selectizeSettings.placeholder === undefined) {
                selectizeSettings.placeholder = "Select a value";
            }
    };

    var setupOptgroupSubscriber = function setupOptgroupSubscriber(selectizeInstance, options) {

        return false;
    };

    var setupOptionsSubscriber = function setupOptionsSubscriber(selectizeInstance, options, selectizeSettings, settings, subscriptionsManager) {
        if (settings.optgrouped === true) {
            subscriptionsManager.addSubscriptions(setupOptgroupSubscriber(selectizeInstance, options));

            var unwrapped = _ko['default'].unwrap(options);
            if (!(unwrapped instanceof Array)) {
                throw Error("Optgroup array is not an array.");
            }

            for (var i in unwrapped) {
                var optgroup = unwrapped[i];
                var childrensArray = optgroup[settings.optgroupValues];
                var label = optgroup[selectizeSettings.optgroupLabelField];

                subscriptionsManager.addSubscriptions(setupSingleOptionsSubscriber(selectizeInstance, childrensArray, selectizeSettings, label));
            }
        } else {
            subscriptionsManager.addSubscriptions(setupSingleOptionsSubscriber(selectizeInstance, options, selectizeSettings));
        }

        return true;
    };

    var setupSingleOptionsSubscriber = function setupSingleOptionsSubscriber(selectizeInstance, options, selectizeSettings, optgroup) {
        if (_ko['default'].isObservable(options)) {
            return options.changeSubscriber(function (additions, deletions) {
                for (var i in deletions) {
                    var value = getObjectPropertyOrString(deletions[i], selectizeSettings["valueField"]);
                    removeOption(selectizeInstance, value);
                }

                for (var i in additions) {
                    var addObject = {};
                    addObject[selectizeSettings.valueField] = getObjectPropertyOrString(additions[i], selectizeSettings["valueField"]);
                    addObject[selectizeSettings.labelField] = getObjectPropertyOrString(additions[i], selectizeSettings["labelField"]);

                    addOption(selectizeInstance, addObject, optgroup);
                }
            });
        }

        return false;
    };

    var setMultipleValues = function setMultipleValues(selectizeInstance, changes) {
        var values = selectizeInstance.items.concat([]);

        for (var i in changes) {
            var change = changes[i];

            if (change.status === "added") {
                if (_$['default'].inArray(change.value, values) === -1) {
                    values.push(change.value);
                }
            } else if (change.status === "deleted") {
                values = _$['default'].grep(values, function (value) {
                    return value !== change.value;
                });
            }
        }

        selectizeInstance.setValue(values);
    };

    var setSingleValue = function setSingleValue(selectizeInstance, value) {
        return selectizeInstance.setValue(value);
    };

    var setupMultipleValueSubscriber = function setupMultipleValueSubscriber(selectizeInstance, value) {
        if (_ko['default'].isObservable(value)) {
            return value.subscribe(function (changes) {
                setMultipleValues(selectizeInstance, changes);
            }, null, "arrayChange");
        }

        return false;
    };

    var setupSingleValueSubscriber = function setupSingleValueSubscriber(selectizeInstance, value) {
        if (_ko['default'].isObservable(value)) {
            return value.subscribe(function (newValue) {
                if (newValue !== selectizeInstance.getValue()) {
                    setSingleValue(selectizeInstance, newValue);
                }
            });
        }

        return false;
    };

    var setupValueSubscriber = function setupValueSubscriber(selectizeInstance, value, subscriptionsManager) {
        var multiple = isMultiple(selectizeInstance.$input);

        if (multiple) {
            subscriptionsManager.addSubscription(setupMultipleValueSubscriber(selectizeInstance, value));
        } else {
            subscriptionsManager.addSubscription(setupSingleValueSubscriber(selectizeInstance, value));
        }
    };

    var sortOptgroups = function sortOptgroups(optgroups, optgroupSort) {
        var unwrapped = _ko['default'].unwrap(optgroups);
        if (optgroupSort instanceof Function) {
            unwrapped.sort(optgroupSort);
        } else {
            unwrapped.sort(function (a, b) {
                var aUnwrapped = _ko['default'].unwrap(a[optgroupSort]);
                var bUnwrapped = _ko['default'].unwrap(b[optgroupSort]);

                return aUnwrapped - bUnwrapped;
            });
        }
    };

    var initialize = function initialize(el, valueAccessor, allBindings) {
        if (!isElementTypeAllowed(el)) {
            throw "Element has to be a select or input text for selectize.js to work";
        }

        el = _$['default'](el);

        var settings = valueAccessor();
        var options = settings.options;
        var subscriptionsManager = new _SubscriptionsManager['default']();
        var selectizeSettings = allBindings.get("selectizeSettings") || {};

        if (typeof selectizeSettings.placeholder !== "undefined" && selectizeSettings.placeholder instanceof Function) {
            selectizeSettings.placeholder = _ko['default'].unwrap(selectizeSettings.placeholder);
        }

        var value = getValueObservable(el, allBindings);

        if (allBindings.get("valueAllowUnset") === true) {
            selectizeSettings.allowEmptyOption = true;
            setSelectablePlaceholderOptions(el, selectizeSettings);
        }

        el.selectize(selectizeSettings);
        var selectizeInstance = el[0].selectize;

        subscriptionsManager.addSubscriptions(setupDisableSubscriber(selectizeInstance, allBindings.get("disable")));

        setupOptionsSubscriber(selectizeInstance, options, selectizeSettings, settings, subscriptionsManager);
        if (_ko['default'].isObservable(value)) {
            setupValueSubscriber(selectizeInstance, value, subscriptionsManager);
        }

        var optionsUnwrapped = _ko['default'].unwrap(options);
        var optionsFilled = optionsUnwrapped.length > 0;
        var saveValue = settings.saveValue;

        if (optionsFilled === false) {
            subscriptionsManager.addSubscription(options.subscribe(function () {
                optionsFilled = true;
                value(saveValue);
                subscriptionsManager.dispose("optionsFilledSubscription");
            }), "optionsFilledSubscription");
        }

        _ko['default'].utils.domNodeDisposal.addDisposeCallback(el[0], function () {
            selectizeInstance.destroy();

            subscriptionsManager.disposeAll();
        });
    };

    _ko['default'].bindingHandlers.selectize = {
        init: initialize,
        after: ["foreach"]
    };

    _ko['default'].bindingHandlers.option = {
        update: function update(element, valueAccessor) {
            var value = _ko['default'].utils.unwrapObservable(valueAccessor());
            _ko['default'].selectExtensions.writeValue(element, value);
        }
    };

    _ko['default'].bindingHandlers.isOptionSelected = {
        update: function update(element, valueAccessor) {
            var selectValue = _ko['default'].utils.unwrapObservable(valueAccessor());
            var optionValue = _$['default'](element).attr("value");

            if (selectValue == optionValue) {
                _$['default'](element).prop("selected", true);
            }
        }
    };

    _ko['default'].bindingHandlers.controlsDescendantBindings = {
        init: function init() {
            return { controlsDescendantBindings: true };
        }
    };

    var singleMarkup = '<select>' + '<option data-bind=\'isOptionSelected: $parent.value, text: typeof $data === "object" ' + '? $data[$parent.selectizeSettings.labelField] : $data, ' + 'option: typeof $data === "object" ? ' + '$data[$parent.selectizeSettings.valueField] : $data\'></option>' + '</select>';

    var optgroupMarkup = '<select>' + '<optgroup data-bind=\'attr: {label: $data[$parent.selectizeSettings.optgroupLabelField]}, ' + 'foreach: $data[$parent.optgroupValues]\'>' + '<option data-bind=\'text: $data[$parents[1].selectizeSettings.labelField], ' + 'option: $data[$parents[1].selectizeSettings.valueField], ' + 'isOptionSelected: $parents[1].value\'></option>' + '</optgroup>' + '</select>';

    _ko['default'].components.register("selectize", {
        template: '<div></div>',
        viewModel: {
            createViewModel: function createViewModel(params, componentInfo) {

                var viewmodel = function viewmodel(elem, params) {

                    params.selectizeSettings = _$['default'].extend({
                        labelField: _ko['default'].unwrap(params.optionsText) || "text",
                        optgroupLabelField: "name",
                        optgroupValueField: "name",
                        plugins: [],
                        valueField: _ko['default'].unwrap(params.optionsValue) || "value"
                    }, params.selectizeSettings || {});

                    if (params.selectizeSettings["searchField"] === undefined) {
                        params.selectizeSettings["searchField"] = [params.selectizeSettings.labelField];
                    }

                    this.params = _$['default'].extend({
                        disable: _ko['default'].observable(false),
                        options: _ko['default'].observableArray(),
                        value: params.value,
                        multiple: false,
                        optgrouped: false,
                        optgroupLabel: params.selectizeSettings.optgroupLabelField,
                        optgroupValue: params.selectizeSettings.optgroupValueField,
                        optgroupValues: "children",
                        optgroupSort: false,
                        bindings: {}
                    }, params);

                    var markup;
                    if (!this.params.optgrouped) {
                        markup = singleMarkup;
                    } else {
                        markup = optgroupMarkup;
                    }
                    markup = '<div data-bind="controlsDescendantBindings: {}">' + markup + '</div>';

                    var container = _$['default'](markup);
                    var select = container.find('select');

                    if (select.length === 0) {
                        throw "No select element was found.";
                    }

                    var bindingString = "";
                    this.params.saveValue = _ko['default'].unwrap(params.value);

                    if (params.multiple === true) {
                        select[0].multiple = true;
                        bindingString += "selectedOptions: value";
                    } else {
                        bindingString += "value: value";
                    }

                    if (params.emptyValue !== undefined) {
                        this.params.valueAllowUnset = true;
                        this.params.selectizeSettings.placeholder = params.emptyValue;
                        bindingString += ", valueAllowUnset: valueAllowUnset";
                    }

                    if (params.optgrouped === true && params.optgroupSort !== false) {
                        this.params.selectizeSettings.lockOptgroupOrder = true;

                        sortOptgroups(params.options, params.optgroupSort);

                        this.params.selectizeSettings.optgroupLabelField = this.params.optgroupLabel;
                        this.params.selectizeSettings.optgroupValueField = this.params.optgroupValue;
                    }

                    bindingString += ", foreach: options, disable: disable, " + "selectize: {optgrouped: optgrouped, optgroupValues: optgroupValues, options: options, optgroupSort: optgroupSort, " + "saveValue: saveValue}, selectizeSettings: selectizeSettings";

                    var otherBindings = _$['default'].extend({}, this.params.bindings);
                    this.params.bindings = undefined;

                    for (var i in otherBindings) {
                        bindingString += ", " + i + ": " + i;
                        this.params[i] = otherBindings[i];
                    }

                    select.attr("data-bind", bindingString);

                    _ko['default'].applyBindings(this.params, select[0]);

                    container.appendTo(_$['default'](elem).find('div'));
                };

                return new viewmodel(componentInfo.element, params);
            }
        }
    });
});