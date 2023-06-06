import { serve } from "https://deno.land/std@0.185.0/http/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

export 

async function getData() {
  let browser;
  let page;
  try {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("https://mannuelferreira.com/posts");
    
    const articleElements = await page.$$("div[data-test-posts] article");

    const articlesData = await Promise.all(
      articleElements.map(async (elementHandle) => {
        const title = await elementHandle.$eval("span.post-title", (el) =>
          el.textContent.trim());
        const url = await elementHandle.$eval("a", (el) =>
          el.getAttribute("href"));
        const category = await elementHandle.$eval("span.pill-category", (el) =>
          el.textContent.trim());
        const tags = await elementHandle.$$eval("span.pill-tag", (els) =>
          els.map((el) =>
            el.textContent.trim()
          ));
        const date = await elementHandle.$eval("time", (el) =>
          el.getAttribute("datetime"));

        return { title, url, category, tags, date };
      }),
    );

    console.log(articlesData);
  } catch (error) {
    console.log("🔥", error);
  } finally {
    await browser?.close();
  }
}

const handler = async (_request: Request): Promise<Response> => {
  await getData();
  return new Response("Hello, World!");
};

serve(handler);
