import { useEffect, useState } from 'react';

/**
 * Hook to detect virtual keyboard visibility on mobile devices
 * Useful for adjusting layout when keyboard appears
 */
export function useKeyboardHeight(): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      // On mobile, when keyboard appears, visualViewport height changes
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const keyboardHeight = windowHeight - viewportHeight;
        setKeyboardHeight(Math.max(0, keyboardHeight));
      }
    };

    // Listen for visual viewport resize
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      
      return () => {
        window.visualViewport?.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return keyboardHeight;
}

/**
 * Returns true if keyboard is likely visible
 */
export function useIsKeyboardVisible(): boolean {
  const keyboardHeight = useKeyboardHeight();
  return keyboardHeight > 100; // Keyboard is considered visible if height > 100px
}
