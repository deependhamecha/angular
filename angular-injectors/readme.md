## Angular Injectors

| Index                                             |
|---------------------------------------------------|
| [Optional](#optional)                             |
| [Hierarchical Injectors](#hierarchical-injectors) |
| [Tree-shaking and Injectable](#tree-shaking-and-injectable)                  |
| [Platform Injector](#platform-injector) |
| [Injector vs NgModule](#injector-vs-ngmodule) |
  

Injectors are created for NgModules automatically as part of the bootstrap process and are inherited through the component hierarchy.

Injectors are inherited, which means that if a given injector can't resolve a dependency, it asks the parent injector to resolve it. A component can get services from its own injector, from the injectors of its component ancestors, from the injector of its parent NgModule, or from the root injector.

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

