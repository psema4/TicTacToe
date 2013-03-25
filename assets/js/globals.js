window.messageCount = 0;

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window._animFrameId = window.setTimeout(callback, 1000 / 60);
          };
})();

window.cancelAnimFrame = (function(){
  return  window.cancelAnimationFrame       ||
          window.webkitCancelAnimationFrame ||
          window.mozCancelAnimationFrame    ||
          window.oCancelAnimationFrame      ||
          window.msCancelAnimationFrame     ||
          function( callback ){
            window.clearTimeout(window._animFrameId);
          };
})();
function $ (sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }
