import { Locale } from "@/i18n/routing";

export type CategoryKey =
  | "auto"
  | "financial"
  | "lifestyle"
  | "health"
  | "technology";

export type Category = {
  key: CategoryKey;
  label: string;
  imageUrl: string;
};

export type TagCount = {
  tag: string;
  count: number;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: CategoryKey;
  content: string;
  date: string;
  tags: string[];
};

const POSTS_PER_DAY = 10;
const DAYS_TO_KEEP = 365;

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatYmd(date: Date) {
  return `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(
    date.getUTCDate()
  )}`;
}

function ymdToDate(ymd: string) {
  const y = Number(ymd.slice(0, 4));
  const m = Number(ymd.slice(4, 6));
  const d = Number(ymd.slice(6, 8));
  return new Date(Date.UTC(y, m - 1, d));
}

function isoDate(ymd: string) {
  const date = ymdToDate(ymd);
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(
    date.getUTCDate()
  )}`;
}

function hashToIndex(input: string, mod: number) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % mod;
}

function categoryImageUrl(key: CategoryKey) {
  return `https://picsum.photos/seed/${encodeURIComponent(`cat-${key}`)}/900/600`;
}

export function getCategories(locale: Locale): Category[] {
  if (locale === "zh-CN") {
    return [
      { key: "auto", label: "汽车", imageUrl: categoryImageUrl("auto") },
      { key: "financial", label: "金融", imageUrl: categoryImageUrl("financial") },
      { key: "lifestyle", label: "生活方式", imageUrl: categoryImageUrl("lifestyle") },
      { key: "health", label: "健康", imageUrl: categoryImageUrl("health") },
      { key: "technology", label: "科技", imageUrl: categoryImageUrl("technology") },
    ];
  }

  return [
    { key: "auto", label: "Auto", imageUrl: categoryImageUrl("auto") },
    { key: "financial", label: "Financial", imageUrl: categoryImageUrl("financial") },
    { key: "lifestyle", label: "Lifestyle", imageUrl: categoryImageUrl("lifestyle") },
    { key: "health", label: "Health", imageUrl: categoryImageUrl("health") },
    { key: "technology", label: "Technology", imageUrl: categoryImageUrl("technology") },
  ];
}

export function getCategoryLabel(locale: Locale, key: CategoryKey) {
  const found = getCategories(locale).find((c) => c.key === key);
  return found?.label ?? key;
}

