
export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const getTimePost = (date) => {
    const postDate = new Date(date);
    const today = new Date();
    const years = today.getFullYear() - postDate.getFullYear();
    const months = today.getMonth() - postDate.getMonth();
    const dates = today.getDate() - postDate.getDate();
    const hours = today.getHours() - postDate.getHours();
    const minutes = today.getMinutes - postDate.getMinutes();
    const seconds = today.getSeconds() - postDate.getSeconds();
    if (years > 0) return years + ' năm';
    if (months > 0) return months + ' tháng';
    if (Math.floor(dates / 7) > 0) return Math.floor(dates / 7) + ' tuần';
    if (dates > 0) return dates + ' ngày';
    if (hours > 0) return hours + ' giờ';
    if (minutes > 0) return minutes + ' phút';
    return seconds + ' giây';
};
