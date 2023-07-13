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




To Create a component

- Create a folder
- Create a component file

```js
import { Component } from '@angular/core';

@Component({
  selector: `my-c`,
  templateUrl: `./my-c.html`
})
export class MyComp {
  
}
```
and specify it in `declarations`

or 

```sh
ng g c MyComp
```

## Inline HTML
use `template` instead of `templateUrl` for inline.

## Place Angular Component not via element but via attribute
```html
<div my-c></div>
```

```js
selector: '[my-c]'
```

## Place Angular Component via class
```html
<div class="my-c"></div>
```

```js
selector: '.my-c'
```

## Interpolation
`{{variableName}}`

## Inner HTML
```
<p [innerText]="variableName"></p>
```

## Event

```
<button (click)="methodName()">Click me</button>

methodName() {
  console.log("Clicked me");
}
```

If you want event object then pass `$event` to the argument list and `event` as the parameter.

You can cast the element target depending on the type of element.
```
(<HTMLInputElement>event.target).value;
```

## Two way binding
`[(ngModel)]="name"`

In your module
```js
imports: [FormsModule]
```

## Directives

There are two types of directives:
- Structural - It changes the structure of the app (*ngIf, *ngFor)
- Non structural - Otherwise

```html
<p *ngIf="booleanValue">Show this on true</p>
```

It creates a `<!-- template binding -->` place holder in html when you check dev tools with value.
`ngIf` unlike `ng-hide` in angularjs removes the element from the DOM.

### Directives in Depth
```  import { Directive, Input, OnChanges } from '@angular/core';

  @Directive({
    selector: '[insBtn]',
    host: {
      '[class.btn]': '_shouldBe',
      '[class.btn-primary]': '_shouldBe'
    },
    inputs: ['bankName', 'branch: building']
  })
  export class InsbtnDirective implements OnChanges {

    constructor() { }

    _shouldBe: boolean;

    get shouldBe() {
      return this._shouldBe;
    }

    @Input('shouldBe')
    set shouldBe(value: boolean) {
      console.log(value);
      this._shouldBe = value;
    }

    // @Input('shouldBe') _shouldBe: boolean;

    bankName: string;
    branch: string;

    ngOnChanges(simple) {
      console.log(simple);
    }
  }
```

```
<button type="button" insBtn [shouldBe]="shouldBe">Ins Btn</button>

shouldBe: boolean=true;
```

It work for direct `@Input('shouldBe') _shouldBe: boolean` because **host** only looks at instance variables of the component and not the input.

## If else

```html
<p *ngIf="booleanValue; else otherValue">Dude</p>

<ng-template #otherValue>
  <p>Display this instead.</p>
</ng-template>
```

## ngStyle
```
[ngStyle]="myStyle"
```

```
myStyle = {backgroundColor: "red"}
OR
myStyle = {backgroundColor: getColor()}
```

## ngClass

```css
.online {
  color: blue;
}
```
```html
<p [ngClass]="{online: getBooleanValue()}">Dude</p>
```

## ngFor

```html
<my-c *ngFor="let myc of mycs"></my-c>
<p *ngFor="let a of array">{{a}}</p>
```

> If you need index then `*ngFor="let a of array; let i=index"`

## @Input
`@Input` takes in input.

```js
@Input name: string;
```

```html
<my-c name="'Deepen'" />
```

If you want to alias it, use `@Input('myname') name: string;` then `<my-c myname="'Deepen'" />`

## @Output

`@Output` exports a value.

```js
@Output getName: new EventEmitter<string>;
```

```js
getName.emit(name+' Dhamecha');
```

## Shadowing DOM

When you write CSS, it will create `p[_ngcontent_blabla]` element for `<p>`.

To modify this behvaiour, write in `@Component`

Default
```js
encapsulation: ViewEncapsulation.Emulated
```

Remove shadowing DOM
```js
encapsulation: ViewEncapsulation.None
```

Native to device
```js
encapsulation: ViewEncapsulation.Native
```

## Directives

```js
import { Directive, Renderer2, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHostlistenerDirective]'
})
export class HostlistenerDirectiveDirective implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer2) {
    console.log('jjj')
  }

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'yellow');
  }
  
  @HostListener("mouseenter")
  mouseEnter(event: Event) {
    this.renderer.setStyle(this.el.nativeElement, 'text-shadow', '1px 1px 5px black');
  }

  @HostListener('mouseleave')
  mouseLeave(event: Event) {
    this.renderer.setStyle(this.el.nativeElement, 'text-shadow', 'none');
  }
}
```

