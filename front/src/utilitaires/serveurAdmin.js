const PATH = "https://bozlak.ddns.net/api/admin";

async function queryAdmin(route, data, type) {
    let response = null;

    if (type === "GET") {
        response = await fetch(`${PATH}/${route}`);
    } else {
        response = await fetch(`${PATH}/${route}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

    if (response.status === 500)
        return Promise.reject(await response.json());

    return await response.json();
}

export {
    queryAdmin
}