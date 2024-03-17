/**
 * <h3>ForMat日期YYYY-MM-DD HH:mm:ss</h3>
 * @param data 資料
 * @returns {String} 回傳資料前面補零
 * */
function dateConversionYMDhms(data) {
    let date = new Date();
    let formatter = new Intl.DateTimeFormat('tw', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: data,
    });

    return formatter.format(date);
}

/**
 * <h3>ForMat日期YYYY-MM-DD HH:mm:ss</h3>
 * @param data 資料
 * @returns {string[]} 回傳資料前面補零
 * */
function fourSeasonsYMDhms(data) {
    let currentDate = new Date()
    // 年初日期（01月初~03月底）春
    // 年初日期（04月初~06月底）夏
    // 年初日期（07月初~09月底）秋
    // 年初日期（10月初~12月底）冬
    let start = new Date(currentDate.getFullYear(), data[0] - 1, 1)
    let end = new Date(currentDate.getFullYear(), data[1], 1)
    end.setDate(end.getDate() - 1)
    return [formatDate(start), formatDate(end)]
}

/**
 * <h3>format日期的方法</h3>
 * @param date 要format的日期
 * @returns {string} Date() 例:2023-01-01
 */
const formatDate = (date) => {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export {
    dateConversionYMDhms,
    fourSeasonsYMDhms
}