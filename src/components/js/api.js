async function getApi(url) {
    const response = await fetch(url, {
        method: 'GET',
    });
    return await response.json();
}

export {
    getApi
}

async function postApi(url, params) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: params
        })
    });
    return await response.json();
}

export {
    postApi
}
