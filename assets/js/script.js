jQuery(document).ready(function() {
		jQuery('#export_csv,.sk-fading-circle').hide();
		jQuery('#generate_csv').click(function (e) {
			var feed_url  = jQuery("#rss_url").val();
			if (feed_url.length == 0) {
				return alert('Input RSS url');
			}
			jQuery.ajax({
				url      : 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(feed_url),
				dataType : 'json',
				success  : function (data) {
					if (data.responseData.feed && data.responseData.feed.entries) {
							 	var array_content = [];
								jQuery.each(data.responseData.feed.entries, function (index, data_set) {
									var array_data = [];
									var array_title = [];
									jQuery.each(data_set,function (index_key, data_output) {
										if (index == 0) {
											array_title.push(index_key);
										}
										data_output = data_output.toString();
										data_output = data_output.replace(/<(?:.|\n)*?>/gm,'');
										data_output = data_output.replace(/(\r\n|\n|\r|,)/gm,'');
										array_data.push(data_output);
									});
									if (index == 0) {
										array_content.push(array_title);
									}
									array_content.push(array_data);
								});
								// console.log(array_content);
								// Pattern Full Data 
								var full_data_csv = "data:text/csv;charset=utf-8,";
								array_content.forEach(function(infoArray, index){
										 dataString = infoArray.join(",");
										 if (index < array_content.length) {
											full_data_csv += dataString+ "\n";
										 } else{
											full_data_csv += dataString;
										 }
								});
								var export_full_data_csv = encodeURI(full_data_csv);
								jQuery('#export_full_data_csv').attr('href',export_full_data_csv);
								// Pattern Full Detail
								var full_detail_csv = "data:text/csv;charset=utf-8,";
								array_content.forEach(function(infoArray, index){
									if (index != 0) {
										var url_data = infoArray[1];
										jQuery.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url_data) + '&callback=?', function(data){
											var data_set  = jQuery.parseHTML(data.contents);
											var wrapper_data = jQuery(data_set[49]);
											var text_data = wrapper_data.find('.post-wrap').text();
											var parent_set = jQuery('#list_full_detail_csv tbody');
											var html_pattern = '';
													html_pattern += '<tr>';
													html_pattern += '<td>';
													html_pattern += '<a href="'+url_data+'" target="_blank">'+url_data+'</a>';
													html_pattern += '</td>';
													html_pattern += '<td>';
													html_pattern += text_data;
													html_pattern += '</td>';
													html_pattern += '</tr>';
											parent_set.append(html_pattern);
											full_detail_csv += url_data+','+text_data+'\n';
											var export_full_detail_csv = encodeURI(full_detail_csv);
											jQuery('#export_full_detail_csv').attr('href',export_full_detail_csv);
										});
									}
								});
								// Display btn for export 
								jQuery('#generate_csv').hide();
								jQuery('.sk-fading-circle').show('slow',function() {
									jQuery('#export_csv').delay(2000).show('slow',function() {
										jQuery('.sk-fading-circle').hide('fast');
									});
								});
					}
				}
			});
		});
});