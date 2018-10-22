(function () {
    function isIOS() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        return sUserAgent.match(/ipad/i) == "ipad" || sUserAgent.match(/iphone os/i) == "iphone os";
    }

    function ajustHtmlFontSize() {
        var html = document.documentElement;
        var windowWidth = html.clientWidth;
        var maxWidth = 768;

        windowWidth = windowWidth > maxWidth ? maxWidth : windowWidth;
        html.style.fontSize = windowWidth / 750 * 10 + 'px';
    }

    function createOrientationChangeProxy(fn, scope) {
        return function () {
            clearTimeout(scope.orientationChangedTimeout);
            var args = Array.prototype.slice.call(arguments, 0);
            scope.orientationChangedTimeout = setTimeout(function () {
                var ori = window.orientation;
                if (ori != scope.lastOrientation) {
                    fn.apply(scope, args);
                }
                scope.lastOrientation = ori;
            }, isIOS() ? 0 : 200);
        };
    }
    var listeners = [];
    var orientationChangeProxy = {
        addListener: function (listener) {
            for (var i = 0, len = listeners.length; i < len; ++i) {
                if (listener[i] === listener) {
                    return;
                }
            }
            listeners.push(listener);
        },
        removeListener: function (listener) {
            for (var i = 0, len = listeners.length; i < len; ++i) {
                if (listener[i] === listener) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        }
    };
    document.addEventListener('DOMContentLoaded', ajustHtmlFontSize, false);
    window.onresize = ajustHtmlFontSize;
    window.addEventListener('orientationchange', createOrientationChangeProxy(function () {
        for (var i = 0, len = listeners.length; i < len; ++i) {
            listeners[i]();
        }
    }, window), false);
    orientationChangeProxy.addListener(ajustHtmlFontSize);
    window.orientationChangeProxy = orientationChangeProxy;
})();