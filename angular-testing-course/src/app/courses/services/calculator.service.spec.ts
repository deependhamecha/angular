// A group of sepcification is called suite.
// karma is a test runner which will open browser

import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

// Suite
describe('CalculatorService', () => {

    let calculator: CalculatorService;
    let loggerService: LoggerService;

    beforeEach(() => {
        loggerService = jasmine.createSpyObj('LoggerService', ['log']);

        // get is deprecated
        
        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                {
                    provide: LoggerService,
                    useValue: loggerService
                }
            ]
        });

        calculator = TestBed.inject(CalculatorService);

    });

    // Specification
    it('should add two numbers', () => {

        const result = calculator.add(2,2);

        expect(result).toBe(4, "Unxepected addition result");
        expect(loggerService.log).toHaveBeenCalledTimes(1);
    });

    it('should subtract two numbers', () => {
        
        const result = calculator.add(2,2);

        expect(result).toBe(4, "Unxepected addition result");

        expect(loggerService.log).toHaveBeenCalledTimes(1);
    });
})
