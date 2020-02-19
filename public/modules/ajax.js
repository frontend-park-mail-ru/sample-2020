(function () {
    const noop = () => void 0;

    class AjaxModule {
        // #ajax;

        ajaxGet = ({
                    url = '/',
                    body = null,
                    callback = noop,
                } = {}) => {
            this._ajax({method: 'GET', url, body, callback});
        };

        ajaxPost = ({
                     url = '/',
                     body = null,
                     callback = noop,
                 } = {}) => {
            this._ajax({method: 'POST', url, body, callback});
        };

        _ajax = ({
                 method = 'GET',
                 url = '/',
                 body = null,
                 callback = noop,
             } = {}) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.withCredentials = true;

            xhr.addEventListener('readystatechange', function() {
                if (xhr.readyState !== 4) return;

                callback(xhr.status, xhr.responseText);
            });

            if (body) {
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
                xhr.send(JSON.stringify(body));
                return;
            }

            xhr.send();

        }
    }

    globalThis.AjaxModule = new AjaxModule();
})();

