const { Builder, By, Key, until } = require('selenium-webdriver');
const TestReporter = require('./test-reporter');

async function testWeatherApp() {
  const reporter = new TestReporter('Weather App Test Suite');
  let driver;
  
  try {
    reporter.startTest();
    console.log(' Bắt đầu test ứng dụng Weather App...');
    
    reporter.addStep('Khởi động Chrome Browser');
    driver = await new Builder().forBrowser('chrome').build();
    await reporter.takeScreenshot(driver, 'chrome-started');
    reporter.passStep('Chrome đã khởi động thành công');
    
    await driver.manage().setTimeouts({ implicit: 10000 });
    
    reporter.addStep('Truy cập localhost:3000');
    await driver.get('http://localhost:3000');
    await driver.sleep(3000);
    await reporter.takeScreenshot(driver, 'page-loaded');
    reporter.passStep('Trang đã load thành công');
    
    reporter.addStep('Tìm ô input');
    const searchInput = await driver.wait(until.elementLocated(By.css('input[type="text"]')), 15000);
    await reporter.takeScreenshot(driver, 'input-found');
    reporter.passStep('Tìm thấy ô tìm kiếm');
    
    reporter.addStep('Nhập Hanoi');
    await searchInput.clear();
    await searchInput.sendKeys('Hanoi');
    await driver.sleep(1000);
    await reporter.takeScreenshot(driver, 'hanoi-typed');
    reporter.passStep('Đã nhập Hanoi');
    
    reporter.addStep('Tìm kiếm');
    const buttons = await driver.findElements(By.css('button'));
    if (buttons.length > 0) await buttons[0].click();
    else await searchInput.sendKeys(Key.RETURN);
    await driver.sleep(5000);
    await reporter.takeScreenshot(driver, 'hanoi-result');
    reporter.passStep('Đã tìm kiếm thành công');
    
    console.log(' Test hoàn tất!');
  } catch (err) {
    console.error(' Lỗi:', err.message);
    if (driver) await reporter.takeScreenshot(driver, 'error');
    reporter.endTest(false);
    process.exit(1);
  } finally {
    if (driver) {
      await driver.sleep(2000);
      await driver.quit();
    }
    const reportPath = reporter.endTest(true);
    console.log(' Báo cáo:', reportPath);
  }
}

testWeatherApp();
