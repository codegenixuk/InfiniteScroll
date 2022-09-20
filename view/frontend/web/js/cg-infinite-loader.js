define(['uiComponent', 'jquery'], function (Component, $) {

    'use strict';

    return Component.extend({
        nextUrl: false,
        prevUrl: false,
        nextLocked: false,
        prevLocked: false,
        active: false,
        autoLoad: false,

        initialize: function (config, node) {

            this._super();

            let _this = this;

            _this.active = Boolean( config.active );

            _this.autoLoad = Boolean( config.autoLoad );

            if( _this.active ){

                $('body').addClass('cg-infinite-active');

                let params = new URL(document.location.href).searchParams;
                let current = parseInt(params.get('p'));

                if(!current){
                    current = 1;
                }

                if (!_this.prevUrl) {
                    _this.prevUrl = document.location.href;
                    if(!$('ol.product-items').data('page')){
                        $('ol.product-items').attr('data-page', current );
                    }
                }

                if (jQuery('.toolbar-products .pages-item-previous').length) {
                    $('#cg-infinite-loader-prev').insertBefore('.products.wrapper').css({'display': 'flex'});
                }

                if(jQuery('.toolbar-products .pages-item-next').length){
                    $('#cg-infinite-loader-next').css({'display':'flex'});
                }

                $('body').on('click', '.cg-infinite-loader-prev', function(e) {
                    e.preventDefault();
                    _this.prevAction();
                });

                $('body').on('click', '.cg-infinite-loader-next', function(e){
                    e.preventDefault();
                    _this.nextAction();
                });

                $('body').on('click', 'a.product-item-photo', function(e){
                    e.preventDefault();
                    const page = $(this).closest('.product-items').data('page');
                    const hash = $(this).closest('.product-item-info').attr('id');
                    const url = new URL(document.location.href.split('#')[0]);
                    url.searchParams.set('p', page);
                    const newUrl = url.href + '#' + hash;
                    window.history.pushState({}, '', newUrl);
                    window.location.href = $(this).attr('href');
                });

                if(_this.autoLoad){

                    $(window).scroll(function () {

                        if(!_this.nextLocked){
                            if (_this.isInViewport($('.cg-infinite-loader-next'))) {
                                _this.nextLocked = true;
                                $('.cg-infinite-loader-next').click();
                            }
                        }

                        if(!_this.prevLocked) {
                            if (_this.isInViewport($('.cg-infinite-loader-prev'))) {
                                _this.prevLocked = true;
                                $('.cg-infinite-loader-prev').click();
                            }
                        }

                    });

                }

            }

            return this;
        },

        isInViewport: function(el) {
            if (typeof jQuery === "function" && el instanceof jQuery) {
                el = el[0];
            }
            if(typeof el != "undefined"){
                const rect = el.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
                );
            }
        },

        prevAction: function(){
            let _this = this;

            let params = new URL(document.location.href).searchParams;
            let current = parseInt(params.get('p'));

            if(!current){
                current = 1;
            }

            if (!_this.prevUrl) {
                _this.prevUrl = document.location.href;
                if(!$('ol.product-items').data('page')){
                    $('ol.product-items').attr('data-page', current );
                }
            }

            params = new URL(_this.prevUrl).searchParams;
            current = parseInt(params.get('p'));

            if(!current){
                current = 1;
            }

            current = current - 1;
            let href = new URL(_this.prevUrl);
            href.searchParams.set('p', current.toString());
            _this.prevUrl = href.href;

            if(_this.prevUrl){
                $.ajax({
                    url: _this.prevUrl,
                    method: 'GET',
                    beforeSend: function () {
                        $('body').loader('show');
                    },
                    success: function (response) {
                        const page = $(response);

                        const products = page.find('.products.wrapper ol');

                        products.attr('data-page', current);

                        if(products.length) {
                            $('.products.wrapper').prepend(products);
                            _this.pageLinks();
                        }

                        if(!products.length) {
                            $('#cg-infinite-loader-prev').remove();
                        }

                        if(current <= 1){
                            $('#cg-infinite-loader-prev').remove();
                        }
                    }

                }).always(function () {
                    $('body').loader('hide');
                    _this.prevLocked = false;
                });
            }

        },

        nextAction: function(){
            let _this = this;

            let params = new URL(document.location.href).searchParams;
            let current = parseInt(params.get('p'));

            if(!current){
                current = 1;
            }

            if (!_this.nextUrl) {
                _this.nextUrl = document.location.href;
                if(!$('ol.product-items').data('page')){
                    $('ol.product-items').attr('data-page', current );
                }
            }

            params = new URL(_this.nextUrl).searchParams;
            current = parseInt(params.get('p'));

            if(!current){
                current = 1;
            }

            current = current + 1;
            let href = new URL(_this.nextUrl);
            href.searchParams.set('p', current.toString());
            _this.nextUrl = href.href;

            if(_this.nextUrl){
                $.ajax({
                    url: _this.nextUrl,
                    method: 'GET',
                    beforeSend: function () {
                        $('body').loader('show');
                    },
                    success: function (response) {
                        const page = $(response);

                        const products = page.find('.products.wrapper ol');

                        products.attr('data-page', current);

                        if(products.length) {
                            $('.products.wrapper').append(products);
                            _this.pageLinks();
                        }

                        if(!products.length) {
                            $('#cg-infinite-loader-next').remove();
                        }

                        let max = $('.pages-items li').length;

                        if($('.pages-item-previous').length){
                            max = max - 1;
                        }

                        if($('.pages-item-next').length){
                            max = max - 1;
                        }

                        if(current >= max){
                            $('#cg-infinite-loader-next').remove();
                        }

                    }
                }).always(function () {
                    $('body').loader('hide');
                    _this.nextLocked = false;
                });
            }
        },

        pageLinks: function(){
        },

        pushState: function(){
        }

    });

});
