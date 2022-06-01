import { TestBed } from "@angular/core/testing";
import { CoursesService } from './courses.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { PartialObject } from "cypress/types/lodash";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('CoursesService', () => {
    let coursesService: CoursesService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                CoursesService
            ]
        });

        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should retrieve all courses', () => {
        coursesService
            .findAllCourses()
            .subscribe(courses => {
                console.log("Courses: ", courses);
                expect(courses).toBeTruthy('No courses returned');
                expect(courses.length).toBe(12, 'incorrect number of courses');
            });


        // Mock api request
        const req = httpTestingController.expectOne('/api/courses');

        expect(req.request.method).toEqual('GET', 'Request was expected with GET method');

        // pass mock data
        req.flush({payload: Object.values(COURSES)});

        // No other http request is made except for this
//        httpTestingController.verify();
    });

    it('should retrieve course by id', () => {
        coursesService
            .findCourseById(12)
            .subscribe(course => {

                expect(course).toBeTruthy();
                expect(course).toBeTruthy('course 12 not present');

            });

        // Mock api request
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('GET');

        // pass mock data
        req.flush(COURSES[12]);

        // No other http request is made except for this
        // httpTestingController.verify();
    });

    it('should save the course', () => {

        const changes: Partial<Course> = {
            titles: {
                description: 'testing course'
            }
        };

        coursesService
            .saveCourse(12, changes)
            .subscribe(course => {

            expect(course.id).toBe(12);
        });

        // Mock api request
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');

        expect(req.request.body.titles.description).toEqual(changes.titles.description);

        req.flush({
            ...COURSES[12],
            ...changes
        });
    });

    it('should give an error if save course fails', () => {
        const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

        coursesService
            .saveCourse(12, changes)
            .subscribe(

                () => fail('the save operation should have failed'),

                (error: HttpErrorResponse) => {
                    expect(error.status).toBe(500);

                }

            );

            const req = httpTestingController.expectOne('/api/courses/12');
            expect(req.request.method).toEqual('PUT');

            req.flush('Save course failed', {
                status: 500, statusText: 'Internal Server Error'
            });
    });

    it('should find a list of lessons', () => {
        coursesService.findLessons(12).subscribe(lessons => {
            expect(lessons).toBeTruthy();
            expect(lessons.length).toBe(3);
        });

        const req = httpTestingController.expectOne(
            (req) => req.url == '/api/lessons'
        );

        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('courseId')).toEqual('12');
        expect(req.request.params.get('filter')).toEqual('');
        expect(req.request.params.get('sortOrder')).toEqual('asc');
        expect(req.request.params.get('pageNumber')).toEqual('0');
        expect(req.request.params.get('pageSize')).toEqual('3');

        req.flush({
            payload: findLessonsForCourse(12).slice(0, 3)
        });
    });

    it('should fail with expectnone', () => {
    //    coursesService.findLessons(12).subscribe(lessons => {},
    //     err => {
    //        expect(err).toBeTruthy();
    //    });

    // expectNone is not an API request rather a test that none of the request is hit matching
    // this url in this spec.
       httpTestingController.expectNone('/api/lessons', 'Something went wrong');

    });

    it('Should match without expectation', () => {
        coursesService.findLessons(12).subscribe(lessons => {
            console.log('LESSIONS: ', lessons);  // it will return undefined
            // expect(lessons).toBeTruthy();
            // expect(lessons.length).toBe(3);
        });
        const req = httpTestingController.match(
            (req) => req.url == '/api/lessons'
        );

        expect(req[0].request.method).toEqual('GET');
        expect(req[0].request.params.get('courseId')).toEqual('12');
        expect(req[0].request.params.get('filter')).toEqual('');
        expect(req[0].request.params.get('sortOrder')).toEqual('asc');
        expect(req[0].request.params.get('pageNumber')).toEqual('0');
        expect(req[0].request.params.get('pageSize')).toEqual('3');

        req[0].flush(['12', '123']);
    });

    afterEach(() => {
        // No other http request is made except for this
        httpTestingController.verify();
    });
})