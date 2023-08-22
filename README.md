# Angular
Everything related to Angular Framework

- Creating NgModule with ModuleWithProviders
- forRoot, forChild(), forFeature()
- ControlValueAccessor
- Interceptors
- angular.json, AOT, JIT, etc
- Schematics
- Testing
- JavaScript versions
- Typescript
- tsconfig.json
- Promise vs Observables
- Depdency Injection (Angular Injectors)
- Sharing of data between components
- Async functions
- Directives
- Interceptors
- Guards and types of guards
- Structural directives
- Decorators
- Lazy Loading module (On Demand loading)
- How to update angular versions
- https://indepth.dev/posts/1133/what-is-forwardref-in-angular-and-why-we-need-it
- RxJs
- NgRx
- @Input and @Output
- Directives
- Reactive Forms(FormControl)
- ngModel
- NgRx
- Unit Testing
- Integration Testing(Cypress)
- Dynamic Components
- Angular Universal
- Schematics
- Create a library
- NgZone
- Material theme setup properly(Check Acadmind video on youtube)
- RxJs
- ControlValueAccessor
- Services and Providers
- Create a dynamic component like modal.
- Route Resolver
- Guards
- Angular Component reload on same route
- Get Form Control Value inside Directive








Angular 2 does not have a bootstrap directive (ng-app). We always launch the app in code by explicitly calling a bootstrap function and passing it the name of the application's module (AppComponent).

## Service

The Injector is a service that keeps track of the injectable components by maintaining a registry and injects them when needed.


Both works fine
```ts
provide(CarService, {useClass: CarService})

OR

providers: [CarService]
```

### Using Service in a component
dude.service.ts
```js
export default class DudeService {
  getData() {
    return "Hello";
  }
} 
```

```html
@Component({
...
providers: [DudeService]
})
export class MyComponent {
  constructor(private dudeService: DataService) {}
}
```

Here Angular will inject DataService Object for us. However, it will create single instance for this component and its child component.

### Singleton Service across whole module

app.module.ts
```js
@NgModule({
...
providers: [DudeService]
})
```

This way even `MyComponent` will get singleton instance.

### Mixing providers of NgModule and Component

fooking.service.ts
```js
export default class FookingService {

    name: string="Deepen";

    addSurname(s: string) {
        this.name += " "+s;
    }
}
```

parent.component.ts
```js
import { Component, OnInit } from '@angular/core';
import FookingService from '../fooking.service';

@Component({
  selector: 'app-parent-component',
  templateUrl: './parent-component.component.html',
  styleUrls: ['./parent-component.component.css'],
  providers: [FookingService]
})
export class ParentComponentComponent implements OnInit {

  constructor(private fooking: FookingService) { }

  ngOnInit() {
    this.fooking.addSurname("Dhamecha");
    console.log("Parent: "+this.fooking.name);
  }

}

```

child.component.ts
```js
import { Component, OnInit } from '@angular/core';
import FookingService from '../fooking.service';

@Component({
  selector: 'app-child-component',
  templateUrl: './child-component.component.html',
  styleUrls: ['./child-component.component.css'],
//  providers: [FookingService]
})
export class ChildComponentComponent implements OnInit {

  constructor(private fooking: FookingService) { }

  ngOnInit() {
    console.log("Child: "+this.fooking.name);
  }

}
```

Here, `ParentComponent` creates a new instance of the service as it defines provider and shares it with `ChildComponent`.
But, if you **uncomment** `providers: [FookingService]`, `ChildComponent` will create new instance as well.
So there will be two separate instance.
**Output:**
```
Parent: Deepen Dhamecha
Child: Deepen
```

Same goes with `NgModule` and any Component.
As soon as you write providers in component, then it will create new instance.
If you want to use pure singleton across whole module then just define it in `app.module.ts` and write in constructors of the component.

## @Injectable
**Injectable** lets angular injects the dependencies. As a service is nothing but a class.

```js
class OneService {}

@Injectable()
class TwoService {
  constructor(private one: OneService) {}
}
```

Above resolves dependencies for you only you write `@Injectable()`.

## Manually Inject using @Inject

Note: This can be never be used in component
```js
class OneService {}

class TwoService {
  constructor(@Inject(OneService) one: OneService) {}
}
```

Above manually Injects `OneService` but it should be defined in `app.module.ts`, as you are not creating the instance not even angular knows how to create it. Its just a variable for Angular. So it will use instance defined in provider and use it inject. If you didnt understand check next example to get what is the use of `@Inject`.

```js
class OneService {}

var oneService = new OneService();

class TwoService {
  constructor(@Inject(oneService) one) {}
}
```

Did you see? In this case we already have an instantiated object and thats what we are passing it as an argument to `@Inject`.

### providedIn of @Injectable

```js
@Injectable({providedIn: 'root'})
class TwoService {
  constructor(private one: OneService) {}
}
```

If you write `providedIn: 'root'` then its not necessary to define it in `NgModule`'s providers array. It will always create one instance for that module.

## LifeCycle Hooks
ngOnchanges detects only Input variables. It is called before ngoninit as input are set first. even if you have more than one input then also it will call only once.

