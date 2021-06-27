import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyMaskDirective } from "./currency-mask.directive";
import { CURRENCY_MASK_CONFIG } from "./currency-mask.config";
export class NgxCurrencyModule {
    static forRoot(config) {
        return {
            ngModule: NgxCurrencyModule,
            providers: [{
                    provide: CURRENCY_MASK_CONFIG,
                    useValue: config,
                }]
        };
    }
}
NgxCurrencyModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule],
                declarations: [CurrencyMaskDirective],
                exports: [CurrencyMaskDirective]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3ktbWFzay5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtY3VycmVuY3kvIiwic291cmNlcyI6WyJzcmMvY3VycmVuY3ktbWFzay5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFzQixRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsb0JBQW9CLEVBQXFCLE1BQU0sd0JBQXdCLENBQUM7QUFPaEYsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQTBCO1FBQ3ZDLE9BQU87WUFDTCxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFNBQVMsRUFBRSxDQUFDO29CQUNWLE9BQU8sRUFBRSxvQkFBb0I7b0JBQzdCLFFBQVEsRUFBRSxNQUFNO2lCQUNqQixDQUFDO1NBQ0gsQ0FBQTtJQUNILENBQUM7OztZQWRGLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUUsQ0FBRSxZQUFZLEVBQUUsV0FBVyxDQUFFO2dCQUN0QyxZQUFZLEVBQUUsQ0FBRSxxQkFBcUIsQ0FBRTtnQkFDdkMsT0FBTyxFQUFFLENBQUUscUJBQXFCLENBQUU7YUFDbkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7Rm9ybXNNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHtDdXJyZW5jeU1hc2tEaXJlY3RpdmV9IGZyb20gXCIuL2N1cnJlbmN5LW1hc2suZGlyZWN0aXZlXCI7XHJcbmltcG9ydCB7Q1VSUkVOQ1lfTUFTS19DT05GSUcsIEN1cnJlbmN5TWFza0NvbmZpZ30gZnJvbSBcIi4vY3VycmVuY3ktbWFzay5jb25maWdcIjtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogWyBDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbIEN1cnJlbmN5TWFza0RpcmVjdGl2ZSBdLFxyXG4gIGV4cG9ydHM6IFsgQ3VycmVuY3lNYXNrRGlyZWN0aXZlIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neEN1cnJlbmN5TW9kdWxlIHtcclxuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IEN1cnJlbmN5TWFza0NvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Tmd4Q3VycmVuY3lNb2R1bGU+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBOZ3hDdXJyZW5jeU1vZHVsZSxcclxuICAgICAgcHJvdmlkZXJzOiBbe1xyXG4gICAgICAgIHByb3ZpZGU6IENVUlJFTkNZX01BU0tfQ09ORklHLFxyXG4gICAgICAgIHVzZVZhbHVlOiBjb25maWcsXHJcbiAgICAgIH1dXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==