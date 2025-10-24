module.exports = inputInteger

const sheet = new CSSStyleSheet()
const theme=get_theme()
sheet.replaceSync(theme)

function inputInteger ()
{
    const el= document.createElement('div')
    const shadow = el.attachShadow({mode: 'closed'})
    const input= document.createElement('input')
    input.type='number'
    input.min=0
    input.max=150
    input.onkeyup = (e) => handle_onkeyup(e, input)
    shadow.append(input)
   
    shadow.adoptedStyleSheets = [sheet]
    return el
}

function get_theme()
{
  return `
        :host {
            --b: 9, 0%;
            --color-white: var(--b), 100%;
            --color-black: var(--b), 4%;
            --color-grey: var(--b), 85%;
            --bg-color: var(--color-grey);
            --shadow-xy: 0 8px;
            --shadow-blur: 8px;
            --shadow-color: var(--color-black);
            --shadow-opacity: 0;
            --shadow-opacity-focus: 0.65;
        }

        input {
            text-align: left;
            font-size: 1.4rem;
            font-weight: 200;
            color: hsla(var(--color-black), 1);
            background-color: hsla(var(--bg-color), 1);
            padding: 8px 12px;
            box-shadow: var(--shadow-xy) var(--shadow-blur) hsla(var(--shadow-color), var(--shadow-opacity));
            transition: font-size .3s, color .3s, background-color .3s, box-shadow .3s ease-in-out;
            outline: none;
            border: 1px solid hsla(var(--bg-color), 1);
            border-radius: 8px;
            width: 100px;
        }

        input:focus {
            --shadow-color: var(--color-black);
            --shadow-opacity: var(--shadow-opacity-focus);
            --shadow-xy: 4px 4px;
            box-shadow: var(--shadow-xy) var(--shadow-blur) hsla(var(--shadow-color), var(--shadow-opacity));
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
    `
}

function handle_onkeyup(e, input)
 {
    console.log(e.target.value)
    const val= Number(e.target.value)
    if(val>input.max)input.value=150
    else if (val<input.min) input.value=0
 }