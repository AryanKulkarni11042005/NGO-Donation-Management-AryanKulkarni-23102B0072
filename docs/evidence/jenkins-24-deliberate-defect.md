# Jenkins build #24 — deliberate defect caught by the Selenium quality gate

Commit under test: `Merge pull request #22` (contains `df3d55e [DELIBERATE DEFECT]`). Excerpt from the build log:

```
[INFO] Tests run: 38, Failures: 0, Errors: 0, Skipped: 0
[ERROR] Tests run: 5, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 4.596 s <<< FAILURE! -- in com.ngo.e2e.PublicSiteTest
[ERROR] com.ngo.e2e.PublicSiteTest.campaignCardsLinkToDonatePage -- Time elapsed: 0.106 s <<< FAILURE!
Expecting actual:
  "http://localhost:8081/donate/Clean%20Water%20Fund"
to match pattern:
  ".*/donate/\d+$"
Expecting actual:
  "http://localhost:8081/donate/Clean%20Water%20Fund"
to match pattern:
  ".*/donate/\d+$"
[ERROR] Tests run: 10, Failures: 1, Errors: 0, Skipped: 0
Stage "Build Docker Image" skipped due to earlier failure(s)
Stage "Push to Registry" skipped due to earlier failure(s)
Stage "Deploy Container" skipped due to earlier failure(s)
Stage "Verify Container" skipped due to earlier failure(s)
Stage "Provision Node (Ansible)" skipped due to earlier failure(s)
Finished: FAILURE
```
