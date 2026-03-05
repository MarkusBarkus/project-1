const API_IP = 'http://localhost';
const API_PORT = 9000;

const headers = {
    // https://www.rfc-editor.org/rfc/rfc7231#section-5.3.2
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
    'Accept': '*/*',
    // https://www.rfc-editor.org/rfc/rfc7231#section-3.1.1.5
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
    'Content-Type': 'application/json'
}

const serverRoute = (route) => `${API_IP}:${API_PORT}/${route}`;

const alerts = {
    getSearchData: async () => {
        let response = await fetch(serverRoute("alerts"), {
            headers,
            method: 'GET'
        });
        let data = await response.json();
        return data;
    },
}

const alert = {
    getSearchData: async (country_code) => {
        let response = await fetch(serverRoute("alert/" + country_code), {
            headers,
            method: 'GET'
        });
        let [data] = await response.json();
        return data;
    },
}

const save = {
    setSave: async (country_code) => {
        let response = await fetch(serverRoute("save/" + country_code), {
            headers,
            method: 'post'
        });
        let [data] = await response.json();
        return data;
    },
}

const unsave = {
    setSave: async (country_code) => {
        let response = await fetch(serverRoute("unsave/" + country_code), {
            headers,
            method: 'delete'
        });
        let [data] = await response.json();
        return data;
    },
}

const saves = {
    getSaved: async () => {
        let response = await fetch(serverRoute("saved"), {
            headers,
            method: 'GET'
        });
        let data = await response.json();
        return data;
    },
}

const util = {
    refreshDatabase: async () => {
        let response = await fetch(serverRoute("db/refresh"), {
            headers,
            method: 'POST'
        });
        return response;
    }
}

export {
    util,
    alerts,
    alert,
    save,
    unsave
}