/**
 * <h3>清除cookie的方法</h3>
 */
function clearCookie() {
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/**
 * <h3>新增cookie的方法</h3>
 * @param result 新增cookie的值
 */
function addCookie(result) {
    document.cookie = `userName=${result}`
}

/**
 * <h3>找到cookie的方法</h3>
 * @returns {string} cookie存userName的值
 */
function toFindCookie(){
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "userName") {
            return value
        }
    }
}

export {
    clearCookie, addCookie, toFindCookie
}


