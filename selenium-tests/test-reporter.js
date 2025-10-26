const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

class TestReporter {
  constructor(testName = 'Test Suite') {
    this.testName = testName;
    this.testResults = [];
    this.screenshots = [];
    this.startTime = new Date();
    this.currentStep = null;
    this.testId = `test-${Date.now()}`;
    
    // Tạo thư mục lưu test results
    this.resultsDir = path.join(__dirname, 'test-results', this.testId);
    this.screenshotsDir = path.join(this.resultsDir, 'screenshots');
    
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true });
    }
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
    }
  }

  startTest() {
    this.startTime = new Date();
    console.log(`\n📝 Bắt đầu: ${this.testName}`);
    console.log(`⏰ Thời gian: ${this.startTime.toLocaleString('vi-VN')}\n`);
  }

  addStep(stepName) {
    this.currentStep = {
      step: stepName,
      status: 'running',
      details: '',
      screenshot: null,
      timestamp: Date.now(),
      time: new Date().toLocaleString('vi-VN')
    };
  }

  passStep(details = '') {
    if (this.currentStep) {
      this.currentStep.status = 'passed';
      this.currentStep.details = details;
      this.testResults.push({...this.currentStep});
      console.log(`✅ ${this.currentStep.step}`);
    }
  }

  failStep(details = '') {
    if (this.currentStep) {
      this.currentStep.status = 'failed';
      this.currentStep.details = details;
      this.testResults.push({...this.currentStep});
      console.log(`❌ ${this.currentStep.step}: ${details}`);
    }
  }

  warnStep(details = '') {
    if (this.currentStep) {
      this.currentStep.status = 'warning';
      this.currentStep.details = details;
      this.testResults.push({...this.currentStep});
      console.log(`⚠️  ${this.currentStep.step}: ${details}`);
    }
  }

  async takeScreenshot(driver, name) {
    try {
      const timestamp = Date.now();
      const filename = `${timestamp}-${name.replace(/\s+/g, '-')}.png`;
      const filepath = path.join(this.screenshotsDir, filename);
      
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync(filepath, screenshot, 'base64');
      
      if (this.currentStep) {
        this.currentStep.screenshot = filename;
      }
      
      this.screenshots.push({
        name,
        filename,
        timestamp,
        time: new Date().toLocaleString('vi-VN')
      });
      
      return filepath;
    } catch (error) {
      console.error(`⚠️  Không thể chụp screenshot: ${error.message}`);
      return null;
    }
  }

  endTest(success = true) {
    const endTime = new Date();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    console.log(`\n${'='.repeat(50)}`);
    console.log(success ? '✅ TEST HOÀN TẤT!' : '❌ TEST THẤT BẠI!');
    console.log(`⏱️  Thời gian: ${duration}s`);
    console.log(`${'='.repeat(50)}\n`);
    
    const reportPath = this.generateHTMLReport();
    return reportPath;
  }

  async captureScreenshot(driver, name, description) {
    try {
      const timestamp = Date.now();
      const filename = `${timestamp}-${name.replace(/\s+/g, '-')}.png`;
      const filepath = path.join(this.screenshotsDir, filename);
      
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync(filepath, screenshot, 'base64');
      
      this.screenshots.push({
        name,
        description,
        filename,
        timestamp,
        time: new Date().toLocaleString('vi-VN')
      });
      
      console.log(`📸 Screenshot: ${name}`);
      return filepath;
    } catch (error) {
      console.error(`⚠️  Không thể chụp screenshot: ${error.message}`);
      return null;
    }
  }

  addTestStep(stepName, status, details = '', screenshot = null) {
    this.testResults.push({
      step: stepName,
      status,
      details,
      screenshot,
      timestamp: Date.now(),
      time: new Date().toLocaleString('vi-VN')
    });
  }

  generateHTMLReport() {
    const endTime = new Date();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.status === 'passed').length;
    const failedTests = this.testResults.filter(t => t.status === 'failed').length;
    const warningTests = this.testResults.filter(t => t.status === 'warning').length;

    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather App Test Report - ${this.testId}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 40px;
      text-align: center;
    }

    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .header p {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 30px 40px;
      background: #f8f9fa;
    }

    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }

    .summary-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }

    .summary-card .value {
      font-size: 2.5rem;
      font-weight: bold;
      margin: 10px 0;
    }

    .summary-card .label {
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .summary-card.total .value { color: #667eea; }
    .summary-card.passed .value { color: #10b981; }
    .summary-card.failed .value { color: #ef4444; }
    .summary-card.warning .value { color: #f59e0b; }
    .summary-card.duration .value { color: #8b5cf6; font-size: 2rem; }

    .test-steps {
      padding: 40px;
    }

    .test-steps h2 {
      font-size: 1.8rem;
      margin-bottom: 20px;
      color: #333;
    }

    .step {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      border-left: 4px solid #ddd;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .step:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      transform: translateX(5px);
    }

    .step.passed { border-left-color: #10b981; }
    .step.failed { border-left-color: #ef4444; }
    .step.warning { border-left-color: #f59e0b; }

    .step-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .step-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
    }

    .step-status {
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .step-status.passed {
      background: #d1fae5;
      color: #065f46;
    }

    .step-status.failed {
      background: #fee2e2;
      color: #991b1b;
    }

    .step-status.warning {
      background: #fef3c7;
      color: #92400e;
    }

    .step-details {
      color: #666;
      margin: 10px 0;
      line-height: 1.6;
    }

    .step-time {
      color: #999;
      font-size: 0.9rem;
      margin-top: 10px;
    }

    .step-screenshot {
      margin-top: 15px;
    }

    .step-screenshot img {
      max-width: 100%;
      border-radius: 8px;
      border: 2px solid #e5e7eb;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .step-screenshot img:hover {
      transform: scale(1.02);
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }

    .screenshots-gallery {
      padding: 40px;
      background: #f8f9fa;
    }

    .screenshots-gallery h2 {
      font-size: 1.8rem;
      margin-bottom: 20px;
      color: #333;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .gallery-item {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .gallery-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }

    .gallery-item img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      cursor: pointer;
    }

    .gallery-item-info {
      padding: 15px;
    }

    .gallery-item-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
    }

    .gallery-item-time {
      color: #999;
      font-size: 0.85rem;
    }

    .footer {
      text-align: center;
      padding: 20px;
      background: #f8f9fa;
      color: #666;
      border-top: 1px solid #e5e7eb;
    }

    /* Modal for fullscreen images */
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.9);
      cursor: zoom-out;
    }

    .modal-content {
      margin: auto;
      display: block;
      max-width: 90%;
      max-height: 90%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .close-modal {
      position: absolute;
      top: 20px;
      right: 40px;
      color: #f1f1f1;
      font-size: 40px;
      font-weight: bold;
      cursor: pointer;
    }

    @media print {
      .modal { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌤️ Weather App Test Report</h1>
      <p>Test ID: ${this.testId}</p>
      <p>${this.startTime.toLocaleString('vi-VN')} - ${endTime.toLocaleString('vi-VN')}</p>
    </div>

    <div class="summary">
      <div class="summary-card total">
        <div class="label">Tổng số test</div>
        <div class="value">${totalTests}</div>
      </div>
      <div class="summary-card passed">
        <div class="label">Thành công</div>
        <div class="value">${passedTests}</div>
      </div>
      <div class="summary-card failed">
        <div class="label">Thất bại</div>
        <div class="value">${failedTests}</div>
      </div>
      <div class="summary-card warning">
        <div class="label">Cảnh báo</div>
        <div class="value">${warningTests}</div>
      </div>
      <div class="summary-card duration">
        <div class="label">Thời gian</div>
        <div class="value">${duration}s</div>
      </div>
    </div>

    <div class="test-steps">
      <h2>📋 Chi tiết các bước test</h2>
      ${this.testResults.map((result, index) => `
        <div class="step ${result.status}">
          <div class="step-header">
            <div class="step-name">Bước ${index + 1}: ${result.step}</div>
            <div class="step-status ${result.status}">
              ${result.status === 'passed' ? '✓ Passed' : result.status === 'failed' ? '✗ Failed' : '⚠ Warning'}
            </div>
          </div>
          ${result.details ? `<div class="step-details">${result.details}</div>` : ''}
          <div class="step-time">⏱️ ${result.time}</div>
          ${result.screenshot ? `
            <div class="step-screenshot">
              <img src="screenshots/${path.basename(result.screenshot)}" 
                   alt="${result.step}" 
                   onclick="openModal(this.src)">
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>

    <div class="screenshots-gallery">
      <h2>📸 Tất cả Screenshots</h2>
      <div class="gallery-grid">
        ${this.screenshots.map(ss => `
          <div class="gallery-item">
            <img src="screenshots/${ss.filename}" 
                 alt="${ss.name}"
                 onclick="openModal(this.src)">
            <div class="gallery-item-info">
              <div class="gallery-item-name">${ss.name}</div>
              <div class="gallery-item-time">📅 ${ss.time}</div>
              ${ss.description ? `<div class="step-details">${ss.description}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="footer">
      <p>Generated by Weather App Selenium Test Suite</p>
      <p>© 2025 - Automated Testing Report</p>
    </div>
  </div>

  <!-- Modal for fullscreen images -->
  <div id="imageModal" class="modal" onclick="closeModal()">
    <span class="close-modal" onclick="closeModal()">&times;</span>
    <img class="modal-content" id="modalImage">
  </div>

  <script>
    function openModal(src) {
      const modal = document.getElementById('imageModal');
      const modalImg = document.getElementById('modalImage');
      modal.style.display = 'block';
      modalImg.src = src;
    }

    function closeModal() {
      document.getElementById('imageModal').style.display = 'none';
    }

    // Close modal with ESC key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    });
  </script>
</body>
</html>
    `;

    const reportPath = path.join(this.resultsDir, 'test-report.html');
    fs.writeFileSync(reportPath, html);
    
    // Tạo index.html redirect đến report mới nhất
    this.createIndexRedirect();
    
    return reportPath;
  }

  createIndexRedirect() {
    const indexPath = path.join(__dirname, 'test-results', 'index.html');
    const redirectHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=./${this.testId}/test-report.html">
  <title>Redirecting to latest test...</title>
</head>
<body>
  <p>Redirecting to latest test report...</p>
</body>
</html>
    `;
    fs.writeFileSync(indexPath, redirectHtml);
  }

  saveJSON() {
    const jsonData = {
      testId: this.testId,
      startTime: this.startTime,
      endTime: new Date(),
      results: this.testResults,
      screenshots: this.screenshots
    };
    
    const jsonPath = path.join(this.resultsDir, 'test-data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
    return jsonPath;
  }
}

module.exports = TestReporter;
