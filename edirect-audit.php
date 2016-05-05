<?php
/*
 * Plugin Name: Edirect Audit
 * Version: 1.0
 * Plugin URI: http://edirect-tunisie.com
 * Description: Auditeur du site en ligne.
 * Author: Jlidi Anouar (eDirect)
 * Author URI: http://edirect-tunisie.com/
 * Requires at least: 3.8
 * Tested up to: 4.0
 */

if (!defined('ABSPATH'))
    exit;

register_activation_hook(__FILE__, 'edaudit_install');
register_uninstall_hook(__FILE__, 'edaudit_uninstall');



global $wpe_current_formID;
$wpe_current_formID = 0;


require_once('classes/edtools.class.php');


function instance()
{
    $instance = EdTools::instance(__FILE__);
    return $instance;
}

function edaudit_install()
{
    global $wpdb;
    require_once(ABSPATH . '/wp-admin/includes/upgrade.php');

    $db_table_name = $wpdb->prefix . "audit_info";
    if ($wpdb->get_var("SHOW TABLES LIKE '$db_table_name'") != $db_table_name) {
        if (!empty($wpdb->charset))
            $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
        if (!empty($wpdb->collate))
            $charset_collate .= " COLLATE $wpdb->collate";

        $sql = "CREATE TABLE $db_table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
        site_web varchar(4) NOT NULL,
        logo varchar(4) NOT NULL,
        nom_prenom varchar(150) NOT NULL,
        societe varchar(50) NOT NULL,
        email varchar(50) NOT NULL,
        adresse varchar(500) NOT NULL,
        created timestamp NOT NULL,
		UNIQUE KEY id (id)
		) $charset_collate;";
        dbDelta($sql);

    }

    global $isInstalled;
    $isInstalled = true;
}



function edaudit_uninstall()
{
    global $wpdb;

    $table_name = $wpdb->prefix . "audit_info";
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
}

instance();