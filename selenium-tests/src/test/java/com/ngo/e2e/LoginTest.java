package com.ngo.e2e;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Covers the staff login screen. Only the rejection paths are asserted here: a
 * successful login needs seeded credentials, which differ per environment, so
 * that flow is left to a manual check rather than baked into the pipeline.
 */
class LoginTest extends BaseE2ETest {

    @Test
    @DisplayName("The staff login link on the landing page opens the login form")
    void staffLoginLinkOpensLoginPage() {
        driver.get(baseUrl + "/");

        wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//a[contains(text(), 'Staff Login')]"))).click();

        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("email")));

        assertThat(driver.getCurrentUrl()).endsWith("/login");
        assertThat(driver.findElement(By.tagName("h1")).getText()).contains("Login");
    }

    @Test
    @DisplayName("The login form asks for an email and a password")
    void loginFormRendersBothFields() {
        driver.get(baseUrl + "/login");

        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("email")));

        assertThat(driver.findElement(By.id("email")).getAttribute("type")).isEqualTo("email");
        assertThat(driver.findElement(By.id("password")).getAttribute("type")).isEqualTo("password");
        assertThat(driver.findElement(By.xpath("//button[@type='submit']")).getText())
                .containsIgnoringCase("login");
    }

    @Test
    @DisplayName("Submitting an empty form reports the missing fields without calling the backend")
    void emptySubmitShowsValidationMessage() {
        driver.get(baseUrl + "/login");

        wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[@type='submit']"))).click();

        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//p[contains(text(), 'required')]")));

        assertThat(driver.findElement(By.xpath("//p[contains(text(), 'required')]")).getText())
                .isEqualTo("Email and password are required.");
    }

    @Test
    @DisplayName("Wrong credentials are rejected, proving the browser reached the backend")
    void wrongCredentialsAreRejected() {
        driver.get(baseUrl + "/login");

        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("email")))
                .sendKeys("nobody@example.com");
        driver.findElement(By.id("password")).sendKeys("definitely-wrong");
        driver.findElement(By.xpath("//button[@type='submit']")).click();

        // A 401 from Spring Boot renders this message; anything else means the
        // request never reached the backend through the nginx proxy.
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//p[contains(text(), 'Invalid email or password')]")));

        assertThat(driver.getCurrentUrl()).endsWith("/login");
    }

    @Test
    @DisplayName("A protected page cannot be opened without logging in")
    void protectedRouteRedirectsToLogin() {
        driver.get(baseUrl + "/dashboard");

        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("email")));

        assertThat(driver.getCurrentUrl()).endsWith("/login");
    }
}
