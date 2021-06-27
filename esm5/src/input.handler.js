import { InputService } from "./input.service";
var InputHandler = /** @class */ (function () {
    function InputHandler(htmlInputElement, options) {
        this.inputService = new InputService(htmlInputElement, options);
    }
    InputHandler.prototype.handleCut = function (event) {
        var _this = this;
        setTimeout(function () {
            _this.inputService.updateFieldValue();
            _this.setValue(_this.inputService.value);
            _this.onModelChange(_this.inputService.value);
        }, 0);
    };
    InputHandler.prototype.handleInput = function (event) {
        var _this = this;
        var selectionStart = this.inputService.inputSelection.selectionStart;
        var keyCode = this.inputService.rawValue.charCodeAt(selectionStart - 1);
        var rawValueLength = this.inputService.rawValue.length;
        var storedRawValueLength = this.inputService.storedRawValue.length;
        if (Math.abs(rawValueLength - storedRawValueLength) != 1) {
            this.inputService.updateFieldValue(selectionStart);
            this.onModelChange(this.inputService.value);
            return;
        }
        // Restore the old value.
        this.inputService.rawValue = this.inputService.storedRawValue;
        if (rawValueLength < storedRawValueLength) {
            // Chrome Android seems to move the cursor in response to a backspace AFTER processing the
            // input event, so we need to wrap this in a timeout.
            this.timer(function () {
                // Move the cursor to just after the deleted value.
                _this.inputService.updateFieldValue(selectionStart + 1);
                // Then backspace it.
                _this.inputService.removeNumber(8);
                _this.onModelChange(_this.inputService.value);
            }, 0);
        }
        if (rawValueLength > storedRawValueLength) {
            // Move the cursor to just before the new value.
            this.inputService.updateFieldValue(selectionStart - 1);
            // Process the character like a keypress.
            this.handleKeypressImpl(keyCode);
        }
    };
    InputHandler.prototype.handleKeydown = function (event) {
        var keyCode = event.which || event.charCode || event.keyCode;
        if (keyCode == 8 || keyCode == 46 || keyCode == 63272) {
            event.preventDefault();
            if (this.inputService.inputSelection.selectionStart <= this.inputService.prefixLength() &&
                this.inputService.inputSelection.selectionEnd >= this.inputService.rawValue.length - this.inputService.suffixLength()) {
                this.clearValue();
            }
            else {
                this.inputService.removeNumber(keyCode);
                this.onModelChange(this.inputService.value);
            }
        }
    };
    InputHandler.prototype.clearValue = function () {
        this.setValue(this.inputService.isNullable() ? null : 0);
        this.onModelChange(this.inputService.value);
    };
    InputHandler.prototype.handleKeypress = function (event) {
        var keyCode = event.which || event.charCode || event.keyCode;
        event.preventDefault();
        if (keyCode === 97 && event.ctrlKey) {
            return;
        }
        this.handleKeypressImpl(keyCode);
    };
    InputHandler.prototype.handleKeypressImpl = function (keyCode) {
        switch (keyCode) {
            case undefined:
            case 9:
            case 13:
                return;
            case 43:
                this.inputService.changeToPositive();
                break;
            case 45:
                this.inputService.changeToNegative();
                break;
            default:
                if (this.inputService.canInputMoreNumbers) {
                    var selectionRangeLength = Math.abs(this.inputService.inputSelection.selectionEnd - this.inputService.inputSelection.selectionStart);
                    if (selectionRangeLength == this.inputService.rawValue.length) {
                        this.setValue(null);
                    }
                    this.inputService.addNumber(keyCode);
                }
                break;
        }
        this.onModelChange(this.inputService.value);
    };
    InputHandler.prototype.handlePaste = function (event) {
        var _this = this;
        setTimeout(function () {
            _this.inputService.updateFieldValue();
            _this.setValue(_this.inputService.value);
            _this.onModelChange(_this.inputService.value);
        }, 1);
    };
    InputHandler.prototype.updateOptions = function (options) {
        this.inputService.updateOptions(options);
    };
    InputHandler.prototype.getOnModelChange = function () {
        return this.onModelChange;
    };
    InputHandler.prototype.setOnModelChange = function (callbackFunction) {
        this.onModelChange = callbackFunction;
    };
    InputHandler.prototype.getOnModelTouched = function () {
        return this.onModelTouched;
    };
    InputHandler.prototype.setOnModelTouched = function (callbackFunction) {
        this.onModelTouched = callbackFunction;
    };
    InputHandler.prototype.setValue = function (value) {
        this.inputService.value = value;
    };
    /**
     * Passthrough to setTimeout that can be stubbed out in tests.
     */
    InputHandler.prototype.timer = function (callback, delayMillis) {
        setTimeout(callback, delayMillis);
    };
    return InputHandler;
}());
export { InputHandler };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1jdXJyZW5jeS8iLCJzb3VyY2VzIjpbInNyYy9pbnB1dC5oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUU3QztJQU1JLHNCQUFZLGdCQUFrQyxFQUFFLE9BQVk7UUFDeEQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsZ0NBQVMsR0FBVCxVQUFVLEtBQVU7UUFBcEIsaUJBTUM7UUFMRyxVQUFVLENBQUM7WUFDUCxLQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDckMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLEtBQUksQ0FBQyxhQUFhLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDVixDQUFDO0lBRUQsa0NBQVcsR0FBWCxVQUFZLEtBQVU7UUFBdEIsaUJBbUNDO1FBbENHLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQztRQUNyRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUN2RCxJQUFJLG9CQUFvQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUVuRSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxHQUFHLG9CQUFv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LENBQUMsQ0FBQyxDQUFDO0lBQ1YsQ0FBQztJQUVELG9DQUFhLEdBQWIsVUFBYyxPQUFZO1FBQ3RCLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCx1Q0FBZ0IsR0FBaEI7UUFDSSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDOUIsQ0FBQztJQUVELHVDQUFnQixHQUFoQixVQUFpQixnQkFBMEI7UUFDdkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQztJQUMxQyxDQUFDO0lBRUQsd0NBQWlCLEdBQWpCO1FBQ0ksT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQy9CLENBQUM7SUFFRCx3Q0FBaUIsR0FBakIsVUFBa0IsZ0JBQTBCO1FBQ3hDLElBQUksQ0FBQyxjQUFjLEdBQUcsZ0JBQWdCLENBQUM7SUFDM0MsQ0FBQztJQUVELCtCQUFRLEdBQVIsVUFBUyxLQUFhO1FBQ2xCLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNwQyxDQUFDO0lBRUQ7O09BRUc7SUFDSyw0QkFBSyxHQUFiLFVBQWMsUUFBb0IsRUFBRSxXQUFtQjtRQUNuRCxVQUFVLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFDTCxtQkFBQztBQUFELENBQUMsQUF2SkQsSUF1SkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lucHV0U2VydmljZX0gZnJvbSBcIi4vaW5wdXQuc2VydmljZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElucHV0SGFuZGxlciB7XHJcblxyXG4gICAgcHJpdmF0ZSBpbnB1dFNlcnZpY2U6IElucHV0U2VydmljZTtcclxuICAgIHByaXZhdGUgb25Nb2RlbENoYW5nZTogRnVuY3Rpb247XHJcbiAgICBwcml2YXRlIG9uTW9kZWxUb3VjaGVkOiBGdW5jdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihodG1sSW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50LCBvcHRpb25zOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmlucHV0U2VydmljZSA9IG5ldyBJbnB1dFNlcnZpY2UoaHRtbElucHV0RWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQ3V0KGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UudXBkYXRlRmllbGRWYWx1ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuaW5wdXRTZXJ2aWNlLnZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMuaW5wdXRTZXJ2aWNlLnZhbHVlKTtcclxuICAgICAgICB9LCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVJbnB1dChldmVudDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gdGhpcy5pbnB1dFNlcnZpY2UuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uU3RhcnQ7XHJcbiAgICAgICAgbGV0IGtleUNvZGUgPSB0aGlzLmlucHV0U2VydmljZS5yYXdWYWx1ZS5jaGFyQ29kZUF0KHNlbGVjdGlvblN0YXJ0IC0gMSk7XHJcbiAgICAgICAgbGV0IHJhd1ZhbHVlTGVuZ3RoID0gdGhpcy5pbnB1dFNlcnZpY2UucmF3VmFsdWUubGVuZ3RoO1xyXG4gICAgICAgIGxldCBzdG9yZWRSYXdWYWx1ZUxlbmd0aCA9IHRoaXMuaW5wdXRTZXJ2aWNlLnN0b3JlZFJhd1ZhbHVlLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHJhd1ZhbHVlTGVuZ3RoIC0gc3RvcmVkUmF3VmFsdWVMZW5ndGgpICE9IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UudXBkYXRlRmllbGRWYWx1ZShzZWxlY3Rpb25TdGFydCk7XHJcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLmlucHV0U2VydmljZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlc3RvcmUgdGhlIG9sZCB2YWx1ZS5cclxuICAgICAgICB0aGlzLmlucHV0U2VydmljZS5yYXdWYWx1ZSA9IHRoaXMuaW5wdXRTZXJ2aWNlLnN0b3JlZFJhd1ZhbHVlO1xyXG5cclxuICAgICAgICBpZiAocmF3VmFsdWVMZW5ndGggPCBzdG9yZWRSYXdWYWx1ZUxlbmd0aCkge1xyXG4gICAgICAgICAgICAvLyBDaHJvbWUgQW5kcm9pZCBzZWVtcyB0byBtb3ZlIHRoZSBjdXJzb3IgaW4gcmVzcG9uc2UgdG8gYSBiYWNrc3BhY2UgQUZURVIgcHJvY2Vzc2luZyB0aGVcclxuICAgICAgICAgICAgLy8gaW5wdXQgZXZlbnQsIHNvIHdlIG5lZWQgdG8gd3JhcCB0aGlzIGluIGEgdGltZW91dC5cclxuICAgICAgICAgICAgdGhpcy50aW1lcigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBNb3ZlIHRoZSBjdXJzb3IgdG8ganVzdCBhZnRlciB0aGUgZGVsZXRlZCB2YWx1ZS5cclxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRTZXJ2aWNlLnVwZGF0ZUZpZWxkVmFsdWUoc2VsZWN0aW9uU3RhcnQgKyAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGVuIGJhY2tzcGFjZSBpdC5cclxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRTZXJ2aWNlLnJlbW92ZU51bWJlcig4KTtcclxuICAgICAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLmlucHV0U2VydmljZS52YWx1ZSk7ICBcclxuICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmF3VmFsdWVMZW5ndGggPiBzdG9yZWRSYXdWYWx1ZUxlbmd0aCkge1xyXG4gICAgICAgICAgICAvLyBNb3ZlIHRoZSBjdXJzb3IgdG8ganVzdCBiZWZvcmUgdGhlIG5ldyB2YWx1ZS5cclxuICAgICAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UudXBkYXRlRmllbGRWYWx1ZShzZWxlY3Rpb25TdGFydCAtIDEpO1xyXG5cclxuICAgICAgICAgICAgLy8gUHJvY2VzcyB0aGUgY2hhcmFjdGVyIGxpa2UgYSBrZXlwcmVzcy5cclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVLZXlwcmVzc0ltcGwoa2V5Q29kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUtleWRvd24oZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGxldCBrZXlDb2RlID0gZXZlbnQud2hpY2ggfHwgZXZlbnQuY2hhckNvZGUgfHwgZXZlbnQua2V5Q29kZTtcclxuICAgICAgICBpZiAoa2V5Q29kZSA9PSA4IHx8IGtleUNvZGUgPT0gNDYgfHwga2V5Q29kZSA9PSA2MzI3Mikge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRTZXJ2aWNlLmlucHV0U2VsZWN0aW9uLnNlbGVjdGlvblN0YXJ0IDw9IHRoaXMuaW5wdXRTZXJ2aWNlLnByZWZpeExlbmd0aCgpICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0U2VydmljZS5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25FbmQgPj0gdGhpcy5pbnB1dFNlcnZpY2UucmF3VmFsdWUubGVuZ3RoIC0gdGhpcy5pbnB1dFNlcnZpY2Uuc3VmZml4TGVuZ3RoKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJWYWx1ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UucmVtb3ZlTnVtYmVyKGtleUNvZGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMuaW5wdXRTZXJ2aWNlLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGVhclZhbHVlKCkge1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5pbnB1dFNlcnZpY2UuaXNOdWxsYWJsZSgpID8gbnVsbCA6IDApO1xyXG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLmlucHV0U2VydmljZS52YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlS2V5cHJlc3MoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGxldCBrZXlDb2RlID0gZXZlbnQud2hpY2ggfHwgZXZlbnQuY2hhckNvZGUgfHwgZXZlbnQua2V5Q29kZTtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmIChrZXlDb2RlID09PSA5NyAmJiBldmVudC5jdHJsS2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlS2V5cHJlc3NJbXBsKGtleUNvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlS2V5cHJlc3NJbXBsKGtleUNvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xyXG4gICAgICAgICAgICBjYXNlIHVuZGVmaW5lZDpcclxuICAgICAgICAgICAgY2FzZSA5OlxyXG4gICAgICAgICAgICBjYXNlIDEzOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIDQzOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UuY2hhbmdlVG9Qb3NpdGl2ZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDU6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0U2VydmljZS5jaGFuZ2VUb05lZ2F0aXZlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0U2VydmljZS5jYW5JbnB1dE1vcmVOdW1iZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGlvblJhbmdlTGVuZ3RoID0gTWF0aC5hYnModGhpcy5pbnB1dFNlcnZpY2UuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uRW5kIC0gdGhpcy5pbnB1dFNlcnZpY2UuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uU3RhcnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uUmFuZ2VMZW5ndGggPT0gdGhpcy5pbnB1dFNlcnZpY2UucmF3VmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0U2VydmljZS5hZGROdW1iZXIoa2V5Q29kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLmlucHV0U2VydmljZS52YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlUGFzdGUoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0U2VydmljZS51cGRhdGVGaWVsZFZhbHVlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5pbnB1dFNlcnZpY2UudmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy5pbnB1dFNlcnZpY2UudmFsdWUpO1xyXG4gICAgICAgIH0sIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZU9wdGlvbnMob3B0aW9uczogYW55KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UudXBkYXRlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRPbk1vZGVsQ2hhbmdlKCk6IEZ1bmN0aW9uIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbk1vZGVsQ2hhbmdlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldE9uTW9kZWxDaGFuZ2UoY2FsbGJhY2tGdW5jdGlvbjogRnVuY3Rpb24pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UgPSBjYWxsYmFja0Z1bmN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE9uTW9kZWxUb3VjaGVkKCk6IEZ1bmN0aW9uIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbk1vZGVsVG91Y2hlZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRPbk1vZGVsVG91Y2hlZChjYWxsYmFja0Z1bmN0aW9uOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBjYWxsYmFja0Z1bmN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlKHZhbHVlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmlucHV0U2VydmljZS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGFzc3Rocm91Z2ggdG8gc2V0VGltZW91dCB0aGF0IGNhbiBiZSBzdHViYmVkIG91dCBpbiB0ZXN0cy5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB0aW1lcihjYWxsYmFjazogKCkgPT4gdm9pZCwgZGVsYXlNaWxsaXM6IG51bWJlcikge1xyXG4gICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIGRlbGF5TWlsbGlzKTtcclxuICAgIH1cclxufVxyXG4iXX0=