/**
 * <h3>顯示 月初,月底</h3>
 * @returns {string[]} [2023/01/01,2023/01/30]
 */
function setDefaultDateRange() {
    let currentDate = new Date()
    let firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    let lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1)
    return [formatDate(firstDayOfMonth), formatDate(lastDayOfMonth)]
}

/**
 * <h3>顯示 月初,月底</h3>
 * @returns {string[]} [2023/01/01,2023/01/30]
 */
function setDateRange(num) {
    let currentDate = new Date()
    let firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + num, 1)
    let lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1 + num, 1)
    lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1)
    return [formatDate(firstDayOfMonth), formatDate(lastDayOfMonth)]
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
    setDefaultDateRange,
    setDateRange
}