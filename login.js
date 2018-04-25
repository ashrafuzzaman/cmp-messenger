const request = require('request-promise'),
    tough = require('tough-cookie');


const LOGIN_URL = 'https://accounts.newscred.com/login';

login('ashrafuzzaman@newscred.com', 'qweqwe');

document.querySelector('#login-form').onsubmit = function (e) {
    e.preventDefault();
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;

    login(email, password);
};


function login(email, password) {
    let req = request.defaults({ jar: true });
    req.get(LOGIN_URL)
        .then(response => {
            let loginDom = new DOMParser().parseFromString(response, "text/html");
            return loginDom.querySelector('input[name=_csrf]').value;
        })
        .then(csrf => {
            return req.post(LOGIN_URL, {
                form: {
                    email: email,
                    password: password,
                    _csrf: csrf
                }
            }).catch((err) => {
                console.log('err', err);
                return null;
            })
        })
        .then(() => {
            req.get('https://cmp.newscred.com/api/users', { json: true })
                .then((users) => {
                    console.log('users', users);
                })
        });
}