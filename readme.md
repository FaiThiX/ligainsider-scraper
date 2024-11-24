# LigaInsider.de Scraper

**Version:** 0.0.1  
**Author:** FaiThiX  

The LigaInsider.de Scraper is a Node.js tool for scraping [LigaInsider](https://www.ligainsider.de) to gather news about specified players. It generates an RSS feed with the latest updates and avoids duplicate entries by tracking previously fetched articles.

## Features

- Fetches news for a list of specified players.
- Extracts news titles, links, publication dates, and club images.
- Generates an RSS feed (`rss.xml`) with the latest updates.
- Prevents duplicate entries using a local state (`newsData.json`).

## Requirements

- Node.js (>= 14.0.0)
- Internet connection to fetch player data.

## Installation

1. Clone or download this repository.
2. Open a terminal in the project folder and install dependencies:

   ```bash
   npm install
   ```

## Usage

1. Edit the `players` array in `index.js` to include the players you want to track. For example:

   ```javascript
   const players = [
     { name: 'Marvin Ducksch', url: 'https://www.ligainsider.de/marvin-ducksch_1894/' },
     // Add more players if needed
   ];
   ```

2. Start the scraper:

   ```bash
   npm start
   ```

3. The RSS feed will be saved as `rss.xml` in the project's root directory.

## Project Structure

- **`index.js`**: The main script for scraping and RSS feed generation.
- **`package.json`**: Contains project metadata and dependencies.
- **`package-lock.json`**: Ensures consistent dependency versions.
- **`rss.xml`**: Generated RSS feed with the latest player news.
- **`newsData.json`**: Tracks previously fetched news to prevent duplicates.

## Dependencies

The following dependencies are used in the project:

- [axios](https://www.npmjs.com/package/axios) - A promise-based HTTP client.
- [cheerio](https://www.npmjs.com/package/cheerio) - A fast, flexible, and lean implementation of core jQuery for the server.
- [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser) - A lightweight library for parsing XML.
- [feed](https://www.npmjs.com/package/feed) - A library for creating RSS and Atom feeds.

## Notes

- A 500ms delay is added between requests to avoid overloading LigaInsider servers.
- Ensure that the player URLs in the `players` array are valid LigaInsider profile links.
- The script will automatically create `newsData.json` if it does not already exist.

## License

This project is licensed under the MIT License.

## Contribution

Contributions are welcome! If you'd like to suggest changes or report issues, feel free to open a pull request or an issue.

---

Enjoy tracking your favorite players with my LigaInsider Scraper!
