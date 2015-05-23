/**
 * Created by DEV on 08/04/2015.
 */


(function($) {

  $.fn.gallery = function() {

    var _this = this, $this = $(this);

    var  $slides = $this.find('.gallery-slides')
      ,$nav = $this.find('nav')
      ,$controls = $this.find('.arrow')
      ,$video = $this.find('#gallery-video')

    this.config = {};
    this.coordinates = {'x':1, 'y':1};
    this.slideId = null;
    this.counter = 0;
    this.video = null;

    this.init = function () {
      if($video) {
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      //console.log('# gallery');
      var hash = window.location.hash.replace(/^#/,'');

      this.config.nImages = $slides.find('li').length;
      this.config.cols = ($slides.data('cols') ? $slides.data('cols') : 3);
      if(this.config.cols!=99 && this.config.nImages%this.config.cols!=0 && this.config.nImages%3==0) {
        this.config.cols = 3;
      }
      if(this.config.nImages < this.config.cols) {
        this.config.cols = this.config.nImages;
      }
      this.config.rows = Math.ceil(this.config.nImages / this.config.cols);

      this.resize();
      $nav.css({
        'width' : (this.config.cols * ($nav.find('.slide-link').outerWidth(true)+2)) + 'px'
        ,'opacity' : .7
      });

      if(this.config.cols==1) $controls.filter('.left, .right').hide();
      if(this.config.rows==1) $controls.filter('.up, .down').hide();

      _this.showLoading(function(){
        if(hash.length==0 && $this.data('slide')) {
          hash = new String($this.data('slide'));
        }
        if(hash.length) {
          _this.goto(hash);
        } else {
          _this.move();
        }
      });
      _this.initSwipe();
    };
    this.resize = function(cb) {
      this.config.documentWith = $(document).width();
      this.config.documentHeight = $(document).height();
      this.config.width = (this.config.documentWith * this.config.cols);
      this.config.height = (this.config.documentHeight * this.config.rows);
      $slides.css({
        'width'     : this.config.width + 'px',
        'height'    : this.config.height + 'px'
      });
      $slides.find('li').css( {
        'width'     : this.config.documentWith + 'px',
        'height'    : this.config.documentHeight + 'px'
      });
      if(typeof cb == 'function') {
        return cb();
      }
    };
    this.move = function(coordinates, slideEffect) {
      if(coordinates) {
        _this.coordinates.x = coordinates.x;
        _this.coordinates.y = coordinates.y;
      }
      if(typeof slideEffect == 'undefined') {
        slideEffect = true;
      }

      if(!_this.isVoid(_this.coordinates.x,_this.coordinates.y)){
        if(!slideEffect) {
          _this.showLoading(function() {
            $slides.css({
              'margin-left'   : ((_this.coordinates.x-1) * _this.config.documentWith * -1) + 'px',
              'margin-top'    : ((_this.coordinates.y-1) * _this.config.documentHeight * -1) + 'px'
            });
          });
        } else {
          $slides.css({
            'margin-left'   : ((_this.coordinates.x-1) * _this.config.documentWith * -1) + 'px',
            'margin-top'    : ((_this.coordinates.y-1) * _this.config.documentHeight * -1) + 'px'
          });
        }
        $this.trigger('gallery.moving');
      } else {
        return false;
      }
    };
    this.navigate = function (direction) {
      var  x = _this.coordinates.x
        ,y = _this.coordinates.y
        ,moved = false;
      if(direction == 'up' && y > 1) {
        y--;
        moved = true;
      } else if(direction == 'down' && y < _this.config.rows && !_this.isVoid(x,y+1)) {
        y++;
        moved = true;
      } else if(direction == 'left' && x > 1) {
        x--;
        moved = true;
      }  else if(direction == 'right' && x < _this.config.cols && !_this.isVoid(x+1,y)) {
        x++;
        moved = true;
      }
      if(moved) {
        _this.move({'x':x, 'y':y});
      }
    };
    this.goto = function(id, slideEffect){
      var  $navs = $nav.find('.slide-link')
        ,i = $navs.index($navs.filter('#gallery-nav-'+id))
        ,coordinates = null;
      if(i!==-1) {
        coordinates = _this.getCoordinatesFromIndex(i);
      }
      _this.move(coordinates, slideEffect);
    };

    _this.showLoading = function(callback) {
      $.fancybox.showLoading();
      _this.toggleAll('hide');
      callback();
      setTimeout(function(){
        $.fancybox.hideLoading();
        _this.toggleAll();
      }, 1200);
    };
    _this.toggleAll = function(action) {
      if(action=='hide' || (typeof action == 'undefined' && $slides.is(':visible')) ) {
        $slides.hide();
        $nav.hide();
        $(".controls, .tip, .share").hide();
      } else {
        $slides.fadeIn(500);
        $nav.fadeIn(500);
        $(".controls, .tip, .share").fadeIn(500);
      }
    };
    _this.initSwipe = function() {
      if(typeof $.fn.swipe!='undefined') {
        $(".controls").swipe( {
          swipe : function(event, direction, distance, duration, fingerCount) {
            if(direction=='left') {
              _this.navigate('right');
            } else if(direction=='right') {
              _this.navigate('left');
            } else if(direction=='up') {
              _this.navigate('down');
            } else if(direction=='down') {
              _this.navigate('up');
            }
          }
          ,fingers : 'all'
        });
      }
    };
    _this.getCoordinatesFromIndex = function(i) {
      return {
        'x' : i%_this.config.cols + 1
        ,'y' : Math.floor(i/_this.config.cols) + 1
      };
    };
    _this.getIndexFromCoordinates = function(x, y) {
      return (_this.config.cols*(y-1) + x) - 1;
    };
    _this.isVoid = function(x,y) {
      return !(_this.getIndexFromCoordinates(x,y)<this.config.nImages);
    }
    _this.updateNav = function() {
      var i = _this.getIndexFromCoordinates(_this.coordinates.x, _this.coordinates.y) +1;

      $nav.find('a:nth-child('+i+')')
        .addClass('active')
        .siblings().removeClass('active');

      var $currentSlide = $slides.find('li:nth-child('+i+')').addClass('active');
      $currentSlide.siblings().removeClass('active');

      $controls.removeClass('disabled');

      if(_this.coordinates.x == 1) {
        $this.trigger('gallery.onMaxLeft');
      }
      if(_this.coordinates.x == _this.config.cols/* || _this.isVoid(_this.coordinates.x+1,_this.coordinates.y)*/) {
        $this.trigger('gallery.onMaxRight');
      }
      if(_this.coordinates.y == 1) {
        $this.trigger('gallery.onMaxTop');
      }
      if(_this.coordinates.y == _this.config.rows/* || _this.isVoid(_this.coordinates.x,_this.coordinates.y+1)*/) {
        $this.trigger('gallery.onMaxBottom');
      }

      var id = $currentSlide.attr('id');
      if(id) {
        _this.slideId = parseInt(id.replace( /^\D+/g, ''));
        $this.trigger('gallery.moved', [_this.slideId ]);
      }
    };
    _this.updateLocation = function() {
      //console.log('UPDATE LOCATION: DO NOTHING');
     /* if(history.pushState) {
        history.pushState(null, null, '#'+_this.slideId);
      } else {
        location.hash = '#'+_this.slideId;
      }*/
    };
    _this.updateShare = function() {
      var urlShare = location.origin + location.pathname + '?i=' + _this.slideId;
      $(".link-share").data({
        'i': _this.slideId
        ,'url': encodeURIComponent(urlShare)
        ,'image': encodeURIComponent($slides.find('.active').find('img').attr('src'))
      });
    };
    _this.pauseVideo = function() {
      if(_this.video != null) {
        _this.video.pauseVideo();
      }
    };
    _this.playVideo = function() {
      if(_this.video != null) {
        _this.video.playVideo();
      }
    };

    // Internal events listeners
    $this.on('gallery.moving', function(e) {
      _this.updateNav();
      _this.updateLocation();
      _this.updateShare();
      _this.counter++;
      if(_this.counter>1) {
        $(".tip").fadeOut('fast');
        $controls.fadeIn('fast');
      }
    });
    $this.on('gallery.moved', function(e, i) {
      if(i != 0) {
        _this.pauseVideo();
      } else {
        _this.playVideo();
      }
    });
    $this.on('gallery.onMaxTop', function(e, coordinates) {
      $controls.filter('.up').addClass("disabled");
    });
    $this.on('gallery.onMaxBottom', function(e, coordinates) {
      $controls.filter('.down').addClass("disabled");
    });
    $this.on('gallery.onMaxLeft', function(e, coordinates) {
      $controls.filter('.left').addClass("disabled");
    });
    $this.on('gallery.onMaxRight', function(e, coordinates) {
      $controls.filter('.right').addClass("disabled");
    });

    // Interface events listeners
    $controls.on('click', function(e) {
      e.preventDefault();
      _this.navigate($(this).data('direction'));
    });
    $nav.find('.slide-link').on('click', function(e) {
      e.preventDefault();
      //console.log("Click position controls");
      //_this.goto($(this).attr('href').replace(/^#/,''));
      _this.goto($(this).attr('id').split("-")[2]); //ex: gallery-nav-66533
    });
    $(window).on('resize', function(e) {
      _this.resize( _this.move );
    });
    $(window).on('keydown', function(e) {
      if(e.keyCode==38) {
        _this.navigate('up');
      } else if(e.keyCode==40) {
        _this.navigate('down');
      } else if(e.keyCode==37) {
        _this.navigate('left');
      } else if(e.keyCode==39) {
        _this.navigate('right');
      }
    });

    _this.init();

    return _this;
  };

}(jQuery));




