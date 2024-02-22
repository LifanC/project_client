/**
 * <h3>轉字串,前面補零</h3>
 * @param data 資料
 * @param count 補多少零
 * @returns {String} 回傳資料前面補零
 * */
function zeroPadding(data, count) {
    return String(data).padStart(count, '0')
}

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

export {
    zeroPadding,
    dateConversionYMDhms
}