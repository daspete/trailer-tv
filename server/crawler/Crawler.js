var needle = require('needle'),
    cheerio = require('cheerio'),
    fs = require('fs');

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Crawler {

    constructor(data){
        this.sockets = data.sockets;

        this.maxPages = 452;
        this.page = 0;

        this.StartCrawler();
    }

    StartCrawler(){
        
        this.SendMessage('Crawler started...');
        
        this.StartPageCrawer();
    }

    async StartPageCrawer(){
        this.page++;

        if(this.page > this.maxPages){
            // finish
            this.StopCrawler();
            return;
        }

        this.SendMessage(`Crawling page ${ this.page } of ${ this.maxPages }`);

        try{
            await this.CrawlPage(this.page);//pause(200);
        }catch(e){}
        




        this.StartPageCrawer();
    }

    async CrawlPage(page){
        let res = await needle('get', 'http://de.ddl.me/moviez_00_3_2_' + page);

        let $ = cheerio.load(res.body);

        let items = $('.tableView1').find('tr');

        let movies = [];

        for(var i = 0; i < items.length; i++){
            var $item = $(items[i]);
    
            var url = 'http://de.ddl.me' + $item.attr('rel');
            
            var title = $item.find('.col1').find('.bold').text();
            var poster = $item.find('.col5').find('div').attr('style').match(/\((.*?)\)/)[1].replace(/('|")/g,'');
            var genres = $item.find('.col4').find('.gray').text().split(' ★ ');
            var year = $item.find('.ins').text();
    
            let movie = await this.GetMovie({
                url: url,
                title: title,
                poster: poster.replace('cover_mini', 'cover'),
                genres: genres,
                year: year
            });

            if(movie){
                let { body: existingMovie } = await needle('get', process.env.API_URL + '/movies?title=' + movie.title);

                if(existingMovie.length == 0){
                    movies.push(movie)

                    await needle('post', process.env.API_URL + '/movies', movie);
                }
            }
        }

        this.SendMessage('<b>' + movies.length + ' movies added</b>');
    }

    async GetMovie(movie){
        let res = await needle('get', movie.url);

        var $ = cheerio.load(res.body);

        var $trailer = $('.trailerbtn');
        if($trailer.length > 0){
            movie.trailer = $trailer.attr('rel');
        }else{
            return false;
        }

        var $description = $('.detailDesc');
        if($description.length > 0){
            movie.description = $description.text();
        }

        var scripts = $('#content script');//.html();
        var scriptContent = null;
        for(var i = 0; i < scripts.length; i++){
            if($(scripts[i]).html().indexOf('subcats') !== -1){
                scriptContent = $(scripts[i]).html();
                break;
            }
        }

        if(scriptContent == null) return false;

        var streamLinks = JSON.parse(scriptContent.split('var subcats = ').pop().split('; var mtype = 0;').shift());
        var streamLinks = streamLinks[Object.keys(streamLinks)[0]].links;

        if(typeof streamLinks !== 'undefined' && typeof streamLinks.Streamcloud !== 'undefined'){
            var streamcloudLinks = streamLinks.Streamcloud;
            var _linkArray = [];

            for(var i = 0; i < streamcloudLinks.length; i++){
                _linkArray.push(streamcloudLinks[i][3]);
            }

            if(_linkArray.length == 0) return false;

            movie.streams = _linkArray;
        }


        return movie;
    }



    SendMessage(message){
        Object.keys(this.sockets.connections).forEach((connectionId) => {
            this.sockets.connections[connectionId].socket.emit('crawler.message', {
                message: message
            })
        })
    }



    StopCrawler(){
        this.sockets.isCrawling = false;

        Object.keys(this.sockets.connections).forEach((connectionId) => {
            this.sockets.connections[connectionId].socket.emit('crawler.status', {
                isCrawling: this.sockets.isCrawling
            })
        })
    }

}

export default Crawler;