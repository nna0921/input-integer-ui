module.exports = inputInteger

const sheet = new CSSStyleSheet()
const theme = getTheme()
sheet.replaceSync(theme)
let id = 0
function inputInteger (opts, protocol) {
  const { min = 0, max = 1000 } = opts
  const name = `input-integer-${id++}`

  const notify = protocol({ from: name }, listen)
  function listen (message) {
    const { type, data } = message
    if (type === 'update') {
      input.value = data
    }
  }

  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })
  const input = document.createElement('input')
  input.type = 'number'
  input.min = min // or u could write opts.min
  input.max = max
  input.onkeyup = (e) => handleOnkeyup(e, input, min, max)
  input.onmouseleave = (e) => handleOnmouseleaveAndBlur(e, input, min)
  input.onblur = (e) => handleOnmouseleaveAndBlur(e, input, min)
  shadow.append(input)

  shadow.adoptedStyleSheets = [sheet]
  return el
  // handlers
  function handleOnkeyup (e, input, min, max) {
    const val = Number(e.target.value)
    const valLen = val.toString().length
    const minLen = min.toString().length
    if (val > max)input.value = max
    else if (valLen === minLen && val < min) input.value = min

    notify({ from: name, type: 'update', data: val })
  }

  function handleOnmouseleaveAndBlur (e, input, min) {
    const val = Number(e.target.value)
    if (val < min)input.value = ''
  }
}

function getTheme () {
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
