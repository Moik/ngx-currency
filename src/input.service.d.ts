import { InputManager } from "./input.manager";
import { CurrencyMaskConfig } from "./currency-mask.config";
export declare class InputService {
    private htmlInputElement;
    private options;
    PER_AR_NUMBER: Map<string, string>;
    initialize(): void;
    inputManager: InputManager;
    constructor(htmlInputElement: any, options: CurrencyMaskConfig);
    addNumber(keyCode: number): void;
    applyMask(isNumber: boolean, rawValue: string): string;
    clearMask(rawValue: string): number;
    changeToNegative(): void;
    changeToPositive(): void;
    removeNumber(keyCode: number): void;
    updateFieldValue(selectionStart?: number): void;
    updateOptions(options: any): void;
    prefixLength(): any;
    isNullable(): boolean;
    readonly canInputMoreNumbers: boolean;
    readonly inputSelection: any;
    rawValue: string;
    readonly storedRawValue: string;
    value: number;
}
