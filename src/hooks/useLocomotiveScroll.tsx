import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import LocomotiveScroll from 'locomotive-scroll';

type LocomotiveScrollType = InstanceType<typeof LocomotiveScroll>;

type LocomotiveScrollContextType = {
  scroll: LocomotiveScrollType | null;
  setScroll: (scroll: LocomotiveScrollType) => void;
};

const LocomotiveScrollContext = createContext<LocomotiveScrollContextType>({
  scroll: null,
  setScroll: () => {},
});

export const useLocomotiveScroll = () => useContext(LocomotiveScrollContext);

export const LocomotiveScrollProvider = ({ children }: { children: ReactNode }) => {
  const [scroll, setScroll] = useState<LocomotiveScrollType | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scrollContainer = document.querySelector('[data-scroll-container]') as HTMLElement;
    if (!scrollContainer) return;

    const scrollInstance = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
      lerp: 0.075,
      multiplier: 0.5,
      reloadOnContextChange: true,
      class: 'is-inview',
      scrollFromAnywhere: true,
      resetNativeScroll: true
    });

    // Update scroll on route change
    const handleRouteChange = () => {
      setTimeout(() => {
        scrollInstance.update();
      }, 500);
    };

    window.addEventListener('hashchange', handleRouteChange);
    
    setScroll(scrollInstance);

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      if (scrollInstance) {
        scrollInstance.destroy();
      }
    };
  }, []);

  return (
    <LocomotiveScrollContext.Provider value={{ scroll, setScroll }}>
      {children}
    </LocomotiveScrollContext.Provider>
  );
};
