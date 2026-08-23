const Parser = require('rss-parser');
const parser = new Parser({
  customFields: {
    item: ['enclosure', 'media:content']
  }
});

const RSS_FEEDS = {
  market: process.env.RSS_FEED_MARKET || 'https://www.cnbcindonesia.com/market/rss',
  news: process.env.RSS_FEED_NEWS || 'https://www.cnbcindonesia.com/news/rss',
  antara: process.env.RSS_FEED_ANTARA || 'https://www.antara-news.com/rss/ekonomi'
};

/**
 * Extract image URL from item content or enclosure
 */
function extractImageUrl(item) {
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
    return item['media:content'].$.url;
  }
  // Regex extract from content/description if img tag exists
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const content = item.content || item['content:encoded'] || item.snippet || item.summary || '';
  const match = imgRegex.exec(content);
  if (match && match[1]) {
    return match[1];
  }
  return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60'; // Default stock market image
}

/**
 * Strip HTML tags from description snippet
 */
function cleanDescription(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Get live news categorized
 */
const getNews = async (req, res) => {
  try {
    const category = (req.query.category || 'latest').toLowerCase();

    let targetFeed = RSS_FEEDS.market;
    if (category === 'politik') {
      targetFeed = RSS_FEEDS.news;
    }

    const feed = await parser.parseURL(targetFeed);
    
    let articles = feed.items.map(item => {
      let desc = cleanDescription(item.contentSnippet || item.content || item.summary);
      let catLabel = 'Market & Saham';

      const titleLower = item.title.toLowerCase();
      const descLower = desc.toLowerCase();

      if (titleLower.includes('emas') || titleLower.includes('minyak') || titleLower.includes('nikel') || titleLower.includes('cpo') || titleLower.includes('batubara') || titleLower.includes('komoditas') || descLower.includes('komoditas')) {
        catLabel = 'Komoditas';
      } else if (titleLower.includes('politik') || titleLower.includes('pemerintah') || titleLower.includes('prabowo') || titleLower.includes('jokowi') || titleLower.includes('dpr') || titleLower.includes('pemilu')) {
        catLabel = 'Politik';
      }

      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate ? new Date(item.pubDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Baru saja',
        isoDate: item.isoDate || new Date().toISOString(),
        image: extractImageUrl(item),
        snippet: desc.substring(0, 160) + (desc.length > 160 ? '...' : ''),
        category: catLabel
      };
    });

    // Filter if specific category requested
    if (category === 'komoditas') {
      articles = articles.filter(a => a.category === 'Komoditas' || a.title.toLowerCase().includes('emas') || a.title.toLowerCase().includes('minyak') || a.title.toLowerCase().includes('harga'));
    } else if (category === 'politik') {
      articles = articles.filter(a => a.category === 'Politik' || true); // If fetching politics feed, include all
    }

    return res.status(200).json({
      success: true,
      category: category,
      count: articles.length,
      articles: articles
    });

  } catch (error) {
    console.error('Error fetching RSS news:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil berita terkini.',
      error: error.message
    });
  }
};

module.exports = {
  getNews
};
