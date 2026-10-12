import type { Gradient } from './gradients'

/** A category offered in the first-run setup: a ready-made section of popular sites. */
export interface Category {
  id: string
  title: string
  gradient: Gradient
  links: [name: string, url: string][]
}

export const CATALOG: Category[] = [
  {
    id: 'streaming',
    title: 'Streaming',
    gradient: ['#8e2de2', '#c471f5'],
    links: [
      ['YouTube', 'https://youtube.com/feed/subscriptions'],
      ['Twitch', 'https://twitch.tv/'],
      ['Kick', 'https://kick.com/'],
      ['Netflix', 'https://www.netflix.com/'],
      ['Disney+', 'https://www.disneyplus.com/'],
      ['Prime Video', 'https://www.primevideo.com/']
    ]
  },
  {
    id: 'gaming',
    title: 'Gaming',
    gradient: ['#dd2476', '#ff512f'],
    links: [
      ['Steam', 'https://store.steampowered.com/'],
      ['SteamDB Charts', 'https://steamdb.info/charts/'],
      ['Epic Games', 'https://store.epicgames.com/'],
      ['IGN', 'https://www.ign.com/'],
      ['PC Gamer', 'https://www.pcgamer.com/'],
      ['Nexus Mods', 'https://www.nexusmods.com/'],
      ['HowLongToBeat', 'https://howlongtobeat.com/']
    ]
  },
  {
    id: 'social',
    title: 'Social',
    gradient: ['#fc4a1a', '#f7b733'],
    links: [
      ['Instagram', 'https://www.instagram.com/'],
      ['Facebook', 'https://www.facebook.com/'],
      ['X', 'https://x.com/'],
      ['Reddit', 'https://www.reddit.com/'],
      ['TikTok', 'https://www.tiktok.com/'],
      ['LinkedIn', 'https://www.linkedin.com/']
    ]
  },
  {
    id: 'messaging',
    title: 'Messaging',
    gradient: ['#0072ff', '#00c6ff'],
    links: [
      ['Gmail', 'https://mail.google.com/'],
      ['Outlook', 'https://outlook.live.com/'],
      ['WhatsApp', 'https://web.whatsapp.com/'],
      ['Messenger', 'https://www.messenger.com/'],
      ['Discord', 'https://discord.com/app'],
      ['Telegram', 'https://web.telegram.org/']
    ]
  },
  {
    id: 'shopping',
    title: 'Shopping',
    gradient: ['#11998e', '#38ef7d'],
    links: [
      ['Amazon', 'https://www.amazon.com/'],
      ['eBay', 'https://www.ebay.com/'],
      ['AliExpress', 'https://www.aliexpress.com/'],
      ['Etsy', 'https://www.etsy.com/'],
      ['JB Hi-Fi', 'https://www.jbhifi.com.au/'],
      ['EB Games', 'https://www.ebgames.com.au/']
    ]
  },
  {
    id: 'music',
    title: 'Music',
    gradient: ['#43cea2', '#185a9d'],
    links: [
      ['Spotify', 'https://open.spotify.com/'],
      ['YouTube Music', 'https://music.youtube.com/'],
      ['SoundCloud', 'https://soundcloud.com/'],
      ['Apple Music', 'https://music.apple.com/']
    ]
  },
  {
    id: 'ai',
    title: 'AI',
    gradient: ['#f7971e', '#ffd200'],
    links: [
      ['Claude', 'https://claude.ai/'],
      ['ChatGPT', 'https://chatgpt.com/'],
      ['Gemini', 'https://gemini.google.com/'],
      ['Perplexity', 'https://www.perplexity.ai/']
    ]
  },
  {
    id: 'productivity',
    title: 'Productivity',
    gradient: ['#bdc3c7', '#ffffff'],
    links: [
      ['Google Drive', 'https://drive.google.com/'],
      ['Calendar', 'https://calendar.google.com/'],
      ['Keep', 'https://keep.google.com/'],
      ['Notion', 'https://www.notion.so/'],
      ['Trello', 'https://trello.com/']
    ]
  },
  {
    id: 'dev',
    title: 'Dev',
    gradient: ['#0072ff', '#38ef7d'],
    links: [
      ['GitHub', 'https://github.com/'],
      ['Stack Overflow', 'https://stackoverflow.com/'],
      ['MDN', 'https://developer.mozilla.org/'],
      ['CodePen', 'https://codepen.io/'],
      ['npm', 'https://www.npmjs.com/']
    ]
  },
  {
    id: 'news',
    title: 'News',
    gradient: ['#dd2476', '#f7b733'],
    links: [
      ['BBC News', 'https://www.bbc.com/news'],
      ['Reuters', 'https://www.reuters.com/'],
      ['The Guardian', 'https://www.theguardian.com/'],
      ['The Verge', 'https://www.theverge.com/'],
      ['Hacker News', 'https://news.ycombinator.com/']
    ]
  },
  {
    id: 'design',
    title: 'Design',
    gradient: ['#ee9ca7', '#ffdde1'],
    links: [
      ['Dribbble', 'https://dribbble.com/'],
      ['Behance', 'https://www.behance.net/'],
      ['Figma', 'https://www.figma.com/'],
      ['Pinterest', 'https://www.pinterest.com/'],
      ['Unsplash', 'https://unsplash.com/']
    ]
  }
]
