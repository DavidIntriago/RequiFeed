
/*export const save = (key, data) => {
  sessionStorage.setItem(key, data);
};*/

export const save = (key, data) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};


export const get = (key) => {
  if (typeof window !== 'undefined') {
    const item = sessionStorage.getItem(key);
    try {
      return JSON.parse(item);
    } catch {
      return item; // Si no era JSON, devuelve el valor plano
    }
  }
  return null;
};




/*export const get = (key) => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null; // o algún valor por defecto
};*/

/*export const get = (key) => {
  if (typeof window !== 'undefined') {
    const value = sessionStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }
  return null;
};*/

{/* 
  export const saveToken = (key) => {
    sessionStorage.setItem("token", key);
  };
  export const getToken = () => {
    return sessionStorage.getItem("token");
  };
  */}
export const borrarSesion = () => {
  sessionStorage.clear();
};

export const estaSesion = () => {
  var token = sessionStorage.getItem("token");
  return token && (token != "undefined" || token != null || token != "null");
};
