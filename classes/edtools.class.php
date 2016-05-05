<?php

/**
 * User: edirect
 * Date: 05/11/2015
 * Time: 15:43
 */
class EdTools
{
    private static $_instance = null;
    public $file;
    public $dir;
    public $assets_dir;
    public $assets_url;

    public function __construct($file = '')
    {

        $this->file = $file;
        $this->dir = dirname($this->file);
        $this->assets_dir = trailingslashit($this->dir) . 'assets';
        $this->assets_url = esc_url(trailingslashit(plugins_url('/assets/', $this->file)));
        add_shortcode('edirect_audit', array($this, 'ed_shortcode'));
        add_action('wp_enqueue_scripts', array($this, 'add_scripts_and_styles'), 10, 1);
        add_action('wp_ajax_edaudit_submit', array($this, 'edaudit_submit'));
        add_action('wp_ajax_nopriv_edaudit_submit', array($this, 'edaudit_submit'));
        add_action('admin_menu', array($this, 'edaudit_admin') );
        add_action('wp_ajax_edaudit_liste_demandeurs', array($this, 'edaudit_liste_demandeurs'));
        add_action('wp_ajax_nopriv_edaudit_liste_demandeurs', array($this, 'edaudit_liste_demandeurs'));
    }

    /**
     * EdTools Instance
     */
    public static function instance($file = '')
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self($file);
        }
        return self::$_instance;
    }

    /**
     * Shortcode extract html
     */
    public function ed_shortcode($attributes, $content = null)
    {
        $html = '';

        extract(shortcode_atts(array(
            'titre' => "Audit du visibilité sur internet",
        ), $attributes));
        $html .= '<a id="ed_close_btn" href="javascript:"><span class="fui-cross"></span></a>';
        $html .= '<div class="container-logo"><img src="http://localhost/edirect_site/wp-content/uploads/2015/09/logoedirect.jpg" /></div>';
        $html .= '<div id="edirect-audit">';
        $html .= '<h2 class="title_test">éTES-VOUS VISIBLE SUR INTERNET ? FAITES LE TEST EN 2 MINUTES !</h2>';
        $html .= ' <div id="gen_progress" class="gen_progress">
                                <div class="progress">
                                    <div class="progress-bar" style="width: 0%;">
                                        <div class="progress-bar-price">
                                            0 / 3
                                        </div>
                                    </div>
                                </div>
                            </div>';
        $html .= '<div class="main-audit">';
        $html .= '<form method="POST" action="#" id="audit_form" enctype="multipart/form-data">';
        $html .= '<div class="steps_form">';
        $html .= '<div class="genSlide" data-start="1" data-stepid="1" data-title="" data-dependitem="0" data-required="true">';
        $html .= '<h3>DISPOSEZ-VOUS D\'UNE CHARTE GRAPHIQUE ? (LOGO, CODES COULEURS)</h3>';
        $html .= '<label class="radio">
            <input type="radio" name="charte_graphique" data-required="true" id="charte-graphique1" value="oui" data-toggle="radio">
           Oui
          </label>';
        $html .= '<label class="radio">
            <input type="radio" name="charte_graphique" data-required="true" id="charte-graphique2" value="non" data-toggle="radio">
           Non
          </label>';
        $html .='<div class="container-btn"><a href="javascript:" class="btn btn-block btn-lg btn-default btn-suivant">Suivant</a>
         </div>';
        $html .='<div class = "errorMsg alert alert-danger">Veuillez selectionner un choix !</div>';
        $html .= '</div>';
        $html .= '<div class="genSlide" data-start="0" data-stepid="2" data-title="" data-dependitem="0" data-required="true">';
        $html .= '<h3>DISPOSEZ-VOUS D\'UN SITE WEB POUR VOTRE ENTREPRISE ?</h3>';
        $html .= '<label class="radio">
            <input type="radio" name="website" data-required="true" id="website_1" value="oui" data-toggle="radio">
           Oui
          </label>';
        $html .= '<label class="radio">
            <input type="radio" name="website" data-required="true" id="website_2" value="non" data-toggle="radio">
           Non
          </label>';
        $html .='<div class="container-btn"><a href="javascript:" class="btn btn-block btn-lg btn-default btn-suivant">Suivant</a>
 <a href="javascript:" class="linkPrevious">Retour en arrière</a>
</div>';
        $html .='<div class = "errorMsg alert alert-danger">Veuillez selectionner un choix !</div>';
        $html .= '</div>';
        $html .= '<div class="genSlide" data-start="0" data-stepid="3" data-title="" data-dependitem="0" data-required="true">';
        $html .= '<h3>Remplir vos informations de contact</h3>';
        $html .='<div class="row"><div class="form-group">';

        $html .='<label class="col-md-5">Nom & Prénom : </label>';
        $html .='<div class="col-md-7"><input type="text" value="" name="nom_prenom" class="form-control"></div>';
        $html .='</div></div>';
        $html .='<div class="row"><div class="form-group">';

        $html .='<label class="col-md-5">Société : </label>';
        $html .='<div class="col-md-7"><input type="text" value="" name="societe_" class="form-control"></div>';
        $html .='</div></div>';
        $html .='<div class="row"><div class="form-group">';

        $html .='<label class="col-md-5">Email : </label>';
        $html .='<div class="col-md-7"><input type="email" value="" name="email_" class="form-control"></div>';
        $html .='</div></div>';
        $html .='<div class="row">
<div class="form-group">';

        $html .='<label class="col-md-5">Téléphone (Fixe) : </label>';
        $html .='<div class="col-md-7"><input type="tel" value="" name="tel_" class="form-control"></div>';
        $html .='</div>';
        $html .='</div>';
        $html .='<div class="row">
<div class="form-group">';

        $html .='<label class="col-md-5">Mobile : </label>';
        $html .='<div class="col-md-7"><input type="tel" value="" name="mobile_" class="form-control"></div>';
        $html .='</div></div>';

        $html .='<div class="row"><div class="form-group">';

        $html .='<label class="col-md-5">Adresse : </label>';
        $html .='<div class="col-md-7"><textarea value="" name="adresse_" class="form-control"></textarea></div>';
        $html .='</div></div>';
        $html .='<div class="container-btn"><input type="submit" class="btn btn-primary btn-lg btn-block" id="submit_audit" value="Valider"/>
 <a href="javascript:" class="linkPrevious">Retour en arrière</a>
</div>';
        $html .='<div class = "errorMsg alert alert-danger">Veuillez selectionner un choix !</div>';
        $html .= '</div>';
        $html .= '</div>';
        $html .= '</form>';
        $html .= '</div>';
        $html .= '</div>';

        return $html;
    }

    public function add_scripts_and_styles()
    {
        wp_register_script('edaudit_js', esc_url($this->assets_url) . 'js/edaudit.js', array("jquery-ui-core", "jquery-ui-position"), '');
        wp_enqueue_script('edaudit_js');
        wp_localize_script( 'edaudit_js', 'ED',
            array(
                'ajaxurl' => admin_url( 'admin-ajax.php' )
            )
        );
        wp_enqueue_style('flat-ui', esc_url($this->assets_url) . 'css/flat-ui.min.css', '', '');
        wp_enqueue_style('edaudit_css', esc_url($this->assets_url) . 'css/edaudit.css', '', '');
        wp_register_script('flatuijs', esc_url($this->assets_url) . 'js/flat-ui.min.js', array(),false,true);
        wp_enqueue_script('flatuijs');

    }
    public function edaudit_submit()
    {
        global $wpdb;
        $audit_table = $wpdb->prefix . "audit_info";
        $data = array();
        $result = $wpdb->insert($audit_table, array(
            'site_web' => $_POST['website'],
            'logo' => $_POST['charte_graphique'],
            'nom_prenom' => $_POST['nom_prenom'],
            'societe' => $_POST['societe_'],
            'email' => $_POST['email_'],
            'adresse' => $_POST['adresse_']
        ));

        if($result)
        {
            $data['success'] = true;
        }
        else
        {
            $data['success'] = false;
        }

        echo json_encode($data);die();
    }

    public function edaudit_dashboard()
    {

          require_once('dashboard.php');

    }

    public function edaudit_admin()
    {
        global $wp_version;
        $icon_url = $wp_version >= 3.8 ? 'dashicons-list-view' : '';
        add_menu_page( 'eDirect Audit Test', 'eDirect Audit Test', 'manage_options', 'edaudit_dashboard', array($this,'edaudit_dashboard'), $icon_url, '31.3503' );
        add_action( 'admin_enqueue_scripts', array($this,'edaudit_admin_assets') );
      //  add_action( 'wp_ajax_edaudit_liste_demandeurs', array($this,'edaudit_liste_demandeurs') );

    }

    public function edaudit_admin_assets()
    {
        wp_enqueue_style('ed-dashboard-css',  esc_url($this->assets_url) . 'css/dashboard.css',array(), '');
        wp_enqueue_style('flat-ui', esc_url($this->assets_url) . 'css/flat-ui.min.css', '', '');
        wp_enqueue_script('ed-admin-js',  esc_url($this->assets_url) . 'js/admin.js',array(), '');
        wp_localize_script( 'ed-admin-js', 'ED_A',
            array(
                'ajaxurl' => admin_url( 'admin-ajax.php' ),
                'baseurl' => get_site_url()
            )
        );
    }


    public function edaudit_liste_demandeurs()
    {
        global $wpdb;
        $audit_table = $wpdb->prefix . "audit_info";
        $page = isset($_POST['page']) && ctype_digit($_POST['page']) ? $_POST['page']-1 : 0;
        $per_page = 9;
        $from = $page*$per_page;
        $to = $per_page;

        $sort_what = !isset($_POST['sort_what']) && $_POST['sort_what']!='created' ? 'created' : $_POST['sort_what'];
        $sort_order = !isset($_POST['sort_order']) && $_POST['sort_order']!='ASC' && !$_POST['sort_order']!='DESC' ? 'DESC' : $_POST['sort_order'];
        $order_query = "ORDER by $sort_what $sort_order";



            $submissions = $wpdb->get_results( "SELECT * FROM $audit_table "." $order_query LIMIT $from, $to", ARRAY_A );
             $total = $wpdb->get_var("SELECT COUNT(*) FROM $audit_table ");

        if ( is_array($submissions) && count($submissions)>0 )
        {
            foreach ($submissions as $key => $value) {
                if (((strtotime(current_time('mysql'))-strtotime($submissions[$key]['created']))/(60 * 60 * 24))<1)
                {
                    $submissions[$key]['created'] = $this->edaudit_time_ago(strtotime(current_time('mysql'))-strtotime($submissions[$key]['created']));
                }
                else
                {
                    $submissions[$key]['created'] = date(get_option('date_format'), strtotime($submissions[$key]['created']));
                }
            }
            echo json_encode(array('pages'=>ceil($total/$per_page),'submissions'=>$submissions,'total'=>$total));
            die();
        }
        else
        {
            echo json_encode(array('pages'=>'0','total'=>'0'));
            die();
        }


    }

    function edaudit_time_ago($secs){
        $bit = array(
            ' year'        => $secs / 31556926 % 12,
            ' week'        => $secs / 604800 % 52,
            ' day'        => $secs / 86400 % 7,
            ' hr'        => $secs / 3600 % 24,
            ' min'    => $secs / 60 % 60,
            ' sec'    => $secs % 60
        );


        foreach($bit as $k => $v)
        {
            if($v > 1)$ret[] = $v . $k;
            if($v == 1)$ret[] = $v . $k;
            if (isset($ret)&&count($ret)==2){break;}
        }
        if (isset($ret))
        {
            if (count($ret)>1)
            {
                array_splice($ret, count($ret)-1, 0, 'et');
            }
            return join(' ', $ret);
        }
        return '';
    }


}