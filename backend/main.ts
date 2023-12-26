import { serve } from "https://deno.land/std@0.185.0/http/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { ElementHandle } from "https://deno.land/x/puppeteer@16.2.0/vendor/puppeteer-core/puppeteer/common/ElementHandle.js";
import { createLazyClient } from "https://deno.land/x/redis@v0.32.0/mod.ts";

const PORT = 3000 as const;

const redisClient = createLazyClient({
  hostname: "localhost",
  port: 6379,
});

console.assert(!redisClient.isConnected);

async function getData() {
  const blogName = "mannuelferreira";
  let browser;
  let page;

  try {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("https://mannuelferreira.com/posts");

    const articleElements = await page.$$("div[data-test-posts] article");

    const articlesData = await Promise.all(
      articleElements.map(async (elementHandle: ElementHandle) => {
        const title = await elementHandle.$eval(
          "span.post-title",
          (el: ElementHandle) => el.textContent.trim(),
        );
        const url = await elementHandle.$eval(
          "a",
          (el: ElementHandle) => el.getAttribute("href"),
        );
        const category = await elementHandle.$eval(
          "span.pill-category",
          (el: ElementHandle) => el.textContent.trim(),
        );
        const tags = await elementHandle.$$eval(
          "span.pill-tag",
          (els: ElementHandle[]) => els.map((el) => el.textContent.trim()),
        );
        const date = await elementHandle.$eval(
          "time",
          (el: ElementHandle) => el.getAttribute("datetime"),
        );

        return { title, url, category, tags, date };
      }),
    );

    const setPost = await redisClient.sendCommand("SET", [
      blogName,
      JSON.stringify(articlesData),
    ]);
    setPost;
    console.assert(setPost === "OK");
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

serve(handler, { port: PORT });
