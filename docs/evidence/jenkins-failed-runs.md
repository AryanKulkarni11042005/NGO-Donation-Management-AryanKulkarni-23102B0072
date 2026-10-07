# Jenkins pipeline: failed runs and their fixes (builds #17 – #21, 2026-09-18)

Jenkins job: `ngo-donation-portal-pipeline` (Pipeline script from SCM, branch
`feature/jenkins-docker-cd` at the time). Jenkins no longer keeps builds #16–#20
on disk, so the excerpts below are copied verbatim from those builds' console
output. In every failed run, the stages **after** the failure were skipped.
That is the quality gate working: nothing was built into an image or deployed
while a test or an earlier stage was red.

---

## Run 1 — build #17 (number inferred from order), commit `a357da2` — Selenium E2E failed

```
[ERROR] Tests run: 10, Failures: 0, Errors: 4, Skipped: 0
[ERROR]   LoginTest.wrongCredentialsAreRejected:71 » Timeout ... //p[contains(text(), 'Invalid email or password')]
[ERROR]   PublicSiteTest.campaignCardsLinkToDonatePage:60 » Timeout ... //a[contains(@href, '/donate/')]
[ERROR]   PublicSiteTest.campaignCardsShowRaisedAmounts:78 » Timeout ... //span[contains(., 'raised')]
[ERROR]   PublicSiteTest.campaignsAreListed:44 » Timeout ... //section[@id='campaigns']//h3
Stage "Build Docker Image" skipped due to earlier failure(s)
Stage "Push to Registry" skipped due to earlier failure(s)
Stage "Deploy Container" skipped due to earlier failure(s)
Stage "Verify Container" skipped due to earlier failure(s)
Finished: FAILURE
```

**Root cause.** A leftover `docker compose` frontend container was holding
host port 8081. The pipeline's `brew services restart nginx` printed
"Successfully started", but Homebrew nginx could not bind the port
(`/opt/homebrew/var/log/nginx/error.log`):

```
[emerg] bind() to 0.0.0.0:8081 failed (48: Address already in use)
[emerg] still could not bind()
```

Selenium was actually testing the stale container. Its nginx answered
`/store/campaigns` with **403**, so no campaigns rendered. `lsof -i :8081`
showed `com.docker` as the owner.

**Fix.** Commit `03157d2` *"Move compose frontend off port 8081 to avoid
clashing with bare-metal nginx"* (compose now uses 8091).

---

## Run 2 — build #18, commit `03157d2` — browser could not start

```
org.openqa.selenium.SessionNotCreatedException:
Could not start a new session. Response code 500. Message: session not created:
This version of ChromeDriver only supports Chrome version 151
Current browser version is 153.0.8010.48
[ERROR] Tests run: 2, Failures: 0, Errors: 2, Skipped: 0
Finished: FAILURE
```

**Root cause.** Chrome had auto-updated to 153, but `BaseE2ETest` forced
Selenium to use the newest *cached* driver
(`~/.cache/selenium/chromedriver/mac-arm64/151.0.7922.138`). That overrode
Selenium Manager's own version matching.

**Fix.** Commit `d803d0c` *"Stop pinning Selenium to a stale cached
ChromeDriver"*: Selenium Manager now resolves a matching driver each run
(`-Dchromedriver.path` kept as an explicit override). Verified locally:
10/10 tests passed before pushing.

---

## Run 3 — build #19, commit `d803d0c` — tests green, image build failed

```
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0      <- Selenium now passes
+ /usr/local/bin/docker build -t localhost:5050/ngo-backend:19 ...
ERROR: error getting credentials - err: exec: "docker-credential-desktop":
executable file not found in $PATH
Stage "Push to Registry" skipped due to earlier failure(s)
Finished: FAILURE
```

**Root cause.** Jenkins runs as a launchd/brew service with
`PATH=/usr/bin:/bin:/usr/sbin:/sbin`. Calling Docker by absolute path worked,
but Docker then runs its credential helper (`credsStore: desktop` in
`~/.docker/config.json`) by bare name, and that helper is in `/usr/local/bin`.

**Fix.** Commit `8e3f984` *"Put /usr/local/bin on PATH for the Docker CD
stages"* (`withEnv(['PATH+DOCKER=/usr/local/bin'])`, scoped to those stages).

---

## Run 4 — build #20 ("Restarted from build #19") — same error again

The log checked out `8e3f984`, but the shell steps still ran
`/usr/local/bin/docker build ...`, the *old* command. **"Restart from Stage"
replays the pipeline script loaded by the original run** (#19). Only the
workspace files are refreshed. **Lesson:** after changing the Jenkinsfile,
use **Build Now**, not Restart from Stage.

---

## Run 5 — build #21, fresh "Build Now" on `8e3f984` — SUCCESS

```
[INFO] Tests run: 38, Failures: 0, Errors: 0, Skipped: 0      (unit tests)
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0      (Selenium E2E)
+ docker build -t localhost:5050/ngo-backend:21 -t localhost:5050/ngo-backend:latest .
21: digest: sha256:6f92e6b619e268b1d556c3f1a9c37894794b26f816a17e098010e00a3fc4dace size: 856
+ docker run -d --name ngo-backend-cd -p 8093:8080 ... localhost:5050/ngo-backend:21
Containerized backend is up (attempt 1)
{"status":"ok"}
Deployed to staging (Tomcat + Docker build 21) and all tests passed.
Finished: SUCCESS
```

Registry afterwards: `{"name":"ngo-backend","tags":["21","test-push","latest"]}`;
`docker ps` showed `ngo-backend-cd` running `localhost:5050/ngo-backend:21`.
