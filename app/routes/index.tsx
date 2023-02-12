import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";
import { datetime } from "https://deno.land/x/ptera/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { config} from 'https://deno.land/x/dotenv@v1.0.1/mod.ts';

const client = new Client({
  user: "postgres",
  database: "postgres",
  hostname: Deno.env.get("DB_HOST"),
  password: Deno.env.get("DB_PASSWORD"),
  port: 5432,
});
await client.connect();

interface Article {
  id: string;
  title: string;
  created_at: string;
}

export const handler: Handlers<Article[]> = {
  async GET(_, ctx) {
    const articles: Article[] = await client.queryObject<Article>(
      "SELECT * FROM content"
    ).then((res) => {
      console.log(res)
      return res.rows
    })
    return await ctx.render(articles);
  },
};

export default function Home({ data }: PageProps<Article[]>) {
  return (
    <>
      <Head>
        <title>Skota11'Blog</title>
        <link rel="stylesheet" href="style.css" />
        <script src="https://kit.fontawesome.com/a60744fb42.js" crossorigin="anonymous"></script>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <img
          src="https://avatars.githubusercontent.com/u/91359399"
          class="w-32 h-32"
          alt="MyIcon"
        />
        <h1 class="my-6 text-2xl">
          Skota11
        </h1>
        <p class="text-3xl"><a href="https://github.com/Skota11" class="mr-4"><i class="fa-brands fa-square-github"></i></a><a href="https://skota11.com" class="mr-4"><i class="fa-solid fa-link"></i></a></p>
        <p>
          Skota11's Blog
        </p>
        <p class="text-gray-600">
          技術系や日々の出来事を日記のように書いていきます
        </p>
        <ul>
            {data.map((article) => (
              <li class="border-solid border-l-4 pl-2">
                <a href={`articles/${article.id}`}>
                  <h1 class="text-2xl my-2">{article.title}</h1>
                  <p class="text-gray-600">{article.info}</p>
                  <p class="text-gray-600">{datetime(article.created_at).format("YYYY/MMMM/dd")}</p>
                </a>
              </li>
            ))}
          </ul>
      </div>
    </>
  );
}