- If you dont use the directive, it wont be instantiated(constructor wont be called).
- `@HostListener` listens to event.
- `ElementRef` gives reference to the element on which directive is applied.
- `Renderer2` is used for dynamic styling.
- `<div appHostlistenerDirective></div>`

If you want even better hold on styling then use `HostBinding`
```js
  @HostBinding('style.textShadow') textShadow = 'none';
  @HostListener("mouseenter")
  mouseEnter(event: Event) {
    // this.renderer.setStyle(this.el.nativeElement, 'text-shadow', '1px 1px 5px black');
    this.textShadow = '1px 1px 5px black';
  }

  @HostListener('mouseleave')
  mouseLeave(event: Event) {
    // this.renderer.setStyle(this.el.nativeElement, 'text-shadow', 'none');
    this.textShadow = 'none';
  }
```

If you want **input parameters**, then use `@Input` to access inside directive.
```html
<div appMyDirective [color]="red"></div>
```

```js
@Input() color: string;
@HostBinding('style.color') mycolor = this.color;
```

If you have certain situation where you have different value for component input and directive input then you can do like this
```html
<app-com [appMyDirective]="'red'"></app-com>
```

Inside appMyDirective
```js
@Input('appMyDirective') color: string;
```

## Local Reference
```html
<input type="text" [value]="name" (input)="changeName($event)" #mydude />
<i>{{mydude.value}}</i>
```
or you can also pass it to a method argument
or you can also access directly from component using `@ViewChild()`.

## NgContent

Parent Component
```html
<app-myc>
  <p>Hello</p>
</app-myc>
```

```html
<ng-content></ng-content>
```

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

##Programmatic Naviation

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

## Modules

You cannot declare same Component in different modules but you can provide services in different modules.

The forRoot() pattern
Generally, you'll only need providedIn for providing services and forRoot()/forChild() for routing. However, understanding how forRoot() works to make sure a service is a singleton will inform your development at a deeper level.

If a module defines both providers and declarations (components, directives, pipes), then loading the module in multiple feature modules would duplicate the registration of the service. This could result in multiple service instances and the service would no longer behave as a singleton.

There are multiple ways to prevent this:

Use the providedIn syntax instead of registering the service in the module.
Separate your services into their own module.
Define forRoot() and forChild() methods in the module.
Note: There are two example apps where you can see this scenario; the more advanced NgModules live example, which contains forRoot() and forChild() in the routing modules and the GreetingModule, and the simpler Lazy Loading live example. For an introductory explanation see the Lazy Loading Feature Modules guide.

Use forRoot() to separate providers from a module so you can import that module into the root module with providers and child modules without providers.

Create a static method forRoot() on the module.
Place the providers into the forRoot() method.
src/app/greeting/greeting.module.ts
```js
static forRoot(config: UserServiceConfig): ModuleWithProviders {
  return {
    ngModule: GreetingModule,
    providers: [
      {provide: UserServiceConfig, useValue: config }
    ]
  };
}
```

forRoot() and the Router
RouterModule provides the Router service, as well as router directives, such as RouterOutlet and routerLink. The root application module imports RouterModule so that the application has a Router and the root application components can access the router directives. Any feature modules must also import RouterModule so that their components can place router directives into their templates.

If the RouterModule didn’t have forRoot() then each feature module would instantiate a new Router instance, which would break the application as there can only be one Router. By using the forRoot() method, the root application module imports RouterModule.forRoot(...) and gets a Router, and all feature modules import RouterModule.forChild(...) which does not instantiate another Router.

## FormsModule

If child modules are using same modules then you have to import it at multiple locations, for example, FormsModule.

Then Create a Separate Shared Module, import FormsModule their and import Shared Module in all the modules.

## Lazy Loading Modules

Only load modules if any routes visit this module with

{ path: 'dude', loadChildren: './dude/due.module.ts#DudeModule' }

-----
## Testing
- karma makes a web server that will run tests if file changes.
- *protractor.js* is for end-to-end tests
- Jasmine is the testing library

- In `/src` there is a file called *test.ts* which has configuration of karma and our tests.

- `Fixture` is the testing Component. `DebugElement` is the html element.

