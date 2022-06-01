import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { setupCourses } from "../common/setup-test-data";
import { CoursesModule } from "../courses.module";
import { CoursesService } from "../services/courses.service";
import { CoursesCardListComponent } from "./courses-card-list.component";

describe('CourseCardListComponent', () => {

    let component: CoursesCardListComponent;


    // 1. Fixture is a utility type for testing a component
    let fixture: ComponentFixture<CoursesCardListComponent>;

    let el: DebugElement;

    // 3. beforeEach is Synchornous block
    beforeEach(async() => { // 4. async() will detect async block and it will wait for it to complete

        const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

        TestBed.configureTestingModule({
            imports: [
                CoursesModule
            ],
            providers: [
                {provide: CoursesService, useValue: coursesServiceSpy}
            ]
        })
        .compileComponents() // 2. You use compileComponents to execute the any code after compilation has completed because compilation is an async process.
        .then(() => {
            fixture = TestBed.createComponent(CoursesCardListComponent);

            component = fixture.componentInstance;

            el = fixture.debugElement;

        });
    });

    // 3. it() will execute before compileComponents.then since it is synchronous block. so to this 
    it('should create the component', () => {
        expect(component).toBeTruthy();

        // console.log(component);
    });

    it('should display the course list', () => {

        component.courses = setupCourses();

        fixture.detectChanges();

        console.log(el.nativeElement.outerHTML);

        const cards = el.queryAll(By.css('.course-card'));

        expect(cards).toBeTruthy();
        expect(cards.length).toBe(12, 'Unxpected number of courses');
    });

    it('should display the first course', () => {
        component.courses = setupCourses();

        fixture.detectChanges();

        const course = component.courses[0];

        const card = el.query(By.css('.course-card:first-child'));
        const title = card.query(By.css('mat-card-title'));
        const image = card.query(By.css('img'));

        expect(card).toBeTruthy('Could not find card');
        expect(title.nativeElement.textContent).toBe(course.titles.description);
        expect(image.nativeElement.src).toBe(course.iconUrl);
    });

});