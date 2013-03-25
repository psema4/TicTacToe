window.addEventListener('load', function() {
    if ('xouya' in window && xouya.showToast && typeof xouya.showToast == 'function') {
        window.alert = function(msg) { xouya.showToast(msg); };

    } else {
        if (typeof xouya != 'undefined') {
            xouyaLogger.print('no showToast support');
        } else {
            xouyaLogger.print('no xouya support');
        }
    }

    if ('Game' in window && typeof Game.start == 'function') {
        Game.start();
    }
});
