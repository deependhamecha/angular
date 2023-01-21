# Angular Animations

- `:host` to style host component
- `:host(.active)`
- `:host-context`
- `/deep/`
- `:host /deep/ h1`
- `[ngStyle]="{'width.px': isFav? 600: 800}"`
- `[ngClass]="functionName()"`

## Angular Animations
Install animations in polyfills as web animations is not supported by many browsers.

**Install:** 
`npm install web-animations-js --save`

**Import: in polyfills.js**
`import 'web-animations-js';`

[Only these properties are animatable](https://www.w3.org/TR/css-transitions-1/#animatable-properties)

Import in app.module.ts
`BrowserAnimationModule`


### Simple Example
If you put 100 instead of 100px, it will consider percentage.
```ts
@Component({....,
 animations: [
    trigger('clickedState', [
      state('default', style({
        backgroundColor: 'orange',
        width: '100px',
        height: '100px'
      })),
      state('click', style({
        backgroundColor: 'blue',
        width: '300px',
      }))
    ])
  ]
})
```

```html
<div class="orange-box" (click)="onClick()" [@clickedState]="myAnimationstate"></div>
```

```ts
  myAnimationstate: string = 'default';
  onClick() {
    this.myAnimationstate = this.myAnimationstate == 'click' ? 'default': 'click';
  }
```

### Missing Property
```ts
  animations: [
    trigger('clickedState', [
      state('default', style({
        backgroundColor: 'orange',
        width: '100px',
        height: '100px'
      })),
      state('click', style({
        backgroundColor: 'blue',
        width: '300px',
      })),
      transition('default => click', animate('200ms 0ms ease-in')),
      transition('click => default', animate('200ms 0ms ease-out'))
    ])
  ]
```

Missing `height` property will not keep `height 100px`. So makesure to put css properties in state else in common styles for fallback.

### With Transition

```ts
  animations: [
    trigger('clickedState', [
      state('default', style({
        backgroundColor: 'orange',
        width: '100px',
        height: '100px'
      })),
      state('click', style({
        backgroundColor: 'blue',
        width: '300px',
      })),
      transition('default => click', animate('200ms 0ms ease-in')),
      transition('click => default', animate('200ms 0ms ease-out'))
    ])
  ]
```

### Double side transition

Rather than mentioning same transition multiple times back and forth
```ts
  animations: [
    trigger('clickedState', [
      state('default', style({
        backgroundColor: 'orange',
        width: '100px',
        height: '100px'
      })),
      state('click', style({
        backgroundColor: 'blue',
        width: '300px',
      })),
      transition('default <=> click', animate('200ms 0ms ease-out'))
    ])
  ]
```

### Multi step Transitions

Read comments in the code
```ts
  animations: [
    trigger('clickedState', [
      state('default', style({
        backgroundColor: 'orange',
        width: '100px',
        // height: '100px'
      })),
      state('click', style({
        backgroundColor: 'blue',
        width: '300px',
        // height: '100px'
      })),
      transition('default <=> click', [
        style({ // This will start/end animation from this style and not 'default' style. Temporary Styles
          backgroundColor: 'red',
          // width: '150px', // Old state is considered. So its not necessary to give all properties. In this case, width
        }),
        animate('1s 0ms ease-in'),
        style({
          backgroundColor: 'green',
          width: '200px'
        }),
        animate('300ms 0ms ease-in')
      ]),
      // transition('click => default', animate('200ms 0ms ease-out'))
    ])
  ]
```

Read comments in the code
```ts
  animations: [
    trigger('clickedState', [
      state('default', style({
        backgroundColor: 'orange',
        width: '100px',
        // height: '100px'
      })),
      state('click', style({
        backgroundColor: 'blue',
        width: '300px',
        // height: '100px'
      })),
      transition('default <=> click', [
        style({
          backgroundColor: 'red',
          width: '150px', // Old state is considered. So its not necessary to give all properties. In this case, width
        }),
        animate('1s 0ms ease-in', style({ // To make smooth transition between earlier style() and next intermediate style
          backgroundColor: 'green',
          width: '200px'
        })),
        animate('300ms 0ms ease-in')
      ]),
      // transition('click => default', animate('200ms 0ms ease-out'))
    ])
  ]
```

### void

Try removing If and it will work for transition between `shown <=> notShown` but if there is no element in DOM(ngIf)
you will need to specify `void` which points to element not present.

```html
<button (click)="isShown = !isShown">Toggle Element</button>
<p *ngIf="isShown" class="para" [@showState]="isShown ? 'shown': 'notShown'">You can see me now!</p>
```

**app.component.ts**
```ts
  animations: [
    showStateTrigger
  ]
```

**animations.ts**
```ts
import { trigger, state, style, transition, animate } from "@angular/animations";

export const showStateTrigger = trigger('showState', [
    state('notShown', style({

    })),
    state('shown', style({

    })),
    transition('void => shown', [
        style({
            opacity: 0
        }),
        animate(1000),
    ]),
    transition('shown => void', [
        animate(1000, style({
            opacity: 0
        }))
    ])
]);
```

### WildCard State

Suppose you do not have states but you have intermediate states like this,
```ts
export const showStateTrigger = trigger('showState', [
    // state('notShown', style({

    // })),
    // state('shown', style({

    // })),
    transition('void => shown', [
        style({
            opacity: 0
        }),
        animate(1000),
    ]),
    transition('shown => void', [
        animate(1000, style({
            opacity: 0
        }))
    ])
]);
```

Here, you are having intermediate state and final state does not have any css, still have to keep it for the sake of state name.
In this case, it is not compulsory to have state and if you want to have intermediate states. You can use wildcard, which does not point to any state.

```ts
    transition('void => *', [
        style({
            opacity: 0
        }),
        animate(1000),
    ]),
    transition('* => void', [
        animate(1000, style({
            opacity: 0
        }))
    ])
```

### Enter and leave

`void and *` and `* and void` are so common that angular has a name for these states.
```ts
    transition(':enter', [
        style({
            opacity: 0
        }),
        animate(1000),
    ]),
    transition(':leave', [
        animate(1000, style({
            opacity: 0
        }))
    ])
```

### Dynamic Dimensional Property

Consider this
**app.component.html**
```html
<div class="box" @animateBox></div>
```

**app.component.ts**
```ts
  animations: [
    boxTrigger
  ]
```

**animations.ts**
```ts
export const boxTrigger = trigger('animateBox', [
    transition('* => *', [
        animate(400, style({
            width: 0
        })),
        animate(400, style({
            width: '100%'
        }))
    ])
]);
```

Here box will animate take `width: 100%` of the parent. But if you have defined a width in CSS and you want to apply that which is not dynamic.
In this case consider this css width,
```css
.box {
    background-color: blueviolet;
    height: 100px;
    width: 100px;
}
```

So, in this scenario, you want to apply width specified in css file. Then do this,
```ts
animate(400, style({
    width: '*'
}))
```

This will allow to apply width of the element applied via CSS.