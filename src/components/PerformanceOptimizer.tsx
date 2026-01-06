import { useEffect } from 'react';

/**
 * Performance Optimizer Component
 * Implements Core Web Vitals optimization strategies
 * - LCP (Largest Contentful Paint) < 2.5s
 * - FID (First Input Delay) < 100ms
 * - CLS (Cumulative Layout Shift) < 0.1
 */

export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontPreload = document.createElement('link');
      fontPreload.rel = 'preload';
      fontPreload.as = 'font';
      fontPreload.type = 'font/woff2';
      fontPreload.crossOrigin = 'anonymous';
      document.head.appendChild(fontPreload);

      // Preconnect to critical origins
      const origins = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://gpczchjipalfgkfqamcu.supabase.co'
      ];

      origins.forEach(origin => {
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = origin;
        preconnect.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect);
      });
    };

    // Lazy load images below the fold
    const setupLazyLoading = () => {
      if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
          if (img instanceof HTMLImageElement) {
            img.src = img.dataset.src || '';
          }
        });
      } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    // Monitor and report Core Web Vitals
    const reportWebVitals = () => {
      // LCP - Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // FID - First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              console.log('FID:', entry.processingStart - entry.startTime);
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // CLS - Cumulative Layout Shift
          let clsScore = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsScore += (entry as any).value;
                console.log('CLS:', clsScore);
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('Performance Observer not fully supported');
        }
      }
    };

    // Optimize animations for performance
    const optimizeAnimations = () => {
      // Reduce motion for users who prefer it
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        document.documentElement.classList.add('reduce-motion');
      }
    };

    // Service Worker for offline support and caching
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // We'll create a service worker file separately
          // const registration = await navigator.serviceWorker.register('/sw.js');
          // console.log('ServiceWorker registered:', registration);
        } catch (error) {
          console.log('ServiceWorker registration failed:', error);
        }
      }
    };

    // Defer non-critical JavaScript
    const deferNonCriticalJS = () => {
      // Load analytics and other non-critical scripts after page load
      window.addEventListener('load', () => {
        // Add analytics scripts here
        console.log('Non-critical scripts loaded');
      });
    };

    // Resource hints for better loading performance
    const addResourceHints = () => {
      // DNS prefetch for external resources
      const dnsPrefetchDomains = [
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com'
      ];

      dnsPrefetchDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Execute optimizations
    preloadCriticalResources();
    setupLazyLoading();
    reportWebVitals();
    optimizeAnimations();
    registerServiceWorker();
    deferNonCriticalJS();
    addResourceHints();

    // Cleanup
    return () => {
      // Cleanup observers if needed
    };
  }, []);

  return null; // This component doesn't render anything
}

// Web Vitals reporting function (optional - for analytics)
export function sendToAnalytics(metric: any) {
  // Send to your analytics endpoint
  const body = JSON.stringify(metric);
  const url = 'https://analytics.neufin.ai/vitals';

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true });
  }
}

// Custom hook for performance monitoring
export function usePerformanceMonitoring() {
  useEffect(() => {
    // Monitor page load time
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log('Page Load Time:', pageLoadTime, 'ms');

      // Check if within target
      if (pageLoadTime > 2500) {
        console.warn('⚠️ Page load time exceeds 2.5s target');
      } else {
        console.log('✅ Page load time within target');
      }
    });

    // Monitor resource loading
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 1000) {
          console.warn('Slow resource:', entry.name, entry.duration, 'ms');
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);
}
