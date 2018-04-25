const request = require('request-promise'),
    tough = require('tough-cookie');


const SSO_URL = 'https://accounts.newscred.com',
    CMP_HOST = 'https://cmp.newscred.com',
    CMP_HOME = `${CMP_HOST}/cloud/home`,
    LOGIN_URL = `${SSO_URL}/login`;

login('ashrafuzzaman@newscred.com', 'qweqwe');

document.querySelector('#login-form').onsubmit = function (e) {
    e.preventDefault();
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;

    login(email, password);
};

function login(email, password) {
    let req = request.defaults({ jar: true });
    return req.get(LOGIN_URL)
        .then(response => {
            let loginDom = new DOMParser().parseFromString(response, "text/html");
            return loginDom.querySelector('input[name=_csrf]').value;
        })
        .then(csrf => {
            return req.post(LOGIN_URL, {
                followRedirect: true,
                form: {
                    email: email,
                    password: password,
                    _csrf: csrf
                }
            }).catch((err) => {
                // TODO: Need to handle invalid login where status != 302
                return req.get(SSO_URL);
            })
        })
        .then(() => {
            return req.get(CMP_HOME)
                .then((response) => {
                    var csrfTokenRegexp = /window\.csrfToken\s=\s"(.+)";/g;
                    var match = csrfTokenRegexp.exec(response);
                    csrfToken = match[1];
                    return csrfToken;
                })
        }).then((csrfToken) => {
            let cmcReq = req.defaults({ json: true, headers: { 'X-CSRF-TOKEN': csrfToken } });
            return cmcReq.get('https://cmp.newscred.com/api/users')
                .then((users) => {
                    console.log('users', users);
                })
        });
}
