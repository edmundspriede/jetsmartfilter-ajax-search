  <script>
        jQuery(document).ready(function($){

          // 1) For typed search -> fetch matches -> show them as checkboxes
          //    (similar to your existing lazy load approach).
          const $searchInputUser     = $('.customAjaxLoadedUser .jet-filter-items-search__input');
          const $checkboxFieldsetUser = $('.customAjaxLoadedUser .jet-checkboxes-list-wrapper');
          const defaultHTMLUser       = $checkboxFieldsetUser.html();

			function get_filter_users( el ) {
				let filterUsers = el.closest( '[data-content-provider]' );

				if ( ! filterUsers ) {
					return;
				}

				let provider = filterUsers.dataset.contentProvider;
				let queryId  = filterUsers.dataset.queryId;

				let filterGroup = getFilterGroup( provider, queryId );
				
				if ( ! filterGroup ) {
					return false;
				}
				
				let filters = filterGroup.filters.filter( ( f ) => { return jQuery.contains( f.$container[0], el ) } );
				
				return filters[0] ?? false;
			}
			
			function getFilterGroup( provider, queryId ) {
				return JetSmartFilters.filterGroups[`${provider}/${queryId}`] ?? false;
			}
			
      $searchInputUser.on('input', function(){
            const s = $(this).val().trim();
				
				    if (s.length <= 3) { return; }
				
				    if (!s) {
              // revert
              $checkboxFieldsetUser.html(defaultHTML);
              return;
            }
			  
		      	let filterUsers = get_filter_users( this );

            $.ajax({
              url: '/wp-admin/admin-ajax.php',
              method: 'GET',
              data: {
                action: 'my_filter_load_users',
                s: s
              },
              beforeSend: function(){
                $checkboxFieldsetUser.html('<div>Loading...</div>');
              },
              success: function(resp){
                if (resp.success) {
                  const userList = resp.data || [];
                  if (!userList.length) {
                    $checkboxFieldsetUser.html('<div>No results found</div>');
                    return;
                  }
                  let newHtml = '';
                  $.each(userList, function(i, val){
                    newHtml += `
                      <div class="jet-checkboxes-list__row jet-filter-row">
		<label class="jet-checkboxes-list__item">
		<input type="checkbox" class="jet-checkboxes-list__input" name="iccid" value="${val['user_id']}" data-label="${val}" aria-label="${val}">
		<div class="jet-checkboxes-list__button">
							<span class="jet-checkboxes-list__decorator">
					<i class="jet-checkboxes-list__checked-icon"><svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
	<path d="M26.109 8.844c0 0.391-0.156 0.781-0.438 1.062l-13.438 13.438c-0.281 0.281-0.672 0.438-1.062 0.438s-0.781-0.156-1.062-0.438l-7.781-7.781c-0.281-0.281-0.438-0.672-0.438-1.062s0.156-0.781 0.438-1.062l2.125-2.125c0.281-0.281 0.672-0.438 1.062-0.438s0.781 0.156 1.062 0.438l4.594 4.609 10.25-10.266c0.281-0.281 0.672-0.438 1.062-0.438s0.781 0.156 1.062 0.438l2.125 2.125c0.281 0.281 0.438 0.672 0.438 1.062z"></path>
</svg>
</i>
				</span>
						<span class="jet-checkboxes-list__label">${val['uname']}</span>
					</div>
	</label>
</div>`;
                  });
                  $checkboxFieldsetUser.html(newHtml);
				
				  if ( filterUsers ) {
				    filterUsers.$checkboxes = filterUsers.$container.find( 'input.jet-checkboxes-list__input' );
				    filterUsers.addFilterChangeEvent();  
				  }
                } else {
                  $checkboxFieldsetUser.html('<div>' + resp.data + '</div>');
                }
              },
              error: function(){
                $checkboxFieldsetUser.html('<div>Error loading data</div>');
              }
            });
          });

       

        });
</script>
