/**
 * <h3>清除cookie的方法</h3>
 */
function clearCookie() {
    document.cookie = "account_password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/**
 * <h3>新增cookie的方法</h3>
 * @param account 新增cookie的值
 * @param password 新增cookie的值
 */
function addCookie(account,password) {
    document.cookie = `account_password=${account}|${password}`
}

/**
 * <h3>找到cookie的方法</h3>
 * @returns {string} cookie存userName的值
 */
function toFindCookie(){
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "account_password") {
            return value
        }
    }
}

export {
    clearCookie, addCookie, toFindCookie
}