- `configureTestingModule` is similar to `NgModule` where we have declarations.

- You write `configureTestingModule().compileComponents()`, if you want to compile the HTML, CSS.

- You can also write before and after fixture.detectChanges() to run test after changes. 

Check Jasmine documentation

// Check Component
expect(component).toBeTruthy() -> true (boolean value)

// Check content inside String 
expect(component.variableName).toContain('deepen');

// Check content is string
expect(component.variableName).toBe('warn');

// Check greater than
expect(component.variableName).toBeGreaterThan(2);

// Check element exist or not
expect(debug.query(By.css('h1')));
expect(debug.query(By.css('.dude')));
expect(debug.query(By.css('#okay')));

// Check text iniside element is same
expect(debug.query(By.css('h1')).nativeElement.innerText).toBe('Deepen Dhamecha');

----------------
expect(component.hideContent).toBeTruthy();

// Call component's method
component.toggle()
expect(component.hideContent).toBeFalsy();
----------------

Above cannot check for async tasks

it('should be bla bla', fakeAsync(() => {
	expect(component.hideContent).toBeTruthy();
	component.methodName();
	tick(500); // Wait for 500 sec, for setTimeout mentioned in the methodName()
	expect(component.hideContent).toBeFalsy();
}));

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

# Write AOT Compatible code

- **Common Mistake #1: Factory functions must be exported, named functions**

Error encountered resolving symbol values statically. Function calls are not supported.
Consider replacing the function or lambda with a reference to an exported function.


- Use `<ng-template>` instead of `<template>`.

### How many types of providers do we have?
Angular 2 offers us the following type of providers:

- Class Provider (useClass)
- FactoryProvider (useFactory)
- Aliased Class Provider (useExisting)
- Value Provider (useValue)

### Strip console.log in prod build
You can use ng lint with --fix flag and no-console rule in tslint configuration file. And hook it to your build call in your package file.

eg.: 
...
 "prebuild": "ng lint --fix",
 "build": "ng build -prod",
...

and build the app

npm run build

ref: https://github.com/angular/angular-cli/wiki/lint

## Angular Injectors

Injectors are created for NgModules automatically as part of the bootstrap process and are inherited through the component hierarchy.

Injectors are inherited, which means that if a given injector can't resolve a dependency, it asks the parent injector to resolve it.
A component can get services
1. from its own injector
2. from the injectors of its component ancestors
3. from the injector of its parent NgModule
4. from the root injector.

Angular DI has a hierarchical injection system, which means that nested injectors can create their own service instances. Angular regularly creates nested injectors. Whenever Angular creates a new instance of a component that has providers specified in @Component(), it also creates a new child injector for that instance. Similarly, when a new NgModule is lazy-loaded at run time, Angular can create an injector for it with its own providers.

A component's injector is a child of its parent component's injector, and inherits from all ancestor injectors all the way back to the application's root injector. 

Note: The decorator requirement is imposed by TypeScript. TypeScript normally discards parameter type information when it transpiles the code to JavaScript. TypeScript preserves this information if the class has a decorator and the emitDecoratorMetadata compiler option is set true in TypeScript's tsconfig.json configuration file. The CLI configures tsconfig.json with emitDecoratorMetadata: true.

This means you're responsible for putting @Injectable() on your service classes.

The dependency value is an instance, and the class type serves as its own lookup key. Here you get a HeroService directly from the injector by supplying the HeroService type as the token:
heroService: HeroService;

## Optional
When a component or service declares a dependency, the class constructor takes that dependency as a parameter. You can tell Angular that the dependency is optional by annotating the constructor parameter with @Optional().
constructor(@Optional() private logger: Logger) {}

When using @Optional(), your code must be prepared for a null value.


# Hierarchical Injectors

##Two injector hierarchies
There are two injector hierarchies in Angular:

ModuleInjector hierarchy—configure a ModuleInjector in this hierarchy using an @NgModule() or @Injectable() annotation.
ElementInjector hierarchy—created implicitly at each DOM element. An ElementInjector is empty by default unless you configure it in the providers property on @Directive() or @Component().

## Tree-shaking and @Injectable()
Using the @Injectable() providedIn property is preferable to the @NgModule() providers array because with @Injectable() providedIn, optimization tools can perform tree-shaking, which removes services that your app isn't using and results in smaller bundle sizes.

