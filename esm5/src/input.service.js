import { InputManager } from "./input.manager";
import { CurrencyMaskInputMode } from "./currency-mask.config";
var InputService = /** @class */ (function () {
    function InputService(htmlInputElement, options) {
        this.htmlInputElement = htmlInputElement;
        this.options = options;
        this.SINGLE_DIGIT_REGEX = new RegExp(/^[0-9\u0660-\u0669\u06F0-\u06F9]$/);
        this.ONLY_NUMBERS_REGEX = new RegExp(/[^0-9\u0660-\u0669\u06F0-\u06F9]/g);
        this.PER_AR_NUMBER = new Map();
        this.inputManager = new InputManager(htmlInputElement);
        this.initialize();
    }
    InputService.prototype.initialize = function () {
        this.PER_AR_NUMBER.set("\u06F0", "0");
        this.PER_AR_NUMBER.set("\u06F1", "1");
        this.PER_AR_NUMBER.set("\u06F2", "2");
        this.PER_AR_NUMBER.set("\u06F3", "3");
        this.PER_AR_NUMBER.set("\u06F4", "4");
        this.PER_AR_NUMBER.set("\u06F5", "5");
        this.PER_AR_NUMBER.set("\u06F6", "6");
        this.PER_AR_NUMBER.set("\u06F7", "7");
        this.PER_AR_NUMBER.set("\u06F8", "8");
        this.PER_AR_NUMBER.set("\u06F9", "9");
        this.PER_AR_NUMBER.set("\u0660", "0");
        this.PER_AR_NUMBER.set("\u0661", "1");
        this.PER_AR_NUMBER.set("\u0662", "2");
        this.PER_AR_NUMBER.set("\u0663", "3");
        this.PER_AR_NUMBER.set("\u0664", "4");
        this.PER_AR_NUMBER.set("\u0665", "5");
        this.PER_AR_NUMBER.set("\u0666", "6");
        this.PER_AR_NUMBER.set("\u0667", "7");
        this.PER_AR_NUMBER.set("\u0668", "8");
        this.PER_AR_NUMBER.set("\u0669", "9");
    };
    InputService.prototype.addNumber = function (keyCode) {
        var _a = this.options, decimal = _a.decimal, precision = _a.precision, inputMode = _a.inputMode;
        var keyChar = String.fromCharCode(keyCode);
        var isDecimalChar = keyChar === this.options.decimal;
        if (!this.rawValue) {
            this.rawValue = this.applyMask(false, keyChar);
            var selectionStart = undefined;
            if (inputMode === CurrencyMaskInputMode.NATURAL && precision > 0) {
                selectionStart = this.rawValue.indexOf(decimal);
                if (isDecimalChar) {
                    selectionStart++;
                }
            }
            this.updateFieldValue(selectionStart);
        }
        else {
            var selectionStart = this.inputSelection.selectionStart;
            var selectionEnd = this.inputSelection.selectionEnd;
            var rawValueStart = this.rawValue.substring(0, selectionStart);
            var rawValueEnd = this.rawValue.substring(selectionEnd, this.rawValue.length);
            // In natural mode, replace decimals instead of shifting them.
            var inDecimalPortion = rawValueStart.indexOf(decimal) !== -1;
            if (inputMode === CurrencyMaskInputMode.NATURAL && inDecimalPortion && selectionStart === selectionEnd) {
                rawValueEnd = rawValueEnd.substring(1);
            }
            var newValue = rawValueStart + keyChar + rawValueEnd;
            var nextSelectionStart = selectionStart + 1;
            var isDecimalOrThousands = isDecimalChar || keyChar === this.options.thousands;
            if (isDecimalOrThousands && keyChar === rawValueEnd[0]) {
                // If the cursor is just before the decimal or thousands separator and the user types the
                // decimal or thousands separator, move the cursor past it.
                nextSelectionStart++;
            }
            else if (!this.SINGLE_DIGIT_REGEX.test(keyChar)) {
                // Ignore other non-numbers.
                return;
            }
            this.rawValue = newValue;
            this.updateFieldValue(nextSelectionStart);
        }
    };
    InputService.prototype.applyMask = function (isNumber, rawValue, disablePadAndTrim) {
        if (disablePadAndTrim === void 0) { disablePadAndTrim = false; }
        var _a = this.options, allowNegative = _a.allowNegative, decimal = _a.decimal, precision = _a.precision, prefix = _a.prefix, suffix = _a.suffix, thousands = _a.thousands, min = _a.min, max = _a.max, inputMode = _a.inputMode;
        rawValue = isNumber ? new Number(rawValue).toFixed(precision) : rawValue;
        var onlyNumbers = rawValue.replace(this.ONLY_NUMBERS_REGEX, "");
        if (!onlyNumbers && rawValue !== decimal) {
            return "";
        }
        if (inputMode === CurrencyMaskInputMode.NATURAL && !isNumber && !disablePadAndTrim) {
            rawValue = this.padOrTrimPrecision(rawValue);
            onlyNumbers = rawValue.replace(this.ONLY_NUMBERS_REGEX, "");
        }
        var integerPart = onlyNumbers.slice(0, onlyNumbers.length - precision)
            .replace(/^\u0660*/g, "")
            .replace(/^\u06F0*/g, "")
            .replace(/^0*/g, "");
        if (integerPart == "") {
            integerPart = "0";
        }
        var integerValue = parseInt(integerPart);
        integerPart = integerPart.replace(/\B(?=([0-9\u0660-\u0669\u06F0-\u06F9]{3})+(?![0-9\u0660-\u0669\u06F0-\u06F9]))/g, thousands);
        if (thousands && integerPart.startsWith(thousands)) {
            integerPart = integerPart.substring(1);
        }
        var newRawValue = integerPart;
        var decimalPart = onlyNumbers.slice(onlyNumbers.length - precision);
        var decimalValue = parseInt(decimalPart) || 0;
        var isNegative = rawValue.indexOf("-") > -1;
        // Ensure max is at least as large as min.
        max = (this.isNullOrUndefined(max) || this.isNullOrUndefined(min)) ? max : Math.max(max, min);
        // Restrict to the min and max values.
        var newValue = integerValue + (decimalValue / 100);
        newValue = isNegative ? -newValue : newValue;
        if (!this.isNullOrUndefined(max) && newValue > max) {
            return this.applyMask(true, max + '');
        }
        else if (!this.isNullOrUndefined(min) && newValue < min) {
            return this.applyMask(true, min + '');
        }
        if (precision > 0) {
            if (newRawValue == "0" && decimalPart.length < precision) {
                newRawValue += decimal + "0".repeat(precision - 1) + decimalPart;
            }
            else {
                newRawValue += decimal + decimalPart;
            }
        }
        var operator = (isNegative && allowNegative) ? "-" : "";
        return operator + prefix + newRawValue + suffix;
    };
    InputService.prototype.padOrTrimPrecision = function (rawValue) {
        var _a = this.options, decimal = _a.decimal, precision = _a.precision;
        var decimalIndex = rawValue.lastIndexOf(decimal);
        if (decimalIndex === -1) {
            decimalIndex = rawValue.length;
            rawValue += decimal;
        }
        var decimalPortion = rawValue.substring(decimalIndex).replace(this.ONLY_NUMBERS_REGEX, "");
        var actualPrecision = decimalPortion.length;
        if (actualPrecision < precision) {
            for (var i = actualPrecision; i < precision; i++) {
                decimalPortion += '0';
            }
        }
        else if (actualPrecision > precision) {
            decimalPortion = decimalPortion.substring(0, decimalPortion.length + precision - actualPrecision);
        }
        return rawValue.substring(0, decimalIndex) + decimal + decimalPortion;
    };
    InputService.prototype.clearMask = function (rawValue) {
        if (this.isNullable() && rawValue === "")
            return null;
        var value = (rawValue || "0").replace(this.options.prefix, "").replace(this.options.suffix, "");
        if (this.options.thousands) {
            value = value.replace(new RegExp("\\" + this.options.thousands, "g"), "");
        }
        if (this.options.decimal) {
            value = value.replace(this.options.decimal, ".");
        }
        this.PER_AR_NUMBER.forEach(function (val, key) {
            var re = new RegExp(key, "g");
            value = value.replace(re, val);
        });
        return parseFloat(value);
    };
    InputService.prototype.changeToNegative = function () {
        if (this.options.allowNegative && this.rawValue != "" && this.rawValue.charAt(0) != "-") {
            // Apply the mask to ensure the min and max values are enforced.
            this.rawValue = this.applyMask(false, "-" + (this.rawValue ? this.rawValue : '0'));
        }
    };
    InputService.prototype.changeToPositive = function () {
        // Apply the mask to ensure the min and max values are enforced.
        this.rawValue = this.applyMask(false, this.rawValue.replace("-", ""));
    };
    InputService.prototype.removeNumber = function (keyCode) {
        var _a = this.options, decimal = _a.decimal, thousands = _a.thousands, prefix = _a.prefix, suffix = _a.suffix, inputMode = _a.inputMode;
        if (this.isNullable() && this.value == 0) {
            this.rawValue = null;
            return;
        }
        var selectionEnd = this.inputSelection.selectionEnd;
        var selectionStart = this.inputSelection.selectionStart;
        var suffixStart = this.rawValue.length - suffix.length;
        selectionEnd = Math.min(suffixStart, Math.max(selectionEnd, prefix.length));
        selectionStart = Math.min(suffixStart, Math.max(selectionStart, prefix.length));
        // Check if selection was entirely in the prefix or suffix. 
        if (selectionStart === selectionEnd &&
            this.inputSelection.selectionStart !== this.inputSelection.selectionEnd) {
            this.updateFieldValue(selectionStart);
            return;
        }
        var decimalIndex = this.rawValue.indexOf(decimal);
        if (decimalIndex === -1) {
            decimalIndex = this.rawValue.length;
        }
        var shiftSelection = 0;
        var insertChars = '';
        var isCursorInDecimals = decimalIndex < selectionEnd;
        var isCursorImmediatelyAfterDecimalPoint = decimalIndex + 1 === selectionEnd;
        if (selectionEnd === selectionStart) {
            if (keyCode == 8) {
                if (selectionStart <= prefix.length) {
                    return;
                }
                selectionStart--;
                // If previous char isn't a number, go back one more.
                if (!this.rawValue.substr(selectionStart, 1).match(/\d/)) {
                    selectionStart--;
                }
                // In natural mode, jump backwards when in decimal portion of number.
                if (inputMode === CurrencyMaskInputMode.NATURAL && isCursorInDecimals) {
                    shiftSelection = -1;
                    // when removing a single whole number, replace it with 0
                    if (isCursorImmediatelyAfterDecimalPoint && this.value < 10 && this.value > -10) {
                        insertChars += '0';
                    }
                }
            }
            else if (keyCode == 46 || keyCode == 63272) {
                if (selectionStart === suffixStart) {
                    return;
                }
                selectionEnd++;
                // If next char isn't a number, go one more.
                if (!this.rawValue.substr(selectionStart, 1).match(/\d/)) {
                    selectionStart++;
                    selectionEnd++;
                }
            }
        }
        // In natural mode, replace decimals with 0s.
        if (inputMode === CurrencyMaskInputMode.NATURAL && selectionStart > decimalIndex) {
            var replacedDecimalCount = selectionEnd - selectionStart;
            for (var i = 0; i < replacedDecimalCount; i++) {
                insertChars += '0';
            }
        }
        var selectionFromEnd = this.rawValue.length - selectionEnd;
        this.rawValue = this.rawValue.substring(0, selectionStart) + insertChars + this.rawValue.substring(selectionEnd);
        // Remove leading thousand separator from raw value.
        var startChar = this.rawValue.substr(prefix.length, 1);
        if (startChar === thousands) {
            this.rawValue = this.rawValue.substring(0, prefix.length) + this.rawValue.substring(prefix.length + 1);
            selectionFromEnd = Math.min(selectionFromEnd, this.rawValue.length - prefix.length);
        }
        this.updateFieldValue(this.rawValue.length - selectionFromEnd + shiftSelection, true);
    };
    InputService.prototype.updateFieldValue = function (selectionStart, disablePadAndTrim) {
        if (disablePadAndTrim === void 0) { disablePadAndTrim = false; }
        var newRawValue = this.applyMask(false, this.rawValue || "", disablePadAndTrim);
        selectionStart = selectionStart == undefined ? this.rawValue.length : selectionStart;
        selectionStart = Math.max(this.options.prefix.length, Math.min(selectionStart, this.rawValue.length - this.options.suffix.length));
        this.inputManager.updateValueAndCursor(newRawValue, this.rawValue.length, selectionStart);
    };
    InputService.prototype.updateOptions = function (options) {
        var value = this.value;
        this.options = options;
        this.value = value;
    };
    InputService.prototype.prefixLength = function () {
        return this.options.prefix.length;
    };
    InputService.prototype.suffixLength = function () {
        return this.options.suffix.length;
    };
    InputService.prototype.isNullable = function () {
        return this.options.nullable;
    };
    Object.defineProperty(InputService.prototype, "canInputMoreNumbers", {
        get: function () {
            return this.inputManager.canInputMoreNumbers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputService.prototype, "inputSelection", {
        get: function () {
            return this.inputManager.inputSelection;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputService.prototype, "rawValue", {
        get: function () {
            return this.inputManager.rawValue;
        },
        set: function (value) {
            this.inputManager.rawValue = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputService.prototype, "storedRawValue", {
        get: function () {
            return this.inputManager.storedRawValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputService.prototype, "value", {
        get: function () {
            return this.clearMask(this.rawValue);
        },
        set: function (value) {
            this.rawValue = this.applyMask(true, "" + value);
        },
        enumerable: false,
        configurable: true
    });
    InputService.prototype.isNullOrUndefined = function (value) {
        return value === null || value === undefined;
    };
    return InputService;
}());
export { InputService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1jdXJyZW5jeS8iLCJzb3VyY2VzIjpbInNyYy9pbnB1dC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQXNCLHFCQUFxQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFbkY7SUFnQ0ksc0JBQW9CLGdCQUFxQixFQUFVLE9BQTJCO1FBQTFELHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBSztRQUFVLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBL0J0RSx1QkFBa0IsR0FBVyxJQUFJLE1BQU0sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQzdFLHVCQUFrQixHQUFXLElBQUksTUFBTSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFFckYsa0JBQWEsR0FBd0IsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUE2QjNELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDckIsQ0FBQztJQTdCRCxpQ0FBVSxHQUFWO1FBQ0ksSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMxQyxDQUFD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O0lBRUQsc0JBQUksd0NBQWM7YUFBbEI7WUFDSSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDO1FBQzVDLENBQUM7OztPQUFBO0lBRUQsc0JBQUksa0NBQVE7YUFBWjtZQUNJLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDdEMsQ0FBQzthQUVELFVBQWEsS0FBYTtZQUN0QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdkMsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSx3Q0FBYzthQUFsQjtZQUNJLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUM7UUFDNUMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSwrQkFBSzthQUFUO1lBQ0ksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QyxDQUFDO2FBRUQsVUFBVSxLQUFhO1lBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQ3JELENBQUM7OztPQUpBO0lBTU8sd0NBQWlCLEdBQXpCLFVBQTBCLEtBQVU7UUFDaEMsT0FBTyxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxTQUFTLENBQUM7SUFDakQsQ0FBQztJQUNMLG1CQUFDO0FBQUQsQ0FBQyxBQWxWRCxJQWtWQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElucHV0TWFuYWdlciB9IGZyb20gXCIuL2lucHV0Lm1hbmFnZXJcIjtcclxuaW1wb3J0IHsgQ3VycmVuY3lNYXNrQ29uZmlnLCBDdXJyZW5jeU1hc2tJbnB1dE1vZGUgfSBmcm9tIFwiLi9jdXJyZW5jeS1tYXNrLmNvbmZpZ1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElucHV0U2VydmljZSB7XHJcbiAgICBwcml2YXRlIFNJTkdMRV9ESUdJVF9SRUdFWDogUmVnRXhwID0gbmV3IFJlZ0V4cCgvXlswLTlcXHUwNjYwLVxcdTA2NjlcXHUwNkYwLVxcdTA2RjldJC8pO1xyXG4gICAgcHJpdmF0ZSBPTkxZX05VTUJFUlNfUkVHRVg6IFJlZ0V4cCA9IG5ldyBSZWdFeHAoL1teMC05XFx1MDY2MC1cXHUwNjY5XFx1MDZGMC1cXHUwNkY5XS9nKTtcclxuXHJcbiAgICBQRVJfQVJfTlVNQkVSOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcclxuXHJcbiAgICBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIHRoaXMuUEVSX0FSX05VTUJFUi5zZXQoXCJcXHUwNkYwXCIsIFwiMFwiKTtcclxuICAgICAgICB0aGlzLlBFUl9BUl9OVU1CRVIuc2V0KFwiXFx1MDZGMVwiLCBcIjFcIik7XHJcbiAgICAgICAgdGhpcy5QRVJfQVJfTlVNQkVSLnNldChcIlxcdTA2RjJcIiwgXCIyXCIpO1xyXG4gICAgICAgIHRoaXMuUEVSX0FSX05VTUJFUi5zZXQoXCJcXHUwNkYzXCIsIFwiM1wiKTtcclxuICAgICAgICB0aGlzLlBFUl9BUl9OVU1CRVIuc2V0KFwiXFx1MDZGNFwiLCBcIjRcIik7XHJcbiAgICAgICAgdGhpcy5QRVJfQVJfTlVNQkVSLnNldChcIlxcdTA2RjVcIiwgXCI1XCIpO1xyXG4gICAgICAgIHRoaXMuUEVSX0FSX05VTUJFUi5zZXQoXCJcXHUwNkY2XCIsIFwiNlwiKTtcclxuICAgICAgICB0aGlzLlBFUl9BUl9OVU1CRVIuc2V0KFwiXFx1MDZGN1wiLCBcIjdcIik7XHJcbiAgICAgICAgdGhpcy5QRVJfQVJfTlVNQkVSLnNldChcIlxcdTA2RjhcIiwgXCI4XCIpO1xyXG4gICAgICAgIHRoaXMuUEVSX0FSX05VTUJFUi5zZXQoXCJcXHUwNkY5XCIsIFwiOVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5QRVJfQVJfTlVNQkVSLnNldChcIlxcdTA2NjBcIiwgXCIwXCIpO1xyXG4gICAgICAgIHRoaXMuUEVSX0FSX05VTUJFUi5zZXQoXCJcXHUwNjYxXCIsIFwiMVwiKTtcclxuICAgICAgICB0aGlzLlBFUl9BUl9OVU1CRVIuc2V0KFwiXFx1MDY2MlwiLCBcIjJcIik7XHJcbiAgICAgICAgdGhpcy5QRVJfQVJfTlVNQkVSLnNldChcIlxcdTA2NjNcIiwgXCIzXCIpO1xyXG4gICAgICAgIHRoaXMuUEVSX0FSX05VTUJFUi5zZXQoXCJcXHUwNjY0XCIsIFwiNFwiKTtcclxuICAgICAgICB0aGlzLlBFUl9BUl9OVU1CRVIuc2V0KFwiXFx1MDY2NVwiLCBcIjVcIik7XHJcbiAgICAgICAgdGhpcy5QRVJfQVJfTlVNQkVSLnNldChcIlxcdTA2NjZcIiwgXCI2XCIpO1xyXG4gICAgICAgIHRoaXMuUEVSX0FSX05VTUJFUi5zZXQoXCJcXHUwNjY3XCIsIFwiN1wiKTtcclxuICAgICAgICB0aGlzLlBFUl9BUl9OVU1CRVIuc2V0KFwiXFx1MDY2OFwiLCBcIjhcIik7XHJcbiAgICAgICAgdGhpcy5QRVJfQVJfTlVNQkVSLnNldChcIlxcdTA2NjlcIiwgXCI5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0TWFuYWdlcjogSW5wdXRNYW5hZ2VyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHRtbElucHV0RWxlbWVudDogYW55LCBwcml2YXRlIG9wdGlvbnM6IEN1cnJlbmN5TWFza0NvbmZpZykge1xyXG4gICAgICAgIHRoaXMuaW5wdXRNYW5hZ2VyID0gbmV3IElucHV0TWFuYWdlcihodG1sSW5wdXRFbGVtZW50KTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKVxyXG4gICAgfVxyXG5cclxuICAgIGFkZE51bWJlcihrZXlDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB7ZGVjaW1hbCwgcHJlY2lzaW9uLCBpbnB1dE1vZGV9ID0gdGhpcy5vcHRpb25zO1xyXG4gICAgICAgIGxldCBrZXlDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShrZXlDb2RlKTtcclxuICAgICAgICBjb25zdCBpc0RlY2ltYWxDaGFyID0ga2V5Q2hhciA9PT0gdGhpcy5vcHRpb25zLmRlY2ltYWw7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5yYXdWYWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJhd1ZhbHVlID0gdGhpcy5hcHBseU1hc2soZmFsc2UsIGtleUNoYXIpO1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9uU3RhcnQ6bnVtYmVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAoaW5wdXRNb2RlID09PSBDdXJyZW5jeU1hc2tJbnB1dE1vZGUuTkFUVVJBTCAmJiBwcmVjaXNpb24gPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25TdGFydCA9IHRoaXMucmF3VmFsdWUuaW5kZXhPZihkZWNpbWFsKTtcclxuICAgICAgICAgICAgICAgIGlmIChpc0RlY2ltYWxDaGFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uU3RhcnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZpZWxkVmFsdWUoc2VsZWN0aW9uU3RhcnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb25TdGFydCA9IHRoaXMuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uU3RhcnQ7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb25FbmQgPSB0aGlzLmlucHV0U2VsZWN0aW9uLnNlbGVjdGlvbkVuZDtcclxuICAgICAgICAgICAgY29uc3QgcmF3VmFsdWVTdGFydCA9IHRoaXMucmF3VmFsdWUuc3Vic3RyaW5nKDAsIHNlbGVjdGlvblN0YXJ0KTtcclxuICAgICAgICAgICAgbGV0IHJhd1ZhbHVlRW5kID0gdGhpcy5yYXdWYWx1ZS5zdWJzdHJpbmcoc2VsZWN0aW9uRW5kLCB0aGlzLnJhd1ZhbHVlLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICAvLyBJbiBuYXR1cmFsIG1vZGUsIHJlcGxhY2UgZGVjaW1hbHMgaW5zdGVhZCBvZiBzaGlmdGluZyB0aGVtLlxyXG4gICAgICAgICAgICBjb25zdCBpbkRlY2ltYWxQb3J0aW9uID0gcmF3VmFsdWVTdGFydC5pbmRleE9mKGRlY2ltYWwpICE9PSAtMTtcclxuICAgICAgICAgICAgaWYgKGlucHV0TW9kZSA9PT0gQ3VycmVuY3lNYXNrSW5wdXRNb2RlLk5BVFVSQUwgJiYgaW5EZWNpbWFsUG9ydGlvbiAmJiBzZWxlY3Rpb25TdGFydCA9PT0gc2VsZWN0aW9uRW5kKSB7XHJcbiAgICAgICAgICAgICAgcmF3VmFsdWVFbmQgPSByYXdWYWx1ZUVuZC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gcmF3VmFsdWVTdGFydCArIGtleUNoYXIgKyByYXdWYWx1ZUVuZDtcclxuICAgICAgICAgICAgbGV0IG5leHRTZWxlY3Rpb25TdGFydCA9IHNlbGVjdGlvblN0YXJ0ICsgMTtcclxuICAgICAgICAgICAgY29uc3QgaXNEZWNpbWFsT3JUaG91c2FuZHMgPSBpc0RlY2ltYWxDaGFyIHx8IGtleUNoYXIgPT09IHRoaXMub3B0aW9ucy50aG91c2FuZHM7XHJcbiAgICAgICAgICAgIGlmIChpc0RlY2ltYWxPclRob3VzYW5kcyAmJiBrZXlDaGFyID09PSByYXdWYWx1ZUVuZFswXSkge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGN1cnNvciBpcyBqdXN0IGJlZm9yZSB0aGUgZGVjaW1hbCBvciB0aG91c2FuZHMgc2VwYXJhdG9yIGFuZCB0aGUgdXNlciB0eXBlcyB0aGVcclxuICAgICAgICAgICAgICAgIC8vIGRlY2ltYWwgb3IgdGhvdXNhbmRzIHNlcGFyYXRvciwgbW92ZSB0aGUgY3Vyc29yIHBhc3QgaXQuXHJcbiAgICAgICAgICAgICAgICBuZXh0U2VsZWN0aW9uU3RhcnQrKztcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5TSU5HTEVfRElHSVRfUkVHRVgudGVzdChrZXlDaGFyKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gSWdub3JlIG90aGVyIG5vbi1udW1iZXJzLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJhd1ZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRmllbGRWYWx1ZShuZXh0U2VsZWN0aW9uU3RhcnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBseU1hc2soaXNOdW1iZXI6IGJvb2xlYW4sIHJhd1ZhbHVlOiBzdHJpbmcsIGRpc2FibGVQYWRBbmRUcmltID0gZmFsc2UpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCB7YWxsb3dOZWdhdGl2ZSwgZGVjaW1hbCwgcHJlY2lzaW9uLCBwcmVmaXgsIHN1ZmZpeCwgdGhvdXNhbmRzLCBtaW4sIG1heCwgaW5wdXRNb2RlfSA9IHRoaXMub3B0aW9ucztcclxuXHJcbiAgICAgICAgcmF3VmFsdWUgPSBpc051bWJlciA/IG5ldyBOdW1iZXIocmF3VmFsdWUpLnRvRml4ZWQocHJlY2lzaW9uKSA6IHJhd1ZhbHVlO1xyXG4gICAgICAgIGxldCBvbmx5TnVtYmVycyA9IHJhd1ZhbHVlLnJlcGxhY2UodGhpcy5PTkxZX05VTUJFUlNfUkVHRVgsIFwiXCIpO1xyXG5cclxuICAgICAgICBpZiAoIW9ubHlOdW1iZXJzICYmIHJhd1ZhbHVlICE9PSBkZWNpbWFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlucHV0TW9kZSA9PT0gQ3VycmVuY3lNYXNrSW5wdXRNb2RlLk5BVFVSQUwgJiYgIWlzTnVtYmVyICYmICFkaXNhYmxlUGFkQW5kVHJpbSkge1xyXG4gICAgICAgICAgICByYXdWYWx1ZSA9IHRoaXMucGFkT3JUcmltUHJlY2lzaW9uKHJhd1ZhbHVlKTtcclxuICAgICAgICAgICAgb25seU51bWJlcnMgPSByYXdWYWx1ZS5yZXBsYWNlKHRoaXMuT05MWV9OVU1CRVJTX1JFR0VYLCBcIlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpbnRlZ2VyUGFydCA9IG9ubHlOdW1iZXJzLnNsaWNlKDAsIG9ubHlOdW1iZXJzLmxlbmd0aCAtIHByZWNpc2lvbilcclxuICAgICAgICAgICAgLnJlcGxhY2UoL15cXHUwNjYwKi9nLCBcIlwiKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXlxcdTA2RjAqL2csIFwiXCIpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9eMCovZywgXCJcIik7XHJcblxyXG4gICAgICAgIGlmIChpbnRlZ2VyUGFydCA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGludGVnZXJQYXJ0ID0gXCIwXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBpbnRlZ2VyVmFsdWUgPSBwYXJzZUludChpbnRlZ2VyUGFydCk7XHJcblxyXG4gICAgICAgIGludGVnZXJQYXJ0ID0gaW50ZWdlclBhcnQucmVwbGFjZSgvXFxCKD89KFswLTlcXHUwNjYwLVxcdTA2NjlcXHUwNkYwLVxcdTA2RjldezN9KSsoPyFbMC05XFx1MDY2MC1cXHUwNjY5XFx1MDZGMC1cXHUwNkY5XSkpL2csIHRob3VzYW5kcyk7XHJcbiAgICAgICAgaWYgKHRob3VzYW5kcyAmJiBpbnRlZ2VyUGFydC5zdGFydHNXaXRoKHRob3VzYW5kcykpIHtcclxuICAgICAgICAgICAgaW50ZWdlclBhcnQgPSBpbnRlZ2VyUGFydC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbmV3UmF3VmFsdWUgPSBpbnRlZ2VyUGFydDtcclxuICAgICAgICBsZXQgZGVjaW1hbFBhcnQgPSBvbmx5TnVtYmVycy5zbGljZShvbmx5TnVtYmVycy5sZW5ndGggLSBwcmVjaXNpb24pO1xyXG4gICAgICAgIGxldCBkZWNpbWFsVmFsdWUgPSBwYXJzZUludChkZWNpbWFsUGFydCkgfHwgMDtcclxuXHJcbiAgICAgICAgbGV0IGlzTmVnYXRpdmUgPSByYXdWYWx1ZS5pbmRleE9mKFwiLVwiKSA+IC0xO1xyXG5cclxuICAgICAgICAvLyBFbnN1cmUgbWF4IGlzIGF0IGxlYXN0IGFzIGxhcmdlIGFzIG1pbi5cclxuICAgICAgICBtYXggPSAodGhpcy5pc051bGxPclVuZGVmaW5lZChtYXgpIHx8IHRoaXMuaXNOdWxsT3JVbmRlZmluZWQobWluKSkgPyBtYXggOiBNYXRoLm1heChtYXgsIG1pbik7XHJcblxyXG4gICAgICAgIC8vIFJlc3RyaWN0IHRvIHRoZSBtaW4gYW5kIG1heCB2YWx1ZXMuXHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gaW50ZWdlclZhbHVlICsgKGRlY2ltYWxWYWx1ZSAvIDEwMCk7XHJcbiAgICAgICAgbmV3VmFsdWUgPSBpc05lZ2F0aXZlID8gLW5ld1ZhbHVlIDogbmV3VmFsdWU7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzTnVsbE9yVW5kZWZpbmVkKG1heCkgJiYgbmV3VmFsdWUgPiBtYXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlNYXNrKHRydWUsIG1heCArICcnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmlzTnVsbE9yVW5kZWZpbmVkKG1pbikgJiYgbmV3VmFsdWUgPCBtaW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlNYXNrKHRydWUsIG1pbiArICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwcmVjaXNpb24gPiAwKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdSYXdWYWx1ZSA9PSBcIjBcIiAmJiBkZWNpbWFsUGFydC5sZW5ndGggPCBwcmVjaXNpb24pIHtcclxuICAgICAgICAgICAgICAgIG5ld1Jhd1ZhbHVlICs9IGRlY2ltYWwgKyBcIjBcIi5yZXBlYXQocHJlY2lzaW9uIC0gMSkgKyBkZWNpbWFsUGFydDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5ld1Jhd1ZhbHVlICs9IGRlY2ltYWwgKyBkZWNpbWFsUGFydDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gKGlzTmVnYXRpdmUgJiYgYWxsb3dOZWdhdGl2ZSkgPyBcIi1cIiA6IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIG9wZXJhdG9yICsgcHJlZml4ICsgbmV3UmF3VmFsdWUgKyBzdWZmaXg7XHJcbiAgICB9XHJcblxyXG4gICAgcGFkT3JUcmltUHJlY2lzaW9uKHJhd1ZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCB7ZGVjaW1hbCwgcHJlY2lzaW9ufSA9IHRoaXMub3B0aW9ucztcclxuXHJcbiAgICAgICAgbGV0IGRlY2ltYWxJbmRleCA9IHJhd1ZhbHVlLmxhc3RJbmRleE9mKGRlY2ltYWwpO1xyXG4gICAgICAgIGlmIChkZWNpbWFsSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGRlY2ltYWxJbmRleCA9IHJhd1ZhbHVlLmxlbmd0aDtcclxuICAgICAgICAgICAgcmF3VmFsdWUgKz0gZGVjaW1hbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkZWNpbWFsUG9ydGlvbiA9IHJhd1ZhbHVlLnN1YnN0cmluZyhkZWNpbWFsSW5kZXgpLnJlcGxhY2UodGhpcy5PTkxZX05VTUJFUlNfUkVHRVgsIFwiXCIpO1xyXG4gICAgICAgIGNvbnN0IGFjdHVhbFByZWNpc2lvbiA9IGRlY2ltYWxQb3J0aW9uLmxlbmd0aDtcclxuICAgICAgICBpZiAoYWN0dWFsUHJlY2lzaW9uIDwgcHJlY2lzaW9uKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBhY3R1YWxQcmVjaXNpb247IGkgPCBwcmVjaXNpb247IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZGVjaW1hbFBvcnRpb24gKz0gJzAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChhY3R1YWxQcmVjaXNpb24gPiBwcmVjaXNpb24pIHtcclxuICAgICAgICAgICAgZGVjaW1hbFBvcnRpb24gPSBkZWNpbWFsUG9ydGlvbi5zdWJzdHJpbmcoMCwgZGVjaW1hbFBvcnRpb24ubGVuZ3RoICsgcHJlY2lzaW9uIC0gYWN0dWFsUHJlY2lzaW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByYXdWYWx1ZS5zdWJzdHJpbmcoMCwgZGVjaW1hbEluZGV4KSArIGRlY2ltYWwgKyBkZWNpbWFsUG9ydGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhck1hc2socmF3VmFsdWU6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNOdWxsYWJsZSgpICYmIHJhd1ZhbHVlID09PSBcIlwiKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlID0gKHJhd1ZhbHVlIHx8IFwiMFwiKS5yZXBsYWNlKHRoaXMub3B0aW9ucy5wcmVmaXgsIFwiXCIpLnJlcGxhY2UodGhpcy5vcHRpb25zLnN1ZmZpeCwgXCJcIik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMudGhvdXNhbmRzKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShuZXcgUmVnRXhwKFwiXFxcXFwiICsgdGhpcy5vcHRpb25zLnRob3VzYW5kcywgXCJnXCIpLCBcIlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVjaW1hbCkge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UodGhpcy5vcHRpb25zLmRlY2ltYWwsIFwiLlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuUEVSX0FSX05VTUJFUi5mb3JFYWNoKCh2YWw6IHN0cmluZywga2V5OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKGtleSwgXCJnXCIpO1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmUsIHZhbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVRvTmVnYXRpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbGxvd05lZ2F0aXZlICYmIHRoaXMucmF3VmFsdWUgIT0gXCJcIiAmJiB0aGlzLnJhd1ZhbHVlLmNoYXJBdCgwKSAhPSBcIi1cIikge1xyXG4gICAgICAgICAgICAvLyBBcHBseSB0aGUgbWFzayB0byBlbnN1cmUgdGhlIG1pbiBhbmQgbWF4IHZhbHVlcyBhcmUgZW5mb3JjZWQuXHJcbiAgICAgICAgICAgIHRoaXMucmF3VmFsdWUgPSB0aGlzLmFwcGx5TWFzayhmYWxzZSwgXCItXCIgKyAodGhpcy5yYXdWYWx1ZSA/IHRoaXMucmF3VmFsdWUgOiAnMCcpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlVG9Qb3NpdGl2ZSgpOiB2b2lkIHtcclxuICAgICAgICAvLyBBcHBseSB0aGUgbWFzayB0byBlbnN1cmUgdGhlIG1pbiBhbmQgbWF4IHZhbHVlcyBhcmUgZW5mb3JjZWQuXHJcbiAgICAgICAgdGhpcy5yYXdWYWx1ZSA9IHRoaXMuYXBwbHlNYXNrKGZhbHNlLCB0aGlzLnJhd1ZhbHVlLnJlcGxhY2UoXCItXCIsIFwiXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVOdW1iZXIoa2V5Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHtkZWNpbWFsLCB0aG91c2FuZHMsIHByZWZpeCwgc3VmZml4LCBpbnB1dE1vZGV9ID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc051bGxhYmxlKCkgJiYgdGhpcy52YWx1ZSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmF3VmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2VsZWN0aW9uRW5kID0gdGhpcy5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25FbmQ7XHJcbiAgICAgICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gdGhpcy5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25TdGFydDtcclxuXHJcbiAgICAgICAgY29uc3Qgc3VmZml4U3RhcnQgPSB0aGlzLnJhd1ZhbHVlLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGg7XHJcbiAgICAgICAgc2VsZWN0aW9uRW5kID0gTWF0aC5taW4oc3VmZml4U3RhcnQsIE1hdGgubWF4KHNlbGVjdGlvbkVuZCwgcHJlZml4Lmxlbmd0aCkpO1xyXG4gICAgICAgIHNlbGVjdGlvblN0YXJ0ID0gTWF0aC5taW4oc3VmZml4U3RhcnQsIE1hdGgubWF4KHNlbGVjdGlvblN0YXJ0LCBwcmVmaXgubGVuZ3RoKSk7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIHNlbGVjdGlvbiB3YXMgZW50aXJlbHkgaW4gdGhlIHByZWZpeCBvciBzdWZmaXguIFxyXG4gICAgICAgIGlmIChzZWxlY3Rpb25TdGFydCA9PT0gc2VsZWN0aW9uRW5kICYmXHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uU3RhcnQgIT09IHRoaXMuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uRW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRmllbGRWYWx1ZShzZWxlY3Rpb25TdGFydCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkZWNpbWFsSW5kZXggPSB0aGlzLnJhd1ZhbHVlLmluZGV4T2YoZGVjaW1hbCk7XHJcbiAgICAgICAgaWYgKGRlY2ltYWxJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgZGVjaW1hbEluZGV4ID0gdGhpcy5yYXdWYWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2hpZnRTZWxlY3Rpb24gPSAwO1xyXG4gICAgICAgIGxldCBpbnNlcnRDaGFycyA9ICcnO1xyXG4gICAgICAgIGNvbnN0IGlzQ3Vyc29ySW5EZWNpbWFscyA9IGRlY2ltYWxJbmRleCA8IHNlbGVjdGlvbkVuZDtcclxuICAgICAgICBjb25zdCBpc0N1cnNvckltbWVkaWF0ZWx5QWZ0ZXJEZWNpbWFsUG9pbnQgPSBkZWNpbWFsSW5kZXggKyAxID09PSBzZWxlY3Rpb25FbmQ7XHJcbiAgICAgICAgaWYgKHNlbGVjdGlvbkVuZCA9PT0gc2VsZWN0aW9uU3RhcnQpIHtcclxuICAgICAgICAgICAgaWYgKGtleUNvZGUgPT0gOCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvblN0YXJ0IDw9IHByZWZpeC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25TdGFydC0tO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIHByZXZpb3VzIGNoYXIgaXNuJ3QgYSBudW1iZXIsIGdvIGJhY2sgb25lIG1vcmUuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucmF3VmFsdWUuc3Vic3RyKHNlbGVjdGlvblN0YXJ0LCAxKS5tYXRjaCgvXFxkLykpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25TdGFydC0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIEluIG5hdHVyYWwgbW9kZSwganVtcCBiYWNrd2FyZHMgd2hlbiBpbiBkZWNpbWFsIHBvcnRpb24gb2YgbnVtYmVyLlxyXG4gICAgICAgICAgICAgICAgaWYgKGlucHV0TW9kZSA9PT0gQ3VycmVuY3lNYXNrSW5wdXRNb2RlLk5BVFVSQUwgJiYgaXNDdXJzb3JJbkRlY2ltYWxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpZnRTZWxlY3Rpb24gPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIHJlbW92aW5nIGEgc2luZ2xlIHdob2xlIG51bWJlciwgcmVwbGFjZSBpdCB3aXRoIDBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNDdXJzb3JJbW1lZGlhdGVseUFmdGVyRGVjaW1hbFBvaW50ICYmIHRoaXMudmFsdWUgPCAxMCAmJiB0aGlzLnZhbHVlID4gLTEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydENoYXJzICs9ICcwJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PSA0NiB8fCBrZXlDb2RlID09IDYzMjcyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uU3RhcnQgPT09IHN1ZmZpeFN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uRW5kKys7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgbmV4dCBjaGFyIGlzbid0IGEgbnVtYmVyLCBnbyBvbmUgbW9yZS5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5yYXdWYWx1ZS5zdWJzdHIoc2VsZWN0aW9uU3RhcnQsIDEpLm1hdGNoKC9cXGQvKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblN0YXJ0Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uRW5kKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEluIG5hdHVyYWwgbW9kZSwgcmVwbGFjZSBkZWNpbWFscyB3aXRoIDBzLlxyXG4gICAgICAgIGlmIChpbnB1dE1vZGUgPT09IEN1cnJlbmN5TWFza0lucHV0TW9kZS5OQVRVUkFMICYmIHNlbGVjdGlvblN0YXJ0ID4gZGVjaW1hbEluZGV4KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcGxhY2VkRGVjaW1hbENvdW50ID0gc2VsZWN0aW9uRW5kIC0gc2VsZWN0aW9uU3RhcnQ7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVwbGFjZWREZWNpbWFsQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0Q2hhcnMgKz0gJzAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2VsZWN0aW9uRnJvbUVuZCA9IHRoaXMucmF3VmFsdWUubGVuZ3RoIC0gc2VsZWN0aW9uRW5kO1xyXG4gICAgICAgIHRoaXMucmF3VmFsdWUgPSB0aGlzLnJhd1ZhbHVlLnN1YnN0cmluZygwLCBzZWxlY3Rpb25TdGFydCkgKyBpbnNlcnRDaGFycyArIHRoaXMucmF3VmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvbkVuZCk7XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSBsZWFkaW5nIHRob3VzYW5kIHNlcGFyYXRvciBmcm9tIHJhdyB2YWx1ZS5cclxuICAgICAgICBjb25zdCBzdGFydENoYXIgPSB0aGlzLnJhd1ZhbHVlLnN1YnN0cihwcmVmaXgubGVuZ3RoLCAxKTtcclxuICAgICAgICBpZiAoc3RhcnRDaGFyID09PSB0aG91c2FuZHMpIHtcclxuICAgICAgICAgICAgdGhpcy5yYXdWYWx1ZSA9IHRoaXMucmF3VmFsdWUuc3Vic3RyaW5nKDAsIHByZWZpeC5sZW5ndGgpICsgdGhpcy5yYXdWYWx1ZS5zdWJzdHJpbmcocHJlZml4Lmxlbmd0aCArIDEpO1xyXG4gICAgICAgICAgICBzZWxlY3Rpb25Gcm9tRW5kID0gTWF0aC5taW4oc2VsZWN0aW9uRnJvbUVuZCwgdGhpcy5yYXdWYWx1ZS5sZW5ndGggLSBwcmVmaXgubGVuZ3RoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlRmllbGRWYWx1ZSh0aGlzLnJhd1ZhbHVlLmxlbmd0aCAtIHNlbGVjdGlvbkZyb21FbmQgKyBzaGlmdFNlbGVjdGlvbiwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRmllbGRWYWx1ZShzZWxlY3Rpb25TdGFydD86IG51bWJlciwgZGlzYWJsZVBhZEFuZFRyaW0gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICAgIGxldCBuZXdSYXdWYWx1ZSA9IHRoaXMuYXBwbHlNYXNrKGZhbHNlLCB0aGlzLnJhd1ZhbHVlIHx8IFwiXCIsIGRpc2FibGVQYWRBbmRUcmltKTtcclxuICAgICAgICBzZWxlY3Rpb25TdGFydCA9IHNlbGVjdGlvblN0YXJ0ID09IHVuZGVmaW5lZCA/IHRoaXMucmF3VmFsdWUubGVuZ3RoIDogc2VsZWN0aW9uU3RhcnQ7XHJcbiAgICAgICAgc2VsZWN0aW9uU3RhcnQgPSBNYXRoLm1heCh0aGlzLm9wdGlvbnMucHJlZml4Lmxlbmd0aCwgTWF0aC5taW4oc2VsZWN0aW9uU3RhcnQsIHRoaXMucmF3VmFsdWUubGVuZ3RoIC0gdGhpcy5vcHRpb25zLnN1ZmZpeC5sZW5ndGgpKTtcclxuICAgICAgICB0aGlzLmlucHV0TWFuYWdlci51cGRhdGVWYWx1ZUFuZEN1cnNvcihuZXdSYXdWYWx1ZSwgdGhpcy5yYXdWYWx1ZS5sZW5ndGgsIHNlbGVjdGlvblN0YXJ0KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVPcHRpb25zKG9wdGlvbnM6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGxldCB2YWx1ZTogbnVtYmVyID0gdGhpcy52YWx1ZTtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVmaXhMZW5ndGgoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnByZWZpeC5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgc3VmZml4TGVuZ3RoKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zdWZmaXgubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTnVsbGFibGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5udWxsYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2FuSW5wdXRNb3JlTnVtYmVycygpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dE1hbmFnZXIuY2FuSW5wdXRNb3JlTnVtYmVycztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW5wdXRTZWxlY3Rpb24oKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dE1hbmFnZXIuaW5wdXRTZWxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHJhd1ZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRNYW5hZ2VyLnJhd1ZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCByYXdWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dE1hbmFnZXIucmF3VmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc3RvcmVkUmF3VmFsdWUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dE1hbmFnZXIuc3RvcmVkUmF3VmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHZhbHVlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xlYXJNYXNrKHRoaXMucmF3VmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB2YWx1ZSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5yYXdWYWx1ZSA9IHRoaXMuYXBwbHlNYXNrKHRydWUsIFwiXCIgKyB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc051bGxPclVuZGVmaW5lZCh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbn1cclxuIl19