let URL = process.env.NEXT_PUBLIC_API_URL;
console.log(URL);

export function url_api() {
  return URL;
}

export async function post_api(url, data) {
    try {
    const response = await fetch(`${URL}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log(data);
  const res = await response.json();
  console.log(res);
  return res;

    } catch (error) {
        console.log(error);
    }
}

export async function post_api_image(url, data) {
    try {
    const response = await fetch(`${URL}/${url}`, {
      method: 'POST',
      body: data,
    });
    console.log(data);
    const res = await response.json();
    console.log(res);
    return res;

    } catch (error) {
        console.log(error);
    }
}


export async function get_api(url) {
  try {
    const response = await fetch(`${URL}/${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    console.log(res);
    console.log("URL: ", `${URL}/${url}`);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function get_api_id(url, id) {
  try {
    const response = await fetch(`${URL}/${url}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function patch_api(url, data) {
  try {
    const response = await fetch(`${URL}/${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function delete_api(url) {
  try {
    const response = await fetch(`${URL}/${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}