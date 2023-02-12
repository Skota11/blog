import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { datetime } from "https://deno.land/x/ptera/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { config } from 'https://deno.land/x/dotenv@v1.0.1/mod.ts';
import MdToHtml from "../../lib/md_to_html.tsx";

const client = new Client({
  user: "postgres",
  database: "postgres",
  hostname: config({}).DB_HOST,
  password: config({}).DB_PASSWORD,
  port: 5432,
});
await client.connect();

interface Article {
  id:string,
  info:string,
  content:string,
  created_at:string
}


export const handler: Handlers<Article[]> = {
  async GET(_, ctx) {
  const articles: Article[] = await client.queryObject<Article>("SELECT * FROM content where id = $1",
[ctx.params.id]).then((res) => {
    console.log(res)
    return res.rows[0]
  });
  return await ctx.render(articles);
}
}

export default function Article({ data }: PageProps<Article[]>) {
  return (
    <>
      <Head>
        <title>Fresh App</title>
        <link rel="stylesheet" href="../style.css" />
        <script src="https://kit.fontawesome.com/a60744fb42.js" crossorigin="anonymous"></script>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <p><a href="/">TOPへ戻る</a></p>
        <div>
          <h1 class="my-4 text-4xl">{data.title}</h1>
          <p class="text-gray-600 text-xl">{data.info}</p>
          <p class="my-8" dangerouslySetInnerHTML={{ __html: MdToHtml(data.content) }}></p>
        </div>
      </div>
    </>
  );
}
