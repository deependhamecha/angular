# Reactive Angular without NgRx

Benefits of using observables in component

1. Consider you have a `*ngFor="let course of (advancedCourses$ | async)"`
and in your component you have in `ngOnInit`

```js
this.advancedCourses$ = this.courses$.pipe(map(e => e.filter((course: Course) => course.category == "ADVANCED")));
```

and then you remove ngFor from UI, angular is smart enough to not to call the observable even if it is in ngOnInit,
since it is not used on UI

2. Cached API response with `shareReplay` so that when `subscribed` or used `map` it does not call API and return cached data.
```js
loadAllCourses(): Observable<Course[]> {
    return this
        .http
        .get<Course[]>('/api/courses')
        .pipe(
            map(res => res["payload"]),
            shareReplay()
    );
}
```

Remember, `this.courses$` is used multiple times, only then `shareReplay` will work. Used multiple times.

3. Remove your dependency from component using stateless variables(rxjs), which eleminates the need for `@Input`/`@Output` dependencies on other components.

4. Centralized Loader
```js
ngOnInit() {

    this.loadingService.loadingOn()

    this.courses$ = this
        .coursesService
        .loadAllCourses()
        .pipe(
            map(
                courses => courses.sort(sortCoursesBySeqNo),
                finalize(() => this.loadservice.loadingOff())
            )
        );
}
```

```js
showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null)
        .pipe(
            tap(() => this.loadingOn()),
            concatMap(() => obs$),
            finalize(() => this.loadingOff())
        );
}

const loadCourses$ = this.loadService.showLoaderUntilCompleted(courses$);

this.beginnerCourses$ = loadCourses$.pipe(map(courses) => courses.filter(course => course.category == "BEGINNER"));
```

5. Catch Error and throw it again so that observable stream fails
```js
const courses$ = this
    .coursesService
    .loadAllCourses()
    .pipe(
        map(courses => courses.sort(sortCoursesBySeqNo)),
        catchError(err => {
            const message = "Could not load courses";
            this.messageService.showErrors(message); // Some function call
            return throwError(err); // Throw it again to stop the stream
        })
    )

```

6. Creating Selectors without ngrx
```js
// Service File
filterByCategory(category: string): Observable<Course[]>() {
    return this.courses$.pipe(
        map(
            courses => courses.filter(course => course.category == category).sort(sortCoursesBySeqNo)
        )
    )
}


// Component
this.advancedCourses$ = this.service.filterByCategory('ADVANCED');

// HTML
{{advancedCourses$ | async}}
```

7.
```js
<a *ngIf="(courses$ | async) as courses"></a>
```





