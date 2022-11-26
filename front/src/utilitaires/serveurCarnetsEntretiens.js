// const PATH = "https://bozlak.ddns.net/api/carnetsEntretiens";
const PATH = process.env.REACT_APP_BASE_URL + "/api/carnetsEntretiens";

async function queryCarnetsEntretiens(route) {
    const response = await fetch(`${PATH}/${route}`);

    if (response.status === 500)
        return Promise.reject(await response.json());

    return await response.json();
}

export {
    queryCarnetsEntretiens,
}