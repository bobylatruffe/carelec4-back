// const PATH = "https://bozlak.ddns.net/api/bdd";
const PATH = process.env.REACT_APP_BASE_URL + "/api/bdd"

async function queryBdd(route, data) {
    console.log(PATH + "/" + route);
    const response = await fetch(`${PATH}/${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (response.status === 500)
        return Promise.reject(await response.json());

    return await response.json();
}

export {
    queryBdd,
}