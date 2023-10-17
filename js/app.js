import _ from 'lodash';

$(document).ready(function() {
  var BASE_URL = "https://api.themoviedb.org/3/";
  var POSTER_URL = "https://image.tmdb.org/t/p/w185//";
  var SEARCH_PARAMS = "search/movie";
  var API_KEY = "a9b6f566cd58dc6f439628ce8b73a1ba";
  var MOVIES_COUNTER = 0;
  var MY_MOVIES = [
    {title: "The Godfather", watched: false},
    {title: "Ghostbusters 1", watched: false},
    {title: "The Sixth Sense", watched: false},
    {title: "Goodfellas", watched: false},
    {title: "Casablanca", watched: false},
    {title: "Raiders of the Lost Ark", watched: false},
    {title: "Apocalypse Now", watched: false},
    {title: "The Usual Suspects", watched: true},
    {title: "The Shining", watched: false},
    {title: "The Departed", watched: false},
    {title: "Infernal Affairs", watched: false},
    {title: "Léon: The Professional", watched: false}
  ];

  var RESUME_OFFSET = $("#about-me").height();
  var MOVIES_OFFSET = RESUME_OFFSET + $("#resume").height();

  (function() {
    if($(window).width() <= 1000){
        $(".scroll-pane div").removeClass("vertical-middle-page");
        $(".last-panel").removeClass("last-panel");
        $(".dots").hide();
        $(".me-panel").addClass("add-margins");
        $(".resume-panel").addClass("add-margins");
        $(".movies-panel").addClass("add-margins");
        $("#about-me").addClass("top-padding mobile-min-height-100");
        $("#movies").addClass("mobile-min-height-100");
        $("#resume-header").removeClass("res-header");
        $("#copy").removeClass("sticky-footer").addClass("footer");
        $("#placeholder").hide();
        $(".parallax-window").hide();
    }else{
        $(".top-bott-padding").removeClass("top-bott-padding");
        $("#about-me").addClass("desktop-height-100");
        $("#movies").addClass("desktop-height-100");
    }
  })();

  var Utils = {
    showDescription: function(){
      $(this).css({opacity: 0.9});
    },
    hideDescription: function(){
      $(this).css({opacity: 0});
    }
  };


  var App = {
    init: function(){
      App.getMovies();
      App.bindEvents();
    },
    bindEvents: function(){
      // $(".dots").on("click",".scroll-dot",function(e){
      //   $(".dots .scroll-dot.dot-active").removeClass("dot-active");
      //   var toScroll = $(this).index() + 1;
      //   $(this).addClass("dot-active");
      //   switch(toScroll){
      //     case 1:
      //       window.scrollTo(0,0);
      //       break;
      //     case 2:
      //       window.scrollTo(0,RESUME_OFFSET);
      //       break;
      //     case 3:
      //       window.scrollTo(0,MOVIES_OFFSET);
      //       break;
      //   }
      // });
      // $(".dots").on("mouseenter",".scroll-dot",function(e){
      //   $(this).tooltip('show');
      // });
      $(".carousel-inner").on('mouseenter', '.carousel-row-container .overlay', Utils.showDescription);
      $(".carousel-inner").on('mouseleave', '.carousel-row-container .overlay', Utils.hideDescription);
      $("#download-res").on('click', function(e){
        window.open('https://docs.google.com/document/d/1JStCrhjqigr5wUVTwtIKbRZY58ohFzB5eQz5CWasXUk/edit?usp=sharing', '_blank', 'fullscreen=yes');
      });

      //calculate top position of section 2 and 3 on window resize
      $(window).resize(function(e){
        RESUME_OFFSET = $("#about-me").height();
        MOVIES_OFFSET = RESUME_OFFSET + $("#resume").height();
      });

      $(window).scroll(function(e){

        // console.log(e);
      });
    },
    getMovies: function(){
      var moviesList = MY_MOVIES;
      moviesList.forEach(function(movie){
        var params = {
          api_key: API_KEY,
          language: "en-US",
          query: movie.title,
        };
        var request = App.requestMovies(params);
        request.done(App.renderMovies);
      });

    },
    requestMovies: function(params){
      return $.ajax(BASE_URL+SEARCH_PARAMS, {
        dataType: "json",
        data: params
      });
    },
    renderMovies: function(response){
      if($(window).width() < 1000){
        var columnType = "mobile-col";
        var tileType = "";
        var remainder = MOVIES_COUNTER % 1;
      }else{
        var columnType = "image-col";
        var tileType = "image-tile";
        var remainder = MOVIES_COUNTER % 4;
      }

      var firstResult = response.results[0];
      if(remainder === 0){
        if(MOVIES_COUNTER === 0){
          var movieMarkup = `
            <div class="item active items${MOVIES_COUNTER}">
              <div class="row carousel-row-container">
                  <div class="col-sm-2 col-sm-offset-2 ${columnType} text-center">
                    <img class="${tileType}" src="${POSTER_URL+firstResult.poster_path}">
                    <div class="overlay">
                      <div class="description vertical-middle-page">
                         ${firstResult.overview}
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          `;
        }else{
          var movieMarkup = `
            <div class="item items${MOVIES_COUNTER}">
              <div class="row carousel-row-container">
                  <div class="col-sm-2 col-sm-offset-2 ${columnType} text-center">
                    <img class="${tileType}" src="${POSTER_URL+firstResult.poster_path}">
                    <div class="overlay">
                      <div class="description vertical-middle-page">
                         ${firstResult.overview}
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          `;
        }
        $(".carousel-inner").append(movieMarkup);
      }else{
        var movieMarkup = `
                <div class="col-sm-2 ${columnType} text-center">
                  <img class="${tileType}" src="${POSTER_URL+firstResult.poster_path}">
                  <div class="overlay">
                    <div class="description vertical-middle-page">
                       ${firstResult.overview}
                    </div>
                  </div>
                </div>

            `;
        var classToAppend = MOVIES_COUNTER - remainder;
        $(`.carousel-inner .items${classToAppend} .row`).append(movieMarkup);
      }
      MOVIES_COUNTER++;
    },
  };

  App.init();






  window.onload = function() {
      var elements = document.getElementsByClassName('typewrite');
      for (var i=0; i<elements.length; i++) {
          var toRotate = elements[i].getAttribute('data-type');
          var period = elements[i].getAttribute('data-period');
          if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
          }
      }
      // INJECT CSS
      var css = document.createElement("style");
      css.type = "text/css";
      css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff; animation: blink-caret 1s steps(1) infinite;}";
      document.body.appendChild(css);
  };


  var TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) {
          this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
          this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

        var that = this;
        var delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
          delta = this.period;
          this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
          this.isDeleting = false;
          this.loopNum++;
          delta = 500;
        }

        setTimeout(function() {
          that.tick();
        }, delta);
    };

});
