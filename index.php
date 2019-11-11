<?php
require_once "app.init.php";
require_once APP_BASE_INC;
\TymFrontiers\HTTP\Header::badRequest(true, "No relative path here");
?>
<!DOCTYPE html>
<html lang="en" dir="ltr" manifest="./site.webmanifest">
  <head>
    <meta charset="utf-8">
    <title>7 OS Web - Plugin</title>
    <?php include PRJ_INC_ICONSET; ?>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
    <meta name="robots" content='nofollow'>
    <!-- Theming styles -->
    <link rel="stylesheet" href="<?php echo WHOST; ?>/7os/theme-soswapp/css/theme.min.css">
    <link rel="stylesheet" href="<?php echo WHOST; ?>/7os/theme-soswapp/css/theme-<?php echo PRJ_THEME; ?>.min.css">
    <!-- optional plugin -->
    <!-- <link rel="stylesheet" href="css/plugin-soswapp/plugin-soswapp.css">
    <link rel="stylesheet" href="css/dnav-soswapp/dnav-soswapp.css">
    <link rel="stylesheet" href="css/faderbox-soswapp/faderbox-soswapp.css"> -->
    <!-- Project styling -->
    <link rel="stylesheet" href="<?php echo \html_style("base.css"); ?>">
  </head>
  <body>
    <?php include PRJ_INC_HEADER; ?>
    <section id="main-content">
      <div class="view-space">
        <div class="sec-div padding -p20">
          <h1>7 OS Web- Theme</h1>
          <h2>Resource list</h2>
          <ul>
            <li>
              <h4>/7os/theme-soswapp/theme-soswapp.css</h4>
              <p>CSS file</p>
            </li>
          </ul>
          <p>
            <i class="fa fa-users"></i> icon
          </p>
        </div>
      </div>
    </section>
    <?php include PRJ_INC_FOOTER; ?>
    <!-- Required scripts -->
    <script src="<?php echo WHOST; ?>/7os/jquery-soswapp/js/jquery.min.js">  </script>
    <script src="<?php echo WHOST; ?>/7os/js-generic-soswapp/js/js-generic.min.js">  </script>
    <script src="<?php echo WHOST; ?>/7os/theme-soswapp/js/theme.js"></script>
    <!-- optional plugins -->
    <!-- <script src="<?php //echo WHOST; ?>/7os/plugin-soswapp/js/plugin.min.js"></script> -->
    <!-- <script src="<?php //echo WHOST; ?>/7os/dnav-soswapp/js/dnav.min.js"></script> -->
    <!-- <script src="<?php //echo WHOST; ?>/7os/faderbox-soswapp/js/faderbox.min.js"></script> -->
    <!-- project scripts -->
    <script src="<?php echo \html_script ("base.min.js"); ?>"></script>
    <script type="text/javascript">
      // console.log(sos);
      // shrinkPlaceholder();
    </script>
  </body>
</html>