export function isCategoryKey(slug: string): slug is CategoryKey {
  return (
    slug === "auto" ||
    slug === "financial" ||
    slug === "lifestyle" ||
    slug === "health" ||
    slug === "technology"
  );
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function topics(locale: Locale) {
  if (locale === "zh-CN") {
    return [
      { title: "理财与预算", category: "financial" as const, tags: ["理财", "预算"] },
      { title: "健康与生活方式", category: "health" as const, tags: ["健康", "生活"] },
      { title: "科技趋势", category: "technology" as const, tags: ["科技", "趋势"] },
      { title: "生活方式与习惯", category: "lifestyle" as const, tags: ["生活", "习惯"] },
      { title: "汽车与出行", category: "auto" as const, tags: ["汽车", "出行"] },
      { title: "财务规划", category: "financial" as const, tags: ["金融", "规划"] },
      { title: "健康管理", category: "health" as const, tags: ["健康", "管理"] },
      { title: "科技与效率", category: "technology" as const, tags: ["科技", "效率"] },
    ];
  }

  return [
    { title: "Money & Budgeting", category: "financial" as const, tags: ["finance", "budget"] },
    { title: "Health & Lifestyle", category: "health" as const, tags: ["health", "lifestyle"] },
    { title: "Technology Trends", category: "technology" as const, tags: ["technology", "trends"] },
    { title: "Lifestyle Habits", category: "lifestyle" as const, tags: ["lifestyle", "habits"] },
    { title: "Auto & Mobility", category: "auto" as const, tags: ["auto", "mobility"] },
    { title: "Personal Finance Planning", category: "financial" as const, tags: ["finance", "planning"] },
    { title: "Healthy Routine", category: "health" as const, tags: ["health", "routine"] },
    { title: "Tech & Productivity", category: "technology" as const, tags: ["tech", "productivity"] },
  ];
}

function makePost(locale: Locale, ymd: string, index: number): Post {
  const topicList = topics(locale);
  const topic = topicList[hashToIndex(`${ymd}-${index}`, topicList.length)];
  const dayText = isoDate(ymd);

  const title =
    locale === "zh-CN"
      ? `${topic.title}（${dayText}）`
      : `Daily Update #${index}: ${topic.title} (${dayText})`;

  const excerpt =
    locale === "zh-CN"
      ? `这是一篇自动更新的每日内容，围绕「${topic.title}」提供可执行的要点与思路。`
      : `An auto-updated daily post focused on “${topic.title}”, with practical takeaways.`;

  const content =
    locale === "zh-CN"
      ? [
          "要点速览：",
          `1）围绕「${topic.title}」先明确目标与约束条件。`,
          "2）把大问题拆成三步：现状、选择、执行。",
          "3）记录一个可衡量指标，明天复盘一次。",
          "",
          "正文：",
          `今天我们从「${topic.title}」出发，先用 5 分钟写下最关键的一个目标，然后列出 3 个你能立即行动的小步骤。`,
          "如果你不知道从哪里开始，就从“减少一个浪费”或“新增一个习惯”开始：每次只改变一件事。",
          "",
          "结尾：",
          "把这篇内容收藏起来，明天来看新的 10 条更新。"
        ].join("\n")
      : [
          "Quick takeaways:",
          `1) Define your goal and constraints around “${topic.title}”.`,
          "2) Break it into three steps: current state, options, execution.",
          "3) Track one measurable metric and review tomorrow.",
          "",
          "Main notes:",
          `Start with “${topic.title}”: spend 5 minutes writing the single most important goal, then list 3 actions you can do today.`,
          "If you're stuck, begin by removing one waste or adding one small habit—change one thing at a time.",
          "",
          "Wrap-up:",
          "Bookmark this page and come back tomorrow for 10 fresh updates."
        ].join("\n");

  const id = `${ymd}-${index}`;
  const topicSlug = slugify(topic.title) || "post";
  const slug = `${ymd}-${index}-${topicSlug}`;
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(id)}/1200/630`;

  return {
    id,
    slug,
    title,
    excerpt,
    imageUrl,
    category: topic.category,
    content,
    date: dayText,
    tags: topic.tags,
  };
}

export function parseDailySlug(slug: string) {
  const match = /^(\d{8})-(\d{1,2})-/.exec(slug);
  if (!match) return null;
  const ymd = match[1];
  const index = Number(match[2]);
  if (!Number.isFinite(index) || index < 1 || index > POSTS_PER_DAY) return null;
  return { ymd, index };
}

export function getLatestPosts(locale: Locale, limit: number): Post[] {
  const now = new Date();
  const ymd = formatYmd(now);
  const posts: Post[] = [];
  for (let i = 1; i <= POSTS_PER_DAY && posts.length < limit; i += 1) {
    posts.push(makePost(locale, ymd, i));
  }
  return posts;
}

export function getRecentPosts(locale: Locale, days: number): Post[] {
  const safeDays = Number.isFinite(days) && days > 0 ? Math.floor(days) : 1;
  const result: Post[] = [];
  for (let day = 0; day < safeDays; day += 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - day);
    const ymd = formatYmd(date);
    for (let i = 1; i <= POSTS_PER_DAY; i += 1) {
      result.push(makePost(locale, ymd, i));
    }
  }
  return result;
}

export function getTrendingPosts(locale: Locale, limit: number): Post[] {
  const pool = getRecentPosts(locale, 30);
  return pool
    .sort(
      (a, b) =>
        hashToIndex(`${b.id}-trend`, 100000) -
        hashToIndex(`${a.id}-trend`, 100000)
    )
    .slice(0, limit);
}

export function getMostSearchedPosts(locale: Locale, limit: number): Post[] {
  const pool = getRecentPosts(locale, 90);
  return pool
    .sort(
      (a, b) =>
        hashToIndex(`${b.id}-search`, 100000) -
        hashToIndex(`${a.id}-search`, 100000)
    )
    .slice(0, limit);
}

export function getLatestFeed(locale: Locale, limit: number): Post[] {
  const page = getPostsPage(locale, 1, limit);
  return page.posts;
}

export function getPostsPage(locale: Locale, page: number, pageSize: number) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 20;

  const total = DAYS_TO_KEEP * POSTS_PER_DAY;
  const offset = (safePage - 1) * safePageSize;
  const result: Post[] = [];

  if (offset >= total) {
    return {
      page: safePage,
      pageSize: safePageSize,
      total,
      posts: result,
    };
  }

  const startIndex = offset;
  const endIndex = Math.min(offset + safePageSize, total);

  const startDay = Math.floor(startIndex / POSTS_PER_DAY);
  const startPosInDay = startIndex % POSTS_PER_DAY;

  let produced = 0;
  for (let day = startDay; day < DAYS_TO_KEEP && produced < endIndex - startIndex; day += 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - day);
    const ymd = formatYmd(date);

    for (let i = 1 + (day === startDay ? startPosInDay : 0); i <= POSTS_PER_DAY; i += 1) {
      result.push(makePost(locale, ymd, i));
      produced += 1;
      if (produced >= endIndex - startIndex) break;
    }
  }

  return {
    page: safePage,
    pageSize: safePageSize,
    total,
    posts: result,
  };
}

export function getPostsByCategoryPage(
  locale: Locale,
  category: CategoryKey,
  page: number,
  pageSize: number
) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 20;

  const total = countPostsByCategory(locale, category);
  const offset = (safePage - 1) * safePageSize;
  const result: Post[] = [];

  let produced = 0;
  let seen = 0;

  for (let day = 0; day < DAYS_TO_KEEP && produced < safePageSize; day += 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - day);
    const ymd = formatYmd(date);

    for (let i = 1; i <= POSTS_PER_DAY; i += 1) {
      const post = makePost(locale, ymd, i);
      if (post.category !== category) continue;
      if (seen < offset) {
        seen += 1;
        continue;
      }
      result.push(post);
      produced += 1;
      seen += 1;
      if (produced >= safePageSize) break;
    }
  }

  return {
    page: safePage,
    pageSize: safePageSize,
    total,
    posts: result,
  };
}

function countPostsByCategory(locale: Locale, category: CategoryKey) {
  let count = 0;
  for (let day = 0; day < DAYS_TO_KEEP; day += 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - day);
    const ymd = formatYmd(date);
    for (let i = 1; i <= POSTS_PER_DAY; i += 1) {
      const post = makePost(locale, ymd, i);
      if (post.category === category) count += 1;
    }
  }
  return count;
}

export function getCategoryCounts(locale: Locale) {
  const categories = getCategories(locale);
  return categories.map((c) => ({
    ...c,
    count: countPostsByCategory(locale, c.key),
  }));
}

function normalizeQuery(query: string) {
  return query.trim().toLowerCase();
}

export function searchPosts(locale: Locale, query: string, limit: number): Post[] {
  const q = normalizeQuery(query);
  if (!q) return [];
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 20;

  const results: Post[] = [];
  for (let day = 0; day < DAYS_TO_KEEP; day += 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - day);
    const ymd = formatYmd(date);
    for (let i = 1; i <= POSTS_PER_DAY; i += 1) {
      const post = makePost(locale, ymd, i);
      const haystack = `${post.title}\n${post.excerpt}\n${post.content}`.toLowerCase();
      if (!haystack.includes(q)) continue;
      results.push(post);
      if (results.length >= safeLimit) return results;
    }
  }
  return results;
}

export function getTagCounts(locale: Locale): TagCount[] {
  const map = new Map<string, number>();
  for (let day = 0; day < DAYS_TO_KEEP; day += 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - day);
    const ymd = formatYmd(date);
    for (let i = 1; i <= POSTS_PER_DAY; i += 1) {
      const post = makePost(locale, ymd, i);
      for (const tag of post.tags) {
        map.set(tag, (map.get(tag) ?? 0) + 1);
      }
    }
  }

  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => (b.count !== a.count ? b.count - a.count : a.tag.localeCompare(b.tag)));
}

function countPostsByTag(locale: Locale, tag: string) {
  let count = 0;
  for (let day = 0; day < DAYS_TO_KEEP; day += 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - day);
    const ymd = formatYmd(date);
    for (let i = 1; i <= POSTS_PER_DAY; i += 1) {
      const post = makePost(locale, ymd, i);
      if (post.tags.includes(tag)) count += 1;
    }
  }
  return count;
}

export function getPostsByTagPage(
  locale: Locale,
  tag: string,
  page: number,
  pageSize: number
) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 20;

  const total = countPostsByTag(locale, tag);
  const offset = (safePage - 1) * safePageSize;
  const result: Post[] = [];

  let produced = 0;
  let seen = 0;

  for (let day = 0; day < DAYS_TO_KEEP && produced < safePageSize; day += 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - day);
    const ymd = formatYmd(date);

    for (let i = 1; i <= POSTS_PER_DAY; i += 1) {
      const post = makePost(locale, ymd, i);
      if (!post.tags.includes(tag)) continue;
      if (seen < offset) {
        seen += 1;
        continue;
      }
      result.push(post);
      produced += 1;
      seen += 1;
      if (produced >= safePageSize) break;
    }
  }

  return {
    page: safePage,
    pageSize: safePageSize,
    total,
    posts: result,
  };
}

export function getPostBySlug(locale: Locale, slug: string): Post | null {
  const parsed = parseDailySlug(slug);
  if (!parsed) return null;
  const { ymd, index } = parsed;

  const today = formatYmd(new Date());
  const diffDays = Math.floor(
    (ymdToDate(today).getTime() - ymdToDate(ymd).getTime()) / (24 * 60 * 60 * 1000)
  );

  if (diffDays < 0 || diffDays >= DAYS_TO_KEEP) return null;
  return makePost(locale, ymd, index);
}
