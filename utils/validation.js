export function requiredValidation(value) {
  const failStatus = {
    status: 'Fail',
    message: "Обов'язкове поле"
  };
  if(value) {
    let v = value.trim();
    if(!v) {
      return failStatus;
    } else {
      return { status: 'OK' };
    }
  }
  return failStatus;
}

export function emailValidation(value) {
    if(!value) return true;
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!re.test(value)){
        return {
            status: "Fail",
            message: "Це не схоже на електронну пошту"
        }
    }
    return { status: "OK" };
}

export function onlyNumbersValidation(value) {
    if(!value) return true;
    const isValid = /^\d+$/.test(value);
    if(isValid) {
        return { status: 'OK' }
    } else {
        return {
            status: 'Fail',
            message: 'Введiть тiльки цифри'
        }
    }
}

export function phoneNumberValidation(value) {
    if(!value) return true;
    const isValid = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value);
    if(isValid) {
        return { status: 'OK' }
    } else {
        return {
            status: 'Fail',
            message: 'Не схоже на номер телефону'
        }
    }
}


export function urlValidation(value) {
    if(!value) return true;
    const pattern = new RegExp( '(http|ftp|https)://[\\w-]+(\\.[\\w-]+)+([\\w-.,@?^=%&:/~+#-]*[\\w@?^=%&;/~+#-])?' );
    if (!value.startsWith("http")) {
        value = 'http://' + value
    }
    const isValid = pattern.test(value);
    if(isValid) {
        return { status: 'OK' }
    } else {
        return {
            status: 'Fail',
            message: gettext('Введіть коректний URL.')
        }
    }
}
