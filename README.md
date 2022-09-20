# Finance News


## Home Page
![](/images/finance-news-home.png)


The home page of the application shows is meant to brief the user quickly and show them news they care about the most. At first glance you notice the charts up top which represent the top ten equities in each index so you can how different sectors are preforming. It shows the ticker, percent change fo the day along with a quick daily chart that changes accent color (green or red) depending on the performance for that day. The app supports the four main sectors as shown but more can always be added this example shows the Nasdaq Composite Index and the imaghe below will show the Dow Jones Industrial.


![](/images/finance-news-home-dow.PNG)


As shown in the picturees you can also choose other sections of news like
 - Stock Specific
 - Consumer Goods
 - Financial
 - Healthcare
 - Industrial Goods
 - Services
 - Technologies
 - Utlities
 - General Market

And just show what another scetion looks like here is what General Market news looks like


![](/images/finance-news-general-market%20news.PNG)


So you can see users can get a broad overview of all major sectors with a click of the button.

## Stock Page


I would say this is the probably the highlight of the project, the ability to search for stocks and get key fundamentals along with live news happening now. Below is what the entire page looks like but obviosuly not all the news stories will fit into frame. Right now the API limit is 50 new stories per call, but I think 50 news articles is still plenty. 


I'll walk through each section and explain the data that you can extract from category. 


![](/images/finance-news-stockpage-total.PNG)


But before I walk through I did want to show a feature that I thought was pretty cool which I was able to implement. The accent color will change based off how the equity is performing. The green is image was from the day chart of Apple which was green today but when you click on the weekly chart button its been losing value so the UI will update accordingly. The sections this affects is the price and percent change color, the chart color and the earnings and ratings colors. The idea was right when you load into the page you can immediatley see how the stock is performing.


![](/images/finance-news-stockpage-color-change.PNG)

### Chart


The chart is pretty self explantory is just shows the historical price data of the stock, and you can look at four different time periods: daily, weekly, three-month, and yearly. Below is the yearly chart of Apple and since it's positive the UI renders green.


![](/images/finance-news-stockpage-chart-change.PNG)


### Earnings and Analysis


With the earnings bar chart you are able to see how the compoany has been preforming over the last four quarters with earnings estimates and actual reportings.


![](/images/finance-news-stockpage-earnings.PNG)


And the ratings section allows you see the trend of ratings for the company so you can get an insight about what analysats are thnking about it.


![](/images/finance-news-stockpage-ratings.PNG)


### News Section


The news section is compiled like the home screen with cards, the top is the source of the news, the middle is the title obviously but the positive, neutral and negative marks reprsent the sentiment of the news towards the company so you quickly pick up on the meesage of the piece.


![](/images/finance-news-stockpage-news.PNG)


If you hover over the card you get a quick text summary of the article of you dont feel like clicking on it and reading the entire article.


![](/images/finance-news-stockpage-news-hover.PNG)

## Possible Features


Some features I was thinking about adding was the ability to create stock list or create mock portfolios. This would probably be saved in local storage because my skills are not at the point (yet) that I would be able to build a database with unique logins but it's definately something to consider. Also having like a paper trading ability which just means you practice investing with virutal funds before you spend any of your money. This featuer would probably be quite intensive but something that would be pretty cool


## Thank you


Thanks for spending the time for getting to know my projecct the code isn't perfect but being on of my first React applications I hope you liked it as mush as I did!
