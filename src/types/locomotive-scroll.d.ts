import 'locomotive-scroll';

declare module 'locomotive-scroll' {
  interface DeviceOptions {
    breakpoint?: number;
  }

  interface InstanceOptions {
    inertia?: number;
    multiplier?: number;
    class?: string;
    gestureDirection?: 'vertical' | 'horizontal';
  }
}
