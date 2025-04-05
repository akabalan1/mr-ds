const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  try {
    console.log("🧪 Visiting admin home...");
    await page.goto("https://mr-ds.vercel.app", { waitUntil: "networkidle2" });

    const title = await page.title();
    console.log("✅ Page title:", title);

    console.log("➡️ Clicking 'Majority Rules'...");
    await page.click("button:has-text('Majority Rules')");
    await page.waitForTimeout(1000);

    const url = page.url();
    if (!url.includes("/admin/majority")) throw new Error("Did not navigate to Majority Rules admin.");

    console.log("✅ Admin Majority page loaded.");

    console.log("✔ Functional test complete. Game is online and navigable.");
  } catch (err) {
    console.error("❌ Functional test failed:", err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
