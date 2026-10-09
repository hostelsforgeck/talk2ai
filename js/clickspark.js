(function() {
  'use strict';

  const defaults = {
    color: '#0c8d3e',
    size: 30,
    strokeWidth: 4,
    sparkCount: 8,
    duration: 660
  };

  let config = { ...defaults };

  class ClickSparkElement extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = this.createSpark();
      this.svg = this.shadowRoot.querySelector('svg');
      this._parent = this.parentNode;
      this._parent.addEventListener('click', this);
    }

    disconnectedCallback() {
      this._parent.removeEventListener('click', this);
      delete this._parent;
    }

    handleEvent(e) {
      this.setSparkPosition(e);
      this.animateSpark();
    }

    animateSpark() {
      const sparks = [...this.svg.children];
      const size = parseInt(sparks[0].getAttribute('y1'));
      const offset = size / 2 + 'px';

      const keyframes = i => {
        const deg = `calc(${i} * (360deg / ${sparks.length}))`;
        return [
          {
            strokeDashoffset: size * 3,
            transform: `rotate(${deg}) translateY(${offset})`
          },
          {
            strokeDashoffset: size,
            transform: `rotate(${deg}) translateY(0)`
          }
        ];
      };

      const options = {
        duration: config.duration,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        fill: 'forwards'
      };

      sparks.forEach((spark, i) => spark.animate(keyframes(i), options));
    }

    setSparkPosition(e) {
      this.style.left = e.pageX - this.clientWidth / 2 + 'px';
      this.style.top = e.pageY - this.clientHeight / 2 + 'px';
    }

    createSpark() {
      return `
        <style>
          :host {
            position: absolute;
            left: 0;
            top: 0;
            pointer-events: none;
            z-index: 2147483647;
          }
        </style>
        <svg width="${config.size}" height="${config.size}" viewBox="0 0 100 100" fill="none"
             stroke-linecap="round" stroke-linejoin="round" stroke-width="${config.strokeWidth}"
             stroke="${config.color}" transform="rotate(-20)">
          ${Array.from(
            { length: config.sparkCount },
            () => `<line x1="50" y1="30" x2="50" y2="4" stroke-dasharray="30" stroke-dashoffset="30" style="transform-origin: center" />`
          ).join('')}
        </svg>
      `;
    }
  }

  if (!customElements.get('click-spark')) {
    customElements.define('click-spark', ClickSparkElement);
  }

  function init() {
    if (document.querySelector('click-spark')) {
      return;
    }

    // Skip on touch devices and when motion is reduced: it would fire on
    // every tap, and it absolutely-positions an element at pageX/pageY,
    // which can push the document wider than the viewport.
    if (window.matchMedia('(hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const spark = document.createElement('click-spark');
    document.body.appendChild(spark);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ClickSpark = {
    config: function(options) {
      config = { ...config, ...options };

      const existingSpark = document.querySelector('click-spark');
      if (existingSpark && existingSpark.shadowRoot) {
        existingSpark.shadowRoot.innerHTML = existingSpark.createSpark.call(existingSpark);
        existingSpark.svg = existingSpark.shadowRoot.querySelector('svg');
      }

      return this;
    },

    destroy: function() {
      const spark = document.querySelector('click-spark');
      if (spark) {
        spark.remove();
      }
      return this;
    },

    reinit: function() {
      this.destroy();
      init();
      return this;
    }
  };

})();
