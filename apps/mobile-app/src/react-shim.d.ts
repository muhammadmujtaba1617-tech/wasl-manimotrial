import * as React from 'react';

declare module 'react' {
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
}

declare global {
  namespace React {
    namespace JSX {
      interface Element extends React.ReactElement<any, any> {}
      interface ElementClass extends React.Component<any> {
        render(): React.ReactNode;
      }
      interface ElementAttributesProperty {
        props: {};
      }
      interface ElementChildrenAttribute {
        children: {};
      }
      interface IntrinsicElements {
        [elemName: string]: any;
      }
      interface ElementType<P = any> {
        (props: P): React.ReactNode;
        new (props: P): React.Component<any, any>;
      }
    }
  }
}
