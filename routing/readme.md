# Routing

## Do something between navigation of routes
```js
this.router.events.subscribe(
    event => {
        if(event instanceof NavigationStart) {
            this.loadingService.loadingOn();
        } else if(
            event instanceof NavigationEnd ||   // Successfully completes
            event instanceof NavigationError || // Error occurs while routing
            event instanceof NavigationCancel   // Navigation cancels
        ) {
            this.loadingService.loadingOff();
        }
    }
);
```

This will result properly if your api calls are in Route Resolver.

## Do something while lazy loaded module is loading

```js
this.router.events.subscribe(
    event => {
        if(event instanceof RouteConfigLoadStart) {
            this.loadingService.loadingOn();
        }
        else if(event instanceof RouteConfigLoadEnd) {
            this.loadingService.loadingOff();
        }
    }
);
```

## Guards

```js
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthStore,
    private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> { // UrlTree is necessary to redirect to target route
        return this
            .auth
            .isLoggedIn$
            .pipe(
                map(loggedIn => loggedIn ? true: this.router.parseUrl('/login'))
            );
    }
}
```

```js
providers: [AuthGuard]
```

app-routing.module.ts
```js
{
    path: ':courseUrl',
    component: CourseComponent,
    canActivate: [AuthGuard],
    children: []
}
```
`CanActivate` will not  protect child routes.

`CanDeactivate` wont get triggered if you are routing to child routes.
```js
@Injectable()
export class ConfirmExitGuard implements CanDeactivate<CourseComponent> {
    canDeactivate(
        component: CourseComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouteStateSnapshot): boolean {
        
        return component.confirmExit();
    }
}
```

`CanActivate` when used on Lazy Loaded Modules, will load the module. So, to prevent even loading of lazy loaded module, there is a different type of Guard called `CanLoad` which will prevent even loading of Lazy Loaded module.

```js
@Injectable()
export class CanLoadAuthGuard implements CanLoad {
    constructor(
        private auth: AuthStore,
        private router: Router) {}

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {

        return
            this
            .auth
            .isLoggedIn$
            .pipe(
                first(),
                tap(isLoggedIn => {
                    if(!isLoggedIn) {
                        this.router.navigateByUrl('/login');
                    }
                }));
    }
}
```

```js
loadChildren: ()=>.....,
canLoad: [CanLoadAuthGuard]
```

## Preloading Strategy

Load Lazy Loaded modules eagerly
```js
RouterModule.forRoot(
    routes,
    {
        preloadingStrategy: NoPreloading
    }
)
```

```js
RouterModule.forRoot(
    routes,
    {
        preloadingStrategy: PreloadAllModules
    }
)
```
This will not affect the modules with `CanLoad` Guard. Means, even if you define `PreloadAllModules`, then lazy loaded modules with CanLoad will not preload.
If you remove `CanLoad` Guard from Lazy Loaded Module then it will preload LazyLoaded modules.

**CustomPreloadingStrategy**
```js
{
    path: ':courses',
    loadChildren: () => ...,
    data: {
        preload: false // Static data attached to routes.
    }
}
RouterModule.forRoot(
    routes,
    {
        preloadingStrategy: CustomPreloadingStrategy
    }
)
```

```js
@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
    preload(route: Route, load: () => Observable<any>): Observable<any> {

        if(route.data["preload"]) {
            return load();
        }
        else {
            of(null);
        }
    }
}
```
This will not preload lazy loaded module.

# Secondary Outlet

```html
<router-ouetlet name="chat"></router-outlet>
```

```js
{
    path: 'helpdesk-chat',
    component: SomeComponent,
    outlet: 'chat'
}
```

```html
<a [routerLink]="[{outlets: {chat: ['helpdesk-chat']}}]">Chat</a>
```

So, now if your route becomes 
```
/some(chat:helpdesk-chat)
```

To remove secondary route from outlet
```html
<a [routerLink]="[{outlets: {chat: null]}}]">Chat</a>
```

Route to parent component
```html
<a [routerLink]="['../', {outlets: {chat: null]}}]">Chat</a>
```

So, now if your route becomes 
```
/some(chat:)
```
and now if you refresh your app crashes. This is a known issue and should not be used on production. Instead use dynamic components. :)


**Enable Tracing**

```js
RouterModule.forRoot(
    routes, {
        enableTracing: true
    }
)
```

Now, check console.

**ParamsInheritanceStrategy**

```js
RouterModule.forRoot(
    routes, {
        paramsInheritanceStrategy: 'always'
    }
)
```

```js
RouterModule.forRoot(
    routes, {
        relativeLinkResolution: 'corrected'
    }
)
```

If you use `./` and `../` it wont work sometimes.


If your angular application cannot parse the malformed url then before going to pagenotfound it will trigger this,
```js
RouterModule.forRoot(
    routes, {
        malformedUriErrorHandler:
            (err: URIError, urlSerializer, url: string) => urlSerializer.parse('/page-not-found')
    }
)
```