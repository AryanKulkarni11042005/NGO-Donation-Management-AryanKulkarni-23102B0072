package com.ngo.e2e;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * Shared browser setup. One driver is started for the whole run rather than one
 * per test, because launching Chrome dominates the runtime of a suite this size.
 */
abstract class BaseE2ETest {

    protected static WebDriver driver;
    protected static WebDriverWait wait;
    protected static String baseUrl;

    @BeforeAll
    static void startBrowser() {
        baseUrl = System.getProperty("base.url", "http://localhost:8081");

        ChromeOptions options = new ChromeOptions();
        if (Boolean.parseBoolean(System.getProperty("headless", "true"))) {
            // Jenkins runs as a background service with no display attached.
            options.addArguments("--headless=new");
        }
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--window-size=1400,1000");

        // Let Selenium Manager detect the installed Chrome version and download a
        // matching driver -- pinning to a specific cached driver breaks the moment
        // Chrome auto-updates, which is exactly what happened here. Only override
        // when a path is explicitly given (e.g. an offline CI environment).
        String override = System.getProperty("chromedriver.path");
        if (override != null && !override.isBlank()) {
            System.setProperty("webdriver.chrome.driver", override);
        }

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @AfterAll
    static void stopBrowser() {
        if (driver != null) {
            driver.quit();
        }
    }
}
