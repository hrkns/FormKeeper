window.onload = () => {
  // Función para hacer splice de un array dentro de otro array. Adaptado de http://stackoverflow.com/a/28162065
  Array.prototype.spliceArray = function (index, n, array) {
    return Array.prototype.splice.apply(this, [index, n].concat(array))
  }

  function FormKeeperAttributable () {
  }

  FormKeeperAttributable._keyStr = function () {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  }

  FormKeeperAttributable.saveValue = function (index, domElValue, identificador) {
    const bjtFormKeeper = window.localStorage.getItem('FormKeeperAttributable') !== null ? JSON.parse(this.decode(window.localStorage.getItem('FormKeeperAttributable'))) : {}

    bjtFormKeeper[identificador] = bjtFormKeeper[identificador] ? bjtFormKeeper[identificador] : []

    bjtFormKeeper[identificador][index] = domElValue

    const readyToSend = this.encode(JSON.stringify(bjtFormKeeper))

    window.localStorage.setItem('FormKeeperAttributable', readyToSend)
  }

  FormKeeperAttributable.saveRadio = function (index, domElValue, identificador, info) {
    const bjtFormKeeper = window.localStorage.getItem('FormKeeperAttributable') !== null ? JSON.parse(this.decode(window.localStorage.getItem('FormKeeperAttributable'))) : {}

    bjtFormKeeper[identificador] = bjtFormKeeper[identificador] ? bjtFormKeeper[identificador] : []

    bjtFormKeeper[identificador][index] = bjtFormKeeper[identificador][index] ? bjtFormKeeper[identificador][index] : []

    for (let i = 0; i < info[0]; i++) {
      bjtFormKeeper[identificador][index][i] = false
    }

    bjtFormKeeper[identificador][index][info[1]] = domElValue

    const readyToSend = this.encode(JSON.stringify(bjtFormKeeper))

    window.localStorage.setItem('FormKeeperAttributable', readyToSend)
  }

  FormKeeperAttributable.restaurar = function (cb) {
    const promesa = new Promise((resolve, reject) => {
      const bjtFormKeeper = window.localStorage.getItem('FormKeeperAttributable') !== null ? JSON.parse(this.decode(window.localStorage.getItem('FormKeeperAttributable'))) : null

      if (bjtFormKeeper === null) reject('No hay elementos que restaurar en este momento.')

      for (let i = 0; i < fk.domEls.length; i++) {
        const thisDomEl = fk.domEls[i]
        if (thisDomEl instanceof Array && bjtFormKeeper[fk.identificador][i] !== undefined && bjtFormKeeper[fk.identificador][i] !== null) {
          for (let j = 0; j < thisDomEl.length; j++) {
            if (bjtFormKeeper[fk.identificador][i][j] === true) {
              thisDomEl[j].checked = true
            }
          }
        } else if (thisDomEl.type === 'checkbox') {
          thisDomEl.checked = bjtFormKeeper[fk.identificador][i] ? bjtFormKeeper[fk.identificador][i] : false
        } else {
          thisDomEl.value = bjtFormKeeper[fk.identificador][i] ? bjtFormKeeper[fk.identificador][i] : ''
        }
      }
      resolve(fk.restaurarCallback)
    })

    promesa.then((callback) => {
      if (cb !== undefined && this.isFunction(cb)) cb.call()
      if (cb === undefined) callback.call()
    }, (error) => {
      console.warn(error)
    })
  }

  FormKeeperAttributable.limpiar = function (cb, ask) {
    const cnfrm = typeof ask === 'string' ? window.confirm(ask) : ask === 'true' || ask !== undefined ? window.confirm('¿Desea eliminar toda la información guardada por FormKeeper?') : true

    const promesa = new Promise((resolve, reject) => {
      if (cnfrm) {
        window.localStorage.removeItem('FormKeeperAttributable')
        resolve(fk.restaurarCallback)
      } else {
        reject('Los datos siguen a salvo.')
      }
    })

    promesa.then((callback) => {
      if (cb !== undefined && this.isFunction(cb)) cb.call()
      if (cb === undefined) callback.call()
    }, (cancelado) => {
      console.log(cancelado)
    })
  }

  FormKeeperAttributable.encode = function (e) {
    let t = ''
    let n, r, i, s, o, u, a
    let f = 0
    e = this.utf8Encode(e)
    while (f < e.length) {
      n = e.charCodeAt(f++)
      r = e.charCodeAt(f++)
      i = e.charCodeAt(f++)
      s = n >> 2
      o = (n & 3) << 4 | r >> 4
      u = (r & 15) << 2 | i >> 6
      a = i & 63
      if (isNaN(r)) {
        u = a = 64
      } else if (isNaN(i)) {
        a = 64
      }
      t = t + this._keyStr().charAt(s) + this._keyStr().charAt(o) + this._keyStr().charAt(u) + this._keyStr().charAt(a)
    }
    return t
  }

  FormKeeperAttributable.decode = function (e) {
    let t = ''
    let n, r, i
    let s, o, u, a
    let f = 0
    e = e.replace(/[^A-Za-z0-9+/=]/g, '')
    while (f < e.length) {
      s = this._keyStr().indexOf(e.charAt(f++))
      o = this._keyStr().indexOf(e.charAt(f++))
      u = this._keyStr().indexOf(e.charAt(f++))
      a = this._keyStr().indexOf(e.charAt(f++))
      n = s << 2 | o >> 4
      r = (o & 15) << 4 | u >> 2
      i = (u & 3) << 6 | a
      t = t + String.fromCharCode(n)
      if (u !== 64) t = t + String.fromCharCode(r)
      if (a !== 64) t = t + String.fromCharCode(i)
    }
    t = this.utf8Decode(t)
    return t
  }

  FormKeeperAttributable.utf8Encode = function (e) {
    e = e.replace(/rn/g, 'n')
    let t = ''
    for (let n = 0; n < e.length; n++) {
      var r = e.charCodeAt(n)
      if (r < 128) {
        t += String.fromCharCode(r)
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode(r >> 6 | 192)
        t += String.fromCharCode(r & 63 | 128)
      } else {
        t += String.fromCharCode(r >> 12 | 224)
        t += String.fromCharCode(r >> 6 & 63 | 128)
        t += String.fromCharCode(r & 63 | 128)
      }
    }
    return t
  }

  FormKeeperAttributable.utf8Decode = function (e) {
    let t = ''
    let n = 0
    let r = 0
    let c2 = 0
    while (n < e.length) {
      r = e.charCodeAt(n)
      if (r < 128) {
        t += String.fromCharCode(r)
        n++
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1)
        t += String.fromCharCode((r & 31) << 6 | c2 & 63)
        n += 2
      } else {
        c2 = e.charCodeAt(n + 1)
        let c3 = e.charCodeAt(n + 2)
        t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63)
        n += 3
      }
    }
    return t
  }

  FormKeeperAttributable.getPathTo = function (element) {
    if (element.id !== '') return `id("${element.id}")`
    if (element === document.body) return element.tagName

    let ix = 0
    let siblings = element.parentNode.childNodes
    for (let i = 0; i < siblings.length; i++) {
      var sibling = siblings[i]
      if (sibling === element) return `${this.getPathTo(element.parentNode)}/${element.tagName}[${ix + 1}]`
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++
    }
  }

  FormKeeperAttributable.isFunction = function (functionToCheck) {
    const getType = {}
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]'
  }

  const fk = {
    domEls: [],
    ignorarTipos: [
      'submit',
      'reset',
      'button',
      'file',
      'image'
    ],
    elementos: [
      'INPUT',
      'SELECT',
      'TEXTAREA',
      'DATALIST'
    ],
    restaurarCallback: () => {
      console.log('Elementos restaurados con éxito.')
    },
    limpiarCallback: () => {
      console.log('FormKeeper limpiado con éxito.')
    }
  }

  for (let i = 0; i < document.getElementsByTagName('*').length; i++) {
    if (document.getElementsByTagName('*')[i].getAttribute('FormKeeper') !== null) {
      fk.domEls.push(document.getElementsByTagName('*')[i])
    }
  }

  if (fk.domEls.length === 0) return console.warn('No hay ningún elemento con el atributo "FormKeeper", tan solo añada dicho atributo al elemento o elementos con los que desea trabajar. Ejemplo: <input id="miInput" name="miInput" FormKeeper>. O bien, puede leer la documentación en https://github.com/EdGraVill/FormKeeper/tree/master/Attributable')

  for (let i = 0; i < fk.domEls.length; i++) {
    if (fk.domEls[i].childNodes.length !== 0) {
      const hijos = fk.domEls[i].childNodes
      const procesados = []

      for (let i = 0; i < hijos.length; i++) {
        if (fk.elementos.indexOf(hijos[i].tagName) >= 0 && fk.ignorarTipos.indexOf(hijos[i].type) === -1) {
          procesados.push(hijos[i])
        }
      }

      fk.domEls.spliceArray(i, 1, procesados)
    }
  }

  // Agregar el identificador único con el que evitaremos repetir o ingresar datos en el lugar que no corresponden.
  fk.identificador = FormKeeperAttributable.encode(`${window.location.href} - ${FormKeeperAttributable.getPathTo(fk.domEls[0])}`)

  const objRds = {}
  for (let i = 0; i < fk.domEls.length; i++) {
    const thisDomEl = fk.domEls[i]
    if (thisDomEl.type === 'radio') {
      if (!objRds[thisDomEl.name]) objRds[thisDomEl.name] = []
      objRds[thisDomEl.name].push(thisDomEl)
    }
  }

  for (let i = 0; i < fk.domEls.length; i++) {
    const thisDomEl = fk.domEls[i]
    if (thisDomEl.type === 'radio') {
      const thsNm = thisDomEl.name
      fk.domEls[i] = objRds[thsNm]
      fk.domEls.splice(i + 1, objRds[thsNm].length - 1)
    }
  }

  for (let i = 0; i < fk.domEls.length; i++) {
    const thisDomEl = fk.domEls[i]
    if (thisDomEl.tagName === 'INPUT' || thisDomEl.tagName === 'TEXTAREA') {
      if (thisDomEl.type === 'checkbox') {
        thisDomEl.setAttribute('onchange', `FormKeeperAttributable.saveValue(${i}, this.checked, '${fk.identificador}', ${fk.encriptado})`)
      } else if (thisDomEl.type === 'range' || thisDomEl.type === 'color') {
        thisDomEl.setAttribute('onchange', `FormKeeperAttributable.saveValue(${i}, this.value, '${fk.identificador}', ${fk.encriptado})`)
      } else if (thisDomEl.type === 'text' || thisDomEl.type === 'password' || thisDomEl.type === 'email' || thisDomEl.type === 'search' || thisDomEl.type === 'url' || thisDomEl.tagName === 'TEXTAREA') {
        thisDomEl.setAttribute('onkeyup', `FormKeeperAttributable.saveValue(${i}, this.value, '${fk.identificador}', ${fk.encriptado})`)
      } else {
        thisDomEl.setAttribute('onkeyup', `FormKeeperAttributable.saveValue(${i}, this.value, '${fk.identificador}', ${fk.encriptado})`)
        thisDomEl.setAttribute('onchange', `FormKeeperAttributable.saveValue(${i}, this.value, '${fk.identificador}', ${fk.encriptado})`)
      }
    } else if (thisDomEl instanceof Array) {
      for (let j = 0; j < thisDomEl.length; j++) {
        thisDomEl[j].setAttribute('onchange', `FormKeeperAttributable.saveRadio(${i}, this.checked, '${fk.identificador}', ${fk.encriptado}, [${thisDomEl.length},${j}])`)
      }
    } else {
      thisDomEl.setAttribute('onchange', `FormKeeperAttributable.saveValue(${i}, this.value, '${fk.identificador}', ${fk.encriptado})`)
    }
  }
}
