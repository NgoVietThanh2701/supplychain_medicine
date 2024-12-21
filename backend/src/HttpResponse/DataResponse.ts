export const DataResponse = (isError: boolean, message: string, data?: any) => {
   return {
      error: isError,
      message,
      data
   }
}

export class MessageResponse {
   static ERROR_OCCURRED = 'Có lỗi xảy ra, vui lòng thử lại.';
   static APPROVE_ACCOUNT_SUCCESS = 'Thêm người dùng thành công.';
   static NOT_ADMIN = 'Vui lòng đăng nhập với tài khoản admin.';
   static NOT_FARMER = 'Vui lòng đăng nhập với tài khoản farmer.';
   static SUCCESS = 'Thành công.';
   static MISSING_INPUT = 'Thiếu đầu vào.';
   static ACCOUNT_EXISTS = 'Người dùng đã tồn tại.';
   static VERIFY_OTP = 'Vui lòng nhập OTP đã gửi trong email.';
   static ACCOUNT_NO_EXISTS = 'Người dùng không tồn tại.';
   static REGISTER_SUCCESS = 'Đăng ký thành công!.';
   static WRONG_OTP = 'OTP không chính xác.';
   static WRONG_PASSWORD = 'Mật khâu không chính xác.';
   static LOGIN_SUCCESS = 'Đăng nhập thành công.';
   static REVIEWED_ACCOUNT = 'Đăng ký thành công. Tài khoản đang đợi phê duyệt';
   static NO_TOKEN = 'No token provided.';
   static UNAUTHORIZED = 'Unauthorized access.'
}
