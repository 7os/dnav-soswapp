/*! 7OS -Web dnav: https://github.com/7os/dnav-soswapp
  ! Requires 7os/theme-soswapp available @ https://github.com/7os/theme-soswapp
*/
if (typeof sos == 'undefined') window.sos = {}; // Seven OS
if ( typeof sos.config !== 'object' ) sos.config = {};
if (typeof sos.config.dnav !== 'object') sos.config.dnav = {};
sos.dnav = {
  navList : {},
  defaultSet : function () {
    if (sos.config.dnav.iniTopPos === undefined)  sos.config.dnav.iniTopPos   = 0;
    if (sos.config.dnav.top === undefined)        sos.config.dnav.top         = 0;
    if (sos.config.dnav.pos === undefined)        sos.config.dnav.pos         = "affix";
    if (sos.config.dnav.clearElem === undefined)  sos.config.dnav.clearElem   = "";
    if (sos.config.dnav.fullWidth === undefined)  sos.config.dnav.fullWidth   = false;
    if (sos.config.dnav.stickOn === undefined)    sos.config.dnav.stickOn     = "";
    if (sos.config.dnav.container === undefined)  sos.config.dnav.container   = "";
    if (sos.config.dnav.iconPos   === undefined)  sos.config.dnav.iconPos     = "left";
  },
  setup : function (prop) {
    if( typeof prop == "object") {
      $.each(prop, function(index, val) {
        if (sos.config.dnav[index] !== undefined) {
          if (index in ["iniTopPos","top"]) {
            sos.config.dnav[index] = parseInt(val);
          } else if (index in ["fullWidth"]) {
            sos.config.dnav[index] = parseBool(val);
          } else {
            sos.config.dnav[index] = val;
          }
        }
      });
    }
  },
  init : function (navList) {
    if ( typeof navList == "object") {
      var valid = sos.dnav.checkNavList(navList);
      if (!valid) {
        console.error("Invalid navigation list. Kindly reffer/comform to DragNag manual @ https://github.com/7os/dnav-soswapp");
        return false;
      }
      sos.dnav.navList = valid;
      sos.dnav.populate();
    } else {
      sos.dnav.fetchFile(navList, sos.dnav.init);
    }
  },
  populate : function () {
    if (typeof sos.dnav.navList == 'object' && sos.dnav.navList.length > 0 ) {
      // proceed
      var list = sos.dnav.navList;
      if (typeof list !== "object" || list.length <=0 ) {
        console.error("No navigation list to display");
        return false;
      }
      var config = sos.config.dnav,
          navPos = (typeof config.pos !== 'undefined' ? config.pos : 'affix'),
          fullWidth = (parseBool(config.fullWidth) == true),
          iconPos = config.iconPos,
          html = '<nav id="sos-dnav" class="theme-font color color-face '+navPos+'">';
      if( !fullWidth ){
        html += '<div class="view-space">';
      }
      html += '<button class="sos-btn regular" id="sos-dnav-scroll-left"><i class="fas fa-angle-left"></i></button>';
      html += '<button class="sos-btn regular" id="sos-dnav-scroll-right"><i class="fas fa-angle-right"></i></button>';
      html += '<div id="sos-dnav-wrap" class="show-direction">';
      html += '<ul>';
      $.each(list,function(i,li){
        html += '<li class="' + (li.classname !== undefined ? li.classname : '');
        if( li.name == sos.config.page.name ) html += ' sos-dnav-current';
        html += '"> <a "';
        if( li.onclick !== '' || li.onclick !== undefined ){
          html += " onclick=\""+li.onclick+"\" ";
        }
        html += " href=\"" + li.link + "\" ";
        html += '>';
        if( iconPos == 'left' ) html += li.icon + ' ';
        html += li.title;
        if( iconPos == 'right' ) html += (' ' +li.icon);
        html += '</a> </li>';
      });
      html += '</ul> </div>';
      if( !fullWidth ){
        html += '</div>';
      }
      html += '</nav>';
      $('body').prepend(html);
      sos.dnav.show();
      sos.dnav.showDirection();
    } else {
      console.error("No navigation to show");
    }
  },
  fetchFile : function (path, callback) {
    var gData = {
      group : sos.config.page.group,
      format : 'json'
    }
    $.ajax({
      url : path,
      data : gData,
      dataType : 'json',
      type : 'get',
      success : function(data){
        if( data && (data.status == "0.0" || data.errors.length <= 0) ){
          callback(data.navlist);
          return true;
        }else{
          console.error("Failed to load navigation from: "+path+". Error: "+data.message);
        }
      },
      error : function(){
        console.error("Failed to load navigation from: "+path);
      }
    });
    return false;
  },
  checkNavList : function (navList) {
    return navList;
  },
  show : function () {
    if( $(document).find('#sos-dnav.affix, #sos.dnav.fixed').length > 0 ){
      var conf = sos.config.dnav,
          stickon = $(conf.stickOn);
      var ptop = stickon.length > 0
          ? ( stickon.offset().top + stickon.outerHeight() ) - $(window).scrollTop()
          : (
            typeof conf.iniTopPos !== undefined ? conf.iniTopPos : 0
          ),
          nav = $(document).find('#sos-dnav.affix').length > 0
            ? $(document).find('#sos-dnav.affix')
            : $(document).find('#sos-dnav.fixed');
      nav.animate({
        top : ptop,
        opacity : 1
      }, 200,function(){
        sos.dnav.width();
        // nav.removeClass('hidn');
        if( conf.clearElem.length > 0 ){
          var elm = $(conf.clearElem),
              margTop = elm.length <= 0 ? 0 : parseFloat( elm.css('margin-top').replace('px','') );
          if( elm.length > 0 ){
            elm.animate({marginTop : nav.outerHeight() + margTop },200);
          }
        }
      });
    }
  },
  hide : function(){
    if( $(document).find('#sos-dnav.affix, #sos-dnav.fixed').length > 0 ){
      var nav = $(document).find('#sos-dnav.affix').length > 0
            ? $(document).find('#sos-dnav.affix')
            : $(document).find('#sos-dnav.fixed'),
          offtop = nav.outerHeight();
      nav.animate({
        top : -offtop,
        opacity : 0
      }, 200,function(){
        // nav.addClass('hidn');
        if( sos.config.dnav.clearElem.length > 0 ){
          var elm = $(sos.config.dnav.clearElem),
              margTop = elm.length <= 0 ? 0 : parseFloat( elm.css('margin-top').replace('px','') );
          if( elm.length > 0 ){
            elm.animate({marginTop : nav.outerHeight() - margTop},200);
          }
        }
      });
    }
  },
  showDirection : function () {
    var elem = $(document).find('#sos-dnav');
    if( elem.length > 0 ){
      var win_width = $(window).width(),
          nav_width = 0;
      $(document).find('#sos-dnav ul li').each(function(){
        nav_width += $(this).outerWidth();
      });
      if( nav_width > win_width ){
        elem.addClass('show-direction');
      }else{
        // move to extreme left
        $('#sos-dnav #sos-dnav-wrap').animate({scrollLeft:0},300)
        elem.removeClass('show-direction');
      }
    }
  },
  width : function(){
    var elem = $(document).find('#sos-dnav');
    if( elem.length > 0 ){
      var nav_width = 0,
          navs = $(document).find('#sos-dnav ul li');
      navs.each(function(i){
        nav_width += $(this).outerWidth();
      });
      $(elem).find('ul:first').width(nav_width);
      sos.dnav.showDirection();
    }
  }
};

