import { DebugElement } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { setupCourses } from "../common/setup-test-data";
import { click } from "../common/test-utils";
import { CoursesModule } from "../courses.module";
import { CoursesService } from "../services/courses.service";
import { HomeComponent } from "./home.component";

fdescribe('HomeComponent', () => {

    let fixture: ComponentFixture<HomeComponent>;
    let component: HomeComponent;
    let el: DebugElement;
    let coursesService: any;

    let beginnerCourses = setupCourses()
        .filter(course => course.category == 'BEGINNER');

    let advancedCourses = setupCourses()
        .filter(course => course.category == 'ADVANCED');

    beforeEach(waitForAsync(() => {

        const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);
        

        TestBed.configureTestingModule({
            imports: [
                CoursesModule,
                NoopAnimationsModule
            ],
            declarations: [
                HomeComponent
            ],
            providers: [
                {
                    provide: CoursesService,
                    useValue: coursesServiceSpy
                }
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(HomeComponent);
            component = fixture.componentInstance;
            el = fixture.debugElement;
            coursesService = TestBed.inject(CoursesService)
        });

    }));

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display only beginner courses', () => {
        console.log('>>>', component);

        console.log('<<<<', coursesService);

        coursesService
            .findAllCourses
            .and
            .returnValue(of(beginnerCourses)); // This happens synchronously, strange

        fixture.detectChanges();

        const tabs = el.queryAll(By.css('.mat-tab-label'));

        expect(tabs.length).toBe(1, 'Unexcepted number of tabs found');
    });

    it('should display only advanced courses', () => {
        coursesService
            .findAllCourses
            .and
            .returnValue(of(advancedCourses)); // This happens synchronously, strange

        fixture.detectChanges();

        const tabs = el.queryAll(By.css('.mat-tab-label'));

        expect(tabs.length).toBe(1, 'Unexcepted number of tabs found');
    });

    it('should display both tabs', () => {
        coursesService
            .findAllCourses
            .and
            .returnValue(of(setupCourses())); // This happens synchronously

        fixture.detectChanges();

        const tabs = el.queryAll(By.css('.mat-tab-label'));

        console.log("tabs: ",tabs);

        expect(tabs.length).toBe(2, 'Unexcepted number of tabs found');
    });

    // User interaction
    fit('should display advanced courses when tab clicked', () => {

        console.log("setupCourses: ", setupCourses);

        coursesService
            .findAllCourses
            .and
            .returnValue(of(advancedCourses));

        console.log("findAllCourses: ", coursesService.findAllCourses());

        fixture.detectChanges();

        const tabs = el.queryAll(By.css('.mat-tab-label'));

        console.log("tabs: ", tabs);
        
        // Native DOM Click
        // el.nativeElement.click();

        click(tabs[0]); // remember, click is sync in this case


        fixture.detectChanges();

        const cardTitles = el.queryAll(By.css('.mat-card-title'));

        console.log("cardTitles: ", cardTitles);

        expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');

        expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
    });

    it('Asynchronous test example with Jasmine done()', (done: DoneFn) => {
        let d = 1;
    
        setTimeout(() => {
            d++;
            expect(d).toBe(2);
            done();
        }, 1000);
    });

    it('Asynchronous test example setTimeout() with tick()', fakeAsync(() => {
        let test = false;

        setTimeout(() => {
            console.log('Running assertions setTimeout()');
            test = true;
        }, 6000);

        // With tick(), we control the time for async events to complete
        // tick will wait for that much of time to complete async events.
        // It is defined outside of asynchronous block unlike done()
        // fakeAsync works with zonejs
        tick(5000);
        tick(900);
        tick(100);

        expect(test).toBeTrue();
    }));

    it('Asynchronous test example setTimeout() with flush()', fakeAsync(() => {
        let test = false;

        setTimeout(() => {
            console.log('Running assertions setTimeout()');
            test = true;
        }, 6000);

        // Suppose you dont have time with tick then use flush to drain or wait for the task
        flush();

        expect(test).toBeTrue();
    }));

    it('Asychronous test example - Plain Promise()', fakeAsync(() => {
        let test = false;

        console.log('Creating promise');

        // 1. Macrotask - like api calls, where it has heavy duty of updating the browser view
        // setTimeout(() => {
        //     console.log('SetTimeout() first callback triggered');
        // });

        // Macrotask - like api calls, where it has heavy duty of updating the browser view
        // 1. handled by event loop
        // setTimeout(() => {
        //     console.log('SetTimeout() second callback triggered');
        // });

        // 1. called as micro task
        // 2. Macro and micro task where are queued separately.
        // 3. resolve() immediately resolves the Promise
        // 4. Browser completes micro task queue before executing macrotask queue
        Promise
        .resolve()
        .then(() => {

            console.log('Promise first then() evaluated successfully');
            return Promise.resolve();
        }).then(() => {

            console.log('Promise second then() evaluated successfully');
            test = true;
        });

        console.log('Running test assertions');

        flushMicrotasks();

        expect(test).toBeTrue();
    }));


    it('Asynchronous test example - Promise + setTimeout()', fakeAsync(() => {

        let counter = 0;

        Promise.resolve()
            .then(() => {
                counter += 10;

                setTimeout(() => {
                    counter += 1;
                }, 1000);
            });

        expect(counter).toBe(0);

        flushMicrotasks();

        expect(counter).toBe(10);

        tick(1000);
        
        expect(counter).toBe(11);
    }));

    it('Asynchronous test example - Observables', fakeAsync(() => {

        let test = false;

        console.log('Creating Observable');

        const test$ = of(test).pipe(delay(1000));        
        
        test$.subscribe(e => {
            test = true;
        });
        
        tick(1000);

        console.log('Running test assertions');

        expect(test).toBeTrue();
    }));

    // you can do api calls(integration tests) in async block and not fakeAsync
});