package com.ngo.e2e;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Comparator;
import java.util.Optional;
import java.util.stream.Stream;

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

        // A chromedriver on PATH is often a different major version than the
        // installed Chrome and refuses the session outright. Point Selenium at a
        // driver it resolved itself when one is cached, so the run does not depend
        // on whatever happens to be installed system-wide.
        resolveCachedDriver().ifPresent(path ->
                System.setProperty("webdriver.chrome.driver", path));

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    /**
     * Finds the newest driver Selenium Manager has already downloaded. Returns
     * empty when the cache is cold, leaving Selenium to resolve one as usual.
     */
    private static Optional<String> resolveCachedDriver() {
        String override = System.getProperty("chromedriver.path");
        if (override != null && !override.isBlank()) {
            return Optional.of(override);
        }

        Path cache = Path.of(System.getProperty("user.home"), ".cache", "selenium", "chromedriver");
        if (!Files.isDirectory(cache)) {
            return Optional.empty();
        }

        try (Stream<Path> paths = Files.walk(cache)) {
            return paths.filter(p -> p.getFileName().toString().equals("chromedriver"))
                    .filter(Files::isExecutable)
                    .max(Comparator.comparing(Path::toString))
                    .map(Path::toString);
        } catch (IOException ex) {
            return Optional.empty();
        }
    }

    @AfterAll
    static void stopBrowser() {
        if (driver != null) {
            driver.quit();
        }
    }
}
