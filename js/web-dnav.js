/*! 7OS -Web dnav: https://github.com/7os/web-dnav
  ! Requires 7os/web-theme available @ https://github.com/7os/web-theme
*/
if (typeof sos == 'undefined') window.sos = {}; // Seven OS
if ( typeof sos.config !== 'object' ) sos.config = {};
sos.config.dnav = {
  iniTopPos : 0, // Integer: CSS initial top
  top : 0, // Integer: CSS scroll fix top
  pos : 'affix', // position: affix, fixed, relative,
  clearElem : '', // id of dom element to clear its top to avoid being blocked by dnav
  fullWidth : false, // Boolean: position full width/using theme .view-space
  stickOn : "", // element to follow scroll
  container : "", // container relative position style
  navList : {}
}
sos.dnav = {
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
    if (parseBool(init)) sos.dnav.init();
  },
  init : function (navList) {
    if ( typeof navList == "object") {
      var valid = sos.dnav.checkNavList(navList);
      if (!valid) {
        console.error("Invalid navigation list. Kindly reffer/comform to DragNag manual @ https://github.com/7os/web-dnav");
        return false;
      }
      sos.config.dnav.navList = valid;
      return true;
    } else {
      if (!sos.dnav.fetchFile(navList)) {
        return false;
      }
    }
    // proceed
    var list = sos.dnav.navList;
    if (typeof list !== "object" || list.length <=0 ) {
      console.error("No navigation list to display");
      return false;
    }
    var navpos = typeof config.dnav.pos !== 'undefined' ? config.dnav.pos : 'affix';
    var fullwidth = (config.dnav.fullwidth == 'true') || (parseInt(config.dnav.fullwidth) > 0 );
    var iconpos = (['left','right']).indexOf(config.dnav.iconpos) >= 0 ? config.dnav.iconpos : 'left';
    var html = '<nav id="dnav" class="theme-font color color-face '+navpos+'">';
    if( !fullwidth ){
      html += '<div class="view-space">';
    }
    html += '<button class="btn regular" id="scroll-left"></button>';
    html += '<button class="btn regular" id="scroll-right"></button>';
    html += '<div id="dnav-wrap" class="show-direction">';
    html += '<ul>';
    $.each(list,function(i,li){
      html += '<li class="'+li.classname;
      if( li.name == config.page.name ) html += ' current-nav';
      html += '"> <a "';
      if( typeof window[li.link] == 'function' ){
        html += " href=\"#\" onclick=\"window['"+li.link+"']()\" ";
      }else{
        html += " href=\"" + li.link + "\" ";
      }
      html += '>';
      if( iconpos == 'left' ) html += ' <i class="'+li.icon+'"></i> ';
      html += li.title;
      if( iconpos == 'right' ) html += ' <i class="'+li.icon+'"></i> ';
      html += '</a> </li>';

    });
    html += '</ul> </div>';
    if( !fullwidth ){
      html += '</div>';
    }
    html += '</nav>';
    $('body').prepend(html);
    showDNav();
    showDirection();
  },
  fetchFile : function (path) {
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
          sos.dnav.navList = data.result;
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
  }
};
function DnOptType(key,val){
  if( ["fullwidth"].includes(key) ){
    return ["true","on","yes","1",1,].includes( val.toLowerCase() );
  }else if( ["initop","top"].includes(key) ){
    return parseInt(val);
  }else{
    return val;
  }
}

