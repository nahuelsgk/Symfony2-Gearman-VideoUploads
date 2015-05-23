define(['views/baseView'], function (BaseView) {
  'use strict';

  var UploadVideoView = BaseView.extend({

    //el: '#content',
    tag: '',

    dragZone:'.drag-zone', //drag-zone highlight

    template: JST['client/templates/mobile/uploadVideo.jst'],

    maxSizeAllowed: 30, //(Mb) Max Size allowed
    extensionsAllowed: 'mp4,m4v,webm,wmv,mov', //Allowed extensions

    crios: '', //Allowed extensions

    events: {
      'click .enviar': 'saveFile',
      'click .select-file': 'triggerSelectFile',
      'change #fileInput':'fileSelected',
      'dragenter .drag-zone':'enterDrag',
      'dragleave .drag-zone':'dragOff',
      'drop .drag-zone':'droppedFile',
      'dragover .drag-zone':'dragOverFile',
      /*'click .readed2':'readedTerms',*/
      'click .send':'saveFile'
      /*'click .legal-terms a': 'onClickLegal'*/
    },

    initialize: function (tag) {
      this.tag = (typeof(tag) === 'string') ? tag : 'default';
      localStorage.setItem('upload::tag',this.tag);
    },

    render: function () {
      window.app.currentViewName = 'UploadVideo';

      this.$el.html(this.template({
        name: window.app.currentViewName,
        tag: this.tag,
        title: window.app.LocaleCollection.get(1).get("upload_video")[0].string,
        p1: window.app.LocaleCollection.get(1).get("upload_video")[1].string,
        p2: window.app.LocaleCollection.get(1).get("upload_video")[2].string,
        p3: window.app.LocaleCollection.get(1).get("upload_video")[3].string,
        b1: window.app.LocaleCollection.get(1).get("upload_video")[4].string,
        p4: window.app.LocaleCollection.get(1).get("upload_video")[5].stringMobile,
        p5: window.app.LocaleCollection.get(1).get("upload_video")[6].string,
        b2: window.app.LocaleCollection.get(1).get("upload_video")[7].string,
        fb: window.app.LocaleCollection.get(1).get("upload_video")[8].stringMobile
      }));

      var scope = this;

      setTimeout(function () {
        $('html, body').animate({scrollTop: $("#wrapper").offset().top}, 500);
        if (navigator.userAgent.match(/FB/)) {
          $('.navFB').css('display','block');
          $('.wrapper-drag-zone').css('display','none');
        }
        if(navigator.userAgent.match('CriOS')){
          scope.crios = "crios";
          $('.wrapper-loading').addClass("criosHide");
        }

      }, 500);

      return this;
    },
    /**
     * Elimina el highlight de del dragzone
     */
    removeHighLight: function () {
      $(this.dragZone).removeClass('hightlight');
      ////console.log('Se elimina hightlight');

    },
    /**
     * Añade clase higlight al drag zone
     */
    highLight: function () {
      if (!$(this.dragZone).hasClass('hightlight')) {
        ////console.log('Adding hightlight');
        $(this.dragZone).addClass('hightlight');
      }
    },
    /**
     * Evento al entrar con drag
     * @param event
     */
    enterDrag: function (event) {
      event.preventDefault();
      this.highLight();
    },
    /**
     * Evento al salir con drag.
     * @param event
     */
    dragOff: function (event) {
      event.preventDefault();
      this.removeHighLight();
    },
    /**
     * Se deja caer el file dentro de la zona.
     * @param event
     */
    droppedFile: function (event) {
      event.preventDefault();
      event.stopPropagation();

      ////console.log('dropped file');

      var files = event.originalEvent.dataTransfer.files;
      $('input[name="fileInput"]').prop("files", files);

      this.removeHighLight();

      this.fileSelected();

    },
    /**
     * Draggind over drag zone
     * @param event
     */
    dragOverFile: function (event) {
      event.preventDefault();
      this.highLight();

    },
    /**
     * Obliga al trigger del input oculto.
     * @param event
     */
    triggerSelectFile: function (event) {
      $('input[name="fileInput"]').trigger('click');
    },
    /**
     * Se lanza cuando se ha seleccionado un file.
     * @param event
     */
    fileSelected: function (event) {

      var selectedFile = $('input[name="fileInput"]').prop("files")[0];

      if (this.validateFile(selectedFile)) {
        ////console.log('Se ha seleccionado un file: '+ selectedFile.name);

        $('.upload-zone').hide();
        $('.wrapper-loading').show();
        $('.loading-text').html('<strong class="shake animated">' + selectedFile.name + '</strong>');
        $('.video-requeriment').hide();
        $('.legal-terms').show();

      } else {
        this.showError();
      }
    },
    /**
     * Check for a valid file (size and extensions)
     * @param file
     * @returns {boolean}
     */
    validateFile: function (file) {

      ////console.log("checkking files");

      //return ((file.size / 1024) / 1024 <= this.maxSizeAllowed && this.extensionsAllowed.search(file.name.split('.')[1].toLowerCase()) !== -1 ) ? true : false;
      return ((file.size / 1024) / 1024 <= this.maxSizeAllowed) ? true : false;

    },
    /**
     * Muestra el error de file no valido.
     */
    showError: function () {
      var scope = this;
      this.highLight();
      $('.video-requeriment').hide();
      $('.error-upload').show().css("display", "inline-block");
      $('.error-upload').html('<span class="animated shake">' + window.app.LocaleCollection.get(1).get("upload_video")[8].string + '</span>');
      setTimeout(function () {
        scope.removeHighLight();
        $('.error-upload').hide();
        $('.error-upload').html('');
        $('.video-requeriment').show('slow');
      }, 4000);

    },

    /**
     * Read terms controls.
     * @param event
     */
    readedTerms: function (event) {
      if ($('.readed2').hasClass('unCheck')) {
        $('.readed2').removeClass('unCheck').addClass('check');
        $('.send').prop("disabled", false);
      } else if ($('.readed2').hasClass('check')) {
        $('.readed2').removeClass('check').addClass('unCheck');
        $('.send').prop("disabled", true);
      }
    },

    /**
     * Salva file en server.
     */
    saveFile: function () {
      var video = $('input[name="fileInput"]')[0].files[0];
      var data = new FormData();

      var scope = this;

      //setting data to send
      data.append('file', video);
      data.append('hotSpot', this.tag);
      data.append('userId', window.app.user.get('id'));
      if(scope.crios=="crios"){
        $.ajax({
          type:'POST',
          url: _SERVER_PATH + '/upload-video',
          data: data,
          cache:false,
          contentType: false,
          processData: false,
          success: function (response) {
            if (response.confirm_token) {
              window.app.user.set("confirm_token", response.confirm_token);
              scope.successUpload();
            }
          },
          error: function(data){
            //console.log(data);
          }
        });
      }else{
        $.ajax({
          url: _SERVER_PATH + '/upload-video',
          xhr: function () { // custom xhr (is the best)
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', scope.showProgress, false);
            xhr.upload.addEventListener('load', scope.successUpload, false);
            xhr.upload.addEventListener('error', scope.errorUpload, false);
            xhr.upload.addEventListener('abort', scope.errorUpload, false);
            return xhr;
          },
          type: 'post',
          processData: false,
          contentType: false,
          data: data,
          success: function (response) {
            if (response.confirm_token) {
              window.app.user.set("confirm_token", response.confirm_token);
            }
          }
        });
      }

      /* var ajax = new XMLHttpRequest();
       ajax.upload.addEventListener('progress',this.showProgress,false);
       ajax.upload.addEventListener('load',this.successUpload,false);
       ajax.upload.addEventListener('error',this.errorUpload,false);
       ajax.upload.addEventListener('abort',this.errorUpload,false);

       ajax.open('POST',_SERVER_PATH+'/upload-video');
       ajax.send(data);*/


    },
    /**
     * Handler for the progress ajax event.
     * @param event
     */
    showProgress: function (event) {

      $('.loading-text').html('<strong>' + window.app.LocaleCollection.get(1).get("upload_video")[9].string + '</strong>');

      var currentPercernt = (event.loaded / event.total) * 100;

      $('.loading-video-bar').width(currentPercernt + '%');

    },
    /**
     * Success callback uploading video.
     * @param event
     */
    successUpload: function (event) {
      var tag = localStorage.getItem('upload::tag');
      localStorage.removeItem('upload::tag');

      $('.loading-text').html('<span class="blank-check"></span><strong class="uploaded">' + window.app.LocaleCollection.get(1).get("upload_video")[10].string + '</strong>');
      $('.legal-terms').hide();

      setTimeout(function () {
        window.app.navigate('m/signup/' + window.app.tag + '/thanks', {trigger: true});
      }, 3000);

    },

    /**
     * Something was wrong with the uploading.
     * @param event
     */
    errorUpload: function (event) {
      ////console.log("Se ha abortado la subida.");
      $('.drop-zone').addClass('hightlight');
      $('.error-upload').show();
      $('.error-upload').html('<span class="animated shake">' + window.app.LocaleCollection.get(1).get("upload_video")[11].string + '</span>');
    },

    /**
     * Setting the text in the loading bar.
     * @param htmlText
     */
    setLoadingBarText: function (htmlText) {
      $('.loading-text').html(htmlText);
    }/*,

    onClickLegal: function (e) {
      e.preventDefault();
      e.stopPropagation();
      $.fancybox.open({
        type: 'ajax',
        href: 'data/modal/' + window.app.locale + '.legal.html',
        scrolling: 'no',
        autoSize: false,
        width: '100%',
        height: '80%',
        padding: 0,
        beforeShow: function () {
          $('.fancybox-inner').addClass('terms');
          $('.fancybox-inner').css('visibility', 'hidden');
        },
        afterShow: function () {
          $('.fancybox-inner').jScrollPane();
          $('.jspPane').css('padding', '30px');
          $('.fancybox-inner').css('visibility', 'visible');
          $('.fancybox-close').attr('href', '#');
        }
      });
    }*/

  });

  return UploadVideoView;
});

