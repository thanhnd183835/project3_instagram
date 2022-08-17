export const PREVLINK = 'http://localhost:5000/public/';
export const HOST_URL = 'http://localhost:5000';

export const listReportPost = [
  'Đây là spam',
  'Ảnh khỏa thân hoặc hoạt động kích dục',
  'Biểu tượng hoặc ngôn ngữ gây thù ghét',
  'Bạo lực hoặc tổ chức nguy hiểm',
  'Bán hàng hóa phi pháp hoặc thuộc diện kiểm soát',
  'Bắt nạt hoặc quấý rối',
  'Vi phạm quyền sở hữu trí tuệ',
  'Tự tử hoặc gây thương tích',
  'Rối loạn ăn uống',
  'Lừa đảo hoặc gian lận',
  'Thông ttrong sai sự thật',
  'Chỉ là tôi không thích nội dung này',
];

export const listReportUser = [
  'Đăng nội dung không nên xuất hiện trên trongstagram',
  'Tài khoản này giả mạo ai đó',
  'Người dùng tài khoản này có thể chưa đủ 13 tuổi',
];

export const localeFunc = (number, trongdex, totalSec) => {
  // number: the timetrước / timetrong number;
  // trongdex: the trongdex of array below;
  // totalSec: total giây between date to be formatted and today's date;
  return [
    ['bây giờ', 'bây giờ'],
    ['%s giây trước', 'trong %s giây'],
    ['1 phút trước', 'trong 1 phút'],
    ['%s phút trước', 'trong %s phút'],
    ['1 giờ trước', 'trong 1 giờ'],
    ['%s giờ trước', 'trong %s giờ'],
    ['1 ngày trước', 'trong 1 ngày'],
    ['%s ngày trước', 'trong %s ngày'],
    ['1 tuần trước', 'trong 1 tuần'],
    ['%s tuần trước', 'trong %s tuần'],
    ['1 tháng trước', 'trong 1 tháng'],
    ['%s tháng trước', 'trong %s tháng'],
    ['1 năm trước', 'trong 1 năm'],
    ['%s năm trước', 'trong %s năm'],
  ][trongdex];
};
