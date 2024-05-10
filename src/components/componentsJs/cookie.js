/**
 * <h3>清除cookie的方法</h3>
 */
function clearCookie() {
    document.cookie = "f_name_number=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/**
 * <h3>新增cookie的方法</h3>
 * @param f_name 新增cookie的值
 * @param number 新增cookie的值
 * @param permissions_value 新增cookie的值
 */
function addCookie(f_name,number,permissions_value) {
    document.cookie = `f_name_number=${f_name}${number}${permissions_value}`
}

/**
 * <h3>找到cookie的方法</h3>
 * @returns {string} cookie存userName的值
 */
function toFindCookie(){
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "f_name_number") {
            return value
        }
    }
}

export {
    clearCookie, addCookie, toFindCookie
}