/* Generate "CHƯƠNG 5. CÔNG CỤ KIỂM THỬ – Selenium" as a Word document */
const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
} = require('docx');

const root = path.resolve(__dirname);
const testsDir = path.join(root, 'selenium-tests');
const resultsDir = path.join(testsDir, 'test-results');
const outDir = path.join(root, 'docs');
const outFile = path.join(outDir, 'CHUONG-5-Cong-cu-kiem-thu-Selenium.docx');

function H1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 240 },
  });
}
function H2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
  });
}
function P(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Calibri', size: 24, ...opts })],
    spacing: { after: 120 },
  });
}
function Bullet(text) {
  return new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 60 },
  });
}
function Code(lines) {
  const paragraphs = [];
  const border = {
    top: { color: 'DDDDDD', size: 6 },
    bottom: { color: 'DDDDDD', size: 6 },
    left: { color: 'DDDDDD', size: 6 },
    right: { color: 'DDDDDD', size: 6 },
  };
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: ' ', size: 1 })],
      border,
      spacing: { before: 120, after: 0 },
    })
  );
  lines.split('\n').forEach((l, i, arr) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: l.replace(/\t/g, '    '),
            font: 'Consolas',
            size: 22,
          }),
        ],
        border: { left: border.left, right: border.right },
        spacing: { before: 0, after: 0 },
      })
    );
  });
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: ' ', size: 1 })],
      border,
      spacing: { before: 0, after: 120 },
    })
  );
  return paragraphs;
}

function findLatestScreenshots(dir) {
  try {
    const runs = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.startsWith('test-'))
      .map((d) => ({ name: d.name, full: path.join(dir, d.name) }))
      .sort((a, b) => (a.name < b.name ? 1 : -1));
    if (!runs.length) return [];
    const latest = runs[0].full;
    const shotsDir = path.join(latest, 'screenshots');
    if (!fs.existsSync(shotsDir)) return [];
    const imgs = fs
      .readdirSync(shotsDir)
      .filter((f) => /\.(png|jpg|jpeg)$/i.test(f))
      .slice(0, 6) // nhúng tối đa 6 ảnh để tài liệu gọn
      .map((f) => path.join(shotsDir, f));
    return imgs;
  } catch {
    return [];
  }
}

