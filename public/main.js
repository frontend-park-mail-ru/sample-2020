import {RENDER_METHODS} from './constants/constants.js';
import {Profile} from './components/Profile/Profile.js';

const {ajaxGet, ajaxPost} = window.AjaxModule;

console.log('topkek');

const application = document.getElementById('application');

const menuItems = {
	signup: 'Регистрация',
	login: 'Авторизация',
	profile: 'Профиль',
	about: 'О себе',
};

function createInput(type, text, name) {
	const input = document.createElement('input');
	input.type = type;
	input.name = name;
	input.placeholder = text;

	return input;
}

function createMenu() {
	application.innerHTML = '';
	Object.keys(menuItems).forEach(function (key) {
		const menuItem = document.createElement('a');
		menuItem.textContent = menuItems[key];
		menuItem.href = `/${key}`;
		menuItem.dataset.section = key;

		application.appendChild(menuItem);
	});
}

function createSignUp() {
	application.innerHTML = '';
	const form = document.createElement('form');

	const emailInput = createInput('email', 'Емайл', 'email');
	const passwordInput = createInput('password', 'Пароль', 'password');
	const ageInput = createInput('number', 'Возраст', 'age');

	const submitBtn = document.createElement('input');
	submitBtn.type = 'submit';
	submitBtn.value = 'Зарегистрироваться!';

	form.appendChild(emailInput);
	form.appendChild(passwordInput);
	form.appendChild(ageInput);
	form.appendChild(submitBtn);

	form.addEventListener('submit', function(e) {
		e.preventDefault();

		const email = form.elements['email'].value;
		const age = parseInt(form.elements['age'].value);
		const password = form.elements['password'].value;

        ajaxPost({url: '/signup', body: {email, age, password}, callback: (status, responseText) => {
			if (status === 201) {
				createProfile();
				return;
			}

			const {error} = JSON.parse(responseText);
			alert(error);
		}})
	});

	const back = document.createElement('a');
	back.href = '/menu';
	back.textContent = 'Назад';
	back.dataset.section = 'menu';

	application.innerHTML = '';
	application.appendChild(form);
	application.appendChild(back);
}

function createLogin() {
	application.innerHTML = '';
	const form = document.createElement('form');

	const emailInput = createInput('email', 'Емайл', 'email');
	const passwordInput = createInput('password', 'Пароль', 'password');

	const submitBtn = document.createElement('input');
	submitBtn.type = 'submit';
	submitBtn.value = 'Авторизироваться!';

	form.appendChild(emailInput);
	form.appendChild(passwordInput);
	form.appendChild(submitBtn);

	const back = document.createElement('a');
	back.href = '/menu';
	back.textContent = 'Назад';
	back.dataset.section = 'menu';

	form.addEventListener('submit', function(e) {
		e.preventDefault();

		const email = emailInput.value.trim();
		const password = passwordInput.value.trim();

		ajaxPost({
            url: '/login', body: {email, password}, callback: (status, response) =>
        {
            if (status === 200) {
                createProfile();
            } else {
                const {error} = JSON.parse(response);
                alert(error);
            }
        }
    })

	});

	application.appendChild(form);
	application.appendChild(back);
}

function createProfile() {
	application.innerHTML = '';
	ajaxGet({url: '/me', body: null, callback: (status, responseText) => {
		let isMe = false;
		if (status === 200) {
			isMe = true;
		}

		if (status === 401) {
			isMe = false;
		}

		if (isMe) {
			try {
                const responseBody = JSON.parse(responseText);

                application.innerHTML = '';

                const profile = new Profile(application);
                profile.data = responseBody;
                profile.render(RENDER_METHODS.DOM);
            } catch {
                alert('АХТУНГ нет авторизации');
                createMenu();
            }
		} else {
			alert('АХТУНГ нет авторизации');
			createLogin();
		}
	}});
}


const routes = {
	menu: createMenu,
	signup: createSignUp,
	login: createLogin,
	profile: createProfile,
	about: null,
};

application.addEventListener('click', function (evt) {
	const {target} = evt;

	if (target instanceof HTMLAnchorElement) {
		evt.preventDefault();
		routes[target.dataset.section]();
	}
});

createMenu();
