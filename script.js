/* ============================================================
   BUNKER DE JOYAS — script.js
   Contenido: efecto typewriter + movimiento del carrusel
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     1. TYPEWRITER — "UN ESPACIO PARA CREAR"
     Escribe letra por letra al cargar. Al terminar, el cursor
     (definido en styles.css como .cursor) queda parpadeando
     infinito porque es un elemento aparte, siempre al final.
  ------------------------------------------------------------ */
  (function typewriter(){
    const el = document.getElementById('typewriterText');
    if(!el) return;

    const text = 'UN ESPACIO PARA CREAR';
    const speed = 55; // ms por letra

    if(reduceMotion){
      el.textContent = text;
      return;
    }

    let i = 0;
    el.textContent = '';

    function typeNext(){
      if(i < text.length){
        el.textContent += text.charAt(i);
        i++;
        setTimeout(typeNext, speed);
      }
    }
    typeNext();
  })();


  /* ------------------------------------------------------------
     2. CARRUSEL — movimiento continuo controlado por JS
     - Se mueve solo, en loop infinito (el track tiene el set
       de imágenes duplicado x2 en el HTML para el loop parejo).
     - Se detiene por completo al pasar el cursor o tocar (mobile).
     - El cambio de color de la imagen puntual bajo el cursor
       sigue resuelto por CSS (:hover en .carousel-item img).
  ------------------------------------------------------------ */
  (function carousel(){
    const track = document.querySelector('.carousel-track');
    if(!track) return;

    // Apagamos la animación CSS: a partir de acá el movimiento
    // lo maneja este script vía requestAnimationFrame.
    track.style.animation = 'none';

    if(reduceMotion){
      track.style.transform = 'translateX(0)';
      return;
    }

    const SPEED = 40; // píxeles por segundo
    let offset = 0;
    let paused = false;
    let lastTimestamp = null;
    let halfWidth = track.scrollWidth / 2; // el set está duplicado x2

    function recalcHalfWidth(){
      halfWidth = track.scrollWidth / 2;
    }
    window.addEventListener('resize', recalcHalfWidth);

    function step(timestamp){
      if(lastTimestamp === null) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000; // segundos
      lastTimestamp = timestamp;

      if(!paused){
        offset += SPEED * delta;
        if(offset >= halfWidth){
          offset -= halfWidth; // loop perfecto e invisible
        }
        track.style.transform = `translateX(${-offset}px)`;
      }

      requestAnimationFrame(step);
    }

    function pause(){ paused = true; }
    function resume(){ paused = false; }

    // Desktop
    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);

    // Mobile / touch (no hay hover real)
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', resume, { passive: true });

    requestAnimationFrame(step);
  })();

});