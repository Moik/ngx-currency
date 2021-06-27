import { AfterViewInit, Directive, DoCheck, ElementRef, forwardRef, HostListener, Inject, KeyValueDiffer, KeyValueDiffers, Input, OnInit, Optional } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { CURRENCY_MASK_CONFIG, CurrencyMaskInputMode } from "./currency-mask.config";
import { InputHandler } from "./input.handler";
export var CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return CurrencyMaskDirective; }),
    multi: true,
};
var CurrencyMaskDirective = /** @class */ (function () {
    function CurrencyMaskDirective(currencyMaskConfig, elementRef, keyValueDiffers) {
        this.currencyMaskConfig = currencyMaskConfig;
        this.elementRef = elementRef;
        this.keyValueDiffers = keyValueDiffers;
        this.options = {};
        this.optionsTemplate = {
            align: "right",
            allowNegative: true,
            allowZero: true,
            decimal: ".",
            precision: 2,
            prefix: "$ ",
            suffix: "",
            thousands: ",",
            nullable: false,
            inputMode: CurrencyMaskInputMode.FINANCIAL
        };
        if (currencyMaskConfig) {
            this.optionsTemplate = currencyMaskConfig;
        }
        this.keyValueDiffer = keyValueDiffers.find({}).create();
    }
    CurrencyMaskDirective.prototype.ngAfterViewInit = function () {
        this.elementRef.nativeElement.style.textAlign = this.options && this.options.align ? this.options.align : this.optionsTemplate.align;
    };
    CurrencyMaskDirective.prototype.ngDoCheck = function () {
        if (this.keyValueDiffer.diff(this.options)) {
            this.elementRef.nativeElement.style.textAlign = this.options.align ? this.options.align : this.optionsTemplate.align;
            this.inputHandler.updateOptions(Object.assign({}, this.optionsTemplate, this.options));
        }
    };
    CurrencyMaskDirective.prototype.ngOnInit = function () {
        this.inputHandler = new InputHandler(this.elementRef.nativeElement, Object.assign({}, this.optionsTemplate, this.options));
    };
    CurrencyMaskDirective.prototype.handleBlur = function (event) {
        this.inputHandler.getOnModelTouched().apply(event);
    };
    CurrencyMaskDirective.prototype.handleCut = function (event) {
        if (!this.isChromeAndroid()) {
            !this.isReadOnly() && this.inputHandler.handleCut(event);
        }
    };
    CurrencyMaskDirective.prototype.handleInput = function (event) {
        if (this.isChromeAndroid()) {
            !this.isReadOnly() && this.inputHandler.handleInput(event);
        }
    };
    CurrencyMaskDirective.prototype.handleKeydown = function (event) {
        if (!this.isChromeAndroid()) {
            !this.isReadOnly() && this.inputHandler.handleKeydown(event);
        }
    };
    CurrencyMaskDirective.prototype.handleKeypress = function (event) {
        if (!this.isChromeAndroid()) {
            !this.isReadOnly() && this.inputHandler.handleKeypress(event);
        }
    };
    CurrencyMaskDirective.prototype.handlePaste = function (event) {
        if (!this.isChromeAndroid()) {
            !this.isReadOnly() && this.inputHandler.handlePaste(event);
        }
    };
    CurrencyMaskDirective.prototype.handleDrop = function (event) {
        if (!this.isChromeAndroid()) {
            event.preventDefault();
        }
    };
    CurrencyMaskDirective.prototype.isChromeAndroid = function () {
        return /chrome/i.test(navigator.userAgent) && /android/i.test(navigator.userAgent);
    };
    CurrencyMaskDirective.prototype.isReadOnly = function () {
        return this.elementRef.nativeElement.hasAttribute('readonly');
    };
    CurrencyMaskDirective.prototype.registerOnChange = function (callbackFunction) {
        this.inputHandler.setOnModelChange(callbackFunction);
    };
    CurrencyMaskDirective.prototype.registerOnTouched = function (callbackFunction) {
        this.inputHandler.setOnModelTouched(callbackFunction);
    };
    CurrencyMaskDirective.prototype.setDisabledState = function (value) {
        this.elementRef.nativeElement.disabled = value;
    };
    CurrencyMaskDirective.prototype.writeValue = function (value) {
        this.inputHandler.setValue(value);
    };
    CurrencyMaskDirective.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [CURRENCY_MASK_CONFIG,] }] },
        { type: ElementRef },
        { type: KeyValueDiffers }
    ]; };
    CurrencyMaskDirective.decorators = [
        { type: Directive, args: [{
                    selector: "[currencyMask]",
                    providers: [CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR]
                },] }
    ];
    CurrencyMaskDirective.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [CURRENCY_MASK_CONFIG,] }] },
        { type: ElementRef },
        { type: KeyValueDiffers }
    ]; };
    CurrencyMaskDirective.propDecorators = {
        options: [{ type: Input }],
        handleBlur: [{ type: HostListener, args: ["blur", ["$event"],] }],
        handleCut: [{ type: HostListener, args: ["cut", ["$event"],] }],
        handleInput: [{ type: HostListener, args: ["input", ["$event"],] }],
        handleKeydown: [{ type: HostListener, args: ["keydown", ["$event"],] }],
        handleKeypress: [{ type: HostListener, args: ["keypress", ["$event"],] }],
        handlePaste: [{ type: HostListener, args: ["paste", ["$event"],] }],
        handleDrop: [{ type: HostListener, args: ["drop", ["$event"],] }]
    };
    return CurrencyMaskDirective;
}());
export { CurrencyMaskDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3ktbWFzay5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtY3VycmVuY3kvIiwic291cmNlcyI6WyJzcmMvY3VycmVuY3ktbWFzay5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLGFBQWEsRUFDYixTQUFTLEVBQ1QsT0FBTyxFQUNQLFVBQVUsRUFDVixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsZUFBZSxFQUNmLEtBQUssRUFDTCxNQUFNLEVBQ04sUUFBUSxFQUNULE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBQXFCLG9CQUFvQixFQUFFLHFCQUFxQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkcsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRTdDLE1BQU0sQ0FBQyxJQUFNLG9DQUFvQyxHQUFRO0lBQ3ZELE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEscUJBQXFCLEVBQXJCLENBQXFCLENBQUM7SUFDcEQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7SUF3QkUsK0JBQThELGtCQUFzQyxFQUN0QyxVQUFzQixFQUN0QixlQUFnQztRQUZoQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBcEJyRixZQUFPLEdBQWdDLEVBQUUsQ0FBQztRQUs1QyxvQkFBZSxHQUF1QjtZQUN6QyxLQUFLLEVBQUUsT0FBTztZQUNkLGFBQWEsRUFBRSxJQUFJO1lBQ25CLFNBQVMsRUFBRSxJQUFJO1lBQ2YsT0FBTyxFQUFFLEdBQUc7WUFDWixTQUFTLEVBQUUsQ0FBQztZQUNaLE1BQU0sRUFBRSxJQUFJO1lB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QkFDTCxlQUFlOzs7Z0JBMUIvRixTQUFTLFNBQUM7b0JBQ1AsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsU0FBUyxFQUFFLENBQUMsb0NBQW9DLENBQUM7aUJBQ3BEOzs7Z0RBcUJjLFFBQVEsWUFBSSxNQUFNLFNBQUMsb0JBQW9CO2dCQTdDcEQsVUFBVTtnQkFLVixlQUFlOzs7MEJBc0JkLEtBQUs7NkJBMkNMLFlBQVksU0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7NEJBSy9CLFlBQVksU0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUM7OEJBTzlCLFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0NBT2hDLFlBQVksU0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7aUNBT2xDLFlBQVksU0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUM7OEJBT25DLFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7NkJBT2hDLFlBQVksU0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0lBOEJsQyw0QkFBQztDQUFBLEFBdkhELElBdUhDO1NBbkhZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQWZ0ZXJWaWV3SW5pdCxcclxuICBEaXJlY3RpdmUsXHJcbiAgRG9DaGVjayxcclxuICBFbGVtZW50UmVmLFxyXG4gIGZvcndhcmRSZWYsXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIEluamVjdCxcclxuICBLZXlWYWx1ZURpZmZlcixcclxuICBLZXlWYWx1ZURpZmZlcnMsXHJcbiAgSW5wdXQsXHJcbiAgT25Jbml0LFxyXG4gIE9wdGlvbmFsXHJcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuXHJcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcclxuaW1wb3J0IHtDdXJyZW5jeU1hc2tDb25maWcsIENVUlJFTkNZX01BU0tfQ09ORklHLCBDdXJyZW5jeU1hc2tJbnB1dE1vZGV9IGZyb20gXCIuL2N1cnJlbmN5LW1hc2suY29uZmlnXCI7XHJcbmltcG9ydCB7SW5wdXRIYW5kbGVyfSBmcm9tIFwiLi9pbnB1dC5oYW5kbGVyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgQ1VSUkVOQ1lNQVNLRElSRUNUSVZFX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XHJcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQ3VycmVuY3lNYXNrRGlyZWN0aXZlKSxcclxuICBtdWx0aTogdHJ1ZSxcclxufTtcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6IFwiW2N1cnJlbmN5TWFza11cIixcclxuICAgIHByb3ZpZGVyczogW0NVUlJFTkNZTUFTS0RJUkVDVElWRV9WQUxVRV9BQ0NFU1NPUl1cclxufSlcclxuZXhwb3J0IGNsYXNzIEN1cnJlbmN5TWFza0RpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBEb0NoZWNrLCBPbkluaXQge1xyXG5cclxuICBASW5wdXQoKSBvcHRpb25zOiBQYXJ0aWFsPEN1cnJlbmN5TWFza0NvbmZpZz4gPSB7fTtcclxuXHJcbiAgcHVibGljIGlucHV0SGFuZGxlcjogSW5wdXRIYW5kbGVyO1xyXG4gIHB1YmxpYyBrZXlWYWx1ZURpZmZlcjogS2V5VmFsdWVEaWZmZXI8YW55LCBhbnk+O1xyXG5cclxuICBwdWJsaWMgb3B0aW9uc1RlbXBsYXRlOiBDdXJyZW5jeU1hc2tDb25maWcgPSB7XHJcbiAgICAgIGFsaWduOiBcInJpZ2h0XCIsXHJcbiAgICAgIGFsbG93TmVnYXRpdmU6IHRydWUsXHJcbiAgICAgIGFsbG93WmVybzogdHJ1ZSxcclxuICAgICAgZGVjaW1hbDogXCIuXCIsXHJcbiAgICAgIHByZWNpc2lvbjogMixcclxuICAgICAgcHJlZml4OiBcIiQgXCIsXHJcbiAgICAgIHN1ZmZpeDogXCJcIixcclxuICAgICAgdGhvdXNhbmRzOiBcIixcIixcclxuICAgICAgbnVsbGFibGU6IGZhbHNlLFxyXG4gICAgICBpbnB1dE1vZGU6IEN1cnJlbmN5TWFza0lucHV0TW9kZS5GSU5BTkNJQUxcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KENVUlJFTkNZX01BU0tfQ09ORklHKSBwcml2YXRlIGN1cnJlbmN5TWFza0NvbmZpZzogQ3VycmVuY3lNYXNrQ29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcml2YXRlIGtleVZhbHVlRGlmZmVyczogS2V5VmFsdWVEaWZmZXJzKSB7XHJcbiAgICBpZiAoY3VycmVuY3lNYXNrQ29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zVGVtcGxhdGUgPSBjdXJyZW5jeU1hc2tDb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5rZXlWYWx1ZURpZmZlciA9IGtleVZhbHVlRGlmZmVycy5maW5kKHt9KS5jcmVhdGUoKTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLnRleHRBbGlnbiA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuYWxpZ24gPyB0aGlzLm9wdGlvbnMuYWxpZ24gOiB0aGlzLm9wdGlvbnNUZW1wbGF0ZS5hbGlnbjtcclxuICB9XHJcblxyXG4gIG5nRG9DaGVjaygpIHtcclxuICAgIGlmICh0aGlzLmtleVZhbHVlRGlmZmVyLmRpZmYodGhpcy5vcHRpb25zKSkge1xyXG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zdHlsZS50ZXh0QWxpZ24gPSB0aGlzLm9wdGlvbnMuYWxpZ24gPyB0aGlzLm9wdGlvbnMuYWxpZ24gOiB0aGlzLm9wdGlvbnNUZW1wbGF0ZS5hbGlnbjtcclxuICAgICAgdGhpcy5pbnB1dEhhbmRsZXIudXBkYXRlT3B0aW9ucygoPGFueT5PYmplY3QpLmFzc2lnbih7fSwgdGhpcy5vcHRpb25zVGVtcGxhdGUsIHRoaXMub3B0aW9ucykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmlucHV0SGFuZGxlciA9IG5ldyBJbnB1dEhhbmRsZXIodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICg8YW55Pk9iamVjdCkuYXNzaWduKHt9LCB0aGlzLm9wdGlvbnNUZW1wbGF0ZSwgdGhpcy5vcHRpb25zKSk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKFwiYmx1clwiLCBbXCIkZXZlbnRcIl0pXHJcbiAgaGFuZGxlQmx1cihldmVudDogYW55KSB7XHJcbiAgICB0aGlzLmlucHV0SGFuZGxlci5nZXRPbk1vZGVsVG91Y2hlZCgpLmFwcGx5KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoXCJjdXRcIiwgW1wiJGV2ZW50XCJdKVxyXG4gIGhhbmRsZUN1dChldmVudDogYW55KSB7XHJcbiAgICBpZiAoIXRoaXMuaXNDaHJvbWVBbmRyb2lkKCkpIHtcclxuICAgICAgIXRoaXMuaXNSZWFkT25seSgpICYmIHRoaXMuaW5wdXRIYW5kbGVyLmhhbmRsZUN1dChldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKFwiaW5wdXRcIiwgW1wiJGV2ZW50XCJdKVxyXG4gIGhhbmRsZUlucHV0KGV2ZW50OiBhbnkpIHtcclxuICAgIGlmICh0aGlzLmlzQ2hyb21lQW5kcm9pZCgpKSB7XHJcbiAgICAgICF0aGlzLmlzUmVhZE9ubHkoKSAmJiB0aGlzLmlucHV0SGFuZGxlci5oYW5kbGVJbnB1dChldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKFwia2V5ZG93blwiLCBbXCIkZXZlbnRcIl0pXHJcbiAgaGFuZGxlS2V5ZG93bihldmVudDogYW55KSB7XHJcbiAgICBpZiAoIXRoaXMuaXNDaHJvbWVBbmRyb2lkKCkpIHtcclxuICAgICAgIXRoaXMuaXNSZWFkT25seSgpICYmIHRoaXMuaW5wdXRIYW5kbGVyLmhhbmRsZUtleWRvd24oZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcihcImtleXByZXNzXCIsIFtcIiRldmVudFwiXSlcclxuICBoYW5kbGVLZXlwcmVzcyhldmVudDogYW55KSB7XHJcbiAgICBpZiAoIXRoaXMuaXNDaHJvbWVBbmRyb2lkKCkpIHtcclxuICAgICAgIXRoaXMuaXNSZWFkT25seSgpICYmIHRoaXMuaW5wdXRIYW5kbGVyLmhhbmRsZUtleXByZXNzKGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoXCJwYXN0ZVwiLCBbXCIkZXZlbnRcIl0pXHJcbiAgaGFuZGxlUGFzdGUoZXZlbnQ6IGFueSkge1xyXG4gICAgaWYgKCF0aGlzLmlzQ2hyb21lQW5kcm9pZCgpKSB7XHJcbiAgICAgICF0aGlzLmlzUmVhZE9ubHkoKSAmJiB0aGlzLmlucHV0SGFuZGxlci5oYW5kbGVQYXN0ZShldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKFwiZHJvcFwiLCBbXCIkZXZlbnRcIl0pXHJcbiAgaGFuZGxlRHJvcChldmVudDogYW55KSB7XHJcbiAgICBpZiAoIXRoaXMuaXNDaHJvbWVBbmRyb2lkKCkpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzQ2hyb21lQW5kcm9pZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAvY2hyb21lL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvYW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcbiAgfVxyXG5cclxuICBpc1JlYWRPbmx5KCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lmhhc0F0dHJpYnV0ZSgncmVhZG9ubHknKVxyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJPbkNoYW5nZShjYWxsYmFja0Z1bmN0aW9uOiBGdW5jdGlvbik6IHZvaWQge1xyXG4gICAgdGhpcy5pbnB1dEhhbmRsZXIuc2V0T25Nb2RlbENoYW5nZShjYWxsYmFja0Z1bmN0aW9uKTtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGNhbGxiYWNrRnVuY3Rpb246IEZ1bmN0aW9uKTogdm9pZCB7XHJcbiAgICB0aGlzLmlucHV0SGFuZGxlci5zZXRPbk1vZGVsVG91Y2hlZChjYWxsYmFja0Z1bmN0aW9uKTtcclxuICB9XHJcblxyXG4gIHNldERpc2FibGVkU3RhdGUodmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmRpc2FibGVkID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICB3cml0ZVZhbHVlKHZhbHVlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMuaW5wdXRIYW5kbGVyLnNldFZhbHVlKHZhbHVlKTtcclxuICB9XHJcbn1cclxuIl19