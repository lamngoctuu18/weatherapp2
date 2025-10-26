# Weather App - Selenium Tests với Báo cáo HTML

## 📋 Mô tả
Automated testing cho Weather App với:
- ✅ Selenium WebDriver 4.x (tự động quản lý driver)
- � Tự động chụp screenshots mỗi bước
- 📊 Báo cáo HTML đẹp mắt với ảnh test
- 🎨 Giao diện hiện đại, responsive
- 💾 Lưu trữ toàn bộ test results

## 🎯 Tính năng

### 📸 Screenshots Tự động
- Chụp ảnh mỗi bước test
- Lưu vào thư mục riêng cho mỗi lần chạy
- Hiển thị trong báo cáo HTML

### 📊 Báo cáo HTML
- Tổng quan kết quả test
- Chi tiết từng bước
- Xem ảnh screenshot trực tiếp
- Thời gian và trạng thái rõ ràng
- Responsive design

### 🔧 Test Cases
1. Khởi động Chrome
2. Truy cập localhost:3000
3. Tìm ô input tìm kiếm
4. Nhập "Hanoi"
5. Thực hiện tìm kiếm
6. Kiểm tra kết quả

## 🚀 Cài đặt

```bash
cd selenium-tests
npm install
```

## 📖 Cách sử dụng

### Bước 1: Chạy Weather App
```bash
# Terminal 1
cd ..
npm start
```

Đợi cho đến khi thấy `Compiled successfully!`

### Bước 2: Chạy Test
```bash
# Terminal 2
cd selenium-tests
npm test
```

### Bước 3: Xem Báo cáo
Sau khi test hoàn tất, báo cáo HTML sẽ tự động được tạo tại:
```
selenium-tests/test-results/test-<timestamp>/test-report.html
```

Mở file này trong trình duyệt để xem:
- 📊 Tổng quan test
- 📸 Screenshots từng bước
- ⏱️  Thời gian chạy
- ✅ Trạng thái chi tiết

## 📁 Cấu trúc Test Results

```
selenium-tests/
├── test-results/
│   ├── test-1234567890/          # Test run 1
│   │   ├── screenshots/
│   │   │   ├── 001-chrome-started.png
│   │   │   ├── 002-page-loaded.png
│   │   │   ├── 003-hanoi-typed.png
│   │   │   └── 004-hanoi-result.png
│   │   └── test-report.html
│   └── test-9876543210/          # Test run 2
│       ├── screenshots/
│       └── test-report.html
```

## 🎨 Báo cáo HTML Features

- **Summary Cards**: Tổng số test, pass, fail, warning
- **Timeline**: Xem chi tiết từng bước test
- **Screenshots Gallery**: Xem tất cả ảnh test
- **Responsive**: Hiển thị đẹp trên mọi thiết bị
- **Modern UI**: Gradient background, smooth animations

## 🔍 Xem Báo cáo Cũ

Tất cả báo cáo được lưu trong `test-results/`. Bạn có thể mở bất kỳ file `test-report.html` nào để xem lại.

```bash
# PowerShell
Invoke-Item test-results\test-<timestamp>\test-report.html

# Hoặc mở trực tiếp trong browser
```

## � Mẫu Báo cáo

Báo cáo bao gồm:

### 1. Header
- Tên test suite
- Thời gian chạy
- Test ID

### 2. Summary
- Total Tests
- Passed (màu xanh)
- Failed (màu đỏ)  
- Warnings (màu vàng)
- Duration

### 3. Test Steps
Mỗi step hiển thị:
- ✅/❌/⚠️  Status icon
- Tên bước
- Chi tiết
- Thời gian
- Screenshot (nếu có)

### 4. Screenshots Gallery
- Tất cả ảnh chụp trong test
- Click để xem full size
- Tên và mô tả rõ ràng

## ⚙️  Tùy chỉnh

### Thêm test steps
Trong `test.js`:
```javascript
reporter.addStep('Tên bước test');
// ... thực hiện test ...
await reporter.takeScreenshot(driver, 'ten-screenshot');
reporter.passStep('Mô tả kết quả');
```

### Thay đổi test
Edit file `test.js` để thêm/sửa test cases

## 🐛 Troubleshooting

### Test không chạy
- Đảm bảo app đang chạy ở localhost:3000
- Kiểm tra Chrome đã cài đặt

### Không thấy báo cáo
- Check thư mục `test-results/`
- Xem console log để biết đường dẫn báo cáo

### Screenshots trống
- Có thể do element chưa load
- Tăng thời gian sleep trước khi chụp

## 📝 Notes

- Mỗi lần chạy test tạo thư mục mới
- Screenshots được lưu dạng PNG
- Báo cáo có thể chia sẻ (chứa ảnh embedded)
- Test tự động đóng browser sau khi hoàn tất

## 🎯 Roadmap

- [ ] Thêm test cho mobile view
- [ ] Export PDF report
- [ ] Email notification
- [ ] CI/CD integration
- [ ] Performance metrics

---

Tạo bởi Selenium WebDriver 4.x + Custom HTML Reporter 🚀

