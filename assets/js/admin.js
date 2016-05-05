/**
 * Created by edirect on 16/11/2015.
 */

function getliste(page, sort_what, sort_order)
{
    sort_what = sort_what || window.subs_sort_what || 'created';
    sort_order = sort_order || window.subs_sort_order || 'DESC';
    window.subs_sort_what = sort_what;
    window.subs_sort_order = sort_order;
    jQuery('.subs_list .loader').show();
    jQuery('.subs_list').removeClass('no-subs');
    jQuery.ajax( {
        url: ED_A.ajaxurl,
        type: "POST",
        data: 'action=edaudit_liste_demandeurs&page='+page+'&sort_what='+sort_what+'&sort_order='+sort_order,
        dataType: "json"
    } ).done(function(response) {
            jQuery('.subs_list .sortable').removeClass('ASC DESC');
            jQuery('.subs_list [data-sort="'+sort_what+'"]').removeClass('ASC DESC').addClass(sort_order);
            jQuery('.subs_list .tbody').html('');
            jQuery('.subs_list .loader').hide();
            if (response.total)
            {
               spinTo('#total-results',response.total);
            }
            for (line in response.submissions)
            {

                var new_line = '';
                var new_line = new_line + "<div class='tr'>";
                var new_line = new_line + "<span style='width:10%'><a class='load-submission' data-id='"+response.submissions[line].id+"'>"+response.submissions[line].id+"</a></span>";
                var new_line = new_line + "<span style='width:20%'><a class='load-submission' data-id='"+response.submissions[line].nom_prenom+"'>"+response.submissions[line].nom_prenom+"</a></span>";
                var new_line = new_line + "<span style='width:20%'><a class='load-submission' data-id='"+response.submissions[line].email+"'>"+response.submissions[line].email+"</a></span>";
                var new_line = new_line + "<span style='width:10%'><a class='load-submission' data-id='"+response.submissions[line].societe+"'>"+response.submissions[line].societe+"</a></span>";
                var new_line = new_line + "<span style='width:10%'><a class='load-submission' data-id='"+response.submissions[line].adresse+"'>"+response.submissions[line].adresse+"</a></span>";
                var new_line = new_line + "<span style='width:10%'><a class='load-submission' data-id='"+response.submissions[line].site_web+"'>"+response.submissions[line].site_web+"</a></span>";
                var new_line = new_line + "<span style='width:10%'><a class='load-submission' data-id='"+response.submissions[line].logo+"'>"+response.submissions[line].logo+"</a></span>";
                var new_line = new_line + "<span style='width:10%'><a class='load-submission' data-id='"+response.submissions[line].created+"'>"+response.submissions[line].created+"</a></span>";
                var new_line = new_line + "</div>";
                jQuery('.subs_list .tbody').append(new_line);
            }
            var i = 1;
            jQuery('.subs_list .pagination > div').html('');
            while (i <= response.pages) {
                var add_class = i==page ? 'active' : '';
                jQuery('.subs_list .pagination > div').append('<span class="'+add_class+'">'+i+'</span>');
                i++;
            }
            if(response.pages==0)
            {
                jQuery('.subs_list').addClass('no-subs');
            }
        })
        .fail(function(response) {
            jQuery(this).find('.response').text('Connection error');
        })
        .always(function(response) {
        });
}

function spinTo(selector, to)
{
    var from = jQuery(selector).text()=='' ? 0 : parseFloat(jQuery(selector).text());
    var to = isNaN(parseFloat(to)) ? 0 : parseFloat(to);
    duration = (to-from) < 100 ? 200 : 700;
    jQuery({someValue: from}).animate({someValue: parseFloat(to)}, {
        duration: duration,
        easing:'swing',
        context: to,
        step: function() {
            if (parseInt(to)!=parseFloat(to))
            {
                val = (Math.ceil(this.someValue*10))/10;
            }
            else
            {
                val = Math.ceil(this.someValue);
            }
            jQuery(selector).text(val);
        }
    });
    setTimeout(function(){
        jQuery(selector).text(parseFloat(to));
    }, duration+100);
}
getliste(1,'email','ASC');