ngOninit inits after constructor, when component is initialized.

ngDoCheck is called whenever anything is changed, even if someone clicked a button and no values are changed.
Also called when you change value from outside the component for example from parent component using @viewchild

It gets called twice first time but thats only in development mode.


ngAfterContentInit called ng-content is created into view.

ngAfterContentChecked 

ngAfterViewInit called component's view has been initialized(rendered).

ngAfterViewChecked called component and its child are checked or view is re-rendered due to change in view(variables displaying on view).

ngOnDestroy before component is destroyed.


## @ContentChild

@Viewchild wont work for content inside ng-content, for that use @ContentChild

## Routing


import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent }
];

  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ]


<router-outlet></router-outlet>

<a routerLink="/">
<a routerLink="/users">
<a [routerLink]="['users']"></a>

routerLinkActive="class_name"
[routerLinkActiveOptions]="{exact: true}"

## Programmatic Naviation

this.router.navigate(['/users']);
this.router.navigate(['users'], {relativeTo: this.route}); // Same as above, but you can write string to mention relative path before users


## Dynamic Path
{ path: 'user/:id', component: ComponentName }


To Access in Component

constructor(private route: ActivatedRoute) {}

ngOnInit() {
	this.route.snapshot.params['id'];
}

If route data changes then it wont update the component params for that use.
Suppose you use

{ path: 'user/:id/:name', component: ComponentName }

```html
<a [routerLink]="['/users', 10, 'Deepen']"></a>
```

paramSubscription: Subscription;

this.paramSubscription = this.route.params.subscribe(params: Params => { this.anyVariable = params['id']; });

ngOnDestroy() {
	this.paramSubscription.unsubscribe();
}

## Query Params

<a [routerLink]="['/users', 10, 'Deepen']" [queryParams]="{key: 'value'}"></a>

## Fragment

<a [routerLink]="['/users', 10, 'Deepen']" [queryParams]="{key: 'value'}" fragment="loading"></a>

## Programmatically

id and name are local variables
this.router.navigate(['/servers', id, name], { queryParams: {key: 'value'} , fragment: 'loading' });

## Retrieving Query Params and Fragments
this.route.queryParams.subscribe(qp => {})
this.route.fragment.subscribe(qp => {})

## Child Routes

```js
{ path: 'user/:id/:name', component: ComponentName, children: {
	{ path: ':id', component: ComponentName1 },
	{ path: ':id/edit', component: ComponentName2 },
}
}
```

it wont put in <router-outlet> of previous rather go to ComponentName file and put <router-outlet> inside html.

Google: queryParamsHandling ?

## Wildcard Routing
{ path: '**', component: AnyComponent }

## Redirecting

{ path: 'error-page', component: PageNotFoundComponent },
{ path: 'not-found', redirectTo: '/error-page'}




## Redirection Path Maching

In our example, we didn't encounter any issues when we tried to redirect the user. But that's not always the case when adding redirections.

By default, Angular matches paths by prefix. That means, that the following route will match both /recipes  and just / 

{ path: '', redirectTo: '/somewhere-else' } 

Actually, Angular will give you an error here, because that's a common gotcha: This route will now ALWAYS redirect you! Why?

Since the default matching strategy is "prefix" , Angular checks if the path you entered in the URL does start with the path specified in the route. Of course every path starts with ''  (Important: That's no whitespace, it's simply "nothing").

To fix this behavior, you need to change the matching strategy to "full" :

{ path: '', redirectTo: '/somewhere-else', pathMatch: 'full' } 

Now, you only get redirected, if the full path is ''  (so only if you got NO other content in your path in this example).

## Outsource Routes to different module

Create a file, app-routing.module.ts
Note: Do not re-declare Components in app-routing.module.ts.
that means: if you are using components in routes then dont write in declaration unless it is done in app.module.ts

```js

@NgModule({
imports: [
	RouterModule.forRoot(appRoutes)
],
exports: [
	RouterModule
]
})
export class AppRoutingModule {

}
```

app.module.ts
```js
imports: [..., AppRoutingModule]
```

## FormsModule

If child modules are using same modules then you have to import it at multiple locations, for example, FormsModule.

Then Create a Separate Shared Module, import FormsModule their and import Shared Module in all the modules.

## Lazy Loading Modules

Only load modules if any routes visit this module with

{ path: 'dude', loadChildren: './dude/due.module.ts#DudeModule' }

-----


-----

## Animations
```
    trigger('fade', [
      state('void', style({
        opacity: 0,
        backgroundColor: 'yellow'
      })),
      state('*', style({
        opacity: 1,
        backgroundColor: 'red'
      })),
      transition('void => *', [
        animate(1000)
      ]),
      transition('* => void', [
        animate(1000)
      ])
    ])
```

```
    trigger('fade', [
      state('closed', style({
        opacity: 0
      })),
      state('open', style({
        opacity: 1
      })),
      transition('closed => open', [
        style({
          backgroundColor: 'yellow'
        }),
        animate('1s')
      ]),
      transition('open => closed', [
        animate('1s')
      ])
    ])
```