(function(){
  sos.dnav.defaultSet();
  $(window).bind('resize',function(){
    sos.dnav.width();
  });
  $(document).on('mouseover','#sos-dnav.show-direction',function(){
    $('#sos-dnav #sos-dnav-scroll-left, #sos-dnav #sos-dnav-scroll-right').css({
      'display' : 'block',
      'opacity' : 1
    });
    $(document).on('mouseout','#sos-dnav.show-direction',function(){
      $('#sos-dnav #sos-dnav-scroll-left, #sos-dnav #sos-dnav-scroll-right').css({
          'display' : 'none',
          'opacity' : 0
        });
    });
  });
  $(window).scroll(function(){
    if( $(document).find('#sos-dnav.affix, #sos-dnav.fixed').length > 0 && sos.config.dnav.iniTopPos > 0 ){
      var stickon = $( sos.config.dnav.stickOn );
      var eTop = (stickon.offset().top + stickon.outerHeight()) - $(window).scrollTop();
      eTop = eTop >= sos.config.dnav.top ? eTop : sos.config.dnav.top;
      if( stickon.length > 0 ){
        var nav = $(document).find('#sos-dnav.affix').length > 0
        ? $(document).find('#sos-dnav.affix')
        : $(document).find('#sos-dnav.fixed');
        nav.css({
          top : eTop+'px'
        });
      }
    }
  });
  $(document).on('click','#sos-dnav #sos-dnav-scroll-left',function(){
    var pos = $('#sos-dnav #sos-dnav-wrap').scrollLeft() - 100;
    $('#sos-dnav #sos-dnav-wrap').animate({scrollLeft:pos},300);
  });
  $(document).on('click','#sos-dnav #sos-dnav-scroll-right',function(){
    var pos = $('#sos-dnav #sos-dnav-wrap').scrollLeft() + 100;
    $('#sos-dnav #sos-dnav-wrap').animate({scrollLeft:pos},300);
  });
})();
