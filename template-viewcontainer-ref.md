# ng-container

```html
<ng-container *ngIf="someValue">
<h1>Dude</h1>
</ng-container>
```
The <ng-container> allows us to use structural directives without any extra element, making sure that the only DOM changes being applied are those dictated by the directives themselves.

# ViewContainerRef
```ts
@ViewChild('tmpRef', { read: TemplateRef }) tmpRef: TemplateRef<any>;
@ViewChild('vc', { read: ViewContainerRef }) vc: ViewContainerRef;


ngAfterViewInit() {
/** TemplateRef Example
     * Create Embedded view from TemplateRef and
     */
    let view = this.tmpRef.createEmbeddedView(null);

    /** TemplateRef Example
     * insert to ng-container
     * 
     * Inserts to existing ng-container
     */
    this.vc.insert(view);
}
```

## Create Component

```ts
this.vc.createComponent(SomeExampleComponent);
```

This will append to viewcontaineref.

To clear viewcontainerref area do,
```
this.vc.clear();
this.vc.createComponent(SomeExampleComponent);
```

# TemplateRef
```html
<ng-template #tmp></ng-template>
```

```ts
@ViewChild('tmp', { read: TemplateRef}) tmp: TemplateRef<any>;
@ViewChild('tmp', { read: TemplateRef}) tmp2: ElementRef; // This gives ElementRef ,so you dont have to do **this.tmp.elementRef**
```

# ngTemplateOutlet & ngComponentOutlet

Now, if you want to do it from Angular HTML instead of Component then use `ngTemplateOutlet` and `ngComponentOutlet`.
```ts
export class AppComponent {
  SomeExampleComponent = SomeExampleComponent;
}

```
```html
<div>
  <span
    >A different example
    <ng-container [ngTemplateOutlet]="tpl"></ng-container
  ></span>
  <ng-template #tpl> with #tpl </ng-template>
</div>

<div>
  <span
    >A different example
    <ng-container *ngComponentOutlet="SomeExampleComponent"></ng-container
  ></span>
</div>
```

# ngTemplateOutletContext
If you want to pass data to templateRef innerHTML then do use this,
```html
<div>
  <span
    >A different example
    <ng-container
      #vc2
      [ngTemplateOutlet]="tpl2"
      [ngTemplateOutletContext]="{ name: 'Deepen' }"
    ></ng-container
  ></span>
  <ng-template #tpl2 let-name="name"> with {{ name }} </ng-template>
</div>
```


# Full Example
```html
<!-- TemplateRef Example -->
<!-- View -->
<span>
  This is a
  <ng-container #vc></ng-container>
</span>
<ng-template #tmpRef>
  <span style="font-weight: bold">TemplateRef Example</span>
</ng-template>

<ng-template #tmpRef2>
  <span> different template.</span>
</ng-template>

<!-- ngTemplateOutlet and ngComponentOutlet -->

<div>
  <span
    >A different example
    <ng-container #outlet [ngTemplateOutlet]="tpl"></ng-container
  ></span>
  <ng-template #tpl> with #tpl </ng-template>
</div>

<div>
  <span
    >A different example
    <ng-container *ngComponentOutlet="SomeExampleComponent"></ng-container
  ></span>
</div>

<div>
  <span
    >A different example
    <ng-container
      #vc2
      [ngTemplateOutlet]="tpl2"
      [ngTemplateOutletContext]="{ name: 'Deepen' }"
    ></ng-container
  ></span>
  <ng-template #tpl2 let-name="name"> with {{ name }} </ng-template>
</div>

<app-some-example *ngIf="someValue"></app-some-example>
```

```ts
export class AppComponent implements AfterViewInit {
  title = 'viewcontainer-example';
  SomeExampleComponent = SomeExampleComponent;

  @ViewChild('tmpRef', { read: TemplateRef }) tmpRef: TemplateRef<any>;
  @ViewChild('vc', { read: ViewContainerRef }) vc: ViewContainerRef;

  @ViewChild('tmpRef2', { read: TemplateRef }) tmpRef2: TemplateRef<any>;

  @ViewChild('tpl2', { read: TemplateRef }) tpl2: TemplateRef<any>;
  @ViewChild('vc2', { read: ViewContainerRef }) vc2: ViewContainerRef;

  embedView: EmbeddedViewRef<any>;

  someValue: boolean = false;

  constructor() {

  }

  ngAfterViewInit(): void {
    console.log("TempRef: ", this.tmpRef);
    console.log("TempRef textContent: ", this.tmpRef.elementRef.nativeElement.textContent);

    /** TemplateRef Example
     * Create Embedded view from TemplateRef and
     */
    let view = this.tmpRef.createEmbeddedView(null);

    /** TemplateRef Example
     * insert to ng-container
     * 
     * Inserts to existing ng-container
     */
    this.vc.insert(view);

    // createEmbeddedView Attaches to ng-container
    setTimeout(() => {
      this.embedView = this.vc.createEmbeddedView(this.tmpRef2);
      // this.embedView.destroy();
    }, 1000);

    setTimeout(() => {
      // Clear and ng-container
      this.vc.clear();
      this.vc.createComponent(SomeExampleComponent);
    }, 2000);

    setTimeout(() => {
      this.vc2.clear();
      let view = this.vc2.createEmbeddedView(this.tpl2, { name: 'Dhamecha' });
    }, 3000);

    setTimeout(() => {
      this.someValue = true;
    }, 5000);
  }
}
```