const express = require('express')
const axios = require('axios');
const cheerio = require('cheerio');
const multer = require('multer');
const cors = require('cors');
const morgan = require('morgan')
const app = express()
const cookieParser = require('cookie-parser');
const User = require('./models/users')
const userRoutes = require('./routes/usersRoutes')
const blogRoutes = require('./routes/blogRoutes')
const videoRoutes = require('./routes/videoRoutes')
const quoteRoutes = require('./routes/quoteRoutes')
const Avatar = require('./models/avatar')
const avatarRoutes = require('./routes/avatarRoutes')
require('dotenv').config()
const authenticateToken = require('./middlewares/authenticateToken');

const PORT = process.env.PORT || 3001
const storage = multer.memoryStorage(); // Store file in memory for now
const upload = multer({ storage });

//Middlewares

app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // To parse JSON data in request bodies
app.use('/users',userRoutes)
app.use('/avatar',avatarRoutes)
app.use('/blogs',blogRoutes)
app.use('/videos',videoRoutes)
app.use('/quote',quoteRoutes)
app.use(express.static('build'))


app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
const avatar = require('./models/avatar');

const db = async ()=>{
  try{
      const connect = await mongoose.connect(process.env.mongoDB_URL)
      console.log(`connected successfully ${connect.connection.host}` )
  }
  catch(error){
      console.log(`error is ${error}`)
  }
}

// Define a custom token for morgan to log custom information
morgan.token('custom-log', (req, res) => {
  return 'Custom log message';
});

// Routes
app.get('/' ,(req, res) => {
    res.send('Hello from the backend!');
});

app.get('/api/:symbol', async (req, res) => {
  try {
    // Extract the symbol from the route parameter (:symbol)
    const symbol = req.params.symbol;
    const url = `https://priceapi.moneycontrol.com/pricefeed/notapplicable/inidicesindia/in%${symbol}`;
    const headers = {'User-Agent': 'Mozilla/5.0',}; // You can use any User-Agent string here
    
    // Make the GET request to the external API with axios
    const response = await axios.get(url, { headers });
    res.json(response.data);
  } catch (error) {
    // Handle errors if the request to the external API fails
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.get('/scrape', async (req, res) => {
  try {
    const url = 'https://www.moneycontrol.com/news/business/';

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const newsArticles = [];

    $('h2').each((index, element) => {
      const headline = $(element).find('a').attr('title');
      const link = $(element).find('a').attr('href');
      newsArticles.push({ headline, link });
    });
    res.json(newsArticles);
  } catch (error) {
    console.error('Error while scraping:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/apicrypto/:symbol', async (req, res) => {
  try {
    // Extract the symbol from the route parameter (:symbol)
    const symbol = req.params.symbol;
    const url = `https://priceapi.moneycontrol.com/pricefeed/cryptocurrency/v1/ticker?symbol=${symbol}`;
    const headers = {'User-Agent': 'Mozilla/5.0',}; // You can use any User-Agent string here
    
    // Make the GET request to the external API with axios
    const response = await axios.get(url, { headers });
    res.json(response.data);
  } catch (error) {
    // Handle errors if the request to the external API fails
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.get('/apicurrency', async (req, res) => {
  try {
    const url = `https://priceapi.moneycontrol.com/pricefeed/nse/currencyfuture/USDINR?expiry=2023-08-18`; //USDINR?expiry=2023-08-11
    const headers = {'User-Agent': 'Mozilla/5.0',}; // You can use any User-Agent string here
    
    // Make the GET request to the external API with axios
    const response = await axios.get(url, { headers });
    res.json(response.data);
  } catch (error) {
    // Handle errors if the request to the external API fails
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.get('/goldRate', async (req, res) => {
  try {
    const url = 'https://www.91mobiles.com/finance/gold-rate-in-india';
    const headers = {'User-Agent': 'Mozilla/5.0',}; // You can use any User-Agent string here
    
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const goldRate = $('.c-prc').first().text().trim();
    
    res.json({ rate: goldRate });
    
  } catch (error) {
    // Handle errors if the request to the external API fails
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.get('/getfinnifty', async (req, res) => {
  try {
    const url = 'https://www.moneycontrol.com/indian-indices/nifty-fin-service-47.html';
    const headers = {'User-Agent': 'Mozilla/5.0',}; // You can use any User-Agent string here

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    console.log(response)
    const inpriceValue = $('.inprice1 input').attr('value');
    res.json({ value: inpriceValue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ count: userCount });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/userapi', authenticateToken, async (req, res) => {
  try {
      const userId = req.user.id;
      const user = await User.findById(userId); // Fetch user data from MongoDB

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
  } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/marketnews', async (req, res) => {
  try {
    const url = 'https://www.livemint.com/market';
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const headlines = [];
    
    $('.headline[data-title]').each((index, element) => {
      const headline = $(element).attr('data-title');
      const link = $(element).find('a').attr('href');
      headlines.push({ headline, link });
    });

    res.json(headlines);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while scraping the data.' });
  }
});

//Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  db();
});