function loadDnavSettings(obj){
  var conf = {};
  if( typeof obj =='object' ){
    conf = obj;
  }else{
    var inp = $('#settings-dnav');
    if( inp.length > 0 ){
      conf = inp.data();
    }
  }
  $.each(conf,function(key,val){
    if( Object.keys( config.dnav ).includes(key) ){
      config.dnav[key] = DnOptType(key,val);
    }
  });
}
function navWidth(){
  var elem = $(document).find('#dnav');
  if( elem.length > 0 ){
    var nav_width = 0,
        navs = $(document).find('#dnav ul li');
    navs.each(function(i){
      nav_width += $(this).outerWidth();
    });
    $(elem).find('ul:first').width(nav_width);
    showDirection();
  }
}
function showDNav(){
  if( $(document).find('#dnav.affix, #dnav.fixed').length > 0 ){
    var stickon = $( config.dnav.stickon );
    var ptop = stickon.length > 0
        ? ( stickon.offset().top + stickon.outerHeight() ) - $(window).scrollTop()
        : (
          typeof config.dnav.initop !== 'undefined' ? config.dnav.initop : 0
        ),
        nav = $(document).find('#dnav.affix').length > 0
          ? $(document).find('#dnav.affix')
          : $(document).find('#dnav.fixed');
    nav.animate({
      top : ptop,
      opacity : 1
    }, 200,function(){
      navWidth();
      // nav.removeClass('hidn');
      if( config.dnav.clearelem.length > 0 ){
        var elm = $(config.dnav.clearelem),
            margTop = elm.length <= 0 ? 0 : parseFloat( elm.css('margin-top').replace('px','') );
        if( elm.length > 0 ){
          elm.animate({marginTop : nav.outerHeight() + margTop },200);
        }
      }
    });
  }
}
function hideDNav(){
  if( $(document).find('#dnav.affix, #dnav.fixed').length > 0 ){
    var nav = $(document).find('#dnav.affix').length > 0
          ? $(document).find('#dnav.affix')
          : $(document).find('#dnav.fixed'),
        offtop = nav.outerHeight();
    nav.animate({
      top : -offtop,
      opacity : 0
    }, 200,function(){
      // nav.addClass('hidn');
      if( config.dnav.clearelem.length > 0 ){
        var elm = $(config.dnav.clearelem),
            margTop = elm.length <= 0 ? 0 : parseFloat( elm.css('margin-top').replace('px','') );
        if( elm.length > 0 ){
          elm.animate({marginTop : nav.outerHeight() - margTop},200);
        }
      }
    });
  }
}
function showDirection(){
  var elem = $(document).find('#dnav');
  if( elem.length > 0 ){
    var win_width = $(window).width(),
        nav_width = 0;
    $(document).find('#dnav ul li').each(function(){
      nav_width += $(this).outerWidth();
    });
    if( nav_width > win_width ){
      elem.addClass('show-direction');
    }else{
      // move to extreme left
      $('#dnav #dnav-wrap').animate({scrollLeft:0},300)
      elem.removeClass('show-direction');
    }
  }
}
function initdnav(){
  var navlist = config.dnav.src;
  if( !navlist.length > 0 ){
    console.error("<b>Drag nav error</b> <br>[src]: No URL was given in config to load dnav.");
  }else{
    var g_data = {
      group : config.page.group,
      format : 'json'
    }
    $.ajax({
      url : navlist,
      data : g_data,
      dataType : 'json',
      type : 'GET',
      success : function(data){
        if( data && (data.status == "0.0" || data.errors.length <= 0) ){
          var list = data.result;
          var navpos = typeof config.dnav.pos !== 'undefined' ? config.dnav.pos : 'affix';
          var fullwidth = (config.dnav.fullwidth == 'true') || (parseInt(config.dnav.fullwidth) > 0 );
          var iconpos = (['left','right']).indexOf(config.dnav.iconpos) >= 0 ? config.dnav.iconpos : 'left';
          var html = '<nav id="dnav" class="theme-font color color-face '+navpos+'">';
          if( !fullwidth ){
            html += '<div class="view-space">';
          }
          html += '<button class="btn regular" id="scroll-left"></button>';
          html += '<button class="btn regular" id="scroll-right"></button>';
          html += '<div id="dnav-wrap" class="show-direction">';
          html += '<ul>';
          $.each(list,function(i,li){
            html += '<li class="'+li.classname;
            if( li.name == config.page.name ) html += ' current-nav';
            html += '"> <a "';
            if( typeof window[li.link] == 'function' ){
              html += " href=\"#\" onclick=\"window['"+li.link+"']()\" ";
            }else{
              html += " href=\"" + li.link + "\" ";
            }
            html += '>';
            if( iconpos == 'left' ) html += ' <i class="'+li.icon+'"></i> ';
            html += li.title;
            if( iconpos == 'right' ) html += ' <i class="'+li.icon+'"></i> ';
            html += '</a> </li>';

          });
          html += '</ul> </div>';
          if( !fullwidth ){
            html += '</div>';
          }
          html += '</nav>';
          $('body').prepend(html);
          showDNav();
          showDirection();
        }else{
          console.error("Failed to load navigation from: "+navlist+". Error: "+data.message);

        }
      },
      error : function(){
        console.error("Failed to load navigation from: "+navlist);
      }
    });
  }
}
function dnav(prop){
  loadDnavSettings(prop);
  initdnav();
  $(window).bind('resize',function(){
    navWidth();
  });
  $(window).scroll(function(){
    if( $(document).find('#dnav.affix, #dnav.fixed').length > 0 && config.dnav.initop > 0 ){
      var stickon = $( config.dnav.stickon );
      var eTop = (stickon.offset().top + stickon.outerHeight()) - $(window).scrollTop();
      eTop = eTop >= config.dnav.top ? eTop : config.dnav.top;
      if( stickon.length > 0 ){
        var nav = $(document).find('#dnav.affix').length > 0
        ? $(document).find('#dnav.affix')
        : $(document).find('#dnav.fixed');
        nav.css({
          top : eTop+'px'
        });
      }
    }
  });
  $(document).on('click','#dnav #scroll-left',function(){
    var pos = $('#dnav #dnav-wrap').scrollLeft() - 100;
    $('#dnav #dnav-wrap').animate({scrollLeft:pos},300);
  });
  $(document).on('click','#dnav #scroll-right',function(){
    var pos = $('#dnav #dnav-wrap').scrollLeft() + 100;
    $('#dnav #dnav-wrap').animate({scrollLeft:pos},300);
  });

}
(function(){
  $(document).on('mouseover','#dnav.show-direction',function(){
    $('#dnav #scroll-left, #dnav #scroll-right').css({
      'display' : 'block',
      'opacity' : 1
    });
    $(document).on('mouseout','#dnav.show-direction',function(){
      $('#dnav #scroll-left, #dnav #scroll-right').css({
          'display' : 'none',
          'opacity' : 0
        });
    });
  });
})();
