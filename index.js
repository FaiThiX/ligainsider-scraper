const players = [
  { name: 'Marvin Ducksch', url: 'https://www.ligainsider.de/marvin-ducksch_1894/' },
  // Add more players if needed
];


/****************************************************
* 
*
DO NOT EDIT BELOW THIS LINE
*
*
*****************************************************/

const axios = require('axios');
const cheerio = require('cheerio');
const { Feed } = require('feed');
const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

const dataFile = 'newsData.json';

// Load saved news data to avoid duplicates
let savedData = {};
if (fs.existsSync(dataFile)) {
  savedData = JSON.parse(fs.readFileSync(dataFile));
}

// Function to fetch news for a player
async function fetchPlayerNews(player) {
  try {
    const { data } = await axios.get(player.url);
    const $ = cheerio.load(data);
    const newsItems = [];

    // Fetch the club image
    const clubImg = $('.photo_column.pull-left a img').attr('src');
    const fullClubImgUrl = clubImg ? (clubImg.startsWith('http') ? clubImg : `https://www.ligainsider.de${clubImg}`) : null;

    // Select each news entry
    $('.news_container .news_row').each((index, element) => {
      const title = $(element).find('h3 a').text().trim();
      const link = 'https://www.ligainsider.de' + $(element).find('h3 a').attr('href');
      let date = null; // Placeholder for the date
      const dateText = $(element).find('.news_column_mid span').text().trim();
      const dateParts = dateText.match(/(\d{2})\.(\d{2})\.(\d{4}) - (\d{2}):(\d{2})/);
      if (dateParts) {
        const [ , day, month, year, hours, minutes ] = dateParts;
        date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
      } else {
        console.error('Failed to parse date:', dateText);
      }

      

      // Only add new items
      if (!savedData[player.name] || !savedData[player.name].includes(title)) {
        newsItems.push({ title, link, date, clubImage: fullClubImgUrl });
        console.log(`Found news for ${player.name}:`, title);
      }
    });

    return newsItems;
  } catch (error) {
    console.error(`Error fetching news for ${player.name}:`, error);
    return [];
  }
}

// Function to generate RSS feed
async function generateRSS() {
  let feed;
  const parser = new XMLParser(); // Create parser instance
  let existingItems = [];
  if (fs.existsSync('rss.xml')) {
    const existingFeed = fs.readFileSync('rss.xml', 'utf8');
    const parsedFeed = parser.parse(existingFeed);
    feed = new Feed(parsedFeed.rss.channel);
    existingItems = parsedFeed.rss.channel.item || [];
  } else {
    feed = new Feed({
      title: 'Ligainsider.de Updates',
      description: 'Latest news for selected players from LigaInsider.de',
      id: 'https://example.de/rss.xml',
      link: 'https://example.de/rss.xml',
      language: 'de',
      updated: new Date(),
    });
  }

  for (const player of players) {
    const newsItems = await fetchPlayerNews(player);

    newsItems.forEach(item => {
      feed.addItem({
        title: `${player.name}: ${item.title}`,
        id: item.link,
        link: item.link,
        date: item.date,
        image: item.clubImage,
      });

      // Track the news item to prevent duplicates
      if (!savedData[player.name]) savedData[player.name] = [];
      savedData[player.name].push(item.title);
    });

    // Add a timeout of 500ms between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Add existing items to the feed
  existingItems.forEach(item => {
    feed.addItem({
      title: item.title,
      id: item.link,
      link: item.link,
      date: new Date(item.pubDate),
      image: item.enclosure ? item.enclosure.url : undefined,
    });
  });

  // Save the RSS feed to a file
  fs.writeFileSync('rss.xml', feed.rss2());

  // Save the current state to prevent re-fetching old news
  fs.writeFileSync(dataFile, JSON.stringify(savedData, null, 2));
}

// Run the script
generateRSS();
