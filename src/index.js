const STATE = require('STATE')
const statedb = STATE(__filename)
const { get } = statedb(() => ({}))

const sheet = new CSSStyleSheet()
const theme = get_theme()
sheet.replaceSync(theme)

let id = 0

module.exports = input_integer

function input_integer (sid, protocol) {
  const name = `input-integer-${id++}`
  let min = 0
  let max = 100

  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })

  const input = document.createElement('input')
  input.type = 'number'
  input.min = min
  input.max = max

  input.onkeyup = (e) => handle_on_keyup(e, input)
  input.onmouseleave = (e) => handle_on_mouseleave_and_blur(e, input)
  input.onblur = (e) => handle_on_mouseleave_and_blur(e, input)

  shadow.append(input)
  shadow.adoptedStyleSheets = [sheet]

  const notify = protocol({ from: name }, listen)

  function listen (message) {
    const { type, data } = message
    if (type === 'update') {
      input.value = data
    }
  }

  load_config()

  return el

  async function load_config () {
    try {
      const { sdb } = await get(sid)
      const config = await sdb.drive.get('0')

      if (config && config.raw) {
        min = config.raw.min
        max = config.raw.max

        input.min = min
        input.max = max
      }
    } catch (error) {
      console.error(error)
    }
  }

  function handle_on_keyup (e, input) {
    const val = Number(e.target.value)
    const current_min = Number(input.min)
    const current_max = Number(input.max)
    const val_len = val.toString().length
    const min_len = current_min.toString().length

    if (val > current_max) {
      input.value = current_max
    } else if (val_len === min_len && val < current_min) {
      input.value = current_min
    }

    notify({ from: name, type: 'update', data: Number(input.value) })
  }

  function handle_on_mouseleave_and_blur (e, input) {
    const val = Number(e.target.value)
    const current_min = Number(input.min)

    if (val < current_min) {
      input.value = ''
    }
  }
}

function get_theme () {
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
