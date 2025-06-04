# Weather App

## Giới thiệu

Weather App là một ứng dụng web dự báo thời tiết hiện đại, sử dụng ReactJS, Axios và hiệu ứng động Lottie để mang lại trải nghiệm trực quan, sinh động cho người dùng. Ứng dụng hỗ trợ tìm kiếm thời tiết theo thành phố, hiển thị dự báo theo giờ, theo ngày, lịch sử tìm kiếm, hiệu ứng nền động theo điều kiện thời tiết và responsive trên mọi thiết bị.

## Phân tích & Tính năng nổi bật

- **Tìm kiếm thời tiết theo tên thành phố** (có hỗ trợ tiếng Việt).
- **Lấy vị trí hiện tại** bằng GPS để xem nhanh thời tiết nơi bạn đang đứng.
- **Tìm kiếm bằng giọng nói** (Speech Recognition, Chrome).
- **Hiển thị dự báo chi tiết**: nhiệt độ, cảm nhận, độ ẩm, gió, áp suất, mây, mưa, UV, tầm nhìn, giờ mặt trời lặn.
- **Dự báo 24h tiếp theo** và **dự báo 5 ngày tới**.
- **Lưu lịch sử tìm kiếm** (localStorage), truy cập nhanh các thành phố đã xem.
- **Hiệu ứng động Lottie**: nền động theo thời tiết (nắng, mưa, mây, sấm chớp, tuyết, sương mù...).
- **Gradient nền động, mịn** và tự động đổi màu theo điều kiện thời tiết.
- **Responsive**: giao diện tối ưu cho PC, laptop, tablet, điện thoại.
- **Thiết kế UI hiện đại**: bo góc, bóng đổ, màu sắc hài hòa, thanh cuộn đẹp.

## Cấu trúc thư mục

```
src/
  components/
    WeatherCard.js
    WeatherBackground.jsx
  hooks/
    useUVI.js
  utils/
    getWeatherIcon.js
  assets/
    lottie/
      ... (các file animation .json)
  App.js
  App.css
  index.js
  index.css
```

## Hướng dẫn sử dụng

### 1. Cài đặt

```bash
cd weather-app
npm install
```

### 2. Chạy ứng dụng

```bash
npm start
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000).

### 3. Tùy chỉnh API Key

- Mặc định đã có API Key mẫu cho OpenWeatherMap.
- Để dùng API Key riêng, sửa biến `API_KEY` trong các file:
  - `src/App.js`
  - `src/hooks/useUVI.js`

### 4. Thêm hiệu ứng động mới

- Thêm file animation `.json` vào `src/assets/lottie/`.
- Map tên animation vào `WeatherBackground.jsx` và `WeatherCard.js` nếu muốn dùng cho nền hoặc icon động.

### 5. Responsive

- Giao diện tự động co giãn phù hợp mọi màn hình.
- Có thể chỉnh sửa thêm trong `App.css` nếu muốn cá nhân hóa giao diện.

## Công nghệ sử dụng

- ReactJS (Hooks)
- Axios (gọi API)
- Lottie-react (hiệu ứng động)
- CSS3 (responsive, gradient, animation)
- OpenWeatherMap API

## Đóng góp & phát triển

- Fork repo, tạo branch mới, gửi pull request.
- Đóng góp thêm hiệu ứng, tối ưu UI/UX, bổ sung tính năng mới.

---

**Tác giả:**  
Weather App - ReactJS Demo  
2024
