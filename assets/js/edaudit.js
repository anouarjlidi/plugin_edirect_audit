/**
 * Created by edirect on 05/11/2015.
 */
var step = 0;
(function ($) {
    $(document).ready(function () {
        init();
    });

    function init() {
            var step = 0;
            jQuery('.seo-test .d-btn').click(ouvrir_audit);
            jQuery('.steps_form .gen_progress').fadeIn(500);
            ed_etape_suivant();
            jQuery('.audit_container .btn-suivant').click(function () {
                ed_etape_suivant();
            });

        jQuery('.audit_container .linkPrevious').click(function () {
               ed_etape_precedent();
        });
            jQuery('[data-toggle="radio"]').radiocheck();

        jQuery( "#audit_form" ).submit(function( event ) {
            event.preventDefault();
            var form2 = jQuery('#audit_form');
            var error = false;
            $("#audit_form input[type=text], #audit_form input[type=email], #audit_form textarea").each(function(){
                var input = jQuery(this);
                if(input.val() == "")
                {
                    error = true;
                    input.addClass("error_input");
                    input.attr("placeholder", "Champ requis !");
                }
                else
                {
                    input.removeClass("error_input");
                    error = false;
                }

            });
            $("#audit_form input[type=email]").each(function(){
                var input = jQuery(this);
                if (validateEmail(input.val()) == false) {
                    input.addClass("error_input");
                    input.attr("placeholder", "Email non valide !");
                    error = true;

                }
                else {
                    input.removeClass("error_input");
                    error = false;
                }
            });
            $("#audit_form input[type=tel]").each(function(){
                var input = jQuery(this);
                if (phonenumber(input.val()) == false) {
                    input.addClass("error_input");
                    input.attr("placeholder", "Numéro non valide !");
                    error = true;

                }
                else {
                    input.removeClass("error_input");
                    error = false;
                }
            });

            if(error == false) {
                jQuery.ajax({
                    type: "POST",
                    url: ED.ajaxurl,
                    data: "action=edaudit_submit&" + form2.serialize(),
                    dataType: "json",
                    success: function (data) {
                        if (data['success'] == true) {
                            form2.fadeOut(500);
                            jQuery(".main-audit").append("<div class='final-success'><i class='fui-check'></i><span>Votre test a bien ait avec success! une email a ete envoyé a votre boite email</span></div>");
                            jQuery(".main-audit").find(".final-success").slideDown(800, function () {
                            });

                        }
                    }
                });
            }
        });
    }

    var ed_initial_overflowBody = "auto";
    var ed_initial_overflowHtml = "auto";
    function ouvrir_audit() {
        var form_id = 0;
        var cssClass = jQuery(this).attr('class');
        cssClass = cssClass.split(' ');
        jQuery.each(cssClass, function (c) {
            c = cssClass[c];
            if (c.indexOf('form-') > -1) {
                form_id = c.substr(c.indexOf('-') + 1, c.length);
            }
        });
        ed_initial_overflowBody = jQuery('body').css('overflow-y');
        ed_initial_overflowHtml = jQuery('html').css('overflow-y');
        jQuery('body,html').css('overflow-y','hidden');
        jQuery('.audit_container').show().animate({
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            opacity: 1
        }, 500, function () {
            jQuery('.gen_progress').fadeIn(1000);
            jQuery('#ed_close_btn').delay(500).fadeIn(500);
            jQuery('#ed_close_btn').click(function () {
                ferme_audit();
            });
        });
    }

    function ferme_audit() {
        jQuery('.audit_container').animate({
            top: '50%',
            left: '50%',
            width: '0px',
            height: '0px',
            opacity: 0
        }, 500, function () {
            jQuery('body').css('overflow-y',ed_initial_overflowBody);
            jQuery('html').css('overflow-y',ed_initial_overflowHtml);
        });

    }

    function ed_etape_precedent() {
        jQuery('.errorMsg').hide();

      /*  jQuery(' #estimation_popup.wpe_bootstraped[data-form="' + formID + '"] #mainPanel .genSlide').eq(form.step - 1).find('div.selectable.checked:not(.prechecked)').each(function () {
            wpe_itemClick(jQuery(this), false, formID);
        });*/

        step--;
        ed_changer_etape('back');
    }

    function ed_changer_etape(action) {
        if (jQuery('.steps_form .genSlide').eq(step).attr('data-dependitem') > 0 ) {
            if (action && action == 'back') {
                step--;
                ed_changer_etape('back');
            } else {
                step++;
                ed_changer_etape('next');
            }
        } else {
            if (step > 1) {
            //    jQuery('body').animate({ scrollTop: jQuery('#estimation_popup.wpe_bootstraped[data-form="' + formID + '"]  #genPrice').offset().top - 100 }, 250);
            }

          //  jQuery('#estimation_popup.wpe_bootstraped[data-form="' + formID + '"] .quantityBtns').removeClass('open');
        //    jQuery('#estimation_popup.wpe_bootstraped[data-form="' + formID + '"] .quantityBtns').fadeOut(form.animationsSpeed / 4);
            jQuery(' .steps_form .genSlide').fadeOut(500);

           // jQuery(' #estimation_popup.wpe_bootstraped[data-form="' + formID + '"] #mainPanel .btn-next').fadeOut(form.animationsSpeed / 2);
         //   jQuery(' #estimation_popup.wpe_bootstraped[data-form="' + formID + '"] #mainPanel .linkPrevious').fadeOut(form.animationsSpeed / 2);
            var $title = jQuery('.steps_form .genSlide').eq(step - 1).find('h2.stepTitle');
            var $content = jQuery('.steps_form .genSlide').eq(step - 1).find('.genContent');
            $content.find('.genContentSlide').removeClass('active');
            $content.find('.genContentSlide').eq(0).addClass('active');

            $content.animate({
                opacity: 0
            }, 500);
            $title.removeClass('positioned');
            $title.css({
                "-webkit-transition": "none",
                "transition": "none"
            });

            jQuery('.steps_form .genSlide').eq(step - 1).css('opacity', 0).show();
            var heightP = jQuery('.steps_form .genSlide').eq(step - 1).outerHeight() + 100;
           // jQuery(' #estimation_popup.wpe_bootstraped[data-form="' + formID + '"] #mainPanel').css('min-height', heightP);
            jQuery('.steps_form .genSlide').eq(step - 1).hide().css('opacity', 1);
            var animSpeed = 500 * 4.5;

            if (step == 1) {
              //  wpe_initPanelResize(formID);
                animSpeed = 500* 2.5;
                jQuery('.steps_form .genSlide').eq(step - 1).fadeIn(500);
            } else {
                jQuery('.steps_form .genSlide').eq(step - 1).delay(1000).fadeIn(1000);
            }

           /* if (jQuery('#estimation_popup.wpe_bootstraped[data-form="' + formID + '"] #finalSlide .estimation_project').length > 0) {
                var contentForm = wpe_getFormContent(formID);
                var content = contentForm[3];
                jQuery('#estimation_popup.wpe_bootstraped[data-form="' + formID + '"] #finalSlide .estimation_project textarea').val(content);
                jQuery('#estimation_popup.wpe_bootstraped[data-form="' + formID + '"] #finalSlide .estimation_total input').val(form.price);

            }*/
            setTimeout(function () {
                $title.css({
                    "-webkit-transition": "all 0.3s ease-out",
                    "transition": "all 0.3s ease-out"
                }).addClass('positioned');
                $content.delay(form.animationsSpeed).animate({
                    opacity: 1
                }, form.animationsSpeed);
                jQuery('.main-audit .btn-next').css('display', 'inline-block').hide();
                jQuery('.main-audit .btn-next').delay(500 * 2).fadeIn(500);
                jQuery('.main-audit .linkPrevious').delay(500 * 3).fadeIn(500);

                $content.delay(750).find('[data-toggle="tooltip"]').tooltip({html: true});
                setTimeout(function () {
                    $content.find('.wpe_itemQtField').each(function () {
                        if (jQuery(this).parent().next().is('.itemDes')) {
                            jQuery(this).css({
                                marginTop: 20 + jQuery(this).parent().next().outerHeight()
                            });
                        }
                    });
                }, 300);


            }, animSpeed);
        }
        updateScroll(step);

    }

    function ed_etape_suivant() {
        jQuery('.errorMsg').hide();
        var chkSelection = true;
        var chkSelectionitem = true;
        if (step > 0) {
            if (jQuery('.steps_form .genSlide').eq(step - 1).data('required') == true) {
                chkSelection = false;

                if ((jQuery('.steps_form .genSlide').eq(step - 1).find('input[type="radio"]:checked').length > 0) || (jQuery('.steps_form .genSlide').eq(step - 1).find('input[type=text][data-title].checked').length > 0)) {
                    chkSelection = true;
                    chkSelectionitem = true;
                }
            }
            jQuery('.steps_form .genSlide').eq(step - 1).find('.has-error').removeClass('has-error');
            jQuery('.steps_form .genSlide').eq(step - 1).find('input[type=text][data-required="true"]').each(function () {
                if (jQuery(this).val().length < 1) {
                    chkSelectionitem = false;
                    jQuery(this).parent().addClass('has-error');
                }
            });

        }
        if (chkSelection && chkSelectionitem) {
            step++;
            ed_changer_etape('next');
        } else if (!chkSelection || !chkSelectionitem) {
            jQuery('.errorMsg').slideDown();
        }
    }

    function updateScroll(i)
    {
        var percent = (i * 100) / 3;
        if (percent > 100) {
            percent = 100;
        }
        jQuery('.gen_progress .progress .progress-bar-price').html((i) + '/' + 3);
        jQuery('.gen_progress .progress .progress-bar').css('width', percent + '%');
        jQuery('.gen_progress .progress .progress-bar-price').animate({
            left: percent + '%'
        }, 70);
    }

    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    function phonenumber(inputtxt)
    {
        var phoneno = /^[0-9]+$/;
        if(inputtxt.match(phoneno))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

})(jQuery);