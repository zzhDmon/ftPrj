var gulp = require('gulp'),
  babel = require('gulp-babel'),
  gutil = require('gulp-util'),
  bower = require('bower'),
  htmlmin = require('gulp-htmlmin'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  minifyCss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  sh = require('shelljs'),
// var jshint=require('gulp-jshint'),
  ngmin = require('gulp-ngmin'),  
  stripDebug = require('gulp-strip-debug'), 
  ngAnnotate = require('gulp-ng-annotate'),
  imagemin = require('gulp-imagemin');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(['./stylesheets/**/*.scss','./www/**/*.scss'],['sass'],function(event){
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});


gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
//语法检查
gulp.task('jshint', function () {
  return gulp.src('js/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

// 1.压缩lib/js
var libjs=["./www/lib/js/jquery/jquery.min.js","./www/lib/js/angular-upload/ng-file-upload.shim.min.js",
          "./www/lib/js/angular-upload/ng-file-upload.min.js","./www/lib/js/pinchzoom/pinchzoom.js",
          "./www/lib/js/sortable/Sortable.min.js","./www/lib/js/clipboard/clipboard.min.js",
          "./www/lib/js/alloy-crop/transform.js","./www/lib/js/alloy-crop/alloy_finger.js",
          "./www/lib/js/alloy-crop/alloy_crop.js",
          "./www/lib/js/img-enable-show/hammer.min.js",
          "./www/lib/js/img-enable-show/img.directive.js",
          "./www/lib/js/img-enable-show/img.service.js",
          "./www/lib/js/ionic-ripple/ionic-ripple.js",
          "./www/lib/js/ionrangeslider/ion.rangeSlider.min.js","./www/lib/js/pinyin/pinyin_dist_firstletter.min.js",
          "./www/lib/js/pinyin/pinyinUtil.min.js","./www/lib/js/qrcode/qrcode.min.js",
          "./www/lib/js/quill/quill.js",
          "./www/lib/js/autho-linker/Autolinker.min.js","./www/lib/js/angular-elastic/elastic.js",
          "./www/lib/js/ng-storage/ngStorage.min.js","./www/lib/js/moment/moment.min.js",
          "./www/lib/js/moment/angular-moment.min.js","./www/lib/js/echarts/echarts.min.js",
          // "./www/lib/js/fake-select/index.js",
          "./www/lib/js/swiper/swiper.min.js",
          "./www/lib/js/wx/jweixin-1.2.0.js","./www/lib/js/scroll_picker/scrollPicker.js",
          "./www/lib/js/add-cart-fly/add-cart-fly.min.js","./www/lib/js/html2canvas/html2canvas.min.js",
  ]
gulp.task('minifylibjs', function() { 
  return gulp.src(libjs)  
      // .pipe(babel()) 
      .pipe(ngAnnotate().on('error', function(e){
        console.log(e);
      }))
      .pipe(ngmin({dynamic: false}))  
      .pipe(stripDebug())  
      .pipe(uglify().on('error', function(e){
        console.log(e);
      }))  
      .pipe(concat('libs.min.js'))  
      .pipe(gulp.dest('./www/dist/js'))  
}); 
// 2.all controll
gulp.task('minifycontrolljs', function() {  
  return gulp.src('./www/views/**/*.js') 
      .pipe(babel().on('error', function(e){
        console.log(e);
      }))
      .pipe(ngAnnotate().on('error', function(e){
        console.log(e);
      }))
      .pipe(ngmin({dynamic: false}))  
      .pipe(stripDebug())  
      .pipe(uglify())  
      .pipe(concat('controlls.min.js'))
      .pipe(gulp.dest("./www/dist/js"))   
});
// 2.all route
gulp.task('minifyroutejs', function() {  
  return gulp.src(['./www/views/**/*.route.js','./www/views/**/*.directive.js']) 
      .pipe(babel().on('error', function(e){
        console.log(e);
      }))
      .pipe(ngAnnotate().on('error', function(e){
        console.log(e);
      }))
      .pipe(ngmin({dynamic: false}))  
      .pipe(stripDebug())  
      .pipe(uglify())  
      .pipe(concat('routes.min.js'))
      .pipe(gulp.dest("./www/dist/js"))   
});

// wechat rebuild
// 3. app.js factor.js 
gulp.task('minifymainjs', function() { 
  // return gulp.src(jspaths.script)  
  return gulp.src('./www/js/**/*.js')  
      .pipe(babel().on('error', function(e){
        console.log(e);
      }))
      .pipe(ngAnnotate().on('error', function(e){
        console.log(e);
      }))
      .pipe(ngmin({dynamic: false}))  
      .pipe(stripDebug())  
      .pipe(uglify())  
      .pipe(concat('app.min.js'))  
      .pipe(gulp.dest("./www/dist/js"))  
}); 
// 4.图片
gulp.task('minifyimage', function() {
  gulp.src('./www/imgs/**/*.{png,jpg,gif,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('./www/imgs'));//输入压缩完成的图片到dist目录
});


// 5. index.html
gulp.task('minifyhtml', function () {
  var options = {
      removeComments: true,//清除HTML注释
      collapseWhitespace: true,//压缩HTML
      collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
      minifyJS: true,//压缩页面JS
      minifyCSS: true//压缩页面CSS
  };
  gulp.src('./www/index.html')
      .pipe(htmlmin(options))
      .pipe(concat('index.min.html')) 
      .pipe(gulp.dest('./www/dist/html'));
});