async function main() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const body = [];

  // Title
  body.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'CHƯƠNG 5. CÔNG CỤ KIỂM THỬ',
          bold: true,
          size: 40,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );
  body.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Công cụ: Selenium',
          italics: true,
          size: 28,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    })
  );

  // 5.1
  body.push(H1('5.1. Tìm hiểu về công cụ Selenium'));
  body.push(
    P(
      'Selenium là bộ công cụ tự động hóa kiểm thử cho ứng dụng web, cho phép mô phỏng thao tác của người dùng trên trình duyệt (Chrome, Edge, Firefox, Safari) và hỗ trợ nhiều ngôn ngữ lập trình (JavaScript/Node.js, Java, Python, C#, v.v.).'
    )
  );

  body.push(H2('5.1.1. Thành phần của Selenium'));
  body.push(Bullet('Selenium IDE: Tiện ích ghi–phát lại test nhanh trong trình duyệt.'));
  body.push(Bullet('Selenium WebDriver: Thư viện điều khiển trình duyệt ở mức giao thức W3C WebDriver.'));
  body.push(Bullet('Selenium Grid: Chạy test song song trên nhiều máy/nhiều trình duyệt.'));
  body.push(
    P(
      'Trong dự án này sử dụng Selenium WebDriver (Node.js) kết hợp HTML reporter tùy chỉnh để ghi lại toàn bộ quá trình test kèm ảnh chụp màn hình.'
    )
  );

  body.push(H2('5.1.2. Kiến trúc và dòng chảy lệnh'));
  body.push(
    P(
      'Test script (client bindings) gửi lệnh tới Browser Driver (ChromeDriver, GeckoDriver) theo chuẩn W3C WebDriver. Driver chuyển lệnh cho trình duyệt thực thi và trả kết quả ngược lại. Cách tiếp cận này giúp viết test độc lập với trình duyệt.'
    )
  );

  body.push(H2('5.1.3. Ưu điểm và hạn chế'));
  body.push(Bullet('Ưu điểm: mã nguồn mở; đa nền tảng; đa ngôn ngữ; có thể tích hợp CI/CD; hệ sinh thái phong phú.'));
  body.push(Bullet('Hạn chế: cần quản lý đồng bộ/đợi (wait); nhạy với thay đổi giao diện; cài đặt môi trường trình duyệt.'));
  body.push(Bullet('Khuyến nghị: ưu tiên selector ổn định (data-testid), sử dụng WebDriverWait/ExpectedConditions.'));

  // 5.2
  body.push(H1('5.2. Sử dụng công cụ Selenium cho dự án Weather App'));
  body.push(H2('5.2.1. Yêu cầu môi trường'));
  body.push(Bullet('Node.js 18+ và npm.'));
  body.push(Bullet('Google Chrome (Selenium Manager sẽ tự quản lý driver).'));
  body.push(Bullet('Thư mục kiểm thử: selenium-tests/ (đã có sẵn trong dự án).'));

  body.push(H2('5.2.2. Cấu trúc thư mục kiểm thử'));
  body.push(
    Code(
      `selenium-tests/
  ├─ package.json
  ├─ test.js
  ├─ test-reporter.js
  └─ test-results/
      └─ test-<timestamp>/
         ├─ test-report.html
         └─ screenshots/`
    )
  );

  body.push(H2('5.2.3. Cài đặt và chạy test'));
  body.push(Bullet('Chạy ứng dụng: npm start (ở cửa sổ Terminal 1).'));
  body.push(Bullet('Chạy test: cd selenium-tests && npm test (ở Terminal 2, sau khi app đã “Compiled successfully”).'));
  body.push(Bullet('Kết quả test và ảnh chụp được lưu tại thư mục selenium-tests/test-results/.'));

  body.push(H2('5.2.4. Kịch bản kiểm thử chức năng'));
  body.push(
    P(
      'Kịch bản chính: mở trang http://localhost:3000, tìm ô nhập, nhập “Hanoi”, kích hoạt tìm kiếm, đợi kết quả, chụp ảnh từng bước, lưu báo cáo HTML.'
    )
  );
  // trích code từ selenium-tests/test.js nếu có
  let testJsSnippet = '';
  try {
    const testJsPath = path.join(testsDir, 'test.js');
    testJsSnippet = fs.readFileSync(testJsPath, 'utf8');
  } catch {
    testJsSnippet = `// test.js (rút gọn)
const { Builder, By, Key, until } = require('selenium-webdriver');
const TestReporter = require('./test-reporter');
// ... khởi tạo reporter, mở Chrome, truy cập localhost:3000,
// nhập "Hanoi", thực hiện tìm kiếm, chụp ảnh, lưu báo cáo ...`;
  }
  body.push(...Code(testJsSnippet));

  body.push(H2('5.2.5. Báo cáo và thu thập ảnh kiểm thử'));
  body.push(Bullet('Reporter tạo thư mục test-results/test-<timestamp>/screenshots/ chứa ảnh từng bước.'));
  body.push(Bullet('File test-report.html hiển thị toàn bộ quy trình, trạng thái pass/fail, thời gian thực thi.'));
  body.push(Bullet('Có thể lưu trữ nhiều lần chạy để so sánh hồi quy UI theo thời gian.'));

  body.push(H2('5.2.6. Thực hành tốt (Best Practices)'));
  body.push(Bullet('Ưu tiên selector ổn định (data-testid / aria-label).'));
  body.push(Bullet('Bọc thao tác chờ bằng WebDriverWait/ExpectedConditions.'));
  body.push(Bullet('Tách Page Object để tái sử dụng; gom dữ liệu test vào fixtures.'));
  body.push(Bullet('Chạy song song và trong CI (GitHub Actions / Jenkins).'));

  body.push(H2('5.2.7. Khắc phục lỗi phổ biến'));
  body.push(Bullet('App chưa sẵn sàng: đợi “Compiled successfully” trước khi chạy test.'));
  body.push(Bullet('Driver–browser mismatch: dùng Selenium Manager, không cần cài chromedriver thủ công.'));
  body.push(Bullet('Timeout/NoSuchElement: tăng timeout và kiểm tra selector.'));

  // Bảng tham chiếu lệnh
  body.push(H2('5.2.8. Lệnh thường dùng'));
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [P('Lệnh')], width: { size: 33, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [P('Mô tả')], width: { size: 67, type: WidthType.PERCENTAGE } }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [P('driver.get(url)')] }),
          new TableCell({ children: [P('Mở URL ứng dụng để kiểm thử.')] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [P('driver.findElement(By.css())')] }),
          new TableCell({ children: [P('Tìm phần tử theo CSS selector.')] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [P('driver.wait(until.elementLocated())')] }),
          new TableCell({ children: [P('Đợi phần tử xuất hiện trước khi thao tác.')] }),
        ],
      }),
    ],
  });
  body.push(table);

  body.push(H2('5.2.9. Hình ảnh minh họa'));
  body.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '[Gợi ý hình ảnh nên thêm vào phần này:]',
          bold: true,
          size: 24,
          color: '0066CC'
        })
      ],
      spacing: { before: 200, after: 120 },
    })
  );
  
  body.push(Bullet('Hình 5.1: Kiến trúc Selenium WebDriver (sơ đồ: Test Script → WebDriver API → Browser Driver → Browser)'));
  body.push(Bullet('Hình 5.2: Giao diện ứng dụng Weather App khi chạy test (màn hình localhost:3000)'));
  body.push(Bullet('Hình 5.3: Screenshot Chrome đã mở và trang web đã load thành công'));
  body.push(Bullet('Hình 5.4: Ô input tìm kiếm đã được tìm thấy và highlight'));
  body.push(Bullet('Hình 5.5: Đã nhập "Hanoi" vào ô tìm kiếm'));
  body.push(Bullet('Hình 5.6: Kết quả thời tiết Hanoi hiển thị sau khi tìm kiếm'));
  body.push(Bullet('Hình 5.7: Báo cáo HTML test (test-report.html) với timeline và screenshots'));
  body.push(Bullet('Hình 5.8: Cấu trúc thư mục test-results với screenshots'));
  
  body.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '\nLưu ý: Các ảnh screenshot thực tế được lưu trong thư mục selenium-tests/test-results/test-<timestamp>/screenshots/. Bạn có thể chụp ảnh từ quá trình chạy test thực tế và chèn vào đây.',
          italics: true,
          size: 22,
          color: '666666'
        })
      ],
      spacing: { before: 120, after: 200 }
    })
  );

  // Tạo document (docx v8: truyền sections ngay trong constructor)
  const doc = new Document({
    creator: 'Selenium Reporter',
    title: 'CHƯƠNG 5. CÔNG CỤ KIỂM THỬ – Selenium',
    description: 'Chương 5 mô tả công cụ kiểm thử (Selenium) và cách sử dụng trong dự án Weather App.',
    sections: [
      {
        children: body,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outFile, buffer);
  console.log('Đã tạo file:', outFile);
}

main().catch((e) => {
  console.error('Lỗi tạo tài liệu:', e);
  process.exit(1);
});