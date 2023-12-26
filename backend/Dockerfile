FROM denoland/deno:latest

# The port that your application listens to.
EXPOSE 3000

WORKDIR /app

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@16.2.0/install.ts
RUN deno cache main.ts

CMD ["run", "-A", "main.ts"]
