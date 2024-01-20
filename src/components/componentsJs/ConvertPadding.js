/**
 * <h3>轉字串,前面補零</h3>
 * @param data 資料
 * @param count 補多少零
 * @returns {String} 回傳資料前面補零
 * */
function zeroPadding(data, count) {
    return String(data).padStart(count, '0')
}

export {
    zeroPadding
}