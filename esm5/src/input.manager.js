var InputManager = /** @class */ (function () {
    function InputManager(htmlInputElement) {
        this.htmlInputElement = htmlInputElement;
    }
    InputManager.prototype.setCursorAt = function (position) {
        if (this.htmlInputElement.setSelectionRange) {
            this.htmlInputElement.focus();
            this.htmlInputElement.setSelectionRange(position, position);
        }
        else if (this.htmlInputElement.createTextRange) {
            var textRange = this.htmlInputElement.createTextRange();
            textRange.collapse(true);
            textRange.moveEnd("character", position);
            textRange.moveStart("character", position);
            textRange.select();
        }
    };
    InputManager.prototype.updateValueAndCursor = function (newRawValue, oldLength, selectionStart) {
        this.rawValue = newRawValue;
        var newLength = newRawValue.length;
        selectionStart = selectionStart - (oldLength - newLength);
        this.setCursorAt(selectionStart);
    };
    Object.defineProperty(InputManager.prototype, "canInputMoreNumbers", {
        get: function () {
            var onlyNumbers = this.rawValue.replace(/[^0-9\u0660-\u0669\u06F0-\u06F9]/g, "");
            var haventReachedMaxLength = !(onlyNumbers.length >= this.htmlInputElement.maxLength && this.htmlInputElement.maxLength >= 0);
            var selectionStart = this.inputSelection.selectionStart;
            var selectionEnd = this.inputSelection.selectionEnd;
            var haveNumberSelected = !!(selectionStart != selectionEnd &&
                this.htmlInputElement.value.substring(selectionStart, selectionEnd).match(/[^0-9\u0660-\u0669\u06F0-\u06F9]/));
            var startWithZero = (this.htmlInputElement.value.substring(0, 1) == "0");
            return haventReachedMaxLength || haveNumberSelected || startWithZero;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "inputSelection", {
        get: function () {
            var selectionStart = 0;
            var selectionEnd = 0;
            if (typeof this.htmlInputElement.selectionStart == "number" && typeof this.htmlInputElement.selectionEnd == "number") {
                selectionStart = this.htmlInputElement.selectionStart;
                selectionEnd = this.htmlInputElement.selectionEnd;
            }
            else {
                var range = document.selection.createRange();
                if (range && range.parentElement() == this.htmlInputElement) {
                    var lenght = this.htmlInputElement.value.length;
                    var normalizedValue = this.htmlInputElement.value.replace(/\r\n/g, "\n");
                    var startRange = this.htmlInputElement.createTextRange();
                    startRange.moveToBookmark(range.getBookmark());
                    var endRange = this.htmlInputElement.createTextRange();
                    endRange.collapse(false);
                    if (startRange.compareEndPoints("StartToEnd", endRange) > -1) {
                        selectionStart = selectionEnd = lenght;
                    }
                    else {
                        selectionStart = -startRange.moveStart("character", -lenght);
                        selectionStart += normalizedValue.slice(0, selectionStart).split("\n").length - 1;
                        if (startRange.compareEndPoints("EndToEnd", endRange) > -1) {
                            selectionEnd = lenght;
                        }
                        else {
                            selectionEnd = -startRange.moveEnd("character", -lenght);
                            selectionEnd += normalizedValue.slice(0, selectionEnd).split("\n").length - 1;
                        }
                    }
                }
            }
            return {
                selectionStart: selectionStart,
                selectionEnd: selectionEnd
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "rawValue", {
        get: function () {
            return this.htmlInputElement && this.htmlInputElement.value;
        },
        set: function (value) {
            this._storedRawValue = value;
            if (this.htmlInputElement) {
                this.htmlInputElement.value = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "storedRawValue", {
        get: function () {
            return this._storedRawValue || '';
        },
        enumerable: false,
        configurable: true
    });
    return InputManager;
}());
export { InputManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQubWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1jdXJyZW5jeS8iLCJzb3VyY2VzIjpbInNyYy9pbnB1dC5tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBSUksc0JBQW9CLGdCQUFxQjtRQUFyQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQUs7SUFDekMsQ0FBQztJQUVELGtDQUFXLEdBQVgsVUFBWSxRQUFnQjtRQUN4QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRTtZQUN6QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUMvRDthQUFNLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsRUFBRTtZQUM5QyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN6QyxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMzQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDdEI7SUFDTCxDQUFDO0lBRUQsMkNBQW9CLEdBQXBCLFVBQXFCLFdBQW1CLEVBQUUsU0FBaUIsRUFBRSxjQUFzQjtRQUMvRSxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQztRQUM1QixJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQ25DLGNBQWMsR0FBRyxjQUFjLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsc0JBQUksNkNBQW1CO2FBQXZCO1lBQ0ksSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDakYsSUFBSSxzQkFBc0IsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUgsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUM7WUFDeEQsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUM7WUFDcEQsSUFBSSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxjQUFjLElBQUksWUFBWTtnQkFDOUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLENBQUM7WUFDM0ksSUFBSSxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7WUFDekUsT0FBTyxzQkFBc0IsSUFBSSxrQkFBa0IsSUFBSSxhQUFhLENBQUM7UUFDekUsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSx3Q0FBYzthQUFsQjtZQUNJLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztZQUN2QixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7WUFFckIsSUFBSSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLElBQUksUUFBUSxJQUFJLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksSUFBSSxRQUFRLEVBQUU7Z0JBQ2xILGNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDO2dCQUN0RCxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQzthQUNyRDtpQkFBTTtnQkFDSCxJQUFJLEtBQUssR0FBUyxRQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUVwRCxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO29CQUN6RCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztvQkFDaEQsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUN6RSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBQ3pELFVBQVUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7b0JBQy9DLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDdkQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFekIsSUFBSSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO3dCQUMxRCxjQUFjLEdBQUcsWUFBWSxHQUFHLE1BQU0sQ0FBQztxQkFDMUM7eUJBQU07d0JBQ0gsY0FBYyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDN0QsY0FBYyxJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQUVsRixJQUFJLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7NEJBQ3hELFlBQVksR0FBRyxNQUFNLENBQUM7eUJBQ3pCOzZCQUFNOzRCQUNILFlBQVksR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7NEJBQ3pELFlBQVksSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzt5QkFDakY7cUJBQ0o7aUJBQ0o7YUFDSjtZQUVELE9BQU87Z0JBQ0gsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLFlBQVksRUFBRSxZQUFZO2FBQzdCLENBQUM7UUFDTixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLGtDQUFRO2FBQVo7WUFDSSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO1FBQ2hFLENBQUM7YUFFRCxVQUFhLEtBQWE7WUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7WUFFN0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2FBQ3ZDO1FBQ0wsQ0FBQzs7O09BUkE7SUFVRCxzQkFBSSx3Q0FBYzthQUFsQjtZQUNJLE9BQU8sSUFBSSxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUM7UUFDdEMsQ0FBQzs7O09BQUE7SUFDTCxtQkFBQztBQUFELENBQUMsQUE3RkQsSUE2RkMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgSW5wdXRNYW5hZ2VyIHtcclxuXHJcbiAgICBwcml2YXRlIF9zdG9yZWRSYXdWYWx1ZTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHRtbElucHV0RWxlbWVudDogYW55KSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q3Vyc29yQXQocG9zaXRpb246IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmh0bWxJbnB1dEVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5odG1sSW5wdXRFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaHRtbElucHV0RWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZShwb3NpdGlvbiwgcG9zaXRpb24pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5odG1sSW5wdXRFbGVtZW50LmNyZWF0ZVRleHRSYW5nZSkge1xyXG4gICAgICAgICAgICBsZXQgdGV4dFJhbmdlID0gdGhpcy5odG1sSW5wdXRFbGVtZW50LmNyZWF0ZVRleHRSYW5nZSgpO1xyXG4gICAgICAgICAgICB0ZXh0UmFuZ2UuY29sbGFwc2UodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRleHRSYW5nZS5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIHBvc2l0aW9uKTtcclxuICAgICAgICAgICAgdGV4dFJhbmdlLm1vdmVTdGFydChcImNoYXJhY3RlclwiLCBwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIHRleHRSYW5nZS5zZWxlY3QoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVmFsdWVBbmRDdXJzb3IobmV3UmF3VmFsdWU6IHN0cmluZywgb2xkTGVuZ3RoOiBudW1iZXIsIHNlbGVjdGlvblN0YXJ0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJhd1ZhbHVlID0gbmV3UmF3VmFsdWU7XHJcbiAgICAgICAgbGV0IG5ld0xlbmd0aCA9IG5ld1Jhd1ZhbHVlLmxlbmd0aDtcclxuICAgICAgICBzZWxlY3Rpb25TdGFydCA9IHNlbGVjdGlvblN0YXJ0IC0gKG9sZExlbmd0aCAtIG5ld0xlbmd0aCk7XHJcbiAgICAgICAgdGhpcy5zZXRDdXJzb3JBdChzZWxlY3Rpb25TdGFydCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNhbklucHV0TW9yZU51bWJlcnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IG9ubHlOdW1iZXJzID0gdGhpcy5yYXdWYWx1ZS5yZXBsYWNlKC9bXjAtOVxcdTA2NjAtXFx1MDY2OVxcdTA2RjAtXFx1MDZGOV0vZywgXCJcIik7XHJcbiAgICAgICAgbGV0IGhhdmVudFJlYWNoZWRNYXhMZW5ndGggPSAhKG9ubHlOdW1iZXJzLmxlbmd0aCA+PSB0aGlzLmh0bWxJbnB1dEVsZW1lbnQubWF4TGVuZ3RoICYmIHRoaXMuaHRtbElucHV0RWxlbWVudC5tYXhMZW5ndGggPj0gMCk7XHJcbiAgICAgICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gdGhpcy5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25TdGFydDtcclxuICAgICAgICBsZXQgc2VsZWN0aW9uRW5kID0gdGhpcy5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25FbmQ7XHJcbiAgICAgICAgbGV0IGhhdmVOdW1iZXJTZWxlY3RlZCA9ICEhKHNlbGVjdGlvblN0YXJ0ICE9IHNlbGVjdGlvbkVuZCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmh0bWxJbnB1dEVsZW1lbnQudmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpLm1hdGNoKC9bXjAtOVxcdTA2NjAtXFx1MDY2OVxcdTA2RjAtXFx1MDZGOV0vKSk7XHJcbiAgICAgICAgbGV0IHN0YXJ0V2l0aFplcm8gPSAodGhpcy5odG1sSW5wdXRFbGVtZW50LnZhbHVlLnN1YnN0cmluZygwLCAxKSA9PSBcIjBcIik7XHJcbiAgICAgICAgcmV0dXJuIGhhdmVudFJlYWNoZWRNYXhMZW5ndGggfHwgaGF2ZU51bWJlclNlbGVjdGVkIHx8IHN0YXJ0V2l0aFplcm87XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlucHV0U2VsZWN0aW9uKCk6IGFueSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gMDtcclxuICAgICAgICBsZXQgc2VsZWN0aW9uRW5kID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmh0bWxJbnB1dEVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgPT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgdGhpcy5odG1sSW5wdXRFbGVtZW50LnNlbGVjdGlvbkVuZCA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGlvblN0YXJ0ID0gdGhpcy5odG1sSW5wdXRFbGVtZW50LnNlbGVjdGlvblN0YXJ0O1xyXG4gICAgICAgICAgICBzZWxlY3Rpb25FbmQgPSB0aGlzLmh0bWxJbnB1dEVsZW1lbnQuc2VsZWN0aW9uRW5kO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCByYW5nZSA9ICg8YW55PmRvY3VtZW50KS5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyYW5nZSAmJiByYW5nZS5wYXJlbnRFbGVtZW50KCkgPT0gdGhpcy5odG1sSW5wdXRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGVuZ2h0ID0gdGhpcy5odG1sSW5wdXRFbGVtZW50LnZhbHVlLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGxldCBub3JtYWxpemVkVmFsdWUgPSB0aGlzLmh0bWxJbnB1dEVsZW1lbnQudmFsdWUucmVwbGFjZSgvXFxyXFxuL2csIFwiXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0UmFuZ2UgPSB0aGlzLmh0bWxJbnB1dEVsZW1lbnQuY3JlYXRlVGV4dFJhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICBzdGFydFJhbmdlLm1vdmVUb0Jvb2ttYXJrKHJhbmdlLmdldEJvb2ttYXJrKCkpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVuZFJhbmdlID0gdGhpcy5odG1sSW5wdXRFbGVtZW50LmNyZWF0ZVRleHRSYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgZW5kUmFuZ2UuY29sbGFwc2UoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdGFydFJhbmdlLmNvbXBhcmVFbmRQb2ludHMoXCJTdGFydFRvRW5kXCIsIGVuZFJhbmdlKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uU3RhcnQgPSBzZWxlY3Rpb25FbmQgPSBsZW5naHQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblN0YXJ0ID0gLXN0YXJ0UmFuZ2UubW92ZVN0YXJ0KFwiY2hhcmFjdGVyXCIsIC1sZW5naHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblN0YXJ0ICs9IG5vcm1hbGl6ZWRWYWx1ZS5zbGljZSgwLCBzZWxlY3Rpb25TdGFydCkuc3BsaXQoXCJcXG5cIikubGVuZ3RoIC0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0UmFuZ2UuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvRW5kXCIsIGVuZFJhbmdlKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkVuZCA9IGxlbmdodDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25FbmQgPSAtc3RhcnRSYW5nZS5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC1sZW5naHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25FbmQgKz0gbm9ybWFsaXplZFZhbHVlLnNsaWNlKDAsIHNlbGVjdGlvbkVuZCkuc3BsaXQoXCJcXG5cIikubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNlbGVjdGlvblN0YXJ0OiBzZWxlY3Rpb25TdGFydCxcclxuICAgICAgICAgICAgc2VsZWN0aW9uRW5kOiBzZWxlY3Rpb25FbmRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCByYXdWYWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0bWxJbnB1dEVsZW1lbnQgJiYgdGhpcy5odG1sSW5wdXRFbGVtZW50LnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCByYXdWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fc3RvcmVkUmF3VmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaHRtbElucHV0RWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmh0bWxJbnB1dEVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHN0b3JlZFJhd1ZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3JlZFJhd1ZhbHVlIHx8ICcnO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==