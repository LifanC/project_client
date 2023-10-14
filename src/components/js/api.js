/**
 * <h3>REST API get 方法</h3>
 * @param url 放連接API的網址
 * @returns {Promise<any>} 回傳Json值
 */
async function getApi(url) {
    const response = await fetch(url, {
        method: 'GET',
    });
    return await response.json();
}

/**
 * <h3>REST API post 方法</h3>
 * @param url 放連接API的網址
 * @param params 放傳到後端API的物件
 * @returns {Promise<any>} 回傳Json值
 */
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
    getApi, postApi
}
