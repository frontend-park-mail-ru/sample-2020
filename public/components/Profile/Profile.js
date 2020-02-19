import {RENDER_METHODS} from '../../constants/constants.js';

export class Profile {
    #parent;
    #data;

    constructor(parent = document.body) {
        this.#parent = parent;
    }

    get data() {
        return this.#data;
    }

    set data(data) {
        this.#data = data;
    }

    get profileText() {
        return `Мне ${this.data?.age ?? '-'} лет и я крутой на ${this.data?.score ?? '–'} очков!!!`
    }

    #renderDOMApi = () => {
        console.log('render DOM');
        const span = document.createElement('span');
        span.textContent = this.profileText;
        this.#parent.appendChild(span);
    };

    #renderString = () => {
        console.log('render string');
        this.#parent.innerHTML = `
			<span class="ProfileSpan">
			  ${this.profileText}
			</span>
		`;
    };

    render(method = RENDER_METHODS.DOM) {
        switch (method) {
            case RENDER_METHODS.STRING:
                this.#renderString();
                break;
            case RENDER_METHODS.DOM:
            default:
                this.#renderDOMApi();
                break;
        }
    }
}