VERY IMPORTANT(RECOLLECT NG-CONF): ModuleInjector is configured by the @NgModule.providers and NgModule.imports property. ModuleInjector is a flattening of all of the providers arrays which can be reached by following the NgModule.imports recursively.
Child ModuleInjectors are created when lazy loading other @NgModules.



## Platform injector
There are two more injectors above root, an additional ModuleInjector and NullInjector().

Consider how Angular bootstraps the app with the following in main.ts:

platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {...})
The bootstrapModule() method creates a child injector of the platform injector which is configured by the AppModule. This is the root ModuleInjector.

The platformBrowserDynamic() method creates an injector configured by a PlatformModule, which contains platform-specific dependencies. This allows multiple apps to share a platform configuration. For example, a browser has only one URL bar, no matter how many apps you have running. You can configure additional platform-specific providers at the platform level by supplying extraProviders using the platformBrowser() function.

The next parent injector in the hierarchy is the NullInjector(), which is the top of the tree. If you've gone so far up the tree that you are looking for a service in the NullInjector(), you'll get an error unless you've used @Optional() because ultimately, everything ends at the NullInjector() and it returns an error or, in the case of @Optional(), null. For more information on @Optional(), see the @Optional() section of this guide.

The following diagram represents the relationship between the root ModuleInjector and its parent injectors as the previous paragraphs describe.


## @Injector vs @NgModule
If you configure an app-wide provider in the @NgModule() of AppModule, it overrides one configured for root in the @Injectable() metadata.

## useClass and useExisting

```ts
providers: [
	{
		provide: RootLoggerService,
		useClass: RootLoggerService
	},
	{
      provide: SuperLoggerService, // SuperClass
      useClass: RootLoggerService // SubClass
	}
]
```

By default `providers: [RootLoggerService]` is written as `{provide: RootLoggerService, useClass: RootLoggerService}`.

**root-logger.service.ts**
```ts
@Injectable()
export class RootLoggerService {

  count: number = 0;

  constructor() { }
}

@Injectable()
export class SuperLoggerService {
  count: number = 0;
}

export class Dude {
  name: string;
  age: number;
}
```

**app.component.ts**
```ts
export class AppComponent {
  title = 'ng-try';

  constructor(private rootLoggerService1: RootLoggerService, private rootLoggerService2: SuperLoggerService, private dude: Dude) {
    this.rootLoggerService1.count++;
    console.log("1: ", this.rootLoggerService1.count);
    this.rootLoggerService2.count++;
    console.log("2: ", this.rootLoggerService2.count);
  }
}
```

**app.component.html**
```ts
<h1>rootLoggerService1: {{rootLoggerService1?.count}}</h1>
<h1>rootLoggerService2: {{rootLoggerService2?.count}}</h1>
<h1>Dude: {{dude.name}}</h1>
```

**Output**
```
rootLoggerService1: 1
rootLoggerService2: 1
Dude: Deepen
```

1. As `useClass` creates alias in this scenario or if you check in angular documentation. In simple terms, you provide a token(Class, not an interface) in *provide* and *useClass*, a token(Class, not an interface).
2. Angular will create an instance of class mentioned in *useClass*. Remember, **Class**, as typescript cannot create instance of an interface.
3. It will create two different instances.
4. Now, coming to **useExisting**, if you provide this in configuration to providers:
```js
providers: [
	{
		provide: RootLoggerService,
		useClass: RootLoggerService
	},
	{
		provide: SuperLoggerService, // SuperClass
		useExisting: RootLoggerService // SubClass
	}
]
```
Then it will create only one instance first and second you would reused, so your output will be following:
**Output**
```
rootLoggerService1: 2
rootLoggerService2: 2
Dude: Deepen
```

## useValue
```ts
{
	provide: Dude, // You cannot use interface as type here
	useValue: {name: 'Deepen', age: 28}
}
```

**useValue** needs a value rather than a class, as this will use the value and angular will not create an instance.


## Interceptor

## Dependency Injection and Injectors

## Testing (Angular University Course)

## Reuse Strategy
If you have a scenario where route is same but just parameter is changing, then component wont reload which means `ngOnInit` wont run again. So, to fix this, you can tell angular not to reuse the component again by specifying this to the component or `app.component.ts`. If you are using it for a specific component then make sure to revert it again on `ngOnDestroy`.
	
```
this.router.routeReuseStrategy.shouldReuseRoute = function() {return false;};
```
