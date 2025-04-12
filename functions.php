
if ( ! function_exists('my_filter_load_users') ) {

    function my_filter_load_users() {
        global $wpdb;

        $search_text = isset($_REQUEST['s']) ? sanitize_text_field($_REQUEST['s']) : '';
        $sql = $wpdb->prepare( 
			  " SELECT DISTINCT m.user_id, CONCAT(mf.`meta_value`, ' ',  ml.`meta_value` , ' (',  me.`meta_value`, ')' ) uname
	    FROM wp_usermeta m
	    INNER JOIN wp_usermeta mf ON m.`user_id` = mf.`user_id` AND mf.`meta_key` = 'billing_first_name'
	    INNER JOIN wp_usermeta ml ON m.`user_id` = ml.`user_id` AND ml.`meta_key` = 'billing_last_name'
	    INNER JOIN wp_usermeta me ON m.`user_id` = me.`user_id` AND me.`meta_key` = 'billing_email'
	    
            WHERE ( m.`meta_key` = 'billing_first_name' AND m.meta_value  LIKE %s ) OR ( m.meta_key = 'billing_last_name' AND m.meta_value  LIKE %s ) OR ( m.meta_key = 'billing_email' AND m.meta_value  LIKE %s )
            LIMIT 10 "
         , '%' . $search_text . '%' ,  '%' . $search_text . '%' ,  '%' . $search_text . '%');
		
	   
	 
        $results = $wpdb->get_results($sql);
      		
        if (empty($results)) {
            wp_send_json_error('No results');
        } else {
            wp_send_json_success($results);
        }
    }

    add_action('wp_ajax_my_filter_load_users', 'my_filter_load_users');
    add_action('wp_ajax_nopriv_my_filter_load_users', 'my_filter_load_users');
}
