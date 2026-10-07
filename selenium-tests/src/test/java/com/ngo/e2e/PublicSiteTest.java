package com.ngo.e2e;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Covers the public landing page: the campaigns it lists come from the Spring Boot
 * backend through the nginx /store proxy, so a passing run proves the whole chain
 * -- browser, nginx, Tomcat, database -- is wired up on the deployed environment.
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class PublicSiteTest extends BaseE2ETest {

    @Test
    @Order(1)
    @DisplayName("The landing page loads and shows the site header")
    void landingPageLoads() {
        driver.get(baseUrl + "/");

        wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("header")));

        assertThat(driver.findElement(By.tagName("header")).getText()).contains("MICF");
        assertThat(driver.getCurrentUrl()).startsWith(baseUrl);
    }

    @Test
    @Order(2)
    @DisplayName("Campaigns fetched from the backend are rendered as cards")
    void campaignsAreListed() {
        driver.get(baseUrl + "/");

        // The list is client-rendered after the /store/campaigns call returns, so
        // wait for a card rather than asserting on the first paint.
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//section[@id='campaigns']//h3")));

        List<WebElement> titles = driver.findElements(
                By.xpath("//section[@id='campaigns']//h3"));

        assertThat(titles).isNotEmpty();
        assertThat(titles.get(0).getText()).isNotBlank();
    }

    @Test
    @Order(3)
    @DisplayName("Each campaign card offers a donate link carrying the campaign id")
    void campaignCardsLinkToDonatePage() {
        driver.get(baseUrl + "/");

        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//a[contains(@href, '/donate/')]")));

        List<WebElement> donateLinks = driver.findElements(
                By.xpath("//a[contains(@href, '/donate/')]"));

        assertThat(donateLinks).isNotEmpty();
        assertThat(donateLinks.get(0).getAttribute("href")).matches(".*/donate/\\d+$");
    }

    @Test
    @Order(4)
    @DisplayName("Campaign cards show progress against the target amount")
    void campaignCardsShowRaisedAmounts() {
        driver.get(baseUrl + "/");

        // React renders the amount and the word "raised" as separate text nodes, so
        // match on the element's full text rather than a single node.
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//span[contains(., 'raised')]")));

        WebElement raised = driver.findElement(By.xpath("//span[contains(., 'raised')]"));

        assertThat(raised.getText()).contains("₹").contains("raised");
    }

    @Test
    @Order(5)
    @DisplayName("An unknown route falls back to the landing page")
    void unknownRouteRedirectsHome() {
        driver.get(baseUrl + "/this-page-does-not-exist");

        wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("header")));

        // The router redirects anything unmatched back to "/".
        assertThat(driver.getCurrentUrl()).isIn(baseUrl + "/", baseUrl);
    }
}
