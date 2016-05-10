jQuery(document).ready(function() {
		function export_csv_set(feed_url,config_multiple_import,index_set) {
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
										if (index == 0 && index_set == 0 ) {
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
								// Pattern Full Data 
								if (!config_multiple_import) {
									var full_data_csv = "data:text/csv;charset=utf-8,";
								} else{
									var full_data_csv = "";
								}
								array_content.forEach(function(infoArray, index){
										 dataString = infoArray.join(",");
										 if (index < array_content.length) {
											full_data_csv += dataString+ "\n";
										 } else{
											full_data_csv += dataString;
										 }
								});
								if (!config_multiple_import) {
									var export_full_data_csv = encodeURI(full_data_csv);
									jQuery('#export_full_data_csv').attr('href',export_full_data_csv);
								} else{
									jQuery(document).data('raw_full_data_csv['+index_set+']',full_data_csv);
								}
								// Pattern Full Detail
								if (!config_multiple_import) {
									var full_detail_csv = "data:text/csv;charset=utf-8,";
								}else{
									var full_detail_csv = '';
								}
								array_content.forEach(function(infoArray, index){
									if (index != 0) {
										var url_data = infoArray[1];
										jQuery.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url_data) + '&callback=?', function(data){
											var data_set  = jQuery.parseHTML(data.contents);
											var visual_dom = jQuery('<output>').append(data_set);
											var wrapper_data = jQuery('#wrapper',visual_dom);
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
											if (!config_multiple_import) {
												parent_set.append(html_pattern);
											}
											var data_text_output = text_data;
											data_text_output = data_text_output.replace(/<(?:.|\n)*?>/gm,'');
											data_text_output = data_text_output.replace(/(\r\n|\n|\r|,)/gm,'');
											full_detail_csv += url_data+','+data_text_output+'\n';
											if (!config_multiple_import) {
												var export_full_detail_csv = encodeURI(full_detail_csv);
												jQuery('#export_full_detail_csv').attr('href',export_full_detail_csv);
											}else{
												jQuery(document).data('raw_full_detail_csv['+index_set+']',full_detail_csv);
											}
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
		}
		function import_input_url() {
			var feed_url  = jQuery("#rss_url").val();
			if (feed_url.length == 0) {
				return alert('Input RSS url');
			}
			return feed_url;
		}
		function import_csv_set() {
			jQuery("#base_url_import").on('change',function(e) {
				var feed_url = '';
				var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
				if (regex.test(jQuery("#base_url_import").val().toLowerCase())) {
					if (typeof (FileReader) != "undefined") {
						var reader = new FileReader();
	          reader.onload = function (e) {
	          	feed_url += e.target.result;
	          	jQuery('#import_data_csv').val(feed_url);
	          }
	         	reader.readAsText(jQuery("#base_url_import")[0].files[0]);
					}else{
						alert("This browser does not support HTML5.");
					}
				}else{
					alert("Please upload a valid CSV file.");
				}
			return false;
			});
		}
		function pre_export(index) {
			var init_csv = "data:text/csv;charset=utf-8,";
			var raw_full_data_csv = '';
			setTimeout(function(){ 	
				console.log(jQuery(document).data());
				for (var i = 0; i <= index-1; i++) {
					raw_full_data_csv += jQuery(document).data('raw_full_data_csv['+i+']');
				}
				var full_data_csv = init_csv+''+raw_full_data_csv;
				var export_full_data_csv = encodeURI(full_data_csv);
				jQuery('#export_full_data_csv').attr('href',export_full_data_csv);
			}, 3000);

			// var raw_full_detail_csv = jQuery(this).parent().find('#raw_full_detail_csv').text();
			// var full_detail_csv = init_csv+''+raw_full_detail_csv;
			// var export_full_detail_csv = encodeURI(full_detail_csv);
			// jQuery('#export_full_detail_csv').attr('href',export_full_detail_csv);
		}
		// init
		import_csv_set();
		jQuery('#export_csv,.sk-fading-circle').hide();
		jQuery('#generate_csv').on('click',function (e) {
			var config_multiple_import = true;
			if (config_multiple_import) {
				var feed_url = jQuery(this).parent().find('#import_data_csv').val();
				feed_url = feed_url.split(',');
				feed_url.forEach(function(infoUrl, index){
					export_csv_set(infoUrl,config_multiple_import,index);
				});
				pre_export(feed_url.length);
				jQuery('#list_full_detail_csv').hide();
			}else{
				var feed_url = import_input_url();
				export_csv_set(feed_url,config_multiple_import,0);
			}
		});
});